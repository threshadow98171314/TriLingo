// 數字大考驗：韓文的兩套數字。固有語（하나、둘、셋…）用在時、살、명、개、잔…；
// 漢字語（일、이、삼…）用在분、원、층、년、월、인분、호선…。數字一律用程式換算，不手寫。
import { pick, randInt, sample, type Rng } from '../../core/rng';
import type { DrillQ } from './types';

const SINO = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

/** 一萬以下的漢字語數字（不含空格），例如 2026 → 이천이십육 */
function sinoUnder(x: number): string {
  let s = '';
  for (const [u, w] of [
    [1000, '천'],
    [100, '백'],
    [10, '십'],
  ] as const) {
    const d = Math.floor(x / u) % 10;
    if (d) s += (d === 1 ? '' : SINO[d]) + w;
  }
  return s + SINO[x % 10];
}

/** 漢字語數字。依韓文的寫法每「만」一個單位空一格：15000 → 만 오천（一萬不說 일만） */
export function sino(n: number): string {
  if (n === 0) return '영';
  const man = Math.floor(n / 10000);
  const rest = n % 10000;
  if (!man) return sinoUnder(n);
  return (man === 1 ? '' : sinoUnder(man)) + '만' + (rest ? ` ${sinoUnder(rest)}` : '');
}

const ONES = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'];
/** 接量詞時變短：한 개、두 명、세 시、네 잔 */
const ONES_C = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉'];
const TENS = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];

/** 固有語數字（1～99）。counter 為 true 時用接量詞的形（한、두、세、네、스무） */
export function native(n: number, counter = true): string {
  if (counter && n === 20) return '스무';
  return TENS[Math.floor(n / 10)] + (counter ? ONES_C : ONES)[n % 10];
}

/** 月份：6 月、10 月去掉收尾音（유월、시월） */
export function monthName(n: number): string {
  return n === 6 ? '유월' : n === 10 ? '시월' : `${sino(n)}월`;
}

const fmt = (n: number) => n.toLocaleString('en-US');
const uniq = (a: string[], right: string) => [...new Set(a)].filter((x) => x && x !== right);

const EXPLAIN = {
  time: '時刻：「시」（幾點）用固有語數字（한 시、두 시、세 시…），「분」（幾分）用漢字語數字（삼십 분）。',
  age: '年齡：「살」前面用固有語數字（스물다섯 살），20 歲是「스무 살」；正式場合會說漢字語＋세（이십오 세）。',
  native: '「명、개、잔、마리、권、장、병、시간、번（次數）、달」前面用固有語數字；1～4 和 20 接量詞時要變短：한、두、세、네、스무。',
  sino: '「층、분、원、년、일、인분、호선、번（號碼）、개월」前面用漢字語數字（일、이、삼…）。',
  month: '月份用漢字語數字＋월，但 6 月是「유월」、10 月是「시월」（去掉收尾音比較好念）。',
  price: '金額用漢字語數字。韓文是四位數一個單位：10,000 是「만」（前面不說 일），15,000 是「만 오천」，沒有「十五千」這種說法。',
  year: '年份用漢字語數字：2026 年 = 이천이십육 년。',
  number: '「번」當「幾號」（出口、號碼）時用漢字語：일 번 출구；當「幾次」時用固有語：한 번、두 번。',
};

/** 固有語＋量詞（幾個、幾位、幾杯…） */
const NATIVE_COUNTERS: [string, string, string][] = [
  ['명', '👥', '人數'],
  ['개', '🍎', '東西的個數'],
  ['잔', '☕', '杯數'],
  ['마리', '🐱', '動物的隻數'],
  ['권', '📚', '書的本數'],
  ['장', '📄', '紙、票的張數'],
  ['병', '🍾', '瓶數'],
  ['시간', '⏳', '幾個小時（時間長度）'],
  ['번', '🔁', '次數（幾次）'],
  ['달', '🗓️', '幾個月（時間長度）'],
];

/** 漢字語＋量詞 */
const SINO_COUNTERS: [string, string, string][] = [
  ['층', '🏢', '樓層'],
  ['분', '⏱️', '幾分鐘'],
  ['인분', '🍖', '幾人份（點餐）'],
  ['호선', '🚇', '地鐵幾號線'],
  ['개월', '🗓️', '幾個月（時間長度）'],
  ['일', '📅', '幾號；幾天'],
];

function timeQ(rng: Rng): DrillQ {
  const h = randInt(1, 12, rng);
  const m = pick([0, 5, 10, 15, 20, 25, 30, 40, 45, 50, 55], rng);
  const hs = (s: string) => `${s} 시`;
  if (!m) {
    const right = hs(native(h));
    return {
      icon: '🕒',
      prompt: `${h}시`,
      hint: '幾點？怎麼念？',
      opts: [right, ...sample(uniq([hs(sino(h)), hs(native(h, false)), hs(native(h === 12 ? 11 : h + 1))], right), 3, rng)],
      explain: EXPLAIN.time,
      say: right,
    };
  }
  const right = `${native(h)} 시 ${sino(m)} 분`;
  return {
    icon: '🕒',
    prompt: `${h}시 ${m}분`,
    hint: '幾點幾分？怎麼念？',
    opts: [right, ...sample(uniq([`${sino(h)} 시 ${sino(m)} 분`, `${native(h)} 시 ${native(m)} 분`, `${sino(h)} 시 ${native(m)} 분`], right), 3, rng)],
    explain: EXPLAIN.time,
    say: right,
  };
}

function ageQ(rng: Rng): DrillQ {
  const n = pick([randInt(2, 12, rng), randInt(15, 39, rng), randInt(40, 79, rng), 20, 21], rng);
  const right = `${native(n)} 살`;
  const t = Math.floor(n / 10);
  const o = n % 10;
  const mixA = TENS[t] + SINO[o];
  const mixB = (t ? sinoUnder(t * 10) : '') + ONES_C[o];
  return {
    icon: '🎂',
    prompt: `${n}살`,
    hint: '年齡・怎麼念？',
    opts: [right, ...sample(uniq([`${sino(n)} 살`, `${native(n, false)} 살`, `${mixA} 살`, `${mixB} 살`, `${native(n + 1)} 살`], right), 3, rng)],
    explain: EXPLAIN.age,
    say: right,
  };
}

function nativeCounterQ(rng: Rng): DrillQ {
  const [c, icon, what] = pick(NATIVE_COUNTERS, rng);
  const n = pick([1, 2, 3, 4, 20, randInt(5, 12, rng), randInt(1, 4, rng)], rng);
  const right = `${native(n)} ${c}`;
  const near = n > 1 ? native(n - 1) : native(n + 1);
  return {
    icon,
    prompt: `${n}${c}`,
    hint: `${what}・怎麼念？`,
    opts: [right, ...sample(uniq([`${sino(n)} ${c}`, `${native(n, false)} ${c}`, `${near} ${c}`, `${native(n + 1)} ${c}`], right), 3, rng)],
    explain: EXPLAIN.native,
    say: right,
  };
}

function sinoCounterQ(rng: Rng): DrillQ {
  const [c, icon, what] = pick(SINO_COUNTERS, rng);
  const n = c === '호선' ? randInt(1, 9, rng) : c === '인분' ? randInt(1, 5, rng) : c === '층' ? randInt(1, 30, rng) : c === '분' ? pick([5, 10, 15, 20, 30, 40, 45], rng) : c === '일' ? randInt(1, 31, rng) : randInt(1, 12, rng);
  const right = `${sino(n)} ${c}`;
  const pool = [`${native(n)} ${c}`, `${native(n, false)} ${c}`, `${sino(n + 1)} ${c}`, `${sino(n > 1 ? n - 1 : n + 2)} ${c}`];
  return {
    icon,
    prompt: `${n}${c}`,
    hint: `${what}・怎麼念？`,
    opts: [right, ...sample(uniq(pool, right), 3, rng)],
    explain: EXPLAIN.sino,
    say: right,
  };
}

function monthQ(rng: Rng): DrillQ {
  const n = pick([6, 10, 6, 10, randInt(1, 12, rng)], rng);
  const right = monthName(n);
  const pool = [`${sino(n)}월`, `${native(n)} 달`, `${native(n, false)}월`, monthName((n % 12) + 1)];
  return {
    icon: '🗓️',
    prompt: `${n}월`,
    hint: '月份（幾月）・怎麼念？',
    opts: [right, ...sample(uniq(pool, right), 3, rng)],
    explain: EXPLAIN.month,
    say: right,
  };
}

const PRICES = [500, 1000, 1500, 3000, 4500, 8000, 10000, 12000, 15000, 25000, 38000, 50000, 120000];

function priceQ(rng: Rng): DrillQ {
  const a = pick(PRICES, rng);
  const right = `${sino(a)} 원`;
  const pool = [`${sino(a * 10)} 원`, `${sino(a / 10)} 원`, `${sino(a + 1000)} 원`];
  // 「十五千」：用千當單位念到一萬以上，是最常見的錯誤
  if (a >= 10000 && a % 1000 === 0) pool.unshift(`${sinoUnder(a / 1000)}천 원`);
  return {
    icon: '💰',
    prompt: `${fmt(a)}원`,
    hint: '價錢・怎麼念？',
    opts: [right, ...sample(uniq(pool, right), 3, rng)],
    explain: EXPLAIN.price,
    say: right,
  };
}

function yearQ(rng: Rng): DrillQ {
  const y = randInt(1988, 2035, rng);
  const right = `${sino(y)} 년`;
  const head = sinoUnder(Math.floor(y / 100) * 100);
  const tail = y % 100;
  const pool = [`${head}${tail ? native(tail, false) : ''} 년`, `${sino(y + 10)} 년`, `${sino(y - 1)} 년`];
  return {
    icon: '📆',
    prompt: `${y}년`,
    hint: '年份・怎麼念？',
    opts: [right, ...sample(uniq(pool, right), 3, rng)],
    explain: EXPLAIN.year,
    say: right,
  };
}

function exitQ(rng: Rng): DrillQ {
  const n = randInt(1, 12, rng);
  const right = `${sino(n)} 번 출구`;
  return {
    icon: '🚇',
    prompt: `${n}번 출구`,
    hint: '地鐵幾號出口・怎麼念？',
    opts: [right, ...sample(uniq([`${native(n)} 번 출구`, `${native(n, false)} 번 출구`, `${sino(n + 1)} 번 출구`], right), 3, rng)],
    explain: EXPLAIN.number,
    say: right,
  };
}

/** 反過來：聽／看韓文說的數字，選出是多少 */
function reverseQ(rng: Rng): DrillQ {
  if (rng() < 0.5) {
    const a = pick(PRICES, rng);
    const right = `${fmt(a)}원`;
    return {
      icon: '💰',
      prompt: `${sino(a)} 원`,
      hint: '這是多少錢？',
      opts: [right, ...sample(uniq([`${fmt(a * 10)}원`, `${fmt(a / 10)}원`, `${fmt(a + 5000)}원`], right), 3, rng)],
      explain: EXPLAIN.price,
      say: `${sino(a)} 원`,
    };
  }
  const n = randInt(11, 59, rng);
  const right = `${n}살`;
  const swap = (n % 10) * 10 + Math.floor(n / 10);
  return {
    icon: '🎂',
    prompt: `${native(n)} 살`,
    hint: '這是幾歲？',
    opts: [right, ...sample(uniq([`${n + 10}살`, `${n - 10}살`, `${swap}살`, `${n + 1}살`], right), 3, rng)],
    explain: EXPLAIN.age,
    say: `${native(n)} 살`,
  };
}

const MAKERS: Record<string, ((rng: Rng) => DrillQ)[]> = {
  native: [timeQ, ageQ, nativeCounterQ, nativeCounterQ],
  sino: [sinoCounterQ, monthQ, priceQ, yearQ, exitQ],
};

export function koNumberQuestions(rng: Rng, mode: string, n: number): DrillQ[] {
  const makers = mode === 'native' ? MAKERS.native : mode === 'sino' ? MAKERS.sino : [...MAKERS.native, ...MAKERS.sino, reverseQ];
  const out: DrillQ[] = [];
  const used = new Set<string>();
  for (let guard = 0; out.length < n && guard < n * 50; guard++) {
    const q = pick(makers, rng)(rng);
    if (used.has(q.prompt) || (q.opts?.length ?? 0) < 4) continue;
    used.add(q.prompt);
    out.push(q);
  }
  return out;
}
