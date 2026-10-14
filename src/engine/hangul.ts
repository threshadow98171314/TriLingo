// 韓文音節的組合與基本工具

export const isHangulStr = (s: string): boolean => /^[가-힣]+$/.test(s);

/** 初聲 19 個的索引 */
export const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const CHO_RM = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];

/** 中聲 21 個的索引 */
export const JUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const JUNG_RM = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];

export function compose(cho: number, jung: number, jong = 0): string {
  return String.fromCharCode(0xac00 + (cho * 21 + jung) * 28 + jong);
}

/** 無收尾音音節的羅馬拼音（國語羅馬字表記法） */
export function syllableRm(cho: number, jung: number): string {
  return CHO_RM[cho] + JUNG_RM[jung];
}

export interface HangulTable {
  vowels: string[];
  rows: { cons: string; cells: { syl: string; rm: string }[] }[];
}

/** 반절표：14 個基本子音 × 10 個基本母音 */
export function basicTable(): HangulTable {
  const cons = [0, 2, 3, 5, 6, 7, 9, 11, 12, 14, 15, 16, 17, 18];
  const vows = [0, 2, 4, 6, 8, 12, 13, 17, 18, 20];
  return {
    vowels: vows.map((v) => JUNG[v]),
    rows: cons.map((c) => ({
      cons: CHO[c],
      cells: vows.map((v) => ({ syl: compose(c, v), rm: syllableRm(c, v) })),
    })),
  };
}
