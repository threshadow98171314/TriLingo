// 語言頁的「圖鑑」分頁：學過的字依熟練度上色，點開看例句和下次複習的時間。
import { useState } from 'react';
import { Bar, ItemCard, Modal } from '../../components/ui';
import { courseIndex, OUTLINE } from '../../content';
import { addDays, dayNum, today } from '../../core/date';
import { mastery, MASTERY_LABEL } from '../../core/logic';
import { bankState, bankUnits, langStats, learnedIn, pathUnits } from '../../core/progress';
import type { Save } from '../../core/save';
import type { Item, LangId, StageOutline, Unit, UnitOutline } from '../../core/types';
import { cx } from '../../core/util';
import { clozeSentence, isVocab } from '../../engine/exercises';
import { furiPlain } from '../../engine/furigana';

function tileLabel(it: Item): string {
  if (isVocab(it)) return it.w;
  if (it.kind === 'sentence') return it.s;
  if (it.kind === 'cloze') return furiPlain(clozeSentence(it));
  return furiPlain(it.ask ?? it.q);
}

function DexUnit({ lang, u, s, onOpen }: { lang: LangId; u: Unit; s: Save; onOpen: (it: Item) => void }) {
  const got = learnedIn(s, u);
  return (
    <section className="card dex-unit">
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
            <button key={it.id} type="button" className={`dex-tile m${m}`} lang={lang} onClick={() => onOpen(it)}>
              {tileLabel(it)}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** 還沒學到的單元（題目還沒下載）：只知道有幾個，全部顯示問號 */
function DexUnknown({ lang, u }: { lang: LangId; u: UnitOutline }) {
  return (
    <section className="card dex-unit">
      <header>
        <b>
          <span lang={lang}>{u.icon}</span> {u.title}
        </b>
        <small className="muted">0 / {u.count}</small>
      </header>
      <div className={cx('dex-grid', u.kind)}>
        {Array.from({ length: u.count }, (_, i) => (
          <span key={i} className="dex-tile unknown" title="還沒學到">
            ？
          </span>
        ))}
      </div>
    </section>
  );
}

function DexBank({ lang, stage, s, onOpen }: { lang: LangId; stage: StageOutline; s: Save; onOpen: (it: Item) => void }) {
  const [open, setOpen] = useState(false);
  const idx = courseIndex(lang).units;
  const decks = bankUnits(stage);
  const bs = bankState(s, stage);
  return (
    <section className="card dex-bank">
      <button type="button" className="bank-group-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="bank-icon">📚</span>
        <span className="grow">
          <b>單字庫</b>
          <small className="muted">{decks.length} 組</small>
        </span>
        <span className="bank-group-prog">
          {bs.learned} / {bs.words}
        </span>
        <span aria-hidden>{open ? '▲' : '▼'}</span>
      </button>
      {open &&
        decks.map((o) => {
          const u = learnedIn(s, o) > 0 ? idx.get(o.id)?.unit : undefined;
          return u ? <DexUnit key={u.id} lang={lang} u={u} s={s} onOpen={onOpen} /> : null;
        })}
      {open && bs.learned === 0 && <p className="muted">還沒有學過單字庫的字。到學習路線的「📚 單字庫」挑一組開始吧。</p>}
    </section>
  );
}

export function DexTab({ lang, s }: { lang: LangId; s: Save }) {
  const course = OUTLINE[lang];
  const idx = courseIndex(lang).units;
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
            {pathUnits(stage).map((o) => {
              const u = idx.get(o.id)?.unit;
              return u ? <DexUnit key={o.id} lang={lang} u={u} s={s} onOpen={setOpen} /> : <DexUnknown key={o.id} lang={lang} u={o} />;
            })}
            {bankUnits(stage).length > 0 && <DexBank lang={lang} stage={stage} s={s} onOpen={setOpen} />}
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
