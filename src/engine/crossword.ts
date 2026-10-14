// 填字遊戲產生器：從已學單字中挑字，自動排出交叉的盤面。
// 格子的單位依語言而定：英文字母、日文假名、韓文音節。

import { shuffle, type Rng } from '../core/rng';

export interface CwEntry {
  id: string;
  cells: string[];
  clue: string;
  /** 解開後顯示的完整寫法 */
  solved: string;
}

export interface CwWord extends CwEntry {
  row: number;
  col: number;
  /** 0 橫向、1 直向 */
  dir: 0 | 1;
  num: number;
}

export interface Crossword {
  rows: number;
  cols: number;
  words: CwWord[];
}

interface Placed {
  e: CwEntry;
  r: number;
  c: number;
  d: 0 | 1;
}

interface Layout {
  placed: Placed[];
  minR: number;
  maxR: number;
  minC: number;
  maxC: number;
  /** 互不相連的區塊數（1 = 整個盤面連在一起） */
  islands: number;
}

function tryLayout(
  entries: CwEntry[],
  target: number,
  maxRows: number,
  maxCols: number,
  islands: boolean,
  rng: Rng,
): Layout | null {
  // dirs：這一格已經被哪個方向的字用過（1 橫、2 直）
  const grid = new Map<string, { ch: string; dirs: number }>();
  const key = (r: number, c: number) => `${r},${c}`;
  const L: Layout = { placed: [], minR: 0, maxR: 0, minC: 0, maxC: 0, islands: 1 };

  const put = (e: CwEntry, r: number, c: number, d: 0 | 1) => {
    const n = e.cells.length;
    for (let k = 0; k < n; k++) {
      const rr = r + (d ? k : 0);
      const cc = c + (d ? 0 : k);
      const g = grid.get(key(rr, cc));
      if (g) g.dirs |= 1 << d;
      else grid.set(key(rr, cc), { ch: e.cells[k], dirs: 1 << d });
    }
    L.placed.push({ e, r, c, d });
    L.minR = Math.min(L.minR, r);
    L.minC = Math.min(L.minC, c);
    L.maxR = Math.max(L.maxR, r + (d ? n - 1 : 0));
    L.maxC = Math.max(L.maxC, c + (d ? 0 : n - 1));
  };

  /** 可以放就回傳交叉的格數，不行回傳 -1 */
  const fits = (e: CwEntry, r: number, c: number, d: 0 | 1): number => {
    const n = e.cells.length;
    const dr = d ? 1 : 0;
    const dc = d ? 0 : 1;
    const r2 = r + dr * (n - 1);
    const c2 = c + dc * (n - 1);
    if (Math.max(L.maxR, r2) - Math.min(L.minR, r) + 1 > maxRows) return -1;
    if (Math.max(L.maxC, c2) - Math.min(L.minC, c) + 1 > maxCols) return -1;
    // 頭尾不能緊貼別的字
    if (grid.has(key(r - dr, c - dc)) || grid.has(key(r2 + dr, c2 + dc))) return -1;
    let cross = 0;
    for (let k = 0; k < n; k++) {
      const rr = r + dr * k;
      const cc = c + dc * k;
      const g = grid.get(key(rr, cc));
      if (g) {
        // 交叉格：字要相同，而且不能和同方向的字重疊
        if (g.ch !== e.cells[k] || g.dirs & (1 << d)) return -1;
        cross++;
      } else if (grid.has(key(rr + dc, cc + dr)) || grid.has(key(rr - dc, cc - dr))) {
        // 非交叉格的兩側不能有字，否則會拼出不存在的字
        return -1;
      }
    }
    return cross;
  };

  const used = new Set<string>();
  const pending = entries.slice();

  /** 反覆把還沒用到的字接到盤面上，直到接不上或達到目標字數 */
  const connect = () => {
    let progress = true;
    while (progress && L.placed.length < target) {
      progress = false;
      for (let i = 0; i < pending.length && L.placed.length < target; i++) {
        const e = pending[i];
        if (used.has(e.cells.join(''))) continue;
        let best: { r: number; c: number; d: 0 | 1; score: number } | null = null;
        for (const p of L.placed) {
          const d = (1 - p.d) as 0 | 1;
          for (let pi = 0; pi < p.e.cells.length; pi++) {
            for (let k = 0; k < e.cells.length; k++) {
              if (p.e.cells[pi] !== e.cells[k]) continue;
              const pr = p.r + (p.d ? pi : 0);
              const pc = p.c + (p.d ? 0 : pi);
              const r = pr - (d ? k : 0);
              const c = pc - (d ? 0 : k);
              const cross = fits(e, r, c, d);
              if (cross <= 0) continue;
              const score = cross * 10 + rng();
              if (!best || score > best.score) best = { r, c, d, score };
            }
          }
        }
        if (best) {
          put(e, best.r, best.c, best.d);
          used.add(e.cells.join(''));
          pending.splice(i, 1);
          i--;
          progress = true;
        }
      }
    }
  };

  // 一區一區地排：橫放一個起點字，再把其他字接上去。
  // 接不上了但字數還不夠時，在下方隔一列另起一區——韓文以音節為一格，
  // 剛開始學的字彼此很少共用音節，沒有這一步盤面會只有兩三個字。
  L.islands = 0;
  for (let tries = 0; tries < 14 && L.placed.length < target; tries++) {
    const i = pending.findIndex((e) => !used.has(e.cells.join('')) && e.cells.length <= maxCols);
    if (i < 0) break;
    const row = L.placed.length ? L.maxR + 2 : 0;
    if (row - L.minR + 1 > maxRows) break;
    const [seed] = pending.splice(i, 1);
    const saved = { ...L, placed: L.placed.length };
    put(seed, row, L.minC, 0);
    used.add(seed.cells.join(''));
    connect();
    if (L.placed.length > saved.placed + 1) {
      L.islands++;
      if (!islands) break;
      continue;
    }
    // 沒有任何字接得上這個起點：撤回（落單的字不算填字），換下一個字當起點
    for (let k = 0; k < seed.cells.length; k++) grid.delete(key(row, saved.minC + k));
    L.placed.pop();
    Object.assign(L, { minR: saved.minR, maxR: saved.maxR, minC: saved.minC, maxC: saved.maxC });
  }
  return L.placed.length ? L : null;
}

export interface CwOptions {
  rng?: Rng;
  /** 希望放進盤面的字數 */
  target?: number;
  maxRows?: number;
  maxCols?: number;
  attempts?: number;
  minLen?: number;
  maxLen?: number;
  /** 接不上時是否允許另起一區（預設允許；能連成一片的盤面仍然優先） */
  islands?: boolean;
}

/** 產生填字盤面；可用的字太少、排不出至少 3 個交叉的字時回傳 null */
export function generateCrossword(entries: CwEntry[], o: CwOptions = {}): Crossword | null {
  const rng = o.rng ?? Math.random;
  const target = o.target ?? 7;
  const maxRows = o.maxRows ?? 11;
  const maxCols = o.maxCols ?? 11;
  const minLen = o.minLen ?? 2;
  const maxLen = Math.min(o.maxLen ?? 9, maxCols);

  const seen = new Set<string>();
  const usable = entries.filter((e) => {
    const k = e.cells.join('');
    if (e.cells.length < minLen || e.cells.length > maxLen || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  if (usable.length < 3) return null;

  let best: Layout | null = null;
  let bestScore = -Infinity;
  for (let a = 0; a < (o.attempts ?? 40); a++) {
    const order = shuffle(usable, rng);
    // 讓比較長的字當起點，後面的字比較容易接上
    let longest = 0;
    for (let i = 1; i < Math.min(order.length, 6); i++) if (order[i].cells.length > order[longest].cells.length) longest = i;
    [order[0], order[longest]] = [order[longest], order[0]];
    const L = tryLayout(order, target, maxRows, maxCols, o.islands ?? true, rng);
    if (!L) continue;
    const area = (L.maxR - L.minR + 1) * (L.maxC - L.minC + 1);
    // 字數最重要，其次是連成一片，再來是盤面緊湊
    const score = L.placed.length * 1000 - (L.islands - 1) * 400 - area;
    if (score > bestScore) {
      best = L;
      bestScore = score;
    }
    if (L.placed.length >= target && L.islands === 1 && a >= 8) break;
  }
  if (!best || best.placed.length < 3) return null;

  const L = best;
  const words: CwWord[] = L.placed.map((p) => ({ ...p.e, row: p.r - L.minR, col: p.c - L.minC, dir: p.d, num: 0 }));
  // 編號：依起始格由上到下、由左到右；同一格起始的橫、直共用一個號碼
  const starts = [...new Set(words.map((w) => w.row * 1000 + w.col))].sort((a, b) => a - b);
  for (const w of words) w.num = starts.indexOf(w.row * 1000 + w.col) + 1;
  words.sort((a, b) => a.dir - b.dir || a.num - b.num);
  return { rows: L.maxR - L.minR + 1, cols: L.maxC - L.minC + 1, words };
}

/** 每一格的座標 */
export function cellsOfWord(w: CwWord): { r: number; c: number }[] {
  return w.cells.map((_, k) => ({ r: w.row + (w.dir ? k : 0), c: w.col + (w.dir ? 0 : k) }));
}
