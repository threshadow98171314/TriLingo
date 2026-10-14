// 吉祥物「喵師父」的台詞：依時段、學習狀況、季節變化，再混入三語冷知識與小提示。

export interface MascotContext {
  hour: number;
  month: number;
  day: number;
  streak: number;
  /** 今天已經學習過 */
  lit: boolean;
  due: number;
  todayXp: number;
  goal: number;
  /** 最接近升段的語言 */
  nearest: { lang: string; name: string; toNext: number } | null;
}

const FACTS = [
  '「貓」的日文是 ねこ，韓文是 고양이，英文是 cat。貓叫聲日文寫「にゃー」，韓文寫「야옹」喵。',
  '韓文的 감사합니다（謝謝）裡的「감사」，就是漢字的「感謝」喵。',
  '日文的「大丈夫」不是大男人，是「沒問題」的意思喵。',
  '多益 Part 2 遇到 Where、When 這種疑問詞問句，不會用 Yes 或 No 回答，聽到可以直接刪掉喵。',
  '韓文有很多漢字詞：도서관＝圖書館、학교＝學校。猜猜 지하철 是什麼？答案是「地下鐵」喵。',
  '日文的「勉強」是讀書，不是勉強喔喵。',
  '日文的「手紙」是信，不是衛生紙喵。',
  '韓文的 오빠 是女生叫哥哥，男生叫哥哥要說 형 喵。',
  '英文 schedule 美式唸 SKED-jool，英式常唸 SHED-yool。多益會出現好幾種口音喵。',
  '日文的「先生」是老師，韓文的 선생님 也是老師，漢字都一樣喵。',
  '日文的「は」當助詞時唸 wa、「へ」唸 e、「を」唸 o，這是初學最常踩的坑喵。',
  '英文 receipt 的 p 不發音，唸起來像 ri-SEET 喵。',
  '韓文的 ㅇ 放在開頭不發音，放在收尾才唸 ng，像 강（gang）喵。',
  '吃飯前，日本人說「いただきます」，韓國人說「잘 먹겠습니다」喵。',
  '「아이고」是韓劇裡最常聽到的感嘆詞之一，累了、痛了、嚇到都會用喵。',
  '多益滿分 990：聽力和閱讀各 495 分喵。',
  'JLPT 每年考兩次，七月和十二月，台灣也有考場喵。',
  'TOPIK 分成 TOPIK I（1–2 級）和 TOPIK II（3–6 級）兩種考試喵。',
  '日文的「やばい」本來是「糟了」，現在年輕人也拿來稱讚「超厲害」喵。',
  '韓文的「대박」可以是「太讚了」也可以是「不得了」，看語氣決定喵。',
];

const TIPS = [
  '填字遊戲卡住了？每一題的提示前三次免費喵。',
  '在設定連結 GitHub，筆電和手機的進度就能同步喵。',
  '手機用瀏覽器的「加到主畫面」，就能像 App 一樣打開喵。',
  '單元測驗隨時都能挑戰，通過就算完成整個單元，會的內容可以直接跳級喵。',
  '每天把三個任務都領完，就能開每日寶箱喵。',
  '連勝保護可以救回忘記學習的那一天，商店有賣喵。',
  '聽力題旁邊的烏龜按鈕可以慢速播放喵。',
  '聽說有些神秘的字，用鍵盤打出來會發生好事……用手機的話，可以對我說悄悄話喵。',
  '聽說連點某些東西會有驚喜……喵師父什麼都沒說喔。',
];

function seasonal(c: MascotContext): string | null {
  const { month: m, day: d } = c;
  if (m === 10 && d >= 25) return '萬聖節快到了！韓文是 핼러윈，日文是 ハロウィン 喵。';
  if (m === 10 || m === 11) return '秋天的楓葉好美。日文的紅葉唸「もみじ」，韓文是「단풍」喵。';
  if (m === 12 || m <= 2) return '天冷了喵。日文的「寒い」、韓文的「춥다」都是冷的意思。';
  if (m === 3 || m === 4) return '櫻花季！日文是「さくら」，韓文是「벚꽃」喵。';
  if (m === 7 || m === 8) return '好熱喵。日文的「暑い」和韓文的「덥다」都是熱的意思。';
  return null;
}

function greeting(h: number): string {
  if (h < 5) return '這麼晚還在用功？喵師父佩服，但也要記得睡覺喵。';
  if (h < 11) return '早安喵！早上背的單字特別容易記住。';
  if (h < 14) return '吃飽了嗎？日文說「ご飯食べた？」，韓文說「밥 먹었어요?」喵。';
  if (h < 18) return '下午來一堂課提提神吧喵。';
  return '晚上好喵～睡前複習一下，記憶會在睡覺時整理好。';
}

/** 依目前狀況產生可以說的台詞 */
export function mascotLines(c: MascotContext): string[] {
  const lines = [greeting(c.hour)];
  if (c.lit && c.streak >= 3) lines.push(`已經連續學習 ${c.streak} 天了！再撐下去，喵師父要叫你師兄了。`);
  else if (!c.lit && c.streak > 0) lines.push(`今天還沒學習喔，${c.streak} 天的連勝在等你喵！`);
  else if (c.streak === 0) lines.push('今天學一堂課，明天就能開始累積連勝喵。');
  if (c.due > 0) lines.push(`有 ${c.due} 個字在等你複習。快忘記的時候複習，記得最牢喵。`);
  if (c.nearest && c.nearest.toNext <= 300) lines.push(`${c.nearest.lang}再 ${c.nearest.toNext} XP 就升上「${c.nearest.name}」了，衝喵！`);
  if (c.todayXp >= c.goal) lines.push('今天的目標達成了！多學的每一點都是額外的修行喵。');
  const s = seasonal(c);
  if (s) lines.push(s);
  return [...lines, ...FACTS, ...TIPS];
}

export const MASCOT_SECRET = '好啦好啦，告訴你一個秘密：按下面的「悄悄話」，說出日本的國花看看喵。';
export const MASCOT_GOLD = '✨ 傳說中的金色喵師父現身了！今天一定會有好事發生喵。';
export const MASCOT_CONFUSED = ['喵？聽不太懂耶。', '這是暗號嗎？喵師父沒反應過來。', '喵喵喵？（歪頭）'];
