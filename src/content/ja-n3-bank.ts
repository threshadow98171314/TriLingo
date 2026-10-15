// 日文 N3 單字庫：照主題分組，內容分散在 ja-n3-bank1.ts、ja-n3-bank2.ts…
// 新的組要加在最後面；已上線的組不要把字搬到別組（id 是「組的 id＋原文」，搬了進度會歸零）。
import type { Unit } from '../core/types';
import { N3_BANK_1 } from './ja-n3-bank1';
import { N3_BANK_2 } from './ja-n3-bank2';
import { N3_BANK_3 } from './ja-n3-bank3';
import { N3_BANK_4 } from './ja-n3-bank4';
import { N3_BANK_5 } from './ja-n3-bank5';
import { N3_BANK_6 } from './ja-n3-bank6';
import { N3_BANK_7 } from './ja-n3-bank7';
import { N3_BANK_8 } from './ja-n3-bank8';
import { N3_BANK_9 } from './ja-n3-bank9';
import { N3_BANK_10 } from './ja-n3-bank10';

export const N3_BANK: Unit[] = [...N3_BANK_1, ...N3_BANK_2, ...N3_BANK_3, ...N3_BANK_4, ...N3_BANK_5, ...N3_BANK_6, ...N3_BANK_7, ...N3_BANK_8, ...N3_BANK_9, ...N3_BANK_10];
