// 單字卡牌對決的規則
import { describe, expect, it } from 'vitest';
import { mulberry32 } from '../src/core/rng';
import * as D from '../src/engine/duel';

const rng = () => mulberry32(7);

/** 一場只有一隻史萊姆的戰鬥，手牌換成指定的牌 */
function setup(hand: D.CardId[], opts: { hard?: boolean; enemies?: D.EnemyId[] } = {}) {
  const run = D.newRun(!!opts.hard);
  const r = rng();
  D.startBattle(run, 'battle', r, opts.enemies ?? ['slime']);
  const b = run.battle!;
  b.hand = hand.map((id, i) => ({ uid: 900 + i, id, word: `w${i}` }));
  const e = b.enemies[0];
  e.hp = e.maxHp = 50;
  e.block = 0;
  return { run, b, e, r };
}

describe('單字卡牌對決', () => {
  it('新的冒險：10 張起始牌組、第 1 層只能打一般戰鬥', () => {
    const run = D.newRun(false);
    expect(run.deck).toHaveLength(10);
    expect(run.stage).toBe('map');
    expect(run.options).toEqual(['battle']);
    D.enterNode(run, 'battle', rng());
    expect(run.stage).toBe('battle');
    expect(run.battle!.hand).toHaveLength(D.HAND_SIZE);
    expect(run.battle!.energy).toBe(D.MAX_ENERGY);
  });

  it('答對全力發動、連對 3 題會心一擊 1.5 倍、答錯減半；困難模式答錯直接失手', () => {
    let t = setup(['strike']);
    D.playCard(t.run, 0, t.e.uid, true, t.r);
    expect(t.e.hp).toBe(44);
    expect(t.b.energy).toBe(2);

    t = setup(['strike']);
    t.b.streak = 2;
    D.playCard(t.run, 0, t.e.uid, true, t.r);
    expect(t.e.hp).toBe(41);
    expect(t.b.streak).toBe(3);

    t = setup(['strike']);
    t.b.streak = 5;
    D.playCard(t.run, 0, t.e.uid, false, t.r);
    expect(t.e.hp).toBe(47);
    expect(t.b.streak).toBe(0);

    t = setup(['strike'], { hard: true });
    D.playCard(t.run, 0, t.e.uid, false, t.r);
    expect(t.e.hp).toBe(50);
  });

  it('易傷讓敵人多受 50% 傷害，格擋先吸收傷害', () => {
    const t = setup(['bash', 'strike']);
    D.playCard(t.run, 0, t.e.uid, true, t.r);
    expect(t.e.hp).toBe(42);
    expect(t.e.vuln).toBe(2);
    t.e.block = 4;
    D.playCard(t.run, 0, t.e.uid, true, t.r);
    // 6 × 1.5 = 9，被格擋吸收 4
    expect(t.e.hp).toBe(37);
    expect(t.e.block).toBe(0);
  });

  it('能量不夠就不能出牌', () => {
    const t = setup(['finisher']);
    t.b.energy = 2;
    expect(D.canPlay(t.b, t.b.hand[0])).toBe(false);
    expect(D.playCard(t.run, 0, t.e.uid, true, t.r)).toBeNull();
    expect(t.b.hand).toHaveLength(1);
  });

  it('結束回合：敵人照意圖攻擊，格擋會抵銷；下一回合格擋歸零、重新抽牌', () => {
    const t = setup(['defend']);
    D.playCard(t.run, 0, undefined, true, t.r);
    expect(t.b.player.block).toBe(5);
    t.e.intent = { t: 'atk', n: 6 };
    t.e.bonus = 0;
    const hp = t.b.player.hp;
    D.endTurn(t.run, t.r);
    expect(t.b.player.hp).toBe(hp - 1);
    expect(t.b.player.block).toBe(0);
    expect(t.b.turn).toBe(2);
    expect(t.b.energy).toBe(D.MAX_ENERGY);
    expect(t.b.hand.length).toBe(D.HAND_SIZE);
  });

  it('中毒在敵人回合開始時扣血並減一層', () => {
    const t = setup(['venomBlade']);
    D.playCard(t.run, 0, t.e.uid, true, t.r);
    expect(t.e.hp).toBe(47);
    expect(t.e.poison).toBe(4);
    t.e.intent = { t: 'def', n: 1 };
    D.endTurn(t.run, t.r);
    expect(t.e.hp).toBe(43);
    expect(t.e.poison).toBe(3);
  });

  it('抽牌堆用完時把棄牌堆洗回來', () => {
    const t = setup([]);
    t.b.draw = [];
    t.b.discard = [
      { uid: 1, id: 'strike' },
      { uid: 2, id: 'defend' },
    ];
    D.drawCards(t.b, 2, t.r);
    expect(t.b.hand).toHaveLength(2);
    expect(t.b.discard).toHaveLength(0);
  });

  it('能力牌與消耗牌用完後移出戰鬥', () => {
    const t = setup(['inspire', 'focus', 'strike']);
    D.playCard(t.run, 0, undefined, true, t.r);
    expect(t.b.player.str).toBe(2);
    D.playCard(t.run, 0, undefined, true, t.r);
    expect(t.b.exhaust.map((c) => c.id)).toEqual(['inspire', 'focus']);
    // 力量讓攻擊多 2 點（連對歸零，避免變成會心一擊）
    t.b.streak = 0;
    const strike = t.b.hand.findIndex((c) => c.id === 'strike');
    D.playCard(t.run, strike, t.e.uid, true, t.r);
    expect(t.e.hp).toBe(42);
  });

  it('打贏：準備 3 張候選牌，挑一張進牌組並前往下一層', () => {
    const t = setup(['strike']);
    t.e.hp = 3;
    D.playCard(t.run, 0, t.e.uid, true, t.r);
    expect(t.run.stage).toBe('reward');
    expect(t.run.reward!.cards).toHaveLength(3);
    expect(new Set(t.run.reward!.cards.map((c) => c.id)).size).toBe(3);
    const pick = t.run.reward!.cards[0];
    D.takeReward(t.run, pick.uid);
    expect(t.run.deck.some((c) => c.uid === pick.uid)).toBe(true);
    expect(t.run.floor).toBe(2);
    expect(t.run.stage).toBe('map');
    expect(t.run.options).toEqual(D.PLAN[1]);
  });

  it('精英給遺物；大魔王打倒就通關', () => {
    const run = D.newRun(false);
    const r = rng();
    D.startBattle(run, 'elite', r, ['golem']);
    run.battle!.hand = [{ uid: 1, id: 'finisher', word: 'x' }];
    run.battle!.energy = 3;
    run.battle!.enemies[0].hp = 5;
    D.playCard(run, 0, undefined, true, r);
    expect(run.reward!.relic).toBeDefined();
    expect(run.relics).toContain(run.reward!.relic);
    expect(run.stats.elites).toBe(1);

    run.floor = D.FLOORS;
    D.startBattle(run, 'boss', r, ['demon']);
    run.battle!.hand = [{ uid: 2, id: 'finisher', word: 'x' }];
    run.battle!.energy = 3;
    run.battle!.enemies[0].hp = 5;
    D.playCard(run, 0, undefined, true, r);
    expect(run.stage).toBe('over');
    expect(run.result).toBe('win');
    expect(D.runReward(run).coins).toBeGreaterThan(0);
  });

  it('生命歸零就結束，紀錄抵達的層數', () => {
    const t = setup([]);
    t.run.floor = 4;
    t.b.player.hp = 2;
    t.e.intent = { t: 'atk', n: 10 };
    D.endTurn(t.run, t.r);
    expect(t.run.stage).toBe('over');
    expect(t.run.result).toBe('lose');
    expect(t.run.stats.best).toBe(4);
  });

  it('手牌綁的字不重複，也盡量避開剛出過的字', () => {
    const t = setup(['strike', 'strike', 'strike']);
    for (const c of t.b.hand) c.word = undefined;
    D.assignWords(t.b, ['a', 'b', 'c', 'd', 'e'], t.r, ['a', 'b']);
    const ws = t.b.hand.map((c) => c.word);
    expect(new Set(ws).size).toBe(3);
    expect(ws.every((w) => w && !['a', 'b'].includes(w))).toBe(true);
  });

  it('遺物：辭典護符開場給格擋、加油旗讓連對 2 題就會心', () => {
    const run = D.newRun(false);
    run.relics.push('dict', 'flag');
    D.startBattle(run, 'battle', rng(), ['slime']);
    expect(run.battle!.player.block).toBe(8);
    run.battle!.streak = 1;
    expect(D.qualityOf(run, run.battle!, true)).toBe('crit');
  });
});
