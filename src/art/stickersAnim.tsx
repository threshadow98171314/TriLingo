// 動態貼紙：只會從「動態貼紙扭蛋機」（和外觀扭蛋機的安慰獎）抽到。
// 會動的部分加上 sa-* class，動畫寫在 shop.css；系統要求減少動態效果時一律不動。
import type { CSSProperties } from 'react';
import { Blush, Eyes, Face, INK, line, Mouth, Sparkle, starPath } from './kit';
import type { Sticker } from './stickers';

const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

/** 小愛心（中心 x、y，大小 r） */
const heart = (x: number, y: number, r = 5) =>
  `M${x} ${y + r} C${x - r * 1.3} ${y} ${x - r * 1.2} ${y - r} ${x - r * 0.6} ${y - r} C${x - r * 0.3} ${y - r} ${x} ${y - r * 0.7} ${x} ${y - r * 0.4} C${x} ${y - r * 0.7} ${x + r * 0.3} ${y - r} ${x + r * 0.6} ${y - r} C${x + r * 1.2} ${y - r} ${x + r * 1.3} ${y} ${x} ${y + r} Z`;

const RAINBOW = ['#ff6b6b', '#ffa94d', '#ffe066', '#69db7c', '#4dabf7', '#9775fa'];

export const ANIM_STICKERS: Sticker[] = [
  {
    id: 'a_wave',
    name: '揮手喵',
    rarity: 'R',
    theme: '動態',
    anim: true,
    note: '「やあ！」「안녕！」「Hi!」喵師父的弟子跟你打招呼。',
    draw: () => (
      <>
        <g className="sa-bob">
          <path d="M28 32 L30 10 L45 25 Z M72 32 L70 10 L55 25 Z" fill="#ffc58a" {...line('#c98a4a')} />
          <ellipse cx="48" cy="77" rx="25" ry="17" fill="#ffc58a" {...line('#c98a4a')} />
          <circle cx="48" cy="45" r="25" fill="#ffc58a" {...line('#c98a4a')} />
          <path d="M40 23 L44 31 M48 21 V30 M56 23 L52 31" {...line('#e0a060', 2.4)} />
          <Face x={48} y={47} gap={17} mouth="cat" />
        </g>
        <g className="sa-wave">
          <path d="M72 78 C79 68 82 58 80 46" fill="none" {...line('#c98a4a', 11)} />
          <path d="M72 78 C79 68 82 58 80 46" fill="none" {...line('#ffc58a', 6.5)} />
          <circle cx="80" cy="41" r="8.5" fill="#ffc58a" {...line('#c98a4a', 2.4)} />
          <circle cx="80" cy="42.5" r="3" fill="#ff9fb5" />
        </g>
      </>
    ),
  },
  {
    id: 'a_ramen',
    name: '熱騰騰拉麵',
    rarity: 'R',
    theme: '動態',
    anim: true,
    note: 'いただきます！日本人吃麵會發出聲音（すする），表示很好吃。',
    fx: () => (
      <>
        {[30, 50, 70].map((x, i) => (
          <path key={x} className="sa-steam" style={delay(i * 0.6)} d={`M${x} 34 C${x - 6} 28 ${x + 6} 22 ${x} 12`} fill="none" {...line('#b9c3dd', 3)} />
        ))}
      </>
    ),
    draw: () => (
      <>
        <path d="M60 42 L84 8 M66 44 L90 12" {...line('#c99a5b', 3.2)} />
        <path d="M10 48 H90 C90 72 72 88 50 88 C28 88 10 72 10 48 Z" fill="#ff8a5c" {...line('#c9542a')} />
        <ellipse cx="50" cy="48" rx="40" ry="8" fill="#ffd59a" {...line('#c9542a', 2)} />
        <path d="M22 48 C26 44 30 52 34 48 C38 44 42 52 46 48" fill="none" {...line('#f5e08a', 2.4)} />
        <circle cx="66" cy="47" r="6" fill="#ffffff" {...line('#ff8fb0', 1.6)} />
        <path d="M66 47 m-2.4 0 a2.4 2.4 0 1 0 2.4 -2.4" fill="none" {...line('#ff8fb0', 1.4)} />
        <Face y={68} gap={18} r={3.2} mouth="open" mw={4} />
      </>
    ),
  },
  {
    id: 'a_shiba',
    name: '眨眼柴犬',
    rarity: 'R',
    theme: '動態',
    anim: true,
    note: '柴犬（しばいぬ）會歪頭看你。韓文叫「시바견」。',
    draw: () => (
      <g className="sa-tilt">
        <path d="M20 42 L25 12 L44 28 Z M80 42 L75 12 L56 28 Z" fill="#e8a25a" {...line('#a8672e')} />
        <path d="M26 34 L28 19 L38 28 Z M74 34 L72 19 L62 28 Z" fill="#ffc9a8" />
        <ellipse cx="50" cy="55" rx="33" ry="29" fill="#e8a25a" {...line('#a8672e')} />
        <path d="M22 58 C24 82 76 82 78 58 C70 66 58 67 50 61 C42 67 30 66 22 58 Z" fill="#fff6e8" />
        <ellipse cx="39" cy="42" rx="4" ry="2.6" fill="#fff6e8" />
        <ellipse cx="61" cy="42" rx="4" ry="2.6" fill="#fff6e8" />
        <g className="sa-blink">
          <Eyes y={52} gap={22} r={4} />
        </g>
        <ellipse cx="50" cy="63" rx="4.6" ry="3.2" fill={INK} />
        <Mouth y={66} kind="cat" w={4.5} />
        <Blush y={64} gap={42} />
      </g>
    ),
  },
  {
    id: 'a_heart',
    name: '噗通愛心',
    rarity: 'R',
    theme: '動態',
    anim: true,
    note: 'ドキドキ／두근두근／thump-thump：心跳的聲音。',
    fx: () => (
      <>
        {[
          [14, 16, 0],
          [86, 20, 0.6],
          [88, 70, 1.2],
        ].map(([x, y, d]) => (
          <path key={x} className="sa-pop" style={delay(d)} d={heart(x, y, 6)} fill="#ff9fb5" {...line('#d93a5e', 1.6)} />
        ))}
      </>
    ),
    draw: () => (
      <>
        <g className="sa-pulse">
          <path d={heart(50, 52, 34)} fill="#ff6b8b" {...line('#d93a5e')} />
          <path d="M26 38 C26 31 30 26 36 25" fill="none" {...line('#ffc2d0', 3.4)} />
          <Face y={48} gap={18} mouth="open" />
        </g>
      </>
    ),
  },
  {
    id: 'a_star',
    name: '搖擺星星',
    rarity: 'R',
    theme: '動態',
    anim: true,
    note: 'twinkle, twinkle, little star：英文童謠「小星星」。',
    fx: () => (
      <>
        <g className="sa-twinkle">
          <Sparkle x={12} y={18} s={7} color="#ffd34d" />
        </g>
        <g className="sa-twinkle" style={delay(0.7)}>
          <Sparkle x={88} y={84} s={6} color="#ffe680" />
        </g>
      </>
    ),
    draw: () => (
      <>
        <g className="sa-waddle">
          <path d={starPath(50, 54, 42)} fill="#ffd34d" {...line('#e0a010')} />
          <Face y={56} gap={16} mouth="open" />
        </g>
      </>
    ),
  },
  {
    id: 'a_ghost',
    name: '飄飄幽靈',
    rarity: 'R',
    theme: '動態',
    anim: true,
    note: 'おばけ／유령／ghost：日本的鬼故事叫「怪談（かいだん）」。',
    fx: () => (
      <>
        <ellipse className="sa-glow" cx="50" cy="97" rx="18" ry="3.2" fill="#000000" opacity="0.15" />
      </>
    ),
    draw: () => (
      <>
        <g className="sa-float">
          <path d="M22 50 C22 24 36 12 50 12 C64 12 78 24 78 50 V84 C74 90 70 82 64 88 C58 94 56 84 50 90 C44 84 40 94 34 88 C28 82 26 90 22 84 Z" fill="#ffffff" {...line('#b9c0d6')} />
          <path d="M22 58 C14 56 11 50 14 44 M78 58 C86 56 89 50 86 44" fill="none" {...line('#b9c0d6', 3)} />
          <Face y={46} gap={16} mouth="o" mw={6} />
        </g>
      </>
    ),
  },
  {
    id: 'a_penguin',
    name: '搖擺企鵝',
    rarity: 'R',
    theme: '動態',
    anim: true,
    note: 'ペンギン／펭귄／penguin：韓國超人氣的企鵝 YouTuber「펭수」。',
    draw: () => (
      <g className="sa-waddle">
        <ellipse cx="38" cy="91" rx="9" ry="4" fill="#ffb347" {...line('#d9772a', 1.6)} />
        <ellipse cx="62" cy="91" rx="9" ry="4" fill="#ffb347" {...line('#d9772a', 1.6)} />
        <path d="M22 54 C12 62 12 72 19 76 M78 54 C88 62 88 72 81 76" fill="#3b4a6b" {...line('#24304a', 2.4)} />
        <ellipse cx="50" cy="56" rx="30" ry="34" fill="#3b4a6b" {...line('#24304a')} />
        <ellipse cx="50" cy="66" rx="20" ry="22" fill="#ffffff" />
        <ellipse cx="50" cy="44" rx="20" ry="15" fill="#ffffff" />
        <Eyes y={42} gap={16} r={3.6} />
        <Blush y={50} gap={30} />
        <path d="M45 49 L55 49 L50 55 Z" fill="#ffb347" {...line('#d9772a', 1.4)} />
        <path d="M28 62 C40 68 60 68 72 62 L72 68 C60 74 40 74 28 68 Z" fill="#ff6b6b" {...line('#c43a3a', 1.6)} />
      </g>
    ),
  },
  {
    id: 'a_goldfish',
    name: '金魚',
    rarity: 'R',
    theme: '動態',
    anim: true,
    note: '金魚すくい：日本夏日祭典的撈金魚遊戲，紙網破了就結束。',
    fx: () => (
      <>
        {[
          [16, 44, 0],
          [22, 30, 0.8],
          [12, 20, 1.6],
        ].map(([x, y, d]) => (
          <circle key={y} className="sa-rise" style={delay(d)} cx={x} cy={y} r="4" fill="#f0f9ff" {...line('#8fd0ff', 1.6)} />
        ))}
      </>
    ),
    draw: () => (
      <>
        <g className="sa-swim">
          <path d="M70 54 C82 36 96 40 92 54 C96 68 82 72 70 54 Z" fill="#ff8a3d" {...line('#d9531a')} />
          <path d="M40 33 C46 22 58 24 60 34" fill="#ff8a3d" {...line('#d9531a', 2)} />
          <ellipse cx="46" cy="54" rx="28" ry="22" fill="#ff8a3d" {...line('#d9531a')} />
          <ellipse cx="44" cy="63" rx="16" ry="7" fill="#ffc08a" />
          <Face x={34} y={51} gap={12} r={3.4} mouth="o" mw={5} />
        </g>
      </>
    ),
  },
  {
    id: 'a_chick',
    name: '啾啾小雞',
    rarity: 'R',
    theme: '動態',
    anim: true,
    note: 'ぴよぴよ／삐약삐약／cheep cheep：小雞的叫聲，三種語言都不一樣。',
    draw: () => (
      <>
        <ellipse cx="50" cy="94" rx="20" ry="3.4" fill="#000000" opacity="0.12" />
        <g className="sa-hop">
          <path d="M42 84 V90 M58 84 V90" {...line('#ff9a3d', 3)} />
          <circle cx="50" cy="58" r="30" fill="#ffe066" {...line('#e0b020')} />
          <path d="M46 29 C42 20 50 16 52 24 C54 18 61 20 56 29" fill="#ffe066" {...line('#e0b020', 2)} />
          <path d="M24 62 C16 58 16 70 26 73" fill="#ffd23a" {...line('#e0b020', 2)} />
          <path d="M76 62 C84 58 84 70 74 73" fill="#ffd23a" {...line('#e0b020', 2)} />
          <Eyes y={52} gap={18} />
          <Blush y={60} gap={32} />
          <path d="M45 59 L55 59 L50 65 Z" fill="#ff9a3d" {...line('#d9772a', 1.4)} />
        </g>
      </>
    ),
  },
  {
    id: 'a_cake',
    name: '生日蛋糕',
    rarity: 'SR',
    theme: '動態',
    anim: true,
    note: 'お誕生日おめでとう！／생일 축하해！／Happy birthday!',
    draw: () => (
      <>
        <ellipse cx="50" cy="88" rx="40" ry="6" fill="#e6e9f5" {...line('#b9c0d6', 2)} />
        <rect x="16" y="58" width="68" height="28" rx="6" fill="#ffd9e6" {...line('#e07ea6')} />
        <path d="M16 62 C16 54 84 54 84 62 C80 68 76 62 72 68 C68 62 64 70 58 66 C54 72 48 64 44 68 C40 62 34 70 30 66 C26 70 22 62 16 66 Z" fill="#ffffff" {...line('#e0c9d6', 1.6)} />
        {[
          [34, '#6ab8ff'],
          [50, '#ffd34d'],
          [66, '#8fdc6b'],
        ].map(([x, c], i) => (
          <g key={x}>
            <rect x={Number(x) - 3} y="38" width="6" height="18" rx="2" fill={String(c)} {...line('#ffffff', 1.4)} />
            <g className="sa-flame" style={delay(i * 0.12)}>
              <path d={`M${x} 24 C${Number(x) - 5} 30 ${Number(x) - 4} 37 ${x} 37 C${Number(x) + 4} 37 ${Number(x) + 5} 30 ${x} 24 Z`} fill="#ffb347" />
              <path d={`M${x} 29 C${Number(x) - 2} 32 ${Number(x) - 2} 35 ${x} 35 C${Number(x) + 2} 35 ${Number(x) + 2} 32 ${x} 29 Z`} fill="#fff3b0" />
            </g>
          </g>
        ))}
        <Face y={74} gap={18} r={3.2} mouth="open" mw={4} />
      </>
    ),
  },
  {
    id: 'a_rocket',
    name: '火箭發射',
    rarity: 'SR',
    theme: '動態',
    anim: true,
    note: '3、2、1，發射！日文「発射（はっしゃ）」，韓文「발사」，英文 “Lift off!”',
    fx: () => (
      <>
        <g className="sa-twinkle">
          <Sparkle x={14} y={22} s={6} color="#ffd34d" />
        </g>
        <g className="sa-twinkle" style={delay(0.6)}>
          <Sparkle x={86} y={36} s={5} color="#c4a8ff" />
        </g>
      </>
    ),
    draw: () => (
      <>
        <g className="sa-flame">
          <path d="M39 74 C39 86 45 93 50 99 C55 93 61 86 61 74 Z" fill="#ff9a3d" />
          <path d="M44 74 C44 82 47 87 50 91 C53 87 56 82 56 74 Z" fill="#ffe066" />
        </g>
        <g className="sa-shake">
          <path d="M35 58 L20 78 L37 74 Z M65 58 L80 78 L63 74 Z" fill="#ff6b6b" {...line('#c43a3a', 2)} />
          <path d="M50 6 C67 20 69 50 65 74 H35 C31 50 33 20 50 6 Z" fill="#ffffff" {...line('#9aa6c4')} />
          <path d="M50 6 C58 12 62 18 63.5 25 H36.5 C38 18 42 12 50 6 Z" fill="#ff6b6b" />
          <circle cx="50" cy="42" r="11" fill="#8fd0ff" {...line('#4a6aa8', 2.4)} />
          <Eyes y={41} gap={8} r={2.2} />
          <Mouth y={45} kind="smile" w={4} />
        </g>
      </>
    ),
  },
  {
    id: 'a_ufo',
    name: '幽浮',
    rarity: 'SR',
    theme: '動態',
    anim: true,
    note: 'UFO（ユーフォー）：外星人也在學三種語言嗎？',
    fx: () => (
      <>
        <path className="sa-glow" d="M38 56 L20 96 H80 L62 56 Z" fill="#c8ffb0" opacity="0.6" />
      </>
    ),
    draw: () => (
      <>
        <g className="sa-float">
          <path d="M27 44 C27 14 73 14 73 44 Z" fill="#dff3ff" {...line('#4a9ad9')} />
          <path d="M44 20 L40 12 M56 20 L60 12" {...line('#5aa83a', 2)} />
          <circle cx="40" cy="11" r="2.6" fill="#9be37a" />
          <circle cx="60" cy="11" r="2.6" fill="#9be37a" />
          <ellipse cx="50" cy="33" rx="14" ry="13" fill="#9be37a" {...line('#5aa83a', 2)} />
          <Face y={31} gap={11} r={2.8} mouth="smile" mw={3.6} />
          <ellipse cx="50" cy="48" rx="41" ry="12" fill="#c9cfdc" {...line('#7a84a0')} />
          {[22, 36, 50, 64, 78].map((x, i) => (
            <circle key={x} className="sa-twinkle" style={delay(i * 0.25)} cx={x} cy={50} r="3.4" fill={['#ff6b6b', '#ffe066', '#69db7c', '#4dabf7', '#9775fa'][i]} />
          ))}
        </g>
      </>
    ),
  },
  {
    id: 'a_takoyaki',
    name: '章魚燒',
    rarity: 'SR',
    theme: '動態',
    anim: true,
    note: 'たこ焼き：大阪的名物，上面的柴魚片（かつおぶし）遇熱會跳舞。',
    draw: () => (
      <>
        <path d="M70 52 L88 24" {...line('#c99a5b', 2.4)} />
        <path d="M8 62 H92 L84 86 H16 Z" fill="#f2d3a0" {...line('#c99a5b')} />
        {[
          [28, 58],
          [72, 58],
          [50, 54],
        ].map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r="15" fill="#e8a24a" {...line('#a8672e')} />
            <path d={`M${x - 12} ${y - 4} C${x - 6} ${y - 14} ${x + 6} ${y - 14} ${x + 12} ${y - 4} C${x + 4} ${y - 1} ${x - 4} ${y - 1} ${x - 12} ${y - 4} Z`} fill="#6a3a1a" />
            <path d={`M${x - 9} ${y - 8} L${x - 5} ${y - 4} L${x - 1} ${y - 9} L${x + 3} ${y - 4} L${x + 7} ${y - 8}`} fill="none" {...line('#ffffff', 1.6)} />
          </g>
        ))}
        <Face x={50} y={58} gap={10} r={2.6} mouth="cat" mw={3} />
        {[
          [26, 40, 0],
          [44, 34, 0.15],
          [58, 36, 0.3],
          [74, 40, 0.1],
        ].map(([x, y, d]) => (
          <path key={x} className="sa-dance" style={delay(d)} d={`M${x} ${y} C${x - 3} ${y - 5} ${x + 3} ${y - 8} ${x} ${y - 13}`} fill="none" {...line('#e0a58a', 3.4)} />
        ))}
      </>
    ),
  },
  {
    id: 'a_fingerheart',
    name: '比心',
    rarity: 'SR',
    theme: '動態',
    anim: true,
    note: '손가락 하트：韓國偶像最愛的手指愛心，拇指和食指交叉就完成了。',
    fx: () => (
      <>
        {[
          [80, 28, 0],
          [84, 52, 0.6],
          [18, 34, 1.2],
        ].map(([x, y, d]) => (
          <path key={x} className="sa-pop" style={delay(d)} d={heart(x, y, 5)} fill="#ff9fb5" {...line('#d93a5e', 1.4)} />
        ))}
      </>
    ),
    draw: () => (
      <>
        <rect x="28" y="52" width="38" height="34" rx="13" fill="#ffd9b8" {...line('#d9a27a')} />
        <path d="M34 64 H60 M34 72 H60 M36 80 H58" {...line('#e8b48e', 2)} />
        <path d="M46 54 C43 42 45 32 52 29 C57 31 57 42 55 54" fill="#ffd9b8" {...line('#d9a27a')} />
        <path d="M36 54 C40 42 52 34 61 37 C63 41 57 47 49 54" fill="#ffd9b8" {...line('#d9a27a')} />
        <g className="sa-pulse">
          <path d={heart(56, 18, 11)} fill="#ff6b8b" {...line('#d93a5e', 2)} />
          <Eyes x={56} y={17} gap={7} r={1.8} />
        </g>
      </>
    ),
  },
  {
    id: 'a_furin',
    name: '叮噹風鈴',
    rarity: 'SR',
    theme: '動態',
    anim: true,
    note: '風鈴（ふうりん）：風一吹就「チリンチリン」響，聽起來就涼快。',
    draw: () => (
      <>
        <path d="M50 0 V13" {...line('#9aa6c4', 2)} />
        <g className="sa-swing">
          <path d="M28 44 C28 20 72 20 72 44 Z" fill="#dff3ff" {...line('#7aa6d9')} />
          <path d="M34 40 C38 36 42 38 44 34 M58 34 C60 38 64 36 66 40" fill="none" {...line('#ff6b6b', 2.4)} />
          <path d="M26 44 H74" {...line('#7aa6d9', 3)} />
          <path d="M50 44 V60" {...line('#9aa6c4', 1.6)} />
          <Face y={33} gap={14} r={2.8} mouth="smile" mw={3.6} />
          <g className="sa-swing" style={delay(0.35)}>
            <rect x="42" y="60" width="16" height="30" rx="2" fill="#ff8fb0" {...line('#d9578f', 2)} />
            <text x="50" y="80" textAnchor="middle" fontSize="11" fontWeight="900" fill="#ffffff">
              涼
            </text>
          </g>
        </g>
      </>
    ),
  },
  {
    id: 'a_mochi',
    name: '月兔搗麻糬',
    rarity: 'SR',
    theme: '動態',
    anim: true,
    note: '日本、韓國都說月亮上的兔子在搗麻糬（餅つき／떡방아），中秋節賞月吃月見糰子、松片。',
    draw: () => (
      <>
        <circle cx="50" cy="48" r="45" fill="#fff3b0" {...line('#e0c060')} />
        <path d="M30 80 H72 L67 94 H35 Z" fill="#a8723a" {...line('#7a4f22')} />
        <ellipse cx="51" cy="79" rx="18" ry="6" fill="#ffffff" {...line('#d9d2c0', 1.6)} />
        <ellipse cx="22" cy="26" rx="4.5" ry="12" fill="#ffffff" {...line('#c3c3d3', 2)} transform="rotate(-12 22 26)" />
        <ellipse cx="33" cy="25" rx="4.5" ry="12" fill="#ffffff" {...line('#c3c3d3', 2)} transform="rotate(10 33 25)" />
        <ellipse cx="28" cy="68" rx="13" ry="15" fill="#ffffff" {...line('#c3c3d3')} />
        <circle cx="28" cy="46" r="13" fill="#ffffff" {...line('#c3c3d3')} />
        <Face x={28} y={46} gap={8} r={2.2} mouth="cat" mw={2.4} />
        <g className="sa-pound">
          <path d="M36 60 L56 72" {...line('#a8723a', 4)} />
          <rect x="50" y="64" width="18" height="13" rx="3" fill="#c98a4a" {...line('#7a4f22', 2)} transform="rotate(30 59 70)" />
        </g>
        <circle cx="37" cy="60" r="4" fill="#ffffff" {...line('#c3c3d3', 2)} />
      </>
    ),
  },
  {
    id: 'a_lantern',
    name: '天燈升空',
    rarity: 'SSR',
    theme: '動態',
    anim: true,
    note: '在平溪寫下願望放天燈。祝你考試合格！日文「合格祈願」，韓文「합격 기원」。',
    draw: () => (
      <>
        <circle cx="50" cy="50" r="45" fill="#262c66" {...line('#1a1f4b')} />
        {[
          [20, 24, 0],
          [80, 20, 0.5],
          [18, 70, 1],
          [84, 66, 0.3],
        ].map(([x, y, d]) => (
          <g key={x} className="sa-twinkle" style={delay(d)}>
            <Sparkle x={x} y={y} s={4} color="#fff6b0" />
          </g>
        ))}
        <g className="sa-float">
          <circle className="sa-glow" cx="50" cy="50" r="27" fill="#ffb347" opacity="0.35" />
          <path d="M31 28 H69 L62 72 H38 Z" fill="#ffd86b" {...line('#e0902a')} />
          <text x="50" y="47" textAnchor="middle" fontSize="11" fontWeight="900" fill="#d94a3a">
            合格
          </text>
          <Face y={57} gap={12} r={2.4} mouth="smile" mw={3.4} />
          <g className="sa-flame">
            <path d="M45 73 C45 80 50 83 50 83 C50 83 55 80 55 73 Z" fill="#ff7a3d" />
          </g>
        </g>
      </>
    ),
  },
  {
    id: 'a_dragon',
    name: '小龍寶寶',
    rarity: 'SSR',
    theme: '動態',
    anim: true,
    note: 'ドラゴン／용／dragon：日文、韓文的「龍」也都寫作漢字「竜・龍」與「용（龍）」。',
    fx: () => (
      <>
        {[
          [78, 30, 0],
          [86, 20, 0.5],
        ].map(([x, y, d]) => (
          <circle key={x} className="sa-pop" style={delay(d)} cx={x} cy={y} r="4.5" fill="#ffb347" {...line('#e06a1a', 1.4)} />
        ))}
      </>
    ),
    draw: () => (
      <>
        <g className="sa-flap-l">
          <path d="M28 52 C14 40 6 46 8 58 C14 56 18 62 24 60 Z" fill="#a9e89a" {...line('#3f9a3a', 2.4)} />
        </g>
        <g className="sa-flap-r">
          <path d="M72 52 C86 40 94 46 92 58 C86 56 82 62 76 60 Z" fill="#a9e89a" {...line('#3f9a3a', 2.4)} />
        </g>
        <g className="sa-bob">
          <path d="M38 22 L36 10 L44 18 Z M62 22 L64 10 L56 18 Z" fill="#fff3b0" {...line('#c99a10', 2)} />
          <ellipse cx="50" cy="58" rx="27" ry="30" fill="#7ed37a" {...line('#3f9a3a')} />
          <ellipse cx="50" cy="68" rx="15" ry="16" fill="#f5f0b0" />
          <path d="M40 62 H60 M39 69 H61 M41 76 H59" {...line('#d9cf7a', 1.8)} />
          <Face y={46} gap={16} mouth="open" />
        </g>
      </>
    ),
  },
  {
    id: 'a_rainbowcat',
    name: '彩虹喵',
    rarity: 'SSR',
    theme: '動態',
    anim: true,
    note: '拖著彩虹在宇宙裡飛的貓，學到停不下來！',
    draw: () => (
      <>
        <circle cx="50" cy="50" r="45" fill="#1f2a5c" {...line('#141c42')} />
        <g className="sa-slide">
          {RAINBOW.map((c, i) => (
            <path key={c} d={`M4 ${38 + i * 4.5} H16 V${40 + i * 4.5} H28 V${38 + i * 4.5} H40`} fill="none" stroke={c} strokeWidth="4.6" />
          ))}
        </g>
        <g className="sa-bob">
          <rect x="38" y="34" width="36" height="32" rx="6" fill="#ffd9a0" {...line('#c98a4a', 2.4)} />
          <rect x="42" y="38" width="28" height="24" rx="4" fill="#ff9fd0" />
          {[
            [48, 44],
            [60, 42],
            [54, 52],
            [64, 56],
            [46, 56],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#d9306a" />
          ))}
          <path d="M70 40 L72 30 L78 38 Z M84 40 L86 30 L90 40 Z" fill="#9aa0b4" {...line('#5a6078', 2)} />
          <circle cx="80" cy="50" r="12" fill="#9aa0b4" {...line('#5a6078', 2.4)} />
          <Face x={80} y={50} gap={9} r={2.2} mouth="cat" mw={2.6} />
          <path d="M42 66 V72 M52 66 V72 M62 66 V72 M70 66 V72" {...line('#5a6078', 3)} />
        </g>
        <g className="sa-twinkle">
          <Sparkle x={24} y={22} s={4} color="#ffffff" />
        </g>
        <g className="sa-twinkle" style={delay(0.7)}>
          <Sparkle x={70} y={82} s={4} color="#ffffff" />
        </g>
      </>
    ),
  },
  {
    id: 'a_luckycat',
    name: '招財金貓',
    rarity: 'SSR',
    theme: '動態',
    anim: true,
    note: '招き猫：舉右手招財、舉左手招客。這隻金色的兩樣都招！',
    fx: () => (
      <>
        <g className="sa-twinkle">
          <Sparkle x={12} y={20} s={7} color="#fff6b0" />
        </g>
        <g className="sa-twinkle" style={delay(0.5)}>
          <Sparkle x={90} y={86} s={6} color="#fff6b0" />
        </g>
      </>
    ),
    draw: () => (
      <>
        <path d="M26 30 L28 10 L42 22 Z M66 30 L64 10 L50 22 Z" fill="#ffd34d" {...line('#c99a10')} />
        <ellipse cx="46" cy="74" rx="27" ry="20" fill="#ffd34d" {...line('#c99a10')} />
        <circle cx="46" cy="43" r="25" fill="#ffd34d" {...line('#c99a10')} />
        <path d="M26 60 C38 66 54 66 66 60" fill="none" {...line('#e0453a', 4)} />
        <circle cx="46" cy="65" r="4" fill="#ffe680" {...line('#c99a10', 1.6)} />
        <ellipse cx="32" cy="80" rx="11" ry="9" fill="#ffe680" {...line('#c99a10', 2)} />
        <text x="32" y="84" textAnchor="middle" fontSize="10" fontWeight="900" fill="#c99a10">
          福
        </text>
        <Face x={46} y={45} gap={16} mouth="cat" />
        <g className="sa-wave">
          <path d="M66 76 C74 66 76 54 74 40" fill="none" {...line('#c99a10', 11)} />
          <path d="M66 76 C74 66 76 54 74 40" fill="none" {...line('#ffd34d', 6.5)} />
          <circle cx="74" cy="35" r="8.5" fill="#ffd34d" {...line('#c99a10', 2.4)} />
          <circle cx="74" cy="36.5" r="3" fill="#ff9fb5" />
        </g>
      </>
    ),
  },
];
