// 一次載入全部語言的全部題目。只給測試和工具（產生大綱）用：
// App 裡請用 index.ts 的 ensure／useContent／CourseGate，引用這個檔案會把所有題目一次下載回來。
import type { Course, LangId, Unit } from '../core/types';
import { LANGS } from '../core/types';
import { META } from './meta';
import { CONCEPTS, MOCKS, PARTS } from './parts';

/** 每個關卡各包的單元（順序和 PARTS 一樣） */
export const PART_UNITS: Record<string, Unit[][]> = {};
for (const [stageId, loaders] of Object.entries(PARTS)) PART_UNITS[stageId] = await Promise.all(loaders.map((load) => load()));

async function build(lang: LangId): Promise<Course> {
  const meta = META[lang];
  return {
    ...meta,
    stages: meta.stages.map((s) => ({ ...s, units: (PART_UNITS[s.id] ?? []).flat() })),
    mocks: await MOCKS[lang](),
    concepts: await CONCEPTS[lang](),
  };
}

export const COURSES = Object.fromEntries(await Promise.all(LANGS.map(async (l) => [l, await build(l)]))) as Record<LangId, Course>;
export const COURSE_LIST: Course[] = LANGS.map((l) => COURSES[l]);
