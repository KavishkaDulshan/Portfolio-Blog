---
title: "Personal Portfolio & Blog"
date: "2025-03-14"
excerpt: "A blog-first personal portfolio built with React, Vite, and Tailwind CSS v4. Blog posts and projects are written as Markdown files — no backend required."
tags: ["react", "vite", "tailwind", "markdown"]
github: "https://github.com/kavishkadulshan/portfolio"
coverImage: "/images/projects/Gallery/portfolio/1.webp"
# demo: "https://yourapp.netlify.app"          — shows "Live demo" button
# demoVideo: "https://drive.google.com/..."    — shows "Watch demo video" button (opens in new tab)
# inlineVideo: "https://www.youtube.com/embed/VIDEOID"  — embeds a player on the page
# inlineVideo: "/videos/demo.mp4"              — OR a local .mp4 file in public/videos/
---
## Overview

This is the portfolio you're currently reading. I built it as a way to learn Vite, practice Tailwind CSS v4, and have a place to write publicly.

The design goal was simple: maximum readability, minimum noise. Black and white. Good typography. Fast load times.

## How it works

There's no backend, no CMS, no database. Content is stored as Markdown files:

```
src/
├── posts/          ← blog posts as .md files
└── projects/       ← project writeups as .md files
```

Vite's `import.meta.glob` picks up all `.md` files at build time:

```js
const rawFiles = import.meta.glob('/src/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
```

Each file has YAML frontmatter (title, date, tags, etc.) parsed by `front-matter`, and the body is rendered by `react-markdown` with GFM support and syntax highlighting.

## Tech stack


| Layer               | Technology                              |
| ------------------- | --------------------------------------- |
| Framework           | React 19 + Vite 8                       |
| Routing             | React Router v7                         |
| Styling             | Tailwind CSS v4                         |
| Markdown            | react-markdown + remark-gfm             |
| Syntax highlighting | rehype-highlight + highlight.js         |
| Fonts               | Plus Jakarta Sans + Lora (Google Fonts) |

## Design decisions

**Why no backend?** Zero friction. To publish a post, I write a Markdown file and push to GitHub. The site is statically deployable to Netlify or GitHub Pages.

**Why serif for body text?** Blog posts are meant to be read at length. Studies consistently show that serif typefaces improve readability for long-form content. Lora is well-optimised for screens.

**Why black and white?** Color is a distraction when you're trying to read. The constraint forces hierarchy to come from typography and spacing, not color accents.

## Future plans

- [ ]  RSS feed generation
- [ ]  Open Graph images for social sharing
- [ ]  Reading time estimate on blog posts
- [ ]  Tag filtering on blog list page
