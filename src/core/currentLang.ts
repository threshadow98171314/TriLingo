// 目前選的語言：導覽列的「學習、練功、查詢」和「今天」頁的「開始今天的學習」跟著它。
// 進到哪個語言的頁面就換成那個語言；只存在這台裝置（不放進存檔，換裝置時用最近在學的語言）。
import { useSyncExternalStore } from 'react';
import { lastStudiedLang } from './progress';
import type { Save } from './save';
import { useSave } from './store';
import { LANGS, type LangId } from './types';

const KEY = 'trilingo.lang.v1';

function read(): LangId | null {
  try {
    const v = localStorage.getItem(KEY);
    return v && (LANGS as string[]).includes(v) ? (v as LangId) : null;
  } catch {
    return null;
  }
}

let chosen: LangId | null = typeof localStorage === 'undefined' ? null : read();
const subs = new Set<() => void>();

/** 目前的語言：選過的語言，否則是最近在學的，都沒有就是英文 */
export function currentLang(s: Save): LangId {
  return chosen ?? lastStudiedLang(s) ?? 'en';
}

export function setCurrentLang(lang: LangId) {
  if (chosen === lang) return;
  chosen = lang;
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* 無痕模式：只在這次開啟期間有效 */
  }
  subs.forEach((f) => f());
}

export function useCurrentLang(): LangId {
  useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => chosen,
  );
  return currentLang(useSave());
}
