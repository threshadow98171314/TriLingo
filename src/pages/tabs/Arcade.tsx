// 語言頁的「遊樂場」分頁：每日、語言專屬、對戰與牌桌、單字遊戲、聽力。題目只用這個語言學過的字。
import { useState } from 'react';
import { Bar } from '../../components/ui';
import { pictureOf } from '../../engine/pictures';
import { drillsFor } from '../../engine/drills';
import { today } from '../../core/date';
import { crosswordPool, dueItems, learnedItems, learnedVocab, UNLOCK } from '../../core/progress';
import type { Save } from '../../core/save';
import { canSpeak, useVoices } from '../../core/tts';
import type { LangId } from '../../core/types';
import { cx, fmtTime } from '../../core/util';
import { isVocab, LANG_NAME } from '../../engine/exercises';
import { kanaPairs } from '../../engine/furigana';
import { href } from '../../router';

type ArcadeCat = 'daily' | 'special' | 'table' | 'words' | 'skills';

const ARCADE_CATS: [ArcadeCat, string, string][] = [
  ['daily', '⭐', '每日'],
  // 名稱跟著語言變：日文專屬、韓文專屬、英文專屬
  ['special', '🥋', '專屬'],
  ['table', '🃏', '對戰與牌桌'],
  ['words', '🧩', '單字遊戲'],
  ['skills', '🎧', '聽力'],
];

interface Game {
  cat: ArcadeCat;
  icon: string;
  title: string;
  desc: string;
  to: string;
  need: number;
  have: number;
  badge?: string;
  hot?: boolean;
  /** 無法遊玩的原因（例如沒有語音） */
  blocked?: string;
}

export function ArcadeTab({ lang, s }: { lang: LangId; s: Save }) {
  useVoices();
  const [cat, setCat] = useState<ArcadeCat | 'all'>('all');
  const vocab = learnedVocab(s, lang).length;
  const words = learnedVocab(s, lang).filter((i) => i.kind !== 'char').length;
  const pictured = learnedVocab(s, lang).filter((i) => i.kind !== 'char' && pictureOf(i.m)).length;
  const cw = crosswordPool(s, lang).length;
  const learned = learnedItems(s, lang).length;
  const due = dueItems(s, lang).length;
  const dailyDone = !!s.days[today()]?.dailyCw?.[lang];
  const bestMatch = s.best.match[lang];
  const bestBlitz = s.best.blitz[lang];

  const games: Game[] = [
    {
      icon: '🧠',
      cat: 'daily',
      title: '今日複習',
      desc: '間隔複習：在快要忘記的時候複習，記得最牢。沒有到期的字時，可以做加強練習。',
      to: `/l/${lang}/review`,
      need: 4,
      have: learned,
      badge: due > 0 ? `${due} 個到期` : '今天已清空',
      hot: due > 0,
    },
    {
      icon: '⚔️',
      cat: 'table',
      title: '單字卡牌對決',
      desc: '回合制卡牌冒險：用學過的單字組牌組、一路打上 10 層。出牌前要答對牌上的字，連對 3 題會心一擊；看怪物的意圖決定攻守，挑牌、升級、收集遺物。',
      to: `/l/${lang}/play/duel`,
      need: UNLOCK.duel,
      have: words,
      badge: (s.best.duel?.[lang] ?? 0) >= 10 ? '已通關 👑' : (s.best.duel?.[lang] ?? 0) > 0 ? `最高第 ${s.best.duel[lang]} 層` : '新・挑戰',
      hot: s.stats.duels === 0 && words >= UNLOCK.duel,
    },
    {
      cat: 'table',
      icon: '🂧',
      title: '排七',
      desc: '和 Emma、さくら、민준 四人接龍：每種花色從 7 往上下接，沒牌能接就要蓋牌罰分，罰分最少的贏。每出一張牌前要先答對一個學過的字。',
      to: `/l/${lang}/play/sevens`,
      need: UNLOCK.sevens,
      have: words,
      badge: s.stats.sevens > 0 ? `第一名 ${s.stats.sevensWins} 次` : '新・牌桌',
      hot: s.stats.sevens === 0 && words >= UNLOCK.sevens,
    },
    {
      cat: 'table',
      icon: '🂢',
      title: '大老二',
      desc: '四人比誰先出完：單張、對子、順子、葫蘆、鐵支、同花順，2 最大、黑桃最大。每次出牌前要先答對一個學過的字，答錯就只能過。',
      to: `/l/${lang}/play/bigtwo`,
      need: UNLOCK.bigtwo,
      have: words,
      badge: s.stats.bigtwo > 0 ? `第一名 ${s.stats.bigtwoWins} 次` : '新・牌桌',
      hot: s.stats.bigtwo === 0 && words >= UNLOCK.bigtwo,
    },
    {
      icon: '🔗',
      cat: 'table',
      title: lang === 'ja' ? '接龍對戰（しりとり）' : lang === 'ko' ? '接龍對戰（끝말잇기）' : '接龍對戰（Word Chain）',
      desc:
        lang === 'ja'
          ? '和電腦輪流用最後一個假名接字，「ん」結尾就輸！考驗字彙量和臨場反應，難度越高電腦越會出難接的字。'
          : lang === 'ko'
            ? '和電腦輪流用最後一個字接字，可以用頭音法則（력→역）。考驗字彙量和臨場反應。'
            : '和電腦輪流用最後一個字母接單字，考驗字彙量和臨場反應；困難模式電腦會故意出難接的字。',
      to: `/l/${lang}/play/chain`,
      need: UNLOCK.chain,
      have: words,
      badge: (s.best.chain?.[lang] ?? 0) > 0 ? `最高 ${s.best.chain[lang]} 分` : '新・挑戰',
    },
    {
      icon: '🔠',
      cat: 'words',
      title: '猜詞',
      desc:
        lang === 'en'
          ? '六次機會猜出 5 個字母的英文單字：綠色＝位置對、黃色＝有這個字母但位置不對。靠推理和字彙量取勝。'
          : lang === 'ja'
            ? '六次機會猜出 4 個假名的日文單字（用讀音猜）：綠色＝位置對、黃色＝有這個假名但位置不對。'
            : '六次機會猜出韓文單字：每個字拆成子音和母音共 6 格，綠色＝位置對、黃色＝有但位置不對。',
      to: `/l/${lang}/play/wordle`,
      need: UNLOCK.wordle,
      have: words,
      badge: s.stats.wordles > 0 ? `猜中 ${s.stats.wordles} 次` : '新・挑戰',
    },
    {
      icon: '📆',
      cat: 'daily',
      title: '每日猜詞',
      desc: '每天一題，從整個課程出題（可能是還沒學過的字），猜中多拿 15 XP。',
      to: `/l/${lang}/play/wordle?daily=1`,
      need: UNLOCK.wordle,
      have: words,
      badge: s.days[today()]?.dailyWordle?.[lang] ? '今天已完成 ✓' : '今天還沒挑戰',
      hot: !s.days[today()]?.dailyWordle?.[lang] && words >= UNLOCK.wordle,
    },
    {
      icon: '🧩',
      cat: 'words',
      title: '填字遊戲',
      desc: '看中文提示，把學過的單字填進交叉的格子裡。每次都是新的盤面。',
      to: `/l/${lang}/play/crossword`,
      need: UNLOCK.crossword,
      have: cw,
    },
    {
      icon: '📅',
      cat: 'daily',
      title: '每日填字',
      desc: '每天一題固定的題目，完成可以多拿 20 XP。',
      to: `/l/${lang}/play/crossword?daily=1`,
      need: UNLOCK.crossword,
      have: cw,
      badge: dailyDone ? '今天已完成 ✓' : '今天還沒挑戰',
      hot: !dailyDone,
    },
    {
      icon: '🃏',
      cat: 'words',
      title: '配對消消樂',
      desc: '和時間賽跑，把單字和意思配成一對消掉。三回合計時。',
      to: `/l/${lang}/play/match`,
      need: UNLOCK.match,
      have: vocab,
      badge: bestMatch !== undefined ? `最佳 ${fmtTime(bestMatch)}` : undefined,
    },
    {
      icon: '⏱️',
      cat: 'words',
      title: '限時快答',
      desc: '60 秒內能答對幾題？連擊越高，每題分數越多；答錯會扣時間。',
      to: `/l/${lang}/play/blitz`,
      need: UNLOCK.blitz,
      have: vocab,
      badge: bestBlitz > 0 ? `最高 ${bestBlitz} 分` : undefined,
    },
    {
      icon: '🎧',
      cat: 'skills',
      title: '聽力特訓',
      desc: '不看字，只聽聲音選意思。朝「不用字幕」的目標前進。',
      to: `/l/${lang}/play/listen`,
      need: UNLOCK.listen,
      have: vocab,
      blocked: canSpeak(lang) ? undefined : `這個瀏覽器沒有${LANG_NAME[lang]}語音，請改用 Chrome 或 Edge。`,
    },
  ];
  games.push(
    {
      icon: '🖼️',
      cat: 'words',
      title: '看圖猜字',
      desc: '看可愛的插圖選出單字，或看單字選出插圖。動物、食物、地點、日用品…學過的字越多，圖越多。',
      to: `/l/${lang}/play/pics`,
      need: UNLOCK.pics,
      have: pictured,
      badge: s.stats.pics > 0 ? `已完成 ${s.stats.pics} 次` : '新遊戲',
      hot: s.stats.pics === 0 && pictured >= UNLOCK.pics,
    },
    {
      icon: '🗂️',
      cat: 'words',
      title: '分類大挑戰',
      desc: lang === 'en' ? '把單字放進正確的主題，還有一回合要分詞性（名詞、動詞、形容詞），多益文法題最愛考。' : '把學過的單字放進正確的主題分類，用情境把字串起來，記得更牢。',
      to: `/l/${lang}/play/sort`,
      need: UNLOCK.sort,
      have: words,
      badge: s.stats.sorts > 0 ? `已完成 ${s.stats.sorts} 次` : '新遊戲',
    },
    {
      icon: '✅',
      cat: 'words',
      title: '真假快判',
      desc: '字和意思配對正確嗎？45 秒內憑直覺按 ✓ 或 ✗，連擊越高分數越多。',
      to: `/l/${lang}/play/truefalse`,
      need: UNLOCK.truefalse,
      have: vocab,
      badge: (s.best.tf?.[lang] ?? 0) > 0 ? `最高 ${s.best.tf[lang]} 分` : '新遊戲',
    },
    {
      icon: '🃏',
      cat: 'words',
      title: '記憶翻牌',
      desc: '12 張蓋著的牌，一次翻兩張，把字和意思配成一對。考驗記憶力也複習單字。',
      to: `/l/${lang}/play/memory`,
      need: UNLOCK.memory,
      have: vocab,
      badge: s.best.memory?.[lang] !== undefined ? `最快 ${fmtTime(s.best.memory[lang]!)}` : '新遊戲',
    },
  );
  if (lang === 'ja') {
    games.push({
      icon: 'あ',
      cat: 'special',
      title: '假名對對碰',
      desc: '翻牌找出平假名和對應的片假名（あ↔ア），兩種假名一起記熟。',
      to: `/l/${lang}/play/memory?kana=1`,
      need: 6,
      have: kanaPairs(learnedItems(s, lang).filter(isVocab)).length,
    });
  }
  if (lang === 'ja' || lang === 'ko') {
    games.push(
      {
        icon: '⌨️',
        cat: 'special',
        title: '打字特訓',
        desc:
          lang === 'ja'
            ? '看中文或聽發音，用日文鍵盤把單字、短句打出來。假名、漢字、混著打都可以；打錯一次會告訴你差在哪裡。'
            : '看中文或聽發音，用韓文鍵盤把單字、短句打出來；打錯一次會告訴你差在哪個字母。',
        to: `/l/${lang}/play/typing`,
        need: UNLOCK.typing,
        have: words,
        badge: s.stats.typings > 0 ? `已完成 ${s.stats.typings} 次` : '新遊戲',
        hot: s.stats.typings === 0,
      },
      {
        icon: '🎹',
        cat: 'special',
        title: '打字教室',
        desc: lang === 'ja' ? '促音、長音、ん、拗音、外來語怎麼打？看說明，當場試打。' : '韓文鍵盤配置、雙子音、複合母音、收尾音怎麼打？看說明，當場試打。',
        to: `/l/${lang}/typing-guide`,
        need: 0,
        have: 0,
      },
    );
  }

  // 語言專屬特訓：活用道場、助數詞（日）、數字大考驗、活用（韓）、不規則動詞、拼字蜜蜂（英）
  for (const d of drillsFor(lang)) {
    const best = s.best.drill?.[`${d.id}.${lang}`] ?? 0;
    games.push({
      icon: d.icon,
      cat: 'special',
      title: d.title,
      desc: d.desc,
      to: `/l/${lang}/play/${d.id}`,
      need: d.need,
      have: words,
      badge: best > 0 ? `最高 ${best} 分` : '新遊戲',
      hot: best === 0 && words >= d.need,
      blocked: d.needsVoice && !canSpeak(lang) ? `這個瀏覽器沒有${LANG_NAME[lang]}語音，請改用 Chrome 或 Edge。` : undefined,
    });
  }
  const catName = (id: ArcadeCat | 'all', name: string) => (id === 'special' ? `${LANG_NAME[lang]}專屬` : name);

  const shown = cat === 'all' ? ARCADE_CATS.map((c) => c[0]) : [cat];
  return (
    <>
      {/* 遊戲很多：依類型分組，可以只看一類 */}
      <div className="arcade-cats" role="tablist" aria-label="遊戲分類">
        {([['all', '🎮', '全部'], ...ARCADE_CATS] as [ArcadeCat | 'all', string, string][]).map(([id, icon, name]) => {
          const list = id === 'all' ? games : games.filter((g) => g.cat === id);
          const hot = list.some((g) => g.hot && g.have >= g.need);
          return (
            <button key={id} type="button" role="tab" aria-selected={cat === id} className={cx('arcade-cat', cat === id && 'on')} onClick={() => setCat(id)}>
              <span aria-hidden>{icon}</span>
              {catName(id, name)}
              <small>{list.length}</small>
              {hot && <i className="arcade-dot" aria-label="有新挑戰" />}
            </button>
          );
        })}
      </div>
      {shown.map((c) => {
        const list = games.filter((g) => g.cat === c);
        if (!list.length) return null;
        const [, icon, name] = ARCADE_CATS.find((x) => x[0] === c)!;
        return (
          <section key={c} className="arcade-group">
            {cat === 'all' && (
              <h3 className="group-label">
                {icon} {catName(c, name)}
              </h3>
            )}
            <div className="arcade">
              {list.map((g) => {
                const locked = g.have < g.need;
                return (
                  <article key={g.title} className={cx('game card', locked && 'locked', g.hot && !locked && 'hot')}>
                    <div className="game-icon">{g.icon}</div>
                    <div className="grow">
                      <h3>
                        {g.title}
                        {g.badge && !locked && <span className={cx('chip', g.hot && 'warn')}>{g.badge}</span>}
                      </h3>
                      <p className="muted">{g.desc}</p>
                      {locked ? (
                        <div className="game-lock">
                          <Bar v={g.have / g.need} />
                          <small>
                            🔒 再學會 {g.need - g.have} 個字詞就能解鎖（{g.have} / {g.need}）
                          </small>
                        </div>
                      ) : g.blocked ? (
                        <small className="warn-text">{g.blocked}</small>
                      ) : (
                        <a className="btn primary small" href={href(g.to)}>
                          開始
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
