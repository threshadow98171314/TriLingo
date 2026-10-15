// 用 Session 流程跑的三種練習：課程（含單元測驗）、複習、聽力特訓
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import type { ResultData } from '../components/Result';
import { Session } from '../components/Session';
import { Empty } from '../components/ui';
import { courseIndex, META } from '../content';
import { dueItems, learnedItems, learnedVocab, nextBankLesson, UNLOCK, weakestItems } from '../core/progress';
import { sample, shuffle } from '../core/rng';
import { BOSS_PASS, finishGame, finishLesson, getSave, type SessionStats } from '../core/store';
import { canSpeak, listenMuted, unmuteListening, useVoices } from '../core/tts';
import type { LangId, VocabItem } from '../core/types';
import { fmtTime } from '../core/util';
import { buildLesson, buildListening, buildReview, isVocab, LANG_NAME, typeWordEx, type Ctx, type Exercise } from '../engine/exercises';
import { href, lessonPath, stagePath } from '../router';

// 「現在不方便聽」期間不出聽力題
/** 這個語言要不要出打字題（設定頁可以分別關掉日文、韓文） */
function typingOn(lang: LangId): boolean {
  const s = getSave().settings;
  return lang === 'ja' ? s.jaTyping : lang === 'ko' ? s.koTyping : false;
}

const ctxOf = (lang: LangId): Ctx => ({ lang, rng: Math.random, canListen: canSpeak(lang) && !listenMuted(), typing: typingOn(lang) });

const statLines = (st: SessionStats): [string, string][] => [
  ['答對率', `${st.graded ? Math.round((st.correct / st.graded) * 100) : 100}%`],
  ['最高連擊', String(st.maxCombo)],
  ['用時', fmtTime(st.seconds)],
];

/** 還不能玩的時候顯示的說明頁 */
export function Blocked({ lang, icon, title, back, children }: { lang: LangId; icon: string; title: string; back: string; children: ReactNode }) {
  return (
    <div className="page narrow" style={{ '--lang': META[lang].color } as CSSProperties}>
      <Empty icon={icon} title={title}>
        <p className="muted">{children}</p>
        <a className="btn primary" href={href(back)}>
          回去看看
        </a>
      </Empty>
    </div>
  );
}

// ───────── 課程／單元測驗 ─────────

export function LessonPage({ lang, lessonId }: { lang: LangId; lessonId: string }) {
  const ref = courseIndex(lang).lessons.get(lessonId);
  const build = () => (ref ? buildLesson(ref.unit, ref.lesson, ctxOf(lang), (id) => !!getSave().items[id]) : []);
  // 題目是隨機產生的，放在 state 裡才不會在重新渲染時換掉
  const [{ run, exercises }, setGame] = useState(() => ({ run: 0, exercises: build() }));

  if (!ref || !exercises.length) {
    return (
      <Blocked lang={lang} icon="🧭" title="找不到這堂課" back={`/l/${lang}`}>
        這個連結對應的課程不存在，可能是內容更新後改了位置。
      </Blocked>
    );
  }

  const { unit, lesson, stage } = ref;
  const back = stagePath(lang, stage.id);
  const again = (label: string) => ({ label, run: () => setGame((g) => ({ run: g.run + 1, exercises: build() })) });

  const onFinish = (stats: SessionStats): ResultData => {
    const outcome = finishLesson({ lang, unit, lesson, stats });
    const lines = statLines(stats);
    const base = { outcome, lines, back, backLabel: '回到路線' };

    if (lesson.boss) {
      if (!outcome.passed) {
        return {
          ...base,
          emoji: '💪',
          headline: '差一點點！',
          sub: `答對率要達到 ${BOSS_PASS * 100}% 才算通過。把這個單元的課上完，再回來挑戰吧。`,
          again: again('再挑戰一次'),
        };
      }
      if (unit.bank) {
        // 單字庫：直接接下一組還沒學完的字
        const nb = nextBankLesson(getSave(), stage, unit.id) ?? nextBankLesson(getSave(), stage);
        return {
          ...base,
          emoji: '👑',
          headline: '這組單字完成！',
          sub: `「${unit.title}」的 ${unit.items.length} 個字都學會了，之後會自動排進複習。`,
          next: nb ? { label: `下一組：${nb.unit.title}`, to: lessonPath(lang, nb.lesson.id) } : undefined,
        };
      }
      return {
        ...base,
        emoji: '👑',
        headline: '單元測驗通過！',
        sub: outcome.first ? `「${unit.title}」完成，下一個單元已解鎖。` : `「${unit.title}」再次通過。`,
      };
    }

    const nextLesson = unit.lessons[ref.index + 1];
    return {
      ...base,
      emoji: outcome.stars === 3 ? '🌟' : '🎉',
      headline: outcome.stars === 3 ? '完美過關！' : '課程完成！',
      sub: outcome.stars === 3 ? undefined : '答錯的題目已經排進複習。想拿三顆星可以再練一次。',
      next: nextLesson ? { label: nextLesson.boss ? '挑戰單元測驗' : '下一課', to: lessonPath(lang, nextLesson.id) } : undefined,
      again: outcome.stars < 3 ? again('再練一次') : undefined,
    };
  };

  return (
    <Session
      key={run}
      lang={lang}
      title={`${unit.title}・${lesson.boss ? '單元測驗' : lesson.title}`}
      exercises={exercises}
      mode="learn"
      exitTo={back}
      // 測驗不重考：答錯就是答錯，才測得出真實程度
      retry={!lesson.boss}
      onFinish={onFinish}
    />
  );
}

// ───────── 複習 ─────────

const REVIEW_BATCH = 20;

export function ReviewPage({ lang }: { lang: LangId }) {
  const build = () => {
    const s = getSave();
    const idx = courseIndex(lang).items;
    const due = dueItems(s, lang);
    const isDue = due.length > 0;
    // 沒有到期的字：從最不熟的 20 個裡抽 10 個做加強練習
    const items = isDue ? due.slice(0, REVIEW_BATCH) : shuffle(weakestItems(s, lang, 20)).slice(0, 10);
    const entries = items.map((item) => ({ item, strength: s.items[item.id].s, pool: idx.get(item.id)!.unit.items }));
    return { isDue, learned: learnedItems(s, lang).length, exercises: shuffle(buildReview(entries, ctxOf(lang))) };
  };
  const [{ run, plan }, setGame] = useState(() => ({ run: 0, plan: build() }));

  const back = `/l/${lang}/arcade`;
  if (plan.learned < 4 || !plan.exercises.length) {
    return (
      <Blocked lang={lang} icon="🧠" title="還沒有可以複習的字" back={`/l/${lang}`}>
        先上幾堂課吧。學過的字會在隔天、三天後、一週後…自動排進複習，越熟間隔越長。
      </Blocked>
    );
  }

  const onFinish = (stats: SessionStats): ResultData => {
    const outcome = finishGame({
      lang,
      game: 'review',
      parts: [
        [plan.isDue ? '完成複習' : '完成加強練習', 5],
        ['答對題數', stats.correct],
      ],
      count: stats.graded,
      maxCombo: stats.maxCombo,
    });
    const left = dueItems(getSave(), lang).length;
    return {
      emoji: '🧠',
      headline: plan.isDue ? '複習完成！' : '加強練習完成！',
      sub: left > 0 ? `還有 ${left} 個字等著複習。` : '今天到期的字都複習完了，記憶又更牢了一點。',
      outcome,
      lines: statLines(stats),
      back,
      backLabel: '回到遊樂場',
      again: { label: left > 0 ? '繼續複習' : '再練一輪', run: () => setGame((g) => ({ run: g.run + 1, plan: build() })) },
    };
  };

  return (
    <Session
      key={run}
      lang={lang}
      title={plan.isDue ? '今日複習' : '加強練習'}
      exercises={plan.exercises}
      // 只有到期的複習才會拉長記憶間隔
      mode={plan.isDue ? 'review' : 'game'}
      exitTo={back}
      onFinish={onFinish}
    />
  );
}

// ───────── 聽力特訓 ─────────

export function ListenPage({ lang }: { lang: LangId }) {
  useVoices();
  const speakable = canSpeak(lang);
  const build = () => {
    const vocab = learnedVocab(getSave(), lang);
    if (vocab.length < UNLOCK.listen || !canSpeak(lang)) return [];
    // 單字、短句夠多之後就不再考單一字母，專心練聽懂「話」
    const words = vocab.filter((i) => i.kind !== 'char');
    const idx = courseIndex(lang).items;
    return buildListening(words.length >= UNLOCK.listen ? words : vocab, (i) => idx.get(i.id)!.unit.items.filter(isVocab), ctxOf(lang), 10);
  };
  const [{ run, exercises }, setGame] = useState(() => {
    // 主動打開聽力特訓，代表現在可以聽：解除「現在不方便聽」
    unmuteListening();
    return { run: 0, exercises: build() };
  });
  const restart = () => setGame((g) => ({ run: g.run + 1, exercises: build() }));
  // 語音清單是非同步載入的：直接開這一頁時，等語音載入後再出題
  useEffect(() => {
    if (speakable && !exercises.length) restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speakable]);

  const back = `/l/${lang}/arcade`;
  if (!speakable) {
    return (
      <Blocked lang={lang} icon="🔇" title={`找不到${LANG_NAME[lang]}語音`} back={back}>
        聽力特訓需要瀏覽器內建的語音。建議改用 Chrome 或 Edge 開啟，它們內建{LANG_NAME[lang]}語音。
      </Blocked>
    );
  }
  if (!exercises.length) {
    return (
      <Blocked lang={lang} icon="🎧" title="聽力特訓尚未解鎖" back={`/l/${lang}`}>
        學會 {UNLOCK.listen} 個字詞之後就能開始。
      </Blocked>
    );
  }

  const onFinish = (stats: SessionStats): ResultData => ({
    emoji: '🎧',
    headline: '聽力特訓完成！',
    sub: stats.correct === stats.graded ? '全部聽懂了，耳朵越來越靈。' : '聽不出來的字已經排進複習。',
    outcome: finishGame({
      lang,
      game: 'listen',
      parts: [
        ['完成聽力特訓', 5],
        ['聽懂的題數 ×2', stats.correct * 2],
      ],
      maxCombo: stats.maxCombo,
    }),
    lines: statLines(stats),
    back,
    backLabel: '回到遊樂場',
    again: { label: '再聽一輪', run: restart },
  });

  return <Session key={run} lang={lang} title="聽力特訓" exercises={exercises} mode="game" exitTo={back} retry={false} onFinish={onFinish} />;
}

// ───────── 打字特訓（日文、韓文） ─────────

export function TypingPage({ lang }: { lang: LangId }) {
  useVoices();
  const build = (): Exercise[] => {
    if (lang !== 'ja' && lang !== 'ko') return [];
    const idx = courseIndex(lang).items;
    const ctx = { ...ctxOf(lang), typing: true };
    const pool = (i: VocabItem) => idx.get(i.id)!.unit.items.filter(isVocab);
    // 打得出來的字才算（韓文只算韓文字的單字、短句）
    const words = learnedVocab(getSave(), lang).filter((i) => i.kind !== 'char' && typeWordEx(i, pool(i), ctx));
    if (words.length < UNLOCK.typing) return [];
    // 看中文打、聽發音打交錯出題（沒有語音時全部看中文）
    return sample(words, 10)
      .map((i, k) => typeWordEx(i, pool(i), ctx, k % 2 === 1 ? 'listen' : 'm2w'))
      .filter((e): e is NonNullable<typeof e> => !!e);
  };
  const [{ run, exercises }, setGame] = useState(() => ({ run: 0, exercises: build() }));
  const restart = () => setGame((g) => ({ run: g.run + 1, exercises: build() }));

  const back = `/l/${lang}/arcade`;
  if (!exercises.length) {
    return (
      <Blocked lang={lang} icon="⌨️" title="打字特訓尚未解鎖" back={`/l/${lang}`}>
        學會 {UNLOCK.typing} 個{LANG_NAME[lang]}單字或短句（不含{lang === 'ja' ? '五十音' : '字母'}）之後就能開始。
      </Blocked>
    );
  }

  const onFinish = (stats: SessionStats): ResultData => ({
    emoji: '⌨️',
    headline: '打字特訓完成！',
    sub: stats.correct === stats.graded ? `全部打對了，手指也記住${LANG_NAME[lang]}了。` : '打錯的字已經排進複習。卡住時可以按「💡 提示」或「📖 怎麼打？」。',
    outcome: finishGame({
      lang,
      game: 'typing',
      parts: [
        ['完成打字特訓', 5],
        ['打對的題數 ×2', stats.correct * 2],
      ],
      maxCombo: stats.maxCombo,
    }),
    lines: statLines(stats),
    back,
    backLabel: '回到遊樂場',
    again: { label: '再打一輪', run: restart },
  });

  return <Session key={run} lang={lang} title="打字特訓" exercises={exercises} mode="game" exitTo={back} onFinish={onFinish} />;
}
