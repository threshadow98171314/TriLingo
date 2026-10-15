// 日文打字題的批改：用日文輸入法作答，假名、漢字、兩者混打都算對。
// 例如答案是「ちょっと待[ま]って」，打「ちょっと待って」或「ちょっとまって」都可以。

import { furiKana, furiSegs, toHiragana } from './furigana';

/** 標點、空白、符號：比對時一律忽略 */
const PUNCT = /[\s　。、，,．.！!？?「」『』（）()・…‥〜~：:；;"'“”‘’]/g;

/** 正規化：全形英數轉半形、半形片假名轉全形（NFKC），去掉標點與空白 */
export function normJa(s: string): string {
  return s.normalize('NFKC').replace(PUNCT, '').toLowerCase();
}

/** 比較用：再把片假名折成平假名（コーヒー＝こーひー） */
const fold = (s: string) => toHiragana(normJa(s));

/**
 * 把答案拆成一段一段，每段列出可接受的寫法：
 * 有振假名的漢字段可以打漢字或讀音，其他部分照原樣。
 */
function segmentsOf(furi: string, f: (s: string) => string): string[][] {
  return furiSegs(furi)
    .map((g) => (g.r ? [f(g.t), f(g.r)] : [f(g.t)]))
    .filter((alts) => alts.some((a) => a.length > 0));
}

/** input 能不能由每一段各挑一種寫法依序接起來 */
function canBuild(input: string, segs: string[][]): boolean {
  let reach = new Set([0]);
  for (const alts of segs) {
    const next = new Set<number>();
    for (const pos of reach) {
      for (const a of alts) if (input.startsWith(a, pos)) next.add(pos + a.length);
    }
    if (!next.size) return false;
    reach = next;
  }
  return reach.has(input.length);
}

export interface JaCheck {
  /** 算不算對 */
  ok: boolean;
  /** 平假名／片假名也一樣才算完全吻合（例如コーヒー打成こーひー：算對，但要提醒） */
  exact: boolean;
}

/** 判斷打出來的日文是否符合答案（furi 是含「漢字[よみ]」標註的答案） */
export function checkJa(input: string, furi: string): JaCheck {
  const raw = normJa(input);
  if (!raw) return { ok: false, exact: false };
  if (canBuild(raw, segmentsOf(furi, normJa))) return { ok: true, exact: true };
  return { ok: canBuild(toHiragana(raw), segmentsOf(furi, fold)), exact: false };
}

/** 答案的假名讀音（去掉標點），用來做提示 */
export function readingOf(furi: string): string {
  return normJa(furiKana(furi));
}

/** 提示：顯示第一個字，其餘用圓點表示長度，例如「ち・・・・」 */
export function kanaHint(furi: string): string {
  const chars = Array.from(readingOf(furi));
  return chars.map((c, i) => (i === 0 ? c : '・')).join('');
}

/** 輸入裡有沒有漢字（答錯時用來判斷要不要提供「我的答案也對」） */
export const hasKanjiInput = (s: string) => /[㐀-鿿々]/.test(s);
