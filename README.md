# wuyb.com

Personal site of Yanbo Wu. Astro, static output, deployed to GitHub Pages on every
push to `main`.

## Commands

```bash
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build into ./dist
npm run preview  # serve ./dist locally
npm run check    # type-check .astro/.ts files
npm run sync     # pull the tracked Apple Music playlists (see 不一定是新歌 below)
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

## 不一定是新歌 (the music weekly, at /music/)

A weekly written in Chinese, tracking five public Apple Music playlists. It is a
sub-site: its own name and nav in the header, its own pages, the main site's
typography. Everything it needs lives under `src/music/`, plus `data/` and
`scripts/` at the repo root. `MUSIC_BASE` in `src/music/lib/paths.ts` is the only
place the `/music` prefix is written down.

### 1. Sync the playlists

```bash
npm run sync
```

Reads the five public playlist pages and writes:

- `data/snapshots/YYYY-MM-DD.json` — that day's full snapshot of every playlist
- `data/playlists.status.json` — track counts and update times, shown on the playlists page
- `data/state.json` — every track ID seen so far
- `data/inbox/YYYY-MM-DD.json` — only when new tracks showed up

New tracks are deduplicated by Apple Music song ID; a track in several playlists
is recorded once, with every source listed in `sourcePlaylists`.

After adding a playlist to `data/playlists.json`, run `npm run sync:baseline`
once to mark its current tracks as seen — otherwise the whole playlist reads as
new. Never use the baseline command for a normal weekly sync.

### 2. Write an issue

Add `src/music/content/issues/YYYY-MM-DD.json`, using the inbox as raw material.
The file name is the page slug and `number` is the previous issue plus one. Copy
the shape from an existing issue. Conventions:

- At most 10 tracks per issue. The inbox is a candidate pool, not a checklist; an
  old song newly added to a playlist is just as eligible as a new release.
- `story` states only what can be checked, with sources for anything load-bearing.
- Separate what the artist or label actually said from how media and fans read it,
  especially for memorial or contested songs.
- Never fill in a Spotify link from memory — open it and confirm the artist first.
- `sourcePlaylistId` must exist in `data/playlists.json`.
- Each track `slug` is unique across the whole site; it is used as the page anchor.

### 3. Images

Covers and portraits are stored locally so no external link can rot:

- `public/images/albums/<songId>.jpg` (the inbox `artworkUrl` is already 600×600)
- `public/images/artists/<artist-slug>.jpg`, with the source kept in the artist's `imageCredit`

### 4. Artists

Every artist needs `src/music/content/artists/<artist-slug>.json`. Artist pages
collect their tracks automatically from every issue's `artistIds`, so there is no
recommendation list to maintain. A missing artist profile fails the build.

### 5. Check

`npm run build` validates content: more than 10 tracks in an issue, duplicate
track slugs, missing artist profiles and unknown playlist IDs all stop the build.

## Layout

```
src/
  consts.ts             site name, URL, copyright
  i18n.ts               languages, UI strings, date formatting, URL prefixes
  posts.ts              groups each post's language versions
  content.config.ts     blog collection schema
  content/blog/         posts
  layouts/              BaseLayout (head/SEO), PostLayout, MusicLayout
  components/           Header, Footer, PostList
  pages/                routes (English at the root, Chinese under zh/, weekly under music/)
  views/                page bodies shared by both languages' routes
  music/                the weekly: content/, lib/, components/
  styles/global.css     the whole stylesheet
  styles/music.css      the parts only the weekly needs
data/                   tracked playlists, snapshots, seen-track state, inbox
scripts/                sync-playlists.mjs
public/
  CNAME                 custom domain for GitHub Pages — do not delete
  images/               album covers and artist portraits
  robots.txt
```

Homepage copy lives in `src/views/Home.astro`.

## Known limits of the playlist sync

- Scraping depends on the structure of Apple Music's public playlist pages, so a
  redesign there may require changing the parser.
- Playlists must be public; anything needing a login or blocked by region fails.
- "New" is judged against the global `seenTracks` baseline, so a track removed
  from a playlist and later re-added is not reported twice.
- Syncing, selection, fact-checking, writing and publishing stay manual; the
  script never generates or publishes content.
- If one playlist fails to fetch in a given week, it is left out of that status
  while the others are still recorded.

## Deployment

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
The Pages source must be set to **GitHub Actions**, and `public/CNAME` keeps the
custom domain bound to `wuyb.com`.
