/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},   // Replace tailwindcss with @tailwindcss/postcss
    autoprefixer: {},             // Keep autoprefixer plugin
  },
};

export default config;
