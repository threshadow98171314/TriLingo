// 限時快答：60 秒內盡量答對，連擊越高每題分數越多，答錯扣 3 秒。
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ChoiceView } from '../components/ExerciseViews';
import { ResultScreen, type ResultData } from '../components/Result';
import { COURSES, courseIndex } from '../content';
import { learnedVocab, UNLOCK } from '../core/progress';
import { pick } from '../core/rng';
import { sfx } from '../core/sfx';
import { finishGame, getSave, recordAnswer, useSave } from '../core/store';
import type { LangId, VocabItem } from '../core/types';
import { clamp, cx } from '../core/util';
import { isVocab, recall, recog, type ChoiceEx } from '../engine/exercises';
import { nav } from '../router';
import { Blocked } from './Practice';

const DURATION = 60_000;
const PENALTY = 3_000;

/** 連擊倍率：每 3 連擊加 0.5 倍，最高 3 倍 */
const multOf = (combo: number) => 1 + Math.min(4, Math.floor(combo / 3)) * 0.5;

function Game({ lang, vocab, onAgain }: { lang: LangId; vocab: VocabItem[]; onAgain: () => void }) {
  const best = useSave().best.blitz[lang];
  const back = `/l/${lang}/arcade`;
  const idx = courseIndex(lang).items;
  const last = useRef('');

  const nextQuestion = (): ChoiceEx => {
    let item = pick(vocab);
    for (let i = 0; i < 5 && item.id === last.current; i++) item = pick(vocab);
    last.current = item.id;
    const pool = idx.get(item.id)!.unit.items.filter(isVocab);
    const ctx = { lang, rng: Math.random, canListen: false };
    return Math.random() < 0.5 ? recog(item, pool, ctx) : recall(item, pool, ctx);
  };

  const [phase, setPhase] = useState<'ready' | 'play'>('ready');
  const [q, setQ] = useState<ChoiceEx>(nextQuestion);
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
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
      emoji: '⏱️',
      headline: `${score} 分！`,
      sub: score > best && best > 0 ? `超越了之前的 ${best} 分。` : best > score ? `個人最高紀錄是 ${best} 分，再試一次？` : undefined,
      // 一分鐘的報酬和一堂短課差不多：300 分約 20 XP，上限 40
      outcome: finishGame({ lang, game: 'blitz', parts: [['限時快答', clamp(Math.round(score / 15), 5, 40)]], score, maxCombo }),
      lines: [
        ['答對', `${right} / ${total}`],
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

  const answer = (i: number) => {
    if (picked !== null || st.current.done) return;
    const ok = i === q.answer;
    setPicked(i);
    recordAnswer(q.itemId, ok, 'game');
    st.current.total++;
    if (ok) {
      const c = combo + 1;
      const gain = Math.round(10 * multOf(c));
      st.current.score += gain;
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
    // 答對馬上換題保持節奏；答錯多停一下，看清楚正確答案
    setTimeout(
      () => {
        setQ(nextQuestion());
        setN((x) => x + 1);
        setPicked(null);
      },
      ok ? 220 : 900,
    );
  };

  if (result) return <ResultScreen data={result} lang={lang} />;

  const mult = multOf(combo);
  return (
    <div className="game-page" style={{ '--lang': COURSES[lang].color } as CSSProperties}>
      <header className="session-top">
        <button type="button" className="icon-btn" aria-label="離開" onClick={() => nav(back)}>
          ✕
        </button>
        <div className="session-progress">
          <small>限時快答{best > 0 && `・個人最高 ${best} 分`}</small>
          <div className={cx('bar', left < 10_000 && 'danger')}>
            <i style={{ width: `${(left / DURATION) * 100}%`, background: left < 10_000 ? 'var(--bad)' : 'var(--lang)', transition: 'width .1s linear' }} />
          </div>
        </div>
        <div className={cx('combo on', combo >= 3 && 'hot')}>{Math.ceil(left / 1000)} 秒</div>
      </header>

      {phase === 'ready' ? (
        <main className="session-body">
          <div className="blitz-ready card">
            <div className="empty-icon">⏱️</div>
            <h1>限時快答</h1>
            <ul>
              <li>60 秒內盡量答對，題目來自你學過的字詞。</li>
              <li>每 3 連擊倍率 +0.5，最高 ×3。</li>
              <li>答錯扣 3 秒，連擊歸零。</li>
              <li>可以用鍵盤 1–4 作答。</li>
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
          <div key={n} className="blitz-q">
            <ChoiceView ex={q} done={picked !== null} picked={picked} onPick={answer} />
          </div>
        </main>
      )}
    </div>
  );
}

export function BlitzPage({ lang }: { lang: LangId }) {
  const [run, setRun] = useState(0);
  const vocab = learnedVocab(getSave(), lang);
  if (vocab.length < UNLOCK.blitz) {
    return (
      <Blocked lang={lang} icon="⏱️" title="限時快答尚未解鎖" back={`/l/${lang}`}>
        學會 {UNLOCK.blitz} 個字詞之後就能開始。
      </Blocked>
    );
  }
  return <Game key={run} lang={lang} vocab={vocab} onAgain={() => setRun((n) => n + 1)} />;
}
