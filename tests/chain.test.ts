// 接龍對戰的規則
import { describe, expect, it } from 'vitest';
import { mulberry32 } from '../src/core/rng';
import type { VocabItem } from '../src/core/types';
import * as C from '../src/engine/chain';

const v = (w: string, r?: string): VocabItem => ({ id: `t:${w}`, kind: 'word', w, r, m: `${w} 的意思` });

describe('接龍對戰', () => {
  it('日文：長音、促音看前一個假名，小字換成大字', () => {
    expect(C.jaTail('たくしー')).toBe('し');
    expect(C.jaTail('おもちゃ')).toBe('や');
    expect(C.jaTail('りんご')).toBe('ご');
    const w = C.chainWordOf(v('学校', 'がっこう'), 'ja')!;
    expect([w.key, w.head, w.tail]).toEqual(['がっこう', 'が', 'う']);
    // 片假名的讀音也轉成平假名來接
    expect(C.chainWordOf(v('タクシー', 'タクシー'), 'ja')!.tail).toBe('し');
  });

  it('韓文頭音法則：력→역、로→노、녀→여', () => {
    expect(C.dueum('력')).toBe('역');
    expect(C.dueum('로')).toBe('노');
    expect(C.dueum('녀')).toBe('여');
    expect(C.dueum('과')).toBeNull();
    const a = C.chainWordOf(v('노력'), 'ko')!;
    const b = C.chainWordOf(v('역사'), 'ko')!;
    expect(C.canFollow(a, b, 'ko')).toBe(true);
  });

  it('判斷玩家的字：不在字庫、接不上、用過、ん結尾', () => {
    const dict = C.buildDict([v('りんご', 'りんご'), v('ごはん', 'ごはん'), v('ごりら', 'ごりら'), v('学校', 'がっこう')], 'ja');
    const prev = dict.find((w) => w.key === 'りんご')!;
    const used = new Set(['りんご']);
    expect(C.judge('ごりら', dict, used, prev, 'ja').ok).toBe(true);
    // 片假名、漢字也可以
    expect(C.judge('ゴリラ', dict, used, prev, 'ja').ok).toBe(true);
    expect(C.judge('学校', dict, used, null, 'ja').ok).toBe(true);
    const n = C.judge('ごはん', dict, used, prev, 'ja');
    expect(n.ok).toBe(false);
    expect(!n.ok && n.lose).toBe(true);
    expect(C.judge('がっこう', dict, used, prev, 'ja').ok).toBe(false);
    expect(C.judge('りんご', dict, used, null, 'ja').ok).toBe(false);
    expect(C.judge('すし', dict, used, prev, 'ja').ok).toBe(false);
  });

  it('電腦不會出「ん」結尾的字，也不會出讓你完全接不下去的字；想不出來就認輸', () => {
    const dict = C.buildDict([v('apple'), v('egg'), v('good'), v('dog'), v('zebra')], 'en');
    const known = new Set(dict.map((w) => w.key));
    const prev = dict.find((w) => w.key === 'apple')!;
    // apple → egg（接 g：good）可以；不會挑 zebra 這種接不上的
    for (let seed = 1; seed < 20; seed++) {
      const w = C.aiMove(dict, known, new Set(['apple']), prev, 'en', 'normal', mulberry32(seed));
      expect(w?.key).toBe('egg');
    }
    expect(C.aiMove(dict, known, new Set(['apple', 'egg']), prev, 'en', 'hard', mulberry32(1))).toBeNull();
  });

  it('英文：接最後一個字母，至少 3 個字母', () => {
    expect(C.chainWordOf(v('go'), 'en')).toBeNull();
    const a = C.chainWordOf(v('table'), 'en')!;
    expect(C.headsAfter(a, 'en')).toEqual(['e']);
  });
});
