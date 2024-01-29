import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: 'https://maxdemaio.com',
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    sitemap(),
    mdx(),
  ],
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
