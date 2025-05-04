import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // or '/' if deploying at root
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
