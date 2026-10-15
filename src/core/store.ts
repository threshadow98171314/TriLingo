// 全域狀態：存檔的讀寫，以及所有會改變存檔的動作（給 XP、完成課程、領任務、商店…）。
// 規則都集中在這裡，畫面只負責呼叫動作並顯示結果。
import { useSyncExternalStore } from 'react';
import { ACHIEVEMENTS } from './achievements';
import { celebrate, type Celebration } from './celebrate';
import { dayNum, nowMs, today } from './date';
import { DATE_EGGS, EGG_BY_ID, EGGS } from './eggData';
import { setFxEnabled } from './fx';
import { newProg, rolloverStreak, srsReview, srsTouch, touchStreak } from './logic';
import { CHEST_COINS, questsFor } from './quests';
import { rankOf } from './ranks';
import { randInt } from './rng';
import { defaultSave, emptyDay, migrate, type DayLog, type Save, type Settings } from './save';
import { setSfxEnabled } from './sfx';
import { setTtsPrefs } from './tts';
import { LANGS, type LangId, type Lesson, type Unit } from './types';
import { sum } from './util';

const KEY = 'trilingo.save.v1';

function load(): Save {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return migrate(JSON.parse(raw), nowMs());
  } catch {
    /* 存檔損毀或無法讀取：從頭開始 */
  }
  return defaultSave(nowMs());
}

let save: Save = load();
const subs = new Set<() => void>();
/** 存檔有變動時通知（雲端同步用） */
const commitListeners = new Set<() => void>();
let pending: Celebration[] = [];

function syncPrefs() {
  setSfxEnabled(save.settings.sfx);
  setTtsPrefs({ rate: save.settings.ttsRate, voices: save.settings.voices });
  setFxEnabled(save.settings.fx);
}
syncPrefs();

function commit(next: Save) {
  save = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* 容量已滿或無痕模式：進度只保留在這次開啟期間 */
  }
  subs.forEach((f) => f());
  commitListeners.forEach((f) => f());
  const events = pending;
  pending = [];
  // 彈窗晚一點出現，讓結算畫面先亮相
  for (const e of events) e.type === 'toast' ? celebrate(e) : setTimeout(() => celebrate(e), 900);
}

function rollDay(d: Save) {
  const t = today();
  if (d.day === t) return;
  const r = rolloverStreak(d.streak, t);
  d.streak = r.streak;
  for (const f of r.frozen) (d.days[f] ??= emptyDay()).frozen = true;
  if (r.frozen.length) {
    pending.push({
      type: 'toast',
      icon: '❄️',
      title: '連勝保護生效',
      text: `用掉 ${r.frozen.length} 個保護，${d.streak.count} 天連勝保住了！`,
    });
  }
  d.day = t;
  // 日期限定彩蛋：那一天打開 App 就會發現
  const egg = DATE_EGGS[t.slice(5)];
  if (egg) findEgg(d, egg);
}

/** 在存檔裡記錄發現了某個彩蛋；已經發現過就不重複給獎勵 */
function findEgg(d: Save, id: string): boolean {
  const e = EGG_BY_ID.get(id);
  if (!e || d.eggs[id]) return false;
  d.eggs[id] = Date.now();
  addCoins(d, e.coins);
  if (id === 'logo' && !d.avatars.includes('🦖')) d.avatars.push('🦖');
  const found = Object.keys(d.eggs).length;
  pending.push({
    type: 'toast',
    icon: e.icon,
    title: `發現彩蛋：${e.title}`,
    text: `${e.coins ? `＋${e.coins} 金幣　` : ''}彩蛋收藏 ${found} / ${EGGS.length}`,
  });
  return true;
}

function unlockAchievements(d: Save) {
  for (const a of ACHIEVEMENTS) {
    if (d.ach[a.id] || a.value(d) < a.goal) continue;
    d.ach[a.id] = nowMs();
    addCoins(d, a.coins);
    pending.push({ type: 'toast', icon: a.icon, title: `成就解鎖：${a.title}`, text: `${a.desc}　＋${a.coins} 金幣` });
  }
}

function mutate(fn: (d: Save) => void) {
  const d = structuredClone(save);
  rollDay(d);
  fn(d);
  unlockAchievements(d);
  commit(d);
}

const dayLog = (d: Save): DayLog => (d.days[today()] ??= emptyDay());

function addCoins(d: Save, n: number) {
  if (!n) return;
  d.coins += n;
  d.coinsEarned += n;
  d.coinsAt = Date.now();
}

export function getSave(): Save {
  return save;
}

export function useSave(): Save {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    getSave,
  );
}

/** 啟動時與回到分頁時做換日處理（連勝、每日任務） */
export function initStore() {
  mutate(() => {});
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && save.day !== today()) mutate(() => {});
  });
  // 同時開了兩個分頁：另一個分頁存檔時跟著更新，避免互相蓋掉進度
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY || !e.newValue) return;
    try {
      save = migrate(JSON.parse(e.newValue), nowMs());
      syncPrefs();
      subs.forEach((f) => f());
    } catch {
      /* 另一個分頁寫入了無法解析的內容：維持目前的狀態 */
    }
  });
}

// ───────── XP 與獎勵 ─────────

export interface Reward {
  lang: LangId;
  xp: number;
  /** 是否套用了雙倍 XP */
  boosted: boolean;
  before: number;
  after: number;
  streak: number;
  streakExtended: boolean;
  coins: number;
  goalHit: boolean;
  rankUp: boolean;
}

/** 一筆「項目 → XP」的明細 */
export type Part = [label: string, xp: number];

export interface Outcome {
  reward: Reward;
  parts: Part[];
  stars: number;
  passed: boolean;
  first: boolean;
  /** 隨機寶箱開出的金幣，沒有為 0 */
  chest: number;
  /** 是否刷新個人紀錄 */
  record: boolean;
  /** 全部第一次就答對 */
  perfect: boolean;
  /** 幸運星降臨（XP 加倍） */
  lucky: boolean;
  /** 開出黃金寶箱 */
  golden: boolean;
}

const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100, 200, 365];

function grantXp(d: Save, lang: LangId, base: number): Reward {
  const now = nowMs();
  const boosted = d.boostUntil > now && base > 0;
  const xp = boosted ? base * 2 : base;
  const before = d.xp[lang];
  const log = dayLog(d);
  let coins = 0;
  let streakExtended = false;
  let goalHit = false;

  if (xp > 0) {
    d.xp[lang] = before + xp;
    log.xp[lang] += xp;

    const st = touchStreak(d.streak, today());
    d.streak = st.streak;
    streakExtended = st.extended;
    if (st.extended && STREAK_MILESTONES.includes(d.streak.count)) {
      const bonus = Math.min(200, d.streak.count * 3);
      coins += bonus;
      pending.push({ type: 'streak', count: d.streak.count, coins: bonus });
    }

    if (!log.goal && sum(log.xp) >= d.settings.dailyGoal) {
      log.goal = true;
      goalHit = true;
      d.stats.goalDays++;
      coins += 10;
      pending.push({ type: 'toast', icon: '🎯', title: '達成今日目標！', text: `今天已獲得 ${sum(log.xp)} XP　＋10 金幣` });
    }
    if (!log.tri && LANGS.every((l) => log.xp[l] > 0)) {
      log.tri = true;
      d.stats.triDays++;
      coins += 15;
      pending.push({ type: 'toast', icon: '🌏', title: '三語全修！', text: '今天三種語言都練習了　＋15 金幣' });
    }

    const clock = new Date(now);
    const hour = clock.getHours();
    if (hour === 3) findEgg(d, 'threeam');
    if (hour === 12 && clock.getMinutes() === 34) findEgg(d, 'clock1234');
    if (hour >= 23 || hour < 4) d.stats.night++;
    else if (hour < 7) d.stats.early++;
  }

  const r0 = rankOf(before);
  const r1 = rankOf(d.xp[lang]);
  const rankUp = r1.step > r0.step;
  if (rankUp) {
    const bonus = r1.tier > r0.tier ? 50 : 15;
    coins += bonus;
    pending.push({ type: 'rank', lang, from: r0.step, to: r1.step, coins: bonus });
  }

  addCoins(d, coins);
  return { lang, xp, boosted, before, after: d.xp[lang], streak: d.streak.count, streakExtended, coins, goalHit, rankUp };
}

const total = (parts: Part[]) => parts.reduce((a, [, x]) => a + x, 0);

export type AnswerMode = 'learn' | 'review' | 'game';

/** 記錄一題的對錯，更新該項目的熟練度與複習排程 */
export function recordAnswer(itemId: string, correct: boolean, mode: AnswerMode) {
  mutate((d) => {
    const day = dayNum(today());
    const now = nowMs();
    const p = d.items[itemId];
    if (!p) {
      d.items[itemId] = newProg(correct, day, now);
      dayLog(d).words++;
    } else {
      d.items[itemId] = mode === 'review' ? srsReview(p, correct, day, now) : srsTouch(p, correct, day, now);
    }
    d.stats.answers++;
    if (correct) d.stats.correct++;
  });
}

export interface SessionStats {
  /** 計分的題數（重考不算） */
  graded: number;
  /** 第一次就答對的題數 */
  correct: number;
  maxCombo: number;
  seconds: number;
}

/** 單元測驗的及格門檻 */
export const BOSS_PASS = 0.8;

export function finishLesson(a: { lang: LangId; unit: Unit; lesson: Lesson; stats: SessionStats }): Outcome {
  let out!: Outcome;
  mutate((d) => {
    const { graded, correct, maxCombo } = a.stats;
    const acc = graded ? correct / graded : 1;
    const boss = !!a.lesson.boss;
    const prev = d.lessons[a.lesson.id];
    const first = !prev?.stars;
    const perfect = graded > 0 && correct === graded;
    const passed = !boss || acc >= BOSS_PASS;
    const stars = !passed ? 0 : boss ? (acc >= 0.95 ? 3 : acc >= 0.9 ? 2 : 1) : acc >= 0.95 ? 3 : acc >= 0.8 ? 2 : 1;

    const parts: Part[] = [];
    if (boss) {
      if (passed) {
        parts.push(['通過單元測驗', 20], ['答對題數', correct]);
        if (perfect) parts.push(['全對獎勵', 10]);
        if (first) parts.push(['首次通過', 30]);
      } else {
        parts.push(['參加獎', Math.max(2, Math.floor(correct / 2))]);
      }
    } else {
      parts.push(['完成課程', 10], ['答對題數', correct]);
      if (maxCombo >= 10) parts.push([`${maxCombo} 連擊`, 5]);
      else if (maxCombo >= 5) parts.push([`${maxCombo} 連擊`, 2]);
      if (perfect) parts.push(['全對獎勵', 5]);
      if (first) parts.push(['首次完成', 10]);
    }

    const log = dayLog(d);
    d.lessons[a.lesson.id] = { stars: Math.max(prev?.stars ?? 0, stars), plays: (prev?.plays ?? 0) + 1 };
    if (passed) {
      log.lessons++;
      d.stats.lessons++;
      if (perfect) {
        log.perfect++;
        d.stats.perfect++;
        d.stats.perfectRun++;
        d.stats.perfectRunBest = Math.max(d.stats.perfectRunBest, d.stats.perfectRun);
        if (!boss && a.stats.seconds <= 60) d.stats.speedruns++;
        if (boss) d.stats.bossPerfect++;
      } else {
        d.stats.perfectRun = 0;
      }
      if (!boss && graded >= 4 && acc < 0.5) d.stats.grit++;
    }
    if (boss && passed) {
      d.stats.bosses++;
      // 通過測驗＝整個單元完成：沒上過的課直接記為完成，單字也算學過（可用來跳級）
      for (const l of a.unit.lessons) if (!d.lessons[l.id]?.stars) d.lessons[l.id] = { stars: 1, plays: d.lessons[l.id]?.plays ?? 0 };
      const day = dayNum(today());
      for (const it of a.unit.items) {
        if (d.items[it.id]) continue;
        d.items[it.id] = newProg(true, day, nowMs());
        log.words++;
      }
    }
    log.combo = Math.max(log.combo, maxCombo);
    d.stats.maxCombo = Math.max(d.stats.maxCombo, maxCombo);

    // 幸運星：過關時有 5% 機率，這堂課的 XP 加倍
    const lucky = passed && Math.random() < 0.05;
    if (lucky) {
      parts.push(['幸運星：XP 加倍', total(parts)]);
      d.stats.luckyStars++;
      findEgg(d, 'lucky');
    }
    const reward = grantXp(d, a.lang, total(parts));
    // 不定時掉落的寶箱：25% 一般寶箱，3% 黃金寶箱
    let chest = 0;
    let golden = false;
    if (passed) {
      const r = Math.random();
      if (r < 0.03) {
        golden = true;
        chest = randInt(60, 120);
        d.stats.goldenChests++;
        findEgg(d, 'golden');
      } else if (r < 0.28) {
        chest = randInt(5, 20);
      }
      addCoins(d, chest);
    }
    out = { reward, parts, stars, passed, first, chest, record: false, perfect, lucky, golden };
  });
  return out;
}

export type GameId = 'review' | 'crossword' | 'match' | 'blitz' | 'listen' | 'typing';

export function finishGame(a: {
  lang: LangId;
  game: GameId;
  parts: Part[];
  /** 複習：作答的項目數 */
  count?: number;
  /** 限時快答：分數 */
  score?: number;
  /** 配對：秒數 */
  seconds?: number;
  maxCombo?: number;
  daily?: boolean;
}): Outcome {
  let out!: Outcome;
  mutate((d) => {
    const log = dayLog(d);
    const parts = [...a.parts];
    let record = false;
    if (a.game === 'review') {
      log.reviews += a.count ?? 0;
      d.stats.reviews += a.count ?? 0;
    } else if (a.game === 'crossword') {
      log.crossword++;
      d.stats.crosswords++;
      if (a.daily && !log.dailyCw?.[a.lang]) {
        log.dailyCw = { ...log.dailyCw, [a.lang]: true };
        d.stats.dailyCw++;
        parts.push(['每日填字獎勵', 20]);
      }
    } else if (a.game === 'match') {
      log.match++;
      d.stats.matches++;
      const best = d.best.match[a.lang];
      if (a.seconds !== undefined && (best === undefined || a.seconds < best)) {
        d.best.match[a.lang] = a.seconds;
        record = best !== undefined;
      }
    } else if (a.game === 'blitz') {
      const score = a.score ?? 0;
      log.blitz = Math.max(log.blitz, score);
      if (score > d.best.blitz[a.lang]) {
        record = d.best.blitz[a.lang] > 0;
        d.best.blitz[a.lang] = score;
      }
    } else if (a.game === 'typing') {
      d.stats.typings++;
    } else {
      d.stats.listens++;
    }
    if (a.maxCombo) {
      log.combo = Math.max(log.combo, a.maxCombo);
      d.stats.maxCombo = Math.max(d.stats.maxCombo, a.maxCombo);
    }
    const reward = grantXp(d, a.lang, total(parts));
    out = { reward, parts, stars: 0, passed: true, first: false, chest: 0, record, perfect: false, lucky: false, golden: false };
  });
  return out;
}

// ───────── 模擬考 ─────────

/** 交卷：記錄成績（答對率 0–100）並給 XP */
export function finishMock(a: { lang: LangId; examId: string; correct: number; total: number }): Outcome {
  let out!: Outcome;
  mutate((d) => {
    const pct = a.total ? Math.round((a.correct / a.total) * 100) : 0;
    const prev = d.mocks[a.examId];
    const record = !!prev && pct > prev.best;
    d.mocks[a.examId] = { best: Math.max(prev?.best ?? 0, pct), last: pct, plays: (prev?.plays ?? 0) + 1, at: nowMs() };
    d.stats.mocks++;
    const parts: Part[] = [
      ['完成模擬考', 15],
      ['答對題數', a.correct],
    ];
    if (pct >= 80) parts.push(['答對八成以上', 10]);
    if (record) parts.push(['刷新最佳成績', 10]);
    const reward = grantXp(d, a.lang, total(parts));
    out = { reward, parts, stars: 0, passed: true, first: !prev, chest: 0, record, perfect: a.total > 0 && a.correct === a.total, lucky: false, golden: false };
  });
  return out;
}

// ───────── 每日任務 ─────────

export function claimQuest(id: string): number {
  let got = 0;
  mutate((d) => {
    const t = today();
    const log = d.days[t];
    const q = questsFor(t).find((x) => x.id === id);
    if (!log || !q || log.claimed?.includes(id) || q.value(log) < q.target) return;
    log.claimed = [...(log.claimed ?? []), id];
    addCoins(d, q.coins);
    got = q.coins;
  });
  return got;
}

export function claimChest(): { coins: number; freeze: boolean } | null {
  let res: { coins: number; freeze: boolean } | null = null;
  mutate((d) => {
    const t = today();
    const log = d.days[t];
    if (!log || log.chest || !questsFor(t).every((q) => log.claimed?.includes(q.id))) return;
    log.chest = true;
    const coins = randInt(CHEST_COINS[0], CHEST_COINS[1]);
    addCoins(d, coins);
    const freeze = d.streak.freezes < SHOP.freeze.max && Math.random() < 0.3;
    if (freeze) d.streak.freezes++;
    res = { coins, freeze };
  });
  return res;
}

// ───────── 商店 ─────────

// 每天把任務做完大約能拿 70–100 金幣；價格以此為基準
export const SHOP = {
  freeze: { cost: 100, max: 2 },
  boost: { cost: 60, minutes: 15 },
  avatar: { cost: 50 },
  hint: { cost: 5 },
};

export const SHOP_AVATARS = ['🐼', '🐯', '🦁', '🐸', '🐧', '🦉', '🦄', '🐲', '🐙', '🤖', '👾', '👻'];

function pay(d: Save, cost: number): boolean {
  if (d.coins < cost) return false;
  d.coins -= cost;
  d.coinsAt = Date.now();
  return true;
}

export function buyFreeze(): boolean {
  let ok = false;
  mutate((d) => {
    if (d.streak.freezes >= SHOP.freeze.max || !pay(d, SHOP.freeze.cost)) return;
    d.streak.freezes++;
    ok = true;
  });
  return ok;
}

export function buyBoost(): boolean {
  let ok = false;
  mutate((d) => {
    if (!pay(d, SHOP.boost.cost)) return;
    d.boostUntil = Math.max(d.boostUntil, nowMs()) + SHOP.boost.minutes * 60000;
    ok = true;
  });
  return ok;
}

export function buyAvatar(emoji: string): boolean {
  let ok = false;
  mutate((d) => {
    if (d.avatars.includes(emoji) || !SHOP_AVATARS.includes(emoji) || !pay(d, SHOP.avatar.cost)) return;
    d.avatars.push(emoji);
    d.avatar = emoji;
    d.prefsAt = Date.now();
    ok = true;
  });
  return ok;
}

export function spendCoins(n: number): boolean {
  let ok = false;
  mutate((d) => {
    ok = pay(d, n);
  });
  return ok;
}

// ───────── 設定與存檔管理 ─────────

export function updateSettings(patch: Partial<Settings>) {
  mutate((d) => {
    d.settings = { ...d.settings, ...patch };
    d.prefsAt = Date.now();
  });
  syncPrefs();
}

export function setProfile(patch: { name?: string; avatar?: string }) {
  mutate((d) => {
    if (patch.name !== undefined) d.name = patch.name.trim().slice(0, 16) || '學習者';
    if (patch.avatar && d.avatars.includes(patch.avatar)) d.avatar = patch.avatar;
    d.prefsAt = Date.now();
  });
}

export function setStage(lang: LangId, stageId: string) {
  if (save.stage[lang] === stageId) return;
  mutate((d) => {
    d.stage[lang] = stageId;
  });
}

/** 發現彩蛋（第一次才給獎勵）；回傳是否為第一次發現 */
export function discoverEgg(id: string): boolean {
  let got = false;
  mutate((d) => {
    got = findEgg(d, id);
  });
  return got;
}

/** 存檔每次變動後呼叫 fn；回傳取消訂閱的函式 */
export function onCommit(fn: () => void): () => void {
  commitListeners.add(fn);
  return () => commitListeners.delete(fn);
}

/** 用另一份存檔（例如雲端合併後的結果）取代目前的存檔，並重新做換日處理 */
export function replaceSave(next: Save) {
  // day 清空：合併後的連勝可能來自另一台裝置，要重新檢查有沒有中斷
  commit({ ...migrate(next, nowMs()), day: '' });
  syncPrefs();
  mutate(() => {});
}

export function exportSave(): string {
  return JSON.stringify(save, null, 2);
}

export function importSave(json: string): boolean {
  try {
    const x: unknown = JSON.parse(json);
    if (!x || typeof x !== 'object' || !('xp' in x) || !('items' in x)) return false;
    commit(migrate(x, nowMs()));
    syncPrefs();
    mutate(() => {});
    return true;
  } catch {
    return false;
  }
}

export function resetSave() {
  commit(defaultSave(nowMs()));
  syncPrefs();
  mutate(() => {});
}
