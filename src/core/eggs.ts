// 彩蛋的觸發方式與效果：鍵盤秘技、對喵師父說悄悄話、連點計數。
// 第一次發現會給金幣並記進收藏冊（store.discoverEgg），之後再觸發只播效果。
import { fx } from './fx';
import { sfx } from './sfx';
import { discoverEgg } from './store';
import { speak } from './tts';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/** 秘密單字（鍵盤直接輸入，或對喵師父說悄悄話）→ 彩蛋 id */
const WORDS: Record<string, string> = {
  sakura: 'sakura',
  saranghae: 'saranghae',
  toeic: 'toeic',
  meow: 'meow',
  nyan: 'meow',
  daebak: 'daebak',
  uuddlrlrba: 'konami',
};

/** 悄悄話額外認得的寫法（日文、韓文、中文） */
const WHISPER_ALIASES: Record<string, string> = {
  さくら: 'sakura',
  サクラ: 'sakura',
  桜: 'sakura',
  櫻花: 'sakura',
  사랑해: 'saranghae',
  사랑해요: 'saranghae',
  대박: 'daebak',
  喵: 'meow',
  にゃー: 'meow',
  にゃん: 'meow',
  야옹: 'meow',
  '上上下下左右左右ba': 'konami',
  '↑↑↓↓←→←→ba': 'konami',
};

/** 找畫面上的元素；沒有畫面時（例如測試環境）回傳 null */
const $ = (sel: string): Element | null => (typeof document === 'undefined' ? null : document.querySelector(sel));

const EFFECTS: Record<string, () => void> = {
  konami: () => {
    sfx.secret();
    fx.rainbow(15000);
    fx.fireworks(6);
    fx.banner('秘技發動！', '↑↑↓↓←→←→BA', 'rainbow');
  },
  sakura: () => {
    sfx.sparkle();
    fx.rain('sakura', { count: 90, duration: 2600 });
    fx.banner('花見の季節', 'さくら・櫻花', 'love');
    speak('さくら', 'ja');
  },
  saranghae: () => {
    sfx.sparkle();
    fx.rain('heart', { count: 60 });
    fx.banner('사랑해요', '我愛你', 'love');
    speak('사랑해요', 'ko');
  },
  toeic: () => {
    sfx.coin();
    fx.rain('coin', { count: 70 });
    fx.banner('TOEIC 990', '滿分氣場全開', 'gold');
  },
  meow: () => {
    sfx.meow();
    fx.rain('cat', { count: 40 });
    fx.banner('にゃー・야옹・Meow', '', 'love');
  },
  daebak: () => {
    sfx.firework();
    fx.fireworks(5);
    fx.banner('대박!', '太讚了！', 'gold');
    speak('대박', 'ko');
  },
  logo: () => {
    sfx.secret();
    fx.bump($('.brand .logo'), 'fx-spin');
    fx.burstAt($('.brand .logo'), { glyphs: ['🦖'], count: 10, speed: 0.4 });
    fx.banner('嗷嗚～', '道場的秘密恐龍出現了！（頭像已解鎖）', 'gold');
  },
  dev: () => {
    sfx.secret();
    fx.banner('你現在是開發者了！', '……開玩笑的，但謝謝你這麼好奇', 'rainbow');
  },
};

/** 觸發彩蛋：播放效果，第一次發現時給獎勵 */
export function triggerEgg(id: string) {
  EFFECTS[id]?.();
  discoverEgg(id);
}

const normalize = (s: string) => s.toLowerCase().replace(/[\s!！?？.,，。~～'’-]/g, '');

/** 對喵師父說悄悄話：說中秘密單字回傳 true */
export function whisper(text: string): boolean {
  const t = normalize(text);
  const id = WORDS[t] ?? WHISPER_ALIASES[t];
  if (!id) return false;
  triggerEgg(id);
  return true;
}

// ───────── 鍵盤秘技 ─────────

let keysEnabled = true;
let seq: string[] = [];
let typed = '';

/** 上課、玩遊戲時關閉，避免和作答的按鍵衝突 */
export function setEggKeysEnabled(on: boolean) {
  keysEnabled = on;
  seq = [];
  typed = '';
}

export type EggKey = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'repeat' | 'target'>;

/** 鍵盤事件：比對秘技指令與秘密單字 */
export function eggKeyDown(e: EggKey) {
  if (!keysEnabled || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
  const target = e.target as HTMLElement | null;
  if (target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  seq = [...seq, k].slice(-KONAMI.length);
  if (seq.join(',') === KONAMI.join(',')) {
    seq = [];
    triggerEgg('konami');
    return;
  }
  if (!/^[a-z]$/.test(k)) return;
  typed = (typed + k).slice(-12);
  for (const [w, id] of Object.entries(WORDS)) {
    if (typed.endsWith(w)) {
      typed = '';
      triggerEgg(id);
      return;
    }
  }
}

export function initEggs() {
  if (typeof window !== 'undefined') window.addEventListener('keydown', eggKeyDown);
}

// ───────── 連點計數 ─────────

const taps = new Map<string, { n: number; t: number }>();

/** 在 windowMs 內連點滿 n 下回傳 true（然後重新計算） */
export function tapCount(key: string, n: number, windowMs = 2000): boolean {
  const now = Date.now();
  const c = taps.get(key);
  const next = c && now - c.t < windowMs ? c.n + 1 : 1;
  taps.set(key, { n: next >= n ? 0 : next, t: now });
  return next >= n;
}
