// 大綱：每個關卡有哪些單元、幾課、幾個字，不含題目。
// 由題目自動產生（npm run outline → gen/outline-*.json），隨主程式載入；App 靠大綱就能畫出首頁和學習路線，
// 題目等上課時再下載。大綱檔的欄位名稱縮短、能推算的不存（課的 id 是「單元 id#第幾課」），檔案才小。
import type { Course, CourseOutline, LangId, LessonOutline, Unit, UnitKind, UnitOutline } from '../core/types';
import { META } from './meta';

/** 大綱檔裡的一個單元 */
export interface RawUnit {
  id: string;
  /** 圖示 */
  i: string;
  /** 標題 */
  t: string;
  /** 副標題（單字庫的「N 個字」可以推算，不存） */
  s?: string;
  k: UnitKind;
  /** 單字庫的分組名稱 */
  b?: string;
  /** 項目數 */
  n: number;
  /** 題目在關卡的第幾包（第 0 包不存） */
  p?: number;
  /** 各課的標題（不含最後的測驗）；全部都是「第 n 課」時只存課數 */
  l: string[] | number;
  /** 測驗的標題（不是「單元測驗」時才存） */
  q?: string;
  /** 有字母表 */
  c?: 1;
}

export interface RawOutline {
  lang: LangId;
  total: number;
  stages: Record<string, RawUnit[]>;
}

const BOSS_TITLE = '單元測驗';
const nth = (i: number) => `第 ${i + 1} 課`;
const deckSubtitle = (n: number) => `${n} 個字`;

/** 存檔、課程的 id 都以關卡 id 開頭（ja.n5.greet → ja.n5） */
export const stageIdOf = (id: string): string => id.split('.', 2).join('.');
/** 項目 id 是「單元 id:原文」、課的 id 是「單元 id#第幾課」 */
export const unitIdOf = (id: string): string => {
  const k = id.search(/[:#]/);
  return k < 0 ? id : id.slice(0, k);
};

/** 一個單元 → 大綱檔的寫法。順便檢查 id 的規則（App 靠這些規則從 id 推算關卡、單元、課） */
export function encodeUnit(stageId: string, u: Unit, part: number): RawUnit {
  if (!u.id.startsWith(`${stageId}.`)) throw new Error(`單元 id 要以關卡 id 開頭：${u.id}（關卡 ${stageId}）`);
  if (/[:#]/.test(u.id)) throw new Error(`單元 id 不能有「:」「#」：${u.id}`);
  const boss = u.lessons[u.lessons.length - 1];
  if (!boss?.boss || boss.id !== `${u.id}#boss`) throw new Error(`單元的最後一課要是測驗（${u.id}#boss）`);
  const rest = u.lessons.slice(0, -1);
  rest.forEach((l, i) => {
    if (l.boss || l.id !== `${u.id}#${i + 1}`) throw new Error(`課的 id 要是「單元 id#第幾課」：${l.id}`);
  });
  for (const it of u.items) if (!it.id.startsWith(`${u.id}:`)) throw new Error(`項目 id 要以「單元 id:」開頭：${it.id}`);

  const raw: RawUnit = { id: u.id, i: u.icon, t: u.title, k: u.kind, n: u.items.length, l: rest.every((l, i) => l.title === nth(i)) ? rest.length : rest.map((l) => l.title) };
  if (u.subtitle !== undefined && !(u.bank && u.subtitle === deckSubtitle(u.items.length))) raw.s = u.subtitle;
  if (u.bank) raw.b = u.bank;
  if (part) raw.p = part;
  if (boss.title !== BOSS_TITLE) raw.q = boss.title;
  if (u.chart) raw.c = 1;
  return raw;
}

export function decodeUnit(r: RawUnit): UnitOutline {
  const titles = typeof r.l === 'number' ? Array.from({ length: r.l }, (_, i) => nth(i)) : r.l;
  const lessons: LessonOutline[] = titles.map((title, i) => ({ id: `${r.id}#${i + 1}`, title }));
  lessons.push({ id: `${r.id}#boss`, title: r.q ?? BOSS_TITLE, boss: true });
  const u: UnitOutline = { id: r.id, title: r.t, icon: r.i, kind: r.k, count: r.n, lessons, part: r.p ?? 0 };
  const subtitle = r.s ?? (r.b ? deckSubtitle(r.n) : undefined);
  if (subtitle !== undefined) u.subtitle = subtitle;
  if (r.b) u.bank = r.b;
  if (r.c) u.hasChart = true;
  return u;
}

/** 完整的課程 → 大綱檔。parts 是每個關卡各包的單元（content/all.ts 的 PART_UNITS） */
export function encodeOutline(course: Course, parts: Record<string, Unit[][]>): RawOutline {
  const stages: Record<string, RawUnit[]> = {};
  let total = 0;
  for (const st of course.stages) {
    if (stageIdOf(st.id) !== st.id || !st.id.startsWith(`${course.id}.`)) throw new Error(`關卡 id 要是「語言.名稱」：${st.id}`);
    const list = (parts[st.id] ?? []).flatMap((units, part) => units.map((u) => encodeUnit(st.id, u, part)));
    if (list.length) stages[st.id] = list;
    total += list.reduce((a, u) => a + u.n, 0);
  }
  return { lang: course.id, total, stages };
}

/** 大綱檔 → App 用的大綱（補上 meta.ts 的關卡資料） */
export function decodeOutline(raw: RawOutline): CourseOutline {
  const meta = META[raw.lang];
  return { ...meta, total: raw.total, stages: meta.stages.map((s) => ({ ...s, units: (raw.stages[s.id] ?? []).map(decodeUnit) })) };
}

/** 完整的課程 → 大綱（測試和工具用，不經過檔案） */
export const outlineOf = (course: Course, parts: Record<string, Unit[][]>): CourseOutline => decodeOutline(encodeOutline(course, parts));

/** 大綱檔的文字：一個單元一行，改了哪個單元在 git 上一眼看得出來 */
export function formatOutline(raw: RawOutline): string {
  const stages = Object.entries(raw.stages).map(([id, units]) => `${JSON.stringify(id)}:[\n${units.map((u) => JSON.stringify(u)).join(',\n')}\n]`);
  return `{"lang":${JSON.stringify(raw.lang)},"total":${raw.total},"stages":{\n${stages.join(',\n')}\n}}\n`;
}
