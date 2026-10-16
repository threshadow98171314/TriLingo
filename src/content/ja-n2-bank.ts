// 日文 N2 單字庫：照主題分組，內容分散在 ja-n2-bank1.ts、ja-n2-bank2.ts…
// 新的組要加在最後面；已上線的組不要把字搬到別組（id 是「組的 id＋原文」，搬了進度會歸零）。
import type { Unit } from '../core/types';
import { N2_BANK_1 } from './ja-n2-bank1';
import { N2_BANK_2 } from './ja-n2-bank2';
import { N2_BANK_3 } from './ja-n2-bank3';
import { N2_BANK_4 } from './ja-n2-bank4';
import { N2_BANK_5 } from './ja-n2-bank5';
import { N2_BANK_6 } from './ja-n2-bank6';
import { N2_BANK_7 } from './ja-n2-bank7';
import { N2_BANK_8 } from './ja-n2-bank8';
import { N2_BANK_9 } from './ja-n2-bank9';
import { N2_BANK_10 } from './ja-n2-bank10';
import { N2_BANK_11 } from './ja-n2-bank11';
import { N2_BANK_12 } from './ja-n2-bank12';

export const N2_BANK: Unit[] = [...N2_BANK_1, ...N2_BANK_2, ...N2_BANK_3, ...N2_BANK_4, ...N2_BANK_5, ...N2_BANK_6, ...N2_BANK_7, ...N2_BANK_8, ...N2_BANK_9, ...N2_BANK_10, ...N2_BANK_11, ...N2_BANK_12];
