// 首頁「這次更新了什麼」卡片與關卡的 NEW 標籤。每次發布新版本時更新這裡（版本只看前兩段，例如 0.10）。
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
  version: '0.11',
  items: [
    { lang: 'ja', text: 'N1 新增讀解（長文、A・B 比較、找資料）、聽解與文法⑤⑥', to: '/l/ja/s/ja.n1', cta: '去上課' },
    { lang: 'en', text: '多益金色證書新增長篇閱讀速讀、推論題攻略、滿分衝刺', to: '/l/en/s/en.gold', cta: '去上課' },
    { lang: 'ko', text: '韓文開放高級 1、2：高級文法、慣用語與俗語、評論閱讀、演講聽力、四字成語、寫作', to: '/l/ko/s/ko.k5', cta: '去上課' },
    { lang: 'ko', text: '新的 TOPIK II 모의고사（5–6 級）', to: '/l/ko/mock', cta: '去考考看' },
    { icon: '🥋', text: '遊樂場新增「專屬」分類：每種語言都有只屬於自己的特訓' },
    { lang: 'ja', text: '日文：活用道場（動詞變化）、助數詞大挑戰', to: '/l/ja/arcade', cta: '去玩' },
    { lang: 'ko', text: '韓文：數字大考驗（固有語／漢字語）、-아요／어요 活用', to: '/l/ko/arcade', cta: '去玩' },
    { lang: 'en', text: '英文：不規則動詞、拼字蜜蜂', to: '/l/en/arcade', cta: '去玩' },
    { icon: '👆', text: '商店新增會動的外觀：點擊特效、進度條跑者、全對慶祝', to: '/shop?tab=looks&kind=tap', cta: '去逛逛' },
    { icon: '🌊', text: '網站背景新增海底世界、雨夜窗邊、雲海、螢光森林（會動）', to: '/shop?tab=looks&kind=wall', cta: '去看看' },
  ],
};

/** 首頁卡片「知道了」記的 id：同一版又加了新項目時，卡片會再出現一次 */
export const newsSeenKey = () => `news-${NEWS.version}-${NEWS.items.length}`;

/** 關卡在這個版本新增了內容，而且還沒打開過：顯示 NEW */
export function stageIsNew(stage: { id: string; fresh?: string }, guide: Record<string, number>): boolean {
  return stage.fresh === APP_MINOR && !guide[stageSeenKey(stage)];
}

export const stageSeenKey = (stage: { id: string; fresh?: string }) => `new:${stage.id}@${stage.fresh}`;
