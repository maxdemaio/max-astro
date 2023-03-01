import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://maxdemaio.com',
  integrations: [
    sitemap(),
    UnoCSS(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'nord'
    }
  }
});
