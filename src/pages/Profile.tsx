// 成就頁：成就與彩蛋收藏冊（名片、外觀切換、學習紀錄在個人頁）
import { Bar, Coin } from '../components/ui';
import { ACHIEVEMENTS } from '../core/achievements';
import { EGGS } from '../core/eggData';
import type { Save } from '../core/save';
import { useSave } from '../core/store';
import { cx } from '../core/util';
import { href } from '../router';

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
        <h2>全部成就</h2>
        <small className="muted">
          已解鎖 {got} / {ACHIEVEMENTS.length}
        </small>
      </header>
      {groups.map((g) => (
        <div key={g} className="ach-group anchor" id={`ach-${g}`}>
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
  const achGot = ACHIEVEMENTS.filter((a) => s.ach[a.id]).length;
  const eggGot = EGGS.filter((e) => s.eggs[e.id]).length;
  const coins = ACHIEVEMENTS.filter((a) => s.ach[a.id]).reduce((n, a) => n + a.coins, 0);
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="page narrow">
      <section className="card ach-head">
        <span className="ach-head-icon" aria-hidden>
          🏆
        </span>
        <div className="grow">
          <h1>成就</h1>
          <p className="muted">
            已解鎖 {achGot} / {ACHIEVEMENTS.length}・從成就拿到 <Coin n={coins} />・彩蛋 {eggGot} / {EGGS.length}
          </p>
          <Bar v={achGot / ACHIEVEMENTS.length} color="var(--gold)" />
        </div>
      </section>
      <p className="muted small ach-note">
        頭像、名片、外觀切換與學習紀錄都在 <a href={href('/me')}>個人頁</a>。
      </p>

      {/* 手機上頁面很長：提供快速跳到各區塊 */}
      <nav className="jump-bar" aria-label="跳到">
        {[...new Set(ACHIEVEMENTS.map((a) => a.group))].map((g) => (
          <button key={g} type="button" onClick={() => jump(`ach-${g}`)}>
            {g} <small>{ACHIEVEMENTS.filter((a) => a.group === g && s.ach[a.id]).length}</small>
          </button>
        ))}
        <button type="button" onClick={() => jump('p-egg')}>
          彩蛋 <small>{eggGot}</small>
        </button>
      </nav>

      <Achievements s={s} />
      <div id="p-egg" className="anchor">
        <EggBook s={s} />
      </div>
    </div>
  );
}
