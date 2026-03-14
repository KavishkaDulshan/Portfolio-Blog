# Testing Guide

How to verify that every feature of the portfolio is working correctly. Run `npm run dev` from the `Portfolio/` folder and open `http://localhost:5173` before starting.

---

## 1. Readability and Color Contrast

Open each page and confirm that no text is too faint to read.

### What was fixed

| Location | Before | After |
|----------|--------|-------|
| Home — role label | `text-gray-400` (barely visible) | `text-gray-600` |
| Home — section links ("All posts →") | `text-gray-400` | `text-gray-500` |
| Blog / Projects — empty state message | `text-gray-400` | `text-gray-600` |
| BlogPost / ProjectPost — back nav, date, tags | `text-gray-400` | `text-gray-600` |
| BlogPost / ProjectPost — body paragraphs | `text-gray-700` | `text-gray-800` |
| BlogPost / ProjectPost — inline code text | no explicit color | `text-gray-800` on `bg-gray-100` |
| BlogPost / ProjectPost — code block | `bg-gray-50 border-gray-200` | `bg-gray-100 border-gray-300` |
| About — skill category labels | `text-gray-400` | `text-gray-600` |
| About — skill badge text | `text-gray-600` | `text-gray-700` |
| About — bullet dashes `—` | `text-gray-300` (almost invisible) | `text-gray-500` |
| About — dividers | `border-gray-100` | `border-gray-200` |
| Contact — dividers | `divide-gray-100` | `divide-gray-200` |
| Contact — section labels, footer note | `text-gray-400` | `text-gray-600` |

### How to test

1. Go to `/` — the "Software Engineering Undergraduate" label should be clearly readable
2. Go to `/blog/getting-started-with-react` and scroll to the inline code `UI = f(state)` — it should appear as **dark text on a light gray background**, not light gray on white
3. Go to `/about` — the skill category labels (LANGUAGES, FRONTEND etc.) and the `—` bullet dashes should be clearly visible
4. Go to `/contact` — all labels and the footer note should be easy to read

---

## 2. Cover Image Thumbnails on Cards

Blog and project cards now show a thumbnail image when `coverImage` is set in the frontmatter.

### Test files with coverImage

All 4 test files have a `coverImage` set (using picsum.photos placeholders):

- `src/posts/getting-started-with-react.md`
- `src/posts/understanding-tailwind-v4.md`
- `src/projects/portfolio-website.md`
- `src/projects/student-task-manager.md`

### How to test

1. Go to `/blog` — both cards should show a landscape thumbnail image at the top
2. Go to `/projects` — both project cards should show a thumbnail
3. Go to `/` — the "Latest writing" and "Featured projects" sections should show thumbnailed cards
4. Click through to any card — the cover image also appears as a large header image on the full post page

### What to expect without a coverImage

Remove `coverImage` from a frontmatter block, save, and refresh. The card should display cleanly without an image area — no broken image icons. The card layout adjusts automatically.

---

## 3. Inline Images in Blog Posts / Project Pages

You can embed images anywhere inside the markdown body.

### Syntax

**Without caption:**
```markdown
![Alt text describing the image for accessibility](/images/blog/my-diagram.png)
```

**With visible caption** (text in quotes becomes rendered caption below image):
```markdown
![Alt text](/images/blog/my-diagram.png "This text appears as a caption")
```

### Test the caption feature

The test post `getting-started-with-react.md` includes this line:

```markdown
![React's component tree visualised](/images/blog/react-tree.png "The component tree — every UI is a hierarchy of nested components")
```

1. Go to `/blog/getting-started-with-react`
2. Scroll to the image section
3. You will see a broken image (the file doesn't exist yet — that's expected) BUT the **italic caption text should appear below it**

That confirms the caption system is working. To see a real image, place a `react-tree.png` file in `public/images/blog/` and refresh.

### Testing with a real local image

1. Place any `.jpg` or `.png` in `public/images/blog/test-image.jpg`
2. Add to any post body:
   ```markdown
   ![Test image](/images/blog/test-image.jpg "My caption here")
   ```
3. Reload the post — image and caption should render

---

## 4. About Page via Markdown File

All About page content is now managed from `src/about/about.md`. No code changes needed.

### File location

```
src/about/about.md
```

### Structure of about.md

```yaml
---
name: "Your Name"
tagline: "Your title"

education:
  - degree: "Degree name"
    institution: "University"
    period: "2022 – Present"
    description: "Optional description"

skills:
  - category: "Category Name"
    items: ["Skill 1", "Skill 2"]

certificates:
  - title: "Certificate name"
    issuer: "Issuing body"
    date: "2024"
    url: "https://link-to-certificate"   # optional

currently:
  - "Item one"
  - "Item two"
---

Your bio as markdown here. **Bold** and *italic* work.
```

### How to test

**Add an education entry:**
1. Open `src/about/about.md`
2. Add a new entry under `education:`:
   ```yaml
   - degree: "A/L — Mathematics Stream"
     institution: "Test High School"
     period: "Completed 2021"
   ```
3. Save — Vite hot-reloads, go to `/about` and the new entry should appear

**Add a skill category:**
1. Add to the `skills:` array:
   ```yaml
   - category: "Databases"
     items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"]
   ```
2. Save and go to `/about` — a new "DATABASES" section should appear under Skills

**Add a certificate:**
1. Add to the `certificates:` array:
   ```yaml
   - title: "AWS Cloud Practitioner"
     issuer: "Amazon Web Services"
     date: "2024"
     url: "https://aws.amazon.com/verification"
   ```
2. Save — the certificate should appear in the Certificates section with a "View ↗" link

**Edit the bio:**
1. Edit the markdown body (below the `---`)
2. Use standard markdown: `**bold**`, `*italic*`, links
3. Save — bio text on the About page updates immediately

**Remove a section entirely:**
- Delete all entries from `certificates:` or `currently:` → that section disappears from the page automatically

---

## 5. Blog Post Workflow (End to End)

Test adding a completely new blog post from scratch.

### Steps

1. Create `src/posts/my-test-post.md`:

```yaml
---
title: "My Test Post"
date: "2026-03-14"
excerpt: "Testing that new posts appear automatically."
tags: ["test"]
coverImage: "https://picsum.photos/seed/testpost/1200/630"
---

## Hello

This is a **test post** to verify that:

1. The post appears on the Blog page
2. It appears on the Home page (if it's one of the 3 newest)
3. The full post renders correctly

Inline code: `const x = 42`

A code block:

\```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
\```

An image with caption:

![Placeholder image](https://picsum.photos/seed/inline/800/400 "This is a rendered caption")

A table:

| Column A | Column B |
|----------|----------|
| Value 1  | Value 2  |
| Value 3  | Value 4  |
```

2. Stop and restart `npm run dev`
3. Go to `/blog` — "My Test Post" should appear at the top (newest date)
4. Go to `/` — it should appear in "Latest writing" if it's in the top 3
5. Click the card — the full post should render with thumbnail, syntax-highlighted code, caption image, and table
6. Delete `my-test-post.md` — restart dev server — post disappears

---

## 6. Project Post Workflow (End to End)

1. Create `src/projects/my-test-project.md`:

```yaml
---
title: "My Test Project"
date: "2026-03-14"
excerpt: "Testing project rendering."
tags: ["test", "react"]
github: "https://github.com/test/test"
demo: "https://example.com"
coverImage: "https://picsum.photos/seed/testproject/1200/630"
---

## What it does

A test project to verify the rendering pipeline.

![Architecture diagram](https://picsum.photos/seed/arch/800/400 "System architecture overview")

## Tech

Built with React.
```

2. Restart `npm run dev`, go to `/projects` — new card appears with thumbnail, GitHub + demo buttons
3. Click the card — full project page shows cover image, GitHub button, demo button, and inline image with caption

---

## 7. Image File Guide (Local Images)

For production images, place files in `public/` and reference them with absolute paths.

### Folder structure

```
public/
└── images/
    ├── blog/
    │   └── my-post-cover.jpg     → reference as /images/blog/my-post-cover.jpg
    └── projects/
        └── my-project-cover.png  → reference as /images/projects/my-project-cover.png
```

### Recommended sizes

| Use | Dimensions | Format |
|-----|-----------|--------|
| Cover image (card + post header) | 1200 × 630 px | `.jpg` |
| Inline content image | 800 × 500 px or wider | `.jpg` / `.png` |
| Diagram / screenshot | Original resolution | `.png` |

### In frontmatter

```yaml
coverImage: "/images/blog/my-post-cover.jpg"
```

### In markdown body

```markdown
![Descriptive alt text](/images/blog/my-diagram.png)
![With caption](/images/blog/my-diagram.png "Caption shown below image")
```

---

## Checklist

Use this to confirm everything works after setup or after making changes:

- [ ] `/` loads with hero, latest posts cards, latest project cards
- [ ] Blog cards show thumbnail when `coverImage` is set
- [ ] Project cards show thumbnail when `coverImage` is set
- [ ] `/blog` shows all posts sorted newest-first
- [ ] `/blog/getting-started-with-react` renders with cover image, syntax-highlighted code, inline code with contrast
- [ ] Inline image with caption renders a `<figcaption>` below the image
- [ ] `/projects` shows all projects
- [ ] `/projects/portfolio-website` renders with cover image and GitHub button
- [ ] `/about` shows name, bio (from markdown body), education, skills, certificates, currently
- [ ] Editing `src/about/about.md` and saving updates the About page
- [ ] `/contact` shows all contact entries with readable labels
- [ ] Adding a new `.md` file to `src/posts/` and restarting dev server makes it appear
- [ ] Removing a `.md` file and restarting removes it
