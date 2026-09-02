// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://wuyb.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    // Dual theme: global.css swaps to the dark values under prefers-color-scheme.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', zh: 'zh-CN' },
      },
    }),
  ],
});
