// 遊戲裡的「出牌前答題」：從學過的字出四選一（看字選意思、看意思選字、日文漢字考讀音），有倒數計時。
// 單字卡牌對決、排七、大老二共用。
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { courseIndex } from '../content';
import { learnedVocab } from '../core/progress';
import { sample } from '../core/rng';
import { getSave } from '../core/store';
import type { LangId, VocabItem } from '../core/types';
import { cx } from '../core/util';
import { headOf, isVocab, readingEx, recall, recog, sayOf, type ChoiceEx } from '../engine/exercises';
import { hasKanji } from '../engine/furigana';
import { ctxOf } from '../pages/Practice';
import { SpeakBtn, Tx } from './ui';

export interface Words {
  ids: string[];
  get: (id: string) => VocabItem | undefined;
  pool: (i: VocabItem) => VocabItem[];
}

export const wordsOk = (i: VocabItem) => i.kind !== 'char';

export function useWords(lang: LangId): Words {
  return useMemo(() => {
    const idx = courseIndex(lang).items;
    const learned = learnedVocab(getSave(), lang).filter(wordsOk);
    const byId = new Map(learned.map((i) => [i.id, i]));
    return {
      ids: learned.map((i) => i.id),
      get: (id: string) => byId.get(id) ?? (idx.get(id)?.item as VocabItem | undefined),
      pool: (i: VocabItem) => {
        const same = (idx.get(i.id)?.unit.items ?? []).filter(isVocab).filter(wordsOk);
        return same.length >= 8 ? same : [...same, ...sample(learned, 24)];
      },
    };
  }, [lang]);
}

export type QMode = 'w2m' | 'm2w' | 'read';

export function buildQuiz(mode: QMode, item: VocabItem, pool: VocabItem[], lang: LangId): ChoiceEx {
  const ctx = { ...ctxOf(lang), typing: false };
  if (mode === 'read') return readingEx(item, pool, ctx) ?? recog(item, pool, ctx);
  return mode === 'm2w' ? recall(item, pool, ctx) : recog(item, pool, ctx);
}

export interface Quiz {
  uid: number;
  target?: number;
  ex: ChoiceEx;
  item: VocabItem;
  seconds: number;
  started: number;
  picked?: number;
}

export function QuizPanel({ quiz, lang, title, onPick, onDone }: { quiz: Quiz; lang: LangId; title: ReactNode; onPick: (i: number) => void; onDone: () => void }) {
  const [now, setNow] = useState(Date.now());
  const answered = quiz.picked !== undefined;
  const left = Math.max(0, quiz.seconds * 1000 - (now - quiz.started));
  // 父層重新渲染時 callback 會換新的：用 ref 拿最新的，計時器才不會被重設
  const cb = useRef({ onPick, onDone });
  cb.current = { onPick, onDone };
  useEffect(() => {
    if (answered) return;
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, [answered]);
  useEffect(() => {
    if (!answered && left <= 0) cb.current.onPick(-1);
  }, [answered, left]);
  const correct = quiz.picked === quiz.ex.answer;
  // 答對很快繼續，答錯多停一下讓你看正解
  useEffect(() => {
    if (!answered) return;
    const t = setTimeout(() => cb.current.onDone(), correct ? 900 : 2400);
    return () => clearTimeout(t);
  }, [answered, correct]);

  return (
    <div className="dquiz card">
      <div className="dquiz-head">
        {title}
        <div className="dquiz-time">
          <i style={{ width: `${(left / (quiz.seconds * 1000)) * 100}%` }} className={cx(left < 3000 && 'low')} />
        </div>
      </div>
      <p className="ex-label">{quiz.ex.label}</p>
      {quiz.ex.prompt && (
        <div className={cx('dquiz-prompt', quiz.ex.big && 'big')}>
          <Tx s={quiz.ex.prompt.s} lang={quiz.ex.prompt.lang} />
        </div>
      )}
      <div className="dquiz-opts">
        {quiz.ex.options.map((o, i) => (
          <button
            key={i}
            type="button"
            className={cx('opt', answered && i === quiz.ex.answer && 'right', answered && i === quiz.picked && i !== quiz.ex.answer && 'wrong')}
            disabled={answered}
            onClick={() => {
              // 剛跳出來的 0.3 秒內不收答案：避免點牌時連點到選項
              if (Date.now() - quiz.started > 300) onPick(i);
            }}
          >
            <Tx s={o.s} lang={o.lang} />
          </button>
        ))}
      </div>
      {answered && (
        <div className={cx('dquiz-reveal', correct ? 'ok' : 'bad')}>
          <b>{correct ? '答對了！' : quiz.picked === -1 ? '時間到！' : '答錯了'}</b>
          <span>
            <Tx s={headOf(quiz.item)} lang={lang} />　{quiz.item.m}
          </span>
          <SpeakBtn text={sayOf(quiz.item, lang)} lang={lang} size="sm" />
          <button type="button" className="link-btn" onClick={onDone}>
            繼續 →
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * 隨機出一題（避開最近出過的字）：看字選意思、看意思選字輪流出，
 * 日文有漢字的字有時考讀音。牌類遊戲每次出牌前用。
 */
export function randomQuiz(words: Words, lang: LangId, recent: string[], seconds: number, uid = 0): Quiz | null {
  const fresh = words.ids.filter((id) => !recent.includes(id));
  const id = sample(fresh.length ? fresh : words.ids, 1)[0];
  const item = id ? words.get(id) : undefined;
  if (!item) return null;
  const r = Math.random();
  const mode: QMode = lang === 'ja' && item.kind === 'word' && item.r && hasKanji(item.w) && r < 0.25 ? 'read' : r < 0.62 ? 'w2m' : 'm2w';
  return { uid, ex: buildQuiz(mode, item, words.pool(item), lang), item, seconds, started: Date.now() };
}
