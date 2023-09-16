# max-astro

- [Astro](https://github.com/withastro/astro)
- 100/100 Lighthouse performance
- [UnoCSS engine](https://github.com/unocss/unocss) for CSS
- Sitemap support
- RSS Feed support
- Markdown & MDX support
- [Studio Ghibli free non-commercial images](https://www.ghibli.jp/info/013344/)

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where any Astro/React/Vue/Svelte/Preact components are stored.

Any static assets, like images, are placed in the `public/` directory.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                                                    |
| :--------------------- | :------------------------------------------------------------------------ |
| `pnpm i`          | Installs dependencies                                                     |
| `pnpm dev`          | Starts local dev server at `localhost:3000`                               |
| `pnpm build`        | Build your production site to `./dist/`                                   |
| `pnpm preview`      | Preview your build locally, before deploying                              |
| `pnpm astro ...`    | Run CLI commands like `astro add`, `astro check`                          |
| `pnpm astro --help` | Get help using the Astro CLI                                              |
| `pnpm format`           | Prettier cleanup (see https://github.com/withastro/prettier-plugin-astro) |
