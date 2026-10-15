// 首頁與練習的使用體驗：知識補充、「現在不方便聽」、接續學習。
import { describe, expect, it } from 'vitest';
import { COURSES } from '../src/content/all';
import { randomTip, TIPS } from '../src/content/tips';
import { lastStudiedLang, quickStats } from '../src/core/progress';
import { defaultSave } from '../src/core/save';
import type { ClozeItem, QaItem, VocabItem } from '../src/core/types';
import { ja } from '../src/content/dsl';
import { scriptLines } from '../src/core/tts';
import { clozeSentence, listenEx, qaEx, recog, tokenPool, transcriptOf, typeWordEx, unlisten, type Ctx } from '../src/engine/exercises';
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
  const ctx: Ctx = { lang: 'ja', rng: () => 0.3, canListen: true, typing: true };

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
    const t = typeWordEx(words[1], words, ctx, 'listen')!;
    const u = unlisten(t);
    expect(u.t === 'typeword' && u.mode === 'm2w' && !u.audio && u.prompt?.s === '車站').toBe(true);
    const r = recog(words[2], words, ctx);
    expect(unlisten(r)).toBe(r);
  });
});

describe('多益 Part 1、3、4、7', () => {
  const units = COURSES.en.stages.flatMap((s) => s.units);
  const all = units.flatMap((u) => u.items);
  const talks = all.filter((i): i is QaItem => i.kind === 'qa' && !!i.ask && !i.read);
  const reads = all.filter((i): i is QaItem => i.kind === 'qa' && !!i.read);
  const en = (canListen: boolean): Ctx => ({ lang: 'en', rng: () => 0.3, canListen });

  it('對話稿一行一句、每行標出說話者；閱讀文章不會被當成對話', () => {
    expect(talks.length).toBeGreaterThanOrEqual(20);
    expect(reads.length).toBeGreaterThanOrEqual(8);
    for (const t of talks) {
      const lines = t.q.split('\n');
      for (const line of lines) expect(line, t.id).toMatch(/^[MF]: \S/);
      expect(scriptLines(t.q)?.length, t.id).toBe(lines.length);
      expect(t.ask!.length, t.id).toBeGreaterThan(5);
    }
    for (const r of reads) expect(scriptLines(r.q), r.id).toBeNull();
  });

  it('聽對話題：問題一直顯示、播放對話稿；不方便聽或沒有語音時改成印出對話稿', () => {
    const t = talks[0];
    const ex = qaEx(t, en(true));
    expect(ex.prompt?.s).toBe(t.ask);
    expect(ex.hidePrompt).toBeFalsy();
    expect(ex.audio?.text).toBe(t.q);
    const u = unlisten(ex);
    expect(u.t === 'choice' && !u.audio && u.prompt!.s.startsWith(transcriptOf(t.q)) && u.prompt!.s.endsWith(t.ask!)).toBe(true);
    expect(transcriptOf(t.q)).toMatch(/^(男|女)：/);
    const quiet = qaEx(t, en(false));
    expect(quiet.audio).toBeUndefined();
    expect(quiet.prompt?.s.endsWith(t.ask!)).toBe(true);
  });

  it('閱讀題：直接印出文章，不朗讀', () => {
    const r = reads[0];
    const ex = qaEx(r, en(true));
    expect(ex.audio).toBeUndefined();
    expect(ex.prompt?.s.startsWith(r.q)).toBe(true);
    expect(unlisten(ex)).toBe(ex);
  });

  it('Part 1 的（照片：…）只顯示在題目上：不朗讀，也不會變成句子重組的字卡', () => {
    const p1 = units.find((u) => u.id === 'en.brown.part1')!;
    const cz = p1.items.filter((i): i is ClozeItem => i.kind === 'cloze');
    expect(cz.length).toBeGreaterThanOrEqual(10);
    for (const c of cz) {
      expect(c.q.startsWith('（照片：'), c.id).toBe(true);
      expect(clozeSentence(c), c.id).toMatch(/^[A-Z][A-Za-z ,.]+$/);
    }
    expect(tokenPool(p1.items, 'en').some((t) => t.includes('照片'))).toBe(false);
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

describe('新手引導', () => {
  it('看過的說明不再出現；重看會全部清掉；雲端合併取聯集', async () => {
    const store = await import('../src/core/store');
    const { mergeSaves } = await import('../src/core/merge');
    store.resetSave();
    expect(store.getSave().guide).toEqual({});
    store.markGuide('welcome', 'tab:path');
    expect(Object.keys(store.getSave().guide).sort()).toEqual(['tab:path', 'welcome']);
    store.resetGuides();
    expect(store.getSave().guide).toEqual({});
    const a = { ...defaultSave(0), guide: { welcome: 5 } };
    const b = { ...defaultSave(0), guide: { welcome: 3, 'tab:mock': 9 } };
    expect(mergeSaves(a, b).guide).toEqual({ welcome: 3, 'tab:mock': 9 });
  });

  it('每種題型都有自己的提示', async () => {
    const { exHintOf } = await import('../src/components/Guide');
    const words: VocabItem[] = [ja('学校[がっこう]', '學校'), ja('駅[えき]', '車站'), ja('病院[びょういん]', '醫院'), ja('公園[こうえん]', '公園')].map((w, k) => ({ ...w, id: `ja.h:${k}` }));
    const ctx: Ctx = { lang: 'ja', rng: () => 0.3, canListen: true, typing: true };
    expect(exHintOf({ t: 'teach', item: words[0] })?.id).toBe('ex:teach');
    expect(exHintOf(listenEx(words[0], words, ctx))?.id).toBe('ex:listen');
    expect(exHintOf(typeWordEx(words[0], words, ctx)!)?.id).toBe('ex:typeja');
    expect(exHintOf(recog(words[0], words, ctx))).toBeNull();
  });
});

describe('新遊戲', () => {
  it('假名對對碰：平假名、片假名學過的都算，同一個音只算一組', async () => {
    const { kanaPairs } = await import('../src/pages/Memory');
    const kana = COURSES.ja.stages[0].units;
    const h = kana.find((u) => u.id === 'ja.kana.h1')!.items.slice(0, 3);
    const k = kana.find((u) => u.id === 'ja.kana.k1')!.items.slice(0, 5);
    const got = kanaPairs([...h, ...k] as VocabItem[]);
    expect(got).toEqual(['あ', 'い', 'う', 'え', 'お']);
  });

  it('最佳紀錄：真假快判取最高分，記憶翻牌取最短秒數；舊存檔補上欄位', async () => {
    const { mergeSaves } = await import('../src/core/merge');
    const { migrate } = await import('../src/core/save');
    const a = defaultSave(0);
    const b = defaultSave(0);
    a.best.tf.ja = 120;
    b.best.tf.ja = 90;
    a.best.memory.ja = 40;
    b.best.memory.ja = 33;
    b.best.memory.ko = 50;
    const m = mergeSaves(a, b);
    expect(m.best.tf.ja).toBe(120);
    expect(m.best.memory).toEqual({ ja: 33, ko: 50 });
    const old = migrate({ xp: { en: 1, ja: 0, ko: 0 }, items: {}, best: { blitz: { en: 5, ja: 0, ko: 0 }, match: {} } }, 0);
    expect(old.best.tf).toEqual({ en: 0, ja: 0, ko: 0 });
    expect(old.best.memory).toEqual({});
    expect(old.guide).toEqual({});
  });
});
