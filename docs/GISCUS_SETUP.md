Giscus integration setup

This project uses Giscus to add comments to blog posts via GitHub Discussions.

Required environment variables (Vite `VITE_` prefix) — add to your build environment or `.env`:

- `VITE_GISCUS_REPO` — repository in `owner/repo` format (default: `KavishkaDulshan/Portfolio-Blog`).
- `VITE_GISCUS_REPO_ID` — optional GitHub repo ID (not required for basic usage).
- `VITE_GISCUS_CATEGORY` — Discussion category name where comments will be stored (optional but recommended).
- `VITE_GISCUS_CATEGORY_ID` — category ID (recommended for reliability). You can obtain this via the GitHub API or the Giscus admin UI.
- `VITE_GISCUS_MAPPING` — mapping strategy (default: `pathname`).
- `VITE_GISCUS_THEME` — theme for the widget (default: `preferred-color-scheme`).

How it works

- The site injects the Giscus client script into each blog post page and maps each post to a discussion using the chosen mapping (by default, the page pathname like `/blog/<slug>`).
- Comment threads and reactions appear in GitHub Discussions for the configured repo and category.

Getting your category ID

1. Open GitHub and navigate to your repository's Discussions -> New discussion.
2. Use browser devtools to inspect the new discussion or use the GitHub API to list categories and obtain the `id` value.

Testing locally

- Create a `.env` file at the project root with the required `VITE_` variables and run `npm run dev`.

Example `.env`:

VITE_GISCUS_REPO=KavishkaDulshan/Portfolio-Blog
VITE_GISCUS_CATEGORY=Comments
VITE_GISCUS_THEME=preferred-color-scheme

Notes

- Users must sign in with GitHub to post comments since Giscus uses GitHub authentication.
- No server-side secrets or tokens are required by the client — everything is handled by Giscus and GitHub.
