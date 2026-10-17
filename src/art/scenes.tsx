// 名片背景：每一款都是一整幅小插畫（晚霞、竹林、城市夜景、星空、櫻花、極光、海浪、銀河、煙火）。
// 畫在 400×160 的座標裡，用 slice 填滿整張名片；會動的部分加 cs-* class（動畫在 shop.css）。
import { useId, type CSSProperties, type ReactNode } from 'react';

const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

/** 固定的「隨機」點：同一個 seed 每次畫出來都一樣 */
function dots(n: number, seed: number, w = 400, h = 160): [number, number, number][] {
  let x = seed;
  const r = () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
  return Array.from({ length: n }, () => [r() * w, r() * h, r()]);
}

function Sky({ id, stops }: { id: string; stops: string[] }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {stops.map((c, i) => (
            <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect width="400" height="160" fill={`url(#${id})`} />
    </>
  );
}

const SCENES: Record<string, (u: string) => ReactNode> = {
  sunset: (u) => (
    <>
      <Sky id={`${u}s`} stops={['#ffcf7a', '#ff8a6b', '#c45a8f', '#5a3f8f']} />
      <ellipse cx="90" cy="38" rx="46" ry="9" fill="#ffd9c2" opacity="0.6" />
      <ellipse cx="180" cy="58" rx="60" ry="8" fill="#ffc2c8" opacity="0.45" />
      <circle cx="300" cy="112" r="34" fill="#fff0a8" />
      <rect y="112" width="400" height="48" fill="#4a3a7a" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={300 - 34 + i * 6} y={120 + i * 8} width={68 - i * 12} height="3" rx="1.5" fill="#ffe08a" opacity={0.8 - i * 0.12} />
      ))}
      <g fill="none" stroke="#3a2a4a" strokeWidth="2.2" strokeLinecap="round">
        <path d="M70 70 q6 -6 12 0 q6 -6 12 0" />
        <path d="M110 58 q5 -5 10 0 q5 -5 10 0" />
        <path d="M150 76 q4 -4 8 0 q4 -4 8 0" />
      </g>
    </>
  ),
  bamboo: (u) => (
    <>
      <Sky id={`${u}b`} stops={['#e8fbd8', '#a8e08f', '#5aa84a']} />
      <path d="M150 0 L210 0 L120 160 L60 160 Z" fill="#ffffff" opacity="0.18" />
      <path d="M260 0 L300 0 L230 160 L190 160 Z" fill="#ffffff" opacity="0.12" />
      {[
        [30, 14, '#3f8a2a'],
        [78, 18, '#4f9a3a'],
        [140, 12, '#2f7a24'],
        [250, 16, '#4f9a3a'],
        [312, 20, '#3f8a2a'],
        [372, 13, '#2f7a24'],
      ].map(([x, w, c]) => (
        <g key={String(x)}>
          <rect x={Number(x)} y="0" width={Number(w)} height="160" fill={String(c)} />
          <rect x={Number(x) + 2} y="0" width="3" height="160" fill="#ffffff" opacity="0.18" />
          {[28, 64, 100, 136].map((y) => (
            <rect key={y} x={Number(x) - 1} y={y} width={Number(w) + 2} height="3" fill="#1f5a18" opacity="0.6" />
          ))}
        </g>
      ))}
      {[
        [96, 30, -30],
        [100, 40, 20],
        [268, 70, -20],
        [272, 82, 30],
        [330, 20, -40],
        [48, 110, 25],
      ].map(([x, y, a], i) => (
        <ellipse key={i} cx={x} cy={y} rx="16" ry="4" fill="#6fbf4a" transform={`rotate(${a} ${x} ${y})`} />
      ))}
    </>
  ),
  city: (u) => (
    <>
      <Sky id={`${u}c`} stops={['#141c42', '#3b2a7a', '#c4607a']} />
      <circle cx="350" cy="30" r="14" fill="#fff6c2" />
      <circle cx="356" cy="26" r="13" fill="#2a2560" />
      {dots(18, 7, 400, 70).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.1" fill="#ffffff" opacity="0.8" />
      ))}
      {/* 東京鐵塔 */}
      <path d="M110 40 L96 128 H124 Z" fill="#ff6b3d" />
      <path d="M103 80 H117 M100 100 H120" stroke="#ffffff" strokeWidth="2" />
      {/* 南山塔 */}
      <rect x="248" y="44" width="4" height="84" fill="#c9cfdc" />
      <ellipse cx="250" cy="66" rx="10" ry="5" fill="#e6e9f5" />
      {/* 帝國大廈 */}
      <path d="M326 128 V70 H332 V56 H336 V40 H338 V56 H342 V70 H348 V128 Z" fill="#1d2350" />
      {[
        [0, 40, 70],
        [44, 30, 88],
        [128, 46, 80],
        [178, 36, 96],
        [216, 30, 72],
        [262, 40, 90],
        [354, 46, 78],
      ].map(([x, w, h]) => (
        <rect key={x} x={x} y={160 - h} width={w} height={h} fill="#232a5c" />
      ))}
      {dots(34, 3, 400, 50).map(([x, y], i) => (
        <rect key={i} x={x} y={112 + y * 0.9} width="4" height="5" fill="#ffd86b" opacity={0.85} />
      ))}
    </>
  ),
  starry: (u) => (
    <>
      <Sky id={`${u}n`} stops={['#070a24', '#1b1650', '#3a2a78']} />
      {dots(46, 11).map(([x, y, r], i) => (
        <circle key={i} className={i % 3 ? undefined : 'cs-twinkle'} style={d(r * 3)} cx={x} cy={y * 0.85} r={0.8 + r * 1.6} fill={i % 7 ? '#ffffff' : '#ffe680'} />
      ))}
      <path d="M318 22 A20 20 0 1 0 338 50 A15 15 0 1 1 318 22 Z" fill="#fff3b0" />
      <g className="cs-shoot">
        <path d="M80 20 L150 50" stroke={`url(#${u}sh)`} strokeWidth="2.4" strokeLinecap="round" />
        <defs>
          <linearGradient id={`${u}sh`} x1="1" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </g>
      <path d="M0 140 C60 120 120 130 180 138 C240 146 300 118 400 132 V160 H0 Z" fill="#120d30" />
    </>
  ),
  sakura: (u) => (
    <>
      <Sky id={`${u}k`} stops={['#fff0f5', '#ffd1e0', '#ffb3cc']} />
      <path d="M0 18 C40 22 70 40 110 36 C130 34 150 24 170 28" fill="none" stroke="#7a4a3a" strokeWidth="6" strokeLinecap="round" />
      <path d="M400 30 C360 34 340 54 300 52 C285 51 270 44 255 48" fill="none" stroke="#7a4a3a" strokeWidth="6" strokeLinecap="round" />
      {[
        [20, 16],
        [48, 24],
        [76, 34],
        [104, 32],
        [134, 30],
        [160, 26],
        [380, 26],
        [352, 38],
        [326, 50],
        [298, 50],
        [272, 46],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="11" fill="#ff9fbf" />
          <circle cx={x + 7} cy={y + 6} r="8" fill="#ffc2d6" />
          <circle cx={x - 2} cy={y - 2} r="2.4" fill="#fff6b0" />
        </g>
      ))}
      {dots(14, 5).map(([x, , r], i) => (
        <ellipse key={i} className="cs-fall" style={d(-r * 6)} cx={x} cy={-10} rx="4" ry="2.6" fill={i % 2 ? '#ff9fbf' : '#ffffff'} />
      ))}
      <ellipse cx="200" cy="168" rx="240" ry="26" fill="#ffffff" opacity="0.6" />
    </>
  ),
  aurora: (u) => (
    <>
      <Sky id={`${u}a`} stops={['#04101f', '#0b2238', '#123a4a']} />
      {dots(20, 9, 400, 80).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1" fill="#ffffff" opacity="0.8" />
      ))}
      <defs>
        <linearGradient id={`${u}ag`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5af0b4" stopOpacity="0" />
          <stop offset="0.5" stopColor="#5af0b4" stopOpacity="0.8" />
          <stop offset="1" stopColor="#5af0b4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${u}ap`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c47bff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c47bff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#c47bff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="cs-aurora" d="M-40 60 C40 10 120 90 200 40 C280 -10 360 70 440 30 V90 C360 120 280 60 200 100 C120 140 40 60 -40 110 Z" fill={`url(#${u}ag)`} />
      <path className="cs-aurora" style={d(-3)} d="M-40 40 C60 70 140 0 220 30 C300 60 360 10 440 40 V70 C360 40 300 90 220 60 C140 30 60 100 -40 70 Z" fill={`url(#${u}ap)`} />
      <path d="M0 160 L60 104 L96 128 L160 80 L220 130 L270 96 L330 136 L380 108 L400 120 V160 Z" fill="#0a1a2a" />
      <path d="M160 80 L176 92 L168 92 L160 86 L152 94 L146 92 Z M60 104 L72 114 L60 110 L50 114 Z" fill="#ffffff" opacity="0.9" />
    </>
  ),
  ocean: (u) => (
    <>
      <Sky id={`${u}o`} stops={['#7fd0ff', '#c7ecff', '#eaf8ff']} />
      <circle cx="70" cy="40" r="20" fill="#fff3b0" />
      <path d="M280 70 L280 40 L300 66 Z" fill="#ffffff" stroke="#9aa6c4" strokeWidth="1.5" />
      <path d="M268 72 H304 L298 80 H274 Z" fill="#e0574a" />
      <g fill="none" stroke="#5a6278" strokeWidth="2" strokeLinecap="round">
        <path d="M180 36 q5 -5 10 0 q5 -5 10 0" />
        <path d="M210 26 q4 -4 8 0 q4 -4 8 0" />
      </g>
      <g className="cs-wave">
        <path d="M0 84 C25 74 50 94 75 84 C100 74 125 94 150 84 C175 74 200 94 225 84 C250 74 275 94 300 84 C325 74 350 94 375 84 C400 74 425 94 450 84 C475 74 500 94 525 84 V160 H0 Z" fill="#4fb0f0" />
      </g>
      <g className="cs-wave slow">
        <path d="M0 106 C25 96 50 116 75 106 C100 96 125 116 150 106 C175 96 200 116 225 106 C250 96 275 116 300 106 C325 96 350 116 375 106 C400 96 425 116 450 106 C475 96 500 116 525 106 V160 H0 Z" fill="#2f86d6" />
      </g>
      <g className="cs-wave">
        <path d="M0 130 C25 120 50 140 75 130 C100 120 125 140 150 130 C175 120 200 140 225 130 C250 120 275 140 300 130 C325 120 350 140 375 130 C400 120 425 140 450 130 C475 120 500 140 525 130 V160 H0 Z" fill="#1d5fa8" />
      </g>
    </>
  ),
  galaxy: (u) => (
    <>
      <rect width="400" height="160" fill="#0b0820" />
      <defs>
        <radialGradient id={`${u}g1`}>
          <stop offset="0" stopColor="#c44bd6" stopOpacity="0.8" />
          <stop offset="1" stopColor="#c44bd6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${u}g2`}>
          <stop offset="0" stopColor="#1f6fd6" stopOpacity="0.8" />
          <stop offset="1" stopColor="#1f6fd6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="70" rx="140" ry="70" fill={`url(#${u}g1)`} />
      <ellipse cx="300" cy="96" rx="140" ry="70" fill={`url(#${u}g2)`} />
      {dots(40, 13).map(([x, y, r], i) => (
        <circle key={i} className={i % 4 ? undefined : 'cs-twinkle'} style={d(r * 3)} cx={x} cy={y} r={0.6 + r * 1.2} fill="#ffffff" />
      ))}
      <g className="cs-spin" style={{ transformOrigin: '210px 80px' }}>
        {Array.from({ length: 36 }, (_, i) => {
          const a = i * 0.5;
          const rr = 6 + i * 1.6;
          return <circle key={i} cx={210 + Math.cos(a) * rr} cy={80 + Math.sin(a) * rr * 0.55} r={i % 3 ? 1.4 : 2.2} fill={i % 2 ? '#ffd1f0' : '#cfe6ff'} />;
        })}
        {Array.from({ length: 36 }, (_, i) => {
          const a = i * 0.5 + Math.PI;
          const rr = 6 + i * 1.6;
          return <circle key={`b${i}`} cx={210 + Math.cos(a) * rr} cy={80 + Math.sin(a) * rr * 0.55} r={i % 3 ? 1.4 : 2.2} fill={i % 2 ? '#fff6c2' : '#e8d9ff'} />;
        })}
        <circle cx="210" cy="80" r="7" fill="#fff6e0" />
      </g>
      <circle cx="345" cy="38" r="14" fill="#ffb36b" />
      <ellipse cx="345" cy="38" rx="24" ry="6" fill="none" stroke="#ffe0b0" strokeWidth="2.5" transform="rotate(-18 345 38)" />
    </>
  ),
  fireworks: (u) => (
    <>
      <Sky id={`${u}f`} stops={['#0a0d2a', '#1f1650', '#3a2266']} />
      {[
        [90, 50, '#ff7a7a', 0],
        [220, 36, '#ffd34d', 0.8],
        [330, 56, '#7ad8ff', 1.6],
        [160, 70, '#c4a8ff', 2.2],
      ].map(([x, y, c, dl]) => (
        <g key={String(x)} className="cs-burst" style={{ ...d(Number(dl)), transformOrigin: `${x}px ${y}px` }}>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={Number(x) + Math.cos(a) * 8} y1={Number(y) + Math.sin(a) * 8} x2={Number(x) + Math.cos(a) * 26} y2={Number(y) + Math.sin(a) * 26} stroke={String(c)} strokeWidth="2.4" strokeLinecap="round" />;
          })}
          <circle cx={x} cy={y} r="3" fill="#ffffff" />
        </g>
      ))}
      <rect y="128" width="400" height="32" fill="#151236" />
      <path d="M0 128 H400" stroke="#3a2f6e" strokeWidth="2" />
      {[30, 70, 110, 150, 190, 230, 270, 310, 350, 390].map((x, i) => (
        <g key={x}>
          <path d={`M${x - 20} 116 Q${x} 122 ${x + 20} 116`} fill="none" stroke="#5a4a8a" strokeWidth="1.2" />
          <ellipse cx={x} cy="122" rx="6" ry="8" fill={i % 2 ? '#ff6b3d' : '#ffb347'} />
          <rect x={x - 2} y="128" width="4" height="10" fill={i % 2 ? '#ff6b3d' : '#ffb347'} opacity="0.35" />
        </g>
      ))}
    </>
  ),
};

export const SCENE_IDS = Object.keys(SCENES);

/** 名片背景插畫：放在名片最底層，填滿整張卡片 */
export function CardScene({ id, className }: { id: string; className?: string }) {
  const u = useId().replace(/:/g, '');
  const draw = SCENES[id];
  if (!draw) return null;
  return (
    <svg className={`card-scene cs-${id}${className ? ` ${className}` : ''}`} viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {draw(u)}
    </svg>
  );
}
