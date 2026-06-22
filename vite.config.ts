import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The site root index.html is the self-contained calculator that sales people
// use (and that GitHub Pages serves). The React/TypeScript developer version
// is entered from app.html, so Vite is pointed at that file for dev and build.
export default defineConfig({
  plugins: [react()],
  server: {
    open: '/app.html',
  },
  build: {
    rollupOptions: {
      input: 'app.html',
    },
  },
});
