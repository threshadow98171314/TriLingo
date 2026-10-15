// 日文：五十音 → N5 → N4 → N3 → N2 → N1，另有旅遊、動漫兩條主題路線
import type { Unit } from '../core/types';
import { KANA_UNITS } from './ja-kana';
import { N4_UNITS } from './ja-n4';
import { N5_UNITS } from './ja-n5';
import { JA_ANIME_UNITS, JA_TRAVEL_UNITS } from './ja-tracks';

/** 各關卡的單元（關卡名稱、說明、預定大綱在 meta.ts） */
export const UNITS: Record<string, Unit[]> = {
  'ja.kana': KANA_UNITS,
  'ja.n5': N5_UNITS,
  'ja.n4': N4_UNITS,
  'ja.travel': JA_TRAVEL_UNITS,
  'ja.anime': JA_ANIME_UNITS,
};
