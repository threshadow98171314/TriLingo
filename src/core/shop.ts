// 商店的商品目錄：道具、外觀（頭像、頭像框、主題色、答對特效、稱號、喵師父裝扮）、扭蛋與每日神秘商品。
// 價格以「每天把任務做完大約能拿 70–100 金幣」為基準。
import { STICKERS, type Rarity } from '../art/stickers';
import { hashStr, mulberry32, pick, type Rng } from './rng';

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
export const SHOP_AVATARS = ['🐼', '🐯', '🦁', '🐸', '🐧', '🦉', '🐰', '🐻', '🐹', '🐨', '🐷', '🐮', '🐵', '🐙', '🤖', '👾', '👻', '🦦', '🐿️', '🦭', '🐝', '🦥', '🦩'];
/** 高級頭像：比較貴、會動（眨眼、晃來晃去），也會出現在每日神秘商品（打折） */
export const PREMIUM_AVATARS = ['🦄', '🐲', '🐳', '🐻‍❄️', '🦔'];

// ───────── 外觀 ─────────

export type CosmeticKind = 'frame' | 'skin' | 'burst' | 'title' | 'outfit' | 'pet' | 'name' | 'bg' | 'sound' | 'ambient' | 'totop';

export interface Cosmetic {
  kind: CosmeticKind;
  id: string;
  name: string;
  desc: string;
  cost: number;
  /** 只在每日神秘商品出現 */
  rare?: boolean;
  /** 會動的高級外觀 */
  anim?: boolean;
  /** 稱號的文字特效 */
  fx?: 'gold' | 'rainbow' | 'neon' | 'fire';
  /** 商店卡片上的預覽圖案（飄落特效、回頂特效） */
  icon?: string;
}

export const cosmeticKey = (kind: CosmeticKind, id: string) => `${kind}:${id}`;

export const KIND_NAME: Record<CosmeticKind, string> = {
  frame: '頭像框',
  skin: '主題色',
  burst: '答對特效',
  title: '稱號',
  outfit: '喵師父裝扮',
  pet: '學習夥伴',
  name: '名牌特效',
  bg: '名片背景',
  sound: '答對音效',
  ambient: '飄落特效',
  totop: '回頂特效',
};

export const FRAMES: Cosmetic[] = [
  { kind: 'frame', id: 'gold', name: '金星框', desc: '閃亮亮的金色星星。', cost: 120 },
  { kind: 'frame', id: 'sakura', name: '櫻花框', desc: '春天的櫻花圍繞著你。', cost: 150 },
  { kind: 'frame', id: 'leaf', name: '新葉框', desc: '每天長一點點，就像學語言。', cost: 100 },
  { kind: 'frame', id: 'ice', name: '冰晶框', desc: '冷靜的頭腦是考試的最佳夥伴。', cost: 120 },
  { kind: 'frame', id: 'star', name: '星空框', desc: '熬夜念書的時候，星星也陪著你。', cost: 150 },
  { kind: 'frame', id: 'rainbow', name: '彩虹框', desc: '三種語言，七種顏色。', cost: 200 },
  { kind: 'frame', id: 'crown', name: '王者框', desc: '頭上戴著皇冠的頭像框，只在神秘商品出現。', cost: 260, rare: true },
  { kind: 'frame', id: 'ribbon', name: '緞帶框', desc: '綁上大大的粉紅蝴蝶結。', cost: 120 },
  { kind: 'frame', id: 'paw', name: '貓掌框', desc: '喵師父的肉球印章。', cost: 120 },
  { kind: 'frame', id: 'candy', name: '糖果框', desc: '甜甜的條紋糖果圈。', cost: 140 },
  { kind: 'frame', id: 'wave', name: '浪花框', desc: '浮世繪風的海浪。', cost: 150 },
  { kind: 'frame', id: 'bamboo', name: '竹林框', desc: '清幽的竹子與竹葉。', cost: 140 },
  { kind: 'frame', id: 'lace', name: '蕾絲框', desc: '優雅的白色蕾絲花邊。', cost: 130 },
  { kind: 'frame', id: 'orbit', name: '星軌框', desc: '三顆星星繞著你轉個不停。', cost: 320, anim: true },
  { kind: 'frame', id: 'aurora', name: '極光框', desc: '流動變色的北極光。', cost: 380, anim: true },
  { kind: 'frame', id: 'flame', name: '火焰框', desc: '熊熊燃燒的學習熱情。', cost: 360, anim: true },
  { kind: 'frame', id: 'bubble', name: '泡泡框', desc: '泡泡一顆一顆往上飄。', cost: 300, anim: true },
  { kind: 'frame', id: 'petals', name: '櫻吹雪框', desc: '花瓣不停地飄落。', cost: 360, anim: true },
  { kind: 'frame', id: 'neon', name: '霓虹框', desc: '東京夜晚的霓虹燈，一閃一閃。', cost: 340, anim: true },
  { kind: 'frame', id: 'heart', name: '心跳框', desc: '愛心隨著心跳撲通撲通。', cost: 300, anim: true },
  { kind: 'frame', id: 'music', name: '音符框', desc: '音符跟著節奏跳舞。', cost: 320, anim: true },
  { kind: 'frame', id: 'snow', name: '雪花框', desc: '雪花慢慢旋轉飄下。', cost: 320, anim: true },
  { kind: 'frame', id: 'koi', name: '錦鯉框', desc: '兩隻錦鯉繞著你游泳，招來好運。', cost: 420, anim: true },
  { kind: 'frame', id: 'thunder', name: '雷神框', desc: '閃電劈啪作響，只在神秘商品出現。', cost: 520, rare: true, anim: true },
  { kind: 'frame', id: 'galaxy', name: '銀河框', desc: '整片星空繞著你旋轉，只在神秘商品出現。', cost: 560, rare: true, anim: true },
  { kind: 'frame', id: 'dragon', name: '金龍框', desc: '一條金龍盤旋飛舞，只在神秘商品出現。', cost: 600, rare: true, anim: true },
  { kind: 'frame', id: 'phoenix', name: '鳳凰框', desc: '浴火重生的鳳凰展開翅膀，只在神秘商品出現。', cost: 600, rare: true, anim: true },
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
  { kind: 'skin', id: 'mint', name: '薄荷綠', desc: '清涼的薄荷色。', cost: 150, a: '#2ec4b6', b: '#a7f3d0' },
  { kind: 'skin', id: 'peach', name: '蜜桃粉', desc: '水蜜桃一樣的暖粉色。', cost: 150, a: '#ff8f80', b: '#ffd3b6' },
  { kind: 'skin', id: 'coffee', name: '拿鐵咖啡', desc: '邊喝咖啡邊背單字。', cost: 150, a: '#c08552', b: '#f3d2a8' },
  { kind: 'skin', id: 'cherry', name: '櫻桃紅', desc: '熱情的紅色。', cost: 150, a: '#ef4565', b: '#ffa3b5' },
  { kind: 'skin', id: 'forest', name: '森林', desc: '安靜的深綠色森林。', cost: 150, a: '#3f9a5a', b: '#b5e48c' },
  { kind: 'skin', id: 'rose', name: '玫瑰金', desc: '優雅的玫瑰金。', cost: 180, a: '#d4848f', b: '#f7c8a1' },
  { kind: 'skin', id: 'neon', name: '電光霓虹', desc: '螢光粉配螢光藍，只在神秘商品出現。', cost: 300, a: '#ff2bd6', b: '#2be8ff', rare: true },
  { kind: 'skin', id: 'glacier', name: '冰川藍', desc: '透明感的冰藍色，只在神秘商品出現。', cost: 300, a: '#5cc8ff', b: '#e0f7ff', rare: true },
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
  { kind: 'burst', id: 'fireworks', name: '煙火大會', desc: '每答對一題就放一次煙火。', cost: 160, shapes: ['spark', 'glow', 'star'], colors: ['#ff7a7a', '#ffd34d', '#7ad8ff', '#c4a8ff', '#8fdc6b'] },
  { kind: 'burst', id: 'bubbles', name: '肥皂泡泡', desc: '輕飄飄的泡泡。', cost: 100, shapes: ['circle', 'glow'], colors: ['#cfeaff', '#e8d9ff', '#ffffff'] },
  { kind: 'burst', id: 'paws', name: '貓掌印', desc: '喵師父幫你蓋章。', cost: 120, shapes: ['glyph'], glyphs: ['🐾'] },
  { kind: 'burst', id: 'leaves', name: '秋天落葉', desc: '紅葉和銀杏一起飛舞。', cost: 120, shapes: ['glyph'], glyphs: ['🍁', '🍂', '🍃'] },
  { kind: 'burst', id: 'kana', name: '假名飛舞', desc: 'あ、ア、い、イ滿天飛。', cost: 120, shapes: ['glyph'], glyphs: ['あ', 'ア', 'い', 'イ', 'う', 'ウ'] },
  { kind: 'burst', id: 'hangul', name: '韓文字母', desc: '가、나、다、ㄱ、ㄴ、ㄷ一起跳出來。', cost: 120, shapes: ['glyph'], glyphs: ['가', '나', '다', 'ㄱ', 'ㄴ', 'ㅎ'] },
  { kind: 'burst', id: 'abc', name: 'ABC', desc: '英文字母大集合。', cost: 120, shapes: ['glyph'], glyphs: ['A', 'B', 'C', 'Z', 'Q'] },
  { kind: 'burst', id: 'thunder', name: '閃電', desc: '答題速度快如閃電。', cost: 140, shapes: ['glyph', 'spark'], glyphs: ['⚡'], colors: ['#ffe066', '#fff3b0'] },
  { kind: 'burst', id: 'clover', name: '四葉幸運草', desc: '好運一直來。', cost: 120, shapes: ['glyph'], glyphs: ['🍀'] },
  { kind: 'burst', id: 'rainbow', name: '彩虹星', desc: '七彩的星星，只在神秘商品出現。', cost: 260, shapes: ['star', 'glow'], colors: ['#ff7a7a', '#ffb35c', '#ffe066', '#8fdc6b', '#6ab8ff', '#b48cff'], rare: true },
  { kind: 'burst', id: 'feast', name: '美食祭', desc: '壽司、飯糰、糰子從天而降，只在神秘商品出現。', cost: 260, shapes: ['glyph'], glyphs: ['🍣', '🍙', '🍡', '🍜'], rare: true },
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
  { kind: 'title', id: 'legend', name: '傳說學者', desc: '金光閃閃的稱號，只在神秘商品出現。', cost: 300, rare: true, fx: 'gold' },
  { kind: 'title', id: 'kana', name: '假名職人', desc: '平假名、片假名閉著眼睛都會。', cost: 80 },
  { kind: 'title', id: 'kanji', name: '漢字達人', desc: '讀音、寫法、意思全部掌握。', cost: 120 },
  { kind: 'title', id: 'hangul', name: '韓文字母王', desc: '子音母音一秒拼好。', cost: 80 },
  { kind: 'title', id: 'detective', name: '文法偵探', desc: '一眼看穿句子的結構。', cost: 100 },
  { kind: 'title', id: 'collector', name: '例句收藏家', desc: '每個字都要聽三句例句才滿足。', cost: 100 },
  { kind: 'title', id: 'combo', name: '連擊之王', desc: '一路答對停不下來。', cost: 120 },
  { kind: 'title', id: 'cardmaster', name: '卡牌大師', desc: '單字卡牌對決的常勝軍。', cost: 150 },
  { kind: 'title', id: 'wordsmith', name: '猜詞名偵探', desc: '三次以內就能猜中。', cost: 120 },
  { kind: 'title', id: 'chain', name: '接龍王', desc: 'しりとり、끝말잇기都難不倒你。', cost: 120 },
  { kind: 'title', id: 'cafe', name: '咖啡因戰士', desc: '一杯咖啡一百個單字。', cost: 60 },
  { kind: 'title', id: 'subtitle', name: '人肉字幕組', desc: '看劇不需要字幕。', cost: 150 },
  { kind: 'title', id: 'toeic990', name: '多益 990', desc: '滿分是唯一的目標。', cost: 200 },
  { kind: 'title', id: 'n1', name: 'N1 合格者', desc: '日檢最高級，衝！', cost: 200 },
  { kind: 'title', id: 'topik6', name: 'TOPIK 6 級', desc: '韓檢最高級，화이팅！', cost: 200 },
  { kind: 'title', id: 'sage', name: '星之賢者', desc: '閃著彩虹光的稱號，只在神秘商品出現。', cost: 360, rare: true, fx: 'rainbow' },
  { kind: 'title', id: 'dragon', name: '龍之語者', desc: '燃燒著火焰的稱號，只在神秘商品出現。', cost: 360, rare: true, fx: 'fire' },
  { kind: 'title', id: 'neon', name: '夜之霓虹', desc: '閃爍的霓虹燈稱號，只在神秘商品出現。', cost: 320, rare: true, fx: 'neon' },
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

/** 學習夥伴：上課時陪在旁邊，答對會跳、答錯會一起難過（用頭像的插畫，id 是頭像的 emoji） */
export const PETS: Cosmetic[] = [
  { kind: 'pet', id: '🐹', name: '倉鼠阿圓', desc: '腮幫子塞滿瓜子，答對就開心跳起來。', cost: 180, anim: true },
  { kind: 'pet', id: '🐰', name: '兔兔', desc: '答對時跳得特別高。', cost: 180, anim: true },
  { kind: 'pet', id: '🐧', name: '企鵝寶寶', desc: '搖搖擺擺地陪你上課。', cost: 180, anim: true },
  { kind: 'pet', id: '🐸', name: '呱呱', desc: '連擊越多跳得越起勁。', cost: 180, anim: true },
  { kind: 'pet', id: '🐼', name: '熊貓團子', desc: '慢吞吞但很有耐心。', cost: 200, anim: true },
  { kind: 'pet', id: '🦉', name: '博士貓頭鷹', desc: '熬夜念書的好夥伴。', cost: 200, anim: true },
  { kind: 'pet', id: '🐙', name: '小章魚', desc: '八隻腳一起幫你翻字典。', cost: 200, anim: true },
  { kind: 'pet', id: '🤖', name: '機器人 TRI-01', desc: '精準計算你的連擊數。', cost: 220, anim: true },
  { kind: 'pet', id: '🦦', name: '水獺', desc: '抱著貝殼陪你複習。', cost: 220, anim: true },
  { kind: 'pet', id: '🦄', name: '獨角獸', desc: '閃閃發光的夢幻夥伴，只在神秘商品出現。', cost: 420, anim: true, rare: true },
  { kind: 'pet', id: '🐲', name: '小龍', desc: '會冒出小火花的龍寶寶，只在神秘商品出現。', cost: 450, anim: true, rare: true },
];

/** 名牌特效：個人頁上的名字 */
export const NAMES: Cosmetic[] = [
  { kind: 'name', id: 'sakura', name: '櫻花粉', desc: '名字染上柔和的櫻花漸層。', cost: 100 },
  { kind: 'name', id: 'ice', name: '冰晶藍', desc: '冰涼透明的藍色漸層。', cost: 100 },
  { kind: 'name', id: 'gold', name: '金色流光', desc: '一道金光不停滑過你的名字。', cost: 260, anim: true },
  { kind: 'name', id: 'rainbow', name: '彩虹流動', desc: '七種顏色在名字上流動。', cost: 300, anim: true },
  { kind: 'name', id: 'neon', name: '霓虹燈牌', desc: '像招牌一樣一閃一閃。', cost: 280, anim: true },
  { kind: 'name', id: 'fire', name: '烈焰', desc: '名字燒起來了！', cost: 300, anim: true },
  { kind: 'name', id: 'star', name: '星光閃爍', desc: '名字旁邊有星星在閃，只在神秘商品出現。', cost: 400, anim: true, rare: true },
];

/** 名片背景：個人頁最上方的卡片 */
export const BGS: Cosmetic[] = [
  { kind: 'bg', id: 'sunset', name: '晚霞', desc: '橘粉色的傍晚天空。', cost: 150 },
  { kind: 'bg', id: 'bamboo', name: '竹林', desc: '嵐山竹林的清新綠意。', cost: 150 },
  { kind: 'bg', id: 'city', name: '城市夜景', desc: '首爾、東京、紐約的夜晚。', cost: 180 },
  { kind: 'bg', id: 'starry', name: '星空', desc: '滿天星星一閃一閃。', cost: 300, anim: true },
  { kind: 'bg', id: 'sakura', name: '櫻花雨', desc: '花瓣慢慢飄落。', cost: 320, anim: true },
  { kind: 'bg', id: 'aurora', name: '極光', desc: '流動的綠色、紫色光帶。', cost: 340, anim: true },
  { kind: 'bg', id: 'ocean', name: '海浪', desc: '一波一波的海浪。', cost: 300, anim: true },
  { kind: 'bg', id: 'galaxy', name: '銀河', desc: '旋轉的星雲，只在神秘商品出現。', cost: 480, anim: true, rare: true },
  { kind: 'bg', id: 'fireworks', name: '煙火大會', desc: '夏日祭典的煙火，只在神秘商品出現。', cost: 480, anim: true, rare: true },
];

/** 答對音效：答對時的聲音（用 Web Audio 即時合成） */
export const SOUNDS: Cosmetic[] = [
  { kind: 'sound', id: 'bell', name: '風鈴', desc: '叮鈴～清脆的風鈴聲。', cost: 120 },
  { kind: 'sound', id: 'xylo', name: '木琴', desc: '咚咚，溫暖的木琴。', cost: 120 },
  { kind: 'sound', id: 'retro', name: '8-bit 電玩', desc: '懷舊紅白機的音效。', cost: 150 },
  { kind: 'sound', id: 'pop', name: '泡泡', desc: '啵！一聲輕快的泡泡。', cost: 100 },
  { kind: 'sound', id: 'meow', name: '喵喵', desc: '喵師父幫你喊加油。', cost: 150 },
  { kind: 'sound', id: 'taiko', name: '太鼓', desc: '咚！像太鼓達人一樣。', cost: 150 },
  { kind: 'sound', id: 'harp', name: '豎琴', desc: '夢幻的豎琴琶音，只在神秘商品出現。', cost: 260, rare: true },
  { kind: 'sound', id: 'coin', name: '金幣', desc: '每答對一題都像撿到錢，只在神秘商品出現。', cost: 260, rare: true },
];

/** 飄落特效：網站背景一直飄的東西（沒有裝備時跟著季節：秋天楓葉、冬天雪花、春天櫻花、夏天螢火蟲） */
export const AMBIENTS: Cosmetic[] = [
  { kind: 'ambient', id: 'leaf', name: '楓葉', desc: '紅色、橘色的楓葉一年四季都飄。', cost: 100, icon: '🍁🍂🍁' },
  { kind: 'ambient', id: 'sakura', name: '櫻花', desc: '粉紅色的花瓣翻轉著飄下來。', cost: 120, icon: '🌸🌸🌸' },
  { kind: 'ambient', id: 'snow', name: '雪花', desc: '靜靜飄落的白雪。', cost: 100, icon: '❄❅❆' },
  { kind: 'ambient', id: 'ginkgo', name: '銀杏', desc: '東京神宮外苑的金黃色銀杏葉。', cost: 120, icon: 'ginkgo' },
  { kind: 'ambient', id: 'firefly', name: '螢火蟲', desc: '夏夜的小光點在畫面下方慢慢飛。', cost: 140, icon: 'firefly' },
  { kind: 'ambient', id: 'star', name: '星空', desc: '星星在各處亮起，一閃一閃。', cost: 140, icon: '★✦★' },
  { kind: 'ambient', id: 'heart', name: '愛心', desc: '愛心從下面慢慢飄上來。', cost: 120, icon: '💗💖💕' },
  { kind: 'ambient', id: 'bubble', name: '泡泡', desc: '彩色的肥皂泡泡往上飄。', cost: 120, icon: 'bubble' },
  { kind: 'ambient', id: 'note', name: '音符', desc: '彩色的音符跟著旋律飄上來。', cost: 120, icon: '♪♫♬' },
  { kind: 'ambient', id: 'letter', name: '三語字母', desc: 'あ、가、A 從天而降。', cost: 140, icon: 'あ가A' },
  { kind: 'ambient', id: 'clover', name: '幸運草', desc: '四葉幸運草帶來好運。', cost: 120, icon: '🍀☘️🍀' },
  { kind: 'ambient', id: 'sweets', name: '甜點', desc: '糖果、糰子、甜甜圈掉下來。', cost: 120, icon: '🍬🍡🍩' },
  { kind: 'ambient', id: 'rain', name: '梅雨', desc: '六月的細雨，適合安靜念書。', cost: 120, icon: 'rain' },
  { kind: 'ambient', id: 'halloween', name: '萬聖節', desc: '南瓜、蝙蝠和落葉一起飄。', cost: 140, icon: '🎃🦇🍂' },
  { kind: 'ambient', id: 'lantern', name: '平溪天燈', desc: '溫暖的天燈慢慢升上夜空。', cost: 220, icon: 'lantern' },
  { kind: 'ambient', id: 'meteor', name: '流星雨', desc: '流星劃過星空，快許願！只在神秘商品出現。', cost: 380, rare: true, icon: 'meteor' },
  { kind: 'ambient', id: 'coin', name: '金幣雨', desc: '金幣一直掉下來，只在神秘商品出現。', cost: 400, rare: true, icon: 'coin' },
];

/** 回頂特效：按「回到頂端」時飛上去的東西 */
export const TOTOPS: Cosmetic[] = [
  { kind: 'totop', id: 'rocket', name: '火箭', desc: '噴著火焰直衝頂端。', cost: 120, icon: '🚀' },
  { kind: 'totop', id: 'balloon', name: '氣球', desc: '輕飄飄地升上去，到頂端「啵」一聲爆開。', cost: 100, icon: '🎈' },
  { kind: 'totop', id: 'plane', name: '紙飛機', desc: '先繞一個圈，再咻地飛上去。', cost: 100, icon: '✈️' },
  { kind: 'totop', id: 'cat', name: '喵師父跳跳', desc: '一路往上跳，留下肉球腳印。', cost: 140, icon: '🐱' },
  { kind: 'totop', id: 'broom', name: '魔女掃帚', desc: '騎著掃帚灑下星星。', cost: 140, icon: '🧹' },
  { kind: 'totop', id: 'cloud', name: '筋斗雲', desc: '一個筋斗十萬八千里。', cost: 150, icon: '☁️' },
  { kind: 'totop', id: 'train', name: '新幹線', desc: '時速 320 公里，一秒到頂。', cost: 150, icon: '🚄' },
  { kind: 'totop', id: 'ufo', name: '幽浮', desc: '飛碟降下來，用光束把你吸上去。', cost: 200, icon: '🛸' },
  { kind: 'totop', id: 'rainbow', name: '彩虹流星', desc: '拖著七彩尾巴的流星。', cost: 180, icon: '🌈' },
  { kind: 'totop', id: 'fireworks', name: '煙火', desc: '回到頂端的同時放一場煙火。', cost: 180, icon: '🎆' },
  { kind: 'totop', id: 'unicorn', name: '獨角獸', desc: '踩著彩虹飛上去，還會下星星雨，只在神秘商品出現。', cost: 420, rare: true, icon: '🦄' },
  { kind: 'totop', id: 'dragon', name: '金龍升天', desc: '金龍盤旋而上，撒下一場金幣雨，只在神秘商品出現。', cost: 480, rare: true, icon: '🐉' },
];

export const COSMETICS: Record<CosmeticKind, Cosmetic[]> = {
  frame: FRAMES,
  skin: SKINS,
  burst: BURSTS,
  title: TITLES,
  outfit: OUTFITS,
  pet: PETS,
  name: NAMES,
  bg: BGS,
  sound: SOUNDS,
  ambient: AMBIENTS,
  totop: TOTOPS,
};

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
  /** 外觀福袋：買了才揭曉是哪一件 */
  | { kind: 'lucky'; key: string; cost: number; was: number }
  | { kind: 'sticker'; cost: number; min: Rarity }
  | { kind: 'coins'; cost: number; min: number; max: number }
  | { kind: 'boost60'; cost: number; was: number }
  | { kind: 'freeze2'; cost: number; was: number }
  /** 十連抽特價 */
  | { kind: 'gacha10'; cost: number; was: number }
  /** 道具福袋 */
  | { kind: 'pack'; cost: number; was: number; items: [ConsumableId, number][] };

/** 三格神秘商品：限定（只在這裡賣的稀有外觀）、特價（打折的外觀與頭像、外觀福袋）、補給（貼紙、道具、金幣） */
export const MYSTERY_SLOTS = ['限定', '特價', '補給'] as const;

const round5 = (n: number) => Math.round(n / 5) * 5;
const packWas = (items: [ConsumableId, number][]) => items.reduce((a, [id, n]) => a + (CONSUMABLE_BY_ID.get(id)?.cost ?? 0) * n, 0);
const PACKS: [ConsumableId, number][][] = [
  [
    ['shield', 2],
    ['hourglass', 2],
    ['clover', 1],
  ],
  [
    ['boost', 2],
    ['shield', 2],
  ],
  [
    ['clover', 2],
    ['hourglass', 3],
  ],
];

/**
 * 今天的三件神秘商品：用日期當種子，同一天每個人看到的都一樣（已經擁有的外觀會跳過）。
 * 稀有外觀（rare）只會在這裡出現。
 */
export function mysteryOffers(day: string, owned: (key: string) => boolean): MysteryOffer[] {
  return MYSTERY_SLOTS.map((_, slot) => mysterySlot(day, slot, owned));
}

function mysterySlot(day: string, slot: number, owned: (key: string) => boolean): MysteryOffer {
  const rng = mulberry32(hashStr(`mystery:${day}:${slot}`));
  const unowned = Object.values(COSMETICS)
    .flat()
    .filter((c) => !owned(cosmeticKey(c.kind, c.id)));
  const avatars = PREMIUM_AVATARS.filter((id) => !owned(`avatar:${id}`));
  if (slot === 0) {
    const rares = unowned.filter((c) => c.rare);
    if (rares.length) {
      const c = pick(rares, rng);
      return { kind: 'cosmetic', key: cosmeticKey(c.kind, c.id), cost: c.cost, was: c.cost };
    }
    if (avatars.length) return { kind: 'avatar', id: pick(avatars, rng), cost: 100, was: PREMIUM_AVATAR_COST };
    return { kind: 'gacha10', cost: 330, was: GACHA10_COST };
  }
  if (slot === 1) {
    const normal = unowned.filter((c) => !c.rare);
    const offers: MysteryOffer[] = normal.map((c) => ({ kind: 'cosmetic', key: cosmeticKey(c.kind, c.id), cost: round5(c.cost * 0.7), was: c.cost }));
    for (const id of avatars) offers.push({ kind: 'avatar', id, cost: 100, was: PREMIUM_AVATAR_COST });
    // 外觀福袋：六折，出現的機會多一點
    if (normal.length >= 3) {
      for (let i = 0; i < Math.max(2, Math.round(offers.length / 5)); i++) {
        const c = pick(normal, rng);
        offers.push({ kind: 'lucky', key: cosmeticKey(c.kind, c.id), cost: round5(Math.max(60, c.cost * 0.6)), was: c.cost });
      }
    }
    if (offers.length) return pick(offers, rng);
    return { kind: 'coins', cost: 50, min: 20, max: 150 };
  }
  const supply: MysteryOffer[] = [
    { kind: 'sticker', cost: 150, min: 'SR' },
    { kind: 'coins', cost: 50, min: 20, max: 150 },
    { kind: 'coins', cost: 50, min: 20, max: 150 },
    { kind: 'boost60', cost: 120, was: 200 },
    { kind: 'freeze2', cost: 150, was: 200 },
    { kind: 'gacha10', cost: 360, was: GACHA10_COST },
    ...PACKS.map((items): MysteryOffer => ({ kind: 'pack', items, was: packWas(items), cost: round5(packWas(items) * 0.65) })),
  ];
  return pick(supply, rng);
}

/** 填字遊戲：免費提示用完之後，每次提示的價錢 */
export const CROSSWORD_HINT_COST = 5;
