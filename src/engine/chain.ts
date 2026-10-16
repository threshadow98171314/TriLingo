// 接龍對戰的規則：日文しりとり、韓文끝말잇기、英文 Word Chain，和電腦輪流接字。
// - 日文：用讀音接（ー看前一個假名、小字看大字），用「ん」結尾的字會輸。
// - 韓文：接最後一個字，可以套用頭音法則（력→역、로→노…）。
// - 英文：接最後一個字母。
// 字庫是整個課程的單字；電腦只「認得」其中一部分（難度越高認得越多），想不出字就認輸。
import type { Rng } from '../core/rng';
import type { LangId, VocabItem } from '../core/types';
import { isKanaStr, toHiragana } from './furigana';
import { compose, CHO, JUNG } from './hangul';
import { normJa } from './jaInput';

export interface ChainWord {
  id: string;
  item: VocabItem;
  /** 比對用：英文小寫、日文平假名讀音、韓文原文 */
  key: string;
  head: string;
  tail: string;
}

export type Level = 'easy' | 'normal' | 'hard';

export const LEVELS: Record<Level, { name: string; know: number; seconds: number; desc: string }> = {
  easy: { name: '輕鬆', know: 0.35, seconds: 45, desc: '電腦認得的字比較少，每回合 45 秒。' },
  normal: { name: '普通', know: 0.7, seconds: 30, desc: '電腦認得大部分的字，每回合 30 秒。' },
  hard: { name: '困難', know: 1, seconds: 20, desc: '電腦認得所有的字，還會故意挑難接的字給你，每回合 20 秒。' },
};

const SMALL: Record<string, string> = { ぁ: 'あ', ぃ: 'い', ぅ: 'う', ぇ: 'え', ぉ: 'お', ゃ: 'や', ゅ: 'ゆ', ょ: 'よ', ゎ: 'わ' };

/** 日文：要接的假名（去掉結尾的長音、促音，小字換成大字） */
export function jaTail(kana: string): string {
  const cs = Array.from(kana);
  let i = cs.length - 1;
  while (i > 0 && (cs[i] === 'ー' || cs[i] === 'っ')) i--;
  return SMALL[cs[i]] ?? cs[i];
}

export function chainWordOf(i: VocabItem, lang: LangId): ChainWord | null {
  if (i.kind !== 'word') return null;
  if (lang === 'en') {
    if (!/^[a-z]{3,}$/.test(i.w)) return null;
    return { id: i.id, item: i, key: i.w, head: i.w[0], tail: i.w[i.w.length - 1] };
  }
  if (lang === 'ja') {
    const r = i.r ?? i.w;
    if (!isKanaStr(r)) return null;
    const key = toHiragana(r);
    if (Array.from(key).length < 2) return null;
    return { id: i.id, item: i, key, head: Array.from(key)[0], tail: jaTail(key) };
  }
  if (!/^[가-힣]{2,}$/.test(i.w)) return null;
  const cs = Array.from(i.w);
  return { id: i.id, item: i, key: i.w, head: cs[0], tail: cs[cs.length - 1] };
}

/** 字庫：同樣寫法只留一個 */
export function buildDict(items: VocabItem[], lang: LangId): ChainWord[] {
  const seen = new Set<string>();
  const out: ChainWord[] = [];
  for (const i of items) {
    const c = chainWordOf(i, lang);
    if (!c || seen.has(c.key)) continue;
    seen.add(c.key);
    out.push(c);
  }
  return out;
}

/** 韓文頭音法則：ㄹ 開頭變 ㄴ（ㅑㅕㅖㅛㅠㅣ 前變 ㅇ），ㄴ 在 ㅕㅛㅠㅣ 前變 ㅇ */
export function dueum(syl: string): string | null {
  const code = syl.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return null;
  const cho = Math.floor(code / 588);
  const jung = Math.floor((code % 588) / 28);
  const jong = code % 28;
  const v = JUNG[jung];
  const iotized = ['ㅑ', 'ㅕ', 'ㅖ', 'ㅛ', 'ㅠ', 'ㅣ'].includes(v);
  if (CHO[cho] === 'ㄹ') return compose(CHO.indexOf(iotized ? 'ㅇ' : 'ㄴ'), jung, jong);
  if (CHO[cho] === 'ㄴ' && ['ㅕ', 'ㅛ', 'ㅠ', 'ㅣ'].includes(v)) return compose(CHO.indexOf('ㅇ'), jung, jong);
  return null;
}

/** 接在 prev 後面可以用的開頭 */
export function headsAfter(prev: ChainWord, lang: LangId): string[] {
  if (lang !== 'ko') return [prev.tail];
  const d = dueum(prev.tail);
  return d ? [prev.tail, d] : [prev.tail];
}

export const canFollow = (prev: ChainWord, next: ChainWord, lang: LangId): boolean => headsAfter(prev, lang).includes(next.head);

/** 日文用「ん」結尾就輸了 */
export const endsWithN = (w: ChainWord, lang: LangId): boolean => lang === 'ja' && w.tail === 'ん';

const INDEX = new WeakMap<ChainWord[], Map<string, ChainWord[]>>();

/** 依開頭分組（字庫很大，每次都整個掃一遍太慢） */
function byHead(dict: ChainWord[]): Map<string, ChainWord[]> {
  let m = INDEX.get(dict);
  if (!m) {
    m = new Map();
    for (const w of dict) {
      const list = m.get(w.head) ?? [];
      list.push(w);
      m.set(w.head, list);
    }
    INDEX.set(dict, m);
  }
  return m;
}

/** 現在還能接的字 */
export function options(dict: ChainWord[], used: ReadonlySet<string>, prev: ChainWord | null, lang: LangId): ChainWord[] {
  const pool = prev ? headsAfter(prev, lang).flatMap((h) => byHead(dict).get(h) ?? []) : dict;
  return pool.filter((w) => !used.has(w.key) && !endsWithN(w, lang));
}

/**
 * 電腦出字：只從自己認得的字裡挑，而且不會挑讓你完全接不下去的字（字庫有限，那樣太不公平）。
 * 困難模式挑「你能接的字最少」的那個。想不出來回傳 null（認輸）。
 */
export function aiMove(dict: ChainWord[], known: ReadonlySet<string>, used: ReadonlySet<string>, prev: ChainWord | null, lang: LangId, level: Level, rng: Rng): ChainWord | null {
  let mine = options(dict, used, prev, lang).filter((w) => known.has(w.key));
  // 第一個字可以挑的太多：隨機抽一部分來評估就好
  if (mine.length > 80) mine = mine.map((w) => ({ w, r: rng() })).sort((a, b) => a.r - b.r).slice(0, 80).map((x) => x.w);
  const scored = mine
    .map((w) => {
      const after = new Set(used).add(w.key);
      return { w, left: options(dict, after, w, lang).length };
    })
    .filter((x) => x.left > 0);
  if (!scored.length) return null;
  if (level === 'hard') {
    scored.sort((a, b) => a.left - b.left || rng() - 0.5);
    return scored[Math.floor(rng() * Math.min(3, scored.length))].w;
  }
  return scored[Math.floor(rng() * scored.length)].w;
}

/** 電腦認得的字：依難度隨機挑一部分 */
export function knownSet(dict: ChainWord[], level: Level, rng: Rng): Set<string> {
  const p = LEVELS[level].know;
  return new Set(dict.filter(() => p >= 1 || rng() < p).map((w) => w.key));
}

export type Verdict = { ok: true; word: ChainWord } | { ok: false; reason: string; lose?: boolean };

/** 檢查玩家打的字 */
export function judge(input: string, dict: ChainWord[], used: ReadonlySet<string>, prev: ChainWord | null, lang: LangId): Verdict {
  const raw = input.trim();
  if (!raw) return { ok: false, reason: '請輸入一個字。' };
  let word: ChainWord | undefined;
  if (lang === 'en') {
    const k = raw.toLowerCase();
    word = dict.find((w) => w.key === k);
  } else if (lang === 'ja') {
    const k = toHiragana(normJa(raw));
    word = dict.find((w) => w.key === k) ?? dict.find((w) => normJa(w.item.w) === normJa(raw));
  } else {
    word = dict.find((w) => w.key === raw);
  }
  if (!word) return { ok: false, reason: '字庫裡沒有這個字（只收課程裡學得到的單字），換一個吧。' };
  if (used.has(word.key)) return { ok: false, reason: '這個字已經用過了。' };
  if (prev && !canFollow(prev, word, lang)) return { ok: false, reason: `要用「${headsAfter(prev, lang).join('」或「')}」開頭。` };
  if (endsWithN(word, lang)) return { ok: false, reason: '「ん」結尾的字接不下去，輸一條命！', lose: true };
  return { ok: true, word };
}

/** 一個字的分數：越長越多 */
export const wordScore = (w: ChainWord): number => 10 + 2 * Array.from(w.key).length;
