import type { Course, Item, LangId, Lesson, Stage, Unit } from '../core/types';
import { EN } from './en';
import { JA } from './ja';
import { KO } from './ko';

export const COURSES: Record<LangId, Course> = { en: EN, ja: JA, ko: KO };
export const COURSE_LIST: Course[] = [EN, JA, KO];

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

/** 由 id 反查項目／課程所在的單元與關卡 */
export function courseIndex(lang: LangId): CourseIndex {
  let idx = cache.get(lang);
  if (idx) return idx;
  idx = { items: new Map(), lessons: new Map(), units: new Map() };
  for (const stage of COURSES[lang].stages) {
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
