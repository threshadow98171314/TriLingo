// 導覽的五個區域：網址對到哪個區域、換語言時去哪裡
import { describe, expect, it } from 'vitest';
import { sectionOf, sectionPath, switchLangPath } from '../src/core/nav';

const parts = (path: string) => path.split('/').filter(Boolean);

describe('導覽區域', () => {
  it('網址屬於哪個區域', () => {
    expect(sectionOf([])).toBe('today');
    expect(sectionOf(parts('/l/ja/today'))).toBe('today');
    for (const p of ['/l/ja', '/l/ja/s/ja.n5', '/l/ja/lesson/ja.n5.greet#1', '/l/ko/bank']) expect(sectionOf(parts(p)), p).toBe('learn');
    for (const p of ['/l/en/arcade', '/l/en/mock', '/l/en/mock/x', '/l/en/play/wordle', '/l/en/review']) expect(sectionOf(parts(p)), p).toBe('practice');
    for (const p of ['/l/ja/dex', '/l/ja/concepts', '/l/ja/concept/x', '/l/ja/chart', '/l/ja/songs', '/l/ja/song/x', '/l/ko/typing-guide']) expect(sectionOf(parts(p)), p).toBe('lookup');
    for (const p of ['/me', '/profile', '/shop', '/settings', '/help']) expect(sectionOf(parts(p)), p).toBe('me');
    expect(sectionOf(parts('/nowhere'))).toBeNull();
  });

  it('各區域的網址跟著目前的語言', () => {
    expect(sectionPath('today', 'ko')).toBe('/');
    expect(sectionPath('learn', 'ko')).toBe('/l/ko');
    expect(sectionPath('practice', 'ko')).toBe('/l/ko/arcade');
    expect(sectionPath('lookup', 'ko')).toBe('/l/ko/dex');
    expect(sectionPath('me', 'ko')).toBe('/me');
  });

  it('換語言：同一個分頁換成另一個語言，那個語言沒有的分頁回到同一區的第一頁', () => {
    expect(switchLangPath(parts('/l/ja/s/ja.n5'), 'ko')).toBe('/l/ko');
    expect(switchLangPath(parts('/l/ja/play/conj'), 'en')).toBe('/l/en/arcade');
    expect(switchLangPath(parts('/l/ja/mock'), 'ko')).toBe('/l/ko/mock');
    expect(switchLangPath(parts('/l/ja/chart'), 'ko')).toBe('/l/ko/chart');
    expect(switchLangPath(parts('/l/ja/chart'), 'en')).toBe('/l/en/dex');
    expect(switchLangPath(parts('/l/ja/songs'), 'ko')).toBe('/l/ko/dex');
    expect(switchLangPath(parts('/l/ko/dex'), 'ja')).toBe('/l/ja/dex');
    expect(switchLangPath(parts('/me'), 'ja')).toBeNull();
    expect(switchLangPath([], 'ja')).toBeNull();
  });
});
