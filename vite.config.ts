import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' makes the built site work from any folder (e.g. GitHub Pages /math-app/).
export default defineConfig({
  base: './',
  plugins: [react()],
});
