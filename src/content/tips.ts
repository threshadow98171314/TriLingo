// 知識補充站：首頁、結算畫面、載入畫面隨機顯示的小知識。
// 日文可以用「漢字[よみ]」標讀音。這個檔案很小，隨主程式載入。
import type { LangId } from '../core/types';

export type TipCat = '語言小知識' | '易混淆' | '文化' | '考試攻略' | '學習方法';

export interface Tip {
  lang: LangId | 'all';
  cat: TipCat;
  title: string;
  body: string;
}

export const TIPS: Tip[] = [
  // ───────── 英文 ─────────
  { lang: 'en', cat: '語言小知識', title: '不發音的字母', body: 'receipt 的 p、debt 和 doubt 的 b 都不發音。多益聽力常出現 receipt（收據），聽到 ri-SEET 就是它。' },
  { lang: 'en', cat: '易混淆', title: 'affect 和 effect', body: 'affect 是動詞（影響），effect 多半是名詞（效果）。The delay will affect sales. ／ The new policy had a big effect.' },
  { lang: 'en', cat: '易混淆', title: 'borrow 和 lend', body: 'borrow 是「向別人借」，lend 是「借給別人」。Can I borrow your pen? ＝ Can you lend me your pen?' },
  { lang: 'en', cat: '易混淆', title: 'hard 和 hardly', body: 'hard 當副詞是「努力地」，hardly 是「幾乎不」。She works hard.（她很努力）／ She hardly works.（她幾乎不工作）——多益很愛考這個陷阱。' },
  { lang: 'en', cat: '易混淆', title: 'since 和 for', body: 'since 接時間點（since 2020），for 接一段時間（for three years），兩個都常和現在完成式一起出現。' },
  { lang: 'en', cat: '易混淆', title: 'advice 和 advise', body: 'advice 是名詞（建議，不可數），advise 是動詞（建議某人）。Can you give me some advice? ／ I advise you to rest.' },
  { lang: 'en', cat: '易混淆', title: 'job 和 work', body: 'job 是可數名詞（一份工作），work 當「工作」時不可數。I have a new job. ／ I have a lot of work today.' },
  { lang: 'en', cat: '易混淆', title: 'stationery 和 stationary', body: 'stationery 是文具（e 結尾，想成 envelope 信封），stationary 是「靜止的」。' },
  { lang: 'en', cat: '語言小知識', title: 'a.m. 和 p.m. 的由來', body: '來自拉丁文：a.m. 是 ante meridiem（正午之前），p.m. 是 post meridiem（正午之後）。' },
  { lang: 'en', cat: '語言小知識', title: '商務書信的結尾', body: 'Sincerely 最正式，Best regards 是商務最常見的結尾，Thanks 適合熟一點的同事。' },
  { lang: 'en', cat: '考試攻略', title: 'Part 5 要搶時間', body: '多益閱讀 75 分鐘要寫 100 題，Part 5 每題盡量在 20 秒內選完，把時間留給最後的 Part 7 長篇閱讀。' },
  { lang: 'en', cat: '考試攻略', title: 'Part 2 的間接回答', body: '如果三個選項都不像標準答案，「讓我查一下」「我還沒聽說」這種間接回答常常就是正解；重複題目單字的選項反而常是陷阱。' },
  { lang: 'en', cat: '考試攻略', title: 'Part 1 照片題', body: '照片裡沒出現的人或東西，選項只要提到就可以先刪掉；再注意動作是「正在進行」還是「已經完成」。' },
  { lang: 'en', cat: '學習方法', title: '連著搭配詞一起背', body: '多益很常考固定搭配：make a decision、take a break、attend a meeting。背單字時連同它常用的動詞一起記。' },

  // ───────── 日文 ─────────
  { lang: 'ja', cat: '語言小知識', title: '「ん」也會變音', body: '「ん」後面接 b、p、m 時，會自然唸成 m：散歩[さんぽ]（sampo）、新聞[しんぶん]（shimbun）。' },
  { lang: 'ja', cat: '語言小知識', title: '長音改變意思', body: 'おばさん（阿姨）和おばあさん（奶奶）、おじさん（叔叔）和おじいさん（爺爺）只差一個長音，意思完全不同。' },
  { lang: 'ja', cat: '語言小知識', title: '促音改變意思', body: '来[き]て（來）和切手[きって]（郵票）只差一個小小的「っ」。日檢的漢字讀音題很愛考這種差一拍的讀音。' },
  { lang: 'ja', cat: '語言小知識', title: '4 和 7 的唸法', body: '4 可以唸よん或し、7 可以唸なな或しち。因為「し」和「死[し]」同音，日常生活多用よん、なな。' },
  { lang: 'ja', cat: '語言小知識', title: 'パン是葡萄牙語', body: '片假名多用在外來語。パン（麵包）來自葡萄牙語 pão，是十六世紀葡萄牙人帶進日本的。' },
  { lang: 'ja', cat: '語言小知識', title: '「いただきます」的意思', body: '「いただく」是「領受」的謙讓說法。飯前說いただきます，是對食物和做菜的人表示感謝。' },
  { lang: 'ja', cat: '易混淆', title: '行く和来る', body: '往說話者這邊移動用来[く]る，離開說話者用行[い]く。朋友來我家：友達[ともだち]が来[き]ます。' },
  { lang: 'ja', cat: '易混淆', title: '萬用的「すみません」', body: '「すみません」可以是道歉（對不起）、道謝（不好意思讓你費心）、叫人（不好意思～）。在店裡叫店員也是說すみません。' },
  { lang: 'ja', cat: '易混淆', title: 'てください和ないでください', body: '「〜てください」是請對方做，「〜ないでください」是請對方不要做：ここに座[すわ]ってください／ここで写真[しゃしん]を撮[と]らないでください。' },
  { lang: 'ja', cat: '文化', title: '電車上不講電話', body: '在日本，電車上講電話被認為很沒禮貌，手機通常會調成「マナーモード」（靜音模式）。' },
  { lang: 'ja', cat: '文化', title: '進門要脫鞋', body: '進日本人的家要在玄関[げんかん]脫鞋，把鞋尖朝外擺好。有些餐廳、旅館的榻榻米房間也要脫鞋。' },
  { lang: 'ja', cat: '文化', title: '郵遞區號的〒', body: '日本的地址前面常看到「〒」這個符號，後面接的就是郵遞區號。' },
  { lang: 'ja', cat: '考試攻略', title: '漢字讀音一個一個對', body: '日檢的漢字讀音題最愛考促音、長音、清濁音：がっこう、がこう、かっこう只差一點。背單字時讀音要一個假名一個假名對清楚。' },
  { lang: 'ja', cat: '考試攻略', title: '即時應答沒有印選項', body: '日檢聽解的「即時応答[おうとう]」選項是用聽的，不會印在題本上。平常多做聽力練習，習慣邊聽邊判斷。' },
  { lang: 'ja', cat: '學習方法', title: '漢字分兩步背', body: '漢字不用一次全背起來：先記讀音和意思，寫法再用打字題慢慢熟悉。打字時選對漢字，也是一種認字練習。' },

  // ───────── 韓文 ─────────
  { lang: 'ko', cat: '語言小知識', title: '韓文字母的由來', body: '韓文字母「한글」是朝鮮世宗大王時期創制，1446 年以《訓民正音》頒布，目的是讓一般百姓也能讀寫。' },
  { lang: 'ko', cat: '語言小知識', title: '漢字詞是好朋友', body: '韓文有很大一部分詞彙是漢字詞，學過中文的人很有優勢：도서관＝圖書館、문화＝文化、시간＝時間。' },
  { lang: 'ko', cat: '語言小知識', title: '收尾音只有七種', body: '收尾音（받침）只有 ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅇ 七種發音。옷 的 ㅅ 唸成 ㄷ，옆 的 ㅍ 唸成 ㅂ。' },
  { lang: 'ko', cat: '語言小知識', title: '子音在中間會變濁', body: 'ㄱ、ㄷ、ㅂ、ㅈ 夾在兩個母音中間時會唸得比較濁：고기 唸起來像 gogi，第一個 ㄱ 和第二個 ㄱ 聽起來不一樣。' },
  { lang: 'ko', cat: '語言小知識', title: '問句靠語調', body: '韓文的直述句和疑問句常常長得一樣，例如 가요 可以是「去」也可以是「去嗎？」，靠句尾語調上揚表示問句。' },
  { lang: 'ko', cat: '語言小知識', title: '네 和 예', body: '「네」除了「是」，也常用來回應「嗯嗯、了解」；「예」的意思一樣但更正式。' },
  { lang: 'ko', cat: '易混淆', title: '가세요 和 계세요', body: '對要離開的人說 안녕히 가세요（慢走），對留下來的人說 안녕히 계세요（請留步）。' },
  { lang: 'ko', cat: '易混淆', title: '哥哥姊姊怎麼叫', body: '女生叫哥哥是 오빠、叫姊姊是 언니；男生叫哥哥是 형、叫姊姊是 누나。' },
  { lang: 'ko', cat: '易混淆', title: '現在式和未來式', body: '-아요／어요 是現在式（也可以表示習慣），-(으)ㄹ 거예요 是未來或推測：가요（去）／갈 거예요（要去、應該會去）。' },
  { lang: 'ko', cat: '文化', title: '一見面就問年紀', body: '韓國人很在意年紀，第一次見面常會問「몇 살이에요?」（幾歲？），因為年紀決定了稱呼和要不要用敬語。' },
  { lang: 'ko', cat: '文化', title: '韓文字日', body: '每年 10 月 9 日是韓國的「한글날」（韓文字日），紀念訓民正音的頒布，是國定假日。' },
  { lang: 'ko', cat: '文化', title: '和長輩吃飯的禮儀', body: '和長輩一起吃飯時，要等長輩先動筷子再開始吃；和長輩喝酒時，晚輩會側過身去喝。' },
  { lang: 'ko', cat: '考試攻略', title: 'TOPIK I 沒有寫作', body: 'TOPIK I（1–2 級）只考聽力和閱讀，滿分 200 分；TOPIK II（3–6 級）才加考寫作。' },
  { lang: 'ko', cat: '學習方法', title: '韓劇三刷法', body: '同一集看三次：先開中文字幕看懂劇情，再關字幕聽聽看，最後跟著角色唸台詞（shadowing），聽力和口說一起進步。' },

  // ───────── 通用 ─────────
  { lang: 'all', cat: '學習方法', title: '間隔複習', body: '快要忘記的時候複習，記得最牢。每天先把「待複習」清空，再學新課，效果最好。' },
  { lang: 'all', cat: '學習方法', title: '短時間、高頻率', body: '每天 15 分鐘，勝過週末一次 3 小時。短時間、高頻率最容易養成習慣，連勝也比較不會斷。' },
  { lang: 'all', cat: '學習方法', title: '大聲唸出來', body: '跟著語音一起唸（shadowing），能同時練聽力和發音。每題答完按一下 🔊，跟著唸一次就好。' },
  { lang: 'all', cat: '學習方法', title: '答錯比答對更有價值', body: '模擬考交卷後一定要看「檢討答案」：答錯的題目代表還沒掌握的地方，把它們弄懂，分數進步最快。' },
  { lang: 'all', cat: '學習方法', title: '睡前複習', body: '睡前複習的內容，大腦會在睡覺時整理、鞏固，隔天通常記得更牢。' },
  { lang: 'all', cat: '學習方法', title: '三語對照記憶', body: '同一個意思一次記三種說法：謝謝＝thank you＝ありがとう＝감사합니다。三種語言互相提醒，比較不會忘。' },
  { lang: 'all', cat: '學習方法', title: '把生活換成外語', body: '把手機或常用 App 的語言改成正在學的語言，每天都會看到「設定」「確認」「取消」這些常用詞。' },
];

const SEEN_KEY = 'trilingo.seenTips';

/** 隨機挑一則小知識：盡量避開最近看過的，每次打開都不一樣 */
export function randomTip(langs?: (LangId | 'all')[], avoid?: number): number {
  let seen: number[] = [];
  try {
    seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]');
  } catch {
    /* 無痕模式或沒有 localStorage：純隨機 */
  }
  const pool = TIPS.map((_, i) => i).filter((i) => i !== avoid && (!langs || langs.includes(TIPS[i].lang)));
  const fresh = pool.filter((i) => !seen.includes(i));
  const from = fresh.length ? fresh : pool;
  const pick = from[Math.floor(Math.random() * from.length)] ?? 0;
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen.filter((i) => i !== pick), pick].slice(-Math.floor(TIPS.length * 0.6))));
  } catch {
    /* 存不了也沒關係 */
  }
  return pick;
}
