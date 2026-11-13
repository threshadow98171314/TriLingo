// 「今天的學習」：先複習到期的字（最多 TODAY_REVIEW 個），再上下一堂新課。只看存檔和大綱就排得出來。
import { describe, expect, it } from 'vitest';
import { OUTLINE } from '../src/content/index';
import { dayNum, today } from '../src/core/date';
import { defaultSave, type Save } from '../src/core/save';
import { TODAY_REVIEW, todayPlan } from '../src/core/today';

/** 學過這些字，下次複習在 dueIn 天後（0＝今天到期，負的＝早就到期了） */
function learn(s: Save, ids: string[], dueIn: number) {
  const d = dayNum(today());
  for (const id of ids) s.items[id] = { s: 1, due: d + dueIn, ok: 1, ng: 0, t: Date.now() };
}
const ids = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => `${prefix}.${i}`);

describe('今天的學習', () => {
  it('還沒學過：不用複習，新課是學習路線的第一堂', () => {
    const s = defaultSave(Date.now());
    const first = OUTLINE.ja.stages[0];
    const p = todayPlan(s, 'ja');
    expect(p).toMatchObject({ review: 0, due: 0, fresh: true });
    expect(p.lesson?.id).toBe(first.units[0].lessons[0].id);
    expect(p.lesson?.label.startsWith(`${first.short} › ${first.units[0].title}`)).toBe(true);
  });

  it('到期的字最多複習 TODAY_REVIEW 個；還沒到期的、別的語言的字不算', () => {
    const s = defaultSave(Date.now());
    learn(s, ids('ja.t', TODAY_REVIEW + 8), 0);
    learn(s, ids('ja.old', 2), -5);
    learn(s, ids('ja.later', 6), 3);
    learn(s, ids('en.t', 3), -1);
    expect(todayPlan(s, 'ja')).toMatchObject({ review: TODAY_REVIEW, due: TODAY_REVIEW + 10, fresh: false });
    expect(todayPlan(s, 'en')).toMatchObject({ review: 3, due: 3, fresh: false });
    expect(todayPlan(s, 'ko')).toMatchObject({ review: 0, due: 0, fresh: true });
  });

  it('新課：上完的課跳過；單元的課都上完就考單元測驗', () => {
    const s = defaultSave(Date.now());
    const unit = OUTLINE.ko.stages[0].units[0];
    const [first, second] = unit.lessons;
    s.lessons[first.id] = { stars: 3, plays: 1 };
    expect(todayPlan(s, 'ko').lesson?.id).toBe(second.id);
    for (const l of unit.lessons.filter((l) => !l.boss)) s.lessons[l.id] = { stars: 2, plays: 1 };
    const boss = unit.lessons.find((l) => l.boss)!;
    const p = todayPlan(s, 'ko');
    expect(p.lesson?.id).toBe(boss.id);
    expect(p.lesson?.label.endsWith('・單元測驗')).toBe(true);
  });

  it('有學習目標時，新課從目標範圍裡找；目標範圍都上完了就接著目前的關卡', () => {
    const s = defaultSave(Date.now());
    s.stage.ja = 'ja.n1';
    const n1First = OUTLINE.ja.stages.find((x) => x.id === 'ja.n1')!.units[0].lessons[0];
    expect(todayPlan(s, 'ja').lesson?.id).toBe(n1First.id);
    s.goals.ja = { stage: 'ja.n5', by: '2099-01-01', at: 1 };
    expect(todayPlan(s, 'ja').lesson?.id).toBe(OUTLINE.ja.stages[0].units[0].lessons[0].id);
    for (const st of OUTLINE.ja.stages.slice(0, 2)) for (const u of st.units) for (const l of u.lessons) s.lessons[l.id] = { stars: 1, plays: 1 };
    expect(todayPlan(s, 'ja').lesson?.id).toBe(n1First.id);
  });

  it('學習路線全部上完：沒有新課', () => {
    const s = defaultSave(Date.now());
    for (const st of OUTLINE.en.stages) for (const u of st.units) for (const l of u.lessons) s.lessons[l.id] = { stars: 3, plays: 1 };
    expect(todayPlan(s, 'en').lesson).toBeNull();
  });
});
