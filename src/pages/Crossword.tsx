// 填字遊戲：看中文提示，把學過的單字填進交叉的格子。
// 英文可以直接用鍵盤打字；日文、韓文用畫面上的字卡輸入（不需要安裝輸入法）。
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ResultScreen, type ResultData } from '../components/Result';
import { Coin, Modal, Tx } from '../components/ui';
import { META } from '../content';
import { today } from '../core/date';
import { crosswordPool, UNLOCK } from '../core/progress';
import { hashStr, mulberry32, shuffle } from '../core/rng';
import { sfx } from '../core/sfx';
import { CROSSWORD_HINT_COST } from '../core/shop';
import { finishGame, getSave, recordAnswer, spendCoins, useSave } from '../core/store';
import type { LangId } from '../core/types';
import { cx, fmtTime } from '../core/util';
import { cellsOfWord, generateCrossword, type Crossword, type CwEntry } from '../engine/crossword';
import { cellsOf, LANG_NAME } from '../engine/exercises';
import { nav } from '../router';
import { Blocked } from './Practice';

const FREE_HINTS = 3;
const SIZE: Record<LangId, { target: number; maxRows: number; maxCols: number }> = {
  en: { target: 8, maxRows: 12, maxCols: 11 },
  ja: { target: 7, maxRows: 10, maxCols: 9 },
  ko: { target: 6, maxRows: 9, maxCols: 8 },
};
const QWERTY = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

interface Puzzle {
  cw: Crossword;
  /** 日文、韓文的字卡鍵盤：盤面上用到的字再加幾個干擾字 */
  keys: string[];
}

function makePuzzle(lang: LangId, daily: boolean): Puzzle | null {
  const pool = crosswordPool(getSave(), lang);
  if (pool.length < UNLOCK.crossword) return null;
  // 每日填字用日期當亂數種子：同一天重新整理還是同一題
  const rng = daily ? mulberry32(hashStr(`crossword:${today()}:${lang}`)) : Math.random;
  const entries: CwEntry[] = pool.map((i) => ({
    id: i.id,
    cells: cellsOf(i, lang)!.map((c) => (lang === 'en' ? c.toUpperCase() : c)),
    clue: i.m,
    solved: lang === 'ja' ? (i.furi ?? i.w) : i.w,
  }));
  const cw = generateCrossword(entries, { rng, ...SIZE[lang], attempts: 60 });
  if (!cw) return null;
  const used = new Set(cw.words.flatMap((w) => w.cells));
  const extra = shuffle([...new Set(entries.flatMap((e) => e.cells))].filter((c) => !used.has(c)), rng).slice(0, Math.max(4, 18 - used.size));
  const keys = [...used, ...extra].sort((a, b) => a.localeCompare(b, lang));
  return { cw, keys };
}

interface Cell {
  ch: string;
  fill: string;
  lock: boolean;
  hinted: boolean;
  num?: number;
  /** 經過這一格的字（words 的索引） */
  words: number[];
}

const keyOf = (p: { r: number; c: number }) => `${p.r},${p.c}`;

function initCells(cw: Crossword): Record<string, Cell> {
  const cells: Record<string, Cell> = {};
  cw.words.forEach((w, wi) => {
    cellsOfWord(w).forEach((p, k) => {
      const cell = (cells[keyOf(p)] ??= { ch: w.cells[k], fill: '', lock: false, hinted: false, words: [] });
      cell.words.push(wi);
      if (k === 0) cell.num = w.num;
    });
  });
  return cells;
}

function Game({ lang, daily, puzzle, onAgain }: { lang: LangId; daily: boolean; puzzle: Puzzle; onAgain: () => void }) {
  const { cw, keys } = puzzle;
  const words = cw.words;
  const coins = useSave().coins;
  const [cells, setCells] = useState(() => initCells(cw));
  const [sel, setSel] = useState({ w: 0, k: 0 });
  const [shake, setShake] = useState<number | null>(null);
  const [hints, setHints] = useState(0);
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const start = useRef(Date.now());
  const finished = useRef(false);

  const coords = useMemo(() => words.map(cellsOfWord), [words]);
  const isSolved = (wi: number, cs = cells) => coords[wi].every((p) => cs[keyOf(p)].lock);
  const solvedCount = words.filter((_, wi) => isSolved(wi)).length;
  const active = words[sel.w];
  const activeKey = keyOf(coords[sel.w][sel.k]);
  const back = `/l/${lang}/arcade`;

  const finish = (cs: Record<string, Cell>, gaveUp: boolean) => {
    if (finished.current) return;
    finished.current = true;
    let clean = 0;
    let helped = 0;
    words.forEach((_, wi) => {
      if (!isSolved(wi, cs)) return;
      if (coords[wi].some((p) => cs[keyOf(p)].hinted)) helped++;
      else clean++;
    });
    const done = clean + helped;
    const parts: [string, number][] = [];
    if (clean) parts.push([`自己解開 ${clean} 個字`, clean * 4]);
    if (helped) parts.push([`靠提示解開 ${helped} 個字`, helped * 2]);
    if (!gaveUp) parts.push(['完成盤面', 10]);
    if (!parts.length) parts.push(['參加獎', 2]);
    const outcome = finishGame({ lang, game: 'crossword', parts, daily: daily && !gaveUp });
    outcome.passed = !gaveUp;
    setResult({
      emoji: gaveUp ? '📖' : '🧩',
      headline: gaveUp ? '看過答案了' : daily ? '每日填字完成！' : '填字完成！',
      sub: gaveUp ? '沒關係，這些字已經排進複習，下次就會了。' : undefined,
      outcome,
      lines: [
        ['解開', `${done} / ${words.length}`],
        ['提示', `${Object.values(cs).filter((c) => c.hinted).length} 次`],
        ['用時', fmtTime(Math.round((Date.now() - start.current) / 1000))],
      ],
      back,
      backLabel: '回到遊樂場',
      again: daily ? undefined : { label: '再來一題', run: onAgain },
    });
  };

  /** 一個字裡最適合開始填的格子：先找空格，沒有就找還能改的格子 */
  const entryOf = (cs: Record<string, Cell>, wi: number): number => {
    const at = (j: number) => cs[keyOf(coords[wi][j])];
    const n = coords[wi].length;
    for (let j = 0; j < n; j++) if (!at(j).lock && !at(j).fill) return j;
    for (let j = 0; j < n; j++) if (!at(j).lock) return j;
    return 0;
  };

  /** 填完一格之後，游標要移到哪裡 */
  const advance = (cs: Record<string, Cell>, w: number, k: number) => {
    const n = coords[w].length;
    const at = (j: number) => cs[keyOf(coords[w][j])];
    // 1. 這個字後面（繞回前面）還有空格
    for (let o = 1; o < n; o++) {
      const j = (k + o) % n;
      if (!at(j).lock && !at(j).fill) return { w, k: j };
    }
    // 2. 這個字解開了：跳到下一個還沒解開的字
    if (isSolved(w, cs)) {
      for (let o = 1; o < words.length; o++) {
        const wi = (w + o) % words.length;
        if (!isSolved(wi, cs)) return { w: wi, k: entryOf(cs, wi) };
      }
      return { w, k };
    }
    // 3. 填滿了但有錯：停在下一個還能改的格子，直接重打就能蓋掉
    for (let o = 1; o <= n; o++) {
      const j = (k + o) % n;
      if (!at(j).lock) return { w, k: j };
    }
    return { w, k };
  };

  /** 填入一個字；target 沒給就填在游標的位置，hinted 表示是提示給的 */
  const place = (ch: string, hinted = false, target?: { w: number; k: number }) => {
    if (result) return;
    // 游標停在已解開的格子上時，自動跳到下一個能填的格子再填
    let at = target ?? sel;
    if (!target && cells[activeKey].lock) at = advance(cells, sel.w, sel.k);
    const key = keyOf(coords[at.w][at.k]);
    const cell = cells[key];
    if (cell.lock) return;
    const cs = { ...cells, [key]: { ...cell, fill: ch, hinted: cell.hinted || hinted } };
    let solvedNow = false;
    let wrongNow = false;
    for (const wi of cell.words) {
      const ps = coords[wi];
      if (!ps.every((p) => cs[keyOf(p)].fill)) continue;
      if (ps.every((p) => cs[keyOf(p)].fill === cs[keyOf(p)].ch)) {
        for (const p of ps) cs[keyOf(p)] = { ...cs[keyOf(p)], lock: true };
        solvedNow = true;
        recordAnswer(words[wi].id, !ps.some((p) => cs[keyOf(p)].hinted), 'game');
      } else if (wi === at.w) {
        wrongNow = true;
      }
    }
    setCells(cs);
    if (solvedNow) sfx.correct(solvedCount);
    else if (wrongNow) {
      sfx.wrong();
      setShake(at.w);
      setTimeout(() => setShake(null), 500);
    } else sfx.tap();
    setSel(advance(cs, at.w, at.k));
    if (words.every((_, wi) => isSolved(wi, cs))) setTimeout(() => finish(cs, false), 700);
  };

  const erase = () => {
    if (result) return;
    const cell = cells[activeKey];
    if (cell.fill && !cell.lock) {
      setCells({ ...cells, [activeKey]: { ...cell, fill: '' } });
      return;
    }
    // 目前這格是空的：退回前一個還能改的格子並清掉
    for (let j = sel.k - 1; j >= 0; j--) {
      const key = keyOf(coords[sel.w][j]);
      if (cells[key].lock) continue;
      setCells({ ...cells, [key]: { ...cells[key], fill: '' } });
      setSel({ w: sel.w, k: j });
      return;
    }
  };

  const selectCell = (r: number, c: number) => {
    const key = `${r},${c}`;
    const cell = cells[key];
    if (!cell) return;
    // 再點一次同一格：切換橫向／直向
    let w = cell.words.includes(sel.w) ? sel.w : cell.words[0];
    if (key === activeKey && cell.words.length > 1) w = cell.words.find((x) => x !== sel.w)!;
    setSel({ w, k: coords[w].findIndex((p) => keyOf(p) === key) });
  };

  const selectWord = (wi: number) => setSel({ w: wi, k: entryOf(cells, wi) });

  const hintCost = hints >= FREE_HINTS ? CROSSWORD_HINT_COST : 0;
  /** 提示要揭曉的格子：游標那一格還沒對就揭曉它，否則找這個字裡第一個還沒對的格子 */
  const needs = (j: number) => {
    const c = cells[keyOf(coords[sel.w][j])];
    return !c.lock && c.fill !== c.ch;
  };
  const hintAt = needs(sel.k) ? sel.k : coords[sel.w].findIndex((_, j) => needs(j));
  const hint = () => {
    if (result || hintAt < 0) return;
    if (hintCost && !spendCoins(hintCost)) return;
    setHints(hints + 1);
    place(cells[keyOf(coords[sel.w][hintAt])].ch, true, { w: sel.w, k: hintAt });
  };

  // 整個字填滿卻不對時，把填錯的格子標出來
  const badKeys = new Set<string>();
  words.forEach((_, wi) => {
    const ps = coords[wi].map((p) => cells[keyOf(p)]);
    if (ps.every((c) => c.fill) && !ps.every((c) => c.lock)) {
      coords[wi].forEach((p) => {
        const c = cells[keyOf(p)];
        if (!c.lock && c.fill !== c.ch) badKeys.add(keyOf(p));
      });
    }
  });

  const giveUp = () => {
    setAsking(false);
    const cs = { ...cells };
    words.forEach((w, wi) => {
      if (isSolved(wi)) return;
      // 沒解開的字記為答錯，會提早排進複習
      recordAnswer(w.id, false, 'game');
    });
    for (const k of Object.keys(cs)) if (!cs[k].lock) cs[k] = { ...cs[k], fill: cs[k].ch };
    setCells(cs);
    setTimeout(() => finish(cells, true), 1600);
  };

  const live = useRef({ place, erase, sel, selectCell, cells, coords });
  live.current = { place, erase, sel, selectCell, cells, coords };
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const L = live.current;
      if (e.key === 'Backspace') {
        e.preventDefault();
        L.erase();
      } else if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        const p = L.coords[L.sel.w][L.sel.k];
        const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
        if (d && L.cells[`${p.r + d[0]},${p.c + d[1]}`]) L.selectCell(p.r + d[0], p.c + d[1]);
      } else if (lang === 'en' && /^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        L.place(e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lang]);

  if (result) return <ResultScreen data={result} lang={lang} />;

  const course = META[lang];
  const activeSet = new Set(coords[sel.w].map(keyOf));
  const clueList = (dir: 0 | 1) => (
    <div className="cw-clue-group">
      <h3>{dir === 0 ? '橫向 →' : '直向 ↓'}</h3>
      <ul>
        {words.map((w, wi) =>
          w.dir !== dir ? null : (
            <li key={wi} className={cx(isSolved(wi) && 'solved', wi === sel.w && 'active')}>
              <button type="button" onClick={() => selectWord(wi)}>
                <b>{w.num}</b>
                <span>
                  {w.clue}
                  {isSolved(wi) && <Tx className="cw-answer" s={w.solved} lang={lang} />}
                </span>
                <small>{w.cells.length} 格</small>
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );

  return (
    <div className="game-page crossword" style={{ '--lang': course.color } as CSSProperties}>
      <header className="session-top">
        <button type="button" className="icon-btn" aria-label="離開" onClick={() => (solvedCount === 0 ? nav(back) : setAsking(true))}>
          ✕
        </button>
        <div className="session-progress">
          <small>
            {daily ? '每日填字' : '填字遊戲'}・{LANG_NAME[lang]}
          </small>
          <div className="bar">
            <i style={{ width: `${(solvedCount / words.length) * 100}%`, background: 'var(--lang)' }} />
          </div>
        </div>
        <div className="combo on">
          {solvedCount} / {words.length}
        </div>
      </header>

      <div className="cw-layout">
        <div className="cw-main">
          <div className="cw-board" style={{ '--cols': cw.cols, '--rows': cw.rows } as CSSProperties}>
            {Array.from({ length: cw.rows * cw.cols }, (_, i) => {
              const r = Math.floor(i / cw.cols);
              const c = i % cw.cols;
              const key = `${r},${c}`;
              const cell = cells[key];
              if (!cell) return <span key={key} className="cw-gap" />;
              return (
                <button
                  key={key}
                  type="button"
                  lang={lang}
                  className={cx(
                    'cw-cell',
                    activeSet.has(key) && 'in-word',
                    key === activeKey && 'active',
                    cell.lock && 'lock',
                    cell.hinted && 'hinted',
                    badKeys.has(key) && 'bad',
                    shake !== null && cell.words.includes(shake) && !cell.lock && 'shake',
                  )}
                  onClick={() => selectCell(r, c)}
                >
                  {cell.num && <i>{cell.num}</i>}
                  {cell.fill}
                </button>
              );
            })}
          </div>

          <div className="cw-current">
            <b>
              {active.dir === 0 ? '橫' : '直'} {active.num}
            </b>
            <span>{active.clue}</span>
            <small>{active.cells.length} 格</small>
          </div>

          <div className={cx('cw-keys', lang)} lang={lang}>
            {lang === 'en' ? (
              QWERTY.map((row, ri) => (
                <div key={row} className="cw-key-row">
                  {Array.from(row).map((ch) => (
                    <button key={ch} type="button" className="cw-key" onClick={() => place(ch)}>
                      {ch}
                    </button>
                  ))}
                  {ri === 2 && (
                    <button type="button" className="cw-key wide" aria-label="刪除" onClick={erase}>
                      ⌫
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="cw-key-row wrap">
                {keys.map((ch) => (
                  <button key={ch} type="button" className="cw-key" onClick={() => place(ch)}>
                    {ch}
                  </button>
                ))}
                <button type="button" className="cw-key wide" aria-label="刪除" onClick={erase}>
                  ⌫
                </button>
              </div>
            )}
          </div>

          <div className="cw-tools">
            <button type="button" className="btn small" onClick={hint} disabled={hintAt < 0 || (!!hintCost && coins < hintCost)}>
              💡 提示這一格
              {hintCost ? <Coin n={`-${hintCost}`} /> : <small>（免費 {FREE_HINTS - hints} 次）</small>}
            </button>
            <button type="button" className="btn small ghost" onClick={() => setAsking(true)}>
              看答案
            </button>
          </div>
        </div>

        <aside className="cw-clues">
          {clueList(0)}
          {clueList(1)}
        </aside>
      </div>

      {asking && (
        <Modal onClose={() => setAsking(false)}>
          <h2>要結束這一題嗎？</h2>
          <p className="muted">可以直接離開，或是看完答案再結算（沒解開的字會排進複習）。</p>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={() => nav(back)}>
              直接離開
            </button>
            <button type="button" className="btn" onClick={giveUp}>
              看答案
            </button>
            <button type="button" className="btn primary" onClick={() => setAsking(false)}>
              繼續解題
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function CrosswordPage({ lang, daily }: { lang: LangId; daily: boolean }) {
  // 盤面是隨機產生的，要放在 state 裡：重新渲染時才不會換成另一題
  const [{ run, puzzle }, setGame] = useState(() => ({ run: 0, puzzle: makePuzzle(lang, daily) }));
  if (!puzzle) {
    const have = crosswordPool(getSave(), lang).length;
    return (
      <Blocked lang={lang} icon="🧩" title="填字遊戲尚未解鎖" back={`/l/${lang}`}>
        {have < UNLOCK.crossword
          ? `填字遊戲用你學過的單字出題，還需要再學會 ${UNLOCK.crossword - have} 個單字（目前 ${have} / ${UNLOCK.crossword}）。`
          : '目前學過的單字還湊不出交叉的盤面，再多學幾個單字就可以了。'}
      </Blocked>
    );
  }
  return (
    <Game
      key={run}
      lang={lang}
      daily={daily}
      puzzle={puzzle}
      onAgain={() => setGame((g) => ({ run: g.run + 1, puzzle: makePuzzle(lang, daily) }))}
    />
  );
}
