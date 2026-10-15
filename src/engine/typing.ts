// 打字題的批改、提示與「打法教學」。
// 日文用日文輸入法（打羅馬拼音轉成假名），韓文用韓文鍵盤（兩組式 두벌식）。

import { toHiragana } from './furigana';
import { checkJa, kanaHint, normJa, readingOf, type JaCheck } from './jaInput';

export type TypingLang = 'ja' | 'ko';

// ───────── 韓文的批改 ─────────

const KO_PUNCT = /[.,!?！？。、~…'"“”‘’()（）]/g;

/** 比對用：去掉標點與空白 */
export const normKo = (s: string): string => s.normalize('NFC').replace(KO_PUNCT, '').replace(/\s+/g, '');

/** 只有空白不一樣也算對，但 exact 為 false（提醒注意空格 띄어쓰기） */
export function checkKo(input: string, answer: string): JaCheck {
  const a = normKo(input);
  if (!a) return { ok: false, exact: false };
  const ok = a === normKo(answer);
  const spaced = (s: string) => s.normalize('NFC').replace(KO_PUNCT, '').trim().replace(/\s+/g, ' ');
  return { ok, exact: ok && spaced(input) === spaced(answer) };
}

export function checkTyped(lang: TypingLang, input: string, answer: string): JaCheck {
  return lang === 'ja' ? checkJa(input, answer) : checkKo(input, answer);
}

/** 答對但寫法不完全一樣時的提醒 */
export function inexactNote(lang: TypingLang, plain: string): string {
  return lang === 'ja' ? `標準寫法是「${plain}」，注意平假名和片假名。` : `標準寫法是「${plain}」，注意空格（띄어쓰기）。`;
}

/** 第一段提示：第一個字＋長度，例如「が・・・」「감・・・・」 */
export function firstHint(lang: TypingLang, answer: string): string {
  if (lang === 'ja') return kanaHint(answer);
  return Array.from(normKo(answer))
    .map((c, i) => (i === 0 ? c : '・'))
    .join('');
}

// ───────── 韓文字母 ─────────

const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

/** 兩組式鍵盤：字母 → 英文鍵盤上的按鍵（大寫表示按住 Shift） */
export const KO_KEYS: Record<string, string> = {
  ㅂ: 'q', ㅈ: 'w', ㄷ: 'e', ㄱ: 'r', ㅅ: 't', ㅛ: 'y', ㅕ: 'u', ㅑ: 'i', ㅐ: 'o', ㅔ: 'p',
  ㅁ: 'a', ㄴ: 's', ㅇ: 'd', ㄹ: 'f', ㅎ: 'g', ㅗ: 'h', ㅓ: 'j', ㅏ: 'k', ㅣ: 'l',
  ㅋ: 'z', ㅌ: 'x', ㅊ: 'c', ㅍ: 'v', ㅠ: 'b', ㅜ: 'n', ㅡ: 'm',
  ㅃ: 'Q', ㅉ: 'W', ㄸ: 'E', ㄲ: 'R', ㅆ: 'T', ㅒ: 'O', ㅖ: 'P',
};

/** 鍵盤上沒有的複合母音、複合收尾音：拆成兩個鍵 */
const SPLIT: Record<string, string> = {
  ㅘ: 'ㅗㅏ', ㅙ: 'ㅗㅐ', ㅚ: 'ㅗㅣ', ㅝ: 'ㅜㅓ', ㅞ: 'ㅜㅔ', ㅟ: 'ㅜㅣ', ㅢ: 'ㅡㅣ',
  ㄳ: 'ㄱㅅ', ㄵ: 'ㄴㅈ', ㄶ: 'ㄴㅎ', ㄺ: 'ㄹㄱ', ㄻ: 'ㄹㅁ', ㄼ: 'ㄹㅂ', ㄽ: 'ㄹㅅ', ㄾ: 'ㄹㅌ', ㄿ: 'ㄹㅍ', ㅀ: 'ㄹㅎ', ㅄ: 'ㅂㅅ',
};

export interface Jamo {
  cho: string;
  jung: string;
  jong: string;
}

export function decompose(syl: string): Jamo | null {
  const code = syl.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return null;
  return { cho: CHO[Math.floor(code / 588)], jung: JUNG[Math.floor((code % 588) / 28)], jong: JONG[code % 28] };
}

/** 一個字母實際要按的鍵（複合字母拆成兩個） */
const keysOf = (j: string): string[] => Array.from(SPLIT[j] ?? j);

// ───────── 打法教學 ─────────

export interface KeyStep {
  /** 這一步打出來的字 */
  text: string;
  /** 要按的鍵 */
  keys: string;
  /** 韓文：拆開的字母 */
  jamo?: string;
}

export interface KeyGuide {
  steps: KeyStep[];
  /** 這個答案裡用到的特殊打法 */
  tips: string[];
}

// 日文輸入法（羅馬拼音輸入）的打法：和發音用的羅馬拼音不同，ん、を、ぢ、づ、小字都有固定按法
const JA_MONO: Record<string, string> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', を: 'wo', ん: 'nn',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'di', づ: 'du', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ゔ: 'vu',
  ぁ: 'xa', ぃ: 'xi', ぅ: 'xu', ぇ: 'xe', ぉ: 'xo', ゃ: 'xya', ゅ: 'xyu', ょ: 'xyo', ゎ: 'xwa',
};

const JA_DI: Record<string, string> = {
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo', しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho', にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo', みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
  りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo', ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  じゃ: 'ja', じゅ: 'ju', じょ: 'jo', びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
  ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo', ぢゃ: 'dya', ぢゅ: 'dyu', ぢょ: 'dyo',
  ふぁ: 'fa', ふぃ: 'fi', ふぇ: 'fe', ふぉ: 'fo', てぃ: 'thi', でぃ: 'dhi', でゅ: 'dhu',
  とぅ: 'twu', どぅ: 'dwu', うぃ: 'wi', うぇ: 'we', うぉ: 'who', しぇ: 'she', ちぇ: 'che', じぇ: 'je',
  ゔぁ: 'va', ゔぃ: 'vi', ゔぇ: 've', ゔぉ: 'vo', いぇ: 'ye',
};

const TIP = {
  sokuon: '促音「っ」：把下一個子音按兩次，例如 がっこう＝ga kko u。',
  sokuonAlone: '單獨的小「っ」：打 xtu（或 ltu）。',
  n: '「ん」：按兩次 n（nn）最保險；後面接子音時按一次也可以。',
  dash: '片假名的長音「ー」：按鍵盤上的減號「-」。',
  long: '平假名的長音要照字打出來，例如 こう＝kou、せんせい＝sensei、おおきい＝ookii。',
  youon: '拗音（小字 ゃゅょ）：子音＋y＋母音，例如 きょう＝kyou、しゃしん＝shashin。',
  small: '單獨的小字：在前面加 x（或 l），例如 ぁ＝xa、ゃ＝xya。',
  wo: '「を」：打 wo。',
  dzu: '「ぢ」打 di、「づ」打 du。',
  foreign: '外來語的特殊組合：ティ＝thi、ディ＝dhi、ファ＝fa、ウィ＝wi、ヴァ＝va。',
  kata: '打出平假名後按空白鍵（或 F7）轉成片假名；這裡直接打平假名也算對。',
  kanji: '打出假名後按空白鍵選漢字；這裡只打假名也算對。',
};

const FOREIGN = new Set(['てぃ', 'でぃ', 'でゅ', 'とぅ', 'どぅ', 'うぃ', 'うぇ', 'うぉ', 'ゔぁ', 'ゔぃ', 'ゔぇ', 'ゔぉ', 'ふぁ', 'ふぃ', 'ふぇ', 'ふぉ']);

function jaGuide(answer: string): KeyGuide {
  const shown = readingOf(answer);
  const chars = Array.from(shown);
  const hira = chars.map((c) => toHiragana(c));
  const steps: KeyStep[] = [];
  const tips = new Set<string>();
  /** 第 i 個位置開始的一個拍（拗音兩個字） */
  const unit = (i: number): { len: number; keys: string } | null => {
    const two = (hira[i] ?? '') + (hira[i + 1] ?? '');
    if (JA_DI[two]) return { len: 2, keys: JA_DI[two] };
    const k = JA_MONO[hira[i]];
    return k ? { len: 1, keys: k } : null;
  };
  let i = 0;
  while (i < chars.length) {
    const h = hira[i];
    if (h === 'ー') {
      steps.push({ text: 'ー', keys: '-' });
      tips.add(TIP.dash);
      i++;
      continue;
    }
    if (h === 'っ') {
      const nx = unit(i + 1);
      if (nx && /^[bcdfghjklmpqrstvwxyz]/.test(nx.keys) && !nx.keys.startsWith('x')) {
        steps.push({ text: chars.slice(i, i + 1 + nx.len).join(''), keys: nx.keys[0] + nx.keys });
        tips.add(TIP.sokuon);
        if (nx.len === 2) tips.add(FOREIGN.has(hira[i + 1] + hira[i + 2]) ? TIP.foreign : TIP.youon);
        i += 1 + nx.len;
      } else {
        steps.push({ text: chars[i], keys: 'xtu' });
        tips.add(TIP.sokuonAlone);
        i++;
      }
      continue;
    }
    const u = unit(i);
    if (!u) {
      steps.push({ text: chars[i], keys: chars[i] });
      i++;
      continue;
    }
    const text = chars.slice(i, i + u.len).join('');
    steps.push({ text, keys: u.keys });
    if (u.len === 2) tips.add(FOREIGN.has(hira[i] + hira[i + 1]) ? TIP.foreign : TIP.youon);
    else if (h === 'ん') tips.add(TIP.n);
    else if (h === 'を') tips.add(TIP.wo);
    else if (h === 'ぢ' || h === 'づ') tips.add(TIP.dzu);
    else if ('ぁぃぅぇぉゃゅょゎ'.includes(h)) tips.add(TIP.small);
    // 長音：お段＋う、え段＋い、同一個母音連續
    const prev = steps.length >= 2 ? steps[steps.length - 2].keys : '';
    const v = prev.slice(-1);
    if ((h === 'う' && (v === 'o' || v === 'u')) || (h === 'い' && (v === 'e' || v === 'i')) || (u.keys === v && 'aiueo'.includes(v))) tips.add(TIP.long);
    i += u.len;
  }
  if (/[ァ-ヺ]/.test(shown)) tips.add(TIP.kata);
  if (/[㐀-鿿々]/.test(answer)) tips.add(TIP.kanji);
  return { steps, tips: [...tips] };
}

const KO_TIP = {
  base: '韓文鍵盤（兩組式 두벌식）：左手打子音、右手打母音，輸入法會自動把字母組成一個字。',
  double: '雙子音 ㄲ ㄸ ㅃ ㅆ ㅉ：按住 Shift 再按對應的子音鍵。',
  shiftV: 'ㅒ、ㅖ：按住 Shift 再按 ㅐ、ㅔ。',
  vowel: '複合母音要拆成兩個鍵，例如 ㅘ＝ㅗ＋ㅏ、ㅝ＝ㅜ＋ㅓ、ㅢ＝ㅡ＋ㅣ。',
  final: '雙收尾音要拆成兩個鍵，例如 ㄺ＝ㄹ＋ㄱ、ㄳ＝ㄱ＋ㅅ。',
  silent: '字首沒有子音的字要先打 ㅇ（d 鍵），例如 아＝ㅇ＋ㅏ。',
  space: '詞和詞之間要空一格（띄어쓰기）。',
};

function koGuide(answer: string): KeyGuide {
  const steps: KeyStep[] = [];
  const tips = new Set<string>([KO_TIP.base]);
  for (const c of Array.from(answer.normalize('NFC'))) {
    const j = decompose(c);
    if (!j) {
      if (c === ' ') tips.add(KO_TIP.space);
      continue;
    }
    const parts = [j.cho, j.jung, j.jong].filter(Boolean);
    const keys = parts.flatMap(keysOf).map((k) => KO_KEYS[k] ?? k);
    steps.push({ text: c, jamo: parts.flatMap(keysOf).join(''), keys: keys.join(' ') });
    if ('ㄲㄸㅃㅆㅉ'.includes(j.cho) || 'ㄲㅆ'.includes(j.jong || '_')) tips.add(KO_TIP.double);
    if ('ㅒㅖ'.includes(j.jung)) tips.add(KO_TIP.shiftV);
    if (SPLIT[j.jung]) tips.add(KO_TIP.vowel);
    if (j.jong && SPLIT[j.jong]) tips.add(KO_TIP.final);
    if (j.cho === 'ㅇ') tips.add(KO_TIP.silent);
  }
  return { steps, tips: [...tips] };
}

export function keyGuide(lang: TypingLang, answer: string): KeyGuide {
  return lang === 'ja' ? jaGuide(answer) : koGuide(answer);
}

// ───────── 答錯時的診斷：差在哪裡 ─────────

const SMALL_TO_BIG: Record<string, string> = { ぁ: 'あ', ぃ: 'い', ぅ: 'う', ぇ: 'え', ぉ: 'お', ゃ: 'や', ゅ: 'ゆ', ょ: 'よ', ゎ: 'わ' };
const stripDaku = (s: string) => s.normalize('NFD').replace(/[゙゚]/g, '').normalize('NFC');
const bigKana = (s: string) => s.replace(/[ぁぃぅぇぉゃゅょゎ]/g, (c) => SMALL_TO_BIG[c]);
/** 把長音拿掉：ー、お段後的う、え段後的い、同一個母音連續 */
function shortVowels(s: string): string {
  const roma = Array.from(s)
    .map((c) => (c === 'ー' ? '' : (JA_MONO[c] ?? c)))
    .join('');
  return roma.replace(/ou/g, 'o').replace(/ei/g, 'e').replace(/([aiueo])\1+/g, '$1');
}

function jaDiagnose(input: string, answer: string): string | null {
  const want = toHiragana(readingOf(answer));
  const got = toHiragana(normJa(input));
  if (!got || got === want || !/^[ぁ-ゖー]+$/.test(got)) return null;
  // 助詞：は／へ／を 要照字打
  for (const [from, to, msg] of [
    ['わ', 'は', '助詞「は」唸 wa，但要打 ha。'],
    ['え', 'へ', '助詞「へ」唸 e，但要打 he。'],
    ['お', 'を', '「を」唸 o，但要打 wo。'],
  ] as const) {
    if (got.length === want.length && Array.from(got).some((c, i) => c === from && want[i] === to && got.slice(0, i) + to + got.slice(i + 1) === want)) return msg;
  }
  const noTsu = (s: string) => s.replace(/っ/g, '');
  if (noTsu(got) === noTsu(want)) return want.split('っ').length > got.split('っ').length ? `少了促音「っ」。${TIP.sokuon}` : '多打了促音「っ」：再聽一次，注意有沒有停頓一拍。';
  const noN = (s: string) => s.replace(/ん/g, '');
  if (noN(got) === noN(want)) return want.split('ん').length > got.split('ん').length ? `少了「ん」。${TIP.n}` : '多打了「ん」，再聽一次發音。';
  if (shortVowels(got) === shortVowels(want)) return want.includes('ー') ? `長音不對。${TIP.dash}` : `長音不對。${TIP.long}`;
  if (stripDaku(got) === stripDaku(want)) return '清音、濁音不對：注意「゛」「゜」，例如 か／が、は／ば／ぱ。';
  if (bigKana(got) === bigKana(want)) return `大字小字不對。${TIP.youon}`;
  return null;
}

const KO_FAMILY = ['ㄱㅋㄲ', 'ㄷㅌㄸ', 'ㅂㅍㅃ', 'ㅅㅆ', 'ㅈㅊㅉ'];
const KO_VOWEL_PAIRS = ['ㅐㅔ', 'ㅓㅗ', 'ㅡㅜ', 'ㅕㅛ', 'ㅒㅖ', 'ㅙㅚㅞ', 'ㅝㅘ'];

function koDiagnose(input: string, answer: string): string | null {
  const got = Array.from(normKo(input));
  const want = Array.from(normKo(answer));
  if (!got.length || got.join('') === want.join('')) return null;
  if (!got.every((c) => decompose(c))) return '請用韓文鍵盤打出韓文字（不是羅馬拼音）。';
  if (got.length !== want.length) return `字數不對：答案有 ${want.length} 個字。`;
  const k = got.findIndex((c, i) => c !== want[i]);
  const g = decompose(got[k])!;
  const w = decompose(want[k])!;
  const pos = `第 ${k + 1} 個字`;
  if (g.cho !== w.cho) {
    const fam = KO_FAMILY.some((f) => f.includes(g.cho) && f.includes(w.cho));
    return fam ? `${pos}的子音不對：注意平音、激音（送氣）和硬音（雙子音）的差別。` : `${pos}的子音不對，再聽一次。`;
  }
  if (g.jung !== w.jung) {
    const pair = KO_VOWEL_PAIRS.some((p) => p.includes(g.jung) && p.includes(w.jung));
    return pair ? `${pos}的母音不對：注意聽起來很像的 ${g.jung} 和 ${w.jung}。` : `${pos}的母音不對，再聽一次。`;
  }
  return w.jong ? `${pos}的收尾音（받침）不對。` : `${pos}沒有收尾音（받침）。`;
}

/** 答錯時說明差在哪裡（看不出來就回傳 null） */
export function diagnose(lang: TypingLang, input: string, answer: string): string | null {
  return lang === 'ja' ? jaDiagnose(input, answer) : koDiagnose(input, answer);
}
