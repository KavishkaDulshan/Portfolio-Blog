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
    '/projects',
    '/dashboard',
    '/about',
    '/contact',
  ];

  const blogRoutes = getPostSlugs().map(slug => `/blog/${slug}`);
  const projectRoutes = getProjectSlugs().map(slug => `/projects/${slug}`);

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
      const { html: appHtml, helmet } = render(route);

      // Build the <head> injection string from Helmet
      const helmetHead = [
        helmet?.title?.toString() || '',
        helmet?.meta?.toString() || '',
        helmet?.link?.toString() || '',
      ]
        .filter(Boolean)
        .join('\n    ');

      let finalHtml = template;

      // Replace the placeholder in <div id="root"></div> with pre-rendered content
      finalHtml = finalHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div>`
      );

      // Inject Helmet-generated tags into <head>
      // We inject right before </head> to avoid replacing existing static tags
      if (helmetHead) {
        finalHtml = finalHtml.replace('</head>', `    ${helmetHead}\n  </head>`);
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
