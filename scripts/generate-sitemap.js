/**
 * generate-sitemap.js — Dynamic sitemap generator
 *
 * Scans src/posts/ and src/projects/ for Markdown files and generates
 * a complete sitemap.xml with all static + dynamic routes.
 *
 * SEO improvements:
 *   - Blog posts with a `translation` frontmatter field get xhtml:link
 *     alternate entries linking them to their translated counterparts.
 *     This tells Google the pages are translation pairs and prevents
 *     duplicate-content penalties while maximising multi-language crawl coverage.
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

/**
 * Parse frontmatter key=value from a Markdown file.
 * Returns a plain object with all matched frontmatter fields.
 */
function parseFrontmatter(dir, slug) {
  const filepath = path.resolve(ROOT, dir, `${slug}.md`);
  const raw = fs.readFileSync(filepath, 'utf-8');

  const dateMatch = raw.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m);
  const langMatch = raw.match(/^lang:\s*["']?(\w+)["']?/m);
  const translationMatch = raw.match(/^translation:\s*["']?([^\s"']+)["']?/m);

  return {
    date: dateMatch ? dateMatch[1] : TODAY,
    lang: langMatch ? langMatch[1] : 'en',
    translation: translationMatch ? translationMatch[1] : null,
  };
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
    alternates: null,
  });
}

// Blog posts — canonical /blog/:slug path + hreflang alternates for translations
const postSlugs = getMdSlugs('src/posts');

// Build a map of slug → frontmatter so we can cross-reference translations
const postMeta = {};
for (const slug of postSlugs) {
  postMeta[slug] = parseFrontmatter('src/posts', slug);
}

for (const slug of postSlugs) {
  const { date, lang, translation } = postMeta[slug];

  // Build hreflang alternate list if this post has a translation pair
  let alternates = null;
  if (translation && postMeta[translation]) {
    const siblingLang = postMeta[translation].lang;
    // The x-default points to the English version (or this post if it's already EN)
    const defaultSlug = lang === 'en' ? slug : translation;
    alternates = [
      { lang, href: `${SITE_URL}/blog/${slug}` },
      { lang: siblingLang, href: `${SITE_URL}/blog/${translation}` },
      { lang: 'x-default', href: `${SITE_URL}/blog/${defaultSlug}` },
    ];
  }

  entries.push({
    loc: `${SITE_URL}/blog/${slug}`,
    lastmod: date,
    changefreq: 'monthly',
    priority: '0.8',
    alternates,
  });
}

// Project posts
const projectSlugs = getMdSlugs('src/projects');
for (const slug of projectSlugs) {
  const { date } = parseFrontmatter('src/projects', slug);
  entries.push({
    loc: `${SITE_URL}/projects/${slug}`,
    lastmod: date,
    changefreq: 'monthly',
    priority: '0.8',
    alternates: null,
  });
}

// ── Generate XML ────────────────────────────────────────────────────

// Determine if any entry requires xhtml:link alternates so we can add the
// xmlns:xhtml namespace only when needed (keeps the file clean otherwise).
const hasAlternates = entries.some(e => e.alternates);

const xmlHeader = hasAlternates
  ? `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`
  : `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

const xmlBody = entries
  .map((e) => {
    const alternateTags = e.alternates
      ? e.alternates
          .map(a => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}"/>`)
          .join('\n')
      : '';

    return `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>${alternateTags ? '\n' + alternateTags : ''}
  </url>`;
  })
  .join('\n');

const xml = `${xmlHeader}
${xmlBody}
</urlset>
`;

// ── Write to public/sitemap.xml ─────────────────────────────────────

const outputPath = path.resolve(ROOT, 'public/sitemap.xml');
fs.writeFileSync(outputPath, xml);

console.log(`✅ Sitemap generated: ${outputPath}`);
console.log(`   ${entries.length} URLs (${staticPages.length} static + ${postSlugs.length} blog posts + ${projectSlugs.length} projects)`);
const pairsCount = entries.filter(e => e.alternates).length;
if (pairsCount > 0) {
  console.log(`   ${pairsCount} post(s) with hreflang alternate translations`);
}
