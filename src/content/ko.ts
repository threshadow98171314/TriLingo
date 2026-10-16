// 韓文：한글 → 初級 → 中級 → 高級（對照 TOPIK 1–6 級），另有旅遊、韓劇兩條主題路線
import type { Unit } from '../core/types';
import { attachMore, moreTable } from './dsl';
import { HANGUL_UNITS } from './ko-hangul';
import { K1_UNITS } from './ko-k1';
import { K1_BANK } from './ko-k1-bank';
import { K2_UNITS } from './ko-k2';
import { K2_BANK } from './ko-k2-bank';
import { K3_UNITS } from './ko-k3';
import { K3_BANK } from './ko-k3-bank';
import { K4_BANK } from './ko-k4-bank';
import { KO_MORE } from './ko-more';
import { TOWN_UNITS } from './ko-town';
import { KO_DRAMA_UNITS, KO_TRAVEL_UNITS } from './ko-tracks';

/** 各關卡的單元（關卡名稱、說明、預定大綱在 meta.ts） */
export const UNITS: Record<string, Unit[]> = {
  'ko.hangul': HANGUL_UNITS,
  'ko.k1': [...K1_UNITS, ...K1_BANK],
  'ko.k2': [...K2_UNITS, ...K2_BANK],
  'ko.k3': [...K3_UNITS, ...K3_BANK],
  'ko.k4': K4_BANK,
  'ko.town': TOWN_UNITS,
  'ko.travel': KO_TRAVEL_UNITS,
  'ko.drama': KO_DRAMA_UNITS,
};

// 學習路線單字的補充例句（答對時隨機挑一句顯示）
attachMore(Object.values(UNITS), moreTable(KO_MORE), false);

export { KO_MOCKS as MOCKS } from './ko-mock';
export { CONCEPTS } from './ko-concepts';
