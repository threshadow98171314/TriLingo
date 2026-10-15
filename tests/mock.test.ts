// 實戰模擬考：題庫內容、組卷、自動出題、計分、存檔。
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { COURSE_LIST, COURSES } from '../src/content/all';
import { mulberry32 } from '../src/core/rng';
import type { MockExam } from '../src/core/types';
import { furiKana, furiPlain } from '../src/engine/furigana';
import { buildPaper, kanjiReadingGroups, levelOf, paperSections, parseLine, scorePaper } from '../src/engine/mock';
import { expectedCount } from '../src/pages/Mock';

const exams = COURSE_LIST.flatMap((c) => c.mocks.map((m) => ({ lang: c.id, m })));
const KANJI = /[㐀-鿿々]/;
/** 去掉畫底線的部分（考讀音的漢字故意不標讀音） */
const noUnderline = (s: string) => s.replace(/\{[^}]*\}/g, '');

describe('模擬考題庫', () => {
  it('三種語言都有模擬考', () => {
    for (const c of COURSE_LIST) expect(c.mocks.length, c.id).toBeGreaterThan(0);
  });

  it('id 唯一；每題至少 3 個不重複的選項；抽題數不超過題組數', () => {
    const seen = new Set<string>();
    for (const { m } of exams) {
      expect(m.levels.length, m.id).toBeGreaterThan(0);
      expect(m.levels.some((l) => l.min === 0), `${m.id} 要有最低一級`).toBe(true);
      for (const s of m.sections) {
        expect(s.intro.length, `${m.id}/${s.id}`).toBeGreaterThan(0);
        if (s.pick) expect(s.pick, `${m.id}/${s.id}`).toBeLessThanOrEqual(s.groups.length);
        expect(s.groups.length + (s.gen?.count ?? 0), `${m.id}/${s.id}`).toBeGreaterThan(0);
        for (const g of s.groups) {
          expect(g.qs.length, g.id).toBeGreaterThan(0);
          for (const q of g.qs) {
            expect(seen.has(q.id), q.id).toBe(false);
            seen.add(q.id);
            expect(q.opts.length, q.id).toBeGreaterThanOrEqual(3);
            expect(new Set(q.opts).size, q.id).toBe(q.opts.length);
            expect(!!q.q || !!g.script || !!g.passage, `${q.id} 要有題目、文章或聽力`).toBe(true);
          }
        }
      }
    }
  });

  it('聽力大題每組都有聽力稿；閱讀大題不會有聽力稿', () => {
    for (const { m } of exams) {
      for (const s of m.sections) for (const g of s.groups) expect(!!g.script, `${m.id}/${s.id}/${g.id}`).toBe(!!s.listening);
    }
  });

  it('聽力稿是給語音朗讀的：不能有讀音標註，說話者只能是 M／F', () => {
    for (const { m } of exams) {
      for (const s of m.sections) {
        for (const g of s.groups) {
          for (const line of g.script ?? []) {
            expect(line, g.id).not.toMatch(/[[\]{}]/);
            expect(line, g.id).toMatch(/^[MF]: \S/);
          }
        }
      }
    }
  });

  it('日文：除了畫底線、考漢字寫法的選項以外，漢字都有標讀音', () => {
    const check = (s: string, where: string) => {
      const plain = noUnderline(s);
      expect(furiPlain(plain), where).not.toMatch(/[[\]]/);
      expect(furiKana(plain), where).not.toMatch(KANJI);
    };
    for (const m of COURSES.ja.mocks) {
      for (const s of m.sections) {
        for (const g of s.groups) {
          if (g.passage) check(g.passage, `${g.id} 文章`);
          for (const q of g.qs) {
            if (q.q) check(q.q, q.id);
            // 「漢字寫法」大題的選項就是在考漢字，不標讀音
            if (s.id !== 'hyoki') for (const o of q.opts) check(o, `${q.id} 選項`);
          }
        }
      }
    }
  });

  it('★ 句子重組題：題目裡有四個空格、其中一個是 ★', () => {
    for (const m of COURSES.ja.mocks) {
      for (const g of m.sections.find((s) => s.id === 'narabe')!.groups) {
        const q = g.qs[0].q!;
        expect(q.match(/＿＿＿|★/g)?.length, q).toBe(4);
        expect(q.split('★').length, q).toBe(2);
        expect(g.qs[0].opts.length).toBe(4);
      }
    }
  });
});

describe('組卷與計分', () => {
  const paperOf = (m: MockExam, lang: keyof typeof COURSES, seed = 1) => buildPaper(m, COURSES[lang], mulberry32(seed));

  it('每份考卷：選項是原本選項的重新排列，正解位置正確，題數接近預估', () => {
    for (const { lang, m } of exams) {
      for (const seed of [1, 2, 3]) {
        const p = paperOf(m, lang, seed);
        expect(Math.abs(p.qs.length - expectedCount(m)), m.id).toBeLessThanOrEqual(2);
        p.qs.forEach((q, i) => {
          expect(q.no).toBe(i);
          expect([...q.options].sort()).toEqual([...q.q.opts].sort());
          expect(q.options[q.answer]).toBe(q.q.opts[0]);
        });
      }
    }
  });

  it('同一個題組的題目排在一起，第一題標記為 first', () => {
    for (const { lang, m } of exams) {
      const p = paperOf(m, lang);
      for (let i = 0; i < p.qs.length; i++) {
        const prev = p.qs[i - 1];
        expect(p.qs[i].first, `${m.id} #${i}`).toBe(!prev || prev.group !== p.qs[i].group);
      }
      const secs = paperSections(p);
      expect(secs[0].from).toBe(0);
      expect(secs[secs.length - 1].to).toBe(p.qs.length - 1);
    }
  });

  it('日檢漢字讀音題由課程單字自動出題：底線的漢字沒有讀音，選項 4 個不重複', () => {
    const gs = kanjiReadingGroups(COURSES.ja, ['ja.n5'], 8, mulberry32(7));
    expect(gs.length).toBe(8);
    for (const g of gs) {
      const q = g.qs[0];
      const word = /\{([^}]+)\}/.exec(q.q!)![1];
      expect(word).toMatch(KANJI);
      expect(q.q).not.toContain(`{${word}}[`);
      expect(q.opts.length).toBe(4);
      expect(new Set(q.opts).size).toBe(4);
      expect(furiKana(noUnderline(q.q!))).not.toMatch(KANJI);
    }
  });

  it('計分：全對、全錯、部分答對與程度判斷', () => {
    const m = COURSES.ko.mocks[0];
    const p = paperOf(m, 'ko');
    const all = scorePaper(p, p.qs.map((q) => q.answer));
    expect(all.pct).toBe(1);
    expect(all.passed).toBe(true);
    expect(all.level).toBe(levelOf(m, 1));
    const none = scorePaper(
      p,
      p.qs.map(() => null),
    );
    expect(none.correct).toBe(0);
    expect(none.passed).toBe(false);
    expect(none.level.min).toBe(0);
    expect(none.sections.reduce((a, x) => a + x.total, 0)).toBe(p.qs.length);
    // TOPIK：答對四成約 1 級、七成約 2 級
    expect(levelOf(m, 0.45).label).toContain('1 級');
    expect(levelOf(m, 0.72).label).toContain('2 級');
  });

  it('聽力稿的說話者', () => {
    expect(parseLine('M: Hello there.')).toEqual({ who: 'M', text: 'Hello there.' });
    expect(parseLine('F: すみません。')).toEqual({ who: 'F', text: 'すみません。' });
    expect(parseLine('no speaker')).toEqual({ who: null, text: 'no speaker' });
  });
});

describe('模擬考成績存檔', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 15, 10));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('記錄最佳、上次成績與次數，刷新紀錄有獎勵，解鎖成就', async () => {
    const store = await import('../src/core/store');
    store.resetSave();
    const o1 = store.finishMock({ lang: 'ja', examId: 'ja.mock.n5', correct: 18, total: 30 });
    expect(o1.record).toBe(false);
    expect(store.getSave().mocks['ja.mock.n5']).toMatchObject({ best: 60, last: 60, plays: 1 });
    expect(store.getSave().ach.mock_1).toBeTruthy();
    const o2 = store.finishMock({ lang: 'ja', examId: 'ja.mock.n5', correct: 27, total: 30 });
    expect(o2.record).toBe(true);
    expect(o2.parts.map(([l]) => l)).toContain('刷新最佳成績');
    expect(store.getSave().mocks['ja.mock.n5']).toMatchObject({ best: 90, last: 90, plays: 2 });
    expect(store.getSave().ach.mock_80).toBeTruthy();
    store.finishMock({ lang: 'ja', examId: 'ja.mock.n5', correct: 12, total: 30 });
    expect(store.getSave().mocks['ja.mock.n5']).toMatchObject({ best: 90, last: 40, plays: 3 });
    expect(store.getSave().stats.mocks).toBe(3);
  });

  it('雲端合併：最佳與次數取較大值，上次成績取比較晚考的', async () => {
    const { mergeSaves } = await import('../src/core/merge');
    const { defaultSave } = await import('../src/core/save');
    const a = { ...defaultSave(0), mocks: { x: { best: 80, last: 50, plays: 3, at: 100 } } };
    const b = { ...defaultSave(0), mocks: { x: { best: 70, last: 70, plays: 5, at: 200 } } };
    expect(mergeSaves(a, b).mocks.x).toEqual({ best: 80, last: 70, plays: 5, at: 200 });
  });
});
