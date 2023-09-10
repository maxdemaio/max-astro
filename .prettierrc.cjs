module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
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
