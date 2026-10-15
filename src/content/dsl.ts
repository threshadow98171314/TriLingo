// 課程內容的撰寫工具。
// 目的是讓「新增內容」只需要寫最少的文字：一行一個單字，id、課程切分、單元測驗都自動產生。
//
// 注意：項目 id 由「單元 id + 原文」組成，學習進度是用 id 存的，
// 所以已上線的單字不要改寫原文（要改請當成新單字）。

import type {
  ChartRow,
  ClozeItem,
  Concept,
  ConceptSection,
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
  /** 更多例句，寫法和例句一樣是「原文|翻譯」 */
  more?: string[];
}

/** 更多例句：沒有就不放這個欄位 */
function parseMore(more: string[] | undefined, isJa: boolean): Example[] | undefined {
  const out = (more ?? []).map((e) => parseEx(e, isJa)!).filter(Boolean);
  return out.length ? out : undefined;
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
  return { id: '', kind: o.kind ?? (/\s/.test(w) ? 'phrase' : 'word'), w, m, pos, ex: parseEx(ex, false), more: parseMore(o.more, false), note: o.note, say: o.say };
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
    more: parseMore(o.more, true),
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
    more: parseMore(o.more, false),
    tokens: multi ? w.split(' ') : undefined,
  };
}

// ───────── 單字清單（單字庫用，一行一個字） ─────────

/** 把「一行一筆、欄位用 | 分隔」的文字切開；空行略過 */
function rows(text: string, min: number): string[][] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const f = l.split('|').map((x) => x.trim());
      if (f.length < min) throw new Error(`欄位不夠：${l}`);
      return f;
    });
}

/**
 * 一行裡意思之後的欄位：「例句|翻譯」可以寫好幾組（答對時隨機挑一句顯示），
 * 用「※」開頭的欄位是補充說明。
 */
function tail(f: string[]): { ex?: string; more: string[]; note?: string } {
  const note = f.find((x) => x.startsWith('※'))?.slice(1).trim();
  const rest = f.filter((x) => !x.startsWith('※'));
  const exs: string[] = [];
  for (let i = 0; i + 1 < rest.length; i += 2) if (rest[i]) exs.push(`${rest[i]}|${rest[i + 1]}`);
  return { ex: exs[0], more: exs.slice(1), note };
}

/** 日文單字清單：一行一個「原文|意思|例句|例句翻譯|例句2|翻譯2…|※補充說明」，例句與說明可省略 */
export function jaList(text: string): VocabItem[] {
  return rows(text, 2).map(([w, m, ...f]) => {
    const { ex, more, note } = tail(f);
    return ja(w, m, ex, { note, more });
  });
}

/** 英文單字清單：一行一個「單字|詞性|意思|例句|例句翻譯|例句2|翻譯2…|※補充說明」 */
export function enList(text: string): VocabItem[] {
  return rows(text, 3).map(([w, pos, m, ...f]) => {
    const { ex, more, note } = tail(f);
    return en(w, pos, m, ex, { note, more });
  });
}

/** 韓文單字清單：一行一個「韓文|羅馬拼音|意思|例句|例句翻譯|例句2|翻譯2…|※補充說明」 */
export function koList(text: string): VocabItem[] {
  return rows(text, 3).map(([w, rm, m, ...f]) => {
    const { ex, more, note } = tail(f);
    return ko(w, rm, m, ex, { note, more });
  });
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

/**
 * 聽一段對話或獨白，回答畫面上的問題（多益 Part 3／4）。
 * script 一行一句，用「M: 」「F: 」標出說話者（男女用不同的聲音唸）；**第一個選項是正確答案**。
 */
export function talk(script: string[], ask: string, opts: string[], t?: string, explain?: string): QaItem {
  return { ...qa(script.join('\n'), opts, t, explain), ask };
}

/** 閱讀短文，回答問題（多益 Part 7）。passage 一行一段；**第一個選項是正確答案** */
export function read(passage: string[], ask: string, opts: string[], t?: string, explain?: string): QaItem {
  return { ...talk(passage, ask, opts, t, explain), read: true };
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
  o: { chunk?: number; kind?: UnitKind; bank?: string } = {},
): Unit {
  const items = finalize(id, raw);
  const lessons: Lesson[] = chunkEven(items, o.chunk ?? 5).map((g, i) => ({
    id: `${id}#${i + 1}`,
    title: `第 ${i + 1} 課`,
    itemIds: g.map((x) => x.id),
  }));
  lessons.push(bossOf(id, items));
  const unit: Unit = { id, icon, title, subtitle, kind: o.kind ?? 'vocab', items, lessons };
  if (o.bank) unit.bank = o.bank;
  return unit;
}

/**
 * 單字庫的一組字：不排在學習路線上、不會上鎖，每課 5 個字，最後是這組的小測驗。
 * bank 是分組名稱（例如「生活與家庭」），同一組的字放在一起顯示。
 * 已經上線的組只能在後面加字，不要把字搬到別組（id 是「組的 id＋原文」，搬了進度會歸零）。
 */
export function deck(id: string, icon: string, title: string, bank: string, raw: VocabItem[]): Unit {
  return vocabUnit(id, icon, title, `${raw.length} 個字`, raw, { bank });
}

/**
 * 情境小鎮的一個地點：第一課學單字（附文化與使用時機的說明），第二課練對話，最後是蓋章挑戰。
 * words 的第一個是地點本身（例如「コンビニ」）；lines 是對話句（sj()／ss()），note 寫說話的人（例如「店員」）。
 * 單元 id 的最後一段是插畫的名字（例如 ja.town.konbini → konbini）。
 */
export function placeUnit(id: string, icon: string, title: string, intro: GrammarNote, words: VocabItem[], lines: SentenceItem[]): Unit {
  const unit = grammarUnit(id, icon, title, `${words.length} 個單字・${lines.length} 句對話`, [
    { title: '單字', notes: [intro], items: words },
    { title: '對話', items: lines },
  ]);
  unit.kind = 'phrases';
  unit.lessons[unit.lessons.length - 1].title = '蓋章挑戰';
  return unit;
}

/** 題庫單元：一串克漏字或應答題，自動每 per 題切成一課（題庫路線用） */
export function drillUnit(id: string, icon: string, title: string, subtitle: string, items: Item[], per = 6, kind: UnitKind = 'grammar'): Unit {
  const parts = chunkEven(items, per).map((g, i) => ({ title: `第 ${i + 1} 組`, items: g }));
  return grammarUnit(id, icon, title, subtitle, parts, kind);
}

// ───────── 觀念講堂 ─────────

/**
 * 觀念文章的一節。examples 寫成「原文|翻譯」（日文用「漢字[よみ]」標讀音）；
 * table 第一列是表頭；tip 是解題技巧或易錯提醒。
 */
export function sec(h: string, body: string[], o: { ex?: string[]; table?: string[][]; tip?: string; ja?: boolean } = {}): ConceptSection {
  return { h, body, examples: o.ex?.map((e) => parseEx(e, !!o.ja)!), table: o.table, tip: o.tip };
}

/** 一篇觀念文章；quiz 用 cz() 寫（第一個選項是正確答案） */
export function concept(
  id: string,
  cat: string,
  icon: string,
  title: string,
  summary: string,
  sections: ConceptSection[],
  quiz: ClozeItem[],
  level?: string,
): Concept {
  return { id, cat, icon, title, summary, level, sections, quiz: finalize(id, quiz) };
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
