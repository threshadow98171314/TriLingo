// 大老二：和三位電腦（Emma、さくら、민준）比誰先出完。規則在 engine/bigtwo.ts。
// 學語言的玩法：你每次出牌前要先答對一題（學過的字）；跟牌時答錯就算過，自己起手時答錯只能出最小的一張。
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
import * as B from '../engine/bigtwo';
import { cardKey, SEATS, SUITS, type Card } from '../engine/cards';
import { nav } from '../router';
import { Blocked } from './Practice';

const LEVELS: [B.BigTwoLevel, string, string][] = [
  ['easy', '簡單', '電腦常常亂出、會放水，答題 20 秒'],
  ['normal', '普通', '電腦會留大牌、不拆對子，答題 15 秒'],
  ['hard', '困難', '電腦會先出五張、有人快出完就用大牌擋，答題 10 秒'],
];
const SECONDS: Record<B.BigTwoLevel, number> = { easy: 20, normal: 15, hard: 10 };
const WIN_COINS: Record<B.BigTwoLevel, number> = { easy: 15, normal: 20, hard: 30 };
const RANK_XP = [20, 10, 5, 2];

export function BigTwoPage({ lang }: { lang: LangId }) {
  const n = learnedVocab(getSave(), lang).filter(wordsOk).length;
  if (n < UNLOCK.bigtwo) {
    return (
      <Blocked lang={lang} icon="🂢" title="大老二尚未解鎖" back={`/l/${lang}/arcade`}>
        學會 {UNLOCK.bigtwo} 個單字或短句之後就能開桌（目前 {n} 個）。每次出牌前都要先答對一個你學過的字。
      </Blocked>
    );
  }
  return <BigTwoGame lang={lang} />;
}

export function BigTwoRules() {
  return (
    <ul className="rules">
      <li>四個人各拿 13 張，<b>誰先把牌出完誰贏</b>。拿到 ♣3 的人先出，第一手一定要包含 ♣3。</li>
      <li>點數大小：3 &lt; 4 &lt; … &lt; K &lt; A &lt; 2；點數一樣比花色：♣ &lt; ♦ &lt; ♥ &lt; ♠。</li>
      <li>可以出：單張、對子、五張牌型（順子 &lt; 葫蘆 &lt; 鐵支 &lt; 同花順）。順子不能有 2，A 只能當最大（10 J Q K A）。</li>
      <li>要用同樣張數、比較大的牌壓過桌上的牌，壓不過就「過」。三家都過，最後出牌的人重新自由出牌。</li>
      <li>學語言規則：你出牌前要先答對一題。跟牌時答錯就算過；自己起手時答錯，只能出手上最小的一張。</li>
    </ul>
  );
}

function BigTwoGame({ lang }: { lang: LangId }) {
  const s = useSave();
  const words = useWords(lang);
  const back = `/l/${lang}/arcade`;
  const [level, setLevel] = useState<B.BigTwoLevel>('normal');
  const [st, setSt] = useState<B.BigTwoState | null>(null);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [bySuit, setBySuit] = useState(false);
  const [hintAt, setHintAt] = useState(0);
  const [quiz, setQuiz] = useState<(Quiz & { cards: Card[] }) | null>(null);
  const [score, setScore] = useState({ correct: 0, answered: 0, streak: 0 });
  const [msg, setMsg] = useState('');
  const [rules, setRules] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const recent = useRef<string[]>([]);

  const begin = () => {
    sfx.tap();
    setSt(B.newBigTwo(Math.random));
    setSel(new Set());
    setScore({ correct: 0, answered: 0, streak: 0 });
    setMsg('');
    setResult(null);
  };

  const apply = (fn: (d: B.BigTwoState) => void) =>
    setSt((cur) => {
      if (!cur) return cur;
      const d = structuredClone(cur);
      fn(d);
      return d;
    });

  // 電腦的回合
  useEffect(() => {
    if (!st || st.winner !== null || st.turn === 0 || quiz) return;
    const t = setTimeout(() => {
      sfx.tap();
      apply((d) => {
        if (d.winner !== null || d.turn === 0) return;
        const cards = B.aiChoose(d, d.turn, level, Math.random);
        if (cards) B.playCards(d, d.turn, cards);
        else B.pass(d, d.turn);
      });
    }, 850);
    return () => clearTimeout(t);
  }, [st, quiz, level]);

  // 又輪到自己時，清掉上一輪的提示訊息
  const turn = st?.turn;
  useEffect(() => {
    if (turn === 0) setMsg('');
  }, [turn]);

  // 結算
  useEffect(() => {
    if (!st || st.winner === null || result) return;
    const res = B.results(st);
    const me = res.find((r) => r.p === 0)!;
    const win = st.winner === 0;
    if (win) sfx.complete();
    else sfx.fail();
    const parts: Part[] = [
      ['答對出牌', score.correct],
      [`第 ${me.rank + 1} 名`, RANK_XP[me.rank]],
    ];
    setResult({
      emoji: win ? '👑' : '🂢',
      headline: win ? '大老二，你先出完了！' : `第 ${me.rank + 1} 名`,
      sub: win ? '牌出得漂亮，單字也答得好！' : `${SEATS[st.winner]} 先出完了。試著把對子和五張牌型留著，一次出掉很多張。`,
      outcome: finishGame({ lang, game: 'bigtwo', parts, coins: win ? WIN_COINS[level] : 0, win }),
      lines: [
        ...res.map((r): [string, string] => [`${['🥇', '🥈', '🥉', '4️⃣'][r.rank]} ${SEATS[r.p]}`, r.left ? `剩 ${r.left} 張` : '出完！']),
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
            <small>大老二</small>
          </div>
        </header>
        <main className="session-body">
          <section className="card cards-intro">
            <div className="cards-hero" aria-hidden>
              {[{ s: 'D', r: 2 }, { s: 'S', r: 2 }, { s: 'C', r: 3 }].map((c) => (
                <PlayingCard key={`${c.s}${c.r}`} c={c as Card} />
              ))}
            </div>
            <h1>大老二</h1>
            <p className="muted">和 Emma、さくら、민준 比誰先出完。每次出牌前要先答對一個你學過的字。</p>
            <BigTwoRules />
            <div className="seg small level-pick" role="radiogroup" aria-label="難度">
              {LEVELS.map(([id, name, desc]) => (
                <button key={id} type="button" role="radio" aria-checked={level === id} className={cx(level === id && 'on')} onClick={() => setLevel(id)}>
                  {name}
                  <small>{desc}</small>
                </button>
              ))}
            </div>
            <p className="muted small">
              已玩 {s.stats.bigtwo} 局・第一名 {s.stats.bigtwoWins} 次
            </p>
            <button type="button" className="btn primary wide" onClick={begin}>
              開始發牌
            </button>
          </section>
        </main>
      </div>
    );
  }

  const myTurn = st.winner === null && st.turn === 0;
  const handRaw = st.hands[0];
  const hand = bySuit ? [...handRaw].sort((a, b) => SUITS.indexOf(a.s) - SUITS.indexOf(b.s) || B.btRank(a.r) - B.btRank(b.r)) : B.sortBt(handRaw);
  const chosen = hand.filter((c) => sel.has(cardKey(c)));
  const combo = chosen.length ? B.analyze(chosen) : null;
  const why = chosen.length ? B.whyNot(st, 0, chosen) : null;
  const passedNow = (p: number) => {
    const m = [...st.log].reverse().find((x) => x.p === p);
    return !!st.table && !!m && m.combo === null;
  };

  const toggle = (c: Card) => {
    if (quiz) return;
    const k = cardKey(c);
    setSel((x) => {
      const n = new Set(x);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
    setMsg('');
  };

  const hint = () => {
    const plays = B.legalPlays(st, 0);
    if (!plays.length) {
      setMsg('沒有壓得過的牌，只能過');
      return;
    }
    const p = plays[hintAt % plays.length];
    setHintAt((x) => x + 1);
    setSel(new Set(p.cards.map(cardKey)));
    setMsg(`提示：${B.comboLabel(p)}（再按一次看下一種）`);
  };

  const play = () => {
    if (!myTurn || quiz || why || !chosen.length) return;
    const q = randomQuiz(words, lang, recent.current, SECONDS[level]);
    if (!q) return;
    sfx.tap();
    setMsg('');
    setQuiz({ ...q, cards: chosen });
  };

  const doPass = () => {
    if (!myTurn || quiz || !B.canPass(st)) return;
    sfx.tap();
    setMsg('');
    setSel(new Set());
    apply((d) => B.pass(d, 0));
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
    setSel(new Set());
    setHintAt(0);
    recent.current = [q.item.id, ...recent.current].slice(0, 12);
    const ok = q.picked === q.ex.answer;
    apply((d) => {
      if (ok) B.playCards(d, 0, q.cards);
      else if (d.table) B.pass(d, 0);
      else B.playCards(d, 0, B.forcedPlay(d, 0));
    });
    setMsg(ok ? '' : st.table ? '答錯了，這一輪算過' : '答錯了，只能出最小的一張');
  };

  const tableName = st.table ? `${SEATS[st.lead]}・${B.comboLabel(st.table)}` : '';
  const status = myTurn
    ? st.first
      ? '你拿到 ♣3，第一手要包含 ♣3'
      : st.table
        ? `輪到你：出 ${st.table.cards.length} 張比桌上大的牌，或按「過」`
        : '輪到你：桌面清空了，自由出牌'
    : `${SEATS[st.turn]} 思考中…`;

  return (
    <div className="game-page cards-game bigtwo" style={{ '--lang': META[lang].color } as CSSProperties}>
      <header className="session-top">
        <button type="button" className="icon-btn" aria-label="離開這一局" onClick={() => nav(back)}>
          ✕
        </button>
        <div className="session-progress">
          <small>
            大老二・{LEVELS.find((l) => l[0] === level)![1]}・答對 {score.correct} / {score.answered}
          </small>
        </div>
        <button type="button" className="icon-btn" aria-label="規則" title="規則" onClick={() => setRules(true)}>
          ？
        </button>
      </header>
      <main className="session-body cards-body">
        <Seats counts={st.hands.map((h) => h.length)} turn={st.turn} note={(p) => (passedNow(p) ? '過' : st.table && st.lead === p ? '出牌' : null)} />
        <div className="bt-table" aria-label="牌桌">
          {st.table ? (
            <>
              <div className="bt-played">
                {st.table.cards.map((c) => (
                  <PlayingCard key={cardKey(c)} c={c} />
                ))}
              </div>
              <small className="bt-who">{tableName}</small>
            </>
          ) : (
            <small className="bt-who">{st.turn === 0 ? '桌面是空的，由你自由出牌' : `${SEATS[st.turn]} 起手`}</small>
          )}
        </div>
        <div className="cards-note" role="status">
          <p className={cx('cards-status', myTurn && 'mine')}>{status}</p>
          <p className="cards-msg">{msg}</p>
        </div>
        <div className="bt-preview" aria-live="polite">
          {chosen.length > 0 && (why ? <span className="bad">{why}</span> : combo && <span className="good">✓ {B.comboLabel(combo)}，可以出</span>)}
        </div>
        <Hand cards={hand} selected={sel} onPick={toggle} />
        <div className="cards-actions">
          <button type="button" className="btn ghost small" onClick={() => setBySuit((x) => !x)}>
            {bySuit ? '依點數排' : '依花色排'}
          </button>
          <button type="button" className="btn ghost small" disabled={!myTurn || !!quiz} onClick={hint}>
            💡 提示
          </button>
          <button type="button" className="btn ghost" disabled={!myTurn || !!quiz || !B.canPass(st)} onClick={doPass}>
            過
          </button>
          <button type="button" className="btn primary" disabled={!myTurn || !!quiz || !chosen.length || !!why} onClick={play}>
            出牌
          </button>
        </div>
      </main>

      {quiz && (
        <div className="dquiz-wrap">
          <QuizPanel quiz={quiz} lang={lang} onPick={pick} onDone={resolve} title={<span className="dquiz-title">答對就出牌（{B.comboLabel(B.analyze(quiz.cards)!)}）</span>} />
        </div>
      )}
      {rules && (
        <Modal className="cards-rules" onClose={() => setRules(false)}>
          <h2>大老二規則</h2>
          <BigTwoRules />
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
