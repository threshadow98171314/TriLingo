// 一場練習的流程控制：出題 → 作答 → 回饋 → 下一題 → 結算。
// 課程、單元測驗、複習、聽力特訓都用這個元件。
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { COURSES } from '../content';
import { sfx } from '../core/sfx';
import { recordAnswer, useSave, type AnswerMode, type SessionStats } from '../core/store';
import { speak, stopSpeaking } from '../core/tts';
import type { LangId } from '../core/types';
import { cx } from '../core/util';
import { reshuffle, type Exercise, type Reveal } from '../engine/exercises';
import { nav } from '../router';
import { ChoiceView, MatchView, NoteView, TeachView, TilesView, TypeView } from './ExerciseViews';
import { ResultScreen, type ResultData } from './Result';
import { Bar, ItemCard, Modal } from './ui';

interface QueueItem {
  ex: Exercise;
  key: number;
  /** 第幾次重考（0 = 第一次作答，才計分） */
  retry: number;
}

interface Feedback {
  correct: boolean;
  reveal?: Reveal;
  picked: number | null;
}

const PRAISE = ['答對了！', '完全正確！', '漂亮！', '太棒了！', '就是這樣！'];

export function Session({
  lang,
  title,
  exercises,
  mode,
  exitTo,
  retry = true,
  onFinish,
}: {
  lang: LangId;
  title: string;
  exercises: Exercise[];
  mode: AnswerMode;
  exitTo: string;
  /** 答錯的題目排到最後再考一次 */
  retry?: boolean;
  onFinish: (stats: SessionStats) => ResultData;
}) {
  const course = COURSES[lang];
  const { autoSpeak } = useSave().settings;
  const [queue, setQueue] = useState<QueueItem[]>(() => exercises.map((ex, key) => ({ ex, key, retry: 0 })));
  const [idx, setIdx] = useState(0);
  const [fb, setFb] = useState<Feedback | null>(null);
  const [combo, setCombo] = useState(0);
  const [result, setResult] = useState<ResultData | null>(null);
  const [asking, setAsking] = useState(false);
  const st = useRef({ graded: 0, correct: 0, maxCombo: 0, start: Date.now(), answeredAt: 0, praise: PRAISE[0] });

  const cur = queue[idx];
  const passive = cur.ex.t === 'teach' || cur.ex.t === 'note';

  const bump = (correct: boolean) => {
    const n = correct ? combo + 1 : 0;
    setCombo(n);
    st.current.maxCombo = Math.max(st.current.maxCombo, n);
    st.current.answeredAt = Date.now();
    st.current.praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
    if (correct) sfx.correct(n - 1);
    else sfx.wrong();
  };

  /** 選擇、字卡、輸入題作答 */
  const answer = (correct: boolean, picked: number | null = null) => {
    const ex = cur.ex;
    if (fb || (ex.t !== 'choice' && ex.t !== 'tiles' && ex.t !== 'type')) return;
    if (cur.retry === 0) {
      st.current.graded++;
      if (correct) st.current.correct++;
      recordAnswer(ex.itemId, correct, mode);
    }
    bump(correct);
    if (!correct && retry && cur.retry < 2) {
      setQueue((q) => [...q, { ex: reshuffle(ex, Math.random), key: q.length, retry: cur.retry + 1 }]);
    }
    setFb({ correct, reveal: ex.reveal, picked });
    if (autoSpeak && ex.reveal.speak) speak(ex.reveal.speak.text, ex.reveal.speak.lang);
  };

  const matchDone = (wrongIds: string[]) => {
    if (fb || cur.ex.t !== 'match') return;
    const ok = wrongIds.length === 0;
    st.current.graded++;
    if (ok) st.current.correct++;
    for (const p of cur.ex.pairs) recordAnswer(p.itemId, !wrongIds.includes(p.itemId), mode);
    bump(ok);
    setFb({ correct: ok, picked: null });
  };

  const next = () => {
    if (idx + 1 < queue.length) {
      setIdx(idx + 1);
      setFb(null);
      return;
    }
    const s = st.current;
    stopSpeaking();
    setResult(onFinish({ graded: s.graded, correct: s.correct, maxCombo: s.maxCombo, seconds: Math.round((Date.now() - s.start) / 1000) }));
  };

  // 「繼續」按鈕一出現就取得焦點，按 Enter 即可前進
  const contRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    contRef.current?.focus({ preventScroll: true });
  }, [idx, fb]);

  const live = useRef({ next, fb, passive, asking });
  live.current = { next, fb, passive, asking };
  useEffect(() => {
    // 焦點不在按鈕上時（例如還停在輸入框），Enter 一樣可以前進
    const h = (e: KeyboardEvent) => {
      const c = live.current;
      if (e.key !== 'Enter' || e.repeat || c.asking) return;
      // 焦點在按鈕上時交給按鈕自己處理，避免一次按鍵前進兩題
      if ((e.target as HTMLElement | null)?.closest?.('button, a')) return;
      // 送出答案的那一下 Enter 不能同時觸發「繼續」
      if ((c.fb && Date.now() - st.current.answeredAt > 250) || (c.passive && !c.fb)) {
        e.preventDefault();
        c.next();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => () => stopSpeaking(), []);

  if (result) return <ResultScreen data={result} lang={lang} />;

  const progress = (idx + (fb ? 1 : 0)) / queue.length;
  const ex = cur.ex;

  return (
    <div className={cx('session', fb && (fb.correct ? 'is-ok' : 'is-bad'))} style={{ '--lang': course.color } as CSSProperties}>
      <header className="session-top">
        <button
          type="button"
          className="icon-btn"
          aria-label="離開"
          onClick={() => (idx === 0 && !fb ? nav(exitTo) : setAsking(true))}
        >
          ✕
        </button>
        <div className="session-progress">
          <small>{title}</small>
          <Bar v={progress} color="var(--lang)" />
        </div>
        <div className={cx('combo', combo >= 2 && 'on', combo >= 5 && 'hot')} key={combo} title="連擊">
          🔥 {combo}
        </div>
      </header>

      <main className="session-body" key={cur.key}>
        {cur.retry > 0 && <span className="retry-tag">再試一次</span>}
        {ex.t === 'choice' && <ChoiceView ex={ex} done={!!fb} picked={fb?.picked ?? null} onPick={(i) => answer(i === ex.answer, i)} />}
        {ex.t === 'tiles' && <TilesView ex={ex} done={!!fb} onSubmit={(ok) => answer(ok)} />}
        {ex.t === 'type' && <TypeView ex={ex} done={!!fb} onSubmit={(ok) => answer(ok)} />}
        {ex.t === 'match' && <MatchView ex={ex} onDone={matchDone} />}
        {ex.t === 'teach' && <TeachView ex={ex} lang={lang} autoSpeak={autoSpeak} />}
        {ex.t === 'note' && <NoteView ex={ex} lang={lang} />}
      </main>

      <footer className={cx('session-foot', fb && (fb.correct ? 'ok' : 'bad'))}>
        {fb ? (
          <div className="fb">
            <div className="fb-main">
              <div className="fb-head">
                {fb.correct ? `✔ ${st.current.praise}` : ex.t === 'match' ? '✘ 有配錯的，再多練幾次' : '✘ 正確答案'}
                {fb.correct && combo >= 3 && <span className="fb-combo">{combo} 連擊</span>}
              </div>
              {fb.reveal && <ItemCard item={fb.reveal.item} lang={lang} />}
              {fb.reveal?.explain && <p className="fb-explain">💡 {fb.reveal.explain}</p>}
            </div>
            <button ref={contRef} type="button" className={cx('btn wide', fb.correct ? 'ok' : 'bad')} onClick={next}>
              繼續
            </button>
          </div>
        ) : (
          passive && (
            <button ref={contRef} type="button" className="btn primary wide" onClick={next}>
              {ex.t === 'note' ? '知道了' : '繼續'}
            </button>
          )
        )}
      </footer>

      {asking && (
        <Modal onClose={() => setAsking(false)}>
          <h2>要離開嗎？</h2>
          <p className="muted">現在離開的話，這一場的進度不會保存。</p>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={() => nav(exitTo)}>
              離開
            </button>
            <button type="button" className="btn primary" onClick={() => setAsking(false)}>
              繼續練習
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
