// 存檔的資料結構。整份存檔放在 localStorage，可以從設定頁匯出／匯入。
import type { ItemProg, StreakState } from './logic';
import type { CosmeticKind, MysteryOffer } from './shop';
import type { CustomSong, SongLyrics } from './songs';
import type { LangId } from './types';

export interface Settings {
  /** 每日目標（三種語言合計的 XP） */
  dailyGoal: number;
  sfx: boolean;
  /** 作答後自動唸出正確答案 */
  autoSpeak: boolean;
  ttsRate: number;
  /** 顯示羅馬拼音輔助 */
  romaji: boolean;
  /** 顯示漢字上的振假名 */
  furigana: boolean;
  theme: 'dark' | 'light' | 'auto';
  voices: Partial<Record<LangId, string>>;
  /** 粒子特效、震動、橫幅 */
  fx: boolean;
  /** 背景的季節特效（落葉、櫻花、雪花…） */
  seasonal: boolean;
  /** 日文打字題（需要日文輸入法） */
  jaTyping: boolean;
  /** 韓文打字題（需要韓文鍵盤） */
  koTyping: boolean;
}

/** 單日紀錄：熱力圖、每日目標、每日任務都從這裡計算 */
export interface DayLog {
  xp: Record<LangId, number>;
  lessons: number;
  perfect: number;
  /** 當日最高連擊 */
  combo: number;
  reviews: number;
  crossword: number;
  match: number;
  /** 當日限時快答最高分 */
  blitz: number;
  /** 當日新學會的項目數 */
  words: number;
  goal?: boolean;
  tri?: boolean;
  /** 這天沒學習，靠連勝保護撐住 */
  frozen?: boolean;
  dailyCw?: Partial<Record<LangId, boolean>>;
  /** 每日猜詞完成了沒 */
  dailyWordle?: Partial<Record<LangId, boolean>>;
  /** 已領取獎勵的任務 id */
  claimed?: string[];
  chest?: boolean;
}

export interface LessonRec {
  stars: number;
  plays: number;
}

/** 一份模擬考的紀錄（成績是答對率 0–100） */
export interface MockRec {
  best: number;
  last: number;
  plays: number;
  /** 最後一次考的時間 */
  at: number;
}

export interface Stats {
  lessons: number;
  perfect: number;
  maxCombo: number;
  bosses: number;
  crosswords: number;
  dailyCw: number;
  matches: number;
  listens: number;
  reviews: number;
  goalDays: number;
  triDays: number;
  answers: number;
  correct: number;
  night: number;
  early: number;
  /** 目前連續全對的課數與最佳紀錄 */
  perfectRun: number;
  perfectRunBest: number;
  /** 60 秒內全對過關的次數 */
  speedruns: number;
  bossPerfect: number;
  /** 答對率不到一半仍然把課上完的次數 */
  grit: number;
  luckyStars: number;
  goldenChests: number;
  /** 完成打字特訓（日文、韓文）的次數 */
  typings: number;
  /** 完成模擬考的次數 */
  mocks: number;
  truefalses: number;
  memories: number;
  /** 扭蛋抽過的次數 */
  gacha: number;
  /** 完成看圖猜字、分類大挑戰的次數 */
  pics: number;
  sorts: number;
  /** 完成觀念講堂文章（含小測驗）的次數 */
  concepts: number;
  /** 單字卡牌對決：結束的冒險次數、通關次數 */
  duels: number;
  duelWins: number;
  /** 猜詞：猜中的次數 */
  wordles: number;
  /** 接龍對戰：玩完的場數、贏的場數 */
  chains: number;
  chainWins: number;
}

/** 道具庫存（連勝保護在 streak.freezes、雙倍 XP 在 boostUntil） */
export interface Inventory {
  /** 連擊護符 */
  shield: number;
  /** 幸運草：剩下幾堂課必定掉寶箱 */
  clover: number;
  /** 時光沙漏 */
  hourglass: number;
}

/** 每日神秘商品：揭曉時把當天的三件商品記下來（之後買了東西，商品也不會變） */
export interface MysteryState {
  day: string;
  offers?: MysteryOffer[];
  /** 買過的格子（0、1、2） */
  bought?: number[];
}

/** 舊版一天只有一件（offer、bought: true）：轉成三格的格式 */
export function migrateMystery(raw: unknown): MysteryState {
  const m = raw as { day?: unknown; offers?: unknown; offer?: MysteryOffer; bought?: unknown } | null | undefined;
  if (!m || typeof m !== 'object' || typeof m.day !== 'string') return { day: '' };
  if (Array.isArray(m.offers)) {
    const out: MysteryState = { day: m.day, offers: m.offers as MysteryOffer[] };
    if (Array.isArray(m.bought) && m.bought.length) out.bought = m.bought as number[];
    return out;
  }
  const out: MysteryState = { day: m.day };
  if (m.offer) out.offers = [m.offer];
  if (m.bought === true) out.bought = [0];
  return out;
}

/** 貼紙板上的一張貼紙：位置 x、y 是相對於板子的 0～1，大小 s 是板子寬度的比例，r 是角度 */
export interface BoardItem {
  /** 唯一編號（同一種貼紙可以貼好幾張） */
  k: number;
  id: string;
  x: number;
  y: number;
  s: number;
  r: number;
}

/** 貼紙板：個人頁可以把收集到的貼紙貼上去布置 */
export interface BoardState {
  items: BoardItem[];
  /** 板子的背景（軟木板、筆記本、黑板…） */
  bg: string;
  /** 最後修改時間（雲端同步取比較新的那份） */
  at: number;
}

export const BOARD_LIMITS = { max: 30, minSize: 0.08, maxSize: 0.5 };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** 整理一張貼紙的數值（拖出界、縮太小、轉超過一圈） */
export function cleanBoardItem(it: BoardItem): BoardItem {
  let r = Math.round(it.r) % 360;
  if (r > 180) r -= 360;
  if (r <= -180) r += 360;
  return {
    k: it.k,
    id: it.id,
    x: Math.round(clamp(it.x, 0, 1) * 1000) / 1000,
    y: Math.round(clamp(it.y, 0, 1) * 1000) / 1000,
    s: Math.round(clamp(it.s, BOARD_LIMITS.minSize, BOARD_LIMITS.maxSize) * 1000) / 1000,
    r,
  };
}

export function migrateBoard(raw: unknown): BoardState {
  const b = raw as Partial<BoardState> | null | undefined;
  if (!b || typeof b !== 'object' || !Array.isArray(b.items)) return { items: [], bg: 'cork', at: 0 };
  const items = b.items
    .filter((it): it is BoardItem => !!it && typeof it === 'object' && typeof it.id === 'string' && [it.k, it.x, it.y, it.s, it.r].every((n) => typeof n === 'number' && Number.isFinite(n)))
    .map(cleanBoardItem)
    .slice(0, BOARD_LIMITS.max);
  return { items, bg: typeof b.bg === 'string' ? b.bg : 'cork', at: typeof b.at === 'number' ? b.at : 0 };
}

export interface Save {
  v: 1;
  created: number;
  /** 上次做過換日處理的日期 */
  day: string;
  name: string;
  avatar: string;
  avatars: string[];
  settings: Settings;
  /** 各語言累積的段位 XP */
  xp: Record<LangId, number>;
  coins: number;
  coinsEarned: number;
  streak: StreakState;
  /** 雙倍 XP 的結束時間（毫秒） */
  boostUntil: number;
  days: Record<string, DayLog>;
  lessons: Record<string, LessonRec>;
  items: Record<string, ItemProg>;
  /** 已解鎖的成就 → 解鎖時間 */
  ach: Record<string, number>;
  /** 已發現的彩蛋 → 發現時間 */
  eggs: Record<string, number>;
  /** 模擬考成績（id → 紀錄） */
  mocks: Record<string, MockRec>;
  /** 看過的新手引導與說明（id → 看過的時間），看過就不再跳出 */
  guide: Record<string, number>;
  stats: Stats;
  best: {
    blitz: Record<LangId, number>;
    /** 配對消消樂、記憶翻牌：最短秒數 */
    match: Partial<Record<LangId, number>>;
    memory: Partial<Record<LangId, number>>;
    /** 真假快判：最高分 */
    tf: Record<LangId, number>;
    /** 單字卡牌對決：抵達的最高層數（通關為 10） */
    duel: Record<LangId, number>;
    /** 接龍對戰：最高分 */
    chain: Record<LangId, number>;
  };
  /** 各語言上次停留的關卡 */
  stage: Partial<Record<LangId, string>>;
  /** 雲端同步合併用：設定／個人資料最後修改時間 */
  prefsAt: number;
  /** 雲端同步合併用：金幣（以及道具庫存）最後變動時間 */
  coinsAt: number;
  /** 擁有的外觀，例如 frame:sakura、skin:matcha */
  owned: string[];
  /** 穿戴中的外觀：種類 → id */
  equip: Partial<Record<CosmeticKind, string>>;
  inv: Inventory;
  /** 貼紙收藏：id → 張數 */
  stickers: Record<string, number>;
  /** 貼紙板的布置 */
  board: BoardState;
  mystery: MysteryState;
  /** 聽歌學日語：使用者自己貼的歌詞（歌的 id → 歌詞與對時），只存在自己的存檔裡 */
  songs: Record<string, SongLyrics>;
  /** 使用者自己加的歌 */
  customSongs: CustomSong[];
}

export const FREE_AVATARS = ['🐣', '🐱', '🐶', '🦊'];

export const emptyDay = (): DayLog => ({
  xp: { en: 0, ja: 0, ko: 0 },
  lessons: 0,
  perfect: 0,
  combo: 0,
  reviews: 0,
  crossword: 0,
  match: 0,
  blitz: 0,
  words: 0,
});

export function defaultSave(now: number): Save {
  return {
    v: 1,
    created: now,
    day: '',
    name: '學習者',
    avatar: FREE_AVATARS[0],
    avatars: [...FREE_AVATARS],
    settings: { dailyGoal: 50, sfx: true, autoSpeak: true, ttsRate: 1, romaji: true, furigana: true, theme: 'dark', voices: {}, fx: true, seasonal: true, jaTyping: true, koTyping: true },
    xp: { en: 0, ja: 0, ko: 0 },
    coins: 0,
    coinsEarned: 0,
    streak: { count: 0, best: 0, last: '', freezes: 0 },
    boostUntil: 0,
    days: {},
    lessons: {},
    items: {},
    ach: {},
    eggs: {},
    mocks: {},
    guide: {},
    stats: {
      lessons: 0,
      perfect: 0,
      maxCombo: 0,
      bosses: 0,
      crosswords: 0,
      dailyCw: 0,
      matches: 0,
      listens: 0,
      reviews: 0,
      goalDays: 0,
      triDays: 0,
      answers: 0,
      correct: 0,
      night: 0,
      early: 0,
      perfectRun: 0,
      perfectRunBest: 0,
      speedruns: 0,
      bossPerfect: 0,
      grit: 0,
      luckyStars: 0,
      goldenChests: 0,
      typings: 0,
      mocks: 0,
      truefalses: 0,
      memories: 0,
      gacha: 0,
      pics: 0,
      sorts: 0,
      concepts: 0,
      duels: 0,
      duelWins: 0,
      wordles: 0,
      chains: 0,
      chainWins: 0,
    },
    best: { blitz: { en: 0, ja: 0, ko: 0 }, match: {}, memory: {}, tf: { en: 0, ja: 0, ko: 0 }, duel: { en: 0, ja: 0, ko: 0 }, chain: { en: 0, ja: 0, ko: 0 } },
    stage: {},
    prefsAt: 0,
    coinsAt: 0,
    owned: [],
    equip: {},
    inv: { shield: 0, clover: 0, hourglass: 0 },
    stickers: {},
    board: { items: [], bg: 'cork', at: 0 },
    mystery: { day: '' },
    songs: {},
    customSongs: [],
  };
}

/** 讀取舊存檔時補上後來新增的欄位 */
export function migrate(raw: unknown, now: number): Save {
  const d = defaultSave(now);
  if (!raw || typeof raw !== 'object') return d;
  const x = raw as Partial<Save>;
  return {
    ...d,
    ...x,
    v: 1,
    settings: { ...d.settings, ...x.settings },
    xp: { ...d.xp, ...x.xp },
    streak: { ...d.streak, ...x.streak },
    stats: { ...d.stats, ...x.stats },
    best: {
      blitz: { ...d.best.blitz, ...x.best?.blitz },
      match: { ...x.best?.match },
      memory: { ...x.best?.memory },
      tf: { ...d.best.tf, ...x.best?.tf },
      duel: { ...d.best.duel, ...x.best?.duel },
      chain: { ...d.best.chain, ...x.best?.chain },
    },
    days: x.days ?? {},
    lessons: x.lessons ?? {},
    items: x.items ?? {},
    ach: x.ach ?? {},
    eggs: x.eggs ?? {},
    mocks: x.mocks ?? {},
    guide: x.guide ?? {},
    stage: x.stage ?? {},
    prefsAt: x.prefsAt ?? 0,
    coinsAt: x.coinsAt ?? 0,
    avatars: x.avatars?.length ? x.avatars : d.avatars,
    owned: x.owned ?? [],
    equip: x.equip ?? {},
    inv: { ...d.inv, ...x.inv },
    stickers: x.stickers ?? {},
    board: migrateBoard(x.board),
    mystery: migrateMystery(x.mystery),
    songs: x.songs ?? {},
    customSongs: x.customSongs ?? [],
  };
}
