// 題目的下載單位。每個關卡的題目分成幾「包」：第一包是學習路線，後面是單字庫（大的單字庫再照檔案分包），
// 用到哪一包才下載哪一包；模擬考、觀念文章、猜詞的每日候選字也各自一包。
//
// 這裡是題目檔唯一的入口：
// - App 透過 content/index.ts 的 ensure／useContent／CourseGate 取得題目，不要自己 import 題目檔。
// - 新增內容：在既有的題目檔裡加單元就好；開新檔案時在下面對應的關卡加一行。
// - 一個關卡裡各包接起來的順序，就是單元在畫面上的順序。已上線的單元不要搬到別的關卡。
// - 改完跑 `npm run outline` 更新大綱（npm test／npm run build 會自動跑；開發伺服器開著時會自動更新）。
import type { Concept, LangId, MockExam, Unit } from '../core/types';
import { attachMore } from './dsl';

export type PartLoader = () => Promise<Unit[]>;

/** 從題目檔取出其中幾個匯出的單元陣列，依序接起來 */
const pick =
  <K extends string>(file: () => Promise<Record<K, Unit[]>>, ...names: K[]): PartLoader =>
  () =>
    file().then((m) => names.flatMap((n) => m[n]));

/** 好幾個檔案合成一包 */
const join =
  (...loads: PartLoader[]): PartLoader =>
  () =>
    Promise.all(loads.map((l) => l())).then((x) => x.flat());

const RAW: Record<string, PartLoader[]> = {
  // ───────── 英文：多益證書路線 ─────────
  'en.orange': [pick(() => import('./en-orange'), 'ORANGE_UNITS'), pick(() => import('./en-orange-bank'), 'ORANGE_BANK')],
  'en.brown': [pick(() => import('./en-brown'), 'BROWN_UNITS'), pick(() => import('./en-brown-bank'), 'BROWN_BANK')],
  'en.green': [pick(() => import('./en-green'), 'GREEN_UNITS'), pick(() => import('./en-green-bank'), 'GREEN_BANK')],
  'en.blue': [pick(() => import('./en-blue'), 'BLUE_UNITS'), pick(() => import('./en-blue-bank'), 'BLUE_BANK')],
  'en.gold': [join(pick(() => import('./en-gold'), 'GOLD_UNITS'), pick(() => import('./en-gold2'), 'GOLD_UNITS_2')), pick(() => import('./en-gold-bank'), 'GOLD_BANK')],
  'en.drill': [
    pick(() => import('./en-drill-p5a'), 'DRILL_P5A'),
    pick(() => import('./en-drill-p5b'), 'DRILL_P5B'),
    pick(() => import('./en-drill-p5c'), 'DRILL_P5C'),
    pick(() => import('./en-drill-lr'), 'DRILL_LR'),
  ],
  'en.town': [pick(() => import('./en-town'), 'TOWN_UNITS')],
  'en.travel': [pick(() => import('./en-travel'), 'EN_TRAVEL_UNITS')],
  'en.biz': [pick(() => import('./en-biz'), 'EN_BIZ_UNITS')],
  'en.life': [pick(() => import('./en-life'), 'EN_LIFE_UNITS')],

  // ───────── 日文：五十音 → N5 → … → N1 ─────────
  'ja.kana': [pick(() => import('./ja-kana'), 'KANA_UNITS')],
  'ja.n5': [pick(() => import('./ja-n5'), 'N5_UNITS'), pick(() => import('./ja-n5-bank'), 'N5_BANK')],
  'ja.n4': [pick(() => import('./ja-n4'), 'N4_UNITS'), pick(() => import('./ja-n4-bank'), 'N4_BANK')],
  'ja.n3': [
    pick(() => import('./ja-n3'), 'N3_UNITS'),
    pick(() => import('./ja-n3-bank1'), 'N3_BANK_1'),
    pick(() => import('./ja-n3-bank2'), 'N3_BANK_2'),
    pick(() => import('./ja-n3-bank3'), 'N3_BANK_3'),
    pick(() => import('./ja-n3-bank4'), 'N3_BANK_4'),
    pick(() => import('./ja-n3-bank5'), 'N3_BANK_5'),
    pick(() => import('./ja-n3-bank6'), 'N3_BANK_6'),
    pick(() => import('./ja-n3-bank7'), 'N3_BANK_7'),
    pick(() => import('./ja-n3-bank8'), 'N3_BANK_8'),
    pick(() => import('./ja-n3-bank9'), 'N3_BANK_9'),
    pick(() => import('./ja-n3-bank10'), 'N3_BANK_10'),
  ],
  'ja.n2': [
    pick(() => import('./ja-n2'), 'N2_UNITS'),
    pick(() => import('./ja-n2-bank1'), 'N2_BANK_1'),
    pick(() => import('./ja-n2-bank2'), 'N2_BANK_2'),
    pick(() => import('./ja-n2-bank3'), 'N2_BANK_3'),
    pick(() => import('./ja-n2-bank4'), 'N2_BANK_4'),
    pick(() => import('./ja-n2-bank5'), 'N2_BANK_5'),
    pick(() => import('./ja-n2-bank6'), 'N2_BANK_6'),
    pick(() => import('./ja-n2-bank7'), 'N2_BANK_7'),
    pick(() => import('./ja-n2-bank8'), 'N2_BANK_8'),
    pick(() => import('./ja-n2-bank9'), 'N2_BANK_9'),
    pick(() => import('./ja-n2-bank10'), 'N2_BANK_10'),
    pick(() => import('./ja-n2-bank11'), 'N2_BANK_11'),
    pick(() => import('./ja-n2-bank12'), 'N2_BANK_12'),
  ],
  'ja.n1': [join(pick(() => import('./ja-n1'), 'N1_UNITS'), pick(() => import('./ja-n1-read'), 'N1_RL')), pick(() => import('./ja-n1'), 'N1_BANK')],
  'ja.town': [pick(() => import('./ja-town'), 'TOWN_UNITS')],
  'ja.travel': [join(pick(() => import('./ja-tracks'), 'JA_TRAVEL_UNITS'), pick(() => import('./ja-travel2'), 'JA_TRAVEL_MORE'))],
  'ja.biz': [pick(() => import('./ja-biz'), 'JA_BIZ_UNITS')],
  'ja.life': [pick(() => import('./ja-life'), 'JA_LIFE_UNITS')],
  'ja.anime': [join(pick(() => import('./ja-tracks'), 'JA_ANIME_UNITS'), pick(() => import('./ja-anime'), 'JA_ANIME_MORE'))],

  // ───────── 韓文：한글 → 初級 → 中級 → 高級 ─────────
  'ko.hangul': [pick(() => import('./ko-hangul'), 'HANGUL_UNITS')],
  'ko.k1': [pick(() => import('./ko-k1'), 'K1_UNITS'), pick(() => import('./ko-k1-bank'), 'K1_BANK')],
  'ko.k2': [pick(() => import('./ko-k2'), 'K2_UNITS'), pick(() => import('./ko-k2-bank'), 'K2_BANK')],
  'ko.k3': [pick(() => import('./ko-k3'), 'K3_UNITS'), pick(() => import('./ko-k3-bank'), 'K3_BANK')],
  'ko.k4': [pick(() => import('./ko-k4'), 'K4_UNITS'), pick(() => import('./ko-k4-bank'), 'K4_BANK')],
  'ko.k5': [join(pick(() => import('./ko-k5'), 'K5_UNITS'), pick(() => import('./ko-k5-rl'), 'K5_RL')), pick(() => import('./ko-k5-bank'), 'K5_BANK')],
  'ko.k6': [pick(() => import('./ko-k6'), 'K6_UNITS'), pick(() => import('./ko-k6-bank'), 'K6_BANK')],
  'ko.town': [pick(() => import('./ko-town'), 'TOWN_UNITS')],
  'ko.travel': [join(pick(() => import('./ko-tracks'), 'KO_TRAVEL_UNITS'), pick(() => import('./ko-travel2'), 'KO_TRAVEL_MORE'))],
  'ko.biz': [pick(() => import('./ko-biz'), 'KO_BIZ_UNITS')],
  'ko.life': [pick(() => import('./ko-life'), 'KO_LIFE_UNITS')],
  'ko.drama': [join(pick(() => import('./ko-tracks'), 'KO_DRAMA_UNITS'), pick(() => import('./ko-drama'), 'KO_DRAMA_MORE'))],
};

// 學習路線單字的補充例句（答對時隨機挑一句顯示）：npm run outline 把 *-more.ts 的表依「包」拆好放在 gen/more/，
// 下載一包題目時順便下載那一包用得到的表、接到同一個字後面（同一個單元只接一次）
const MORE = import.meta.glob<Record<string, string[]>>('./gen/more/*.json', { import: 'default' });
const attached = new WeakSet<Unit>();

function withMore(stageId: string, part: number, load: PartLoader): PartLoader {
  const table = MORE[`./gen/more/${stageId}.${part}.json`];
  if (!table) return load;
  return () =>
    Promise.all([load(), table()]).then(([units, more]) => {
      const fresh = units.filter((u) => !attached.has(u));
      for (const u of fresh) attached.add(u);
      attachMore([fresh], new Map(Object.entries(more)), stageId.startsWith('ja.'));
      return units;
    });
}

/** 各關卡的題目（關卡名稱、說明、預定大綱在 meta.ts）。沒列在這裡的關卡就是「準備中」 */
export const PARTS: Record<string, PartLoader[]> = Object.fromEntries(Object.entries(RAW).map(([id, list]) => [id, list.map((load, part) => withMore(id, part, load))]));

/** 實戰模擬考 */
export const MOCKS: Record<LangId, () => Promise<MockExam[]>> = {
  en: () => import('./en-mock').then((m) => m.EN_MOCKS),
  ja: () => import('./ja-mock').then((m) => m.JA_MOCKS),
  ko: () => import('./ko-mock').then((m) => m.KO_MOCKS),
};

/** 觀念講堂 */
export const CONCEPTS: Record<LangId, () => Promise<Concept[]>> = {
  en: () => import('./en-concepts').then((m) => m.CONCEPTS),
  ja: () => import('./ja-concepts').then((m) => m.CONCEPTS),
  ko: () => import('./ko-concepts').then((m) => m.CONCEPTS),
};

/** 猜詞的每日題目候選字（整個課程裡長度剛好的字，依課程順序；npm run outline 產生） */
export const WORDLE: Record<LangId, () => Promise<string[]>> = {
  en: () => import('./gen/wordle-en.json').then((m) => m.default),
  ja: () => import('./gen/wordle-ja.json').then((m) => m.default),
  ko: () => import('./gen/wordle-ko.json').then((m) => m.default),
};
