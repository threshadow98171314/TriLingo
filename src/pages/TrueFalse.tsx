// 真假快判：畫面上的字和意思配對正確嗎？45 秒內盡量判斷，連擊越高分數越多，判斷錯扣 3 秒。
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ResultScreen, type ResultData } from '../components/Result';
import { Tx } from '../components/ui';
import { courseIndex, META } from '../content';
import { learnedVocab, UNLOCK } from '../core/progress';
import { pick } from '../core/rng';
import { sfx } from '../core/sfx';
import { finishGame, getSave, recordAnswer, useSave } from '../core/store';
import type { LangId, VocabItem } from '../core/types';
import { clamp, cx } from '../core/util';
import { front, isVocab } from '../engine/exercises';
import { nav } from '../router';
import { Blocked } from './Practice';

const DURATION = 45_000;
const PENALTY = 3_000;
const multOf = (combo: number) => 1 + Math.min(4, Math.floor(combo / 3)) * 0.5;

interface Q {
  item: VocabItem;
  /** 顯示的意思（可能是別的字的意思） */
  shown: string;
  truth: boolean;
}

function Game({ lang, vocab, onAgain }: { lang: LangId; vocab: VocabItem[]; onAgain: () => void }) {
  const best = useSave().best.tf?.[lang] ?? 0;
  const back = `/l/${lang}/arcade`;
  const idx = courseIndex(lang).items;
  const last = useRef('');

  const nextQ = (): Q => {
    let item = pick(vocab);
    for (let i = 0; i < 5 && item.id === last.current; i++) item = pick(vocab);
    last.current = item.id;
    // 錯的意思從同一單元、同類型（字母／單字／短句）裡挑，比較難一眼看穿
    const same = idx.get(item.id)!.unit.items.filter((x): x is VocabItem => isVocab(x) && x.kind === item.kind && x.m !== item.m);
    const others = same.length ? same : vocab.filter((x) => x.m !== item.m);
    const truth = !others.length || Math.random() < 0.5;
    return { item, shown: truth ? item.m : pick(others).m, truth };
  };

  const [phase, setPhase] = useState<'ready' | 'play'>('ready');
  const [q, setQ] = useState<Q>(nextQ);
  const [n, setN] = useState(0);
  const [fb, setFb] = useState<null | 'ok' | 'bad'>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const [result, setResult] = useState<ResultData | null>(null);
  const endAt = useRef(0);
  const st = useRef({ score: 0, right: 0, total: 0, maxCombo: 0, done: false });

  const finish = () => {
    if (st.current.done) return;
    st.current.done = true;
    const { score, right, total, maxCombo } = st.current;
    setResult({
      emoji: '✅',
      headline: `${score} 分！`,
      sub: score > best && best > 0 ? `超越了之前的 ${best} 分。` : best > score ? `個人最高紀錄是 ${best} 分，再試一次？` : undefined,
      outcome: finishGame({ lang, game: 'truefalse', parts: [['真假快判', clamp(Math.round(score / 15), 5, 35)]], score, maxCombo }),
      lines: [
        ['判斷正確', `${right} / ${total}`],
        ['最高連擊', String(maxCombo)],
      ],
      back,
      backLabel: '回到遊樂場',
      again: { label: '再挑戰一次', run: onAgain },
    });
  };
  const live = useRef(finish);
  live.current = finish;

  useEffect(() => {
    if (phase !== 'play' || result) return;
    const t = setInterval(() => {
      const ms = endAt.current - Date.now();
      setLeft(Math.max(0, ms));
      if (ms <= 0) live.current();
    }, 100);
    return () => clearInterval(t);
  }, [phase, result]);

  const start = () => {
    sfx.pop();
    endAt.current = Date.now() + DURATION;
    setPhase('play');
  };

  const judge = (says: boolean) => {
    if (fb || st.current.done || phase !== 'play') return;
    const ok = says === q.truth;
    st.current.total++;
    // 只有「配對正確」的題目才代表認得這個字，記進熟練度
    if (q.truth) recordAnswer(q.item.id, ok, 'game');
    if (ok) {
      const c = combo + 1;
      st.current.score += Math.round(10 * multOf(c));
      st.current.right++;
      st.current.maxCombo = Math.max(st.current.maxCombo, c);
      setCombo(c);
      setScore(st.current.score);
      sfx.correct(c - 1);
    } else {
      endAt.current -= PENALTY;
      setCombo(0);
      sfx.wrong();
    }
    setFb(ok ? 'ok' : 'bad');
    setTimeout(
      () => {
        setQ(nextQ());
        setN((x) => x + 1);
        setFb(null);
      },
      ok ? 200 : 1100,
    );
  };

  const keys = useRef({ judge, start, phase });
  keys.current = { judge, start, phase };
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = keys.current;
      if (k.phase === 'ready' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        k.start();
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'f') k.judge(false);
      else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'j') k.judge(true);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  if (result) return <ResultScreen data={result} lang={lang} />;
  const mult = multOf(combo);

  return (
    <div className="game-page" style={{ '--lang': META[lang].color } as CSSProperties}>
      <header className="session-top">
        <button type="button" className="icon-btn" aria-label="離開" onClick={() => nav(back)}>
          ✕
        </button>
        <div className="session-progress">
          <small>真假快判{best > 0 && `・個人最高 ${best} 分`}</small>
          <div className={cx('bar', left < 10_000 && 'danger')}>
            <i style={{ width: `${(left / DURATION) * 100}%`, background: left < 10_000 ? 'var(--bad)' : 'var(--lang)', transition: 'width .1s linear' }} />
          </div>
        </div>
        <div className={cx('combo on', combo >= 3 && 'hot')}>{Math.ceil(left / 1000)} 秒</div>
      </header>

      {phase === 'ready' ? (
        <main className="session-body">
          <div className="blitz-ready card">
            <div className="empty-icon">✅</div>
            <h1>真假快判</h1>
            <ul>
              <li>畫面會出現一個字和一個意思，判斷它們「配對正確」嗎？</li>
              <li>對就按 ✓（→ 或 J），不對就按 ✗（← 或 F）。</li>
              <li>45 秒內盡量判斷；每 3 連擊倍率 +0.5，判斷錯扣 3 秒。</li>
            </ul>
            <button type="button" className="btn primary wide" autoFocus onClick={start}>
              開始！
            </button>
          </div>
        </main>
      ) : (
        <main className="session-body">
          <div className="blitz-hud">
            <div>
              <small>分數</small>
              <b key={score} className="bump">
                {score}
              </b>
            </div>
            <div>
              <small>連擊</small>
              <b>🔥 {combo}</b>
            </div>
            <div>
              <small>倍率</small>
              <b className={cx(mult > 1 && 'hot')}>×{mult}</b>
            </div>
          </div>
          <div key={n} className={cx('tf-card card', fb)}>
            <Tx className="tf-word" s={front(q.item, lang)} lang={lang} />
            <span className="tf-eq">＝</span>
            <span className="tf-mean">{q.shown}</span>
            {fb === 'bad' && <small className="tf-answer">正確：{q.item.m}</small>}
          </div>
          <div className="tf-buttons">
            <button type="button" className="tf-btn no" onClick={() => judge(false)} disabled={!!fb}>
              ✗ <small>不對</small>
            </button>
            <button type="button" className="tf-btn yes" onClick={() => judge(true)} disabled={!!fb}>
              ✓ <small>正確</small>
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

export function TrueFalsePage({ lang }: { lang: LangId }) {
  const [run, setRun] = useState(0);
  const vocab = learnedVocab(getSave(), lang);
  if (vocab.length < UNLOCK.truefalse) {
    return (
      <Blocked lang={lang} icon="✅" title="真假快判尚未解鎖" back={`/l/${lang}`}>
        學會 {UNLOCK.truefalse} 個字詞之後就能開始。
      </Blocked>
    );
  }
  return <Game key={run} lang={lang} vocab={vocab} onAgain={() => setRun((x) => x + 1)} />;
}
