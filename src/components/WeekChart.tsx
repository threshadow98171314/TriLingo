// 最近 7 天的 XP：三種語言疊起來的長條圖，虛線是每日目標（「我的」頁的紀錄）。
import type { CSSProperties } from 'react';
import { META_LIST } from '../content';
import { lastDays } from '../core/date';
import type { Save } from '../core/save';
import { LANGS } from '../core/types';
import { cx, sum } from '../core/util';

export function WeekChart({ s }: { s: Save }) {
  const days = lastDays(7);
  const totals = days.map((d) => (s.days[d] ? sum(s.days[d].xp) : 0));
  const max = Math.max(s.settings.dailyGoal, ...totals);
  const names = ['日', '一', '二', '三', '四', '五', '六'];
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>最近 7 天 XP</h2>
        <small className="muted">本週共 {sum(totals)} XP</small>
      </header>
      <div className="week-legend">
        {META_LIST.map((c) => (
          <span key={c.id}>
            <i style={{ background: c.color }} />
            {c.name}
          </span>
        ))}
        <span>
          <i className="goal" />
          每日目標 {s.settings.dailyGoal} XP
        </span>
      </div>
      <div className="week" style={{ '--goal': s.settings.dailyGoal / max } as CSSProperties}>
        <div className="week-goal" />
        {days.map((d, i) => {
          const log = s.days[d];
          const [y, m, dd] = d.split('-').map(Number);
          const wd = new Date(y, m - 1, dd).getDay();
          const label = i === 6 ? '今天' : `週${names[wd]}`;
          const tip = `${label}（${m}/${dd}）：` + (totals[i] ? META_LIST.map((c) => `${c.name} ${log?.xp[c.id] ?? 0}`).join('、') + ' XP' : log?.frozen ? '用了連勝保護' : '沒有學習');
          return (
            // 滑鼠移上去（手機點一下）顯示這天三種語言各拿了多少 XP
            <div key={d} className={cx('week-col', i === 6 && 'today')} tabIndex={0} aria-label={tip}>
              <small className="week-num">{totals[i] || (log?.frozen ? '❄️' : '')}</small>
              <div className="week-bar">
                {LANGS.map((l) => {
                  const v = log?.xp[l] ?? 0;
                  const c = META_LIST.find((x) => x.id === l)!;
                  return v > 0 ? <i key={l} title={`${c.name} ${v} XP`} style={{ height: `${(v / max) * 100}%`, background: c.color }} /> : null;
                })}
              </div>
              <small>{i === 6 ? '今天' : names[wd]}</small>
              <span className="week-tip" role="tooltip">
                <b>
                  {label}（{m}/{dd}）
                </b>
                {META_LIST.map((c) => (
                  <span key={c.id}>
                    <i style={{ background: c.color }} />
                    {c.name}　{log?.xp[c.id] ?? 0} XP
                  </span>
                ))}
                {!totals[i] && log?.frozen && <span>❄️ 用了連勝保護</span>}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
