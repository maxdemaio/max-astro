import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://maxdemaio.com',
  output: 'static',
  integrations: [UnoCSS({
    injectReset: true,
  }), sitemap(), mdx(), react()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
    },
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});