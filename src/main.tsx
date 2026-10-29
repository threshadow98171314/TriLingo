import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { preloadCourses } from './content';
import { initCloud } from './core/cloud';
import { initEggs } from './core/eggs';
import { initPerf } from './core/perf';
import { initStore } from './core/store';
import './styles.css';
import './fx.css';
import './games.css';
import './shop.css';

initStore();
initPerf();
initCloud();
initEggs();

// 網站更新後，舊版頁面去下載已經被換掉的檔案會失敗：自動重新整理一次拿到新版
window.addEventListener('vite:preloadError', (e) => {
  const KEY = 'trilingo.reloadedAt';
  const last = Number(sessionStorage.getItem(KEY) || 0);
  if (Date.now() - last < 30_000) return; // 剛重新整理過還是失敗：交給畫面上的「再試一次」
  sessionStorage.setItem(KEY, String(Date.now()));
  e.preventDefault();
  location.reload();
});

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);

// 畫面出來之後，趁空檔把三種語言的題目都先下載好
const idle = (f: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(f, { timeout: 2500 }) : setTimeout(f, 1200));
idle(preloadCourses);
