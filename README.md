# Personal Portfolio & Blog

## Overview

This repository contains my personal portfolio and blog. I built it to:

- learn **Vite**
- practice **Tailwind CSS v4**
- have a place to write publicly

**Design goal:** maximum readability, minimum noise — black & white, good typography, fast load times.

---

## How it works

There’s no backend, no CMS, and no database. Content is stored as Markdown files:

```
src/
├── posts/      ← blog posts as .md files
└── projects/   ← project writeups as .md files
```

Vite’s `import.meta.glob` picks up all `.md` files at build time:

```js
const rawFiles = import.meta.glob('/src/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
```

Each file includes **YAML frontmatter** (title, date, tags, etc.) parsed by `front-matter`, and the body is rendered using `react-markdown` with:

- GFM support (`remark-gfm`)
- syntax highlighting (`rehype-highlight` + `highlight.js`)

---

## Tech stack


| Layer               | Technology                              |
| ------------------- | --------------------------------------- |
| Framework           | React 19 + Vite 8                       |
| Routing             | React Router v7                         |
| Styling             | Tailwind CSS v4                         |
| Markdown            | react-markdown + remark-gfm             |
| Syntax highlighting | rehype-highlight + highlight.js         |
| Fonts               | Plus Jakarta Sans + Lora (Google Fonts) |

---

## Design decisions

### Why no backend?

Zero friction. To publish a post, I write a Markdown file and push to GitHub.
The site is statically deployable to Netlify or GitHub Pages.

### Why serif for body text?

Blog posts are meant to be read at length. Serif typefaces tend to improve readability for long-form content.
Lora is well-optimised for screens.

### Why black and white?

Color is a distraction when you're trying to read. The constraint forces hierarchy to come from typography and spacing, not color accents.

---

```
npm run compress-images
```

npm run compressimages

## Future plans

- [ ]  RSS feed generation
- [ ]  Open Graph images for social sharing
- [ ]  Reading time estimate on blog posts
- [ ]  Tag filtering on blog list page
- [ ]  Add Highlights
- [ ]  Add likes and comments to posts
- [ ]  Have to fix Developer state.
