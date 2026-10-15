// 吉祥物「喵師父」：綁著「道」字頭巾的貓。商店買的裝扮（帽子、眼鏡…）畫在這裡，價格與說明在 core/shop.ts。
import type { ReactNode } from 'react';
import { Art, Blush, Eyes, Flower, INK, line, Mouth } from './kit';

const RED = '#e8484f';
const RED_D = '#a82a32';

function Hat({ id }: { id: string }): ReactNode {
  switch (id) {
    case 'grad':
      return (
        <g>
          <path d="M33 25 V33 Q50 41 67 33 V25" fill="#30304a" {...line('#1b1b2b', 2)} />
          <path d="M16 22 L50 9 L84 22 L50 35 Z" fill="#3a3a58" {...line('#1b1b2b', 2.2)} />
          <path d="M50 22 L76 29 V42" fill="none" {...line('#ffd34d', 2.5)} />
          <circle cx="76" cy="44" r="3.4" fill="#ffd34d" />
        </g>
      );
    case 'straw':
      return (
        <g>
          <ellipse cx="50" cy="29" rx="42" ry="9" fill="#f3d27a" {...line('#c9a043', 2.5)} />
          <path d="M29 29 C29 9 71 9 71 29 Z" fill="#f6db8c" {...line('#c9a043', 2.5)} />
          <path d="M29.5 24 Q50 30 70.5 24 L71 29 Q50 35 29 29 Z" fill={RED} />
        </g>
      );
    case 'crown':
      return (
        <g>
          <path d="M30 31 L31 11 L41 22 L50 6 L59 22 L69 11 L70 31 Z" fill="#ffd34d" {...line('#c99a2a', 2.5)} />
          <circle cx="50" cy="22" r="3" fill="#7ad8ff" />
          <circle cx="39" cy="26" r="2.4" fill="#ff7aa8" />
          <circle cx="61" cy="26" r="2.4" fill="#9cff8a" />
        </g>
      );
    case 'santa':
      return (
        <g>
          <path d="M24 31 C28 10 56 3 78 16 L85 33 Z" fill={RED} {...line(RED_D, 2.5)} />
          <path d="M20 32 Q50 23 86 32 Q87 39 84 40 Q50 32 22 40 Q19 37 20 32 Z" fill="#ffffff" {...line('#d6d6e6', 2)} />
          <circle cx="83" cy="15" r="6" fill="#ffffff" {...line('#d6d6e6', 2)} />
        </g>
      );
    case 'bow':
      return (
        <g transform="translate(70 21) rotate(18)">
          <path d="M0 0 L-14 -9 Q-17 0 -14 9 Z" fill="#ff8fc0" {...line('#d9578f', 2.2)} />
          <path d="M0 0 L14 -9 Q17 0 14 9 Z" fill="#ff8fc0" {...line('#d9578f', 2.2)} />
          <circle r="4" fill="#ffb3d6" {...line('#d9578f', 2)} />
        </g>
      );
    case 'phones':
      // 頭帶畫在頭後面（見 MascotBody），這裡只畫兩邊的耳罩
      return (
        <g>
          <rect x="8" y="48" width="13" height="21" rx="6" fill="#7aa2ff" {...line('#3a5ad0', 2.2)} />
          <rect x="79" y="48" width="13" height="21" rx="6" fill="#7aa2ff" {...line('#3a5ad0', 2.2)} />
        </g>
      );
    case 'beret':
      return (
        <g>
          <ellipse cx="46" cy="25" rx="27" ry="10" transform="rotate(-10 46 25)" fill="#4a5bd6" {...line('#2f3a99', 2.4)} />
          <path d="M44 15 L46 9" {...line('#2f3a99', 3)} />
        </g>
      );
    case 'flowers':
      return (
        <g>
          {[
            [24, 33],
            [36, 26],
            [50, 24],
            [64, 26],
            [76, 33],
          ].map(([x, y], i) => (
            <Flower key={i} x={x} y={y} r={7.5} fill={i % 2 ? '#ffffff' : '#ffc8da'} stroke="#e88aac" notch />
          ))}
        </g>
      );
    default:
      return null;
  }
}

/** 戴在臉上的裝扮（眼鏡）畫在臉的上層 */
function FaceWear({ id }: { id: string }): ReactNode {
  if (id !== 'glasses') return null;
  return (
    <g fill="rgba(255,255,255,0.25)" {...line(INK, 2.4)}>
      <circle cx="39" cy="60" r="8" />
      <circle cx="61" cy="60" r="8" />
      <path d="M47 59 Q50 57 53 59" fill="none" />
    </g>
  );
}

/** 喵師父本體（不含外框），可以放進其他插畫裡 */
export function MascotBody({ gold, outfit }: { gold?: boolean; outfit?: string }) {
  const fur = gold ? '#ffd65a' : '#ffffff';
  const edge = gold ? '#c99a2a' : '#b9a9b8';
  const patch = gold ? '#ffb31a' : '#a7adc2';
  const hatOnTop = outfit && outfit !== 'glasses';
  return (
    <g>
      {outfit === 'phones' && <path d="M15 54 C12 18 88 18 85 54" fill="none" {...line('#5a6ca3', 5)} />}
      <path d="M20 47 L22 12 L46 30 Z" fill={fur} {...line(edge)} />
      <path d="M26 39 L27 22 L38 31 Z" fill="#ffb3c1" />
      <path d="M80 47 L78 12 L54 30 Z" fill={patch} {...line(edge)} />
      <path d="M74 39 L73 22 L62 31 Z" fill="#ffb3c1" />
      <ellipse cx="50" cy="58" rx="34" ry="30" fill={fur} {...line(edge)} />
      <path d="M62 29.5 C74 32 82 41 83 51 C74 46 66 39 62 29.5 Z" fill={patch} />
      <path d="M17 45 Q50 35 83 45 L83 52.5 Q50 43 17 52.5 Z" fill={RED} {...line(RED_D, 2)} />
      <path d="M82 47 L94 40 L92 51 Z" fill={RED} {...line(RED_D, 1.8)} />
      <path d="M82 50 L93 57 L86 60 Z" fill={RED} {...line(RED_D, 1.8)} />
      <circle cx="50" cy="44" r="7.2" fill="#ffffff" {...line(RED_D, 1.6)} />
      <text x="50" y="47.6" textAnchor="middle" fontSize="9.5" fontWeight="900" fill={RED_D}>
        道
      </text>
      <Eyes y={60} gap={22} />
      <Blush y={68} gap={44} />
      <path d="M47.4 65.4 H52.6 L50 68 Z" fill="#ff8fa6" />
      <Mouth y={69} kind="cat" w={4.2} />
      <g {...line(edge, 1.6)}>
        <path d="M12 62 L25 65" />
        <path d="M13 71 L25 69" />
        <path d="M88 62 L75 65" />
        <path d="M87 71 L75 69" />
      </g>
      {outfit && <FaceWear id={outfit} />}
      {hatOnTop && <Hat id={outfit} />}
    </g>
  );
}

export function MascotArt({ size = 64, gold, outfit }: { size?: number | string; gold?: boolean; outfit?: string }) {
  return (
    <Art size={size}>
      <MascotBody gold={gold} outfit={outfit} />
    </Art>
  );
}
