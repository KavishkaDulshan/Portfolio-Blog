# Content Guide

How to add blog posts and projects to the portfolio. No code changes needed — just write a Markdown file and drop it in the right folder.

---

## Adding a Blog Post

### 1. Create the file

Create a new `.md` file in `src/posts/`:

```
src/posts/your-post-title.md
```

The filename becomes the URL slug:
- `src/posts/my-first-post.md` → `/blog/my-first-post`
- `src/posts/understanding-react-hooks.md` → `/blog/understanding-react-hooks`

**Naming rules:**
- Lowercase only
- Use hyphens, not spaces or underscores
- Keep it short and descriptive

### 2. Write the frontmatter

Every post must start with a YAML block between `---` delimiters:

```yaml
---
title: "Your Post Title"
date: "2025-03-15"
excerpt: "A one or two sentence description shown on cards and in previews."
tags: ["tag-one", "tag-two", "tag-three"]
coverImage: "/images/blog/your-image.jpg"
---
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Displayed as the post heading |
| `date` | Yes | ISO format `YYYY-MM-DD`. Used for sorting (newest first) |
| `excerpt` | Yes | Short description shown on the Blog list and Home page cards |
| `tags` | No | Array of tag strings. Displayed on cards and post pages |
| `coverImage` | No | Path to a cover image. Must be in `public/` (see Images below) |

### 3. Write the body

After the closing `---`, write your post in standard Markdown:

```markdown
---
title: "My Post"
date: "2025-03-15"
excerpt: "A short description."
tags: ["react"]
---

## Introduction

Your post body starts here. All standard Markdown is supported.
```

### 4. Restart the dev server

After adding a new file, Vite needs to re-scan the glob. Stop and restart `npm run dev`. In production builds, just rebuild.

---

## Adding a Project

### 1. Create the file

Create a `.md` file in `src/projects/`:

```
src/projects/your-project-name.md
```

### 2. Write the frontmatter

```yaml
---
title: "Project Name"
date: "2025-02-20"
excerpt: "What the project does in one or two sentences."
tags: ["react", "node.js", "postgresql"]
github: "https://github.com/yourusername/repo-name"
demo: "https://your-demo-url.com"
coverImage: "/images/projects/cover.jpg"
---
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Project name |
| `date` | Yes | When you built/published it. Used for sorting |
| `excerpt` | Yes | Short description for cards |
| `tags` | No | Tech stack tags |
| `github` | No | GitHub repo URL. Shows a "View on GitHub" button |
| `demo` | No | Live demo URL. Shows a "Live demo" button |
| `coverImage` | No | Cover image path |

### 3. Write the body

Describe the project in detail — what it does, why you built it, the tech decisions, what you learned:

```markdown
---
title: "My Project"
date: "2025-02-20"
excerpt: "Short description."
tags: ["react", "node.js"]
github: "https://github.com/you/repo"
---

## Overview

What this project is and why it exists.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |

## What I learned

Key insights from building this...
```

---

## Adding Images

### Where to put them

All images go in the `public/` folder. Recommended structure:

```
public/
├── images/
│   ├── blog/
│   │   └── my-post-cover.jpg
│   └── projects/
│       └── my-project-cover.jpg
```

### How to reference them

In frontmatter (cover image shown on the card and at the top of the full post):
```yaml
coverImage: "/images/blog/my-post-cover.jpg"
```

In post body — **without caption:**
```markdown
![Alt text describing the image for accessibility](/images/blog/some-image.png)
```

In post body — **with a visible caption** (text in quotes renders as italic caption below image):
```markdown
![Alt text](/images/blog/diagram.png "This caption appears below the image")
```

The caption is the third part of the image syntax — the text in double quotes. Keep it short (one sentence). It renders as an italic line centred below the image.

### Image tips

- Use `.jpg` for photos, `.png` for screenshots/diagrams
- Recommended cover image size: **1200×630 px** (standard OG image ratio)
- Keep individual images under 500 KB for fast load times
- Always write meaningful `alt` text for accessibility — screen readers use it
- The `alt` and the caption serve different purposes: `alt` is for accessibility, the caption is for sighted readers wanting context

---

## Supported Markdown Features

The blog uses `react-markdown` with `remark-gfm`, which supports all standard GitHub Flavored Markdown:

### Headings
```markdown
## H2 heading
### H3 heading
#### H4 heading
```

### Code blocks (with syntax highlighting)

Specify the language after the opening triple backtick:

````markdown
```javascript
const greet = (name) => `Hello, ${name}!`;
```
````

Supported languages include: `javascript`, `typescript`, `jsx`, `tsx`, `python`, `bash`, `css`, `html`, `json`, `sql`, `go`, `rust`, and many more.

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
```

### Task lists

```markdown
- [x] Completed item
- [ ] Pending item
```

### Blockquotes

```markdown
> This is a blockquote. Use it for important callouts or quotes.
```

### Inline code

```markdown
Use `backticks` for inline code.
```

### Bold and italic

```markdown
**bold text**
*italic text*
***bold and italic***
```

### Strikethrough

```markdown
~~crossed out~~
```

---

## Deployment

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Create `public/_redirects` with:
   ```
   /* /index.html 200
   ```
   This is required because the site uses client-side routing — without it, direct links to `/blog/my-post` will return 404.

### Vercel

Vercel handles SPA routing automatically. Just connect your repository and deploy. No extra config needed.

### GitHub Pages

GitHub Pages doesn't support `BrowserRouter`-style routing without a workaround. Either use the `404.html` redirect trick or switch to `HashRouter` in `src/App.jsx` (URLs will include `#` but work without server config).

---

## File Structure Reference

```
src/
├── posts/              ← BLOG POSTS go here (.md files)
├── projects/           ← PROJECT WRITEUPS go here (.md files)
├── about/
│   └── about.md        ← ABOUT PAGE content (edit this file)
├── pages/
│   ├── Home.jsx        ← Homepage (auto-pulls latest posts + projects)
│   ├── Blog.jsx        ← Blog list page
│   ├── BlogPost.jsx    ← Single blog post renderer
│   ├── Projects.jsx    ← Projects list page
│   ├── ProjectPost.jsx ← Single project renderer
│   ├── About.jsx       ← Loads content from src/about/about.md
│   └── Contact.jsx     ← Contact page (edit directly)
├── components/
│   ├── NavBar.jsx
│   ├── Footer.jsx
│   ├── Layout.jsx
│   ├── BlogCard.jsx
│   └── ProjectCard.jsx
└── utils/
    ├── getPosts.js     ← reads src/posts/*.md
    ├── getProjects.js  ← reads src/projects/*.md
    └── getAbout.js     ← reads src/about/about.md

public/
└── images/
    ├── blog/           ← blog post images
    └── projects/       ← project images
```

---

## Editing the About Page

All About page content is managed from a single Markdown file — no code changes needed.

**File:** `src/about/about.md`

### Structure

```yaml
---
name: "Your Full Name"
tagline: "Your title or role"

education:
  - degree: "Degree name"
    institution: "University"
    period: "2022 – Present"
    description: "Optional one-line description"    # optional

skills:
  - category: "Category label"
    items: ["Skill A", "Skill B", "Skill C"]

certificates:
  - title: "Certificate title"
    issuer: "Issuing organisation"
    date: "2024"
    url: "https://link-to-verify"    # optional — shows a "View ↗" link

currently:
  - "One thing you're currently doing"
  - "Another thing"
---

Your bio here as plain markdown. **Bold** and *italic* work.
Multiple paragraphs are supported.
```

### Adding a new education entry

```yaml
education:
  - degree: "Bachelor of Science in Software Engineering"
    institution: "University of Moratuwa"
    period: "2022 – Present"
    description: "Core CS fundamentals, software architecture, and modern development."
  - degree: "A/L — Mathematics Stream"      # ← add new entries here
    institution: "School Name"
    period: "Completed 2021"
```

### Adding a new skill category

```yaml
skills:
  - category: "Languages"
    items: ["JavaScript", "Python"]
  - category: "Databases"                   # ← new category
    items: ["PostgreSQL", "MySQL", "Redis"]
```

### Adding a certificate

```yaml
certificates:
  - title: "AWS Cloud Practitioner"
    issuer: "Amazon Web Services"
    date: "2024"
    url: "https://aws.amazon.com/verification/your-cert-id"
```

Omit `url` if you don't have a public verification link.

### Removing a section

To hide a section entirely, either delete all its entries or set it to an empty list:

```yaml
certificates: []    # hides the Certificates section
currently: []       # hides the Currently section
```

---

## Updating Personal Information

| What to change | Where |
|----------------|-------|
| Name, bio, education, skills, certificates | `src/about/about.md` |
| Email, social links | `src/pages/Contact.jsx` and `src/components/Footer.jsx` |
| Site title | `index.html` `<title>` tag |
| Logo text | `src/components/NavBar.jsx` |
