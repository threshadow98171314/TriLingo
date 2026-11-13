// 學習目標的每週計畫：在目標日期之前完成目標關卡——範圍內還剩幾課、到目標日期還有幾週、
// 這週該上幾課、這週已經上了幾課（只算第一次完成的課）。只看存檔和大綱，純函式；
// 畫面在 pages/Home.tsx（今天的卡片）和 components/GoalModal.tsx。
import { addDays, dayNum, today } from './date';
import { pathUnits, starsOf } from './progress';
import type { Goal, Save } from './save';
import type { CourseOutline, StageOutline } from './types';

export interface GoalPlan {
  goal: Goal;
  /** 目標關卡 */
  stage: StageOutline;
  /** 範圍內還沒上過的課（學習路線，不含單字庫） */
  remaining: number;
  /** 範圍內全部的課 */
  total: number;
  /** 包含這週，到目標日期還有幾週 */
  weeks: number;
  /** 這週要上幾課 */
  weekly: number;
  /** 這週已經上了幾課 */
  thisWeek: number;
  /** done：目標關卡完成了；late：過了目標日期還沒完成 */
  status: 'active' | 'done' | 'late';
}

/** 這一週的星期一（YYYY-MM-DD） */
export function weekStart(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  const wd = new Date(y, m - 1, d).getDay(); // 0 是星期日
  return addDays(day, -((wd + 6) % 7));
}

/** 目標的範圍：主路線是從第一關一路到目標關卡；主題路線就只有那一關 */
export function goalStages(course: CourseOutline, stageId: string): StageOutline[] {
  const target = course.stages.find((s) => s.id === stageId);
  if (!target) return [];
  if (target.group !== 'main') return [target];
  const main = course.stages.filter((s) => s.group === 'main');
  return main.slice(0, main.indexOf(target) + 1);
}

/** 目標的每週計畫；沒有目標（或目標關卡不存在）時回傳 null。goal 可以傳還沒存的目標（設定時預覽用） */
export function goalPlan(s: Save, course: CourseOutline, goal: Goal | undefined = s.goals[course.id]): GoalPlan | null {
  if (!goal?.stage) return null;
  const scope = goalStages(course, goal.stage);
  const stage = scope[scope.length - 1];
  if (!stage) return null;
  let remaining = 0;
  let total = 0;
  for (const st of scope)
    for (const u of pathUnits(st))
      for (const l of u.lessons) {
        total++;
        if (!starsOf(s, l.id)) remaining++;
      }
  const t = today();
  const monday = weekStart(t);
  let thisWeek = 0;
  for (let day = monday; day <= t; day = addDays(day, 1)) thisWeek += s.days[day]?.lessonsBy?.[course.id] ?? 0;
  const weeks = Math.max(1, Math.ceil((dayNum(goal.by) - dayNum(monday) + 1) / 7));
  // 用這週一開始時還剩的課來算，這週上了幾課不會讓這週的份量跟著變
  const weekly = Math.ceil((remaining + thisWeek) / weeks);
  const status = remaining === 0 ? 'done' : t > goal.by ? 'late' : 'active';
  return { goal, stage, remaining, total, weeks, weekly, thisWeek, status };
}
