// 圖片題用的插畫：水果、食物、飲料、交通工具、天氣、日用品…，再加上頭像（動物）、貼紙（食物、物品）、小鎮建築。
// 哪個中文意思對應哪張圖寫在 engine/pictures.ts。
import type { ReactNode } from 'react';
import { avatarDraw } from './avatars';
import { Art, Blush, Eyes, Face, Flower, INK, line, Mouth, Sparkle } from './kit';
import { STICKER_BY_ID } from './stickers';
import { buildingDraw } from './town';

export interface Picture {
  id: string;
  draw: () => ReactNode;
}

const NEW: Picture[] = [
  // ───── 水果 ─────
  {
    id: 'apple',
    draw: () => (
      <>
        <path d="M50 30 C36 17 13 27 15 52 C17 75 34 89 50 84 C66 89 83 75 85 52 C87 27 64 17 50 30 Z" fill="#ff6b6b" {...line('#c43d3d')} />
        <path d="M50 30 Q51 18 57 11" fill="none" {...line('#8a5a33', 3)} />
        <path d="M54 22 Q66 9 77 17 Q67 28 54 22 Z" fill="#7fd36a" {...line('#3f9a3a', 2)} />
        <Face y={56} gap={18} />
      </>
    ),
  },
  {
    id: 'banana',
    draw: () => (
      <>
        <path d="M17 26 Q19 70 60 84 Q80 88 88 76 Q60 72 44 52 Q32 36 31 20 Z" fill="#ffe066" {...line('#d9b020')} />
        <path d="M17 26 L15 16 L27 14 L31 20 Z" fill="#8a6a3a" {...line('#5e4524', 2)} />
        <Eyes x={50} y={66} gap={11} r={2.6} />
        <Mouth x={50} y={70} w={4} />
      </>
    ),
  },
  {
    id: 'grape',
    draw: () => (
      <>
        <path d="M50 16 Q54 8 60 6" fill="none" {...line('#8a5a33', 3)} />
        <path d="M52 14 Q66 6 74 14 Q64 22 52 14 Z" fill="#7fd36a" {...line('#3f9a3a', 2)} />
        {[
          [36, 30],
          [50, 28],
          [64, 30],
          [30, 46],
          [44, 46],
          [58, 46],
          [72, 46],
          [38, 62],
          [52, 62],
          [66, 62],
          [45, 77],
          [59, 77],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="9" fill="#a78bfa" {...line('#6d4fc4', 2)} />
        ))}
        <Eyes x={51} y={47} gap={12} r={2.4} />
        <Mouth x={51} y={51} w={3.4} />
      </>
    ),
  },
  {
    id: 'strawberry',
    draw: () => (
      <>
        <path d="M50 26 C70 22 86 34 82 52 C78 70 60 86 50 90 C40 86 22 70 18 52 C14 34 30 22 50 26 Z" fill="#ff5d6c" {...line('#c43d4a')} />
        <path d="M34 26 L42 18 L50 26 L58 18 L66 26 L58 30 L50 34 L42 30 Z" fill="#7fd36a" {...line('#3f9a3a', 2)} />
        {[
          [32, 46],
          [68, 46],
          [40, 70],
          [60, 70],
          [50, 80],
        ].map(([x, y]) => (
          <ellipse key={`${x}${y}`} cx={x} cy={y} rx="1.6" ry="2.4" fill="#ffe066" />
        ))}
        <Face y={52} gap={16} r={3.6} />
      </>
    ),
  },
  {
    id: 'watermelon',
    draw: () => (
      <>
        <path d="M8 40 H92 C92 66 74 86 50 86 C26 86 8 66 8 40 Z" fill="#5dbb63" {...line('#2f7a35')} />
        <path d="M15 40 H85 C85 61 70 78 50 78 C30 78 15 61 15 40 Z" fill="#ff6b7a" />
        {[
          [32, 56],
          [68, 56],
          [50, 68],
          [24, 46],
          [76, 46],
        ].map(([x, y]) => (
          <ellipse key={`${x}${y}`} cx={x} cy={y} rx="1.8" ry="2.8" fill={INK} />
        ))}
        <Face y={47} gap={16} r={3.4} blush={false} />
      </>
    ),
  },
  {
    id: 'orange',
    draw: () => (
      <>
        <circle cx="50" cy="55" r="34" fill="#ffa53d" {...line('#d9772a')} />
        <path d="M50 22 Q60 10 72 16 Q64 26 50 22 Z" fill="#7fd36a" {...line('#3f9a3a', 2)} />
        <circle cx="38" cy="40" r="2" fill="#ffd19a" />
        <circle cx="66" cy="62" r="2" fill="#ffd19a" />
        <Face y={56} gap={18} />
      </>
    ),
  },
  {
    id: 'peach',
    draw: () => (
      <>
        <path d="M50 26 C66 14 88 30 84 54 C80 76 64 88 50 88 C36 88 20 76 16 54 C12 30 34 14 50 26 Z" fill="#ffb3c1" {...line('#e07a92')} />
        <path d="M50 28 Q46 50 50 86" fill="none" {...line('#f598ad', 2)} />
        <path d="M52 24 Q62 10 74 14 Q66 26 52 24 Z" fill="#7fd36a" {...line('#3f9a3a', 2)} />
        <Face y={58} gap={20} />
      </>
    ),
  },
  // ───── 飲料、食物 ─────
  {
    id: 'water',
    draw: () => (
      <>
        <path d="M50 8 C60 26 80 44 80 62 C80 80 66 90 50 90 C34 90 20 80 20 62 C20 44 40 26 50 8 Z" fill="#8fd0ff" {...line('#3b8fc4')} />
        <path d="M33 58 Q32 70 40 76" fill="none" {...line('#ffffff', 3)} />
        <Face y={60} gap={16} />
      </>
    ),
  },
  {
    id: 'coffee',
    draw: () => (
      <>
        <path d="M38 22 Q34 15 38 8" fill="none" {...line('#d6d6e6', 3)} />
        <path d="M54 22 Q50 15 54 8" fill="none" {...line('#d6d6e6', 3)} />
        <path d="M74 44 C90 44 90 68 72 68" fill="none" {...line('#b0743f', 5)} />
        <path d="M18 30 H76 V74 C76 84 68 90 58 90 H36 C26 90 18 84 18 74 Z" fill="#e7b98f" {...line('#8a5a33')} />
        <ellipse cx="47" cy="31" rx="28" ry="4" fill="#6b3f22" />
        <Face y={56} gap={18} />
      </>
    ),
  },
  {
    id: 'milk',
    draw: () => (
      <>
        <path d="M28 30 L36 14 H64 L72 30 Z" fill="#dbe8ff" {...line('#5a7fc4')} />
        <rect x="28" y="30" width="44" height="60" rx="4" fill="#ffffff" {...line('#5a7fc4')} />
        <rect x="28" y="62" width="44" height="14" fill="#8fb6ff" />
        <Face y={46} gap={16} r={3.6} />
      </>
    ),
  },
  {
    id: 'juice',
    draw: () => (
      <>
        <path d="M58 6 L54 30" {...line('#ff7ab6', 4)} />
        <path d="M24 24 H76 L70 88 H30 Z" fill="#fff3d6" {...line('#c9a06b')} />
        <path d="M26.5 40 H73.5 L70 88 H30 Z" fill="#ffb84d" />
        <circle cx="70" cy="28" r="10" fill="#ffd34d" {...line('#d9a520', 2)} />
        <Face y={58} gap={16} r={3.6} />
      </>
    ),
  },
  {
    id: 'bread',
    draw: () => (
      <>
        <path d="M14 48 C14 26 32 20 50 20 C68 20 86 26 86 48 C86 54 80 56 80 56 V84 C80 88 76 90 72 90 H28 C24 90 20 88 20 84 V56 C20 56 14 54 14 48 Z" fill="#f2b45c" {...line('#c27a2a')} />
        <path d="M26 56 V82 H74 V56" fill="#ffe2b3" />
        <Face y={66} gap={18} />
      </>
    ),
  },
  {
    id: 'egg',
    draw: () => (
      <>
        <path d="M50 10 C68 10 82 40 82 60 C82 80 68 92 50 92 C32 92 18 80 18 60 C18 40 32 10 50 10 Z" fill="#fffaf0" {...line('#c9b8a0')} />
        <Face y={60} gap={18} />
      </>
    ),
  },
  {
    id: 'rice',
    draw: () => (
      <>
        <path d="M20 46 C20 22 80 22 80 46 Z" fill="#ffffff" {...line('#c3c3d3')} />
        <path d="M12 46 H88 C88 70 72 86 50 86 C28 86 12 70 12 46 Z" fill="#7aa2ff" {...line('#3a5ad0')} />
        <path d="M24 60 Q34 56 44 60 Q54 64 64 60 Q72 56 78 60" fill="none" {...line('#c7d6ff', 2.4)} />
        <Eyes y={36} gap={14} r={3} />
        <Mouth y={40} w={4} />
      </>
    ),
  },
  {
    id: 'cake',
    draw: () => (
      <>
        <path d="M14 46 L86 46 L86 84 C86 88 82 90 78 90 H22 C18 90 14 88 14 84 Z" fill="#fff3e0" {...line('#d9a06b')} />
        <path d="M14 46 Q32 30 50 26 Q68 30 86 46 Z" fill="#ffd6e7" {...line('#d9a06b')} />
        <path d="M14 62 H86" {...line('#ff8fb1', 5)} />
        <circle cx="50" cy="20" r="7" fill="#ff5d6c" {...line('#c43d4a', 2)} />
        <path d="M50 13 Q52 8 56 8" fill="none" {...line('#3f9a3a', 2)} />
        <Face y={74} gap={18} r={3.6} />
      </>
    ),
  },
  {
    id: 'icecream',
    draw: () => (
      <>
        <path d="M30 50 L50 94 L70 50 Z" fill="#f2b45c" {...line('#c27a2a')} />
        <path d="M36 58 L58 70 M40 66 L62 58" {...line('#c27a2a', 1.8)} />
        <path d="M24 50 C16 50 16 36 26 34 C26 18 44 12 52 20 C62 12 80 18 76 34 C86 36 84 50 76 50 Z" fill="#ffc8da" {...line('#e07a92')} />
        <Face y={38} gap={16} r={3.4} />
      </>
    ),
  },
  // ───── 交通工具 ─────
  {
    id: 'car',
    draw: () => (
      <>
        <path d="M10 60 C10 52 14 48 22 48 L32 30 C34 26 38 24 42 24 H62 C66 24 70 26 72 30 L80 48 C88 48 92 52 92 60 V70 C92 74 90 76 86 76 H14 C12 76 10 74 10 70 Z" fill="#ff7a7a" {...line('#c43d3d')} />
        <path d="M36 46 L42 32 H50 V46 Z M56 46 V32 H62 L68 46 Z" fill="#dff1ff" {...line('#c43d3d', 1.8)} />
        <circle cx="28" cy="77" r="9" fill="#3a3a4a" {...line('#24242e', 2)} />
        <circle cx="72" cy="77" r="9" fill="#3a3a4a" {...line('#24242e', 2)} />
        <Eyes y={58} gap={20} r={3} />
        <Mouth y={62} w={5} />
      </>
    ),
  },
  {
    id: 'train',
    draw: () => (
      <>
        <rect x="20" y="12" width="60" height="70" rx="16" fill="#7fd36a" {...line('#3f9a3a')} />
        <rect x="28" y="22" width="44" height="24" rx="6" fill="#dff1ff" {...line('#3f9a3a', 2)} />
        <Eyes y={60} gap={22} r={3.4} />
        <Blush y={66} gap={36} />
        <Mouth y={66} w={6} />
        <path d="M28 82 L20 92 M72 82 L80 92" {...line('#6f7896', 3)} />
      </>
    ),
  },
  {
    id: 'plane',
    draw: () => (
      <>
        <path d="M8 52 Q8 42 20 42 H70 Q90 42 94 52 Q90 62 70 62 H20 Q8 62 8 52 Z" fill="#ffffff" {...line('#6f7896')} />
        <path d="M44 44 L30 18 H40 L62 44 Z" fill="#9fd4ff" {...line('#6f7896', 2)} />
        <path d="M44 60 L30 86 H40 L62 60 Z" fill="#9fd4ff" {...line('#6f7896', 2)} />
        <path d="M14 46 L8 30 H16 L26 44 Z" fill="#ff7a8f" {...line('#6f7896', 2)} />
        <Eyes x={76} y={50} gap={8} r={2.4} />
        <Mouth x={76} y={54} w={3.4} />
      </>
    ),
  },
  {
    id: 'bicycle',
    draw: () => (
      <>
        <circle cx="24" cy="66" r="18" fill="none" {...line('#3a3a4a', 4)} />
        <circle cx="76" cy="66" r="18" fill="none" {...line('#3a3a4a', 4)} />
        <path d="M24 66 L42 40 H66 L76 66 M42 40 L52 66 L66 40 M52 66 H24" fill="none" {...line('#ff7a7a', 4)} />
        <path d="M38 34 H48" {...line('#3a3a4a', 4)} />
        <path d="M66 40 L62 28 H72" fill="none" {...line('#3a3a4a', 3.5)} />
      </>
    ),
  },
  {
    id: 'ship',
    draw: () => (
      <>
        <path d="M48 14 V54" {...line('#8a5a33', 3)} />
        <path d="M50 16 L76 48 H50 Z" fill="#ffffff" {...line('#6f7896', 2)} />
        <path d="M12 56 H88 L76 78 H24 Z" fill="#ff8a5a" {...line('#c95a2a')} />
        <Eyes y={64} gap={14} r={2.6} />
        <Mouth y={68} w={4} />
        <path d="M6 84 Q16 78 26 84 Q36 90 46 84 Q56 78 66 84 Q76 90 86 84 Q92 80 96 84" fill="none" {...line('#4f9ad9', 3)} />
      </>
    ),
  },
  {
    id: 'taxi',
    draw: () => (
      <>
        <rect x="38" y="18" width="24" height="10" rx="2" fill="#3a3a4a" />
        <text x="50" y="26" textAnchor="middle" fontSize="7" fontWeight="900" fill="#ffd34d">
          TAXI
        </text>
        <path d="M10 60 C10 52 14 48 22 48 L32 30 C34 28 38 28 42 28 H62 C66 28 70 28 72 30 L80 48 C88 48 92 52 92 60 V70 C92 74 90 76 86 76 H14 C12 76 10 74 10 70 Z" fill="#ffd34d" {...line('#c99a2a')} />
        <path d="M36 46 L42 34 H50 V46 Z M56 46 V34 H62 L68 46 Z" fill="#dff1ff" {...line('#c99a2a', 1.8)} />
        <circle cx="28" cy="77" r="9" fill="#3a3a4a" {...line('#24242e', 2)} />
        <circle cx="72" cy="77" r="9" fill="#3a3a4a" {...line('#24242e', 2)} />
        <Eyes y={58} gap={20} r={3} />
        <Mouth y={62} w={5} />
      </>
    ),
  },
  // ───── 天氣、自然 ─────
  {
    id: 'sun',
    draw: () => (
      <>
        <g {...line('#f5a623', 5)}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return <path key={i} d={`M${50 + 32 * Math.cos(a)} ${50 + 32 * Math.sin(a)} L${50 + 44 * Math.cos(a)} ${50 + 44 * Math.sin(a)}`} />;
          })}
        </g>
        <circle cx="50" cy="50" r="25" fill="#ffd34d" {...line('#f5a623')} />
        <Face y={49} gap={14} r={3.2} />
      </>
    ),
  },
  {
    id: 'cloud',
    draw: () => (
      <>
        <path d="M22 76 C8 76 8 56 22 54 C20 36 42 30 50 42 C56 28 80 32 78 50 C94 50 94 76 78 76 Z" fill="#ffffff" {...line('#a9b6d9')} />
        <Face y={60} gap={16} r={3.4} />
      </>
    ),
  },
  {
    id: 'rain',
    draw: () => (
      <>
        <path d="M22 58 C8 58 8 38 22 36 C20 18 42 12 50 24 C56 10 80 14 78 32 C94 32 94 58 78 58 Z" fill="#cfd8ee" {...line('#7a8ab8')} />
        <Face y={42} gap={14} r={3} mouth="o" mw={5} />
        {[
          [28, 70],
          [46, 76],
          [64, 70],
          [36, 88],
          [56, 90],
        ].map(([x, y]) => (
          <path key={`${x}${y}`} d={`M${x} ${y - 6} Q${x - 3} ${y} ${x} ${y + 2} Q${x + 3} ${y} ${x} ${y - 6} Z`} fill="#6ab8ff" />
        ))}
      </>
    ),
  },
  {
    id: 'snowman',
    draw: () => (
      <>
        <circle cx="50" cy="68" r="24" fill="#ffffff" {...line('#a9b6d9')} />
        <circle cx="50" cy="32" r="18" fill="#ffffff" {...line('#a9b6d9')} />
        <path d="M32 18 H68 L64 8 H36 Z" fill="#3a3a4a" />
        <Eyes y={30} gap={12} r={2.6} />
        <path d="M50 35 L60 37 L50 39 Z" fill="#ff9447" />
        <path d="M34 48 Q50 54 66 48" fill="none" {...line('#ff5d6c', 5)} />
        <circle cx="50" cy="64" r="2.4" fill={INK} />
        <circle cx="50" cy="74" r="2.4" fill={INK} />
      </>
    ),
  },
  {
    id: 'snow',
    draw: () => (
      <>
        <g {...line('#6ab8ff', 5)}>
          {[0, 60, 120].map((a) => (
            <path key={a} d="M50 10 V90" transform={`rotate(${a} 50 50)`} />
          ))}
        </g>
        <g {...line('#6ab8ff', 4)} fill="none">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path key={a} d="M42 20 L50 28 L58 20" transform={`rotate(${a} 50 50)`} />
          ))}
        </g>
        <circle cx="50" cy="50" r="14" fill="#ffffff" {...line('#6ab8ff', 2.5)} />
        <Eyes y={48} gap={9} r={2.2} />
        <Mouth y={52} w={3.4} />
      </>
    ),
  },
  {
    id: 'moon',
    draw: () => (
      <>
        <path d="M62 10 C36 12 20 34 22 56 C24 78 44 92 66 88 C46 82 36 66 36 50 C36 32 46 16 62 10 Z" fill="#ffe680" {...line('#d9b020')} />
        <Eyes x={33} y={52} gap={8} r={2.4} closed />
        <Mouth x={34} y={58} w={4} />
        <Sparkle x={70} y={30} s={7} color="#ffe680" />
        <Sparkle x={80} y={58} s={5} color="#ffe680" />
      </>
    ),
  },
  {
    id: 'tree',
    draw: () => (
      <>
        <rect x="44" y="60" width="12" height="30" rx="3" fill="#b07a4f" {...line('#7a5032', 2)} />
        <circle cx="50" cy="42" r="32" fill="#7fd36a" {...line('#4f9a3a')} />
        <circle cx="38" cy="30" r="7" fill="#a8e892" />
        <Face y={44} gap={16} />
      </>
    ),
  },
  {
    id: 'flower',
    draw: () => (
      <>
        <path d="M50 54 V92" {...line('#3f9a3a', 4)} />
        <path d="M50 76 Q36 66 30 72 Q38 82 50 78 Z" fill="#7fd36a" {...line('#3f9a3a', 2)} />
        <Flower x={50} y={36} r={28} fill="#ffb3cf" stroke="#e07a92" center="#ffe08a" />
        <circle cx="50" cy="36" r="10" fill="#ffe08a" />
        <Eyes y={35} gap={8} r={2} />
        <Mouth y={38} w={3} />
      </>
    ),
  },
  {
    id: 'sea',
    draw: () => (
      <>
        <circle cx="72" cy="26" r="12" fill="#ffd34d" />
        <path d="M4 50 Q16 42 28 50 Q40 58 52 50 Q64 42 76 50 Q88 58 96 50 V92 H4 Z" fill="#6ab8ff" {...line('#3b8fc4')} />
        <path d="M4 68 Q16 60 28 68 Q40 76 52 68 Q64 60 76 68 Q88 76 96 68" fill="none" {...line('#c7e6ff', 3)} />
        <Eyes y={78} gap={16} r={3} />
        <Mouth y={82} w={5} />
      </>
    ),
  },
  // ───── 日用品 ─────
  {
    id: 'bag',
    draw: () => (
      <>
        <path d="M34 32 V24 C34 14 66 14 66 24 V32" fill="none" {...line('#8a5a33', 4)} />
        <rect x="16" y="30" width="68" height="60" rx="12" fill="#ff9447" {...line('#c95a2a')} />
        <rect x="30" y="58" width="40" height="22" rx="5" fill="#ffb877" {...line('#c95a2a', 2)} />
        <Face y={44} gap={18} />
      </>
    ),
  },
  {
    id: 'phone',
    draw: () => (
      <>
        <rect x="26" y="8" width="48" height="84" rx="10" fill="#3a3f5c" {...line('#24283d')} />
        <rect x="31" y="16" width="38" height="64" rx="4" fill="#9fd4ff" />
        <Face y={46} gap={14} r={3.2} />
        <circle cx="50" cy="86" r="3" fill="#6f7896" />
      </>
    ),
  },
  {
    id: 'key',
    draw: () => (
      <>
        <circle cx="32" cy="40" r="20" fill="#ffd34d" {...line('#c99a2a')} />
        <circle cx="32" cy="40" r="7" fill="#fff6d0" {...line('#c99a2a', 2)} />
        <path d="M48 52 L84 88 M70 74 L78 66 M78 82 L86 74" fill="none" {...line('#c99a2a', 6)} />
        <Eyes x={30} y={26} gap={10} r={2.2} />
      </>
    ),
  },
  {
    id: 'clock',
    draw: () => (
      <>
        <circle cx="24" cy="18" r="10" fill="#ff7a7a" {...line('#c43d3d', 2)} />
        <circle cx="76" cy="18" r="10" fill="#ff7a7a" {...line('#c43d3d', 2)} />
        <circle cx="50" cy="54" r="36" fill="#ffffff" {...line('#c43d3d', 4)} />
        <path d="M50 54 V32 M50 54 L64 62" {...line(INK, 3)} />
        <Eyes y={46} gap={30} r={3} />
        <Blush y={62} gap={42} />
      </>
    ),
  },
  {
    id: 'shoes',
    draw: () => (
      <>
        <path d="M10 70 V44 C10 38 16 34 22 36 L34 40 C40 42 44 48 50 52 L80 62 C88 64 92 70 90 78 H10 Z" fill="#6a8cff" {...line('#3a5ad0')} />
        <path d="M10 78 H90 V84 H10 Z" fill="#ffffff" {...line('#3a5ad0', 2)} />
        <path d="M34 46 L40 52 M40 42 L46 50" {...line('#ffffff', 2.4)} />
        <Eyes x={66} y={68} gap={10} r={2.4} />
      </>
    ),
  },
  {
    id: 'hat',
    draw: () => (
      <>
        <ellipse cx="50" cy="70" rx="44" ry="12" fill="#f3d27a" {...line('#c9a043')} />
        <path d="M26 68 C26 30 74 30 74 68 Z" fill="#f6db8c" {...line('#c9a043')} />
        <path d="M27 58 Q50 64 73 58 L74 66 Q50 72 26 66 Z" fill="#ff7a8f" />
        <Eyes y={48} gap={16} r={3} />
        <Mouth y={52} w={4} />
      </>
    ),
  },
  {
    id: 'glasses',
    draw: () => (
      <>
        <circle cx="30" cy="54" r="18" fill="#e3f2ff" {...line(INK, 4)} />
        <circle cx="70" cy="54" r="18" fill="#e3f2ff" {...line(INK, 4)} />
        <path d="M48 52 Q50 48 52 52" fill="none" {...line(INK, 4)} />
        <path d="M12 50 L4 42 M88 50 L96 42" {...line(INK, 4)} />
        <Eyes y={54} gap={40} r={3} />
      </>
    ),
  },
  {
    id: 'camera',
    draw: () => (
      <>
        <rect x="12" y="30" width="76" height="52" rx="10" fill="#8b97c2" {...line('#4f5a85')} />
        <rect x="36" y="20" width="24" height="12" rx="3" fill="#8b97c2" {...line('#4f5a85', 2.4)} />
        <circle cx="50" cy="56" r="18" fill="#ffffff" {...line('#4f5a85', 3)} />
        <circle cx="50" cy="56" r="10" fill="#3a3f5c" />
        <circle cx="46" cy="52" r="3" fill="#ffffff" />
        <circle cx="76" cy="40" r="3" fill="#ffd34d" />
      </>
    ),
  },
  {
    id: 'tv',
    draw: () => (
      <>
        <path d="M38 18 L50 30 L62 18" fill="none" {...line('#6f7896', 3)} />
        <rect x="10" y="30" width="80" height="56" rx="10" fill="#6f7896" {...line('#4f5a85')} />
        <rect x="18" y="38" width="64" height="40" rx="6" fill="#9fd4ff" />
        <Face y={56} gap={18} r={3.4} />
      </>
    ),
  },
  {
    id: 'computer',
    draw: () => (
      <>
        <rect x="14" y="16" width="72" height="50" rx="6" fill="#3a3f5c" {...line('#24283d')} />
        <rect x="20" y="22" width="60" height="38" rx="3" fill="#c7e6ff" />
        <Face y={40} gap={16} r={3.2} />
        <path d="M6 74 H94 L88 84 H12 Z" fill="#b8bfd6" {...line('#6f7896')} />
      </>
    ),
  },
  {
    id: 'letter',
    draw: () => (
      <>
        <rect x="10" y="24" width="80" height="56" rx="6" fill="#fff6e3" {...line('#c9a06b')} />
        <path d="M10 28 L50 58 L90 28" fill="none" {...line('#c9a06b', 3)} />
        <path d="M44 64 C44 60 49 59 50 63 C51 59 56 60 56 64 C56 68 50 72 50 72 C50 72 44 68 44 64 Z" fill="#ff7aa8" />
      </>
    ),
  },
  {
    id: 'chair',
    draw: () => (
      <>
        <rect x="28" y="12" width="44" height="40" rx="8" fill="#c98a5b" {...line('#8a5a33')} />
        <rect x="22" y="52" width="56" height="12" rx="4" fill="#e0a877" {...line('#8a5a33')} />
        <path d="M28 64 V92 M72 64 V92" {...line('#8a5a33', 5)} />
        <Eyes y={30} gap={14} r={2.8} />
        <Mouth y={34} w={4} />
      </>
    ),
  },
  {
    id: 'desk',
    draw: () => (
      <>
        <rect x="8" y="36" width="84" height="12" rx="4" fill="#c98a5b" {...line('#8a5a33')} />
        <path d="M16 48 V88 M84 48 V88" {...line('#8a5a33', 6)} />
        <rect x="56" y="48" width="24" height="22" rx="3" fill="#e0a877" {...line('#8a5a33', 2)} />
        <Eyes x={68} y={56} gap={9} r={2.2} />
        <Mouth x={68} y={60} w={3} />
      </>
    ),
  },
];

/** 其他插畫也拿來當圖片：頭像（動物）、貼紙（食物、物品）、小鎮建築 */
const REUSE: [kind: 'avatar' | 'sticker' | 'building', id: string][] = [
  ['avatar', '🐱'],
  ['avatar', '🐶'],
  ['avatar', '🦊'],
  ['avatar', '🐣'],
  ['avatar', '🐼'],
  ['avatar', '🐯'],
  ['avatar', '🦁'],
  ['avatar', '🐸'],
  ['avatar', '🐧'],
  ['avatar', '🦉'],
  ['avatar', '🐰'],
  ['avatar', '🐻'],
  ['avatar', '🐹'],
  ['avatar', '🐨'],
  ['avatar', '🐷'],
  ['avatar', '🐮'],
  ['avatar', '🐵'],
  ['avatar', '🐳'],
  ['avatar', '🐙'],
  ['avatar', '🦖'],
  ['avatar', '🤖'],
  ['avatar', '👻'],
  ['sticker', 'onigiri'],
  ['sticker', 'sushi'],
  ['sticker', 'dango'],
  ['sticker', 'ramen'],
  ['sticker', 'kimchi'],
  ['sticker', 'tteokbokki'],
  ['sticker', 'kimbap'],
  ['sticker', 'bibimbap'],
  ['sticker', 'teacup'],
  ['sticker', 'burger'],
  ['sticker', 'pizza'],
  ['sticker', 'umbrella'],
  ['sticker', 'crown'],
  ['sticker', 'pencil'],
  ['sticker', 'book'],
  ['sticker', 'star'],
  ['sticker', 'bulb'],
  ['sticker', 'rainbow'],
  ['sticker', 'fuji'],
  ['sticker', 'sakura'],
  ['sticker', 'matcha'],
  ['sticker', 'bus'],
  ['building', 'station'],
  ['building', 'konbini'],
  ['building', 'cafe'],
  ['building', 'hotel'],
  ['building', 'post'],
  ['building', 'bank'],
  ['building', 'restaurant'],
  ['building', 'office'],
  ['building', 'hospital'],
  ['building', 'pharmacy'],
  ['building', 'supermarket'],
  ['building', 'library'],
  ['building', 'police'],
  ['building', 'school'],
  ['building', 'park'],
  ['building', 'shrine'],
  ['building', 'airport'],
];

function reused(): Picture[] {
  const out: Picture[] = [];
  for (const [kind, id] of REUSE) {
    const draw = kind === 'avatar' ? avatarDraw(id) : kind === 'sticker' ? STICKER_BY_ID.get(id)?.draw : buildingDraw(id);
    if (draw) out.push({ id: `${kind}:${id}`, draw });
  }
  return out;
}

export const PICTURES: Picture[] = [...NEW, ...reused()];
export const PICTURE_BY_ID = new Map(PICTURES.map((p) => [p.id, p]));


export function PictureArt({ id, size = 96 }: { id: string; size?: number | string }) {
  const p = PICTURE_BY_ID.get(id);
  return p ? <Art size={size}>{p.draw()}</Art> : null;
}
