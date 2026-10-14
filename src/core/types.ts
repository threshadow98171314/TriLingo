// 課程內容的資料模型。新增關卡時只需要產生符合這些型別的資料。

export type LangId = 'en' | 'ja' | 'ko';
export const LANGS: LangId[] = ['en', 'ja', 'ko'];

export interface Example {
  s: string;
  /** 日文：含振假名標註的原句，例如 学校[がっこう]へ行[い]きます。 */
  furi?: string;
  t: string;
}

/** 字母（假名／韓文字）、單字、短句 */
export interface VocabItem {
  id: string;
  kind: 'char' | 'word' | 'phrase';
  /** 原文（日文為不含振假名標註的純文字） */
  w: string;
  /** 日文：含振假名標註的原文，例如 学校[がっこう] */
  furi?: string;
  /** 日文：假名讀音 */
  r?: string;
  /** 羅馬拼音 */
  rm?: string;
  /** 羅馬拼音輸入題可接受的其他寫法 */
  alt?: string[];
  /** 語音朗讀用的文字（預設依語言決定） */
  say?: string;
  /** 聽起來一樣的項目共用同一個 sound，聽力題不會互相當干擾選項 */
  sound?: string;
  /** 中文意思（字母類為羅馬拼音） */
  m: string;
  pos?: string;
  note?: string;
  ex?: Example;
  /** 短句的分詞結果，用於句子重組題 */
  tokens?: string[];
}

export interface SentenceItem {
  id: string;
  kind: 'sentence';
  s: string;
  furi?: string;
  tokens: string[];
  t: string;
  note?: string;
}

/** 克漏字選擇題，題目以 ___ 表示空格 */
export interface ClozeItem {
  id: string;
  kind: 'cloze';
  q: string;
  opts: string[];
  a: number;
  t?: string;
  explain?: string;
}

/** 聽問題選回應（多益 Part 2 形式） */
export interface QaItem {
  id: string;
  kind: 'qa';
  q: string;
  opts: string[];
  a: number;
  t?: string;
  explain?: string;
}

export type Item = VocabItem | SentenceItem | ClozeItem | QaItem;

export interface GrammarNote {
  title: string;
  body: string[];
  examples?: Example[];
}

export interface Lesson {
  id: string;
  title: string;
  itemIds: string[];
  notes?: GrammarNote[];
  /** 單元測驗（通過才算完成單元，也可用來跳級） */
  boss?: boolean;
}

export type UnitKind = 'chars' | 'vocab' | 'phrases' | 'grammar' | 'listening';

export interface ChartRow {
  label: string;
  /** item id 或 null（空格） */
  cells: (string | null)[];
}

export interface Unit {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  kind: UnitKind;
  items: Item[];
  lessons: Lesson[];
  chart?: ChartRow[];
}

export interface Stage {
  id: string;
  /** 短標籤，例如 N5、橘色 */
  short: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  group: 'main' | 'track';
  style: 'cert' | 'level' | 'track';
  icon?: string;
  units: Unit[];
  /** 尚未製作內容的關卡：預定的單元大綱 */
  planned: string[];
}

export interface Course {
  id: LangId;
  name: string;
  native: string;
  glyph: string;
  color: string;
  goal: string;
  goals: string[];
  pathLabel: string;
  trackLabel?: string;
  stages: Stage[];
}
