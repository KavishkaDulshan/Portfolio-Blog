/**
 * generate-sitemap.js — Dynamic sitemap generator
 *
 * Scans src/posts/ and src/projects/ for Markdown files and generates
 * a complete sitemap.xml with all static + dynamic routes.
 *
 * Run as: node scripts/generate-sitemap.js
 * Automatically runs as a prebuild step via package.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SITE_URL = 'https://kavishkadulshan.dev';
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// ── Discover routes ─────────────────────────────────────────────────

function getMdSlugs(dir) {
  const fullDir = path.resolve(ROOT, dir);
  if (!fs.existsSync(fullDir)) return [];
  return fs.readdirSync(fullDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
}

function parseFrontmatterDate(dir, slug) {
  const filepath = path.resolve(ROOT, dir, `${slug}.md`);
  const raw = fs.readFileSync(filepath, 'utf-8');
  const dateMatch = raw.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m);
  return dateMatch ? dateMatch[1] : TODAY;
}

// ── Build sitemap entries ───────────────────────────────────────────

const entries = [];

// Static pages
const staticPages = [
  { path: '/',          priority: '1.0',  changefreq: 'weekly' },
  { path: '/blog',      priority: '0.9',  changefreq: 'weekly' },
  { path: '/projects',  priority: '0.9',  changefreq: 'monthly' },
  { path: '/dashboard', priority: '0.6',  changefreq: 'daily' },
  { path: '/about',     priority: '0.8',  changefreq: 'monthly' },
  { path: '/contact',   priority: '0.7',  changefreq: 'yearly' },
];

for (const page of staticPages) {
  entries.push({
    loc: `${SITE_URL}${page.path}`,
    lastmod: TODAY,
    changefreq: page.changefreq,
    priority: page.priority,
  });
}

// Blog posts
const postSlugs = getMdSlugs('src/posts');
for (const slug of postSlugs) {
  const date = parseFrontmatterDate('src/posts', slug);
  entries.push({
    loc: `${SITE_URL}/blog/${slug}`,
    lastmod: date,
    changefreq: 'monthly',
    priority: '0.8',
  });
}

// Project posts
const projectSlugs = getMdSlugs('src/projects');
for (const slug of projectSlugs) {
  const date = parseFrontmatterDate('src/projects', slug);
  entries.push({
    loc: `${SITE_URL}/projects/${slug}`,
    lastmod: date,
    changefreq: 'monthly',
    priority: '0.8',
  });
}

// ── Generate XML ────────────────────────────────────────────────────

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

// ── Write to public/sitemap.xml ─────────────────────────────────────

const outputPath = path.resolve(ROOT, 'public/sitemap.xml');
fs.writeFileSync(outputPath, xml);

console.log(`✅ Sitemap generated: ${outputPath}`);
console.log(`   ${entries.length} URLs (${staticPages.length} static + ${postSlugs.length} blog posts + ${projectSlugs.length} projects)`);
