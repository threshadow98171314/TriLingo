// 錯題本：答錯過、還沒精通的字，越常錯、越不熟的排越前面
import { describe, expect, it } from 'vitest';
import { mistakeScore, mistakesOf } from '../src/core/mistakes';
import { defaultSave } from '../src/core/save';

const prog = (ok: number, ng: number, s = 2, t = 0) => ({ s, due: 0, ok, ng, t });

describe('錯題本', () => {
  it('越常錯、答錯率越高的分數越高', () => {
    expect(mistakeScore(prog(1, 3))).toBeGreaterThan(mistakeScore(prog(0, 1)));
    expect(mistakeScore(prog(0, 2))).toBeGreaterThan(mistakeScore(prog(6, 2)));
    expect(mistakeScore(prog(5, 0))).toBe(0);
  });

  it('只收這個語言答錯過、還沒精通的字；精通的算「已克服」', () => {
    const s = defaultSave(Date.now());
    s.items = {
      'ja.a:x': prog(1, 3),
      'ja.a:y': prog(0, 1),
      'ja.a:ok': prog(4, 0),
      'ja.a:done': prog(9, 2, 7),
      'en.a:z': prog(0, 5),
    };
    expect(mistakesOf(s, 'ja')).toEqual({ ids: ['ja.a:x', 'ja.a:y'], conquered: 1 });
    expect(mistakesOf(s, 'en').ids).toEqual(['en.a:z']);
    expect(mistakesOf(s, 'ko')).toEqual({ ids: [], conquered: 0 });
  });

  it('一樣常錯時，比較不熟的、最近答錯的排前面', () => {
    const s = defaultSave(Date.now());
    s.items = { 'ko.a:old': prog(1, 1, 3, 100), 'ko.a:weak': prog(1, 1, 1, 50), 'ko.a:new': prog(1, 1, 3, 200) };
    expect(mistakesOf(s, 'ko').ids).toEqual(['ko.a:weak', 'ko.a:new', 'ko.a:old']);
  });
});
