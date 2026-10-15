// 日文打字題：批改規則與出題。
import { describe, expect, it } from 'vitest';
import type { VocabItem } from '../src/core/types';
import { ja } from '../src/content/dsl';
import { produce, typeWordEx, type Ctx } from '../src/engine/exercises';
import { checkJa, kanaHint, normJa, readingOf } from '../src/engine/jaInput';

describe('日文打字批改', () => {
  it('漢字、假名、混著打都算對', () => {
    const furi = 'ちょっと待[ま]って';
    expect(checkJa('ちょっと待って', furi)).toEqual({ ok: true, exact: true });
    expect(checkJa('ちょっとまって', furi)).toEqual({ ok: true, exact: true });
    expect(checkJa('学校', '学校[がっこう]').ok).toBe(true);
    expect(checkJa('がっこう', '学校[がっこう]').ok).toBe(true);
    // 多個漢字段可以各自選寫法
    const f2 = '日本語[にほんご]を話[はな]します';
    expect(checkJa('日本語をはなします', f2).ok).toBe(true);
    expect(checkJa('にほんごを話します', f2).ok).toBe(true);
  });

  it('讀音差一點就算錯（促音、長音、清濁音）', () => {
    expect(checkJa('がこう', '学校[がっこう]').ok).toBe(false);
    expect(checkJa('かっこう', '学校[がっこう]').ok).toBe(false);
    expect(checkJa('学', '学校[がっこう]').ok).toBe(false);
    expect(checkJa('', '学校[がっこう]').ok).toBe(false);
  });

  it('忽略空白與標點，全形半形都可以', () => {
    expect(checkJa('何 してる の？', '何[なに]してるの').ok).toBe(true);
    expect(checkJa('なにしてるの。', '何[なに]してるの').ok).toBe(true);
    expect(checkJa('ｺｰﾋｰ', 'コーヒー')).toEqual({ ok: true, exact: true });
    expect(normJa('Ｗｉ－Ｆｉ　ですか？')).toBe('wi-fiですか');
  });

  it('平假名／片假名打錯：算對，但標記為不完全吻合（畫面會提醒標準寫法）', () => {
    expect(checkJa('こーひー', 'コーヒー')).toEqual({ ok: true, exact: false });
    expect(checkJa('スゴイ', 'すごい')).toEqual({ ok: true, exact: false });
  });

  it('提示只透露第一個假名和長度', () => {
    expect(readingOf('学校[がっこう]')).toBe('がっこう');
    expect(kanaHint('学校[がっこう]')).toBe('が・・・');
    expect(kanaHint('何[なに]してるの')).toBe('な・・・・・');
  });
});

describe('日文打字出題', () => {
  const words: VocabItem[] = [
    ja('学校[がっこう]', '學校'),
    ja('駅[えき]', '車站'),
    ja('病院[びょういん]', '醫院'),
    ja('公園[こうえん]', '公園'),
    ja('ちょっと 待[ま]って', '等一下'),
  ].map((w, k) => ({ ...w, id: `ja.test:${k}` }));
  const ctx = (o: Partial<Ctx> = {}): Ctx => ({ lang: 'ja', rng: () => 0, canListen: true, typing: true, ...o });

  it('看中文打日文：答案帶振假名標註，準備好改出的選擇題', () => {
    const e = typeWordEx(words[0], words, ctx())!;
    expect(e.t).toBe('typeword');
    expect(e.mode).toBe('m2w');
    expect(e.answer).toBe('学校[がっこう]');
    expect(e.prompt?.s).toBe('學校');
    expect(e.fallback.t).toBe('choice');
    expect(e.fallback.itemId).toBe(e.itemId);
  });

  it('聽打：沒有日文語音時改成看中文', () => {
    expect(typeWordEx(words[4], words, ctx(), 'listen')!.mode).toBe('listen');
    expect(typeWordEx(words[4], words, ctx({ canListen: false }), 'listen')!.mode).toBe('m2w');
  });

  it('產出題：開啟打字題時日文會出打字題；關掉或其他語言不會', () => {
    expect(produce(words[1], words, ctx()).t).toBe('typeword');
    expect(produce(words[1], words, ctx({ typing: false })).t).not.toBe('typeword');
    expect(typeWordEx({ ...words[1], id: 'en.x:1' }, words, ctx({ lang: 'en' }))).toBeNull();
  });
});

describe('短句的羅馬拼音', () => {
  it('一個詞一個詞轉，助詞は／へ唸 wa／e', async () => {
    const { romajiOf } = await import('../src/engine/romaji');
    const card = ja('カード は 使[つか]えます か', '可以刷卡嗎？');
    expect(romajiOf(card)).toBe('kaado wa tsukaemasu ka');
    expect(romajiOf(ja('学校[がっこう] へ 行[い]きます', '去學校'))).toBe('gakkou e ikimasu');
    expect(romajiOf(ja('こんにちは', '你好', undefined, { kind: 'phrase' }))).toBe('konnichiwa');
    expect(romajiOf(ja('学校[がっこう]', '學校'))).toBe('gakkou');
  });
});
