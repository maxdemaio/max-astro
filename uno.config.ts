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
        kai: 'Kaisei Tokumin',
      },
    }),
  ],
  shortcuts: {
    mlinkTextHover:
      'transition-color transition-bg ease-in-out duration-200 hover:text-sky-950 dark:hover:text-sky-100 hover:bg-sky-50 dark:hover:bg-sky-950',
    mySponsorLinkHover:
      'transition-color transition-bg ease-in-out duration-200 hover:text-pink-600 dark:hover:text-pink-50 hover:bg-pink-50 dark:hover:bg-pink-950',
    mlink: 'rounded-sm p-0.5 text-sky-900 dark:text-sky-200 bg-sky-100 dark:bg-sky-950 mlinkTextHover',
    mySponsorLink: 'rounded-sm p-0.5 text-pink-400 dark:text-pink-200 bg-pink-100 dark:bg-pink-950 mySponsorLinkHover',
    // unfortunately, group doesn't quite work yet in a shortcut
    // mproj: 'group rounded p-4 bg-transparent hover:bg-#88888808',
    mprojItem: 'transition-opacity ease-in-out duration-200 opacity-80 group-hover:opacity-100',
  },
  theme: {
    colors: {
      'dark-bg': 'rgba(17, 17, 16, 1)',
    },
    breakpoints: {
      // this overrides and doesn't merge
      // as per https://github.com/unocss/unocss/blob/main/README.md#extend-theme
      md: '770px',
      sm: '640px',
      xs: '480px',
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
  ],
});
