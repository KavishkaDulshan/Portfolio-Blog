---
title: "What's New in Tailwind CSS v4"
date: "2025-03-01"
excerpt: "Tailwind v4 drops the config file and moves everything into CSS. Here's what changed and why it's better."
tags: ["tailwind", "css", "tooling"]
coverImage: "https://picsum.photos/seed/tailwind-cover/1200/630"
---

Tailwind CSS v4 is a ground-up rewrite. The changes feel radical at first, but they make a lot of sense once you understand what the team was going for.

## No more `tailwind.config.js`

In v3, you had a JavaScript config file:

```js
// tailwind.config.js (v3)
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#6366f1',
      },
    },
  },
};
```

In v4, everything moves to CSS using `@theme`:

```css
/* index.css (v4) */
@import "tailwindcss";

@theme {
  --color-brand: #6366f1;
  --font-sans: 'Inter', sans-serif;
}
```

CSS variables are now first-class citizens of the design system. This means your tokens are accessible in both utility classes *and* in regular CSS properties.

## New Vite plugin setup

v4 introduces `@tailwindcss/vite` — a dedicated Vite plugin that's faster than the PostCSS approach.

```bash
npm install tailwindcss @tailwindcss/vite
```

```js
// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

And in your CSS:

```css
@import "tailwindcss";
```

That's it. No `@tailwind base`, `@tailwind components`, `@tailwind utilities` — just one import.

## Typography plugin with `@plugin`

Plugins are now loaded in CSS too:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

## CSS variables for spacing and colors

Every design token generates a CSS variable automatically:

```html
<div class="bg-gray-900 text-white p-6">
  <!-- bg-gray-900 → var(--color-gray-900) -->
  <!-- p-6 → var(--spacing) * 6 -->
</div>
```

You can reference these in custom CSS:

```css
.my-element {
  background: var(--color-gray-900);
  padding: calc(var(--spacing) * 6);
}
```

## Performance improvements

The new engine is built in Rust (via the Oxide engine) and is significantly faster:

| Operation | v3 | v4 |
|-----------|----|----|
| Full rebuild | ~1200ms | ~105ms |
| Incremental | ~180ms | ~4ms |

These numbers are from the Tailwind team's benchmarks on a large project.

## Summary

| v3 | v4 |
|----|----|
| `tailwind.config.js` | `@theme` in CSS |
| PostCSS plugin | Native Vite plugin |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| JS-only tokens | CSS variables everywhere |

The migration from v3 to v4 takes some effort, but new projects should start with v4 from day one.
