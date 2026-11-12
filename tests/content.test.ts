// 課程內容的完整性檢查。之後新增 N4、棕色證書等內容時，這些測試能抓出常見的筆誤。
import { describe, expect, it } from 'vitest';
import { COURSE_LIST } from '../src/content/all';
import { moreTable } from '../src/content/dsl';
import { EN_MORE } from '../src/content/en-more';
import { JA_MORE } from '../src/content/ja-more';
import { KO_MORE } from '../src/content/ko-more';
import type { Course, Example, Item, LangId, Unit, VocabItem } from '../src/core/types';
import { corpusOfCourse, examplesOf } from '../src/engine/examples';
import { isVocab } from '../src/engine/exercises';
import { furiKana, furiPlain } from '../src/engine/furigana';

const units = (c: Course): Unit[] => c.stages.flatMap((s) => s.units);
const items = (c: Course): Item[] => units(c).flatMap((u) => u.items);
const byLang = (id: string) => COURSE_LIST.find((c) => c.id === id)!;
/** 單字自己的例句與更多例句 */
const exsOf = (it: VocabItem): Example[] => [it.ex, ...(it.more ?? [])].filter((e): e is Example => !!e);

// 允許出現在讀音裡的非假名字元
const KANA_OK = /^[ぁ-ゖァ-ヺー、。？！?!0-9A-Za-z\s]+$/;
const HANGUL_OK = /^[가-힣\s?!.,]+$/;

describe('課程結構', () => {
  it('三種語言都有，而且都有可以上的課', () => {
    expect(COURSE_LIST.map((c) => c.id)).toEqual(['en', 'ja', 'ko']);
    for (const c of COURSE_LIST) expect(items(c).length).toBeGreaterThan(100);
  });

  it('英文依多益證書顏色分級，金色最高', () => {
    expect(byLang('en').stages.filter((s) => s.group === 'main').map((s) => s.short)).toEqual(['橘色', '棕色', '綠色', '藍色', '金色']);
  });

  it('日文有五十音、N5–N1 與主題路線；N4–N2 已開放，N1 已有文法與單字庫', () => {
    const ja = byLang('ja');
    expect(ja.stages.filter((s) => s.group === 'main').map((s) => s.short)).toEqual(['五十音', 'N5', 'N4', 'N3', 'N2', 'N1']);
    for (const short of ['N4', 'N3', 'N2']) expect(ja.stages.find((s) => s.short === short)!.units.length, short).toBeGreaterThanOrEqual(10);
    const n1 = ja.stages.find((s) => s.short === 'N1')!;
    expect(n1.units.filter((u) => !u.bank).length).toBeGreaterThanOrEqual(4);
    expect(n1.units.filter((u) => u.bank).length).toBeGreaterThanOrEqual(5);
    expect(n1.planned.length).toBeGreaterThan(0);
  });

  it('還沒有內容的關卡一定列出預定單元', () => {
    for (const c of COURSE_LIST) for (const s of c.stages) if (!s.units.length) expect(s.planned.length, s.id).toBeGreaterThan(0);
  });

  it('已經上線的單元不會還掛在「即將推出」清單裡', () => {
    for (const c of COURSE_LIST) {
      for (const s of c.stages) {
        const titles = s.units.map((u) => u.title);
        for (const p of s.planned) expect(titles.some((t) => p.startsWith(t) || t.startsWith(p)), `${s.id}：${p}`).toBe(false);
      }
    }
  });

  it('所有 id 全域唯一，而且以語言代碼開頭', () => {
    const seen = new Set<string>();
    for (const c of COURSE_LIST) {
      for (const s of c.stages) {
        expect(s.id.startsWith(`${c.id}.`), s.id).toBe(true);
        for (const u of s.units) {
          expect(u.id.startsWith(`${s.id}.`), u.id).toBe(true);
          for (const x of [...u.items.map((i) => i.id), ...u.lessons.map((l) => l.id), u.id]) {
            expect(seen.has(x), `重複的 id：${x}`).toBe(false);
            seen.add(x);
          }
        }
      }
    }
  });

  it('每個單元：課程涵蓋所有項目、最後一課是單元測驗、每課 2–9 個項目', () => {
    for (const c of COURSE_LIST) {
      for (const u of units(c)) {
        const ids = new Set(u.items.map((i) => i.id));
        const lessons = u.lessons.slice(0, -1);
        const boss = u.lessons[u.lessons.length - 1];
        expect(boss.boss, u.id).toBe(true);
        expect(new Set(boss.itemIds), u.id).toEqual(ids);
        expect(new Set(lessons.flatMap((l) => l.itemIds)), u.id).toEqual(ids);
        for (const l of lessons) {
          expect(l.boss, l.id).toBeFalsy();
          expect(l.itemIds.length, l.id).toBeGreaterThanOrEqual(2);
          expect(l.itemIds.length, l.id).toBeLessThanOrEqual(9);
        }
      }
    }
  });

  it('字母表的每一格都對得到項目', () => {
    for (const c of COURSE_LIST) {
      for (const u of units(c)) {
        if (!u.chart) continue;
        const ids = new Set(u.items.map((i) => i.id));
        for (const row of u.chart) for (const cell of row.cells) if (cell) expect(ids.has(cell), cell).toBe(true);
      }
    }
  });
});

describe('項目內容', () => {
  it('單字都有意思；例句都有翻譯', () => {
    for (const c of COURSE_LIST) {
      for (const it of items(c)) {
        if (!isVocab(it)) continue;
        expect(it.w.trim(), it.id).toBe(it.w);
        expect(it.m.length, it.id).toBeGreaterThan(0);
        for (const e of exsOf(it)) {
          expect(e.s.length, it.id).toBeGreaterThan(0);
          expect(e.t.length, it.id).toBeGreaterThan(0);
        }
      }
    }
  });

  it('補充例句表的原文都對得到單字（打錯字的話例句會默默接不上）', () => {
    const tables: [LangId, string][] = [
      ['en', EN_MORE],
      ['ja', JA_MORE],
      ['ko', KO_MORE],
    ];
    for (const [lang, text] of tables) {
      const keys = new Set(items(byLang(lang)).filter(isVocab).map((it) => (lang === 'ja' ? (it.furi ?? it.w) : it.w)));
      for (const k of moreTable(text).keys()) expect(keys.has(k), `${lang}：${k}`).toBe(true);
    }
  });

  it('學習路線上的單字都有三句例句（答對時隨機挑一句顯示）', () => {
    for (const lang of ['en', 'ja', 'ko'] as LangId[]) {
      const c = byLang(lang);
      const corpus = corpusOfCourse(c);
      const few: string[] = [];
      for (const st of c.stages) {
        if (st.style === 'town') continue;
        for (const u of st.units) {
          if (u.bank) continue;
          for (const it of u.items) if (isVocab(it) && it.kind === 'word' && examplesOf(it, lang, corpus).length < 3) few.push(it.id);
        }
      }
      expect(few, lang).toEqual([]);
    }
  });

  it('克漏字與應答題：有空格、選項不重複、答案索引有效', () => {
    for (const c of COURSE_LIST) {
      for (const it of items(c)) {
        if (it.kind !== 'cloze' && it.kind !== 'qa') continue;
        if (it.kind === 'cloze') expect(it.q.split('___'), it.id).toHaveLength(2);
        expect(it.opts.length, it.id).toBeGreaterThanOrEqual(3);
        expect(new Set(it.opts).size, it.id).toBe(it.opts.length);
        expect(it.opts[it.a], it.id).toBeTruthy();
      }
    }
  });

  it('句子的分詞接起來等於原句', () => {
    for (const c of COURSE_LIST) {
      for (const it of items(c)) {
        if (it.kind !== 'sentence') continue;
        const joined = it.tokens.join(c.id === 'ja' ? '' : ' ');
        expect(c.id === 'ja' ? furiPlain(joined) : joined, it.id).toBe(it.s);
        expect(it.t.length, it.id).toBeGreaterThan(0);
      }
    }
  });

  it('日文：振假名標註完整（讀音裡沒有殘留的漢字或中括號）', () => {
    const check = (s: string, where: string) => {
      expect(furiPlain(s), where).not.toMatch(/[[\]]/);
      expect(furiKana(s), where).toMatch(KANA_OK);
    };
    for (const it of items(byLang('ja'))) {
      if (isVocab(it)) {
        if (it.kind !== 'char') {
          expect(it.r, it.id).toBeTruthy();
          expect(it.r!, it.id).toMatch(KANA_OK);
        }
        check(it.furi ?? it.w, it.id);
        for (const e of exsOf(it)) check(e.furi ?? e.s, `${it.id} 例句`);
        for (const t of it.tokens ?? []) check(t, `${it.id} 分詞`);
      } else if (it.kind === 'sentence') {
        check(it.furi ?? it.s, it.id);
      } else if (it.kind === 'cloze') {
        check(it.q.replace('___', ''), it.id);
        for (const o of it.opts) check(o, `${it.id} 選項`);
      } else if (it.kind === 'qa') {
        // 聽讀題的文章、對話稿可以用「漢字[よみ]」標讀音（朗讀時只唸讀音），但每個漢字都要標
        for (const t of [it.q, it.ask ?? '']) {
          expect(furiPlain(t), it.id).not.toMatch(/[[\]]/);
          expect(furiKana(t), it.id).not.toMatch(/[㐀-鿿々]/);
        }
        for (const o of it.opts) check(o.replace(/…/g, ''), `${it.id} 選項`);
      }
    }
    for (const u of units(byLang('ja'))) {
      for (const l of u.lessons) for (const n of l.notes ?? []) for (const e of n.examples ?? []) check(e.furi ?? e.s, `${l.id} 說明例句`);
    }
  });

  it('韓文：原文是韓文字、羅馬拼音是英文字母', () => {
    for (const it of items(byLang('ko'))) {
      if (!isVocab(it)) continue;
      expect(it.w, it.id).toMatch(HANGUL_OK);
      expect(it.rm, it.id).toMatch(/^[a-z' ]+$/);
      for (const e of exsOf(it)) expect(e.s, it.id).toMatch(/[가-힣]/);
    }
  });

  it('英文：單字是英文字母，例句裡有出現該單字（或其變化形）', () => {
    for (const it of items(byLang('en'))) {
      if (!isVocab(it)) continue;
      expect(it.w, it.id).toMatch(/^[a-z ]+$/);
      // 取字根前幾個字母比對，容許 leave → leaves、delay → delayed 之類的變化
      const stem = it.w.slice(0, Math.max(3, it.w.length - 2));
      expect(it.ex?.s.toLowerCase(), it.id).toContain(stem);
      for (const e of it.more ?? []) expect(e.s.toLowerCase(), `${it.id} 更多例句`).toContain(stem);
    }
  });
});

describe('按關卡分包下載', () => {
  it('parts.ts 裡的關卡 id 都對得到 meta.ts（打錯字的話那批單元會默默消失）', async () => {
    const { META } = await import('../src/content/meta');
    const { PARTS } = await import('../src/content/parts');
    const ids = new Set(Object.values(META).flatMap((c) => c.stages.map((s) => s.id)));
    for (const key of Object.keys(PARTS)) expect(ids.has(key), key).toBe(true);
  });

  it('題目用到才下載：只下載需要的那一包，重複要求不會重新下載', async () => {
    const content = await import('../src/content/index');
    content.resetContent();
    const k1 = COURSE_LIST.find((c) => c.id === 'ko')!.stages.find((s) => s.id === 'ko.k1')!;
    const path = k1.units.filter((u) => !u.bank);
    const first = path[0];

    // 還沒下載：已下載的課程是空的，索引查不到
    expect(content.loadedCourse('ko').stages.every((s) => !s.units.length)).toBe(true);
    expect(content.ready('ko', { units: [first.id] })).toBe(false);
    expect(content.courseIndex('ko').lessons.has(first.lessons[0].id)).toBe(false);

    // 用課的 id 要求：同一包只下載一次
    const p1 = content.ensure('ko', { units: [first.lessons[0].id] });
    const p2 = content.ensure('ko', { units: [first.lessons[1].id] });
    await Promise.all([p1, p2]);
    expect(content.ready('ko', { units: [first.id] })).toBe(true);

    // 只有這一關的學習路線那一包：單字庫和其他關卡都還沒下載
    const loaded = content.loadedCourse('ko');
    expect(loaded.stages.find((s) => s.id === 'ko.k1')!.units.map((u) => u.id)).toEqual(path.map((u) => u.id));
    expect(loaded.stages.filter((s) => s.id !== 'ko.k1').every((s) => !s.units.length)).toBe(true);
    expect(content.ready('ko', { stages: ['ko.k1'] })).toBe(false);
    expect(content.courseIndex('ko').lessons.has(first.lessons[0].id)).toBe(true);
    expect(content.courseIndex('ko').items.size).toBe(path.reduce((a, u) => a + u.items.length, 0));

    // 整關、整個語言
    await content.ensure('ko', { stages: ['ko.k1'] });
    expect(content.loadedCourse('ko').stages.find((s) => s.id === 'ko.k1')!.units.length).toBe(k1.units.length);
    await content.ensure('ko', 'all');
    const all = COURSE_LIST.find((c) => c.id === 'ko')!;
    expect(content.courseIndex('ko').items.size).toBe(all.stages.reduce((a, s) => a + s.units.reduce((b, u) => b + u.items.length, 0), 0));

    // 模擬考、觀念文章、猜詞的候選字各自一包
    expect(() => content.requireExtra('mocks', 'ko')).toThrow();
    await content.ensure('ko', ['mocks', 'concepts', 'wordle']);
    expect(content.requireExtra('mocks', 'ko').length).toBe(all.mocks.length);
    expect(content.requireExtra('concepts', 'ko').length).toBe(all.concepts.length);
    expect(content.requireExtra('wordle', 'ko').length).toBeGreaterThan(10);
    content.resetContent();
  });

  it('找不到的單元（例如內容下架的舊存檔）不會讓下載失敗', async () => {
    const content = await import('../src/content/index');
    content.resetContent();
    await content.ensure('ja', { units: ['ja.n5.gone:消えた', 'ja.nowhere#1'] });
    expect(content.ready('ja', { units: ['ja.n5.gone'] })).toBe(true);
    expect(content.loadedCourse('ja').stages.every((s) => !s.units.length)).toBe(true);
  });
});

describe('打包', () => {
  it('App 程式沒有直接引用各語言的題目檔（否則題目會被打包回主程式）', async () => {
    // 執行時才讀檔（import.meta.glob 的檔案清單會被轉譯快取住，新加的檔案可能檢查不到）。
    // 用動態字串引用 node:fs，就不需要為測試安裝 Node 的型別定義。
    const fs = (await import(/* @vite-ignore */ `node:${'fs'}`)) as {
      readdirSync(p: string): string[];
      readFileSync(p: string, enc: 'utf8'): string;
      statSync(p: string): { isDirectory(): boolean };
    };
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const f of fs.readdirSync(dir)) {
        const p = `${dir}/${f}`;
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (/\.tsx?$/.test(f)) files.push(p);
      }
    };
    walk('src');
    expect(files.length).toBeGreaterThan(20);
    // 題目檔彼此引用沒關係；parts.ts 用動態 import 一包一包載入；all.ts、outline-build.ts 只給測試和工具
    const langFile = /^src\/content\/(en|ja|ko)[-.]/;
    const allowed = /^src\/content\/(index|all|parts|outline-build)\.ts$/;
    const bad = /from '(\.\.\/content|\.\.\/\.\.\/content|\.)\/(en|ja|ko|all|outline-build)(-[a-z0-9]+)?'/;
    for (const f of files) {
      if (langFile.test(f) || allowed.test(f)) continue;
      expect(fs.readFileSync(f, 'utf8'), f).not.toMatch(bad);
    }
  });
});
