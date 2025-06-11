import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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
  css: {
    modules: {
      localsConvention: 'camelCaseOnly', //allows styles.myClass from .my-class
    },
  },
});
