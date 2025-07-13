import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: './',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/*',
          dest: 'assets',
        },
        {
          src: '../../packages/ui-kit/src/assets/fonts/*',
          dest: 'assets/fonts',
        },
        {
          src: '../../packages/ui-kit/src/assets/images/*',
          dest: 'assets/ui-kit-images',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@baby-toys/ui-kit': path.resolve(__dirname, '../../packages/ui-kit/src'),
      '@mock-data': path.resolve(__dirname, '../../mock-data'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@baby-toys/ui-kit/styles/constants.scss' as *;`,
      },
    },
  },
});
