// 練功的「錯題本」分頁：答錯過、還沒精通的字，最常錯的排最前面；一鍵開始弱點特訓。
import { useState } from 'react';
import { ItemCard, Modal, SpeakBtn, Tx } from '../../components/ui';
import { courseIndex, unitRef } from '../../content';
import { mastery, MASTERY_LABEL } from '../../core/logic';
import { mistakesOf, WEAK_BATCH } from '../../core/mistakes';
import type { Save } from '../../core/save';
import type { Item, LangId } from '../../core/types';
import { clozeSentence, headOf, isVocab, sayOf } from '../../engine/exercises';
import { furiPlain } from '../../engine/furigana';
import { href } from '../../router';

/** 一次列出幾個（其他的按「再多看」） */
const PAGE = 30;

/** 列表上顯示的原文（日文含振假名標註）與朗讀的文字 */
function headText(it: Item): { show: string; say: string } {
  if (isVocab(it)) return { show: headOf(it), say: '' };
  if (it.kind === 'sentence') return { show: it.furi ?? it.s, say: it.s };
  if (it.kind === 'cloze') {
    const s = clozeSentence(it);
    return { show: s, say: furiPlain(s) };
  }
  return { show: it.ask ?? it.q, say: '' };
}

function meaningOf(it: Item): string {
  if (isVocab(it)) return it.m;
  if (it.kind === 'sentence') return it.t;
  return it.t ?? '';
}

export function MistakesTab({ lang, s }: { lang: LangId; s: Save }) {
  const idx = courseIndex(lang).items;
  const { ids, conquered } = mistakesOf(s, lang);
  // 題目下架的舊字找不到，不列
  const items = ids.map((id) => idx.get(id)?.item).filter((x): x is Item => !!x);
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<Item | null>(null);
  const p = open ? s.items[open.id] : undefined;

  return (
    <>
      <section className="card mistakes-head">
        <div className="grow">
          <h2>
            📕 錯題本 <small className="muted">{items.length} 個字</small>
          </h2>
          <p className="muted">
            答錯過、還沒精通的字會收在這裡，最常錯的排最前面。練到「精通」就會自動畢業
            {conquered > 0 && <>（已經克服 {conquered} 個）</>}。
          </p>
        </div>
        {items.length > 0 && (
          <a className="btn primary" href={href(`/l/${lang}/weak`)}>
            🎯 弱點特訓（{Math.min(WEAK_BATCH, items.length)} 個字）
          </a>
        )}
      </section>

      {items.length === 0 ? (
        <section className="card mistakes-empty">
          <span aria-hidden>👍</span>
          <p className="muted">{conquered > 0 ? '常錯的字都克服了！繼續上課、複習，答錯的字會再收進來。' : '還沒有答錯過的字。上課、複習或玩遊戲時答錯的字，會自動收進錯題本。'}</p>
        </section>
      ) : (
        <ol className="card mistakes-list">
          {items.slice(0, shown).map((it, i) => {
            const pr = s.items[it.id];
            const m = mastery(pr);
            const head = headText(it);
            const unit = unitRef(it.id)?.unit;
            return (
              <li key={it.id}>
                <span className="mistakes-rank">{i + 1}</span>
                <button type="button" className="mistakes-main" onClick={() => setOpen(it)}>
                  <Tx className="mistakes-word" s={head.show} lang={lang} />
                  <small className="muted">
                    {meaningOf(it)}
                    {unit && <>・{unit.title}</>}
                  </small>
                </button>
                <span className="mistakes-side">
                  <span className="chip warn">錯 {pr.ng}</span>
                  <span className={`chip m${m}`}>{MASTERY_LABEL[m]}</span>
                </span>
                <SpeakBtn text={isVocab(it) ? sayOf(it, lang) : head.say || furiPlain(head.show)} lang={lang} size="sm" />
              </li>
            );
          })}
        </ol>
      )}
      {items.length > shown && (
        <button type="button" className="btn wide" onClick={() => setShown(shown + PAGE)}>
          再多看 {Math.min(PAGE, items.length - shown)} 個
        </button>
      )}

      {open && p && (
        <Modal onClose={() => setOpen(null)}>
          <ItemCard item={open} lang={lang} big />
          <div className="dex-info">
            <span className={`chip m${mastery(p)}`}>{MASTERY_LABEL[mastery(p)]}</span>
            <span className="chip">
              答對 {p.ok}・答錯 {p.ng}
            </span>
          </div>
          <button type="button" className="btn wide" onClick={() => setOpen(null)}>
            關閉
          </button>
        </Modal>
      )}
    </>
  );
}
