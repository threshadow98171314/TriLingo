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
  // ───── 新的靜態框 ─────
  ribbon: () => (
    <>
      {ring('#ffc8da', '#e88aac', 6)}
      <path d="M50 -2 C36 -18 18 -10 26 0 C30 5 40 4 50 -2 Z" fill="#ff8fb8" {...line('#d9578f', 2.2)} />
      <path d="M50 -2 C64 -18 82 -10 74 0 C70 5 60 4 50 -2 Z" fill="#ff8fb8" {...line('#d9578f', 2.2)} />
      <path d="M46 2 L38 18 L44 16 L46 22 L50 4 Z M54 2 L62 18 L56 16 L54 22 L50 4 Z" fill="#ffb3cf" {...line('#d9578f', 1.8)} />
      <circle cx="50" cy="-1" r="5" fill="#ffd1e3" {...line('#d9578f', 2)} />
    </>
  ),
  paw: () => (
    <>
      {ring('#ffe2bd', '#c7823f', 6)}
      {around(6, -90).map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${i * 60})`} fill="#c98a5b">
          <ellipse cx="0" cy="2" rx="4.4" ry="3.6" />
          <circle cx="-4.2" cy="-3" r="1.9" />
          <circle cx="0" cy="-5" r="1.9" />
          <circle cx="4.2" cy="-3" r="1.9" />
        </g>
      ))}
    </>
  ),
  candy: () => (
    <>
      <circle cx="50" cy="50" r="50" fill="none" stroke="#ffffff" strokeWidth="8" />
      <circle cx="50" cy="50" r="50" fill="none" stroke="#ff5d7a" strokeWidth="8" strokeDasharray="9 9" />
      <circle cx="50" cy="50" r="54.7" fill="none" stroke="#d94a64" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="45.3" fill="none" stroke="#d94a64" strokeWidth="1.2" />
      {[
        [10, 10, '#7ad8ff'],
        [90, 90, '#ffe066'],
      ].map(([x, y, c]) => (
        <g key={String(x)} transform={`translate(${x} ${y}) rotate(-45)`}>
          <path d="M-12 0 L-17 -5 L-17 5 Z M12 0 L17 -5 L17 5 Z" fill={c as string} {...line('#8a93b8', 1.4)} />
          <ellipse rx="9" ry="7" fill={c as string} {...line('#8a93b8', 1.6)} />
          <path d="M-5 -5 Q0 0 -5 5 M2 -6 Q7 0 2 6" fill="none" {...line('#ffffff', 1.6)} />
        </g>
      ))}
    </>
  ),
  wave: () => (
    <>
      {ring('#7cc4ff', '#2f6fb3', 6)}
      {around(8, -90).map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${i * 45})`}>
          <path d="M-9 4 C-8 -6 4 -9 8 -2 C4 -5 -1 -3 0 2 C1 5 5 5 6 3" fill="#ffffff" {...line('#2f6fb3', 1.8)} />
        </g>
      ))}
    </>
  ),
  bamboo: () => (
    <>
      <circle cx="50" cy="50" r="50" fill="none" stroke="#7fc66a" strokeWidth="7" strokeDasharray="22 3" />
      <circle cx="50" cy="50" r="53.5" fill="none" stroke="#3f8a3a" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="46.5" fill="none" stroke="#3f8a3a" strokeWidth="1.2" />
      {around(4, -60).map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${i * 90 + 30})`} fill="#5bb04a" {...line('#2f7a2a', 1.4)}>
          <path d="M0 0 C6 -4 14 -4 18 -1 C13 1 6 2 0 0 Z" />
          <path d="M0 0 C4 -8 10 -12 15 -12 C12 -7 6 -3 0 0 Z" />
        </g>
      ))}
    </>
  ),
  lace: () => (
    <>
      {around(18, -90).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6.2" fill="#ffffff" stroke="#d6d9ef" strokeWidth="1.4" />
      ))}
      <circle cx="50" cy="50" r="47" fill="none" stroke="#ffffff" strokeWidth="3" />
      {around(18, -80).map(([x, y], i) => (
        <circle key={i} cx={50 + (x - 50) * 1.02} cy={50 + (y - 50) * 1.02} r="1.4" fill="#c6cbe6" />
      ))}
    </>
  ),

  // ───── 會動的框 ─────
  orbit: () => (
    <>
      <circle cx="50" cy="50" r="50" fill="none" stroke="#c4a8ff" strokeWidth="2.4" strokeDasharray="2 5" />
      <circle cx="50" cy="50" r="53" fill="none" stroke="#7a5bd6" strokeWidth="1.2" opacity="0.6" />
      <g className="fa-spin">
        {around(3).map(([x, y], i) => (
          <path key={i} d={starPath(x, y, i ? 6 : 9, i ? 2.8 : 4)} fill={['#ffe066', '#ff9fbf', '#7ad8ff'][i]} {...line('#c99a2a', 1.2)} />
        ))}
      </g>
      <g className="fa-spin-rev">
        {around(6, -60).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill="#ffffff" opacity="0.8" />
        ))}
      </g>
    </>
  ),
  aurora: () => (
    <>
      <defs>
        <linearGradient id="fr-aurora" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4ef0b0" />
          <stop offset="0.5" stopColor="#5cc8ff" />
          <stop offset="1" stopColor="#c47bff" />
        </linearGradient>
      </defs>
      <g className="fa-spin-slow">
        <circle cx="50" cy="50" r="50" fill="none" stroke="url(#fr-aurora)" strokeWidth="8" />
      </g>
      <g className="fa-spin-rev" opacity="0.55">
        <circle cx="50" cy="50" r="55" fill="none" stroke="url(#fr-aurora)" strokeWidth="2" strokeDasharray="30 14" />
      </g>
      <g className="fa-hue">
        <Sparkle x={88} y={12} s={6} color="#b8fff0" />
        <Sparkle x={12} y={88} s={5} color="#e4c9ff" />
      </g>
    </>
  ),
  flame: () => (
    <>
      {ring('#ff9a4d', '#c4542a', 6)}
      {around(10, -90).map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${i * 36})`}>
          <path className="fa-flicker" style={{ animationDelay: `${(i % 4) * 0.15}s` }} d="M0 2 C-6 -2 -4 -10 0 -16 C4 -10 6 -2 0 2 Z" fill={i % 2 ? '#ffd34d' : '#ff6b3d'} {...line('#d9481a', 1.2)} />
        </g>
      ))}
    </>
  ),
  bubble: () => (
    <>
      {ring('#bfe6ff', '#6ab0e0', 5)}
      {around(8, -70).map(([x, y], i) => (
        <g key={i} className="fa-rise" style={{ animationDelay: `${(i * 0.37) % 2.4}s` }}>
          <circle cx={x} cy={y} r={i % 3 ? 4.5 : 6.5} fill="rgba(220,240,255,0.35)" stroke="#9fd0f2" strokeWidth="1.4" />
          <circle cx={x - 1.6} cy={y - 1.8} r="1.4" fill="#ffffff" />
        </g>
      ))}
    </>
  ),
  petals: () => (
    <>
      {ring('#ffd9e6', '#e88aac', 5)}
      {around(9, -90).map(([x, y], i) => (
        <g key={i} className="fa-fall" style={{ animationDelay: `${(i * 0.43) % 3}s` }}>
          <path d={`M${x} ${y} c-4 -3 -5 -8 -1 -10 l1 2 l1 -2 c4 2 3 7 -1 10 z`} fill={i % 2 ? '#ffb3cc' : '#ffffff'} stroke="#e88aac" strokeWidth="1.2" />
        </g>
      ))}
    </>
  ),
  neon: () => (
    <>
      <defs>
        <filter id="fr-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#fr-glow)">
        <circle className="fa-neon-a" cx="50" cy="50" r="50" fill="none" strokeWidth="3.4" />
        <circle className="fa-neon-b" cx="50" cy="50" r="55" fill="none" strokeWidth="2" strokeDasharray="18 6" />
      </g>
    </>
  ),
  heart: () => (
    <>
      {ring('#ffc8da', '#e05d84', 5)}
      {around(6, -90).map(([x, y], i) => (
        <path
          key={i}
          className="fa-pulse"
          style={{ animationDelay: `${i * 0.12}s` }}
          d={`M${x} ${y + 5} C${x - 8} ${y - 1} ${x - 7} ${y - 8} ${x - 3.4} ${y - 8} C${x - 1.4} ${y - 8} ${x} ${y - 6.4} ${x} ${y - 5} C${x} ${y - 6.4} ${x + 1.4} ${y - 8} ${x + 3.4} ${y - 8} C${x + 7} ${y - 8} ${x + 8} ${y - 1} ${x} ${y + 5} Z`}
          fill={i % 2 ? '#ff7aa8' : '#ff4f86'}
          {...line('#c43d6a', 1.2)}
        />
      ))}
    </>
  ),
  music: () => (
    <>
      {ring('#d9ccff', '#7a5bd6', 5)}
      {around(6, -90).map(([x, y], i) => (
        <text key={i} className="fa-rise" style={{ animationDelay: `${i * 0.4}s` }} x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="900" fill={['#ff7aa8', '#7ad8ff', '#ffd34d'][i % 3]}>
          {i % 2 ? '♪' : '♫'}
        </text>
      ))}
    </>
  ),
  snow: () => (
    <>
      {ring('#e0f2ff', '#7fb2dd', 5)}
      {around(8, -90).map(([x, y], i) => (
        <g key={i} className="fa-fall" style={{ animationDelay: `${(i * 0.5) % 3.2}s` }}>
          <g transform={`translate(${x} ${y})`} stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round">
            <path d="M0 -5 V5 M-4.3 -2.5 L4.3 2.5 M4.3 -2.5 L-4.3 2.5" />
          </g>
        </g>
      ))}
    </>
  ),
  koi: () => (
    <>
      <circle cx="50" cy="50" r="50" fill="none" stroke="#7cc4ff" strokeWidth="7" opacity="0.7" />
      <circle cx="50" cy="50" r="50" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="4 10" opacity="0.8" />
      <g className="fa-spin-slow">
        {[0, 180].map((a, i) => (
          <g key={a} transform={`rotate(${a} 50 50) translate(50 0)`}>
            <path d="M-12 0 C-6 -6 6 -6 12 0 C6 6 -6 6 -12 0 Z" fill={i ? '#ffffff' : '#ff8a3d'} {...line('#c4542a', 1.4)} />
            <path d="M-12 0 L-19 -6 L-17 0 L-19 6 Z" fill={i ? '#ff6b3d' : '#ffd34d'} {...line('#c4542a', 1.2)} />
            <circle cx={i ? -2 : 3} cy="-1" r="2.6" fill={i ? '#ff6b3d' : '#ffffff'} />
            <circle cx="8" cy="-1.5" r="1.2" fill={INK} />
          </g>
        ))}
      </g>
    </>
  ),
  thunder: () => (
    <>
      {ring('#3a3f8f', '#ffd34d', 7)}
      {around(4, -45).map(([x, y], i) => (
        <path
          key={i}
          className="fa-flash"
          style={{ animationDelay: `${i * 0.35}s` }}
          d={`M${x - 2} ${y - 11} L${x - 7} ${y + 1} L${x - 1} ${y + 1} L${x - 4} ${y + 11} L${x + 7} ${y - 3} L${x + 1} ${y - 3} L${x + 4} ${y - 11} Z`}
          fill="#ffe066"
          {...line('#c99a2a', 1.4)}
        />
      ))}
      <circle className="fa-flash" cx="50" cy="50" r="55" fill="none" stroke="#fff6b0" strokeWidth="1.4" />
    </>
  ),
  galaxy: () => (
    <>
      <defs>
        <linearGradient id="fr-galaxy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a1f8f" />
          <stop offset="0.5" stopColor="#c44bd6" />
          <stop offset="1" stopColor="#1f6fd6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="none" stroke="url(#fr-galaxy)" strokeWidth="10" />
      <g className="fa-spin-slow">
        {around(16, -90).map(([x, y], i) => (
          <circle key={i} cx={x + ((i * 7) % 5) - 2} cy={y + ((i * 3) % 5) - 2} r={i % 4 ? 1 : 1.8} fill="#ffffff" />
        ))}
      </g>
      <g className="fa-twinkle">
        <Sparkle x={90} y={8} s={7} color="#ffe066" />
        <Sparkle x={8} y={92} s={6} color="#b8e8ff" />
        <Sparkle x={96} y={70} s={4} color="#ffd1f0" />
      </g>
    </>
  ),
  dragon: () => (
    <>
      {ring('#ffd34d', '#c99a2a', 5)}
      <g className="fa-spin-slow">
        {Array.from({ length: 14 }, (_, i) => {
          const a = ((-90 - i * 15) * Math.PI) / 180;
          const r = 50 + Math.sin(i * 0.9) * 3;
          return <circle key={i} cx={50 + r * Math.cos(a)} cy={50 + r * Math.sin(a)} r={7 - i * 0.35} fill={i % 2 ? '#ffcf33' : '#ffe680'} {...line('#c99a2a', 1.4)} />;
        })}
        <g transform="translate(50 0) rotate(90)">
          <ellipse cx="2" cy="0" rx="10" ry="8" fill="#ffd34d" {...line('#c99a2a', 1.6)} />
          <path d="M-4 -7 L-10 -15 M2 -8 L0 -16" {...line('#c99a2a', 2)} />
          <circle cx="5" cy="-2.5" r="1.8" fill={INK} />
          <path d="M11 2 C15 4 17 8 15 11" fill="none" {...line('#ff6b3d', 1.6)} />
        </g>
      </g>
    </>
  ),
  phoenix: () => (
    <>
      {ring('#ff7a3d', '#c43d1a', 6)}
      <g transform="translate(50 -6)">
        <path className="fa-flap-l" d="M0 4 C-10 -6 -26 -10 -36 -2 C-28 -2 -24 4 -30 8 C-20 6 -12 8 0 4 Z" fill="#ffb347" {...line('#d9481a', 1.6)} />
        <path className="fa-flap-r" d="M0 4 C10 -6 26 -10 36 -2 C28 -2 24 4 30 8 C20 6 12 8 0 4 Z" fill="#ffb347" {...line('#d9481a', 1.6)} />
        <ellipse cx="0" cy="4" rx="6" ry="8" fill="#ff6b3d" {...line('#d9481a', 1.6)} />
        <circle cx="0" cy="-4" r="4.6" fill="#ff8a3d" {...line('#d9481a', 1.4)} />
        <path d="M-1 -9 Q0 -14 3 -12" fill="none" {...line('#ffd34d', 1.6)} />
        <circle cx="1.4" cy="-4.6" r="1" fill={INK} />
      </g>
      {[-1, 0, 1].map((k) => (
        <path key={k} className="fa-flicker" style={{ animationDelay: `${(k + 1) * 0.2}s` }} d={`M${50 + k * 8} 100 C${44 + k * 8} 108 ${50 + k * 10} 116 ${50 + k * 12} 122 C${56 + k * 9} 114 ${56 + k * 8} 106 ${50 + k * 8} 100 Z`} fill={k ? '#ffd34d' : '#ff6b3d'} {...line('#d9481a', 1.2)} />
      ))}
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
