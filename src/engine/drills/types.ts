// 語言專屬特訓（遊樂場的「日文專屬」「韓文專屬」「英文專屬」）共用的題目格式。
// 每個特訓只負責出題（純函式，可以傳入亂數方便測試）；畫面與計分在 pages/Drill.tsx。
import type { Rng } from '../../core/rng';
import type { LangId } from '../../core/types';

export interface DrillQ {
  /** 題目本身（日文可以用「漢字[よみ]」標讀音） */
  prompt: string;
  /** 題目前面的小圖示 */
  icon?: string;
  /** 題目下面的提示（例如「て形」、中文意思） */
  hint?: string;
  /** 選擇題：第一個是正確答案（畫面會洗牌）。沒有選項就是打字題 */
  opts?: string[];
  /** 打字題的正確答案（可以有好幾種寫法） */
  answers?: string[];
  /** 作答後的說明（規則、例外） */
  explain?: string;
  /** 朗讀的內容：打字題在作答前唸（拼字蜜蜂），選擇題在作答後唸正確答案 */
  say?: string;
  /** 對應的學習項目：答對時記進熟練度 */
  itemId?: string;
}

/** 特訓可以選的範圍（例如活用道場的「基本」「進階」） */
export interface DrillMode {
  id: string;
  label: string;
  desc: string;
}

/** 出題時用得到的資料：學過的字（拼字蜜蜂用） */
export interface DrillCtx {
  rng: Rng;
  /** 這個語言學過的單字（原文、意思、項目 id） */
  learned: { id: string; w: string; m: string; pos?: string }[];
}

export interface DrillDef {
  id: DrillId;
  lang: LangId;
  icon: string;
  title: string;
  /** 遊樂場卡片上的說明 */
  desc: string;
  /** 開始前的規則說明 */
  rules: string[];
  modes?: DrillMode[];
  /** 一場幾題 */
  count: number;
  /** 解鎖需要學會幾個字（不含字母） */
  need: number;
  /** 需要語音（拼字蜜蜂） */
  needsVoice?: boolean;
  make: (ctx: DrillCtx, mode: string) => DrillQ[];
}

export type DrillId = 'conj' | 'counter' | 'numbers' | 'koconj' | 'irregular' | 'spell';
