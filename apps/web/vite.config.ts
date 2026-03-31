import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import { searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@acme/api-client/products', replacement: path.resolve(__dirname, '../../packages/api-client/src/products/index.ts') },
      { find: '@acme/api-client/stores', replacement: path.resolve(__dirname, '../../packages/api-client/src/stores/index.ts') },
      { find: '@acme/api-client', replacement: path.resolve(__dirname, '../../packages/api-client/src/index.ts') },
      { find: '@acme/cart', replacement: path.resolve(__dirname, '../../packages/cart/src/index.ts') },
      { find: '@acme/shared', replacement: path.resolve(__dirname, '../../packages/shared/src/index.ts') }
    ]
  },
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())]
    }
  }
});
