import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        height: '1.2em',
        width: '1.2em',
        'vertical-align': 'text-bottom',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: { name: 'Geist', weights: ['400', '500', '600', '700'] },
        mono: { name: 'Geist Mono', weights: ['400', '600'] },
        kai: { name: 'Kaisei Tokumin', weights: ['400', '700'] },
      },
    }),
  ],
  shortcuts: {
    mlinkTextHover:
      'transition-color transition-bg duration-150 hover:text-sky-950 dark:hover:text-white hover:bg-sky-50 dark:hover:bg-stone-700',
    mlink:
      'rounded-sm p-0.5 text-sky-900 dark:text-stone-100 bg-sky-100 dark:bg-stone-800 underline decoration-1 underline-offset-2 decoration-sky-600 dark:decoration-stone-400 mlinkTextHover',
    // Plain inline link (antfu style): full-contrast text, hairline bottom border that darkens on hover.
    plink:
      'no-underline text-black dark:text-white border-b border-b-[rgba(125,125,125,0.3)] hover:border-b-stone-600 dark:hover:border-b-stone-300 transition-[border-color] duration-150 ease',
    mySponsorLinkHover:
      'transition-color transition-bg duration-150 hover:text-pink-600 dark:hover:text-pink-50 hover:bg-pink-50 dark:hover:bg-pink-950',
    mySponsorLink: 'rounded-sm p-0.5 text-pink-400 dark:text-pink-200 bg-pink-100 dark:bg-pink-950 mySponsorLinkHover',
    // unfortunately, group doesn't quite work yet in a shortcut
    // mproj: 'group rounded p-4 bg-transparent hover:bg-#88888808',
    mprojItem: 'transition-opacity duration-150 opacity-80 group-hover:opacity-100',
  },
  theme: {
    colors: {
      'dark-bg': '#1c1917',
    },
    breakpoints: {
      // this overrides and doesn't merge
      // as per https://github.com/unocss/unocss/blob/main/README.md#extend-theme
      xs: '480px',
      sm: '640px',
      md: '770px',
      lg: '1024px',
      xl: '1280px',
    },
  },
  rules: [
    [
      /^text-(.*)$/,
      ([, c], { theme }) => {
        if (theme.colors[c]) return { color: theme.colors[c] };
      },
    ],
    [
      /^border-(.*)$/,
      ([, c], { theme }) => {
        if (theme.colors[c]) return { 'border-color': theme.colors[c] };
      },
    ],
    ['transition-color-border-color', { 'transition-property': 'color,border-color' }],
    ['transition-bg', { 'transition-property': 'background-color' }],
    ['ease', { 'transition-timing-function': 'ease' }],
  ],
});
