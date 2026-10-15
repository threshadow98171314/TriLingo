// 記憶翻牌：12 張蓋著的牌，一次翻兩張，把「字」和「意思」配成一對。
// 日文另有「假名對對碰」：把平假名和對應的片假名配成一對。
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ResultScreen, type ResultData } from '../components/Result';
import { Tx } from '../components/ui';
import { META } from '../content';
import { fx } from '../core/fx';
import { learnedItems, learnedVocab, UNLOCK } from '../core/progress';
import { sample, shuffle } from '../core/rng';
import { sfx } from '../core/sfx';
import { finishGame, getSave, recordAnswer, useSave } from '../core/store';
import type { LangId, VocabItem } from '../core/types';
import { clamp, cx, fmtTime } from '../core/util';
import { front, isVocab } from '../engine/exercises';
import { toHiragana, toKatakana } from '../engine/furigana';
import { nav } from '../router';
import { Blocked } from './Practice';

const PAIRS = 6;

interface Card {
  key: number;
  pair: number;
  text: string;
  lang: LangId | 'zh';
  /** 單字模式：配對成功時記進熟練度 */
  itemId?: string;
}

/** 單字模式：同一組不能有重複的字或意思，避免配錯也算對 */
function vocabCards(vocab: VocabItem[], lang: LangId): Card[] {
  const used = new Set<string>();
  const picked: VocabItem[] = [];
  for (const v of shuffle(vocab)) {
    const a = front(v, lang);
    if (used.has(a) || used.has(`m:${v.m}`)) continue;
    used.add(a);
    used.add(`m:${v.m}`);
    picked.push(v);
    if (picked.length >= PAIRS) break;
  }
  return shuffle(
    picked.flatMap((v, i) => [
      { key: i * 2, pair: i, text: front(v, lang), lang, itemId: v.id },
      { key: i * 2 + 1, pair: i, text: v.kind === 'char' ? (v.rm ?? v.m) : v.m, lang: 'zh' as const, itemId: v.id },
    ]),
  );
}

/** 假名模式：學過的假名（平、片都算），各取一組平假名＋片假名 */
export function kanaPairs(learned: VocabItem[]): string[] {
  const hira = new Set<string>();
  for (const it of learned) if (it.kind === 'char' && it.id.startsWith('ja.kana.')) hira.add(toHiragana(it.w));
  return [...hira];
}

function kanaCards(hira: string[]): Card[] {
  return shuffle(
    sample(hira, PAIRS).flatMap((h, i) => [
      { key: i * 2, pair: i, text: h, lang: 'ja' as const },
      { key: i * 2 + 1, pair: i, text: toKatakana(h), lang: 'ja' as const },
    ]),
  );
}

function Game({ lang, kana, onAgain }: { lang: LangId; kana: boolean; onAgain: () => void }) {
  const best = useSave().best.memory?.[lang];
  const back = `/l/${lang}/arcade`;
  const cards = useMemo(() => {
    const s = getSave();
    return kana ? kanaCards(kanaPairs(learnedItems(s, lang).filter(isVocab))) : vocabCards(learnedVocab(s, lang), lang);
  }, [lang, kana]);
  // 單字模式為了避免重複，可能湊不滿 6 組：以實際的牌數為準
  const total = cards.length / 2;
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(() => new Set());
  const [moves, setMoves] = useState(0);
  const [misses, setMisses] = useState(0);
  const [started, setStarted] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [result, setResult] = useState<ResultData | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    if (!started || result) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [started, result]);

  const finish = (m: number, missCount: number) => {
    const seconds = Math.max(1, Math.round((Date.now() - started) / 1000));
    setResult({
      emoji: kana ? 'あ' : '🃏',
      headline: missCount === 0 ? '一次都沒翻錯！' : '全部配對完成！',
      sub: best !== undefined && seconds < best ? `比之前最快的 ${fmtTime(best)} 還快。` : undefined,
      outcome: finishGame({
        lang,
        game: 'memory',
        parts: [
          [kana ? '假名對對碰' : '記憶翻牌', 10],
          ['步數獎勵', clamp(total * 2 + 4 - m, 0, 10)],
        ],
        seconds,
      }),
      lines: [
        ['用時', fmtTime(seconds)],
        ['翻牌次數', String(m)],
        ['翻錯', String(missCount)],
      ],
      back,
      backLabel: '回到遊樂場',
      again: { label: '再玩一次', run: onAgain },
    });
  };

  const flip = (i: number) => {
    if (busy.current || open.includes(i) || matched.has(cards[i].pair) || result) return;
    if (!started) {
      const t = Date.now();
      setStarted(t);
      setNow(t);
    }
    sfx.tap();
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;
    const [a, b] = next.map((k) => cards[k]);
    const m = moves + 1;
    setMoves(m);
    if (a.pair === b.pair) {
      const done = new Set(matched).add(a.pair);
      setMatched(done);
      setOpen([]);
      sfx.pop();
      fx.burstAt(document.querySelector(`[data-card="${next[1]}"]`), { count: 12, speed: 0.3 });
      if (a.itemId) recordAnswer(a.itemId, true, 'game');
      if (done.size === total) setTimeout(() => finish(m, misses), 500);
    } else {
      busy.current = true;
      setMisses((x) => x + 1);
      sfx.wrong();
      setTimeout(() => {
        setOpen([]);
        busy.current = false;
      }, 800);
    }
  };

  if (result) return <ResultScreen data={result} lang={lang} />;
  const seconds = started ? Math.max(0, Math.round((now - started) / 1000)) : 0;

  return (
    <div className="game-page" style={{ '--lang': META[lang].color } as CSSProperties}>
      <header className="session-top">
        <button type="button" className="icon-btn" aria-label="離開" onClick={() => nav(back)}>
          ✕
        </button>
        <div className="session-progress">
          <small>
            {kana ? '假名對對碰' : '記憶翻牌'}
            {best !== undefined && `・最快 ${fmtTime(best)}`}
          </small>
          <div className="bar">
            <i style={{ width: `${(matched.size / total) * 100}%`, background: 'var(--lang)' }} />
          </div>
        </div>
        <div className="combo on">⏱ {fmtTime(seconds)}</div>
      </header>
      <main className="session-body">
        <p className="ex-label">{kana ? '翻開兩張牌，把平假名和對應的片假名配成一對' : '翻開兩張牌，把字和它的意思配成一對'}</p>
        <div className="mem-grid">
          {cards.map((c, i) => {
            const shown = open.includes(i) || matched.has(c.pair);
            return (
              <button
                key={c.key}
                type="button"
                data-card={i}
                className={cx('mem-card', shown && 'shown', matched.has(c.pair) && 'matched')}
                onClick={() => flip(i)}
                aria-label={shown ? c.text : '蓋著的牌'}
              >
                <span className="mem-inner">
                  <span className="mem-face mem-back">?</span>
                  <span className="mem-face mem-front">
                    <Tx s={c.text} lang={c.lang} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="muted mem-stats">
          已配對 {matched.size} / {total}・翻牌 {moves} 次・翻錯 {misses} 次
        </p>
      </main>
    </div>
  );
}

export function MemoryPage({ lang, kana }: { lang: LangId; kana: boolean }) {
  const [run, setRun] = useState(0);
  const s = getSave();
  const enough = kana ? kanaPairs(learnedItems(s, lang).filter(isVocab)).length >= PAIRS : learnedVocab(s, lang).length >= UNLOCK.memory;
  if (!enough) {
    return (
      <Blocked lang={lang} icon={kana ? 'あ' : '🃏'} title={kana ? '假名對對碰尚未解鎖' : '記憶翻牌尚未解鎖'} back={`/l/${lang}`}>
        {kana ? '先在五十音學會 6 個假名之後就能開始。' : `學會 ${UNLOCK.memory} 個字詞之後就能開始。`}
      </Blocked>
    );
  }
  return <Game key={run} lang={lang} kana={kana} onAgain={() => setRun((x) => x + 1)} />;
}
