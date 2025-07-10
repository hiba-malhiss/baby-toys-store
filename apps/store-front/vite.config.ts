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
      ],
    }),
  ],
  resolve: {
    alias: {
      '@baby-toys/ui-kit/components': path.resolve(
        __dirname,
        '../../packages/ui-kit/src/components'
      ),
      '@baby-toys/ui-kit/utils': path.resolve(__dirname, '../../packages/ui-kit/src/utils'),
      '@baby-toys/ui-kit': path.resolve(__dirname, '../../packages/ui-kit/src'),
      '@baby-toys/ui-kit/styles': path.resolve(__dirname, '../../packages/ui-kit/src/styles'),
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
