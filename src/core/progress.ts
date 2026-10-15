// 由存檔推導出來的學習進度：哪些課解鎖了、學了幾個字、今天有幾個要複習…
import { courseIndex, requireCourse } from '../content';
import { cellsOf, isVocab } from '../engine/exercises';
import { dayNum, today } from './date';
import { mastery } from './logic';
import type { Save } from './save';
import type { Course, Item, LangId, Lesson, Stage, Unit, VocabItem } from './types';

export const starsOf = (s: Save, lessonId: string): number => s.lessons[lessonId]?.stars ?? 0;

export const bossOf = (u: Unit): Lesson => u.lessons[u.lessons.length - 1];

export interface UnitState {
  done: number;
  total: number;
  /** 單元測驗已通過 */
  complete: boolean;
  stars: number;
  /** 前一個單元已完成（第一個單元一律開放） */
  unlocked: boolean;
}

export function unitState(s: Save, stage: Stage, index: number): UnitState {
  const u = stage.units[index];
  let done = 0;
  let stars = 0;
  for (const l of u.lessons) {
    const st = starsOf(s, l.id);
    if (st > 0) done++;
    stars += st;
  }
  return {
    done,
    total: u.lessons.length,
    complete: starsOf(s, bossOf(u).id) > 0,
    stars,
    unlocked: index === 0 || starsOf(s, bossOf(stage.units[index - 1]).id) > 0,
  };
}

export type NodeState = 'done' | 'open' | 'locked';

/**
 * 課程節點的狀態。單元內的課要依序完成；
 * 單元測驗永遠開放——通過就算完成整個單元，已經會的人可以直接跳級。
 */
export function lessonState(s: Save, stage: Stage, unitIndex: number, lessonIndex: number): NodeState {
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

export function stageState(s: Save, stage: Stage): StageState {
  let done = 0;
  let total = 0;
  let complete = stage.units.length > 0;
  for (const u of stage.units) {
    for (const l of u.lessons) {
      total++;
      if (starsOf(s, l.id) > 0) done++;
    }
    if (starsOf(s, bossOf(u).id) === 0) complete = false;
  }
  return { done, total, pct: total ? done / total : 0, ready: stage.units.length > 0, complete };
}

export interface NextUp {
  stage: Stage;
  unit: Unit;
  unitIndex: number;
  lesson: Lesson;
}

/** 某一關裡下一堂該上的課 */
export function nextInStage(s: Save, stage: Stage): NextUp | null {
  for (let ui = 0; ui < stage.units.length; ui++) {
    const unit = stage.units[ui];
    if (starsOf(s, bossOf(unit).id) > 0) continue;
    const lesson = unit.lessons.find((l) => starsOf(s, l.id) === 0) ?? bossOf(unit);
    return { stage, unit, unitIndex: ui, lesson };
  }
  return null;
}

/** 這個語言目前停留的關卡：上次看的那一關，否則是第一個還沒完成的關 */
export function currentStage(s: Save, course: Course): Stage {
  const saved = course.stages.find((st) => st.id === s.stage[course.id]);
  if (saved) return saved;
  return course.stages.find((st) => st.units.length > 0 && !stageState(s, st).complete) ?? course.stages[0];
}

export function nextUp(s: Save, course: Course): NextUp | null {
  const cur = currentStage(s, course);
  const inCur = nextInStage(s, cur);
  if (inCur) return inCur;
  for (const st of course.stages) {
    const n = nextInStage(s, st);
    if (n) return n;
  }
  return null;
}

/** 已學過的項目（依課程順序） */
export function learnedItems(s: Save, lang: LangId): Item[] {
  const out: Item[] = [];
  for (const stage of requireCourse(lang).stages) {
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
  return { learned, total: courseIndex(lang).items.size, due, mastered };
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
export const UNLOCK = { match: 6, blitz: 8, listen: 8, crossword: 12 };
