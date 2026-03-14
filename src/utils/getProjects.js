import matter from 'front-matter';

const rawFiles = import.meta.glob('/src/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function getAllProjects() {
  return Object.entries(rawFiles)
    .map(([filepath, raw]) => {
      const { attributes, body } = matter(raw);
      const slug = filepath.split('/').pop().replace('.md', '');
      return { slug, ...attributes, body };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getProjectBySlug(slug) {
  return getAllProjects().find((p) => p.slug === slug) ?? null;
}
