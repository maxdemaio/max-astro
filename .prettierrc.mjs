/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  // defaults that apply to all files unless overridden above
  tabWidth: 2,
  printWidth: 120,
  singleQuote: true,
};
