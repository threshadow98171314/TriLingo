// 成就：value(存檔) 達到 goal 就解鎖，同時可以拿來畫進度條。
import { EGGS } from './eggData';
import { rankOf, TIERS } from './ranks';
import type { Save } from './save';
import { LANGS } from './types';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  coins: number;
  goal: number;
  value: (s: Save) => number;
  group: string;
  /** 隱藏成就：解鎖前只顯示提示 */
  hidden?: boolean;
  hint?: string;
}

const words = (s: Save) => Object.keys(s.items).length;
const tiers = (s: Save) => LANGS.map((l) => rankOf(s.xp[l]).tier);
const maxTier = (s: Save) => Math.max(...tiers(s));
const minTier = (s: Save) => Math.min(...tiers(s));
const bestBlitz = (s: Save) => Math.max(...LANGS.map((l) => s.best.blitz[l] ?? 0));
const eggs = (s: Save) => Object.keys(s.eggs).length;
const busiestDay = (s: Save) => Math.max(0, ...Object.values(s.days).map((d) => d.lessons));
const mockBest = (s: Save) => Math.max(0, ...Object.values(s.mocks).map((m) => m.best));
const mockLangs = (s: Save) => new Set(Object.keys(s.mocks).map((id) => id.slice(0, 2))).size;

const secret = (id: string, icon: string, title: string, desc: string, hint: string, goal: number, value: (s: Save) => number, coins: number): Achievement => ({
  group: '隱藏成就',
  id,
  icon,
  title,
  desc,
  hint,
  goal,
  value,
  coins,
  hidden: true,
});

const a = (
  group: string,
  id: string,
  icon: string,
  title: string,
  desc: string,
  goal: number,
  value: (s: Save) => number,
  coins: number,
): Achievement => ({ group, id, icon, title, desc, goal, value, coins });

const RANK_ICONS = ['', '🥉', '🥈', '🥇', '💠', '💎', '🔮', '🏵️', '🔥', '👑'];

export const ACHIEVEMENTS: Achievement[] = [
  a('學習', 'lesson_1', '🎬', '踏出第一步', '完成第一堂課', 1, (s) => s.stats.lessons, 10),
  a('學習', 'lesson_10', '📘', '漸入佳境', '完成 10 堂課', 10, (s) => s.stats.lessons, 20),
  a('學習', 'lesson_50', '📚', '好學不倦', '完成 50 堂課', 50, (s) => s.stats.lessons, 50),
  a('學習', 'lesson_200', '🏛️', '學富五車', '完成 200 堂課', 200, (s) => s.stats.lessons, 150),
  a('學習', 'boss_5', '👑', '測驗剋星', '通過 5 次單元測驗', 5, (s) => s.stats.bosses, 30),
  a('學習', 'boss_30', '🏰', '所向披靡', '通過 30 次單元測驗', 30, (s) => s.stats.bosses, 100),
  a('學習', 'perfect_5', '💯', '完美主義', '拿下 5 次全對', 5, (s) => s.stats.perfect, 20),
  a('學習', 'perfect_30', '✨', '零失誤', '拿下 30 次全對', 30, (s) => s.stats.perfect, 80),
  a('學習', 'combo_15', '⚡', '連擊新星', '單場達成 15 連擊', 15, (s) => s.stats.maxCombo, 15),
  a('學習', 'combo_30', '🌩️', '連擊狂人', '單場達成 30 連擊', 30, (s) => s.stats.maxCombo, 40),
  a('學習', 'mock_1', '📝', '模擬考初體驗', '完成第一次模擬考', 1, (s) => s.stats.mocks, 20),
  a('學習', 'mock_80', '🎓', '實力派', '任一份模擬考答對 80% 以上', 80, mockBest, 60),
  a('學習', 'mock_tri', '🗺️', '三語應考', '三種語言都考過模擬考', 3, mockLangs, 80),

  a('字彙', 'words_30', '🌱', '初試啼聲', '學會 30 個字詞', 30, words, 15),
  a('字彙', 'words_100', '🌿', '小有所成', '學會 100 個字詞', 100, words, 40),
  a('字彙', 'words_300', '🌳', '枝繁葉茂', '學會 300 個字詞', 300, words, 100),
  a('字彙', 'words_1000', '🌲', '字海無涯', '學會 1000 個字詞', 1000, words, 300),
  a('字彙', 'review_100', '🧠', '溫故知新', '累計複習 100 個字詞', 100, (s) => s.stats.reviews, 30),

  a('習慣', 'streak_3', '🔥', '三日不輟', '連續學習 3 天', 3, (s) => s.streak.best, 15),
  a('習慣', 'streak_7', '🔥', '一週達人', '連續學習 7 天', 7, (s) => s.streak.best, 30),
  a('習慣', 'streak_30', '🌋', '月之毅力', '連續學習 30 天', 30, (s) => s.streak.best, 100),
  a('習慣', 'streak_100', '☄️', '百日築基', '連續學習 100 天', 100, (s) => s.streak.best, 300),
  a('習慣', 'streak_365', '🌞', '一年如一日', '連續學習 365 天', 365, (s) => s.streak.best, 1000),
  a('習慣', 'goal_7', '🎯', '說到做到', '累計 7 天達成每日目標', 7, (s) => s.stats.goalDays, 30),
  a('習慣', 'goal_30', '🏹', '目標導向', '累計 30 天達成每日目標', 30, (s) => s.stats.goalDays, 100),
  a('習慣', 'tri_1', '🌏', '三語並進', '一天內練習三種語言', 1, (s) => s.stats.triDays, 20),
  a('習慣', 'tri_7', '🌐', '三語鐵人', '累計 7 天三種語言都練習', 7, (s) => s.stats.triDays, 60),
  a('習慣', 'night', '🦉', '夜貓子', '晚上 11 點後還在學習', 1, (s) => s.stats.night, 10),
  a('習慣', 'early', '🐓', '早起的鳥兒', '早上 7 點前就開始學習', 1, (s) => s.stats.early, 10),

  a('遊戲', 'cw_1', '🧩', '填字入門', '完成第一個填字遊戲', 1, (s) => s.stats.crosswords, 10),
  a('遊戲', 'cw_20', '🗝️', '填字達人', '完成 20 個填字遊戲', 20, (s) => s.stats.crosswords, 60),
  a('遊戲', 'dailycw_7', '📅', '每日一填', '完成 7 次每日填字', 7, (s) => s.stats.dailyCw, 40),
  a('遊戲', 'match_10', '🃏', '配對高手', '完成 10 次配對消消樂', 10, (s) => s.stats.matches, 30),
  a('遊戲', 'typing_10', '⌨️', '鍵盤武士', '完成 10 次日文打字特訓', 10, (s) => s.stats.typings, 40),
  a('遊戲', 'blitz_200', '⏱️', '手腦並用', '限時快答拿到 200 分', 200, bestBlitz, 20),
  a('遊戲', 'blitz_500', '🚀', '快答之神', '限時快答拿到 500 分', 500, bestBlitz, 80),
  a('遊戲', 'coins_500', '💰', '小富翁', '累計獲得 500 金幣', 500, (s) => s.coinsEarned, 50),

  ...TIERS.slice(1).map((t, i) =>
    a('段位', `rank_${t.id}`, RANK_ICONS[i + 1], `晉升${t.name}`, `任一語言達到「${t.name}」段位`, i + 1, maxTier, 20 * (i + 1)),
  ),
  a('段位', 'all_bronze', '🎖️', '三線發展', '三種語言都達到「銅」', 1, minTier, 60),
  a('段位', 'all_gold', '🏆', '三冠王', '三種語言都達到「金」', 3, minTier, 300),

  a('彩蛋', 'egg_3', '🥚', '彩蛋新手', '發現 3 個彩蛋', 3, eggs, 30),
  a('彩蛋', 'egg_10', '🐣', '彩蛋獵人', '發現 10 個彩蛋', 10, eggs, 100),
  a('彩蛋', 'egg_all', '🐉', '彩蛋大師', `發現全部 ${EGGS.length} 個彩蛋`, EGGS.length, eggs, 300),

  secret('perfect_run3', '🔱', '三連霸', '連續 3 堂課全對', '連續好幾堂課都不失誤', 3, (s) => s.stats.perfectRunBest, 40),
  secret('perfect_run10', '🤖', '完美機器', '連續 10 堂課全對', '連續非常多堂課都不失誤', 10, (s) => s.stats.perfectRunBest, 150),
  secret('speedrun', '💨', '神速', '60 秒內全對完成一堂課', '又快又準地完成一堂課', 1, (s) => s.stats.speedruns, 40),
  secret('boss_perfect', '🛡️', '完封測驗', '單元測驗一題都沒錯', '在單元測驗裡展現實力', 1, (s) => s.stats.bossPerfect, 50),
  secret('grit', '🌱', '永不放棄', '答對不到一半，仍然把課上完', '就算一直答錯，也堅持到最後', 1, (s) => s.stats.grit, 20),
  secret('marathon', '🏃', '學習馬拉松', '一天內完成 10 堂課', '在同一天上很多很多課', 10, busiestDay, 80),
  secret('lucky3', '🍀', '幸運兒', '遇到 3 次幸運星', '幸運星好像特別眷顧你', 3, (s) => s.stats.luckyStars, 60),
];
