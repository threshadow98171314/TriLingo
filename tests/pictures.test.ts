import { describe, expect, it } from 'vitest';
import { PICTURE_BY_ID } from '../src/art/pictures';
import { COURSE_LIST } from '../src/content/all';
import { ja } from '../src/content/dsl';
import type { VocabItem } from '../src/core/types';
import { isVocab, picEx, type Ctx } from '../src/engine/exercises';
import { PICTURE_IDS, PICTURE_ZH, pictureOf } from '../src/engine/pictures';

describe('圖片題的插畫', () => {
  it('每一張登記的圖都畫得出來；中文名稱不重複', () => {
    for (const id of PICTURE_IDS) expect(PICTURE_BY_ID.has(id), id).toBe(true);
    const names = PICTURE_IDS.map((id) => PICTURE_ZH[id][0]);
    expect(new Set(names).size).toBe(names.length);
  });

  it('意思裡任一個詞完全相同才算有圖', () => {
    expect(pictureOf('貓')).toBe('avatar:🐱');
    expect(pictureOf('雨傘；傘')).toBe('sticker:umbrella');
    expect(pictureOf('咖啡廳')).toBe('building:cafe');
    // 只是包含「書」這個字不算
    expect(pictureOf('書架')).toBeUndefined();
  });

  it('課程裡有不少單字配得到圖', () => {
    for (const c of COURSE_LIST) {
      const words = c.stages.flatMap((s) => s.units.flatMap((u) => u.items)).filter((i): i is VocabItem => isVocab(i) && i.kind !== 'char');
      const n = words.filter((w) => pictureOf(w.m)).length;
      console.log(`${c.id}: ${n} 個單字有圖`);
      expect(n, c.id).toBeGreaterThan(20);
    }
  });
});

describe('圖片題出題', () => {
  const words: VocabItem[] = [ja('猫[ねこ]', '貓'), ja('犬[いぬ]', '狗'), ja('駅[えき]', '車站'), ja('林檎[りんご]', '蘋果'), ja('本[ほん]', '書')].map((w, k) => ({ ...w, id: `ja.t:${k}` }));
  const ctx: Ctx = { lang: 'ja', rng: () => 0.3, canListen: true };

  it('看字選圖：四張不同的圖，正解是那個字的圖', () => {
    const e = picEx(words[0], words, ctx, 'w2pic')!;
    expect(e.mode).toBe('w2pic');
    expect(e.options).toHaveLength(4);
    expect(new Set(e.options.map((o) => o.pic)).size).toBe(4);
    expect(e.options[e.answer].pic).toBe('avatar:🐱');
    expect(e.audio?.text).toBe('ねこ');
  });

  it('看圖選字：題目是圖，選項是原文', () => {
    const e = picEx(words[3], words, ctx, 'pic2w')!;
    expect(e.pic).toBe('apple');
    expect(e.options[e.answer].s).toBe('りんご');
  });

  it('沒有圖的字不出圖片題', () => {
    expect(picEx({ ...words[0], m: '貓頭鷹的朋友' }, words, ctx, 'w2pic')).toBeNull();
  });
});
