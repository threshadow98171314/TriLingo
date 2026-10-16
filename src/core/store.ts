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
import { STICKER_BY_ID } from '../art/stickers';
import type { SongLine } from './songs';
import { defaultSave, emptyDay, migrate, type DayLog, type Save, type Settings } from './save';
import {
  AVATAR_COST,
  CLOVER_LESSONS,
  CONSUMABLE_BY_ID,
  cosmeticKey,
  cosmeticOf,
  DUPE_REFUND,
  GACHA10_COST,
  GACHA_COST,
  HOURGLASS_MS,
  mysteryOffer,
  PREMIUM_AVATAR_COST,
  PREMIUM_AVATARS,
  rollSticker,
  SHOP_AVATARS,
  type ConsumableId,
  type CosmeticKind,
  type MysteryOffer,
} from './shop';
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

/**
 * 記錄一題的對錯，更新該項目的熟練度與複習排程。
 * helped：看了提示才答對，算答對但熟練度不往上加，隔天就排進複習。
 */
export function recordAnswer(itemId: string, correct: boolean, mode: AnswerMode, helped = false) {
  mutate((d) => {
    const day = dayNum(today());
    const now = nowMs();
    const p = d.items[itemId];
    if (!p) {
      d.items[itemId] = newProg(correct, day, now);
      dayLog(d).words++;
    } else if (correct && helped) {
      d.items[itemId] = { ...p, ok: p.ok + 1, due: Math.min(p.due, day + 1), t: now };
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
    // 不定時掉落的寶箱：25% 一般寶箱，3% 黃金寶箱；有幸運草時必定掉寶箱，黃金寶箱 10%
    let chest = 0;
    let golden = false;
    if (passed) {
      const luck = d.inv.clover > 0;
      if (luck) {
        d.inv.clover--;
        d.coinsAt = Date.now();
      }
      const r = Math.random();
      if (r < (luck ? 0.1 : 0.03)) {
        golden = true;
        chest = randInt(60, 120);
        d.stats.goldenChests++;
        findEgg(d, 'golden');
      } else if (luck || r < 0.28) {
        chest = randInt(5, 20);
      }
      addCoins(d, chest);
    }
    out = { reward, parts, stars, passed, first, chest, record: false, perfect, lucky, golden };
  });
  return out;
}

export type GameId = 'review' | 'crossword' | 'match' | 'blitz' | 'listen' | 'typing' | 'truefalse' | 'memory' | 'pics' | 'sort' | 'duel' | 'wordle' | 'chain';

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
  /** 額外給的金幣（卡牌對決通關等） */
  coins?: number;
  /** 卡牌對決通關、接龍對戰獲勝、猜詞猜中 */
  win?: boolean;
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
    } else if (a.game === 'pics') {
      d.stats.pics++;
    } else if (a.game === 'sort') {
      d.stats.sorts++;
    } else if (a.game === 'truefalse') {
      d.stats.truefalses++;
      const score = a.score ?? 0;
      if (score > (d.best.tf[a.lang] ?? 0)) {
        record = (d.best.tf[a.lang] ?? 0) > 0;
        d.best.tf[a.lang] = score;
      }
    } else if (a.game === 'duel') {
      d.stats.duels++;
      if (a.win) d.stats.duelWins++;
      const floor = a.score ?? 0;
      if (floor > (d.best.duel[a.lang] ?? 0)) {
        record = (d.best.duel[a.lang] ?? 0) > 0;
        d.best.duel[a.lang] = floor;
      }
    } else if (a.game === 'chain') {
      d.stats.chains++;
      if (a.win) d.stats.chainWins++;
      const score = a.score ?? 0;
      if (score > (d.best.chain[a.lang] ?? 0)) {
        record = (d.best.chain[a.lang] ?? 0) > 0;
        d.best.chain[a.lang] = score;
      }
    } else if (a.game === 'wordle') {
      if (a.win) d.stats.wordles++;
      if (a.daily && !log.dailyWordle?.[a.lang]) {
        log.dailyWordle = { ...log.dailyWordle, [a.lang]: true };
        if (a.win) parts.push(['每日猜詞獎勵', 15]);
      }
    } else if (a.game === 'memory') {
      d.stats.memories++;
      const best = d.best.memory[a.lang];
      if (a.seconds !== undefined && (best === undefined || a.seconds < best)) {
        d.best.memory[a.lang] = a.seconds;
        record = best !== undefined;
      }
    } else {
      d.stats.listens++;
    }
    if (a.maxCombo) {
      log.combo = Math.max(log.combo, a.maxCombo);
      d.stats.maxCombo = Math.max(d.stats.maxCombo, a.maxCombo);
    }
    const reward = grantXp(d, a.lang, total(parts));
    if (a.coins) {
      addCoins(d, a.coins);
      reward.coins += a.coins;
    }
    out = { reward, parts, stars: 0, passed: true, first: false, chest: 0, record, perfect: false, lucky: false, golden: false };
  });
  return out;
}

// ───────── 觀念講堂 ─────────

/** 讀完一篇觀念文章並做完小測驗：記星等（存在 lessons 裡，key 是文章 id）並給 XP */
export function finishConcept(a: { lang: LangId; id: string; stats: SessionStats }): Outcome {
  let out!: Outcome;
  mutate((d) => {
    const { graded, correct } = a.stats;
    const acc = graded ? correct / graded : 1;
    const stars = acc >= 0.95 ? 3 : acc >= 0.7 ? 2 : 1;
    const prev = d.lessons[a.id];
    const first = !prev?.stars;
    d.lessons[a.id] = { stars: Math.max(prev?.stars ?? 0, stars), plays: (prev?.plays ?? 0) + 1 };
    d.stats.concepts++;
    const parts: Part[] = [
      ['讀完觀念＋小測驗', 5],
      ['答對題數', correct],
    ];
    if (first) parts.push(['第一次完成', 5]);
    const reward = grantXp(d, a.lang, total(parts));
    out = { reward, parts, stars, passed: true, first, chest: 0, record: false, perfect: graded > 0 && correct === graded, lucky: false, golden: false };
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
    const freeze = canHold(d, 'freeze') && Math.random() < 0.3;
    if (freeze) d.streak.freezes++;
    res = { coins, freeze };
  });
  return res;
}

// ───────── 商店 ─────────

function pay(d: Save, cost: number): boolean {
  if (d.coins < cost) return false;
  d.coins -= cost;
  d.coinsAt = Date.now();
  return true;
}

/** 目前持有幾個（幸運草換算成幾片：一片管 5 堂課） */
export function heldOf(s: Save, id: ConsumableId): number {
  switch (id) {
    case 'freeze':
      return s.streak.freezes;
    case 'shield':
      return s.inv.shield;
    case 'clover':
      return Math.ceil(s.inv.clover / CLOVER_LESSONS);
    case 'hourglass':
      return s.inv.hourglass;
    default:
      return 0;
  }
}

export function canHold(s: Save, id: ConsumableId, n = 1): boolean {
  const max = CONSUMABLE_BY_ID.get(id)?.max;
  return max === undefined || heldOf(s, id) + n <= max;
}

function give(d: Save, id: ConsumableId, n = 1) {
  const now = nowMs();
  switch (id) {
    case 'freeze':
      d.streak.freezes += n;
      break;
    case 'boost':
      d.boostUntil = Math.max(d.boostUntil, now) + 15 * 60000 * n;
      break;
    case 'boost60':
      d.boostUntil = Math.max(d.boostUntil, now) + 60 * 60000 * n;
      break;
    case 'shield':
      d.inv.shield += n;
      break;
    case 'clover':
      d.inv.clover += CLOVER_LESSONS * n;
      break;
    case 'hourglass':
      d.inv.hourglass += n;
      break;
  }
  d.coinsAt = Date.now();
}

/** 買道具 */
export function buyConsumable(id: ConsumableId): boolean {
  let ok = false;
  mutate((d) => {
    const c = CONSUMABLE_BY_ID.get(id);
    if (!c || !canHold(d, id) || !pay(d, c.cost)) return;
    give(d, id);
    ok = true;
  });
  return ok;
}

export function buyAvatar(emoji: string): boolean {
  let ok = false;
  mutate((d) => {
    const cost = PREMIUM_AVATARS.includes(emoji) ? PREMIUM_AVATAR_COST : SHOP_AVATARS.includes(emoji) ? AVATAR_COST : 0;
    if (!cost || d.avatars.includes(emoji) || !pay(d, cost)) return;
    d.avatars.push(emoji);
    d.avatar = emoji;
    d.prefsAt = Date.now();
    ok = true;
  });
  return ok;
}

/** 買外觀（頭像框、主題色、答對特效、稱號、喵師父裝扮），買了直接換上 */
export function buyCosmetic(key: string): boolean {
  let ok = false;
  mutate((d) => {
    const c = cosmeticOf(key);
    if (!c || c.rare || d.owned.includes(key) || !pay(d, c.cost)) return;
    d.owned.push(key);
    d.equip[c.kind] = c.id;
    d.prefsAt = Date.now();
    ok = true;
  });
  return ok;
}

/** 換上或拿掉外觀（id 為 null 時拿掉） */
export function equipCosmetic(kind: CosmeticKind, id: string | null) {
  mutate((d) => {
    if (id && !d.owned.includes(cosmeticKey(kind, id))) return;
    if (id) d.equip[kind] = id;
    else delete d.equip[kind];
    d.prefsAt = Date.now();
  });
}

export interface GachaPull {
  id: string;
  /** 第一次抽到 */
  fresh: boolean;
  /** 重複的貼紙換回的金幣 */
  refund: number;
}

function addSticker(d: Save, id: string): GachaPull {
  const fresh = !d.stickers[id];
  d.stickers[id] = (d.stickers[id] ?? 0) + 1;
  const st = STICKER_BY_ID.get(id);
  const refund = fresh || !st ? 0 : DUPE_REFUND[st.rarity];
  addCoins(d, refund);
  return { id, fresh, refund };
}

/** 扭蛋：抽一次或十連抽（十連抽保底一張稀有以上） */
export function pullGacha(n: 1 | 10): GachaPull[] | null {
  let out: GachaPull[] | null = null;
  mutate((d) => {
    if (!pay(d, n === 10 ? GACHA10_COST : GACHA_COST)) return;
    const res: GachaPull[] = [];
    for (let i = 0; i < n; i++) {
      const last = n === 10 && i === n - 1;
      const rare = res.some((r) => STICKER_BY_ID.get(r.id)?.rarity !== 'N');
      res.push(addSticker(d, rollSticker(Math.random, last && !rare ? 'R' : 'N')));
    }
    d.stats.gacha += n;
    out = res;
  });
  return out;
}

/** 揭曉今天的神秘商品（揭曉後一整天固定不變） */
export function revealMystery(): MysteryOffer {
  let offer!: MysteryOffer;
  mutate((d) => {
    const t = today();
    if (d.mystery.day !== t) d.mystery = { day: t };
    d.mystery.offer ??= mysteryOffer(t, (k) => (k.startsWith('avatar:') ? d.avatars.includes(k.slice(7)) : d.owned.includes(k)));
    offer = d.mystery.offer;
  });
  return offer;
}

export type MysteryResult =
  | { kind: 'avatar'; id: string }
  | { kind: 'cosmetic'; key: string }
  | ({ kind: 'sticker' } & GachaPull)
  | { kind: 'coins'; n: number }
  | { kind: 'boost60' }
  | { kind: 'freeze2' };

/** 神秘商品現在買不買得了（例如連勝保護已經滿了就不行） */
export function mysteryBlocked(s: Save, offer: MysteryOffer): string | null {
  if (offer.kind === 'freeze2' && !canHold(s, 'freeze', 2)) return '連勝保護已經滿了';
  if (offer.kind === 'avatar' && s.avatars.includes(offer.id)) return '已經擁有';
  if (offer.kind === 'cosmetic' && s.owned.includes(offer.key)) return '已經擁有';
  return null;
}

export function buyMystery(): MysteryResult | null {
  let res: MysteryResult | null = null;
  mutate((d) => {
    const t = today();
    const offer = d.mystery.day === t ? d.mystery.offer : undefined;
    if (!offer || d.mystery.bought || mysteryBlocked(d, offer) || !pay(d, offer.cost)) return;
    switch (offer.kind) {
      case 'avatar':
        d.avatars.push(offer.id);
        d.avatar = offer.id;
        d.prefsAt = Date.now();
        res = { kind: 'avatar', id: offer.id };
        break;
      case 'cosmetic': {
        const c = cosmeticOf(offer.key);
        if (c) {
          d.owned.push(offer.key);
          d.equip[c.kind] = c.id;
          d.prefsAt = Date.now();
        }
        res = { kind: 'cosmetic', key: offer.key };
        break;
      }
      case 'sticker':
        res = { kind: 'sticker', ...addSticker(d, rollSticker(Math.random, offer.min)) };
        break;
      case 'coins': {
        const n = randInt(offer.min, offer.max);
        addCoins(d, n);
        res = { kind: 'coins', n };
        break;
      }
      case 'boost60':
        give(d, 'boost60');
        res = { kind: 'boost60' };
        break;
      case 'freeze2':
        give(d, 'freeze', 2);
        res = { kind: 'freeze2' };
        break;
    }
    d.mystery.bought = true;
  });
  return res;
}

/** 練習中答錯：有連擊護符而且連擊夠多就用掉一個，連擊不歸零 */
export function spendShield(combo: number): boolean {
  if (combo < 3 || save.inv.shield <= 0) return false;
  mutate((d) => {
    d.inv.shield--;
    d.coinsAt = Date.now();
  });
  return true;
}

/** 限時快答開始：有時光沙漏就用掉一個，回傳多出來的毫秒數 */
export function spendHourglass(): number {
  if (save.inv.hourglass <= 0) return 0;
  mutate((d) => {
    d.inv.hourglass--;
    d.coinsAt = Date.now();
  });
  return HOURGLASS_MS;
}

export function spendCoins(n: number): boolean {
  let ok = false;
  mutate((d) => {
    ok = pay(d, n);
  });
  return ok;
}

// ───────── 聽日文歌學日語 ─────────

/** 存使用者貼上的歌詞（含翻譯與對時）；lines 為空就刪掉 */
export function saveLyrics(songId: string, lines: SongLine[]) {
  mutate((d) => {
    if (!lines.length) delete d.songs[songId];
    else d.songs[songId] = { lines, at: Date.now() };
  });
}

/** 加一首自己的歌（任何 YouTube 影片）；回傳歌的 id */
export function addCustomSong(a: { title: string; artist: string; yt: string }): string {
  const id = `my-${a.yt}`;
  mutate((d) => {
    const rest = d.customSongs.filter((s) => s.id !== id);
    d.customSongs = [...rest, { id, title: a.title.trim() || '我的歌', artist: a.artist.trim(), yt: a.yt, at: Date.now() }];
  });
  return id;
}

export function removeCustomSong(id: string) {
  mutate((d) => {
    d.customSongs = d.customSongs.filter((s) => s.id !== id);
    delete d.songs[id];
  });
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

// ───────── 新手引導 ─────────

/** 標記某個說明已經看過（看過就不再跳出） */
export function markGuide(...ids: string[]) {
  if (ids.every((id) => save.guide[id])) return;
  mutate((d) => {
    for (const id of ids) d.guide[id] ??= nowMs();
  });
}

/** 重新顯示所有說明（設定頁） */
export function resetGuides() {
  mutate((d) => {
    d.guide = {};
  });
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
