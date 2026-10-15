// 配對消消樂：三回合，把單字和意思配成一對消掉，比速度。
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ResultScreen, type ResultData } from '../components/Result';
import { Tx } from '../components/ui';
import { META } from '../content';
import { learnedVocab, UNLOCK } from '../core/progress';
import { shuffle } from '../core/rng';
import { sfx } from '../core/sfx';
import { finishGame, getSave, recordAnswer } from '../core/store';
import type { LangId } from '../core/types';
import { cx, fmtTime } from '../core/util';
import { matchEx, type MatchEx, type Txt } from '../engine/exercises';
import { nav } from '../router';
import { Blocked } from './Practice';

const ROUNDS = 3;
const PAIRS = 6;

interface Card {
  pair: number;
  txt: Txt;
}

function makeRounds(lang: LangId): MatchEx['pairs'][] | null {
  const vocab = learnedVocab(getSave(), lang);
  if (vocab.length < UNLOCK.match) return null;
  const ctx = { lang, rng: Math.random, canListen: false };
  const rounds: MatchEx['pairs'][] = [];
  let deck = shuffle(vocab);
  for (let r = 0; r < ROUNDS; r++) {
    // 字不夠分三回合時，重新洗牌再抽
    if (deck.length < PAIRS) deck = shuffle(vocab);
    const m = matchEx(deck.splice(0, PAIRS + 3), ctx);
    if (m) rounds.push(m.pairs.slice(0, PAIRS));
  }
  return rounds.length ? rounds : null;
}

function Game({ lang, rounds, onAgain }: { lang: LangId; rounds: MatchEx['pairs'][]; onAgain: () => void }) {
  const [round, setRound] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [bad, setBad] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<ResultData | null>(null);
  const start = useRef(Date.now());
  const wrongIds = useRef(new Set<string>());
  const back = `/l/${lang}/arcade`;

  const pairs = rounds[round];
  const cards = useMemo<Card[]>(
    () => shuffle(pairs.flatMap((p, i) => [{ pair: i, txt: p.a }, { pair: i, txt: p.b }])),
    [pairs],
  );

  useEffect(() => {
    if (result) return;
    const t = setInterval(() => setElapsed((Date.now() - start.current) / 1000), 200);
    return () => clearInterval(t);
  }, [result]);

  const finish = (totalMistakes: number) => {
    const seconds = Math.round((Date.now() - start.current) / 1000);
    const parts: [string, number][] = [['完成配對', 10]];
    if (totalMistakes === 0) parts.push(['零失誤', 5]);
    const fast = seconds <= rounds.length * 15 ? 5 : seconds <= rounds.length * 25 ? 3 : 0;
    if (fast) parts.push(['速度獎勵', fast]);
    setResult({
      emoji: '🃏',
      headline: totalMistakes === 0 ? '完美配對！' : '配對完成！',
      outcome: finishGame({ lang, game: 'match', parts, seconds }),
      lines: [
        ['用時', fmtTime(seconds)],
        ['配錯', `${totalMistakes} 次`],
      ],
      back,
      backLabel: '回到遊樂場',
      again: { label: '再玩一次', run: onAgain },
    });
  };

  const pick = (i: number) => {
    if (bad.length || matched.includes(i) || result) return;
    if (sel === null || sel === i) {
      sfx.tap();
      setSel(sel === i ? null : i);
      return;
    }
    const a = cards[sel];
    const b = cards[i];
    setSel(null);
    if (a.pair === b.pair) {
      sfx.pop();
      const m = [...matched, sel, i];
      setMatched(m);
      if (m.length < cards.length) return;
      // 這一回合清空了：記錄每個字的對錯，進下一回合或結算
      for (const p of pairs) recordAnswer(p.itemId, !wrongIds.current.has(p.itemId), 'game');
      setTimeout(() => {
        if (round + 1 < rounds.length) {
          setRound(round + 1);
          setMatched([]);
        } else {
          finish(mistakes);
        }
      }, 450);
    } else {
      sfx.wrong();
      wrongIds.current.add(pairs[a.pair].itemId);
      wrongIds.current.add(pairs[b.pair].itemId);
      setMistakes(mistakes + 1);
      setBad([sel, i]);
      setTimeout(() => setBad([]), 450);
    }
  };

  if (result) return <ResultScreen data={result} lang={lang} />;

  return (
    <div className="game-page" style={{ '--lang': META[lang].color } as CSSProperties}>
      <header className="session-top">
        <button type="button" className="icon-btn" aria-label="離開" onClick={() => nav(back)}>
          ✕
        </button>
        <div className="session-progress">
          <small>
            配對消消樂・第 {round + 1} / {rounds.length} 回合
          </small>
          <div className="bar">
            <i style={{ width: `${((round + matched.length / cards.length) / rounds.length) * 100}%`, background: 'var(--lang)' }} />
          </div>
        </div>
        <div className="combo on">⏱ {fmtTime(elapsed)}</div>
      </header>
      <main className="session-body">
        <p className="ex-label">把單字和意思配成一對{mistakes > 0 && `　配錯 ${mistakes} 次`}</p>
        <div className="match-board" key={round}>
          {cards.map((c, i) => (
            <button
              key={i}
              type="button"
              className={cx('match-card', matched.includes(i) && 'matched', sel === i && 'sel', bad.includes(i) && 'bad')}
              disabled={matched.includes(i)}
              onClick={() => pick(i)}
            >
              <Tx s={c.txt.s} lang={c.txt.lang} />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export function MatchPage({ lang }: { lang: LangId }) {
  // 題目是隨機抽的，要放在 state 裡：重新渲染時才不會換一批
  const [{ run, rounds }, setGame] = useState(() => ({ run: 0, rounds: makeRounds(lang) }));
  if (!rounds) {
    return (
      <Blocked lang={lang} icon="🃏" title="配對消消樂尚未解鎖" back={`/l/${lang}`}>
        學會 {UNLOCK.match} 個字詞之後就能開始。
      </Blocked>
    );
  }
  return <Game key={run} lang={lang} rounds={rounds} onAgain={() => setGame((g) => ({ run: g.run + 1, rounds: makeRounds(lang) }))} />;
}
