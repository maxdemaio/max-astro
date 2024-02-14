import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel/serverless';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { RehypePlugins } from 'astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://maxdemaio.com',
  output: 'hybrid',
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
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          content: {
            type: 'element',
            tagName: 'span',
            properties: {
              display: 'flex'
            },
            children: [
              {
                type: 'element',
                tagName: 'svg',
                properties: {
                  width: 50,
                  height: 50,
                  fill: 'currentColor',
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'use',
                    properties: {
                      'xlink:href': '#deez',
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    ] as RehypePlugins,
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
