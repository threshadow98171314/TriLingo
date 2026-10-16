// 日文：五十音 → N5 → N4 → N3 → N2 → N1，另有旅遊、動漫兩條主題路線
import type { Unit } from '../core/types';
import { attachMore, moreTable } from './dsl';
import { KANA_UNITS } from './ja-kana';
import { JA_MORE } from './ja-more';
import { N2_UNITS } from './ja-n2';
import { N2_BANK } from './ja-n2-bank';
import { N3_UNITS } from './ja-n3';
import { N3_BANK } from './ja-n3-bank';
import { N4_UNITS } from './ja-n4';
import { N5_UNITS } from './ja-n5';
import { N5_BANK } from './ja-n5-bank';
import { TOWN_UNITS } from './ja-town';
import { JA_ANIME_UNITS, JA_TRAVEL_UNITS } from './ja-tracks';

/** 各關卡的單元（關卡名稱、說明、預定大綱在 meta.ts） */
export const UNITS: Record<string, Unit[]> = {
  'ja.kana': KANA_UNITS,
  'ja.n5': [...N5_UNITS, ...N5_BANK],
  'ja.n4': N4_UNITS,
  'ja.n3': [...N3_UNITS, ...N3_BANK],
  'ja.n2': [...N2_UNITS, ...N2_BANK],
  'ja.town': TOWN_UNITS,
  'ja.travel': JA_TRAVEL_UNITS,
  'ja.anime': JA_ANIME_UNITS,
};

// 學習路線單字的補充例句（答對時隨機挑一句顯示）
attachMore(Object.values(UNITS), moreTable(JA_MORE), true);

export { JA_MOCKS as MOCKS } from './ja-mock';
export { CONCEPTS } from './ja-concepts';
