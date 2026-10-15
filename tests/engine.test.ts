import { describe, expect, it } from 'vitest';
import { COURSE_LIST, COURSES } from '../src/content/all';
import { mulberry32 } from '../src/core/rng';
import type { LangId, VocabItem } from '../src/core/types';
import { cellsOfWord, generateCrossword, type Crossword, type CwEntry } from '../src/engine/crossword';
import {
  buildLesson,
  buildListening,
  buildReview,
  cellsOf,
  isVocab,
  listenEx,
  readingEx,
  recog,
  reshuffle,
  type Ctx,
  type Exercise,
} from '../src/engine/exercises';
import { confusableReadings, furiKana, furiPlain, furiSegs, hasKanji, toKatakana } from '../src/engine/furigana';
import { basicTable } from '../src/engine/hangul';
import { kanaToRomaji } from '../src/engine/romaji';

const ctxOf = (lang: LangId, seed = 1, canListen = true): Ctx => ({ lang, rng: mulberry32(seed), canListen });
const vocabOf = (lang: LangId): VocabItem[] =>
  COURSES[lang].stages.flatMap((s) => s.units).flatMap((u) => u.items).filter(isVocab);

describe('振假名', () => {
  const s = '学校[がっこう]へ行[い]きます。';
  it('可以導出純文字、假名與分段', () => {
    expect(furiPlain(s)).toBe('学校へ行きます。');
    expect(furiKana(s)).toBe('がっこうへいきます。');
    expect(furiSegs(s)).toEqual([{ t: '学校', r: 'がっこう' }, { t: 'へ' }, { t: '行', r: 'い' }, { t: 'きます。' }]);
  });
  it('疊字符號「々」算在漢字裡', () => {
    expect(furiKana('別々[べつべつ]で')).toBe('べつべつで');
  });
  it('沒有標註的文字原樣保留', () => {
    expect(furiSegs('ありがとう')).toEqual([{ t: 'ありがとう' }]);
    expect(hasKanji('ありがとう')).toBe(false);
  });
  it('平假名轉片假名', () => {
    expect(toKatakana('きゃ行')).toBe('キャ行');
  });
});

describe('易混淆讀音', () => {
  it('產生促音、長音、清濁音的近似讀音', () => {
    expect(confusableReadings('がっこう')).toEqual(expect.arrayContaining(['がこう', 'がっこ', 'かっこう']));
    expect(confusableReadings('びょういん')).toContain('びょいん');
  });
  it('不會包含原本的讀音，也不會重複', () => {
    for (const r of ['ひと', 'いち', 'ともだち', 'せんせい', 'じゅう', 'に']) {
      const c = confusableReadings(r);
      expect(c).not.toContain(r);
      expect(new Set(c).size).toBe(c.length);
    }
  });
});

describe('羅馬拼音', () => {
  it('處理促音、拗音、長音與撥音', () => {
    expect(kanaToRomaji('がっこう')).toBe('gakkou');
    expect(kanaToRomaji('きょう')).toBe('kyou');
    expect(kanaToRomaji('まっちゃ')).toBe('matcha');
    expect(kanaToRomaji('コーヒー')).toBe('koohii');
    expect(kanaToRomaji('ほんや')).toBe("hon'ya");
    expect(kanaToRomaji('せんせい')).toBe('sensei');
  });
});

describe('韓文音節表', () => {
  it('14 個子音 × 10 個母音', () => {
    const t = basicTable();
    expect(t.rows).toHaveLength(14);
    expect(t.vowels).toHaveLength(10);
    expect(t.rows[0].cells[0]).toEqual({ syl: '가', rm: 'ga' });
    expect(t.rows[13].cells[9]).toEqual({ syl: '히', rm: 'hi' });
    expect(t.rows[7].cells[0]).toEqual({ syl: '아', rm: 'a' });
  });
});

// ───────── 填字遊戲 ─────────

function entriesOf(lang: LangId, limit?: number): CwEntry[] {
  return vocabOf(lang)
    .filter((i) => {
      const c = cellsOf(i, lang);
      return !!c && c.length >= 2 && c.length <= 9;
    })
    .slice(0, limit)
    .map((i) => ({ id: i.id, cells: cellsOf(i, lang)!, clue: i.m, solved: i.w }));
}

/** 檢查盤面合法：交叉格同字、沒有多拼出來的字、全部連在一起、編號正確 */
function assertValid(cw: Crossword) {
  const grid = new Map<string, string>();
  for (const w of cw.words) {
    cellsOfWord(w).forEach((p, k) => {
      expect(p.r).toBeGreaterThanOrEqual(0);
      expect(p.c).toBeGreaterThanOrEqual(0);
      expect(p.r).toBeLessThan(cw.rows);
      expect(p.c).toBeLessThan(cw.cols);
      const key = `${p.r},${p.c}`;
      if (grid.has(key)) expect(grid.get(key)).toBe(w.cells[k]);
      grid.set(key, w.cells[k]);
    });
  }
  const has = (r: number, c: number) => grid.has(`${r},${c}`);

  // 盤面上每一段連續兩格以上的字，都必須剛好是一個放進去的字
  const placed = new Set(cw.words.map((w) => `${w.dir}:${w.row},${w.col}:${w.cells.join('')}`));
  let runs = 0;
  for (let r = 0; r < cw.rows; r++) {
    for (let c = 0; c < cw.cols; c++) {
      if (!has(r, c)) continue;
      for (const [dir, dr, dc] of [[0, 0, 1], [1, 1, 0]] as const) {
        if (has(r - dr, c - dc) || !has(r + dr, c + dc)) continue;
        let run = '';
        for (let k = 0; has(r + dr * k, c + dc * k); k++) run += grid.get(`${r + dr * k},${c + dc * k}`);
        expect(placed.has(`${dir}:${r},${c}:${run}`), `多出來的字：${run}`).toBe(true);
        runs++;
      }
    }
  }
  expect(runs).toBe(cw.words.length);

  // 數一數有幾個互不相連的區塊；每個區塊至少要有兩個交叉的字
  const seen = new Set<string>();
  let islands = 0;
  for (const start of grid.keys()) {
    if (seen.has(start)) continue;
    islands++;
    const part = new Set([start]);
    const queue = [start];
    while (queue.length) {
      const [r, c] = queue.pop()!.split(',').map(Number);
      for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
        const k = `${r + dr},${c + dc}`;
        if (grid.has(k) && !part.has(k)) {
          part.add(k);
          queue.push(k);
        }
      }
    }
    for (const k of part) seen.add(k);
    const inPart = cw.words.filter((w) => part.has(`${w.row},${w.col}`));
    expect(inPart.length, '落單的字').toBeGreaterThanOrEqual(2);
  }

  // 編號依閱讀順序遞增，同一格起始的橫、直共用號碼
  const starts = new Map<string, number>();
  for (const w of cw.words) {
    const k = `${w.row},${w.col}`;
    if (starts.has(k)) expect(starts.get(k)).toBe(w.num);
    starts.set(k, w.num);
  }
  const order = [...starts.entries()].sort((a, b) => a[1] - b[1]).map(([k]) => k.split(',').map(Number));
  for (let i = 1; i < order.length; i++) {
    expect(order[i][0] * 1000 + order[i][1]).toBeGreaterThan(order[i - 1][0] * 1000 + order[i - 1][1]);
  }
  expect(new Set(cw.words.map((w) => w.cells.join(''))).size).toBe(cw.words.length);
  return islands;
}

describe('填字遊戲產生器', () => {
  const sizes: Record<LangId, { target: number; maxRows: number; maxCols: number }> = {
    en: { target: 8, maxRows: 12, maxCols: 11 },
    ja: { target: 7, maxRows: 10, maxCols: 9 },
    ko: { target: 6, maxRows: 9, maxCols: 8 },
  };

  for (const c of COURSE_LIST) {
    it(`${c.name}：用全部單字能排滿目標字數，而且整個盤面連成一片`, () => {
      const entries = entriesOf(c.id);
      for (let seed = 1; seed <= 25; seed++) {
        const cw = generateCrossword(entries, { rng: mulberry32(seed), ...sizes[c.id], attempts: 60 });
        expect(cw, `seed ${seed}`).not.toBeNull();
        expect(assertValid(cw!), `seed ${seed}`).toBe(1);
        expect(cw!.words.length).toBe(sizes[c.id].target);
        expect(cw!.rows).toBeLessThanOrEqual(sizes[c.id].maxRows);
        expect(cw!.cols).toBeLessThanOrEqual(sizes[c.id].maxCols);
      }
    });

    it(`${c.name}：學的字還不多時（12、20、35 個），排得出來就一定合法`, () => {
      for (const n of [12, 20, 35]) {
        const entries = entriesOf(c.id, n);
        for (let seed = 1; seed <= 25; seed++) {
          const cw = generateCrossword(entries, { rng: mulberry32(seed), ...sizes[c.id], attempts: 60 });
          if (!cw) continue;
          assertValid(cw);
          expect(cw.rows).toBeLessThanOrEqual(sizes[c.id].maxRows);
          expect(cw.cols).toBeLessThanOrEqual(sizes[c.id].maxCols);
        }
      }
    });
  }

  it('不允許分區時，盤面一定連成一片', () => {
    const entries = entriesOf('ko', 35);
    for (let seed = 1; seed <= 25; seed++) {
      const cw = generateCrossword(entries, { rng: mulberry32(seed), ...sizes.ko, islands: false });
      if (cw) expect(assertValid(cw)).toBe(1);
    }
  });

  it('字彼此接不上時會分區，讓盤面有更多字', () => {
    // 兩組各自能交叉、但兩組之間沒有共用字的字
    const entries: CwEntry[] = [
      ['A', 'B', 'C'],
      ['A', 'X'],
      ['C', 'Y'],
      ['D', 'E', 'F'],
      ['D', 'Z'],
      ['F', 'W'],
    ].map((cells, i) => ({ id: String(i), cells, clue: '', solved: '' }));
    const joined = generateCrossword(entries, { rng: mulberry32(3), target: 6, islands: false });
    const split = generateCrossword(entries, { rng: mulberry32(3), target: 6 });
    expect(joined!.words).toHaveLength(3);
    expect(split!.words).toHaveLength(6);
    expect(assertValid(split!)).toBe(2);
  });

  it('同一個種子產生同一個盤面（每日填字）', () => {
    const entries = entriesOf('en');
    const a = generateCrossword(entries, { rng: mulberry32(42) });
    const b = generateCrossword(entries, { rng: mulberry32(42) });
    expect(a).toEqual(b);
  });

  it('可用的字太少時回傳 null', () => {
    expect(generateCrossword(entriesOf('en', 2))).toBeNull();
    expect(
      generateCrossword([
        { id: 'a', cells: ['A', 'B'], clue: '', solved: '' },
        { id: 'b', cells: ['C', 'D'], clue: '', solved: '' },
        { id: 'c', cells: ['E', 'F'], clue: '', solved: '' },
      ]),
    ).toBeNull();
  });
});

// ───────── 出題 ─────────

function assertExercise(ex: Exercise, where: string) {
  if (ex.t === 'choice') {
    expect(ex.options.length, where).toBeGreaterThanOrEqual(2);
    expect(ex.answer, where).toBeGreaterThanOrEqual(0);
    expect(ex.answer, where).toBeLessThan(ex.options.length);
    expect(new Set(ex.options.map((o) => o.s)).size, `${where} 選項重複`).toBe(ex.options.length);
    if (!ex.audio) expect(ex.prompt, where).toBeTruthy();
    if (ex.hidePrompt) expect(ex.audio, where).toBeTruthy();
  } else if (ex.t === 'tiles') {
    expect(ex.answer.length, where).toBeGreaterThanOrEqual(2);
    const bank = [...ex.bank];
    for (const t of ex.answer) {
      const i = bank.indexOf(t);
      expect(i, `${where} 字卡不足：${t}`).toBeGreaterThanOrEqual(0);
      bank.splice(i, 1);
    }
  } else if (ex.t === 'type') {
    expect(ex.accept.length, where).toBeGreaterThan(0);
    for (const a of ex.accept) expect(a, where).toMatch(/^[a-z']+$/);
  } else if (ex.t === 'match') {
    expect(ex.pairs.length, where).toBeGreaterThanOrEqual(3);
    expect(new Set(ex.pairs.map((p) => p.a.s)).size, where).toBe(ex.pairs.length);
    expect(new Set(ex.pairs.map((p) => p.b.s)).size, where).toBe(ex.pairs.length);
  }
}

describe('出題引擎', () => {
  it('每一堂課（含單元測驗）都出得了題，而且每一題都合法', () => {
    let lessons = 0;
    for (const c of COURSE_LIST) {
      for (const u of c.stages.flatMap((s) => s.units)) {
        for (const l of u.lessons) {
          for (const canListen of [true, false]) {
            for (const seen of [false, true]) {
              const exs = buildLesson(u, l, ctxOf(c.id, 7, canListen), () => seen);
              expect(exs.length, l.id).toBeGreaterThanOrEqual(4);
              exs.forEach((ex, i) => assertExercise(ex, `${l.id} #${i}`));
              const graded = exs.filter((e) => e.t !== 'teach' && e.t !== 'note');
              expect(graded.length, l.id).toBeGreaterThanOrEqual(4);
              if (!canListen) expect(exs.some((e) => e.t === 'choice' && e.audio), `${l.id} 沒有語音時不該出聽力題`).toBe(false);
              if (l.boss || seen) expect(exs.some((e) => e.t === 'teach'), l.id).toBe(false);
            }
          }
          lessons++;
        }
      }
    }
    expect(lessons).toBeGreaterThan(150);
  });

  it('第一次上的單字課：每個新項目都有教學卡，而且都被考到', () => {
    for (const c of COURSE_LIST) {
      for (const u of c.stages.flatMap((s) => s.units)) {
        for (const l of u.lessons.filter((x) => !x.boss)) {
          const exs = buildLesson(u, l, ctxOf(c.id, 3), () => false);
          const vocabIds = l.itemIds.filter((id) => isVocab(u.items.find((i) => i.id === id)!));
          const taught = new Set(exs.filter((e) => e.t === 'teach').map((e) => (e.t === 'teach' ? e.item.id : '')));
          const asked = new Set(exs.flatMap((e) => (e.t === 'choice' || e.t === 'tiles' || e.t === 'type' ? [e.itemId] : [])));
          for (const id of vocabIds) {
            expect(taught.has(id), `${id} 沒有教學卡`).toBe(true);
            expect(asked.has(id), `${id} 沒有被考到`).toBe(true);
          }
        }
      }
    }
  });

  it('同一個種子出同樣的題目', () => {
    const u = COURSES.ja.stages[1].units[0];
    const a = buildLesson(u, u.lessons[0], ctxOf('ja', 99), () => false);
    const b = buildLesson(u, u.lessons[0], ctxOf('ja', 99), () => false);
    expect(a).toEqual(b);
  });

  it('日文單字題只顯示假名，不讓漢字洩漏答案', () => {
    const pool = vocabOf('ja').filter((i) => i.id.startsWith('ja.n5.place'));
    const school = pool.find((i) => i.w === '学校')!;
    const ex = recog(school, pool, ctxOf('ja'));
    expect(ex.prompt?.s).toBe('がっこう');
    expect(ex.options[ex.answer].s).toBe('學校');
  });

  it('漢字讀音題：正解是假名讀音，並帶有近似讀音當干擾', () => {
    const pool = vocabOf('ja').filter((i) => i.id.startsWith('ja.n5.place'));
    const school = pool.find((i) => i.w === '学校')!;
    const ex = readingEx(school, pool, ctxOf('ja'))!;
    expect(ex.prompt?.s).toBe('学校');
    expect(ex.options[ex.answer].s).toBe('がっこう');
    const near = confusableReadings('がっこう');
    expect(ex.options.some((o) => near.includes(o.s))).toBe(true);
    // 沒有漢字的字不出讀音題
    expect(readingEx(pool.find((i) => i.w === 'トイレ')!, pool, ctxOf('ja'))).toBeNull();
  });

  it('聽力題不會把同音的字當成干擾選項（を／お、じ／ぢ、애／에）', () => {
    const cases: [LangId, string, string, string][] = [
      ['ja', 'ja.kana.h1', 'を', 'お'],
      ['ja', 'ja.kana.h1', 'お', 'を'],
      ['ja', 'ja.kana.h2', 'ぢ', 'じ'],
      ['ja', 'ja.kana.h2', 'ず', 'づ'],
      ['ja', 'ja.kana.k1', 'ヲ', 'オ'],
      ['ko', 'ko.hangul.vowel2', '애', '에'],
      ['ko', 'ko.hangul.vowel2', '왜', '외'],
      ['ko', 'ko.hangul.vowel2', '웨', '왜'],
    ];
    for (const [lang, unitId, target, twin] of cases) {
      const pool = vocabOf(lang).filter((i) => i.id.startsWith(`${unitId}:`));
      const item = pool.find((i) => i.w === target)!;
      expect(item, target).toBeTruthy();
      for (let seed = 1; seed <= 40; seed++) {
        const ex = listenEx(item, pool, ctxOf(lang, seed));
        expect(ex.options.map((o) => o.s), `${target} 的選項`).not.toContain(twin);
        expect(ex.options[ex.answer].s).toBe(target);
      }
    }
  });

  it('答案相同的項目不會同時出現（じ／ぢ 都唸 ji）', () => {
    const pool = vocabOf('ja').filter((i) => i.id.startsWith('ja.kana.h2:'));
    const ji = pool.find((i) => i.w === 'じ')!;
    for (let seed = 1; seed <= 40; seed++) {
      const ex = recog(ji, pool, ctxOf('ja', seed));
      expect(ex.options.filter((o) => o.s === 'ji')).toHaveLength(1);
    }
  });

  it('重新洗牌後正確答案不變', () => {
    const u = COURSES.en.stages[0].units[0];
    const exs = buildLesson(u, u.lessons[0], ctxOf('en', 5), () => true);
    for (const ex of exs) {
      const re = reshuffle(ex, mulberry32(77));
      if (ex.t === 'choice' && re.t === 'choice') expect(re.options[re.answer]).toEqual(ex.options[ex.answer]);
      if (ex.t === 'tiles' && re.t === 'tiles') expect([...re.bank].sort()).toEqual([...ex.bank].sort());
    }
  });

  it('複習與聽力特訓：每個項目都出得了題', () => {
    for (const c of COURSE_LIST) {
      const units = c.stages.flatMap((s) => s.units);
      for (const strength of [1, 3, 6]) {
        const entries = units.flatMap((u) => u.items.map((item) => ({ item, strength, pool: u.items })));
        const exs = buildReview(entries, ctxOf(c.id, 11));
        expect(exs.length, c.id).toBe(entries.length);
        exs.forEach((ex, i) => assertExercise(ex, `${c.id} 複習 #${i}`));
      }
      const vocab = vocabOf(c.id);
      const unitOf = new Map(units.flatMap((u) => u.items.map((i) => [i.id, u.items.filter(isVocab)] as const)));
      const listening = buildListening(vocab, (i) => unitOf.get(i.id)!, ctxOf(c.id, 13), 40);
      expect(listening).toHaveLength(40);
      listening.forEach((ex, i) => {
        assertExercise(ex, `${c.id} 聽力 #${i}`);
        expect(ex.t === 'choice' && !!ex.audio).toBe(true);
      });
    }
  });
});
