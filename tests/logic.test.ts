import { describe, expect, it } from 'vitest';
import { addDays, dayNum, diffDays } from '../src/core/date';
import { INTERVALS, mastery, newProg, rolloverStreak, srsReview, srsTouch, touchStreak, type StreakState } from '../src/core/logic';
import { questsFor } from '../src/core/quests';
import { MAX_STEP, rankOf, stepFloor, stepName, TIERS } from '../src/core/ranks';
import { chunkEven } from '../src/core/util';

describe('段位', () => {
  it('依序是 鐵 銅 銀 金 白金 鑽石 大師 宗師 菁英 聖哲', () => {
    expect(TIERS.map((t) => t.name)).toEqual(['鐵', '銅', '銀', '金', '白金', '鑽石', '大師', '宗師', '菁英', '聖哲']);
  });

  it('門檻嚴格遞增', () => {
    for (let s = 1; s <= MAX_STEP; s++) expect(stepFloor(s)).toBeGreaterThan(stepFloor(s - 1));
  });

  it('從鐵 III 開始，每個段位分 III → II → I', () => {
    expect(rankOf(0).name).toBe('鐵 III');
    expect(stepName(1)).toBe('鐵 II');
    expect(stepName(2)).toBe('鐵 I');
    expect(stepName(3)).toBe('銅 III');
  });

  it('剛好達到門檻就升階，差 1 XP 不升', () => {
    for (let s = 1; s <= MAX_STEP; s++) {
      expect(rankOf(stepFloor(s)).step).toBe(s);
      expect(rankOf(stepFloor(s) - 1).step).toBe(s - 1);
    }
  });

  it('聖哲是最高段位，沒有下一階', () => {
    const r = rankOf(TIERS[TIERS.length - 1].min + 12345);
    expect(r.name).toBe('聖哲');
    expect(r.next).toBeNull();
    expect(r.progress).toBe(1);
  });

  it('進度與距離下一階的 XP 正確', () => {
    const r = rankOf(50);
    expect(r.next).toBe(100);
    expect(r.toNext).toBe(50);
    expect(r.progress).toBeCloseTo(0.5);
  });
});

describe('連勝', () => {
  const base: StreakState = { count: 5, best: 5, last: '2026-03-10', freezes: 0 };

  it('隔天學習會延續', () => {
    const r = touchStreak(base, '2026-03-11');
    expect(r.extended).toBe(true);
    expect(r.streak.count).toBe(6);
    expect(r.streak.best).toBe(6);
  });

  it('同一天再學習不會重複計算', () => {
    const r = touchStreak(base, '2026-03-10');
    expect(r.extended).toBe(false);
    expect(r.streak.count).toBe(5);
  });

  it('缺席一天且沒有保護：歸零後重新從 1 開始', () => {
    const roll = rolloverStreak(base, '2026-03-12');
    expect(roll.broken).toBe(true);
    expect(roll.streak.count).toBe(0);
    expect(touchStreak(roll.streak, '2026-03-12').streak.count).toBe(1);
    expect(touchStreak(roll.streak, '2026-03-12').streak.best).toBe(5);
  });

  it('缺席一天但有保護：消耗保護、連勝延續', () => {
    const roll = rolloverStreak({ ...base, freezes: 1 }, '2026-03-12');
    expect(roll.broken).toBe(false);
    expect(roll.frozen).toEqual(['2026-03-11']);
    expect(roll.streak.freezes).toBe(0);
    expect(touchStreak(roll.streak, '2026-03-12').streak.count).toBe(6);
  });

  it('缺席兩天但只有一個保護：保護不夠，連勝中斷且不消耗保護', () => {
    const roll = rolloverStreak({ ...base, freezes: 1 }, '2026-03-13');
    expect(roll.broken).toBe(true);
    expect(roll.streak.freezes).toBe(1);
  });

  it('昨天有學習：換日不影響連勝', () => {
    const roll = rolloverStreak(base, '2026-03-11');
    expect(roll.streak).toEqual(base);
  });

  it('跨月、跨年的日期計算正確', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2028-03-01', -1)).toBe('2028-02-29');
    expect(diffDays('2026-02-27', '2026-03-02')).toBe(3);
  });
});

describe('間隔複習', () => {
  const day = dayNum('2026-03-10');

  it('新學的字隔天複習', () => {
    const p = newProg(true, day, 0);
    expect(p.s).toBe(1);
    expect(p.due).toBe(day + 1);
  });

  it('複習答對：間隔依 1 → 3 → 7 → 14 → 30 → 60 → 120 天拉長', () => {
    let p = newProg(true, day, 0);
    const gaps: number[] = [];
    for (let i = 0; i < 8; i++) {
      p = srsReview(p, true, day, 0);
      gaps.push(p.due - day);
    }
    expect(gaps).toEqual([3, 7, 14, 30, 60, 120, 120, 120]);
    expect(p.s).toBe(INTERVALS.length - 1);
    expect(mastery(p)).toBe(4);
  });

  it('複習答錯：退兩級，隔天再複習', () => {
    const p = srsReview({ s: 5, due: day, ok: 6, ng: 0, t: 0 }, false, day, 0);
    expect(p.s).toBe(3);
    expect(p.due).toBe(day + 1);
    expect(p.ng).toBe(1);
  });

  it('小遊戲答對不會拉長間隔；答錯會提早進入複習', () => {
    const p0 = { s: 4, due: day + 10, ok: 5, ng: 0, t: 0 };
    expect(srsTouch(p0, true, day, 0).due).toBe(day + 10);
    expect(srsTouch(p0, true, day, 0).s).toBe(4);
    const wrong = srsTouch(p0, false, day, 0);
    expect(wrong.due).toBe(day);
    expect(wrong.s).toBe(3);
  });
});

describe('每日任務', () => {
  it('每天 3 個不重複的任務，同一天結果固定', () => {
    for (let i = 0; i < 60; i++) {
      const date = addDays('2026-01-01', i);
      const q = questsFor(date);
      expect(q).toHaveLength(3);
      expect(new Set(q.map((x) => x.id)).size).toBe(3);
      expect(questsFor(date).map((x) => x.text)).toEqual(q.map((x) => x.text));
    }
  });

  it('每天至少有一個新手也做得到的任務', () => {
    for (let i = 0; i < 60; i++) {
      const ids = questsFor(addDays('2026-01-01', i)).map((x) => x.id);
      expect(ids.some((id) => id === 'xp' || id === 'lessons')).toBe(true);
    }
  });
});

describe('chunkEven', () => {
  it('平均分組，各組大小最多差 1', () => {
    expect(chunkEven([...Array(12).keys()], 5).map((g) => g.length)).toEqual([4, 4, 4]);
    expect(chunkEven([...Array(14).keys()], 5).map((g) => g.length)).toEqual([5, 5, 4]);
    expect(chunkEven([...Array(10).keys()], 5).map((g) => g.length)).toEqual([5, 5]);
    expect(chunkEven([], 5)).toEqual([]);
  });
});
