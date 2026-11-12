// 「今天」頁：連勝與每日目標、一鍵開始今天的學習（先複習、再上新課）、三種語言的進度、每日任務。
// 只看存檔和大綱，不用下載題目。小知識、諺語、一週紀錄在「我的」頁。
import { useRef, useState, type CSSProperties } from 'react';
import { GuideTip } from '../components/Guide';
import { Mascot } from '../components/Mascot';
import { RankEmblem } from '../components/RankEmblem';
import { Bar, Coin, flameTier, flyCoins, LangBadge, Modal } from '../components/ui';
import { META, META_LIST } from '../content';
import { APP_MINOR, NEWS, newsSeenKey } from '../content/news';
import { setCurrentLang, useCurrentLang } from '../core/currentLang';
import { fx } from '../core/fx';
import { nowMs, today } from '../core/date';
import { quickStats } from '../core/progress';
import { questsFor } from '../core/quests';
import { rankOf, TIERS } from '../core/ranks';
import { emptyDay, type Save } from '../core/save';
import { sfx } from '../core/sfx';
import { claimChest, claimQuest, useSave } from '../core/store';
import { todayPlan } from '../core/today';
import { cx, sum } from '../core/util';
import { href, lessonPath } from '../router';

function GoalRing({ value, goal }: { value: number; goal: number }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const pct = Math.min(1, value / goal);
  const done = value >= goal;
  return (
    <div className={cx('goal-ring', done && 'done')}>
      <svg viewBox="0 0 120 120">
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

/** 今天的學習：目前的語言先複習到期的字、再上下一堂新課，一個按鈕開始 */
function TodayCard({ s }: { s: Save }) {
  const lang = useCurrentLang();
  const meta = META[lang];
  const plan = todayPlan(s, lang);
  const start = plan.review > 0 ? `/l/${lang}/today` : plan.lesson ? `${lessonPath(lang, plan.lesson.id)}?today=1` : `/l/${lang}/arcade`;
  // 今天的目標已經達成：還想多學就再來一輪
  const goalMet = sum(s.days[today()]?.xp ?? {}) >= s.settings.dailyGoal;
  const label = plan.fresh ? '▶ 開始第一課' : plan.review > 0 || plan.lesson ? (goalMet ? '▶ 再來一輪' : '▶ 開始今天的學習') : '🎮 去練功';
  return (
    <section className="card today-card" style={{ '--lang': meta.color } as CSSProperties}>
      <header className="today-head">
        <h2>今天的{meta.name}</h2>
        <div className="today-langs" role="radiogroup" aria-label="選擇語言">
          {META_LIST.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={m.id === lang}
              aria-label={m.name}
              title={m.name}
              className={cx('today-lang', m.id === lang && 'on')}
              style={{ '--lang': m.color } as CSSProperties}
              onClick={() => setCurrentLang(m.id)}
            >
              <span lang={m.id}>{m.glyph}</span>
            </button>
          ))}
        </div>
      </header>
      <ol className="today-steps">
        {plan.review > 0 && (
          <li>
            <span className="today-step-icon" aria-hidden>
              🧠
            </span>
            <span className="grow">
              <b>複習 {plan.review} 個字</b>
              <small>{plan.due > plan.review ? `到期 ${plan.due} 個，先複習最該複習的 ${plan.review} 個` : '在快要忘記的時候複習，記得最牢'}</small>
            </span>
          </li>
        )}
        {plan.lesson ? (
          <li>
            <span className="today-step-icon" aria-hidden>
              📘
            </span>
            <span className="grow">
              <b>{plan.fresh ? '第一課' : '新課'}</b>
              <small>{plan.lesson.label}</small>
            </span>
          </li>
        ) : (
          <li>
            <span className="today-step-icon" aria-hidden>
              🏁
            </span>
            <span className="grow">
              <b>學習路線全部完成了</b>
              <small>到練功玩遊戲、考模擬考，維持手感</small>
            </span>
          </li>
        )}
      </ol>
      <a className="btn primary wide today-go" href={href(start)}>
        {label}
      </a>
    </section>
  );
}

/** 三種語言的段位與今天的進度，點一下到那個語言的學習路線 */
function LangRows({ s }: { s: Save }) {
  const t = today();
  return (
    <section className="card lang-rows">
      {META_LIST.map((c) => {
        const xp = s.xp[c.id];
        const r = rankOf(xp);
        const q = quickStats(s, c.id);
        const todayXp = s.days[t]?.xp[c.id] ?? 0;
        return (
          <a key={c.id} className="lang-row" href={href(`/l/${c.id}`)} style={{ '--lang': c.color } as CSSProperties}>
            <LangBadge course={c} />
            <span className="lang-row-main">
              <span className="lang-row-name">
                <b>{c.name}</b>
                <small lang={c.id}>{c.native}</small>
              </span>
              <span className="lang-row-rank">
                <RankEmblem step={r.step} size={22} />
                {r.name}・{xp.toLocaleString()} XP
              </span>
              <Bar v={r.progress} color={TIERS[r.tier].c[0]} />
            </span>
            <span className="lang-row-side">
              {todayXp > 0 && <span className="chip ok">今日 +{todayXp}</span>}
              {q.due > 0 ? <span className="chip warn">🧠 {q.due}</span> : q.learned === 0 && <span className="chip">還沒開始</span>}
            </span>
            <span className="lang-row-go" aria-hidden>
              ›
            </span>
          </a>
        );
      })}
    </section>
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

/** 「這次更新了什麼」最多先列幾則，其他的按「看全部」 */
const NEWS_SHOWN = 3;

/** 這次更新了什麼：已經在用的人才顯示，按「知道了」就收起來（跟著雲端同步） */
function NewsCard({ s }: { s: Save }) {
  const lang = useCurrentLang();
  const [all, setAll] = useState(false);
  if (NEWS.version !== APP_MINOR || !s.stats.answers) return null;
  const items = all ? NEWS.items : NEWS.items.slice(0, NEWS_SHOWN);
  return (
    <GuideTip id={newsSeenKey()} icon="🆕" title={`這次更新了什麼（v${__APP_VERSION__}）`}>
      <ul className="news-list">
        {items.map((n) => {
          // 有連結的整列都可以點（手機上只留 ›，說明文字才不會被擠成好幾行）
          const row = (
            <>
              {n.lang ? <LangBadge course={META[n.lang]} size="sm" /> : <span className="news-icon">{n.icon}</span>}
              <span>{n.text}</span>
              {n.to && (
                <span className="news-go">
                  <span>{n.cta}</span> ›
                </span>
              )}
            </>
          );
          return <li key={n.text}>{n.to ? <a href={href(n.to.replace('{lang}', lang))}>{row}</a> : <div>{row}</div>}</li>;
        })}
      </ul>
      {!all && NEWS.items.length > NEWS_SHOWN && (
        <button type="button" className="link-btn news-more" onClick={() => setAll(true)}>
          看全部 {NEWS.items.length} 則
        </button>
      )}
    </GuideTip>
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
    <div className="page today-page">
      <section className="hero card">
        <div className="grow">
          <p className="eyebrow">
            {hello}，{s.name}
          </p>
          <h1>
            <span className={cx('flame', lit && 'lit', flameTier(s.streak.count))}>🔥</span> {title}
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

      <TodayCard s={s} />

      <NewsCard s={s} />

      <GuideTip id="today" title="「今天」頁怎麼用？">
        <ul>
          <li>「▶ 開始今天的學習」會先複習到期的字，再上下一堂新課；上方三個字可以換語言。</li>
          <li>右上的圓圈是今天的目標 XP，達成就能延續連勝 🔥。</li>
          <li>下方導覽列：學習（路線、單字庫）、練功（遊戲、錯題本、模擬考）、查詢（搜尋、圖鑑、觀念）、我的（外觀、成就、商店、設定）。</li>
        </ul>
      </GuideTip>

      <h2 className="section-title">
        三種語言 <small>點一下看學習路線</small>
      </h2>
      <LangRows s={s} />

      <QuestPanel s={s} />

      <Mascot />
    </div>
  );
}
