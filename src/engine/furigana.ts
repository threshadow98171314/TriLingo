// 日文內容一律用「漢字[よみ]」標註振假名，例如：学校[がっこう]へ行[い]きます。
// 一段連續的漢字對應一個中括號；由這一個字串就能導出純文字、假名讀音與 <ruby> 顯示。

const RE = /([㐀-鿿々]+)\[([^\]]+)\]/g;

/** 去掉標註：学校[がっこう] → 学校 */
export const furiPlain = (s: string): string => s.replace(RE, '$1');

/** 換成假名：学校[がっこう] → がっこう */
export const furiKana = (s: string): string => s.replace(RE, '$2');

export interface FuriSeg {
  t: string;
  r?: string;
}

export function furiSegs(s: string): FuriSeg[] {
  const out: FuriSeg[] = [];
  let last = 0;
  for (const m of s.matchAll(RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: s.slice(last, i) });
    out.push({ t: m[1], r: m[2] });
    last = i + m[0].length;
  }
  if (last < s.length) out.push({ t: s.slice(last) });
  return out;
}

export const hasKanji = (s: string): boolean => /[㐀-鿿々]/.test(s);

/** 只含平假名、片假名與長音符號 */
export const isKanaStr = (s: string): boolean => /^[ぁ-ゖァ-ヺー]+$/.test(s);

export const toHiragana = (s: string): string =>
  s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

export const toKatakana = (s: string): string =>
  s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));

// ───────── 易混淆讀音（漢字讀音題的干擾選項） ─────────

const DAKU_PAIRS = 'かが きぎ くぐ けげ こご さざ しじ すず せぜ そぞ ただ ちぢ つづ てで とど はば ひび ふぶ へべ ほぼ';
const DAKU: Record<string, string> = {};
for (const p of DAKU_PAIRS.split(' ')) {
  DAKU[p[0]] = p[1];
  DAKU[p[1]] = p[0];
}

const O_U_ROW = 'おこそとのほもよろごぞどぼぽうくすつぬふむゆるぐずづぶぷょゅ';
const STOP_ROW = 'かきくけこさしすせそたちつてとぱぴぷぺぽ';

/**
 * 產生「差一點點」的讀音：促音有無、長音有無、清濁音互換。
 * 例如 がっこう → がこう／がっこ／かっこう，和日檢的漢字讀音題同一種陷阱。
 */
export function confusableReadings(reading: string): string[] {
  if (!/^[ぁ-ゖ]+$/.test(reading)) return [];
  const out = new Set<string>();
  const chars = Array.from(reading);

  // 促音
  const tsu = reading.indexOf('っ');
  if (tsu >= 0) out.add(reading.slice(0, tsu) + reading.slice(tsu + 1));
  else if (chars.length >= 2 && STOP_ROW.includes(chars[chars.length - 1])) {
    out.add(chars.slice(0, -1).join('') + 'っ' + chars[chars.length - 1]);
  } else if (chars.length >= 3 && STOP_ROW.includes(chars[1])) {
    out.add(chars[0] + 'っ' + chars.slice(1).join(''));
  }

  // 長音
  let dropped = false;
  for (let i = 1; i < chars.length; i++) {
    if (chars[i] === 'う' && O_U_ROW.includes(chars[i - 1])) {
      out.add(chars.slice(0, i).join('') + chars.slice(i + 1).join(''));
      dropped = true;
      break;
    }
  }
  if (!dropped) {
    for (let i = chars.length - 1; i >= 0; i--) {
      if (O_U_ROW.includes(chars[i]) && chars[i] !== 'う') {
        out.add(chars.slice(0, i + 1).join('') + 'う' + chars.slice(i + 1).join(''));
        break;
      }
    }
  }

  // 清濁音
  if (DAKU[chars[0]]) out.add(DAKU[chars[0]] + chars.slice(1).join(''));
  const li = chars.length - 1;
  if (li > 0 && DAKU[chars[li]]) out.add(chars.slice(0, li).join('') + DAKU[chars[li]]);

  out.delete(reading);
  return [...out];
}
