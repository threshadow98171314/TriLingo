// 結算畫面：課程與所有小遊戲共用。
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { COURSES } from '../content';
import { fx } from '../core/fx';
import { rankOf, TIERS } from '../core/ranks';
import { sfx } from '../core/sfx';
import type { Outcome } from '../core/store';
import type { LangId } from '../core/types';
import { nav } from '../router';
import { RankEmblem } from './RankEmblem';
import { Bar, Coin, Stars, useCountUp } from './ui';

export interface ResultData {
  emoji: string;
  headline: string;
  sub?: string;
  outcome: Outcome;
  /** 統計數字，例如 ['答對率', '90%'] */
  lines: [label: string, value: string][];
  /** 主要按鈕要前往的路徑 */
  back: string;
  backLabel?: string;
  next?: { label: string; to: string };
  again?: { label: string; run: () => void };
}

export function ResultScreen({ data, lang }: { data: ResultData; lang: LangId }) {
  const o = data.outcome;
  const r = o.reward;
  const course = COURSES[lang];
  const before = rankOf(r.before);
  const after = rankOf(r.after);
  // 進度條從作答前的位置長到作答後；升段時從 0 開始長
  const [shown, setShown] = useState(before.step === after.step ? before.progress : 0);
  const xp = useCountUp(r.xp);

  const chestRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (ms: number, f: () => void) => timers.push(setTimeout(f, ms));
    if (!o.passed) {
      sfx.fail();
    } else {
      sfx.complete();
      if (o.perfect) {
        // 全對：煙火＋星星雨＋蓋上 PERFECT 印章
        fx.fireworks(3);
        later(350, () => fx.rain('star', { count: 45, duration: 1600 }));
      } else {
        fx.confetti();
      }
      let at = 1000;
      if (o.lucky) {
        later(at, () => {
          sfx.sparkle();
          fx.banner('幸運星降臨！', '這堂課的 XP 加倍', 'gold');
          fx.rain('emoji', { glyphs: ['🍀', '⭐', '✨'], count: 36 });
        });
        at += 1600;
      }
      if (o.golden) {
        later(at, () => {
          sfx.chest();
          fx.banner('黃金寶箱！', `+${o.chest} 金幣`, 'gold');
          fx.rain('coin', { count: 60 });
        });
      } else if (o.chest > 0) {
        later(at + 100, () => {
          sfx.coin();
          fx.burstAt(chestRef.current, { count: 18, colors: ['#ffe066', '#fbbf24', '#fff3b0'], shapes: ['circle', 'star'] });
        });
      }
    }
    later(400, () => setShown(after.progress));
    return () => timers.forEach(clearTimeout);
    // 只在進入結算畫面時播一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.repeat) nav(data.next?.to ?? data.back);
    };
    // 稍微延後，避免上一題的 Enter 直接把結算畫面按掉
    const t = setTimeout(() => window.addEventListener('keydown', h), 600);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', h);
    };
  }, [data]);

  const color = TIERS[after.tier].c[0];

  return (
    <div className="result" style={{ '--lang': course.color } as CSSProperties}>
      <div className="result-card card">
        {o.perfect && <div className="perfect-stamp">PERFECT</div>}
        <div className="result-emoji">{data.emoji}</div>
        <h1>{data.headline}</h1>
        {data.sub && <p className="muted">{data.sub}</p>}
        {o.stars > 0 && <Stars n={o.stars} className="lg pop" />}

        <div className="result-xp">
          +{xp} <small>XP</small>
          {r.boosted && <span className="chip boost">雙倍 ×2</span>}
        </div>

        <ul className="result-parts">
          {o.parts.map(([label, v]) => (
            <li key={label}>
              <span>{label}</span>
              <b>+{v}</b>
            </li>
          ))}
        </ul>

        {data.lines.length > 0 && (
          <div className="result-lines">
            {data.lines.map(([k, v]) => (
              <div key={k}>
                <b>{v}</b>
                <small>{k}</small>
              </div>
            ))}
          </div>
        )}

        <div className="result-rank">
          <RankEmblem step={after.step} size={60} />
          <div className="rank-info">
            <div className="rank-name">
              <b>
                {course.name}・{after.name}
              </b>
              <span>{r.after.toLocaleString()} XP</span>
            </div>
            <Bar v={shown} color={color} className="slow" />
            <small>{after.next !== null ? `再 ${after.toNext.toLocaleString()} XP 升上「${after.nextName}」` : '已達最高段位'}</small>
          </div>
        </div>

        <div className="result-extras">
          {o.record && <span className="chip gold">🏅 刷新個人紀錄</span>}
          {r.streakExtended && <span className="chip fire">🔥 連續學習 {r.streak} 天</span>}
          {o.lucky && <span className="chip gold lucky">🍀 幸運星：XP 加倍</span>}
          {o.chest > 0 && (
            <span ref={chestRef} className={o.golden ? 'chip gold golden' : 'chip gold'}>
              {o.golden ? '👑 黃金寶箱' : '🎁 發現寶箱'} <Coin n={`+${o.chest}`} />
            </span>
          )}
          {r.coins > 0 && (
            <span className="chip gold">
              獎勵 <Coin n={`+${r.coins}`} />
            </span>
          )}
        </div>

        <div className="result-actions">
          {data.again && (
            <button type="button" className="btn" onClick={data.again.run}>
              {data.again.label}
            </button>
          )}
          {data.next ? (
            <>
              <button type="button" className="btn" onClick={() => nav(data.back)}>
                {data.backLabel ?? '回到路線'}
              </button>
              <button type="button" className="btn primary" onClick={() => nav(data.next!.to)}>
                {data.next.label}
              </button>
            </>
          ) : (
            <button type="button" className="btn primary" onClick={() => nav(data.back)}>
              {data.backLabel ?? '繼續'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
