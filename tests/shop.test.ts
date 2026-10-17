// 商店：道具、外觀、扭蛋、每日神秘商品，以及雲端同步時的合併規則。
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STICKER_BY_ID, STICKERS } from '../src/art/stickers';
import { mergeSaves } from '../src/core/merge';
import { mulberry32 } from '../src/core/rng';
import { defaultSave, migrate, type Save } from '../src/core/save';
import { AMBIENT_KINDS, TOTOP_KINDS } from '../src/core/fx';
import { AMBIENTS, ANIM_GACHA10_COST, COSMETICS, cosmeticKey, KIND_NAME, LOOK_GACHA_COST, MYSTERY_SLOTS, mysteryOffers, rollLook, rollSticker, TOTOPS } from '../src/core/shop';
import {
  buyConsumable,
  buyCosmetic,
  buyMystery,
  canHold,
  equipCosmetic,
  finishLesson,
  getSave,
  importSave,
  pullGacha,
  pullLook,
  resetSave,
  setBoard,
  revealMystery,
  spendHourglass,
  spendShield,
} from '../src/core/store';
import type { Lesson, Unit } from '../src/core/types';

const withCoins = (coins: number, patch: Partial<Save> = {}) => {
  importSave(JSON.stringify({ ...defaultSave(Date.now()), coins, ...patch }));
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 16, 10));
  resetSave();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('商品資料', () => {
  it('外觀的 id 在同一類裡不重複，價錢都大於 0', () => {
    for (const list of Object.values(COSMETICS)) {
      expect(new Set(list.map((c) => c.id)).size).toBe(list.length);
      for (const c of list) expect(c.cost, c.id).toBeGreaterThan(0);
    }
  });

  it('每一類外觀都有中文名稱；飄落特效與回頂特效都是特效引擎畫得出來的種類', () => {
    for (const kind of Object.keys(COSMETICS)) expect(KIND_NAME[kind as keyof typeof KIND_NAME], kind).toBeTruthy();
    for (const c of AMBIENTS) {
      expect(AMBIENT_KINDS, c.id).toContain(c.id);
      expect(c.icon, c.id).toBeTruthy();
    }
    for (const c of TOTOPS) {
      expect(TOTOP_KINDS as readonly string[], c.id).toContain(c.id);
      expect(c.icon, c.id).toBeTruthy();
    }
    // 楓葉（首頁秋天飄的那個）可以直接買，不是神秘商品限定
    expect(AMBIENTS.find((c) => c.id === 'leaf')?.rare).toBeFalsy();
  });

  it('貼紙 id 不重複，四種稀有度都有', () => {
    expect(new Set(STICKERS.map((s) => s.id)).size).toBe(STICKERS.length);
    expect(new Set(STICKERS.map((s) => s.rarity))).toEqual(new Set(['N', 'R', 'SR', 'SSR']));
  });
});

describe('道具', () => {
  it('金幣不夠或已達上限就買不了', () => {
    withCoins(150);
    expect(buyConsumable('freeze')).toBe(true);
    expect(getSave().coins).toBe(50);
    expect(buyConsumable('freeze')).toBe(false);
    withCoins(1000, { streak: { count: 0, best: 0, last: '', freezes: 2 } });
    expect(canHold(getSave(), 'freeze')).toBe(false);
    expect(buyConsumable('freeze')).toBe(false);
  });

  it('連擊護符：3 連擊以上答錯才會用掉', () => {
    withCoins(100);
    buyConsumable('shield');
    expect(spendShield(2)).toBe(false);
    expect(getSave().inv.shield).toBe(1);
    expect(spendShield(5)).toBe(true);
    expect(getSave().inv.shield).toBe(0);
    expect(spendShield(5)).toBe(false);
  });

  it('時光沙漏：用掉一個多 15 秒', () => {
    withCoins(100);
    buyConsumable('hourglass');
    expect(spendHourglass()).toBe(15_000);
    expect(spendHourglass()).toBe(0);
  });

  it('幸運草：接下來五堂課過關必定掉寶箱', () => {
    withCoins(100);
    buyConsumable('clover');
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const unit = { id: 'ja.t', items: [], lessons: [] } as unknown as Unit;
    const lesson = { id: 'ja.t#1', title: '', itemIds: [] } as Lesson;
    for (let i = 0; i < 5; i++) expect(finishLesson({ lang: 'ja', unit, lesson, stats: { graded: 5, correct: 5, maxCombo: 5, seconds: 90 } }).chest).toBeGreaterThan(0);
    expect(finishLesson({ lang: 'ja', unit, lesson, stats: { graded: 5, correct: 5, maxCombo: 5, seconds: 90 } }).chest).toBe(0);
  });
});

describe('外觀', () => {
  it('買了直接換上，可以取下再換上；稀有外觀不能直接買', () => {
    withCoins(500);
    expect(buyCosmetic(cosmeticKey('skin', 'sakura'))).toBe(true);
    expect(getSave().equip.skin).toBe('sakura');
    equipCosmetic('skin', null);
    expect(getSave().equip.skin).toBeUndefined();
    equipCosmetic('skin', 'sakura');
    expect(getSave().equip.skin).toBe('sakura');
    // 沒買過的不能換上
    equipCosmetic('skin', 'matcha');
    expect(getSave().equip.skin).toBe('sakura');
    expect(buyCosmetic(cosmeticKey('skin', 'gold'))).toBe(false);
  });
});

describe('扭蛋', () => {
  it('保底：指定最低稀有度時不會抽到更低的', () => {
    const rng = mulberry32(1);
    for (let i = 0; i < 200; i++) expect(['SR', 'SSR']).toContain(STICKER_BY_ID.get(rollSticker(rng, 'SR'))!.rarity);
  });

  it('機率大致符合：普通最多、傳說最少', () => {
    const rng = mulberry32(42);
    const count: Record<string, number> = {};
    for (let i = 0; i < 5000; i++) {
      const r = STICKER_BY_ID.get(rollSticker(rng))!.rarity;
      count[r] = (count[r] ?? 0) + 1;
    }
    expect(count.N).toBeGreaterThan(count.R);
    expect(count.R).toBeGreaterThan(count.SR);
    expect(count.SR).toBeGreaterThan(count.SSR);
  });

  it('十連抽：一次扣九次的錢、保底一張稀有以上、重複的換回金幣', () => {
    withCoins(450);
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const res = pullGacha(10)!;
    expect(res).toHaveLength(10);
    expect(res.some((r) => STICKER_BY_ID.get(r.id)!.rarity !== 'N')).toBe(true);
    // Math.random 固定：前九張都是同一張普通貼紙，第一張是新的，後面八張重複
    expect(res[0].fresh).toBe(true);
    expect(res.slice(1, 9).every((r) => !r.fresh && r.refund > 0)).toBe(true);
    expect(res.reduce((a, r) => a + r.refund, 0)).toBe(80);
    // 另外還有「第一張貼紙」成就的獎勵
    expect(getSave().coins).toBeGreaterThanOrEqual(80);
    expect(getSave().stats.gacha).toBe(10);
  });
});

describe('動態貼紙、外觀扭蛋與貼紙板', () => {
  it('一般扭蛋機不會出動態貼紙；動態貼紙扭蛋機只出會動的貼紙', () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 300; i++) expect(STICKER_BY_ID.get(rollSticker(rng))!.anim).toBeFalsy();
    for (let i = 0; i < 300; i++) expect(STICKER_BY_ID.get(rollSticker(rng, 'N', 'anim'))!.anim).toBe(true);
    // 動態貼紙每種稀有度都有（扭蛋才抽得到）
    for (const r of ['R', 'SR', 'SSR']) expect(STICKERS.some((x) => x.anim && x.rarity === r), r).toBe(true);
  });

  it('動態貼紙十連抽：扣錢、全部是動態貼紙、保底一張超稀有以上', () => {
    withCoins(ANIM_GACHA10_COST);
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const res = pullGacha(10, 'anim')!;
    expect(res).toHaveLength(10);
    expect(res.every((r) => STICKER_BY_ID.get(r.id)!.anim)).toBe(true);
    expect(['SR', 'SSR']).toContain(STICKER_BY_ID.get(res[9].id)!.rarity);
    expect(getSave().stats.gacha).toBe(10);
  });

  it('外觀扭蛋：抽到一件還沒有的外觀並收進外觀（不自動換上）；全部都有就給動態貼紙', () => {
    withCoins(LOOK_GACHA_COST);
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const r = pullLook()!;
    expect(r.kind).toBe('cosmetic');
    if (r.kind === 'cosmetic') {
      expect(getSave().owned).toContain(r.key);
      expect(Object.values(getSave().equip)).toHaveLength(0);
    }
    expect(getSave().coins).toBeLessThan(LOOK_GACHA_COST);
    expect(pullLook()).toBeNull();
    const all = rollLook(mulberry32(1), () => true);
    expect(all.kind).toBe('sticker');
    if (all.kind === 'sticker') expect(STICKER_BY_ID.get(all.id)!.anim).toBe(true);
  });

  it('貼紙板：每種貼紙最多貼擁有的張數；位置、大小、角度超出範圍會修正', () => {
    withCoins(0, { stickers: { onigiri: 2, sushi: 1 } });
    const it = (k: number, id: string, x = 0.5) => ({ k, id, x, y: 0.5, s: 0.2, r: 0 });
    setBoard({ items: [it(1, 'onigiri'), it(2, 'onigiri'), it(3, 'onigiri'), it(4, 'sushi'), it(5, 'ramen')] });
    expect(getSave().board.items.map((i) => i.id)).toEqual(['onigiri', 'onigiri', 'sushi']);
    setBoard({ items: [{ k: 1, id: 'sushi', x: 1.6, y: -2, s: 0.9, r: 400 }], bg: 'night' });
    expect(getSave().board).toMatchObject({ bg: 'night', items: [{ k: 1, id: 'sushi', x: 1, y: 0, s: 0.5, r: 40 }] });
    expect(getSave().board.at).toBeGreaterThan(0);
  });
});

describe('每日神秘商品', () => {
  it('每天三格：同一天看到的都一樣；已經擁有的不會出現；限定格一定是神秘商品才有的外觀', () => {
    const none = () => false;
    expect(mysteryOffers('2026-10-16', none)).toEqual(mysteryOffers('2026-10-16', none));
    expect(mysteryOffers('2026-10-16', none)).toHaveLength(MYSTERY_SLOTS.length);
    const days = Array.from({ length: 60 }, (_, i) => `2026-11-${String((i % 30) + 1).padStart(2, '0')}-${i}`);
    const gold = cosmeticKey('skin', 'gold');
    const all = days.flatMap((d) => mysteryOffers(d, (k: string) => k === gold));
    expect(all.some((o) => (o.kind === 'cosmetic' || o.kind === 'lucky') && o.key === gold)).toBe(false);
    const rares = new Set(
      Object.values(COSMETICS)
        .flat()
        .filter((c) => c.rare)
        .map((c) => cosmeticKey(c.kind, c.id)),
    );
    for (const d of days) {
      const o = mysteryOffers(d, none)[0];
      expect(o.kind === 'cosmetic' && rares.has(o.key)).toBe(true);
    }
  });

  it('揭曉後固定，每一格一天只能買一次', () => {
    withCoins(5000);
    const a = revealMystery();
    const b = revealMystery();
    expect(b).toEqual(a);
    expect(buyMystery(1)).not.toBeNull();
    expect(buyMystery(1)).toBeNull();
    expect(getSave().mystery.bought).toEqual([1]);
    // 隔天重新來過
    vi.setSystemTime(new Date(2026, 9, 17, 10));
    revealMystery();
    expect(getSave().mystery.bought).toBeUndefined();
  });

  it('外觀福袋：買了才揭曉，直接換上', () => {
    withCoins(5000);
    importSave(
      JSON.stringify({
        ...defaultSave(Date.now()),
        coins: 5000,
        mystery: { day: '2026-10-16', offers: [{ kind: 'lucky', key: cosmeticKey('frame', 'paw'), cost: 70, was: 120 }, { kind: 'gacha10', cost: 330, was: 450 }, { kind: 'pack', cost: 100, was: 200, items: [['shield', 2], ['hourglass', 9]] }] },
      }),
    );
    expect(buyMystery(0)).toEqual({ kind: 'lucky', key: cosmeticKey('frame', 'paw') });
    expect(getSave().equip.frame).toBe('paw');
    const g = buyMystery(1);
    expect(g?.kind === 'gacha10' && g.pulls).toHaveLength(10);
    // 道具福袋：超過上限（沙漏最多 5 個）的部分不給
    const p = buyMystery(2);
    expect(p).toEqual({ kind: 'pack', items: [['shield', 2], ['hourglass', 5]] });
    expect(getSave().inv.hourglass).toBe(5);
  });

  it('舊存檔一天只有一件：讀進來變成三格的格式', () => {
    const offer = { kind: 'coins', cost: 50, min: 20, max: 150 };
    const s = migrate({ ...defaultSave(1), mystery: { day: '2026-10-16', offer, bought: true } }, 2);
    expect(s.mystery).toEqual({ day: '2026-10-16', offers: [offer], bought: [0] });
  });
});

describe('雲端同步合併', () => {
  const base = (patch: Partial<Save> = {}): Save => ({ ...defaultSave(1000), ...patch });

  it('外觀只增不減；穿戴看誰最後改設定；道具跟著金幣；貼紙取較多的', () => {
    const a = base({ owned: ['skin:sakura'], equip: { skin: 'sakura' }, prefsAt: 10, coinsAt: 50, inv: { shield: 1, clover: 0, hourglass: 2 }, stickers: { onigiri: 2 } });
    const b = base({ owned: ['frame:gold'], equip: { frame: 'gold' }, prefsAt: 20, coinsAt: 40, inv: { shield: 3, clover: 5, hourglass: 0 }, stickers: { onigiri: 1, fuji: 1 } });
    const m = mergeSaves(a, b);
    expect(new Set(m.owned)).toEqual(new Set(['skin:sakura', 'frame:gold']));
    expect(m.equip).toEqual({ frame: 'gold' });
    expect(m.inv).toEqual({ shield: 1, clover: 0, hourglass: 2 });
    expect(m.stickers).toEqual({ onigiri: 2, fuji: 1 });
  });

  it('神秘商品：日期新的為準，同一天買過的格子兩邊都算', () => {
    const a = base({ mystery: { day: '2026-10-16', bought: [2] } });
    const b = base({ mystery: { day: '2026-10-16', bought: [0] } });
    expect(mergeSaves(a, b).mystery.bought).toEqual([0, 2]);
    const c = base({ mystery: { day: '2026-10-17' } });
    expect(mergeSaves(a, c).mystery.day).toBe('2026-10-17');
  });
});
