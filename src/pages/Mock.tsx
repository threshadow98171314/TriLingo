// 實戰模擬考：考前說明 → 計時作答（可跳題、標記、重播聽力）→ 交卷看成績與逐題檢討。
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Bar, Coin, Empty, Modal, Tx } from '../components/ui';
import { META, requireCourse } from '../content';
import { fx } from '../core/fx';
import { stageState } from '../core/progress';
import type { Save } from '../core/save';
import { sfx } from '../core/sfx';
import { finishMock, useSave, type Outcome } from '../core/store';
import { canSpeak, speakScript, stopSpeaking, useVoices } from '../core/tts';
import type { LangId, MockExam } from '../core/types';
import { cx, fmtTime } from '../core/util';
import { LANG_NAME } from '../engine/exercises';
import { buildPaper, paperSections, parseLine, scorePaper, type MockScore, type Paper, type PaperQ } from '../engine/mock';
import { href, nav } from '../router';

const mockPath = (lang: LangId, id?: string) => (id ? `/l/${lang}/mock/${encodeURIComponent(id)}` : `/l/${lang}/mock`);

/** 大概會出幾題（有抽題的大題用平均值估） */
export function expectedCount(exam: MockExam): number {
  let n = 0;
  for (const s of exam.sections) {
    if (s.gen) n += s.gen.count;
    if (!s.groups.length) continue;
    const per = s.groups.reduce((a, g) => a + g.qs.length, 0) / s.groups.length;
    n += Math.round(per * (s.pick && s.pick < s.groups.length ? s.pick : s.groups.length));
  }
  return n;
}

// ───────── 題目文字：底線 { }、空格 ___、Part 6 的編號空格 __(1)__、換行 ─────────

export function MockText({ s, lang }: { s: string; lang: LangId }) {
  return (
    <>
      {s.split('\n').map((line, i) => (
        <span key={i} className={cx('mock-line', !line && 'gap')}>
          {line.split(/(\{[^}]*\}|___|__\(\d\)__)/).map((part, k) => {
            if (part.startsWith('{') && part.endsWith('}'))
              return (
                <u key={k} className="mock-u" lang={lang}>
                  {part.slice(1, -1)}
                </u>
              );
            if (part === '___') return <span key={k} className="blank" aria-label="空格" />;
            if (/^__\(\d\)__$/.test(part))
              return (
                <span key={k} className="blank num">
                  {part.slice(2, -2)}
                </span>
              );
            return part ? <Tx key={k} s={part} lang={lang} /> : null;
          })}
        </span>
      ))}
    </>
  );
}

/** 聽力稿（交卷後或沒有語音時顯示） */
function Transcript({ lines, lang }: { lines: string[]; lang: LangId }) {
  return (
    <div className="mock-script">
      {lines.map((l, i) => {
        const { who, text } = parseLine(l);
        return (
          <p key={i}>
            {who && <b>{who === 'M' ? '男' : '女'}</b>}
            <Tx s={text} lang={lang} />
          </p>
        );
      })}
    </div>
  );
}

// ───────── 模擬考列表（語言頁的分頁） ─────────

export function MockTab({ lang, s }: { lang: LangId; s: Save }) {
  const course = requireCourse(lang);
  if (!course.mocks.length) {
    return <Empty icon="📝" title="模擬考準備中" />;
  }
  return (
    <div className="mock-list">
      {course.mocks.map((m) => {
        const rec = s.mocks[m.id];
        const after = m.after ? course.stages.find((st) => st.id === m.after) : undefined;
        const pct = after ? Math.round(stageState(s, after).pct * 100) : 100;
        const listening = m.sections.some((x) => x.listening);
        return (
          <article key={m.id} className="card mock-card">
            <header>
              <span className="mock-icon">📝</span>
              <div className="grow">
                <h3>{m.title}</h3>
                <p className="muted">{m.subtitle}</p>
              </div>
              {rec && <span className={cx('chip', rec.best >= m.pass * 100 ? 'ok' : 'warn')}>最佳 {rec.best}%</span>}
            </header>
            <div className="mock-facts">
              <span>⏱ {m.minutes} 分鐘</span>
              <span>📄 約 {expectedCount(m)} 題</span>
              <span>🎯 合格線 {Math.round(m.pass * 100)}%</span>
              {listening && <span>🎧 含聽力</span>}
            </div>
            <p className="muted mock-about">{m.about}</p>
            {after && pct < 60 && (
              <p className="mock-hint">
                💡 建議先完成「{after.title}」（目前 {pct}%），考起來會更有感覺；想先試試看也可以直接考。
              </p>
            )}
            <div className="mock-card-foot">
              <small className="muted">{rec ? `上次 ${rec.last}%・已考 ${rec.plays} 次` : '還沒考過'}</small>
              <a className="btn primary" href={href(mockPath(lang, m.id))}>
                {rec ? '再考一次' : '開始模擬考'}
              </a>
            </div>
          </article>
        );
      })}
      <p className="muted mock-note">題目是原創的練習題，題型仿照正式考試。每次都會從題庫重新抽題，所以每次考的都不太一樣。</p>
    </div>
  );
}

// ───────── 考試頁 ─────────

interface Done {
  paper: Paper;
  picks: (number | null)[];
  score: MockScore;
  outcome: Outcome;
  seconds: number;
}

export function MockPage({ lang, examId }: { lang: LangId; examId: string }) {
  const course = requireCourse(lang);
  const exam = course.mocks.find((m) => m.id === examId);
  const [run, setRun] = useState<{ paper: Paper; key: number } | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  if (!exam) {
    return (
      <div className="page narrow" style={{ '--lang': course.color } as CSSProperties}>
        <Empty icon="🧭" title="找不到這份模擬考">
          <a className="btn primary" href={href(mockPath(lang))}>
            回到模擬考
          </a>
        </Empty>
      </div>
    );
  }

  const start = () => {
    setDone(null);
    setRun((r) => ({ paper: buildPaper(exam, course), key: (r?.key ?? 0) + 1 }));
  };

  if (done) return <MockResult lang={lang} data={done} onRetry={start} />;
  if (!run) return <MockIntro lang={lang} exam={exam} onStart={start} />;
  return (
    <MockRunner
      key={run.key}
      lang={lang}
      paper={run.paper}
      onSubmit={(picks, seconds) => {
        stopSpeaking();
        const score = scorePaper(run.paper, picks);
        const outcome = finishMock({ lang, examId: exam.id, correct: score.correct, total: score.total });
        setDone({ paper: run.paper, picks, score, outcome, seconds });
      }}
    />
  );
}

function MockIntro({ lang, exam, onStart }: { lang: LangId; exam: MockExam; onStart: () => void }) {
  useVoices();
  const s = useSave();
  const rec = s.mocks[exam.id];
  const listening = exam.sections.some((x) => x.listening);
  return (
    <div className="page narrow mock-intro" style={{ '--lang': META[lang].color } as CSSProperties}>
      <section className="card">
        <p className="eyebrow">{META[lang].name}實戰模擬考</p>
        <h1>{exam.title}</h1>
        <p className="muted">{exam.about}</p>
        <div className="mock-facts big">
          <span>⏱ 限時 {exam.minutes} 分鐘</span>
          <span>📄 約 {expectedCount(exam)} 題</span>
          <span>🎯 合格線 {Math.round(exam.pass * 100)}%</span>
        </div>
        <ol className="mock-sections">
          {exam.sections.map((x) => (
            <li key={x.id}>
              {x.listening ? '🎧' : '📖'} {x.title}
            </li>
          ))}
        </ol>
        <ul className="mock-rules muted">
          <li>可以跳題，也可以按 🚩 標記想回頭檢查的題目，最後再交卷。</li>
          <li>時間到會自動交卷。答錯不扣分，沒把握也先選一個。</li>
          {listening && <li>聽力會在第一次看到題目時自動播放，之後可以重播（正式考試只播一次）。</li>}
          <li>電腦可以用鍵盤：1–4 選答案、← → 換題、空白鍵重播聽力。</li>
        </ul>
        {listening && !canSpeak(lang) && (
          <p className="warn-text">這個瀏覽器沒有{LANG_NAME[lang]}語音，聽力題會直接顯示文字。建議改用 Chrome 或 Edge。</p>
        )}
        {rec && (
          <p className="muted">
            最佳成績 {rec.best}%・上次 {rec.last}%・已考 {rec.plays} 次
          </p>
        )}
        <div className="modal-actions">
          <a className="btn" href={href(mockPath(lang))}>
            返回
          </a>
          <button type="button" className="btn primary" onClick={onStart} autoFocus>
            開始作答
          </button>
        </div>
      </section>
    </div>
  );
}

function MockRunner({ lang, paper, onSubmit }: { lang: LangId; paper: Paper; onSubmit: (picks: (number | null)[], seconds: number) => void }) {
  useVoices();
  const voice = canSpeak(lang);
  const total = paper.qs.length;
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(() => paper.qs.map(() => null));
  const [flags, setFlags] = useState<Set<number>>(() => new Set());
  const [asking, setAsking] = useState<'submit' | 'exit' | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const started = useRef(Date.now());
  const deadline = started.current + paper.exam.minutes * 60_000;
  const played = useRef(new Set<string>());
  const sections = useMemo(() => paperSections(paper), [paper]);

  const q = paper.qs[idx];
  const sec = paper.exam.sections[q.section];
  const left = Math.max(0, Math.ceil((deadline - now) / 1000));
  const answered = picks.filter((p) => p !== null).length;

  const submit = () => onSubmit(picks, Math.round((Date.now() - started.current) / 1000));
  const live = useRef({ submit });
  live.current = { submit };

  // 計時：時間到自動交卷
  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now());
      if (Date.now() >= deadline) {
        clearInterval(t);
        live.current.submit();
      }
    }, 1000);
    return () => clearInterval(t);
  }, [deadline]);

  const play = (g: PaperQ['group']) => {
    if (!g.script) return;
    speakScript(g.script.map(parseLine), lang);
  };

  // 聽力：第一次看到這個題組時自動播放
  useEffect(() => {
    const g = q.group;
    if (!g.script || !voice || played.current.has(g.id)) return;
    played.current.add(g.id);
    const t = setTimeout(() => play(g), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.group, voice]);

  const go = (i: number) => {
    const next = Math.max(0, Math.min(total - 1, i));
    if (paper.qs[next].group !== q.group) stopSpeaking();
    setIdx(next);
  };
  const choose = (i: number) => {
    sfx.tap();
    setPicks((p) => p.map((v, k) => (k === idx ? i : v)));
  };

  const keys = useRef({ go, choose, idx, q });
  keys.current = { go, choose, idx, q };
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      const k = keys.current;
      const n = Number(e.key);
      if (n >= 1 && n <= k.q.options.length) k.choose(n - 1);
      else if (e.key === 'ArrowRight') k.go(k.idx + 1);
      else if (e.key === 'ArrowLeft') k.go(k.idx - 1);
      else if (e.key === ' ' && k.q.group.script) {
        e.preventDefault();
        play(k.q.group);
      } else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => stopSpeaking(), []);

  const groupQs = paper.qs.filter((x) => x.group === q.group);
  const inGroup = groupQs.length > 1 ? `（第 ${groupQs.indexOf(q) + 1} / ${groupQs.length} 題）` : '';

  return (
    <div className="mock-run" style={{ '--lang': META[lang].color } as CSSProperties}>
      <header className="session-top mock-top">
        <button type="button" className="icon-btn" aria-label="離開" onClick={() => setAsking('exit')}>
          ✕
        </button>
        <div className="session-progress">
          <small>
            {sec.title}　已作答 {answered} / {total}
          </small>
          <Bar v={answered / total} color="var(--lang)" />
        </div>
        <span className={cx('mock-timer', left <= 300 && 'warn', left <= 60 && 'danger')} title="剩餘時間">
          ⏱ {fmtTime(left)}
        </span>
      </header>

      <main className="mock-body" key={idx}>
        <p className="mock-sec-intro">{sec.intro}</p>

        {q.group.script &&
          (voice ? (
            <div className="mock-audio">
              <button type="button" className="btn small" onClick={() => play(q.group)}>
                🔊 播放
              </button>
              <small className="muted">
                {sec.listening && groupQs.length > 1 ? '同一段對話回答好幾題' : '聽完再作答'}
                {inGroup}
              </small>
            </div>
          ) : (
            <>
              <p className="warn-text">沒有{LANG_NAME[lang]}語音，改成閱讀聽力稿：</p>
              <Transcript lines={q.group.script} lang={lang} />
            </>
          ))}

        {q.group.passage && (
          <div className="mock-passage" lang={lang}>
            <MockText s={q.group.passage} lang={lang} />
          </div>
        )}

        <div className="mock-q">
          <b className="mock-no">{q.no + 1}.</b>
          {q.q.q ? <MockText s={q.q.q} lang={lang} /> : <span className="muted">選出正確的答案{inGroup}</span>}
        </div>

        <div className="options list mock-options">
          {q.options.map((o, i) => (
            <button key={i} type="button" className={cx('opt', picks[idx] === i && 'picked')} onClick={() => choose(i)} aria-pressed={picks[idx] === i}>
              <kbd>{i + 1}</kbd>
              <Tx s={o} lang={lang} />
            </button>
          ))}
        </div>

        <div className="mock-nav">
          <button type="button" className="btn" disabled={idx === 0} onClick={() => go(idx - 1)}>
            ← 上一題
          </button>
          <button
            type="button"
            className={cx('btn flag', flags.has(idx) && 'on')}
            onClick={() =>
              setFlags((f) => {
                const n = new Set(f);
                if (n.has(idx)) n.delete(idx);
                else n.add(idx);
                return n;
              })
            }
            aria-pressed={flags.has(idx)}
          >
            🚩 {flags.has(idx) ? '已標記' : '標記'}
          </button>
          {idx < total - 1 ? (
            <button type="button" className="btn primary" onClick={() => go(idx + 1)}>
              下一題 →
            </button>
          ) : (
            <button type="button" className="btn primary" onClick={() => setAsking('submit')}>
              交卷
            </button>
          )}
        </div>
      </main>

      <footer className="mock-grid-wrap">
        {sections.map(({ section, from, to }) => (
          <div key={section.id} className="mock-grid-sec">
            <small>{section.listening ? '🎧' : '📖'}</small>
            <div className="mock-grid">
              {paper.qs.slice(from, to + 1).map((x) => (
                <button
                  key={x.no}
                  type="button"
                  className={cx('cell', picks[x.no] !== null && 'done', flags.has(x.no) && 'flag', x.no === idx && 'now')}
                  onClick={() => go(x.no)}
                  aria-label={`第 ${x.no + 1} 題${picks[x.no] !== null ? '（已作答）' : ''}`}
                >
                  {x.no + 1}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button type="button" className="btn small primary mock-submit" onClick={() => setAsking('submit')}>
          交卷
        </button>
      </footer>

      {asking === 'submit' && (
        <Modal onClose={() => setAsking(null)}>
          <h2>確定要交卷嗎？</h2>
          <p className="muted">
            {answered < total ? `還有 ${total - answered} 題沒有作答，答錯不扣分，建議先選一個。` : '所有題目都作答了。'}
            {flags.size > 0 && ` 標記待確認的有 ${flags.size} 題。`}
          </p>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={() => setAsking(null)}>
              再檢查一下
            </button>
            <button type="button" className="btn primary" onClick={submit}>
              交卷
            </button>
          </div>
        </Modal>
      )}
      {asking === 'exit' && (
        <Modal onClose={() => setAsking(null)}>
          <h2>要離開嗎？</h2>
          <p className="muted">現在離開的話，這次的作答不會計分。</p>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={() => nav(mockPath(lang))}>
              離開
            </button>
            <button type="button" className="btn primary" onClick={() => setAsking(null)}>
              繼續作答
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ───────── 成績與檢討 ─────────

function MockResult({ lang, data, onRetry }: { lang: LangId; data: Done; onRetry: () => void }) {
  const { paper, picks, score, outcome, seconds } = data;
  const exam = paper.exam;
  const [onlyWrong, setOnlyWrong] = useState(score.correct < score.total);
  const pct = Math.round(score.pct * 100);

  useEffect(() => {
    if (score.passed) {
      sfx.complete();
      fx.fireworks(score.pct >= 0.85 ? 4 : 2);
    } else {
      sfx.fail();
    }
  }, [score]);

  const sections = paperSections(paper);
  const list = paper.qs.filter((q) => !onlyWrong || picks[q.no] !== q.answer);

  return (
    <div className="page narrow mock-result" style={{ '--lang': META[lang].color } as CSSProperties}>
      <section className="card mock-score">
        <div className="result-emoji">{score.passed ? '🎉' : '💪'}</div>
        <p className="eyebrow">{exam.title}</p>
        <h1>{score.passed ? '合格！' : '再接再厲！'}</h1>
        <div className={cx('mock-pct', score.passed ? 'ok' : 'bad')}>
          {pct}
          <small>%</small>
        </div>
        <p className="muted">
          答對 {score.correct} / {score.total} 題・用時 {fmtTime(seconds)}・合格線 {Math.round(exam.pass * 100)}%
        </p>
        <div className="mock-level">
          <b>{score.level.label}</b>
          <span>{score.level.desc}</span>
        </div>
        <div className="result-extras">
          <span className="chip">+{outcome.reward.xp} XP</span>
          {outcome.record && <span className="chip gold">🏅 刷新最佳成績</span>}
          {outcome.reward.coins > 0 && (
            <span className="chip gold">
              獎勵 <Coin n={`+${outcome.reward.coins}`} />
            </span>
          )}
        </div>
      </section>

      <section className="card panel">
        <header className="panel-head">
          <h2>各大題成績</h2>
        </header>
        <ul className="mock-breakdown">
          {score.sections.map((x) => (
            <li key={x.title}>
              <div className="grow">
                <span>{x.title}</span>
                <Bar v={x.total ? x.correct / x.total : 0} color={x.correct / x.total >= exam.pass ? 'var(--ok)' : 'var(--warn, #f59e0b)'} />
              </div>
              <b>
                {x.correct} / {x.total}
              </b>
            </li>
          ))}
        </ul>
      </section>

      <div className="result-actions">
        <button type="button" className="btn" onClick={() => nav(mockPath(lang))}>
          回到模擬考
        </button>
        <button type="button" className="btn primary" onClick={onRetry}>
          再考一次（重新抽題）
        </button>
      </div>

      <section className="card panel mock-review">
        <header className="panel-head">
          <h2>檢討答案</h2>
          <div className="seg small">
            <button type="button" className={cx(onlyWrong && 'on')} onClick={() => setOnlyWrong(true)}>
              只看答錯（{score.total - score.correct}）
            </button>
            <button type="button" className={cx(!onlyWrong && 'on')} onClick={() => setOnlyWrong(false)}>
              全部
            </button>
          </div>
        </header>
        {list.length === 0 && <p className="muted">全部答對了，太厲害了！</p>}
        {list.map((q, k) => {
          const prev = list[k - 1];
          const newSec = !prev || prev.section !== q.section;
          const newGroup = !prev || prev.group !== q.group;
          return (
            <ReviewItem key={q.no} lang={lang} q={q} pick={picks[q.no]} header={newSec ? sections.find((x) => x.index === q.section)?.section.title : undefined} showGroup={newGroup} />
          );
        })}
      </section>
    </div>
  );
}

function ReviewItem({ lang, q, pick, header, showGroup }: { lang: LangId; q: PaperQ; pick: number | null; header?: string; showGroup: boolean }) {
  const ok = pick === q.answer;
  let groupInfo: ReactNode = null;
  if (showGroup && (q.group.passage || q.group.script)) {
    groupInfo = (
      <div className="mock-review-group">
        {q.group.passage && (
          <div className="mock-passage small" lang={lang}>
            <MockText s={q.group.passage} lang={lang} />
          </div>
        )}
        {q.group.script && <Transcript lines={q.group.script} lang={lang} />}
        {q.group.zh && <p className="muted mock-zh">翻譯：{q.group.zh}</p>}
      </div>
    );
  }
  return (
    <>
      {header && <h3 className="group-label">{header}</h3>}
      {groupInfo}
      <article className={cx('mock-review-q', ok ? 'ok' : 'bad')}>
        <div className="mock-q">
          <b className="mock-no">{q.no + 1}.</b>
          {q.q.q ? <MockText s={q.q.q} lang={lang} /> : <span className="muted">（聽力題）</span>}
        </div>
        <ul className="mock-review-opts">
          {q.options.map((o, i) => (
            <li key={i} className={cx(i === q.answer && 'right', i === pick && i !== q.answer && 'wrong')}>
              <span className="mark">{i === q.answer ? '✔' : i === pick ? '✘' : ''}</span>
              <Tx s={o} lang={lang} />
            </li>
          ))}
        </ul>
        {pick === null && <p className="warn-text">沒有作答</p>}
        {q.q.t && <p className="muted mock-zh">翻譯：{q.q.t}</p>}
        {q.q.explain && <p className="fb-explain">💡 {q.q.explain}</p>}
      </article>
    </>
  );
}
