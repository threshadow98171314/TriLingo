// 導覽的五個區域：今天、學習、練功、查詢、我的。網址（hash 的各段）屬於哪個區域、各區域連到哪裡、
// 換語言時要去哪裡。純函式，畫面在 components/Layout.tsx。
import type { LangId } from './types';

export type Section = 'today' | 'learn' | 'practice' | 'lookup' | 'me';

export const SECTIONS: { id: Section; icon: string; label: string; desc: string }[] = [
  { id: 'today', icon: '☀️', label: '今天', desc: '今天的學習、每日任務、三種語言的進度' },
  { id: 'learn', icon: '📚', label: '學習', desc: '學習路線和單字庫：一課一課往前走' },
  { id: 'practice', icon: '🎮', label: '練功', desc: '複習、小遊戲、錯題本、模擬考' },
  { id: 'lookup', icon: '🔍', label: '查詢', desc: '搜尋、圖鑑、觀念講堂、五十音表／字母表、日文歌' },
  { id: 'me', icon: '', label: '我的', desc: '名片與外觀、成就、商店、設定' },
];

const ME = new Set(['me', 'profile', 'shop', 'settings', 'help', 'art']);
const LEARN = new Set(['s', 'lesson', 'bank']);
const PRACTICE = new Set(['arcade', 'mistakes', 'weak', 'mock', 'play', 'review']);
const LOOKUP = new Set(['search', 'dex', 'concepts', 'concept', 'chart', 'songs', 'song', 'typing-guide']);

/** 網址屬於哪個區域（找不到的頁面回傳 null） */
export function sectionOf(parts: string[]): Section | null {
  if (parts.length === 0) return 'today';
  if (ME.has(parts[0])) return 'me';
  if (parts[0] !== 'l' || !parts[1]) return null;
  const p = parts[2];
  if (p === undefined || LEARN.has(p)) return 'learn';
  if (p === 'today') return 'today';
  if (PRACTICE.has(p)) return 'practice';
  if (LOOKUP.has(p)) return 'lookup';
  return null;
}

/** 區域的網址：學習、練功、查詢跟著目前的語言 */
export function sectionPath(sec: Section, lang: LangId): string {
  switch (sec) {
    case 'today':
      return '/';
    case 'learn':
      return `/l/${lang}`;
    case 'practice':
      return `/l/${lang}/arcade`;
    case 'lookup':
      return `/l/${lang}/search`;
    case 'me':
      return '/me';
  }
}

/**
 * 換語言：在語言的頁面上，換成另一個語言的同一個分頁（那個語言沒有的分頁回到同一區的第一頁）；
 * 不在語言的頁面上（今天、我的）就不換頁，回傳 null。
 */
export function switchLangPath(parts: string[], to: LangId): string | null {
  if (parts[0] !== 'l' || !parts[1]) return null;
  const base = `/l/${to}`;
  switch (parts[2]) {
    case 'arcade':
    case 'play':
    case 'review':
      return `${base}/arcade`;
    case 'mistakes':
    case 'weak':
      return `${base}/mistakes`;
    case 'mock':
      return `${base}/mock`;
    case 'concepts':
    case 'concept':
      return `${base}/concepts`;
    case 'chart':
      return to === 'en' ? `${base}/dex` : `${base}/chart`;
    case 'typing-guide':
      return to === 'en' ? `${base}/dex` : `${base}/typing-guide`;
    case 'songs':
    case 'song':
      return to === 'ja' ? `${base}/songs` : `${base}/dex`;
    case 'search':
    case 'dex':
      return `${base}/${parts[2]}`;
    case 'bank':
      return `${base}/bank`;
    default:
      return base;
  }
}
