// 頭像插畫。頭像在存檔裡用 emoji 當 id（舊存檔不用轉換），畫面上改畫成可愛的 SVG。
import type { ReactNode } from 'react';
import { Art, Blush, Eyes, Face, INK, line, Mouth } from './kit';

/** 左右對稱的零件：畫左邊一份，再鏡像到右邊 */
function Pair({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <g transform="translate(100 0) scale(-1 1)">{children}</g>
    </>
  );
}

const nose = (y: number, color = INK, rx = 4.2, ry = 3) => <ellipse cx={50} cy={y} rx={rx} ry={ry} fill={color} />;
const triNose = (y: number, color = '#ff8fa6') => <path d={`M47.4 ${y} H52.6 L50 ${y + 2.8} Z`} fill={color} {...line(color, 1.4)} />;

const ART: Record<string, () => ReactNode> = {
  '🐱': () => (
    <>
      <Pair>
        <path d="M21 47 L23 12 L47 30 Z" fill="#ffd3a1" {...line('#c7823f')} />
        <path d="M27 38 L27.6 22 L39 31 Z" fill="#ffb3c1" />
      </Pair>
      <ellipse cx="50" cy="57" rx="34" ry="30" fill="#ffe2bd" {...line('#c7823f')} />
      <g fill="none" {...line('#eaa159', 3)}>
        <path d="M44 31 L45 38" />
        <path d="M50 30 V38" />
        <path d="M56 31 L55 38" />
      </g>
      <Eyes y={54} gap={20} />
      <Blush y={62} gap={42} />
      {triNose(59.5)}
      <Mouth y={63} kind="cat" w={4.2} />
      <g {...line('#c7823f', 1.6)}>
        <path d="M13 57 L26 60" />
        <path d="M14 66 L26 64" />
        <path d="M87 57 L74 60" />
        <path d="M86 66 L74 64" />
      </g>
    </>
  ),
  '🐶': () => (
    <>
      <ellipse cx="50" cy="56" rx="33" ry="30" fill="#fbe7c8" {...line('#b57f50')} />
      <ellipse cx="62" cy="49" rx="9" ry="8" fill="#ecc193" />
      <ellipse cx="50" cy="66" rx="12" ry="9" fill="#fff8ee" />
      <Pair>
        <path d="M25 29 C10 33 7 58 17 67 C26 61 30 46 33 34 Z" fill="#b57f50" {...line('#8a5a33')} />
      </Pair>
      <Eyes y={50} gap={22} />
      <Blush y={59} gap={44} />
      {nose(60, INK, 4.6, 3.3)}
      <Mouth y={63.5} kind="tongue" w={5} />
    </>
  ),
  '🦊': () => (
    <>
      <Pair>
        <path d="M19 49 L22 11 L47 30 Z" fill="#ff9a4d" {...line('#c4642a')} />
        <path d="M21.4 21 L22 11 L30.5 17.5 Z" fill="#5a3b2e" />
        <path d="M26 41 L26.6 25 L38 31 Z" fill="#ffe7d0" />
      </Pair>
      <path d="M16 54 C16 34 32 26 50 26 C68 26 84 34 84 54 C84 72 68 84 50 84 C32 84 16 72 16 54 Z" fill="#ff9a4d" />
      <path d="M17 58 C27 58 39 64 50 77 C61 64 73 58 83 58 C82 73 68 84 50 84 C32 84 18 73 17 58 Z" fill="#fff6ec" />
      <path d="M16 54 C16 34 32 26 50 26 C68 26 84 34 84 54 C84 72 68 84 50 84 C32 84 16 72 16 54 Z" fill="none" {...line('#c4642a')} />
      <Eyes y={50} gap={22} />
      <Blush y={59} gap={40} />
      {nose(66, INK, 3.8, 2.7)}
      <Mouth y={69} kind="cat" w={4} />
    </>
  ),
  '🐣': () => (
    <>
      <circle cx="50" cy="50" r="30" fill="#ffe066" {...line('#d9a920')} />
      <path d="M45 22 Q47 12 51 18 Q55 9 57 21" fill="none" {...line('#d9a920', 3)} />
      <Eyes y={46} gap={18} r={4} />
      <Blush y={54} gap={32} />
      <path d="M45 52 H55 L50 58 Z" fill="#ff9f43" {...line('#d9772a', 2)} />
      <path d="M17 62 L25 55 L33 63 L41 55 L49 63 L57 55 L65 63 L73 55 L83 62 C83 80 68 90 50 90 C32 90 17 80 17 62 Z" fill="#fffaf0" {...line('#c9b8a0')} />
    </>
  ),
  '🐼': () => (
    <>
      <Pair>
        <circle cx="25" cy="30" r="11" fill="#45455a" {...line('#2a2a35')} />
      </Pair>
      <ellipse cx="50" cy="56" rx="34" ry="30" fill="#ffffff" {...line('#55556a')} />
      <Pair>
        <ellipse cx="37" cy="52" rx="8.5" ry="10.5" transform="rotate(28 37 52)" fill="#45455a" />
        <circle cx="38" cy="51" r="3.6" fill="#fff" />
        <circle cx="38.6" cy="51.4" r="2.1" fill="#2a2a35" />
      </Pair>
      <Blush y={64} gap={44} />
      {nose(62, '#45455a', 4.6, 3.1)}
      <Mouth y={65.5} kind="cat" w={4} />
    </>
  ),
  '🐯': () => (
    <>
      <Pair>
        <circle cx="26" cy="31" r="10" fill="#ffa940" {...line('#c96a10')} />
        <circle cx="26" cy="31" r="5" fill="#fff3e0" />
      </Pair>
      <ellipse cx="50" cy="56" rx="34" ry="30" fill="#ffad4d" {...line('#c96a10')} />
      <path d="M43 27 Q46 34 50 36 Q54 34 57 27 Q50 31 43 27 Z" fill="#5a3320" />
      <Pair>
        <path d="M17 51 Q24 53 28 49" fill="none" {...line('#5a3320', 3)} />
        <path d="M17 60 Q24 61 28 57" fill="none" {...line('#5a3320', 3)} />
      </Pair>
      <ellipse cx="50" cy="66" rx="13" ry="10" fill="#fff3e0" />
      <Eyes y={51} gap={22} />
      <Blush y={60} gap={46} />
      {nose(61, '#e86a7a', 4, 2.8)}
      <Mouth y={64.5} kind="cat" w={4.4} />
    </>
  ),
  '🦁': () => (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <circle key={i} cx={50 + 32 * Math.cos(a)} cy={54 + 30 * Math.sin(a)} r="11" fill="#e08a35" {...line('#a85e18', 2.5)} />;
      })}
      <circle cx="50" cy="54" r="32" fill="#e08a35" />
      <Pair>
        <circle cx="31" cy="35" r="6" fill="#ffd36b" {...line('#c9962a', 2.5)} />
      </Pair>
      <ellipse cx="50" cy="56" rx="25" ry="23" fill="#ffd36b" {...line('#c9962a')} />
      <Eyes y={52} gap={17} r={3.9} />
      <Blush y={60} gap={30} />
      {nose(60, '#8a4b2a', 4, 2.8)}
      <Mouth y={63.5} kind="cat" w={4} />
    </>
  ),
  '🐸': () => (
    <>
      <ellipse cx="50" cy="60" rx="36" ry="27" fill="#86d986" {...line('#3f9a4f')} />
      <Pair>
        <circle cx="31" cy="36" r="12" fill="#86d986" {...line('#3f9a4f')} />
        <circle cx="31" cy="36" r="7.5" fill="#fff" />
        <circle cx="32.2" cy="36.5" r="4.6" fill={INK} />
        <circle cx="33.8" cy="34.6" r="1.6" fill="#fff" />
      </Pair>
      <circle cx="46" cy="56" r="1.4" fill="#2f6b3a" />
      <circle cx="54" cy="56" r="1.4" fill="#2f6b3a" />
      <path d="M31 64 Q50 78 69 64" fill="none" {...line('#2f6b3a', 3)} />
      <Blush y={64} gap={54} rx={6} />
    </>
  ),
  '🐧': () => (
    <>
      <ellipse cx="50" cy="54" rx="34" ry="32" fill="#3a4766" {...line('#222a40')} />
      <path d="M50 37 C42 28 22 32 24 54 C25 70 38 81 50 81 C62 81 75 70 76 54 C78 32 58 28 50 37 Z" fill="#ffffff" />
      <Eyes y={52} gap={20} />
      <Blush y={62} gap={38} />
      <path d="M43 59 Q50 55 57 59 Q50 67 43 59 Z" fill="#ffa53d" {...line('#d77a1a', 2)} />
    </>
  ),
  '🦉': () => (
    <>
      <Pair>
        <path d="M22 33 L20 13 L39 26 Z" fill="#9c6b45" {...line('#6e4527')} />
      </Pair>
      <ellipse cx="50" cy="56" rx="34" ry="32" fill="#b98258" {...line('#6e4527')} />
      <Pair>
        <circle cx="36" cy="48" r="12" fill="#fff3dc" {...line('#d7b98f', 2)} />
      </Pair>
      <Eyes y={48} gap={28} r={5.2} />
      <path d="M46 56 H54 L50 63 Z" fill="#ffb03b" {...line('#c97f16', 2)} />
      <Blush y={62} gap={44} />
      <g fill="none" {...line('#8a5c3a', 2)}>
        <path d="M38 72 l3 3 l3 -3" />
        <path d="M47 76 l3 3 l3 -3" />
        <path d="M56 72 l3 3 l3 -3" />
      </g>
    </>
  ),
  '🦄': () => (
    <>
      <path d="M72 30 C88 36 92 58 82 76 C80 62 76 54 70 48 Z" fill="#c9b2ff" {...line('#9b7fe0', 2.5)} />
      <Pair>
        <path d="M24 40 L26 16 L42 31 Z" fill="#ffffff" {...line('#b9a6d9')} />
        <path d="M28 34 L29 23 L37 30 Z" fill="#ffc8de" />
      </Pair>
      <ellipse cx="50" cy="58" rx="32" ry="29" fill="#ffffff" {...line('#b9a6d9')} />
      <path d="M44 31 L50 4 L56 31 Z" fill="#ffd66b" {...line('#d9a520', 2.5)} />
      <g {...line('#d9a520', 2)}>
        <path d="M45.6 23 L54.4 21" />
        <path d="M47.4 15 L52.6 13.6" />
      </g>
      <path d="M36 34 Q42 26 50 33 Q44 41 36 34 Z" fill="#ff9ec7" />
      <path d="M48 33 Q55 25 63 32 Q56 40 48 33 Z" fill="#9fd4ff" />
      <path d="M58 34 Q64 29 69 35 Q63 41 58 34 Z" fill="#b5ef9f" />
      <ellipse cx="50" cy="72" rx="16" ry="10" fill="#ffe7f2" />
      <Pair>
        <ellipse cx="45" cy="71" rx="1.6" ry="2.3" fill="#d18aa8" />
      </Pair>
      <Eyes y={55} gap={22} />
      <Blush y={63} gap={40} />
      <Mouth y={76} kind="smile" w={6} />
    </>
  ),
  '🐲': () => (
    <>
      <Pair>
        <path d="M31 31 Q24 15 17 10 Q30 12 39 28 Z" fill="#ffe08a" {...line('#c9a43a', 2.5)} />
      </Pair>
      <ellipse cx="50" cy="57" rx="33" ry="29" fill="#72d6a0" {...line('#2f9a63')} />
      <path d="M41 30 L45.5 21 L50 29 L54.5 21 L59 30 Z" fill="#3fb67a" {...line('#2f9a63', 2)} />
      <ellipse cx="50" cy="68" rx="17" ry="11" fill="#b2f0cb" {...line('#2f9a63', 2.5)} />
      <Pair>
        <ellipse cx="44" cy="66" rx="1.8" ry="2.4" fill="#2f6b4a" />
      </Pair>
      <Eyes y={50} gap={22} />
      <Blush y={58} gap={46} />
      <Mouth y={71.5} kind="smile" w={7} />
    </>
  ),
  '🐙': () => (
    <>
      <path d="M18 54 C18 30 34 18 50 18 C66 18 82 30 82 54 L82 72 Q78 82 72 74 Q66 84 60 74 Q55 84 50 76 Q45 84 40 74 Q34 84 28 74 Q22 82 18 72 Z" fill="#ff94b5" {...line('#d0577f')} />
      <circle cx="33" cy="33" r="3.4" fill="#ffc6d7" />
      <circle cx="64" cy="27" r="2.6" fill="#ffc6d7" />
      <circle cx="71" cy="40" r="2" fill="#ffc6d7" />
      <Face y={49} gap={20} mouth="o" />
    </>
  ),
  '🤖': () => (
    <>
      <path d="M50 22 V11" {...line('#6a7bb0', 3)} />
      <circle cx="50" cy="9" r="5" fill="#ff6b81" {...line('#c94a5e', 2)} />
      <Pair>
        <rect x="10" y="46" width="10" height="18" rx="4" fill="#9fb1e0" {...line('#5a6ca3')} />
      </Pair>
      <rect x="18" y="22" width="64" height="60" rx="18" fill="#cdd9ff" {...line('#5a6ca3')} />
      <rect x="27" y="34" width="46" height="34" rx="11" fill="#2b3566" />
      <ellipse cx="40" cy="48" rx="4" ry="5" fill="#7ef0ff" />
      <ellipse cx="60" cy="48" rx="4" ry="5" fill="#7ef0ff" />
      <path d="M43 58 Q50 63 57 58" fill="none" {...line('#7ef0ff', 2.4)} />
      <Blush y={56} gap={36} color="#ff9ec7" opacity={0.75} />
      <circle cx="30" cy="75" r="2" fill="#5a6ca3" />
      <circle cx="70" cy="75" r="2" fill="#5a6ca3" />
    </>
  ),
  '👾': () => (
    <>
      <Pair>
        <path d="M38 28 Q32 16 26 12" fill="none" {...line('#7a4fc9', 3)} />
        <circle cx="25" cy="11" r="4.5" fill="#ffd166" {...line('#c99a2a', 2)} />
      </Pair>
      <path d="M18 58 C18 36 32 24 50 24 C68 24 82 36 82 58 C82 74 70 84 50 84 C30 84 18 74 18 58 Z" fill="#b994ff" {...line('#7a4fc9')} />
      <circle cx="50" cy="50" r="12" fill="#fff" {...line('#7a4fc9', 2.5)} />
      <circle cx="51" cy="51" r="6.5" fill={INK} />
      <circle cx="53.5" cy="48" r="2.2" fill="#fff" />
      <Blush y={64} gap={42} />
      <Mouth y={67} kind="open" w={7} />
    </>
  ),
  '👻': () => (
    <>
      <Pair>
        <path d="M21 60 Q12 58 10 51" fill="none" {...line('#a9b2d6', 3)} />
      </Pair>
      <path d="M20 50 C20 28 34 16 50 16 C66 16 80 28 80 50 L80 82 Q74 90 68 82 Q62 90 56 82 Q50 90 44 82 Q38 90 32 82 Q26 90 20 82 Z" fill="#ffffff" {...line('#a9b2d6')} />
      <Eyes y={46} gap={18} r={4.5} />
      <Blush y={54} gap={34} />
      <Mouth y={56} kind="tongue" w={5} />
    </>
  ),
  '🦖': () => (
    <>
      <g fill="#ffb84d" {...line('#d18a1f', 2)}>
        <path d="M33 27 L37 14 L44 24 Z" />
        <path d="M45 22 L50 9 L55 22 Z" />
        <path d="M56 24 L63 14 L67 27 Z" />
      </g>
      <ellipse cx="50" cy="56" rx="34" ry="30" fill="#92d975" {...line('#4f9a3a')} />
      <ellipse cx="50" cy="69" rx="20" ry="12" fill="#dbf7c0" />
      <Eyes y={50} gap={24} />
      <Blush y={58} gap={48} />
      <Pair>
        <circle cx="46" cy="63" r="1.4" fill="#4f9a3a" />
      </Pair>
      <Mouth y={69} kind="open" w={7} />
      <path d="M45 69.2 L46.6 72 L48.2 69.6 Z M51.8 69.6 L53.4 72 L55 69.2 Z" fill="#fff" />
    </>
  ),
  '🐰': () => (
    <>
      <Pair>
        <ellipse cx="36" cy="23" rx="8.5" ry="20" transform="rotate(-8 36 23)" fill="#ffffff" {...line('#c9b6c8')} />
        <ellipse cx="36" cy="24" rx="4" ry="14" transform="rotate(-8 36 24)" fill="#ffc7d6" />
      </Pair>
      <ellipse cx="50" cy="60" rx="32" ry="27" fill="#ffffff" {...line('#c9b6c8')} />
      <Eyes y={57} gap={20} />
      <Blush y={65} gap={38} />
      {triNose(62)}
      <Mouth y={66} kind="cat" w={4} />
    </>
  ),
  '🐻': () => (
    <>
      <Pair>
        <circle cx="24" cy="32" r="11" fill="#b07a4f" {...line('#7a5032')} />
        <circle cx="24" cy="32" r="5.5" fill="#e7b98f" />
      </Pair>
      <ellipse cx="50" cy="57" rx="34" ry="30" fill="#b9845a" {...line('#7a5032')} />
      <ellipse cx="50" cy="67" rx="13" ry="10" fill="#ecccA6" />
      <Eyes y={52} gap={22} />
      <Blush y={60} gap={46} />
      {nose(63, INK, 4.5, 3.2)}
      <Mouth y={66.5} kind="cat" w={4} />
    </>
  ),
  '🐻‍❄️': () => (
    <>
      <Pair>
        <circle cx="24" cy="32" r="11" fill="#ffffff" {...line('#a7bfd6')} />
        <circle cx="24" cy="32" r="5.5" fill="#dbe8f5" />
      </Pair>
      <ellipse cx="50" cy="57" rx="34" ry="30" fill="#ffffff" {...line('#a7bfd6')} />
      <ellipse cx="50" cy="67" rx="13" ry="10" fill="#eef5fc" />
      <Eyes y={52} gap={22} />
      <Blush y={60} gap={46} />
      {nose(63, INK, 4.5, 3.2)}
      <Mouth y={66.5} kind="cat" w={4} />
      <path d="M66 24 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -1 Z" fill="#bfe3ff" />
    </>
  ),
  '🐹': () => (
    <>
      <Pair>
        <circle cx="27" cy="30" r="8" fill="#f5b26b" {...line('#c27a33')} />
        <circle cx="27" cy="30" r="4" fill="#ffc7d6" />
      </Pair>
      <ellipse cx="50" cy="58" rx="36" ry="29" fill="#f7b874" />
      <path d="M16 62 C20 50 36 52 50 60 C64 52 80 50 84 62 C82 77 68 87 50 87 C32 87 18 77 16 62 Z" fill="#fff6ea" />
      <ellipse cx="50" cy="58" rx="36" ry="29" fill="none" {...line('#c27a33')} />
      <Eyes y={51} gap={22} />
      <Blush y={64} gap={48} rx={7} ry={4} />
      <ellipse cx="50" cy="59" rx="3" ry="2.2" fill="#ff8fa6" />
      <Mouth y={62} kind="cat" w={3.5} />
    </>
  ),
  '🐨': () => (
    <>
      <Pair>
        <circle cx="20" cy="40" r="15" fill="#a9b0bd" {...line('#6f7686')} />
        <circle cx="20" cy="40" r="8.5" fill="#f0d4dc" />
      </Pair>
      <ellipse cx="50" cy="58" rx="31" ry="28" fill="#c3cad6" {...line('#6f7686')} />
      <Eyes y={52} gap={24} />
      <Blush y={62} gap={44} />
      <ellipse cx="50" cy="62" rx="6" ry="8" fill="#4a4a5a" />
      <Mouth y={73} kind="smile" w={5} />
    </>
  ),
  '🐷': () => (
    <>
      <Pair>
        <path d="M26 37 L24 18 L42 29 Z" fill="#ffb3c6" {...line('#d97a96')} />
      </Pair>
      <ellipse cx="50" cy="57" rx="34" ry="30" fill="#ffccdb" {...line('#d97a96')} />
      <ellipse cx="50" cy="64" rx="11" ry="8" fill="#ffa3bb" {...line('#d97a96', 2.4)} />
      <ellipse cx="46" cy="64" rx="2" ry="3" fill="#c95a7a" />
      <ellipse cx="54" cy="64" rx="2" ry="3" fill="#c95a7a" />
      <Eyes y={50} gap={22} />
      <Blush y={58} gap={48} />
      <Mouth y={74} kind="smile" w={5} />
    </>
  ),
  '🐮': () => (
    <>
      <Pair>
        <path d="M31 30 Q24 18 30 11 Q34 20 39 28 Z" fill="#fff3c4" {...line('#c9b06a', 2.4)} />
        <ellipse cx="19" cy="43" rx="10" ry="6" transform="rotate(-20 19 43)" fill="#ffffff" {...line('#77706a')} />
      </Pair>
      <ellipse cx="50" cy="56" rx="31" ry="29" fill="#ffffff" {...line('#77706a')} />
      <path d="M60 29 C70 29 77 39 73 46 C66 46 60 40 60 29 Z" fill="#3d3a3a" />
      <ellipse cx="50" cy="70" rx="19" ry="12" fill="#ffccd9" {...line('#d98aa0', 2.5)} />
      <ellipse cx="44" cy="70" rx="2.2" ry="3" fill="#b8607a" />
      <ellipse cx="56" cy="70" rx="2.2" ry="3" fill="#b8607a" />
      <Eyes y={50} gap={22} />
      <Blush y={58} gap={44} />
    </>
  ),
  '🐵': () => (
    <>
      <Pair>
        <circle cx="18" cy="54" r="11" fill="#a86a3d" {...line('#764420')} />
        <circle cx="18" cy="54" r="6" fill="#f2c9a0" />
      </Pair>
      <ellipse cx="50" cy="55" rx="32" ry="30" fill="#b0723f" {...line('#764420')} />
      <path d="M50 44 C44 36 28 38 28 52 C28 60 32 66 34 68 C36 78 44 82 50 82 C56 82 64 78 66 68 C68 66 72 60 72 52 C72 38 56 36 50 44 Z" fill="#f4cfa8" />
      <Eyes y={52} gap={18} />
      <Blush y={60} gap={36} />
      <Pair>
        <circle cx="47" cy="62" r="1.4" fill="#764420" />
      </Pair>
      <Mouth y={67} kind="open" w={6} />
    </>
  ),
  '🐳': () => (
    <>
      <g fill="#a9e7ff" {...line('#4fb3e0', 2)}>
        <path d="M50 24 Q46 13 37 12 Q44 17 47 24 Z" />
        <path d="M50 24 Q54 13 63 12 Q56 17 53 24 Z" />
      </g>
      <path d="M14 58 C14 38 30 26 50 26 C72 26 86 40 86 58 C86 76 70 84 50 84 C30 84 14 76 14 58 Z" fill="#74c6f4" />
      <path d="M18 64 C30 72 70 72 82 64 C80 76 66 84 50 84 C34 84 20 76 18 64 Z" fill="#e6f7ff" />
      <path d="M14 58 C14 38 30 26 50 26 C72 26 86 40 86 58 C86 76 70 84 50 84 C30 84 14 76 14 58 Z" fill="none" {...line('#3b8fc4')} />
      <Eyes y={51} gap={28} />
      <Blush y={59} gap={46} />
      <Mouth y={58} kind="smile" w={8} />
    </>
  ),
  '🦔': () => (
    <>
      <path d="M14 62 L9 50 L18 46 L13 34 L24 34 L23 22 L34 26 L38 14 L46 22 L52 10 L58 22 L66 14 L68 26 L78 22 L77 34 L88 34 L83 46 L92 50 L86 62 Z" fill="#a0715a" {...line('#6b4430')} />
      <ellipse cx="50" cy="61" rx="30" ry="25" fill="#f8e2c8" {...line('#c49b72')} />
      <Eyes y={57} gap={20} />
      <Blush y={65} gap={38} />
      {nose(63.5, INK, 3.4, 2.6)}
      <Mouth y={67} kind="smile" w={5} />
    </>
  ),
  '🦦': () => (
    <>
      <Pair>
        <circle cx="25" cy="34" r="7" fill="#a3765a" {...line('#6b4430', 2.6)} />
        <circle cx="25" cy="34" r="3" fill="#e8c4a6" />
      </Pair>
      <ellipse cx="50" cy="56" rx="31" ry="28" fill="#b58566" {...line('#6b4430')} />
      <ellipse cx="50" cy="65" rx="19" ry="15" fill="#f2dcc4" />
      <Eyes y={52} gap={22} />
      <Blush y={60} gap={40} />
      {nose(60, INK, 4, 3)}
      <Mouth y={64} kind="cat" w={4.4} />
      <g {...line('#6b4430', 1.4)}>
        <path d="M33 62 L22 60 M33 65 L23 67 M67 62 L78 60 M67 65 L77 67" />
      </g>
      <ellipse cx="50" cy="86" rx="11" ry="6" fill="#f6efe6" {...line('#b9a68e', 2)} />
      <path d="M42 86 Q50 81 58 86 M44 88 Q50 85 56 88" fill="none" {...line('#c9b8a0', 1.4)} />
    </>
  ),
  '🐿️': () => (
    <>
      <path d="M78 82 C98 70 96 34 80 26 C70 22 66 34 74 40 C84 46 82 64 70 72 Z" fill="#e0924f" {...line('#9a5a2a')} />
      <path d="M80 34 C86 40 86 56 78 64" fill="none" {...line('#f4c08a', 3)} />
      <Pair>
        <path d="M24 38 L22 18 L38 30 Z" fill="#e0924f" {...line('#9a5a2a', 2.6)} />
      </Pair>
      <ellipse cx="46" cy="56" rx="28" ry="27" fill="#eaa463" {...line('#9a5a2a')} />
      <ellipse cx="46" cy="66" rx="16" ry="13" fill="#fff0dc" />
      <Eyes x={46} y={52} gap={20} />
      <Blush x={46} y={60} gap={36} />
      {nose(59.5, INK, 3.2, 2.4)}
      <Mouth x={46} y={63} kind="cat" w={3.8} />
      <path d="M41 66 H51 V71 H41 Z" fill="#ffffff" {...line(INK, 1.4)} />
      <ellipse cx="46" cy="84" rx="7" ry="5.5" fill="#b0703a" {...line('#7a4a22', 2)} />
      <path d="M41 81 Q46 77 51 81" fill="#7a4a22" />
    </>
  ),
  '🦭': () => (
    <>
      <path d="M16 70 C10 50 24 28 50 28 C76 28 90 50 84 70 C80 84 20 84 16 70 Z" fill="#b9c4d6" {...line('#6c7a94')} />
      <ellipse cx="50" cy="64" rx="18" ry="12" fill="#e6ebf4" />
      <Eyes y={52} gap={24} r={4.8} />
      <Blush y={61} gap={42} />
      <ellipse cx="50" cy="60" rx="4.4" ry="3.2" fill={INK} />
      <Mouth y={64} kind="cat" w={4.6} />
      <g {...line('#6c7a94', 1.4)}>
        <path d="M38 62 L26 59 M38 66 L27 68 M62 62 L74 59 M62 66 L73 68" />
      </g>
      <path d="M14 76 C6 74 4 84 10 86 C14 82 18 80 22 80 Z M86 76 C94 74 96 84 90 86 C86 82 82 80 78 80 Z" fill="#a3afc4" {...line('#6c7a94', 2.2)} />
    </>
  ),
  '🐝': () => (
    <>
      <g fill="#e8f6ff" fillOpacity="0.85" {...line('#8fb6d9', 2.2)}>
        <ellipse cx="30" cy="26" rx="14" ry="10" transform="rotate(-20 30 26)" />
        <ellipse cx="70" cy="26" rx="14" ry="10" transform="rotate(20 70 26)" />
      </g>
      <path d="M44 22 Q38 10 32 10 M56 22 Q62 10 68 10" fill="none" {...line(INK, 2.4)} />
      <circle cx="32" cy="10" r="3" fill={INK} />
      <circle cx="68" cy="10" r="3" fill={INK} />
      <ellipse cx="50" cy="58" rx="32" ry="29" fill="#ffd34d" {...line('#c99a2a')} />
      <path d="M22 72 C34 78 66 78 78 72 L80 66 C66 72 34 72 20 66 Z" fill="#4a3535" />
      <path d="M20 46 C34 52 66 52 80 46 L82 52 C66 58 34 58 18 52 Z" fill="#4a3535" opacity="0.92" />
      <Eyes y={60} gap={22} r={4.2} />
      <Blush y={67} gap={40} />
      <Mouth y={67} kind="smile" w={6} />
    </>
  ),
  '🦥': () => (
    <>
      <path d="M14 56 C14 32 30 20 50 20 C70 20 86 32 86 56 C86 78 70 88 50 88 C30 88 14 78 14 56 Z" fill="#a88a6e" {...line('#6b5340')} />
      <path d="M24 56 C24 40 36 32 50 32 C64 32 76 40 76 56 C76 72 64 80 50 80 C36 80 24 72 24 56 Z" fill="#f1dfc6" />
      <Pair>
        <path d="M27 50 C29 42 39 42 43 50 C41 58 31 60 27 50 Z" fill="#6b5340" />
      </Pair>
      <Eyes y={50} gap={22} r={3.4} color="#2b1f15" />
      <ellipse cx="50" cy="60" rx="4.6" ry="3.4" fill="#4a3535" />
      <Mouth y={65} kind="smile" w={8} />
      <Blush y={63} gap={40} opacity={0.4} />
    </>
  ),
  '🦩': () => (
    <>
      <path d="M58 88 C56 74 66 66 64 54" fill="none" {...line('#e86a8f', 7)} />
      <path d="M58 88 C56 74 66 66 64 54" fill="none" {...line('#ff9fbf', 4)} />
      <circle cx="54" cy="40" r="22" fill="#ff9fbf" {...line('#d9578f')} />
      <path d="M68 40 C80 38 86 44 86 50 C86 56 80 58 76 54 C78 50 74 46 68 46 Z" fill="#ffffff" {...line('#8a93b8', 2.2)} />
      <path d="M80 50 C84 52 86 56 84 60 C80 60 78 56 76 54 Z" fill={INK} />
      <path d="M44 18 Q46 10 52 12 Q50 16 50 19" fill="#ff7aa8" {...line('#d9578f', 2)} />
      <Eyes x={52} y={38} gap={16} r={3.6} />
      <Blush x={50} y={46} gap={26} />
    </>
  ),
};

/** 頭像插畫的內容（圖片題也會用到） */
export const avatarDraw = (id: string): (() => ReactNode) | undefined => ART[id];

/** 有畫插畫的頭像（其餘的 emoji 照原樣顯示） */
export const AVATAR_ART_IDS = Object.keys(ART);

/** 頭像：有插畫的畫 SVG，否則顯示 emoji */
export function AvatarArt({ id, size = 40 }: { id: string; size?: number | string }) {
  const draw = ART[id];
  if (!draw) {
    return (
      <span className="avatar-emoji" style={{ fontSize: typeof size === 'number' ? size * 0.72 : undefined }}>
        {id}
      </span>
    );
  }
  return <Art size={size}>{draw()}</Art>;
}

/** 頭像的中文名稱（商店、個人頁用） */
export const AVATAR_NAME: Record<string, string> = {
  '🐱': '橘貓',
  '🐶': '小狗',
  '🦊': '狐狸',
  '🐣': '小雞',
  '🐼': '熊貓',
  '🐯': '老虎',
  '🦁': '獅子',
  '🐸': '青蛙',
  '🐧': '企鵝',
  '🦉': '貓頭鷹',
  '🦄': '獨角獸',
  '🐲': '小龍',
  '🐙': '章魚',
  '🤖': '機器人',
  '👾': '小怪獸',
  '👻': '小幽靈',
  '🦖': '小恐龍',
  '🐰': '兔子',
  '🐻': '熊熊',
  '🐻‍❄️': '北極熊',
  '🐹': '倉鼠',
  '🐨': '無尾熊',
  '🐷': '小豬',
  '🐮': '乳牛',
  '🐵': '猴子',
  '🐳': '鯨魚',
  '🦔': '刺蝟',
  '🦦': '水獺',
  '🐿️': '松鼠',
  '🦭': '海豹',
  '🐝': '蜜蜂',
  '🦥': '樹懶',
  '🦩': '紅鶴',
};
