// 每日任務：每天由日期決定 3 個任務，全部領完可以開每日寶箱。
import { hashStr, mulberry32, shuffle } from './rng';
import type { DayLog } from './save';
import { LANGS } from './types';
import { sum } from './util';

interface QuestDef {
  id: string;
  icon: string;
  text: (n: number) => string;
  /** 難度由低到高的目標值，與 coins 一一對應 */
  tiers: number[];
  coins: number[];
  value: (l: DayLog) => number;
}

const DEFS: QuestDef[] = [
  { id: 'xp', icon: '⚡', text: (n) => `今天獲得 ${n} XP`, tiers: [60, 100, 150], coins: [10, 15, 20], value: (l) => sum(l.xp) },
  { id: 'lessons', icon: '📘', text: (n) => `完成 ${n} 堂課`, tiers: [2, 3, 4], coins: [10, 15, 20], value: (l) => l.lessons },
  { id: 'perfect', icon: '💯', text: (n) => `拿下 ${n} 次全對`, tiers: [1, 2], coins: [12, 20], value: (l) => l.perfect },
  { id: 'combo', icon: '🔥', text: (n) => `單場達成 ${n} 連擊`, tiers: [10, 15, 20], coins: [8, 12, 16], value: (l) => l.combo },
  { id: 'review', icon: '🧠', text: (n) => `複習 ${n} 個字詞`, tiers: [10, 20], coins: [10, 16], value: (l) => l.reviews },
  { id: 'crossword', icon: '🧩', text: (n) => `完成 ${n} 次填字遊戲`, tiers: [1, 2], coins: [12, 20], value: (l) => l.crossword },
  { id: 'match', icon: '🃏', text: (n) => `完成 ${n} 次配對消消樂`, tiers: [1, 2], coins: [8, 14], value: (l) => l.match },
  { id: 'blitz', icon: '⏱️', text: (n) => `限時快答拿到 ${n} 分`, tiers: [150, 300], coins: [10, 18], value: (l) => l.blitz },
  { id: 'words', icon: '🌱', text: (n) => `學會 ${n} 個新字詞`, tiers: [8, 15], coins: [10, 18], value: (l) => l.words },
  {
    id: 'tri',
    icon: '🌏',
    text: () => '今天三種語言都練習',
    tiers: [3],
    coins: [20],
    value: (l) => LANGS.filter((x) => l.xp[x] > 0).length,
  },
];

// 一定做得到的任務：每天至少給一個，新手第一天也不會卡住
const EASY = ['xp', 'lessons'];

export interface Quest {
  id: string;
  icon: string;
  text: string;
  target: number;
  coins: number;
  value: (l: DayLog) => number;
}

export function questsFor(date: string): Quest[] {
  const rng = mulberry32(hashStr(`quests:${date}`));
  const easy = shuffle(DEFS.filter((d) => EASY.includes(d.id)), rng)[0];
  const rest = shuffle(DEFS.filter((d) => d.id !== easy.id), rng).slice(0, 2);
  return [easy, ...rest].map((d) => {
    const t = Math.floor(rng() * d.tiers.length);
    return { id: d.id, icon: d.icon, text: d.text(d.tiers[t]), target: d.tiers[t], coins: d.coins[t], value: d.value };
  });
}

/** 每日寶箱的金幣範圍 */
export const CHEST_COINS: [number, number] = [20, 40];
