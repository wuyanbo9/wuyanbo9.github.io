// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://wuyb.com',
  // Fonts are downloaded at build time and served from our own origin,
  // so no request ever leaves for a font CDN.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Source Serif 4',
      cssVariable: '--font-body',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      // Source Serif 4 has no CJK glyphs; Chinese falls through to LXGW WenKai
      // (self-hosted via BaseLayout), with system Kaiti covering it while it loads.
      fallbacks: ['Georgia', 'LXGW WenKai Screen', 'Kaiti SC', 'STKaiti', 'KaiTi', 'serif'],
    },
  ],
  markdown: {
    // Dual theme: global.css swaps to the dark values under prefers-color-scheme.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
  integrations: [
    // Must match LANGS / LOCALE in src/i18n.ts: English at the root, other languages under /<lang>/.
    sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en-US', zh: 'zh-CN' } } }),
  ],
});
