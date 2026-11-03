// 遊樂場的語言專屬特訓：出題引擎的正確答案、錯誤選項、題目數量。
import { describe, expect, it } from 'vitest';
import { mulberry32 } from '../src/core/rng';
import { DRILLS } from '../src/engine/drills';
import { IRREGULARS, irregularWrongs, regularized } from '../src/engine/drills/enIrregular';
import { ADV_FORMS, BASIC_FORMS, canForm, conjugate, VERBS, wrongForms, type ConjForm } from '../src/engine/drills/jaConj';
import { COUNTERS, counterWrongs } from '../src/engine/drills/jaCounters';
import { KO_VERBS, toPast } from '../src/engine/drills/koConj';
import { monthName, native, sino } from '../src/engine/drills/koNumbers';
import { furiKana, furiPlain } from '../src/engine/furigana';

const verb = (furi: string) => VERBS.find((v) => v.furi === furi)!;
const KANA = /^[ぁ-ゖァ-ヺー]+$/;

describe('活用道場（日文動詞變化）', () => {
  it('五段、一段、する、来る 的變化', () => {
    const cases: [string, ConjForm, string][] = [
      ['書[か]く', 'te', '書[か]いて'],
      ['行[い]く', 'te', '行[い]って'],
      ['行[い]く', 'ta', '行[い]った'],
      ['泳[およ]ぐ', 'te', '泳[およ]いで'],
      ['話[はな]す', 'ta', '話[はな]した'],
      ['待[ま]つ', 'te', '待[ま]って'],
      ['死[し]ぬ', 'te', '死[し]んで'],
      ['遊[あそ]ぶ', 'ta', '遊[あそ]んだ'],
      ['読[よ]む', 'te', '読[よ]んで'],
      ['買[か]う', 'nai', '買[か]わない'],
      ['帰[かえ]る', 'nai', '帰[かえ]らない'],
      ['帰[かえ]る', 'masu', '帰[かえ]ります'],
      ['入[はい]る', 'te', '入[はい]って'],
      ['書[か]く', 'pot', '書[か]ける'],
      ['待[ま]つ', 'vol', '待[ま]とう'],
      ['飲[の]む', 'pass', '飲[の]まれる'],
      ['読[よ]む', 'caus', '読[よ]ませる'],
      ['会[あ]う', 'ba', '会[あ]えば'],
      ['食[た]べる', 'te', '食[た]べて'],
      ['食[た]べる', 'pot', '食[た]べられる'],
      ['見[み]る', 'nai', '見[み]ない'],
      ['起[お]きる', 'vol', '起[お]きよう'],
      ['寝[ね]る', 'ba', '寝[ね]れば'],
      ['する', 'pot', 'できる'],
      ['勉強[べんきょう]する', 'te', '勉強[べんきょう]して'],
      ['来[く]る', 'nai', '来[こ]ない'],
      ['来[く]る', 'masu', '来[き]ます'],
      ['来[く]る', 'ba', '来[く]れば'],
      ['来[く]る', 'caus', '来[こ]させる'],
    ];
    for (const [furi, f, want] of cases) expect(conjugate(verb(furi), f), `${furi} ${f}`).toBe(want);
  });

  it('動詞清單：讀音標註完整、沒有重複；錯誤選項不會等於正確答案', () => {
    expect(new Set(VERBS.map((v) => v.furi)).size).toBe(VERBS.length);
    for (const v of VERBS) {
      expect(furiKana(v.furi), v.furi).toMatch(KANA);
      for (const f of [...BASIC_FORMS, ...ADV_FORMS]) {
        if (!canForm(v, f)) continue;
        const right = conjugate(v, f);
        expect(furiKana(right), `${v.furi} ${f}`).toMatch(KANA);
        const wrong = [...new Set(wrongForms(v, f))].filter((x) => x !== right);
        expect(wrong.length, `${v.furi} ${f}`).toBeGreaterThanOrEqual(3);
        for (const w of wrong) expect(furiKana(w), `${v.furi} ${f} ${w}`).toMatch(KANA);
      }
    }
  });

  it('長得像一段的五段動詞（帰る、入る…）不會被當成一段動詞變化', () => {
    for (const v of VERBS.filter((x) => x.trap)) {
      expect(furiPlain(conjugate(v, 'nai')), v.furi).toMatch(/らない$/);
      expect(furiPlain(conjugate(v, 'te')), v.furi).toMatch(/って$/);
    }
  });
});

describe('助數詞', () => {
  it('讀音都是平假名；錯誤選項不包含正確或也算對的念法', () => {
    for (const c of COUNTERS) {
      for (const [n, r] of Object.entries(c.r)) {
        expect(r, `${n}${c.k}`).toMatch(KANA);
        const wrong = counterWrongs(c, Number(n));
        expect(wrong, `${n}${c.k}`).not.toContain(r);
        for (const a of c.alt?.[Number(n)] ?? []) expect(wrong, `${n}${c.k}`).not.toContain(a);
      }
    }
  });

  it('容易念錯的幾個', () => {
    const r = (k: string, n: number) => COUNTERS.find((c) => c.k === k)!.r[n];
    expect([r('本', 3), r('本', 6), r('匹', 1), r('杯', 8)]).toEqual(['さんぼん', 'ろっぽん', 'いっぴき', 'はっぱい']);
    expect([r('人', 4), r('日', 1), r('日', 20), r('時', 9), r('月', 4), r('歳', 20)]).toEqual(['よにん', 'ついたち', 'はつか', 'くじ', 'しがつ', 'はたち']);
  });
});

describe('數字大考驗（韓文）', () => {
  it('漢字語數字：每「만」空一格，一萬不說 일만', () => {
    expect(sino(15000)).toBe('만 오천');
    expect(sino(2026)).toBe('이천이십육');
    expect(sino(250000)).toBe('이십오만');
    expect(sino(120000)).toBe('십이만');
    expect(sino(10500)).toBe('만 오백');
    expect(sino(16)).toBe('십육');
    expect(sino(100)).toBe('백');
  });

  it('固有語數字：接量詞時 1～4 和 20 變短', () => {
    expect([native(1), native(2), native(3), native(4), native(20), native(21), native(25)]).toEqual(['한', '두', '세', '네', '스무', '스물한', '스물다섯']);
    expect([native(3, false), native(20, false), native(12)]).toEqual(['셋', '스물', '열두']);
  });

  it('6 月、10 月去掉收尾音', () => {
    expect([monthName(6), monthName(10), monthName(11)]).toEqual(['유월', '시월', '십일월']);
  });
});

describe('-아요／어요 活用（韓文）', () => {
  it('錯誤寫法不等於正確答案；過去式的錯誤寫法也不會剛好是對的', () => {
    expect(new Set(KO_VERBS.map((v) => v.dict)).size).toBe(KO_VERBS.length);
    for (const v of KO_VERBS) {
      expect(v.wrong.length, v.dict).toBe(3);
      expect(v.wrong, v.dict).not.toContain(v.present);
      expect(v.wrong.map(toPast), v.dict).not.toContain(v.past);
      for (const s of [v.present, v.past, ...v.wrong]) expect(s, v.dict).toMatch(/^[가-힣]+요$/);
    }
  });

  it('過去式是在요前面的音節加上 ㅆ 再接 어요', () => {
    expect(toPast('더워요')).toBe('더웠어요');
    expect(toPast('해요')).toBe('했어요');
    expect(toPast('되요')).toBe('됬어요');
    for (const v of KO_VERBS) expect(toPast(v.present), v.dict).toBe(v.past);
  });
});

describe('不規則動詞（英文）', () => {
  it('原形不重複；錯誤選項至少三個，而且不包含正確或也算對的寫法', () => {
    expect(new Set(IRREGULARS.map((v) => v.base)).size).toBe(IRREGULARS.length);
    for (const v of IRREGULARS) {
      for (const which of ['past', 'pp'] as const) {
        const wrong = irregularWrongs(v, which);
        expect(wrong, `${v.base} ${which}`).not.toContain(v[which]);
        for (const a of v.alt) expect(wrong, `${v.base} ${which}`).not.toContain(a);
      }
      expect(`${v.base} ${v.past} ${v.pp}`).toMatch(/^[a-z ]+$/);
    }
    expect(regularized('write')).toBe('writed');
    expect(regularized('fly')).toBe('flied');
  });
});

describe('出題', () => {
  it('每個特訓、每種範圍都出得滿一場，選項四個而且不重複', () => {
    const learned = ['apple', 'meeting', 'schedule', 'invoice', 'budget', 'deadline', 'travel', 'manager', 'project', 'office', 'airport', 'receipt'].map((w, i) => ({
      id: `en.t:${w}`,
      w,
      m: `意思${i}`,
    }));
    for (const d of DRILLS) {
      for (const mode of d.modes?.map((m) => m.id) ?? ['all']) {
        for (let seed = 1; seed <= 5; seed++) {
          const qs = d.make({ rng: mulberry32(seed), learned }, mode);
          expect(qs.length, `${d.id} ${mode}`).toBe(d.count);
          expect(new Set(qs.map((q) => `${q.prompt}${q.hint}`)).size, `${d.id} ${mode} 題目重複`).toBe(qs.length);
          for (const q of qs) {
            if (q.opts) {
              expect(q.opts, `${d.id} ${q.prompt}`).toHaveLength(4);
              expect(new Set(q.opts).size, `${d.id} ${q.prompt} ${q.opts}`).toBe(4);
            } else expect(q.answers?.length, d.id).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});
