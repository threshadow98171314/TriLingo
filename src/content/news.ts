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
  version: '0.14',
  items: [
    { icon: '🎯', text: '「今天」頁可以設定學習目標：在哪一天之前完成哪一關，自動算出每週要上幾課，「開始今天的學習」也會照目標排課' },
    { icon: '🎓', text: '完成一整條學習路線就能領結業證書，可以存成圖片或分享；「我的 → 成就」看得到所有證書', to: '/profile', cta: '去看看' },
    { icon: '⚔️', text: '模擬考交卷後可以挑戰朋友：朋友打開連結會考同一份考卷，考完比分數', to: '/l/{lang}/mock', cta: '去考考看' },
    { icon: '🔎', text: '上一版：搜尋、錯題本與弱點特訓、N1 與韓文中級 2 單字庫擴充' },
  ],
};

/** 「今天」頁卡片「知道了」記的 id：同一版又加了新項目時，卡片會再出現一次 */
export const newsSeenKey = () => `news-${NEWS.version}-${NEWS.items.length}`;

/** 關卡在這個版本新增了內容，而且還沒打開過：顯示 NEW */
export function stageIsNew(stage: { id: string; fresh?: string }, guide: Record<string, number>): boolean {
  return stage.fresh === APP_MINOR && !guide[stageSeenKey(stage)];
}

export const stageSeenKey = (stage: { id: string; fresh?: string }) => `new:${stage.id}@${stage.fresh}`;
