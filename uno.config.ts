import {
  defineConfig,
  presetIcons,
  presetUno,
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
  theme: {
    colors: {
      // class="text-primary-light"
      // class="text-primary-dark"
      'primary-light': '#224b37', 
      'primary-dark': '#a7b7af'
    },
  },
  rules: [
    [/^text-(.*)$/, ([, c], { theme }) => {
      if (theme.colors[c])
        return { color: theme.colors[c] }
    }],
  ]
})