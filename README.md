# wuyb.com

Personal site of Yanbo Wu. Astro, static output, bilingual (English at `/`, 中文 at `/zh/`),
deployed to GitHub Pages on every push to `main`.

## Commands

```bash
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build into ./dist
npm run preview  # serve ./dist locally
npm run check    # type-check .astro/.ts files
```

## Writing a post

Create a Markdown file under the folder for its language — the folder decides the URL,
the `lang` field decides which RSS feed it lands in:

```
src/content/blog/en/my-post.md   ->  https://wuyb.com/blog/my-post/
src/content/blog/zh/my-post.md   ->  https://wuyb.com/zh/blog/my-post/
```

Frontmatter:

```yaml
---
title: 'Post title'
description: 'One sentence, used in the list page, meta description, and RSS.'
pubDate: 2026-09-01
updatedDate: 2026-09-10   # optional
lang: 'en'                # 'en' | 'zh', must match the folder
draft: false              # optional; drafts are excluded from the build
---
```

The two languages are independent — a post does not need a translation to exist.

## Editing site copy

All UI strings and the placeholder homepage/about copy live in `src/i18n/ui.ts`,
keyed by language. Pages read from there, so edit the strings, not the templates.

## Layout

```
src/
  i18n/ui.ts            copy + locale helpers
  i18n/feed.ts          shared RSS builder
  content.config.ts     blog collection schema
  content/blog/{en,zh}/ posts
  layouts/              BaseLayout (head/SEO), PostLayout
  components/           Header, Footer, PostList
  components/pages/     shared page bodies, rendered once per language
  pages/                routes: /* is English, /zh/* is Chinese
  styles/global.css     the whole stylesheet
public/
  CNAME                 custom domain for GitHub Pages — do not delete
  robots.txt
```

## Deployment

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
The Pages source must be set to **GitHub Actions**, and `public/CNAME` keeps the
custom domain bound to `wuyb.com`.
