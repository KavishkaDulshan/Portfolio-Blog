# Personal Portfolio & Blog

## Overview

This is the repository for my personal portfolio and blog. I built it as a way to learn Vite, practice Tailwind CSS v4, and have a place to write publicly.

The design goal was simple: maximum readability, minimum noise. Black and white. Good typography. Fast load times.

## How it works

There's no backend, no CMS, no database. Content is stored as Markdown files:
src/
├── posts/          ← blog posts as .md files
└── projects/       ← project writeups as .md files

Vite's `import.meta.glob` picks up all `.md` files at build time:

```js
const rawFiles = import.meta.glob('/src/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
```
Each file has YAML frontmatter (title, date, tags, etc.) parsed by front-matter, and the body is rendered by react-markdown with GFM support and syntax highlighting.

Tech stack
Layer,Technology
Framework,React 19 + Vite 8
Routing,React Router v7
Styling,Tailwind CSS v4
Markdown,react-markdown + remark-gfm
Syntax highlighting,rehype-highlight + highlight.js
Fonts,Plus Jakarta Sans + Lora (Google Fonts)
