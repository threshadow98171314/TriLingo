// 「今天」頁「這次更新了什麼」卡片與關卡的 NEW 標籤。每次發布新版本時更新這裡（版本只看前兩段，例如 0.10）。
// 看過的會記在存檔的 guide（news-版本、new:關卡@版本），跟著雲端同步。
import type { LangId } from '../core/types';

/** 目前版本的前兩段，例如 0.10.0 → 0.10 */
export const APP_MINOR = __APP_VERSION__.split('.').slice(0, 2).join('.');

export interface NewsItem {
  /** 有語言的用語言徽章，沒有的用 icon */
  lang?: LangId;
  icon?: string;
  text: string;
  /** 「去看看」連到哪裡（路由路徑；{lang} 會換成目前的語言） */
  to?: string;
  cta?: string;
}

export const NEWS: { version: string; items: NewsItem[] } = {
  version: '0.13',
  items: [
    { icon: '🔎', text: '「查詢」新增搜尋：用中文意思、原文或讀音找字，點結果直接打開那個單元', to: '/l/{lang}/search', cta: '去找找' },
    { icon: '📕', text: '「練功」新增錯題本：答錯的字自動收進來，按「🎯 弱點特訓」專練常錯的字', to: '/l/{lang}/mistakes', cta: '去看看' },
    { icon: '📝', text: '模擬考交卷後，依比較弱的大題建議接下來怎麼練：單字庫、學習路線、相關觀念、聽力特訓' },
    { icon: '💡', text: '學習路線的關卡說明下方列出相關的觀念文章，觀念文章也能連回建議的關卡', to: '/l/{lang}', cta: '去看看' },
    { lang: 'ja', text: 'N1 單字庫新增 4 組 109 字：政治法律經濟、科學醫療環境、書面語的形容詞與副詞、片假名語', to: '/l/ja/bank/ja.n1', cta: '去學' },
    { lang: 'ko', text: '中級 2 單字庫新增 3 組 69 字：健康安全與環境、教育與職場、居住休閒與人際', to: '/l/ko/bank/ko.k4', cta: '去學' },
    { icon: '🧭', text: '上一版：導覽列換新、「▶ 開始今天的學習」、網站變快' },
  ],
};

/** 「今天」頁卡片「知道了」記的 id：同一版又加了新項目時，卡片會再出現一次 */
export const newsSeenKey = () => `news-${NEWS.version}-${NEWS.items.length}`;

/** 關卡在這個版本新增了內容，而且還沒打開過：顯示 NEW */
export function stageIsNew(stage: { id: string; fresh?: string }, guide: Record<string, number>): boolean {
  return stage.fresh === APP_MINOR && !guide[stageSeenKey(stage)];
}

export const stageSeenKey = (stage: { id: string; fresh?: string }) => `new:${stage.id}@${stage.fresh}`;
