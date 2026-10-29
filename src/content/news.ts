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
  version: '0.10',
  items: [
    { lang: 'ja', text: '日文 N1 開放：書面語文法 4 個單元＋N1 單字庫 123 字', to: '/l/ja/s/ja.n1', cta: '去 N1' },
    { lang: 'ko', text: '韓文中級 2：-더라고요、-(으)ㄹ 텐데等 4 個文法單元', to: '/l/ko/s/ko.k4', cta: '去中級 2' },
    { lang: 'en', text: '多益金色路線：同義詞替換、高頻陷阱題', to: '/l/en/s/en.gold', cta: '去金色' },
    { lang: 'ja', text: '動漫新增：角色的語尾語氣、關西腔入門', to: '/l/ja/s/ja.anime', cta: '去動漫' },
    { lang: 'ko', text: '韓劇新增：綜藝流行語、釜山腔入門', to: '/l/ko/s/ko.drama', cta: '去韓劇' },
    { icon: '⚡', text: '答題不再卡頓；設定新增「特效品質」（自動／完整／精簡）', to: '/settings', cta: '設定' },
  ],
};

/** 關卡在這個版本新增了內容，而且還沒打開過：顯示 NEW */
export function stageIsNew(stage: { id: string; fresh?: string }, guide: Record<string, number>): boolean {
  return stage.fresh === APP_MINOR && !guide[stageSeenKey(stage)];
}

export const stageSeenKey = (stage: { id: string; fresh?: string }) => `new:${stage.id}@${stage.fresh}`;
