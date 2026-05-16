---
title: "RAUX BROTHERS - Furniture & Interior Design Since 1959"
slug: "raux-brothers-furniture"
date: "2024-05-20"
description: "A premium, responsive brand showcase for Raux Brothers, highlighting timeless furniture craftsmanship and bespoke interior design services."
tags: ["React", "Vite", "Tailwind CSS", "UI/UX Design", "GitHub Pages"]
github: "https://github.com/kavishkadulshan/WebProject1"
demo: "https://kavishkadulshan.github.io/WebProject1/"
excerpt: "Transforming a heritage furniture brand into a modern digital experience using React 19 and a curated Material/Serif design system."
coverImage: "/images/projects/Gallery/roux/image2.webp"
gallery:
  - /images/projects/Gallery/roux/image2.webp
  - /images/projects/Gallery/roux/image3.webp
  - /images/projects/Gallery/roux/image4.webp
  - /images/projects/Gallery/roux/image5.webp
  - /images/projects/Gallery/roux/image1.webp
---
## Overview

**RAUX BROTHERS** is a project dedicated to bringing a legacy furniture and interior design brand (established in 1959) into the modern digital landscape. The primary goal was to create a high-end, visual-first portfolio that mirrors the timeless and elegant nature of their custom furniture and furnishings.

The website functions as a comprehensive brand showcase, moving through the company's history, their curated product lines, and their specialized interior design services.

## UI Design & Color Selection

The visual identity of the site was meticulously crafted using a custom Tailwind CSS configuration to evoke a sense of luxury and "timelessness".

### Color Palette

We utilized a sophisticated, earthy palette that complements high-quality wood and textile photography:

* **Primary (#2c2c2c)**: A deep charcoal for text and primary elements to provide strong contrast.
* **Secondary (#8b7355)**: A warm, woody brown reflecting the brand's core material—furniture.
* **Accent (#c9a96e)**: A muted gold/bronze for highlights and calls to action.
* **Backgrounds**: A soft gradient mix (`#f8f6f3` to `#f5f3ef`) provides a "gallery" feel, preventing the starkness of pure white.

### Typography

The project uses a tiered typography system to establish hierarchy:

* **Logo & Display**: *Cinzel* and *Italiana* for a classical, high-fashion aesthetic.
* **Headings**: *Montserrat* for modern readability.
* **Body Content**: *Crimson Pro* (Serif) to enhance long-form readability and convey heritage.

## Tech Stack


| Layer               | Technology                |
| ------------------- | ------------------------- |
| **Framework**       | React 19 + Vite 7         |
| **Styling**         | Tailwind CSS 3 (JIT Mode) |
| **Post-Processing** | PostCSS + Autoprefixer    |
| **Deployment**      | GitHub Pages              |

## Architecture & File Structure

The project follows a modular React component architecture, ensuring that each section of the long-form landing page is maintainable and reusable.

### File Structure

```text
src/
├── assets/          ← Brand images and SVGs
├── components/      ← Atomic UI sections
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── Navbar.jsx
│   ├── Products.jsx
│   └── index.js     ← Centralized export barrel
├── App.jsx          ← Main layout and section ordering
├── index.css        ← Tailwind directives
└── main.jsx         ← React DOM entry point
```
