// 課程資料的入口。
// 基本資料（名稱、顏色、關卡大綱，見 meta.ts）隨主程式載入；
// 各語言的題目放在獨立的檔案，第一次用到時才下載，之後留在記憶體裡（瀏覽器也會快取檔案）。
import { useEffect, useSyncExternalStore } from 'react';
import type { Course, Example, Item, LangId, Lesson, MockExam, Stage, Unit, VocabItem } from '../core/types';
import { LANGS } from '../core/types';
import { corpusOfCourse, examplesOf, type CorpusEntry } from '../engine/examples';
import { META } from './meta';

export { META, META_LIST } from './meta';

/** 每個語言檔（en.ts／ja.ts／ko.ts）匯出的內容 */
export interface LangModule {
  UNITS: Record<string, Unit[]>;
  MOCKS?: MockExam[];
}

const LOADERS: Record<LangId, () => Promise<LangModule>> = {
  en: () => import('./en'),
  ja: () => import('./ja'),
  ko: () => import('./ko'),
};

/** 基本資料＋題目 → 完整的課程 */
export function assemble(lang: LangId, mod: LangModule): Course {
  const meta = META[lang];
  return { ...meta, stages: meta.stages.map((s) => ({ ...s, units: mod.UNITS[s.id] ?? [] })), mocks: mod.MOCKS ?? [] };
}

interface Slot {
  course?: Course;
  error?: unknown;
  pending?: Promise<Course>;
}
const slots: Record<LangId, Slot> = { en: {}, ja: {}, ko: {} };
let version = 0;
const subs = new Set<() => void>();
const emit = () => {
  version++;
  subs.forEach((f) => f());
};

/** 下載並組好某個語言的課程；已經載入過就直接回傳 */
export function loadCourse(lang: LangId): Promise<Course> {
  const slot = slots[lang];
  if (slot.course) return Promise.resolve(slot.course);
  if (slot.pending) return slot.pending;
  slot.error = undefined;
  slot.pending = LOADERS[lang]().then(
    (mod) => {
      slot.course = assemble(lang, mod);
      slot.pending = undefined;
      emit();
      return slot.course;
    },
    (err: unknown) => {
      slot.error = err;
      slot.pending = undefined;
      emit();
      throw err;
    },
  );
  emit();
  return slot.pending;
}

/** 背景預先下載全部語言（首頁、切換語言時就不用等） */
export function preloadCourses() {
  for (const l of LANGS) loadCourse(l).catch(() => {});
}

/** 已載入的課程；還沒載入時回傳 null */
export const getCourse = (lang: LangId): Course | null => slots[lang].course ?? null;

/** 一定要已經載入（例如上課頁面，外層的 CourseGate 會先等載入完成） */
export function requireCourse(lang: LangId): Course {
  const c = slots[lang].course;
  if (!c) throw new Error(`${META[lang].name}課程還沒載入`);
  return c;
}

/** 測試或預先準備資料時，直接放入組好的課程 */
export function provideCourse(course: Course) {
  slots[course.id].course = course;
  cache.delete(course.id);
  corpora.delete(course.id);
  exCache.clear();
  emit();
}

export interface CourseState {
  course: Course | null;
  loading: boolean;
  failed: boolean;
  retry: () => void;
}

const subscribe = (f: () => void) => {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
};

/** 取得某個語言的課程；第一次使用時自動開始下載 */
export function useCourseState(lang: LangId): CourseState {
  useSyncExternalStore(subscribe, () => version);
  useEffect(() => {
    if (!slots[lang].course && !slots[lang].error) loadCourse(lang).catch(() => {});
  }, [lang]);
  const slot = slots[lang];
  return {
    course: slot.course ?? null,
    loading: !slot.course && !slot.error,
    failed: !!slot.error,
    retry: () => {
      loadCourse(lang).catch(() => {});
    },
  };
}

export const useCourse = (lang: LangId): Course | null => useCourseState(lang).course;

// ───────── 索引：由 id 反查項目／課程所在的單元與關卡 ─────────

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
  units: Map<string, { unit: Unit; stage: Stage; index: number }>;
}

const cache = new Map<LangId, CourseIndex>();

export function courseIndex(lang: LangId): CourseIndex {
  let idx = cache.get(lang);
  if (idx) return idx;
  idx = { items: new Map(), lessons: new Map(), units: new Map() };
  for (const stage of requireCourse(lang).stages) {
    stage.units.forEach((unit, ui) => {
      idx!.units.set(unit.id, { unit, stage, index: ui });
      for (const item of unit.items) idx!.items.set(item.id, { item, unit, stage });
      unit.lessons.forEach((lesson, li) => idx!.lessons.set(lesson.id, { lesson, unit, stage, index: li }));
    });
  }
  cache.set(lang, idx);
  return idx;
}

/** item id 以語言代碼開頭（例如 ja.n5.greet:…） */
export function langOfId(id: string): LangId {
  return id.slice(0, 2) as LangId;
}

// ───────── 例句：單字自己的例句，加上課程裡其他用到這個字的句子 ─────────

const corpora = new Map<LangId, CorpusEntry[]>();
const exCache = new Map<string, Example[]>();

/** 一個單字最多三句例句（自己的例句優先）；課程還沒載入時只回傳自己的例句 */
export function examplesFor(item: VocabItem, lang: LangId = langOfId(item.id)): Example[] {
  const hit = exCache.get(item.id);
  if (hit) return hit;
  const course = slots[lang].course;
  if (!course) return [item.ex, ...(item.more ?? [])].filter((x): x is Example => !!x).slice(0, 3);
  let corpus = corpora.get(lang);
  if (!corpus) {
    corpus = corpusOfCourse(course);
    corpora.set(lang, corpus);
  }
  const out = examplesOf(item, lang, corpus);
  exCache.set(item.id, out);
  return out;
}
