import { describe, expect, it } from 'vitest';
import { ko } from '../src/content/dsl';
import type { VocabItem } from '../src/core/types';
import { produce, typeWordEx, type Ctx } from '../src/engine/exercises';
import { checkKo, checkTyped, decompose, diagnose, firstHint, keyGuide } from '../src/engine/typing';

describe('韓文打字的批改', () => {
  it('空格、標點不影響對錯，但空格不同不算完全吻合', () => {
    expect(checkKo('감사합니다', '감사합니다')).toEqual({ ok: true, exact: true });
    expect(checkKo('감사합니다.', '감사합니다')).toEqual({ ok: true, exact: true });
    expect(checkKo('안녕하세요', '안녕 하세요')).toEqual({ ok: true, exact: false });
    expect(checkKo('감사함니다', '감사합니다').ok).toBe(false);
    expect(checkKo('', '감사합니다').ok).toBe(false);
  });

  it('日文、韓文共用入口', () => {
    expect(checkTyped('ja', 'がっこう', '学校[がっこう]').ok).toBe(true);
    expect(checkTyped('ko', '한국', '한국').ok).toBe(true);
  });

  it('提示：第一個字＋長度', () => {
    expect(firstHint('ja', '学校[がっこう]')).toBe('が・・・');
    expect(firstHint('ko', '감사합니다')).toBe('감・・・・');
  });

  it('拆字母', () => {
    expect(decompose('한')).toEqual({ cho: 'ㅎ', jung: 'ㅏ', jong: 'ㄴ' });
    expect(decompose('과')).toEqual({ cho: 'ㄱ', jung: 'ㅘ', jong: '' });
    expect(decompose('a')).toBeNull();
  });
});

describe('答錯時說明差在哪裡', () => {
  it('日文：促音、長音、ん、濁音、拗音、助詞', () => {
    expect(diagnose('ja', 'がこう', '学校[がっこう]')).toContain('促音');
    expect(diagnose('ja', 'こひ', 'コーヒー')).toContain('ー');
    expect(diagnose('ja', 'せんせ', '先生[せんせい]')).toContain('長音');
    expect(diagnose('ja', 'こにちは', 'こんにちは')).toContain('ん');
    expect(diagnose('ja', 'かっこう', '学校[がっこう]')).toContain('濁音');
    expect(diagnose('ja', 'きよう', '今日[きょう]')).toContain('拗音');
    expect(diagnose('ja', 'わたしわ', '私[わたし]は')).toContain('ha');
    expect(diagnose('ja', 'ほんお', '本[ほん]を')).toContain('wo');
  });

  it('日文：打了漢字或差太多時不亂猜', () => {
    expect(diagnose('ja', '学生', '学校[がっこう]')).toBeNull();
    expect(diagnose('ja', 'えき', '学校[がっこう]')).toBeNull();
  });

  it('韓文：字數、子音、母音、收尾音', () => {
    expect(diagnose('ko', '감사', '감사합니다')).toContain('5 個字');
    expect(diagnose('ko', '가치', '까치')).toContain('平音');
    expect(diagnose('ko', '개', '게')).toContain('ㅐ');
    expect(diagnose('ko', '하국', '한국')).toContain('收尾音');
    expect(diagnose('ko', 'hanguk', '한국')).toContain('韓文鍵盤');
  });
});

describe('打法教學', () => {
  const keys = (lang: 'ja' | 'ko', a: string) => keyGuide(lang, a).steps.map((s) => s.keys);

  it('日文：促音併到下一拍、ん 打 nn、長音、拗音、外來語', () => {
    expect(keys('ja', '学校[がっこう]')).toEqual(['ga', 'kko', 'u']);
    expect(keys('ja', 'こんにちは')).toEqual(['ko', 'nn', 'ni', 'chi', 'ha']);
    expect(keys('ja', 'コーヒー')).toEqual(['ko', '-', 'hi', '-']);
    expect(keys('ja', '今日[きょう]')).toEqual(['kyo', 'u']);
    expect(keys('ja', '切手[きって]')).toEqual(['ki', 'tte']);
    expect(keys('ja', 'パーティー')).toEqual(['pa', '-', 'thi', '-']);
    const tips = keyGuide('ja', '学校[がっこう]').tips.join();
    expect(tips).toContain('促音');
    expect(tips).toContain('長音');
    expect(tips).toContain('漢字');
  });

  it('韓文：字母對應到鍵盤，雙子音用 Shift，複合母音拆成兩鍵', () => {
    expect(keys('ko', '한국')).toEqual(['g k s', 'r n r']);
    expect(keys('ko', '까')).toEqual(['R k']);
    expect(keyGuide('ko', '과').steps[0].jamo).toBe('ㄱㅗㅏ');
    expect(keys('ko', '읽')).toEqual(['d l f r']);
    expect(keyGuide('ko', '안녕 하세요').tips.join()).toContain('띄어쓰기');
  });
});

describe('韓文打字題', () => {
  const words: VocabItem[] = [ko('사과', 'sagwa', '蘋果'), ko('학교', 'hakgyo', '學校'), ko('감사합니다', 'gamsahamnida', '謝謝'), ko('물', 'mul', '水')].map((w, k) => ({
    ...w,
    id: `ko.test:${k}`,
  }));
  const ctx = (o: Partial<Ctx> = {}): Ctx => ({ lang: 'ko', rng: () => 0, canListen: true, typing: true, ...o });

  it('看中文用韓文打，題目說明是韓文', () => {
    const e = typeWordEx(words[0], words, ctx())!;
    expect(e.t).toBe('typeword');
    expect(e.lang).toBe('ko');
    expect(e.answer).toBe('사과');
    expect(e.label).toContain('韓文');
    expect(e.label).not.toContain('日文');
  });

  it('開啟打字題時韓文產出題會出打字題，關掉就不會', () => {
    expect(produce(words[1], words, ctx()).t).toBe('typeword');
    expect(produce(words[1], words, ctx({ typing: false })).t).not.toBe('typeword');
  });
});
