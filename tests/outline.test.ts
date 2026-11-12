// 大綱與分包：首頁、學習路線只靠大綱（不下載題目）顯示，所以大綱要和題目完全對得上，
// 用大綱算出來的進度也要和用完整課程算的一模一樣。
import { describe, expect, it } from 'vitest';
import { COURSES, COURSE_LIST, PART_UNITS } from '../src/content/all';
import { OUTLINE } from '../src/content/index';
import { outlineOf, stageIdOf, unitIdOf } from '../src/content/outline';
import { outlineFiles, wordleIds } from '../src/content/outline-build';
import { PARTS } from '../src/content/parts';
import { mulberry32 } from '../src/core/rng';
import {
  activeNeed,
  activeParts,
  bankState,
  currentStage,
  learnedIn,
  lessonState,
  nextBankLesson,
  nextInStage,
  nextUp,
  stageState,
  unitState,
} from '../src/core/progress';
import { defaultSave, type Save } from '../src/core/save';
import { LANGS, type Course, type CourseOutline } from '../src/core/types';
import { DRILL_LANG, DRILLS } from '../src/engine/drills';
import { isVocab } from '../src/engine/exercises';
import { dailyPick, tilesOf, wordlePool, WORD_LEN } from '../src/engine/wordle';

describe('大綱', () => {
  it('大綱檔是最新的（改了題目要跑 npm run outline；npm test、npm run build 會自動跑）', async () => {
    const fs = (await import(/* @vite-ignore */ `node:${'fs'}`)) as { readFileSync(p: string, enc: 'utf8'): string };
    for (const [name, text] of Object.entries(outlineFiles())) {
      expect(fs.readFileSync(`src/content/gen/${name}`, 'utf8').replace(/\r\n/g, '\n'), name).toBe(text);
    }
  });

  it('App 讀到的大綱和完整課程的單元、課、項目數一模一樣', () => {
    for (const c of COURSE_LIST) {
      const o = OUTLINE[c.id];
      expect(o.stages.map((s) => s.id)).toEqual(c.stages.map((s) => s.id));
      expect(o.total).toBe(c.stages.reduce((a, s) => a + s.units.reduce((b, u) => b + u.items.length, 0), 0));
      c.stages.forEach((s, si) => {
        const os = o.stages[si];
        expect({ ...os, units: undefined }).toEqual({ ...s, units: undefined });
        expect(os.units.length, s.id).toBe(s.units.length);
        s.units.forEach((u, ui) => {
          const ou = os.units[ui];
          expect(ou.id).toBe(u.id);
          expect([ou.title, ou.subtitle, ou.icon, ou.kind, ou.bank, ou.count, !!ou.hasChart], u.id).toEqual([u.title, u.subtitle, u.icon, u.kind, u.bank, u.items.length, !!u.chart]);
          expect(ou.lessons, u.id).toEqual(u.lessons.map((l) => ({ id: l.id, title: l.title, ...(l.boss ? { boss: true } : {}) })));
        });
      });
    }
  });

  it('每一包的單元都屬於那一關，大綱記的包號對得上', () => {
    for (const [stageId, parts] of Object.entries(PART_UNITS)) {
      expect(parts.length, stageId).toBe(PARTS[stageId].length);
      parts.forEach((units, part) => {
        expect(units.length, `${stageId}/${part} 是空的`).toBeGreaterThan(0);
        for (const u of units) {
          expect(stageIdOf(u.id), u.id).toBe(stageId);
          const ou = OUTLINE[u.id.slice(0, 2) as 'en'].stages.find((s) => s.id === stageId)!.units.find((x) => x.id === u.id)!;
          expect(ou.part, u.id).toBe(part);
        }
      });
    }
    // 有單元的關卡都列在 parts.ts
    for (const c of COURSE_LIST) for (const s of c.stages) if (s.units.length) expect(PARTS[s.id], s.id).toBeTruthy();
  });

  it('由 id 推算關卡、單元', () => {
    expect(stageIdOf('ja.n5.greet:こんにちは')).toBe('ja.n5');
    expect(unitIdOf('ja.n5.greet:こんにちは')).toBe('ja.n5.greet');
    expect(unitIdOf('ja.n5.greet#boss')).toBe('ja.n5.greet');
    expect(unitIdOf('ko.k1.bank.food')).toBe('ko.k1.bank.food');
  });
});

/** 隨機的存檔：通過一些課、學過一些字（含已下架的舊項目），停在某一關 */
function randomSave(c: Course, seed: number): Save {
  const rng = mulberry32(seed);
  const s = defaultSave(0);
  const units = c.stages.flatMap((st) => st.units);
  for (const u of units) {
    const r = rng();
    if (r < 0.5) continue;
    // 一部分的單元：照順序上了幾課，有時直接通過測驗（跳級）
    const n = Math.floor(rng() * (u.lessons.length + 1));
    for (const l of u.lessons.slice(0, n)) s.lessons[l.id] = { stars: 1 + Math.floor(rng() * 3), plays: 1 };
    if (rng() < 0.2) s.lessons[u.lessons[u.lessons.length - 1].id] = { stars: 2, plays: 1 };
    for (const it of u.items) if (rng() < 0.4) s.items[it.id] = { s: 1 + Math.floor(rng() * 6), due: Math.floor(rng() * 40000), ok: 1, ng: 0, t: Math.floor(rng() * 1e9) };
  }
  // 已下架的舊項目也會留在存檔裡
  s.items[`${c.id}.gone.unit:舊的字`] = { s: 1, due: 0, ok: 1, ng: 0, t: 1 };
  if (rng() < 0.5) s.stage[c.id] = c.stages[Math.floor(rng() * c.stages.length)].id;
  return s;
}

const ids = <T extends { id: string } | undefined>(x: T) => x?.id;

describe('只用大綱算進度', () => {
  it('解鎖、星星、下一課、單字庫進度都和用完整課程算的一樣', () => {
    for (const c of COURSE_LIST) {
      const o: CourseOutline = OUTLINE[c.id];
      for (let seed = 1; seed <= 12; seed++) {
        const s = randomSave(c, seed * 97 + c.id.charCodeAt(0));
        expect(ids(currentStage(s, o)), `${c.id} #${seed}`).toBe(ids(currentStage(s, c)));
        const a = nextUp(s, o);
        const b = nextUp(s, c);
        expect([ids(a?.stage), ids(a?.unit), ids(a?.lesson), a?.unitIndex]).toEqual([ids(b?.stage), ids(b?.unit), ids(b?.lesson), b?.unitIndex]);
        c.stages.forEach((st, si) => {
          const os = o.stages[si];
          expect(stageState(s, os)).toEqual(stageState(s, st));
          expect(bankState(s, os), st.id).toEqual(bankState(s, st));
          expect(ids(nextInStage(s, os)?.lesson)).toBe(ids(nextInStage(s, st)?.lesson));
          expect(ids(nextBankLesson(s, os)?.lesson)).toBe(ids(nextBankLesson(s, st)?.lesson));
          st.units.forEach((u, ui) => {
            expect(unitState(s, os, ui)).toEqual(unitState(s, st, ui));
            expect(learnedIn(s, os.units[ui]), u.id).toBe(learnedIn(s, u));
            u.lessons.forEach((_, li) => expect(lessonState(s, os, ui, li)).toBe(lessonState(s, st, ui, li)));
          });
        });
      }
    }
  });

  it('學過的字所在的那幾包：每一包只取一個代表，學得最多的排前面', () => {
    const c = COURSES.ja;
    const s = randomSave(c, 7);
    const need = activeNeed(s, 'ja') as { units: string[] };
    const parts = need.units.map((u) => {
      const st = OUTLINE.ja.stages.find((x) => x.id === stageIdOf(u))!;
      return `${st.id}/${st.units.find((x) => x.id === u)!.part}`;
    });
    // 不重複，而且涵蓋所有學過的字（已下架的舊項目除外）
    expect(new Set(parts).size).toBe(parts.length);
    const want = new Set<string>();
    for (const st of c.stages)
      for (const u of st.units)
        if (u.items.some((i) => s.items[i.id])) want.add(`${st.id}/${OUTLINE.ja.stages.find((x) => x.id === st.id)!.units.find((x) => x.id === u.id)!.part}`);
    expect(new Set(parts)).toEqual(want);
    expect(activeParts(s, 'ja')).toEqual(need.units);
    expect(activeParts(defaultSave(0), 'ja')).toEqual([]);
  });
});

describe('猜詞的每日候選字', () => {
  it('和原本從整個課程挑字的結果一樣（同一天的每日題目不變）', () => {
    for (const lang of LANGS) {
      const list = wordleIds(lang);
      const items = COURSES[lang].stages.flatMap((st) => st.units.flatMap((u) => u.items)).filter(isVocab);
      const pool = wordlePool(items, lang);
      expect(list).toEqual(pool.map((i) => i.id));
      expect(new Set(list).size).toBe(list.length);
      for (const day of ['2026-01-01', '2026-11-12', '2027-03-05']) expect(dailyPick(list, day, lang)).toBe(dailyPick(pool, day, lang)?.id);
      for (const i of pool) expect(tilesOf(i, lang)?.length).toBe(WORD_LEN[lang]);
    }
  });
});

describe('專屬特訓', () => {
  it('特訓的語言對照表（存檔、網址用）和出題清單一致', () => {
    expect(Object.fromEntries(DRILLS.map((d) => [d.id, d.lang]))).toEqual(DRILL_LANG);
  });
});

describe('outlineOf', () => {
  it('不經過檔案也能由課程產生大綱（工具用）', () => {
    const o = outlineOf(COURSES.ko, PART_UNITS);
    expect(o.total).toBe(OUTLINE.ko.total);
    expect(o.stages.map((s) => s.units.length)).toEqual(OUTLINE.ko.stages.map((s) => s.units.length));
  });
});
