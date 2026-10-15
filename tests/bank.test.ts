// 單字庫：不排在學習路線上、不會上鎖，進度另外算；內容不能和其他單元重複。
import { describe, expect, it } from 'vitest';
import { COURSE_LIST } from '../src/content/all';
import { deck, ja, vocabUnit } from '../src/content/dsl';
import { bankState, nextBankLesson, nextInStage, stageState, unitState } from '../src/core/progress';
import { defaultSave, type Save } from '../src/core/save';
import type { Stage } from '../src/core/types';

const words = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => ja(`${prefix}${i}`, `意思${i}`));

function stage(): Stage {
  return {
    id: 'ja.t',
    short: 'T',
    title: '測試',
    subtitle: '',
    description: '',
    color: '#fff',
    group: 'main',
    style: 'level',
    planned: [],
    units: [
      vocabUnit('ja.t.a', 'あ', '路線一', '', words('あ', 10)),
      deck('ja.t.d1', '📚', '生活 1', '生活', words('い', 25)),
      deck('ja.t.d2', '📚', '生活 2', '生活', words('う', 25)),
      vocabUnit('ja.t.b', 'か', '路線二', '', words('か', 10)),
    ],
  };
}

const pass = (s: Save, lessonId: string) => {
  s.lessons[lessonId] = { stars: 3, plays: 1 };
};

describe('單字庫', () => {
  it('單字庫的組一律開放；路線上的下一個單元看的是前一個「路線」單元', () => {
    const st = stage();
    const s = defaultSave(0);
    expect(unitState(s, st, 1).unlocked).toBe(true);
    expect(unitState(s, st, 2).unlocked).toBe(true);
    expect(unitState(s, st, 3).unlocked).toBe(false);
    pass(s, 'ja.t.a#boss');
    // 單字庫的組都還沒學，路線二照樣解鎖
    expect(unitState(s, st, 3).unlocked).toBe(true);
  });

  it('關卡進度只算路線；單字庫另外統計', () => {
    const st = stage();
    const s = defaultSave(0);
    const ss = stageState(s, st);
    expect(ss.total).toBe(3 + 3);
    pass(s, 'ja.t.a#boss');
    pass(s, 'ja.t.b#boss');
    expect(stageState(s, st).complete).toBe(true);
    s.items['ja.t.d1:い0'] = { s: 1, due: 0, ok: 1, ng: 0, t: 1 };
    expect(bankState(s, st)).toEqual({ decks: 2, done: 0, words: 50, learned: 1 });
  });

  it('「繼續」只走路線；「學新字」照順序找第一個還沒完成的組', () => {
    const st = stage();
    const s = defaultSave(0);
    expect(nextInStage(s, st)?.unit.id).toBe('ja.t.a');
    pass(s, 'ja.t.a#boss');
    expect(nextInStage(s, st)?.unit.id).toBe('ja.t.b');
    expect(nextBankLesson(s, st)?.lesson.id).toBe('ja.t.d1#1');
    pass(s, 'ja.t.d1#1');
    expect(nextBankLesson(s, st)?.lesson.id).toBe('ja.t.d1#2');
    expect(nextBankLesson(s, st, 'ja.t.d1')?.lesson.id).toBe('ja.t.d2#1');
    pass(s, 'ja.t.d1#boss');
    pass(s, 'ja.t.d2#boss');
    expect(nextBankLesson(s, st)).toBeNull();
  });

  it('每一組都是單字、大小適中、有分組名稱', () => {
    for (const c of COURSE_LIST) {
      for (const st of c.stages) {
        for (const u of st.units.filter((x) => x.bank)) {
          expect(u.kind, u.id).toBe('vocab');
          expect(u.bank!.length, u.id).toBeGreaterThan(0);
          expect(u.items.length, u.id).toBeGreaterThanOrEqual(10);
          expect(u.items.length, u.id).toBeLessThanOrEqual(40);
        }
      }
    }
  });

  it('單字庫的字不和同一個語言的其他單元重複', () => {
    for (const c of COURSE_LIST) {
      const units = c.stages.flatMap((st) => st.units);
      const elsewhere = new Map<string, string>();
      for (const u of units.filter((x) => !x.bank)) for (const i of u.items) if ('w' in i) elsewhere.set(i.w, u.id);
      const seen = new Map<string, string>();
      for (const u of units.filter((x) => x.bank)) {
        for (const i of u.items) {
          if (!('w' in i)) continue;
          expect(elsewhere.get(i.w), `${u.id}：「${i.w}」已經在 ${elsewhere.get(i.w)}`).toBeUndefined();
          expect(seen.get(i.w), `${u.id}：「${i.w}」和 ${seen.get(i.w)} 重複`).toBeUndefined();
          seen.set(i.w, u.id);
        }
      }
    }
  });
});
