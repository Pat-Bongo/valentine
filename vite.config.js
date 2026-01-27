/* eslint-disable import/no-extraneous-dependencies */
import eslint from 'vite-plugin-eslint2';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [eslint()],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});