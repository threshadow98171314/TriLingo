// 語言主頁：學習路線、遊樂場、圖鑑、字母表四個分頁
import { useEffect, useState, type CSSProperties } from 'react';
import { RankLine } from '../components/RankEmblem';
import { Bar, ItemCard, LangBadge, Modal, Stars } from '../components/ui';
import { CourseGate } from '../components/CourseGate';
import { GuideTip } from '../components/Guide';
import { kanaPairs } from './Memory';
import { MockTab } from './Mock';
import { courseIndex, META, META_LIST, requireCourse } from '../content';
import { addDays, dayNum, today } from '../core/date';
import { mastery, MASTERY_LABEL } from '../core/logic';
import {
  crosswordPool,
  currentStage,
  dueItems,
  langStats,
  learnedItems,
  learnedVocab,
  lessonState,
  nextInStage,
  quickStats,
  stageState,
  starsOf,
  unitState,
  UNLOCK,
} from '../core/progress';
import type { Save } from '../core/save';
import { setStage, useSave } from '../core/store';
import { canSpeak, speak, useVoices } from '../core/tts';
import type { Item, LangId, Stage, VocabItem } from '../core/types';
import { cx, fmtTime } from '../core/util';
import { clozeSentence, isVocab, LANG_NAME, sayOf } from '../engine/exercises';
import { furiPlain } from '../engine/furigana';
import { basicTable } from '../engine/hangul';
import { href, lessonPath, stagePath } from '../router';

export type LangTab = 'path' | 'arcade' | 'mock' | 'dex' | 'chart';

// ───────── 學習路線 ─────────

function StageCard({ lang, stage, s, active }: { lang: LangId; stage: Stage; s: Save; active: boolean }) {
  const ss = stageState(s, stage);
  return (
    <a
      href={href(stagePath(lang, stage.id))}
      className={cx('stage-card', stage.style, active && 'active', !ss.ready && 'coming', ss.complete && 'complete')}
      style={{ '--c': stage.color } as CSSProperties}
    >
      {stage.style === 'cert' && <span className="cert-seal" aria-hidden />}
      {stage.style === 'track' && <span className="stage-icon">{stage.icon}</span>}
      <b lang={stage.style === 'level' ? lang : undefined}>{stage.short}</b>
      <small>{stage.subtitle}</small>
      <span className="stage-status">{!ss.ready ? '準備中' : ss.complete ? '完成 ✓' : `${Math.round(ss.pct * 100)}%`}</span>
    </a>
  );
}

function UnitRow({ lang, stage, ui, s, nextId }: { lang: LangId; stage: Stage; ui: number; s: Save; nextId?: string }) {
  const u = stage.units[ui];
  const st = unitState(s, stage, ui);
  // 已完成的單元預設收起來，路線比較短、比較好找到目前的課
  const [open, setOpen] = useState(!st.complete);
  return (
    <section className={cx('unit card', st.complete && 'complete', !st.unlocked && !st.complete && 'locked', !open && 'folded')}>
      <header>
        <span className="unit-icon" lang={lang}>
          {u.icon}
        </span>
        <div className="grow">
          <h3>{u.title}</h3>
          <small className="muted" lang={lang}>
            {u.subtitle}
          </small>
        </div>
        {st.complete ? (
          <button type="button" className="unit-count unit-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
            完成 ✓ <Stars n={Math.round(st.stars / Math.max(1, st.total))} /> {open ? '▲' : '▼'}
          </button>
        ) : (
          <span className="unit-count">{!st.unlocked ? '🔒 未解鎖' : `${st.done} / ${st.total}`}</span>
        )}
      </header>
      {open && (
        <div className="nodes">
          {u.lessons.map((l, li) => {
            const state = lessonState(s, stage, ui, li);
            const label = l.boss ? (st.unlocked || st.complete ? '單元測驗' : '跳級測驗') : l.title;
            const dot = l.boss ? '👑' : state === 'locked' ? '🔒' : state === 'done' ? '✓' : String(li + 1);
            const cls = cx('node', state, l.boss && 'boss', l.id === nextId && 'next');
            const inner = (
              <>
                <span className="node-dot">{dot}</span>
                <span className="node-label" lang={u.kind === 'chars' && !l.boss ? lang : undefined}>
                  {label}
                </span>
                <Stars n={starsOf(s, l.id)} />
              </>
            );
            return state === 'locked' ? (
              <span key={l.id} className={cls} title="先完成前一課">
                {inner}
              </span>
            ) : (
              <a key={l.id} className={cls} href={href(lessonPath(lang, l.id))}>
                {inner}
              </a>
            );
          })}
        </div>
      )}
      {!st.unlocked && !st.complete && <p className="unit-hint muted">完成上一個單元就會解鎖。已經會了？直接挑戰「跳級測驗」，通過就算完成。</p>}
    </section>
  );
}

function PathTab({ lang, s, stageId }: { lang: LangId; s: Save; stageId?: string }) {
  const course = requireCourse(lang);
  const stage = course.stages.find((x) => x.id === stageId) ?? currentStage(s, course);
  useEffect(() => setStage(lang, stage.id), [lang, stage.id]);

  const ss = stageState(s, stage);
  const up = nextInStage(s, stage);
  // 打開路線時，下一課如果在畫面下方看不到，就自動捲過去
  useEffect(() => {
    const t = setTimeout(() => {
      const el = document.querySelector('.node.next');
      if (el && el.getBoundingClientRect().top + window.scrollY > window.innerHeight * 0.8) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 120);
    return () => clearTimeout(t);
  }, [stage.id]);
  const groups = [
    { label: course.pathLabel, stages: course.stages.filter((x) => x.group === 'main') },
    { label: course.trackLabel ?? '', stages: course.stages.filter((x) => x.group === 'track') },
  ].filter((g) => g.stages.length);

  return (
    <>
      {groups.map((g) => (
        <div key={g.label} className="stage-group">
          <h3 className="group-label">{g.label}</h3>
          <div className="stage-row">
            {g.stages.map((st) => (
              <StageCard key={st.id} lang={lang} stage={st} s={s} active={st.id === stage.id} />
            ))}
          </div>
        </div>
      ))}

      <section className="stage-detail" style={{ '--c': stage.color } as CSSProperties}>
        <header className="stage-head card">
          <div className="grow">
            <h2>
              {stage.title} <small>{stage.subtitle}</small>
            </h2>
            <p className="muted">{stage.description}</p>
          </div>
          {ss.ready && (
            <div className="stage-prog">
              <b>{Math.round(ss.pct * 100)}%</b>
              <Bar v={ss.pct} color={stage.color} />
              <small className="muted">
                {ss.done} / {ss.total} 課
              </small>
            </div>
          )}
          {up && (
            <a className="btn primary" href={href(lessonPath(lang, up.lesson.id))}>
              {ss.done ? '繼續' : '開始'}：{up.unit.title}
            </a>
          )}
        </header>

        {stage.units.map((u, ui) => (
          <UnitRow key={u.id} lang={lang} stage={stage} ui={ui} s={s} nextId={up?.lesson.id} />
        ))}

        {stage.planned.length > 0 && (
          <section className="planned card">
            <h3>{ss.ready ? '即將推出的單元' : '這一關的內容準備中'}</h3>
            <p className="muted">
              {ss.ready ? '以下單元已排入製作清單。' : '頁面已經建好，內容還在製作。先把前面的關卡打穩，這裡開放時會直接接上。'}
            </p>
            <ul>
              {stage.planned.map((p) => (
                <li key={p}>
                  <span>🔒</span>
                  {p}
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </>
  );
}

// ───────── 遊樂場 ─────────

interface Game {
  icon: string;
  title: string;
  desc: string;
  to: string;
  need: number;
  have: number;
  badge?: string;
  hot?: boolean;
  /** 無法遊玩的原因（例如沒有語音） */
  blocked?: string;
}

function ArcadeTab({ lang, s }: { lang: LangId; s: Save }) {
  useVoices();
  const vocab = learnedVocab(s, lang).length;
  const words = learnedVocab(s, lang).filter((i) => i.kind !== 'char').length;
  const cw = crosswordPool(s, lang).length;
  const learned = learnedItems(s, lang).length;
  const due = dueItems(s, lang).length;
  const dailyDone = !!s.days[today()]?.dailyCw?.[lang];
  const bestMatch = s.best.match[lang];
  const bestBlitz = s.best.blitz[lang];

  const games: Game[] = [
    {
      icon: '🧠',
      title: '今日複習',
      desc: '間隔複習：在快要忘記的時候複習，記得最牢。沒有到期的字時，可以做加強練習。',
      to: `/l/${lang}/review`,
      need: 4,
      have: learned,
      badge: due > 0 ? `${due} 個到期` : '今天已清空',
      hot: due > 0,
    },
    {
      icon: '🧩',
      title: '填字遊戲',
      desc: '看中文提示，把學過的單字填進交叉的格子裡。每次都是新的盤面。',
      to: `/l/${lang}/play/crossword`,
      need: UNLOCK.crossword,
      have: cw,
    },
    {
      icon: '📅',
      title: '每日填字',
      desc: '每天一題固定的題目，完成可以多拿 20 XP。',
      to: `/l/${lang}/play/crossword?daily=1`,
      need: UNLOCK.crossword,
      have: cw,
      badge: dailyDone ? '今天已完成 ✓' : '今天還沒挑戰',
      hot: !dailyDone,
    },
    {
      icon: '🃏',
      title: '配對消消樂',
      desc: '和時間賽跑，把單字和意思配成一對消掉。三回合計時。',
      to: `/l/${lang}/play/match`,
      need: UNLOCK.match,
      have: vocab,
      badge: bestMatch !== undefined ? `最佳 ${fmtTime(bestMatch)}` : undefined,
    },
    {
      icon: '⏱️',
      title: '限時快答',
      desc: '60 秒內能答對幾題？連擊越高，每題分數越多；答錯會扣時間。',
      to: `/l/${lang}/play/blitz`,
      need: UNLOCK.blitz,
      have: vocab,
      badge: bestBlitz > 0 ? `最高 ${bestBlitz} 分` : undefined,
    },
    {
      icon: '🎧',
      title: '聽力特訓',
      desc: '不看字，只聽聲音選意思。朝「不用字幕」的目標前進。',
      to: `/l/${lang}/play/listen`,
      need: UNLOCK.listen,
      have: vocab,
      blocked: canSpeak(lang) ? undefined : `這個瀏覽器沒有${LANG_NAME[lang]}語音，請改用 Chrome 或 Edge。`,
    },
  ];
  games.push(
    {
      icon: '✅',
      title: '真假快判',
      desc: '字和意思配對正確嗎？45 秒內憑直覺按 ✓ 或 ✗，連擊越高分數越多。',
      to: `/l/${lang}/play/truefalse`,
      need: UNLOCK.truefalse,
      have: vocab,
      badge: (s.best.tf?.[lang] ?? 0) > 0 ? `最高 ${s.best.tf[lang]} 分` : '新遊戲',
    },
    {
      icon: '🃏',
      title: '記憶翻牌',
      desc: '12 張蓋著的牌，一次翻兩張，把字和意思配成一對。考驗記憶力也複習單字。',
      to: `/l/${lang}/play/memory`,
      need: UNLOCK.memory,
      have: vocab,
      badge: s.best.memory?.[lang] !== undefined ? `最快 ${fmtTime(s.best.memory[lang]!)}` : '新遊戲',
    },
  );
  if (lang === 'ja') {
    games.push({
      icon: 'あ',
      title: '假名對對碰',
      desc: '翻牌找出平假名和對應的片假名（あ↔ア），兩種假名一起記熟。',
      to: `/l/${lang}/play/memory?kana=1`,
      need: 6,
      have: kanaPairs(learnedItems(s, lang).filter(isVocab)).length,
    });
    games.push({
      icon: '⌨️',
      title: '打字特訓',
      desc: '看中文或聽發音，用日文鍵盤把單字、短句打出來。假名、漢字、混著打都可以。',
      to: `/l/${lang}/play/typing`,
      need: UNLOCK.typing,
      have: words,
      badge: s.stats.typings > 0 ? `已完成 ${s.stats.typings} 次` : '新遊戲',
      hot: s.stats.typings === 0,
    });
  }

  return (
    <div className="arcade">
      {games.map((g) => {
        const locked = g.have < g.need;
        return (
          <article key={g.title} className={cx('game card', locked && 'locked', g.hot && !locked && 'hot')}>
            <div className="game-icon">{g.icon}</div>
            <div className="grow">
              <h3>
                {g.title}
                {g.badge && !locked && <span className={cx('chip', g.hot && 'warn')}>{g.badge}</span>}
              </h3>
              <p className="muted">{g.desc}</p>
              {locked ? (
                <div className="game-lock">
                  <Bar v={g.have / g.need} />
                  <small>
                    🔒 再學會 {g.need - g.have} 個字詞就能解鎖（{g.have} / {g.need}）
                  </small>
                </div>
              ) : g.blocked ? (
                <small className="warn-text">{g.blocked}</small>
              ) : (
                <a className="btn primary small" href={href(g.to)}>
                  開始
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ───────── 圖鑑 ─────────

function tileLabel(it: Item): string {
  if (isVocab(it)) return it.w;
  if (it.kind === 'sentence') return it.s;
  if (it.kind === 'cloze') return furiPlain(clozeSentence(it));
  return it.ask ?? it.q;
}

function DexTab({ lang, s }: { lang: LangId; s: Save }) {
  const course = requireCourse(lang);
  const [open, setOpen] = useState<Item | null>(null);
  const st = langStats(s, lang);
  const p = open ? s.items[open.id] : undefined;
  const dueIn = p ? p.due - dayNum(today()) : 0;

  return (
    <>
      <section className="card dex-summary">
        <div className="grow">
          <h2>
            已收集 {st.learned} <small>/ {st.total}</small>
          </h2>
          <Bar v={st.total ? st.learned / st.total : 0} color="var(--lang)" />
        </div>
        <div className="dex-legend">
          {[1, 2, 3, 4].map((m) => (
            <span key={m}>
              <i className={`m${m}`} />
              {MASTERY_LABEL[m]}
            </span>
          ))}
        </div>
      </section>

      {course.stages
        .filter((stage) => stage.units.length)
        .map((stage) => (
          <div key={stage.id} className="dex-stage">
            <h3 className="group-label">{stage.title}</h3>
            {stage.units.map((u) => {
              const got = u.items.filter((i) => s.items[i.id]).length;
              return (
                <section key={u.id} className="card dex-unit">
                  <header>
                    <b>
                      <span lang={lang}>{u.icon}</span> {u.title}
                    </b>
                    <small className="muted">
                      {got} / {u.items.length}
                    </small>
                  </header>
                  <div className={cx('dex-grid', u.kind)}>
                    {u.items.map((it) => {
                      const m = mastery(s.items[it.id]);
                      return m === 0 ? (
                        <span key={it.id} className="dex-tile unknown" title="還沒學到">
                          ？
                        </span>
                      ) : (
                        <button key={it.id} type="button" className={`dex-tile m${m}`} lang={lang} onClick={() => setOpen(it)}>
                          {tileLabel(it)}
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ))}

      {open && p && (
        <Modal onClose={() => setOpen(null)}>
          <ItemCard item={open} lang={lang} big />
          <div className="dex-info">
            <span className={`chip m${mastery(p)}`}>{MASTERY_LABEL[mastery(p)]}</span>
            <span className="chip">
              答對 {p.ok}・答錯 {p.ng}
            </span>
            <span className="chip">{dueIn <= 0 ? '今天該複習了' : `${dueIn} 天後複習（${addDays(today(), dueIn).slice(5)}）`}</span>
          </div>
          <button type="button" className="btn wide" onClick={() => setOpen(null)}>
            關閉
          </button>
        </Modal>
      )}
    </>
  );
}

// ───────── 字母表 ─────────

type KanaMode = 'both' | 'h' | 'k';

function ChartTab({ lang, s }: { lang: LangId; s: Save }) {
  useVoices();
  const course = requireCourse(lang);
  const idx = courseIndex(lang).items;
  const all = course.stages.flatMap((st) => st.units).filter((u) => u.chart);
  const table = lang === 'ko' ? basicTable() : null;
  // 日文：平假名、片假名分開看，或並排對照
  const [mode, setMode] = useState<KanaMode>('both');
  const units = lang !== 'ja' ? all : all.filter((u) => (mode === 'k' ? u.id.startsWith('ja.kana.k') : u.id.startsWith('ja.kana.h')));
  const pairOf = (unitId: string) => (lang === 'ja' && mode === 'both' ? all.find((u) => u.id === unitId.replace('ja.kana.h', 'ja.kana.k')) : undefined);

  return (
    <div className="charts">
      <p className="muted chart-tip">點任何一個字就能聽發音。已經學過的字會亮起來。</p>
      {lang === 'ja' && (
        <div className="seg small chart-mode" role="tablist" aria-label="假名">
          {(
            [
              ['both', 'あ ア 對照'],
              ['h', 'あ 平假名'],
              ['k', 'ア 片假名'],
            ] as [KanaMode, string][]
          ).map(([m, label]) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} className={cx(mode === m && 'on')} onClick={() => setMode(m)}>
              {label}
            </button>
          ))}
        </div>
      )}
      {table && (
        <section className="card chart">
          <h3>
            基本音節表 <small className="muted">반절표：子音 × 母音</small>
          </h3>
          <div className="chart-scroll">
            <table className="chart-table">
              <thead>
                <tr>
                  <th />
                  {table.vowels.map((v) => (
                    <th key={v} lang="ko">
                      {v}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((r) => (
                  <tr key={r.cons}>
                    <th lang="ko">{r.cons}</th>
                    {r.cells.map((c) => (
                      <td key={c.syl}>
                        <button type="button" className="chart-cell on" onClick={() => speak(c.syl, 'ko')}>
                          <b lang="ko">{c.syl}</b>
                          <small>{c.rm}</small>
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {units.map((u) => {
        const pair = pairOf(u.id);
        return (
          <section key={u.id} className="card chart">
            <h3>
              {pair ? u.title.replace('平假名', '平假名＋片假名') : u.title} <small className="muted">{u.subtitle}</small>
            </h3>
            <div className="chart-scroll">
              <table className={cx('chart-table', pair && 'pair')}>
                <tbody>
                  {u.chart!.map((row, ri) => (
                    <tr key={row.label}>
                      <th lang={lang}>{row.label}</th>
                      {row.cells.map((id, ci) => {
                        const it = id ? (idx.get(id)?.item as VocabItem | undefined) : undefined;
                        const pid = pair?.chart?.[ri]?.cells[ci];
                        const kata = pid ? (idx.get(pid)?.item as VocabItem | undefined) : undefined;
                        const on = (it && s.items[it.id]) || (kata && s.items[kata.id]);
                        return (
                          <td key={ci}>
                            {it && (
                              <button type="button" className={cx('chart-cell', on && 'on')} onClick={() => speak(sayOf(it, lang), lang)}>
                                <b lang={lang}>
                                  {it.w}
                                  {kata && <span className="kata">{kata.w}</span>}
                                </b>
                                <small>{it.rm}</small>
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ───────── 各分頁第一次打開的說明 ─────────

function TabGuide({ tab, lang }: { tab: LangTab; lang: LangId }) {
  switch (tab) {
    case 'path':
      return (
        <GuideTip id="tab:path" title="學習路線怎麼走？" icon="📚">
          <ul>
            <li>上面一排是關卡（例如 N5、N4），點一下切換；每個關卡下面有好幾個單元。</li>
            <li>圓圈是課：數字＝還沒上、✓＝完成、🔒＝要先上完前一課。星星是這堂課的成績。</li>
            <li>👑 單元測驗隨時都能挑戰，答對 80% 就完成整個單元、解鎖下一個單元；已經會的內容可以直接考來跳級。</li>
          </ul>
        </GuideTip>
      );
    case 'arcade':
      return (
        <GuideTip id="tab:arcade" title="遊樂場怎麼玩？" icon="🎮">
          <ul>
            <li>所有遊戲都用你學過的字出題；🔒 的遊戲多學幾個字就會解鎖。</li>
            <li>「今日複習」最重要：把快忘記的字複習一次，記憶會更牢。</li>
          </ul>
        </GuideTip>
      );
    case 'mock':
      return (
        <GuideTip id="tab:mock" title="模擬考是什麼？" icon="📝">
          <ul>
            <li>仿照正式考試（多益、日檢、TOPIK）題型的計時測驗，每次重新抽題。</li>
            <li>可以跳題、🚩 標記，時間到自動交卷；交卷後看各大題成績和逐題解析。</li>
            <li>建議先上完卡片上寫的建議關卡再考，結果會更準。</li>
          </ul>
        </GuideTip>
      );
    case 'dex':
      return (
        <GuideTip id="tab:dex" title="圖鑑" icon="📖">
          <p>學過的字都會收進圖鑑。顏色代表熟練度（新學 → 學習中 → 熟悉 → 精通），點一下可以看答對次數和下次複習的日子。</p>
        </GuideTip>
      );
    case 'chart':
      return (
        <GuideTip id="tab:chart" title={lang === 'ja' ? '五十音表' : '字母表'} icon={lang === 'ja' ? 'あ' : '가'}>
          <p>
            點任何一個字就能聽發音，學過的字會亮起來。
            {lang === 'ja' ? '上面可以切換平假名、片假名，或兩種並排對照。' : '最上面的基本音節表是「子音 × 母音」的組合。'}
          </p>
        </GuideTip>
      );
  }
}

// ───────── 頁面 ─────────

export function LangPage({ lang, tab, stageId }: { lang: LangId; tab: LangTab; stageId?: string }) {
  const s = useSave();
  const course = META[lang];
  // 標題與分頁不需要題目，先顯示；分頁內容等題目下載完成
  const due = quickStats(s, lang).due;
  const tabs: { id: LangTab; icon: string; label: string; to: string }[] = [
    { id: 'path', icon: '📚', label: '學習路線', to: `/l/${lang}` },
    { id: 'arcade', icon: '🎮', label: '遊樂場', to: `/l/${lang}/arcade` },
    { id: 'mock', icon: '📝', label: '模擬考', to: `/l/${lang}/mock` },
    { id: 'dex', icon: '📖', label: '圖鑑', to: `/l/${lang}/dex` },
  ];
  if (lang !== 'en') tabs.push({ id: 'chart', icon: lang === 'ja' ? 'あ' : '가', label: lang === 'ja' ? '五十音表' : '字母表', to: `/l/${lang}/chart` });

  const sameTab = (l: LangId) => (tab === 'chart' && l === 'en' ? '' : tab === 'path' ? '' : `/${tab}`);
  return (
    <div className="page" style={{ '--lang': course.color } as CSSProperties}>
      <nav className="lang-switch" aria-label="切換語言">
        {META_LIST.map((m) => (
          <a key={m.id} href={href(`/l/${m.id}${sameTab(m.id)}`)} className={cx(m.id === lang && 'on')} style={{ '--c': m.color } as CSSProperties} aria-current={m.id === lang ? 'page' : undefined}>
            <span lang={m.id}>{m.glyph}</span>
            {m.name}
          </a>
        ))}
      </nav>
      <section className="lang-head card">
        <LangBadge course={course} size="lg" />
        <div className="grow">
          <h1>
            {course.name} <small lang={lang}>{course.native}</small>
          </h1>
          <ul className="goals">
            {course.goals.map((g) => (
              <li key={g}>🎯 {g}</li>
            ))}
          </ul>
        </div>
        <RankLine xp={s.xp[lang]} size={76} />
      </section>

      <nav className="tabs">
        {tabs.map((t) => (
          <a key={t.id} href={href(t.to)} className={cx(tab === t.id && 'on')}>
            <span className="tab-icon" aria-hidden>
              {t.icon}
            </span>
            <span className="tab-label">{t.label}</span>
            {t.id === 'arcade' && due > 0 && <span className="dot">{due}</span>}
          </a>
        ))}
      </nav>

      <TabGuide tab={tab} lang={lang} />
      <CourseGate lang={lang} compact>
        {tab === 'path' && <PathTab lang={lang} s={s} stageId={stageId} />}
        {tab === 'arcade' && <ArcadeTab lang={lang} s={s} />}
        {tab === 'mock' && <MockTab lang={lang} s={s} />}
        {tab === 'dex' && <DexTab lang={lang} s={s} />}
        {tab === 'chart' && <ChartTab lang={lang} s={s} />}
      </CourseGate>
    </div>
  );
}
