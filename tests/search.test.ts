// 查詢的搜尋：比對的寫法、結果的排序，以及自動產生的索引都對得上課程
import { describe, expect, it } from 'vitest';
import { unitRef } from '../src/content/index';
import { searchEntries } from '../src/content/outline-build';
import { norm, searchWords, wordOfId, type SearchEntry } from '../src/core/search';
import { LANGS } from '../src/core/types';

describe('搜尋', () => {
  it('比對時不分全形半形、大小寫、平假名片假名', () => {
    expect(norm('ＡＢＣ Def')).toBe('abc def');
    expect(norm('カタカナ')).toBe('かたかな');
    expect(norm('  多  空白 ')).toBe('多 空白');
  });

  it('完全符合的排最前面，再來是開頭一樣的、包含的；一樣時照課程順序', () => {
    const entries: SearchEntry[] = [
      ['ja.a:食べ物', 'たべもの', '食物', 1],
      ['ja.a:食べる', 'たべる', '吃', 1],
      ['ja.a:飲み食い', 'のみくい', '吃喝', 2],
      ['ja.b:ご飯', 'ごはん', '飯；餐（一頓）', 1],
    ];
    const words = (q: string) => searchWords(entries, q).hits.map((h) => h.word);
    expect(words('吃')).toEqual(['食べる', '飲み食い']);
    expect(words('タベ')).toEqual(['食べ物', '食べる']);
    expect(words('餐')).toEqual(['ご飯']);
    expect(words('食')).toEqual(['食べ物', '食べる', '飲み食い']);
    expect(searchWords(entries, '  ')).toEqual({ hits: [], total: 0 });
    expect(searchWords(entries, '食', 1)).toMatchObject({ total: 3, hits: [{ word: '食べ物', reading: 'たべもの', lesson: 1 }] });
  });

  it('自動產生的索引：每個字都找得到所在的單元和課，沒有重複', () => {
    for (const lang of LANGS) {
      const entries = searchEntries(lang);
      expect(entries.length, lang).toBeGreaterThan(1000);
      const seen = new Set<string>();
      for (const [id, , meaning, lesson] of entries) {
        expect(seen.has(id), id).toBe(false);
        seen.add(id);
        const ref = unitRef(id);
        expect(ref, id).toBeTruthy();
        // 最後一課是測驗，字都在前面的課裡
        expect(lesson >= 1 && lesson < ref!.unit.lessons.length, id).toBe(true);
        expect(meaning && wordOfId(id), id).toBeTruthy();
      }
    }
  });
});
