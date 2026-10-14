// 韓文第 0 關：한글（韓文字母）。
// 一律以「完整音節」教學（母音前面加不發音的 ㅇ、子音搭配 ㅏ），
// 這樣看到的字、聽到的音、要輸入的拼音三者一致。
import type { Unit } from '../core/types';
import { ch, charUnit, ko, vocabUnit, type CharRow } from './dsl';

const row = (label: string, ...cells: ReturnType<typeof ch>[]): CharRow => ({ label, cells });

const vowels = charUnit('ko.hangul.vowel', '아', '基本母音', '10 個基本母音', [
  row(
    'ㅏ ㅑ ㅓ ㅕ ㅗ',
    ch('아 a', { note: '母音 ㅏ。母音單獨成字時，前面要加上不發音的 ㅇ。' }),
    ch('야 ya', { note: '母音 ㅑ：ㅏ 多一畫，前面多一個 y 的音。' }),
    ch('어 eo', { note: '母音 ㅓ：嘴巴張開，發偏「ㄛ」的音。' }),
    ch('여 yeo', { note: '母音 ㅕ：ㅓ 多一畫，前面多一個 y 的音。' }),
    ch('오 o', { note: '母音 ㅗ：嘴唇嘟成圓形。' }),
  ),
  row(
    'ㅛ ㅜ ㅠ ㅡ ㅣ',
    ch('요 yo', { note: '母音 ㅛ：ㅗ 多一畫，前面多一個 y 的音。' }),
    ch('우 u', { note: '母音 ㅜ：嘴唇嘟圓往前。' }),
    ch('유 yu', { note: '母音 ㅠ：ㅜ 多一畫，前面多一個 y 的音。' }),
    ch('으 eu', { note: '母音 ㅡ：嘴角往兩邊拉開，發扁扁的「ㄜ」。' }),
    ch('이 i', { note: '母音 ㅣ。' }),
  ),
]);

const consonants = charUnit('ko.hangul.cons', '가', '基本子音', '子音 ＋ 母音 ㅏ', [
  row(
    'ㄱ ㄴ ㄷ ㄹ ㅁ',
    ch('가 ga', { note: '子音 ㄱ（g／k）＋ 母音 ㅏ。' }),
    ch('나 na', { note: '子音 ㄴ（n）＋ 母音 ㅏ。' }),
    ch('다 da', { note: '子音 ㄷ（d／t）＋ 母音 ㅏ。' }),
    ch('라 ra|la', { note: '子音 ㄹ（r／l）＋ 母音 ㅏ。介於 r 和 l 之間的彈舌音。' }),
    ch('마 ma', { note: '子音 ㅁ（m）＋ 母音 ㅏ。' }),
  ),
  row(
    'ㅂ ㅅ ㅈ ㅊ ㅋ',
    ch('바 ba', { note: '子音 ㅂ（b／p）＋ 母音 ㅏ。' }),
    ch('사 sa', { note: '子音 ㅅ（s）＋ 母音 ㅏ。' }),
    ch('자 ja', { note: '子音 ㅈ（j）＋ 母音 ㅏ。' }),
    ch('차 cha', { note: '子音 ㅊ（ch）＋ 母音 ㅏ。ㅈ 加一點，變成送氣音。' }),
    ch('카 ka', { note: '子音 ㅋ（k）＋ 母音 ㅏ。ㄱ 加一橫，變成送氣音。' }),
  ),
  row(
    'ㅌ ㅍ ㅎ',
    ch('타 ta', { note: '子音 ㅌ（t）＋ 母音 ㅏ。ㄷ 加一橫，變成送氣音。' }),
    ch('파 pa', { note: '子音 ㅍ（p）＋ 母音 ㅏ。ㅂ 的送氣音。' }),
    ch('하 ha', { note: '子音 ㅎ（h）＋ 母音 ㅏ。' }),
  ),
]);

const combos = charUnit('ko.hangul.combo', '고', '音節組合', '子音 × 母音 拼讀練習', [
  row('拼讀 ①', ch('고 go'), ch('누 nu'), ch('디 di'), ch('러 reo'), ch('모 mo')),
  row('拼讀 ②', ch('부 bu'), ch('서 seo'), ch('지 ji'), ch('초 cho'), ch('키 ki')),
  row('拼讀 ③', ch('투 tu'), ch('피 pi'), ch('호 ho'), ch('그 geu'), ch('려 ryeo')),
]);

// 現代韓語裡這幾組幾乎同音，聽力題不互相當干擾選項
const compound = charUnit('ko.hangul.vowel2', '와', '複合母音', '11 個複合母音', [
  row(
    'ㅐ ㅔ ㅒ ㅖ',
    ch('애 ae', { sound: 'E', note: '母音 ㅐ（ㅏ＋ㅣ）。現代發音和 ㅔ 幾乎一樣。' }),
    ch('에 e', { sound: 'E', note: '母音 ㅔ（ㅓ＋ㅣ）。' }),
    ch('얘 yae', { sound: 'YE', note: '母音 ㅒ。現代發音和 ㅖ 幾乎一樣。' }),
    ch('예 ye', { sound: 'YE', note: '母音 ㅖ。' }),
  ),
  row(
    'ㅘ ㅙ ㅚ',
    ch('와 wa', { note: '母音 ㅘ（ㅗ＋ㅏ）。' }),
    ch('왜 wae', { sound: 'WE', note: '母音 ㅙ（ㅗ＋ㅐ）。' }),
    ch('외 oe', { sound: 'WE', note: '母音 ㅚ（ㅗ＋ㅣ）。實際發音接近 we。' }),
  ),
  row(
    'ㅝ ㅞ ㅟ ㅢ',
    ch('워 wo', { note: '母音 ㅝ（ㅜ＋ㅓ）。' }),
    ch('웨 we', { sound: 'WE', note: '母音 ㅞ（ㅜ＋ㅔ）。' }),
    ch('위 wi', { note: '母音 ㅟ（ㅜ＋ㅣ）。' }),
    ch('의 ui', { note: '母音 ㅢ（ㅡ＋ㅣ）。' }),
  ),
]);

const tense = charUnit('ko.hangul.tense', '까', '雙子音（硬音）', '喉嚨用力、不送氣', [
  row(
    'ㄲ ㄸ ㅃ ㅆ ㅉ',
    ch('까 kka', { note: '雙子音 ㄲ：比 ㄱ 更緊、更用力。' }),
    ch('따 tta', { note: '雙子音 ㄸ：比 ㄷ 更緊、更用力。' }),
    ch('빠 ppa', { note: '雙子音 ㅃ：比 ㅂ 更緊、更用力。' }),
    ch('싸 ssa', { note: '雙子音 ㅆ：比 ㅅ 更緊、更用力。' }),
    ch('짜 jja', { note: '雙子音 ㅉ：比 ㅈ 更緊、更用力。' }),
  ),
]);

const batchim = charUnit('ko.hangul.batchim', '강', '收尾音（받침）', '音節下方的子音', [
  row(
    '收尾音 ①',
    ch('각 gak', { note: '收尾音 ㄱ：短促的 k，氣不要送出來。' }),
    ch('간 gan', { note: '收尾音 ㄴ：n。' }),
    ch('갇 gat', { note: '收尾音 ㄷ：短促的 t。ㅅ、ㅈ、ㅊ、ㅌ、ㅎ 當收尾音時也發這個音。' }),
    ch('갈 gal', { note: '收尾音 ㄹ：l，舌尖頂住上顎。' }),
  ),
  row(
    '收尾音 ②',
    ch('감 gam', { note: '收尾音 ㅁ：m，嘴唇閉起來。' }),
    ch('갑 gap', { note: '收尾音 ㅂ：短促的 p，嘴唇閉起來。' }),
    ch('강 gang', { note: '收尾音 ㅇ：ng。ㅇ 在字首不發音，在收尾才發 ng。' }),
  ),
  row('讀讀看', ch('한 han'), ch('국 guk'), ch('밥 bap'), ch('물 mul'), ch('김 gim')),
]);

const loanwords = vocabUnit('ko.hangul.read', '📺', '讀讀看：外來語', '唸出來就猜得到意思', [
  ko('버스', 'beoseu', '公車'),
  ko('택시', 'taeksi', '計程車'),
  ko('카메라', 'kamera', '相機'),
  ko('아이스크림', 'aiseukeurim', '冰淇淋'),
  ko('햄버거', 'haembeogeo', '漢堡'),
  ko('피자', 'pija', '披薩'),
  ko('바나나', 'banana', '香蕉'),
  ko('주스', 'juseu', '果汁'),
  ko('컴퓨터', 'keompyuteo', '電腦'),
  ko('텔레비전', 'tellebijeon', '電視'),
]);

export const HANGUL_UNITS: Unit[] = [vowels, consonants, combos, compound, tense, batchim, loanwords];
