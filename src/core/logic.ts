// 不依賴瀏覽器的純邏輯：連勝天數、間隔複習（SRS）。有對應的單元測試。
import { addDays, diffDays } from './date';

// ───────── 連勝 ─────────

export interface StreakState {
  count: number;
  best: number;
  /** 最後一次有學習的日期（YYYY-MM-DD），尚未開始為空字串 */
  last: string;
  /** 持有的連勝保護數量 */
  freezes: number;
}

/**
 * 換日處理：中間有缺席的日子時，用連勝保護補上；保護不夠就歸零。
 * 回傳被保護的日期（用來在熱力圖上標記）。
 */
export function rolloverStreak(s: StreakState, today: string): { streak: StreakState; frozen: string[]; broken: boolean } {
  if (!s.last || s.count === 0) return { streak: s, frozen: [], broken: false };
  const missed = diffDays(s.last, today) - 1;
  if (missed <= 0) return { streak: s, frozen: [], broken: false };
  if (s.freezes >= missed) {
    const frozen = Array.from({ length: missed }, (_, i) => addDays(s.last, i + 1));
    return { streak: { ...s, freezes: s.freezes - missed, last: addDays(today, -1) }, frozen, broken: false };
  }
  return { streak: { ...s, count: 0 }, frozen: [], broken: true };
}

/** 今天有學習活動時呼叫（需先做過 rolloverStreak）。 */
export function touchStreak(s: StreakState, today: string): { streak: StreakState; extended: boolean } {
  if (s.last === today && s.count > 0) return { streak: s, extended: false };
  const cont = s.count > 0 && s.last === addDays(today, -1);
  const count = cont ? s.count + 1 : 1;
  return { streak: { ...s, count, best: Math.max(s.best, count), last: today }, extended: true };
}

// ───────── 間隔複習 ─────────

export interface ItemProg {
  /** 熟練度 1..7，對應 INTERVALS 的間隔天數 */
  s: number;
  /** 下次複習日（dayNum） */
  due: number;
  ok: number;
  ng: number;
  /** 最後作答時間 */
  t: number;
}

export const INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120];
export const MAX_STRENGTH = INTERVALS.length - 1;

/** 第一次學到這個項目：隔天複習 */
export function newProg(correct: boolean, day: number, now: number): ItemProg {
  return { s: 1, due: day + 1, ok: correct ? 1 : 0, ng: correct ? 0 : 1, t: now };
}

/** 複習模式：答對拉長間隔，答錯退兩級並於隔天再複習 */
export function srsReview(p: ItemProg, correct: boolean, day: number, now: number): ItemProg {
  if (correct) {
    const s = Math.min(MAX_STRENGTH, p.s + 1);
    return { ...p, s, due: day + INTERVALS[s], ok: p.ok + 1, t: now };
  }
  return { ...p, s: Math.max(1, p.s - 2), due: day + 1, ng: p.ng + 1, t: now };
}

/** 其他模式（課程重玩、小遊戲）：答對不拉長間隔，答錯會提早進入複習 */
export function srsTouch(p: ItemProg, correct: boolean, day: number, now: number): ItemProg {
  if (correct) return { ...p, ok: p.ok + 1, t: now };
  return { ...p, s: Math.max(1, p.s - 1), due: Math.min(p.due, day), ng: p.ng + 1, t: now };
}

/** 0 未學 / 1 新學 / 2 學習中 / 3 熟悉 / 4 精通 */
export function mastery(p: ItemProg | undefined): 0 | 1 | 2 | 3 | 4 {
  if (!p) return 0;
  if (p.s <= 1) return 1;
  if (p.s <= 3) return 2;
  if (p.s <= 5) return 3;
  return 4;
}

export const MASTERY_LABEL = ['未學', '新學', '學習中', '熟悉', '精通'];
