// 學習目標：每週計畫的計算、完成課程時記錄這週上了幾課、目標與證書的雲端合併
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OUTLINE } from '../src/content/index';
import { goalPlan, goalStages, weekStart } from '../src/core/goals';
import { mergeSaves } from '../src/core/merge';
import { defaultSave, emptyDay, migrate } from '../src/core/save';
import { finishLesson, getSave, markCert, resetSave, setGoal } from '../src/core/store';
import type { Lesson, Unit } from '../src/core/types';
import { zhJoin } from '../src/core/util';

beforeEach(() => {
  vi.useFakeTimers();
  // 2026-11-13 是星期五
  vi.setSystemTime(new Date(2026, 10, 13, 10));
  resetSave();
});

afterEach(() => {
  vi.useRealTimers();
});

const lessonsOf = (stageId: string) =>
  OUTLINE.ja.stages
    .find((s) => s.id === stageId)!
    .units.filter((u) => !u.bank)
    .flatMap((u) => u.lessons);

describe('學習目標的每週計畫', () => {
  it('一週從星期一開始', () => {
    expect(weekStart('2026-11-13')).toBe('2026-11-09');
    expect(weekStart('2026-11-09')).toBe('2026-11-09');
    expect(weekStart('2026-11-15')).toBe('2026-11-09');
    expect(weekStart('2026-11-16')).toBe('2026-11-16');
  });

  it('主路線的目標包含前面所有關卡；主題路線只有那一關', () => {
    expect(goalStages(OUTLINE.ja, 'ja.n4').map((s) => s.id)).toEqual(['ja.kana', 'ja.n5', 'ja.n4']);
    expect(goalStages(OUTLINE.ja, 'ja.travel').map((s) => s.id)).toEqual(['ja.travel']);
    expect(goalStages(OUTLINE.ja, 'ja.nope')).toEqual([]);
  });

  it('剩下的課平均分到每一週；這週只算這個語言、這週一以後的課', () => {
    const s = defaultSave(Date.now());
    s.goals.ja = { stage: 'ja.kana', by: '2026-12-31', at: 1 };
    s.days['2026-11-10'] = { ...emptyDay(), lessonsBy: { ja: 3, en: 2 } };
    s.days['2026-11-06'] = { ...emptyDay(), lessonsBy: { ja: 5 } };
    const total = lessonsOf('ja.kana').length;
    const p = goalPlan(s, OUTLINE.ja)!;
    expect(p).toMatchObject({ remaining: total, total, thisWeek: 3, status: 'active' });
    // 11/9 到 12/31 共 53 天 → 8 週
    expect(p.weeks).toBe(8);
    expect(p.weekly).toBe(Math.ceil((total + 3) / 8));
    expect(p.stage.id).toBe('ja.kana');
  });

  it('目標關卡完成了是 done；過了日期還沒完成是 late；取消了是沒有目標', () => {
    const s = defaultSave(Date.now());
    s.goals.ja = { stage: 'ja.kana', by: '2026-11-01', at: 1 };
    expect(goalPlan(s, OUTLINE.ja)!.status).toBe('late');
    for (const l of lessonsOf('ja.kana')) s.lessons[l.id] = { stars: 3, plays: 1 };
    expect(goalPlan(s, OUTLINE.ja)).toMatchObject({ status: 'done', remaining: 0 });
    s.goals.ja = { stage: '', by: '', at: 2 };
    expect(goalPlan(s, OUTLINE.ja)).toBeNull();
    expect(goalPlan(s, OUTLINE.en)).toBeNull();
  });
});

describe('目標的文字', () => {
  it('英數字和中日韓文字相接才加空白，全形標點旁邊不加', () => {
    expect(zhJoin('三個月內完成', 'N5')).toBe('三個月內完成 N5');
    expect(zhJoin('三個月內完成', '五十音')).toBe('三個月內完成五十音');
    expect(zhJoin('2027/2/12', '前完成', 'N3')).toBe('2027/2/12 前完成 N3');
    expect(zhJoin('目標達成：', 'N5', '完成了！')).toBe('目標達成：N5 完成了！');
    expect(zhJoin('完成', '初級 1', '之前還有')).toBe('完成初級 1 之前還有');
    expect(zhJoin('完成', '한글')).toBe('完成한글');
  });
});

describe('完成課程時記錄這週上了幾課', () => {
  const l1: Lesson = { id: 'ja.test.u#1', title: '第 1 課', itemIds: [] };
  const l2: Lesson = { id: 'ja.test.u#2', title: '第 2 課', itemIds: [] };
  const boss: Lesson = { id: 'ja.test.u#boss', title: '單元測驗', itemIds: [], boss: true };
  const unit: Unit = { id: 'ja.test.u', icon: '🧪', title: '測試', subtitle: '', kind: 'vocab', items: [], lessons: [l1, l2, boss] };
  const play = (lesson: Lesson, correct = 5) => finishLesson({ lang: 'ja', unit, lesson, stats: { graded: 5, correct, maxCombo: 5, seconds: 90 } });
  const today = () => getSave().days['2026-11-13'].lessonsBy?.ja ?? 0;

  it('第一次完成才算，重上不算；單元測驗跳級時，沒上過的課一起算', () => {
    play(l1);
    expect(today()).toBe(1);
    play(l1);
    expect(today()).toBe(1);
    play(boss, 1);
    expect(today()).toBe(1);
    play(boss);
    expect(today()).toBe(3);
  });

  it('設定、取消目標；證書日期只記第一次', () => {
    setGoal('ja', 'ja.n5', '2027-03-31');
    expect(getSave().goals.ja).toMatchObject({ stage: 'ja.n5', by: '2027-03-31' });
    setGoal('ja', '', '');
    expect(getSave().goals.ja?.stage).toBe('');
    markCert('ja.kana');
    vi.setSystemTime(new Date(2026, 10, 20, 10));
    markCert('ja.kana');
    expect(getSave().certs).toEqual({ 'ja.kana': '2026-11-13' });
  });
});

describe('雲端合併與舊存檔', () => {
  it('目標取最後設定的那份；證書取比較早的日期；每天的課數取較大值', () => {
    const a = defaultSave(1);
    const b = defaultSave(1);
    a.goals = { ja: { stage: 'ja.n5', by: '2027-01-31', at: 10 }, ko: { stage: 'ko.k1', by: '2027-02-28', at: 30 } };
    b.goals = { ja: { stage: '', by: '', at: 20 }, en: { stage: 'en.brown', by: '2027-06-30', at: 5 } };
    a.certs = { 'ja.kana': '2026-11-01', 'ja.n5': '2026-11-20' };
    b.certs = { 'ja.n5': '2026-11-10', 'ko.k1': '2026-11-11' };
    a.days['2026-11-13'] = { ...emptyDay(), lessonsBy: { ja: 2 } };
    b.days['2026-11-13'] = { ...emptyDay(), lessonsBy: { ja: 1, ko: 4 } };
    b.days['2026-11-12'] = emptyDay();
    const m = mergeSaves(a, b);
    expect(m.goals).toEqual({ ja: { stage: '', by: '', at: 20 }, ko: a.goals.ko, en: b.goals.en });
    expect(m.certs).toEqual({ 'ja.kana': '2026-11-01', 'ja.n5': '2026-11-10', 'ko.k1': '2026-11-11' });
    expect(m.days['2026-11-13'].lessonsBy).toEqual({ ja: 2, ko: 4 });
    expect(m.days['2026-11-12'].lessonsBy).toBeUndefined();
  });

  it('舊存檔補上目標與證書', () => {
    const old = migrate({ xp: { en: 1, ja: 0, ko: 0 } }, 0);
    expect(old.goals).toEqual({});
    expect(old.certs).toEqual({});
  });
});
