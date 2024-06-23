import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist', 
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/main.ts'), 
        server: path.resolve(__dirname, 'src/services/miniapi/index.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]'
      }
    }
  },
  server: {
    port: 5173 
  }
});
