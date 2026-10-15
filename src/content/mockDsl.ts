// 撰寫模擬考用的小工具。id 會自動產生；每一題的「第一個選項是正確答案」，出題時會洗牌。
import type { MockExam, MockGroup, MockQ, MockSection } from '../core/types';

type Q = Omit<MockQ, 'id'>;
type G = Omit<MockGroup, 'id' | 'qs'> & { qs: Q[] };
type S = Omit<MockSection, 'groups'> & { groups: G[] };

/** 一題：q 可以省略（例如只播放聲音的聽力題） */
export const mq = (q: string | undefined, opts: string[], explain?: string, t?: string): Q => ({ q, opts, explain, t });

/** 單獨一題的題組 */
export const one = (q: string | undefined, opts: string[], explain?: string, t?: string): G => ({ qs: [mq(q, opts, explain, t)] });

/** 一篇文章（或一段聽力）配好幾題 */
export const set = (o: Omit<G, 'qs'>, ...qs: Q[]): G => ({ ...o, qs });

export function mockExam(def: Omit<MockExam, 'sections'> & { sections: S[] }): MockExam {
  return {
    ...def,
    sections: def.sections.map((s) => ({
      ...s,
      groups: s.groups.map((g, gi) => ({
        ...g,
        id: `${s.id}-${gi + 1}`,
        qs: g.qs.map((q, qi) => ({ ...q, id: `${def.id}:${s.id}:${gi + 1}:${qi + 1}` })),
      })),
    })),
  };
}
