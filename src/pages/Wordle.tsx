// 猜詞（類似 Wordle）：六次機會猜出一個字，規則在 engine/wordle.ts。
// 練習模式從學過的字出題；每日猜詞從整個課程出題（同一天每個人都一樣）。
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ResultScreen, type ResultData } from '../components/Result';
import { ExampleBox, SpeakBtn, Tx } from '../components/ui';
import { courseIndex, META } from '../content';
import { today } from '../core/date';
import { learnedVocab, UNLOCK } from '../core/progress';
import { pick } from '../core/rng';
import { sfx } from '../core/sfx';
import { finishGame, getSave, recordAnswer, useSave } from '../core/store';
import type { LangId, VocabItem } from '../core/types';
import { cx } from '../core/util';
import { headOf, isVocab, sayOf } from '../engine/exercises';
import { toHiragana } from '../engine/furigana';
import { KO_KEYS } from '../engine/typing';
import * as W from '../engine/wordle';
import { nav } from '../router';
import { Blocked } from './Practice';

const KO_BY_KEY: Record<string, string> = Object.fromEntries(Object.entries(KO_KEYS).map(([j, k]) => [k, j]));

/** 這次的題目 */
function pickTarget(lang: LangId, daily: boolean, recent: string[]): { item: VocabItem; learned: boolean } | null {
  const s = getSave();
  const all = W.wordlePool([...courseIndex(lang).items.values()].map((x) => x.item).filter(isVocab), lang);
  if (daily) {
    const item = W.dailyPick(all, today(), lang);
    return item ? { item, learned: !!s.items[item.id] } : null;
  }
  const mine = W.wordlePool(learnedVocab(s, lang), lang);
  const pool = mine.length >= 5 ? mine : all;
  const fresh = pool.filter((i) => !recent.includes(i.id));
  const item = pick(fresh.length ? fresh : pool);
  return item ? { item, learned: !!s.items[item.id] } : null;
}

export function WordlePage({ lang, daily }: { lang: LangId; daily: boolean }) {
  const n = learnedVocab(getSave(), lang).filter((i) => i.kind !== 'char').length;
  const [run, setRun] = useState(0);
  const recent = useRef<string[]>([]);
  if (n < UNLOCK.wordle) {
    return (
      <Blocked lang={lang} icon="🔠" title="猜詞尚未解鎖" back={`/l/${lang}/arcade`}>
        學會 {UNLOCK.wordle} 個單字之後就能開始。
      </Blocked>
    );
  }
  return <Game key={run} lang={lang} daily={daily} recent={recent.current} onAgain={() => setRun((x) => x + 1)} />;
}

function Game({ lang, daily, recent, onAgain }: { lang: LangId; daily: boolean; recent: string[]; onAgain: () => void }) {
  const s = useSave();
  const back = `/l/${lang}/arcade`;
  const [target] = useState(() => pickTarget(lang, daily, recent));
  const answer = useMemo(() => (target ? W.tilesOf(target.item, lang)! : []), [target, lang]);
  const len = W.WORD_LEN[lang];
  const [rows, setRows] = useState<string[][]>([]);
  const [marks, setMarks] = useState<W.Mark[][]>([]);
  const [cur, setCur] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState<'win' | 'lose' | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [shakeRow, setShakeRow] = useState(false);
  const [ime, setIme] = useState('');
  const doneToday = daily && !!s.days[today()]?.dailyWordle?.[lang];

  useEffect(() => {
    if (target && !recent.includes(target.item.id)) recent.unshift(target.item.id);
    recent.splice(12);
  }, [target, recent]);

  const keys = useMemo(() => W.keyMarks(rows, marks), [rows, marks]);

  const submit = (guess: string[] = cur) => {
    if (done) return;
    if (guess.length !== len) {
      setMsg(`要剛好 ${len} 個${lang === 'en' ? '字母' : lang === 'ja' ? '假名' : '字母'}`);
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 400);
      sfx.wrong();
      return;
    }
    const m = W.score(guess, answer);
    const nextRows = [...rows, guess];
    setRows(nextRows);
    setMarks([...marks, m]);
    setCur([]);
    setMsg('');
    if (m.every((x) => x === 'hit')) {
      setDone('win');
      sfx.complete();
      if (target!.learned) recordAnswer(target!.item.id, true, 'game');
    } else if (nextRows.length >= W.TRIES) {
      setDone('lose');
      sfx.fail();
      if (target!.learned) recordAnswer(target!.item.id, false, 'game');
    } else {
      sfx.tap();
    }
  };

  const press = (k: string) => {
    if (done) return;
    if (k === 'enter') return submit();
    if (k === 'back') return setCur((c) => c.slice(0, -1));
    setCur((c) => (c.length < len ? [...c, k] : c));
    sfx.tap();
  };

  // 實體鍵盤：英文字母、韓文兩組式配置；日文請用下面的輸入框
  const live = useRef(press);
  live.current = press;
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.('input, textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter') live.current('enter');
      else if (e.key === 'Backspace') live.current('back');
      else {
        const k = W.keyFromEvent(e.key, lang, KO_BY_KEY);
        if (k) live.current(k);
        else return;
      }
      e.preventDefault();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lang]);

  const finish = () => {
    if (!target) return;
    const solved = done === 'win';
    const xp = W.wordleXp(rows.length, solved, hint);
    setResult({
      emoji: solved ? '🔠' : '🤔',
      headline: !solved ? '這次沒猜到' : rows.length <= 3 ? `${rows.length} 次就猜中了！` : `猜中了！（${rows.length} 次）`,
      sub: daily ? (solved ? '每日猜詞完成！明天還有新的題目。' : '明天再挑戰新的題目吧。') : undefined,
      outcome: finishGame({ lang, game: 'wordle', parts: [[solved ? '猜中' : '挑戰猜詞', xp]], daily, win: solved }),
      lines: [
        ['答案', target.item.w],
        ['意思', target.item.m],
        ['猜了', `${rows.length} 次`],
      ],
      back,
      backLabel: '回到遊樂場',
      again: daily ? undefined : { label: '再猜一題', run: onAgain },
      next: daily ? { label: '去玩練習模式', to: `/l/${lang}/play/wordle` } : undefined,
    });
  };

  if (result) return <ResultScreen data={result} lang={lang} />;
  if (!target) {
    return (
      <Blocked lang={lang} icon="🔠" title="找不到適合的題目" back={back}>
        再多學一些單字之後就能玩。
      </Blocked>
    );
  }

  const shownRows = Array.from({ length: W.TRIES }, (_, r) => (r < rows.length ? rows[r] : r === rows.length ? cur : []));
  const it = target.item;

  return (
    <div className="game-page wordle" style={{ '--lang': META[lang].color } as CSSProperties}>
      <header className="session-top">
        <button type="button" className="icon-btn" aria-label="離開" onClick={() => nav(back)}>
          ✕
        </button>
        <div className="session-progress">
          <small>
            {daily ? `每日猜詞・${today()}` : '猜詞・練習'}・{len} 個{lang === 'ja' ? '假名' : '字母'}
          </small>
          <div className="bar">
            <i style={{ width: `${(rows.length / W.TRIES) * 100}%`, background: 'var(--lang)' }} />
          </div>
        </div>
        <div className="combo on">
          {rows.length} / {W.TRIES}
        </div>
      </header>
      <main className="session-body wordle-body">
        {doneToday && !done && rows.length === 0 && <p className="chip ok wordle-note">今天的每日猜詞已經完成了，這次只算練習。</p>}
        <p className="ex-label">
          {lang === 'en' ? '猜一個 5 個字母的英文單字' : lang === 'ja' ? '猜一個 4 個假名的日文單字（用讀音猜，小字、長音也算一格）' : '猜一個韓文單字：拆成 6 個字母（子音、母音）'}
          {!target.learned && <small className="muted">（題目可能是還沒學過的字）</small>}
        </p>
        <div className={cx('wgrid', `len-${len}`)}>
          {shownRows.map((row, r) => (
            <div key={r} className={cx('wrow', r === rows.length && shakeRow && 'shake')}>
              {Array.from({ length: len }, (_, i) => {
                const m = marks[r]?.[i];
                return (
                  <span key={i} className={cx('wtile', m, row[i] && 'filled')} style={{ animationDelay: m ? `${i * 0.12}s` : undefined } as CSSProperties} lang={lang}>
                    {row[i] ?? ''}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        {msg && <p className="wordle-msg">{msg}</p>}

        {!done ? (
          <>
            <div className="wordle-tools">
              {hint ? (
                <span className="chip">💡 意思：{it.m}</span>
              ) : (
                <button type="button" className="link-btn" onClick={() => setHint(true)}>
                  💡 看中文意思（獎勵少一點）
                </button>
              )}
            </div>
            {lang === 'ja' && (
              <form
                className="wordle-ime"
                onSubmit={(e) => {
                  e.preventDefault();
                  const t = Array.from(toHiragana(ime.trim()));
                  setIme('');
                  if (t.length === len) submit(t);
                  else setMsg(`請輸入剛好 ${len} 個假名（例如：がっこう）`);
                }}
              >
                <input value={ime} onChange={(e) => setIme(e.target.value)} placeholder="也可以用日文輸入法打假名，按 Enter 送出" lang="ja" />
              </form>
            )}
            <Keyboard lang={lang} marks={keys} onKey={press} />
          </>
        ) : (
          <section className={cx('card wordle-reveal', done)}>
            <b className="wordle-answer">
              <Tx s={headOf(it)} lang={lang} />
              <SpeakBtn text={sayOf(it, lang)} lang={lang} />
            </b>
            <p>
              {done === 'win' ? '猜中了！' : '答案是這個字。'}
              {it.m}
              {it.pos && <small className="muted">（{it.pos}）</small>}
            </p>
            {it.ex && <ExampleBox item={it} lang={lang} />}
            <button type="button" className="btn primary wide" onClick={finish}>
              領取獎勵
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

function Keyboard({ lang, marks, onKey }: { lang: LangId; marks: Map<string, W.Mark>; onKey: (k: string) => void }) {
  const key = (k: string) => (
    <button key={k} type="button" className={cx('wkey', marks.get(k))} onClick={() => onKey(k)} lang={lang}>
      {k}
    </button>
  );
  const ctl = (
    <div className="wkeys-ctl">
      <button type="button" className="wkey wide" onClick={() => onKey('back')}>
        ⌫ 刪除
      </button>
      <button type="button" className="wkey wide primary" onClick={() => onKey('enter')}>
        送出 ⏎
      </button>
    </div>
  );
  if (lang === 'ja') {
    return (
      <div className="wkeys ja">
        <div className="wkana">{W.JA_KEYS.slice(0, 10).flatMap((col) => col.map(key))}</div>
        <div className="wkana small">{W.JA_KEYS.slice(10).flatMap((col) => col.map(key))}</div>
        {ctl}
      </div>
    );
  }
  const rows = lang === 'en' ? W.EN_ROWS : W.KO_ROWS;
  return (
    <div className={cx('wkeys', lang)}>
      {rows.map((r, i) => (
        <div key={i} className="wkeys-row">
          {r.map(key)}
        </div>
      ))}
      {ctl}
    </div>
  );
}
