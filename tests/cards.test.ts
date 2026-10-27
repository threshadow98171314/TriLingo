// 撲克牌遊戲：排七與大老二的規則與電腦對打。
import { describe, expect, it } from 'vitest';
import { mulberry32 } from '../src/core/rng';
import * as B from '../src/engine/bigtwo';
import { cardKey, fullDeck, type Card } from '../src/engine/cards';
import * as S from '../src/engine/sevens';

const c = (s: Card['s'], r: number): Card => ({ s, r });

describe('撲克牌', () => {
  it('一副牌 52 張不重複，發給四個人各 13 張', () => {
    const st = S.newSevens(mulberry32(1));
    expect(st.hands.map((h) => h.length)).toEqual([13, 13, 13, 13]);
    expect(new Set(st.hands.flat().map(cardKey)).size).toBe(52);
    expect(fullDeck()).toHaveLength(52);
  });
});

describe('排七', () => {
  it('拿到黑桃 7 的人先出，而且第一張只能出黑桃 7', () => {
    const st = S.newSevens(mulberry32(2));
    expect(st.hands[st.turn].some((x) => x.s === 'S' && x.r === 7)).toBe(true);
    expect(S.playable(st, st.turn)).toEqual([c('S', 7)]);
    expect(S.canPlayCard(st, c('H', 7))).toBe(false);
  });

  it('7 出了之後可以往上接 8、往下接 6，其他花色可以出 7；跳號不行', () => {
    const st = S.newSevens(mulberry32(3));
    S.play(st, st.turn, c('S', 7));
    expect(S.canPlayCard(st, c('S', 6))).toBe(true);
    expect(S.canPlayCard(st, c('S', 8))).toBe(true);
    expect(S.canPlayCard(st, c('S', 5))).toBe(false);
    expect(S.canPlayCard(st, c('H', 7))).toBe(true);
    expect(S.canPlayCard(st, c('H', 8))).toBe(false);
    expect(st.rows.S).toEqual([7, 7]);
  });

  it('有牌能接時不能蓋牌；答錯可以跳過這回合', () => {
    const st = S.newSevens(mulberry32(4));
    const p = st.turn;
    const other = st.hands[p].find((x) => !(x.s === 'S' && x.r === 7))!;
    expect(() => S.cover(st, p, other)).toThrow();
    S.skip(st, p);
    expect(st.turn).toBe((p + 1) % 4);
  });

  it('電腦沒牌可接時蓋最小的牌', () => {
    const st = S.newSevens(mulberry32(5));
    st.started = true;
    st.rows = { S: [7, 7], H: [7, 7], D: [7, 7], C: [7, 7] };
    st.hands[1] = [c('S', 13), c('H', 2), c('D', 11)];
    expect(S.aiMove(st, 1, 'normal', mulberry32(1))).toEqual({ kind: 'cover', card: c('H', 2) });
  });

  it('四個電腦對打 60 局：每局都能結束，52 張牌都有去處，排名依罰分', () => {
    for (let seed = 1; seed <= 60; seed++) {
      const rng = mulberry32(seed);
      const st = S.newSevens(rng);
      let guard = 0;
      while (!st.done && guard++ < 500) {
        const m = S.aiMove(st, st.turn, (['easy', 'normal', 'hard'] as const)[seed % 3], rng);
        if (m.kind === 'play') S.play(st, st.turn, m.card);
        else S.cover(st, st.turn, m.card);
      }
      expect(st.done, `第 ${seed} 局`).toBe(true);
      const played = (['S', 'H', 'D', 'C'] as const).reduce((a, s) => a + (st.rows[s] ? st.rows[s]![1] - st.rows[s]![0] + 1 : 0), 0);
      expect(played + st.covered.flat().length).toBe(52);
      const res = S.results(st);
      expect(res[0].points).toBeLessThanOrEqual(res[3].points);
      expect(res[0].rank).toBe(0);
    }
  });
});

describe('大老二', () => {
  it('牌型判斷：單張、對子、順子、葫蘆、鐵支、同花順；同花、含 2 的順子不算', () => {
    expect(B.analyze([c('S', 2)])?.kind).toBe('single');
    expect(B.analyze([c('S', 9), c('H', 9)])?.kind).toBe('pair');
    expect(B.analyze([c('S', 9), c('H', 8)])).toBeNull();
    expect(B.analyze([c('S', 3), c('H', 4), c('D', 5), c('C', 6), c('S', 7)])?.kind).toBe('straight');
    expect(B.analyze([c('S', 10), c('H', 11), c('D', 12), c('C', 13), c('S', 1)])?.kind).toBe('straight');
    expect(B.analyze([c('S', 11), c('H', 12), c('D', 13), c('C', 1), c('S', 2)])).toBeNull();
    expect(B.analyze([c('S', 1), c('H', 2), c('D', 3), c('C', 4), c('S', 5)])).toBeNull();
    expect(B.analyze([c('S', 5), c('H', 5), c('D', 5), c('C', 9), c('S', 9)])?.kind).toBe('fullhouse');
    expect(B.analyze([c('S', 5), c('H', 5), c('D', 5), c('C', 5), c('S', 9)])?.kind).toBe('four');
    expect(B.analyze([c('H', 4), c('H', 5), c('H', 6), c('H', 7), c('H', 8)])?.kind).toBe('straightflush');
    expect(B.analyze([c('H', 4), c('H', 9), c('H', 6), c('H', 12), c('H', 8)])).toBeNull();
    expect(B.analyze([c('H', 4), c('S', 4), c('D', 4)])).toBeNull();
  });

  it('比大小：2 最大、同點比花色（黑桃最大）、五張牌型依種類比、張數不同不能比', () => {
    const one = (x: Card[]) => B.analyze(x)!;
    expect(B.beats(one([c('C', 2)]), one([c('S', 1)]))).toBe(true);
    expect(B.beats(one([c('S', 9)]), one([c('H', 9)]))).toBe(true);
    expect(B.beats(one([c('D', 2), c('C', 2)]), one([c('S', 1), c('H', 1)]))).toBe(true);
    const straight = one([c('S', 10), c('H', 11), c('D', 12), c('C', 13), c('S', 1)]);
    const full = one([c('S', 3), c('H', 3), c('D', 3), c('C', 4), c('S', 4)]);
    const four = one([c('S', 3), c('H', 3), c('D', 3), c('C', 3), c('S', 4)]);
    const sf = one([c('C', 3), c('C', 4), c('C', 5), c('C', 6), c('C', 7)]);
    expect(B.beats(full, straight)).toBe(true);
    expect(B.beats(four, full)).toBe(true);
    expect(B.beats(sf, four)).toBe(true);
    expect(B.beats(sf, one([c('S', 2)]))).toBe(false);
  });

  it('拿到梅花 3 的人先出，第一手要包含梅花 3；跟牌要同樣張數而且比較大', () => {
    const st = B.newBigTwo(mulberry32(7));
    const p = st.turn;
    expect(st.hands[p].some((x) => x.s === 'C' && x.r === 3)).toBe(true);
    const notThree = st.hands[p].find((x) => !(x.s === 'C' && x.r === 3))!;
    expect(B.whyNot(st, p, [notThree])).toBe('第一手一定要出梅花 3');
    B.playCards(st, p, [c('C', 3)]);
    expect(st.first).toBe(false);
    const q = st.turn;
    expect(B.whyNot(st, q, st.hands[q].slice(0, 2))).toMatch(/要出 1 張|不是有效的牌型/);
  });

  it('三家都過：桌面清空，由最後出牌的人重新自由出牌；自由出牌時不能過', () => {
    const st = B.newBigTwo(mulberry32(8));
    const p = st.turn;
    B.playCards(st, p, [c('C', 3)]);
    for (let k = 1; k <= 3; k++) B.pass(st, (p + k) % 4);
    expect(st.table).toBeNull();
    expect(st.turn).toBe(p);
    expect(B.canPass(st)).toBe(false);
    expect(() => B.pass(st, p)).toThrow();
  });

  it('起手答錯時被迫出的牌一定合法', () => {
    const st = B.newBigTwo(mulberry32(9));
    expect(B.whyNot(st, st.turn, B.forcedPlay(st, st.turn))).toBeNull();
  });

  it('四個電腦對打 60 局：每局都有人出完，牌數守恆，出的每一手都合法', () => {
    for (let seed = 1; seed <= 60; seed++) {
      const rng = mulberry32(seed * 31);
      const st = B.newBigTwo(rng);
      let guard = 0;
      let played = 0;
      while (st.winner === null && guard++ < 800) {
        const cards = B.aiChoose(st, st.turn, (['easy', 'normal', 'hard'] as const)[seed % 3], rng);
        if (cards) {
          expect(B.whyNot(st, st.turn, cards), `第 ${seed} 局`).toBeNull();
          played += cards.length;
          B.playCards(st, st.turn, cards);
        } else if (B.canPass(st)) B.pass(st, st.turn);
        else throw new Error('自由出牌時電腦不能過');
      }
      expect(st.winner, `第 ${seed} 局`).not.toBeNull();
      expect(played + st.hands.flat().length).toBe(52);
      expect(B.results(st)[0].p).toBe(st.winner);
    }
  });
});
