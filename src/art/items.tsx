// 商店道具與分類的圖示，以及頭像框。
import type { ReactNode } from 'react';
import { Art, Eyes, Face, Flower, INK, line, Mouth, Sparkle, starPath } from './kit';

const ICONS: Record<string, () => ReactNode> = {
  /** 連勝保護：冰晶盾牌 */
  freeze: () => (
    <>
      <path d="M50 9 L83 21 V47 C83 70 67 84 50 91 C33 84 17 70 17 47 V21 Z" fill="#c7e9ff" {...line('#4f9ad9')} />
      <path d="M50 9 L83 21 V47 C83 70 67 84 50 91 Z" fill="#a9dcff" opacity="0.55" />
      <g transform="translate(50 30)" {...line('#ffffff', 2.6)}>
        <path d="M0 -9 V9" />
        <path d="M-7.8 -4.5 L7.8 4.5" />
        <path d="M7.8 -4.5 L-7.8 4.5" />
      </g>
      <Face y={55} gap={17} mouth="smile" />
    </>
  ),
  /** 雙倍 XP 藥水 */
  boost: () => (
    <>
      <rect x="41" y="7" width="18" height="11" rx="3" fill="#c98a5b" {...line('#8a5a33', 2)} />
      <path d="M42 18 H58 V31 C74 37 83 49 83 62 C83 78 69 91 50 91 C31 91 17 78 17 62 C17 49 26 37 42 31 Z" fill="#efeaff" {...line('#8a7fd0')} />
      <path d="M19.5 60 C30 53 70 53 80.5 60 C80 78 67 89 50 89 C33 89 20 78 19.5 60 Z" fill="#a78bfa" />
      <path d="M50 62 L45 72 H51 L46 82 L58 69 H51 L56 62 Z" fill="#ffd34d" {...line('#c99a2a', 1.5)} />
      <Eyes y={45} gap={15} r={3.3} />
      <Mouth y={50} w={4} />
      <circle cx="31" cy="70" r="3" fill="#ffffff" opacity="0.6" />
      <circle cx="69" cy="75" r="2" fill="#ffffff" opacity="0.6" />
    </>
  ),
  /** 一小時的超級藥水 */
  boost60: () => (
    <>
      <rect x="39" y="5" width="22" height="12" rx="3" fill="#c98a5b" {...line('#8a5a33', 2)} />
      <path d="M41 17 H59 V29 C76 35 86 48 86 62 C86 80 70 93 50 93 C30 93 14 80 14 62 C14 48 24 35 41 29 Z" fill="#fff6dc" {...line('#d9a520')} />
      <path d="M16.5 60 C28 52 72 52 83.5 60 C83 80 69 91 50 91 C31 91 17 80 16.5 60 Z" fill="#ffc94d" />
      <path d={starPath(50, 73, 11, 5)} fill="#ffffff" {...line('#d9a520', 1.6)} />
      <Eyes y={44} gap={16} r={3.4} />
      <Mouth y={49} kind="open" w={4.5} />
      <Sparkle x={86} y={22} s={7} color="#ffd34d" />
      <Sparkle x={14} y={30} s={5} color="#ffd34d" />
    </>
  ),
  /** 連擊護符：愛心造型的護身符，頂端有小火焰 */
  shield: () => (
    <>
      <path d="M50 7 C56 15 59 20 58 25 C57 30 43 30 42 25 C41 20 45 16 50 7 Z" fill="#ff8a3d" {...line('#d95f1a', 2)} />
      <path d="M50 17 C52.5 21 53 23 52 25 C51 26.5 49 26.5 48 25 C47 23 48 21 50 17 Z" fill="#ffd34d" />
      <path d="M50 89 C30 75 12 61 12 42 C12 28 22 19 34 19 C42 19 47 23 50 29 C53 23 58 19 66 19 C78 19 88 28 88 42 C88 61 70 75 50 89 Z" fill="#ffb0a3" {...line('#e06a50')} />
      <Face y={49} gap={18} mouth="smile" />
    </>
  ),
  /** 幸運草 */
  clover: () => (
    <>
      <path d="M50 47 Q57 70 68 88" fill="none" {...line('#3f9a3a', 4.5)} />
      {[0, 90, 180, 270].map((a) => (
        <path
          key={a}
          d="M0 0 C-15 -6 -19 -25 -8.5 -29 C-3 -31 0 -27 0 -23 C0 -27 3 -31 8.5 -29 C19 -25 15 -6 0 0 Z"
          transform={`translate(50 46) rotate(${a + 45})`}
          fill="#86d975"
          {...line('#3f9a3a', 2.4)}
        />
      ))}
      <circle cx="50" cy="46" r="11" fill="#a8e892" />
      <Face y={44} gap={9} r={2.6} mouth="smile" mw={3.6} blush={false} />
    </>
  ),
  /** 時光沙漏 */
  hourglass: () => (
    <>
      <path d="M30 17 H70 C70 36 56 44 56 50 C56 56 70 64 70 83 H30 C30 64 44 56 44 50 C44 44 30 36 30 17 Z" fill="#eef8ff" {...line('#8fb6d9')} />
      <path d="M36 28 H64 C62 37 54 43 50 46 C46 43 38 37 36 28 Z" fill="#ffb8d1" />
      <path d="M33 81 C35 70 43 64 50 62 C57 64 65 70 67 81 Z" fill="#ffb8d1" />
      <path d="M50 46 V62" {...line('#ffb8d1', 2)} />
      <rect x="21" y="8" width="58" height="10" rx="4" fill="#d6a06b" {...line('#8a5a33', 2.4)} />
      <rect x="21" y="82" width="58" height="10" rx="4" fill="#d6a06b" {...line('#8a5a33', 2.4)} />
      <Eyes y={72} gap={10} r={2.4} />
      <Mouth y={76} w={3.4} />
    </>
  ),
  /** 扭蛋機 */
  gacha: () => (
    <>
      <circle cx="50" cy="38" r="31" fill="#eaf6ff" {...line('#8fb6d9')} />
      <circle cx="37" cy="41" r="8.5" fill="#ff9fbf" />
      <circle cx="58" cy="28" r="8.5" fill="#9fd4ff" />
      <circle cx="61" cy="49" r="8.5" fill="#ffe066" />
      <circle cx="42" cy="58" r="7" fill="#a8e6a1" />
      <circle cx="40" cy="22" r="6" fill="#d0b4ff" />
      <path d="M30 18 Q36 12 44 12" fill="none" {...line('#ffffff', 3)} />
      <path d="M21 58 H79 V86 C79 90 75 93 71 93 H29 C25 93 21 90 21 86 Z" fill="#ff7a8f" {...line('#c94a5e')} />
      <circle cx="40" cy="74" r="8" fill="#ffd34d" {...line('#c99a2a', 2)} />
      <path d="M35 74 H45" {...line('#c99a2a', 2.2)} />
      <rect x="58" y="78" width="14" height="9" rx="2" fill="#3a3a4a" />
      <Sparkle x={86} y={12} s={6} />
    </>
  ),
  /** 神秘禮盒 */
  mystery: () => (
    <>
      <path d="M50 30 C39 12 23 19 33 30 Z" fill="#ffd34d" {...line('#c99a2a', 2)} />
      <path d="M50 30 C61 12 77 19 67 30 Z" fill="#ffd34d" {...line('#c99a2a', 2)} />
      <rect x="15" y="41" width="70" height="48" rx="6" fill="#b48cff" {...line('#7a4fc9')} />
      <rect x="11" y="30" width="78" height="16" rx="5" fill="#cbb0ff" {...line('#7a4fc9')} />
      <rect x="44" y="30" width="12" height="59" fill="#ffd34d" />
      <circle cx="50" cy="65" r="12.5" fill="#ffffff" {...line('#7a4fc9', 2)} />
      <text x="50" y="72.5" textAnchor="middle" fontSize="21" fontWeight="900" fill="#7a4fc9">
        ?
      </text>
      <Sparkle x={86} y={18} s={7} />
      <Sparkle x={14} y={20} s={5} />
    </>
  ),
  /** 一袋金幣（神秘商品的金幣寶箱） */
  coins: () => (
    <>
      <path d="M36 22 C30 12 42 8 50 14 C58 8 70 12 64 22 Z" fill="#d9a46b" {...line('#8a5a33', 2.4)} />
      <path d="M36 22 H64 C82 36 88 58 82 74 C77 88 23 88 18 74 C12 58 18 36 36 22 Z" fill="#e8b97f" {...line('#8a5a33')} />
      <path d="M36 24 Q50 30 64 24" fill="none" {...line('#8a5a33', 2.4)} />
      <circle cx="50" cy="60" r="14" fill="#ffd34d" {...line('#c99a2a', 2.4)} />
      <text x="50" y="66" textAnchor="middle" fontSize="16" fontWeight="900" fill="#c99a2a">
        $
      </text>
      <Eyes y={42} gap={16} r={3} />
    </>
  ),
  /** 分類：主題色 */
  palette: () => (
    <>
      <path d="M50 11 C74 11 90 28 90 48 C90 60 82 64 74 62 C66 60 62 66 66 74 C70 84 62 90 50 90 C28 90 10 72 10 50 C10 28 28 11 50 11 Z" fill="#f6e7d0" {...line('#b98c5a')} />
      <circle cx="32" cy="38" r="7" fill="#ff7aa8" />
      <circle cx="50" cy="27" r="7" fill="#7ad8ff" />
      <circle cx="68" cy="35" r="7" fill="#9cdc6a" />
      <circle cx="28" cy="58" r="7" fill="#ffd34d" />
      <Eyes x={52} y={55} gap={11} r={2.8} />
      <Mouth x={52} y={60} w={4} />
    </>
  ),
  /** 分類：答對特效 */
  burst: () => (
    <>
      <path d={starPath(50, 52, 30, 13)} fill="#ffd34d" {...line('#d99a20')} />
      <Sparkle x={19} y={21} s={9} color="#ff9fbf" />
      <Sparkle x={81} y={23} s={8} color="#9fd4ff" />
      <Sparkle x={79} y={79} s={10} color="#c4a8ff" />
      <Sparkle x={21} y={77} s={7} color="#9cdc6a" />
      <Face y={51} gap={12} r={3} mouth="open" mw={4} blush={false} />
    </>
  ),
  /** 分類：稱號 */
  title: () => (
    <>
      <path d="M37 52 L28 89 L40 83 L46 93 L51 60 Z" fill="#6a8cff" {...line('#3a5ad0', 2.4)} />
      <path d="M63 52 L72 89 L60 83 L54 93 L49 60 Z" fill="#ff7aa8" {...line('#d9578f', 2.4)} />
      <circle cx="50" cy="40" r="27" fill="#ffd34d" {...line('#c99a2a')} />
      <circle cx="50" cy="40" r="19" fill="#ffe680" />
      <Face y={38} gap={12} r={3} mouth="smile" mw={4} />
    </>
  ),
  /** 分類：頭像框 */
  frame: () => (
    <>
      <circle cx="50" cy="50" r="33" fill="#f3efff" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#ffd34d" strokeWidth="9" />
      <circle cx="50" cy="50" r="37.5" fill="none" {...line('#c99a2a', 1.6)} />
      <circle cx="50" cy="50" r="28.5" fill="none" {...line('#c99a2a', 1.6)} />
      {[
        [50, 17],
        [83, 50],
        [50, 83],
        [17, 50],
      ].map(([x, y]) => (
        <path key={`${x}${y}`} d={starPath(x, y, 7, 3.2)} fill="#ffffff" {...line('#c99a2a', 1.4)} />
      ))}
      <Face y={50} gap={14} r={3.4} mouth="smile" />
    </>
  ),
  /** 分類：喵師父裝扮（衣架） */
  outfit: () => (
    <>
      <path d="M50 22 C50 14 60 14 60 20 C60 26 50 26 50 32" fill="none" {...line('#8a93b8', 3)} />
      <path d="M50 32 L12 60 C8 63 10 68 15 68 H85 C90 68 92 63 88 60 Z" fill="#cdd5f2" {...line('#8a93b8')} />
      <path d="M26 70 H74 L70 90 H30 Z" fill="#ff8fc0" {...line('#d9578f', 2.5)} />
      <Face y={78} gap={12} r={2.6} mouth="smile" mw={3.6} blush={false} />
    </>
  ),
};

export const ITEM_ICON_IDS = Object.keys(ICONS);

export function ItemIcon({ id, size = 56 }: { id: string; size?: number | string }) {
  const draw = ICONS[id];
  return draw ? <Art size={size}>{draw()}</Art> : null;
}

// ───────── 頭像框 ─────────

function ring(color: string, edge: string, w = 7) {
  return (
    <g>
      <circle cx="50" cy="50" r="50" fill="none" stroke={color} strokeWidth={w} />
      <circle cx="50" cy="50" r={50 + w / 2} fill="none" stroke={edge} strokeWidth="1.4" />
      <circle cx="50" cy="50" r={50 - w / 2} fill="none" stroke={edge} strokeWidth="1.4" />
    </g>
  );
}

/** 繞著圓圈平均放 n 個裝飾 */
const around = (n: number, start = -90) => Array.from({ length: n }, (_, i) => ((start + (i * 360) / n) * Math.PI) / 180).map((a) => [50 + 50 * Math.cos(a), 50 + 50 * Math.sin(a)]);

const FRAMES: Record<string, () => ReactNode> = {
  gold: () => (
    <>
      {ring('#ffd34d', '#c99a2a')}
      {around(4).map(([x, y], i) => (
        <path key={i} d={starPath(x, y, 9, 4)} fill="#fff4b8" {...line('#c99a2a', 1.6)} />
      ))}
    </>
  ),
  sakura: () => (
    <>
      {ring('#ffc8da', '#e88aac')}
      {around(6, -60).map(([x, y], i) => (
        <Flower key={i} x={x} y={y} r={8.5} fill={i % 2 ? '#ffffff' : '#ffc8da'} stroke="#e88aac" notch />
      ))}
    </>
  ),
  rainbow: () => (
    <>
      {['#ff7a7a', '#ffb35c', '#ffe066', '#8fdc6b', '#6ab8ff', '#b48cff'].map((c, i) => (
        <circle key={c} cx="50" cy="50" r={47.5 + i * 1.6} fill="none" stroke={c} strokeWidth="1.8" />
      ))}
      <Sparkle x={86} y={14} s={8} />
      <Sparkle x={12} y={84} s={6} />
    </>
  ),
  ice: () => (
    <>
      {ring('#c7e9ff', '#4f9ad9')}
      {around(4, -45).map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} {...line('#4f9ad9', 2.2)}>
          <circle r="7" fill="#ffffff" stroke="#9fd0f2" strokeWidth="1.5" />
          <path d="M0 -5 V5 M-4.3 -2.5 L4.3 2.5 M4.3 -2.5 L-4.3 2.5" />
        </g>
      ))}
    </>
  ),
  leaf: () => (
    <>
      {ring('#a8e892', '#3f9a3a', 5)}
      {around(8, -90).map(([x, y], i) => (
        <path
          key={i}
          d="M0 -8 C6 -6 7 3 0 8 C-7 3 -6 -6 0 -8 Z"
          transform={`translate(${x} ${y}) rotate(${i * 45})`}
          fill="#7fd36a"
          {...line('#3f9a3a', 1.6)}
        />
      ))}
    </>
  ),
  star: () => (
    <>
      {ring('#3a3f8f', '#22265e', 8)}
      {around(10).map(([x, y], i) => (
        <path key={i} d={starPath(x, y, i % 2 ? 4 : 6, i % 2 ? 1.8 : 2.6)} fill={i % 2 ? '#ffffff' : '#ffe066'} />
      ))}
    </>
  ),
  crown: () => (
    <>
      {ring('#ffd34d', '#c99a2a', 8)}
      <path d="M30 4 L32 -16 L41 -6 L50 -22 L59 -6 L68 -16 L70 4 Z" fill="#ffd34d" {...line('#c99a2a', 2.4)} />
      <circle cx="50" cy="-6" r="3" fill="#7ad8ff" />
      <circle cx="39" cy="-1" r="2.4" fill="#ff7aa8" />
      <circle cx="61" cy="-1" r="2.4" fill="#9cff8a" />
    </>
  ),
};

/** 頭像框：疊在頭像外面（比頭像大一圈） */
export function FrameArt({ id }: { id: string }) {
  const draw = FRAMES[id];
  if (!draw) return null;
  return (
    <svg className="avatar-frame" viewBox="-14 -26 128 140" aria-hidden>
      {draw()}
    </svg>
  );
}

/** 商店裡的頭像框預覽：框住一個淡淡的圓 */
export function FramePreview({ id, size = 64 }: { id: string; size?: number }) {
  const draw = FRAMES[id];
  return (
    <svg width={size} height={size} viewBox="-14 -26 128 140" aria-hidden>
      <circle cx="50" cy="50" r="46" fill="color-mix(in srgb, currentColor 10%, transparent)" />
      <text x="50" y="62" textAnchor="middle" fontSize="34" fill={INK} opacity="0.35">
        ?
      </text>
      {draw?.()}
    </svg>
  );
}
