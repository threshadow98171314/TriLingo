// 商店的商品目錄：道具、外觀（頭像、頭像框、主題色、答對特效、稱號、喵師父裝扮）、扭蛋與每日神秘商品。
// 價格以「每天把任務做完大約能拿 70–100 金幣」為基準。
import { STICKERS, type Rarity } from '../art/stickers';
import { hashStr, mulberry32, type Rng } from './rng';

// ───────── 道具 ─────────

export type ConsumableId = 'freeze' | 'boost' | 'boost60' | 'shield' | 'clover' | 'hourglass';

export interface Consumable {
  id: ConsumableId;
  name: string;
  desc: string;
  cost: number;
  /** 最多能持有幾個（雙倍 XP 是時間，沒有上限） */
  max?: number;
}

export const CONSUMABLES: Consumable[] = [
  { id: 'freeze', name: '連勝保護', desc: '哪天真的沒空學習，會自動消耗一個來保住連勝紀錄。', cost: 100, max: 2 },
  { id: 'boost', name: '雙倍 XP 藥水', desc: '接下來 15 分鐘，所有語言獲得的 XP 加倍；重複購買會延長時間。', cost: 60 },
  { id: 'boost60', name: '超大瓶雙倍藥水', desc: '一口氣 60 分鐘的雙倍 XP，適合週末衝段位。', cost: 200 },
  { id: 'shield', name: '連擊護符', desc: '練習時答錯一題，連擊不會歸零（3 連擊以上才會用掉）。', cost: 40, max: 5 },
  { id: 'clover', name: '幸運草', desc: '接下來 5 堂課過關都一定會掉寶箱，開出黃金寶箱的機率也變高。', cost: 80, max: 3 },
  { id: 'hourglass', name: '時光沙漏', desc: '下一場「限時快答」多 15 秒。', cost: 30, max: 5 },
];

export const CONSUMABLE_BY_ID = new Map(CONSUMABLES.map((c) => [c.id, c]));

/** 幸運草一個管幾堂課 */
export const CLOVER_LESSONS = 5;
/** 時光沙漏加的秒數 */
export const HOURGLASS_MS = 15_000;

// ───────── 頭像 ─────────

export const AVATAR_COST = 50;
export const PREMIUM_AVATAR_COST = 150;

/** 一般頭像 */
export const SHOP_AVATARS = ['🐼', '🐯', '🦁', '🐸', '🐧', '🦉', '🐰', '🐻', '🐹', '🐨', '🐷', '🐮', '🐵', '🐙', '🤖', '👾', '👻'];
/** 高級頭像：比較貴，也會出現在每日神秘商品（打折） */
export const PREMIUM_AVATARS = ['🦄', '🐲', '🐳', '🐻‍❄️', '🦔'];

// ───────── 外觀 ─────────

export type CosmeticKind = 'frame' | 'skin' | 'burst' | 'title' | 'outfit';

export interface Cosmetic {
  kind: CosmeticKind;
  id: string;
  name: string;
  desc: string;
  cost: number;
  /** 只在每日神秘商品出現 */
  rare?: boolean;
}

export const cosmeticKey = (kind: CosmeticKind, id: string) => `${kind}:${id}`;

export const KIND_NAME: Record<CosmeticKind, string> = {
  frame: '頭像框',
  skin: '主題色',
  burst: '答對特效',
  title: '稱號',
  outfit: '喵師父裝扮',
};

export const FRAMES: Cosmetic[] = [
  { kind: 'frame', id: 'gold', name: '金星框', desc: '閃亮亮的金色星星。', cost: 120 },
  { kind: 'frame', id: 'sakura', name: '櫻花框', desc: '春天的櫻花圍繞著你。', cost: 150 },
  { kind: 'frame', id: 'leaf', name: '新葉框', desc: '每天長一點點，就像學語言。', cost: 100 },
  { kind: 'frame', id: 'ice', name: '冰晶框', desc: '冷靜的頭腦是考試的最佳夥伴。', cost: 120 },
  { kind: 'frame', id: 'star', name: '星空框', desc: '熬夜念書的時候，星星也陪著你。', cost: 150 },
  { kind: 'frame', id: 'rainbow', name: '彩虹框', desc: '三種語言，七種顏色。', cost: 200 },
  { kind: 'frame', id: 'crown', name: '王者框', desc: '頭上戴著皇冠的頭像框，只在神秘商品出現。', cost: 260, rare: true },
];

/** 主題色：換掉整個網站的強調色（按鈕、進度、連結） */
export interface Skin extends Cosmetic {
  a: string;
  b: string;
}

export const SKINS: Skin[] = [
  { kind: 'skin', id: 'sakura', name: '櫻花粉', desc: '溫柔的粉紅色。', cost: 150, a: '#ff7eb6', b: '#ffb86b' },
  { kind: 'skin', id: 'matcha', name: '抹茶綠', desc: '清爽的綠色，看久了眼睛也舒服。', cost: 150, a: '#4cc38a', b: '#c3e88d' },
  { kind: 'skin', id: 'ocean', name: '海洋藍', desc: '像夏天的海。', cost: 150, a: '#3b9cff', b: '#22d3ee' },
  { kind: 'skin', id: 'sunset', name: '夕陽橘', desc: '活力滿滿的橘色。', cost: 150, a: '#ff8a3d', b: '#fbbf24' },
  { kind: 'skin', id: 'lavender', name: '薰衣草', desc: '夢幻的淡紫色。', cost: 150, a: '#b48cff', b: '#f0abfc' },
  { kind: 'skin', id: 'gold', name: '午夜金', desc: '低調奢華的金色，只在神秘商品出現。', cost: 280, a: '#f5b82e', b: '#fde68a', rare: true },
];

/** 答對特效：答對時爆出來的粒子 */
export interface Burst extends Cosmetic {
  colors?: string[];
  shapes?: ('star' | 'circle' | 'spark' | 'glow' | 'petal' | 'coin' | 'snow' | 'rect' | 'glyph')[];
  glyphs?: string[];
}

export const BURSTS: Burst[] = [
  { kind: 'burst', id: 'sakura', name: '櫻吹雪', desc: '答對時飄出櫻花瓣。', cost: 120, shapes: ['petal'], colors: ['#ffc6d9', '#ffb3cc', '#ffd9e6', '#ff9fbf'] },
  { kind: 'burst', id: 'hearts', name: '愛心滿滿', desc: '答對時冒出愛心。', cost: 120, shapes: ['glyph'], glyphs: ['💗', '💖', '💕'] },
  { kind: 'burst', id: 'snow', name: '雪花紛飛', desc: '答對時落下雪花。', cost: 100, shapes: ['snow', 'glow'], colors: ['#ffffff', '#cfeaff', '#a9dcff'] },
  { kind: 'burst', id: 'confetti', name: '彩帶派對', desc: '每一題都像在開派對。', cost: 120, shapes: ['rect', 'circle'], colors: ['#ff7a7a', '#ffd34d', '#6ab8ff', '#8fdc6b', '#b48cff'] },
  { kind: 'burst', id: 'notes', name: '音符', desc: '答對時響起看不見的音樂。', cost: 100, shapes: ['glyph'], glyphs: ['♪', '♫', '🎵'] },
  { kind: 'burst', id: 'coins', name: '金幣雨', desc: '叮叮噹噹，只在神秘商品出現。', cost: 220, shapes: ['coin', 'star'], colors: ['#ffe066', '#fbbf24'], rare: true },
];

export const TITLES: Cosmetic[] = [
  { kind: 'title', id: 'rookie', name: '見習生', desc: '每個高手都是從這裡開始的。', cost: 30 },
  { kind: 'title', id: 'hunter', name: '單字獵人', desc: '看到不會的字就想抓起來。', cost: 80 },
  { kind: 'title', id: 'grammar', name: '文法魔法師', desc: '時態、助詞、語尾變化難不倒你。', cost: 80 },
  { kind: 'title', id: 'ear', name: '順風耳', desc: '聽力題是你的主場。', cost: 80 },
  { kind: 'title', id: 'night', name: '深夜學霸', desc: '月亮是你的讀書燈。', cost: 60 },
  { kind: 'title', id: 'morning', name: '晨型人', desc: '早起的鳥兒有單字背。', cost: 60 },
  { kind: 'title', id: 'traveler', name: '旅行家', desc: '學語言就是為了去更多地方。', cost: 100 },
  { kind: 'title', id: 'otaku', name: '動漫通', desc: '不看字幕的日子不遠了。', cost: 100 },
  { kind: 'title', id: 'kdrama', name: '韓劇迷', desc: '오빠、대박、진짜？都聽得懂。', cost: 100 },
  { kind: 'title', id: 'toeic', name: '多益戰士', desc: '目標金色證書！', cost: 120 },
  { kind: 'title', id: 'trilingual', name: '三語達人', desc: '英日韓都說得出口。', cost: 200 },
  { kind: 'title', id: 'legend', name: '傳說學者', desc: '只在神秘商品出現的稱號。', cost: 300, rare: true },
];

export const OUTFITS: Cosmetic[] = [
  { kind: 'outfit', id: 'glasses', name: '圓框眼鏡', desc: '戴上眼鏡的喵師父看起來更有學問了。', cost: 80 },
  { kind: 'outfit', id: 'bow', name: '粉紅蝴蝶結', desc: '可愛度大幅上升。', cost: 80 },
  { kind: 'outfit', id: 'straw', name: '草帽', desc: '夏天去旅行吧！', cost: 100 },
  { kind: 'outfit', id: 'phones', name: '耳機', desc: '聽力練習中，請勿打擾。', cost: 100 },
  { kind: 'outfit', id: 'beret', name: '貝雷帽', desc: '藝術家風格，適合邊喝咖啡邊背單字。', cost: 100 },
  { kind: 'outfit', id: 'grad', name: '學士帽', desc: '提醒你離目標又近一步。', cost: 120 },
  { kind: 'outfit', id: 'santa', name: '聖誕帽', desc: 'Merry Christmas！메리 크리스마스！メリークリスマス！', cost: 120 },
  { kind: 'outfit', id: 'flowers', name: '櫻花花環', desc: '春天限定的氣息。', cost: 150 },
  { kind: 'outfit', id: 'crown', name: '黃金皇冠', desc: '三語之王的證明，只在神秘商品出現。', cost: 300, rare: true },
];

export const COSMETICS: Record<CosmeticKind, Cosmetic[]> = { frame: FRAMES, skin: SKINS, burst: BURSTS, title: TITLES, outfit: OUTFITS };

export function cosmeticOf(key: string): Cosmetic | undefined {
  const [kind, id] = key.split(':') as [CosmeticKind, string];
  return COSMETICS[kind]?.find((c) => c.id === id);
}

// ───────── 扭蛋 ─────────

export const GACHA_COST = 50;
/** 十連抽：九次的價錢 */
export const GACHA10_COST = 450;
/** 抽到重複的貼紙：退還的金幣 */
export const DUPE_REFUND: Record<Rarity, number> = { N: 10, R: 15, SR: 30, SSR: 80 };
export const RARITY_ODDS: [Rarity, number][] = [
  ['SSR', 0.015],
  ['SR', 0.085],
  ['R', 0.28],
  ['N', 0.62],
];

/** 抽一張：先抽稀有度，再從該稀有度裡平均抽一張；minRarity 用來保底 */
export function rollSticker(rng: Rng, minRarity: Rarity = 'N'): string {
  const order: Rarity[] = ['N', 'R', 'SR', 'SSR'];
  const min = order.indexOf(minRarity);
  let r = rng();
  let rarity: Rarity = 'N';
  for (const [k, p] of RARITY_ODDS) {
    if (r < p) {
      rarity = k;
      break;
    }
    r -= p;
  }
  if (order.indexOf(rarity) < min) rarity = minRarity;
  const pool = STICKERS.filter((s) => s.rarity === rarity);
  return pool[Math.floor(rng() * pool.length)].id;
}

// ───────── 每日神秘商品 ─────────

export type MysteryOffer =
  | { kind: 'avatar'; id: string; cost: number; was: number }
  | { kind: 'cosmetic'; key: string; cost: number; was: number }
  | { kind: 'sticker'; cost: number; min: Rarity }
  | { kind: 'coins'; cost: number; min: number; max: number }
  | { kind: 'boost60'; cost: number; was: number }
  | { kind: 'freeze2'; cost: number; was: number };

/**
 * 今天的神秘商品：用日期當種子，同一天每個人看到的都一樣（已經擁有的外觀會跳過）。
 * 稀有外觀（rare）只會在這裡出現。
 */
export function mysteryOffer(day: string, owned: (key: string) => boolean): MysteryOffer {
  const rng = mulberry32(hashStr(`mystery:${day}`));
  const offers: MysteryOffer[] = [];
  for (const id of PREMIUM_AVATARS) if (!owned(`avatar:${id}`)) offers.push({ kind: 'avatar', id, cost: 100, was: PREMIUM_AVATAR_COST });
  for (const list of Object.values(COSMETICS)) {
    for (const c of list) {
      const key = cosmeticKey(c.kind, c.id);
      if (owned(key)) continue;
      // 稀有外觀出現的機會多一點
      const offer: MysteryOffer = { kind: 'cosmetic', key, cost: c.rare ? c.cost : Math.round((c.cost * 0.7) / 5) * 5, was: c.cost };
      offers.push(offer);
      if (c.rare) offers.push(offer, offer);
    }
  }
  offers.push(
    { kind: 'sticker', cost: 150, min: 'SR' },
    { kind: 'sticker', cost: 150, min: 'SR' },
    { kind: 'coins', cost: 50, min: 20, max: 150 },
    { kind: 'coins', cost: 50, min: 20, max: 150 },
    { kind: 'boost60', cost: 120, was: 200 },
    { kind: 'freeze2', cost: 150, was: 200 },
  );
  return offers[Math.floor(rng() * offers.length)];
}

/** 填字遊戲：免費提示用完之後，每次提示的價錢 */
export const CROSSWORD_HINT_COST = 5;
