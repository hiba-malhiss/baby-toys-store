import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
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
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly', //allows styles.myClass from .my-class
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@/styles/colors.scss' as *;`
      }
    }
  },
});
