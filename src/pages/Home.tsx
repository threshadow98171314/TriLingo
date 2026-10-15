// 首頁：連勝、每日目標、接續學習、三種語言的段位、每日任務、每日填字、知識補充、一週紀錄
import { useRef, useState, type CSSProperties } from 'react';
import { Mascot } from '../components/Mascot';
import { RankEmblem } from '../components/RankEmblem';
import { Bar, Coin, flameTier, flyCoins, LangBadge, Modal, Ruby, SpeakBtn, Tx } from '../components/ui';
import { META, META_LIST, useCourse } from '../content';
import { PROVERBS } from '../content/proverbs';
import { randomTip, TIPS } from '../content/tips';
import { fx } from '../core/fx';
import { furiKana } from '../engine/furigana';
import { lastDays, nowMs, today } from '../core/date';
import { crosswordPool, lastStudiedLang, langStats, nextUp, quickStats, UNLOCK } from '../core/progress';
import { questsFor } from '../core/quests';
import { rankOf, TIERS } from '../core/ranks';
import { emptyDay, type Save } from '../core/save';
import { sfx } from '../core/sfx';
import { claimChest, claimQuest, useSave } from '../core/store';
import type { CourseMeta, LangId } from '../core/types';
import { LANGS } from '../core/types';
import { cx, sum } from '../core/util';
import { href, lessonPath } from '../router';

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

function LangCard({ meta: course, s }: { meta: CourseMeta; s: Save }) {
  // 題目還在下載時，先用存檔算得出來的數字顯示
  const loaded = useCourse(course.id);
  const xp = s.xp[course.id];
  const r = rankOf(xp);
  const quick = quickStats(s, course.id);
  const full = loaded ? langStats(s, course.id) : null;
  const st = { learned: full?.learned ?? quick.learned, due: full?.due ?? quick.due, total: full?.total };
  const up = loaded ? nextUp(s, loaded) : null;
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
        <RankEmblem step={r.step} size={84} pokeable />
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
          已學 <b>{st.learned}</b> / {st.total ?? '…'}
        </span>
        {st.due > 0 ? (
          <a className="chip warn" href={href(`/l/${course.id}/review`)}>
            🧠 待複習 {st.due}
          </a>
        ) : (
          st.learned > 0 && <span className="chip">複習已清空</span>
        )}
      </div>

      {/* 主要按鈕直接開始下一課；想看整條路線再點下面的連結 */}
      <a className="btn primary wide" href={href(up ? lessonPath(course.id, up.lesson.id) : `/l/${course.id}`)}>
        {st.learned > 0 ? '▶ 繼續學習' : '▶ 開始第一課'}
      </a>
      <a className="next-up" href={href(`/l/${course.id}`)}>
        {up ? (
          <>
            {up.stage.short} › {up.unit.title}
            {up.lesson.boss && '・單元測驗'}
          </>
        ) : loaded ? (
          '全部課程都完成了！'
        ) : (
          '正在載入課程…'
        )}
        <b>學習路線 ›</b>
      </a>
    </article>
  );
}

function QuestPanel({ s }: { s: Save }) {
  const t = today();
  const log = s.days[t] ?? emptyDay();
  const quests = questsFor(t);
  const claimed = (id: string) => !!log.claimed?.includes(id);
  const allClaimed = quests.every((q) => claimed(q.id));

  const [chestOpen, setChestOpen] = useState(false);

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
                  onClick={(e) => {
                    const from = e.currentTarget.getBoundingClientRect();
                    const got = claimQuest(q.id);
                    if (!got) return;
                    sfx.coin();
                    flyCoins({ x: from.left + from.width / 2, y: from.top + from.height / 2 }, got);
                  }}
                >
                  <Coin n={`+${q.coins}`} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className={cx('chest', allClaimed && !log.chest && 'ready', log.chest && 'opened')}
        disabled={!allClaimed || !!log.chest}
        onClick={() => setChestOpen(true)}
      >
        <span className="chest-icon">{log.chest ? '📭' : '🎁'}</span>
        <span>{log.chest ? '今天的寶箱已打開，明天再來！' : allClaimed ? '點我打開每日寶箱！' : '完成並領取 3 個任務，就能打開每日寶箱'}</span>
      </button>
      {chestOpen && <ChestModal onClose={() => setChestOpen(false)} />}
    </section>
  );
}

const GOLD = ['#ffe066', '#fbbf24', '#fff3b0', '#ffffff'];

/** 開每日寶箱：點擊 → 搖晃 → 打開噴出金幣 */
function ChestModal({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<'idle' | 'shake' | 'open'>('idle');
  const [res, setRes] = useState<{ coins: number; freeze: boolean } | null>(null);
  const box = useRef<HTMLButtonElement>(null);

  const open = () => {
    if (stage !== 'idle') return;
    setStage('shake');
    sfx.tap();
    setTimeout(() => {
      setRes(claimChest());
      setStage('open');
      sfx.chest();
      fx.flash('rgba(255,230,140,0.35)');
      fx.burstAt(box.current, { count: 44, colors: GOLD, shapes: ['star', 'circle', 'glow'], speed: 0.5 });
    }, 950);
  };

  const close = () => {
    const r = box.current?.getBoundingClientRect();
    if (res && r) flyCoins({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, res.coins);
    onClose();
  };

  return (
    <Modal className="chest-modal" onClose={stage === 'shake' ? undefined : close}>
      <p className="eyebrow">每日寶箱</p>
      <button ref={box} type="button" className={cx('chest-big', stage)} onClick={open} aria-label="打開寶箱">
        {stage === 'open' ? '💰' : '🎁'}
      </button>
      {stage === 'idle' && <p className="muted">三個任務都完成了，點寶箱打開！</p>}
      {stage === 'shake' && <p className="muted">喀啦喀啦……</p>}
      {stage === 'open' && res && (
        <>
          <h2 className="chest-reward">
            <Coin n={`+${res.coins}`} />
          </h2>
          {res.freeze && <p className="chip">❄️ 還開出了 1 個連勝保護！</p>}
          <button type="button" className="btn primary wide" autoFocus onClick={close}>
            收下
          </button>
        </>
      )}
    </Modal>
  );
}

/** 一句話學三語：三種語言的諺語，每次打開都隨機換一組 */
function ProverbCard() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 997));
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>一句話學三語</h2>
        <button type="button" className="btn small ghost" onClick={() => setSeed((n) => n + 1)}>
          換一組
        </button>
      </header>
      <div className="proverb-grid">
        {META_LIST.map((c, i) => {
          const list = PROVERBS[c.id];
          const p = list[(seed + i * 7) % list.length];
          return (
            <div key={c.id} className="proverb" style={{ '--lang': c.color } as CSSProperties}>
              <div className="proverb-top">
                <LangBadge course={c} size="sm" />
                <SpeakBtn text={c.id === 'ja' ? furiKana(p.text) : p.text} lang={c.id} size="sm" />
              </div>
              <p className="proverb-text">
                <Tx s={p.text} lang={c.id} />
              </p>
              {p.rm && <small className="muted proverb-rm">{p.rm}</small>}
              <p className="proverb-zh">{p.zh}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** 知識補充站：每次打開首頁都隨機一則，盡量不重複最近看過的 */
function TipCard() {
  const [i, setI] = useState(() => randomTip());
  const tip = TIPS[i];
  const meta = tip.lang === 'all' ? null : META[tip.lang];
  return (
    <section className="card panel tip-card" style={meta ? ({ '--lang': meta.color } as CSSProperties) : undefined}>
      <header className="panel-head">
        <h2>💡 知識補充站</h2>
        <button type="button" className="btn small ghost" onClick={() => setI(randomTip(undefined, i))}>
          再來一則
        </button>
      </header>
      <article className="tip" key={i}>
        <div className="tip-tags">
          {meta && <LangBadge course={meta} size="sm" />}
          <span className="chip">{tip.cat}</span>
        </div>
        <h3>
          <Ruby s={tip.title} />
        </h3>
        <p>
          <Ruby s={tip.body} />
        </p>
      </article>
    </section>
  );
}

/** 首頁最上方的「接續學習」：最近在學的語言，直接進下一課 */
function ContinueBar({ s }: { s: Save }) {
  const lang: LangId | null = lastStudiedLang(s);
  const course = useCourse(lang ?? 'en');
  if (!lang) return null;
  const meta = META[lang];
  const up = course ? nextUp(s, course) : null;
  const due = quickStats(s, lang).due;
  return (
    <div className="hero-cta" style={{ '--lang': meta.color } as CSSProperties}>
      <a className="btn primary" href={href(up ? lessonPath(lang, up.lesson.id) : `/l/${lang}`)}>
        ▶ 繼續{meta.name}
        {up && <small>{up.unit.title}・{up.lesson.boss ? '單元測驗' : up.lesson.title}</small>}
      </a>
      {due > 0 && (
        <a className="btn" href={href(`/l/${lang}/review`)}>
          🧠 複習 {due} 個
        </a>
      )}
    </div>
  );
}

function DailyRow({ c, s }: { c: CourseMeta; s: Save }) {
  const loaded = useCourse(c.id);
  const have = loaded ? crosswordPool(s, c.id).length : 0;
  const locked = have < UNLOCK.crossword;
  const done = !!s.days[today()]?.dailyCw?.[c.id];
  return (
    <li style={{ '--lang': c.color } as CSSProperties}>
      <LangBadge course={c} size="sm" />
      <div className="grow">
        <b>{c.name}填字</b>
        <small className="muted">
          {!loaded ? '載入中…' : locked ? `再學會 ${UNLOCK.crossword - have} 個單字就能解鎖` : done ? '今天已完成，明天有新題目' : '完成可多拿 20 XP'}
        </small>
      </div>
      {!loaded ? (
        <span className="chip">…</span>
      ) : locked ? (
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
}

function DailyPanel({ s }: { s: Save }) {
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>每日填字</h2>
        <small className="muted">每天一題・用你學過的字出題</small>
      </header>
      <ul className="daily">
        {META_LIST.map((c) => (
          <DailyRow key={c.id} c={c} s={s} />
        ))}
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
          本週共 {sum(totals)} XP・{META_LIST.map((c) => c.name).join('／')}
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
                  return v > 0 ? <i key={l} style={{ height: `${(v / max) * 100}%`, background: META_LIST.find((c) => c.id === l)!.color }} /> : null;
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
            <span className={cx('flame', lit && 'lit', flameTier(s.streak.count))}>🔥</span> {title}
          </h1>
          <ContinueBar s={s} />
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

      <Mascot />

      <section className="lang-grid">
        {META_LIST.map((c) => (
          <LangCard key={c.id} meta={c} s={s} />
        ))}
      </section>

      <div className="grid-2">
        <QuestPanel s={s} />
        <DailyPanel s={s} />
      </div>

      <TipCard />

      <ProverbCard />

      <WeekChart s={s} />
    </div>
  );
}
