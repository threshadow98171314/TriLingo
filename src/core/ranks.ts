// 段位系統：三種語言各自累積 XP、各自升段。
// 鐵 → 銅 → 銀 → 金 → 白金 → 鑽石 → 大師 → 宗師 → 菁英 → 聖哲
// 聖哲以外的每個段位再分 III → II → I 三階，讓升段的回饋更頻繁。

export interface Tier {
  id: string;
  name: string;
  glyph: string;
  /** 進入此段位所需的累積 XP */
  min: number;
  /** [主色, 亮色, 暗色] */
  c: [string, string, string];
  ink: string;
}

export const TIERS: Tier[] = [
  { id: 'iron', name: '鐵', glyph: '鐵', min: 0, c: ['#8a93a8', '#d3d8e3', '#474e60'], ink: '#1f2430' },
  { id: 'bronze', name: '銅', glyph: '銅', min: 300, c: ['#c47f47', '#f3c29a', '#7a431d'], ink: '#3b1d08' },
  { id: 'silver', name: '銀', glyph: '銀', min: 1000, c: ['#b7c3d6', '#ffffff', '#6c7a92'], ink: '#27303f' },
  { id: 'gold', name: '金', glyph: '金', min: 2500, c: ['#f2b632', '#fff2b0', '#a66c00'], ink: '#4a2f00' },
  { id: 'platinum', name: '白金', glyph: '鉑', min: 5000, c: ['#49cfc0', '#d9fff9', '#17756c'], ink: '#06332f' },
  { id: 'diamond', name: '鑽石', glyph: '鑽', min: 10000, c: ['#5aa9ff', '#e2f1ff', '#1c4ec2'], ink: '#0a2260' },
  { id: 'master', name: '大師', glyph: '師', min: 20000, c: ['#b46bff', '#f1deff', '#681dc0'], ink: '#2c0a57' },
  { id: 'grandmaster', name: '宗師', glyph: '宗', min: 35000, c: ['#ff5d6c', '#ffdfe2', '#b01428'], ink: '#4d0610' },
  { id: 'elite', name: '菁英', glyph: '菁', min: 60000, c: ['#ff8a1f', '#ffe6c2', '#b93c06'], ink: '#4a1802' },
  { id: 'sage', name: '聖哲', glyph: '聖', min: 100000, c: ['#ffe58a', '#ffffff', '#d99a00'], ink: '#5a3d00' },
];

export const DIVISIONS = ['III', 'II', 'I'];
export const TOP_TIER = TIERS.length - 1;
/** 最高階（聖哲）的 step 編號 */
export const MAX_STEP = TOP_TIER * 3;

export function tierOfStep(step: number): number {
  return Math.min(Math.floor(step / 3), TOP_TIER);
}

/** 進入某一階所需的累積 XP */
export function stepFloor(step: number): number {
  const s = Math.max(0, Math.min(step, MAX_STEP));
  const tier = tierOfStep(s);
  if (tier === TOP_TIER) return TIERS[tier].min;
  const a = TIERS[tier].min;
  const b = TIERS[tier + 1].min;
  return Math.round((a + ((b - a) * (s % 3)) / 3) / 5) * 5;
}

export function stepName(step: number): string {
  const tier = tierOfStep(step);
  return tier === TOP_TIER ? TIERS[tier].name : `${TIERS[tier].name} ${DIVISIONS[step % 3]}`;
}

export interface RankInfo {
  step: number;
  tier: number;
  /** 0=III, 1=II, 2=I；聖哲為 -1 */
  div: number;
  name: string;
  floor: number;
  /** 下一階門檻；已達最高階為 null */
  next: number | null;
  nextName: string | null;
  /** 本階進度 0..1 */
  progress: number;
  toNext: number;
}

export function rankOf(xp: number): RankInfo {
  let step = 0;
  while (step < MAX_STEP && xp >= stepFloor(step + 1)) step++;
  const tier = tierOfStep(step);
  const floor = stepFloor(step);
  const top = step >= MAX_STEP;
  const next = top ? null : stepFloor(step + 1);
  return {
    step,
    tier,
    div: top ? -1 : step % 3,
    name: stepName(step),
    floor,
    next,
    nextName: top ? null : stepName(step + 1),
    progress: next === null ? 1 : Math.max(0, Math.min(1, (xp - floor) / (next - floor))),
    toNext: next === null ? 0 : next - xp,
  };
}
