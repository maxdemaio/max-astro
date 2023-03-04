import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'text-bottom',
      },
    }),
    presetWebFonts({
      fonts: {
        kai: 'Kaisei Tokumin',
        mono: 'DM Mono',
      },
    }),
  ],
  shortcuts: {
    mlinkTextHover:
      'hover:text-primary-light-hover dark:hover:text-primary-dark-hover',
    mlinkBorderHover:
      'hover:border-primary-light-hover dark:hover:border-primary-dark-hover',
    transf: 'transform transition duration-300 ease-in-out',
    mlink:
      'transf text-primary-light dark:text-primary-dark border-b-1 border-primary-light dark:border-primary-dark mlinkTextHover mlinkBorderHover',
    // unfortunately, group doesn't quite work yet in a shortcut
    // mproj: 'group rounded p-4 bg-transparent hover:bg-#88888808',
    mprojItem: 'transf opacity-80 group-hover:opacity-100',
  },
  theme: {
    colors: {
      // https://maketintsandshades.com/
      // class="text-primary-light"
      // class="text-primary-dark"
      'primary-light': '#224b37',
      'primary-light-hover': '#030705',
      'primary-dark': '#a7b7af',
      'primary-dark-hover': '#f6f8f7',
    },
    breakpoints: {
      // this overrides and doesn't merge
      // as per https://github.com/unocss/unocss/blob/main/README.md#extend-theme
      md: '770px',
      sm: '640px',
      xs: '430px',
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
  ],
});
