// 單字卡牌對決：回合制卡牌冒險（規則在 engine/duel.ts）。
// 每張牌都綁著一個學過的字，出牌前要答題：答對全力發動、連對 3 題變會心一擊、答錯威力減半。
// 冒險進度存在這台裝置的 localStorage，離開再回來可以接著玩。
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { MonsterArt } from '../art/monsters';
import { ResultScreen, type ResultData } from '../components/Result';
import { Modal, SpeakBtn, Tx } from '../components/ui';
import { courseIndex, META } from '../content';
import { learnedVocab, UNLOCK } from '../core/progress';
import { sample } from '../core/rng';
import { sfx } from '../core/sfx';
import { finishGame, getSave, recordAnswer, useSave } from '../core/store';
import type { LangId, VocabItem } from '../core/types';
import { cx } from '../core/util';
import * as D from '../engine/duel';
import { front, headOf, isVocab, readingEx, recall, recog, sayOf, type ChoiceEx } from '../engine/exercises';
import { hasKanji } from '../engine/furigana';
import { nav } from '../router';
import { Blocked, ctxOf } from './Practice';

const storeKey = (lang: LangId) => `trilingo.duel.${lang}`;

function loadRun(lang: LangId): D.Run | null {
  try {
    const raw = localStorage.getItem(storeKey(lang));
    if (!raw) return null;
    const r = JSON.parse(raw) as D.Run;
    return r?.v === 1 && r.stage !== 'over' && Array.isArray(r.deck) ? r : null;
  } catch {
    return null;
  }
}

function storeRun(lang: LangId, run: D.Run | null) {
  try {
    if (run && run.stage !== 'over') localStorage.setItem(storeKey(lang), JSON.stringify(run));
    else localStorage.removeItem(storeKey(lang));
  } catch {
    // 無痕模式或儲存空間被封鎖：照樣可以玩，只是不能接著玩
  }
}

// ───────── 單字與題目 ─────────

interface Words {
  ids: string[];
  get: (id: string) => VocabItem | undefined;
  pool: (i: VocabItem) => VocabItem[];
}

const wordsOk = (i: VocabItem) => i.kind !== 'char';

function useWords(lang: LangId): Words {
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

type QMode = 'w2m' | 'm2w' | 'read';

/** 攻擊牌：看字選意思；防禦牌：看意思選字；技能、能力牌：日文有漢字的考讀音，其他看字選意思 */
function qmodeOf(c: D.CardInst, item: VocabItem, lang: LangId): QMode {
  const t = D.CARDS[c.id].type;
  if (t === 'atk') return 'w2m';
  if (t === 'def') return 'm2w';
  if (lang === 'ja' && item.kind === 'word' && item.r && hasKanji(item.w)) return 'read';
  return 'w2m';
}

/** 牌面上顯示的字：就是題目的那一面（不會洩漏答案） */
function faceOf(mode: QMode, item: VocabItem, lang: LangId): { s: string; lang: LangId | 'zh' } {
  if (mode === 'm2w') return { s: item.m, lang: 'zh' };
  if (mode === 'read') return { s: item.w, lang };
  return { s: front(item, lang), lang };
}

function buildQuiz(mode: QMode, item: VocabItem, pool: VocabItem[], lang: LangId): ChoiceEx {
  const ctx = { ...ctxOf(lang), typing: false };
  if (mode === 'read') return readingEx(item, pool, ctx) ?? recog(item, pool, ctx);
  return mode === 'm2w' ? recall(item, pool, ctx) : recog(item, pool, ctx);
}

// ───────── 小元件 ─────────

function CardFace({ c, face, lang, onClick, dim, sel, small }: { c: D.CardInst; face?: { s: string; lang: LangId | 'zh' }; lang: LangId; onClick?: () => void; dim?: boolean; sel?: boolean; small?: boolean }) {
  const d = D.CARDS[c.id];
  const cls = cx('dcard', `t-${d.type}`, `r-${d.rarity}`, c.plus && 'plus', dim && 'dim', sel && 'sel', small && 'small');
  const inner = (
    <>
      <span className="dcard-cost">{D.costOf(c)}</span>
      <span className="dcard-icon" aria-hidden>
        {d.icon}
      </span>
      <b className="dcard-name">{D.cardName(c)}</b>
      <small className="dcard-type">{D.TYPE_NAME[d.type]}</small>
      <span className="dcard-text">{D.cardText(c)}</span>
      {face && (
        <span className="dcard-word">
          <Tx s={face.s} lang={face.lang === 'zh' ? 'zh' : lang} />
        </span>
      )}
    </>
  );
  return onClick ? (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

function HpBar({ hp, max, block }: { hp: number; max: number; block: number }) {
  return (
    <div className={cx('dhp', block > 0 && 'blocked')}>
      <i style={{ width: `${Math.max(0, (hp / max) * 100)}%` }} />
      <span>
        {hp} / {max}
        {block > 0 && <b className="dhp-block">🛡️{block}</b>}
      </span>
    </div>
  );
}

function Statuses({ f, extra = [] }: { f: D.Fighter; extra?: [string, number, string][] }) {
  const list: [string, number, string][] = [
    ['💪 力量', f.str, '每次攻擊多造成這麼多傷害'],
    ['🥀 虛弱', f.weak, '造成的傷害 -25%（回合數）'],
    ['💔 易傷', f.vuln, '受到的傷害 +50%（回合數）'],
    ['☠️ 中毒', f.poison, '回合開始時失去這麼多生命，然後減 1'],
    ...extra,
  ];
  const shown = list.filter(([, n]) => n > 0);
  if (!shown.length) return null;
  return (
    <div className="dstatus">
      {shown.map(([name, n, tip]) => (
        <span key={name} className="chip" title={tip}>
          {name} {n}
        </span>
      ))}
    </div>
  );
}

interface Float {
  key: number;
  who: 'player' | number;
  kind: D.Fx['kind'];
  text: string;
}

function Floats({ list, who }: { list: Float[]; who: 'player' | number }) {
  return (
    <>
      {list
        .filter((f) => f.who === who)
        .map((f, i) => (
          <span key={f.key} className={cx('dfloat', f.kind)} style={{ '--i': i } as CSSProperties}>
            {f.text}
          </span>
        ))}
    </>
  );
}

function FloorTrack({ run }: { run: D.Run }) {
  return (
    <ol className="dfloors" aria-label={`第 ${run.floor} / ${D.FLOORS} 層`}>
      {D.PLAN.map((opts, i) => (
        <li key={i} className={cx(i + 1 < run.floor && 'done', i + 1 === run.floor && 'now')} title={`第 ${i + 1} 層`}>
          {i + 1 === D.FLOORS ? '👹' : i + 1 < run.floor ? '✓' : opts.length > 1 ? '?' : D.NODE_INFO[opts[0]].icon}
        </li>
      ))}
    </ol>
  );
}

function DeckList({ deck, lang, pick, filter }: { deck: D.CardInst[]; lang: LangId; pick?: (c: D.CardInst) => void; filter?: (c: D.CardInst) => boolean }) {
  return (
    <div className="ddeck">
      {D.sortedDeck(deck).map((c) => {
        const ok = !filter || filter(c);
        return <CardFace key={c.uid} c={c} lang={lang} small dim={!ok} onClick={pick && ok ? () => pick(c) : undefined} />;
      })}
    </div>
  );
}

// ───────── 答題 ─────────

interface Quiz {
  uid: number;
  target?: number;
  ex: ChoiceEx;
  item: VocabItem;
  seconds: number;
  started: number;
  picked?: number;
}

function QuizPanel({ quiz, lang, title, onPick, onDone }: { quiz: Quiz; lang: LangId; title: ReactNode; onPick: (i: number) => void; onDone: () => void }) {
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

// ───────── 主畫面 ─────────

export function CardDuelPage({ lang }: { lang: LangId }) {
  const n = learnedVocab(getSave(), lang).filter(wordsOk).length;
  if (n < UNLOCK.duel) {
    return (
      <Blocked lang={lang} icon="🃏" title="單字卡牌對決尚未解鎖" back={`/l/${lang}/arcade`}>
        學會 {UNLOCK.duel} 個單字或短句之後就能開始冒險（目前 {n} 個）。牌上的字都是你學過的字。
      </Blocked>
    );
  }
  return <Duel lang={lang} />;
}

function Duel({ lang }: { lang: LangId }) {
  const s = useSave();
  const words = useWords(lang);
  const back = `/l/${lang}/arcade`;
  const [run, setRun] = useState<D.Run | null>(() => loadRun(lang));
  const [playing, setPlaying] = useState(false);
  const runRef = useRef(run);
  const recent = useRef<string[]>([]);
  const [floats, setFloats] = useState<Float[]>([]);
  const floatKey = useRef(0);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [target, setTarget] = useState<number | undefined>();
  const [deckOpen, setDeckOpen] = useState(false);
  const [relicOpen, setRelicOpen] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [shake, setShake] = useState<number | null>(null);

  const commit = (d: D.Run | null) => {
    runRef.current = d;
    storeRun(lang, d);
    setRun(d);
  };

  const showFx = (fx: D.Fx[]) => {
    if (!fx.length) return;
    const add = fx.map((f) => ({ ...f, key: ++floatKey.current }));
    setFloats((x) => [...x, ...add]);
    const keys = new Set(add.map((f) => f.key));
    setTimeout(() => setFloats((x) => x.filter((f) => !keys.has(f.key))), 1300);
    if (fx.some((f) => f.kind === 'dmg')) sfx.pop();
  };

  /** 在 run 的副本上做事，存檔並更新畫面 */
  const act = (fn: (d: D.Run) => D.Fx[] | null | void) => {
    const cur = runRef.current;
    if (!cur) return;
    const d = structuredClone(cur);
    const fx = fn(d) ?? [];
    if (d.battle && !d.battle.over) D.assignWords(d.battle, words.ids, Math.random, recent.current);
    commit(d);
    showFx(fx);
  };

  const begin = (hard: boolean) => {
    const r = D.newRun(hard);
    commit(r);
    setPlaying(true);
    setResult(null);
    sfx.tap();
  };

  // 冒險結束：結算一次
  useEffect(() => {
    if (!run || run.stage !== 'over' || result) return;
    const { parts, coins } = D.runReward(run);
    const win = run.result === 'win';
    if (win) sfx.complete();
    else sfx.fail();
    const accuracy = run.stats.answered ? Math.round((run.stats.correct / run.stats.answered) * 100) : 0;
    setResult({
      emoji: win ? '👑' : '🃏',
      headline: win ? '打倒考試大魔王！' : `在第 ${run.floor} 層倒下了…`,
      sub: win ? (run.hard ? '困難模式通關，真正的單字戰士！' : '下次挑戰困難模式吧！') : '答錯的字已經排進複習，下一次一定走得更遠。',
      outcome: finishGame({ lang, game: 'duel', parts, coins, score: win ? D.FLOORS : run.floor, win }),
      lines: [
        ['抵達', win ? '全部 10 層' : `第 ${run.floor} 層`],
        ['答對率', `${accuracy}%（${run.stats.correct} / ${run.stats.answered}）`],
        ['牌組', `${run.deck.length} 張`],
        ['遺物', run.relics.map((r) => D.RELICS[r].icon).join(' ') || '—'],
      ],
      back,
      backLabel: '回到遊樂場',
      again: {
        label: '再冒險一次',
        run: () => {
          commit(null);
          setResult(null);
          setPlaying(false);
        },
      },
    });
    storeRun(lang, null);
  }, [run, result, lang, back]);

  if (result) return <ResultScreen data={result} lang={lang} />;

  if (!run || !playing) {
    return <StartScreen lang={lang} saved={run} best={s.best.duel?.[lang] ?? 0} wins={s.stats.duelWins} onBegin={begin} onContinue={() => setPlaying(true)} onExit={() => nav(back)} />;
  }

  const b = run.battle;

  const playCard = (i: number) => {
    if (!b || quiz) return;
    const c = b.hand[i];
    if (!D.canPlay(b, c)) {
      setShake(c.uid);
      setTimeout(() => setShake(null), 400);
      sfx.wrong();
      return;
    }
    const item = c.word ? words.get(c.word) : undefined;
    if (!item) return;
    const mode = qmodeOf(c, item, lang);
    const live = b.enemies.filter((e) => e.hp > 0);
    sfx.tap();
    setQuiz({
      uid: c.uid,
      target: D.CARDS[c.id].target ? (live.find((e) => e.uid === target) ?? live[0])?.uid : undefined,
      ex: buildQuiz(mode, item, words.pool(item), lang),
      item,
      seconds: D.answerSeconds(run),
      started: Date.now(),
    });
  };

  const pick = (i: number) => {
    if (!quiz || quiz.picked !== undefined) return;
    const ok = i === quiz.ex.answer;
    if (ok) sfx.correct(b?.streak ?? 0);
    else sfx.wrong();
    recordAnswer(quiz.item.id, ok, 'game');
    setQuiz({ ...quiz, picked: i });
  };

  const resolve = () => {
    const q = quiz;
    if (!q || q.picked === undefined) return;
    setQuiz(null);
    recent.current = [q.item.id, ...recent.current].slice(0, 8);
    act((d) => {
      const idx = d.battle?.hand.findIndex((c) => c.uid === q.uid) ?? -1;
      return idx < 0 ? null : D.playCard(d, idx, q.target, q.picked === q.ex.answer, Math.random);
    });
  };

  const endTurn = () => {
    if (quiz) return;
    sfx.tap();
    act((d) => D.endTurn(d, Math.random));
  };

  return (
    <div className="game-page duel" style={{ '--lang': META[lang].color } as CSSProperties}>
      <header className="session-top duel-top">
        <button type="button" className="icon-btn" aria-label="離開（進度會保留）" title="離開（進度會保留）" onClick={() => nav(back)}>
          ✕
        </button>
        <div className="session-progress">
          <small>
            單字卡牌對決{run.hard && '・困難'}・第 {run.floor} / {D.FLOORS} 層
          </small>
          <FloorTrack run={run} />
        </div>
        <button type="button" className="combo on" onClick={() => setDeckOpen(true)} title="查看牌組">
          🂠 {run.deck.length}
        </button>
      </header>
      <div className="duel-bar">
        <span className="duel-hp">❤️ {b ? b.player.hp : run.hp} / {run.maxHp}</span>
        <button type="button" className="duel-relics" onClick={() => setRelicOpen(true)} disabled={!run.relics.length} title="遺物">
          {run.relics.length ? run.relics.map((r) => <span key={r}>{D.RELICS[r].icon}</span>) : <small className="muted">還沒有遺物</small>}
        </button>
      </div>

      <main className="duel-body">
        {run.stage === 'map' && <MapView run={run} onPick={(k) => act((d) => D.enterNode(d, k, Math.random))} />}
        {run.stage === 'battle' && b && (
          <BattleView
            run={run}
            b={b}
            lang={lang}
            words={words}
            floats={floats}
            target={target}
            setTarget={setTarget}
            shake={shake}
            busy={!!quiz}
            onPlay={playCard}
            onEnd={endTurn}
          />
        )}
        {run.stage === 'reward' && run.reward && <RewardView run={run} lang={lang} onTake={(uid) => act((d) => D.takeReward(d, uid))} />}
        {run.stage === 'rest' && (
          <RestView
            run={run}
            lang={lang}
            onHeal={() =>
              act((d) => {
                D.heal(d, D.restHeal(d));
                D.advance(d);
              })
            }
            onUpgrade={(uid) =>
              act((d) => {
                D.upgradeCard(d, uid);
                D.advance(d);
              })
            }
          />
        )}
        {run.stage === 'event' && run.event && <EventView run={run} lang={lang} words={words} act={act} />}
        {run.stage === 'treasure' && (
          <section className="card duel-panel">
            <div className="duel-big-icon">🎁</div>
            {run.found ? (
              <>
                <h2>
                  得到遺物：{D.RELICS[run.found].icon} {D.RELICS[run.found].name}
                </h2>
                <p className="muted">{D.RELICS[run.found].desc}</p>
              </>
            ) : (
              <h2>寶箱是空的……遺物已經全部收集齊了！</h2>
            )}
            <button type="button" className="btn primary wide" onClick={() => act((d) => D.advance(d))}>
              繼續前進
            </button>
          </section>
        )}
      </main>

      {quiz && b && (
        <div className="dquiz-wrap">
          <QuizPanel
            quiz={quiz}
            lang={lang}
            onPick={pick}
            onDone={resolve}
            title={
              <span className="dquiz-title">
                {D.CARDS[b.hand.find((c) => c.uid === quiz.uid)?.id ?? 'strike'].icon} 答對發動
                {b.streak + 1 >= D.critNeed(run) && <b className="crit-tag">會心一擊準備！</b>}
              </span>
            }
          />
        </div>
      )}

      {deckOpen && (
        <Modal className="duel-modal" onClose={() => setDeckOpen(false)}>
          <h2>牌組（{run.deck.length} 張）</h2>
          <DeckList deck={run.deck} lang={lang} />
          <div className="modal-actions">
            <button type="button" className="btn primary" onClick={() => setDeckOpen(false)}>
              關閉
            </button>
          </div>
        </Modal>
      )}
      {relicOpen && (
        <Modal className="duel-modal" onClose={() => setRelicOpen(false)}>
          <h2>遺物</h2>
          <ul className="drelic-list">
            {run.relics.map((r) => (
              <li key={r}>
                <span>{D.RELICS[r].icon}</span>
                <div>
                  <b>{D.RELICS[r].name}</b>
                  <small className="muted">{D.RELICS[r].desc}</small>
                </div>
              </li>
            ))}
          </ul>
          <div className="modal-actions">
            <button type="button" className="btn primary" onClick={() => setRelicOpen(false)}>
              關閉
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StartScreen({
  lang,
  saved,
  best,
  wins,
  onBegin,
  onContinue,
  onExit,
}: {
  lang: LangId;
  saved: D.Run | null;
  best: number;
  wins: number;
  onBegin: (hard: boolean) => void;
  onContinue: () => void;
  onExit: () => void;
}) {
  return (
    <div className="page narrow duel-start" style={{ '--lang': META[lang].color } as CSSProperties}>
      <button type="button" className="back-link link-btn" onClick={onExit}>
        ← 遊樂場
      </button>
      <section className="card duel-hero">
        <div className="duel-hero-art">
          <MonsterArt id="slime" size={72} />
          <MonsterArt id="demon" size={110} />
          <MonsterArt id="ghost" size={72} />
        </div>
        <h1>單字卡牌對決</h1>
        <p className="muted">用學過的單字組成牌組，一路打上 10 層，打倒最後的考試大魔王！</p>
        <ul className="duel-rules">
          <li>每回合 3 點能量、抽 5 張牌。出牌前要回答牌上的單字：攻擊牌考「意思」、防禦牌考「怎麼說」、技能牌{lang === 'ja' ? '考漢字讀音' : '考意思'}。</li>
          <li>
            答對全力發動；<b>連續答對 3 題</b>以上變成「會心一擊」，威力 1.5 倍。答錯威力減半，連對歸零。
          </li>
          <li>看清楚怪物頭上的意圖（⚔️ 攻擊、🛡️ 防禦、💪 變強、☠️ 負面狀態），決定要進攻還是擋。</li>
          <li>打贏可以挑新牌、在營火升級牌、在精英和寶箱拿遺物。路線怎麼走也是策略！</li>
        </ul>
        <div className="duel-start-btns">
          {saved && (
            <button type="button" className="btn primary wide" onClick={onContinue}>
              ▶ 繼續冒險（第 {saved.floor} 層・❤️ {saved.battle ? saved.battle.player.hp : saved.hp}）
            </button>
          )}
          <button
            type="button"
            className={cx('btn wide', saved ? 'ghost' : 'primary')}
            onClick={() => {
              if (!saved || confirm('要放棄目前的冒險，重新開始嗎？')) onBegin(false);
            }}
          >
            新的冒險・普通
          </button>
          <button
            type="button"
            className="btn wide danger"
            onClick={() => {
              if (!saved || confirm('要放棄目前的冒險，重新開始嗎？')) onBegin(true);
            }}
          >
            新的冒險・困難（答題 8 秒、答錯直接失手、怪物更強）
          </button>
        </div>
        <p className="muted small">
          最高紀錄：{best >= D.FLOORS ? '已通關 👑' : best > 0 ? `第 ${best} 層` : '還沒挑戰過'}
          {wins > 0 && `・通關 ${wins} 次`}
        </p>
      </section>
    </div>
  );
}

function MapView({ run, onPick }: { run: D.Run; onPick: (k: D.NodeKind) => void }) {
  return (
    <section className="duel-map">
      <h2>{run.floor === 1 ? '冒險開始！' : `第 ${run.floor} 層`}</h2>
      <p className="muted">{run.options.length > 1 ? '選一條路前進：' : '前方只有一條路。'}</p>
      <div className="duel-nodes">
        {run.options.map((k) => (
          <button key={k} type="button" className={cx('duel-node card', `n-${k}`)} onClick={() => onPick(k)}>
            <span className="duel-node-icon">{D.NODE_INFO[k].icon}</span>
            <b>{D.NODE_INFO[k].name}</b>
            <small className="muted">{D.NODE_INFO[k].desc}</small>
          </button>
        ))}
      </div>
      <p className="muted small">❤️ 生命 {run.hp} / {run.maxHp}：生命不會在戰鬥之間自動回滿，記得到營火休息。</p>
    </section>
  );
}

function BattleView({
  run,
  b,
  lang,
  words,
  floats,
  target,
  setTarget,
  shake,
  busy,
  onPlay,
  onEnd,
}: {
  run: D.Run;
  b: D.Battle;
  lang: LangId;
  words: Words;
  floats: Float[];
  target?: number;
  setTarget: (uid: number) => void;
  shake: number | null;
  busy: boolean;
  onPlay: (i: number) => void;
  onEnd: () => void;
}) {
  const live = b.enemies.filter((e) => e.hp > 0);
  const tgt = live.find((e) => e.uid === target) ?? live[0];
  const hurt = (who: 'player' | number) => floats.some((f) => f.who === who && f.kind === 'dmg');
  return (
    <div className="dbattle">
      <div className="denemies">
        {b.enemies.map((e) => {
          if (e.hp <= 0) return null;
          const it = D.intentOf(e, b.player);
          return (
            <button
              key={e.uid}
              type="button"
              className={cx('denemy', live.length > 1 && tgt?.uid === e.uid && 'targeted', hurt(e.uid) && 'hurt', D.ENEMIES[e.id].tier !== 'normal' && D.ENEMIES[e.id].tier)}
              onClick={() => setTarget(e.uid)}
              title={live.length > 1 ? '點一下選為攻擊目標' : undefined}
            >
              <span className={cx('dintent', it.kind)}>
                {it.icon} {it.text}
              </span>
              <span className="denemy-art">
                <MonsterArt id={e.id} size="100%" />
              </span>
              <b className="denemy-name">{D.ENEMIES[e.id].name}</b>
              <HpBar hp={e.hp} max={e.maxHp} block={e.block} />
              <Statuses f={e} />
              <Floats list={floats} who={e.uid} />
            </button>
          );
        })}
      </div>

      <div className={cx('dplayer card', hurt('player') && 'hurt')}>
        <div className="dplayer-row">
          <div className="denergy" title="能量">
            {Array.from({ length: Math.max(b.maxEnergy, b.energy) }, (_, i) => (
              <i key={i} className={cx(i < b.energy && 'on')} />
            ))}
            <b>{b.energy}</b>
          </div>
          <div className="grow">
            <HpBar hp={b.player.hp} max={b.player.maxHp} block={b.player.block} />
          </div>
          <span className={cx('dstreak', b.streak >= D.critNeed(run) && 'hot', b.streak > 0 && 'on')} title={`連對 ${D.critNeed(run)} 題以上，下一張牌會心一擊`}>
            🔥 {b.streak}
          </span>
        </div>
        <Statuses
          f={b.player}
          extra={[
            ['🔔 金鐘罩', b.armor, '回合結束時獲得格擋'],
            ['✨ 智慧之光', b.bless, '答對一題獲得格擋'],
            ['🎓 學霸', b.extraDraw, '每回合多抽牌'],
            ['🔁 雙重詠唱', b.echo, '下一張攻擊牌發動兩次'],
          ]}
        />
        <Floats list={floats} who="player" />
      </div>

      <div className="dhand">
        {b.hand.map((c, i) => {
          const item = c.word ? words.get(c.word) : undefined;
          const face = item ? faceOf(qmodeOf(c, item, lang), item, lang) : undefined;
          return <CardFace key={c.uid} c={c} face={face} lang={lang} dim={!D.canPlay(b, c)} sel={shake === c.uid} onClick={busy ? undefined : () => onPlay(i)} />;
        })}
        {!b.hand.length && <p className="muted">手牌用完了，結束回合吧。</p>}
      </div>

      <div className="dpiles">
        <small className="muted">
          抽牌堆 {b.draw.length}・棄牌堆 {b.discard.length}
          {b.exhaust.length > 0 && `・已消耗 ${b.exhaust.length}`}・第 {b.turn} 回合
        </small>
        <button type="button" className="btn primary" onClick={onEnd} disabled={busy}>
          結束回合 ⏭
        </button>
      </div>
    </div>
  );
}

function RewardView({ run, lang, onTake }: { run: D.Run; lang: LangId; onTake: (uid: number | null) => void }) {
  const rw = run.reward!;
  return (
    <section className="card duel-panel">
      <div className="duel-big-icon">🏆</div>
      <h2>{run.battle ? '戰鬥勝利！' : '獲得獎勵'}</h2>
      {rw.relic && (
        <p className="drelic-got">
          得到遺物：<b>
            {D.RELICS[rw.relic].icon} {D.RELICS[rw.relic].name}
          </b>
          <small className="muted">{D.RELICS[rw.relic].desc}</small>
        </p>
      )}
      <p className="muted">選一張牌加進牌組（也可以跳過，牌組精簡一點比較容易抽到好牌）：</p>
      <div className="dchoices">
        {rw.cards.map((c) => (
          <CardFace key={c.uid} c={c} lang={lang} onClick={() => onTake(c.uid)} />
        ))}
      </div>
      <button type="button" className="btn ghost wide" onClick={() => onTake(null)}>
        跳過
      </button>
    </section>
  );
}

function RestView({ run, lang, onHeal, onUpgrade }: { run: D.Run; lang: LangId; onHeal: () => void; onUpgrade: (uid: number) => void }) {
  const [up, setUp] = useState(false);
  const canUp = run.deck.some((c) => !c.plus);
  return (
    <section className="card duel-panel">
      <div className="duel-big-icon">🔥</div>
      <h2>營火</h2>
      {!up ? (
        <>
          <p className="muted">暖暖的營火旁，可以做一件事：</p>
          <div className="duel-nodes">
            <button type="button" className="duel-node card" onClick={onHeal} disabled={run.hp >= run.maxHp}>
              <span className="duel-node-icon">💤</span>
              <b>休息</b>
              <small className="muted">
                回復 {D.restHeal(run)} 點生命（{run.hp} / {run.maxHp}）
              </small>
            </button>
            <button type="button" className="duel-node card" onClick={() => setUp(true)} disabled={!canUp}>
              <span className="duel-node-icon">⚒️</span>
              <b>鍛鍊</b>
              <small className="muted">升級一張牌：數值變強，有些牌費用變少</small>
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="muted">選一張要升級的牌：</p>
          <DeckList deck={run.deck} lang={lang} pick={(c) => onUpgrade(c.uid)} filter={(c) => !c.plus} />
          <button type="button" className="btn ghost wide" onClick={() => setUp(false)}>
            ← 返回
          </button>
        </>
      )}
    </section>
  );
}

function EventView({ run, lang, words, act }: { run: D.Run; lang: LangId; words: Words; act: (fn: (d: D.Run) => D.Fx[] | null | void) => void }) {
  const ev = D.EVENTS[run.event!];
  const [mode, setMode] = useState<'intro' | 'pick'>('intro');
  const leave = () => act((d) => D.advance(d));
  let body: ReactNode = null;
  switch (run.event) {
    case 'shop':
      body =
        mode === 'pick' ? (
          <>
            <p className="muted">選一張要移除的牌（牌組至少要留 5 張）：</p>
            <DeckList
              deck={run.deck}
              lang={lang}
              pick={(c) =>
                act((d) => {
                  D.removeCard(d, c.uid);
                  D.advance(d);
                })
              }
            />
          </>
        ) : (
          <EventBtns
            btns={[
              ['🗑️ 移除一張牌', () => setMode('pick'), run.deck.length <= 5],
              ['離開', leave],
            ]}
          />
        );
      break;
    case 'dojo':
      body =
        mode === 'pick' ? (
          <>
            <p className="muted">選一張要升級的牌：</p>
            <DeckList
              deck={run.deck}
              lang={lang}
              filter={(c) => !c.plus}
              pick={(c) =>
                act((d) => {
                  D.upgradeCard(d, c.uid);
                  D.advance(d);
                })
              }
            />
          </>
        ) : (
          <EventBtns
            btns={[
              ['⚒️ 接受指點', () => setMode('pick'), !run.deck.some((c) => !c.plus)],
              ['離開', leave],
            ]}
          />
        );
      break;
    case 'chest':
      body = (
        <EventBtns
          btns={[
            [
              '🧰 打開寶箱（-6 生命）',
              () =>
                act((d) => {
                  D.loseHp(d, 6);
                  d.found = D.randomRelic(d, Math.random);
                  if (d.found) d.relics.push(d.found);
                  d.stage = 'treasure';
                }),
            ],
            ['離開', leave],
          ]}
        />
      );
      break;
    case 'merchant':
      body = (
        <EventBtns
          btns={[
            [
              '🤝 交易（-8 生命，挑一張稀有牌）',
              () =>
                act((d) => {
                  D.loseHp(d, 8);
                  d.reward = { cards: D.rollCards(d, Math.random, false, 'rare') };
                  d.stage = 'reward';
                }),
              run.hp <= 8,
            ],
            ['離開', leave],
          ]}
        />
      );
      break;
    case 'fortune':
      body = (
        <EventBtns
          btns={[
            [
              '💚 回復 12 點生命',
              () =>
                act((d) => {
                  D.heal(d, 12);
                  D.advance(d);
                }),
            ],
            [
              '🃏 隨機一張好牌',
              () =>
                act((d) => {
                  d.reward = { cards: D.rollCards(d, Math.random, true, 'uncommon').slice(0, 1) };
                  d.stage = 'reward';
                }),
            ],
          ]}
        />
      );
      break;
    case 'spring':
      body = (
        <SpringQuiz
          lang={lang}
          words={words}
          onDone={(n) =>
            act((d) => {
              D.gainMaxHp(d, n * 3);
              D.advance(d);
            })
          }
        />
      );
      break;
  }
  return (
    <section className="card duel-panel">
      <div className="duel-big-icon">{ev.icon}</div>
      <h2>{ev.name}</h2>
      <p>{ev.text}</p>
      {body}
    </section>
  );
}

function EventBtns({ btns }: { btns: [string, () => void, boolean?][] }) {
  return (
    <div className="duel-event-btns">
      {btns.map(([label, fn, off]) => (
        <button key={label} type="button" className="btn wide" onClick={fn} disabled={off}>
          {label}
        </button>
      ))}
    </div>
  );
}

/** 知識之泉：連答 3 題 */
function SpringQuiz({ lang, words, onDone }: { lang: LangId; words: Words; onDone: (correct: number) => void }) {
  const [items] = useState(() => sample(words.ids, 3).map((id) => words.get(id)!).filter(Boolean));
  const [i, setI] = useState(0);
  const [ok, setOk] = useState(0);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  useEffect(() => {
    const item = items[i];
    if (!item) return;
    setQuiz({ uid: i, ex: buildQuiz('w2m', item, words.pool(item), lang), item, seconds: 15, started: Date.now() });
  }, [i, items, words, lang]);
  if (i >= items.length || !quiz) {
    return (
      <div className="duel-event-btns">
        <p>
          答對 {ok} 題：最大生命 +{ok * 3}。
        </p>
        <button type="button" className="btn primary wide" onClick={() => onDone(ok)}>
          繼續前進
        </button>
      </div>
    );
  }
  return (
    <QuizPanel
      quiz={quiz}
      lang={lang}
      title={<span className="dquiz-title">第 {i + 1} / 3 題</span>}
      onPick={(p) => {
        if (quiz.picked !== undefined) return;
        const right = p === quiz.ex.answer;
        recordAnswer(quiz.item.id, right, 'game');
        if (right) {
          sfx.correct();
          setOk((x) => x + 1);
        } else sfx.wrong();
        setQuiz({ ...quiz, picked: p });
      }}
      onDone={() => {
        setQuiz(null);
        setI((x) => x + 1);
      }}
    />
  );
}
