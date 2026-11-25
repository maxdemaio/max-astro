import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import { unified, rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://maxdemaio.com',
  output: 'static',
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    sitemap(),
    mdx(),
    react(),
  ],
  markdown: {
    // Astro 7 defaults to a different Markdown processor; the unified one is needed for rehype plugins.
    processor: unified({
      rehypePlugins: [
        rehypeHeadingIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'prepend',
            properties: { class: 'header-anchor', ariaHidden: 'true', tabIndex: -1 },
            content: { type: 'text', value: '#' },
          },
        ],
      ],
    }),
    shikiConfig: {
      // Light/dark pair; switched in prose.css via the --shiki-dark variables.
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default',
      },
    },
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
