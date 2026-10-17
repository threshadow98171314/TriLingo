// 扭蛋機插畫：貼紙扭蛋（粉紅色）、動態貼紙扭蛋（夜空紫，會閃）、外觀扭蛋（金色，戴皇冠）。
// spin 為 true 時旋鈕會轉、膠囊會晃（動畫在 shop.css）。
import { Art, Eyes, line, Mouth, Sparkle, starPath } from './kit';

export type MachineVariant = 'basic' | 'anim' | 'look';

const CAPSULES: [number, number, number][] = [
  [37, 41, 8.5],
  [58, 28, 8.5],
  [61, 49, 8.5],
  [42, 58, 7],
  [40, 23, 6],
  [70, 36, 6],
];

export function GachaArt({ variant, size = 96, spin }: { variant: MachineVariant; size?: number; spin?: boolean }) {
  const c = {
    basic: { dome: '#eaf6ff', domeLine: '#8fb6d9', body: '#ff7a8f', bodyLine: '#c94a5e', knob: '#ffd34d', knobLine: '#c99a2a', caps: ['#ff9fbf', '#9fd4ff', '#ffe066', '#a8e6a1', '#d0b4ff', '#ffb36b'] },
    anim: { dome: '#262c66', domeLine: '#141a4a', body: '#8f7cff', bodyLine: '#5a45c9', knob: '#7ff0ff', knobLine: '#2fa9c9', caps: ['#ff7ad9', '#7ff0ff', '#ffe066', '#9dff9a', '#c4a8ff', '#ffb36b'] },
    look: { dome: '#fff7e0', domeLine: '#d9b04a', body: '#f5b82e', bodyLine: '#b07a10', knob: '#ff6b6b', knobLine: '#c43a3a', caps: [] as string[] },
  }[variant];
  return (
    <Art size={size} className={`gacha-art ga-${variant}${spin ? ' ga-spin' : ''}`}>
      {variant === 'look' && (
        <g>
          <path d="M34 12 L38 3 L44 9 L50 1 L56 9 L62 3 L66 12 Z" fill="#ffd34d" {...line('#b07a10', 2)} />
          <circle cx="50" cy="5" r="2.2" fill="#ff6b6b" />
        </g>
      )}
      <circle cx="50" cy="38" r="31" fill={c.dome} {...line(c.domeLine)} />
      <g className="ga-caps">
        {variant === 'look'
          ? // 外觀扭蛋：裡面是小禮物盒、皇冠、星星
            [
              [37, 42, '#b48cff'],
              [60, 30, '#ff8fb0'],
              [61, 50, '#6ab8ff'],
            ].map(([x, y, f]) => (
              <g key={String(x)}>
                <rect x={Number(x) - 7} y={Number(y) - 6} width="14" height="12" rx="2" fill={String(f)} {...line('#ffffff', 1.4)} />
                <path d={`M${x} ${Number(y) - 6} V${Number(y) + 6} M${Number(x) - 7} ${y} H${Number(x) + 7}`} {...line('#ffe680', 2)} />
              </g>
            ))
          : CAPSULES.map(([x, y, r], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r={r} fill={c.caps[i]} />
                <path d={`M${x - r} ${y} H${x + r}`} {...line('rgba(255,255,255,0.75)', 1.6)} />
              </g>
            ))}
        {variant === 'look' && <path d={starPath(42, 22, 6)} fill="#ffe066" {...line('#d9b04a', 1.4)} />}
      </g>
      {variant === 'anim' && (
        <g>
          <g className="sa-twinkle">
            <Sparkle x={30} y={30} s={4} color="#ffffff" />
          </g>
          <g className="sa-twinkle" style={{ animationDelay: '0.6s' }}>
            <Sparkle x={66} y={20} s={3.5} color="#fff6b0" />
          </g>
        </g>
      )}
      <path d="M30 18 Q36 12 44 12" fill="none" {...line('rgba(255,255,255,0.85)', 3)} />
      <path d="M21 58 H79 V86 C79 90 75 93 71 93 H29 C25 93 21 90 21 86 Z" fill={c.body} {...line(c.bodyLine)} />
      {variant === 'anim' && (
        <g fill="#fff6b0">
          <path d={starPath(70, 66, 3.6)} />
          <path d={starPath(28, 66, 2.8)} />
        </g>
      )}
      {variant === 'look' && <path d="M21 64 H79" {...line('#ffe680', 3)} />}
      <g className="ga-knob">
        <circle cx="40" cy="75" r="8.5" fill={c.knob} {...line(c.knobLine, 2)} />
        <path d="M34.5 75 H45.5" {...line(c.knobLine, 2.4)} />
      </g>
      <rect x="57" y="78" width="15" height="9" rx="2" fill="#3a3a4a" />
      <Eyes x={64} y={68} gap={7} r={1.8} color="#ffffff" />
      <Mouth x={64} y={71} w={3} color="#ffffff" />
    </Art>
  );
}
