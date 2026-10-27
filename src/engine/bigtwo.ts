// 大老二（台灣玩法）：四個人各 13 張，誰先出完誰贏。
// 點數 3 < 4 < … < K < A < 2；點數一樣比花色：♣ 梅花 < ♦ 方塊 < ♥ 紅心 < ♠ 黑桃。
// 牌型：單張、對子、順子、葫蘆、鐵支（四張一樣＋一張）、同花順。
// 五張牌型的大小：順子 < 葫蘆 < 鐵支 < 同花順；只能用同樣張數的牌壓。
// 順子不能有 2，A 只能當最大（10 J Q K A）。拿到梅花 3 的人先出，第一手一定要包含梅花 3。
// 學語言的規則：玩家出牌前要答題；跟牌時答錯就算過，自己起手時答錯只能出最小的一張。
import type { Rng } from '../core/rng';
import { cardKey, dealHands, removeCards, sameCard, type Card, type Suit } from './cards';

export type BigTwoLevel = 'easy' | 'normal' | 'hard';
export type ComboKind = 'single' | 'pair' | 'straight' | 'fullhouse' | 'four' | 'straightflush';

export const COMBO_NAME: Record<ComboKind, string> = {
  single: '單張',
  pair: '對子',
  straight: '順子',
  fullhouse: '葫蘆',
  four: '鐵支',
  straightflush: '同花順',
};

export interface Combo {
  kind: ComboKind;
  cards: Card[];
  /** 同樣張數的牌型可以直接比大小 */
  power: number;
}

/** 大老二的點數：3–13 照舊，A＝14，2＝15 */
export const btRank = (r: number) => (r === 1 ? 14 : r === 2 ? 15 : r);
const SUIT_ORDER: Record<Suit, number> = { C: 0, D: 1, H: 2, S: 3 };
export const cardPower = (c: Card) => btRank(c.r) * 4 + SUIT_ORDER[c.s];
const FIVE_ORDER: Record<string, number> = { straight: 1, fullhouse: 2, four: 3, straightflush: 4 };
const THREE_CLUBS: Card = { s: 'C', r: 3 };

export const sortBt = (cards: Card[]) => [...cards].sort((a, b) => cardPower(a) - cardPower(b));

/** 判斷一手牌是什麼牌型；不是合法牌型回傳 null */
export function analyze(cards: Card[]): Combo | null {
  const cs = sortBt(cards);
  if (cs.length === 1) return { kind: 'single', cards: cs, power: cardPower(cs[0]) };
  if (cs.length === 2) {
    if (cs[0].r !== cs[1].r) return null;
    return { kind: 'pair', cards: cs, power: cardPower(cs[1]) };
  }
  if (cs.length !== 5) return null;
  const ranks = cs.map((c) => btRank(c.r));
  const counts = new Map<number, number>();
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1);
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  if (groups[0][1] === 4) return { kind: 'four', cards: cs, power: FIVE_ORDER.four * 1000 + groups[0][0] };
  if (groups[0][1] === 3 && groups[1][1] === 2) return { kind: 'fullhouse', cards: cs, power: FIVE_ORDER.fullhouse * 1000 + groups[0][0] };
  const straight = counts.size === 5 && ranks[4] - ranks[0] === 4 && ranks[4] <= 14;
  if (!straight) return null;
  const flush = cs.every((c) => c.s === cs[0].s);
  const top = cardPower(cs[4]);
  return flush ? { kind: 'straightflush', cards: cs, power: FIVE_ORDER.straightflush * 1000 + top } : { kind: 'straight', cards: cs, power: FIVE_ORDER.straight * 1000 + top };
}

/** a 壓得過 b 嗎（一定要同樣張數） */
export function beats(a: Combo, b: Combo): boolean {
  return a.cards.length === b.cards.length && a.power > b.power;
}

export const comboLabel = (c: Combo) => COMBO_NAME[c.kind];

export interface BigTwoMove {
  p: number;
  combo: Combo | null;
}

export interface BigTwoState {
  hands: Card[][];
  turn: number;
  /** 桌上最後一手（null 表示可以自由出牌） */
  table: Combo | null;
  /** 桌上那一手是誰出的 */
  lead: number;
  /** 連續「過」的人數，三個人都過就由出牌的人重新起手 */
  passes: number;
  /** 第一手還沒出（一定要包含梅花 3） */
  first: boolean;
  winner: number | null;
  log: BigTwoMove[];
}

export function newBigTwo(rng: Rng): BigTwoState {
  const hands = dealHands(rng, 4).map(sortBt);
  const first = hands.findIndex((h) => h.some((c) => sameCard(c, THREE_CLUBS)));
  return { hands, turn: first, table: null, lead: first, passes: 0, first: true, winner: null, log: [] };
}

/** 這手牌現在能不能出；不行的話回傳原因 */
export function whyNot(st: BigTwoState, p: number, cards: Card[]): string | null {
  if (st.winner !== null) return '這局已經結束了';
  if (st.turn !== p) return '還沒輪到你';
  if (!cards.length) return '先選要出的牌';
  if (!cards.every((c) => st.hands[p].some((h) => sameCard(h, c)))) return '手上沒有這張牌';
  const combo = analyze(cards);
  if (!combo) return cards.length === 3 || cards.length === 4 ? '大老二只能出 1 張、2 張或 5 張' : '不是有效的牌型';
  if (st.first && !cards.some((c) => sameCard(c, THREE_CLUBS))) return '第一手一定要出梅花 3';
  if (st.table) {
    if (combo.cards.length !== st.table.cards.length) return `要出 ${st.table.cards.length} 張（${comboLabel(st.table)}）`;
    if (!beats(combo, st.table)) return '要比桌上的牌大';
  }
  return null;
}

const remember = (st: BigTwoState, m: BigTwoMove) => {
  st.log = [...st.log, m].slice(-8);
};

export function playCards(st: BigTwoState, p: number, cards: Card[]): void {
  const why = whyNot(st, p, cards);
  if (why) throw new Error(why);
  const combo = analyze(cards)!;
  removeCards(st.hands[p], cards);
  st.table = combo;
  st.lead = p;
  st.passes = 0;
  st.first = false;
  remember(st, { p, combo });
  if (!st.hands[p].length) {
    st.winner = p;
    return;
  }
  st.turn = (p + 1) % 4;
}

export function canPass(st: BigTwoState): boolean {
  return st.winner === null && st.table !== null;
}

export function pass(st: BigTwoState, p: number): void {
  if (st.turn !== p || !canPass(st)) throw new Error('現在不能過');
  st.passes++;
  remember(st, { p, combo: null });
  st.turn = (p + 1) % 4;
  // 其他三家都過：桌面清空，由最後出牌的人重新起手
  if (st.passes >= 3) {
    st.table = null;
    st.passes = 0;
    st.turn = st.lead;
  }
}

// ───────── 找出手上所有可以出的牌型 ─────────

function choose<T>(list: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (list.length < k) return [];
  const [x, ...rest] = list;
  return [...choose(rest, k - 1).map((c) => [x, ...c]), ...choose(rest, k)];
}

export function allCombos(hand: Card[]): Combo[] {
  const out: Combo[] = [];
  const byRank = new Map<number, Card[]>();
  for (const c of sortBt(hand)) byRank.set(btRank(c.r), [...(byRank.get(btRank(c.r)) ?? []), c]);
  for (const c of hand) out.push(analyze([c])!);
  for (const cs of byRank.values()) for (const pair of choose(cs, 2)) out.push(analyze(pair)!);
  // 葫蘆、鐵支
  for (const [r3, cs3] of byRank) {
    for (const tri of choose(cs3, 3))
      for (const [r2, cs2] of byRank) if (r2 !== r3) for (const pair of choose(cs2, 2)) out.push(analyze([...tri, ...pair])!);
    if (cs3.length === 4) for (const c of hand) if (btRank(c.r) !== r3) out.push(analyze([...cs3, c])!);
  }
  // 順子、同花順：3 開頭到 10 開頭
  for (let start = 3; start <= 10; start++) {
    const pools = [0, 1, 2, 3, 4].map((k) => byRank.get(start + k) ?? []);
    if (pools.some((pl) => !pl.length)) continue;
    let combos: Card[][] = [[]];
    for (const pl of pools) combos = combos.flatMap((cmb) => pl.map((c) => [...cmb, c]));
    for (const cmb of combos) out.push(analyze(cmb)!);
  }
  return out;
}

/** 現在能出的所有牌型（由小到大） */
export function legalPlays(st: BigTwoState, p: number): Combo[] {
  return allCombos(st.hands[p])
    .filter((c) => !whyNot(st, p, c.cards))
    .sort((a, b) => a.cards.length - b.cards.length || a.power - b.power);
}

/** 這手牌會不會拆掉手上的對子、三條（拆了比較可惜） */
function breaks(hand: Card[], combo: Combo): number {
  if (combo.cards.length === 5) return 0;
  const r = combo.cards[0].r;
  const same = hand.filter((c) => c.r === r).length;
  return same > combo.cards.length ? same - combo.cards.length : 0;
}

/**
 * 電腦的決定：回傳要出的牌，或 null 表示過。
 * 簡單：常常隨便出；普通：出剛好壓得過的最小牌型、盡量不拆對子；
 * 困難：起手時先出五張牌型、有人快出完時改用大牌擋。
 */
export function aiChoose(st: BigTwoState, p: number, level: BigTwoLevel, rng: Rng): Card[] | null {
  const plays = legalPlays(st, p);
  if (!plays.length) return null;
  const hand = st.hands[p];
  const danger = [1, 2, 3].some((k) => st.hands[(p + k) % 4].length <= 2 && (p + k) % 4 !== p);
  if (level === 'easy') {
    if (st.table && rng() < 0.3) return null;
    return plays[Math.floor(rng() * Math.min(plays.length, 4))].cards;
  }
  if (!st.table) {
    // 自己起手：五張 > 對子 > 單張，各自挑最小的；困難模式有人快出完時先出大牌
    const fives = plays.filter((c) => c.cards.length === 5);
    const pairs = plays.filter((c) => c.kind === 'pair');
    const singles = plays.filter((c) => c.kind === 'single');
    if (fives.length && (level === 'hard' || btRank(fives[0].cards[0].r) <= 9)) return fives[0].cards;
    if (pairs.length && btRank(pairs[0].cards[0].r) <= 12) return pairs[0].cards;
    if (danger && level === 'hard' && singles.length) return singles[singles.length - 1].cards;
    const lone = singles.filter((c) => !breaks(hand, c));
    return (lone[0] ?? singles[0] ?? plays[0]).cards;
  }
  // 跟牌：挑剛好壓得過、又不拆牌的最小那一手
  const scored = plays.map((c) => ({ c, cost: c.power + breaks(hand, c) * 30 + (btRank(c.cards[c.cards.length - 1].r) === 15 && hand.length > 5 ? 60 : 0) }));
  scored.sort((a, b) => a.cost - b.cost);
  if (danger && level === 'hard') return plays[plays.length - 1].cards;
  const pick = scored[0];
  // 普通模式：手牌還很多時，不輕易用 2 或拆對子去壓單張
  if (level === 'normal' && pick.cost - pick.c.power >= 30 && hand.length > 6) return null;
  return pick.c.cards;
}

/** 起手時答錯：只能出最小的一張（第一手就出梅花 3） */
export function forcedPlay(st: BigTwoState, p: number): Card[] {
  if (st.first) return [THREE_CLUBS];
  return [sortBt(st.hands[p])[0]];
}

/** 結算：先出完的第一名，其他人依剩下的張數排名 */
export function results(st: BigTwoState): { p: number; left: number; rank: number }[] {
  const rows = st.hands.map((h, p) => ({ p, left: h.length }));
  const sorted = [...rows].sort((a, b) => a.left - b.left || a.p - b.p);
  return sorted.map((r) => ({ ...r, rank: sorted.findIndex((x) => x.left === r.left) }));
}

export const comboKey = (c: Combo) => c.cards.map(cardKey).join(',');
