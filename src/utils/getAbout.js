import matter from 'front-matter';
import rawAbout from '/src/about/about.md?raw';

export function getAboutData() {
  const { attributes, body } = matter(rawAbout);
  return { ...attributes, body };
}
