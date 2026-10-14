// 段位徽章：全部用 SVG 畫出來，段位越高裝飾越多（翅膀 → 寶石 → 皇冠 → 光芒）。
import { useId, type CSSProperties } from 'react';
import { rankOf, stepName, tierOfStep, TIERS, TOP_TIER } from '../core/ranks';
import { cx } from '../core/util';
import { Bar } from './ui';

const SHIELD = 'M50 20 L76 29 V55 C76 72 64 84 50 91 C36 84 24 72 24 55 V29 Z';
const INNER = 'M50 27 L70 34 V55 C70 68 61 77.5 50 83.5 C39 77.5 30 68 30 55 V34 Z';
const FEATHERS = ['M25 38 L5 27 L15 46 Z', 'M25 50 L3 45 L16 59 Z', 'M26 61 L8 64 L21 72 Z'];
const CROWN = 'M35 21 L31 5 L42 13 L50 2 L58 13 L69 5 L65 21 Z';
const GEM = 'M50 3 L59 13 L50 23 L41 13 Z';

export function RankEmblem({ step, size = 64, className }: { step: number; size?: number; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const tier = tierOfStep(step);
  const t = TIERS[tier];
  const [main, light, dark] = t.c;
  const top = tier === TOP_TIER;
  const pips = top ? 0 : (step % 3) + 1;
  const detailed = size >= 40;
  const feathers = tier >= 5 ? 3 : tier >= 3 ? 2 : 0;
  const fill = `url(#g${uid})`;

  return (
    <svg
      className={cx('emblem', `tier-${t.id}`, className)}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={stepName(step)}
    >
      <defs>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.45" stopColor={main} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`s${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`r${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6b9d" />
          <stop offset="0.33" stopColor="#ffd86b" />
          <stop offset="0.66" stopColor="#6bffc8" />
          <stop offset="1" stopColor="#6bb5ff" />
        </linearGradient>
      </defs>

      {tier >= 8 && (
        <g className="emblem-rays" opacity={top ? 0.9 : 0.55}>
          {Array.from({ length: 12 }, (_, i) => (
            <path
              key={i}
              d="M50 54 L46.5 4 L53.5 4 Z"
              fill={top ? `hsl(${i * 30} 90% 70%)` : main}
              transform={`rotate(${i * 30} 50 54)`}
            />
          ))}
        </g>
      )}
      {top && <circle cx="50" cy="54" r="44" fill="none" stroke={`url(#r${uid})`} strokeWidth="2.5" />}

      {feathers > 0 &&
        [false, true].map((flip) => (
          <g key={String(flip)} transform={flip ? 'translate(100 0) scale(-1 1)' : undefined}>
            {FEATHERS.slice(0, feathers).map((d) => (
              <path key={d} d={d} fill={fill} stroke={dark} strokeWidth="1.5" strokeLinejoin="round" />
            ))}
          </g>
        ))}

      {tier >= 6 && <path d={CROWN} fill={fill} stroke={dark} strokeWidth="2" strokeLinejoin="round" />}
      {tier === 5 && <path d={GEM} fill={light} stroke={dark} strokeWidth="2" strokeLinejoin="round" />}

      <path d={SHIELD} fill={fill} stroke={top ? `url(#r${uid})` : dark} strokeWidth="3" strokeLinejoin="round" />
      <path d={INNER} fill={dark} opacity="0.5" />
      <path d={SHIELD} fill={`url(#s${uid})`} opacity="0.55" />

      {tier >= 6 && (
        <>
          <circle cx="50" cy="12" r="3" fill={light} stroke={dark} strokeWidth="1" />
          <circle cx="36" cy="14" r="2" fill={light} stroke={dark} strokeWidth="0.8" />
          <circle cx="64" cy="14" r="2" fill={light} stroke={dark} strokeWidth="0.8" />
        </>
      )}

      {detailed && (
        <text
          x="50"
          y={pips ? 51 : 55}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="25"
          fontWeight="900"
          fill="#fff"
          stroke={t.ink}
          strokeWidth="2.2"
          paintOrder="stroke"
          strokeLinejoin="round"
        >
          {t.glyph}
        </text>
      )}
      {detailed &&
        Array.from({ length: pips }, (_, i) => {
          const x = 50 + (i - (pips - 1) / 2) * 9;
          return <path key={i} d={`M${x} 68.5 l3.4 3.5 l-3.4 3.5 l-3.4 -3.5 Z`} fill={light} stroke={t.ink} strokeWidth="0.8" />;
        })}
    </svg>
  );
}

/** 徽章＋段位名稱＋本階進度條 */
export function RankLine({ xp, size = 56, compact }: { xp: number; size?: number; compact?: boolean }) {
  const r = rankOf(xp);
  const color = TIERS[r.tier].c[0];
  return (
    <div className={cx('rank-line', compact && 'compact')} style={{ '--rank': color } as CSSProperties}>
      <RankEmblem step={r.step} size={size} />
      <div className="rank-info">
        <div className="rank-name">
          <b>{r.name}</b>
          <span>{xp.toLocaleString()} XP</span>
        </div>
        <Bar v={r.progress} color={color} />
        {!compact && <small>{r.next !== null ? `再 ${r.toNext.toLocaleString()} XP 升上「${r.nextName}」` : '已達最高段位'}</small>}
      </div>
    </div>
  );
}
