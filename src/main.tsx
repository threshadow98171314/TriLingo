import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OUTLINE, prefetch } from './content';
import { initCloud } from './core/cloud';
import { initEggs } from './core/eggs';
import { initPerf } from './core/perf';
import { lastStudiedLang, nextUp } from './core/progress';
import { getSave, initStore } from './core/store';
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

// 畫面出來之後，趁空檔先把「下一堂課」的題目下載好，按「繼續」就不用等
const idle = (f: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(f, { timeout: 2500 }) : setTimeout(f, 1200));
idle(() => {
  const s = getSave();
  const lang = lastStudiedLang(s);
  const up = lang && nextUp(s, OUTLINE[lang]);
  if (lang && up) prefetch(lang, { units: [up.unit.id] });
});
