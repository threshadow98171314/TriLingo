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
  /** 「去看看」連到哪裡（路由路徑） */
  to?: string;
  cta?: string;
}

export const NEWS: { version: string; items: NewsItem[] } = {
  version: '0.12',
  items: [
    { icon: '☀️', text: '新的「今天」頁：按「▶ 開始今天的學習」，先複習快要忘記的字、再接著上新課，一個按鈕就完成' },
    { icon: '🧭', text: '導覽列換新：今天、學習、練功、查詢、我的；上方的語言按鈕一點就能切換語言' },
    { icon: '📚', text: '學習路線變短了：關卡改成小標籤，只展開目前在上的單元，單字庫有自己的分頁' },
    { icon: '👤', text: '「我的」集合了成就、商店、設定、使用說明；小知識和諺語搬到「我的 → 充電站」', to: '/me?tab=recharge', cta: '去看看' },
    { icon: '⚡', text: '網站變快了：題目按關卡分包、用到才下載，第一次打開少下載八成' },
  ],
};

/** 「今天」頁卡片「知道了」記的 id：同一版又加了新項目時，卡片會再出現一次 */
export const newsSeenKey = () => `news-${NEWS.version}-${NEWS.items.length}`;

/** 關卡在這個版本新增了內容，而且還沒打開過：顯示 NEW */
export function stageIsNew(stage: { id: string; fresh?: string }, guide: Record<string, number>): boolean {
  return stage.fresh === APP_MINOR && !guide[stageSeenKey(stage)];
}

export const stageSeenKey = (stage: { id: string; fresh?: string }) => `new:${stage.id}@${stage.fresh}`;
