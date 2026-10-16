// 猜詞的規則
import { describe, expect, it } from 'vitest';
import type { VocabItem } from '../src/core/types';
import { dailyPick, jamoOf, keyMarks, score, tilesOf, wordlePool } from '../src/engine/wordle';

const w = (id: string, word: string, r?: string): VocabItem => ({ id, kind: 'word', w: word, r, m: '意思' });

describe('猜詞', () => {
  it('評分：位置對是綠色、有但位置不對是黃色，重複的字母不會多算', () => {
    expect(score(Array.from('sheep'), Array.from('speed'))).toEqual(['hit', 'miss', 'hit', 'hit', 'near']);
    // 答案只有一個 e，已經被最後一格用掉：前兩個 e 是灰色
    expect(score(Array.from('eerie'), Array.from('table'))).toEqual(['miss', 'miss', 'miss', 'miss', 'hit']);
    expect(score(Array.from('がっこう'), Array.from('こうえん'))).toEqual(['miss', 'miss', 'near', 'near']);
  });

  it('韓文拆成鍵盤上的字母：複合母音、複合收尾音拆成兩個', () => {
    expect(jamoOf('사과')).toEqual(['ㅅ', 'ㅏ', 'ㄱ', 'ㅗ', 'ㅏ']);
    expect(jamoOf('닭')).toEqual(['ㄷ', 'ㅏ', 'ㄹ', 'ㄱ']);
    expect(jamoOf('빵')).toEqual(['ㅃ', 'ㅏ', 'ㅇ']);
    expect(jamoOf('abc')).toBeNull();
  });

  it('題目的格子：英文字母、日文讀音轉平假名、韓文字母', () => {
    expect(tilesOf(w('a', 'price'), 'en')).toHaveLength(5);
    expect(tilesOf(w('b', '学校', 'がっこう'), 'ja')).toEqual(['が', 'っ', 'こ', 'う']);
    expect(tilesOf(w('c', 'タクシー', 'タクシー'), 'ja')).toEqual(['た', 'く', 'し', 'ー']);
    expect(tilesOf(w('d', '어머니'), 'ko')).toHaveLength(6);
    expect(tilesOf({ ...w('e', 'look at'), kind: 'phrase' }, 'en')).toBeNull();
  });

  it('題庫只收剛好長度的字，同樣寫法只留一個；每日題目同一天固定', () => {
    const pool = wordlePool([w('1', 'price'), w('2', 'price'), w('3', 'cat'), w('4', 'table')], 'en');
    expect(pool.map((i) => i.id)).toEqual(['1', '4']);
    expect(dailyPick(pool, '2026-10-17', 'en')).toBe(dailyPick(pool, '2026-10-17', 'en'));
  });

  it('鍵盤顏色取最好的狀態', () => {
    const m = keyMarks([['a', 'b'], ['b', 'a']], [['near', 'miss'], ['hit', 'near']]);
    expect(m.get('a')).toBe('near');
    expect(m.get('b')).toBe('hit');
  });
});
