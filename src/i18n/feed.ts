import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { ui, site, localizePath, slugFromId, type Lang } from './ui';

/** Build the RSS feed for one locale. Used by /rss.xml and /zh/rss.xml. */
export async function feedFor(lang: Lang, context: APIContext) {
  const posts = (
    await getCollection('blog', ({ data }) => data.lang === lang && !data.draft)
  ).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${site.name} — ${ui[lang]['blog.title']}`,
    description: ui[lang]['blog.description'],
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: localizePath(`/blog/${slugFromId(post.id)}/`, lang),
    })),
    customData: `<language>${lang === 'zh' ? 'zh-cn' : 'en-us'}</language>`,
  });
}
