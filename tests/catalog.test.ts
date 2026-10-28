// 商品目錄盤查：每一件商品都要畫得出來、特效與音效都存在、價錢合理、名稱不重複。
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AVATAR_ART_IDS, AVATAR_NAME } from '../src/art/avatars';
import { FRAME_ART_IDS } from '../src/art/items';
import { MascotArt } from '../src/art/mascot';
import { SCENE_IDS } from '../src/art/scenes';
import { FREE_AVATARS } from '../src/core/save';
import { SOUND_IDS } from '../src/core/sfx';
import {
  BGS,
  BURSTS,
  COSMETICS,
  FRAMES,
  GACHA10_COST,
  mysteryOffers,
  NAMES,
  OUTFITS,
  PETS,
  PREMIUM_AVATARS,
  SHOP_AVATARS,
  SKINS,
  SOUNDS,
  TITLES,
  WALLS,
} from '../src/core/shop';

const css = ['src/shop.css', 'src/styles.css', 'src/fx.css'].map((f) => readFileSync(f, 'utf8')).join('\n');

describe('商品目錄盤查', () => {
  it('頭像框、夥伴、頭像都有插畫，名稱齊全', () => {
    for (const f of FRAMES) expect(FRAME_ART_IDS, f.id).toContain(f.id);
    for (const p of PETS) expect(AVATAR_ART_IDS, p.id).toContain(p.id);
    for (const a of [...FREE_AVATARS, ...SHOP_AVATARS, ...PREMIUM_AVATARS]) {
      expect(AVATAR_NAME[a], a).toBeTruthy();
      expect(AVATAR_ART_IDS, a).toContain(a);
    }
  });

  it('名牌特效、名片背景、答對音效、喵師父裝扮都真的有東西', () => {
    for (const n of NAMES) expect(css, n.id).toContain(`.name-fx-${n.id}`);
    for (const b of BGS) expect(SCENE_IDS, b.id).toContain(b.id);
    for (const s of SOUNDS) expect(SOUND_IDS, s.id).toContain(s.id);
    // 網站背景：每一款都有深色和淺色兩套樣式
    for (const w of WALLS) {
      expect(css, w.id).toContain(`.wall-${w.id}`);
      expect(css, w.id).toContain(`[data-theme='light'] .wall-${w.id}`);
    }
    const plain = renderToStaticMarkup(createElement(MascotArt));
    for (const o of OUTFITS) expect(renderToStaticMarkup(createElement(MascotArt, { outfit: o.id })), o.id).not.toBe(plain);
  });

  it('稱號：每個都有等級，等級越高越難；特效都有樣式', () => {
    for (const t of TITLES) {
      expect(t.tier, t.id).toBeTruthy();
      if (t.fx) expect(css, t.id).toContain(`.tfx-${t.fx}`);
      // 金以上（不是神秘商品限定的）一定要達成條件才拿得到，銅銀一定能用金幣買
      if (!t.rare) expect(!!t.earn, t.id).toBe((t.tier ?? 1) >= 3);
      if (t.earn) expect(t.earn.goal, t.id).toBeGreaterThan(0);
    }
    // 傳說稱號的特效各不相同
    const legend = TITLES.filter((t) => t.tier === 5);
    expect(new Set(legend.map((t) => t.fx)).size).toBe(legend.length);
  });

  it('主題色是合法的色碼；答對特效的形狀都存在', () => {
    for (const s of SKINS) {
      expect(s.a, s.id).toMatch(/^#[0-9a-f]{6}$/i);
      expect(s.b, s.id).toMatch(/^#[0-9a-f]{6}$/i);
    }
    for (const b of BURSTS) expect((b.shapes?.length ?? 0) + (b.glyphs?.length ?? 0), b.id).toBeGreaterThan(0);
  });

  it('同一類的名稱與說明都不重複；價錢是 10 的倍數（只有「四季更迭」是象徵性的 1 金幣）', () => {
    for (const [kind, list] of Object.entries(COSMETICS)) {
      expect(new Set(list.map((c) => c.name)).size, kind).toBe(list.length);
      expect(new Set(list.map((c) => c.desc)).size, kind).toBe(list.length);
      for (const c of list) expect(c.cost % 10 === 0 || `${kind}:${c.id}` === 'ambient:season', `${kind}:${c.id}`).toBe(true);
    }
    expect(COSMETICS.ambient.find((c) => c.id === 'season')?.cost).toBe(1);
  });

  it('神秘商品：特價一定比原價便宜，同一種商品各格的價錢一致，不會出現達成條件的稱號', () => {
    const days = Array.from({ length: 120 }, (_, i) => `2027-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`);
    const gacha10 = new Set<number>();
    for (const day of days) {
      for (const o of mysteryOffers(day, () => false)) {
        if ('was' in o) expect(o.cost, JSON.stringify(o)).toBeLessThanOrEqual(o.was);
        if (o.kind === 'gacha10') {
          gacha10.add(o.cost);
          expect(o.was).toBe(GACHA10_COST);
        }
        if (o.kind === 'cosmetic' || o.kind === 'lucky') {
          expect(o.key.startsWith('title:') && TITLES.find((t) => `title:${t.id}` === o.key)?.earn, o.key).toBeFalsy();
          // 1 金幣的「四季更迭」不會出現在神秘商品（打折後變免費、福袋還比原價貴）
          expect(o.key, day).not.toBe('ambient:season');
          expect(o.cost, o.key).toBeGreaterThan(0);
        }
      }
    }
    expect(gacha10.size).toBeLessThanOrEqual(1);
  });
});
