# wuyb.com

Personal site of Yanbo Wu. Astro, static output, deployed to GitHub Pages on every
push to `main`.

## Commands

```bash
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build into ./dist
npm run preview  # serve ./dist locally
npm run check    # type-check .astro/.ts files
```

## Writing a post

Create a Markdown file in `src/content/blog/`. The filename becomes the URL:

```
src/content/blog/my-post.md  ->  https://wuyb.com/blog/my-post/
```

Frontmatter:

```yaml
---
title: 'Post title'
description: 'One sentence, used in the list page, meta description, and RSS.'
pubDate: 2026-09-01
updatedDate: 2026-09-10   # optional
draft: false              # optional; drafts are excluded from the build
---
```

## Layout

```
src/
  consts.ts             site name, blog title, date formatting
  content.config.ts     blog collection schema
  content/blog/         posts
  layouts/              BaseLayout (head/SEO), PostLayout
  components/           Header, Footer, PostList
  pages/                routes
  styles/global.css     the whole stylesheet
public/
  CNAME                 custom domain for GitHub Pages — do not delete
  robots.txt
```

Homepage copy lives directly in `src/pages/index.astro`.

## Deployment

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
The Pages source must be set to **GitHub Actions**, and `public/CNAME` keeps the
custom domain bound to `wuyb.com`.
