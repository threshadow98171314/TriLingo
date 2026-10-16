// 聽日文歌學日語：歌詞的資料結構與小工具。
// 歌詞有版權，網站本身不放任何歌詞；使用者自己貼上的歌詞只存在自己的瀏覽器（和自己的私人 Gist）。

export interface SongLine {
  /** 日文歌詞（可以用「漢字[よみ]」標讀音） */
  ja: string;
  /** 中文翻譯 */
  zh?: string;
  /** 這一句開始的秒數（對時之後才有） */
  t?: number;
}

export interface SongLyrics {
  lines: SongLine[];
  /** 最後修改時間（雲端同步合併用） */
  at: number;
}

/** 使用者自己加的歌（任何 YouTube 影片） */
export interface CustomSong {
  id: string;
  title: string;
  artist: string;
  /** YouTube 影片 id */
  yt: string;
  at: number;
}

const clean = (s: string) => s.replace(/\r/g, '').replace(/[ \t　]+$/g, '').trim();

/**
 * 把貼上的歌詞切成一句一句：一行一句，空行略過。
 * 中文翻譯也是一行對一行；舊的對時資料照順序保留（行數變了就只保留對得上的部分）。
 */
export function parseLyrics(ja: string, zh = '', old: SongLine[] = []): SongLine[] {
  const jaLines = ja.split('\n').map(clean).filter(Boolean);
  const zhLines = zh.split('\n').map(clean).filter(Boolean);
  return jaLines.map((line, i) => {
    const out: SongLine = { ja: line };
    if (zhLines[i]) out.zh = zhLines[i];
    const prev = old[i];
    if (prev && prev.ja === line && prev.t !== undefined) out.t = prev.t;
    return out;
  });
}

/** 對時完成的句數 */
export const syncedCount = (lines: SongLine[]): number => lines.filter((l) => l.t !== undefined).length;

/** 播放到 time 秒時，正在唱哪一句（還沒對時或還沒開始唱時回傳 -1） */
export function activeLine(lines: SongLine[], time: number): number {
  let best = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].t;
    if (t !== undefined && t <= time + 0.15) best = i;
  }
  return best;
}

/** 從 YouTube 網址（或直接貼 id）取出影片 id */
export function youtubeIdOf(input: string): string | null {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/** 秒數 → 「1:05」 */
export function fmtSec(t: number): string {
  const s = Math.max(0, Math.floor(t));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
