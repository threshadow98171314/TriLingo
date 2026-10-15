// 首頁與練習的使用體驗：知識補充、「現在不方便聽」、接續學習。
import { describe, expect, it } from 'vitest';
import { COURSES } from '../src/content/all';
import { randomTip, TIPS } from '../src/content/tips';
import { lastStudiedLang, quickStats } from '../src/core/progress';
import { defaultSave } from '../src/core/save';
import type { VocabItem } from '../src/core/types';
import { ja } from '../src/content/dsl';
import { listenEx, qaEx, recog, typeJaEx, unlisten, type Ctx } from '../src/engine/exercises';
import { furiPlain } from '../src/engine/furigana';

describe('知識補充站', () => {
  it('每則都有標題和內容；日文讀音標註完整（沒有殘留中括號）', () => {
    expect(TIPS.length).toBeGreaterThanOrEqual(40);
    for (const t of TIPS) {
      expect(t.title.length, t.title).toBeGreaterThan(0);
      expect(t.body.length, t.title).toBeGreaterThan(10);
      expect(furiPlain(t.body), t.title).not.toMatch(/[[\]]/);
      expect(furiPlain(t.title), t.title).not.toMatch(/[[\]]/);
    }
  });

  it('三種語言和通用的學習方法都有', () => {
    for (const l of ['en', 'ja', 'ko', 'all'] as const) expect(TIPS.filter((t) => t.lang === l).length, l).toBeGreaterThanOrEqual(7);
  });

  it('隨機挑選：只挑指定語言、不會和上一則重複', () => {
    for (let i = 0; i < 50; i++) {
      const k = randomTip(['ko', 'all']);
      expect(['ko', 'all']).toContain(TIPS[k].lang);
      expect(randomTip(undefined, k)).not.toBe(k);
    }
  });
});

describe('現在不方便聽', () => {
  const words: VocabItem[] = [ja('学校[がっこう]', '學校'), ja('駅[えき]', '車站'), ja('病院[びょういん]', '醫院'), ja('公園[こうえん]', '公園')].map((w, k) => ({
    ...w,
    id: `ja.t:${k}`,
  }));
  const ctx: Ctx = { lang: 'ja', rng: () => 0.3, canListen: true, jaTyping: true };

  it('聽發音選意思 → 改成看文字選意思，答案不變', () => {
    const e = listenEx(words[0], words, ctx);
    const u = unlisten(e);
    expect(u.t).toBe('choice');
    if (u.t !== 'choice' || e.t !== 'choice') return;
    expect(u.audio).toBeUndefined();
    expect(u.hidePrompt).toBe(false);
    expect(u.prompt?.s).toBe('がっこう');
    expect(u.label).toBe('選出意思');
    expect(u.options).toEqual(e.options);
    expect(u.answer).toBe(e.answer);
  });

  it('聽問題選回應（多益 Part 2）→ 直接顯示問題', () => {
    const qa = COURSES.en.stages[0].units.flatMap((x) => x.items).find((i) => i.kind === 'qa')!;
    if (qa.kind !== 'qa') return;
    const u = unlisten(qaEx(qa, { lang: 'en', rng: Math.random, canListen: true }));
    expect(u.t === 'choice' && !u.audio && !u.hidePrompt && u.prompt?.s === qa.q).toBe(true);
  });

  it('聽打 → 看中文打；本來就不是聽力題的不變', () => {
    const t = typeJaEx(words[1], words, ctx, 'listen')!;
    const u = unlisten(t);
    expect(u.t === 'typeja' && u.mode === 'm2w' && !u.audio && u.prompt?.s === '車站').toBe(true);
    const r = recog(words[2], words, ctx);
    expect(unlisten(r)).toBe(r);
  });
});

describe('接續學習', () => {
  it('最近在學的語言看最後一次作答的時間', () => {
    const s = defaultSave(0);
    expect(lastStudiedLang(s)).toBeNull();
    s.items = {
      'en.orange.office:desk': { s: 1, due: 0, ok: 1, ng: 0, t: 100 },
      'ja.n5.greet:おはよう': { s: 1, due: 0, ok: 1, ng: 0, t: 300 },
      'ko.k1.greet:네': { s: 1, due: 99999, ok: 1, ng: 0, t: 200 },
    };
    expect(lastStudiedLang(s)).toBe('ja');
    expect(quickStats(s, 'ja')).toEqual({ learned: 1, due: 1 });
    expect(quickStats(s, 'ko')).toEqual({ learned: 1, due: 0 });
  });
});
