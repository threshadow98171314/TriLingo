// 接龍對戰：日文しりとり、韓文끝말잇기、英文 Word Chain，和電腦輪流接字（規則在 engine/chain.ts）。
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { ResultScreen, type ResultData } from '../components/Result';
import { SpeakBtn, Tx } from '../components/ui';
import { courseIndex, META, requireCourse } from '../content';
import { learnedVocab, UNLOCK } from '../core/progress';
import { pick } from '../core/rng';
import { sfx } from '../core/sfx';
import { finishGame, getSave, recordAnswer, useSave } from '../core/store';
import type { LangId } from '../core/types';
import { cx } from '../core/util';
import * as C from '../engine/chain';
import { headOf, isVocab, sayOf } from '../engine/exercises';
import { hasKanji } from '../engine/furigana';
import { nav } from '../router';
import { Blocked } from './Practice';

const GAME_NAME: Record<LangId, string> = { en: 'Word Chain 英文接龍', ja: 'しりとり 日文接龍', ko: '끝말잇기 韓文接龍' };
const LIVES = 3;

export function WordChainPage({ lang }: { lang: LangId }) {
  const n = learnedVocab(getSave(), lang).filter((i) => i.kind !== 'char').length;
  const [level, setLevel] = useState<C.Level | null>(null);
  const [run, setRun] = useState(0);
  if (n < UNLOCK.chain) {
    return (
      <Blocked lang={lang} icon="🔗" title="接龍對戰尚未解鎖" back={`/l/${lang}/arcade`}>
        學會 {UNLOCK.chain} 個單字之後就能開始（目前 {n} 個）。
      </Blocked>
    );
  }
  if (!level) return <Start lang={lang} onPick={setLevel} />;
  return (
    <Game
      key={run}
      lang={lang}
      level={level}
      onAgain={() => setRun((x) => x + 1)}
      onMenu={() => {
        setLevel(null);
        setRun((x) => x + 1);
      }}
    />
  );
}

function Start({ lang, onPick }: { lang: LangId; onPick: (l: C.Level) => void }) {
  const s = useSave();
  const best = s.best.chain?.[lang] ?? 0;
  return (
    <div className="page narrow" style={{ '--lang': META[lang].color } as CSSProperties}>
      <button type="button" className="back-link link-btn" onClick={() => nav(`/l/${lang}/arcade`)}>
        ← 遊樂場
      </button>
      <section className="card chain-hero">
        <div className="chain-hero-icon">🔗</div>
        <h1>{GAME_NAME[lang]}</h1>
        <p className="muted">和電腦輪流接字：用對方最後一個{lang === 'en' ? '字母' : lang === 'ja' ? '假名' : '字'}當開頭，說出一個新的單字。</p>
        <ul className="duel-rules">
          {lang === 'ja' && (
            <>
              <li>用讀音接：「りんご」→「ごはん」✗（ん結尾就輸了）→「ごりら」…</li>
              <li>結尾是長音「ー」就看前一個假名（タクシー→し）；小字換成大字（おもちゃ→や）。</li>
              <li>可以打假名，也可以打漢字（例如「学校」或「がっこう」）。</li>
            </>
          )}
          {lang === 'ko' && (
            <>
              <li>接最後一個字：사과 → 과일 → 일요일 …</li>
              <li>可以套用頭音法則：最後一個字是「력」也可以用「역」開頭、「로」可以用「노」。</li>
            </>
          )}
          {lang === 'en' && <li>接最後一個字母：apple → egg → good → …（單字至少 3 個字母）</li>}
          <li>字庫是整個課程的單字；用過的字不能再用。每回合有時間限制，想不出來可以按提示。</li>
          <li>時間到、或說了接不下去的字會扣一條命（共 {LIVES} 條）；電腦想不出字就是你贏！</li>
        </ul>
        <div className="duel-start-btns">
          {(Object.keys(C.LEVELS) as C.Level[]).map((l) => (
            <button key={l} type="button" className={cx('btn wide', l === 'normal' ? 'primary' : l === 'hard' ? 'danger' : '')} onClick={() => onPick(l)}>
              {C.LEVELS[l].name}：{C.LEVELS[l].desc}
            </button>
          ))}
        </div>
        <p className="muted small">最高分：{best > 0 ? best : '還沒挑戰過'}</p>
      </section>
    </div>
  );
}

interface Entry {
  w: C.ChainWord;
  by: 'ai' | 'me';
  /** 這個字開始新的一串（前一串斷掉了） */
  fresh?: boolean;
}

function WordView({ e, lang }: { e: Entry; lang: LangId }) {
  const it = e.w.item;
  const chars = Array.from(e.w.key);
  return (
    <li className={cx('chain-entry', e.by)}>
      {e.fresh && <small className="chain-fresh">— 新的一串 —</small>}
      <span className="chain-who">{e.by === 'ai' ? '🤖' : '🙂'}</span>
      <div className="chain-word">
        <b>
          <Tx s={headOf(it)} lang={lang} />
        </b>
        {lang === 'ja' && hasKanji(it.w) && (
          <small className="chain-kana" lang="ja">
            {chars.slice(0, -1).join('')}
            <i>{chars[chars.length - 1]}</i>
          </small>
        )}
        <small className="muted">{it.m}</small>
      </div>
      <SpeakBtn text={sayOf(it, lang)} lang={lang} size="sm" />
    </li>
  );
}

function Game({ lang, level, onAgain, onMenu }: { lang: LangId; level: C.Level; onAgain: () => void; onMenu: () => void }) {
  const back = `/l/${lang}/arcade`;
  const dict = useMemo(() => C.buildDict([...courseIndex(lang).items.values()].map((x) => x.item).filter(isVocab), lang), [lang]);
  // 電腦認得的字：輕鬆、普通只用前幾個關卡的字（加上你學過的字），困難用整個課程
  const [known] = useState(() => {
    const idx = courseIndex(lang).items;
    const order = requireCourse(lang).stages.map((st) => st.id);
    const cap = level === 'easy' ? 2 : level === 'normal' ? 3 : Infinity;
    const s = getSave();
    const pool = dict.filter((w) => s.items[w.id] || order.indexOf(idx.get(w.id)?.stage.id ?? '') <= cap);
    return C.knownSet(pool, level, Math.random);
  });
  const [entries, setEntries] = useState<Entry[]>([]);
  const [used, setUsed] = useState<Set<string>>(() => new Set());
  const [prev, setPrev] = useState<C.ChainWord | null>(null);
  const [turn, setTurn] = useState<'ai' | 'me'>('ai');
  const [fresh, setFresh] = useState(true);
  const [lives, setLives] = useState(LIVES);
  const [score, setScore] = useState(0);
  const [mine, setMine] = useState(0);
  const [hints, setHints] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [input, setInput] = useState('');
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [ended, setEnded] = useState<'win' | 'lose' | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const list = useRef<HTMLOListElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const seconds = C.LEVELS[level].seconds;

  // 電腦的回合：想一下再出字
  useEffect(() => {
    if (turn !== 'ai' || ended) return;
    const t = setTimeout(() => {
      const w = C.aiMove(dict, known, used, prev, lang, level, Math.random);
      if (!w) {
        setEnded('win');
        sfx.complete();
        return;
      }
      setEntries((e) => [...e, { w, by: 'ai', fresh: fresh && e.length > 0 }]);
      setUsed((u) => new Set(u).add(w.key));
      setPrev(w);
      setFresh(false);
      setTurn('me');
      setHint(null);
      setDeadline(Date.now() + seconds * 1000);
      sfx.pop();
    }, 750);
    return () => clearTimeout(t);
  }, [turn, ended, dict, known, used, prev, lang, level, fresh, seconds]);

  useEffect(() => {
    list.current?.lastElementChild?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if (turn === 'me') field.current?.focus();
  }, [entries, turn]);

  // 倒數
  useEffect(() => {
    if (turn !== 'me' || ended) return;
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, [turn, ended]);

  const loseLife = (why: string) => {
    const left = lives - 1;
    setLives(left);
    setMsg(why);
    sfx.wrong();
    setInput('');
    if (left <= 0) {
      setEnded('lose');
      sfx.fail();
      return;
    }
    // 這一串斷了：電腦重新出一個字
    setPrev(null);
    setFresh(true);
    setTurn('ai');
  };

  useEffect(() => {
    if (turn === 'me' && !ended && deadline && now > deadline) loseLife('時間到！扣一條命，電腦重新出一個字。');
  }, [now]); // 只在倒數更新時檢查

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (turn !== 'me' || ended) return;
    const v = C.judge(input, dict, used, prev, lang);
    if (!v.ok) {
      if (v.lose) loseLife(v.reason);
      else {
        setMsg(v.reason);
        sfx.wrong();
      }
      return;
    }
    const w = v.word;
    setEntries((x) => [...x, { w, by: 'me' }]);
    setUsed((u) => new Set(u).add(w.key));
    setPrev(w);
    setScore((x) => x + C.wordScore(w));
    setMine((x) => x + 1);
    setInput('');
    setMsg('');
    setHint(null);
    setTurn('ai');
    sfx.correct(mine);
    if (getSave().items[w.id]) recordAnswer(w.id, true, 'game');
  };

  const giveHint = () => {
    const opts = C.options(dict, used, prev, lang);
    if (!opts.length) return;
    // 優先提示學過的字，其次是電腦也認得的（比較基礎的）字
    const s = getSave();
    const mineOpts = opts.filter((w) => s.items[w.id]);
    const easyOpts = opts.filter((w) => known.has(w.key));
    const h = pick(mineOpts.length ? mineOpts : easyOpts.length ? easyOpts : opts);
    const cs = Array.from(h.key);
    setHints((x) => x + 1);
    setScore((x) => Math.max(0, x - 15));
    setHint(`意思是「${h.item.m}」，${cs.length} 個${lang === 'en' ? '字母' : lang === 'ja' ? '假名' : '字'}，開頭是「${cs.slice(0, Math.min(2, cs.length - 1)).join('')}」`);
  };

  // 結算
  useEffect(() => {
    if (!ended || result) return;
    const win = ended === 'win';
    const bonus = win ? { easy: 10, normal: 20, hard: 30 }[level] : 0;
    const final = score + (win ? 50 : 0);
    setResult({
      emoji: win ? '🏆' : '🔗',
      headline: win ? '電腦想不出字了，你贏了！' : '三條命都用完了',
      sub: win ? `${C.LEVELS[level].name}模式獲勝，總分 ${final}。` : `接了 ${mine} 個字，總分 ${final}。`,
      outcome: finishGame({
        lang,
        game: 'chain',
        parts: [['接出的字', Math.min(40, mine * 2)], ...(bonus ? [[`${C.LEVELS[level].name}模式獲勝`, bonus] as [string, number]] : [])],
        score: final,
        win,
      }),
      lines: [
        ['總分', String(final)],
        ['你接的字', `${mine} 個`],
        ['用了提示', `${hints} 次`],
      ],
      back,
      backLabel: '回到遊樂場',
      again: { label: '再玩一場', run: onAgain },
    });
  }, [ended, result, level, score, mine, hints, lang, back, onAgain]);

  if (result) {
    return (
      <>
        <ResultScreen data={result} lang={lang} />
        <p className="chain-menu">
          <button type="button" className="link-btn" onClick={onMenu}>
            換難度
          </button>
        </p>
      </>
    );
  }

  const heads = prev ? C.headsAfter(prev, lang) : [];
  const left = Math.max(0, deadline - now);
  return (
    <div className="game-page chain" style={{ '--lang': META[lang].color } as CSSProperties}>
      <header className="session-top">
        <button type="button" className="icon-btn" aria-label="離開" onClick={() => nav(back)}>
          ✕
        </button>
        <div className="session-progress">
          <small>
            {GAME_NAME[lang]}・{C.LEVELS[level].name}・{'❤️'.repeat(lives)}
            {'🤍'.repeat(LIVES - lives)}
          </small>
          <div className="bar">
            <i style={{ width: turn === 'me' ? `${(left / (seconds * 1000)) * 100}%` : '100%', background: left < 6000 && turn === 'me' ? 'var(--bad)' : 'var(--lang)' }} />
          </div>
        </div>
        <div className="combo on">{score} 分</div>
      </header>
      <main className="session-body chain-body">
        <ol className="chain-list" ref={list}>
          {entries.map((e, i) => (
            <WordView key={i} e={e} lang={lang} />
          ))}
          {turn === 'ai' && !ended && <li className="chain-entry ai thinking">🤖 想想看……</li>}
        </ol>
        {turn === 'me' && !ended && (
          <form className="card chain-input" onSubmit={submit}>
            <p className="chain-need">
              {heads.length ? (
                <>
                  接一個用 <b lang={lang}>「{heads.join('」或「')}」</b> 開頭的字
                </>
              ) : (
                '說一個字開始新的一串'
              )}
              <small className="muted">　還剩 {Math.ceil(left / 1000)} 秒</small>
            </p>
            <div className="chain-row">
              <input
                ref={field}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                lang={lang}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder={lang === 'ja' ? '打假名或漢字' : lang === 'ko' ? '用韓文輸入法打字' : 'type a word'}
              />
              <button type="submit" className="btn primary">
                送出
              </button>
            </div>
            {msg && <p className="chain-msg">{msg}</p>}
            {hint && <p className="chain-hint">💡 {hint}</p>}
            <div className="chain-tools">
              <button type="button" className="link-btn" onClick={giveHint}>
                💡 提示（-15 分）
              </button>
              <button type="button" className="link-btn" onClick={() => loseLife('跳過這一串，扣一條命。')}>
                想不出來（-1 命）
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
