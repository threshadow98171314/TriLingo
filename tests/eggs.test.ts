// 彩蛋、隱藏成就與過關時的隨機獎勵（幸運星、黃金寶箱）。
// 測試環境沒有畫面與 localStorage：特效、音效會自動略過，存檔只留在記憶體。
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ACHIEVEMENTS } from '../src/core/achievements';
import { DATE_EGGS, EGG_BY_ID, EGGS } from '../src/core/eggData';
import { eggKeyDown, setEggKeysEnabled, tapCount, whisper, type EggKey } from '../src/core/eggs';
import { mergeSaves } from '../src/core/merge';
import { defaultSave } from '../src/core/save';
import { discoverEgg, finishLesson, getSave, resetSave, type SessionStats } from '../src/core/store';
import type { Lesson, Unit } from '../src/core/types';

const at = (y: number, mon: number, d: number, h = 10, min = 0) => new Date(y, mon - 1, d, h, min);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(at(2026, 10, 15));
  resetSave();
  setEggKeysEnabled(true);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const press = (keys: string[], target: EventTarget | null = null) => {
  for (const key of keys) eggKeyDown({ key, ctrlKey: false, metaKey: false, altKey: false, repeat: false, target } as EggKey);
};

describe('彩蛋資料', () => {
  it('id 不重複；每個彩蛋都有提示和金幣', () => {
    expect(new Set(EGGS.map((e) => e.id)).size).toBe(EGGS.length);
    for (const e of EGGS) {
      expect(e.hint.length, e.id).toBeGreaterThan(0);
      expect(e.coins, e.id).toBeGreaterThan(0);
    }
  });

  it('日期彩蛋的格式是 MM-DD，而且對得到彩蛋', () => {
    for (const [md, id] of Object.entries(DATE_EGGS)) {
      expect(md).toMatch(/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);
      expect(EGG_BY_ID.has(id), id).toBe(true);
    }
  });

  it('隱藏成就都有提示', () => {
    const hidden = ACHIEVEMENTS.filter((a) => a.hidden);
    expect(hidden.length).toBeGreaterThan(0);
    for (const a of hidden) expect(a.hint, a.id).toBeTruthy();
  });
});

describe('發現彩蛋', () => {
  it('第一次發現給金幣並記錄時間，再觸發不會重複給', () => {
    const coins = getSave().coins;
    expect(discoverEgg('mascot')).toBe(true);
    expect(getSave().coins).toBe(coins + EGG_BY_ID.get('mascot')!.coins);
    expect(getSave().eggs.mascot).toBe(Date.now());
    expect(discoverEgg('mascot')).toBe(false);
    expect(getSave().coins).toBe(coins + EGG_BY_ID.get('mascot')!.coins);
  });

  it('不存在的彩蛋沒有任何效果', () => {
    const coins = getSave().coins;
    expect(discoverEgg('not-an-egg')).toBe(false);
    expect(getSave().eggs).toEqual({});
    expect(getSave().coins).toBe(coins);
  });

  it('Logo 彩蛋會解鎖恐龍頭像', () => {
    discoverEgg('logo');
    expect(getSave().avatars).toContain('🦖');
  });

  it('收集 3 個彩蛋解鎖「彩蛋新手」', () => {
    for (const id of ['mascot', 'poke', 'dev']) discoverEgg(id);
    expect(getSave().ach.egg_3).toBeTruthy();
  });

  it('悄悄話：不分大小寫、忽略空白標點，也認得日文、韓文、中文', () => {
    expect(whisper('  Sakura!! ')).toBe(true);
    expect(whisper('사랑해요')).toBe(true);
    expect(whisper('喵')).toBe(true);
    expect(whisper('T O E I C')).toBe(true);
    expect(whisper('hello')).toBe(false);
    expect(Object.keys(getSave().eggs).sort()).toEqual(['meow', 'sakura', 'saranghae', 'toeic']);
  });

  it('鍵盤秘技 ↑↑↓↓←→←→BA', () => {
    press(['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']);
    expect(getSave().eggs.konami).toBeTruthy();
  });

  it('直接在鍵盤上打出秘密單字（前面打錯字也沒關係）', () => {
    press(['x', 'd', 'a', 'e', 'b', 'a', 'k']);
    expect(getSave().eggs.daebak).toBeTruthy();
  });

  it('上課時、或在輸入框裡打字，不會觸發秘密單字', () => {
    setEggKeysEnabled(false);
    press(['m', 'e', 'o', 'w']);
    setEggKeysEnabled(true);
    press(['m', 'e', 'o', 'w'], { closest: () => ({}) } as unknown as EventTarget);
    expect(getSave().eggs.meow).toBeUndefined();
  });

  it('連點計數：時間內點滿才算，觸發後重新計算', () => {
    expect([1, 2, 3].map(() => tapCount('t', 3, 1000))).toEqual([false, false, true]);
    expect(tapCount('t', 3, 1000)).toBe(false);
    // 點太慢：每次都從頭算
    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(1500);
      expect(tapCount('slow', 3, 1000)).toBe(false);
    }
  });
});

// 一堂測試用的課（項目內容不影響結算）
const lesson: Lesson = { id: 'en.test.u#1', title: '第 1 課', itemIds: [] };
const boss: Lesson = { id: 'en.test.u#boss', title: '單元測驗', itemIds: [], boss: true };
const unit: Unit = { id: 'en.test.u', icon: '🧪', title: '測試', subtitle: '', kind: 'vocab', items: [], lessons: [lesson, boss] };
const play = (stats: Partial<SessionStats> = {}, l: Lesson = lesson) =>
  finishLesson({ lang: 'en', unit, lesson: l, stats: { graded: 5, correct: 5, maxCombo: 5, seconds: 90, ...stats } });

describe('日期與時間彩蛋', () => {
  it('聖誕節打開 App 就會發現聖誕彩蛋', () => {
    vi.setSystemTime(at(2026, 12, 24));
    resetSave();
    expect(getSave().eggs.xmas).toBeUndefined();
    vi.setSystemTime(at(2026, 12, 25, 8));
    discoverEgg('not-an-egg'); // 任何會更新存檔的動作都會做換日檢查
    expect(getSave().eggs.xmas).toBeTruthy();
  });

  it('凌晨三點學習：夜貓子彩蛋', () => {
    vi.setSystemTime(at(2026, 10, 15, 3, 20));
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    play();
    expect(getSave().eggs.threeam).toBeTruthy();
  });

  it('12:34 學習：順子彩蛋；12:35 就不算', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    vi.setSystemTime(at(2026, 10, 15, 12, 35));
    play();
    expect(getSave().eggs.clock1234).toBeUndefined();
    vi.setSystemTime(at(2026, 10, 15, 12, 34));
    play();
    expect(getSave().eggs.clock1234).toBeTruthy();
  });
});

describe('過關的隨機獎勵', () => {
  it('幸運星：這堂課的 XP 加倍；同時開出黃金寶箱', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const o = play();
    expect(o.lucky).toBe(true);
    const [label, bonus] = o.parts[o.parts.length - 1];
    expect(label).toBe('幸運星：XP 加倍');
    const base = o.parts.slice(0, -1).reduce((a, [, x]) => a + x, 0);
    expect(bonus).toBe(base);
    expect(o.reward.xp).toBe(base * 2);
    expect(o.golden).toBe(true);
    expect(o.chest).toBeGreaterThanOrEqual(60);
    expect(o.chest).toBeLessThanOrEqual(120);
    const s = getSave();
    expect(s.stats.luckyStars).toBe(1);
    expect(s.stats.goldenChests).toBe(1);
    expect(s.eggs.lucky && s.eggs.golden).toBeTruthy();
  });

  it('一般寶箱 5–20 金幣，沒有幸運星', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const o = play();
    expect(o.lucky).toBe(false);
    expect(o.golden).toBe(false);
    expect(o.chest).toBeGreaterThanOrEqual(5);
    expect(o.chest).toBeLessThanOrEqual(20);
  });

  it('運氣普通：沒有寶箱', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const o = play();
    expect([o.lucky, o.golden, o.chest]).toEqual([false, false, 0]);
  });

  it('沒通過單元測驗不會有幸運星和寶箱', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const o = play({ graded: 10, correct: 5 }, boss);
    expect([o.passed, o.lucky, o.golden, o.chest]).toEqual([false, false, false, 0]);
  });
});

describe('隱藏成就', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  it('連續全對累積紀錄，失誤就歸零但保留最佳紀錄', () => {
    play();
    play();
    play();
    expect(getSave().stats.perfectRun).toBe(3);
    expect(getSave().ach.perfect_run3).toBeTruthy();
    expect(getSave().ach.perfect_run10).toBeUndefined();
    play({ correct: 4 });
    expect(getSave().stats.perfectRun).toBe(0);
    expect(getSave().stats.perfectRunBest).toBe(3);
  });

  it('一天連續 10 堂全對：完美機器＋學習馬拉松', () => {
    for (let i = 0; i < 10; i++) play();
    expect(getSave().ach.perfect_run10).toBeTruthy();
    expect(getSave().ach.marathon).toBeTruthy();
  });

  it('60 秒內全對完成一堂課：神速', () => {
    play({ seconds: 61 });
    expect(getSave().ach.speedrun).toBeUndefined();
    play({ seconds: 45 });
    expect(getSave().ach.speedrun).toBeTruthy();
  });

  it('單元測驗全對：完封測驗', () => {
    play({ graded: 12, correct: 12 }, boss);
    expect(getSave().ach.boss_perfect).toBeTruthy();
  });

  it('答對不到一半仍把課上完：永不放棄', () => {
    play({ graded: 6, correct: 2 });
    expect(getSave().ach.grit).toBeTruthy();
  });
});

describe('雲端合併', () => {
  it('兩台裝置發現的彩蛋取聯集，發現時間取較早的', () => {
    const a = { ...defaultSave(0), eggs: { sakura: 5, logo: 9 } };
    const b = { ...defaultSave(0), eggs: { sakura: 3, konami: 7 } };
    expect(mergeSaves(a, b).eggs).toEqual({ sakura: 3, logo: 9, konami: 7 });
  });

  it('隱藏成就用到的統計取較大值，解鎖的頭像取聯集', () => {
    const a = defaultSave(0);
    const b = defaultSave(0);
    a.stats = { ...a.stats, perfectRunBest: 4, luckyStars: 2 };
    b.stats = { ...b.stats, perfectRunBest: 7, luckyStars: 1 };
    b.avatars = [...b.avatars, '🦖'];
    const m = mergeSaves(a, b);
    expect(m.stats.perfectRunBest).toBe(7);
    expect(m.stats.luckyStars).toBe(2);
    expect(m.avatars).toContain('🦖');
  });
});
