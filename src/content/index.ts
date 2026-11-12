// 課程資料的入口。
// - 基本資料（meta.ts）和大綱（gen/outline-*.json：每關有哪些單元、幾課、幾個字）隨主程式載入，
//   首頁、學習路線只靠大綱就能顯示。
// - 題目一包一包分開（parts.ts）：上哪一課、複習哪些字，就只下載那幾包；模擬考、觀念文章、
//   猜詞的每日候選字、搜尋索引也各自一包。下載過的留在記憶體裡（瀏覽器也會快取檔案）。
// 頁面用 <CourseGate need={…}>（或 useContent）說明需要哪些題目，等下載完成才顯示。
import { useEffect, useSyncExternalStore } from 'react';
import type { Course, CourseOutline, Example, Item, LangId, Lesson, Stage, StageOutline, Unit, UnitOutline, VocabItem } from '../core/types';
import { LANGS } from '../core/types';
import { corpusOfCourse, examplesOf, type CorpusEntry } from '../engine/examples';
import rawEn from './gen/outline-en.json';
import rawJa from './gen/outline-ja.json';
import rawKo from './gen/outline-ko.json';
import { META } from './meta';
import { decodeOutline, unitIdOf, type RawOutline } from './outline';
import { CONCEPTS, MOCKS, PARTS, SEARCH, WORDLE } from './parts';

export { META, META_LIST } from './meta';
export { stageIdOf, unitIdOf } from './outline';

// ───────── 大綱（隨主程式載入） ─────────

export const OUTLINE: Record<LangId, CourseOutline> = {
  en: decodeOutline(rawEn as unknown as RawOutline),
  ja: decodeOutline(rawJa as unknown as RawOutline),
  ko: decodeOutline(rawKo as unknown as RawOutline),
};
export const OUTLINE_LIST: CourseOutline[] = LANGS.map((l) => OUTLINE[l]);

export interface UnitRef {
  stage: StageOutline;
  unit: UnitOutline;
  /** 單元在關卡裡的位置 */
  index: number;
}

const unitRefs = new Map<string, UnitRef>();
const stageRefs = new Map<string, StageOutline>();
for (const o of OUTLINE_LIST) {
  for (const stage of o.stages) {
    stageRefs.set(stage.id, stage);
    stage.units.forEach((unit, index) => unitRefs.set(unit.id, { stage, unit, index }));
  }
}

/** 由單元、課或項目的 id 找到它在大綱裡的位置（內容下架的舊 id 找不到） */
export const unitRef = (id: string): UnitRef | undefined => unitRefs.get(unitIdOf(id));
export const stageOutline = (stageId: string): StageOutline | undefined => stageRefs.get(stageId);

/** item id 以語言代碼開頭（例如 ja.n5.greet:…） */
export function langOfId(id: string): LangId {
  return id.slice(0, 2) as LangId;
}

// ───────── 題目：用到哪一包才下載哪一包 ─────────

/** 題目以外、一個語言一包的資料 */
const EXTRAS = { mocks: MOCKS, concepts: CONCEPTS, wordle: WORDLE, search: SEARCH };
type Extra = keyof typeof EXTRAS;
type ExtraData = { [K in Extra]: Awaited<ReturnType<(typeof EXTRAS)[K][LangId]>> };

/**
 * 頁面需要哪些題目：
 * - { units }：這些單元（也可以給課或項目的 id）所在的那幾包
 * - { stages }：這幾關的全部題目
 * - 'all'：整個語言
 * - 'mocks'：模擬考；'concepts'：觀念文章；'wordle'：猜詞的每日候選字；'search'：搜尋索引
 * 可以用陣列一次要好幾種。
 */
export type Need = 'all' | Extra | { stages: string[] } | { units: string[] } | Need[];

// 每一包用一個字串當 key：題目是「關卡 id/第幾包」（ja.n5/0），其他是「種類:語言」（mocks:ja）
const partKey = (stageId: string, part: number) => `${stageId}/${part}`;
const extraKey = (name: Extra, lang: LangId) => `${name}:${lang}`;
function parseKey(key: string): { lang: LangId; extra?: Extra } {
  const i = key.indexOf(':');
  return i < 0 ? { lang: key.slice(0, 2) as LangId } : { lang: key.slice(i + 1) as LangId, extra: key.slice(0, i) as Extra };
}

const partUnits = new Map<string, Unit[]>();
const extraData: { [K in Extra]: Partial<Record<LangId, ExtraData[K]>> } = { mocks: {}, concepts: {}, wordle: {}, search: {} };
const pending = new Map<string, Promise<void>>();
const failed = new Set<string>();
/** 每個語言已下載的內容有變動就加一（索引、例句跟著重算） */
const rev: Record<LangId, number> = { en: 0, ja: 0, ko: 0 };

let version = 0;
const subs = new Set<() => void>();
const emit = () => {
  version++;
  subs.forEach((f) => f());
};
const subscribe = (f: () => void) => {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
};

function has(key: string): boolean {
  const { lang, extra } = parseKey(key);
  return extra ? extraData[extra][lang] !== undefined : partUnits.has(key);
}

/** 下載一包並放進記憶體 */
function fetchKey(key: string): Promise<void> {
  const { lang, extra } = parseKey(key);
  if (extra) {
    return (EXTRAS[extra][lang] as () => Promise<unknown>)().then((x) => {
      (extraData[extra] as Partial<Record<LangId, unknown>>)[lang] = x;
    });
  }
  const [stageId, k] = key.split('/');
  const loader = PARTS[stageId]?.[Number(k)];
  if (!loader) return Promise.reject(new Error(`找不到題目：${key}`));
  return loader().then((units) => {
    partUnits.set(key, units);
  });
}

function load(key: string): Promise<void> {
  if (has(key)) return Promise.resolve();
  const running = pending.get(key);
  if (running) return running;
  failed.delete(key);
  const { lang } = parseKey(key);
  const p = fetchKey(key).then(
    () => {
      pending.delete(key);
      rev[lang]++;
      emit();
    },
    (err: unknown) => {
      pending.delete(key);
      failed.add(key);
      emit();
      throw err;
    },
  );
  pending.set(key, p);
  return p;
}

function addStage(stageId: string, out: Set<string>) {
  (PARTS[stageId] ?? []).forEach((_, k) => out.add(partKey(stageId, k)));
}

function keysOf(lang: LangId, need: Need, out: Set<string> = new Set()): Set<string> {
  if (Array.isArray(need)) for (const n of need) keysOf(lang, n, out);
  else if (need === 'all') for (const s of META[lang].stages) addStage(s.id, out);
  else if (typeof need === 'string') out.add(extraKey(need, lang));
  else if ('stages' in need) for (const id of need.stages) addStage(id, out);
  else {
    for (const id of need.units) {
      const r = unitRef(id);
      if (r) out.add(partKey(r.stage.id, r.unit.part));
    }
  }
  return out;
}

/** 下載需要的題目；已經有的不會重新下載 */
export function ensure(lang: LangId, need: Need): Promise<void> {
  return Promise.all([...keysOf(lang, need)].map(load)).then(() => undefined);
}

/** 需要的題目是不是都下載好了 */
export function ready(lang: LangId, need: Need): boolean {
  for (const k of keysOf(lang, need)) if (!has(k)) return false;
  return true;
}

/** 趁瀏覽器有空時先下載（例如下一堂課的題目），之後點進去就不用等 */
export function prefetch(lang: LangId, need: Need): void {
  if (ready(lang, need)) return;
  const run = () => void ensure(lang, need).catch(() => {});
  if (typeof requestIdleCallback === 'function') requestIdleCallback(run, { timeout: 2500 });
  else setTimeout(run, 400);
}

export interface ContentState {
  ready: boolean;
  failed: boolean;
  retry: () => void;
}

/** 這個畫面需要的題目：還沒有的會自動開始下載。need 給 null 表示現在不需要 */
export function useContent(lang: LangId, need: Need | null): ContentState {
  useSyncExternalStore(subscribe, () => version);
  const key = need ? [...keysOf(lang, need)].sort().join('|') : '';
  useEffect(() => {
    if (key) Promise.all(key.split('|').map(load)).catch(() => {});
  }, [key]);
  const keys = key ? key.split('|') : [];
  return {
    ready: keys.every(has),
    failed: keys.some((k) => failed.has(k)),
    retry: () => {
      Promise.all(keys.map(load)).catch(() => {});
    },
  };
}

// ───────── 已下載的題目 ─────────

/** 模擬考、觀念文章、猜詞的每日候選字、搜尋索引（外層的 CourseGate 要先等下載完成） */
export function requireExtra<K extends Extra>(name: K, lang: LangId): ExtraData[K] {
  const x = extraData[name][lang];
  if (x === undefined) throw new Error(`${META[lang].name}的${name}還沒載入`);
  return x as ExtraData[K];
}

const views: Partial<Record<LangId, { rev: number; course: Course }>> = {};

/**
 * 目前已下載的題目組成的課程：還沒下載的那幾包，單元不會出現在裡面。
 * 需要「全部單元」的畫面（學習路線、進度）請用 OUTLINE。
 */
export function loadedCourse(lang: LangId): Course {
  const hit = views[lang];
  if (hit && hit.rev === rev[lang]) return hit.course;
  const meta = META[lang];
  const course: Course = {
    ...meta,
    stages: meta.stages.map((s) => ({ ...s, units: (PARTS[s.id] ?? []).flatMap((_, k) => partUnits.get(partKey(s.id, k)) ?? []) })),
    mocks: extraData.mocks[lang] ?? [],
    concepts: extraData.concepts[lang] ?? [],
  };
  views[lang] = { rev: rev[lang], course };
  return course;
}

// ───────── 索引：由 id 反查已下載的項目／課程所在的單元與關卡 ─────────

export interface ItemRef {
  item: Item;
  unit: Unit;
  stage: Stage;
}
export interface LessonRef {
  lesson: Lesson;
  unit: Unit;
  stage: Stage;
  index: number;
}

export interface CourseIndex {
  items: Map<string, ItemRef>;
  lessons: Map<string, LessonRef>;
  units: Map<string, { unit: Unit; stage: Stage }>;
}

const indexes: Partial<Record<LangId, { rev: number; idx: CourseIndex }>> = {};

/** 只包含已下載的題目 */
export function courseIndex(lang: LangId): CourseIndex {
  const hit = indexes[lang];
  if (hit && hit.rev === rev[lang]) return hit.idx;
  const idx: CourseIndex = { items: new Map(), lessons: new Map(), units: new Map() };
  for (const stage of loadedCourse(lang).stages) {
    for (const unit of stage.units) {
      idx.units.set(unit.id, { unit, stage });
      for (const item of unit.items) idx.items.set(item.id, { item, unit, stage });
      unit.lessons.forEach((lesson, li) => idx.lessons.set(lesson.id, { lesson, unit, stage, index: li }));
    }
  }
  indexes[lang] = { rev: rev[lang], idx };
  return idx;
}

// ───────── 例句：單字自己的例句，加上已下載的課程裡其他用到這個字的句子 ─────────

const corpora: Partial<Record<LangId, { rev: number; corpus: CorpusEntry[]; cache: Map<string, Example[]> }>> = {};

/** 一個單字最多三句例句（自己的例句優先） */
export function examplesFor(item: VocabItem, lang: LangId = langOfId(item.id)): Example[] {
  let c = corpora[lang];
  if (!c || c.rev !== rev[lang]) {
    c = { rev: rev[lang], corpus: corpusOfCourse(loadedCourse(lang)), cache: new Map() };
    corpora[lang] = c;
  }
  const hit = c.cache.get(item.id);
  if (hit) return hit;
  const out = examplesOf(item, lang, c.corpus);
  c.cache.set(item.id, out);
  return out;
}

/** 測試用：清掉已下載的題目，回到剛打開網站的狀態 */
export function resetContent() {
  partUnits.clear();
  pending.clear();
  failed.clear();
  for (const name of Object.keys(extraData) as Extra[]) extraData[name] = {};
  for (const l of LANGS) rev[l]++;
  emit();
}
