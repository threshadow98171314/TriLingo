// 一場練習的流程控制：出題 → 作答 → 回饋 → 下一題 → 結算。
// 課程、單元測驗、複習、聽力特訓都用這個元件。
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { META } from '../content';
import { fx } from '../core/fx';
import { sfx } from '../core/sfx';
import { recordAnswer, useSave, type AnswerMode, type SessionStats } from '../core/store';
import { speak, stopSpeaking } from '../core/tts';
import type { LangId } from '../core/types';
import { cx } from '../core/util';
import { reshuffle, type Exercise, type Reveal } from '../engine/exercises';
import { furiPlain } from '../engine/furigana';
import { checkJa } from '../engine/jaInput';
import { nav } from '../router';
import { ChoiceView, MatchView, NoteView, TeachView, TilesView, TypeJaView, TypeView } from './ExerciseViews';
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
  /** 打字題：使用者打的答案 */
  typed?: string;
  /** 補充說明（例如寫法提醒） */
  note?: string;
  /** 打字題答錯：可以自己改判為答對（例如打了漢字寫法，題庫用的是假名） */
  canOverride?: boolean;
  /** 答錯時排進佇列的重考題 key（改判時要撤回） */
  retryKey?: number;
}

const PRAISE = ['答對了！', '完全正確！', '漂亮！', '太棒了！', '就是這樣！'];

/** 連擊里程碑的橫幅文字 */
const COMBO_MILESTONES: Record<number, string> = {
  5: '手感來了！',
  10: '勢如破竹！',
  15: '無人能擋！',
  20: '神乎其技！',
  30: '傳說級連擊！',
  50: '你真的是人類嗎？',
};
const MILESTONE_LEVELS = Object.keys(COMBO_MILESTONES).map(Number);

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
  const course = META[lang];
  const { autoSpeak } = useSave().settings;
  const [queue, setQueue] = useState<QueueItem[]>(() => exercises.map((ex, key) => ({ ex, key, retry: 0 })));
  const [idx, setIdx] = useState(0);
  const [fb, setFb] = useState<Feedback | null>(null);
  const [combo, setCombo] = useState(0);
  const [result, setResult] = useState<ResultData | null>(null);
  const [asking, setAsking] = useState(false);
  /** 這一場不再出打字題（按了「現在不方便打字」） */
  const [noTyping, setNoTyping] = useState(false);
  const st = useRef({ graded: 0, correct: 0, maxCombo: 0, start: Date.now(), answeredAt: 0, praise: PRAISE[0], xpAnswer: false, comboBefore: 0 });

  const cur = queue[idx];
  // 打字題在「不方便打字」時改出事先準備好的選擇題
  const ex: Exercise = cur.ex.t === 'typeja' && noTyping ? cur.ex.fallback : cur.ex;
  const passive = ex.t === 'teach' || ex.t === 'note';

  const bump = (correct: boolean) => {
    st.current.comboBefore = combo;
    const n = correct ? combo + 1 : 0;
    setCombo(n);
    st.current.maxCombo = Math.max(st.current.maxCombo, n);
    st.current.answeredAt = Date.now();
    st.current.praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
    if (correct) sfx.correct(n - 1);
    else sfx.wrong();
  };

  /** 選擇、字卡、輸入題作答 */
  const answer = (correct: boolean, picked: number | null = null, extra: Partial<Feedback> = {}) => {
    if (fb || (ex.t !== 'choice' && ex.t !== 'tiles' && ex.t !== 'type' && ex.t !== 'typeja')) return;
    st.current.xpAnswer = correct && cur.retry === 0;
    if (cur.retry === 0) {
      st.current.graded++;
      if (correct) st.current.correct++;
      recordAnswer(ex.itemId, correct, mode);
    }
    bump(correct);
    let retryKey: number | undefined;
    if (!correct && retry && cur.retry < 2) {
      retryKey = queue.length;
      setQueue((q) => [...q, { ex: reshuffle(ex, Math.random), key: q.length, retry: cur.retry + 1 }]);
    }
    setFb({ correct, reveal: ex.reveal, picked, retryKey, ...extra });
    if (autoSpeak && ex.reveal.speak) speak(ex.reveal.speak.text, ex.reveal.speak.lang);
  };

  /** 日文打字題：假名、漢字、混打都算對；只差平假名／片假名時算對但提醒寫法 */
  const answerTyped = (input: string) => {
    if (ex.t !== 'typeja') return;
    const r = checkJa(input, ex.furi);
    answer(r.ok, null, {
      typed: input.trim(),
      note: r.ok && !r.exact ? `標準寫法是「${furiPlain(ex.furi)}」，注意平假名和片假名。` : undefined,
      canOverride: !r.ok,
    });
  };

  /** 「我的答案也對」：改判為答對，撤回重考題、恢復連擊 */
  const override = () => {
    if (!fb || fb.correct || !fb.canOverride || ex.t !== 'typeja') return;
    if (cur.retry === 0) {
      st.current.correct++;
      st.current.xpAnswer = true;
      recordAnswer(ex.itemId, true, mode);
    }
    const key = fb.retryKey;
    if (key !== undefined) setQueue((q) => q.filter((x) => x.key !== key));
    const n = st.current.comboBefore + 1;
    setCombo(n);
    st.current.maxCombo = Math.max(st.current.maxCombo, n);
    sfx.correct(n - 1);
    setFb({ ...fb, correct: true, canOverride: false, retryKey: undefined, note: '已改判為答對。如果是打錯字，下次再加油！' });
  };

  const matchDone = (wrongIds: string[]) => {
    if (fb || cur.ex.t !== 'match') return;
    const ok = wrongIds.length === 0;
    st.current.xpAnswer = ok;
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

  // 作答特效：答對在答案上爆出星光、飄出 +1 XP；連擊里程碑出現大橫幅；答錯畫面輕震
  useEffect(() => {
    if (!fb) return;
    if (!fb.correct) {
      fx.shake(1);
      return;
    }
    const anchor = document.querySelector('.opt.right, .slots.right, .type-input.right, .match-grid');
    fx.burstAt(anchor, { count: 10 + Math.min(combo, 20), speed: 0.28 + Math.min(combo, 20) * 0.01 });
    if (st.current.xpAnswer) fx.floatAt(anchor, '+1 XP', 'xp');
    if (COMBO_MILESTONES[combo]) {
      const level = MILESTONE_LEVELS.indexOf(combo);
      fx.banner(`${combo} 連擊`, COMBO_MILESTONES[combo], level >= 3 ? 'rainbow' : 'combo');
      fx.burst(window.innerWidth / 2, window.innerHeight * 0.4, { count: 40 + level * 15, speed: 0.55, shapes: ['star', 'spark', 'glow'] });
      if (level >= 1) fx.flash(level >= 3 ? 'rgba(180,140,255,0.35)' : 'rgba(255,170,80,0.3)');
      sfx.combo(level);
    }
    // 只在回饋出現的那一刻播放
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fb]);

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
        <div className={cx('combo', combo >= 2 && 'on', combo >= 5 && 'hot', combo >= 10 && 'blaze', combo >= 20 && 'inferno')} key={combo} title="連擊">
          🔥 {combo}
        </div>
      </header>

      <main className="session-body" key={cur.key}>
        {cur.retry > 0 && <span className="retry-tag">再試一次</span>}
        {ex.t === 'choice' && <ChoiceView ex={ex} done={!!fb} picked={fb?.picked ?? null} onPick={(i) => answer(i === ex.answer, i)} />}
        {ex.t === 'tiles' && <TilesView ex={ex} done={!!fb} onSubmit={(ok) => answer(ok)} />}
        {ex.t === 'type' && <TypeView ex={ex} done={!!fb} onSubmit={(ok) => answer(ok)} />}
        {ex.t === 'typeja' && <TypeJaView ex={ex} done={!!fb} verdict={fb ? fb.correct : null} onSubmit={answerTyped} onFallback={() => setNoTyping(true)} />}
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
              {fb.note && <p className="fb-explain">✍️ {fb.note}</p>}
              {fb.canOverride && fb.typed && (
                <button type="button" className="link-btn fb-override" onClick={override}>
                  我的答案也對（{fb.typed}）
                </button>
              )}
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
