// English lives at the site root; every other language gets a /<lang>/ prefix.
export const LANGS = ['en', 'zh'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

/** BCP 47 tag for <html lang>, hreflang and Intl. */
export const LOCALE: Record<Lang, string> = {
  en: 'en-US',
  zh: 'zh-CN',
};

/** Open Graph wants underscores. */
export const OG_LOCALE: Record<Lang, string> = {
  en: 'en_US',
  zh: 'zh_CN',
};

/** Name of each language, written in that language, for the switcher. */
export const LANG_NAME: Record<Lang, string> = {
  en: 'English',
  zh: '中文',
};

export const UI = {
  en: {
    siteDescription: "Yanbo's Random Notes",
    blogTitle: 'Writing',
    blogDescription: 'Notes, essays, and things worth writing down.',
    empty: 'Nothing published yet.',
    updated: 'Updated',
  },
  zh: {
    siteDescription: 'Yanbo 的随手笔记',
    blogTitle: '文章',
    blogDescription: '笔记、随笔，和值得写下来的事。',
    empty: '还没有文章。',
    updated: '更新于',
  },
} satisfies Record<Lang, Record<string, string>>;

/** Prefix a root-relative path for the given language: ('/blog/', 'zh') -> '/zh/blog/'. */
export function localize(path: string, lang: Lang): string {
  return lang === DEFAULT_LANG ? path : `/${lang}${path}`;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'zh' : 'en';
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** A page that exists in every language at the same path: '/blog/' -> { en: '/blog/', zh: '/zh/blog/' }. */
export function everyLang(path: string): Record<Lang, string> {
  return Object.fromEntries(LANGS.map((l) => [l, localize(path, l)])) as Record<Lang, string>;
}
