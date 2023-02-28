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
        mono: 'DM Mono',
      },
    }),
    // custom 'prose' stylings
    presetTypography({
      cssExtend: {
        p: {
          "margin-bottom": "1rem"
        },
        hr: { 
          "border-sizing": "border-box",
          "border-top-width": "1px",
          "border": "0 solid" 
        },
        pre: {
          "padding": "1rem",
					"font-family": "DM Mono",
					"overflow-x": "auto",
          "border-radius": "0.375rem",
          "white-space": "normal"
				},
        "h1, h2, h3, h4, h5, h6": {
					"font-family": "Kaisei Tokumin",
          "font-weight": "700",
          "letter-spacing": "-0.025em",
          "margin": "1rem 0rem 1rem 0rem"
				},
        h1: {
          "font-size": "2.25rem",
          "line-height": "2.5rem",
        },
        "p > a, li > a": {
					"color": "rgba(30,64,175)",
          "text-decoration": "underline"
				},
				"p > a:hover, li > a:hover": {
					"color": "rgba(30, 58, 138)",
				},
      }
    })
  ],
})