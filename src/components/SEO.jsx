import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://kavishkadulshan.dev';
const SITE_NAME = 'Kavishka Dulshan';
const DEFAULT_DESCRIPTION =
  'Portfolio and blog of Kavishka Dulshan, a Software Engineering undergraduate specializing in full-stack development and IoT.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/image.webp`;

/**
 * Reusable SEO component that injects page-specific `<head>` metadata.
 *
 * @param {Object}   props
 * @param {string}   props.title         - Page title (appended with " — Kavishka Dulshan")
 * @param {string}   [props.description] - Meta description
 * @param {string}   [props.path]        - Canonical path, e.g. "/blog" (defaults to "/")
 * @param {string}   [props.ogImage]     - Open Graph image URL (absolute or relative to public)
 * @param {string}   [props.ogType]      - Open Graph type, defaults to "website"
 * @param {boolean}  [props.noSuffix]    - If true, don't append the site name suffix to the title
 * @param {string}   [props.article]     - If set, includes article:published_time
 * @param {Array}    [props.hreflang]    - Array of { lang: string, href: string } for i18n alternates
 *                                         e.g. [{ lang: 'en', href: '...' }, { lang: 'si', href: '...' }]
 * @param {Object}   [props.jsonLd]      - JSON-LD structured data object (rendered as
 *                                         <script type="application/ld+json"> and hoisted
 *                                         into <head> by prerender.js at build time)
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  ogImage,
  ogType = 'website',
  noSuffix = false,
  article,
  hreflang,
  jsonLd,
}) {
  const fullTitle = noSuffix ? title : `${title} — ${SITE_NAME}`;

  const canonicalUrl = `${SITE_URL}${path}`;

  // Resolve OG image to absolute URL
  const resolvedOgImage = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${SITE_URL}${ogImage}`
    : DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* i18n hreflang alternate links — prevents duplicate-content penalties */}
      {hreflang && hreflang.map(({ lang, href }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />

      {/* Article metadata (for blog posts) */}
      {article && (
        <meta property="article:published_time" content={article} />
      )}

      {/* JSON-LD structured data — supports a single schema object or an array of schemas.
         Each schema is emitted as its own <script> block (Google's recommended pattern). */}
      {jsonLd && (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE };
