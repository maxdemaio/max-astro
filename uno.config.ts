import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  presetWebFonts
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      fonts: {
        kai: 'Kaisei Tokumin',
        mono: 'DM Mono',
      },
    }),
  ],
})