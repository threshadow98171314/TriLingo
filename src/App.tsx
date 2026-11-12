import { lazy, Suspense, useEffect, type ComponentType, type ReactNode } from 'react';
import { CelebrationHost } from './components/Celebrations';
import { CourseGate, PageLoading, type GateNeed } from './components/CourseGate';
import { WelcomeTour } from './components/Guide';
import { BottomNav, TopBar } from './components/Layout';
import { ToTop } from './components/ToTop';
import { Empty } from './components/ui';
import { WallLayer } from './components/Wall';
import { nowMs } from './core/date';
import { setEggKeysEnabled } from './core/eggs';
import { fx, seasonOf, type AmbientKind } from './core/fx';
import { SKINS } from './core/shop';
import { useSave } from './core/store';
import { LANGS, type LangId } from './core/types';
import { DRILL_LANG, type DrillId } from './engine/drills/types';
import { Home } from './pages/Home';
import { LangPage } from './pages/LangPage';
import { href, useRoute, type Route } from './router';

/** 用到才下載的頁面：load 載入頁面所在的檔案，name 是匯出的元件名稱 */
function page<M, K extends keyof M>(load: () => Promise<M>, name: K) {
  return lazy(async () => ({ default: (await load())[name] as ComponentType<M[K] extends ComponentType<infer Props> ? Props : never> }));
}

// 首頁和語言頁隨主程式載入；其他頁面點進去才下載（同一個檔案裡的頁面一起下載）
const P = {
  ArtGallery: page(() => import('./pages/ArtGallery'), 'ArtGallery'),
  BigTwo: page(() => import('./pages/BigTwo'), 'BigTwoPage'),
  Blitz: page(() => import('./pages/Blitz'), 'BlitzPage'),
  CardDuel: page(() => import('./pages/CardDuel'), 'CardDuelPage'),
  Concept: page(() => import('./pages/Concepts'), 'ConceptPage'),
  ConceptQuiz: page(() => import('./pages/Concepts'), 'ConceptQuizPage'),
  Crossword: page(() => import('./pages/Crossword'), 'CrosswordPage'),
  Drill: page(() => import('./pages/Drill'), 'DrillPage'),
  Help: page(() => import('./pages/Help'), 'HelpPage'),
  Lesson: page(() => import('./pages/Practice'), 'LessonPage'),
  Listen: page(() => import('./pages/Practice'), 'ListenPage'),
  Match: page(() => import('./pages/MatchGame'), 'MatchPage'),
  Me: page(() => import('./pages/Me'), 'MePage'),
  Memory: page(() => import('./pages/Memory'), 'MemoryPage'),
  Mock: page(() => import('./pages/Mock'), 'MockPage'),
  Pictures: page(() => import('./pages/FunGames'), 'PicturesPage'),
  Profile: page(() => import('./pages/Profile'), 'ProfilePage'),
  Review: page(() => import('./pages/Practice'), 'ReviewPage'),
  Settings: page(() => import('./pages/Settings'), 'SettingsPage'),
  Sevens: page(() => import('./pages/Sevens'), 'SevensPage'),
  Shop: page(() => import('./pages/Shop'), 'ShopPage'),
  Song: page(() => import('./pages/Songs'), 'SongPage'),
  Sort: page(() => import('./pages/FunGames'), 'SortPage'),
  TrueFalse: page(() => import('./pages/TrueFalse'), 'TrueFalsePage'),
  Typing: page(() => import('./pages/Practice'), 'TypingPage'),
  TypingGuide: page(() => import('./pages/TypingGuide'), 'TypingGuidePage'),
  WordChain: page(() => import('./pages/WordChain'), 'WordChainPage'),
  Wordle: page(() => import('./pages/Wordle'), 'WordlePage'),
};

/** 網址 → 頁面。focus 為 true 的頁面（上課、玩遊戲）不顯示導覽列。 */
function resolve(route: Route): { page: ReactNode; focus: boolean } {
  const p = route.parts;
  // 等頁面的程式下載
  const view = (node: ReactNode) => ({ page: <Suspense fallback={<PageLoading />}>{node}</Suspense>, focus: false });
  // 以網址當 key：換到另一堂課時整個重來
  const play = (node: ReactNode) => ({ page: <div key={route.raw}>{node}</div>, focus: true });

  if (p.length === 0) return view(<Home />);
  if (p[0] === 'profile') return view(<P.Profile />);
  if (p[0] === 'me') return view(<P.Me />);
  if (p[0] === 'shop') return view(<P.Shop />);
  if (p[0] === 'settings') return view(<P.Settings />);
  if (p[0] === 'help') return view(<P.Help />);
  if (p[0] === 'art') return view(<P.ArtGallery />);

  if (p[0] === 'l' && (LANGS as string[]).includes(p[1])) {
    const lang = p[1] as LangId;
    // 上課、玩遊戲：等需要的題目和頁面的程式下載完成（預設是學過的字所在的那幾包，見 CourseGate）
    const gated = (node: ReactNode, need: GateNeed = 'active') =>
      play(
        <CourseGate lang={lang} need={need}>
          {node}
        </CourseGate>,
      );
    // 有導覽列的語言頁面
    const langView = (node: ReactNode, need: GateNeed = []) =>
      view(
        <CourseGate lang={lang} need={need}>
          {node}
        </CourseGate>,
      );
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
        return view(<P.Song id={p[3] ?? ''} />);
      case 'concept':
        if (p[4] === 'quiz') return gated(<P.ConceptQuiz lang={lang} id={p[3] ?? ''} />, 'concepts');
        return langView(<P.Concept lang={lang} id={p[3] ?? ''} />, 'concepts');
      case 'mock':
        if (p[3]) return gated(<P.Mock lang={lang} examId={p[3]} />, 'mocks');
        return view(<LangPage lang={lang} tab="mock" />);
      case 'chart':
        return view(<LangPage lang={lang} tab={lang === 'en' ? 'path' : 'chart'} />);
      case 'lesson':
        // 上課只需要這一課所在的那一包
        return gated(<P.Lesson lang={lang} lessonId={p[3] ?? ''} />, { units: [p[3] ?? ''] });
      case 'typing-guide':
        return langView(<P.TypingGuide lang={lang} />);
      case 'review':
        return gated(<P.Review lang={lang} />);
      case 'play':
        if (DRILL_LANG[p[3] as DrillId] === lang) return gated(<P.Drill lang={lang} id={p[3]} />);
        if (p[3] === 'crossword') return gated(<P.Crossword lang={lang} daily={route.query.get('daily') === '1'} />);
        if (p[3] === 'match') return gated(<P.Match lang={lang} />);
        if (p[3] === 'duel') return gated(<P.CardDuel lang={lang} />);
        if (p[3] === 'sevens') return gated(<P.Sevens lang={lang} />);
        if (p[3] === 'bigtwo') return gated(<P.BigTwo lang={lang} />);
        if (p[3] === 'chain') return gated(<P.WordChain lang={lang} />);
        if (p[3] === 'wordle') return gated(<P.Wordle lang={lang} daily={route.query.get('daily') === '1'} />, ['active', 'wordle']);
        if (p[3] === 'blitz') return gated(<P.Blitz lang={lang} />);
        if (p[3] === 'listen') return gated(<P.Listen lang={lang} />);
        if (p[3] === 'typing' && lang !== 'en') return gated(<P.Typing lang={lang} />);
        if (p[3] === 'truefalse') return gated(<P.TrueFalse lang={lang} />);
        if (p[3] === 'pics') return gated(<P.Pictures lang={lang} />);
        if (p[3] === 'sort') return gated(<P.Sort lang={lang} />);
        if (p[3] === 'memory') return gated(<P.Memory lang={lang} kana={lang === 'ja' && route.query.get('kana') === '1'} />);
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
  const { theme, furigana, fx: fxSetting } = s.settings;

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

  // 背景飄落特效：預設不飄，裝備了商店買的才飄（「四季更迭」跟著季節換）
  // 上課、玩遊戲時：不飄背景粒子，也暫停鍵盤秘技偵測（避免和作答按鍵衝突）
  const ambient = s.equip.ambient;
  useEffect(() => {
    setEggKeysEnabled(!focus);
    const kind = ambient === 'season' ? seasonOf(new Date(nowMs())) : ((ambient as AmbientKind | undefined) ?? null);
    fx.setAmbient(!focus && fxSetting ? kind : null);
  }, [focus, fxSetting, ambient]);

  // 點擊特效：首頁、商店、個人頁點一下，點的地方冒出小特效（上課、玩遊戲時不放，免得干擾作答）
  const tap = s.equip.tap;
  useEffect(() => {
    if (!tap || focus) return;
    const h = (e: PointerEvent) => {
      if (e.button !== 0) return;
      fx.tap(e.clientX, e.clientY, tap);
    };
    window.addEventListener('pointerdown', h, { passive: true });
    return () => window.removeEventListener('pointerdown', h);
  }, [tap, focus]);
  return (
    <>
      <WallLayer />
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
