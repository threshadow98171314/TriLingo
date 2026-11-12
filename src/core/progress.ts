// 由存檔推導出來的學習進度：哪些課解鎖了、學了幾個字、今天有幾個要複習…
// 「有哪些單元、幾課」看大綱（OUTLINE）就夠了，不用等題目下載；
// 需要題目內容的（已學的字、今天要複習的字）只看已下載的那幾包，外層的 CourseGate 會先把需要的下載好。
import { courseIndex, loadedCourse, OUTLINE, unitIdOf, unitRef, type Need } from '../content';
import { cellsOf, isVocab } from '../engine/exercises';
import { dayNum, today } from './date';
import { mastery } from './logic';
import type { Save } from './save';
import type { Item, LangId, VocabItem } from './types';

// 大綱裡的關卡和完整的關卡（含題目）都能用下面的函式：只看 id、課的清單和單字庫的標記
export interface LessonLike {
  id: string;
  title: string;
  boss?: boolean;
}
export interface UnitLike {
  id: string;
  bank?: string;
  lessons: LessonLike[];
  /** 大綱：項目數 */
  count?: number;
  /** 完整的單元：項目 */
  items?: { id: string }[];
}
export interface StageLike {
  id: string;
  open?: boolean;
  units: UnitLike[];
}
type UnitOf<S extends StageLike> = S['units'][number];
type LessonOf<S extends StageLike> = UnitOf<S>['lessons'][number];

export const starsOf = (s: Save, lessonId: string): number => s.lessons[lessonId]?.stars ?? 0;

export const bossOf = <U extends UnitLike>(u: U): U['lessons'][number] => u.lessons[u.lessons.length - 1];

/** 學習路線上的單元（單字庫的組不算在路線裡） */
export const pathUnits = <S extends StageLike>(stage: S): UnitOf<S>[] => stage.units.filter((u) => !u.bank);
export const bankUnits = <S extends StageLike>(stage: S): UnitOf<S>[] => stage.units.filter((u) => !!u.bank);

const learnedCache = new WeakMap<Save, Map<string, number>>();

/**
 * 每個單元學過幾個項目（單元 id → 數量）。只看存檔，不需要題目：項目 id 是「單元 id:原文」。
 * 存檔每次變動都是新的物件，所以同一份存檔只算一次。
 */
export function learnedByUnit(s: Save): Map<string, number> {
  let m = learnedCache.get(s);
  if (!m) {
    m = new Map();
    for (const id in s.items) {
      const u = unitIdOf(id);
      m.set(u, (m.get(u) ?? 0) + 1);
    }
    learnedCache.set(s, m);
  }
  return m;
}

/** 單元的項目數 */
export const sizeOf = (u: UnitLike): number => u.count ?? u.items?.length ?? 0;

/** 這個單元學過幾個項目 */
export function learnedIn(s: Save, u: UnitLike): number {
  if (u.items) return u.items.reduce((a, i) => a + (s.items[i.id] ? 1 : 0), 0);
  // 只有大綱時用存檔推算；已下架的舊項目也在存檔裡，所以不超過單元的項目數
  return Math.min(sizeOf(u), learnedByUnit(s).get(u.id) ?? 0);
}

export interface UnitState {
  done: number;
  total: number;
  /** 單元測驗已通過 */
  complete: boolean;
  stars: number;
  /** 前一個單元已完成（第一個單元、單字庫的組一律開放） */
  unlocked: boolean;
}

export function unitState(s: Save, stage: StageLike, index: number): UnitState {
  const u = stage.units[index];
  let done = 0;
  let stars = 0;
  for (const l of u.lessons) {
    const st = starsOf(s, l.id);
    if (st > 0) done++;
    stars += st;
  }
  // 路線上的前一個單元（跳過單字庫的組）
  const prev = stage.units.slice(0, index).filter((x) => !x.bank).pop();
  return {
    done,
    total: u.lessons.length,
    complete: starsOf(s, bossOf(u).id) > 0,
    stars,
    unlocked: !!u.bank || !!stage.open || !prev || starsOf(s, bossOf(prev).id) > 0,
  };
}

export type NodeState = 'done' | 'open' | 'locked';

/**
 * 課程節點的狀態。單元內的課要依序完成；
 * 單元測驗永遠開放——通過就算完成整個單元，已經會的人可以直接跳級。
 */
export function lessonState(s: Save, stage: StageLike, unitIndex: number, lessonIndex: number): NodeState {
  const u = stage.units[unitIndex];
  const l = u.lessons[lessonIndex];
  if (starsOf(s, l.id) > 0) return 'done';
  if (l.boss) return 'open';
  if (!unitState(s, stage, unitIndex).unlocked) return 'locked';
  return lessonIndex === 0 || starsOf(s, u.lessons[lessonIndex - 1].id) > 0 ? 'open' : 'locked';
}

export interface StageState {
  done: number;
  total: number;
  pct: number;
  /** 這一關有沒有內容 */
  ready: boolean;
  complete: boolean;
}

/** 關卡進度只算學習路線；單字庫另外用 bankState 統計 */
export function stageState(s: Save, stage: StageLike): StageState {
  let done = 0;
  let total = 0;
  const path = pathUnits(stage);
  let complete = path.length > 0;
  for (const u of path) {
    for (const l of u.lessons) {
      total++;
      if (starsOf(s, l.id) > 0) done++;
    }
    if (starsOf(s, bossOf(u).id) === 0) complete = false;
  }
  return { done, total, pct: total ? done / total : 0, ready: stage.units.length > 0, complete };
}

export interface NextUp<S extends StageLike = StageLike> {
  stage: S;
  unit: UnitOf<S>;
  unitIndex: number;
  lesson: LessonOf<S>;
}

/** 某一關的學習路線上，下一堂該上的課 */
export function nextInStage<S extends StageLike>(s: Save, stage: S): NextUp<S> | null {
  for (let ui = 0; ui < stage.units.length; ui++) {
    const unit = stage.units[ui];
    if (unit.bank || starsOf(s, bossOf(unit).id) > 0) continue;
    const lesson = unit.lessons.find((l) => starsOf(s, l.id) === 0) ?? bossOf(unit);
    return { stage, unit, unitIndex: ui, lesson };
  }
  return null;
}

export interface BankState {
  decks: number;
  /** 已通過小測驗的組數 */
  done: number;
  words: number;
  learned: number;
}

/** 單字庫的進度：學過幾個字、完成幾組 */
export function bankState(s: Save, stage: StageLike): BankState {
  const out: BankState = { decks: 0, done: 0, words: 0, learned: 0 };
  for (const u of bankUnits(stage)) {
    out.decks++;
    if (starsOf(s, bossOf(u).id) > 0) out.done++;
    out.words += sizeOf(u);
    out.learned += learnedIn(s, u);
  }
  return out;
}

/** 單字庫裡下一堂可以上的課：照順序第一個還沒完成的組 */
export function nextBankLesson<S extends StageLike>(s: Save, stage: S, after?: string): NextUp<S> | null {
  let start = 0;
  if (after) start = stage.units.findIndex((u) => u.id === after) + 1;
  for (let ui = start; ui < stage.units.length; ui++) {
    const unit = stage.units[ui];
    if (!unit.bank || starsOf(s, bossOf(unit).id) > 0) continue;
    const lesson = unit.lessons.find((l) => starsOf(s, l.id) === 0) ?? bossOf(unit);
    return { stage, unit, unitIndex: ui, lesson };
  }
  return null;
}

/** 這個語言目前停留的關卡：上次看的那一關，否則是第一個還沒完成的關 */
export function currentStage<S extends StageLike>(s: Save, course: { id: LangId; stages: S[] }): S {
  const saved = course.stages.find((st) => st.id === s.stage[course.id]);
  if (saved) return saved;
  return course.stages.find((st) => pathUnits(st).length > 0 && !stageState(s, st).complete) ?? course.stages[0];
}

export function nextUp<S extends StageLike>(s: Save, course: { id: LangId; stages: S[] }): NextUp<S> | null {
  const cur = currentStage(s, course);
  const inCur = nextInStage(s, cur);
  if (inCur) return inCur;
  for (const st of course.stages) {
    const n = nextInStage(s, st);
    if (n) return n;
  }
  return null;
}

/**
 * 學過的字所在的那幾包題目。複習、遊樂場這些「用學過的字出題」的畫面需要它
 * （CourseGate 的 need="active"）。只看存檔和大綱就算得出來。
 */
export const activeNeed = (s: Save, lang: LangId): Need => ({ units: activeParts(s, lang) });

/**
 * 學過的字分布在哪幾包題目：每一包取一個單元當代表，學得最多的那一包排最前面。
 * 不需要全部的時候（例如只想知道填字遊戲解鎖了沒），可以照這個順序一包一包下載。
 */
export function activeParts(s: Save, lang: LangId): string[] {
  const prefix = `${lang}.`;
  const parts = new Map<string, { unit: string; n: number }>();
  for (const [u, n] of learnedByUnit(s)) {
    if (!u.startsWith(prefix)) continue;
    const r = unitRef(u);
    if (!r) continue;
    const key = `${r.stage.id}/${r.unit.part}`;
    const cur = parts.get(key);
    if (cur) cur.n += n;
    else parts.set(key, { unit: u, n });
  }
  return [...parts.values()].sort((a, b) => b.n - a.n).map((x) => x.unit);
}

/** 已學過的項目（依課程順序）。只找得到已下載的題目，外層要先用 CourseGate need="active" 等下載完成 */
export function learnedItems(s: Save, lang: LangId): Item[] {
  const out: Item[] = [];
  for (const stage of loadedCourse(lang).stages) {
    for (const unit of stage.units) for (const item of unit.items) if (s.items[item.id]) out.push(item);
  }
  return out;
}

export const learnedVocab = (s: Save, lang: LangId): VocabItem[] => learnedItems(s, lang).filter(isVocab);

/** 可以放進填字遊戲的已學單字（長度 2–9 格，沒有空白或標點） */
export function crosswordPool(s: Save, lang: LangId): VocabItem[] {
  return learnedVocab(s, lang).filter((i) => {
    const c = cellsOf(i, lang);
    return !!c && c.length >= 2 && c.length <= 9;
  });
}

/** 今天該複習的項目（到期越久的排越前面） */
export function dueItems(s: Save, lang: LangId): Item[] {
  const day = dayNum(today());
  return learnedItems(s, lang)
    .filter((i) => s.items[i.id].due <= day)
    .sort((a, b) => s.items[a.id].due - s.items[b.id].due);
}

/** 最不熟的項目（沒有到期的複習時，拿來做加強練習） */
export function weakestItems(s: Save, lang: LangId, n: number): Item[] {
  return learnedItems(s, lang)
    .sort((a, b) => {
      const pa = s.items[a.id];
      const pb = s.items[b.id];
      return pa.s - pb.s || pb.ng - pa.ng || pa.t - pb.t;
    })
    .slice(0, n);
}

export interface LangStats {
  learned: number;
  total: number;
  due: number;
  mastered: number;
}

/** 已學、到期、精熟的數量（只算已下載的題目，外層要先等 need="active" 下載完成）；總數看大綱 */
export function langStats(s: Save, lang: LangId): LangStats {
  const day = dayNum(today());
  let learned = 0;
  let due = 0;
  let mastered = 0;
  for (const id of courseIndex(lang).items.keys()) {
    const p = s.items[id];
    if (!p) continue;
    learned++;
    if (p.due <= day) due++;
    if (mastery(p) === 4) mastered++;
  }
  return { learned, total: OUTLINE[lang].total, due, mastered };
}

/**
 * 只看存檔的統計（不需要先下載題目）：學過幾個、今天有幾個要複習。
 * 和 langStats 的差別只在「題目已經下架的舊項目」也會算進去，用在首頁這類概覽剛好。
 */
export function quickStats(s: Save, lang: LangId): { learned: number; due: number } {
  const day = dayNum(today());
  const prefix = `${lang}.`;
  let learned = 0;
  let due = 0;
  for (const [id, p] of Object.entries(s.items)) {
    if (!id.startsWith(prefix)) continue;
    learned++;
    if (p.due <= day) due++;
  }
  return { learned, due };
}

/** 各種遊戲需要的最少已學字數 */
export const UNLOCK = { match: 6, blitz: 8, listen: 8, crossword: 12, typing: 8, truefalse: 8, memory: 6, pics: 4, sort: 6, duel: 20, wordle: 10, chain: 30, sevens: 15, bigtwo: 20 };

/** 最近在學的語言（看最後一次作答的時間）；還沒學過任何東西時回傳 null */
export function lastStudiedLang(s: Save): LangId | null {
  let best: LangId | null = null;
  let t = 0;
  for (const [id, p] of Object.entries(s.items)) {
    if (p.t > t) {
      t = p.t;
      best = id.slice(0, 2) as LangId;
    }
  }
  return best;
}
