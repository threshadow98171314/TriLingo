// 課程內容的撰寫工具。
// 目的是讓「新增內容」只需要寫最少的文字：一行一個單字，id、課程切分、單元測驗都自動產生。
//
// 注意：項目 id 由「單元 id + 原文」組成，學習進度是用 id 存的，
// 所以已上線的單字不要改寫原文（要改請當成新單字）。

import type {
  ChartRow,
  ClozeItem,
  Example,
  GrammarNote,
  Item,
  Lesson,
  QaItem,
  SentenceItem,
  Unit,
  UnitKind,
  VocabItem,
} from '../core/types';
import { chunkEven } from '../core/util';
import { furiKana, furiPlain } from '../engine/furigana';

interface Opt {
  pos?: string;
  note?: string;
  say?: string;
  sound?: string;
  kind?: 'word' | 'phrase';
}

function parseEx(ex: string | undefined, isJa: boolean): Example | undefined {
  if (!ex) return undefined;
  const i = ex.lastIndexOf('|');
  if (i < 0) throw new Error(`例句缺少「|翻譯」：${ex}`);
  const s = ex.slice(0, i);
  const t = ex.slice(i + 1);
  return isJa ? { s: furiPlain(s), furi: s, t } : { s, t };
}

/** 英文單字。例句寫成「英文|中文」 */
export function en(w: string, pos: string, m: string, ex?: string, o: Opt = {}): VocabItem {
  return { id: '', kind: o.kind ?? (/\s/.test(w) ? 'phrase' : 'word'), w, m, pos, ex: parseEx(ex, false), note: o.note, say: o.say };
}

/**
 * 日文單字／短句，用「漢字[よみ]」標註讀音。
 * 用半形空白分詞的會被當成短句（可以出句子重組題），顯示時空白會拿掉。
 */
export function ja(f: string, m: string, ex?: string, o: Opt = {}): VocabItem {
  const tokens = f.includes(' ') ? f.split(' ') : undefined;
  const furi = f.replace(/ /g, '');
  const w = furiPlain(furi);
  return {
    id: '',
    kind: o.kind ?? (tokens ? 'phrase' : 'word'),
    w,
    furi: furi !== w ? furi : undefined,
    r: furiKana(furi),
    m,
    pos: o.pos,
    note: o.note,
    say: o.say,
    ex: parseEx(ex, true),
    tokens,
  };
}

/** 韓文單字／短句。rm 為羅馬拼音（依實際發音） */
export function ko(w: string, rm: string, m: string, ex?: string, o: Opt = {}): VocabItem {
  const multi = w.includes(' ');
  return {
    id: '',
    kind: o.kind ?? (multi ? 'phrase' : 'word'),
    w,
    rm,
    m,
    pos: o.pos,
    note: o.note,
    say: o.say,
    ex: parseEx(ex, false),
    tokens: multi ? w.split(' ') : undefined,
  };
}

/** 字母。spec 寫成「字 拼音|其他可接受輸入」，例如 'し shi|si' */
export function ch(spec: string, o: { note?: string; say?: string; sound?: string } = {}): VocabItem {
  const [w, rest] = spec.split(' ');
  const [rm, ...alt] = rest.split('|');
  return { id: '', kind: 'char', w, rm, m: rm, alt: alt.length ? alt : undefined, ...o };
}

/** 日文句子：用半形空白分詞，例如 '私[わたし] は 学生[がくせい] です。' */
export function sj(f: string, t: string, note?: string): SentenceItem {
  const tokens = f.split(' ');
  const furi = tokens.join('');
  return { id: '', kind: 'sentence', s: furiPlain(furi), furi, tokens, t, note };
}

/** 英文／韓文句子（以空白分詞） */
export function ss(s: string, t: string, note?: string): SentenceItem {
  return { id: '', kind: 'sentence', s, tokens: s.split(' '), t, note };
}

/** 克漏字：題目用 ___ 當空格；**第一個選項是正確答案**（出題時會自動洗牌） */
export function cz(q: string, opts: string[], t?: string, explain?: string): ClozeItem {
  if (!q.includes('___')) throw new Error(`克漏字題目缺少 ___：${q}`);
  return { id: '', kind: 'cloze', q, opts, a: 0, t, explain };
}

/** 聽問題選回應：**第一個選項是正確答案** */
export function qa(q: string, opts: string[], t?: string, explain?: string): QaItem {
  return { id: '', kind: 'qa', q, opts, a: 0, t, explain };
}

/** 文法說明卡。examples 寫成「原文|翻譯」 */
export function note(title: string, body: string[], examples: string[] = [], isJa = false): GrammarNote {
  return { title, body, examples: examples.map((e) => parseEx(e, isJa)!) };
}

// ───────── 單元 ─────────

function keyOf(it: Item): string {
  return 'w' in it ? it.w : 's' in it ? it.s : it.q;
}

function finalize<T extends Item>(unitId: string, raw: T[]): T[] {
  const seen = new Set<string>();
  return raw.map((it) => {
    const id = `${unitId}:${keyOf(it)}`;
    if (seen.has(id)) throw new Error(`同一單元內有重複的項目：${id}`);
    seen.add(id);
    return { ...it, id };
  });
}

const bossOf = (unitId: string, items: Item[]): Lesson => ({
  id: `${unitId}#boss`,
  title: '單元測驗',
  itemIds: items.map((i) => i.id),
  boss: true,
});

/** 單字／短句單元：自動平均切成每課約 chunk 個（預設 5） */
export function vocabUnit(
  id: string,
  icon: string,
  title: string,
  subtitle: string,
  raw: VocabItem[],
  o: { chunk?: number; kind?: UnitKind } = {},
): Unit {
  const items = finalize(id, raw);
  const lessons: Lesson[] = chunkEven(items, o.chunk ?? 5).map((g, i) => ({
    id: `${id}#${i + 1}`,
    title: `第 ${i + 1} 課`,
    itemIds: g.map((x) => x.id),
  }));
  lessons.push(bossOf(id, items));
  return { id, icon, title, subtitle, kind: o.kind ?? 'vocab', items, lessons };
}

export interface CharRow {
  label: string;
  cells: (VocabItem | null)[];
}

/** 字母單元：rows 同時是字母表的版面；groups 指定哪幾列合成一課（預設一列一課） */
export function charUnit(
  id: string,
  icon: string,
  title: string,
  subtitle: string,
  rows: CharRow[],
  groups?: number[][],
): Unit {
  const items = finalize(
    id,
    rows.flatMap((r) => r.cells.filter((c): c is VocabItem => c !== null)),
  );
  const idByW = new Map(items.map((i) => [i.w, i.id]));
  const chart: ChartRow[] = rows.map((r) => ({
    label: r.label,
    cells: r.cells.map((c) => (c ? idByW.get(c.w)! : null)),
  }));
  const gs = groups ?? rows.map((_, i) => [i]);
  const lessons: Lesson[] = gs.map((g, i) => ({
    id: `${id}#${i + 1}`,
    title: g.map((k) => rows[k].label).join('・'),
    itemIds: g.flatMap((k) => chart[k].cells.filter((c): c is string => c !== null)),
  }));
  lessons.push(bossOf(id, items));
  return { id, icon, title, subtitle, kind: 'chars', items, lessons, chart };
}

export interface GrammarPart {
  title: string;
  notes?: GrammarNote[];
  items: Item[];
}

/** 文法／聽力單元：每個 part 是一課，可附說明卡 */
export function grammarUnit(
  id: string,
  icon: string,
  title: string,
  subtitle: string,
  parts: GrammarPart[],
  kind: UnitKind = 'grammar',
): Unit {
  const items = finalize(
    id,
    parts.flatMap((p) => p.items),
  );
  let k = 0;
  const lessons: Lesson[] = parts.map((p, i) => {
    const ids = items.slice(k, k + p.items.length).map((x) => x.id);
    k += p.items.length;
    return { id: `${id}#${i + 1}`, title: p.title, itemIds: ids, notes: p.notes };
  });
  lessons.push(bossOf(id, items));
  return { id, icon, title, subtitle, kind, items, lessons };
}
