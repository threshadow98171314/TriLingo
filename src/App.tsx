import { useEffect, type ReactNode } from 'react';
import { CelebrationHost } from './components/Celebrations';
import { CourseGate } from './components/CourseGate';
import { BottomNav, TopBar } from './components/Layout';
import { Empty } from './components/ui';
import { nowMs } from './core/date';
import { setEggKeysEnabled } from './core/eggs';
import { fx, seasonOf } from './core/fx';
import { useSave } from './core/store';
import { LANGS, type LangId } from './core/types';
import { BlitzPage } from './pages/Blitz';
import { CrosswordPage } from './pages/Crossword';
import { Home } from './pages/Home';
import { LangPage } from './pages/LangPage';
import { MatchPage } from './pages/MatchGame';
import { LessonPage, ListenPage, ReviewPage, TypingPage } from './pages/Practice';
import { ProfilePage } from './pages/Profile';
import { SettingsPage } from './pages/Settings';
import { ShopPage } from './pages/Shop';
import { href, useRoute, type Route } from './router';

/** 網址 → 頁面。focus 為 true 的頁面（上課、玩遊戲）不顯示導覽列。 */
function resolve(route: Route): { page: ReactNode; focus: boolean } {
  const p = route.parts;
  const view = (page: ReactNode) => ({ page, focus: false });
  // 以網址當 key：換到另一堂課時整個重來
  const play = (page: ReactNode) => ({ page: <div key={route.raw}>{page}</div>, focus: true });

  if (p.length === 0) return view(<Home />);
  if (p[0] === 'profile') return view(<ProfilePage />);
  if (p[0] === 'shop') return view(<ShopPage />);
  if (p[0] === 'settings') return view(<SettingsPage />);

  if (p[0] === 'l' && (LANGS as string[]).includes(p[1])) {
    const lang = p[1] as LangId;
    // 上課、玩遊戲要先等這個語言的題目下載完成（語言頁自己會處理）
    const gated = (node: ReactNode) => play(<CourseGate lang={lang}>{node}</CourseGate>);
    switch (p[2]) {
      case undefined:
        return view(<LangPage lang={lang} tab="path" />);
      case 's':
        return view(<LangPage lang={lang} tab="path" stageId={p[3]} />);
      case 'arcade':
      case 'dex':
        return view(<LangPage lang={lang} tab={p[2]} />);
      case 'chart':
        return view(<LangPage lang={lang} tab={lang === 'en' ? 'path' : 'chart'} />);
      case 'lesson':
        return gated(<LessonPage lang={lang} lessonId={p[3] ?? ''} />);
      case 'review':
        return gated(<ReviewPage lang={lang} />);
      case 'play':
        if (p[3] === 'crossword') return gated(<CrosswordPage lang={lang} daily={route.query.get('daily') === '1'} />);
        if (p[3] === 'match') return gated(<MatchPage lang={lang} />);
        if (p[3] === 'blitz') return gated(<BlitzPage lang={lang} />);
        if (p[3] === 'listen') return gated(<ListenPage lang={lang} />);
        if (p[3] === 'typing' && lang === 'ja') return gated(<TypingPage lang={lang} />);
    }
  }

  return view(
    <div className="page narrow">
      <Empty icon="🧭" title="找不到這個頁面">
        <a className="btn primary" href={href('/')}>
          回首頁
        </a>
      </Empty>
    </div>,
  );
}

export function App() {
  const route = useRoute();
  const { theme, furigana, seasonal, fx: fxSetting } = useSave().settings;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'auto' && mq.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0d1020' : '#f2f4fb');
    };
    apply();
    if (theme !== 'auto') return;
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('no-furi', !furigana);
  }, [furigana]);

  const { page, focus } = resolve(route);

  // 上課、玩遊戲時：不飄背景粒子，也暫停鍵盤秘技偵測（避免和作答按鍵衝突）
  useEffect(() => {
    setEggKeysEnabled(!focus);
    fx.setAmbient(!focus && seasonal && fxSetting ? seasonOf(new Date(nowMs())) : null);
  }, [focus, seasonal, fxSetting]);
  return (
    <>
      {!focus && <TopBar route={route} />}
      {page}
      {!focus && <BottomNav route={route} />}
      <CelebrationHost />
    </>
  );
}
