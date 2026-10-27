// 排七：和三位電腦（Emma、さくら、민준）一起接龍。規則在 engine/sevens.ts。
// 學語言的玩法：你每出一張牌都要先答對一題（學過的字），答錯這回合就跳過；沒牌能接時要蓋牌（罰分）。
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Hand, PlayingCard, Seats } from '../components/CardTable';
import { ResultScreen, type ResultData } from '../components/Result';
import { Modal } from '../components/ui';
import { QuizPanel, randomQuiz, useWords, wordsOk, type Quiz } from '../components/WordQuiz';
import { META } from '../content';
import { learnedVocab, UNLOCK } from '../core/progress';
import { sfx } from '../core/sfx';
import { finishGame, getSave, recordAnswer, useSave, type Part } from '../core/store';
import type { LangId } from '../core/types';
import { cx } from '../core/util';
import { cardKey, cardName, RANK_LABEL, SEATS, SUIT_SYMBOL, SUITS, type Card } from '../engine/cards';
import * as S from '../engine/sevens';
import { nav } from '../router';
import { Blocked } from './Practice';

const LEVELS: [S.SevensLevel, string, string][] = [
  ['easy', '簡單', '電腦隨便出牌，答題 20 秒'],
  ['normal', '普通', '電腦會留牌卡人，答題 15 秒'],
  ['hard', '困難', '電腦很會卡牌，答題 10 秒'],
];
const SECONDS: Record<S.SevensLevel, number> = { easy: 20, normal: 15, hard: 10 };
const WIN_COINS: Record<S.SevensLevel, number> = { easy: 10, normal: 15, hard: 25 };
const RANK_XP = [15, 8, 4, 2];

export function SevensPage({ lang }: { lang: LangId }) {
  const n = learnedVocab(getSave(), lang).filter(wordsOk).length;
  if (n < UNLOCK.sevens) {
    return (
      <Blocked lang={lang} icon="🂧" title="排七尚未解鎖" back={`/l/${lang}/arcade`}>
        學會 {UNLOCK.sevens} 個單字或短句之後就能開桌（目前 {n} 個）。每出一張牌都要先答對一個你學過的字。
      </Blocked>
    );
  }
  return <SevensGame lang={lang} />;
}

export function SevensRules() {
  return (
    <ul className="rules">
      <li>四個人各拿 13 張，拿到 ♠7 的人先出，第一張一定是 ♠7。</li>
      <li>每種花色都從 7 開始：往下接 6、5…A，往上接 8、9…K；其他花色可以出 7 開新的一排。</li>
      <li>有牌能接就一定要出。完全沒有牌能接時，要選一張牌<b>蓋起來</b>，蓋掉的點數就是罰分（A＝1、J＝11、Q＝12、K＝13）。</li>
      <li>全部的牌出完或蓋完時結算，<b>罰分最少的人第一名</b>。</li>
      <li>學語言規則：你每出一張牌前要先答對一題，答錯這回合就跳過（牌還在手上）。</li>
    </ul>
  );
}

function SevensGame({ lang }: { lang: LangId }) {
  const s = useSave();
  const words = useWords(lang);
  const back = `/l/${lang}/arcade`;
  const [level, setLevel] = useState<S.SevensLevel>('normal');
  const [st, setSt] = useState<S.SevensState | null>(null);
  const [quiz, setQuiz] = useState<(Quiz & { card: Card }) | null>(null);
  const [score, setScore] = useState({ correct: 0, answered: 0, streak: 0 });
  const [coverSel, setCoverSel] = useState<Card | null>(null);
  const [shake, setShake] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [rules, setRules] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const recent = useRef<string[]>([]);

  const begin = () => {
    sfx.tap();
    setSt(S.newSevens(Math.random));
    setScore({ correct: 0, answered: 0, streak: 0 });
    setMsg('');
    setCoverSel(null);
    setResult(null);
  };

  const apply = (fn: (d: S.SevensState) => void) =>
    setSt((cur) => {
      if (!cur) return cur;
      const d = structuredClone(cur);
      fn(d);
      return d;
    });

  // 電腦的回合：停一下再出牌，看得清楚誰出了什麼
  useEffect(() => {
    if (!st || st.done || st.turn === 0 || quiz) return;
    const t = setTimeout(() => {
      sfx.tap();
      apply((d) => {
        if (d.done || d.turn === 0) return;
        const m = S.aiMove(d, d.turn, level, Math.random);
        if (m.kind === 'play') S.play(d, d.turn, m.card);
        else S.cover(d, d.turn, m.card);
      });
    }, 700);
    return () => clearTimeout(t);
  }, [st, quiz, level]);

  // 又輪到自己時，清掉上一輪的提示訊息
  const turn = st?.turn;
  useEffect(() => {
    if (turn === 0) setMsg('');
  }, [turn]);

  // 結算
  useEffect(() => {
    if (!st?.done || result) return;
    const res = S.results(st);
    const me = res.find((r) => r.p === 0)!;
    const win = me.rank === 0;
    if (win) sfx.complete();
    else sfx.fail();
    const parts: Part[] = [
      ['答對出牌', score.correct],
      [`第 ${me.rank + 1} 名`, RANK_XP[me.rank]],
    ];
    setResult({
      emoji: win ? '🏆' : '🂧',
      headline: win ? '排七第一名！' : `第 ${me.rank + 1} 名`,
      sub: win ? '牌卡得剛剛好，單字也答得漂亮！' : '下一局試著把 A、K 這種大點數的牌早點鋪路，就不會被迫蓋掉。',
      outcome: finishGame({ lang, game: 'sevens', parts, coins: win ? WIN_COINS[level] : 0, win }),
      lines: [
        ...res.map((r): [string, string] => [`${['🥇', '🥈', '🥉', '4️⃣'][r.rank]} ${SEATS[r.p]}・蓋 ${st.covered[r.p].length} 張`, `罰 ${r.points} 分`]),
        [`答對率（${score.correct} / ${score.answered}）`, `${score.answered ? Math.round((score.correct / score.answered) * 100) : 0}%`],
      ],
      back,
      backLabel: '回到遊樂場',
      again: { label: '再玩一局', run: () => setResult(null) },
    });
    setSt(null);
  }, [st, result, score, level, lang, back]);

  if (result) return <ResultScreen data={result} lang={lang} />;

  if (!st) {
    return (
      <div className="game-page cards-start" style={{ '--lang': META[lang].color } as CSSProperties}>
        <header className="session-top">
          <button type="button" className="icon-btn" aria-label="離開" onClick={() => nav(back)}>
            ✕
          </button>
          <div className="session-progress">
            <small>排七</small>
          </div>
        </header>
        <main className="session-body">
          <section className="card cards-intro">
            <div className="cards-hero" aria-hidden>
              {[6, 7, 8].map((r) => (
                <PlayingCard key={r} c={{ s: r === 7 ? 'S' : 'H', r }} />
              ))}
            </div>
            <h1>排七</h1>
            <p className="muted">和 Emma、さくら、민준 一起接龍。每出一張牌前要先答對一個你學過的字。</p>
            <SevensRules />
            <div className="seg small level-pick" role="radiogroup" aria-label="難度">
              {LEVELS.map(([id, name, desc]) => (
                <button key={id} type="button" role="radio" aria-checked={level === id} className={cx(level === id && 'on')} onClick={() => setLevel(id)}>
                  {name}
                  <small>{desc}</small>
                </button>
              ))}
            </div>
            <p className="muted small">
              已玩 {s.stats.sevens} 局・第一名 {s.stats.sevensWins} 次
            </p>
            <button type="button" className="btn primary wide" onClick={begin}>
              開始發牌
            </button>
          </section>
        </main>
      </div>
    );
  }

  const myTurn = !st.done && st.turn === 0;
  const playable = new Set(myTurn ? S.playable(st, 0).map(cardKey) : []);
  const mustCover = myTurn && playable.size === 0;
  const hand = S.sortHand(st.hands[0]);
  const last = (p: number) => [...st.log].reverse().find((m) => m.p === p);

  const onCard = (c: Card) => {
    if (!myTurn || quiz) return;
    if (mustCover) {
      setCoverSel(c);
      return;
    }
    if (!playable.has(cardKey(c))) {
      setShake(cardKey(c));
      setTimeout(() => setShake(null), 400);
      setMsg(st.started ? '這張現在接不上，發光的牌才能出' : '第一張一定要出 ♠7');
      sfx.wrong();
      return;
    }
    const q = randomQuiz(words, lang, recent.current, SECONDS[level]);
    if (!q) return;
    sfx.tap();
    setMsg('');
    setQuiz({ ...q, card: c });
  };

  const pick = (i: number) => {
    if (!quiz || quiz.picked !== undefined) return;
    const ok = i === quiz.ex.answer;
    if (ok) sfx.correct(score.streak);
    else sfx.wrong();
    recordAnswer(quiz.item.id, ok, 'game');
    setScore((x) => ({ correct: x.correct + (ok ? 1 : 0), answered: x.answered + 1, streak: ok ? x.streak + 1 : 0 }));
    setQuiz({ ...quiz, picked: i });
  };

  const resolve = () => {
    const q = quiz;
    if (!q || q.picked === undefined) return;
    setQuiz(null);
    recent.current = [q.item.id, ...recent.current].slice(0, 12);
    const ok = q.picked === q.ex.answer;
    apply((d) => (ok ? S.play(d, 0, q.card) : S.skip(d, 0)));
    setMsg(ok ? '' : '答錯了，這回合跳過');
  };

  const doCover = () => {
    if (!coverSel || !mustCover) return;
    sfx.tap();
    const c = coverSel;
    setCoverSel(null);
    apply((d) => S.cover(d, 0, c));
    setMsg(`蓋掉了 ${cardName(c)}（罰 ${c.r} 分）`);
  };

  const status = myTurn
    ? mustCover
      ? '沒有牌能接：選一張牌蓋起來（點數就是罰分，挑小的蓋）'
      : st.started
        ? '輪到你：點一張發光的牌出牌（要先答題）'
        : '你拿到 ♠7，先出 ♠7 開局'
    : `${SEATS[st.turn]} 思考中…`;

  return (
    <div className="game-page cards-game sevens" style={{ '--lang': META[lang].color } as CSSProperties}>
      <header className="session-top">
        <button type="button" className="icon-btn" aria-label="離開這一局" onClick={() => nav(back)}>
          ✕
        </button>
        <div className="session-progress">
          <small>
            排七・{LEVELS.find((l) => l[0] === level)![1]}・答對 {score.correct} / {score.answered}
          </small>
        </div>
        <button type="button" className="icon-btn" aria-label="規則" title="規則" onClick={() => setRules(true)}>
          ？
        </button>
      </header>
      <main className="session-body cards-body">
        <Seats
          counts={st.hands.map((h) => h.length)}
          turn={st.turn}
          sub={(p) => (st.covered[p].length ? `・蓋 ${st.covered[p].length}` : '')}
          note={(p) => {
            const m = last(p);
            if (!m) return null;
            return m.kind === 'play' && m.card ? `${SUIT_SYMBOL[m.card.s]}${RANK_LABEL[m.card.r]}` : m.kind === 'cover' ? '蓋牌' : '跳過';
          }}
        />
        <div className="sv-board" aria-label="牌桌">
          {SUITS.map((suit) => {
            const row = st.rows[suit];
            return (
              <div key={suit} className={cx('sv-row', (suit === 'H' || suit === 'D') && 'red')}>
                <span className="sv-suit">{SUIT_SYMBOL[suit]}</span>
                <div className="sv-slots">
                  {Array.from({ length: 13 }, (_, i) => {
                    const r = i + 1;
                    const on = !!row && r >= row[0] && r <= row[1];
                    const next = row ? r === row[0] - 1 || r === row[1] + 1 : st.started && r === 7;
                    return (
                      <span key={r} className={cx('sv-slot', on && 'on', next && 'next', r === 7 && 'seven')}>
                        {RANK_LABEL[r]}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="cards-note" role="status">
          <p className={cx('cards-status', myTurn && 'mine')}>{status}</p>
          <p className="cards-msg">{msg}</p>
        </div>
        <Hand cards={hand} playable={myTurn && !mustCover ? playable : undefined} selected={coverSel ? new Set([cardKey(coverSel)]) : undefined} shake={shake} onPick={onCard} />
        <div className="cards-actions">
          {mustCover && (
            <button type="button" className="btn primary" disabled={!coverSel} onClick={doCover}>
              {coverSel ? `蓋掉 ${SUIT_SYMBOL[coverSel.s]}${RANK_LABEL[coverSel.r]}（罰 ${coverSel.r} 分）` : '先選一張要蓋的牌'}
            </button>
          )}
          <small className="muted">我蓋了 {st.covered[0].length} 張・罰 {S.penalty(st.covered[0])} 分</small>
        </div>
      </main>

      {quiz && (
        <div className="dquiz-wrap">
          <QuizPanel
            quiz={quiz}
            lang={lang}
            onPick={pick}
            onDone={resolve}
            title={
              <span className="dquiz-title">
                答對就出 {SUIT_SYMBOL[quiz.card.s]}
                {RANK_LABEL[quiz.card.r]}
              </span>
            }
          />
        </div>
      )}
      {rules && (
        <Modal className="cards-rules" onClose={() => setRules(false)}>
          <h2>排七規則</h2>
          <SevensRules />
          <div className="modal-actions">
            <button type="button" className="btn primary" onClick={() => setRules(false)}>
              知道了
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
