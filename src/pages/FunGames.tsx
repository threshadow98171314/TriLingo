// 遊樂場的兩個小遊戲：看圖猜字（圖片題），分類大挑戰（把字放進正確的主題／詞性）。
import { useState, type CSSProperties } from 'react';
import { ResultScreen, type ResultData } from '../components/Result';
import { Session } from '../components/Session';
import { Bar, SpeakBtn, Tx } from '../components/ui';
import { courseIndex, META } from '../content';
import { learnedVocab, UNLOCK } from '../core/progress';
import { sample, shuffle } from '../core/rng';
import { sfx } from '../core/sfx';
import { finishGame, getSave, recordAnswer, type SessionStats } from '../core/store';
import { useVoices } from '../core/tts';
import type { LangId, VocabItem } from '../core/types';
import { cx } from '../core/util';
import { front, isVocab, picEx, sayOf, type Exercise } from '../engine/exercises';
import { pictureOf } from '../engine/pictures';
import { nav } from '../router';
import { Blocked, ctxOf, statLines } from './Practice';

// ───────── 看圖猜字 ─────────

export function PicturesPage({ lang }: { lang: LangId }) {
  useVoices();
  const build = (): Exercise[] => {
    const idx = courseIndex(lang).items;
    const words = learnedVocab(getSave(), lang).filter((i) => i.kind !== 'char' && pictureOf(i.m));
    if (words.length < UNLOCK.pics) return [];
    const ctx = ctxOf(lang);
    return sample(words, 10)
      .map((i, k) => {
        const pool = idx.get(i.id)!.unit.items.filter(isVocab);
        return (k % 2 === 1 && picEx(i, pool, ctx, 'pic2w')) || picEx(i, pool, ctx, 'w2pic');
      })
      .filter((e): e is NonNullable<typeof e> => !!e);
  };
  const [{ run, exercises }, setGame] = useState(() => ({ run: 0, exercises: build() }));
  const restart = () => setGame((g) => ({ run: g.run + 1, exercises: build() }));
  const back = `/l/${lang}/arcade`;

  if (!exercises.length) {
    return (
      <Blocked lang={lang} icon="🖼️" title="看圖猜字尚未解鎖" back={`/l/${lang}`}>
        學會 {UNLOCK.pics} 個有插圖的字（動物、食物、地點、日用品…）之後就能開始。
      </Blocked>
    );
  }

  const onFinish = (stats: SessionStats): ResultData => ({
    emoji: '🖼️',
    headline: '看圖猜字完成！',
    sub: stats.correct === stats.graded ? '每一張圖都認得，太厲害了！' : '答錯的字已經排進複習。',
    outcome: finishGame({
      lang,
      game: 'pics',
      parts: [
        ['完成看圖猜字', 5],
        ['答對題數', stats.correct],
      ],
      maxCombo: stats.maxCombo,
    }),
    lines: statLines(stats),
    back,
    backLabel: '回到遊樂場',
    again: { label: '再玩一輪', run: restart },
  });

  return <Session key={run} lang={lang} title="看圖猜字" exercises={exercises} mode="game" exitTo={back} onFinish={onFinish} />;
}

// ───────── 分類大挑戰 ─────────

interface Bucket {
  id: string;
  icon: string;
  title: string;
}

interface Chip {
  item: VocabItem;
  bucket: string;
}

interface Round {
  buckets: Bucket[];
  chips: Chip[];
  /** 這一回合在分什麼 */
  kind: 'topic' | 'pos';
}

const POS_NAME: Record<string, string> = { 'n.': '名詞', 'v.': '動詞', 'adj.': '形容詞', 'adv.': '副詞' };
const POS_ICON: Record<string, string> = { 'n.': '📦', 'v.': '🏃', 'adj.': '🎨', 'adv.': '⚡' };

/** 主題分類：學過至少 3 個字的單元（或單字庫的組） */
function topicGroups(lang: LangId, words: VocabItem[]): Map<string, { bucket: Bucket; items: VocabItem[] }> {
  const idx = courseIndex(lang).items;
  const groups = new Map<string, { bucket: Bucket; items: VocabItem[] }>();
  for (const w of words) {
    const u = idx.get(w.id)?.unit;
    if (!u) continue;
    const g = groups.get(u.title) ?? { bucket: { id: u.id, icon: u.icon, title: u.title }, items: [] };
    g.items.push(w);
    groups.set(u.title, g);
  }
  for (const [k, g] of groups) if (g.items.length < 3) groups.delete(k);
  return groups;
}

/** 英文詞性分類 */
function posGroups(words: VocabItem[]): Map<string, { bucket: Bucket; items: VocabItem[] }> {
  const groups = new Map<string, { bucket: Bucket; items: VocabItem[] }>();
  for (const w of words) {
    const p = w.pos?.split('/')[0].trim();
    if (!p || !POS_NAME[p] || w.kind !== 'word') continue;
    const g = groups.get(p) ?? { bucket: { id: p, icon: POS_ICON[p], title: POS_NAME[p] }, items: [] };
    g.items.push(w);
    groups.set(p, g);
  }
  for (const [k, g] of groups) if (g.items.length < 3) groups.delete(k);
  return groups;
}

function makeRounds(lang: LangId): Round[] {
  const words = learnedVocab(getSave(), lang).filter((i) => i.kind !== 'char');
  const topics = topicGroups(lang, words);
  const pos: ReturnType<typeof posGroups> = lang === 'en' ? posGroups(words) : new Map();
  if (topics.size < 2 && pos.size < 2) return [];
  const rounds: Round[] = [];
  for (let r = 0; r < 3; r++) {
    // 英文第二回合改分詞性（多益 Part 5 最常考的就是詞性）
    const usePos = lang === 'en' && r === 1 && pos.size >= 2;
    const src = usePos ? pos : topics.size >= 2 ? topics : pos;
    const n = r === 2 && src.size >= 3 ? 3 : 2;
    const picked = sample([...src.values()], n);
    const chips: Chip[] = [];
    const seen = new Set<string>();
    for (const g of picked) {
      for (const it of shuffle(g.items)) {
        // 同一個原文只出現一次，免得兩個分類都對
        const key = front(it, lang);
        if (seen.has(key)) continue;
        seen.add(key);
        chips.push({ item: it, bucket: g.bucket.id });
        if (chips.filter((c) => c.bucket === g.bucket.id).length >= 3) break;
      }
    }
    rounds.push({ buckets: picked.map((g) => g.bucket), chips: shuffle(chips), kind: usePos ? 'pos' : 'topic' });
  }
  return rounds;
}

export function SortPage({ lang }: { lang: LangId }) {
  useVoices();
  const [game, setGame] = useState(() => ({ run: 0, rounds: makeRounds(lang) }));
  const back = `/l/${lang}/arcade`;
  if (!game.rounds.length) {
    return (
      <Blocked lang={lang} icon="🗂️" title="分類大挑戰尚未解鎖" back={`/l/${lang}`}>
        至少要在兩個單元各學會 3 個字，才分得出類別。
      </Blocked>
    );
  }
  return <SortGame key={game.run} lang={lang} rounds={game.rounds} back={back} onAgain={() => setGame((g) => ({ run: g.run + 1, rounds: makeRounds(lang) }))} />;
}

function SortGame({ lang, rounds, back, onAgain }: { lang: LangId; rounds: Round[]; back: string; onAgain: () => void }) {
  const [ri, setRi] = useState(0);
  /** 每個字目前放在哪一個分類（還沒放是 undefined） */
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [sel, setSel] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ right: 0, total: 0, start: Date.now() });
  const [result, setResult] = useState<ResultData | null>(null);
  const round = rounds[ri];
  const allPlaced = round.chips.every((c) => placed[c.item.id]);

  const put = (bucket: string) => {
    if (!sel || checked) return;
    sfx.tap();
    setPlaced((p) => ({ ...p, [sel]: bucket }));
    setSel(null);
  };
  const check = () => {
    if (!allPlaced || checked) return;
    let right = 0;
    for (const c of round.chips) {
      const ok = placed[c.item.id] === c.bucket;
      if (ok) right++;
      recordAnswer(c.item.id, ok, 'game');
    }
    if (right === round.chips.length) sfx.correct(3);
    else sfx.wrong();
    setScore((s) => ({ ...s, right: s.right + right, total: s.total + round.chips.length }));
    setChecked(true);
  };
  const next = () => {
    if (ri + 1 < rounds.length) {
      setRi(ri + 1);
      setPlaced({});
      setSel(null);
      setChecked(false);
      return;
    }
    const stats: SessionStats = { graded: score.total, correct: score.right, maxCombo: 0, seconds: Math.round((Date.now() - score.start) / 1000) };
    setResult({
      emoji: '🗂️',
      headline: score.right === score.total ? '全部分對了！' : '分類大挑戰完成！',
      sub: '分錯的字已經排進複習。分類記憶法：把字和情境綁在一起，記得更牢。',
      outcome: finishGame({
        lang,
        game: 'sort',
        parts: [
          ['完成分類大挑戰', 5],
          ['分對的字', score.right],
        ],
      }),
      lines: statLines(stats),
      back,
      backLabel: '回到遊樂場',
      again: { label: '再玩一次', run: onAgain },
    });
  };

  if (result) return <ResultScreen data={result} lang={lang} />;

  const loose = round.chips.filter((c) => !placed[c.item.id]);
  return (
    <div className="game-page sort-game" style={{ '--lang': META[lang].color } as CSSProperties}>
      <header className="session-top">
        <button type="button" className="icon-btn" aria-label="離開" onClick={() => nav(back)}>
          ✕
        </button>
        <div className="session-progress">
          <small>
            分類大挑戰・第 {ri + 1} / {rounds.length} 回合
          </small>
          <Bar v={(ri + (checked ? 1 : 0)) / rounds.length} color="var(--lang)" />
        </div>
        <div className="combo on">
          {score.right} / {score.total}
        </div>
      </header>
      <main className="session-body">
        <p className="ex-label">{round.kind === 'pos' ? '這些英文字是什麼詞性？先點一個字，再點它的詞性' : '這些字屬於哪個主題？先點一個字，再點它的分類'}</p>
        <div className="sort-pool">
          {loose.map((c) => (
            <button key={c.item.id} type="button" className={cx('sort-chip', sel === c.item.id && 'sel')} onClick={() => setSel(sel === c.item.id ? null : c.item.id)}>
              <Tx s={front(c.item, lang)} lang={lang} />
            </button>
          ))}
          {!loose.length && !checked && <span className="muted">全部放好了，按「檢查」看看對不對！</span>}
        </div>
        <div className={cx('sort-buckets', round.buckets.length === 3 && 'three')}>
          {round.buckets.map((b) => (
            <div key={b.id} className={cx('sort-bucket card', sel && !checked && 'ready')} onClick={() => put(b.id)} role="button" tabIndex={0}>
              <header>
                <span className="sort-icon">{b.icon}</span>
                <b>{b.title}</b>
              </header>
              <div className="sort-in">
                {round.chips
                  .filter((c) => placed[c.item.id] === b.id)
                  .map((c) => {
                    const ok = c.bucket === b.id;
                    return (
                      <button
                        key={c.item.id}
                        type="button"
                        className={cx('sort-chip in', checked && (ok ? 'right' : 'wrong'))}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!checked) setPlaced((p) => {
                            const { [c.item.id]: _, ...rest } = p;
                            return rest;
                          });
                        }}
                      >
                        <Tx s={front(c.item, lang)} lang={lang} />
                        {checked && (
                          <small>
                            {c.item.m}
                            {!ok && `（→ ${round.buckets.find((x) => x.id === c.bucket)?.title}）`}
                          </small>
                        )}
                        {checked && <SpeakBtn text={sayOf(c.item, lang)} lang={lang} size="sm" />}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="session-foot">
        {checked ? (
          <button type="button" className="btn primary wide" onClick={next} autoFocus>
            {ri + 1 < rounds.length ? '下一回合' : '看結果'}
          </button>
        ) : (
          <button type="button" className="btn primary wide" disabled={!allPlaced} onClick={check}>
            檢查
          </button>
        )}
      </footer>
    </div>
  );
}
