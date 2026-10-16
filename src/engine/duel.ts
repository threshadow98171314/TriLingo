// 單字卡牌對決：像「殺戮尖塔」的回合制卡牌冒險，這裡只有規則（純邏輯），畫面在 pages/CardDuel.tsx。
//
// 規則重點：
// - 每回合 3 點能量、抽 5 張牌；出牌前要先回答這張牌上的單字題。
// - 答對：全力發動；連續答對 3 題以上變成「會心一擊」（1.5 倍）。
// - 答錯：威力減半（困難模式直接失手），連對歸零。
// - 冒險共 10 層：每層從兩條路選一條（戰鬥、精英、營火、事件、寶箱），第 10 層是大魔王。
// - 打贏戰鬥可以從 3 張牌裡挑 1 張加進牌組；精英和寶箱給遺物（被動能力）。
//
// 狀態是純 JSON（可以存進 localStorage 繼續玩）；所有函式都直接修改傳進來的 run。
import type { Rng } from '../core/rng';

// ───────── 卡牌 ─────────

export type CardType = 'atk' | 'def' | 'skill' | 'power';
export type CardRarity = 'start' | 'common' | 'uncommon' | 'rare';

export type CardId =
  | 'strike'
  | 'defend'
  | 'bash'
  | 'twin'
  | 'cleave'
  | 'quick'
  | 'shieldBash'
  | 'iron'
  | 'dodge'
  | 'venomBlade'
  | 'focus'
  | 'memo'
  | 'taunt'
  | 'inspire'
  | 'armor'
  | 'heal'
  | 'surge'
  | 'comboFist'
  | 'storm'
  | 'expose'
  | 'scholar'
  | 'bless'
  | 'finisher'
  | 'fortress'
  | 'echo'
  | 'venom'
  | 'perfect';

export interface CardDef {
  id: CardId;
  name: string;
  icon: string;
  type: CardType;
  rarity: CardRarity;
  cost: number;
  /** 升級後的費用（沒寫就不變） */
  costPlus?: number;
  /** 用完就移出這場戰鬥 */
  exhaust?: boolean;
  /** 要選一個敵人當目標 */
  target?: boolean;
  /** 主要數值：[一般, 升級後] */
  n: [number, number];
  /** 第二個數值 */
  m?: [number, number];
  text: (n: number, m: number) => string;
}

const C = (d: CardDef) => d;

export const CARDS: Record<CardId, CardDef> = {
  strike: C({ id: 'strike', name: '斬擊', icon: '⚔️', type: 'atk', rarity: 'start', cost: 1, target: true, n: [6, 9], text: (n) => `造成 ${n} 點傷害。` }),
  defend: C({ id: 'defend', name: '防禦', icon: '🛡️', type: 'def', rarity: 'start', cost: 1, n: [5, 8], text: (n) => `獲得 ${n} 點格擋。` }),
  bash: C({ id: 'bash', name: '重擊', icon: '🔨', type: 'atk', rarity: 'start', cost: 2, target: true, n: [8, 10], m: [2, 3], text: (n, m) => `造成 ${n} 點傷害，給予 ${m} 層易傷。` }),
  twin: C({ id: 'twin', name: '連斬', icon: '🗡️', type: 'atk', rarity: 'common', cost: 1, target: true, n: [4, 5], m: [2, 2], text: (n, m) => `造成 ${n} 點傷害 ${m} 次。` }),
  cleave: C({ id: 'cleave', name: '橫掃', icon: '🌀', type: 'atk', rarity: 'common', cost: 1, n: [7, 10], text: (n) => `對所有敵人造成 ${n} 點傷害。` }),
  quick: C({ id: 'quick', name: '快攻', icon: '💨', type: 'atk', rarity: 'common', cost: 0, target: true, n: [4, 6], m: [1, 1], text: (n, m) => `造成 ${n} 點傷害，抽 ${m} 張牌。` }),
  shieldBash: C({ id: 'shieldBash', name: '盾擊', icon: '🪨', type: 'atk', rarity: 'common', cost: 1, costPlus: 0, target: true, n: [0, 0], text: () => '造成等同你目前格擋值的傷害。' }),
  iron: C({ id: 'iron', name: '鐵壁', icon: '🧱', type: 'def', rarity: 'common', cost: 2, n: [12, 16], text: (n) => `獲得 ${n} 點格擋。` }),
  dodge: C({ id: 'dodge', name: '閃避', icon: '🍃', type: 'def', rarity: 'common', cost: 1, n: [4, 6], m: [1, 1], text: (n, m) => `獲得 ${n} 點格擋，抽 ${m} 張牌。` }),
  venomBlade: C({ id: 'venomBlade', name: '毒刃', icon: '🐍', type: 'atk', rarity: 'common', cost: 1, target: true, n: [3, 4], m: [4, 6], text: (n, m) => `造成 ${n} 點傷害，給予 ${m} 層中毒。` }),
  focus: C({ id: 'focus', name: '專注', icon: '🎯', type: 'skill', rarity: 'common', cost: 0, exhaust: true, n: [2, 3], text: (n) => `抽 ${n} 張牌。消耗。` }),
  memo: C({ id: 'memo', name: '筆記', icon: '📝', type: 'def', rarity: 'common', cost: 1, n: [6, 9], m: [1, 1], text: (n, m) => `獲得 ${n} 點格擋，下回合多抽 ${m} 張牌。` }),
  taunt: C({ id: 'taunt', name: '威嚇', icon: '😤', type: 'skill', rarity: 'common', cost: 1, target: true, n: [2, 3], m: [4, 6], text: (n, m) => `給予 ${n} 層虛弱，獲得 ${m} 點格擋。` }),
  inspire: C({ id: 'inspire', name: '鼓舞', icon: '📣', type: 'power', rarity: 'uncommon', cost: 1, n: [2, 3], text: (n) => `力量 +${n}：這場戰鬥每次攻擊都多 ${n} 點傷害。` }),
  armor: C({ id: 'armor', name: '金鐘罩', icon: '🔔', type: 'power', rarity: 'uncommon', cost: 1, n: [3, 5], text: (n) => `每回合結束時獲得 ${n} 點格擋。` }),
  heal: C({ id: 'heal', name: '療癒', icon: '💚', type: 'skill', rarity: 'uncommon', cost: 1, exhaust: true, n: [7, 10], text: (n) => `回復 ${n} 點生命。消耗。` }),
  surge: C({ id: 'surge', name: '靈感', icon: '💡', type: 'skill', rarity: 'uncommon', cost: 0, exhaust: true, n: [2, 3], text: (n) => `獲得 ${n} 點能量。消耗。` }),
  comboFist: C({ id: 'comboFist', name: '連擊拳', icon: '👊', type: 'atk', rarity: 'uncommon', cost: 1, target: true, n: [3, 4], m: [3, 4], text: (n, m) => `造成 ${n} 點傷害；目前連對幾題，就再多 ${m} 點×題數。` }),
  storm: C({ id: 'storm', name: '知識風暴', icon: '🌪️', type: 'atk', rarity: 'uncommon', cost: 2, n: [2, 3], text: (n) => `這場戰鬥每答對 1 題，對所有敵人多造成 ${n} 點傷害（最多 40）。` }),
  expose: C({ id: 'expose', name: '看穿', icon: '👁️', type: 'skill', rarity: 'uncommon', cost: 1, target: true, n: [2, 3], m: [1, 1], text: (n, m) => `給予 ${n} 層易傷，抽 ${m} 張牌。` }),
  scholar: C({ id: 'scholar', name: '學霸', icon: '🎓', type: 'power', rarity: 'uncommon', cost: 2, costPlus: 1, n: [1, 1], text: (n) => `之後每回合多抽 ${n} 張牌。` }),
  bless: C({ id: 'bless', name: '智慧之光', icon: '✨', type: 'power', rarity: 'rare', cost: 1, n: [2, 3], text: (n) => `之後每答對 1 題，獲得 ${n} 點格擋。` }),
  finisher: C({ id: 'finisher', name: '必殺技', icon: '💥', type: 'atk', rarity: 'rare', cost: 3, target: true, n: [24, 32], text: (n) => `造成 ${n} 點傷害。` }),
  fortress: C({ id: 'fortress', name: '不動如山', icon: '🏯', type: 'def', rarity: 'rare', cost: 2, costPlus: 1, n: [0, 0], text: () => '格擋值加倍。' }),
  echo: C({ id: 'echo', name: '雙重詠唱', icon: '🔁', type: 'skill', rarity: 'rare', cost: 1, costPlus: 0, n: [1, 1], text: () => '這回合下一張攻擊牌發動兩次。' }),
  venom: C({ id: 'venom', name: '劇毒爆發', icon: '☠️', type: 'skill', rarity: 'rare', cost: 2, costPlus: 1, target: true, n: [0, 0], text: () => '目標的中毒層數加倍。' }),
  perfect: C({ id: 'perfect', name: '滿分答案', icon: '💯', type: 'atk', rarity: 'rare', cost: 1, target: true, n: [10, 14], text: (n) => `造成 ${n} 點傷害；答對的話回復 1 點能量。` }),
};

export const TYPE_NAME: Record<CardType, string> = { atk: '攻擊', def: '防禦', skill: '技能', power: '能力' };

export interface CardInst {
  uid: number;
  id: CardId;
  plus?: boolean;
}

/** 手牌：多綁一個單字（出牌前要答這個字的題） */
export interface HandCard extends CardInst {
  word?: string;
}

export const costOf = (c: CardInst): number => {
  const d = CARDS[c.id];
  return c.plus && d.costPlus !== undefined ? d.costPlus : d.cost;
};
export const nOf = (c: CardInst): number => CARDS[c.id].n[c.plus ? 1 : 0];
export const mOf = (c: CardInst): number => CARDS[c.id].m?.[c.plus ? 1 : 0] ?? 0;
export const cardText = (c: CardInst): string => CARDS[c.id].text(nOf(c), mOf(c));
export const cardName = (c: CardInst): string => CARDS[c.id].name + (c.plus ? '+' : '');

// ───────── 遺物 ─────────

export type RelicId = 'dict' | 'pen' | 'watch' | 'lamp' | 'bookmark' | 'charm' | 'scroll' | 'tea' | 'kimchi' | 'flag';

export interface RelicDef {
  id: RelicId;
  name: string;
  icon: string;
  desc: string;
}

export const RELICS: Record<RelicId, RelicDef> = {
  dict: { id: 'dict', name: '辭典護符', icon: '📕', desc: '每場戰鬥開始時獲得 8 點格擋。' },
  pen: { id: 'pen', name: '鋼筆', icon: '🖋️', desc: '每回合第一張攻擊牌多 4 點傷害。' },
  watch: { id: 'watch', name: '懷錶', icon: '⏱️', desc: '答題時間多 5 秒。' },
  lamp: { id: 'lamp', name: '油燈', icon: '🪔', desc: '每場戰鬥的第一回合多 1 點能量。' },
  bookmark: { id: 'bookmark', name: '書籤', icon: '🔖', desc: '每回合多抽 1 張牌。' },
  charm: { id: 'charm', name: '御守', icon: '🧧', desc: '答錯時威力從一半提高到 75%（困難模式從 0 提高到一半）。' },
  scroll: { id: 'scroll', name: '卷軸', icon: '📜', desc: '每回合第一次會心一擊時，獲得 1 點能量。' },
  tea: { id: 'tea', name: '抹茶', icon: '🍵', desc: '戰鬥勝利後回復 6 點生命。' },
  kimchi: { id: 'kimchi', name: '泡菜罐', icon: '🫙', desc: '每場戰鬥開始時力量 +1。' },
  flag: { id: 'flag', name: '加油旗', icon: '🚩', desc: '連對 2 題就會變成會心一擊（原本要 3 題）。' },
};

export const RELIC_IDS = Object.keys(RELICS) as RelicId[];

// ───────── 敵人 ─────────

export type Move =
  | { t: 'atk'; n: number; x?: number }
  | { t: 'def'; n: number }
  | { t: 'atkdef'; n: number; b: number }
  | { t: 'buff'; str: number; b?: number }
  | { t: 'debuff'; weak?: number; vuln?: number; poison?: number; n?: number }
  | { t: 'heal'; n: number };

export type EnemyId = 'slime' | 'bat' | 'bookworm' | 'ghost' | 'mushroom' | 'pencil' | 'golem' | 'ninja' | 'dokkaebi' | 'demon';

export interface EnemyDef {
  id: EnemyId;
  name: string;
  hp: [number, number];
  tier: 'normal' | 'elite' | 'boss';
  moves: Move[];
  /** 隨機出招（不會連續兩次一樣）；預設照順序循環 */
  random?: boolean;
}

export const ENEMIES: Record<EnemyId, EnemyDef> = {
  slime: { id: 'slime', name: '黏黏史萊姆', hp: [22, 26], tier: 'normal', moves: [{ t: 'atk', n: 6 }, { t: 'def', n: 6 }, { t: 'atk', n: 9 }] },
  bat: { id: 'bat', name: '吸血蝙蝠', hp: [13, 16], tier: 'normal', random: true, moves: [{ t: 'atk', n: 3, x: 2 }, { t: 'atk', n: 5 }, { t: 'debuff', weak: 1, n: 2 }] },
  bookworm: { id: 'bookworm', name: '書蟲', hp: [26, 30], tier: 'normal', moves: [{ t: 'debuff', poison: 3, n: 3 }, { t: 'atk', n: 7 }, { t: 'def', n: 7 }] },
  ghost: { id: 'ghost', name: '小幽靈', hp: [18, 22], tier: 'normal', moves: [{ t: 'debuff', vuln: 2 }, { t: 'atk', n: 10 }, { t: 'atk', n: 6 }] },
  mushroom: { id: 'mushroom', name: '毒菇菇', hp: [24, 28], tier: 'normal', moves: [{ t: 'debuff', poison: 4 }, { t: 'atk', n: 5 }, { t: 'atkdef', n: 5, b: 5 }] },
  pencil: { id: 'pencil', name: '鉛筆兵', hp: [15, 18], tier: 'normal', random: true, moves: [{ t: 'atk', n: 4 }, { t: 'atk', n: 3, x: 2 }, { t: 'def', n: 5 }] },
  golem: { id: 'golem', name: '文法魔像', hp: [46, 50], tier: 'elite', moves: [{ t: 'def', n: 12 }, { t: 'atk', n: 13 }, { t: 'buff', str: 2 }, { t: 'atk', n: 6, x: 2 }] },
  ninja: { id: 'ninja', name: '忍者貓', hp: [38, 42], tier: 'elite', random: true, moves: [{ t: 'atk', n: 4, x: 3 }, { t: 'debuff', weak: 2, n: 6 }, { t: 'atk', n: 11 }] },
  dokkaebi: { id: 'dokkaebi', name: '調皮鬼怪', hp: [42, 46], tier: 'elite', moves: [{ t: 'atkdef', n: 8, b: 8 }, { t: 'buff', str: 3 }, { t: 'atk', n: 7, x: 2 }] },
  demon: {
    id: 'demon',
    name: '考試大魔王',
    hp: [130, 130],
    tier: 'boss',
    moves: [{ t: 'buff', str: 2, b: 10 }, { t: 'atk', n: 6, x: 3 }, { t: 'debuff', vuln: 2, poison: 3, n: 8 }, { t: 'atk', n: 20 }, { t: 'atkdef', n: 10, b: 12 }],
  },
};

export interface Fighter {
  hp: number;
  maxHp: number;
  block: number;
  str: number;
  weak: number;
  vuln: number;
  poison: number;
}

export interface Enemy extends Fighter {
  uid: number;
  id: EnemyId;
  /** 隨層數變強：每次攻擊多的傷害 */
  bonus: number;
  step: number;
  intent: Move;
  /** 大魔王：血量低於一半時暴怒一次 */
  enraged?: boolean;
}

export const fighter = (hp: number): Fighter => ({ hp, maxHp: hp, block: 0, str: 0, weak: 0, vuln: 0, poison: 0 });

// ───────── 地圖 ─────────

export type NodeKind = 'battle' | 'elite' | 'rest' | 'event' | 'treasure' | 'boss';

export const NODE_INFO: Record<NodeKind, { icon: string; name: string; desc: string }> = {
  battle: { icon: '⚔️', name: '戰鬥', desc: '一般的怪物，打贏可以挑一張新牌。' },
  elite: { icon: '💀', name: '精英', desc: '強敵！打贏可以挑牌，還會得到一個遺物。' },
  rest: { icon: '🔥', name: '營火', desc: '休息回復生命，或升級一張牌。' },
  event: { icon: '❓', name: '事件', desc: '不知道會遇到什麼……' },
  treasure: { icon: '🎁', name: '寶箱', desc: '得到一個遺物。' },
  boss: { icon: '👹', name: '大魔王', desc: '最後的考驗！' },
};

/** 每一層可以選的路（第 1 層和最後兩層沒得選） */
export const PLAN: NodeKind[][] = [
  ['battle'],
  ['battle', 'event'],
  ['battle', 'elite'],
  ['rest', 'event'],
  ['battle', 'elite'],
  ['treasure', 'event'],
  ['battle', 'elite'],
  ['rest', 'battle'],
  ['rest'],
  ['boss'],
];
export const FLOORS = PLAN.length;

// ───────── 事件 ─────────

export type EventId = 'shop' | 'spring' | 'chest' | 'dojo' | 'merchant' | 'fortune';

export const EVENTS: Record<EventId, { icon: string; name: string; text: string }> = {
  shop: { icon: '📚', name: '神秘書店', text: '老闆說：「留下一本不需要的書，你會走得更輕鬆。」可以從牌組移除一張牌。' },
  spring: { icon: '⛲', name: '知識之泉', text: '泉水旁刻著三道題目。每答對一題，最大生命 +3 並回復 3 點生命。' },
  chest: { icon: '🧰', name: '被遺忘的寶箱', text: '寶箱上纏著荊棘。打開會失去 6 點生命，但能得到一個遺物。' },
  dojo: { icon: '🥋', name: '修行道場', text: '師父願意指點你一招：升級一張牌。' },
  merchant: { icon: '🧙', name: '流浪商人', text: '「用 8 點生命，換一張稀有的牌，如何？」' },
  fortune: { icon: '🔮', name: '占卜師', text: '水晶球閃了一下：可以回復 12 點生命，或是隨機得到一張罕見以上的牌。' },
};

export const EVENT_IDS = Object.keys(EVENTS) as EventId[];

// ───────── 戰鬥與冒險的狀態 ─────────

export interface Battle {
  kind: 'battle' | 'elite' | 'boss';
  enemies: Enemy[];
  player: Fighter;
  energy: number;
  maxEnergy: number;
  draw: CardInst[];
  hand: HandCard[];
  discard: CardInst[];
  exhaust: CardInst[];
  turn: number;
  /** 目前連對幾題 */
  streak: number;
  /** 這場戰鬥答對幾題 */
  correct: number;
  /** 金鐘罩：每回合結束獲得的格擋 */
  armor: number;
  /** 智慧之光：每答對一題的格擋 */
  bless: number;
  /** 學霸：每回合多抽幾張 */
  extraDraw: number;
  /** 筆記：下回合多抽幾張 */
  nextDraw: number;
  /** 雙重詠唱：接下來幾張攻擊牌發動兩次 */
  echo: number;
  /** 這回合出過攻擊牌了沒（鋼筆） */
  attacked: boolean;
  /** 這回合卷軸用過了沒 */
  scrollUsed: boolean;
  over?: 'win' | 'lose';
}

export type Stage = 'map' | 'battle' | 'reward' | 'rest' | 'event' | 'treasure' | 'over';

export interface Run {
  v: 1;
  hard: boolean;
  /** 目前在第幾層（1 起算） */
  floor: number;
  hp: number;
  maxHp: number;
  deck: CardInst[];
  relics: RelicId[];
  nextUid: number;
  stage: Stage;
  /** 這一層可以選的路 */
  options: NodeKind[];
  battle?: Battle;
  reward?: { cards: CardInst[]; relic?: RelicId; picked?: boolean };
  event?: EventId;
  /** 寶箱開出的遺物 */
  found?: RelicId;
  result?: 'win' | 'lose';
  stats: { correct: number; answered: number; elites: number; best: number };
}

/** 給畫面顯示的效果（傷害數字、格擋…） */
export interface Fx {
  /** 'player' 或敵人的 uid */
  who: 'player' | number;
  kind: 'dmg' | 'block' | 'heal' | 'buff' | 'debuff' | 'miss';
  text: string;
}

const START_DECK: CardId[] = ['strike', 'strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'bash'];
export const HAND_SIZE = 5;
export const MAX_ENERGY = 3;
/** 答題秒數 */
export const answerSeconds = (run: Run): number => (run.hard ? 8 : 12) + (run.relics.includes('watch') ? 5 : 0);

const rint = (lo: number, hi: number, rng: Rng) => lo + Math.floor(rng() * (hi - lo + 1));
const pickOf = <T>(arr: readonly T[], rng: Rng): T => arr[Math.floor(rng() * arr.length)];
function shuffled<T>(arr: readonly T[], rng: Rng): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function newRun(hard: boolean): Run {
  const hp = hard ? 55 : 65;
  return {
    v: 1,
    hard,
    floor: 1,
    hp,
    maxHp: hp,
    deck: START_DECK.map((id, i) => ({ uid: i + 1, id })),
    relics: [],
    nextUid: START_DECK.length + 1,
    stage: 'map',
    options: PLAN[0],
    stats: { correct: 0, answered: 0, elites: 0, best: 0 },
  };
}

const has = (run: Run, r: RelicId) => run.relics.includes(r);

// ───────── 敵人 ─────────

function makeEnemy(run: Run, id: EnemyId, uid: number, rng: Rng): Enemy {
  const d = ENEMIES[id];
  const scale = (1 + 0.07 * (run.floor - 1)) * (run.hard ? 1.2 : 1);
  const hp = Math.round(rint(d.hp[0], d.hp[1], rng) * (d.tier === 'boss' ? (run.hard ? 1.2 : 1) : scale));
  const e: Enemy = { ...fighter(hp), uid, id, bonus: Math.floor((run.floor - 1) / 3) + (run.hard ? 1 : 0), step: 0, intent: d.moves[0] };
  e.intent = nextMove(e, rng, true);
  return e;
}

function nextMove(e: Enemy, rng: Rng, first = false): Move {
  const d = ENEMIES[e.id];
  if (!d.random) {
    const m = d.moves[e.step % d.moves.length];
    e.step++;
    return m;
  }
  const choices = first ? d.moves : d.moves.filter((m) => m !== e.intent);
  return pickOf(choices, rng);
}

/** 依層數決定遇到的敵人 */
export function encounter(run: Run, kind: 'battle' | 'elite' | 'boss', rng: Rng): EnemyId[] {
  if (kind === 'boss') return ['demon'];
  if (kind === 'elite') return [pickOf(['golem', 'ninja', 'dokkaebi'] as EnemyId[], rng)];
  const easy: EnemyId[][] = [['slime'], ['pencil', 'pencil'], ['bat', 'bat'], ['ghost']];
  const hard: EnemyId[][] = [['bookworm'], ['mushroom'], ['ghost', 'bat'], ['slime', 'pencil'], ['mushroom', 'bat'], ['bookworm', 'pencil']];
  return pickOf(run.floor <= 2 ? easy : run.floor <= 5 ? [...easy.slice(2), ...hard] : hard, rng);
}

/** 敵人這次行動的攻擊傷害（含力量、虛弱、你的易傷），畫面顯示意圖用 */
export function enemyHit(e: Enemy, n: number, player: Fighter): number {
  let d = n + e.bonus + e.str;
  if (e.weak > 0) d *= 0.75;
  if (player.vuln > 0) d *= 1.5;
  return Math.max(0, Math.floor(d));
}

// ───────── 戰鬥 ─────────

export function startBattle(run: Run, kind: 'battle' | 'elite' | 'boss', rng: Rng, ids: EnemyId[] = encounter(run, kind, rng)): Battle {
  const enemies = ids.map((id) => makeEnemy(run, id, run.nextUid++, rng));
  const b: Battle = {
    kind,
    enemies,
    player: { ...fighter(run.maxHp), hp: run.hp },
    energy: MAX_ENERGY,
    maxEnergy: MAX_ENERGY,
    draw: shuffled(run.deck, rng).map((c) => ({ ...c })),
    hand: [],
    discard: [],
    exhaust: [],
    turn: 1,
    streak: 0,
    correct: 0,
    armor: 0,
    bless: 0,
    extraDraw: 0,
    nextDraw: 0,
    echo: 0,
    attacked: false,
    scrollUsed: false,
  };
  if (has(run, 'dict')) b.player.block += 8;
  if (has(run, 'kimchi')) b.player.str += 1;
  if (has(run, 'lamp')) b.energy += 1;
  run.battle = b;
  run.stage = 'battle';
  drawCards(b, HAND_SIZE + b.extraDraw + (has(run, 'bookmark') ? 1 : 0), rng);
  return b;
}

export function drawCards(b: Battle, n: number, rng: Rng): void {
  for (let i = 0; i < n; i++) {
    if (!b.draw.length) {
      if (!b.discard.length) return;
      b.draw = shuffled(b.discard, rng);
      b.discard = [];
    }
    // 手牌最多 10 張
    if (b.hand.length >= 10) return;
    b.hand.push({ ...b.draw.pop()! });
  }
}

/** 手牌裡還沒綁單字的牌，從 words 裡挑字綁上（同一手不重複，盡量避開剛出現過的字） */
export function assignWords(b: Battle, words: readonly string[], rng: Rng, recent: readonly string[] = []): void {
  const used = new Set(b.hand.map((c) => c.word).filter(Boolean));
  for (const c of b.hand) {
    if (c.word) continue;
    const fresh = words.filter((w) => !used.has(w) && !recent.includes(w));
    const pool = fresh.length ? fresh : words.filter((w) => !used.has(w));
    c.word = pool.length ? pickOf(pool, rng) : pickOf(words, rng);
    used.add(c.word);
  }
}

export const critNeed = (run: Run): number => (has(run, 'flag') ? 2 : 3);

/** 這張牌現在能不能出（能量夠、戰鬥還沒結束） */
export const canPlay = (b: Battle, c: CardInst): boolean => !b.over && b.energy >= costOf(c);

/** 答題結果決定的威力倍率 */
export function powerOf(run: Run, q: 'crit' | 'hit' | 'miss'): number {
  if (q === 'crit') return 1.5;
  if (q === 'hit') return 1;
  if (run.hard) return has(run, 'charm') ? 0.5 : 0;
  return has(run, 'charm') ? 0.75 : 0.5;
}

/** 答完題要出這張牌時的品質：答錯 miss；答對且連對達標 crit */
export function qualityOf(run: Run, b: Battle, correct: boolean): 'crit' | 'hit' | 'miss' {
  if (!correct) return 'miss';
  return b.streak + 1 >= critNeed(run) ? 'crit' : 'hit';
}

const alive = (b: Battle) => b.enemies.filter((e) => e.hp > 0);

function damageEnemy(b: Battle, e: Enemy, base: number, f: number, fx: Fx[]): void {
  if (e.hp <= 0) return;
  let d = (base + b.player.str) * f;
  if (b.player.weak > 0) d *= 0.75;
  if (e.vuln > 0) d *= 1.5;
  const dmg = Math.max(0, Math.floor(d));
  const absorbed = Math.min(e.block, dmg);
  e.block -= absorbed;
  e.hp = Math.max(0, e.hp - (dmg - absorbed));
  fx.push({ who: e.uid, kind: 'dmg', text: absorbed && absorbed === dmg ? `🛡️${dmg}` : `-${dmg - absorbed}` });
}

function damagePlayer(b: Battle, dmg: number, fx: Fx[]): void {
  const absorbed = Math.min(b.player.block, dmg);
  b.player.block -= absorbed;
  b.player.hp = Math.max(0, b.player.hp - (dmg - absorbed));
  fx.push({ who: 'player', kind: 'dmg', text: absorbed && absorbed === dmg ? `🛡️${dmg}` : `-${dmg - absorbed}` });
}

const scaled = (x: number, f: number) => Math.floor(x * f);

/**
 * 出牌：手牌第 idx 張、目標敵人 uid、答題對錯。回傳畫面效果。
 * 能量不夠或戰鬥已結束時不做任何事（回傳 null）。
 */
export function playCard(run: Run, idx: number, targetUid: number | undefined, correct: boolean, rng: Rng): Fx[] | null {
  const b = run.battle;
  if (!b || b.over) return null;
  const c = b.hand[idx];
  if (!c || !canPlay(b, c)) return null;
  const d = CARDS[c.id];
  const q = qualityOf(run, b, correct);
  const f = powerOf(run, q);
  const fx: Fx[] = [];
  b.energy -= costOf(c);
  b.hand.splice(idx, 1);

  // 答題紀錄
  run.stats.answered++;
  if (correct) {
    b.streak++;
    b.correct++;
    run.stats.correct++;
    if (b.bless > 0) {
      b.player.block += b.bless;
      fx.push({ who: 'player', kind: 'block', text: `+${b.bless}🛡️` });
    }
  } else {
    b.streak = 0;
  }
  if (q === 'miss') fx.push({ who: 'player', kind: 'miss', text: f === 0 ? '失手！' : '威力減半' });
  if (q === 'crit') {
    fx.push({ who: 'player', kind: 'buff', text: '會心一擊！' });
    if (has(run, 'scroll') && !b.scrollUsed) {
      b.scrollUsed = true;
      b.energy++;
    }
  }

  const live = alive(b);
  const target = live.find((e) => e.uid === targetUid) ?? live[0];
  const n = nOf(c);
  const m = mOf(c);
  const times = d.type === 'atk' && b.echo > 0 ? 2 : 1;
  if (times === 2) b.echo--;
  const penBonus = d.type === 'atk' && !b.attacked && has(run, 'pen') ? 4 : 0;
  if (d.type === 'atk') b.attacked = true;

  for (let t = 0; t < times; t++) {
    const bonus = t === 0 ? penBonus : 0;
    switch (c.id) {
      case 'strike':
      case 'finisher':
        if (target) damageEnemy(b, target, n + bonus, f, fx);
        break;
      case 'perfect':
        if (target) damageEnemy(b, target, n + bonus, f, fx);
        if (correct && t === 0) b.energy++;
        break;
      case 'bash':
        if (target) {
          damageEnemy(b, target, n + bonus, f, fx);
          target.vuln += scaled(m, f);
        }
        break;
      case 'twin':
        for (let k = 0; k < m; k++) if (target) damageEnemy(b, target, n + (k === 0 ? bonus : 0), f, fx);
        break;
      case 'cleave':
        for (const e of alive(b)) damageEnemy(b, e, n + bonus, f, fx);
        break;
      case 'quick':
        if (target) damageEnemy(b, target, n + bonus, f, fx);
        drawCards(b, scaled(m, Math.min(1, f)), rng);
        break;
      case 'shieldBash':
        if (target) damageEnemy(b, target, b.player.block + bonus, f, fx);
        break;
      case 'comboFist':
        if (target) damageEnemy(b, target, n + m * b.streak + bonus, f, fx);
        break;
      case 'storm':
        for (const e of alive(b)) damageEnemy(b, e, Math.min(40, n * b.correct) + bonus, f, fx);
        break;
      case 'venomBlade':
        if (target) {
          damageEnemy(b, target, n + bonus, f, fx);
          target.poison += scaled(m, f);
        }
        break;
      case 'defend':
      case 'iron':
        b.player.block += scaled(n, f);
        break;
      case 'dodge':
        b.player.block += scaled(n, f);
        drawCards(b, scaled(m, Math.min(1, f)), rng);
        break;
      case 'memo':
        b.player.block += scaled(n, f);
        b.nextDraw += scaled(m, Math.min(1, f));
        break;
      case 'fortress':
        b.player.block += scaled(b.player.block, f);
        break;
      case 'focus':
        drawCards(b, scaled(n, Math.min(1, f)), rng);
        break;
      case 'taunt':
        if (target) target.weak += scaled(n, f);
        b.player.block += scaled(m, f);
        break;
      case 'expose':
        if (target) target.vuln += scaled(n, f);
        drawCards(b, scaled(m, Math.min(1, f)), rng);
        break;
      case 'venom':
        if (target) target.poison += scaled(target.poison, f);
        break;
      case 'heal': {
        const h = scaled(n, f);
        b.player.hp = Math.min(b.player.maxHp, b.player.hp + h);
        if (h) fx.push({ who: 'player', kind: 'heal', text: `+${h}` });
        break;
      }
      case 'surge':
        b.energy += scaled(n, Math.min(1, f));
        break;
      case 'echo':
        b.echo += scaled(n, Math.min(1, f));
        break;
      case 'inspire':
        b.player.str += scaled(n, f);
        break;
      case 'armor':
        b.armor += scaled(n, f);
        break;
      case 'scholar':
        b.extraDraw += scaled(n, Math.min(1, f));
        break;
      case 'bless':
        b.bless += scaled(n, f);
        break;
    }
  }

  // 用完的牌：能力牌和「消耗」牌移出戰鬥，其他進棄牌堆
  const done: CardInst = { uid: c.uid, id: c.id, plus: c.plus };
  if (d.type === 'power' || d.exhaust) b.exhaust.push(done);
  else b.discard.push(done);

  checkOver(run, rng);
  return fx;
}

function checkOver(run: Run, rng: Rng): void {
  const b = run.battle!;
  if (b.player.hp <= 0) b.over = 'lose';
  else if (!alive(b).length) b.over = 'win';
  if (b.over) finishBattle(run, rng);
}

function finishBattle(run: Run, rng: Rng): void {
  const b = run.battle!;
  run.hp = b.player.hp;
  if (b.over === 'lose') {
    run.stats.best = Math.max(run.stats.best, run.floor);
    run.stage = 'over';
    run.result = 'lose';
    return;
  }
  if (has(run, 'tea')) run.hp = Math.min(run.maxHp, run.hp + 6);
  if (b.kind === 'elite') run.stats.elites++;
  if (b.kind === 'boss') {
    run.stats.best = FLOORS;
    run.stage = 'over';
    run.result = 'win';
    return;
  }
  run.stage = 'reward';
  prepareReward(run, rng);
}

/**
 * 結束回合：棄掉手牌 → 敵人行動 → 下一回合抽牌。回傳畫面效果。
 */
export function endTurn(run: Run, rng: Rng): Fx[] {
  const b = run.battle;
  const fx: Fx[] = [];
  if (!b || b.over) return fx;
  const p = b.player;
  // 回合結束
  if (b.armor > 0) {
    p.block += b.armor;
    fx.push({ who: 'player', kind: 'block', text: `+${b.armor}🛡️` });
  }
  b.discard.push(...b.hand.map(({ uid, id, plus }) => ({ uid, id, plus })));
  b.hand = [];
  if (p.weak > 0) p.weak--;
  if (p.vuln > 0) p.vuln--;

  // 敵人行動
  for (const e of b.enemies) {
    if (e.hp <= 0) continue;
    e.block = 0;
    if (e.poison > 0) {
      e.hp = Math.max(0, e.hp - e.poison);
      fx.push({ who: e.uid, kind: 'dmg', text: `☠️-${e.poison}` });
      e.poison--;
      if (e.hp <= 0) continue;
    }
    if (e.id === 'demon' && !e.enraged && e.hp < e.maxHp / 2) {
      e.enraged = true;
      e.str += 3;
      fx.push({ who: e.uid, kind: 'buff', text: '暴怒！力量 +3' });
    }
    const mv = e.intent;
    switch (mv.t) {
      case 'atk':
        for (let k = 0; k < (mv.x ?? 1); k++) damagePlayer(b, enemyHit(e, mv.n, p), fx);
        break;
      case 'def':
        e.block += mv.n + e.bonus;
        fx.push({ who: e.uid, kind: 'block', text: `+${mv.n + e.bonus}🛡️` });
        break;
      case 'atkdef':
        damagePlayer(b, enemyHit(e, mv.n, p), fx);
        e.block += mv.b;
        break;
      case 'buff':
        e.str += mv.str;
        if (mv.b) e.block += mv.b;
        fx.push({ who: e.uid, kind: 'buff', text: `力量 +${mv.str}` });
        break;
      case 'debuff':
        if (mv.n) damagePlayer(b, enemyHit(e, mv.n, p), fx);
        if (mv.weak) p.weak += mv.weak;
        if (mv.vuln) p.vuln += mv.vuln;
        if (mv.poison) p.poison += mv.poison;
        fx.push({ who: 'player', kind: 'debuff', text: [mv.weak && '虛弱', mv.vuln && '易傷', mv.poison && '中毒'].filter(Boolean).join('・') });
        break;
      case 'heal':
        e.hp = Math.min(e.maxHp, e.hp + mv.n);
        break;
    }
    if (e.weak > 0) e.weak--;
    if (e.vuln > 0) e.vuln--;
    if (p.hp <= 0) break;
  }
  for (const e of b.enemies) if (e.hp > 0) e.intent = nextMove(e, rng);
  checkOver(run, rng);
  if (b.over) return fx;

  // 下一回合
  b.turn++;
  p.block = 0;
  if (p.poison > 0) {
    p.hp = Math.max(0, p.hp - p.poison);
    fx.push({ who: 'player', kind: 'dmg', text: `☠️-${p.poison}` });
    p.poison--;
    checkOver(run, rng);
    if (b.over) return fx;
  }
  b.energy = b.maxEnergy;
  b.attacked = false;
  b.scrollUsed = false;
  drawCards(b, HAND_SIZE + b.extraDraw + b.nextDraw + (has(run, 'bookmark') ? 1 : 0), rng);
  b.nextDraw = 0;
  return fx;
}

// ───────── 獎勵、營火、事件 ─────────

function rollRarity(rng: Rng, elite: boolean): CardRarity {
  const r = rng();
  if (elite) return r < 0.15 ? 'rare' : r < 0.55 ? 'uncommon' : 'common';
  return r < 0.07 ? 'rare' : r < 0.37 ? 'uncommon' : 'common';
}

export function newCard(run: Run, id: CardId, plus = false): CardInst {
  return { uid: run.nextUid++, id, plus: plus || undefined };
}

/** 三張不重複的候選牌 */
export function rollCards(run: Run, rng: Rng, elite: boolean, min?: CardRarity): CardInst[] {
  const out: CardInst[] = [];
  const order: CardRarity[] = ['common', 'uncommon', 'rare'];
  for (let tries = 0; out.length < 3 && tries < 50; tries++) {
    let r = rollRarity(rng, elite);
    if (min && order.indexOf(r) < order.indexOf(min)) r = min;
    const pool = (Object.values(CARDS) as CardDef[]).filter((d) => d.rarity === r && !out.some((o) => o.id === d.id));
    if (!pool.length) continue;
    out.push(newCard(run, pickOf(pool, rng).id));
  }
  return out;
}

export function randomRelic(run: Run, rng: Rng): RelicId | undefined {
  const left = RELIC_IDS.filter((r) => !run.relics.includes(r));
  return left.length ? pickOf(left, rng) : undefined;
}

/** 戰鬥勝利後準備獎勵 */
export function prepareReward(run: Run, rng: Rng): void {
  const elite = run.battle?.kind === 'elite';
  run.reward = { cards: rollCards(run, rng, elite), relic: elite ? randomRelic(run, rng) : undefined };
  if (run.reward.relic) run.relics.push(run.reward.relic);
}

export function takeReward(run: Run, uid: number | null): void {
  if (run.stage !== 'reward' || !run.reward) return;
  const c = run.reward.cards.find((x) => x.uid === uid);
  if (c) run.deck.push(c);
  advance(run);
}

/** 走到下一層（或通關） */
export function advance(run: Run): void {
  run.stats.best = Math.max(run.stats.best, run.floor);
  run.battle = undefined;
  run.reward = undefined;
  run.event = undefined;
  run.found = undefined;
  run.floor++;
  if (run.floor > FLOORS) {
    run.stage = 'over';
    run.result = 'win';
    return;
  }
  run.stage = 'map';
  run.options = PLAN[run.floor - 1];
}

/** 在地圖上選一條路 */
export function enterNode(run: Run, kind: NodeKind, rng: Rng): void {
  if (run.stage !== 'map' || !run.options.includes(kind)) return;
  switch (kind) {
    case 'battle':
    case 'elite':
    case 'boss':
      startBattle(run, kind, rng);
      break;
    case 'rest':
      run.stage = 'rest';
      break;
    case 'event':
      run.stage = 'event';
      run.event = pickOf(EVENT_IDS, rng);
      break;
    case 'treasure':
      run.stage = 'treasure';
      run.found = randomRelic(run, rng);
      if (run.found) run.relics.push(run.found);
      break;
  }
}

export const restHeal = (run: Run): number => Math.round(run.maxHp * 0.3);

export function heal(run: Run, n: number): void {
  run.hp = Math.min(run.maxHp, run.hp + n);
}

export function upgradeCard(run: Run, uid: number): boolean {
  const c = run.deck.find((x) => x.uid === uid);
  if (!c || c.plus) return false;
  c.plus = true;
  return true;
}

export function removeCard(run: Run, uid: number): boolean {
  const i = run.deck.findIndex((x) => x.uid === uid);
  if (i < 0 || run.deck.length <= 5) return false;
  run.deck.splice(i, 1);
  return true;
}

export function loseHp(run: Run, n: number): void {
  run.hp = Math.max(1, run.hp - n);
}

export function gainMaxHp(run: Run, n: number): void {
  run.maxHp += n;
  run.hp += n;
}

/** 牌組依種類、名稱排序（顯示用） */
export function sortedDeck(deck: CardInst[]): CardInst[] {
  const order: CardType[] = ['atk', 'def', 'skill', 'power'];
  return [...deck].sort((a, b) => order.indexOf(CARDS[a.id].type) - order.indexOf(CARDS[b.id].type) || CARDS[a.id].name.localeCompare(CARDS[b.id].name) || Number(!!a.plus) - Number(!!b.plus));
}

/** 意圖的文字（畫面上敵人頭上的小泡泡） */
export function intentOf(e: Enemy, player: Fighter): { icon: string; text: string; kind: 'atk' | 'def' | 'buff' | 'debuff' | 'heal' } {
  const mv = e.intent;
  switch (mv.t) {
    case 'atk':
      return { icon: '⚔️', text: `${enemyHit(e, mv.n, player)}${mv.x && mv.x > 1 ? `×${mv.x}` : ''}`, kind: 'atk' };
    case 'def':
      return { icon: '🛡️', text: String(mv.n + e.bonus), kind: 'def' };
    case 'atkdef':
      return { icon: '⚔️🛡️', text: String(enemyHit(e, mv.n, player)), kind: 'atk' };
    case 'buff':
      return { icon: '💪', text: '', kind: 'buff' };
    case 'debuff':
      return { icon: mv.n ? '⚔️☠️' : '☠️', text: mv.n ? String(enemyHit(e, mv.n, player)) : '', kind: 'debuff' };
    case 'heal':
      return { icon: '💚', text: '', kind: 'heal' };
  }
}

/** 冒險結束的獎勵：XP 項目與金幣 */
export function runReward(run: Run): { parts: [string, number][]; coins: number } {
  const floors = run.result === 'win' ? FLOORS : Math.max(0, run.floor - 1);
  const parts: [string, number][] = [
    ['抵達的層數', floors * 3],
    ['答對題數', Math.min(60, Math.floor(run.stats.correct / 2))],
  ];
  if (run.stats.elites) parts.push(['擊敗精英', run.stats.elites * 5]);
  if (run.result === 'win') parts.push([run.hard ? '困難模式通關' : '打倒大魔王', run.hard ? 50 : 30]);
  const coins = floors * 2 + run.stats.elites * 5 + (run.result === 'win' ? (run.hard ? 60 : 30) : 0);
  return { parts, coins };
}
