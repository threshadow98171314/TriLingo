// 語言頁：導覽列的「學習」「練功」「查詢」三個區域，各區域上方有子分頁：
// - 學習：路線、單字庫（只靠大綱顯示，不用等題目下載）
// - 練功：遊樂場（每日、專屬特訓、遊戲）、錯題本、模擬考
// - 查詢：搜尋、圖鑑、觀念、五十音表／字母表、日文歌
// 語言在上方導覽列切換。
import { lazy, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { CertificateModal } from '../components/Certificate';
import { CourseGate } from '../components/CourseGate';
import { GuideTip } from '../components/Guide';
import { RankLine } from '../components/RankEmblem';
import { Bar, LangBadge, Stars } from '../components/ui';
import { loadedCourse, META, OUTLINE, prefetch } from '../content';
import { APP_MINOR, stageIsNew, stageSeenKey } from '../content/news';
import { bankState, currentStage, learnedIn, lessonState, nextBankLesson, nextInStage, quickStats, stageState, starsOf, unitState } from '../core/progress';
import type { Save } from '../core/save';
import { today } from '../core/date';
import { markCert, markGuide, setStage, useSave } from '../core/store';
import type { LangId, StageOutline } from '../core/types';
import { cx } from '../core/util';
import { href, lessonPath, stagePath } from '../router';

// 學習路線以外的分頁用到才下載程式
const ArcadeTab = lazy(() => import('./tabs/Arcade').then((m) => ({ default: m.ArcadeTab })));
const MistakesTab = lazy(() => import('./tabs/Mistakes').then((m) => ({ default: m.MistakesTab })));
const SearchTab = lazy(() => import('./tabs/Search').then((m) => ({ default: m.SearchTab })));
const DexTab = lazy(() => import('./tabs/Dex').then((m) => ({ default: m.DexTab })));
const ChartTab = lazy(() => import('./tabs/Chart').then((m) => ({ default: m.ChartTab })));
const MockTab = lazy(() => import('./Mock').then((m) => ({ default: m.MockTab })));
const ConceptsTab = lazy(() => import('./Concepts').then((m) => ({ default: m.ConceptsTab })));
const SongsTab = lazy(() => import('./Songs').then((m) => ({ default: m.SongsTab })));
// 情境小鎮的地圖（插畫比較大）
const TownMap = lazy(() => import('../components/TownMap').then((m) => ({ default: m.TownMap })));

export type LangTab = 'path' | 'bank' | 'arcade' | 'mistakes' | 'mock' | 'search' | 'dex' | 'concepts' | 'chart' | 'songs';
type Area = 'learn' | 'practice' | 'lookup';

const AREA_OF: Record<LangTab, Area> = {
  path: 'learn',
  bank: 'learn',
  arcade: 'practice',
  mistakes: 'practice',
  mock: 'practice',
  search: 'lookup',
  dex: 'lookup',
  concepts: 'lookup',
  chart: 'lookup',
  songs: 'lookup',
};
const AREA_DESC: Record<Area, string> = { learn: '學習路線與單字庫', practice: '複習、遊戲、錯題本、模擬考', lookup: '搜尋、圖鑑、觀念講堂與查表' };

interface SubTab {
  id: LangTab;
  icon: string;
  label: string;
  to: string;
  badge?: number;
}

function SubTabs({ items, active }: { items: SubTab[]; active: LangTab }) {
  return (
    <nav className="subtabs" aria-label="分頁">
      {items.map((t) => (
        <a key={t.id} href={href(t.to)} className={cx(active === t.id && 'on')} aria-current={active === t.id ? 'page' : undefined}>
          <span className="subtab-icon" aria-hidden>
            {t.icon}
          </span>
          {t.label}
          {!!t.badge && <span className="dot">{t.badge}</span>}
        </a>
      ))}
    </nav>
  );
}

// ───────── 學習路線 ─────────

function StageChip({ lang, stage, s, active }: { lang: LangId; stage: StageOutline; s: Save; active: boolean }) {
  const ss = stageState(s, stage);
  const icon = stage.style === 'track' || stage.style === 'town' ? stage.icon : undefined;
  return (
    <a
      href={href(stagePath(lang, stage.id))}
      className={cx('stage-chip', stage.style, active && 'on', !ss.ready && 'coming', ss.complete && 'complete')}
      style={{ '--c': stage.color } as CSSProperties}
      aria-current={active ? 'page' : undefined}
      title={`${stage.title}（${stage.subtitle}）`}
    >
      <b lang={stage.style === 'level' ? lang : undefined}>
        {icon && (
          <span className="stage-chip-icon" aria-hidden>
            {icon}
          </span>
        )}
        {stage.short}
      </b>
      <small>{!ss.ready ? '準備中' : ss.complete ? '完成 ✓' : `${Math.round(ss.pct * 100)}%`}</small>
      {stageIsNew(stage, s.guide) && <i className="new-tag">NEW</i>}
      {s.goals[lang]?.stage === stage.id && (
        <i className="goal-tag" title="學習目標" aria-label="學習目標">
          🎯
        </i>
      )}
    </a>
  );
}

/** 關卡：小標籤排成會換行的幾列，全部一眼看得到 */
function StageChips({ lang, s, activeId }: { lang: LangId; s: Save; activeId: string }) {
  const course = OUTLINE[lang];
  const groups = [
    { label: course.pathLabel, track: false, stages: course.stages.filter((x) => x.group === 'main') },
    { label: course.trackLabel ?? '', track: true, stages: course.stages.filter((x) => x.group === 'track') },
  ].filter((g) => g.stages.length);
  return (
    <nav className="stage-chips" aria-label="關卡">
      {groups.map((g) => (
        <div key={g.label} className="stage-chip-group">
          <span className="stage-chip-label">{g.label}</span>
          <div className={cx('stage-chip-row', g.track && 'track')}>
            {g.stages.map((st) => (
              <StageChip key={st.id} lang={lang} stage={st} s={s} active={st.id === activeId} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

/** 一個單元裡的課（圓圈）；路線上的單元和單字庫的組共用 */
function LessonNodes({ lang, stage, ui, s, nextId }: { lang: LangId; stage: StageOutline; ui: number; s: Save; nextId?: string }) {
  const u = stage.units[ui];
  const st = unitState(s, stage, ui);
  return (
    <div className="nodes">
      {u.lessons.map((l, li) => {
        const state = lessonState(s, stage, ui, li);
        const label = l.boss ? (u.bank ? '小測驗' : st.unlocked || st.complete ? '單元測驗' : '跳級測驗') : l.title;
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
  );
}

function UnitRow({ lang, stage, ui, s, nextId, focus }: { lang: LangId; stage: StageOutline; ui: number; s: Save; nextId?: string; focus?: boolean }) {
  const u = stage.units[ui];
  const st = unitState(s, stage, ui);
  // 只展開目前在上的單元（和搜尋結果連過來的單元），其他的收成一行（點標題展開），路線比較短、一眼找到下一課
  const current = !!nextId && u.lessons.some((l) => l.id === nextId);
  const [open, setOpen] = useState(current || !!focus);
  return (
    <section id={`u-${u.id}`} className={cx('unit card', st.complete && 'complete', !st.unlocked && !st.complete && 'locked', current && 'current', focus && 'focus', !open && 'folded')}>
      <button type="button" className="unit-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="unit-icon" lang={lang}>
          {u.icon}
        </span>
        <span className="grow">
          <b className="unit-title">{u.title}</b>
          <small className="muted" lang={lang}>
            {u.subtitle}
          </small>
        </span>
        <span className="unit-count">
          {st.complete ? (
            <>
              完成 ✓ <Stars n={Math.round(st.stars / Math.max(1, st.total))} />
            </>
          ) : !st.unlocked ? (
            '🔒 未解鎖'
          ) : (
            `${st.done} / ${st.total}`
          )}
          <span className="unit-caret" aria-hidden>
            {open ? '▲' : '▼'}
          </span>
        </span>
      </button>
      {open && <LessonNodes lang={lang} stage={stage} ui={ui} s={s} nextId={nextId} />}
      {open && !st.unlocked && !st.complete && <p className="unit-hint muted">完成上一個單元就會解鎖。已經會了？直接挑戰「跳級測驗」，通過就算完成。</p>}
    </section>
  );
}

// ───────── 單字庫 ─────────

function DeckRow({ lang, stage, ui, s, focus }: { lang: LangId; stage: StageOutline; ui: number; s: Save; focus?: boolean }) {
  const u = stage.units[ui];
  const st = unitState(s, stage, ui);
  const [open, setOpen] = useState(!!focus);
  const got = learnedIn(s, u);
  const next = u.lessons.find((l) => starsOf(s, l.id) === 0);
  return (
    <section id={`u-${u.id}`} className={cx('deck', st.complete && 'complete', focus && 'focus')}>
      <header>
        <button type="button" className="deck-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
          <span className="deck-title">{u.title}</span>
          <small className="muted">
            {got} / {u.count} 字
          </small>
          <Bar v={got / u.count} color="var(--c)" />
        </button>
        {st.complete ? (
          <span className="deck-done" title="小測驗已通過">
            ✓
          </span>
        ) : (
          next && (
            <a className="btn small" href={href(lessonPath(lang, next.id))}>
              {next.boss ? '測驗' : got ? '繼續' : '學習'}
            </a>
          )
        )}
      </header>
      {open && <LessonNodes lang={lang} stage={stage} ui={ui} s={s} />}
    </section>
  );
}

function BankGroup({ lang, stage, s, name, uis, nextId, focus }: { lang: LangId; stage: StageOutline; s: Save; name: string; uis: number[]; nextId?: string; focus?: string }) {
  const units = uis.map((ui) => stage.units[ui]);
  const words = units.reduce((a, u) => a + u.count, 0);
  const got = units.reduce((a, u) => a + learnedIn(s, u), 0);
  // 下一組新字（和搜尋結果連過來的那一組）所在的分組預設打開
  const [open, setOpen] = useState(() => units.some((u) => u.id === nextId || u.id === focus));
  return (
    <section className={cx('bank-group card', open && 'open')}>
      <button type="button" className="bank-group-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="bank-icon" lang={lang}>
          {units[0].icon}
        </span>
        <span className="grow">
          <b>{name}</b>
          <small className="muted">
            {units.length} 組・{words} 字
          </small>
        </span>
        <span className="bank-group-prog">
          {got} / {words}
        </span>
        <span aria-hidden>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="decks">
          {uis.map((ui) => (
            <DeckRow key={stage.units[ui].id} lang={lang} stage={stage} ui={ui} s={s} focus={stage.units[ui].id === focus} />
          ))}
        </div>
      )}
    </section>
  );
}

function BankSection({ lang, stage, s, focus }: { lang: LangId; stage: StageOutline; s: Save; focus?: string }) {
  const groups = new Map<string, number[]>();
  stage.units.forEach((u, ui) => {
    if (u.bank) groups.set(u.bank, [...(groups.get(u.bank) ?? []), ui]);
  });
  if (!groups.size) return null;
  const bs = bankState(s, stage);
  const next = nextBankLesson(s, stage);
  return (
    <section className="bank" id="bank">
      <header className="bank-head card">
        <div className="grow">
          <h3>
            📒 單字庫 <small className="muted">{bs.decks} 組・{bs.words.toLocaleString()} 個字</small>
          </h3>
          <p className="muted">照主題分好組的大量單字，不用照順序、也不會上鎖。學過的字會自動排進每天的複習。</p>
          <div className="bank-prog">
            <Bar v={bs.words ? bs.learned / bs.words : 0} color={stage.color} />
            <small className="muted">已學 {bs.learned.toLocaleString()} 字</small>
          </div>
        </div>
        {next && (
          <a className="btn primary" href={href(lessonPath(lang, next.lesson.id))}>
            {bs.learned ? '繼續學新字' : '開始學新字'}
          </a>
        )}
      </header>
      <GuideTip id="tab:bank" icon="📒" title="單字庫怎麼用？">
        學習路線教文法和最核心的字；單字庫補足考試需要的大量單字。建議每天學一兩組新字（每組約 25 個字、分成 5 課），再去做「今日複習」。點分組可以展開，按「學習」從那一組開始。
      </GuideTip>
      {[...groups].map(([name, uis]) => (
        <BankGroup key={name} lang={lang} stage={stage} s={s} name={name} uis={uis} nextId={next?.unit.id} focus={focus} />
      ))}
    </section>
  );
}

/** 情境小鎮的地圖要用到單字和對話，等這一關的題目下載好才畫 */
function TownStage({ lang, stageId, s }: { lang: LangId; stageId: string; s: Save }) {
  const stage = loadedCourse(lang).stages.find((x) => x.id === stageId);
  return stage ? <TownMap lang={lang} stage={stage} s={s} /> : null;
}

/** 關卡說明下方最多列出幾篇相關的觀念文章 */
const RELATED_SHOWN = 3;

/** 學習：上方是關卡標籤，下面是這一關的路線或單字庫。focus：要打開並捲過去的單元（搜尋結果連過來） */
function LearnArea({ lang, s, stageId, bank, focus, cert }: { lang: LangId; s: Save; stageId?: string; bank: boolean; focus?: string; cert?: boolean }) {
  // 路線只看大綱（有哪些單元、幾課），不用等題目下載
  const course = OUTLINE[lang];
  const stage = course.stages.find((x) => x.id === stageId) ?? currentStage(s, course);
  useEffect(() => setStage(lang, stage.id), [lang, stage.id]);
  // 打開過這個關卡，NEW 標籤就拿掉
  useEffect(() => {
    if (stage.fresh === APP_MINOR) markGuide(stageSeenKey(stage));
  }, [stage]);

  const ss = stageState(s, stage);
  const up = nextInStage(s, stage);
  // 完成整條學習路線就有結業證書（以前就完成的，第一次打開時補記日期）
  const [certOpen, setCertOpen] = useState(!!cert && ss.complete);
  useEffect(() => {
    if (ss.complete) markCert(stage.id);
  }, [ss.complete, stage.id]);
  const hasBank = stage.units.some((u) => u.bank);
  const showBank = bank && hasBank;
  // 趁空檔先下載下一堂課的題目，點進去就不用等
  const upUnit = up?.unit.id;
  useEffect(() => {
    if (upUnit) prefetch(lang, { units: [upUnit] });
  }, [lang, upUnit]);
  // 打開路線時，下一課如果在畫面下方看不到，就自動捲過去；從搜尋結果連過來的就捲到那個單元
  useEffect(() => {
    if (showBank && !focus) return;
    const t = setTimeout(() => {
      const el = focus ? document.getElementById(`u-${focus}`) : document.querySelector('.node.next');
      if (el && (focus || el.getBoundingClientRect().top + window.scrollY > window.innerHeight * 0.8)) el.scrollIntoView({ block: 'center', behavior: focus ? 'instant' : 'smooth' });
    }, 120);
    return () => clearTimeout(t);
  }, [stage.id, showBank, focus]);

  const bs = hasBank ? bankState(s, stage) : null;
  // 建議程度是這一關的觀念文章
  const related = course.concepts.filter((c) => c.level === stage.short);
  return (
    <>
      <StageChips lang={lang} s={s} activeId={stage.id} />

      <section className="stage-detail" style={{ '--c': stage.color } as CSSProperties}>
        <header className="stage-head card">
          <div className="grow">
            <h2>
              {stage.title} <small>{stage.subtitle}</small>
            </h2>
            <p className="muted stage-desc">{stage.description}</p>
            {related.length > 0 && (
              <div className="stage-concepts">
                <small className="muted">💡 相關觀念</small>
                {related.slice(0, RELATED_SHOWN).map((c) => (
                  <a key={c.id} className="chip" href={href(`/l/${lang}/concept/${c.id}`)}>
                    <span aria-hidden>{c.icon}</span> {c.title.split('：')[0]}
                  </a>
                ))}
                {related.length > RELATED_SHOWN && (
                  <a className="chip" href={href(`/l/${lang}/concepts`)}>
                    還有 {related.length - RELATED_SHOWN} 篇 ›
                  </a>
                )}
              </div>
            )}
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
          {up && !showBank && (
            <a className="btn primary" href={href(lessonPath(lang, up.lesson.id))}>
              {ss.done ? '繼續' : '開始'}：{up.unit.title}
            </a>
          )}
          {ss.complete && (
            <button type="button" className="btn gold" onClick={() => setCertOpen(true)}>
              🎓 結業證書
            </button>
          )}
        </header>
        {certOpen && <CertificateModal info={{ lang, stage, name: s.name, date: s.certs[stage.id] ?? today() }} onClose={() => setCertOpen(false)} />}

        {bs && (
          <SubTabs
            active={showBank ? 'bank' : 'path'}
            items={[
              { id: 'path', icon: '🗺️', label: '路線', to: stagePath(lang, stage.id) },
              { id: 'bank', icon: '📒', label: `單字庫 ${bs.decks} 組`, to: `/l/${lang}/bank/${stage.id}` },
            ]}
          />
        )}

        {showBank ? (
          <BankSection lang={lang} stage={stage} s={s} focus={focus} />
        ) : (
          <>
            <TabGuide tab="path" lang={lang} />
            {stage.style === 'town' ? (
              <CourseGate lang={lang} need={{ stages: [stage.id] }} compact>
                <TownStage lang={lang} stageId={stage.id} s={s} />
              </CourseGate>
            ) : (
              stage.units.map((u, ui) => (u.bank ? null : <UnitRow key={u.id} lang={lang} stage={stage} ui={ui} s={s} nextId={up?.lesson.id} focus={u.id === focus} />))
            )}

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
          </>
        )}
      </section>
    </>
  );
}

// ───────── 各分頁第一次打開的說明 ─────────

function TabGuide({ tab, lang }: { tab: LangTab; lang: LangId }) {
  switch (tab) {
    case 'path':
      return (
        <GuideTip id="tab:path" title="學習路線怎麼走？" icon="📚">
          <ul>
            <li>上面的標籤是關卡，點一下就能切換；有單字庫的關卡，可以在「路線」和「單字庫」之間切換。</li>
            <li>只展開目前在上的單元，其他單元點標題就能展開。圓圈是課：數字＝還沒上、✓＝完成、🔒＝要先上完前一課。</li>
            <li>👑 單元測驗隨時都能挑戰，答對 80% 就完成整個單元、解鎖下一個單元；已經會的內容可以直接考來跳級。</li>
          </ul>
        </GuideTip>
      );
    case 'arcade':
      return (
        <GuideTip id="tab:arcade" title="遊樂場怎麼玩？" icon="🎮">
          <ul>
            <li>每種語言各有自己的遊樂場：題目只用你學過的這個語言的字，最高分也分語言記。🔒 的遊戲多學幾個字就會解鎖。</li>
            <li>「🥋 專屬」是只有這個語言才有的特訓，例如日文的動詞變化、韓文的兩套數字、英文的不規則動詞。</li>
            <li>「今日複習」最重要：把快忘記的字複習一次，記憶會更牢。</li>
          </ul>
        </GuideTip>
      );
    case 'mistakes':
      return (
        <GuideTip id="tab:mistakes" title="錯題本怎麼用？" icon="📕">
          <p>上課、複習、玩遊戲時答錯的字都會收進來，最常錯、最不熟的排最前面。按「🎯 弱點特訓」專練前面的字；練到「精通」就會自動從錯題本畢業。</p>
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
    case 'concepts':
      return (
        <GuideTip id="tab:concepts" title="觀念講堂" icon="💡">
          <p>
            {lang === 'en'
              ? '多益各大題的解題技巧、常考文法觀念與解題思路。先讀觀念再做題，速度和正確率都會提升。'
              : lang === 'ja'
                ? '日文文法的觀念、使用習慣，以及「什麼時候該這樣說」。例句都可以播放，文末有小測驗。'
                : '韓文的發音規則、助詞、語體和變化規則。例句都可以播放，文末有小測驗。'}
          </p>
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
    default:
      return null;
  }
}

// ───────── 頁面 ─────────

export function LangPage({ lang, tab, stageId, focus, cert }: { lang: LangId; tab: LangTab; stageId?: string; focus?: string; cert?: boolean }) {
  const s = useSave();
  const meta = META[lang];
  const area = AREA_OF[tab];
  // 字母表的題目在有 chart 的單元那幾包（五十音、韓文字母）
  const chartUnits = useMemo(() => OUTLINE[lang].stages.flatMap((st) => st.units.filter((u) => u.hasChart).map((u) => u.id)), [lang]);

  const practiceTabs: SubTab[] = [
    { id: 'arcade', icon: '🎮', label: '遊樂場', to: `/l/${lang}/arcade`, badge: quickStats(s, lang).due },
    { id: 'mistakes', icon: '📕', label: '錯題本', to: `/l/${lang}/mistakes` },
    { id: 'mock', icon: '📝', label: '模擬考', to: `/l/${lang}/mock` },
  ];
  const lookupTabs: SubTab[] = [
    { id: 'search', icon: '🔎', label: '搜尋', to: `/l/${lang}/search` },
    { id: 'dex', icon: '📖', label: '圖鑑', to: `/l/${lang}/dex` },
    { id: 'concepts', icon: '💡', label: '觀念', to: `/l/${lang}/concepts` },
    ...(lang !== 'en' ? [{ id: 'chart' as const, icon: lang === 'ja' ? 'あ' : '가', label: lang === 'ja' ? '五十音表' : '字母表', to: `/l/${lang}/chart` }] : []),
    ...(lang === 'ja' ? [{ id: 'songs' as const, icon: '🎵', label: '日文歌', to: '/l/ja/songs' }] : []),
  ];

  return (
    <div className={cx('page lang-page', `area-${area}`)} style={{ '--lang': meta.color } as CSSProperties}>
      <section className="lang-bar card">
        <LangBadge course={meta} />
        <div className="grow">
          <h1>
            {meta.name} <small lang={lang}>{meta.native}</small>
          </h1>
          <small className="muted">{AREA_DESC[area]}</small>
        </div>
        <RankLine xp={s.xp[lang]} size={40} compact />
      </section>

      {/* 換到另一個要打開的單元時整個重來，展開的單元才會跟著換 */}
      {area === 'learn' && <LearnArea key={focus ?? ''} lang={lang} s={s} stageId={stageId} bank={tab === 'bank'} focus={focus} cert={cert} />}

      {area === 'practice' && (
        <>
          <SubTabs items={practiceTabs} active={tab} />
          <TabGuide tab={tab} lang={lang} />
          {/* 遊樂場用學過的字出題：下載學過的字所在的那幾包 */}
          {tab === 'arcade' && (
            <CourseGate lang={lang} need="active" compact>
              <ArcadeTab lang={lang} s={s} />
            </CourseGate>
          )}
          {tab === 'mistakes' && (
            <CourseGate lang={lang} need="active" compact>
              <MistakesTab lang={lang} s={s} />
            </CourseGate>
          )}
          {tab === 'mock' && (
            <CourseGate lang={lang} need="mocks" compact>
              <MockTab lang={lang} s={s} />
            </CourseGate>
          )}
        </>
      )}

      {area === 'lookup' && (
        <>
          <SubTabs items={lookupTabs} active={tab} />
          <TabGuide tab={tab} lang={lang} />
          {tab === 'search' && (
            <CourseGate lang={lang} need={['search', 'concepts']} compact>
              <SearchTab lang={lang} s={s} />
            </CourseGate>
          )}
          {tab === 'dex' && (
            <CourseGate lang={lang} need="active" compact>
              <DexTab lang={lang} s={s} />
            </CourseGate>
          )}
          {tab === 'concepts' && (
            <CourseGate lang={lang} need="concepts" compact>
              <ConceptsTab lang={lang} s={s} />
            </CourseGate>
          )}
          {tab === 'chart' && (
            <CourseGate lang={lang} need={{ units: chartUnits }} compact>
              <ChartTab lang={lang} s={s} />
            </CourseGate>
          )}
          {tab === 'songs' && lang === 'ja' && (
            <CourseGate lang={lang} need={[]} compact>
              <SongsTab s={s} />
            </CourseGate>
          )}
        </>
      )}
    </div>
  );
}
