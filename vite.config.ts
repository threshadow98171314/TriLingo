/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // 相對路徑，build 後可直接放到任何子目錄（例如 GitHub Pages）
  base: './',
  plugins: [react()],
  server: { port: 5173, strictPort: false },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
