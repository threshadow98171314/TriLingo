// 實戰模擬考：從題庫抽題組卷、計分、判斷程度。只處理資料，不碰畫面與存檔。
import { sample, shuffle, type Rng } from '../core/rng';
import type { Course, MockExam, MockGroup, MockLevel, MockQ, MockSection, VocabItem } from '../core/types';
import { isVocab } from './exercises';
import { confusableReadings, hasKanji } from './furigana';

export interface PaperQ {
  /** 卷內題號（從 0 開始） */
  no: number;
  /** 所屬大題（exam.sections 的索引） */
  section: number;
  group: MockGroup;
  /** 題組的第一題：顯示文章、自動播放聽力 */
  first: boolean;
  q: MockQ;
  /** 洗牌後的選項 */
  options: string[];
  answer: number;
}

export interface Paper {
  exam: MockExam;
  qs: PaperQ[];
}

/**
 * 日檢「漢字讀音」題：從課程單字的例句出題，畫底線的詞不標讀音。
 * 干擾選項是促音、長音、清濁音差一點的讀音，和正式考試的陷阱一樣。
 */
export function kanjiReadingGroups(course: Course, stages: string[], n: number, rng: Rng): MockGroup[] {
  const words: VocabItem[] = course.stages
    .filter((s) => stages.includes(s.id))
    .flatMap((s) => s.units.flatMap((u) => u.items.filter(isVocab)))
    .filter((i) => i.kind === 'word' && !!i.r && !!i.furi && hasKanji(i.w) && !!i.ex?.furi?.includes(i.furi));
  const readings = [...new Set(words.map((w) => w.r!))];
  return sample(words, n, rng).map((w, k) => {
    const r = w.r!;
    const near = shuffle(confusableReadings(r), rng).slice(0, 2);
    const used = new Set([r, ...near]);
    // 其餘選項：長度接近的其他讀音
    const rest = shuffle(
      readings.filter((x) => !used.has(x)),
      rng,
    ).sort((a, b) => Math.abs(a.length - r.length) - Math.abs(b.length - r.length));
    return {
      id: `gen-${k + 1}`,
      qs: [
        {
          id: `${w.id}#yomi`,
          q: w.ex!.furi!.replace(w.furi!, `{${w.w}}`),
          opts: [r, ...[...near, ...rest].slice(0, 3)],
          explain: `「${w.w}」讀作「${r}」，意思是「${w.m}」。`,
          t: w.ex!.t,
        },
      ],
    };
  });
}

/** 組一份考卷：每個大題依設定抽題組，選項洗牌 */
export function buildPaper(exam: MockExam, course: Course, rng: Rng = Math.random): Paper {
  const qs: PaperQ[] = [];
  exam.sections.forEach((sec, si) => {
    let groups = sec.pick && sec.pick < sec.groups.length ? sample(sec.groups, sec.pick, rng) : sec.groups;
    if (sec.gen?.kind === 'kanji-reading') groups = [...kanjiReadingGroups(course, sec.gen.stages, sec.gen.count, rng), ...groups];
    for (const g of groups) {
      g.qs.forEach((q, qi) => {
        const options = shuffle(q.opts, rng);
        qs.push({ no: qs.length, section: si, group: g, first: qi === 0, q, options, answer: options.indexOf(q.opts[0]) });
      });
    }
  });
  return { exam, qs };
}

/** 考卷裡實際出現的大題（自動出題可能出不了題，那一大題就跳過） */
export function paperSections(paper: Paper): { section: MockSection; index: number; from: number; to: number }[] {
  const out: { section: MockSection; index: number; from: number; to: number }[] = [];
  for (const q of paper.qs) {
    const last = out[out.length - 1];
    if (last && last.index === q.section) last.to = q.no;
    else out.push({ section: paper.exam.sections[q.section], index: q.section, from: q.no, to: q.no });
  }
  return out;
}

export interface MockScore {
  correct: number;
  total: number;
  /** 答對率 0–1 */
  pct: number;
  passed: boolean;
  level: MockLevel;
  sections: { title: string; correct: number; total: number }[];
}

export function levelOf(exam: MockExam, pct: number): MockLevel {
  return [...exam.levels].sort((a, b) => b.min - a.min).find((l) => pct >= l.min) ?? exam.levels[exam.levels.length - 1];
}

/** 計分：picks[i] 是第 i 題選的選項（沒作答為 null） */
export function scorePaper(paper: Paper, picks: (number | null)[]): MockScore {
  const ok = (q: PaperQ) => picks[q.no] === q.answer;
  const correct = paper.qs.filter(ok).length;
  const total = paper.qs.length;
  const pct = total ? correct / total : 0;
  return {
    correct,
    total,
    pct,
    passed: pct >= paper.exam.pass,
    level: levelOf(paper.exam, pct),
    sections: paperSections(paper).map(({ section, from, to }) => {
      const list = paper.qs.slice(from, to + 1);
      return { title: section.title, correct: list.filter(ok).length, total: list.length };
    }),
  };
}

/** 聽力稿的一行：「M: …」「F: …」→ 說話者與台詞 */
export function parseLine(line: string): { who: 'M' | 'F' | null; text: string } {
  const m = /^([MF]):\s*(.*)$/.exec(line);
  return m ? { who: m[1] as 'M' | 'F', text: m[2] } : { who: null, text: line };
}
