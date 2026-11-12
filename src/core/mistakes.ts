// 錯題本：答錯過、而且還沒有精通的字，越常錯、越不熟的排越前面。弱點特訓就從最前面的字出題。
// 只看存檔（每個字的答對、答錯次數與熟練度），純函式；畫面在 pages/tabs/Mistakes.tsx、pages/Practice.tsx。
import { mastery, type ItemProg } from './logic';
import type { Save } from './save';
import type { LangId } from './types';

/** 一次弱點特訓最多練幾個字 */
export const WEAK_BATCH = 10;

/**
 * 有多常錯：答錯率（前後各加一次假想的對錯，次數少的不會一下子衝到最前面）× 答錯次數的權重。
 * 例如錯 3 對 1 比錯 1 對 0 更前面。
 */
export function mistakeScore(p: ItemProg): number {
  const rate = (p.ng + 1) / (p.ok + p.ng + 2);
  return rate * Math.log2(p.ng + 1);
}

export interface Mistakes {
  /** 錯題本裡的字，最該練的排最前面 */
  ids: string[];
  /** 答錯過、現在已經精通的字（已經克服了） */
  conquered: number;
}

export function mistakesOf(s: Save, lang: LangId): Mistakes {
  const prefix = `${lang}.`;
  const list: [string, ItemProg][] = [];
  let conquered = 0;
  for (const [id, p] of Object.entries(s.items)) {
    if (!id.startsWith(prefix) || p.ng === 0) continue;
    if (mastery(p) === 4) conquered++;
    else list.push([id, p]);
  }
  list.sort(([, a], [, b]) => mistakeScore(b) - mistakeScore(a) || a.s - b.s || b.t - a.t);
  return { ids: list.map(([id]) => id), conquered };
}
