// 情境小鎮：可愛的小鎮地圖，點地點看那裡用得到的單字、對話和文化小知識，完成蓋章挑戰會蓋上印章。
import { useState, type CSSProperties } from 'react';
import { BuildingArt, StampArt } from '../art/town';
import { lessonState, starsOf, unitState } from '../core/progress';
import type { Save } from '../core/save';
import type { LangId, SentenceItem, Stage, Unit, VocabItem } from '../core/types';
import { cx } from '../core/util';
import { headOf, isVocab, sayOf } from '../engine/exercises';
import { href, lessonPath } from '../router';
import { Modal, Ruby, SpeakBtn, Stars, Tx } from './ui';

const STAMP_TEXT: Record<LangId, string> = { ja: '済', ko: '완료', en: 'DONE' };

/** 單元 id 的最後一段就是插畫的名字（ja.town.konbini → konbini） */
const placeOf = (u: Unit) => u.id.split('.').pop() ?? '';

function placeName(u: Unit): VocabItem | undefined {
  const first = u.items[0];
  return first && isVocab(first) ? first : undefined;
}

export function TownMap({ lang, stage, s }: { lang: LangId; stage: Stage; s: Save }) {
  const [open, setOpen] = useState<number | null>(null);
  const stamps = stage.units.filter((_, ui) => unitState(s, stage, ui).complete).length;
  return (
    <>
      <section className="town-map card">
        <header className="town-head">
          <b>🏮 印章 {stamps} / {stage.units.length}</b>
          <small className="muted">點建築物看看那裡會用到的話</small>
        </header>
        <div className="town-grid">
          {stage.units.map((u, ui) => {
            const name = placeName(u);
            const st = unitState(s, stage, ui);
            return (
              <button key={u.id} type="button" className={cx('town-tile', st.complete && 'stamped')} onClick={() => setOpen(ui)} style={{ '--i': ui } as CSSProperties}>
                <span className="town-art">
                  <BuildingArt id={placeOf(u)} size="100%" />
                  {st.complete && <StampArt size={38} text={STAMP_TEXT[lang]} />}
                </span>
                {name && <Tx className="town-name" s={headOf(name)} lang={lang} />}
                <small>{u.title}</small>
              </button>
            );
          })}
        </div>
      </section>
      {open !== null && stage.units[open] && <PlacePanel lang={lang} stage={stage} ui={open} s={s} onClose={() => setOpen(null)} />}
    </>
  );
}

function PlacePanel({ lang, stage, ui, s, onClose }: { lang: LangId; stage: Stage; ui: number; s: Save; onClose: () => void }) {
  const u = stage.units[ui];
  const name = placeName(u);
  const intro = u.lessons[0]?.notes?.[0];
  const words = u.items.filter(isVocab).slice(1);
  const lines = u.items.filter((i): i is SentenceItem => i.kind === 'sentence');
  return (
    <Modal className="place-modal" onClose={onClose}>
      <div className="place-head">
        <BuildingArt id={placeOf(u)} size={92} />
        <div className="grow">
          {name && (
            <h2>
              <Tx s={headOf(name)} lang={lang} /> <SpeakBtn text={sayOf(name, lang)} lang={lang} />
            </h2>
          )}
          <p className="muted">{u.title}</p>
        </div>
        <button type="button" className="icon-btn" aria-label="關閉" onClick={onClose}>
          ✕
        </button>
      </div>

      {intro && (
        <div className="place-intro">
          {intro.body.map((b, i) => (
            <p key={i}>
              <Ruby s={b} />
            </p>
          ))}
        </div>
      )}

      <h3>單字</h3>
      <ul className="place-words">
        {words.map((w) => (
          <li key={w.id}>
            <Tx className="pw-word" s={headOf(w)} lang={lang} />
            <SpeakBtn text={sayOf(w, lang)} lang={lang} size="sm" />
            <span className="muted">{w.m}</span>
          </li>
        ))}
      </ul>

      <h3>對話</h3>
      <ul className="place-lines">
        {lines.map((l) => (
          <li key={l.id}>
            {l.note && <span className="who">{l.note}</span>}
            <div className="grow">
              <Tx s={l.furi ?? l.s} lang={lang} />
              <small className="muted">{l.t}</small>
            </div>
            <SpeakBtn text={l.s} lang={lang} size="sm" />
          </li>
        ))}
      </ul>

      <div className="place-actions">
        {u.lessons.map((l, li) => {
          const state = lessonState(s, stage, ui, li);
          const stars = starsOf(s, l.id);
          return (
            <a key={l.id} className={cx('btn', l.boss ? 'gold' : li === 0 || state === 'done' ? 'primary' : '', state === 'locked' && 'disabled')} href={state === 'locked' ? undefined : href(lessonPath(lang, l.id))}>
              {l.boss ? '🏮 ' : li === 0 ? '📖 ' : '💬 '}
              {l.title}
              {stars > 0 && <Stars n={stars} className="small" />}
            </a>
          );
        })}
      </div>
    </Modal>
  );
}
