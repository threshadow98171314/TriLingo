// 語言專屬特訓（活用道場、助數詞、數字大考驗、-아요／어요 活用、不規則動詞、拼字蜜蜂）。
// 出題在 engine/drills；這裡負責流程：選範圍 → 一題一題作答（選擇題或打字題）→ 結算。
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ResultScreen, type ResultData } from '../components/Result';
import { Runner } from '../components/Runner';
import { SpeakBtn, Tx } from '../components/ui';
import { META } from '../content';
import { fx } from '../core/fx';
import { learnedVocab } from '../core/progress';
import { shuffle } from '../core/rng';
import { sfx } from '../core/sfx';
import { finishGame, recordAnswer, useSave } from '../core/store';
import { canSpeak, speak, useVoices } from '../core/tts';
import type { LangId } from '../core/types';
import { clamp, cx } from '../core/util';
import { drillOf, type DrillDef, type DrillQ } from '../engine/drills';
import { furiPlain } from '../engine/furigana';
import { nav } from '../router';
import { Blocked } from './Practice';

/** 連擊倍率：每 3 連擊加 0.5 倍，最高 3 倍（和限時快答一樣） */
const multOf = (combo: number) => 1 + Math.min(4, Math.floor(combo / 3)) * 0.5;

const PRAISE = ['答對了！', '漂亮！', '完全正確！', '太強了！', '就是這樣！'];

interface Fb {
  ok: boolean;
  /** 選擇題選了第幾個（洗牌後的位置） */
  picked?: number;
  /** 打字題第一次打錯：給提示再試一次 */
  retry?: boolean;
}

function Round({ def, mode, lang, onAgain }: { def: DrillDef; mode: string; lang: LangId; onAgain: () => void }) {
  const save = useSave();
  const best = save.best.drill?.[`${def.id}.${lang}`] ?? 0;
  const back = `/l/${lang}/arcade`;
  const [qs] = useState<DrillQ[]>(() =>
    def.make(
      {
        rng: Math.random,
        learned: learnedVocab(save, lang)
          .filter((i) => i.kind !== 'char')
          .map((i) => ({ id: i.id, w: i.w, m: i.m, pos: i.pos })),
      },
      mode,
    ),
  );
  const [idx, setIdx] = useState(0);
  const [fb, setFb] = useState<Fb | null>(null);
  const [typed, setTyped] = useState('');
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<ResultData | null>(null);
  const st = useRef({ right: 0, maxCombo: 0, score: 0, tries: 0 });
  const q = qs[idx];
  const typing = !q.opts;
  // 選項每題洗牌一次；正確答案是原本的第一個
  const order = useMemo(() => (q.opts ? shuffle(q.opts.map((_, i) => i)) : []), [q]);
  const inputRef = useRef<HTMLInputElement>(null);
  const contRef = useRef<HTMLButtonElement>(null);

  // 打字題（拼字蜜蜂）一出題就唸
  useEffect(() => {
    if (typing && q.say) speak(q.say, lang);
    inputRef.current?.focus({ preventScroll: true });
  }, [q, typing, lang]);

  useEffect(() => {
    if (fb && !fb.retry) contRef.current?.focus({ preventScroll: true });
  }, [fb]);

  const finish = () => {
    const { right, maxCombo, score } = st.current;
    const perfect = right === qs.length;
    setResult({
      emoji: def.icon,
      headline: perfect ? '全對！' : `答對 ${right} / ${qs.length}`,
      sub: score > best && best > 0 ? `刷新紀錄：${score} 分（之前 ${best} 分）` : `這一場 ${score} 分${best > score ? `・最高紀錄 ${best} 分` : ''}`,
      outcome: finishGame({
        lang,
        game: def.id,
        parts: [[def.title, clamp(Math.round(score / 10), 3, 25)], ...(perfect ? ([['全對獎勵', 5]] as [string, number][]) : [])],
        score,
        maxCombo,
      }),
      lines: [
        ['答對', `${right} / ${qs.length}`],
        ['最高連擊', String(maxCombo)],
      ],
      back,
      backLabel: '回到遊樂場',
      again: { label: '再來一場', run: onAgain },
    });
  };

  const grade = (ok: boolean, picked?: number) => {
    if (ok) {
      const c = combo + 1;
      const gain = Math.round((typing && st.current.tries > 0 ? 5 : 10) * multOf(c));
      st.current.score += gain;
      st.current.right++;
      st.current.maxCombo = Math.max(st.current.maxCombo, c);
      setCombo(c);
      setScore(st.current.score);
      sfx.correct(c - 1);
    } else {
      setCombo(0);
      sfx.wrong();
      fx.shake(1);
    }
    if (q.itemId) recordAnswer(q.itemId, ok, 'game');
    setFb({ ok, picked });
    // 選擇題作答後唸出正確答案（設定裡的「自動朗讀」）
    if (!typing && q.say && save.settings.autoSpeak) speak(q.say, lang);
  };

  const pick = (k: number) => {
    if (fb) return;
    grade(order[k] === 0, k);
  };

  const submit = () => {
    if (fb && !fb.retry) return;
    const v = typed.trim().toLowerCase();
    if (!v) return;
    const ok = (q.answers ?? []).some((a) => a.toLowerCase() === v);
    if (!ok && st.current.tries === 0) {
      // 第一次打錯：提示第一個字母，再給一次機會
      st.current.tries = 1;
      sfx.wrong();
      setFb({ ok: false, retry: true });
      setTyped('');
      inputRef.current?.focus();
      return;
    }
    grade(ok);
  };

  const next = () => {
    st.current.tries = 0;
    if (idx + 1 >= qs.length) {
      finish();
      return;
    }
    setIdx(idx + 1);
    setFb(null);
    setTyped('');
  };

  // 鍵盤：1～4 選答案，Enter 繼續
  const live = useRef({ pick, next, fb, typing });
  live.current = { pick, next, fb, typing };
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const c = live.current;
      if (c.fb && !c.fb.retry && e.key === 'Enter' && !(e.target as HTMLElement | null)?.closest?.('button')) {
        e.preventDefault();
        c.next();
        return;
      }
      const n = Number(e.key);
      if (!c.typing && !c.fb && n >= 1 && n <= 4) {
        e.preventDefault();
        c.pick(n - 1);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  if (result) return <ResultScreen data={result} lang={lang} />;
  const done = !!fb && !fb.retry;
  const answer = q.opts ? q.opts[0] : (q.answers?.[0] ?? '');

  return (
    <div className="game-page drill" style={{ '--lang': META[lang].color } as CSSProperties}>
      <header className="session-top">
        <button type="button" className="icon-btn" aria-label="離開" onClick={() => nav(back)}>
          ✕
        </button>
        <div className="session-progress">
          <small>
            {def.title}・第 {idx + 1} / {qs.length} 題
          </small>
          <div className="runner-track">
            <div className="bar">
              <i style={{ width: `${((idx + (done ? 1 : 0)) / qs.length) * 100}%`, background: 'var(--lang)' }} />
            </div>
            {save.equip.runner && <Runner id={save.equip.runner} at={(idx + (done ? 1 : 0)) / qs.length} mood={done ? (fb!.ok ? 'ok' : 'bad') : null} />}
          </div>
        </div>
        <div className={cx('combo on', combo >= 3 && 'hot')}>
          🔥 {combo}・{score} 分
        </div>
      </header>

      <main className="session-body" key={idx}>
        <div className="ex drill-q">
          <p className="ex-label">{q.hint}</p>
          <div className="drill-prompt">
            {q.icon && (
              <span className="drill-icon" aria-hidden>
                {q.icon}
              </span>
            )}
            {typing ? (
              <span className="drill-listen">
                <SpeakBtn text={q.say ?? ''} lang={lang} size="lg" />
                <SpeakBtn text={q.say ?? ''} lang={lang} slow />
              </span>
            ) : (
              <Tx className="prompt-text big" s={q.prompt} lang={lang} />
            )}
          </div>
          {typing && <p className="muted drill-sub">{q.prompt}</p>}
          {q.opts ? (
            <div className={cx('options', q.opts.some((o) => furiPlain(o).length > 10) && 'list')}>
              {order.map((oi, k) => (
                <button
                  key={k}
                  type="button"
                  className={cx('opt', done && oi === 0 && 'right', done && fb?.picked === k && oi !== 0 && 'wrong')}
                  disabled={done}
                  onClick={() => pick(k)}
                >
                  <kbd>{k + 1}</kbd>
                  <Tx s={q.opts![oi]} lang={lang} />
                </button>
              ))}
            </div>
          ) : (
            <form
              className="drill-type"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <input
                ref={inputRef}
                className={cx('type-input', done && (fb!.ok ? 'right' : 'wrong'))}
                value={typed}
                disabled={done}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                lang={lang}
                aria-label="拼出這個字"
                placeholder={fb?.retry ? `第一個字母是 ${answer[0]}…` : '在這裡拼字'}
                onChange={(e) => setTyped(e.target.value)}
              />
              {!done && (
                <button type="submit" className="btn primary" disabled={!typed.trim()}>
                  檢查
                </button>
              )}
              {fb?.retry && <p className="drill-retry">差一點！再聽一次，第一個字母是「{answer[0]}」。</p>}
            </form>
          )}
        </div>
      </main>

      <footer className={cx('session-foot', done && (fb!.ok ? 'ok' : 'bad'))}>
        {done && (
          <div className="fb">
            <div className="fb-main">
              <div className="fb-head">
                {fb!.ok ? `✔ ${PRAISE[idx % PRAISE.length]}` : '✘ 正確答案'}
                {fb!.ok && combo >= 3 && <span className="fb-combo">{combo} 連擊</span>}
              </div>
              <div className="drill-answer">
                <Tx className="ic-word" s={answer} lang={lang} />
                {q.say && canSpeak(lang) && <SpeakBtn text={q.say} lang={lang} />}
              </div>
              {q.explain && <p className="fb-explain">💡 {q.explain}</p>}
            </div>
            <button ref={contRef} type="button" className={cx('btn wide', fb!.ok ? 'ok' : 'bad')} onClick={next}>
              {idx + 1 >= qs.length ? '看結果' : '繼續'}
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}

function Ready({ def, lang, onStart }: { def: DrillDef; lang: LangId; onStart: (mode: string) => void }) {
  const [mode, setMode] = useState(def.modes?.[0].id ?? 'all');
  return (
    <div className="game-page drill" style={{ '--lang': META[lang].color } as CSSProperties}>
      <header className="session-top">
        <button type="button" className="icon-btn" aria-label="離開" onClick={() => nav(`/l/${lang}/arcade`)}>
          ✕
        </button>
        <div className="session-progress">
          <small>{def.title}</small>
        </div>
      </header>
      <main className="session-body">
        <div className="blitz-ready card">
          <div className="empty-icon">{def.icon}</div>
          <h1>{def.title}</h1>
          <ul>
            {def.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          {def.modes && (
            <div className="drill-modes" role="radiogroup" aria-label="出題範圍">
              {def.modes.map((m) => (
                <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} className={cx('drill-mode', mode === m.id && 'on')} onClick={() => setMode(m.id)}>
                  <b>{m.label}</b>
                  <small>{m.desc}</small>
                </button>
              ))}
            </div>
          )}
          <button type="button" className="btn primary wide" autoFocus onClick={() => onStart(mode)}>
            開始！
          </button>
        </div>
      </main>
    </div>
  );
}

export function DrillPage({ lang, id }: { lang: LangId; id: string }) {
  useVoices();
  const save = useSave();
  const def = drillOf(lang, id);
  const [run, setRun] = useState<{ mode: string; n: number } | null>(null);
  if (!def) return <Blocked lang={lang} icon="🧭" title="找不到這個特訓" back={`/l/${lang}/arcade`} children="回遊樂場看看其他遊戲吧。" />;
  const words = learnedVocab(save, lang).filter((i) => i.kind !== 'char').length;
  if (words < def.need) {
    return (
      <Blocked lang={lang} icon={def.icon} title={`${def.title}尚未解鎖`} back={`/l/${lang}/arcade`}>
        再學會 {def.need - words} 個字詞就能開始（{words} / {def.need}）。
      </Blocked>
    );
  }
  if (def.needsVoice && !canSpeak(lang)) {
    return (
      <Blocked lang={lang} icon={def.icon} title="這個瀏覽器沒有語音" back={`/l/${lang}/arcade`}>
        {def.title}要聽發音，請改用 Chrome 或 Edge。
      </Blocked>
    );
  }
  if (!run) return <Ready def={def} lang={lang} onStart={(mode) => setRun({ mode, n: 0 })} />;
  return <Round key={run.n} def={def} mode={run.mode} lang={lang} onAgain={() => setRun({ ...run, n: run.n + 1 })} />;
}
