// 單字的例句：除了單字本身的例句，也從課程裡其他句子找出「有用到這個字」的句子，
// 答對時隨機挑一句顯示，讓同一個字在不同情境裡出現。

import type { Course, Example, Item, LangId, VocabItem } from '../core/types';
import { furiPlain } from './furigana';

export interface CorpusEntry {
  ex: Example;
  /** 比對用的文字：日文是含振假名標註的原句（讀音一起比，同字不同音不會配錯），英文是小寫 */
  key: string;
}

/** 例句太長在回饋區塊裡不好讀：超過就不拿來當補充例句 */
const MAX_LEN: Record<LangId, number> = { ja: 48, ko: 48, en: 110 };

function entryOf(ex: Example, lang: LangId): CorpusEntry | null {
  if (!ex.t || ex.s.length > MAX_LEN[lang]) return null;
  const key = lang === 'ja' ? (ex.furi ?? ex.s) : lang === 'en' ? ` ${ex.s.toLowerCase().replace(/[^a-z' ]+/g, ' ')} ` : ex.s;
  return { ex, key };
}

/** 一個語言所有可以拿來當例句的句子：單字的例句、課文句子、文法說明的例句 */
export function buildCorpus(lang: LangId, items: Item[], extra: Example[] = []): CorpusEntry[] {
  const seen = new Set<string>();
  const out: CorpusEntry[] = [];
  const add = (ex: Example | undefined) => {
    if (!ex || seen.has(ex.s)) return;
    seen.add(ex.s);
    const e = entryOf(ex, lang);
    if (e) out.push(e);
  };
  for (const it of items) {
    if (it.kind === 'sentence') add({ s: it.s, furi: it.furi, t: it.t });
    else if (it.kind === 'char' || it.kind === 'word' || it.kind === 'phrase') {
      add(it.ex);
      for (const m of it.more ?? []) add(m);
    }
  }
  for (const e of extra) add(e);
  return out;
}

/** 整個課程的句子（課程頁、回饋區塊共用） */
export function corpusOfCourse(course: Course): CorpusEntry[] {
  const items: Item[] = [];
  const notes: Example[] = [];
  for (const st of course.stages)
    for (const u of st.units) {
      items.push(...u.items);
      for (const l of u.lessons) for (const n of l.notes ?? []) notes.push(...(n.examples ?? []));
    }
  return buildCorpus(course.id, items, notes);
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

type Matcher = (e: CorpusEntry) => boolean;

/**
 * 判斷一個句子有沒有用到這個字。
 * 日文：用含讀音的標註比對（会議[かいぎ]），動詞、形容詞去掉活用語尾（戸惑[とまど]う → 戸惑[とまど]）；
 * 英文：容許常見的字尾變化；韓文：動詞、形容詞比對語幹（공부하다 → 공부）。
 * 太短、容易配錯的字不找。
 */
export function matcherOf(i: VocabItem, lang: LangId): Matcher | null {
  if (i.kind === 'char') return null;
  if (lang === 'ja') {
    if (i.kind !== 'word') return null;
    const f = i.furi ?? i.w;
    if (!f.includes('[')) {
      // 只有假名的字：至少三個字才比對（太短會配到別的字裡面）
      if (Array.from(i.w).length < 3) return null;
      return (e) => furiPlain(e.key).includes(i.w);
    }
    let needle = f;
    if (f.endsWith('する') && f.indexOf(']') < f.length - 2) needle = f.slice(0, -2);
    else if (/\][ぁ-ゖ]*[うくぐすつぬぶむるい]$/.test(f)) needle = f.slice(0, -1);
    return (e) => e.key.includes(needle);
  }
  if (lang === 'en') {
    const w = i.w.toLowerCase();
    if (w.includes(' ')) return (e) => e.key.includes(` ${w} `);
    if (w.length < 3) return null;
    const stem = w.length >= 4 ? w.replace(/(e|y)$/, '') : w;
    const re = new RegExp(` ${esc(stem)}(e|es|ed|d|s|ing|y|ies|ied|ying|er|est|ly)? `);
    return (e) => re.test(e.key);
  }
  if (i.w.includes(' ')) return null;
  let stem = i.w;
  if (stem.endsWith('하다') && stem.length >= 4) stem = stem.slice(0, -2);
  else if (stem.endsWith('다') && stem.length >= 3) stem = stem.slice(0, -1);
  if (Array.from(stem).length < 2) return null;
  return (e) => e.key.includes(stem);
}

/**
 * 一個字的例句清單（最多 max 句）：先放自己的例句與更多例句，
 * 不夠的話從課程其他句子裡挑有用到這個字的（短的優先）。
 */
export function examplesOf(i: VocabItem, lang: LangId, corpus: CorpusEntry[], max = 3): Example[] {
  const own = [i.ex, ...(i.more ?? [])].filter((x): x is Example => !!x);
  const out = own.slice(0, max);
  if (out.length >= max) return out;
  const match = matcherOf(i, lang);
  if (!match) return out;
  const have = new Set(out.map((x) => x.s));
  const found = corpus.filter((e) => !have.has(e.ex.s) && match(e)).sort((a, b) => a.ex.s.length - b.ex.s.length);
  for (const e of found) {
    if (out.length >= max) break;
    if (have.has(e.ex.s)) continue;
    have.add(e.ex.s);
    out.push(e.ex);
  }
  return out;
}
