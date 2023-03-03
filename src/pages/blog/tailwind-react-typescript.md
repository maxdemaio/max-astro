---
layout: "../../layouts/BlogPost.astro"
title: Tailwind, React, and TypeScript - How to Get Started
pubDate: 'Sep 04 2021'
description: How to get set up with Tailwind, React, and Typescript.
---

Want to construct your frontend with Tailwind, React, and Typescript? Look no further; here we will discuss everything that you'll need to get setup.

---

## React and Typescript setup

Before we get started, "Tailwind CSS requires Node.js 12.13.0 or higher" (tailwindcss). Make sure you have Node.js installed and the correct version by running `node --version` in your command line. If you don't have it installed, feel free to visit [Node.js's official website](https://nodejs.org/en/).

Now let's get down to business, creating a new React project with TypeScript using [Create React App](https://create-react-app.dev/). The way we can bootstrap a new React project with TypeScript according to the [Create React App documentation](https://create-react-app.dev/docs/adding-typescript/) is `npx create-react-app my-app --template typescript`.

## Install Tailwind CSS with Create React App

Your React + TypeScript project has now been made and all that's left is to install Tailwind CSS. To do so, we have to follow some steps according to [Tailwind CSS's Create React App installation documentation](https://tailwindcss.com/docs/guides/create-react-app).

### [Install Tailwind CSS via npm](https://tailwindcss.com/docs/guides/create-react-app#install-and-configure-craco)

`npm install -D tailwindcss@npm:@tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9`

### [Install and configure CRACO](https://tailwindcss.com/docs/guides/create-react-app#install-and-configure-craco)

`npm install @craco/craco`

Once CRACO has finished installing, edit your `package.json` to use `craco` for all scripts except `eject`.

```json
{
  // ...
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
  }
}
```

Create a `craco.config.js` file at the root of your React project, adding in the `tailwindcss` and `autoprefixer` PostCSS plugins.

```js
// craco.config.js
module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
};
```

### [Create your configuration file](https://tailwindcss.com/docs/guides/create-react-app#create-your-configuration-file)

`npx tailwindcss-cli@latest init`

### [Include Tailwind in your CSS](https://tailwindcss.com/docs/guides/create-react-app#include-tailwind-in-your-css)

Change the `index.css` file located in the `src` directory in the root of your React project.

```css
/* ./src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Conclusion

You're all set! You've successfully configured a React project to use TypeScript and Tailwind CSS. I hope this blog post helped you get your new frontend set up to create beautiful UI and UX.

## Works Cited

- “Install Tailwind CSS with Create React App” _tailwindcss_, [https://tailwindcss.com/docs/guides/create-react-app](https://tailwindcss.com/docs/guides/create-react-app).
- “Adding TypeScript” _Create React App_, [https://create-react-app.dev/docs/adding-typescript/](https://create-react-app.dev/docs/adding-typescript/).
