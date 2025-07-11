import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: './',
  publicDir: 'public',
  plugins: [react()],
  resolve: {
    alias: {
      '@baby-toys/ui-kit/components': path.resolve(
        __dirname,
        '../../packages/ui-kit/src/components'
      ),
      '@baby-toys/ui-kit/utils': path.resolve(__dirname, '../../packages/ui-kit/src/utils'),
      '@baby-toys/ui-kit': path.resolve(__dirname, '../../packages/ui-kit/src'),
      '@baby-toys/ui-kit/styles': path.resolve(__dirname, '../../packages/ui-kit/src/styles'),
      '@baby-toys/ui-kit/assets': path.resolve(__dirname, '../../packages/ui-kit/src/assets'),
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
