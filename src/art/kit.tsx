// 插畫的共用零件：統一的可愛畫風（圓潤外形、深棕色線條、有反光的豆豆眼、腮紅）。
// 所有插畫都畫在 100×100 的座標裡，外層的 <Art> 負責尺寸與貼紙白邊。
import { useId, type ReactNode } from 'react';

/** 線條與眼睛的顏色：比純黑柔和的深棕色 */
export const INK = '#4a3535';
export const BLUSH = '#ff8fa6';

/** 一般線條的共用屬性 */
export const line = (color = INK, w = 3) => ({ stroke: color, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

/** 兩顆有反光的豆豆眼 */
export function Eyes({ x = 50, y = 54, gap = 16, r = 4.2, color = INK, closed }: { x?: number; y?: number; gap?: number; r?: number; color?: string; closed?: boolean }) {
  const xs = [x - gap / 2, x + gap / 2];
  if (closed) {
    return (
      <g fill="none" {...line(color, 2.4)}>
        {xs.map((cx) => (
          <path key={cx} d={`M${cx - r} ${y} Q${cx} ${y - r * 1.2} ${cx + r} ${y}`} />
        ))}
      </g>
    );
  }
  return (
    <g>
      {xs.map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={y} rx={r * 0.86} ry={r} fill={color} />
          <circle cx={cx + r * 0.32} cy={y - r * 0.42} r={r * 0.36} fill="#fff" />
        </g>
      ))}
    </g>
  );
}

/** 腮紅 */
export function Blush({ x = 50, y = 61, gap = 27, rx = 5, ry = 3, color = BLUSH, opacity = 0.6 }: { x?: number; y?: number; gap?: number; rx?: number; ry?: number; color?: string; opacity?: number }) {
  return (
    <g fill={color} opacity={opacity}>
      <ellipse cx={x - gap / 2} cy={y} rx={rx} ry={ry} />
      <ellipse cx={x + gap / 2} cy={y} rx={rx} ry={ry} />
    </g>
  );
}

export type MouthKind = 'smile' | 'cat' | 'open' | 'o' | 'flat' | 'tongue';

/** 嘴巴：smile 微笑、cat 貓嘴（ω）、open 開心張嘴、o 小圓嘴、flat 一字、tongue 吐舌 */
export function Mouth({ x = 50, y = 61, kind = 'smile', w = 6, color = INK }: { x?: number; y?: number; kind?: MouthKind; w?: number; color?: string }) {
  switch (kind) {
    case 'cat':
      return <path d={`M${x - w} ${y} Q${x - w / 2} ${y + w * 0.75} ${x} ${y} Q${x + w / 2} ${y + w * 0.75} ${x + w} ${y}`} fill="none" {...line(color, 2.2)} />;
    case 'open':
      return (
        <g>
          <path d={`M${x - w} ${y} Q${x} ${y + w * 1.6} ${x + w} ${y} Z`} fill="#b8475a" {...line(color, 2)} />
          <path d={`M${x - w * 0.5} ${y + w * 0.62} Q${x} ${y + w * 0.3} ${x + w * 0.5} ${y + w * 0.62}`} fill="#ff8a9b" />
        </g>
      );
    case 'o':
      return <ellipse cx={x} cy={y + 1} rx={w * 0.38} ry={w * 0.48} fill="#b8475a" {...line(color, 1.8)} />;
    case 'flat':
      return <path d={`M${x - w * 0.6} ${y + 1} H${x + w * 0.6}`} fill="none" {...line(color, 2.2)} />;
    case 'tongue':
      return (
        <g>
          <path d={`M${x - w * 0.5} ${y + w * 0.35} Q${x - w * 0.5} ${y + w * 1.4} ${x} ${y + w * 1.4} Q${x + w * 0.5} ${y + w * 1.4} ${x + w * 0.5} ${y + w * 0.35}`} fill="#ff8a9b" {...line(color, 1.8)} />
          <path d={`M${x - w} ${y} Q${x} ${y + w * 0.9} ${x + w} ${y}`} fill="none" {...line(color, 2.2)} />
        </g>
      );
    default:
      return <path d={`M${x - w / 2} ${y} Q${x} ${y + w * 0.7} ${x + w / 2} ${y}`} fill="none" {...line(color, 2.2)} />;
  }
}

/** 一張可愛的臉：眼睛＋腮紅＋嘴巴 */
export function Face({
  x = 50,
  y = 54,
  gap = 16,
  r = 4.2,
  mouth = 'smile',
  mw = 6,
  blush = true,
  closed,
}: {
  x?: number;
  y?: number;
  gap?: number;
  r?: number;
  mouth?: MouthKind;
  mw?: number;
  blush?: boolean;
  closed?: boolean;
}) {
  return (
    <g>
      <Eyes x={x} y={y} gap={gap} r={r} closed={closed} />
      {blush && <Blush x={x} y={y + r + 3} gap={gap + 12} />}
      <Mouth x={x} y={y + r + 4} kind={mouth} w={mw} />
    </g>
  );
}

/** 四角星閃光 */
export function Sparkle({ x, y, s = 6, color = '#fff6b0' }: { x: number; y: number; s?: number; color?: string }) {
  return <path d={`M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z`} fill={color} />;
}

/** 五角星（圓角） */
export function starPath(cx: number, cy: number, R: number, r = R * 0.48): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r : R;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
}

/** 花瓣（櫻花、木槿花）：n 片繞圓心 */
export function Flower({ x, y, r, n = 5, fill, stroke, center = '#ffd36b', notch }: { x: number; y: number; r: number; n?: number; fill: string; stroke: string; center?: string; notch?: boolean }) {
  const petals = Array.from({ length: n }, (_, i) => (i * 360) / n);
  const d = notch
    ? `M0 0 C${-r * 0.55} ${-r * 0.35} ${-r * 0.5} ${-r * 0.95} ${-r * 0.16} ${-r} L0 ${-r * 0.84} L${r * 0.16} ${-r} C${r * 0.5} ${-r * 0.95} ${r * 0.55} ${-r * 0.35} 0 0 Z`
    : `M0 0 C${-r * 0.6} ${-r * 0.3} ${-r * 0.45} ${-r} 0 ${-r} C${r * 0.45} ${-r} ${r * 0.6} ${-r * 0.3} 0 0 Z`;
  return (
    <g transform={`translate(${x} ${y})`}>
      {petals.map((a) => (
        <path key={a} d={d} transform={`rotate(${a})`} fill={fill} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
      ))}
      <circle r={r * 0.22} fill={center} />
    </g>
  );
}

/**
 * 插畫外框：固定 100×100 座標。sticker 為 true 時加上貼紙的白邊與淡淡的陰影；
 * dim 為 true 時變成剪影（貼紙簿裡還沒收集到的）。
 */
export function Art({
  children,
  size = 64,
  sticker,
  dim,
  title,
  className,
  behind,
}: {
  children: ReactNode;
  size?: number | string;
  sticker?: boolean;
  dim?: boolean;
  title?: string;
  className?: string;
  /** 畫在白邊濾鏡外面、主體後面的東西（會淡入淡出的小零件：蒸氣、冒出來的愛心、閃光） */
  behind?: ReactNode;
}) {
  const id = useId().replace(/:/g, '');
  const filter = sticker || dim ? `url(#${id})` : undefined;
  return (
    <svg viewBox="-6 -6 112 112" width={size} height={size} className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {(sticker || dim) && (
        <defs>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
            {dim ? (
              <>
                <feFlood floodColor="#8b90b8" floodOpacity="0.55" />
                <feComposite in2="SourceAlpha" operator="in" />
              </>
            ) : (
              <>
                <feMorphology in="SourceAlpha" operator="dilate" radius="3.6" result="grow" />
                <feFlood floodColor="#ffffff" />
                <feComposite in2="grow" operator="in" result="edge" />
                <feGaussianBlur in="grow" stdDeviation="1.6" result="blur" />
                <feOffset in="blur" dy="1.6" result="drop" />
                <feFlood floodColor="#000" floodOpacity="0.28" />
                <feComposite in2="drop" operator="in" result="shadow" />
                <feMerge>
                  <feMergeNode in="shadow" />
                  <feMergeNode in="edge" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </>
            )}
          </filter>
        </defs>
      )}
      {!dim && behind}
      <g filter={filter}>{children}</g>
    </svg>
  );
}
