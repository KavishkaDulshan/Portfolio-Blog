/**
 * prerender.js — Static Site Generation script
 *
 * This script:
 *   1. Builds the client bundle (vite build)
 *   2. Builds the server bundle (vite build --ssr)
 *   3. Loads the server bundle and renders every route to static HTML
 *   4. Writes each rendered page as a physical .html file in dist/
 *
 * SEO improvements:
 *   - Only canonical /blog/:slug paths are pre-rendered per post (no duplicate
 *     /en/blog/:slug or /si/blog/:slug HTML files). This fixes the GSC
 *     "Duplicate without user-selected canonical" warning.
 *   - JSON-LD <script> blocks are hoisted from the SSR body into <head> so
 *     crawlers receive structured data without JavaScript execution.
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

  // Each post gets ONLY the canonical /blog/:slug path.
  // /en/blog/:slug and /si/blog/:slug are NOT pre-rendered as individual post
  // pages — BlogCard.jsx links to /blog/:slug exclusively, so no duplicate
  // files are created and GSC canonical warnings are eliminated.
  const blogRoutes = getPostSlugs().map((slug) => `/blog/${slug}`);
  const projectRoutes = getProjectSlugs().map((slug) => `/projects/${slug}`);

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
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

// ── 4. Pre-render every route ───────────────────────────────────────

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

      // Extract <title>
      const inlineTitle = appHtml.match(/<title>[^<]*<\/title>/)?.[0] || '';

      // Extract all <meta> tags with name or property attributes
      const inlineMetas = appHtml.match(/<meta\s[^>]*(?:name|property)=["'][^"']*["'][^>]*\/?>/)
        ? appHtml.match(/<meta\s[^>]*(?:name|property)=["'][^"']*["'][^>]*\/?>/g) || []
        : [];

      // Extract canonical <link> tags
      const inlineCanonical = appHtml.match(/<link\s[^>]*rel=["']canonical["'][^>]*\/?>/)
        ? appHtml.match(/<link\s[^>]*rel=["']canonical["'][^>]*\/?>/g) || []
        : [];

      // Extract hreflang alternate <link> tags (for i18n translation pairs)
      const inlineHreflang = appHtml.match(/<link\s[^>]*rel=["']alternate["'][^>]*\/?>/)
        ? appHtml.match(/<link\s[^>]*rel=["']alternate["'][^>]*\/?>/g) || []
        : [];

      // ── JSON-LD hoisting ──
      // Extract <script type="application/ld+json">...</script> blocks that
      // pages inject via the SEO component's jsonLd prop. Google reads these
      // directly from <head>; hoisting them avoids requiring JS execution.
      const inlineJsonLd = [];
      const jsonLdRegex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
      let jsonLdMatch;
      while ((jsonLdMatch = jsonLdRegex.exec(appHtml)) !== null) {
        inlineJsonLd.push(jsonLdMatch[0]);
      }

      // Remove all extracted SEO tags from the body content
      let cleanAppHtml = appHtml;

      if (inlineTitle) {
        cleanAppHtml = cleanAppHtml.replace(inlineTitle, '');
      }
      for (const meta of inlineMetas) {
        cleanAppHtml = cleanAppHtml.replace(meta, '');
      }
      for (const link of [...inlineCanonical, ...inlineHreflang]) {
        cleanAppHtml = cleanAppHtml.replace(link, '');
      }
      for (const jsonLd of inlineJsonLd) {
        cleanAppHtml = cleanAppHtml.replace(jsonLd, '');
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
        /\s*<meta\s+name="description"[^>]*\/?\>\s*/gi,
        /\s*<meta\s+property="og:[^"]*"[^>]*\/?\>\s*/gi,
      ];
      for (const pattern of defaultMetaPatterns) {
        finalHtml = finalHtml.replace(pattern, '\n    ');
      }

      // Build the complete SEO head block from all extracted tags
      const seoHeadTags = [
        ...inlineMetas,
        ...inlineCanonical,
        ...inlineHreflang,
        ...inlineJsonLd,
      ]
        .map(tag => `    ${tag}`)
        .join('\n');

      // Inject all SEO tags into <head> before </head>
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
