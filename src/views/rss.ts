import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPostList } from '../posts';
import { LOCALE, UI, type Lang } from '../i18n';
import { SITE_NAME, SITE_URL } from '../consts';

export async function blogFeed(context: APIContext, lang: Lang) {
  const posts = await getPostList(lang);
  return rss({
    title: `${SITE_NAME} — ${UI[lang].blogTitle}`,
    description: UI[lang].blogDescription,
    site: context.site ?? SITE_URL,
    items: posts.map((post) => ({
      title: post.entry.data.title,
      description: post.entry.data.description,
      pubDate: post.entry.data.pubDate,
      link: post.url,
    })),
    customData: `<language>${LOCALE[lang].toLowerCase()}</language>`,
  });
}
