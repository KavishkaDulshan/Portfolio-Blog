import matter from 'front-matter';

const rawFiles = import.meta.glob('/src/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function getAllPosts() {
  return Object.entries(rawFiles)
    .map(([filepath, raw]) => {
      const { attributes, body } = matter(raw);
      const slug = filepath.split('/').pop().replace('.md', '');
      return { slug, ...attributes, body };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

/** Returns only English posts (lang: "en" or no lang field set). */
export function getEnPosts() {
  return getAllPosts().filter((p) => !p.lang || p.lang === 'en');
}

/** Returns only Sinhala posts (lang: "si"). */
export function getSiPosts() {
  return getAllPosts().filter((p) => p.lang === 'si');
}
