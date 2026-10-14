// 每日一句：三種語言的諺語，每天由日期決定一組。
// 日文用「漢字[よみ]」標註讀音；韓文附羅馬拼音（依實際發音）。
import type { LangId } from '../core/types';

export interface Proverb {
  lang: LangId;
  /** 原文（日文含振假名標註） */
  text: string;
  rm?: string;
  zh: string;
}

export const PROVERBS: Record<LangId, Proverb[]> = {
  en: [
    { lang: 'en', text: 'Practice makes perfect.', zh: '熟能生巧。' },
    { lang: 'en', text: "Rome wasn't built in a day.", zh: '羅馬不是一天造成的。' },
    { lang: 'en', text: "Where there's a will, there's a way.", zh: '有志者事竟成。' },
    { lang: 'en', text: 'Actions speak louder than words.', zh: '行動勝於言語。' },
    { lang: 'en', text: 'Slow and steady wins the race.', zh: '穩紮穩打才能贏得比賽。' },
    { lang: 'en', text: 'The early bird catches the worm.', zh: '早起的鳥兒有蟲吃。' },
    { lang: 'en', text: 'Every cloud has a silver lining.', zh: '每朵烏雲都鑲著銀邊（黑暗中總有希望）。' },
    { lang: 'en', text: 'Better late than never.', zh: '遲做總比不做好。' },
    { lang: 'en', text: 'Knowledge is power.', zh: '知識就是力量。' },
    { lang: 'en', text: 'No pain, no gain.', zh: '不勞則無獲。' },
    { lang: 'en', text: 'A journey of a thousand miles begins with a single step.', zh: '千里之行，始於足下。' },
  ],
  ja: [
    { lang: 'ja', text: '七転[ななころ]び八起[やお]き', zh: '跌倒七次，第八次也要站起來（百折不撓）。' },
    { lang: 'ja', text: '猿[さる]も木[き]から落[お]ちる', zh: '猴子也會從樹上掉下來（智者千慮，必有一失）。' },
    { lang: 'ja', text: '石[いし]の上[うえ]にも三年[さんねん]', zh: '在冰冷的石頭上坐三年也會變暖（堅持就會成功）。' },
    { lang: 'ja', text: '継続[けいぞく]は力[ちから]なり', zh: '持續就是力量。' },
    { lang: 'ja', text: '塵[ちり]も積[つ]もれば山[やま]となる', zh: '灰塵積多了也會成山（積少成多）。' },
    { lang: 'ja', text: '急[いそ]がば回[まわ]れ', zh: '急的時候就繞遠路（欲速則不達）。' },
    { lang: 'ja', text: '案[あん]ずるより産[う]むが易[やす]し', zh: '實際去做，比擔心來得容易。' },
    { lang: 'ja', text: '花[はな]より団子[だんご]', zh: '比起賞花，更愛糰子（重實際勝過風雅）。' },
    { lang: 'ja', text: '一期一会[いちごいちえ]', zh: '一生只有一次的相遇，要珍惜當下。' },
    { lang: 'ja', text: '習[なら]うより慣[な]れよ', zh: '與其學習，不如習慣（熟能生巧）。' },
    { lang: 'ja', text: '千里[せんり]の道[みち]も一歩[いっぽ]から', zh: '千里之路也是從一步開始。' },
  ],
  ko: [
    { lang: 'ko', text: '시작이 반이다', rm: 'sijagi banida', zh: '開始就是成功的一半。' },
    { lang: 'ko', text: '천 리 길도 한 걸음부터', rm: 'cheolli gildo han georeumbuteo', zh: '千里之路也是從一步開始。' },
    { lang: 'ko', text: '티끌 모아 태산', rm: 'tikkeul moa taesan', zh: '聚集灰塵成泰山（積少成多）。' },
    { lang: 'ko', text: '낮말은 새가 듣고 밤말은 쥐가 듣는다', rm: 'nanmareun saega deutgo bammareun jwiga deunneunda', zh: '白天說的話鳥聽見，晚上說的話老鼠聽見（隔牆有耳）。' },
    { lang: 'ko', text: '백지장도 맞들면 낫다', rm: 'baekjijangdo matdeulmyeon natda', zh: '一張白紙兩人一起抬也比較輕（團結力量大）。' },
    { lang: 'ko', text: '가는 말이 고와야 오는 말이 곱다', rm: 'ganeun mari gowaya oneun mari gopda', zh: '說出去的話好聽，回來的話才好聽（以禮待人）。' },
    { lang: 'ko', text: '원숭이도 나무에서 떨어진다', rm: 'wonsungido namueseo tteoreojinda', zh: '猴子也會從樹上掉下來（智者千慮，必有一失）。' },
    { lang: 'ko', text: '금강산도 식후경', rm: 'geumgangsando sikugyeong', zh: '金剛山也要吃飽再看（民以食為天）。' },
    { lang: 'ko', text: '고생 끝에 낙이 온다', rm: 'gosaeng kkeute nagi onda', zh: '苦盡甘來。' },
    { lang: 'ko', text: '소 잃고 외양간 고친다', rm: 'so ilko oeyanggan gochinda', zh: '丟了牛才修牛棚（亡羊補牢）。' },
  ],
};
