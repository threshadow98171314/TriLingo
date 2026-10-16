// 扭蛋貼紙：日本、韓國、英語圈與學習主題的可愛插畫，四種稀有度。
import type { ReactNode } from 'react';
import { Art, Blush, Eyes, Face, Flower, INK, line, Mouth, Sparkle, starPath } from './kit';
import { MascotBody } from './mascot';

export type Rarity = 'N' | 'R' | 'SR' | 'SSR';

export interface Sticker {
  id: string;
  name: string;
  rarity: Rarity;
  /** 主題：日本、韓國、英語圈、學習、季節、台灣、傳說 */
  theme: '日本' | '韓國' | '英語圈' | '學習' | '季節' | '台灣' | '傳說';
  /** 一句小介紹（收集到才看得到） */
  note: string;
  draw: () => ReactNode;
}

export const RARITY_NAME: Record<Rarity, string> = { N: '普通', R: '稀有', SR: '超稀有', SSR: '傳說' };

export const STICKERS: Sticker[] = [
  // ───── 日本 ─────
  {
    id: 'onigiri',
    name: '飯糰',
    rarity: 'N',
    theme: '日本',
    note: 'おにぎり：便利商店最受歡迎的早餐，鮭魚（さけ）和鮪魚美乃滋（ツナマヨ）是兩大口味。',
    draw: () => (
      <>
        <path d="M50 12 C59 12 87 60 87 72 C87 82 79 87 69 87 H31 C21 87 13 82 13 72 C13 60 41 12 50 12 Z" fill="#ffffff" {...line('#b9b9c9')} />
        <rect x="35" y="62" width="30" height="25" rx="3" fill="#2f4a3a" />
        <Face y={48} gap={17} mouth="smile" />
      </>
    ),
  },
  {
    id: 'sushi',
    name: '鮭魚握壽司',
    rarity: 'N',
    theme: '日本',
    note: 'サーモン：鮭魚握壽司是迴轉壽司（回転寿司）的人氣第一名。',
    draw: () => (
      <>
        <rect x="18" y="48" width="64" height="32" rx="13" fill="#ffffff" {...line('#c3c3d3')} />
        <path d="M13 46 C20 29 80 29 87 46 C87 55 80 57 70 55 H30 C20 57 13 55 13 46 Z" fill="#ff9a6b" {...line('#e06a3d')} />
        <g fill="none" {...line('#ffd3bf', 2.6)}>
          <path d="M30 37 Q34 45 30 52" />
          <path d="M48 34 Q52 44 48 52" />
          <path d="M66 37 Q70 45 66 52" />
        </g>
        <Face y={63} gap={17} r={3.6} mouth="cat" mw={3.6} />
      </>
    ),
  },
  {
    id: 'dango',
    name: '三色糰子',
    rarity: 'N',
    theme: '日本',
    note: '花見団子：賞櫻時吃的三色糰子，粉紅、白、綠代表春天。',
    draw: () => (
      <>
        <path d="M50 94 V6" {...line('#c99a5b', 4)} />
        <circle cx="50" cy="23" r="14" fill="#ffbcd5" {...line('#e07ea6')} />
        <circle cx="50" cy="50" r="14" fill="#ffffff" {...line('#c3c3d3')} />
        <circle cx="50" cy="77" r="14" fill="#a8dd8f" {...line('#6fae57')} />
        <Eyes y={21} gap={9} r={2.4} closed />
        <Face y={47} gap={10} r={2.8} mouth="cat" mw={3} />
        <Eyes y={75} gap={9} r={2.4} />
      </>
    ),
  },
  {
    id: 'ramen',
    name: '拉麵',
    rarity: 'R',
    theme: '日本',
    note: 'ラーメン：點餐時可以說「麺かため」（麵硬一點）、「替え玉」（加麵）。',
    draw: () => (
      <>
        <path d="M42 8 L64 46" {...line('#c99a5b', 4)} />
        <path d="M53 6 L72 44" {...line('#c99a5b', 4)} />
        <path d="M13 48 H87 C87 71 71 86 50 86 C29 86 13 71 13 48 Z" fill="#ff8676" {...line('#c94d40')} />
        <ellipse cx="50" cy="48" rx="37" ry="10" fill="#ffdc96" {...line('#c94d40')} />
        <g fill="none" {...line('#efb24a', 2.4)}>
          <path d="M22 48 Q28 42 34 48 Q40 54 46 48" />
          <path d="M54 48 Q60 42 66 48 Q72 54 78 48" />
        </g>
        <circle cx="65" cy="45" r="6.5" fill="#ffffff" {...line('#d9d9e3', 2)} />
        <path d="M61.5 45 Q65 41.5 68.5 45 Q65 48.5 61.5 45" fill="none" {...line('#ff8fb1', 1.8)} />
        <ellipse cx="35" cy="45" rx="8" ry="6" fill="#ffffff" />
        <ellipse cx="35" cy="45" rx="4" ry="3.4" fill="#ffb83d" />
        <Face y={64} gap={20} r={3.6} mouth="open" mw={5} />
      </>
    ),
  },
  {
    id: 'daruma',
    name: '達摩',
    rarity: 'R',
    theme: '日本',
    note: 'だるま：許願時先畫一隻眼睛，願望實現了再畫另一隻。',
    draw: () => (
      <>
        <path d="M50 9 C74 9 87 30 87 54 C87 77 70 91 50 91 C30 91 13 77 13 54 C13 30 26 9 50 9 Z" fill="#e8484f" {...line('#a82a32')} />
        <ellipse cx="50" cy="44" rx="24" ry="20" fill="#fff4e8" {...line('#a82a32', 2.5)} />
        <g fill="none" {...line(INK, 3)}>
          <path d="M33 34 Q38 30 44 34" />
          <path d="M56 34 Q62 30 67 34" />
        </g>
        <Eyes y={43} gap={20} r={4.4} />
        <path d="M40 54 Q45 50 50 54 Q55 50 60 54" fill="none" {...line(INK, 2.5)} />
        <Blush y={51} gap={34} />
        <text x="50" y="81" textAnchor="middle" fontSize="13" fontWeight="900" fill="#ffd36b">
          福
        </text>
      </>
    ),
  },
  {
    id: 'fuji',
    name: '富士山',
    rarity: 'R',
    theme: '日本',
    note: '富士山（ふじさん）：日本最高的山，3,776 公尺。登山季節只有七、八月。',
    draw: () => (
      <>
        <circle cx="74" cy="26" r="12" fill="#ff8a7a" />
        <path d="M7 84 L38 30 C42 23 58 23 62 30 L93 84 Z" fill="#79b2ff" {...line('#3a6fc4')} />
        <path d="M38 30 C42 23 58 23 62 30 L68 41 L60 38 L54 45 L48 38 L40 43 L32 41 Z" fill="#ffffff" {...line('#3a6fc4', 2.5)} />
        <Face y={60} gap={17} mouth="smile" />
        <path d="M9 74 Q12 66 20 68 Q26 61 33 69 Q38 76 28 77 H14 Q7 77 9 74 Z" fill="#ffffff" {...line('#c9d6ef', 2)} />
      </>
    ),
  },
  {
    id: 'sakura',
    name: '櫻花',
    rarity: 'N',
    theme: '日本',
    note: '桜（さくら）：三月底到四月初盛開，賞櫻叫「お花見」。',
    draw: () => (
      <>
        <Flower x={50} y={50} r={40} fill="#ffc8da" stroke="#e88aac" notch center="#fff0f5" />
        <circle cx="50" cy="50" r="13" fill="#fff0f5" />
        <Face y={48} gap={10} r={2.7} mouth="smile" mw={4} blush={false} />
        <Blush y={53} gap={17} rx={3} ry={2} />
      </>
    ),
  },
  {
    id: 'torii',
    name: '鳥居',
    rarity: 'R',
    theme: '日本',
    note: '鳥居（とりい）：神社的入口。走參道時要走兩旁，中間是神明走的路。',
    draw: () => (
      <>
        <path d="M8 22 Q50 10 92 22 L89 31 Q50 21 11 31 Z" fill="#e8484f" {...line('#a82a32')} />
        <rect x="16" y="35" width="68" height="8" rx="2" fill="#e8484f" {...line('#a82a32')} />
        <rect x="25" y="28" width="10" height="62" rx="2" fill="#e8484f" {...line('#a82a32')} />
        <rect x="65" y="28" width="10" height="62" rx="2" fill="#e8484f" {...line('#a82a32')} />
        <rect x="44" y="29" width="12" height="13" rx="2" fill="#2f2f3a" />
        <rect x="21" y="85" width="18" height="6" rx="2" fill="#2f2f3a" />
        <rect x="61" y="85" width="18" height="6" rx="2" fill="#2f2f3a" />
        <Flower x={50} y={66} r={9} fill="#ffc8da" stroke="#e88aac" notch />
      </>
    ),
  },
  {
    id: 'koinobori',
    name: '鯉魚旗',
    rarity: 'R',
    theme: '日本',
    note: 'こいのぼり：五月五日兒童節（こどもの日）掛起來，祝男孩健康長大。',
    draw: () => (
      <>
        <path d="M14 94 V8" {...line('#c99a5b', 4)} />
        <circle cx="14" cy="7" r="4" fill="#ffd36b" />
        <path d="M17 18 H68 Q80 18 87 27 L79 31 L87 36 Q80 44 68 44 H17 Z" fill="#5aa2ff" {...line('#2f6fc4')} />
        <g fill="none" {...line('#b5d8ff', 2)}>
          <path d="M42 22 Q38 31 42 40" />
          <path d="M54 22 Q50 31 54 40" />
        </g>
        <circle cx="27" cy="30" r="6" fill="#ffffff" {...line('#2f6fc4', 2)} />
        <circle cx="27" cy="30" r="3" fill={INK} />
        <path d="M17 52 H60 Q71 52 77 60 L70 63 L77 67 Q71 74 60 74 H17 Z" fill="#ff7b7b" {...line('#c94848')} />
        <circle cx="26" cy="63" r="5" fill="#ffffff" {...line('#c94848', 2)} />
        <circle cx="26" cy="63" r="2.5" fill={INK} />
      </>
    ),
  },
  {
    id: 'matcha',
    name: '抹茶',
    rarity: 'N',
    theme: '日本',
    note: '抹茶（まっちゃ）：茶道裡喝之前要把碗轉兩次，讓正面朝外。',
    draw: () => (
      <>
        <path d="M44 22 Q38 15 44 8" fill="none" {...line('#c9d6c9', 3)} />
        <path d="M56 22 Q50 15 56 8" fill="none" {...line('#c9d6c9', 3)} />
        <path d="M13 42 H87 C87 67 71 83 50 83 C29 83 13 67 13 42 Z" fill="#f3dcb8" {...line('#b98c5a')} />
        <ellipse cx="50" cy="42" rx="37" ry="10" fill="#8fce6b" {...line('#b98c5a')} />
        <path d="M26 42 Q33 38 40 42 Q47 46 54 42 Q61 38 68 42" fill="none" {...line('#c6ec9f', 2)} />
        <Face y={60} gap={19} r={3.8} mouth="smile" />
      </>
    ),
  },
  {
    id: 'maneki',
    name: '招財貓',
    rarity: 'SR',
    theme: '日本',
    note: '招き猫（まねきねこ）：舉右手招財、舉左手招客，兩手都舉的最貪心。',
    draw: () => (
      <>
        <path d="M72 47 C71 31 75 18 82 18 C89 18 91 30 87 47 Z" fill="#ffffff" {...line('#c3b3c2')} />
        <path d="M24 35 L26 12 L44 27 Z" fill="#ffffff" {...line('#c3b3c2')} />
        <path d="M28 30 L29 19 L38 26 Z" fill="#ffb3c1" />
        <path d="M76 35 L74 12 L56 27 Z" fill="#ffffff" {...line('#c3b3c2')} />
        <path d="M27 64 C27 58 73 58 73 64 V83 C73 89 27 89 27 83 Z" fill="#ffffff" {...line('#c3b3c2')} />
        <ellipse cx="50" cy="46" rx="28" ry="24" fill="#ffffff" {...line('#c3b3c2')} />
        <path d="M57 24 C68 24 75 32 73 39 C66 35 60 31 57 24 Z" fill="#ffb15c" />
        <Face y={45} gap={17} mouth="cat" mw={4} />
        <path d="M30 65 Q50 72 70 65" fill="none" {...line('#e8484f', 5)} />
        <circle cx="50" cy="71" r="5" fill="#ffd36b" {...line('#c99a2a', 2)} />
        <ellipse cx="50" cy="81" rx="11" ry="6" fill="#ffd36b" {...line('#c99a2a', 2)} />
        <Sparkle x={88} y={10} s={6} color="#ffd36b" />
      </>
    ),
  },
  {
    id: 'shiba',
    name: '柴犬',
    rarity: 'SR',
    theme: '日本',
    note: '柴犬（しばいぬ）：日本最古老的犬種之一，個性獨立又忠心。',
    draw: () => (
      <>
        <path d="M19 47 L24 12 L46 29 Z" fill="#f0a253" {...line('#b86d2a')} />
        <path d="M25 39 L27 21 L38 29 Z" fill="#fff1df" />
        <path d="M81 47 L76 12 L54 29 Z" fill="#f0a253" {...line('#b86d2a')} />
        <path d="M75 39 L73 21 L62 29 Z" fill="#fff1df" />
        <ellipse cx="50" cy="57" rx="34" ry="30" fill="#f0a253" />
        <path d="M17 60 C24 52 38 50 50 58 C62 50 76 52 83 60 C81 77 67 87 50 87 C33 87 19 77 17 60 Z" fill="#fff6ea" />
        <ellipse cx="50" cy="57" rx="34" ry="30" fill="none" {...line('#b86d2a')} />
        <circle cx="40" cy="42" r="3" fill="#fff6ea" />
        <circle cx="60" cy="42" r="3" fill="#fff6ea" />
        <Eyes y={50} gap={22} />
        <Blush y={60} gap={46} />
        <ellipse cx="50" cy="62" rx="4.4" ry="3.1" fill={INK} />
        <Mouth y={65.5} kind="cat" w={4.4} />
      </>
    ),
  },
  // ───── 韓國 ─────
  {
    id: 'kimchi',
    name: '泡菜',
    rarity: 'N',
    theme: '韓國',
    note: '김치：每年冬天全家一起醃泡菜叫「김장」，已列入聯合國非物質文化遺產。',
    draw: () => (
      <>
        <path d="M50 9 C71 13 85 36 83 58 C81 78 67 91 50 91 C33 91 19 78 17 58 C15 36 29 13 50 9 Z" fill="#ff6f5e" {...line('#c43d2e')} />
        <path d="M50 91 C40 81 38 65 50 51 C62 65 60 81 50 91 Z" fill="#ffe7a8" {...line('#d9b24a', 2.5)} />
        <g fill="none" {...line('#ffa093', 2.4)}>
          <path d="M29 30 Q39 40 35 54" />
          <path d="M71 30 Q61 40 65 54" />
        </g>
        <Face y={42} gap={17} mouth="open" mw={5} />
      </>
    ),
  },
  {
    id: 'tteokbokki',
    name: '辣炒年糕',
    rarity: 'N',
    theme: '韓國',
    note: '떡볶이：學校門口最常見的小吃，配上魚板（어묵）和炸物一起吃。',
    draw: () => (
      <>
        <ellipse cx="50" cy="74" rx="41" ry="14" fill="#ffffff" {...line('#c3c3d3')} />
        <ellipse cx="50" cy="72" rx="32" ry="9" fill="#ff8a6b" opacity="0.5" />
        <rect x="14" y="54" width="54" height="20" rx="10" transform="rotate(10 41 64)" fill="#ff7b5c" {...line('#c94d34')} />
        <rect x="24" y="30" width="58" height="23" rx="11.5" transform="rotate(-12 53 41)" fill="#ff8a6b" {...line('#c94d34')} />
        <Eyes x={52} y={39} gap={13} r={3} />
        <Mouth x={52} y={45} kind="cat" w={3.4} />
        <g fill="#fff">
          <ellipse cx="36" cy="38" rx="1.8" ry="1" />
          <ellipse cx="70" cy="33" rx="1.8" ry="1" />
          <ellipse cx="30" cy="62" rx="1.8" ry="1" />
        </g>
      </>
    ),
  },
  {
    id: 'kimbap',
    name: '紫菜飯捲',
    rarity: 'N',
    theme: '韓國',
    note: '김밥：校外教學、野餐必備，切成一片一片方便分著吃。',
    draw: () => (
      <>
        <circle cx="50" cy="50" r="38" fill="#2f4a3a" {...line('#1e2f26')} />
        <circle cx="50" cy="50" r="31" fill="#ffffff" />
        <rect x="35" y="27" width="9" height="9" rx="2" fill="#ffd34d" />
        <rect x="46" y="25" width="9" height="9" rx="2" fill="#ff9447" />
        <rect x="57" y="27" width="9" height="9" rx="2" fill="#7fcf5a" />
        <circle cx="66" cy="40" r="3.6" fill="#ff8fb1" />
        <circle cx="34" cy="40" r="3.6" fill="#a0522d" />
        <Face y={54} gap={17} mouth="smile" />
      </>
    ),
  },
  {
    id: 'bibimbap',
    name: '石鍋拌飯',
    rarity: 'R',
    theme: '韓國',
    note: '비빔밥：「비빔」是拌、「밥」是飯。吃之前要先全部拌勻。',
    draw: () => (
      <>
        <path d="M11 46 H89 C89 70 72 87 50 87 C28 87 11 70 11 46 Z" fill="#9aa0b5" {...line('#555a6e')} />
        <ellipse cx="50" cy="46" rx="39" ry="12" fill="#fff8ec" {...line('#555a6e')} />
        <ellipse cx="28" cy="45" rx="8" ry="4" fill="#7fcf5a" />
        <ellipse cx="40" cy="40" rx="7" ry="3.5" fill="#ff9447" />
        <ellipse cx="60" cy="40" rx="7" ry="3.5" fill="#a0522d" />
        <ellipse cx="72" cy="45" rx="8" ry="4" fill="#ffe08a" />
        <ellipse cx="50" cy="49" rx="9" ry="5" fill="#ffffff" {...line('#e6e0d0', 1.5)} />
        <circle cx="50" cy="48.5" r="3.5" fill="#ffb83d" />
        <Face y={65} gap={21} r={3.8} mouth="open" mw={5} />
      </>
    ),
  },
  {
    id: 'mugunghwa',
    name: '木槿花',
    rarity: 'R',
    theme: '韓國',
    note: '무궁화：韓國的國花，名字是「無窮花」的意思，象徵永不凋零。',
    draw: () => (
      <>
        <Flower x={50} y={50} r={40} fill="#ffd3e8" stroke="#e28ab4" center="#d6336c" />
        <g {...line('#d6336c', 2.2)}>
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d="M50 50 L50 34" transform={`rotate(${a} 50 50)`} />
          ))}
        </g>
        <circle cx="50" cy="50" r="5" fill="#ffe08a" />
        <Sparkle x={84} y={16} s={6} />
      </>
    ),
  },
  {
    id: 'hotteok',
    name: '糖餅',
    rarity: 'N',
    theme: '韓國',
    note: '호떡：冬天的路邊攤小吃，裡面包著黑糖和堅果，小心燙口！',
    draw: () => (
      <>
        <path d="M70 18 Q66 12 70 6" fill="none" {...line('#d6d6e6', 3)} />
        <ellipse cx="50" cy="56" rx="39" ry="30" fill="#f2b45c" {...line('#c27a2a')} />
        <ellipse cx="50" cy="52" rx="28" ry="19" fill="#f7c675" />
        <path d="M60 80 Q66 92 72 84 Q70 78 66 78 Z" fill="#8a4b1f" />
        <Face y={52} gap={18} mouth="open" mw={5} />
      </>
    ),
  },
  {
    id: 'bungeoppang',
    name: '鯛魚燒',
    rarity: 'R',
    theme: '韓國',
    note: '붕어빵（日本叫たい焼き）：你是從頭吃還是從尾巴吃？',
    draw: () => (
      <>
        <path d="M13 50 C21 27 56 21 74 35 L91 23 L86 50 L91 77 L74 65 C56 79 21 73 13 50 Z" fill="#eaa85a" {...line('#b0702a')} />
        <g fill="none" {...line('#c9853d', 2)}>
          <path d="M44 35 Q40 50 44 65" />
          <path d="M55 35 Q51 50 55 65" />
          <path d="M65 40 Q61 50 65 60" />
        </g>
        <circle cx="28" cy="45" r="4.2" fill={INK} />
        <circle cx="29.4" cy="43.4" r="1.5" fill="#fff" />
        <ellipse cx="33" cy="54" rx="4" ry="2.5" fill="#ff8fa6" opacity="0.6" />
        <Mouth x={21} y={54} kind="smile" w={5} />
      </>
    ),
  },
  {
    id: 'bananamilk',
    name: '香蕉牛奶',
    rarity: 'N',
    theme: '韓國',
    note: '바나나맛 우유：胖胖的罐子是招牌，泡完汗蒸幕（찜질방）來一瓶最對味。',
    draw: () => (
      <>
        <path d="M57 3 L53 24" {...line('#ff7ab6', 3.5)} />
        <rect x="38" y="11" width="24" height="10" rx="3" fill="#ffffff" {...line('#c3c3d3')} />
        <path d="M40 21 H60 L62 31 C78 37 80 61 76 75 C72 89 28 89 24 75 C20 61 22 37 38 31 Z" fill="#ffe066" {...line('#d9b020')} />
        <rect x="34" y="58" width="32" height="13" rx="4" fill="#fff8d6" {...line('#d9b020', 2)} />
        <Face y={45} gap={17} mouth="cat" mw={4} />
      </>
    ),
  },
  {
    id: 'namsan',
    name: '南山塔',
    rarity: 'SR',
    theme: '韓國',
    note: '남산타워：首爾的地標，情侶會在欄杆上掛「愛情鎖」。',
    draw: () => (
      <>
        <path d="M6 92 Q50 64 94 92 Z" fill="#86d36a" {...line('#4f9a3a')} />
        <rect x="45.5" y="42" width="9" height="40" fill="#eef2fb" {...line('#8a93b8', 2.5)} />
        <ellipse cx="50" cy="41" rx="17" ry="8" fill="#f6f8fd" {...line('#8a93b8', 2.5)} />
        <rect x="39" y="29" width="22" height="9" rx="3" fill="#d4dcf3" {...line('#8a93b8', 2.5)} />
        <path d="M50 29 V8" {...line('#8a93b8', 3)} />
        <circle cx="50" cy="7" r="2.6" fill="#ff6b81" />
        <Eyes y={40} gap={11} r={2.4} />
        <Mouth y={44} kind="smile" w={4} />
        <path d="M76 24 C76 20 81 19 82 23 C83 19 88 20 88 24 C88 28 82 31 82 31 C82 31 76 28 76 24 Z" fill="#ff7aa8" />
        <path d="M14 34 C14 31 18 30 19 33 C20 30 24 31 24 34 C24 37 19 40 19 40 C19 40 14 37 14 34 Z" fill="#ffb3cf" />
      </>
    ),
  },
  // ───── 英語圈 ─────
  {
    id: 'teacup',
    name: '下午茶',
    rarity: 'N',
    theme: '英語圈',
    note: 'afternoon tea：英國人愛喝茶，「a cup of tea」也可以用來比喻「喜歡的東西」。',
    draw: () => (
      <>
        <path d="M36 26 Q32 19 36 12" fill="none" {...line('#d6d6e6', 3)} />
        <path d="M48 24 Q44 17 48 10" fill="none" {...line('#d6d6e6', 3)} />
        <ellipse cx="50" cy="79" rx="37" ry="9" fill="#ffffff" {...line('#c3c3d3')} />
        <path d="M77 45 C92 45 92 65 75 65" fill="none" {...line('#c3c3d3', 4.5)} />
        <path d="M17 38 H80 C80 62 68 77 48.5 77 C29 77 17 62 17 38 Z" fill="#ffffff" {...line('#c3c3d3')} />
        <ellipse cx="48.5" cy="38" rx="31.5" ry="7" fill="#c97a3d" {...line('#c3c3d3')} />
        <path d="M60 38 L66 20" {...line('#d9d9e3', 1.5)} />
        <rect x="62" y="13" width="10" height="8" rx="1.5" fill="#ff9fbf" />
        <Face y={55} gap={17} mouth="smile" />
      </>
    ),
  },
  {
    id: 'bigben',
    name: '大笨鐘',
    rarity: 'R',
    theme: '英語圈',
    note: 'Big Ben：其實是鐘樓裡那口大鐘的名字，鐘樓本身叫 Elizabeth Tower。',
    draw: () => (
      <>
        <path d="M37 26 L50 5 L63 26 Z" fill="#8b97c2" {...line('#4f5a85')} />
        <rect x="33" y="26" width="34" height="65" rx="3" fill="#ecce90" {...line('#a8853f')} />
        <circle cx="50" cy="43" r="13" fill="#ffffff" {...line('#a8853f', 2.5)} />
        <Eyes y={41} gap={9} r={2.4} />
        <Mouth y={46} kind="smile" w={4} />
        <g fill="#c9a35c">
          <rect x="40" y="62" width="6" height="10" rx="2" />
          <rect x="54" y="62" width="6" height="10" rx="2" />
          <rect x="40" y="77" width="6" height="10" rx="2" />
          <rect x="54" y="77" width="6" height="10" rx="2" />
        </g>
      </>
    ),
  },
  {
    id: 'bus',
    name: '雙層巴士',
    rarity: 'R',
    theme: '英語圈',
    note: 'double-decker bus：倫敦的紅色雙層巴士，坐上層最前排可以看街景。',
    draw: () => (
      <>
        <rect x="9" y="18" width="82" height="62" rx="11" fill="#e8484f" {...line('#a82a32')} />
        <g fill="#cfeaff" {...line('#a82a32', 2)}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={15 + i * 19} y={25} width={14} height={14} rx={3} />
          ))}
        </g>
        <rect x="9" y="45" width="82" height="4" fill="#ffd36b" />
        <Face y={59} gap={20} mouth="open" mw={5} />
        <circle cx="28" cy="82" r="8" fill="#3a3a4a" {...line('#24242e', 2)} />
        <circle cx="72" cy="82" r="8" fill="#3a3a4a" {...line('#24242e', 2)} />
      </>
    ),
  },
  {
    id: 'burger',
    name: '漢堡',
    rarity: 'N',
    theme: '英語圈',
    note: '點餐時說「For here or to go?」——內用還是外帶？',
    draw: () => (
      <>
        <path d="M15 47 C15 21 85 21 85 47 Z" fill="#f2b45c" {...line('#c27a2a')} />
        <g fill="#fff6d6">
          <ellipse cx="34" cy="30" rx="2.2" ry="1.3" />
          <ellipse cx="50" cy="26" rx="2.2" ry="1.3" />
          <ellipse cx="66" cy="31" rx="2.2" ry="1.3" />
        </g>
        <path d="M13 49 Q23 55 33 49 Q43 55 53 49 Q63 55 73 49 Q81 53 87 49 V54 H13 Z" fill="#86d36a" {...line('#4f9a3a', 2)} />
        <rect x="13" y="54" width="74" height="12" rx="6" fill="#8a4b2a" {...line('#5e2f16')} />
        <path d="M17 54 H83 L72 63 L64 56 Z" fill="#ffd34d" />
        <path d="M15 68 H85 C85 80 77 84 71 84 H29 C23 84 15 80 15 68 Z" fill="#f2b45c" {...line('#c27a2a')} />
        <Face y={38} gap={17} r={3.6} mouth="smile" mw={5} />
      </>
    ),
  },
  {
    id: 'pizza',
    name: '披薩',
    rarity: 'N',
    theme: '英語圈',
    note: '一片披薩是「a slice of pizza」，整個是「a whole pizza」。',
    draw: () => (
      <>
        <path d="M13 22 Q50 7 87 22 L50 93 Z" fill="#ffd66b" {...line('#d99a20')} />
        <path d="M13 22 Q50 7 87 22 L83 31 Q50 18 17 31 Z" fill="#e9a656" {...line('#c27a2a')} />
        <circle cx="37" cy="40" r="6" fill="#e8484f" />
        <circle cx="64" cy="41" r="5" fill="#e8484f" />
        <circle cx="52" cy="70" r="5" fill="#e8484f" />
        <Face y={50} gap={15} r={3.4} mouth="open" mw={4} />
      </>
    ),
  },
  {
    id: 'umbrella',
    name: '雨傘',
    rarity: 'N',
    theme: '英語圈',
    note: '「It’s raining cats and dogs.」是「下大雨」，不是天上掉下貓狗。',
    draw: () => (
      <>
        <path d="M9 50 C9 26 29 11 50 11 C71 11 91 26 91 50 Q83 44 75 50 Q67 44 59 50 Q50 44 41 50 Q33 44 25 50 Q17 44 9 50 Z" fill="#a8d8ff" {...line('#4f9ad9')} />
        <path d="M50 11 Q39 30 41 50" fill="none" {...line('#4f9ad9', 2)} />
        <path d="M50 11 Q61 30 59 50" fill="none" {...line('#4f9ad9', 2)} />
        <path d="M50 50 V80 Q50 89 42 89 Q35 89 35 82" fill="none" {...line('#6b5a8a', 4)} />
        <Face y={30} gap={16} r={3.4} mouth="smile" mw={4} />
        <path d="M18 64 Q15 69 18 71 Q21 69 18 64 Z" fill="#a8d8ff" />
        <path d="M80 66 Q77 71 80 73 Q83 71 80 66 Z" fill="#a8d8ff" />
      </>
    ),
  },
  {
    id: 'crown',
    name: '皇冠',
    rarity: 'SR',
    theme: '英語圈',
    note: '英國王室的王冠收藏在倫敦塔，平常就能買票參觀。',
    draw: () => (
      <>
        <path d="M13 76 L17 30 L35 50 L50 21 L65 50 L83 30 L87 76 Z" fill="#ffd34d" {...line('#c99a2a')} />
        <rect x="13" y="70" width="74" height="15" rx="4" fill="#ffc21a" {...line('#c99a2a')} />
        <circle cx="17" cy="27" r="5" fill="#ff7aa8" />
        <circle cx="50" cy="19" r="5" fill="#7ad8ff" />
        <circle cx="83" cy="27" r="5" fill="#9cff8a" />
        <Face y={55} gap={17} mouth="smile" />
        <Sparkle x={90} y={12} s={6} />
      </>
    ),
  },
  // ───── 學習 ─────
  {
    id: 'pencil',
    name: '鉛筆',
    rarity: 'N',
    theme: '學習',
    note: '鉛筆：日文「鉛筆（えんぴつ）」、韓文「연필」，連讀音都很像！',
    draw: () => (
      <g transform="rotate(-35 50 50)">
        <rect x="20" y="39" width="55" height="22" fill="#ffd34d" {...line('#c99a2a')} />
        <path d="M75 39 L92 50 L75 61 Z" fill="#f6d7b0" {...line('#c99a2a')} />
        <path d="M86.5 46.3 L92 50 L86.5 53.7 Z" fill={INK} />
        <rect x="10" y="39" width="12" height="22" rx="3" fill="#ff9fbf" {...line('#d96a8f')} />
        <rect x="21" y="39" width="5" height="22" fill="#c9c9d6" />
        <Face x={49} y={48} gap={13} r={3} mouth="smile" mw={4} />
      </g>
    ),
  },
  {
    id: 'book',
    name: '單字書',
    rarity: 'N',
    theme: '學習',
    note: '每天背十個字，一年就是三千六百五十個字。',
    draw: () => (
      <>
        <rect x="21" y="12" width="58" height="76" rx="6" fill="#6a8cff" {...line('#3a5ad0')} />
        <rect x="27" y="16" width="48" height="66" rx="4" fill="#89a5ff" />
        <rect x="33" y="25" width="34" height="11" rx="3" fill="#ffffff" />
        <path d="M61 12 V31 L65.5 27 L70 31 V12" fill="#ff6b81" />
        <Face y={57} gap={17} mouth="smile" />
      </>
    ),
  },
  {
    id: 'star',
    name: '金色星星',
    rarity: 'R',
    theme: '學習',
    note: '三顆星過關！全對的感覺最棒了。',
    draw: () => (
      <>
        <path d={starPath(50, 53, 44, 21)} fill="#ffd34d" {...line('#d99a20')} />
        <Face y={52} gap={15} r={3.6} mouth="open" mw={4.5} />
      </>
    ),
  },
  {
    id: 'trophy',
    name: '獎盃',
    rarity: 'SR',
    theme: '學習',
    note: '多益 990、日檢 N1、TOPIK 6 級——下一座獎盃就是你的。',
    draw: () => (
      <>
        <path d="M30 22 H18 C18 37 24 43 32 43" fill="none" {...line('#c99a2a', 4)} />
        <path d="M70 22 H82 C82 37 76 43 68 43" fill="none" {...line('#c99a2a', 4)} />
        <path d="M29 14 H71 V40 C71 55 61 63 50 63 C39 63 29 55 29 40 Z" fill="#ffd34d" {...line('#c99a2a')} />
        <rect x="44" y="62" width="12" height="13" fill="#e9b52a" />
        <rect x="29" y="74" width="42" height="13" rx="3" fill="#8a5a3a" {...line('#5e3a22')} />
        <Face y={35} gap={15} r={3.4} mouth="open" mw={4} />
        <Sparkle x={84} y={10} s={6} />
      </>
    ),
  },
  {
    id: 'bulb',
    name: '靈光燈泡',
    rarity: 'N',
    theme: '學習',
    note: '「啊！原來是這個意思！」——懂了的那一刻最開心。',
    draw: () => (
      <>
        <g {...line('#ffd34d', 3)}>
          <path d="M9 24 L16 28" />
          <path d="M91 24 L84 28" />
          <path d="M20 8 L25 14" />
          <path d="M80 8 L75 14" />
        </g>
        <path d="M50 9 C70 9 83 25 83 42 C83 56 73 62 67 70 V76 H33 V70 C27 62 17 56 17 42 C17 25 30 9 50 9 Z" fill="#fff3a6" {...line('#d9b020')} />
        <rect x="35" y="76" width="30" height="13" rx="4" fill="#bcc3d9" {...line('#7a82a3')} />
        <path d="M38 82.5 H62" {...line('#7a82a3', 2)} />
        <Face y={42} gap={17} mouth="smile" />
      </>
    ),
  },
  {
    id: 'rainbow',
    name: '彩虹',
    rarity: 'R',
    theme: '學習',
    note: '三種語言的彩虹：英文 rainbow、日文 虹（にじ）、韓文 무지개。',
    draw: () => (
      <>
        {['#ff7a7a', '#ffb35c', '#ffe066', '#8fdc6b', '#6ab8ff', '#b48cff'].map((c, i) => (
          <path key={c} d={`M${14 + i * 5} 70 A${36 - i * 5} ${36 - i * 5} 0 0 1 ${86 - i * 5} 70`} fill="none" stroke={c} strokeWidth="5.5" />
        ))}
        <path d="M5 74 Q5 62 17 64 Q21 54 31 60 Q39 62 37 72 Q37 81 27 81 H11 Q5 81 5 74 Z" fill="#ffffff" {...line('#c9d2ea', 2.5)} />
        <path d="M95 74 Q95 62 83 64 Q79 54 69 60 Q61 62 63 72 Q63 81 73 81 H89 Q95 81 95 74 Z" fill="#ffffff" {...line('#c9d2ea', 2.5)} />
        <Eyes x={21} y={70} gap={8} r={2.2} />
        <Mouth x={21} y={74} kind="smile" w={3.4} />
        <Eyes x={79} y={70} gap={8} r={2.2} closed />
        <Mouth x={79} y={74} kind="smile" w={3.4} />
      </>
    ),
  },
  // ───── 季節與節慶 ─────
  {
    id: 'furin',
    name: '風鈴',
    rarity: 'R',
    theme: '季節',
    note: '風鈴（ふうりん）：日本夏天的聲音，叮鈴叮鈴聽起來就涼快。',
    draw: () => (
      <>
        <path d="M50 6 V16" {...line('#8a93b8', 2)} />
        <path d="M26 46 C26 26 36 16 50 16 C64 16 74 26 74 46 Z" fill="#e8f6ff" fillOpacity="0.9" {...line('#7fb2dd')} />
        <path d="M30 36 C38 30 44 40 50 34 C56 28 62 38 70 34" fill="none" {...line('#ff6b81', 3)} />
        <circle cx="40" cy="26" r="3" fill="#ff9fbf" />
        <path d="M50 46 V60" {...line('#8a93b8', 2)} />
        <rect x="40" y="60" width="20" height="30" rx="3" fill="#fff6dc" {...line('#d9b98a', 2.4)} />
        <path d="M45 68 H55 M45 74 H55" {...line('#ff9fbf', 2)} />
        <Face y={38} gap={14} r={3} mouth="smile" mw={4} blush={false} />
      </>
    ),
  },
  {
    id: 'suika',
    name: '西瓜',
    rarity: 'N',
    theme: '季節',
    note: '西瓜（すいか）／수박／watermelon：夏天海邊的「打西瓜」（スイカ割り）是日本的經典遊戲。',
    draw: () => (
      <>
        <path d="M8 38 H92 C92 64 74 84 50 84 C26 84 8 64 8 38 Z" fill="#3fa34d" {...line('#2a6e34')} />
        <path d="M14 38 H86 C86 60 70 77 50 77 C30 77 14 60 14 38 Z" fill="#ff6b7a" />
        <g fill={INK}>
          <ellipse cx="32" cy="52" rx="1.8" ry="2.8" />
          <ellipse cx="68" cy="52" rx="1.8" ry="2.8" />
          <ellipse cx="42" cy="66" rx="1.8" ry="2.8" />
          <ellipse cx="58" cy="66" rx="1.8" ry="2.8" />
        </g>
        <Face y={47} gap={16} mouth="open" mw={4.4} />
      </>
    ),
  },
  {
    id: 'hanabi',
    name: '夏日花火',
    rarity: 'SR',
    theme: '季節',
    note: '花火大会（はなびたいかい）：穿上浴衣去看煙火，是日本夏天最浪漫的活動。',
    draw: () => (
      <>
        <circle cx="50" cy="44" r="40" fill="#241a5a" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          return <path key={i} d={`M${50 + 10 * Math.cos(a)} ${44 + 10 * Math.sin(a)} L${50 + 32 * Math.cos(a)} ${44 + 32 * Math.sin(a)}`} {...line(['#ff7a7a', '#ffd34d', '#7ad8ff', '#c4a8ff'][i % 4], 3)} />;
        })}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          return <circle key={i} cx={50 + 35 * Math.cos(a)} cy={44 + 35 * Math.sin(a)} r="2.6" fill="#fff6b0" />;
        })}
        <circle cx="50" cy="44" r="8" fill="#ffe066" />
        <Face y={43} gap={7} r={1.8} mouth="smile" mw={3} blush={false} />
        <path d="M30 90 C36 80 44 82 50 76 C56 82 64 80 70 90 Z" fill="#3a3f8f" {...line('#22265e', 2)} />
      </>
    ),
  },
  {
    id: 'momiji',
    name: '紅葉',
    rarity: 'N',
    theme: '季節',
    note: '紅葉（もみじ）／단풍：秋天到京都、雪嶽山賞楓，日文叫「紅葉狩り（もみじがり）」。',
    draw: () => (
      <>
        <path d="M50 8 L57 30 L74 18 L68 40 L90 38 L72 54 L84 66 L60 62 L56 80 L50 70 L44 80 L40 62 L16 66 L28 54 L10 38 L32 40 L26 18 L43 30 Z" fill="#ff7043" {...line('#c43d1a')} />
        <path d="M50 70 V92" {...line('#8a4a22', 3.4)} />
        <Face y={46} gap={14} r={3.4} mouth="smile" mw={4.4} />
      </>
    ),
  },
  {
    id: 'tsukimi',
    name: '月見糰子',
    rarity: 'R',
    theme: '季節',
    note: '月見（つきみ）：中秋夜擺上糰子和芒草賞月，韓國的中秋則是秋夕（추석）。',
    draw: () => (
      <>
        <circle cx="74" cy="22" r="16" fill="#fff3a6" {...line('#d9b020', 2.4)} />
        <path d="M18 78 H74 L68 90 H24 Z" fill="#d6a06b" {...line('#8a5a33', 2.6)} />
        <path d="M14 78 H78" {...line('#8a5a33', 3)} />
        {[
          [32, 68],
          [46, 68],
          [60, 68],
          [39, 56],
          [53, 56],
          [46, 44],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="7.6" fill="#ffffff" {...line('#c9c3b5', 2)} />
        ))}
        <Eyes x={46} y={43} gap={6} r={1.6} />
        <path d="M10 76 Q14 46 22 30 M14 76 Q22 52 34 40" fill="none" {...line('#c9b06a', 2)} />
      </>
    ),
  },
  {
    id: 'snowman',
    name: '雪人',
    rarity: 'N',
    theme: '季節',
    note: '雪だるま（ゆきだるま）／눈사람／snowman：日本的雪人只有兩顆球，像不倒翁。',
    draw: () => (
      <>
        <circle cx="50" cy="66" r="24" fill="#ffffff" {...line('#b9c4d6')} />
        <circle cx="50" cy="34" r="17" fill="#ffffff" {...line('#b9c4d6')} />
        <path d="M33 22 H67 L62 14 H38 Z" fill="#ff6b81" {...line('#c43d4e', 2.4)} />
        <path d="M34 46 Q50 54 66 46 L68 52 Q50 60 32 52 Z" fill="#5aa9ff" {...line('#2f6fb3', 2)} />
        <Face y={32} gap={12} r={2.8} mouth="smile" mw={4.4} />
        <path d="M49 37 L58 39 L49 40 Z" fill="#ff8a3d" />
        <circle cx="50" cy="62" r="2.2" fill={INK} />
        <circle cx="50" cy="72" r="2.2" fill={INK} />
      </>
    ),
  },
  {
    id: 'kotatsu',
    name: '暖桌與橘子',
    rarity: 'R',
    theme: '季節',
    note: 'こたつ：冬天在暖桌裡吃橘子（みかん），一坐下就再也不想起來。',
    draw: () => (
      <>
        <path d="M10 56 H90 L84 86 H16 Z" fill="#ff9fbf" {...line('#d9578f')} />
        <path d="M16 62 H84 M18 70 H82" fill="none" {...line('#ffd1e3', 2)} />
        <rect x="6" y="48" width="88" height="10" rx="4" fill="#c98a5b" {...line('#8a5a33', 2.6)} />
        <circle cx="38" cy="38" r="10" fill="#ffa43d" {...line('#d9772a', 2.4)} />
        <circle cx="60" cy="40" r="8" fill="#ffa43d" {...line('#d9772a', 2.4)} />
        <path d="M38 28 L41 25" {...line('#3f9a3a', 2.4)} />
        <Face x={38} y={38} gap={8} r={2} mouth="smile" mw={3} blush={false} />
        <path d="M70 86 C70 76 80 74 84 80 L90 76 L88 86 Z" fill="#ffd3a1" {...line('#c7823f', 2)} />
      </>
    ),
  },
  {
    id: 'xmas',
    name: '聖誕樹',
    rarity: 'N',
    theme: '季節',
    note: 'Merry Christmas！日本的聖誕節要吃炸雞和草莓蛋糕。',
    draw: () => (
      <>
        <path d="M50 10 L72 40 H62 L80 64 H66 L86 88 H14 L34 64 H20 L38 40 H28 Z" fill="#4cc38a" {...line('#2a7a52')} />
        <path d={starPath(50, 12, 9, 4)} fill="#ffd34d" {...line('#c99a2a', 2)} />
        <circle cx="40" cy="56" r="3.2" fill="#ff6b81" />
        <circle cx="62" cy="74" r="3.2" fill="#5aa9ff" />
        <circle cx="34" cy="80" r="3.2" fill="#ffd34d" />
        <Face y={66} gap={14} r={3} mouth="open" mw={4} />
      </>
    ),
  },
  {
    id: 'pumpkin',
    name: '南瓜燈',
    rarity: 'N',
    theme: '季節',
    note: 'Trick or treat! 萬聖節（ハロウィン／핼러윈）的南瓜燈叫 jack-o\'-lantern。',
    draw: () => (
      <>
        <path d="M50 22 C52 14 58 10 62 12" fill="none" {...line('#3f9a3a', 4)} />
        <ellipse cx="34" cy="56" rx="20" ry="28" fill="#ff8a3d" {...line('#c4542a')} />
        <ellipse cx="66" cy="56" rx="20" ry="28" fill="#ff8a3d" {...line('#c4542a')} />
        <ellipse cx="50" cy="56" rx="18" ry="30" fill="#ffa43d" {...line('#c4542a')} />
        <path d="M34 46 L42 40 L44 50 Z M66 46 L58 40 L56 50 Z" fill="#4a2e00" />
        <path d="M32 64 L38 70 L44 64 L50 70 L56 64 L62 70 L68 64 C64 76 36 76 32 64 Z" fill="#4a2e00" />
      </>
    ),
  },
  {
    id: 'tanabata',
    name: '七夕許願',
    rarity: 'R',
    theme: '季節',
    note: '七夕（たなばた）：把願望寫在短冊（たんざく）上綁在竹子上，例如「日本語が上手になりますように」。',
    draw: () => (
      <>
        <path d="M30 92 C34 60 42 30 56 8" fill="none" {...line('#3f8a3a', 4)} />
        {[
          [44, 34, -30],
          [60, 30, 20],
          [52, 52, -20],
          [38, 60, 30],
        ].map(([x, y, r], i) => (
          <path key={i} d={`M${x} ${y} q8 -4 14 0`} fill="none" {...line('#5bb04a', 3)} transform={`rotate(${r} ${x} ${y})`} />
        ))}
        {[
          [62, 40, '#ff9fbf'],
          [46, 58, '#7ad8ff'],
          [66, 64, '#ffe066'],
        ].map(([x, y, c], i) => (
          <g key={i}>
            <path d={`M${x} ${Number(y) - 6} V${y}`} {...line('#8a93b8', 1.2)} />
            <rect x={Number(x) - 5} y={y} width="10" height="24" rx="1.5" fill={c as string} {...line('#8a93b8', 1.4)} />
          </g>
        ))}
        <Sparkle x={84} y={14} s={6} color="#fff6b0" />
        <Sparkle x={20} y={20} s={4} color="#fff6b0" />
      </>
    ),
  },
  {
    id: 'songpyeon',
    name: '松片',
    rarity: 'R',
    theme: '季節',
    note: '송편：韓國秋夕（추석）一家人一起包的半月形年糕，傳說包得漂亮會生出漂亮的女兒。',
    draw: () => (
      <>
        <ellipse cx="50" cy="80" rx="40" ry="9" fill="#d6c3a0" {...line('#8a7a5a', 2.4)} />
        <path d="M14 70 C14 52 30 46 40 52 C40 62 32 70 14 70 Z" fill="#a8e6a1" {...line('#5aa04f', 2.4)} />
        <path d="M32 74 C32 54 52 46 64 54 C62 66 52 74 32 74 Z" fill="#ffffff" {...line('#c9c3b5', 2.4)} />
        <path d="M58 72 C58 54 76 48 86 56 C84 66 76 72 58 72 Z" fill="#ffc8da" {...line('#e88aac', 2.4)} />
        <Face x={48} y={62} gap={8} r={2} mouth="smile" mw={3.4} blush={false} />
        <path d="M26 30 L30 22 M50 26 L50 18 M72 30 L68 22" {...line('#c9b06a', 2.4)} />
      </>
    ),
  },
  {
    id: 'kagami',
    name: '鏡餅',
    rarity: 'SR',
    theme: '季節',
    note: '鏡餅（かがみもち）：新年擺在家裡的兩層年糕，上面放一顆橘子（だいだい），祈求家族代代相傳。',
    draw: () => (
      <>
        <path d="M16 78 H84 L78 92 H22 Z" fill="#c98a5b" {...line('#8a5a33', 2.6)} />
        <path d="M20 72 H80 L76 80 H24 Z" fill="#ff5d5d" {...line('#c43d3d', 2)} />
        <ellipse cx="50" cy="64" rx="32" ry="13" fill="#ffffff" {...line('#c9c3b5')} />
        <ellipse cx="50" cy="46" rx="24" ry="11" fill="#ffffff" {...line('#c9c3b5')} />
        <circle cx="50" cy="28" r="10" fill="#ffa43d" {...line('#d9772a', 2.4)} />
        <path d="M50 18 C54 12 60 14 60 18 C56 20 52 20 50 18 Z" fill="#5bb04a" />
        <Face y={46} gap={12} r={2.6} mouth="smile" mw={4} />
        <Sparkle x={86} y={22} s={6} color="#fff6b0" />
      </>
    ),
  },
  // ───── 台灣 ─────
  {
    id: 'bubbletea',
    name: '珍珠奶茶',
    rarity: 'R',
    theme: '台灣',
    note: '珍珠奶茶：日文叫「タピオカミルクティー」，韓文叫「버블티」，全世界都愛。',
    draw: () => (
      <>
        <path d="M60 4 L52 40" {...line('#ff6b81', 6)} />
        <path d="M24 30 H76 L70 88 C70 92 30 92 30 88 Z" fill="#f3d2a8" fillOpacity="0.95" {...line('#b98c5a')} />
        <path d="M22 26 H78 V34 H22 Z" fill="#ffffff" {...line('#b98c5a', 2.4)} />
        <g fill="#4a3535">
          {[
            [38, 82],
            [48, 84],
            [58, 82],
            [43, 76],
            [54, 76],
            [36, 72],
            [62, 74],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3.6" />
          ))}
        </g>
        <Face y={54} gap={16} mouth="smile" />
      </>
    ),
  },
  {
    id: 'xiaolongbao',
    name: '小籠包',
    rarity: 'N',
    theme: '台灣',
    note: '小籠包：日文「ショーロンポー」、韓文「샤오롱바오」，記得先戳破喝湯再吃喔。',
    draw: () => (
      <>
        <ellipse cx="50" cy="78" rx="42" ry="12" fill="#d6a06b" {...line('#8a5a33')} />
        <path d="M14 76 C14 54 30 42 50 42 C70 42 86 54 86 76 Z" fill="#fff8ee" {...line('#c9b8a0')} />
        <path d="M50 42 C46 34 50 28 50 26 C50 28 54 34 50 42 M38 46 Q44 36 50 34 M62 46 Q56 36 50 34" fill="none" {...line('#c9b8a0', 2)} />
        <Face y={62} gap={16} mouth="cat" mw={4.4} />
        <path d="M30 20 Q34 14 30 8 M50 18 Q54 12 50 6 M70 20 Q74 14 70 8" fill="none" {...line('#cfd5e6', 2.4)} />
      </>
    ),
  },
  {
    id: 'taipei101',
    name: '台北 101',
    rarity: 'SR',
    theme: '台灣',
    note: '台北 101：跨年煙火的主角。日文「タイペイ・イチマルイチ」，英文 Taipei 101。',
    draw: () => (
      <>
        <path d="M49 2 V14" {...line('#8a93b8', 2)} />
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M${38 + i * 0.5} ${16 + i * 11} H${62 - i * 0.5} L${66 - i * 0.2} ${27 + i * 11} H${34 + i * 0.2} Z`} fill={i % 2 ? '#7ccfb0' : '#93dcc0'} {...line('#3f8a7a', 2)} />
        ))}
        <path d="M30 82 H70 L72 92 H28 Z" fill="#7ccfb0" {...line('#3f8a7a', 2.4)} />
        <Face y={48} gap={10} r={2.6} mouth="smile" mw={3.6} blush={false} />
        <Sparkle x={16} y={20} s={6} color="#ffe066" />
        <Sparkle x={84} y={30} s={5} color="#ff9fbf" />
      </>
    ),
  },
  {
    id: 'pineapplecake',
    name: '鳳梨酥',
    rarity: 'N',
    theme: '台灣',
    note: '鳳梨酥：台灣人送日本、韓國朋友的必備伴手禮（お土産／선물）。',
    draw: () => (
      <>
        <rect x="16" y="32" width="68" height="46" rx="8" fill="#f2c26b" {...line('#c98a1a')} />
        <path d="M22 40 H78 M22 70 H78" {...line('#e0a945', 2)} />
        <path d="M60 28 C64 18 74 18 76 26 C70 24 66 26 64 30 Z" fill="#5bb04a" {...line('#2f7a2a', 2)} />
        <Face y={54} gap={18} mouth="smile" />
      </>
    ),
  },
  {
    id: 'chickenfillet',
    name: '大雞排',
    rarity: 'N',
    theme: '台灣',
    note: '雞排：夜市的國民美食，比臉還大！要辣嗎？',
    draw: () => (
      <>
        <path d="M22 26 C34 10 70 12 80 28 C92 46 86 72 70 82 C54 92 30 88 20 72 C10 56 12 38 22 26 Z" fill="#e8a24d" {...line('#a8641a')} />
        <g fill="#c98030">
          <circle cx="34" cy="38" r="2.4" />
          <circle cx="64" cy="34" r="2.4" />
          <circle cx="72" cy="58" r="2.4" />
          <circle cx="30" cy="66" r="2.4" />
        </g>
        <path d="M26 74 H74 L70 92 H30 Z" fill="#ffffff" {...line('#b9b9c9', 2.4)} />
        <Face y={52} gap={18} mouth="open" mw={5} />
      </>
    ),
  },
  {
    id: 'skylantern',
    name: '平溪天燈',
    rarity: 'SSR',
    theme: '台灣',
    note: '天燈：在平溪把願望寫在天燈上放飛。日文「ランタン」、韓文「풍등」。祝你考試順利！',
    draw: () => (
      <>
        <circle cx="50" cy="44" r="40" fill="#ffd34d" opacity="0.18" />
        <path d="M26 20 C26 14 74 14 74 20 L68 74 H32 Z" fill="#ffefb0" {...line('#e0a525')} />
        <path d="M30 34 C42 30 58 30 70 34" fill="none" {...line('#ffd34d', 2)} />
        <text x="50" y="58" textAnchor="middle" fontSize="13" fontWeight="900" fill="#e8445a">
          合格
        </text>
        <path d="M36 74 L40 84 H60 L64 74" fill="#ffffff" {...line('#e0a525', 2)} />
        <path d="M46 84 C44 90 48 94 50 96 C52 94 56 90 54 84 Z" fill="#ff8a3d" />
        <Eyes y={44} gap={14} r={2.8} />
        <Sparkle x={12} y={20} s={6} color="#fff6b0" />
        <Sparkle x={88} y={64} s={5} color="#fff6b0" />
        <Sparkle x={84} y={12} s={4} color="#fff6b0" />
      </>
    ),
  },
  {
    id: 'nightmarket',
    name: '夜市',
    rarity: 'R',
    theme: '台灣',
    note: '夜市（ナイトマーケット／야시장）：士林、饒河、逢甲……邊吃邊逛最開心。',
    draw: () => (
      <>
        <path d="M8 34 L50 14 L92 34 Z" fill="#ff6b81" {...line('#c43d4e')} />
        <path d="M8 34 H92 V40 H8 Z" fill="#ffffff" {...line('#c43d4e', 2)} />
        <rect x="16" y="40" width="68" height="44" fill="#ffe2bd" {...line('#c7823f')} />
        <rect x="24" y="60" width="52" height="24" fill="#c98a5b" {...line('#8a5a33', 2.4)} />
        {[22, 40, 60, 78].map((x, i) => (
          <circle key={x} cx={x} cy="46" r="4.6" fill={['#ffd34d', '#ff9fbf', '#7ad8ff', '#a8e6a1'][i]} {...line('#c99a2a', 1.4)} />
        ))}
        <Face y={70} gap={14} r={2.8} mouth="open" mw={4} blush={false} />
      </>
    ),
  },
  {
    id: 'mangoice',
    name: '芒果冰',
    rarity: 'R',
    theme: '台灣',
    note: '芒果冰：夏天最幸福的甜點。日文「マンゴーかき氷」，韓文「망고빙수」。',
    draw: () => (
      <>
        <path d="M14 58 H86 L74 86 H26 Z" fill="#e8f6ff" {...line('#8fb6d9')} />
        <path d="M16 58 C16 36 32 26 50 26 C68 26 84 36 84 58 Z" fill="#ffffff" {...line('#c9d2ea')} />
        {[
          [32, 42],
          [46, 34],
          [60, 40],
          [40, 52],
          [56, 52],
          [70, 50],
        ].map(([x, y], i) => (
          <rect key={i} x={x - 6} y={y - 6} width="12" height="12" rx="3" fill={i % 2 ? '#ffb347' : '#ffc94d'} {...line('#d9772a', 1.6)} />
        ))}
        <path d="M30 30 C40 36 60 36 70 30" fill="none" {...line('#ffe680', 3)} />
        <Face y={70} gap={14} r={3} mouth="smile" mw={4} />
      </>
    ),
  },
  // ───── 傳說 ─────
  {
    id: 'goldcat',
    name: '金色喵師父',
    rarity: 'SSR',
    theme: '傳說',
    note: '傳說摸到金色喵師父的人，考試都會過。',
    draw: () => (
      <>
        <MascotBody gold />
        <Sparkle x={12} y={14} s={7} color="#fff6b0" />
        <Sparkle x={90} y={78} s={5} color="#fff6b0" />
      </>
    ),
  },
  {
    id: 'globe',
    name: '三語地球',
    rarity: 'SSR',
    theme: '傳說',
    note: '會三種語言，世界就大了三倍。',
    draw: () => (
      <>
        <circle cx="50" cy="52" r="34" fill="#74bfff" {...line('#3a7fd0')} />
        <path d="M29 30 C37 26 44 34 40 41 C36 47 25 44 23 38 Z" fill="#8fdc6b" />
        <path d="M58 67 C66 61 77 65 75 73 C71 81 60 79 58 67 Z" fill="#8fdc6b" />
        <path d="M62 25 C70 27 75 35 69 38 C63 36 60 30 62 25 Z" fill="#8fdc6b" />
        <Face y={51} gap={17} mouth="open" mw={5} />
        <ellipse cx="50" cy="52" rx="47" ry="12" transform="rotate(-16 50 52)" fill="none" stroke="#ffd34d" strokeWidth="3" />
        {[
          ['A', 8, 62],
          ['あ', 50, 40],
          ['가', 92, 42],
        ].map(([t, x, y]) => (
          <g key={t}>
            <circle cx={x} cy={y} r="8" fill="#ffffff" {...line('#c99a2a', 2)} />
            <text x={x} y={Number(y) + 3.8} textAnchor="middle" fontSize="10" fontWeight="900" fill="#4a3535">
              {t}
            </text>
          </g>
        ))}
      </>
    ),
  },
];

export const STICKER_BY_ID = new Map(STICKERS.map((s) => [s.id, s]));

/** 貼紙插畫：dim 為 true 時是還沒收集到的剪影 */
export function StickerArt({ id, size = 72, dim }: { id: string; size?: number | string; dim?: boolean }) {
  const st = STICKER_BY_ID.get(id);
  if (!st) return null;
  return (
    <Art size={size} sticker={!dim} dim={dim} title={dim ? '尚未收集' : st.name}>
      {st.draw()}
    </Art>
  );
}
