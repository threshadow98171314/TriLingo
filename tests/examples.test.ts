import { describe, expect, it } from 'vitest';
import { COURSE_LIST } from '../src/content/all';
import { en, ja, jaList, ko } from '../src/content/dsl';
import type { VocabItem } from '../src/core/types';
import { buildCorpus, corpusOfCourse, examplesOf, matcherOf } from '../src/engine/examples';
import { isVocab } from '../src/engine/exercises';

describe('單字清單的更多例句', () => {
  it('意思之後可以寫好幾組「例句|翻譯」，※ 開頭是補充說明', () => {
    const [w] = jaList(`
      会議[かいぎ]|會議|会議[かいぎ]が始[はじ]まる。|會議開始。|会議[かいぎ]に出[で]る。|出席會議。|※也可以說ミーティング
    `);
    expect(w.ex?.s).toBe('会議が始まる。');
    expect(w.more?.map((x) => x.t)).toEqual(['出席會議。']);
    expect(w.note).toBe('也可以說ミーティング');
  });

  it('沒有更多例句時不放 more 欄位', () => {
    const [w] = jaList('駅[えき]|車站|駅[えき]はどこですか。|車站在哪裡？');
    expect(w.more).toBeUndefined();
  });
});

describe('從課程句子裡找例句', () => {
  const id = (x: VocabItem, k: string) => ({ ...x, id: `t:${k}` });

  it('日文用讀音比對：同字不同音不會配錯', () => {
    const corpus = buildCorpus('ja', [
      id(ja('a', 'a', '気配[きくば]りが上手[じょうず]だ。|很會體貼人。'), '1'),
      id(ja('b', 'b', '人[ひと]の気配[けはい]がする。|感覺有人。'), '2'),
    ]);
    const exs = examplesOf(id(ja('気配[けはい]', '動靜'), 'x'), 'ja', corpus);
    expect(exs.map((e) => e.t)).toEqual(['感覺有人。']);
  });

  it('日文動詞、形容詞去掉活用語尾再比對', () => {
    const m = matcherOf(id(ja('戸惑[とまど]う', '困惑'), 'x'), 'ja')!;
    const [e] = buildCorpus('ja', [id(ja('c', 'c', '急[きゅう]に聞[き]かれて戸惑[とまど]った。|突然被問很困惑。'), '3')]);
    expect(m(e)).toBe(true);
    expect(matcherOf(id(ja('する', '做'), 'y'), 'ja')).toBeNull();
  });

  it('英文容許字尾變化；韓文比對語幹', () => {
    const corpus = buildCorpus('en', [id(en('x', 'n.', 'x', 'We arranged a meeting.|我們安排了會議。'), '1')]);
    expect(examplesOf(id(en('arrange', 'v.', '安排'), 'a'), 'en', corpus)).toHaveLength(1);
    const kc = buildCorpus('ko', [id(ko('x', 'x', 'x', '매일 공부해요.|每天讀書。'), '1')]);
    expect(examplesOf(id(ko('공부하다', 'gongbuhada', '讀書'), 'k'), 'ko', kc)).toHaveLength(1);
  });

  it('自己的例句排第一，最多三句', () => {
    const w = id(ja('会議[かいぎ]', '會議', '会議[かいぎ]が始[はじ]まる。|會議開始。', { more: ['会議[かいぎ]に出[で]る。|出席會議。'] }), 'w');
    const corpus = buildCorpus('ja', [
      id(ja('a', 'a', '会議[かいぎ]は三時[さんじ]からです。|會議三點開始。'), '1'),
      id(ja('b', 'b', '会議[かいぎ]室[しつ]はどこですか。|會議室在哪裡？'), '2'),
    ]);
    const exs = examplesOf(w, 'ja', corpus);
    expect(exs).toHaveLength(3);
    expect(exs[0].t).toBe('會議開始。');
    expect(exs[1].t).toBe('出席會議。');
  });
});

describe('課程裡的例句數量', () => {
  it('大部分日文單字都有兩句以上的例句可以輪流顯示', () => {
    for (const c of COURSE_LIST) {
      const corpus = corpusOfCourse(c);
      const words = c.stages.flatMap((s) => s.units.flatMap((u) => u.items)).filter((i): i is VocabItem => isVocab(i) && i.kind === 'word');
      const counts = words.map((w) => examplesOf(w, c.id, corpus).length);
      const two = counts.filter((n) => n >= 2).length / counts.length;
      const three = counts.filter((n) => n >= 3).length / counts.length;
      console.log(`${c.id}: ${words.length} 個單字，兩句以上 ${(two * 100).toFixed(0)}%，三句 ${(three * 100).toFixed(0)}%`);
      if (c.id === 'ja') expect(two).toBeGreaterThan(0.3);
    }
  });
});
