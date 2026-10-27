// 排七（接龍）：四個人各 13 張，拿到黑桃 7 的人先出。
// 每一種花色都從 7 開始，往下接 6、5…A，往上接 8、9…K。
// 輪到你時有牌能接就一定要出；完全沒牌能接，就要蓋一張牌（蓋掉的牌點數算罰分，A＝1、K＝13）。
// 全部的牌都出完或蓋完時結算，罰分最少的人獲勝。
// 學語言的規則：玩家出牌前要答題，答錯這回合就跳過（電腦不用答題）。
import type { Rng } from '../core/rng';
import { dealHands, removeCards, SUITS, type Card, type Suit } from './cards';

export type SevensLevel = 'easy' | 'normal' | 'hard';

export interface SevensMove {
  p: number;
  kind: 'play' | 'cover' | 'skip';
  card?: Card;
}

export interface SevensState {
  hands: Card[][];
  /** 每個人蓋掉的牌 */
  covered: Card[][];
  /** 每種花色已經接出去的範圍 [最小, 最大]；null 表示這個花色的 7 還沒出 */
  rows: Record<Suit, [number, number] | null>;
  turn: number;
  /** 黑桃 7 出了沒（還沒出時只能出黑桃 7） */
  started: boolean;
  /** 最近的動作（畫面用） */
  log: SevensMove[];
  done: boolean;
}

const FIRST: Card = { s: 'S', r: 7 };

export function newSevens(rng: Rng): SevensState {
  const hands = dealHands(rng, 4);
  const first = hands.findIndex((h) => h.some((c) => c.s === FIRST.s && c.r === FIRST.r));
  return {
    hands,
    covered: [[], [], [], []],
    rows: { S: null, H: null, D: null, C: null },
    turn: first,
    started: false,
    log: [],
    done: false,
  };
}

/** 這張牌現在接得上嗎 */
export function canPlayCard(st: SevensState, c: Card): boolean {
  if (!st.started) return c.s === FIRST.s && c.r === FIRST.r;
  const row = st.rows[c.s];
  if (c.r === 7) return row === null;
  return row !== null && (c.r === row[0] - 1 || c.r === row[1] + 1);
}

export function playable(st: SevensState, p: number): Card[] {
  return st.hands[p].filter((c) => canPlayCard(st, c));
}

function advance(st: SevensState) {
  if (st.hands.every((h) => h.length === 0)) {
    st.done = true;
    return;
  }
  // 牌已經出完的人直接跳過
  do st.turn = (st.turn + 1) % 4;
  while (st.hands[st.turn].length === 0);
}

const remember = (st: SevensState, m: SevensMove) => {
  st.log = [...st.log, m].slice(-8);
};

export function play(st: SevensState, p: number, c: Card): void {
  if (st.done || st.turn !== p) throw new Error('還沒輪到這個人');
  if (!canPlayCard(st, c)) throw new Error('這張牌接不上');
  removeCards(st.hands[p], [c]);
  const row = st.rows[c.s];
  st.rows[c.s] = row === null ? [7, 7] : [Math.min(row[0], c.r), Math.max(row[1], c.r)];
  st.started = true;
  remember(st, { p, kind: 'play', card: c });
  advance(st);
}

/** 完全沒有牌能接時，蓋一張牌 */
export function cover(st: SevensState, p: number, c: Card): void {
  if (st.done || st.turn !== p) throw new Error('還沒輪到這個人');
  if (playable(st, p).length) throw new Error('有牌能接時不能蓋牌');
  removeCards(st.hands[p], [c]);
  st.covered[p].push(c);
  remember(st, { p, kind: 'cover' });
  advance(st);
}

/** 答錯題目：這回合跳過（只有玩家會用到） */
export function skip(st: SevensState, p: number): void {
  if (st.done || st.turn !== p) throw new Error('還沒輪到這個人');
  remember(st, { p, kind: 'skip' });
  advance(st);
}

export const penalty = (cards: Card[]) => cards.reduce((a, c) => a + c.r, 0);

/** 結算：罰分由少到多排名（同分同名次） */
export function results(st: SevensState): { p: number; points: number; rank: number }[] {
  const rows = st.covered.map((c, p) => ({ p, points: penalty(c) }));
  const sorted = [...rows].sort((a, b) => a.points - b.points || a.p - b.p);
  return sorted.map((r) => ({ ...r, rank: sorted.findIndex((x) => x.points === r.points) }));
}

/** 這張牌往外（遠離 7）還有幾張在自己手上 */
function ownBeyond(hand: Card[], c: Card): number {
  if (c.r === 7) return hand.filter((h) => h.s === c.s && h.r !== 7).length;
  const dir = c.r < 7 ? -1 : 1;
  return hand.filter((h) => h.s === c.s && (h.r - c.r) * dir > 0).length;
}

/** 出了這張牌之後，下一張能接的牌是不是在別人手上（幫了別人） */
function helpsOthers(hand: Card[], c: Card): number {
  const next = c.r === 7 ? [6, 8] : [c.r + (c.r < 7 ? -1 : 1)];
  return next.filter((r) => r >= 1 && r <= 13 && !hand.some((h) => h.s === c.s && h.r === r)).length;
}

/**
 * 電腦的決定。簡單：隨便出；普通：優先出能接上自己後面牌的；
 * 困難：更會卡牌（不輕易打開自己沒有後續的方向），蓋牌時挑最小的。
 */
export function aiMove(st: SevensState, p: number, level: SevensLevel, rng: Rng): { kind: 'play' | 'cover'; card: Card } {
  const hand = st.hands[p];
  const opts = playable(st, p);
  if (!opts.length) {
    // 蓋點數最小的牌；一樣小就蓋離 7 最遠（最晚才接得上）的
    const card = [...hand].sort((a, b) => a.r - b.r || Math.abs(b.r - 7) - Math.abs(a.r - 7))[0];
    return { kind: 'cover', card };
  }
  if (level === 'easy') return { kind: 'play', card: opts[Math.floor(rng() * opts.length)] };
  const block = level === 'hard' ? 3 : 1.5;
  let best = opts[0];
  let bestScore = -Infinity;
  for (const c of opts) {
    // 點數大的牌留在手上被迫蓋掉很虧，所以遠離 7 的牌（A、K 方向）也要早點鋪路
    const score = ownBeyond(hand, c) * 2 - helpsOthers(hand, c) * block + (c.r === 7 ? 0.5 : 0) + rng() * 0.5;
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return { kind: 'play', card: best };
}

/** 排序手牌：先花色（♠♥♦♣）再點數 */
export function sortHand(hand: Card[]): Card[] {
  return [...hand].sort((a, b) => SUITS.indexOf(a.s) - SUITS.indexOf(b.s) || a.r - b.r);
}
