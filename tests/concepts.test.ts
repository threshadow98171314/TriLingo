import { describe, expect, it } from 'vitest';
import { COURSE_LIST } from '../src/content/all';
import { clozeEx, type Ctx } from '../src/engine/exercises';
import { furiKana, furiPlain } from '../src/engine/furigana';

const KANA_OK = /^[ぁ-ゖァ-ヺー、。？！?!0-9A-Za-z\s]+$/;

describe('觀念講堂', () => {
  it('三種語言都有觀念文章，id 不重複', () => {
    const ids = COURSE_LIST.flatMap((c) => c.concepts.map((x) => x.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of COURSE_LIST) {
      expect(c.concepts.length, c.id).toBeGreaterThanOrEqual(10);
      for (const x of c.concepts) expect(x.id.startsWith(`${c.id}.c.`), x.id).toBe(true);
    }
  });

  it('每篇都有內容和小測驗；小測驗的題目合法、出得了題', () => {
    for (const c of COURSE_LIST) {
      const ctx: Ctx = { lang: c.id, rng: () => 0.5, canListen: false };
      for (const x of c.concepts) {
        expect(x.sections.length, x.id).toBeGreaterThan(0);
        expect(x.quiz.length, x.id).toBeGreaterThanOrEqual(3);
        for (const s of x.sections) {
          expect(s.body.length, `${x.id} ${s.h}`).toBeGreaterThan(0);
          for (const row of s.table ?? []) expect(row.length, `${x.id} 表格欄數`).toBe(s.table![0].length);
        }
        for (const q of x.quiz) {
          expect(q.q.split('___'), q.id).toHaveLength(2);
          expect(q.opts.length, q.id).toBeGreaterThanOrEqual(3);
          expect(new Set(q.opts).size, `${q.id} 選項重複`).toBe(q.opts.length);
          const e = clozeEx(q, ctx);
          expect(e.options[e.answer].s, q.id).toBe(q.opts[0]);
        }
      }
    }
  });

  it('日文：例句、小測驗的振假名標註完整', () => {
    const ja = COURSE_LIST.find((c) => c.id === 'ja')!;
    // 情境說明寫在（）裡、選項可以有…：比對前拿掉
    const check = (s: string, where: string) => {
      const t = s.replace(/（[^）]*）/g, '').replace(/…/g, '');
      expect(furiPlain(t), where).not.toMatch(/[[\]]/);
      expect(furiKana(t), where).toMatch(KANA_OK);
    };
    for (const x of ja.concepts) {
      for (const s of x.sections) for (const e of s.examples ?? []) check(e.furi ?? e.s, `${x.id} 例句`);
      for (const q of x.quiz) {
        check(q.q.replace('___', ''), q.id);
        for (const o of q.opts) check(o, `${q.id} 選項`);
      }
    }
  });
});
