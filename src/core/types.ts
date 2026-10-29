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
  /** 更多例句：答對時會從 ex 和這些例句裡隨機挑一句顯示 */
  more?: Example[];
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
  /** 聽到的內容。多益 Part 3／4 的對話稿一行一句，用「M: 」「F: 」標出說話者 */
  q: string;
  opts: string[];
  a: number;
  t?: string;
  explain?: string;
  /** 畫面上顯示的問題（聽一段對話或獨白回答問題時才有） */
  ask?: string;
  /** 閱讀題（多益 Part 7）：q 是文章，直接印出來、不朗讀 */
  read?: boolean;
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
  /** 單字庫的分組名稱。有這個欄位的單元不排在學習路線上、不會上鎖，可以隨時挑一組來學 */
  bank?: string;
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
  /** town：情境小鎮，用地圖顯示地點，地點不上鎖 */
  style: 'cert' | 'level' | 'track' | 'town';
  icon?: string;
  units: Unit[];
  /** 尚未製作內容的關卡：預定的單元大綱 */
  planned: string[];
  /** 單元不用依序解鎖（情境小鎮、題庫），想從哪個開始都可以 */
  open?: boolean;
  /** 在哪個版本新增了內容（例如 '0.10'）：這個版本裡打開之前會顯示 NEW */
  fresh?: string;
}

// ───────── 觀念講堂 ─────────

/** 觀念文章的一節 */
export interface ConceptSection {
  /** 小標題 */
  h: string;
  /** 段落（日文可以用「漢字[よみ]」標振假名） */
  body: string[];
  examples?: Example[];
  /** 對照表：第一列是表頭 */
  table?: string[][];
  /** 解題技巧或易錯提醒 */
  tip?: string;
}

/** 一篇觀念文章，最後有小測驗 */
export interface Concept {
  id: string;
  /** 分類，例如「解題技巧」「文法觀念」 */
  cat: string;
  icon: string;
  title: string;
  summary: string;
  /** 建議搭配的關卡（例如「N4」「綠色」） */
  level?: string;
  sections: ConceptSection[];
  quiz: ClozeItem[];
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
  /** 實戰模擬考 */
  mocks: MockExam[];
  /** 觀念講堂 */
  concepts: Concept[];
}

/** 關卡的基本資料（不含題目）：隨主程式載入，畫面不用等題目下載完就能顯示 */
export type StageMeta = Omit<Stage, 'units'>;

/** 語言的基本資料：名稱、顏色、目標、關卡大綱 */
export interface CourseMeta extends Omit<Course, 'stages' | 'mocks' | 'concepts'> {
  stages: StageMeta[];
}

// ───────── 實戰模擬考 ─────────

/** 模擬考的一題。opts 的第一個是正確答案（出題時會洗牌） */
export interface MockQ {
  id: string;
  /** 題目：___ 是空格、{ } 內畫底線、日文用「漢字[よみ]」標註讀音；聽力題可以沒有題目文字 */
  q?: string;
  opts: string[];
  /** 解析（交卷後顯示） */
  explain?: string;
  /** 題目翻譯（交卷後顯示） */
  t?: string;
}

/** 題組：幾題共用一篇文章或一段聽力 */
export interface MockGroup {
  id: string;
  /** 閱讀文章，換行用 \n；日文可以標振假名 */
  passage?: string;
  /** 聽力稿，一行一句，用「M:」「F:」開頭標示男聲、女聲。作答時只播放，交卷後才顯示 */
  script?: string[];
  /** 文章或聽力稿的翻譯（交卷後顯示） */
  zh?: string;
  qs: MockQ[];
}

export interface MockSection {
  id: string;
  title: string;
  /** 題目說明（仿照正式考試的指示） */
  intro: string;
  listening?: boolean;
  /** 每次從題組裡隨機抽幾組（不填就全部出） */
  pick?: number;
  groups: MockGroup[];
  /** 由課程內容自動出題（例如日檢的漢字讀音題），和 groups 一起出 */
  gen?: { kind: 'kanji-reading'; stages: string[]; count: number };
}

/** 依答對率判斷的程度 */
export interface MockLevel {
  min: number;
  label: string;
  desc: string;
}

export interface MockExam {
  id: string;
  title: string;
  subtitle: string;
  /** 和正式考試的對照說明 */
  about: string;
  /** 建議先完成的關卡（只是提示，不會鎖住） */
  after?: string;
  minutes: number;
  /** 及格的答對率（0–1） */
  pass: number;
  /** 程度判斷，答對率由高到低排列 */
  levels: MockLevel[];
  sections: MockSection[];
}
