// 設定學習目標：挑一個關卡和日期，先看每週要上幾課再儲存。目標存在存檔裡，跟著雲端同步。
import { useState, type CSSProperties } from 'react';
import { META, OUTLINE } from '../content';
import { addDays, slashDate, today } from '../core/date';
import { goalPlan } from '../core/goals';
import { stageState } from '../core/progress';
import { setGoal, useSave } from '../core/store';
import type { LangId } from '../core/types';
import { zhJoin } from '../core/util';
import { Modal } from './ui';

/** 快速選日期 */
const PRESETS: [string, number][] = [
  ['1 個月', 30],
  ['3 個月', 91],
  ['半年', 182],
  ['1 年', 365],
];

/** 每週的份量換成好懂的說法 */
export function paceText(weekly: number): string {
  if (weekly <= 0) return '已經完成了';
  if (weekly <= 7) return `每週約 ${weekly} 課（一週學 ${weekly} 天、每天一課就夠）`;
  return `每週約 ${weekly} 課（每天約 ${Math.ceil(weekly / 7)} 課）`;
}

export function GoalModal({ lang, onClose }: { lang: LangId; onClose: () => void }) {
  const s = useSave();
  const course = OUTLINE[lang];
  const cur = s.goals[lang]?.stage ? s.goals[lang] : undefined;
  // 可以當目標的關卡：已經有內容、還沒完成的（主路線在前）
  const open = course.stages.filter((st) => st.units.length && !stageState(s, st).complete);
  const groups = [
    { label: course.pathLabel, stages: open.filter((st) => st.group === 'main') },
    { label: course.trackLabel ?? '主題路線', stages: open.filter((st) => st.group !== 'main') },
  ].filter((g) => g.stages.length);
  const [stage, setStageId] = useState(cur && open.some((st) => st.id === cur.stage) ? cur.stage : (open[0]?.id ?? ''));
  const [by, setBy] = useState(cur?.by ?? addDays(today(), 91));
  const minDay = addDays(today(), 7);
  const preview = stage && by >= minDay ? goalPlan(s, course, { stage, by, at: 0 }) : null;

  const save = () => {
    setGoal(lang, stage, by);
    onClose();
  };

  return (
    <Modal className="goal-modal" onClose={onClose}>
      <h2>🎯 {META[lang].name}的學習目標</h2>
      {open.length === 0 ? (
        <p className="muted">所有關卡都完成了，太厲害了！之後有新的關卡開放時，再來設定新目標吧。</p>
      ) : (
        <>
          <p className="muted">定一個「在哪一天之前完成哪一關」的目標，「今天」頁會算出這週要上幾課，照著走就不會落後。</p>
          <label className="goal-field">
            <span>想完成的關卡</span>
            <select value={stage} onChange={(e) => setStageId(e.target.value)}>
              {groups.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.stages.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="goal-field">
            <span>目標日期</span>
            <input type="date" value={by} min={minDay} onChange={(e) => setBy(e.target.value)} />
          </label>
          <div className="goal-presets">
            {PRESETS.map(([label, days]) => (
              <button key={label} type="button" className="chip" onClick={() => setBy(addDays(today(), days))}>
                {label}後
              </button>
            ))}
          </div>
          {preview ? (
            <div className="goal-preview" style={{ '--lang': META[lang].color } as CSSProperties}>
              <b>{paceText(preview.weekly)}</b>
              <small className="muted">
                到 {slashDate(by)} 還有 {preview.weeks} 週，{zhJoin('完成', preview.stage.short, '之前還有')} {preview.remaining} 課（學習路線，不含單字庫）
              </small>
            </div>
          ) : (
            <p className="warn-text goal-preview">目標日期至少要在一週後。</p>
          )}
        </>
      )}
      <div className="modal-actions">
        {cur && (
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setGoal(lang, '', '');
              onClose();
            }}
          >
            取消目標
          </button>
        )}
        <button type="button" className="btn" onClick={onClose}>
          關閉
        </button>
        {open.length > 0 && (
          <button type="button" className="btn primary" disabled={!preview} onClick={save}>
            儲存目標
          </button>
        )}
      </div>
    </Modal>
  );
}
