// 語言專屬特訓的清單：遊樂場的「日文專屬」「韓文專屬」「英文專屬」分類。
import { sample } from '../../core/rng';
import type { LangId } from '../../core/types';
import { irregularQuestions } from './enIrregular';
import { conjQuestions } from './jaConj';
import { counterQuestions } from './jaCounters';
import { koConjQuestions } from './koConj';
import { koNumberQuestions } from './koNumbers';
import type { DrillCtx, DrillDef, DrillId, DrillQ } from './types';

export type { DrillDef, DrillId, DrillQ } from './types';
export { DRILL_IDS, DRILL_LANG } from './types';

/** 拼字蜜蜂：從學過的英文單字出題，聽發音拼出來 */
function spellQuestions(ctx: DrillCtx, n: number): DrillQ[] {
  const words = ctx.learned.filter((w) => /^[a-z]{4,12}$/.test(w.w));
  return sample(words, n, ctx.rng).map((w) => ({
    icon: '🐝',
    prompt: '聽發音，拼出這個字',
    hint: `${w.m}${w.pos ? `（${w.pos}）` : ''}・${w.w.length} 個字母`,
    answers: [w.w],
    explain: `正確拼法：${w.w}`,
    say: w.w,
    itemId: w.id,
  }));
}

export const DRILLS: DrillDef[] = [
  {
    id: 'conj',
    lang: 'ja',
    icon: '🥋',
    title: '活用道場',
    desc: '動詞變化特訓：ます形、て形、た形、ない形，到可能、意向、ば形、受身、使役。專抓「帰る是五段動詞」「行く的て形」這種常錯的地方。',
    rules: ['看動詞原形和要變成的形，選出正確的變化。', '答錯會說明規則（五段、一段、する、来る）和例外。', '一場 12 題，連續答對分數越來越高。'],
    modes: [
      { id: 'basic', label: '基本', desc: 'N5：ます・て・た・ない' },
      { id: 'adv', label: '進階', desc: 'N4：可能・意向・ば・受身・使役' },
      { id: 'all', label: '全部', desc: '九種變化混在一起' },
    ],
    count: 12,
    need: 20,
    make: (ctx, mode) => conjQuestions(ctx.rng, mode, 12),
  },
  {
    id: 'counter',
    lang: 'ja',
    icon: '🔢',
    title: '助數詞大挑戰',
    desc: '3 本是さんぼん、6 杯是ろっぱい、4 人是よにん、1 號是ついたち？數字＋量詞的音變一次練熟。',
    rules: ['看數字和量詞，選出正確的念法。', '本・匹・杯的音變（っぽん、ぼん），人數、日期、時刻、月份的特別念法都會出。', '一場 12 題，答錯會說明規則。'],
    modes: [
      { id: 'sound', label: '音變', desc: '本・匹・杯・個・階・分…' },
      { id: 'special', label: '特別念法', desc: '人數・～つ・日期・時刻・月份' },
      { id: 'all', label: '全部', desc: '混在一起' },
    ],
    count: 12,
    need: 10,
    make: (ctx, mode) => counterQuestions(ctx.rng, mode, 12),
  },
  {
    id: 'numbers',
    lang: 'ko',
    icon: '🔢',
    title: '數字大考驗',
    desc: '韓文有兩套數字：세 시 삼십 분、스물다섯 살、만 오천 원、유월。什麼時候用固有語、什麼時候用漢字語，一場就分清楚。',
    rules: ['看數字和量詞（時間、年齡、價錢、樓層、月份…），選出正確的念法。', '也會反過來：看韓文念法選出是多少。', '一場 12 題，答錯會說明哪些量詞用哪一套數字。'],
    modes: [
      { id: 'native', label: '固有語', desc: '시・살・명・개・잔…' },
      { id: 'sino', label: '漢字語', desc: '분・원・층・월・년…' },
      { id: 'all', label: '全部', desc: '兩套混在一起' },
    ],
    count: 12,
    need: 10,
    make: (ctx, mode) => koNumberQuestions(ctx.rng, mode, 12),
  },
  {
    id: 'koconj',
    lang: 'ko',
    icon: '🥋',
    title: '-아요／어요 活用',
    desc: '덥다 → 더워요、듣다 → 들어요、모르다 → 몰라요、낫다 → 나아요。ㅂ、ㄷ、르、ㅅ、ㅎ、으 不規則和「長得像不規則」的字一次練熟。',
    rules: ['看原形，選出正確的現在式（-아요／어요）或過去式（-았어요／었어요）。', '答錯會說明是哪一種不規則變化。', '一場 12 題。'],
    modes: [
      { id: 'all', label: '全部', desc: '規則＋不規則' },
      { id: 'irregular', label: '不規則', desc: '只練不規則和易混的字' },
      { id: 'past', label: '過去式', desc: '-았어요／었어요' },
    ],
    count: 12,
    need: 20,
    make: (ctx, mode) => koConjQuestions(ctx.rng, mode, 12),
  },
  {
    id: 'irregular',
    lang: 'en',
    icon: '🔁',
    title: '不規則動詞',
    desc: 'go → went → gone、rise → rose → risen、lie → lay → lain。多益 Part 5 的完成式、被動語態都要用過去分詞，一次背熟。',
    rules: ['看原形，選出正確的過去式或過去分詞。', '干擾選項是另一個時態、照規則加 -ed，以及 rise／raise 這種易混淆的字。', '一場 12 題，作答後會唸出三態。'],
    modes: [
      { id: 'all', label: '全部', desc: '過去式＋過去分詞' },
      { id: 'past', label: '過去式', desc: 'went、took…' },
      { id: 'pp', label: '過去分詞', desc: 'gone、taken…' },
    ],
    count: 12,
    need: 10,
    make: (ctx, mode) => irregularQuestions(ctx.rng, mode, 12),
  },
  {
    id: 'spell',
    lang: 'en',
    icon: '🐝',
    title: '拼字蜜蜂',
    desc: '聽發音、看中文，把學過的英文單字拼出來。拼錯一次會給第一個字母的提示。',
    rules: ['先聽發音（可以重播、放慢），把單字拼出來。', '拼錯一次會提示第一個字母，再錯就公布答案。', '一場 10 個字，只出你學過的單字。'],
    count: 10,
    need: 8,
    needsVoice: true,
    make: (ctx) => spellQuestions(ctx, 10),
  },
];

export function drillOf(lang: LangId, id: string): DrillDef | undefined {
  return DRILLS.find((d) => d.lang === lang && d.id === id);
}

export const drillsFor = (lang: LangId): DrillDef[] => DRILLS.filter((d) => d.lang === lang);
