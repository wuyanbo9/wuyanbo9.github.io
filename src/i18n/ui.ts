export const languages = { en: 'English', zh: '中文' } as const;
export const defaultLang = 'en' as const;

export type Lang = keyof typeof languages;

export const site = {
  name: 'Yanbo Wu',
  url: 'https://wuyb.com',
} as const;

// All user-facing copy lives here so pages stay language-agnostic.
// PLACEHOLDER COPY — replace the strings, not the structure.
export const ui = {
  en: {
    'site.description': 'Personal site of Yanbo Wu.',
    'nav.home': 'Home',
    'nav.blog': 'Writing',
    'nav.about': 'About',
    'nav.switch': '中文',

    'home.tagline': 'Building things on the internet.',
    'home.intro':
      'This is a placeholder introduction. A sentence or two about who I am, what I work on, and what I care about — enough for a stranger to know whether the rest of this site is for them.',
    'home.now.title': 'Now',
    'home.now.body':
      'Placeholder: what I am spending my time on these days. Updated whenever it stops being true.',
    'home.recent': 'Recent writing',
    'home.all': 'All posts →',

    'blog.title': 'Writing',
    'blog.description': 'Notes, essays, and things worth writing down.',
    'blog.empty': 'Nothing published yet.',
    'blog.back': '← Back to writing',
    'blog.updated': 'Updated',

    'about.title': 'About',
    'about.description': 'A longer introduction.',
    'about.p1':
      'Placeholder paragraph one. The longer version of the homepage introduction — background, the path that got me here, the kind of problems I like working on.',
    'about.p2':
      'Placeholder paragraph two. What I am currently doing, and what I am trying to get better at.',
    'about.p3':
      'Placeholder paragraph three. The non-work half: interests, things I read, how to think about reaching me later on.',

    'footer.rights': '© {year} Yanbo Wu',
    'footer.rss': 'RSS',

    '404.title': 'Not found',
    '404.body': 'That page does not exist.',
    '404.home': 'Go home',
  },
  zh: {
    'site.description': '吴彦波的个人主页。',
    'nav.home': '首页',
    'nav.blog': '写作',
    'nav.about': '关于',
    'nav.switch': 'English',

    'home.tagline': '在互联网上造点东西。',
    'home.intro':
      '这里是占位简介。用一两句话说清我是谁、在做什么、在意什么——足够让一个陌生人判断这个站点是否值得继续看下去。',
    'home.now.title': '近况',
    'home.now.body': '占位文案：最近在花时间做的事。等它不再成立的时候再更新。',
    'home.recent': '最近的文章',
    'home.all': '全部文章 →',

    'blog.title': '写作',
    'blog.description': '笔记、随笔，以及值得写下来的东西。',
    'blog.empty': '还没有发布的文章。',
    'blog.back': '← 返回文章列表',
    'blog.updated': '更新于',

    'about.title': '关于',
    'about.description': '更长一点的自我介绍。',
    'about.p1':
      '占位段落一。首页简介的展开版——我的背景、走到今天的路径，以及我喜欢处理的那类问题。',
    'about.p2': '占位段落二。当下在做的事，以及正在试图变得更擅长的东西。',
    'about.p3': '占位段落三。工作之外的另一半：兴趣、在读的东西，以及以后可以怎么找到我。',

    'footer.rights': '© {year} Yanbo Wu',
    'footer.rss': 'RSS',

    '404.title': '页面不存在',
    '404.body': '找不到这个页面。',
    '404.home': '回首页',
  },
} as const;

export type UIKey = keyof (typeof ui)[typeof defaultLang];

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Read the locale out of a pathname, e.g. `/zh/blog/` -> `zh`. */
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang && maybeLang in languages) return maybeLang as Lang;
  return defaultLang;
}

/** Prefix a default-locale path with the locale, e.g. (`/blog/`, `zh`) -> `/zh/blog/`. */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
}

/** Strip the locale prefix off a pathname, e.g. `/zh/blog/` -> `/blog/`. */
export function stripLang(pathname: string): string {
  for (const lang of Object.keys(languages)) {
    if (lang === defaultLang) continue;
    if (pathname === `/${lang}` || pathname === `/${lang}/`) return '/';
    if (pathname.startsWith(`/${lang}/`)) return pathname.slice(lang.length + 1);
  }
  return pathname;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'zh' : 'en';
}

/** Turn a blog entry id (`en/hello-world`) into its URL slug (`hello-world`). */
export function slugFromId(id: string): string {
  const parts = id.split('/');
  return parts.length > 1 ? parts.slice(1).join('/') : id;
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: lang === 'zh' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
