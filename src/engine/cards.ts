// 撲克牌共用：52 張牌、洗牌、發牌、牌面文字。排七與大老二都用這裡的牌。
import type { Rng } from '../core/rng';

/** 花色：S 黑桃、H 紅心、D 方塊、C 梅花 */
export type Suit = 'S' | 'H' | 'D' | 'C';

/** 一張牌：r 是 1–13（A＝1、J＝11、Q＝12、K＝13） */
export interface Card {
  s: Suit;
  r: number;
}

export const SUITS: Suit[] = ['S', 'H', 'D', 'C'];
export const SUIT_SYMBOL: Record<Suit, string> = { S: '♠', H: '♥', D: '♦', C: '♣' };
export const SUIT_NAME: Record<Suit, string> = { S: '黑桃', H: '紅心', D: '方塊', C: '梅花' };
export const RANK_LABEL = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const isRed = (c: Card) => c.s === 'H' || c.s === 'D';
export const cardKey = (c: Card) => `${c.s}${c.r}`;
export const sameCard = (a: Card, b: Card) => a.s === b.s && a.r === b.r;
/** 例如「黑桃 7」 */
export const cardName = (c: Card) => `${SUIT_NAME[c.s]} ${RANK_LABEL[c.r]}`;
/** 例如「♠7」 */
export const cardShort = (c: Card) => `${SUIT_SYMBOL[c.s]}${RANK_LABEL[c.r]}`;

export function fullDeck(): Card[] {
  return SUITS.flatMap((s) => Array.from({ length: 13 }, (_, i) => ({ s, r: i + 1 })));
}

export function shuffled<T>(list: T[], rng: Rng): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 洗牌後輪流發給 n 個人（52 張四個人剛好各 13 張） */
export function dealHands(rng: Rng, n = 4): Card[][] {
  const d = shuffled(fullDeck(), rng);
  const hands: Card[][] = Array.from({ length: n }, () => []);
  d.forEach((c, i) => hands[i % n].push(c));
  return hands;
}

/** 從手牌拿掉幾張牌（找不到就丟錯，代表程式有 bug） */
export function removeCards(hand: Card[], cards: Card[]): void {
  for (const c of cards) {
    const i = hand.findIndex((h) => sameCard(h, c));
    if (i < 0) throw new Error(`手牌裡沒有 ${cardKey(c)}`);
    hand.splice(i, 1);
  }
}

/** 牌桌上的四個人：0 是玩家，其他三位是電腦（來自三種語言的朋友），圖示是頭像的 id */
export const SEATS = ['你', 'Emma', 'さくら', '민준'] as const;
export const SEAT_AVATAR = ['', '🐰', '🦊', '🐻'] as const;
