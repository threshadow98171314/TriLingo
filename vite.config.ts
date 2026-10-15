/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json';

export default defineConfig({
  // 相對路徑，build 後可直接放到任何子目錄（例如 GitHub Pages）
  base: './',
  plugins: [react()],
  // 設定頁顯示的版本號，跟著 package.json 走
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  server: { port: 5173, strictPort: false },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
