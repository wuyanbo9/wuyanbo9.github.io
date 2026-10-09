import { getCollection, type CollectionEntry } from 'astro:content';
import { LANGS, isLang, localize, type Lang } from './i18n';

export type PostEntry = CollectionEntry<'blog'>;

/** One language version of a post. */
export interface Post {
  slug: string;
  lang: Lang;
  url: string;
  entry: PostEntry;
}

/** A post and all of its language versions, keyed by language. */
export type PostGroup = Partial<Record<Lang, Post>>;

function toPost(entry: PostEntry): Post {
  const [slug, lang, ...rest] = entry.id.split('/');
  if (!slug || !lang || rest.length > 0 || !isLang(lang)) {
    throw new Error(
      `Blog post "${entry.id}" must live at src/content/blog/<slug>/<lang>.md, with <lang> one of: ${LANGS.join(', ')}.`,
    );
  }
  return { slug, lang, url: localize(`/blog/${slug}/`, lang), entry };
}

/** Every published post, grouped by slug. */
export async function getPostGroups(): Promise<Map<string, PostGroup>> {
  const entries = await getCollection('blog', ({ data }) => !data.draft);
  const groups = new Map<string, PostGroup>();
  for (const post of entries.map(toPost)) {
    const group = groups.get(post.slug) ?? {};
    group[post.lang] = post;
    groups.set(post.slug, group);
  }
  return groups;
}

/**
 * The list a reader of `lang` should see, newest first: each post in their
 * language, or in whichever language it exists if it hasn't been translated.
 */
export async function getPostList(lang: Lang): Promise<Post[]> {
  const groups = await getPostGroups();
  return [...groups.values()]
    .map((group) => group[lang] ?? LANGS.map((l) => group[l]).find(Boolean)!)
    .sort((a, b) => b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf());
}

/** getStaticPaths entries for every post written in `lang`. */
export async function getPostPaths(lang: Lang) {
  const groups = await getPostGroups();
  return [...groups.values()]
    .filter((group) => group[lang])
    .map((group) => ({
      params: { slug: group[lang]!.slug },
      props: { post: group[lang]!, group },
    }));
}
