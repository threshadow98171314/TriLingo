import { describe, expect, it } from 'vitest';
import { CLASSICS, SONGS } from '../src/content/songs';
import { activeLine, fmtSec, parseLyrics, syncedCount, youtubeIdOf } from '../src/core/songs';

describe('歌單', () => {
  it('id 不重複、影片 id 格式正確、名次由小到大', () => {
    expect(new Set(SONGS.map((s) => s.id)).size).toBe(SONGS.length);
    for (const s of SONGS) expect(s.yt, s.id).toMatch(/^[\w-]{11}$/);
    const ranks = SONGS.map((s) => s.rank);
    expect([...ranks].sort((a, b) => a - b)).toEqual(ranks);
  });

  it('排行榜的歌都附官方授權歌詞頁（不放歌詞本身）', () => {
    for (const s of SONGS) {
      expect(s.lyricsUrl, s.id).toMatch(/^https:\/\/www\.uta-net\.com\/song\/\d+\/$/);
      expect('lines' in s, s.id).toBe(false);
    }
  });

  it('經典歌曲：id 不和排行榜重複、每句都有翻譯、漢字都標了讀音', () => {
    const ids = [...SONGS, ...CLASSICS].map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of CLASSICS) {
      expect(s.yt, s.id).toMatch(/^[\w-]{11}$/);
      expect(s.credit, s.id).toBeTruthy();
      expect(s.lines.length, s.id).toBeGreaterThan(3);
      for (const l of s.lines) {
        expect(l.zh, `${s.id}：${l.ja}`).toBeTruthy();
        const rest = l.ja.replace(/[㐀-鿿々]+\[[ぁ-ゖァ-ヺー]+\]/g, '');
        expect(rest, `${s.id}：${l.ja}`).not.toMatch(/[㐀-鿿々\[\]]/);
      }
    }
  });
});

describe('歌詞', () => {
  it('一行一句、略過空行，中文一行對一行', () => {
    const lines = parseLyrics('一行目\n\n二行目  \n三行目', '第一行\n第二行');
    expect(lines.map((l) => l.ja)).toEqual(['一行目', '二行目', '三行目']);
    expect(lines.map((l) => l.zh)).toEqual(['第一行', '第二行', undefined]);
  });

  it('重新編輯歌詞時，沒改的句子保留原本的對時', () => {
    const old = [
      { ja: 'A', t: 1 },
      { ja: 'B', t: 5 },
    ];
    const lines = parseLyrics('A\nB2', '', old);
    expect(lines[0].t).toBe(1);
    expect(lines[1].t).toBeUndefined();
    expect(syncedCount(lines)).toBe(1);
  });

  it('播放時間對應到正在唱的那一句', () => {
    const lines = [{ ja: 'A', t: 3 }, { ja: 'B', t: 6 }, { ja: 'C' }, { ja: 'D', t: 12 }];
    expect(activeLine(lines, 1)).toBe(-1);
    expect(activeLine(lines, 3)).toBe(0);
    expect(activeLine(lines, 8)).toBe(1);
    expect(activeLine(lines, 20)).toBe(3);
  });

  it('從各種 YouTube 網址取出影片 id', () => {
    expect(youtubeIdOf('https://www.youtube.com/watch?v=TLJqi0IjMwo&t=30')).toBe('TLJqi0IjMwo');
    expect(youtubeIdOf('https://youtu.be/TLJqi0IjMwo')).toBe('TLJqi0IjMwo');
    expect(youtubeIdOf('https://www.youtube.com/shorts/TLJqi0IjMwo')).toBe('TLJqi0IjMwo');
    expect(youtubeIdOf('TLJqi0IjMwo')).toBe('TLJqi0IjMwo');
    expect(youtubeIdOf('不是網址')).toBeNull();
    expect(fmtSec(65.4)).toBe('1:05');
  });
});
