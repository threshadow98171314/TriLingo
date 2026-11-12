// 語言頁的「五十音表／字母表」分頁：點字聽發音，學過的字會亮起來。
import { useState } from 'react';
import { courseIndex, loadedCourse } from '../../content';
import type { Save } from '../../core/save';
import { speak, useVoices } from '../../core/tts';
import type { LangId, VocabItem } from '../../core/types';
import { cx } from '../../core/util';
import { sayOf } from '../../engine/exercises';
import { basicTable } from '../../engine/hangul';

type KanaMode = 'both' | 'h' | 'k';

export function ChartTab({ lang, s }: { lang: LangId; s: Save }) {
  useVoices();
  const idx = courseIndex(lang).items;
  const all = loadedCourse(lang).stages.flatMap((st) => st.units).filter((u) => u.chart);
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
