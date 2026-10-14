// 首頁：連勝、每日目標、三種語言的段位、每日任務、每日填字、一週紀錄
import type { CSSProperties } from 'react';
import { RankEmblem } from '../components/RankEmblem';
import { Bar, Coin, LangBadge } from '../components/ui';
import { COURSE_LIST } from '../content';
import { lastDays, nowMs, today } from '../core/date';
import { crosswordPool, langStats, nextUp, UNLOCK } from '../core/progress';
import { questsFor } from '../core/quests';
import { rankOf, TIERS } from '../core/ranks';
import { emptyDay, type Save } from '../core/save';
import { sfx } from '../core/sfx';
import { claimChest, claimQuest, useSave } from '../core/store';
import { celebrate } from '../core/celebrate';
import type { Course } from '../core/types';
import { LANGS } from '../core/types';
import { cx, sum } from '../core/util';
import { href } from '../router';

function GoalRing({ value, goal }: { value: number; goal: number }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const pct = Math.min(1, value / goal);
  const done = value >= goal;
  return (
    <div className={cx('goal-ring', done && 'done')}>
      <svg viewBox="0 0 120 120" width="132" height="132">
        <circle cx="60" cy="60" r={R} className="ring-bg" />
        <circle cx="60" cy="60" r={R} className="ring-fg" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 60 60)" />
      </svg>
      <div className="goal-text">
        <b>{value}</b>
        <small>/ {goal} XP</small>
        <span>{done ? '目標達成 ✓' : '今日目標'}</span>
      </div>
    </div>
  );
}

function LangCard({ course, s }: { course: Course; s: Save }) {
  const xp = s.xp[course.id];
  const r = rankOf(xp);
  const st = langStats(s, course.id);
  const up = nextUp(s, course);
  const todayXp = s.days[today()]?.xp[course.id] ?? 0;
  return (
    <article className="lang-card card" style={{ '--lang': course.color } as CSSProperties}>
      <header>
        <LangBadge course={course} />
        <div className="grow">
          <h2>
            {course.name} <small lang={course.id}>{course.native}</small>
          </h2>
          <p className="muted">{course.goal}</p>
        </div>
        {todayXp > 0 && <span className="chip ok">今日 +{todayXp}</span>}
      </header>

      <div className="lang-rank">
        <RankEmblem step={r.step} size={84} />
        <div className="rank-info">
          <div className="rank-name">
            <b>{r.name}</b>
            <span>{xp.toLocaleString()} XP</span>
          </div>
          <Bar v={r.progress} color={TIERS[r.tier].c[0]} />
          <small>{r.next !== null ? `再 ${r.toNext.toLocaleString()} XP 升上「${r.nextName}」` : '已達最高段位'}</small>
        </div>
      </div>

      <div className="lang-meta">
        <span>
          已學 <b>{st.learned}</b> / {st.total}
        </span>
        {st.due > 0 ? (
          <a className="chip warn" href={href(`/l/${course.id}/review`)}>
            🧠 待複習 {st.due}
          </a>
        ) : (
          st.learned > 0 && <span className="chip">複習已清空</span>
        )}
      </div>

      <a className="btn primary wide" href={href(`/l/${course.id}`)}>
        {st.learned > 0 ? '繼續學習' : '開始學習'}
      </a>
      {up && (
        <small className="next-up muted">
          下一課：{up.stage.short} › {up.unit.title}
        </small>
      )}
    </article>
  );
}

function QuestPanel({ s }: { s: Save }) {
  const t = today();
  const log = s.days[t] ?? emptyDay();
  const quests = questsFor(t);
  const claimed = (id: string) => !!log.claimed?.includes(id);
  const allClaimed = quests.every((q) => claimed(q.id));

  const openChest = () => {
    const r = claimChest();
    if (!r) return;
    sfx.coin();
    celebrate({
      type: 'toast',
      icon: '🎁',
      title: `每日寶箱：${r.coins} 金幣`,
      text: r.freeze ? '還開出了 1 個連勝保護！' : '明天的任務全部完成，還有一箱。',
    });
  };

  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>每日任務</h2>
        <small className="muted">每天換新・全部領完開寶箱</small>
      </header>
      <ul className="quests">
        {quests.map((q) => {
          const v = Math.min(q.target, q.value(log));
          const done = v >= q.target;
          return (
            <li key={q.id} className={cx('quest', done && 'done', claimed(q.id) && 'claimed')}>
              <span className="quest-icon">{q.icon}</span>
              <div className="grow">
                <div className="quest-text">
                  <span>{q.text}</span>
                  <small>
                    {v} / {q.target}
                  </small>
                </div>
                <Bar v={v / q.target} />
              </div>
              {claimed(q.id) ? (
                <span className="chip ok">已領取</span>
              ) : (
                <button
                  type="button"
                  className="btn small gold"
                  disabled={!done}
                  onClick={() => {
                    if (claimQuest(q.id)) sfx.coin();
                  }}
                >
                  <Coin n={`+${q.coins}`} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <button type="button" className={cx('chest', allClaimed && !log.chest && 'ready', log.chest && 'opened')} disabled={!allClaimed || !!log.chest} onClick={openChest}>
        <span className="chest-icon">{log.chest ? '📭' : '🎁'}</span>
        <span>{log.chest ? '今天的寶箱已打開，明天再來！' : allClaimed ? '點我打開每日寶箱！' : '完成並領取 3 個任務，就能打開每日寶箱'}</span>
      </button>
    </section>
  );
}

function DailyPanel({ s }: { s: Save }) {
  const log = s.days[today()];
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>每日填字</h2>
        <small className="muted">每天一題・用你學過的字出題</small>
      </header>
      <ul className="daily">
        {COURSE_LIST.map((c) => {
          const have = crosswordPool(s, c.id).length;
          const locked = have < UNLOCK.crossword;
          const done = !!log?.dailyCw?.[c.id];
          return (
            <li key={c.id} style={{ '--lang': c.color } as CSSProperties}>
              <LangBadge course={c} size="sm" />
              <div className="grow">
                <b>{c.name}填字</b>
                <small className="muted">{locked ? `再學會 ${UNLOCK.crossword - have} 個單字就能解鎖` : done ? '今天已完成，明天有新題目' : '完成可多拿 20 XP'}</small>
              </div>
              {locked ? (
                <span className="chip">🔒</span>
              ) : done ? (
                <span className="chip ok">完成 ✓</span>
              ) : (
                <a className="btn small primary" href={href(`/l/${c.id}/play/crossword?daily=1`)}>
                  挑戰
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function WeekChart({ s }: { s: Save }) {
  const days = lastDays(7);
  const totals = days.map((d) => (s.days[d] ? sum(s.days[d].xp) : 0));
  const max = Math.max(s.settings.dailyGoal, ...totals);
  const names = ['日', '一', '二', '三', '四', '五', '六'];
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>最近 7 天</h2>
        <small className="muted">
          本週共 {sum(totals)} XP・{COURSE_LIST.map((c) => c.name).join('／')}
        </small>
      </header>
      <div className="week" style={{ '--goal': s.settings.dailyGoal / max } as CSSProperties}>
        <div className="week-goal" title="每日目標" />
        {days.map((d, i) => {
          const log = s.days[d];
          const [y, m, dd] = d.split('-').map(Number);
          const wd = new Date(y, m - 1, dd).getDay();
          return (
            <div key={d} className={cx('week-col', i === 6 && 'today')}>
              <small className="week-num">{totals[i] || (log?.frozen ? '❄️' : '')}</small>
              <div className="week-bar">
                {LANGS.map((l) => {
                  const v = log?.xp[l] ?? 0;
                  return v > 0 ? <i key={l} style={{ height: `${(v / max) * 100}%`, background: COURSE_LIST.find((c) => c.id === l)!.color }} /> : null;
                })}
              </div>
              <small>{i === 6 ? '今天' : names[wd]}</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Home() {
  const s = useSave();
  const t = today();
  const log = s.days[t] ?? emptyDay();
  const todayXp = sum(log.xp);
  const hour = new Date(nowMs()).getHours();
  const hello = hour < 5 ? '夜深了' : hour < 11 ? '早安' : hour < 18 ? '午安' : '晚安';
  const lit = s.streak.count > 0 && s.streak.last === t;
  const title = lit
    ? `已連續學習 ${s.streak.count} 天`
    : s.streak.count > 0
      ? `今天還沒學習，${s.streak.count} 天連勝等你延續`
      : '今天就開始你的連勝';

  return (
    <div className="page">
      <section className="hero card">
        <div className="grow">
          <p className="eyebrow">
            {hello}，{s.name}
          </p>
          <h1>
            <span className={cx('flame', lit && 'lit')}>🔥</span> {title}
          </h1>
          <div className="hero-chips">
            <span className="chip">最佳紀錄 {s.streak.best} 天</span>
            <span className="chip">❄️ 連勝保護 ×{s.streak.freezes}</span>
            <span className="chip">
              <Coin n={s.coins} />
            </span>
          </div>
        </div>
        <GoalRing value={todayXp} goal={s.settings.dailyGoal} />
      </section>

      <section className="lang-grid">
        {COURSE_LIST.map((c) => (
          <LangCard key={c.id} course={c} s={s} />
        ))}
      </section>

      <div className="grid-2">
        <QuestPanel s={s} />
        <DailyPanel s={s} />
      </div>

      <WeekChart s={s} />
    </div>
  );
}
