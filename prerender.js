/**
 * prerender.js — Static Site Generation script
 *
 * This script:
 *   1. Builds the client bundle (vite build)
 *   2. Builds the server bundle (vite build --ssr)
 *   3. Loads the server bundle and renders every route to static HTML
 *   4. Writes each rendered page as a physical .html file in dist/
 *
 * Run as: node prerender.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execSync } from 'node:child_process';
import { fetchGitHubStats } from './scripts/fetch-github-stats.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── 1. Discover all routes ──────────────────────────────────────────

function getPostSlugs() {
  const postsDir = path.resolve(__dirname, 'src/posts');
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
}

function getProjectSlugs() {
  const projectsDir = path.resolve(__dirname, 'src/projects');
  if (!fs.existsSync(projectsDir)) return [];
  return fs.readdirSync(projectsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
}

function getAllRoutes() {
  const staticRoutes = [
    '/',
    '/blog',
    '/en/blog',
    '/si/blog',
    '/projects',
    '/dashboard',
    '/about',
    '/contact',
  ];

  const postSlugs = getPostSlugs();

  // Each post gets both the legacy /blog/:slug path and its locale-specific path
  const blogRoutes = postSlugs.map((slug) => `/blog/${slug}`);
  const enBlogRoutes = postSlugs
    .filter((slug) => {
      // Read the lang field from frontmatter to determine locale
      const filePath = path.resolve(__dirname, 'src/posts', `${slug}.md`);
      if (!fs.existsSync(filePath)) return false;
      const raw = fs.readFileSync(filePath, 'utf-8');
      const langMatch = raw.match(/^lang:\s*"?(\w+)"?/m);
      const lang = langMatch ? langMatch[1] : 'en';
      return lang !== 'si';
    })
    .map((slug) => `/en/blog/${slug}`);
  const siBlogRoutes = postSlugs
    .filter((slug) => {
      const filePath = path.resolve(__dirname, 'src/posts', `${slug}.md`);
      if (!fs.existsSync(filePath)) return false;
      const raw = fs.readFileSync(filePath, 'utf-8');
      const langMatch = raw.match(/^lang:\s*"?(\w+)"?/m);
      return langMatch ? langMatch[1] === 'si' : false;
    })
    .map((slug) => `/si/blog/${slug}`);

  const projectRoutes = getProjectSlugs().map((slug) => `/projects/${slug}`);

  return [...staticRoutes, ...blogRoutes, ...enBlogRoutes, ...siBlogRoutes, ...projectRoutes];
}

// ── 2. Build client + server bundles ────────────────────────────────

console.log('\n🔨 Building client bundle...');
execSync('npx vite build', { stdio: 'inherit', cwd: __dirname });

console.log('\n🔨 Building server bundle...');
execSync('npx vite build --ssr src/entry-server.jsx --outDir dist/server', {
  stdio: 'inherit',
  cwd: __dirname,
});

// ── 3. Pre-fetch GitHub stats into dist/ (must run AFTER client build) ──
await fetchGitHubStats({
  distDir: path.resolve(__dirname, 'dist'),
  token: process.env.VITE_GITHUB_TOKEN,
});

// ── 3. Pre-render every route ───────────────────────────────────────

async function prerender() {
  const distDir = path.resolve(__dirname, 'dist');
  const template = fs.readFileSync(path.resolve(distDir, 'index.html'), 'utf-8');

  // Import the server bundle (use file:// URL for Windows compatibility)
  const serverEntryPath = path.resolve(distDir, 'server/entry-server.js');
  const { render } = await import(
    pathToFileURL(serverEntryPath).href
  );

  const routes = getAllRoutes();
  console.log(`\n🖨️  Pre-rendering ${routes.length} routes...\n`);

  for (const route of routes) {
    try {
      const { html: appHtml } = render(route);

      // ── React 19 native head hoisting ──
      // React 19's renderToString inlines <title>, <meta>, and <link> tags
      // at the start of the rendered output. We extract them from the body,
      // remove them from the inline position, and inject them into <head>.

      // Extract SEO tags that React 19 inlined in the rendered HTML
      const inlineTitle = appHtml.match(/<title>[^<]*<\/title>/)?.[0] || '';
      const inlineMetas = appHtml.match(/<meta\s[^>]*(?:name|property)=["'][^"']*["'][^>]*\/?>/g) || [];
      const inlineCanonical = appHtml.match(/<link\s[^>]*rel=["']canonical["'][^>]*\/?>/g) || [];

      // Remove the extracted SEO tags from the body content
      let cleanAppHtml = appHtml;
      if (inlineTitle) {
        cleanAppHtml = cleanAppHtml.replace(inlineTitle, '');
      }
      for (const meta of inlineMetas) {
        cleanAppHtml = cleanAppHtml.replace(meta, '');
      }
      for (const link of inlineCanonical) {
        cleanAppHtml = cleanAppHtml.replace(link, '');
      }

      let finalHtml = template;

      // Inject pre-rendered content into #root
      finalHtml = finalHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${cleanAppHtml}</div>`
      );

      // Replace the default <title> with the page-specific one
      if (inlineTitle) {
        finalHtml = finalHtml.replace(
          /<title>[^<]*<\/title>/,
          inlineTitle
        );
      }

      // Remove the template's default meta tags that will be replaced
      const defaultMetaPatterns = [
        /\s*<meta\s+name="description"[^>]*\/?>\s*/gi,
        /\s*<meta\s+property="og:[^"]*"[^>]*\/?>\s*/gi,
      ];
      for (const pattern of defaultMetaPatterns) {
        finalHtml = finalHtml.replace(pattern, '\n    ');
      }

      // Build the SEO head block from extracted tags
      const seoHeadTags = [...inlineMetas, ...inlineCanonical]
        .map(tag => `    ${tag}`)
        .join('\n');

      // Inject extracted SEO tags into <head> before </head>
      if (seoHeadTags) {
        finalHtml = finalHtml.replace('</head>', `${seoHeadTags}\n  </head>`);
      }

      // Determine the output file path
      const routePath = route === '/' ? '/index' : route;
      const filePath = path.resolve(distDir, `${routePath.slice(1)}.html`);
      const dirPath = path.dirname(filePath);

      // Also write as directory/index.html for clean URLs
      const indexPath = route === '/'
        ? path.resolve(distDir, 'index.html')
        : path.resolve(distDir, `${route.slice(1)}/index.html`);
      const indexDir = path.dirname(indexPath);

      // Write the main file (e.g., /blog.html)
      fs.mkdirSync(dirPath, { recursive: true });
      fs.writeFileSync(filePath, finalHtml);

      // Write the index.html variant (e.g., /blog/index.html)
      if (indexPath !== filePath) {
        fs.mkdirSync(indexDir, { recursive: true });
        fs.writeFileSync(indexPath, finalHtml);
      }

      console.log(`  ✅ ${route}`);
    } catch (err) {
      console.error(`  ❌ ${route} — ${err.message}`);
    }
  }

  // Clean up server bundle (not needed for deployment)
  fs.rmSync(path.resolve(distDir, 'server'), { recursive: true, force: true });

  console.log('\n🎉 SSG complete! All routes pre-rendered to dist/\n');
}

prerender().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
