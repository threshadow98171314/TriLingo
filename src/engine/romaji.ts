import { toHiragana } from './furigana';

const MONO: Record<string, string> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', を: 'o', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ゔ: 'vu', ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o',
};

const DI: Record<string, string> = {
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo', しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho', にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo', みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
  りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo', ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  じゃ: 'ja', じゅ: 'ju', じょ: 'jo', びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
  ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  ふぁ: 'fa', ふぃ: 'fi', ふぇ: 'fe', ふぉ: 'fo', てぃ: 'ti', でぃ: 'di',
  うぃ: 'wi', うぇ: 'we', うぉ: 'wo', しぇ: 'she', ちぇ: 'che', じぇ: 'je',
};

/** 假名 → 羅馬拼音（ワープロ式：がっこう → gakkou），給初學者當發音輔助 */
export function kanaToRomaji(kana: string): string {
  const s = toHiragana(kana);
  let out = '';
  let geminate = false;
  let i = 0;
  while (i < s.length) {
    let r: string | undefined = DI[s.slice(i, i + 2)];
    if (r) {
      i += 2;
    } else {
      const c = s[i++];
      if (c === 'っ') {
        geminate = true;
        continue;
      }
      if (c === 'ー') {
        const last = out[out.length - 1];
        if (last && 'aiueo'.includes(last)) out += last;
        continue;
      }
      r = MONO[c] ?? c;
      if (c === 'ん' && i < s.length && 'あいうえおやゆよ'.includes(s[i])) r = "n'";
    }
    if (geminate && /^[a-z]/.test(r)) r = (r.startsWith('ch') ? 't' : r[0]) + r;
    geminate = false;
    out += r;
  }
  return out;
}
