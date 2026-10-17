// 彩蛋清單（純資料）。觸發方式寫在 eggs.ts 與 store.ts；收藏冊在成就頁。
// 提示故意寫得有點隱晦，但看得懂的人一定找得到。

export interface EggDef {
  id: string;
  icon: string;
  title: string;
  hint: string;
  coins: number;
}

export const EGGS: EggDef[] = [
  { id: 'konami', icon: '🎮', title: '傳說中的秘技', hint: '遊戲界最有名的一串秘技指令（方向鍵開頭，B、A 結尾）', coins: 100 },
  { id: 'sakura', icon: '🌸', title: '花見', hint: '輸入日本國花的羅馬拼音', coins: 30 },
  { id: 'saranghae', icon: '💗', title: '사랑해', hint: '用羅馬拼音對韓文說「我愛你」', coins: 30 },
  { id: 'toeic', icon: '🏅', title: '滿分氣場', hint: '輸入你要挑戰的英文檢定名稱', coins: 30 },
  { id: 'meow', icon: '🐱', title: '喵喵喵', hint: '用英文學貓叫', coins: 30 },
  { id: 'daebak', icon: '🎆', title: '대박！', hint: '輸入韓劇裡最常聽到的驚嘆詞（羅馬拼音）', coins: 30 },
  { id: 'logo', icon: '🦖', title: '道場的秘密恐龍', hint: '左上角的 Logo 連點七下', coins: 50 },
  { id: 'poke', icon: '👉', title: '別再戳了', hint: '段位徽章好像很怕癢', coins: 20 },
  { id: 'mascot', icon: '😼', title: '喵師父的秘密', hint: '喵師父被摸太多下會說溜嘴', coins: 30 },
  { id: 'goldcat', icon: '✨', title: '金色喵師父', hint: '非常少見的金色喵師父，摸摸喵師父碰碰運氣', coins: 88 },
  { id: 'dev', icon: '🛠️', title: '開發者模式', hint: '設定頁最下面的版本號', coins: 50 },
  { id: 'lucky', icon: '🍀', title: '幸運星', hint: '過關時偶爾會有幸運星降臨', coins: 20 },
  { id: 'golden', icon: '👑', title: '黃金寶箱', hint: '比一般寶箱稀有很多的寶箱', coins: 20 },
  { id: 'threeam', icon: '🦉', title: '凌晨三點的學霸', hint: '在凌晨三點（3:00–3:59）學習', coins: 30 },
  { id: 'clock1234', icon: '⏰', title: '一二三四', hint: '在時鐘排成順子的那一分鐘學習', coins: 34 },
  { id: 'catday', icon: '🐈', title: '貓之日', hint: '日本的貓之日（2 月 22 日，にゃんにゃんにゃん）打開 App', coins: 22 },
  { id: 'hangulday', icon: '📜', title: '한글날', hint: '韓文字母的生日（10 月 9 日）打開 App', coins: 39 },
  { id: 'aprilfools', icon: '🤡', title: '愚人節', hint: '4 月 1 日打開 App', coins: 41 },
  { id: 'xmas', icon: '🎄', title: '聖誕快樂', hint: '12 月 25 日打開 App', coins: 25 },
  { id: 'newyear', icon: '🎍', title: '新年快樂', hint: '1 月 1 日打開 App', coins: 50 },
];

export const EGG_BY_ID = new Map(EGGS.map((e) => [e.id, e]));

/** 日期限定彩蛋：「月-日」→ 彩蛋 id */
export const DATE_EGGS: Record<string, string> = {
  '02-22': 'catday',
  '10-09': 'hangulday',
  '04-01': 'aprilfools',
  '12-25': 'xmas',
  '01-01': 'newyear',
};
