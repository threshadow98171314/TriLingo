// 猜詞（類似 Wordle）：六次機會猜出一個字。英文猜 5 個字母、日文猜 4 個假名、韓文猜 6 個字母（子音、母音拆開）。
// 每猜一次，格子會變色：綠色＝位置正確、黃色＝有這個字但位置不對、灰色＝沒有。
import { hashStr, mulberry32 } from '../core/rng';
import type { LangId, VocabItem } from '../core/types';
import { isKanaStr, toHiragana } from './furigana';
import { decompose } from './typing';

export type Mark = 'hit' | 'near' | 'miss';

export const TRIES = 6;
export const WORD_LEN: Record<LangId, number> = { en: 5, ja: 4, ko: 6 };

/** 鍵盤上沒有的複合母音、複合收尾音拆成兩個字母（和韓文鍵盤的打法一樣） */
const KO_SPLIT: Record<string, string> = {
  ㅘ: 'ㅗㅏ',
  ㅙ: 'ㅗㅐ',
  ㅚ: 'ㅗㅣ',
  ㅝ: 'ㅜㅓ',
  ㅞ: 'ㅜㅔ',
  ㅟ: 'ㅜㅣ',
  ㅢ: 'ㅡㅣ',
  ㄳ: 'ㄱㅅ',
  ㄵ: 'ㄴㅈ',
  ㄶ: 'ㄴㅎ',
  ㄺ: 'ㄹㄱ',
  ㄻ: 'ㄹㅁ',
  ㄼ: 'ㄹㅂ',
  ㄽ: 'ㄹㅅ',
  ㄾ: 'ㄹㅌ',
  ㄿ: 'ㄹㅍ',
  ㅀ: 'ㄹㅎ',
  ㅄ: 'ㅂㅅ',
};

/** 韓文字拆成鍵盤上的字母：사과 → ㅅㅏㄱㅗㅏ */
export function jamoOf(word: string): string[] | null {
  const out: string[] = [];
  for (const ch of word) {
    const j = decompose(ch);
    if (!j) return null;
    for (const x of [j.cho, j.jung, j.jong]) if (x) out.push(...Array.from(KO_SPLIT[x] ?? x));
  }
  return out;
}

/** 一個字拆成猜詞的格子；不適合當題目時回傳 null */
export function tilesOf(i: VocabItem, lang: LangId): string[] | null {
  if (i.kind !== 'word') return null;
  if (lang === 'en') return /^[a-z]+$/.test(i.w) ? Array.from(i.w) : null;
  if (lang === 'ja') {
    const r = i.r ?? i.w;
    return isKanaStr(r) ? Array.from(toHiragana(r)) : null;
  }
  return /^[가-힣]+$/.test(i.w) ? jamoOf(i.w) : null;
}

/** 可以當題目的字（長度剛好）；同一個寫法只留一個 */
export function wordlePool(items: VocabItem[], lang: LangId): VocabItem[] {
  const seen = new Set<string>();
  const out: VocabItem[] = [];
  for (const i of items) {
    const t = tilesOf(i, lang);
    if (!t || t.length !== WORD_LEN[lang]) continue;
    const k = t.join('');
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(i);
  }
  return out;
}

/** 每日題目：用日期當種子，同一天每個人都一樣 */
export function dailyPick<T>(pool: T[], day: string, lang: LangId): T | undefined {
  if (!pool.length) return undefined;
  return pool[Math.floor(mulberry32(hashStr(`wordle:${lang}:${day}`))() * pool.length)];
}

/** 評分：先標出位置正確的，剩下的字母才算「有但位置不對」（重複的字母不會多算） */
export function score(guess: readonly string[], answer: readonly string[]): Mark[] {
  const res: Mark[] = guess.map(() => 'miss');
  const left = new Map<string, number>();
  answer.forEach((a, i) => {
    if (guess[i] === a) res[i] = 'hit';
    else left.set(a, (left.get(a) ?? 0) + 1);
  });
  guess.forEach((g, i) => {
    if (res[i] === 'hit') return;
    const n = left.get(g) ?? 0;
    if (n > 0) {
      res[i] = 'near';
      left.set(g, n - 1);
    }
  });
  return res;
}

const RANK: Record<Mark, number> = { miss: 0, near: 1, hit: 2 };

/** 鍵盤上每個鍵目前最好的狀態 */
export function keyMarks(rows: readonly string[][], marks: readonly Mark[][]): Map<string, Mark> {
  const out = new Map<string, Mark>();
  rows.forEach((row, r) =>
    row.forEach((k, i) => {
      const m = marks[r][i];
      const old = out.get(k);
      if (!old || RANK[m] > RANK[old]) out.set(k, m);
    }),
  );
  return out;
}

/** 猜中時的 XP：越早猜中越多；看過提示少一點 */
export function wordleXp(guesses: number, solved: boolean, hinted: boolean): number {
  if (!solved) return 3;
  return 8 + (TRIES - guesses) * 3 - (hinted ? 4 : 0);
}

/** 日文鍵盤：五十音表（一欄一行），加上濁音、半濁音、小字與長音 */
export const JA_KEYS: string[][] = [
  ['あ', 'い', 'う', 'え', 'お'],
  ['か', 'き', 'く', 'け', 'こ'],
  ['さ', 'し', 'す', 'せ', 'そ'],
  ['た', 'ち', 'つ', 'て', 'と'],
  ['な', 'に', 'ぬ', 'ね', 'の'],
  ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ['ま', 'み', 'む', 'め', 'も'],
  ['や', 'ゆ', 'よ', 'ゃ', 'ゅ'],
  ['ら', 'り', 'る', 'れ', 'ろ'],
  ['わ', 'を', 'ん', 'ょ', 'ー'],
  ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
  ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
  ['だ', 'ぢ', 'づ', 'で', 'ど'],
  ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
  ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
  ['っ', 'ぁ', 'ぃ', 'ぅ', 'ぇ'],
];

/** 韓文鍵盤（兩組式），第一排含 Shift 的雙子音 */
export const KO_ROWS: string[][] = [
  ['ㅃ', 'ㅉ', 'ㄸ', 'ㄲ', 'ㅆ', 'ㅒ', 'ㅖ'],
  ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
  ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
  ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'],
];

export const EN_ROWS: string[][] = [Array.from('qwertyuiop'), Array.from('asdfghjkl'), Array.from('zxcvbnm')];

/** 實體鍵盤的按鍵 → 猜詞的字母（韓文用兩組式配置） */
export function keyFromEvent(key: string, lang: LangId, koByKey: Record<string, string>): string | null {
  if (lang === 'en') return /^[a-zA-Z]$/.test(key) ? key.toLowerCase() : null;
  if (lang === 'ko') return koByKey[key] ?? koByKey[key.toLowerCase()] ?? null;
  return null;
}
