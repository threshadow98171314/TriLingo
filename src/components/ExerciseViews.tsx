// 各種題型的畫面。只負責互動，對錯回報給外層的 Session。
import { useEffect, useMemo, useRef, useState } from 'react';
import { shuffle } from '../core/rng';
import { sfx } from '../core/sfx';
import { speak } from '../core/tts';
import type { LangId } from '../core/types';
import { cx } from '../core/util';
import type { ChoiceEx, MatchEx, NoteEx, TeachEx, TilesEx, TypeEx, TypeWordEx } from '../engine/exercises';
import { isVocab, sayOf } from '../engine/exercises';
import { normJa } from '../engine/jaInput';
import { checkTyped, diagnose, firstHint, keyGuide, normKo } from '../engine/typing';
import { PictureArt } from '../art/pictures';
import { pictureOf } from '../engine/pictures';
import { TypingRules } from './TypingRules';
import { ClozeText, ItemCard, Modal, Ruby, SpeakBtn, Tx } from './ui';

/** 讓鍵盤事件處理器永遠拿到最新的 callback，又不用每次重新綁定 */
function useLatest<T>(v: T) {
  const ref = useRef(v);
  ref.current = v;
  return ref;
}

// ───────── 選擇題 ─────────

export function ChoiceView({
  ex,
  done,
  picked,
  onPick,
  onMute,
}: {
  ex: ChoiceEx;
  done: boolean;
  picked: number | null;
  onPick: (i: number) => void;
  /** 現在不方便聽：之後的聽力題改成看文字 */
  onMute?: () => void;
}) {
  const pick = useLatest(onPick);

  useEffect(() => {
    if (ex.audio) speak(ex.audio.text, ex.audio.lang);
  }, [ex]);

  useEffect(() => {
    if (done) return;
    const h = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= ex.options.length) {
        e.preventDefault();
        pick.current(n - 1);
      } else if (e.key === ' ' && ex.audio) {
        e.preventDefault();
        speak(ex.audio.text, ex.audio.lang);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [ex, done, pick]);

  const showPrompt = !!ex.prompt && (!ex.hidePrompt || done);
  const talk = ex.reveal.item.kind === 'qa' && !!ex.reveal.item.ask;
  const pics = ex.options.some((o) => o.pic);
  // 選項比較長、或只有三個選項時排成一欄，兩欄會參差不齊
  const long = !pics && (ex.options.length === 3 || ex.options.some((o) => o.s.length > 14));

  return (
    <div className="ex ex-choice">
      <p className="ex-label">{ex.label}</p>
      <div className="ex-prompt">
        {ex.pic && (
          <div className="pic-prompt">
            <PictureArt id={ex.pic} size={150} />
          </div>
        )}
        {ex.audio && (
          <div className="audio-prompt">
            <SpeakBtn text={ex.audio.text} lang={ex.audio.lang} size="lg" />
            <SpeakBtn text={ex.audio.text} lang={ex.audio.lang} slow />
          </div>
        )}
        {ex.audio && (ex.hidePrompt || talk) && onMute && !done && (
          <button type="button" className="link-btn mute-btn" onClick={onMute}>
            🔇 現在不方便聽
          </button>
        )}
        {ex.prompt && ex.mode === 'cloze' ? (
          <div className="prompt-text">
            <ClozeText q={ex.prompt.s} lang={ex.prompt.lang as LangId} fill={done ? ex.options[ex.answer].s : null} />
          </div>
        ) : (
          showPrompt && ex.prompt && (talk ? <TalkPrompt s={ex.prompt.s} lang={ex.prompt.lang} /> : <Tx className={cx('prompt-text', ex.big && 'big')} s={ex.prompt.s} lang={ex.prompt.lang} />)
        )}
      </div>
      <div className={cx('options', long && 'list', pics && 'pics')}>
        {ex.options.map((o, i) => (
          <button
            key={i}
            type="button"
            className={cx('opt', o.pic && 'pic-opt', done && i === ex.answer && 'right', done && picked === i && i !== ex.answer && 'wrong')}
            disabled={done}
            onClick={() => onPick(i)}
            aria-label={o.pic ? `第 ${i + 1} 張圖` : undefined}
          >
            <kbd>{i + 1}</kbd>
            {o.pic ? (
              <>
                <PictureArt id={o.pic} size={88} />
                {done && <small>{o.s}</small>}
              </>
            ) : (
              <Tx s={o.s} lang={o.lang} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 多益 Part 3／4／7：文章或對話稿放在框裡，最後一段是問題 */
function TalkPrompt({ s, lang }: { s: string; lang: LangId | 'zh' }) {
  const k = s.lastIndexOf('\n\n');
  return (
    <div className="talk-prompt">
      {k >= 0 && <Tx className="talk-passage" s={s.slice(0, k)} lang={lang} />}
      <Tx className="talk-ask" s={k >= 0 ? s.slice(k + 2) : s} lang={lang} />
    </div>
  );
}

// ───────── 字卡題（拼字／句子重組） ─────────

export function TilesView({ ex, done, onSubmit }: { ex: TilesEx; done: boolean; onSubmit: (correct: boolean) => void }) {
  /** 已放上去的字卡（存的是 bank 的索引） */
  const [placed, setPlaced] = useState<number[]>([]);
  const spell = ex.mode === 'spell';
  const ready = spell ? placed.length === ex.answer.length : placed.length > 0;
  const correct = placed.map((i) => ex.bank[i]).join('') === ex.answer.join('');

  const add = (i: number) => {
    if (done || placed.includes(i) || (spell && placed.length >= ex.answer.length)) return;
    sfx.tap();
    setPlaced((p) => [...p, i]);
  };
  const removeAt = (k: number) => {
    if (!done) setPlaced((p) => p.filter((_, j) => j !== k));
  };
  const check = () => {
    if (ready && !done) onSubmit(correct);
  };

  const live = useLatest({ add, check, placed });
  useEffect(() => {
    if (done) return;
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const { add, check, placed } = live.current;
      if (e.key === 'Enter') {
        if (e.repeat) return;
        e.preventDefault();
        check();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setPlaced((p) => p.slice(0, -1));
      } else if (e.key.length === 1) {
        // 英文拼字可以直接用鍵盤打
        const k = e.key.toLowerCase();
        const i = ex.bank.findIndex((t, j) => t.toLowerCase() === k && !placed.includes(j));
        if (i >= 0) add(i);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [ex, done, live]);

  const slots = spell ? ex.answer.length : placed.length;

  return (
    <div className="ex ex-tiles">
      <p className="ex-label">{ex.label}</p>
      <div className="ex-prompt">
        <Tx className="prompt-text" s={ex.prompt.s} lang={ex.prompt.lang} />
      </div>
      <div className={cx('slots', ex.mode, done && (correct ? 'right' : 'wrong'))}>
        {Array.from({ length: slots }, (_, k) =>
          k < placed.length ? (
            <button key={k} type="button" className="tile placed" onClick={() => removeAt(k)} disabled={done}>
              <Tx s={ex.bank[placed[k]]} lang={ex.lang} />
            </button>
          ) : (
            <span key={k} className="tile slot" />
          ),
        )}
        {!spell && placed.length === 0 && <span className="slots-hint">點選下方的字卡組成句子</span>}
      </div>
      <div className="bank">
        {ex.bank.map((t, i) => (
          <button key={i} type="button" className={cx('tile', placed.includes(i) && 'used')} disabled={done || placed.includes(i)} onClick={() => add(i)}>
            <Tx s={t} lang={ex.lang} />
          </button>
        ))}
      </div>
      {!done && (
        <button type="button" className="btn primary wide check" disabled={!ready} onClick={check}>
          檢查
        </button>
      )}
    </div>
  );
}

// ───────── 輸入題（羅馬拼音） ─────────

export function TypeView({ ex, done, onSubmit }: { ex: TypeEx; done: boolean; onSubmit: (correct: boolean) => void }) {
  const [v, setV] = useState('');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);
  const answer = v.trim().toLowerCase();
  return (
    <form
      className="ex ex-type"
      onSubmit={(e) => {
        e.preventDefault();
        if (answer && !done) onSubmit(ex.accept.includes(answer));
      }}
    >
      <p className="ex-label">{ex.label}</p>
      <div className="ex-prompt">
        <Tx className="prompt-text big" s={ex.prompt.s} lang={ex.prompt.lang} />
      </div>
      <input
        ref={input}
        className={cx('type-input', done && (ex.accept.includes(answer) ? 'right' : 'wrong'))}
        value={v}
        onChange={(e) => setV(e.target.value)}
        readOnly={done}
        placeholder={ex.prompt.lang === 'ko' ? '例如：ga' : '例如：ka'}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        lang="en"
        inputMode="text"
        aria-label="輸入羅馬拼音"
      />
      {!done && (
        <button type="submit" className="btn primary wide check" disabled={!answer}>
          檢查
        </button>
      )}
    </form>
  );
}

// ───────── 打字題（日文輸入法／韓文鍵盤） ─────────

export interface TypedResult {
  correct: boolean;
  typed: string;
  /** 看了提示、或第二次才打對 */
  helped: boolean;
  /** 寫法完全一致（日文：平假名／片假名也一樣；韓文：空格也一樣） */
  exact: boolean;
}

const TYPE_PLACEHOLDER = { ja: '用日文輸入法作答（假名、漢字都可以）', ko: '用韓文鍵盤作答' };

/**
 * 打字題可以打兩次：第一次打錯會說明差在哪裡、給第一個字的提示，再試一次；
 * 第二次還是錯（或按「看答案」）才算答錯，並在回饋裡教怎麼打。
 */
export function TypeWordView({
  ex,
  done,
  verdict,
  onSubmit,
  onFallback,
  onMute,
}: {
  ex: TypeWordEx;
  done: boolean;
  /** 批改結果（作答前為 null；自己改判後也會變成答對） */
  verdict: boolean | null;
  onSubmit: (r: TypedResult) => void;
  /** 現在不方便打字：改成選擇題 */
  onFallback: () => void;
  /** 現在不方便聽：聽打改成看中文打 */
  onMute?: () => void;
}) {
  const [v, setV] = useState('');
  const [hint, setHint] = useState(false);
  /** 第一次打錯後的說明 */
  const [miss, setMiss] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  // 輸入法選字中按的 Enter 是「確定選字」，不能當成送出。
  // Safari 會先結束選字再送出 Enter，所以剛結束選字的一瞬間也不算。
  const ime = useRef({ on: false, endedAt: 0 });

  useEffect(() => {
    input.current?.focus();
    if (ex.audio) speak(ex.audio.text, ex.audio.lang);
  }, [ex]);

  const norm = ex.lang === 'ja' ? normJa(v) : normKo(v);
  const ready = norm.length > 0;

  const submit = () => {
    const r = checkTyped(ex.lang, v, ex.answer);
    if (r.ok) {
      onSubmit({ correct: true, typed: v.trim(), helped: hint || !!miss, exact: r.exact });
      return;
    }
    if (!miss) {
      sfx.wrong();
      setMiss(diagnose(ex.lang, v, ex.answer) ?? '還不對。看看提示，再試一次！');
      setHint(true);
      input.current?.select();
      return;
    }
    onSubmit({ correct: false, typed: v.trim(), helped: true, exact: false });
  };

  return (
    <form
      className="ex ex-type ex-typeword"
      onSubmit={(e) => {
        e.preventDefault();
        if (done || !ready || ime.current.on || Date.now() - ime.current.endedAt < 80) return;
        submit();
      }}
    >
      <p className="ex-label">{ex.label}</p>
      <div className="ex-prompt">
        {ex.audio && (
          <div className="audio-prompt">
            <SpeakBtn text={ex.audio.text} lang={ex.audio.lang} size="lg" />
            <SpeakBtn text={ex.audio.text} lang={ex.audio.lang} slow />
          </div>
        )}
        {ex.audio && onMute && !done && (
          <button type="button" className="link-btn mute-btn" onClick={onMute}>
            🔇 現在不方便聽
          </button>
        )}
        {ex.prompt && <Tx className="prompt-text" s={ex.prompt.s} lang={ex.prompt.lang} />}
      </div>
      {miss && !done && (
        <p className="type-miss" role="alert">
          <b>差一點！</b> {miss}
        </p>
      )}
      {hint && !done && (
        <p className="type-hint" lang={ex.lang} aria-label="提示">
          {firstHint(ex.lang, ex.answer)}
        </p>
      )}
      <input
        ref={input}
        className={cx('type-input', ex.lang, verdict !== null && (verdict ? 'right' : 'wrong'), miss && !done && 'retry')}
        value={v}
        onChange={(e) => setV(e.target.value)}
        onCompositionStart={() => {
          ime.current.on = true;
        }}
        onCompositionEnd={() => {
          ime.current = { on: false, endedAt: Date.now() };
        }}
        readOnly={done}
        placeholder={TYPE_PLACEHOLDER[ex.lang]}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="done"
        lang={ex.lang}
        aria-label={ex.lang === 'ja' ? '輸入日文' : '輸入韓文'}
      />
      {!done && (
        <>
          <button type="submit" className="btn primary wide check" disabled={!ready}>
            {miss ? '再試一次' : '檢查'}
          </button>
          <div className="type-tools">
            {!hint ? (
              <button type="button" className="link-btn" onClick={() => setHint(true)}>
                💡 提示
              </button>
            ) : (
              <button type="button" className="link-btn" onClick={() => onSubmit({ correct: false, typed: v.trim(), helped: true, exact: false })}>
                🏳️ 看答案和打法
              </button>
            )}
            <button type="button" className="link-btn" onClick={() => setHelp(true)}>
              📖 怎麼打？
            </button>
            <button type="button" className="link-btn" onClick={onFallback}>
              ⌨️ 現在不方便打字
            </button>
          </div>
        </>
      )}
      {help && (
        <Modal className="typing-help-modal" onClose={() => setHelp(false)}>
          <TypingRules lang={ex.lang} compact />
          <div className="modal-actions">
            <button type="button" className="btn primary" onClick={() => setHelp(false)}>
              知道了
            </button>
          </div>
        </Modal>
      )}
    </form>
  );
}

/** 一個答案的打法：每個字要按哪些鍵，以及用到的特殊打法 */
export function KeyGuideView({ lang, answer }: { lang: 'ja' | 'ko'; answer: string }) {
  const g = keyGuide(lang, answer);
  if (!g.steps.length) return null;
  return (
    <div className="key-guide">
      <div className="kg-title">⌨️ 這樣打</div>
      <div className="kg-steps">
        {g.steps.map((st, i) => (
          <span key={i} className="kg-step">
            <b lang={lang}>{st.text}</b>
            {st.jamo && <i lang="ko">{st.jamo}</i>}
            <kbd>{st.keys}</kbd>
          </span>
        ))}
      </div>
      {!!g.tips.length && (
        <ul className="kg-tips">
          {g.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ───────── 配對題 ─────────

export function MatchView({ ex, onDone }: { ex: MatchEx; onDone: (wrongIds: string[]) => void }) {
  const order = useMemo(() => {
    const idx = ex.pairs.map((_, i) => i);
    return { left: shuffle(idx), right: shuffle(idx) };
  }, [ex]);
  const [sel, setSel] = useState<{ l: number | null; r: number | null }>({ l: null, r: null });
  const [matched, setMatched] = useState<number[]>([]);
  const [bad, setBad] = useState<{ l: number; r: number } | null>(null);
  const wrong = useRef(new Set<string>());
  const finish = useLatest(onDone);

  const pick = (side: 'l' | 'r', i: number) => {
    if (bad || matched.includes(i)) return;
    const next = { ...sel, [side]: sel[side] === i ? null : i };
    if (next.l === null || next.r === null) {
      sfx.tap();
      setSel(next);
      return;
    }
    const { l, r } = next;
    if (l === r) {
      sfx.pop();
      const m = [...matched, l];
      setMatched(m);
      setSel({ l: null, r: null });
      if (m.length === ex.pairs.length) setTimeout(() => finish.current([...wrong.current]), 420);
    } else {
      sfx.wrong();
      wrong.current.add(ex.pairs[l].itemId);
      wrong.current.add(ex.pairs[r].itemId);
      setBad({ l, r });
      setSel({ l: null, r: null });
      setTimeout(() => setBad(null), 480);
    }
  };

  const cell = (side: 'l' | 'r', i: number) => {
    const t = side === 'l' ? ex.pairs[i].a : ex.pairs[i].b;
    return (
      <button
        key={side + i}
        type="button"
        className={cx('match-card', matched.includes(i) && 'matched', sel[side] === i && 'sel', bad?.[side] === i && 'bad')}
        disabled={matched.includes(i)}
        onClick={() => pick(side, i)}
      >
        <Tx s={t.s} lang={t.lang} />
      </button>
    );
  };

  return (
    <div className="ex ex-match">
      <p className="ex-label">{ex.label}</p>
      <div className="match-grid">
        <div className="match-col">{order.left.map((i) => cell('l', i))}</div>
        <div className="match-col">{order.right.map((i) => cell('r', i))}</div>
      </div>
    </div>
  );
}

// ───────── 教學卡 ─────────

export function TeachView({ ex, lang, autoSpeak }: { ex: TeachEx; lang: LangId; autoSpeak: boolean }) {
  const { item } = ex;
  useEffect(() => {
    if (autoSpeak) speak(isVocab(item) ? sayOf(item, lang) : item.s, lang);
  }, [item, lang, autoSpeak]);
  const tag = item.kind === 'char' ? '新字母' : item.kind === 'sentence' ? '例句' : item.kind === 'phrase' ? '新句子' : '新單字';
  const pic = isVocab(item) && item.kind !== 'char' ? pictureOf(item.m) : undefined;
  return (
    <div className="ex ex-teach">
      <span className="teach-tag">{tag}</span>
      {pic && (
        <div className="teach-pic">
          <PictureArt id={pic} size={110} />
        </div>
      )}
      <ItemCard item={item} lang={lang} big />
    </div>
  );
}

export function NoteView({ ex, lang }: { ex: NoteEx; lang: LangId }) {
  const { note } = ex;
  return (
    <div className="ex ex-note">
      <span className="teach-tag">{ex.tag ?? '文法重點'}</span>
      <h2>
        <Ruby s={note.title} />
      </h2>
      <ul className="note-body">
        {note.body.map((b, i) => (
          <li key={i}>
            <Ruby s={b} />
          </li>
        ))}
      </ul>
      {!!note.examples?.length && (
        <div className="note-examples">
          {note.examples.map((e, i) => (
            <div key={i} className="note-ex">
              <div>
                <Tx s={e.furi ?? e.s} lang={lang} />
                <SpeakBtn text={e.s} lang={lang} size="sm" />
              </div>
              <small>{e.t}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
