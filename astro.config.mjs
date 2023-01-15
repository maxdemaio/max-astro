import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import UnoCSS from "unocss/astro";
import presetUno from "@unocss/preset-uno";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [
    sitemap(),
    UnoCSS({
      presets: [presetUno()],
    }),
  ],
});
