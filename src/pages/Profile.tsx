// 個人頁：三語段位、段位階梯、統計、學習熱力圖、成就
import { useState, type CSSProperties } from 'react';
import { RankEmblem, RankLine } from '../components/RankEmblem';
import { Bar, Coin, LangBadge } from '../components/ui';
import { COURSE_LIST } from '../content';
import { ACHIEVEMENTS } from '../core/achievements';
import { lastDays, today } from '../core/date';
import { EGGS } from '../core/eggData';
import { rankOf, TIERS } from '../core/ranks';
import type { Save } from '../core/save';
import { setProfile, useSave } from '../core/store';
import { cx, sum } from '../core/util';

const WEEKS = 18;

function Heatmap({ s }: { s: Save }) {
  const t = today();
  const [y, m, d] = t.split('-').map(Number);
  const weekday = new Date(y, m - 1, d).getDay();
  // 最後一欄是本週，今天之後的格子留白
  const days = lastDays((WEEKS - 1) * 7 + weekday + 1, t);
  const cols: string[][] = [];
  for (let i = 0; i < days.length; i += 7) cols.push(days.slice(i, i + 7));
  const level = (xp: number) => (xp === 0 ? 0 : xp < 30 ? 1 : xp < 80 ? 2 : xp < 150 ? 3 : 4);
  const active = days.filter((x) => s.days[x] && sum(s.days[x].xp) > 0).length;

  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>學習紀錄</h2>
        <small className="muted">
          最近 {WEEKS} 週有 {active} 天學習
        </small>
      </header>
      <div className="heat-scroll">
        <div className="heat">
          {cols.map((col, ci) => (
            <div key={ci} className="heat-col">
              {col.map((day) => {
                const log = s.days[day];
                const xp = log ? sum(log.xp) : 0;
                return (
                  <i
                    key={day}
                    className={cx(`h${level(xp)}`, log?.frozen && xp === 0 && 'frozen', day === t && 'today')}
                    title={`${day}：${xp} XP${log?.frozen && xp === 0 ? '（連勝保護）' : ''}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="heat-legend muted">
        少
        {[0, 1, 2, 3, 4].map((l) => (
          <i key={l} className={`h${l}`} />
        ))}
        多<i className="frozen" /> 連勝保護
      </div>
    </section>
  );
}

function Ladder({ s }: { s: Save }) {
  const at = COURSE_LIST.map((c) => ({ c, tier: rankOf(s.xp[c.id]).tier }));
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>段位階梯</h2>
        <small className="muted">三種語言各自累積 XP、各自升段；聖哲以外每段再分 III → II → I</small>
      </header>
      <ol className="ladder">
        {TIERS.map((t, i) => {
          const here = at.filter((x) => x.tier === i);
          const reached = at.some((x) => x.tier >= i);
          return (
            <li key={t.id} className={cx(reached && 'reached')} style={{ '--rank': t.c[0] } as CSSProperties}>
              <RankEmblem step={Math.min(i * 3 + 2, 27)} size={54} />
              <b>{t.name}</b>
              <small>{t.min.toLocaleString()} XP</small>
              <span className="ladder-langs">
                {here.map((x) => (
                  <LangBadge key={x.c.id} course={x.c} size="sm" />
                ))}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** 彩蛋收藏冊：發現過的彩蛋會亮起來，沒發現的只看得到提示 */
function EggBook({ s }: { s: Save }) {
  const found = EGGS.filter((e) => s.eggs[e.id]).length;
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>彩蛋收藏冊</h2>
        <small className="muted">
          已發現 {found} / {EGGS.length}・發現彩蛋可以拿金幣
        </small>
      </header>
      <Bar v={found / EGGS.length} color="var(--gold)" />
      <ul className="egg-grid">
        {EGGS.map((e) => {
          const at = s.eggs[e.id];
          return (
            <li key={e.id} className={cx('egg', at && 'found')}>
              <span className="egg-icon">{at ? e.icon : '🥚'}</span>
              <div className="grow">
                <b>{at ? e.title : '？？？'}</b>
                <small className="muted">{e.hint}</small>
                {at ? <small className="egg-date">{new Date(at).toLocaleDateString('zh-TW')} 發現</small> : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Achievements({ s }: { s: Save }) {
  const groups = [...new Set(ACHIEVEMENTS.map((a) => a.group))];
  const got = ACHIEVEMENTS.filter((a) => s.ach[a.id]).length;
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>成就</h2>
        <small className="muted">
          已解鎖 {got} / {ACHIEVEMENTS.length}
        </small>
      </header>
      {groups.map((g) => (
        <div key={g} className="ach-group">
          <h3 className="group-label">{g}</h3>
          <ul className="ach-list">
            {ACHIEVEMENTS.filter((a) => a.group === g).map((a) => {
              const done = !!s.ach[a.id];
              // 隱藏成就：解鎖前只顯示提示
              const secret = a.hidden && !done;
              const v = Math.min(a.goal, a.value(s));
              return (
                <li key={a.id} className={cx('ach', done && 'done')}>
                  <span className="ach-icon">{done ? a.icon : secret ? '❓' : '🔒'}</span>
                  <div className="grow">
                    <b>{secret ? '？？？' : a.title}</b>
                    <small className="muted">{secret ? `提示：${a.hint}` : a.desc}</small>
                    {!done && !secret && a.goal > 1 && (
                      <div className="ach-prog">
                        <Bar v={v / a.goal} />
                        <small>
                          {v.toLocaleString()} / {a.goal.toLocaleString()}
                        </small>
                      </div>
                    )}
                  </div>
                  <Coin n={done ? '已領' : secret ? '？' : `+${a.coins}`} />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}

export function ProfilePage() {
  const s = useSave();
  const [name, setName] = useState(s.name);
  const totalXp = sum(s.xp);
  const acc = s.stats.answers ? Math.round((s.stats.correct / s.stats.answers) * 100) : 0;
  const stats: [string, string][] = [
    ['總 XP', totalXp.toLocaleString()],
    ['學會的字詞', String(Object.keys(s.items).length)],
    ['完成課程', String(s.stats.lessons)],
    ['答對率', `${acc}%`],
    ['最長連勝', `${s.streak.best} 天`],
    ['最高連擊', String(s.stats.maxCombo)],
    ['填字遊戲', `${s.stats.crosswords} 次`],
    ['累計金幣', s.coinsEarned.toLocaleString()],
  ];

  return (
    <div className="page">
      <section className="card profile-head">
        <div className="avatar big">{s.avatar}</div>
        <div className="grow">
          <input
            className="name-input"
            value={name}
            maxLength={16}
            aria-label="暱稱"
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setProfile({ name })}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
          />
          <div className="avatar-pick">
            {s.avatars.map((a) => (
              <button key={a} type="button" className={cx('avatar', a === s.avatar && 'on')} onClick={() => setProfile({ avatar: a })}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rank-trio">
        {COURSE_LIST.map((c) => (
          <div key={c.id} className="card rank-card" style={{ '--lang': c.color } as CSSProperties}>
            <header>
              <LangBadge course={c} size="sm" />
              <b>{c.name}</b>
            </header>
            <RankLine xp={s.xp[c.id]} size={68} />
          </div>
        ))}
      </section>

      <section className="stat-grid">
        {stats.map(([k, v]) => (
          <div key={k} className="card stat-tile">
            <b>{v}</b>
            <small className="muted">{k}</small>
          </div>
        ))}
      </section>

      <Heatmap s={s} />
      <Ladder s={s} />
      <Achievements s={s} />
      <EggBook s={s} />
    </div>
  );
}
