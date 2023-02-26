import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import {presetUno, presetWebFonts, presetIcons} from 'unocss';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://maxdemaio.com',
  integrations: [
    sitemap(),
    UnoCSS({
      presets: [
        presetUno(), 
        presetWebFonts({
          fonts: {
            kai: 'Kaisei Tokumin',
          },
        }),
        presetIcons(),
      ],
    }),
  ],
});
