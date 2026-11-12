/// <reference types="vitest/config" />
import { spawn } from 'node:child_process';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json';

/**
 * 開發時改了題目檔（src/content/）就重新產生大綱（scripts/outline.mjs → src/content/gen/）。
 * npm test、npm run build 會在開始前自己跑一次，這裡只管開發伺服器。
 */
function outline(): Plugin {
  let running = false;
  let again = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const run = () => {
    if (running) {
      again = true;
      return;
    }
    running = true;
    spawn(process.execPath, ['scripts/outline.mjs'], { stdio: 'inherit' }).on('exit', () => {
      running = false;
      if (again) {
        again = false;
        run();
      }
    });
  };
  return {
    name: 'trilingo-outline',
    apply: 'serve',
    configureServer(server) {
      if (process.env.VITEST) return;
      run();
      const onChange = (file: string) => {
        const f = file.replace(/\\/g, '/');
        if (!f.includes('/src/content/') || f.includes('/src/content/gen/')) return;
        clearTimeout(timer);
        timer = setTimeout(run, 300);
      };
      server.watcher.on('change', onChange).on('add', onChange).on('unlink', onChange);
    },
  };
}

export default defineConfig({
  // 相對路徑，build 後可直接放到任何子目錄（例如 GitHub Pages）
  base: './',
  plugins: [react(), outline()],
  // 設定頁顯示的版本號，跟著 package.json 走
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  server: { port: 5173, strictPort: false },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
