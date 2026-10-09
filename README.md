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

Each post is a folder named after its URL slug, with one Markdown file per
language. Either file may be missing; the other language's lists still show the post.

```
src/content/blog/my-post/en.md  ->  https://wuyb.com/blog/my-post/
src/content/blog/my-post/zh.md  ->  https://wuyb.com/zh/blog/my-post/
```

Post pages show an English / 中文 switch in the header only when both files exist.

Frontmatter (the language comes from the file name, not frontmatter):

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
  consts.ts             site name, URL, copyright
  i18n.ts               languages, UI strings, date formatting, URL prefixes
  posts.ts              groups each post's language versions
  content.config.ts     blog collection schema
  content/blog/         posts
  layouts/              BaseLayout (head/SEO), PostLayout
  components/           Header, Footer, PostList
  pages/                routes (English at the root, Chinese under zh/)
  views/                page bodies shared by both languages' routes
  styles/global.css     the whole stylesheet
public/
  CNAME                 custom domain for GitHub Pages — do not delete
  robots.txt
```

Homepage copy lives in `src/views/Home.astro`.

## Deployment

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
The Pages source must be set to **GitHub Actions**, and `public/CNAME` keeps the
custom domain bound to `wuyb.com`.
