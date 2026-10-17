import { useEffect, type ReactNode } from 'react';
import { CelebrationHost } from './components/Celebrations';
import { CourseGate } from './components/CourseGate';
import { WelcomeTour } from './components/Guide';
import { BottomNav, TopBar } from './components/Layout';
import { ToTop } from './components/ToTop';
import { Empty } from './components/ui';
import { nowMs } from './core/date';
import { setEggKeysEnabled } from './core/eggs';
import { fx, seasonOf, type AmbientKind } from './core/fx';
import { SKINS } from './core/shop';
import { useSave } from './core/store';
import { LANGS, type LangId } from './core/types';
import { ArtGallery } from './pages/ArtGallery';
import { BlitzPage } from './pages/Blitz';
import { CardDuelPage } from './pages/CardDuel';
import { CrosswordPage } from './pages/Crossword';
import { ConceptPage, ConceptQuizPage } from './pages/Concepts';
import { PicturesPage, SortPage } from './pages/FunGames';
import { SongPage } from './pages/Songs';
import { HelpPage } from './pages/Help';
import { Home } from './pages/Home';
import { LangPage } from './pages/LangPage';
import { MatchPage } from './pages/MatchGame';
import { MemoryPage } from './pages/Memory';
import { MockPage } from './pages/Mock';
import { LessonPage, ListenPage, ReviewPage, TypingPage } from './pages/Practice';
import { ProfilePage } from './pages/Profile';
import { SettingsPage } from './pages/Settings';
import { ShopPage } from './pages/Shop';
import { TrueFalsePage } from './pages/TrueFalse';
import { TypingGuidePage } from './pages/TypingGuide';
import { WordChainPage } from './pages/WordChain';
import { WordlePage } from './pages/Wordle';
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
  if (p[0] === 'help') return view(<HelpPage />);
  if (p[0] === 'art') return view(<ArtGallery />);

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
      case 'concepts':
        return view(<LangPage lang={lang} tab={p[2]} />);
      case 'songs':
        return view(<LangPage lang={lang} tab={lang === 'ja' ? 'songs' : 'path'} />);
      case 'song':
        return view(<SongPage id={p[3] ?? ''} />);
      case 'concept':
        if (p[4] === 'quiz') return gated(<ConceptQuizPage lang={lang} id={p[3] ?? ''} />);
        return view(
          <CourseGate lang={lang}>
            <ConceptPage lang={lang} id={p[3] ?? ''} />
          </CourseGate>,
        );
      case 'mock':
        if (p[3]) return gated(<MockPage lang={lang} examId={p[3]} />);
        return view(<LangPage lang={lang} tab="mock" />);
      case 'chart':
        return view(<LangPage lang={lang} tab={lang === 'en' ? 'path' : 'chart'} />);
      case 'lesson':
        return gated(<LessonPage lang={lang} lessonId={p[3] ?? ''} />);
      case 'typing-guide':
        return view(<TypingGuidePage lang={lang} />);
      case 'review':
        return gated(<ReviewPage lang={lang} />);
      case 'play':
        if (p[3] === 'crossword') return gated(<CrosswordPage lang={lang} daily={route.query.get('daily') === '1'} />);
        if (p[3] === 'match') return gated(<MatchPage lang={lang} />);
        if (p[3] === 'duel') return gated(<CardDuelPage lang={lang} />);
        if (p[3] === 'chain') return gated(<WordChainPage lang={lang} />);
        if (p[3] === 'wordle') return gated(<WordlePage lang={lang} daily={route.query.get('daily') === '1'} />);
        if (p[3] === 'blitz') return gated(<BlitzPage lang={lang} />);
        if (p[3] === 'listen') return gated(<ListenPage lang={lang} />);
        if (p[3] === 'typing' && lang !== 'en') return gated(<TypingPage lang={lang} />);
        if (p[3] === 'truefalse') return gated(<TrueFalsePage lang={lang} />);
        if (p[3] === 'pics') return gated(<PicturesPage lang={lang} />);
        if (p[3] === 'sort') return gated(<SortPage lang={lang} />);
        if (p[3] === 'memory') return gated(<MemoryPage lang={lang} kana={lang === 'ja' && route.query.get('kana') === '1'} />);
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
  const s = useSave();
  const { theme, furigana, seasonal, fx: fxSetting } = s.settings;

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

  // 商店買的主題色：換掉整個網站的強調色
  const skin = SKINS.find((k) => k.id === s.equip.skin);
  useEffect(() => {
    const st = document.documentElement.style;
    if (skin) {
      st.setProperty('--accent', skin.a);
      st.setProperty('--accent-2', skin.b);
    } else {
      st.removeProperty('--accent');
      st.removeProperty('--accent-2');
    }
  }, [skin]);

  const { page, focus } = resolve(route);

  // 背景飄落特效：裝備了商店買的就一直飄，沒有的話跟著季節（設定裡可以關掉季節特效）
  // 上課、玩遊戲時：不飄背景粒子，也暫停鍵盤秘技偵測（避免和作答按鍵衝突）
  const ambient = s.equip.ambient as AmbientKind | undefined;
  useEffect(() => {
    setEggKeysEnabled(!focus);
    fx.setAmbient(!focus && fxSetting ? (ambient ?? (seasonal ? seasonOf(new Date(nowMs())) : null)) : null);
  }, [focus, seasonal, fxSetting, ambient]);
  return (
    <>
      {!focus && <TopBar route={route} />}
      {page}
      {!focus && <BottomNav route={route} />}
      {!focus && <ToTop />}
      {/* 第一次打開：新手導覽（上課、玩遊戲中不打擾） */}
      {!focus && !s.guide.welcome && <WelcomeTour />}
      <CelebrationHost />
    </>
  );
}
