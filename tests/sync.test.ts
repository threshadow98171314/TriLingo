import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mergeSaves } from '../src/core/merge';
import { defaultSave, emptyDay, type Save } from '../src/core/save';

const base = (patch: Partial<Save> = {}): Save => ({ ...defaultSave(1000), ...patch });
const item = (s: number, t: number, ok = 1, ng = 0) => ({ s, due: 100, ok, ng, t });

describe('存檔合併', () => {
  it('新裝置連上雲端：拿到雲端的全部進度、設定與金幣', () => {
    const cloud = base({
      name: '小明',
      xp: { en: 500, ja: 1200, ko: 30 },
      coins: 220,
      coinsAt: 50,
      prefsAt: 40,
      settings: { ...defaultSave(0).settings, theme: 'light', dailyGoal: 100 },
      streak: { count: 9, best: 12, last: '2026-10-13', freezes: 1 },
      items: { 'ja.n5.place:学校': item(3, 900) },
      lessons: { 'ja.n5.place#1': { stars: 3, plays: 2 } },
      ach: { lesson_1: 777 },
    });
    const fresh = base();
    const m = mergeSaves(fresh, cloud);
    expect(m.name).toBe('小明');
    expect(m.xp).toEqual({ en: 500, ja: 1200, ko: 30 });
    expect(m.coins).toBe(220);
    expect(m.settings.theme).toBe('light');
    expect(m.streak).toEqual(cloud.streak);
    expect(m.items).toEqual(cloud.items);
    expect(m.lessons).toEqual(cloud.lessons);
    expect(m.ach).toEqual({ lesson_1: 777 });
  });

  it('兩邊學了不同的東西：課程、單字、成就都保留，星等與 XP 取較大值', () => {
    const laptop = base({
      xp: { en: 300, ja: 50, ko: 0 },
      items: { a: item(2, 10), shared: item(1, 10) },
      lessons: { L1: { stars: 2, plays: 1 }, L2: { stars: 1, plays: 1 } },
      ach: { first: 5, laptopOnly: 8 },
    });
    const phone = base({
      xp: { en: 120, ja: 400, ko: 10 },
      items: { b: item(1, 20), shared: item(4, 30) },
      lessons: { L1: { stars: 3, plays: 4 }, L3: { stars: 2, plays: 1 } },
      ach: { first: 3, phoneOnly: 9 },
    });
    const m = mergeSaves(laptop, phone);
    expect(m.xp).toEqual({ en: 300, ja: 400, ko: 10 });
    expect(Object.keys(m.items).sort()).toEqual(['a', 'b', 'shared']);
    // 同一個字：取最後作答（t 較大）的那一份
    expect(m.items.shared.s).toBe(4);
    expect(m.lessons).toEqual({ L1: { stars: 3, plays: 4 }, L2: { stars: 1, plays: 1 }, L3: { stars: 2, plays: 1 } });
    // 成就取最早解鎖的時間
    expect(m.ach).toEqual({ first: 3, laptopOnly: 8, phoneOnly: 9 });
  });

  it('設定看誰最後改；金幣看誰最後變動', () => {
    const a = base({ prefsAt: 100, coinsAt: 5, coins: 10, settings: { ...defaultSave(0).settings, sfx: false } });
    const b = base({ prefsAt: 50, coinsAt: 9, coins: 70 });
    const m = mergeSaves(a, b);
    expect(m.settings.sfx).toBe(false);
    expect(m.coins).toBe(70);
    expect(mergeSaves(b, a)).toEqual(m);
  });

  it('連勝：最後學習日較晚的為準；同一天則取較長的連勝', () => {
    const older = base({ streak: { count: 20, best: 20, last: '2026-10-01', freezes: 0 } });
    const newer = base({ streak: { count: 2, best: 5, last: '2026-10-14', freezes: 1 } });
    expect(mergeSaves(older, newer).streak).toEqual({ count: 2, best: 20, last: '2026-10-14', freezes: 1 });
    const sameDayA = base({ streak: { count: 7, best: 7, last: '2026-10-14', freezes: 0 } });
    const sameDayB = base({ streak: { count: 6, best: 9, last: '2026-10-14', freezes: 0 } });
    expect(mergeSaves(sameDayA, sameDayB).streak).toEqual({ count: 7, best: 9, last: '2026-10-14', freezes: 0 });
  });

  it('同一天的紀錄合併：XP 取大、領過的任務與每日填字都保留', () => {
    const d1 = { ...emptyDay(), xp: { en: 40, ja: 0, ko: 0 }, lessons: 2, claimed: ['xp'], dailyCw: { en: true } };
    const d2 = { ...emptyDay(), xp: { en: 10, ja: 30, ko: 0 }, lessons: 1, claimed: ['lessons'], goal: true };
    const m = mergeSaves(base({ days: { '2026-10-14': d1 } }), base({ days: { '2026-10-14': d2 } })).days['2026-10-14'];
    expect(m.xp).toEqual({ en: 40, ja: 30, ko: 0 });
    expect(m.lessons).toBe(2);
    expect(m.claimed?.sort()).toEqual(['lessons', 'xp']);
    expect(m.dailyCw).toEqual({ en: true });
    expect(m.goal).toBe(true);
  });

  it('自己貼的歌詞：每首歌取最後修改的那份；自己加的歌兩邊都保留', () => {
    const line = (ja: string, t?: number) => ({ ja, t });
    const a = base({
      songs: { goodday: { lines: [line('一行目', 3)], at: 100 }, irisout: { lines: [line('A')], at: 500 } },
      customSongs: [{ id: 'my-aaaaaaaaaaa', title: '歌A', artist: '', yt: 'aaaaaaaaaaa', at: 10 }],
    });
    const b = base({
      songs: { goodday: { lines: [line('一行目', 3), line('二行目', 6)], at: 200 }, irisout: { lines: [line('B')], at: 400 } },
      customSongs: [{ id: 'my-bbbbbbbbbbb', title: '歌B', artist: '', yt: 'bbbbbbbbbbb', at: 20 }],
    });
    const m = mergeSaves(a, b);
    expect(m.songs.goodday.lines).toHaveLength(2);
    expect(m.songs.irisout.lines[0].ja).toBe('A');
    expect(m.customSongs.map((x) => x.id)).toEqual(['my-aaaaaaaaaaa', 'my-bbbbbbbbbbb']);
  });

  it('合併是穩定的：同一份合併兩次不變（同步才不會一直來回上傳）', () => {
    const a = base({ xp: { en: 1, ja: 2, ko: 3 }, items: { x: item(2, 5) }, days: { d: { ...emptyDay(), lessons: 1 } }, coinsAt: 3, coins: 4 });
    const b = base({ xp: { en: 9, ja: 0, ko: 1 }, items: { y: item(1, 7) }, days: { d: { ...emptyDay(), perfect: 1 } }, prefsAt: 2, name: 'B' });
    const m = mergeSaves(a, b);
    expect(mergeSaves(m, m)).toEqual(m);
    expect(mergeSaves(m, a)).toEqual(m);
    expect(mergeSaves(m, b)).toEqual(m);
  });
});

// ───────── 兩台裝置透過（假的）GitHub Gist 同步 ─────────

class MemoryStorage {
  private m = new Map<string, string>();
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, String(v));
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}

/** 模擬 GitHub API：一個帳號、可以有多個 Gist */
function fakeGitHub(token: string) {
  const gists = new Map<string, Record<string, { content: string }>>();
  let seq = 0;
  const calls: string[] = [];
  const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  const fetchFn = async (input: string | URL | Request, init: RequestInit = {}) => {
    const url = new URL(String(input));
    const method = init.method ?? 'GET';
    calls.push(`${method} ${url.pathname}`);
    const auth = new Headers(init.headers).get('Authorization');
    if (auth !== `Bearer ${token}`) return json(401, { message: 'Bad credentials' });
    if (url.pathname === '/user') return json(200, { login: 'tester' });
    if (url.pathname === '/gists' && method === 'GET') return json(200, [...gists].map(([id, files]) => ({ id, files })));
    if (url.pathname === '/gists' && method === 'POST') {
      const id = `g${++seq}`;
      gists.set(id, JSON.parse(String(init.body)).files);
      return json(201, { id, files: gists.get(id) });
    }
    const m = url.pathname.match(/^\/gists\/(\w+)$/);
    if (m && gists.has(m[1])) {
      if (method === 'PATCH') gists.set(m[1], { ...gists.get(m[1]), ...JSON.parse(String(init.body)).files });
      return json(200, { id: m[1], files: gists.get(m[1]) });
    }
    return json(404, { message: 'Not Found' });
  };
  return { fetchFn, gists, calls };
}

/** 一台「裝置」：自己的 localStorage 與一份獨立載入的 store／cloud 模組 */
async function device(storage: MemoryStorage) {
  vi.stubGlobal('localStorage', storage);
  vi.resetModules();
  const store = await import('../src/core/store');
  const cloud = await import('../src/core/cloud');
  return { store, cloud, use: () => vi.stubGlobal('localStorage', storage) };
}

describe('雲端同步（兩台裝置）', () => {
  let gh: ReturnType<typeof fakeGitHub>;
  beforeEach(() => {
    gh = fakeGitHub('tok');
    vi.stubGlobal('fetch', gh.fetchFn);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('筆電上傳 → 手機連結後拿到進度 → 手機學的再同步回筆電', async () => {
    const laptopDisk = new MemoryStorage();
    const phoneDisk = new MemoryStorage();

    const laptop = await device(laptopDisk);
    laptop.store.finishGame({ lang: 'ja', game: 'listen', parts: [['test', 40]] });
    laptop.store.recordAnswer('ja.n5.place:学校', true, 'learn');
    expect((await laptop.cloud.connect('tok')).ok).toBe(true);
    expect(gh.gists.size).toBe(1);

    const phone = await device(phoneDisk);
    expect(phone.store.getSave().xp.ja).toBe(0);
    const res = await phone.cloud.connect('tok');
    expect(res.ok).toBe(true);
    expect(res.message).toContain('合併');
    expect(gh.gists.size).toBe(1); // 沿用同一個 Gist，不會再建一個
    expect(phone.store.getSave().xp.ja).toBe(40);
    expect(phone.store.getSave().items['ja.n5.place:学校']).toBeTruthy();

    // 手機學韓文，然後同步
    phone.store.finishGame({ lang: 'ko', game: 'listen', parts: [['test', 25]] });
    await phone.cloud.syncNow();

    // 回到筆電：同步後兩邊的進度都在
    laptop.use();
    await laptop.cloud.syncNow();
    expect(laptop.store.getSave().xp).toMatchObject({ ja: 40, ko: 25 });
    expect(laptopDisk.getItem('trilingo.save.v1')).toContain('"ko":25');

    // 沒有新進度時再同步：只讀不寫
    const before = gh.calls.length;
    await laptop.cloud.syncNow();
    expect(gh.calls.slice(before)).toEqual(['GET /gists/g1']);
  });

  it('權杖錯誤時不會連結，也不會動到本機進度', async () => {
    const d = await device(new MemoryStorage());
    d.store.finishGame({ lang: 'en', game: 'listen', parts: [['test', 10]] });
    const res = await d.cloud.connect('wrong');
    expect(res.ok).toBe(false);
    expect(res.message).toContain('權杖');
    expect(d.store.getSave().xp.en).toBe(10);
    expect(gh.gists.size).toBe(0);
  });

  it('雲端的 Gist 被刪掉時，下次同步會重新建立', async () => {
    const d = await device(new MemoryStorage());
    await d.cloud.connect('tok');
    gh.gists.clear();
    await d.cloud.syncNow();
    expect(gh.gists.size).toBe(1);
  });
});
