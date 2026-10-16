// 單字卡牌對決的怪物插畫：和其他插畫同一套可愛畫風，只是多了一點「壞壞」的眉毛。
import type { ReactNode } from 'react';
import type { EnemyId } from '../engine/duel';
import { Art, Blush, Eyes, INK, line, Mouth, Sparkle, starPath } from './kit';

/** 壞壞的八字眉 */
const Brows = ({ y, gap = 18, color = INK }: { y: number; gap?: number; color?: string }) => (
  <g fill="none" {...line(color, 2.6)}>
    <path d={`M${50 - gap / 2 - 5} ${y - 3} L${50 - gap / 2 + 4} ${y + 1}`} />
    <path d={`M${50 + gap / 2 + 5} ${y - 3} L${50 + gap / 2 - 4} ${y + 1}`} />
  </g>
);

const Fang = ({ x, y }: { x: number; y: number }) => <path d={`M${x - 2} ${y} L${x} ${y + 3.6} L${x + 2} ${y} Z`} fill="#fff" {...line(INK, 1.2)} />;

const ART: Record<EnemyId, () => ReactNode> = {
  slime: () => (
    <>
      <ellipse cx="50" cy="88" rx="34" ry="5" fill="#000" opacity="0.12" />
      <path d="M13 79 C9 58 26 30 50 28 C74 30 91 58 87 79 C85 89 15 89 13 79 Z" fill="#8be3b5" {...line('#3aa874')} />
      <path d="M50 28 C52 20 58 18 60 22 C61 25 56 27 54 29" fill="#8be3b5" {...line('#3aa874', 2.4)} />
      <ellipse cx="33" cy="47" rx="7" ry="4.5" fill="#ffffff" opacity="0.7" transform="rotate(-30 33 47)" />
      <Brows y={53} gap={20} />
      <Eyes y={60} gap={20} r={4.4} />
      <Blush y={68} gap={36} />
      <Mouth y={69} kind="cat" w={4.4} />
    </>
  ),
  bat: () => (
    <>
      <path d="M38 52 C26 36 10 36 6 44 C12 46 12 52 9 56 C16 55 18 60 17 65 C24 60 30 60 36 64 Z" fill="#8b6fd6" {...line('#5a3f9e', 2.4)} />
      <path d="M62 52 C74 36 90 36 94 44 C88 46 88 52 91 56 C84 55 82 60 83 65 C76 60 70 60 64 64 Z" fill="#8b6fd6" {...line('#5a3f9e', 2.4)} />
      <path d="M35 34 L37 20 L45 30 Z" fill="#a98ef0" {...line('#5a3f9e', 2.4)} />
      <path d="M65 34 L63 20 L55 30 Z" fill="#a98ef0" {...line('#5a3f9e', 2.4)} />
      <circle cx="50" cy="52" r="20" fill="#a98ef0" {...line('#5a3f9e')} />
      <ellipse cx="50" cy="60" rx="10" ry="7" fill="#d9ccff" />
      <Brows y={44} gap={14} />
      <Eyes y={50} gap={14} r={3.6} color="#2b1d4a" />
      <Mouth y={58} kind="flat" w={5} />
      <Fang x={46.5} y={59} />
      <Fang x={53.5} y={59} />
    </>
  ),
  bookworm: () => (
    <>
      <path d="M10 76 L50 70 L90 76 L90 90 L50 84 L10 90 Z" fill="#fff6e6" {...line('#b98c5a')} />
      <path d="M50 70 V84" {...line('#b98c5a', 2)} />
      <path d="M16 79 H40 M16 84 H38 M60 79 H84 M62 84 H84" {...line('#e4c9a3', 1.6)} />
      <circle cx="40" cy="70" r="9" fill="#9be07a" {...line('#4f9a3a', 2.4)} />
      <circle cx="47" cy="58" r="10" fill="#9be07a" {...line('#4f9a3a', 2.4)} />
      <circle cx="55" cy="40" r="17" fill="#b5ec97" {...line('#4f9a3a')} />
      <path d="M49 24 Q45 14 41 16 M61 24 Q65 14 69 16" fill="none" {...line('#4f9a3a', 2.2)} />
      <circle cx="41" cy="16" r="2.6" fill="#ff8fa6" />
      <circle cx="69" cy="16" r="2.6" fill="#ff8fa6" />
      <g fill="#ffffff" fillOpacity="0.5" {...line(INK, 2)}>
        <circle cx="48" cy="40" r="6" />
        <circle cx="63" cy="40" r="6" />
      </g>
      <path d="M54 40 H57" {...line(INK, 2)} />
      <Eyes x={55.5} y={40} gap={15} r={2.6} />
      <Mouth x={55.5} y={49} kind="tongue" w={3.6} />
    </>
  ),
  ghost: () => (
    <>
      <ellipse cx="50" cy="92" rx="22" ry="4" fill="#000" opacity="0.1" />
      <path d="M22 80 C20 44 30 18 50 18 C70 18 80 44 78 80 L71 74 L64 82 L57 74 L50 82 L43 74 L36 82 L29 74 Z" fill="#f4f8ff" {...line('#8ea2d6')} />
      <path d="M22 54 C14 52 10 58 13 62 C16 60 20 60 22 62" fill="#f4f8ff" {...line('#8ea2d6', 2.4)} />
      <path d="M78 54 C86 52 90 58 87 62 C84 60 80 60 78 62" fill="#f4f8ff" {...line('#8ea2d6', 2.4)} />
      <Brows y={40} gap={18} color="#5b6a9a" />
      <Eyes y={47} gap={18} r={4.4} color="#2c3560" />
      <Blush y={55} gap={32} color="#a9c4ff" />
      <Mouth y={56} kind="tongue" w={5} />
    </>
  ),
  mushroom: () => (
    <>
      <path d="M33 58 H67 L64 86 C64 90 36 90 36 86 Z" fill="#fff4e0" {...line('#c99a6b')} />
      <path d="M10 58 C10 30 30 16 50 16 C70 16 90 30 90 58 C90 64 10 64 10 58 Z" fill="#ff6f7d" {...line('#c43d4e')} />
      <g fill="#ffffff">
        <circle cx="30" cy="38" r="6" />
        <circle cx="52" cy="28" r="7" />
        <circle cx="72" cy="42" r="5.5" />
        <circle cx="45" cy="50" r="4" />
      </g>
      <Brows y={67} gap={14} />
      <Eyes y={72} gap={14} r={3.4} />
      <Blush y={79} gap={26} />
      <Mouth y={79} kind="o" w={5} />
      <path d="M80 72 C84 68 88 70 87 74" fill="none" {...line('#9be07a', 2.2)} />
      <circle cx="88" cy="68" r="2.6" fill="#b5ec97" />
    </>
  ),
  pencil: () => (
    <>
      <rect x="36" y="9" width="28" height="12" rx="4" fill="#ff9fbf" {...line('#d9578f', 2.6)} />
      <rect x="36" y="20" width="28" height="7" fill="#cfd5e6" {...line('#8a93b8', 2.4)} />
      <path d="M36 27 H64 V70 L50 92 L36 70 Z" fill="#ffd34d" {...line('#c99a2a')} />
      <path d="M45 27 V70 M55 27 V70" {...line('#f0b52a', 2)} />
      <path d="M36 70 L50 92 L64 70 Z" fill="#f6dcb5" {...line('#c99a2a', 2.6)} />
      <path d="M46 85 L50 92 L54 85 Z" fill={INK} />
      <Brows y={41} gap={14} />
      <Eyes y={47} gap={14} r={3.2} />
      <Mouth y={55} kind="flat" w={5} />
      <path d="M36 50 L24 56 M64 50 L76 44" {...line('#c99a2a', 2.6)} />
      <path d="M72 38 L80 50" {...line('#8a93b8', 3)} />
    </>
  ),
  golem: () => (
    <>
      <ellipse cx="50" cy="93" rx="34" ry="4" fill="#000" opacity="0.15" />
      <path d="M14 46 L22 22 L46 14 L78 20 L88 44 L84 82 L60 90 L24 86 Z" fill="#b7bccb" {...line('#6c728a')} />
      <path d="M22 22 L34 34 L46 14 M78 20 L66 34 M14 46 L30 50 M88 44 L72 52 M24 86 L34 72 M60 90 L58 74" fill="none" {...line('#8e94a8', 2)} />
      <rect x="31" y="58" width="38" height="20" rx="3" fill="#9aa0b4" {...line('#6c728a', 2.2)} />
      <text x="50" y="73" textAnchor="middle" fontSize="12" fontWeight="900" fill="#ffe680">
        あ A 가
      </text>
      <Brows y={38} gap={20} />
      <Eyes y={45} gap={20} r={4} color="#ffcf4d" />
      <circle cx="30" cy="20" r="3" fill="#8be3b5" />
    </>
  ),
  ninja: () => (
    <>
      <path d="M20 46 L22 14 L44 30 Z" fill="#3a4170" {...line('#20254a')} />
      <path d="M80 46 L78 14 L56 30 Z" fill="#3a4170" {...line('#20254a')} />
      <ellipse cx="50" cy="56" rx="33" ry="30" fill="#3a4170" {...line('#20254a')} />
      <path d="M22 46 C34 40 66 40 78 46 L78 60 C66 56 34 56 22 60 Z" fill="#ffe2bd" />
      <path d="M17 38 C34 32 66 32 83 38" fill="none" {...line('#e8445a', 6)} />
      <path d="M83 38 L94 30 M83 38 L95 44" {...line('#e8445a', 4)} />
      <Brows y={44} gap={20} />
      <Eyes y={51} gap={20} r={3.8} />
      <path d="M44 70 L56 70" {...line('#7d86c4', 2)} />
      <path d={starPath(84, 76, 8, 3)} fill="#cfd5e6" {...line('#8a93b8', 1.6)} />
    </>
  ),
  dokkaebi: () => (
    <>
      <path d="M50 8 L56 26 L44 26 Z" fill="#ffe680" {...line('#c99a2a', 2.6)} />
      <path d="M22 34 C14 24 18 14 26 18 M78 34 C86 24 82 14 74 18" fill="none" {...line('#4a8a3a', 4)} />
      <circle cx="50" cy="52" r="30" fill="#ff8a5c" {...line('#c4542a')} />
      <path d="M22 40 C30 26 70 26 78 40 C70 34 30 34 22 40 Z" fill="#4a8a3a" />
      <Brows y={45} gap={20} />
      <Eyes y={52} gap={20} r={4.4} />
      <Blush y={60} gap={38} color="#ff5c6c" />
      <Mouth y={63} kind="open" w={7} />
      <Fang x={45} y={63} />
      <Fang x={55} y={63} />
      <rect x="80" y="48" width="10" height="38" rx="5" fill="#c98a5b" {...line('#8a5a33', 2.4)} transform="rotate(20 85 67)" />
      <circle cx="80" cy="52" r="3" fill="#ffe680" />
    </>
  ),
  demon: () => (
    <>
      <path d="M24 30 C12 22 10 8 16 4 C18 14 26 18 32 22 Z" fill="#ffe2bd" {...line('#c99a6b', 2.4)} />
      <path d="M76 30 C88 22 90 8 84 4 C82 14 74 18 68 22 Z" fill="#ffe2bd" {...line('#c99a6b', 2.4)} />
      <path d="M36 20 L40 6 L46 16 L50 4 L54 16 L60 6 L64 20 Z" fill="#ffd34d" {...line('#c99a2a', 2.4)} />
      <circle cx="50" cy="11" r="2.4" fill="#ff7aa8" />
      <path d="M14 56 C14 32 30 20 50 20 C70 20 86 32 86 56 C86 78 70 92 50 92 C30 92 14 78 14 56 Z" fill="#9d7bff" {...line('#5a3f9e')} />
      <ellipse cx="50" cy="70" rx="20" ry="14" fill="#c4b0ff" />
      <path d="M26 40 L44 46 M74 40 L56 46" {...line(INK, 3.2)} />
      <Eyes y={52} gap={24} r={5} color="#2b1d4a" />
      <circle cx="38" cy="52" r="7" fill="none" {...line('#ffd34d', 1.6)} opacity="0.7" />
      <circle cx="62" cy="52" r="7" fill="none" {...line('#ffd34d', 1.6)} opacity="0.7" />
      <Mouth y={66} kind="open" w={9} />
      <Fang x={43} y={66} />
      <Fang x={57} y={66} />
      <g transform="rotate(-12 82 82)">
        <rect x="70" y="68" width="24" height="28" rx="2" fill="#ffffff" {...line('#8a93b8', 2)} />
        <path d="M74 76 H90 M74 81 H88 M74 86 H90" {...line('#cfd5e6', 1.6)} />
        <text x="82" y="94" textAnchor="middle" fontSize="9" fontWeight="900" fill="#e8445a">
          0
        </text>
      </g>
      <Sparkle x={10} y={70} s={5} color="#ffd34d" />
    </>
  ),
};

export function MonsterArt({ id, size = 96 }: { id: EnemyId; size?: number | string }) {
  return <Art size={size}>{ART[id]()}</Art>;
}
