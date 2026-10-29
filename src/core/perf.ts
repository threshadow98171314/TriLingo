// 特效品質：「自動」「完整」「精簡」。
// 效能是裝置的事（同一份存檔，手機和電腦跑起來不一樣），所以存在這台裝置的 localStorage，不跟著雲端同步。
// 自動：先看裝置規格（CPU 核心數、記憶體、省數據模式）事先判斷；播特效時如果一直掉幀，再自動改成精簡並記住。
// 精簡會：粒子減半、canvas 用 1 倍解析度、導覽列不做毛玻璃、網站背景和名牌的循環動畫停下來（樣式在 styles.css 的 .perf-lite）。
import { useSyncExternalStore } from 'react';
import { celebrate } from './celebrate';
import { onJank, setFxLite } from './fx';

export type FxQuality = 'auto' | 'high' | 'lite';

interface PerfPrefs {
  mode: FxQuality;
  /** 自動模式上次偵測到卡頓的時間 */
  slowAt?: number;
}

const KEY = 'trilingo.perf.v1';
/** 自動模式偵測到卡頓之後，這段期間都用精簡（之後再給完整一次機會） */
const SLOW_MEMORY_MS = 30 * 86_400_000;

function read(): PerfPrefs {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || 'null') as Partial<PerfPrefs> | null;
    if (p && (p.mode === 'auto' || p.mode === 'high' || p.mode === 'lite')) return { mode: p.mode, slowAt: typeof p.slowAt === 'number' ? p.slowAt : undefined };
  } catch {
    /* 無痕模式或資料損毀：用預設值 */
  }
  return { mode: 'auto' };
}

function write(p: PerfPrefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* 存不了就只在這次開啟期間有效 */
  }
}

interface DeviceHints {
  hardwareConcurrency?: number;
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

/** 從規格判斷是不是比較吃力的裝置：雙核心、記憶體 2 GB 以下、四核心配 4 GB 以下，或開了省數據 */
export function weakDevice(n: DeviceHints): boolean {
  if (n.connection?.saveData) return true;
  const cores = n.hardwareConcurrency || 8;
  const mem = n.deviceMemory ?? 8;
  return cores <= 2 || mem <= 2 || (cores <= 4 && mem <= 4);
}

/** 依設定、卡頓紀錄與裝置規格決定要不要用精簡 */
export function decideLite(p: PerfPrefs, hints: DeviceHints, now: number): boolean {
  if (p.mode !== 'auto') return p.mode === 'lite';
  if (p.slowAt && now - p.slowAt < SLOW_MEMORY_MS) return true;
  return weakDevice(hints);
}

let prefs: PerfPrefs = { mode: 'auto' };
let snap = { mode: 'auto' as FxQuality, lite: false };
const subs = new Set<() => void>();

function apply() {
  const lite = decideLite(prefs, navigator as DeviceHints, Date.now());
  snap = { mode: prefs.mode, lite };
  setFxLite(lite);
  document.documentElement.classList.toggle('perf-lite', lite);
  subs.forEach((f) => f());
}

export function initPerf() {
  prefs = read();
  apply();
  onJank(() => {
    if (prefs.mode !== 'auto' || snap.lite) return;
    prefs = { ...prefs, slowAt: Date.now() };
    write(prefs);
    apply();
    celebrate({ type: 'toast', icon: '⚡', title: '特效已自動改成精簡', text: '偵測到畫面有點卡，減少特效讓操作更順。可以到設定 → 顯示調整。' });
  });
}

/** 使用者自己選；改選「自動」時清掉之前的卡頓紀錄，重新判斷 */
export function setFxQuality(mode: FxQuality) {
  prefs = { mode };
  write(prefs);
  apply();
}

export function usePerf(): { mode: FxQuality; lite: boolean } {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => snap,
  );
}
