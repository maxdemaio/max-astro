import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  presetTypography,
  presetWebFonts
} from 'unocss'

export default defineConfig({
  shortcuts: [
    { 'i-logo': 'i-logos-astro w-6em h-6em transform transition-800' },
  ],
  transformers: [
    transformerDirectives(),
  ],
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
      },
    }),
    // custom 'prose' stylings
    presetTypography({
      cssExtend: {
        "main": {
          "margin-left": "5px",
        },
        "p": {
          "margin-bottom": "1rem"
        },
        "h1, h2, h3, h4, h5, h6": {
					"font-family": "Kaisei Tokumin",
          "font-weight": "700",
          "letter-spacing": "-0.025em",
          "margin": "0rem 0rem 2rem 0rem"
				},
        "p > a, li > a": {
					"color": "red",
				},
				"p > a:hover, li > a:hover": {
					"color": "blue",
				},
      }
    })
  ],
})