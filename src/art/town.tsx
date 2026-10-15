// 情境小鎮的建築插畫：每棟建築的上半部都有一張小臉。
import type { ReactNode } from 'react';
import { Art, Blush, Eyes, Flower, INK, line, Mouth, starPath } from './kit';

const EDGE = '#6f7896';

const Shadow = () => <ellipse cx="50" cy="93" rx="42" ry="4.5" fill="rgba(0,0,0,0.13)" />;

/** 建築的小臉 */
function BFace({ y = 52, gap = 16, x = 50 }: { y?: number; gap?: number; x?: number }) {
  return (
    <g>
      <Eyes x={x} y={y} gap={gap} r={2.6} />
      <Blush x={x} y={y + 4.2} gap={gap + 11} rx={3.2} ry={1.9} />
      <Mouth x={x} y={y + 3.6} w={4} />
    </g>
  );
}

function Door({ x = 41, y = 66, w = 18, h = 23, fill = '#bfe3ff' }: { x?: number; y?: number; w?: number; h?: number; fill?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2.5" fill={fill} {...line(EDGE, 2)} />
      <path d={`M${x + w / 2} ${y} V${y + h}`} {...line(EDGE, 1.5)} />
    </g>
  );
}

function Win({ x, y, w = 14, h = 12, fill = '#dff1ff' }: { x: number; y: number; w?: number; h?: number; fill?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={fill} {...line(EDGE, 1.8)} />
      <path d={`M${x + 3} ${y + h - 3} L${x + 7} ${y + 3}`} {...line('#ffffff', 1.6)} />
    </g>
  );
}

/** 條紋遮雨棚 */
function Awning({ y, colors, x1 = 8, x2 = 92 }: { y: number; colors: [string, string]; x1?: number; x2?: number }) {
  const n = 7;
  const w = (x2 - x1) / n;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M${x1 + i * w} ${y} H${x1 + (i + 1) * w} V${y + 9} Q${x1 + (i + 0.5) * w} ${y + 14} ${x1 + i * w} ${y + 9} Z`} fill={colors[i % 2]} />
      ))}
      <path d={`M${x1} ${y} H${x2}`} {...line(EDGE, 2)} />
    </g>
  );
}

function Tree({ x, y, s = 1, face }: { x: number; y: number; s?: number; face?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="4" width="6" height="14" rx="2" fill="#b07a4f" />
      <circle r="14" fill="#7fd36a" {...line('#4f9a3a', 2.4)} />
      <circle cx="-5" cy="-5" r="4" fill="#a8e892" />
      {face && <BFace y={-1} gap={10} x={0} />}
    </g>
  );
}

const BUILDINGS: Record<string, () => ReactNode> = {
  konbini: () => (
    <>
      <Shadow />
      <rect x="30" y="18" width="40" height="15" rx="4" fill="#ffffff" {...line(EDGE, 2)} />
      <text x="50" y="29.5" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#3fb67a">
        24h
      </text>
      <rect x="10" y="33" width="80" height="57" rx="5" fill="#fffaf2" {...line(EDGE)} />
      <rect x="10" y="33" width="80" height="5" fill="#4cc38a" />
      <rect x="10" y="38" width="80" height="4" fill="#ff9447" />
      <rect x="10" y="42" width="80" height="3" fill="#e8484f" />
      <BFace y={52} />
      <Win x={15} y={64} w={20} h={14} />
      <Win x={65} y={64} w={20} h={14} />
      <Door x={41} y={63} />
    </>
  ),
  post: () => (
    <>
      <Shadow />
      <rect x="18" y="32" width="72" height="58" rx="5" fill="#ff8a8a" {...line('#c94848')} />
      <rect x="40" y="14" width="30" height="20" rx="3" fill="#ffffff" {...line('#c94848', 2)} />
      <path d="M41 15.5 L55 25 L69 15.5" fill="none" {...line('#c94848', 2)} />
      <BFace y={46} x={54} />
      <Win x={24} y={60} />
      <Win x={70} y={60} />
      <Door x={46} y={66} fill="#ffe0e0" />
      <rect x="4" y="56" width="14" height="34" rx="6" fill="#e8484f" {...line('#a82a32', 2)} />
      <rect x="7" y="64" width="8" height="2.6" rx="1" fill="#5a1a1f" />
    </>
  ),
  station: () => (
    <>
      <Shadow />
      <rect x="40" y="12" width="20" height="28" rx="3" fill="#ffe2b8" {...line(EDGE, 2)} />
      <circle cx="50" cy="22" r="7" fill="#ffffff" {...line(EDGE, 1.8)} />
      <path d="M50 22 V17.5 M50 22 L53 23.5" {...line(INK, 1.5)} />
      <path d="M6 42 L50 30 L94 42 Z" fill="#8b97c2" {...line('#4f5a85', 2.4)} />
      <rect x="10" y="42" width="80" height="44" rx="3" fill="#ffefd6" {...line(EDGE)} />
      <BFace y={51} />
      <path d="M16 84 V68 Q16 62 24 62 Q32 62 32 68 V84 Z" fill="#dff1ff" {...line(EDGE, 1.8)} />
      <path d="M68 84 V68 Q68 62 76 62 Q84 62 84 68 V84 Z" fill="#dff1ff" {...line(EDGE, 1.8)} />
      <Door x={41} y={63} h={21} />
      <path d="M2 90 H98" {...line('#8a7a6a', 2.5)} />
      <path d="M2 94 H98" {...line('#8a7a6a', 2.5)} />
    </>
  ),
  bank: () => (
    <>
      <Shadow />
      <path d="M8 38 L50 14 L92 38 Z" fill="#eef1f8" {...line(EDGE, 2.4)} />
      <circle cx="50" cy="29" r="6.5" fill="#ffd34d" {...line('#c99a2a', 1.8)} />
      <rect x="12" y="38" width="76" height="8" fill="#dfe4f2" {...line(EDGE, 2)} />
      <rect x="14" y="46" width="72" height="38" fill="#f6f7fc" {...line(EDGE, 2)} />
      {[19, 33, 61, 75].map((x) => (
        <rect key={x} x={x} y="54" width="6" height="30" rx="1.5" fill="#ffffff" {...line(EDGE, 1.6)} />
      ))}
      <BFace y={51} gap={14} />
      <Door x={42} y={62} w={16} h={22} fill="#c9d6ff" />
      <rect x="8" y="84" width="84" height="6" rx="1.5" fill="#dfe4f2" {...line(EDGE, 1.8)} />
    </>
  ),
  hospital: () => (
    <>
      <Shadow />
      <rect x="14" y="26" width="72" height="64" rx="5" fill="#ffffff" {...line(EDGE)} />
      <rect x="42" y="8" width="16" height="16" rx="3" fill="#ffffff" {...line('#e8484f', 2)} />
      <path d="M50 11 V21 M45 16 H55" {...line('#e8484f', 3.2)} />
      <BFace y={38} />
      {[20, 70].map((x) => [50, 64].map((y) => <Win key={`${x}${y}`} x={x} y={y} w={10} h={9} />))}
      <Door x={40} y={64} w={20} h={26} fill="#d6f0ff" />
      <rect x="14" y="26" width="72" height="5" fill="#ff9fb1" />
    </>
  ),
  pharmacy: () => (
    <>
      <Shadow />
      <rect x="12" y="34" width="76" height="56" rx="5" fill="#eafaf0" {...line(EDGE)} />
      <rect x="38" y="12" width="24" height="24" rx="5" fill="#4cc38a" {...line('#2f8a5c', 2)} />
      <path d="M50 16 V32 M42 24 H58" {...line('#ffffff', 4)} />
      <Awning y={36} colors={['#4cc38a', '#ffffff']} x1={12} x2={88} />
      <BFace y={57} />
      <Win x={17} y={68} w={18} h={13} />
      <Win x={65} y={68} w={18} h={13} />
      <Door x={41} y={67} h={23} />
    </>
  ),
  police: () => (
    <>
      <Shadow />
      <path d="M40 22 Q50 10 60 22 Z" fill="#ff5d6c" {...line('#c43d4a', 2)} />
      <path d="M12 36 L50 20 L88 36 Z" fill="#5a6fd6" {...line('#36459e', 2.4)} />
      <rect x="16" y="36" width="68" height="54" rx="4" fill="#dfe7ff" {...line(EDGE)} />
      <path d={starPath(50, 44, 6, 2.8)} fill="#ffd34d" {...line('#c99a2a', 1.4)} />
      <BFace y={56} />
      <Win x={21} y={66} />
      <Win x={65} y={66} />
      <Door x={42} y={67} w={16} h={23} />
    </>
  ),
  cafe: () => (
    <>
      <Shadow />
      <rect x="12" y="30" width="76" height="60" rx="5" fill="#e9c9a3" {...line('#8a5a33')} />
      <rect x="34" y="12" width="32" height="18" rx="5" fill="#fff8ec" {...line('#8a5a33', 2)} />
      <path d="M43 17 H55 V24 Q55 27 52 27 H46 Q43 27 43 24 Z" fill="#c97a3d" />
      <path d="M55 19 Q59 19 59 22 Q59 25 55 24" fill="none" {...line('#c97a3d', 1.6)} />
      <Awning y={32} colors={['#8a5a33', '#fff3e0']} x1={12} x2={88} />
      <BFace y={53} />
      <Win x={17} y={64} w={20} h={15} fill="#fff3d6" />
      <Door x={58} y={63} w={18} h={27} fill="#fff3d6" />
      <circle cx="27" cy="83" r="5" fill="#7fd36a" />
    </>
  ),
  restaurant: () => (
    <>
      <Shadow />
      <rect x="12" y="32" width="76" height="58" rx="5" fill="#ffd6b8" {...line('#c96a3d')} />
      <circle cx="50" cy="20" r="12" fill="#ffffff" {...line('#c96a3d', 2)} />
      <path d="M45 13 V27 M42 13 V18 Q42 20 45 20 Q48 20 48 18 V13" fill="none" {...line('#8a93b8', 1.6)} />
      <path d="M55 13 Q59 16 57 21 L55 21 V27" fill="none" {...line('#8a93b8', 1.6)} />
      <Awning y={34} colors={['#e8484f', '#ffffff']} x1={12} x2={88} />
      <BFace y={55} />
      <Win x={17} y={66} w={18} h={13} fill="#fff3d6" />
      <Win x={65} y={66} w={18} h={13} fill="#fff3d6" />
      <Door x={41} y={66} h={24} fill="#fff3d6" />
    </>
  ),
  supermarket: () => (
    <>
      <Shadow />
      <rect x="6" y="30" width="88" height="60" rx="5" fill="#d7f3f5" {...line('#2f8f99')} />
      <rect x="30" y="12" width="40" height="18" rx="5" fill="#ffffff" {...line('#2f8f99', 2)} />
      <path d="M38 16 H42 L45 25 H58 L61 18 H43" fill="none" {...line('#2f8f99', 2)} />
      <circle cx="46.5" cy="27" r="1.6" fill="#2f8f99" />
      <circle cx="56.5" cy="27" r="1.6" fill="#2f8f99" />
      <BFace y={42} />
      <Win x={11} y={56} w={24} h={20} />
      <Win x={65} y={56} w={24} h={20} />
      <Door x={38} y={60} w={24} h={30} />
    </>
  ),
  hotel: () => (
    <>
      <Shadow />
      <rect x="22" y="8" width="56" height="82" rx="5" fill="#c9c2ff" {...line('#6b5fd0')} />
      <circle cx="50" cy="17" r="6" fill="#ffffff" {...line('#6b5fd0', 1.8)} />
      <text x="50" y="20.6" textAnchor="middle" fontSize="9" fontWeight="900" fill="#6b5fd0">
        H
      </text>
      <BFace y={31} />
      {[42, 54, 66].map((y) => [27, 45, 63].map((x) => <Win key={`${x}${y}`} x={x} y={y} w={10} h={8} fill="#fff6c9" />))}
      <Door x={40} y={76} w={20} h={14} fill="#fff6c9" />
      {[44, 50, 56].map((x) => (
        <path key={x} d={starPath(x, 73, 2.2, 1)} fill="#ffd34d" />
      ))}
    </>
  ),
  school: () => (
    <>
      <Shadow />
      <path d="M58 6 V18" {...line('#8a93b8', 2)} />
      <path d="M58 6 L70 10 L58 14 Z" fill="#ff7a7a" />
      <rect x="40" y="16" width="20" height="24" rx="3" fill="#ffe2c4" {...line(EDGE, 2)} />
      <circle cx="50" cy="26" r="6" fill="#ffffff" {...line(EDGE, 1.8)} />
      <path d="M50 26 V22 M50 26 L53 27" {...line(INK, 1.4)} />
      <rect x="10" y="40" width="80" height="50" rx="4" fill="#ffe9d6" {...line(EDGE)} />
      <BFace y={50} />
      {[15, 30, 58, 73].map((x) => (
        <Win key={x} x={x} y={62} w={12} h={10} />
      ))}
      <Door x={42} y={70} w={16} h={20} />
    </>
  ),
  library: () => (
    <>
      <Shadow />
      <path d="M8 36 L50 16 L92 36 Z" fill="#5a6fd6" {...line('#36459e', 2.4)} />
      <path d="M38 28 Q44 24 50 28 Q56 24 62 28 V36 Q56 32 50 36 Q44 32 38 36 Z" fill="#ffffff" {...line('#36459e', 1.6)} />
      <rect x="12" y="36" width="76" height="54" rx="4" fill="#e3e8ff" {...line(EDGE)} />
      <BFace y={47} />
      <Win x={17} y={60} w={14} h={18} />
      <Win x={69} y={60} w={14} h={18} />
      <Door x={41} y={63} h={27} fill="#fff3d6" />
    </>
  ),
  park: () => (
    <>
      <Shadow />
      <ellipse cx="62" cy="78" rx="24" ry="8" fill="#9fd4ff" {...line('#4f9ad9', 2)} />
      <rect x="10" y="74" width="26" height="5" rx="2" fill="#c98a5b" />
      <path d="M13 79 V86 M33 79 V86" {...line('#8a5a33', 2.4)} />
      <rect x="10" y="66" width="26" height="4" rx="2" fill="#c98a5b" />
      <Tree x={70} y={36} s={1.1} />
      <Tree x={36} y={34} s={1.5} face />
      <Flower x={84} y={66} r={5} fill="#ffc8da" stroke="#e88aac" />
      <Flower x={8} y={58} r={4.5} fill="#fff3a6" stroke="#d9b020" />
    </>
  ),
  office: () => (
    <>
      <Shadow />
      <rect x="24" y="6" width="52" height="84" rx="4" fill="#bfe1ff" {...line('#4f7fb8')} />
      <rect x="42" y="12" width="16" height="11" rx="2" fill="#a9744a" {...line('#6b4430', 1.6)} />
      <path d="M46 12 V10 H54 V12" fill="none" {...line('#6b4430', 1.6)} />
      <BFace y={31} />
      {[42, 52, 62].map((y) => [29, 43, 57].map((x) => <rect key={`${x}${y}`} x={x} y={y} width="12" height="7" rx="1.5" fill="#e6f4ff" {...line('#4f7fb8', 1.4)} />))}
      <Door x={40} y={73} w={20} h={17} fill="#e6f4ff" />
    </>
  ),
  shrine: () => (
    <>
      <Shadow />
      <path d="M16 40 Q50 22 84 40 L80 44 Q50 30 20 44 Z" fill="#8a5a3a" {...line('#5e3a22', 2)} />
      <rect x="26" y="44" width="48" height="30" rx="2" fill="#fff4e3" {...line('#8a5a3a')} />
      <BFace y={54} />
      <rect x="44" y="62" width="12" height="12" fill="#e9c98a" {...line('#8a5a3a', 1.6)} />
      <path d="M6 62 Q50 54 94 62 L92 67 Q50 60 8 67 Z" fill="#e8484f" {...line('#a82a32', 2)} />
      <rect x="14" y="69" width="72" height="4" rx="1" fill="#e8484f" {...line('#a82a32', 1.6)} />
      <rect x="18" y="64" width="6" height="28" rx="1.5" fill="#e8484f" {...line('#a82a32', 1.6)} />
      <rect x="76" y="64" width="6" height="28" rx="1.5" fill="#e8484f" {...line('#a82a32', 1.6)} />
    </>
  ),
  jjimjil: () => (
    <>
      <Shadow />
      <g fill="none" {...line('#ff8a8a', 2.6)}>
        <path d="M40 18 Q36 13 40 8 Q44 3 40 -2" />
        <path d="M50 18 Q46 13 50 8 Q54 3 50 -2" />
        <path d="M60 18 Q56 13 60 8 Q64 3 60 -2" />
      </g>
      <path d="M32 26 Q32 18 50 18 Q68 18 68 26 Z" fill="#ff8a8a" {...line('#c94848', 2)} />
      <rect x="12" y="26" width="76" height="64" rx="6" fill="#ffe4e4" {...line('#c94848')} />
      <BFace y={40} />
      <Win x={17} y={52} w={16} h={14} fill="#fff6c9" />
      <Win x={67} y={52} w={16} h={14} fill="#fff6c9" />
      <Door x={40} y={62} w={20} h={28} fill="#fff6c9" />
    </>
  ),
  airport: () => (
    <>
      <Shadow />
      <rect x="70" y="14" width="10" height="46" rx="2" fill="#e3e8ff" {...line(EDGE, 2)} />
      <rect x="64" y="8" width="22" height="10" rx="3" fill="#9fd4ff" {...line(EDGE, 2)} />
      <path d="M6 56 Q40 44 74 56 V90 H6 Z" fill="#dfe7ff" {...line(EDGE)} />
      <BFace y={66} x={38} />
      {[12, 26, 50].map((x) => (
        <Win key={x} x={x} y={75} w={12} h={9} />
      ))}
      <g transform="translate(26 22) rotate(-12)">
        <path d="M-18 0 Q-18 -4 -12 -4 H14 Q20 -4 22 0 Q20 4 14 4 H-12 Q-18 4 -18 0 Z" fill="#ffffff" {...line(EDGE, 1.8)} />
        <path d="M0 -3 L-6 -14 H-1 L8 -3 Z" fill="#9fd4ff" {...line(EDGE, 1.6)} />
        <path d="M0 3 L-6 14 H-1 L8 3 Z" fill="#9fd4ff" {...line(EDGE, 1.6)} />
        <path d="M-16 -2 L-20 -9 H-16 L-11 -2 Z" fill="#ff7a8f" />
      </g>
    </>
  ),
};

export function BuildingArt({ id, size = 72 }: { id: string; size?: number | string }) {
  const draw = BUILDINGS[id];
  return draw ? <Art size={size}>{draw()}</Art> : null;
}

/** 蓋章：完成挑戰的地點會蓋上紅色印章 */
export function StampArt({ size = 40, text = '済' }: { size?: number; text?: string }) {
  return (
    <svg className="stamp" width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <g transform="rotate(-14 50 50)" opacity="0.88">
        <circle cx="50" cy="50" r="42" fill="rgba(255,255,255,0.75)" stroke="#e8484f" strokeWidth="6" />
        <circle cx="50" cy="50" r="33" fill="none" stroke="#e8484f" strokeWidth="2.5" />
        <text x="50" y={text.length > 1 ? 58 : 63} textAnchor="middle" fontSize={text.length > 2 ? 22 : text.length > 1 ? 26 : 38} fontWeight="900" fill="#e8484f">
          {text}
        </text>
      </g>
    </svg>
  );
}
