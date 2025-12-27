
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000
  }
});
