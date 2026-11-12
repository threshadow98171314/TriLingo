// 查詢的「搜尋」：用中文意思、原文或讀音找字。索引由題目自動產生（npm run outline → gen/search-*.json），
// 打開搜尋才下載。純函式，畫面在 pages/tabs/Search.tsx。

/** 索引的一筆：[項目 id（單元 id:原文）, 讀音（日文的假名，和原文一樣時留空）, 中文意思, 在單元的第幾課] */
export type SearchEntry = [id: string, reading: string, meaning: string, lesson: number];

export interface SearchHit {
  id: string;
  /** 原文 */
  word: string;
  reading: string;
  meaning: string;
  lesson: number;
}

/** 項目 id 裡的原文（id 是「單元 id:原文」，單元 id 不會有「:」） */
export const wordOfId = (id: string): string => id.slice(id.indexOf(':') + 1);

export const hitOf = ([id, reading, meaning, lesson]: SearchEntry): SearchHit => ({ id, word: wordOfId(id), reading, meaning, lesson });

/** 比對用的寫法：全形英數轉半形、英文小寫、片假名轉平假名、連續空白合成一個 */
export function norm(s: string): string {
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/\s+/g, ' ')
    .trim();
}

/** 中文意思拆成幾個義項（「吃；喝」「吃、喝」「（自）開」都拆得開），用來判斷完全符合 */
const senses = (m: string): string[] =>
  norm(m)
    .split(/[；;、，,／/]/)
    .map((x) => x.replace(/[（(][^）)]*[）)]/g, '').trim())
    .filter(Boolean);

interface Prepared {
  hit: SearchHit;
  word: string;
  reading: string;
  meaning: string;
  senses: string[];
}

const cache = new WeakMap<SearchEntry[], Prepared[]>();

function prepare(entries: SearchEntry[]): Prepared[] {
  let p = cache.get(entries);
  if (!p) {
    p = entries.map((e) => {
      const hit = hitOf(e);
      return { hit, word: norm(hit.word), reading: norm(hit.reading), meaning: norm(hit.meaning), senses: senses(hit.meaning) };
    });
    cache.set(entries, p);
  }
  return p;
}

/**
 * 找字：原文、讀音或意思完全一樣的排最前面，再來是開頭一樣的，最後是包含的；一樣時照課程順序。
 * 回傳最多 limit 筆，total 是全部符合的數量。
 */
export function searchWords(entries: SearchEntry[], query: string, limit = 50): { hits: SearchHit[]; total: number } {
  const q = norm(query);
  if (!q) return { hits: [], total: 0 };
  const ranked: [number, number, SearchHit][] = [];
  prepare(entries).forEach((e, i) => {
    let rank = -1;
    if (e.word === q || e.reading === q || e.senses.includes(q)) rank = 0;
    else if (e.word.startsWith(q) || (e.reading && e.reading.startsWith(q)) || e.senses.some((x) => x.startsWith(q))) rank = 1;
    else if (e.word.includes(q) || (e.reading && e.reading.includes(q)) || e.meaning.includes(q)) rank = 2;
    if (rank >= 0) ranked.push([rank, i, e.hit]);
  });
  ranked.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return { hits: ranked.slice(0, limit).map((r) => r[2]), total: ranked.length };
}
