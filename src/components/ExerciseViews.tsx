// 各種題型的畫面。只負責互動，對錯回報給外層的 Session。
import { useEffect, useMemo, useRef, useState } from 'react';
import { shuffle } from '../core/rng';
import { sfx } from '../core/sfx';
import { speak } from '../core/tts';
import type { LangId } from '../core/types';
import { cx } from '../core/util';
import type { ChoiceEx, MatchEx, NoteEx, TeachEx, TilesEx, TypeEx } from '../engine/exercises';
import { isVocab, sayOf } from '../engine/exercises';
import { ClozeText, ItemCard, Ruby, SpeakBtn, Tx } from './ui';

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
}: {
  ex: ChoiceEx;
  done: boolean;
  picked: number | null;
  onPick: (i: number) => void;
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
  // 選項比較長、或只有三個選項時排成一欄，兩欄會參差不齊
  const long = ex.options.length === 3 || ex.options.some((o) => o.s.length > 14);

  return (
    <div className="ex ex-choice">
      <p className="ex-label">{ex.label}</p>
      <div className="ex-prompt">
        {ex.audio && (
          <div className="audio-prompt">
            <SpeakBtn text={ex.audio.text} lang={ex.audio.lang} size="lg" />
            <SpeakBtn text={ex.audio.text} lang={ex.audio.lang} slow />
          </div>
        )}
        {ex.prompt && ex.mode === 'cloze' ? (
          <div className="prompt-text">
            <ClozeText q={ex.prompt.s} lang={ex.prompt.lang as LangId} fill={done ? ex.options[ex.answer].s : null} />
          </div>
        ) : (
          showPrompt && ex.prompt && <Tx className={cx('prompt-text', ex.big && 'big')} s={ex.prompt.s} lang={ex.prompt.lang} />
        )}
      </div>
      <div className={cx('options', long && 'list')}>
        {ex.options.map((o, i) => (
          <button
            key={i}
            type="button"
            className={cx('opt', done && i === ex.answer && 'right', done && picked === i && i !== ex.answer && 'wrong')}
            disabled={done}
            onClick={() => onPick(i)}
          >
            <kbd>{i + 1}</kbd>
            <Tx s={o.s} lang={o.lang} />
          </button>
        ))}
      </div>
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
        placeholder="例如：ka"
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
  return (
    <div className="ex ex-teach">
      <span className="teach-tag">{tag}</span>
      <ItemCard item={item} lang={lang} big />
    </div>
  );
}

export function NoteView({ ex, lang }: { ex: NoteEx; lang: LangId }) {
  const { note } = ex;
  return (
    <div className="ex ex-note">
      <span className="teach-tag">文法重點</span>
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
