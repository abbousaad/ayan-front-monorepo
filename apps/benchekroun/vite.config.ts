import tailwindcss from '@tailwindcss/vite';
import { searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())]
    }
  }
});
