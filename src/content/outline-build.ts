// 由全部題目產生 src/content/gen/ 裡的檔案：
// - outline-*.json：大綱（每關有哪些單元、幾課、幾個字），隨主程式載入
// - more/<關卡>.<第幾包>.json：補充例句表（*-more.ts）依「包」拆開，載入那一包題目時才下載
// - wordle-*.json：猜詞的每日候選字
// 只給工具（scripts/outline.mjs）和測試用，App 不會引用。
import { LANGS, type LangId } from '../core/types';
import { isVocab } from '../engine/exercises';
import { wordlePool } from '../engine/wordle';
import { COURSES, PART_UNITS } from './all';
import { moreTable } from './dsl';
import { EN_MORE } from './en-more';
import { JA_MORE } from './ja-more';
import { KO_MORE } from './ko-more';
import { encodeOutline, formatOutline } from './outline';

const MORE_TEXT: Record<LangId, string> = { en: EN_MORE, ja: JA_MORE, ko: KO_MORE };

/** 猜詞的每日題目候選字：整個課程裡長度剛好的字，依課程順序（每日題目用日期挑其中一個，順序不能變） */
export function wordleIds(lang: LangId): string[] {
  const items = COURSES[lang].stages.flatMap((st) => st.units.flatMap((u) => u.items)).filter(isVocab);
  return wordlePool(items, lang).map((i) => i.id);
}

/**
 * 補充例句表依「包」拆開：每一包只放那一包的單字、短句用得到的（同一個字出現在好幾包就每一包都放）。
 * 回傳「關卡 id.第幾包」→ 表。
 */
export function moreByPart(lang: LangId): Record<string, Record<string, string[]>> {
  const table = moreTable(MORE_TEXT[lang]);
  const out: Record<string, Record<string, string[]>> = {};
  for (const st of COURSES[lang].stages) {
    (PART_UNITS[st.id] ?? []).forEach((units, part) => {
      const hit: Record<string, string[]> = {};
      for (const u of units)
        for (const it of u.items) {
          if (it.kind !== 'word' && it.kind !== 'phrase') continue;
          const key = lang === 'ja' ? (it.furi ?? it.w) : it.w;
          const ex = table.get(key);
          if (ex) hit[key] = ex;
        }
      if (Object.keys(hit).length) out[`${st.id}.${part}`] = hit;
    });
  }
  return out;
}

/** 一個項目一行，改了哪裡在 git 上一眼看得出來 */
const jsonLines = (entries: string[], open: string, close: string) => `${open}\n${entries.join(',\n')}\n${close}\n`;

/** 檔名（相對於 src/content/gen/）→ 內容 */
export function outlineFiles(): Record<string, string> {
  const files: Record<string, string> = {};
  for (const lang of LANGS) {
    files[`outline-${lang}.json`] = formatOutline(encodeOutline(COURSES[lang], PART_UNITS));
    files[`wordle-${lang}.json`] = jsonLines(
      wordleIds(lang).map((id) => JSON.stringify(id)),
      '[',
      ']',
    );
    for (const [key, table] of Object.entries(moreByPart(lang))) {
      files[`more/${key}.json`] = jsonLines(
        Object.entries(table).map(([k, v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`),
        '{',
        '}',
      );
    }
  }
  return files;
}
