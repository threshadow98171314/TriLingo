// 「今天的學習」：先複習到期的字（有上限，幾分鐘就能做完），再上下一堂新課（有學習目標時，從目標範圍內找）。
// 只看存檔和大綱就排得出來，「今天」頁不用下載題目。純函式，畫面在 pages/Home.tsx、pages/Practice.tsx。
import { OUTLINE } from '../content';
import { goalStages } from './goals';
import { nextInStage, nextUp, quickStats, type NextUp } from './progress';
import type { Save } from './save';
import type { LangId, StageOutline } from './types';

/** 一次「今天的學習」最多複習幾個字（剩下的明天、或到練功的「今日複習」繼續） */
export const TODAY_REVIEW = 12;

export interface TodayPlan {
  /** 這次要複習幾個字 */
  review: number;
  /** 到期的字一共幾個（可能比這次複習的多） */
  due: number;
  /** 下一堂新課 */
  lesson: { id: string; label: string } | null;
  /** 這個語言還沒學過任何東西 */
  fresh: boolean;
}

/**
 * 今天的新課：有學習目標（還沒完成）時，照順序找目標範圍裡第一堂還沒上的課；
 * 沒有目標或目標完成了，就接著目前的關卡（nextUp）。今天卡片、今天的學習頁、預先下載都用這個。
 */
export function todayLesson(s: Save, lang: LangId): NextUp<StageOutline> | null {
  const course = OUTLINE[lang];
  const goal = s.goals[lang];
  if (goal?.stage) {
    for (const st of goalStages(course, goal.stage)) {
      const n = nextInStage(s, st);
      if (n) return n;
    }
  }
  return nextUp(s, course);
}

export function todayPlan(s: Save, lang: LangId): TodayPlan {
  const q = quickStats(s, lang);
  const up = todayLesson(s, lang);
  const lesson = up ? { id: up.lesson.id, label: `${up.stage.short} › ${up.unit.title}・${up.lesson.boss ? '單元測驗' : up.lesson.title}` } : null;
  return { review: Math.min(q.due, TODAY_REVIEW), due: q.due, lesson, fresh: q.learned === 0 };
}
