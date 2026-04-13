import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: '/game/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: '../../packages/ui-kit/src/assets/*',
          dest: 'assets',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@baby-toys/ui-kit': resolve(__dirname, '../../packages/ui-kit/src'),
      '@': resolve(__dirname, 'src'),
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
