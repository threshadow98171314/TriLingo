// 出題引擎：把課程資料（單字、句子、克漏字…）轉成一題一題的練習。
// 這裡只產生資料，不碰畫面與存檔，所以可以直接做單元測試。

import type { ClozeItem, GrammarNote, Item, LangId, Lesson, QaItem, SentenceItem, Unit, VocabItem } from '../core/types';
import { sample, shuffle, type Rng } from '../core/rng';
import { chunkEven } from '../core/util';
import { confusableReadings, furiPlain, hasKanji, isKanaStr } from './furigana';
import { isHangulStr } from './hangul';
import { readingOf } from './jaInput';

export interface Txt {
  s: string;
  lang: LangId | 'zh';
}
export interface Speak {
  text: string;
  lang: LangId;
}
/** 作答後顯示的解說 */
export interface Reveal {
  item: Item;
  explain?: string;
  speak?: Speak;
}

export interface ChoiceEx {
  t: 'choice';
  itemId: string;
  mode: 'w2m' | 'm2w' | 'w2r' | 'listen' | 's2m' | 'cloze' | 'qa';
  label: string;
  prompt?: Txt;
  /** 單字、字母用大字顯示 */
  big?: boolean;
  audio?: Speak;
  /** 聽力題：作答前不顯示文字 */
  hidePrompt?: boolean;
  options: Txt[];
  answer: number;
  reveal: Reveal;
}
export interface TilesEx {
  t: 'tiles';
  itemId: string;
  mode: 'spell' | 'build';
  label: string;
  prompt: Txt;
  answer: string[];
  bank: string[];
  lang: LangId;
  reveal: Reveal;
}
export interface TypeEx {
  t: 'type';
  itemId: string;
  label: string;
  prompt: Txt;
  accept: string[];
  reveal: Reveal;
}
/** 日文打字題：看中文（或聽發音）用日文輸入法打出答案，假名、漢字都算對 */
export interface TypeJaEx {
  t: 'typeja';
  itemId: string;
  mode: 'm2w' | 'listen';
  label: string;
  prompt?: Txt;
  audio?: Speak;
  /** 答案（含「漢字[よみ]」標註） */
  furi: string;
  /** 現在不方便打字時，改出這題選擇題 */
  fallback: ChoiceEx;
  reveal: Reveal;
}
export interface MatchEx {
  t: 'match';
  label: string;
  pairs: { itemId: string; a: Txt; b: Txt }[];
}
export interface TeachEx {
  t: 'teach';
  item: VocabItem | SentenceItem;
}
export interface NoteEx {
  t: 'note';
  note: GrammarNote;
}
export type Exercise = ChoiceEx | TilesEx | TypeEx | TypeJaEx | MatchEx | TeachEx | NoteEx;

export interface Ctx {
  lang: LangId;
  rng: Rng;
  /** 這個語言有沒有可用的語音；沒有就不出聽力題 */
  canListen: boolean;
  /** 出日文打字題（設定可關閉，需要日文輸入法） */
  jaTyping?: boolean;
}

export const LANG_NAME: Record<LangId, string> = { en: '英文', ja: '日文', ko: '韓文' };

const zh = (s: string): Txt => ({ s, lang: 'zh' });

// ───────── 項目的各種「面」 ─────────

export const isVocab = (i: Item): i is VocabItem => i.kind === 'char' || i.kind === 'word' || i.kind === 'phrase';

/**
 * 題目與選項上顯示的原文。
 * 日文單字只顯示假名：漢字會把意思直接洩漏給中文母語者，真正要練的是「聲音 ↔ 意思」。
 * 日文短句則顯示漢字＋振假名，整串假名反而難讀。
 */
export function front(i: VocabItem, lang: LangId): string {
  if (lang !== 'ja') return i.w;
  return i.kind === 'word' ? (i.r ?? i.w) : (i.furi ?? i.w);
}

/** 解說卡上顯示的完整寫法（日文含振假名標註） */
export const headOf = (i: VocabItem): string => i.furi ?? i.w;

/** 語音朗讀的文字。日文單字唸假名，避免語音引擎把單獨的漢字唸錯 */
export function sayOf(i: VocabItem, lang: LangId): string {
  if (i.say) return i.say;
  return lang === 'ja' && i.kind === 'word' ? (i.r ?? i.w) : i.w;
}

const soundKey = (i: VocabItem, lang: LangId): string => i.sound ?? sayOf(i, lang);

/** 拼字題／填字遊戲的格子：英文是字母、日文是假名、韓文是音節 */
export function cellsOf(i: VocabItem, lang: LangId): string[] | null {
  if (i.kind === 'char') return null;
  if (lang === 'en') return /^[A-Za-z]+$/.test(i.w) ? Array.from(i.w.toLowerCase()) : null;
  if (lang === 'ja') {
    const r = i.r ?? i.w;
    return isKanaStr(r) ? Array.from(r) : null;
  }
  return isHangulStr(i.w) ? Array.from(i.w) : null;
}

const stripPunct = (s: string): string => s.replace(/[。．.?？!！、,，]+$/u, '');

/** 句子重組題的字卡：去掉標點 */
export function cleanTokens(tokens: string[]): string[] {
  return tokens.map(stripPunct).filter(Boolean);
}

/** 克漏字填入答案後的完整句子 */
export function clozeFilled(i: ClozeItem): string {
  return i.q.replace('___', i.opts[i.a]);
}

function speakOfItem(i: Item, lang: LangId): Speak | undefined {
  if (isVocab(i)) return { text: sayOf(i, lang), lang };
  if (i.kind === 'sentence') return { text: i.s, lang };
  if (i.kind === 'cloze') return { text: furiPlain(clozeFilled(i)).replace(/（[^）]*）/g, ''), lang };
  return undefined;
}

const reveal = (i: Item, lang: LangId, explain?: string): Reveal => ({ item: i, explain, speak: speakOfItem(i, lang) });

// ───────── 選擇題 ─────────

/**
 * 挑干擾選項。label 是選項上顯示的文字（不可重複）；
 * key 是「題目那一面」的值：和正解 key 相同的項目會讓題目有兩個正確答案，必須排除。
 */
function others(
  pool: VocabItem[],
  ans: VocabItem,
  n: number,
  ctx: Ctx,
  label: (i: VocabItem) => string,
  key: (i: VocabItem) => string,
): VocabItem[] {
  const used = new Set([label(ans)]);
  const k = key(ans);
  const cands = shuffle(
    pool.filter((c) => c.id !== ans.id),
    ctx.rng,
  );
  // 同類型（字母／單字／短句）優先，才不會一眼看出答案
  cands.sort((a, b) => Number(b.kind === ans.kind) - Number(a.kind === ans.kind));
  const out: VocabItem[] = [];
  for (const c of cands) {
    const l = label(c);
    if (used.has(l) || key(c) === k) continue;
    used.add(l);
    out.push(c);
    if (out.length >= n) break;
  }
  return out;
}

function choice(base: Omit<ChoiceEx, 't' | 'options' | 'answer'>, correct: Txt, wrong: Txt[], rng: Rng): ChoiceEx {
  const options = shuffle([correct, ...wrong], rng);
  return { t: 'choice', ...base, options, answer: options.indexOf(correct) };
}

const rm = (i: VocabItem): Txt => ({ s: i.rm ?? i.m, lang: 'en' });

/** 辨認：看原文選意思（字母：看字選拼音） */
export function recog(i: VocabItem, pool: VocabItem[], ctx: Ctx): ChoiceEx {
  const { lang, rng } = ctx;
  if (i.kind === 'char') {
    const ws = others(pool, i, 3, ctx, (x) => x.rm ?? x.m, (x) => x.w);
    return choice(
      { itemId: i.id, mode: 'w2m', label: '這個字怎麼唸？', prompt: { s: i.w, lang }, big: true, reveal: reveal(i, lang) },
      rm(i),
      ws.map(rm),
      rng,
    );
  }
  const ws = others(pool, i, 3, ctx, (x) => x.m, (x) => front(x, lang));
  return choice(
    { itemId: i.id, mode: 'w2m', label: '這是什麼意思？', prompt: { s: front(i, lang), lang }, big: i.kind === 'word', reveal: reveal(i, lang) },
    zh(i.m),
    ws.map((x) => zh(x.m)),
    rng,
  );
}

/** 回想：看意思選原文（字母：看拼音選字） */
export function recall(i: VocabItem, pool: VocabItem[], ctx: Ctx): ChoiceEx {
  const { lang, rng } = ctx;
  if (i.kind === 'char') {
    const ws = others(pool, i, 3, ctx, (x) => x.w, (x) => x.rm ?? x.m);
    return choice(
      { itemId: i.id, mode: 'm2w', label: '選出對應的字', prompt: rm(i), big: true, reveal: reveal(i, lang) },
      { s: i.w, lang },
      ws.map((x) => ({ s: x.w, lang })),
      rng,
    );
  }
  const ws = others(pool, i, 3, ctx, (x) => front(x, lang), (x) => x.m);
  return choice(
    { itemId: i.id, mode: 'm2w', label: `選出對應的${LANG_NAME[lang]}`, prompt: zh(i.m), reveal: reveal(i, lang) },
    { s: front(i, lang), lang },
    ws.map((x) => ({ s: front(x, lang), lang })),
    rng,
  );
}

/** 聽力：聽發音選意思（字母：聽發音選字） */
export function listenEx(i: VocabItem, pool: VocabItem[], ctx: Ctx): ChoiceEx {
  const { lang, rng } = ctx;
  const audio: Speak = { text: sayOf(i, lang), lang };
  const key = (x: VocabItem) => soundKey(x, lang);
  if (i.kind === 'char') {
    const ws = others(pool, i, 3, ctx, (x) => x.w, key);
    return choice(
      { itemId: i.id, mode: 'listen', label: '聽發音，選出對應的字', audio, reveal: reveal(i, lang) },
      { s: i.w, lang },
      ws.map((x) => ({ s: x.w, lang })),
      rng,
    );
  }
  const ws = others(pool, i, 3, ctx, (x) => x.m, key);
  return choice(
    {
      itemId: i.id,
      mode: 'listen',
      label: '聽發音，選出意思',
      audio,
      prompt: { s: front(i, lang), lang },
      hidePrompt: true,
      big: i.kind === 'word',
      reveal: reveal(i, lang),
    },
    zh(i.m),
    ws.map((x) => zh(x.m)),
    rng,
  );
}

/** 日文漢字讀音題：干擾選項是促音、長音、清濁音差一點的讀音（日檢「漢字読み」題型） */
export function readingEx(i: VocabItem, pool: VocabItem[], ctx: Ctx): ChoiceEx | null {
  if (ctx.lang !== 'ja' || i.kind !== 'word' || !i.r || !hasKanji(i.w)) return null;
  const answer = i.r;
  const near = shuffle(confusableReadings(answer), ctx.rng).slice(0, 2);
  const used = new Set([answer, ...near]);
  const rest = others(
    pool.filter((x) => x.kind === 'word' && !!x.r),
    i,
    3,
    ctx,
    (x) => x.r!,
    (x) => x.w,
  )
    .map((x) => x.r!)
    .filter((r) => !used.has(r));
  const wrong = [...near, ...rest].slice(0, 3);
  if (wrong.length < 2) return null;
  return choice(
    { itemId: i.id, mode: 'w2r', label: '這個字怎麼唸？', prompt: { s: i.w, lang: 'ja' }, big: true, reveal: reveal(i, 'ja') },
    { s: answer, lang: 'ja' },
    wrong.map((s) => ({ s, lang: 'ja' as const })),
    ctx.rng,
  );
}

export function clozeEx(i: ClozeItem, ctx: Ctx): ChoiceEx {
  const { lang } = ctx;
  return choice(
    { itemId: i.id, mode: 'cloze', label: '選出正確的答案填入空格', prompt: { s: i.q, lang }, reveal: reveal(i, lang, i.explain) },
    { s: i.opts[i.a], lang },
    i.opts.filter((_, k) => k !== i.a).map((s) => ({ s, lang })),
    ctx.rng,
  );
}

/** 聽問題選回應（沒有語音時改成閱讀題） */
export function qaEx(i: QaItem, ctx: Ctx): ChoiceEx {
  const { lang, canListen } = ctx;
  return choice(
    {
      itemId: i.id,
      mode: 'qa',
      label: canListen ? '聽問題，選出最適當的回應' : '選出最適當的回應',
      prompt: { s: i.q, lang },
      audio: canListen ? { text: i.q, lang } : undefined,
      hidePrompt: canListen,
      reveal: reveal(i, lang, i.explain),
    },
    { s: i.opts[i.a], lang },
    i.opts.filter((_, k) => k !== i.a).map((s) => ({ s, lang })),
    ctx.rng,
  );
}

/** 句子 → 選出翻譯（listen 為 true 時只播聲音） */
export function sentenceChoice(i: SentenceItem, pool: Item[], ctx: Ctx, listen: boolean): ChoiceEx | null {
  const seen = new Set([i.t]);
  const wrong: Txt[] = [];
  for (const x of shuffle(pool, ctx.rng)) {
    if (x.kind !== 'sentence' || seen.has(x.t)) continue;
    seen.add(x.t);
    wrong.push(zh(x.t));
    if (wrong.length >= 3) break;
  }
  if (wrong.length < 2) return null;
  const { lang } = ctx;
  return choice(
    {
      itemId: i.id,
      mode: listen ? 'listen' : 's2m',
      label: listen ? '聽句子，選出意思' : '這句話是什麼意思？',
      prompt: { s: i.furi ?? i.s, lang },
      audio: listen ? { text: i.s, lang } : undefined,
      hidePrompt: listen,
      reveal: reveal(i, lang),
    },
    zh(i.t),
    wrong,
    ctx.rng,
  );
}

// ───────── 字卡題 ─────────

/** 拼字：看意思，用字母／假名／音節字卡拼出單字 */
export function spellEx(i: VocabItem, pool: VocabItem[], ctx: Ctx, maxCells = 9): TilesEx | null {
  const cells = cellsOf(i, ctx.lang);
  if (!cells || cells.length < 2 || cells.length > maxCells) return null;
  const have = new Set(cells);
  const extra: string[] = [];
  for (const o of shuffle(pool, ctx.rng)) {
    if (o.id === i.id) continue;
    for (const c of cellsOf(o, ctx.lang) ?? []) if (!have.has(c) && !extra.includes(c)) extra.push(c);
    if (extra.length >= 8) break;
  }
  const bank = shuffle([...cells, ...shuffle(extra, ctx.rng).slice(0, cells.length >= 6 ? 2 : 3)], ctx.rng);
  return {
    t: 'tiles',
    itemId: i.id,
    mode: 'spell',
    label: ctx.lang === 'en' ? '拼出這個單字' : '用字卡拼出這個詞',
    prompt: zh(i.m),
    answer: cells,
    bank,
    lang: ctx.lang,
    reveal: reveal(i, ctx.lang),
  };
}

// 日文助詞不拿來當干擾字卡：へ／に、は／が 互換後常常也是正確的句子
const isJaParticle = (t: string) => /^[はがをにへでともかの]$/.test(t);

/** 可以拿來當干擾字卡的詞：同單元其他句子／短句的分詞 */
export function tokenPool(pool: Item[], lang: LangId): string[] {
  const out = new Set<string>();
  for (const x of pool) {
    let tk: string[] = [];
    if (x.kind === 'sentence') tk = x.tokens;
    else if (isVocab(x) && x.tokens) tk = x.tokens;
    else if (x.kind === 'cloze' && lang === 'en') tk = clozeFilled(x).split(' ');
    for (const t of cleanTokens(tk)) if (!(lang === 'ja' && isJaParticle(t))) out.add(t);
  }
  return [...out];
}

/** 句子重組：看中文，把字卡排成句子 */
export function buildEx(item: Item, tokens: string[], prompt: string, distract: string[], ctx: Ctx): TilesEx | null {
  const answer = cleanTokens(tokens);
  if (answer.length < 3) return null;
  const have = new Set(answer);
  const extra = shuffle(
    distract.filter((t) => !have.has(t)),
    ctx.rng,
  ).slice(0, answer.length >= 6 ? 2 : 3);
  return {
    t: 'tiles',
    itemId: item.id,
    mode: 'build',
    label: '把句子排出來',
    prompt: zh(prompt),
    answer,
    bank: shuffle([...answer, ...extra], ctx.rng),
    lang: ctx.lang,
    reveal: reveal(item, ctx.lang),
  };
}

/** 字母：看字輸入羅馬拼音 */
export function typeEx(i: VocabItem, ctx: Ctx): TypeEx | null {
  if (i.kind !== 'char' || !i.rm) return null;
  return {
    t: 'type',
    itemId: i.id,
    label: '輸入這個字的羅馬拼音',
    prompt: { s: i.w, lang: ctx.lang },
    accept: [i.rm, ...(i.alt ?? [])],
    reveal: reveal(i, ctx.lang),
  };
}

/** 日文打字：看意思（或聽發音）用日文輸入法打出來 */
export function typeJaEx(i: VocabItem, pool: VocabItem[], ctx: Ctx, mode: 'm2w' | 'listen' = 'm2w'): TypeJaEx | null {
  if (ctx.lang !== 'ja' || i.kind === 'char') return null;
  const furi = i.furi ?? i.w;
  if (!readingOf(furi)) return null;
  const listen = mode === 'listen' && ctx.canListen;
  return {
    t: 'typeja',
    itemId: i.id,
    mode: listen ? 'listen' : 'm2w',
    label: listen ? '聽發音，用日文打出來' : '用日文打出這個意思',
    prompt: listen ? undefined : zh(i.m),
    audio: listen ? { text: sayOf(i, 'ja'), lang: 'ja' } : undefined,
    furi,
    fallback: listen ? listenEx(i, pool, ctx) : recall(i, pool, ctx),
    reveal: reveal(i, 'ja'),
  };
}

export function matchEx(items: VocabItem[], ctx: Ctx): MatchEx | null {
  const { lang } = ctx;
  const as = new Set<string>();
  const bs = new Set<string>();
  const pairs: MatchEx['pairs'] = [];
  for (const i of items) {
    const a = front(i, lang);
    const b = i.kind === 'char' ? (i.rm ?? i.m) : i.m;
    if (as.has(a) || bs.has(b)) continue;
    as.add(a);
    bs.add(b);
    pairs.push({ itemId: i.id, a: { s: a, lang }, b: i.kind === 'char' ? { s: b, lang: 'en' } : zh(b) });
  }
  return pairs.length >= 3 ? { t: 'match', label: '把對應的配成一對', pairs } : null;
}

/** 產出：最難的一類，要自己把答案「做」出來 */
export function produce(i: VocabItem, pool: VocabItem[], ctx: Ctx): Exercise {
  if (i.kind === 'char') return typeEx(i, ctx) ?? recall(i, pool, ctx);
  // 日文：大部分改成用鍵盤打出來（比排字卡更接近真的會寫）
  if (ctx.jaTyping && ctx.lang === 'ja' && ctx.rng() < 0.6) {
    const t = typeJaEx(i, pool, ctx);
    if (t) return t;
  }
  if (i.kind === 'phrase') {
    const b = i.tokens ? buildEx(i, i.tokens, i.m, tokenPool(pool, ctx.lang), ctx) : null;
    return b ?? spellEx(i, pool, ctx, 6) ?? (ctx.canListen ? listenEx(i, pool, ctx) : recall(i, pool, ctx));
  }
  return spellEx(i, pool, ctx) ?? readingEx(i, pool, ctx) ?? (ctx.canListen ? listenEx(i, pool, ctx) : recall(i, pool, ctx));
}

// ───────── 一堂課的流程 ─────────

/** 單字課：教 → 辨認 → 回想／聽力 → 配對 → 產出 */
function vocabFlow(items: VocabItem[], pool: VocabItem[], ctx: Ctx, skipTeach: boolean): Exercise[] {
  const { rng } = ctx;
  const out: Exercise[] = [];
  for (const g of chunkEven(items, 3)) {
    if (!skipTeach) for (const i of g) out.push({ t: 'teach', item: i });
    for (const i of shuffle(g, rng)) out.push(recog(i, pool, ctx));
  }
  shuffle(items, rng).forEach((i, k) => {
    const rd = k % 3 === 2 ? readingEx(i, pool, ctx) : null;
    if (rd) out.push(rd);
    else if (k % 2 === 1 && ctx.canListen) out.push(listenEx(i, pool, ctx));
    else out.push(recall(i, pool, ctx));
  });
  const m = matchEx(sample(items, 5, rng), ctx);
  if (m) out.push(m);
  for (const i of shuffle(items, rng)) out.push(produce(i, pool, ctx));
  return out;
}

/** 文法／聽力課：例句 → 克漏字／應答 → 聽句子 → 句子重組 */
function grammarFlow(items: Item[], pool: Item[], ctx: Ctx, skipTeach: boolean): Exercise[] {
  const { rng, lang } = ctx;
  const S = items.filter((i): i is SentenceItem => i.kind === 'sentence');
  const C = items.filter((i): i is ClozeItem => i.kind === 'cloze');
  const Q = items.filter((i): i is QaItem => i.kind === 'qa');
  const distract = tokenPool(pool, lang);
  const out: Exercise[] = [];
  if (!skipTeach) for (const s of S) out.push({ t: 'teach', item: s });
  for (const c of shuffle(C, rng)) out.push(clozeEx(c, ctx));
  for (const q of shuffle(Q, rng)) out.push(qaEx(q, ctx));
  const chosen = new Set<string>();
  for (const s of shuffle(S, rng).slice(0, 2)) {
    const e = sentenceChoice(s, pool, ctx, ctx.canListen);
    if (e) {
      out.push(e);
      chosen.add(s.id);
    }
  }
  for (const s of shuffle(S, rng)) {
    const e = buildEx(s, s.tokens, s.t, distract, ctx) ?? (chosen.has(s.id) ? null : sentenceChoice(s, pool, ctx, false));
    if (e) out.push(e);
  }
  // 英文：剛做過的克漏字句子，再用重組練一次語序
  if (lang === 'en') {
    for (const c of shuffle(C, rng).slice(0, 2)) {
      const e = c.t ? buildEx(c, clozeFilled(c).split(' '), c.t, distract, ctx) : null;
      if (e) out.push(e);
    }
  }
  return out;
}

/** 單元測驗：不教學、不重考，混合較難的題型 */
function bossFlow(items: Item[], pool: Item[], ctx: Ctx): Exercise[] {
  const { rng, lang } = ctx;
  const V = items.filter(isVocab);
  const vpool = pool.filter(isVocab);
  const distract = tokenPool(pool, lang);
  const out: Exercise[] = [];
  sample(V, 12, rng).forEach((i, k) => {
    if (k % 3 === 0) out.push(recall(i, vpool, ctx));
    else if (k % 3 === 1) out.push(ctx.canListen ? listenEx(i, vpool, ctx) : recog(i, vpool, ctx));
    else out.push(produce(i, vpool, ctx));
  });
  for (const c of sample(items.filter((i): i is ClozeItem => i.kind === 'cloze'), 8, rng)) out.push(clozeEx(c, ctx));
  for (const q of sample(items.filter((i): i is QaItem => i.kind === 'qa'), 8, rng)) out.push(qaEx(q, ctx));
  for (const s of sample(items.filter((i): i is SentenceItem => i.kind === 'sentence'), 5, rng)) {
    const e = buildEx(s, s.tokens, s.t, distract, ctx) ?? sentenceChoice(s, pool, ctx, false);
    if (e) out.push(e);
  }
  const mixed = shuffle(out, rng);
  const m = V.length >= 4 ? matchEx(sample(V, 5, rng), ctx) : null;
  if (m) mixed.splice(Math.floor(mixed.length / 2), 0, m);
  return mixed;
}

export function buildLesson(unit: Unit, lesson: Lesson, ctx: Ctx, isSeen: (id: string) => boolean): Exercise[] {
  const byId = new Map(unit.items.map((i) => [i.id, i]));
  const items = lesson.itemIds.map((id) => byId.get(id)).filter((x): x is Item => !!x);
  if (lesson.boss) return bossFlow(items, unit.items, ctx);
  const out: Exercise[] = (lesson.notes ?? []).map((n) => ({ t: 'note', note: n }));
  // 重玩已學過的課：跳過教學卡，直接練習
  const skipTeach = items.every((i) => isSeen(i.id));
  // 干擾選項只用「到這一課為止教過的」項目：還沒教的字一眼就能刪掉，起不了干擾作用
  const order = unit.lessons.filter((l) => !l.boss);
  const taught = new Set(order.slice(0, order.findIndex((l) => l.id === lesson.id) + 1).flatMap((l) => l.itemIds));
  const narrowed = unit.items.filter((i) => taught.has(i.id));
  const pool = narrowed.length >= 4 ? narrowed : unit.items;
  const V = items.filter(isVocab);
  const G = items.filter((i) => !isVocab(i));
  if (V.length) out.push(...vocabFlow(V, pool.filter(isVocab), ctx, skipTeach));
  if (G.length) out.push(...grammarFlow(G, pool, ctx, skipTeach));
  return out;
}

export interface ReviewEntry {
  item: Item;
  /** 熟練度 1..7：越熟題型越難 */
  strength: number;
  /** 干擾選項的來源（該項目所在的單元） */
  pool: Item[];
}

export function buildReview(entries: ReviewEntry[], ctx: Ctx): Exercise[] {
  const out: Exercise[] = [];
  for (const { item, strength, pool } of entries) {
    let e: Exercise | null;
    if (isVocab(item)) {
      const vp = pool.filter(isVocab);
      if (strength <= 1) e = recog(item, vp, ctx);
      else if (strength <= 3) e = ctx.canListen && ctx.rng() < 0.5 ? listenEx(item, vp, ctx) : recall(item, vp, ctx);
      else e = produce(item, vp, ctx);
    } else if (item.kind === 'sentence') {
      e = buildEx(item, item.tokens, item.t, tokenPool(pool, ctx.lang), ctx) ?? sentenceChoice(item, pool, ctx, false);
    } else if (item.kind === 'cloze') {
      e = clozeEx(item, ctx);
    } else {
      e = qaEx(item, ctx);
    }
    if (e) out.push(e);
  }
  return out;
}

/** 聽力特訓：單字和例句混著聽 */
export function buildListening(items: VocabItem[], poolOf: (i: VocabItem) => VocabItem[], ctx: Ctx, n = 10): Exercise[] {
  const { rng, lang } = ctx;
  const withEx = items.filter((i) => i.ex);
  const out: Exercise[] = [];
  for (const i of sample(items, n, rng)) {
    if (i.ex && rng() < 0.45) {
      const seen = new Set([i.ex.t]);
      const wrong: Txt[] = [];
      for (const x of shuffle(withEx, rng)) {
        if (seen.has(x.ex!.t)) continue;
        seen.add(x.ex!.t);
        wrong.push(zh(x.ex!.t));
        if (wrong.length >= 3) break;
      }
      if (wrong.length >= 2) {
        out.push(
          choice(
            {
              itemId: i.id,
              mode: 'listen',
              label: '聽句子，選出意思',
              prompt: { s: i.ex.furi ?? i.ex.s, lang },
              audio: { text: i.ex.s, lang },
              hidePrompt: true,
              reveal: reveal(i, lang),
            },
            zh(i.ex.t),
            wrong,
            rng,
          ),
        );
        continue;
      }
    }
    out.push(listenEx(i, poolOf(i), ctx));
  }
  return out;
}

/** 答錯重考時重新洗牌，避免靠位置記答案 */
export function reshuffle(ex: Exercise, rng: Rng): Exercise {
  if (ex.t === 'choice') {
    const correct = ex.options[ex.answer];
    const options = shuffle(ex.options, rng);
    return { ...ex, options, answer: options.indexOf(correct) };
  }
  if (ex.t === 'tiles') return { ...ex, bank: shuffle(ex.bank, rng) };
  return ex;
}
