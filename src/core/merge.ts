// 兩份存檔（例如筆電與手機）合併成一份。原則是「進度只增不減」：
// 段位 XP、星等、成就、統計取較大值；單字熟練度取最後作答的那一份；
// 設定、金幣這類會來回變動的值，取最後修改的那一份。
//
// 限制：兩台裝置在「都沒連網」的情況下各自學習，XP 取的是較大值而不是相加，
// 其中一台離線期間多拿的 XP 會少算。平常開 App 就會同步，實際上很少發生。
import type { ItemProg, StreakState } from './logic';
import type { DayLog, LessonRec, MockRec, MysteryState, Save } from './save';
import type { CustomSong, SongLyrics } from './songs';
import { LANGS } from './types';

/** 每個數字欄位取較大值（a、b 的欄位都是數字） */
const maxKeys = <T extends object>(a: T, b: T): T => {
  const out = { ...a } as Record<string, number>;
  for (const [k, v] of Object.entries(b) as [string, number][]) out[k] = Math.max(out[k] ?? 0, v ?? 0);
  return out as T;
};

function mergeRecord<T>(a: Record<string, T>, b: Record<string, T>, pick: (x: T, y: T) => T): Record<string, T> {
  const out: Record<string, T> = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = k in out ? pick(out[k], v) : v;
  return out;
}

const union = (a: string[] = [], b: string[] = []) => [...new Set([...a, ...b])];

function mergeDay(a: DayLog, b: DayLog): DayLog {
  const out: DayLog = {
    xp: maxKeys(a.xp, b.xp),
    lessons: Math.max(a.lessons, b.lessons),
    perfect: Math.max(a.perfect, b.perfect),
    combo: Math.max(a.combo, b.combo),
    reviews: Math.max(a.reviews, b.reviews),
    crossword: Math.max(a.crossword, b.crossword),
    match: Math.max(a.match, b.match),
    blitz: Math.max(a.blitz, b.blitz),
    words: Math.max(a.words, b.words),
  };
  if (a.goal || b.goal) out.goal = true;
  if (a.tri || b.tri) out.tri = true;
  if (a.chest || b.chest) out.chest = true;
  if ((a.frozen || b.frozen) && !LANGS.some((l) => out.xp[l] > 0)) out.frozen = true;
  const cw = { ...a.dailyCw };
  for (const l of LANGS) if (b.dailyCw?.[l]) cw[l] = true;
  if (Object.keys(cw).length) out.dailyCw = cw;
  const claimed = union(a.claimed, b.claimed);
  if (claimed.length) out.claimed = claimed;
  return out;
}

/** 單字熟練度：取最後作答的那一份 */
const pickItem = (x: ItemProg, y: ItemProg) => (y.t > x.t || (y.t === x.t && y.ok + y.ng > x.ok + x.ng) ? y : x);

const pickLesson = (x: LessonRec, y: LessonRec): LessonRec => ({ stars: Math.max(x.stars, y.stars), plays: Math.max(x.plays, y.plays) });

/** 模擬考：最佳成績、次數取較大值；「上一次」取比較晚考的那份 */
const pickMock = (x: MockRec, y: MockRec): MockRec => ({
  best: Math.max(x.best, y.best),
  plays: Math.max(x.plays, y.plays),
  last: y.at > x.at ? y.last : x.last,
  at: Math.max(x.at, y.at),
});

function mergeStreak(a: StreakState, b: StreakState, newerCoins: StreakState): StreakState {
  const best = Math.max(a.best, b.best);
  // 最後學習日比較晚的那份才是最新的連勝狀態
  if (a.last !== b.last) return { ...(a.last > b.last ? a : b), best };
  return { last: a.last, count: Math.max(a.count, b.count), best, freezes: newerCoins.freezes };
}

/** 神秘商品：日期比較新的那份；同一天就合併「揭曉了」「買了」 */
function mergeMystery(a: MysteryState, b: MysteryState): MysteryState {
  if (a.day !== b.day) return a.day > b.day ? a : b;
  return { day: a.day, offer: a.offer ?? b.offer, bought: a.bought || b.bought || undefined };
}

/** 歌詞：每首歌取最後修改的那份 */
const pickLyrics = (x: SongLyrics, y: SongLyrics): SongLyrics => (y.at > x.at ? y : x);

/** 自己加的歌：用 id 合併，同一首取最後修改的那份 */
function mergeCustomSongs(a: CustomSong[], b: CustomSong[]): CustomSong[] {
  const out = new Map(a.map((s) => [s.id, s]));
  for (const s of b) {
    const old = out.get(s.id);
    if (!old || s.at > old.at) out.set(s.id, s);
  }
  return [...out.values()].sort((x, y) => x.at - y.at);
}

export function mergeSaves(a: Save, b: Save): Save {
  const prefs = b.prefsAt > a.prefsAt ? b : a;
  const coins = b.coinsAt > a.coinsAt ? b : a;
  // 秒數類的紀錄取較短的
  const fastest = (x: Partial<Record<string, number>>, y: Partial<Record<string, number>>) => {
    const out = { ...x };
    for (const [l, v] of Object.entries(y)) if (v !== undefined) out[l] = out[l] === undefined ? v : Math.min(out[l]!, v);
    return out;
  };
  return {
    v: 1,
    created: Math.min(a.created, b.created),
    day: a.day > b.day ? a.day : b.day,
    name: prefs.name,
    avatar: prefs.avatar,
    avatars: union(a.avatars, b.avatars),
    settings: prefs.settings,
    stage: prefs.stage,
    prefsAt: prefs.prefsAt,
    xp: maxKeys(a.xp, b.xp),
    coins: coins.coins,
    coinsAt: coins.coinsAt,
    coinsEarned: Math.max(a.coinsEarned, b.coinsEarned),
    streak: mergeStreak(a.streak, b.streak, coins.streak),
    boostUntil: Math.max(a.boostUntil, b.boostUntil),
    days: mergeRecord(a.days, b.days, mergeDay),
    lessons: mergeRecord(a.lessons, b.lessons, pickLesson),
    items: mergeRecord(a.items, b.items, pickItem),
    ach: mergeRecord(a.ach, b.ach, Math.min),
    eggs: mergeRecord(a.eggs, b.eggs, Math.min),
    mocks: mergeRecord(a.mocks, b.mocks, pickMock),
    guide: mergeRecord(a.guide, b.guide, Math.min),
    stats: maxKeys(a.stats, b.stats),
    best: { blitz: maxKeys(a.best.blitz, b.best.blitz), match: fastest(a.best.match, b.best.match), memory: fastest(a.best.memory, b.best.memory), tf: maxKeys(a.best.tf, b.best.tf) },
    // 外觀只增不減；穿戴取最後修改設定的那份；道具和金幣一起取最後變動的那份；貼紙張數取較大值
    owned: union(a.owned, b.owned),
    equip: prefs.equip,
    inv: coins.inv,
    stickers: maxKeys(a.stickers, b.stickers),
    mystery: mergeMystery(a.mystery, b.mystery),
    songs: mergeRecord(a.songs, b.songs, pickLyrics),
    customSongs: mergeCustomSongs(a.customSongs, b.customSongs),
  };
}
