// 日文第 0 關：五十音。平假名寫一次，片假名由程式轉換產生。
import type { Unit } from '../core/types';
import { toKatakana } from '../engine/furigana';
import { ch, charUnit, ja, vocabUnit, type CharRow } from './dsl';

type RowSpec = [label: string, ...cells: string[]];

const BASIC: RowSpec[] = [
  ['あ行', 'あ a', 'い i', 'う u', 'え e', 'お o'],
  ['か行', 'か ka', 'き ki', 'く ku', 'け ke', 'こ ko'],
  ['さ行', 'さ sa', 'し shi|si', 'す su', 'せ se', 'そ so'],
  ['た行', 'た ta', 'ち chi|ti', 'つ tsu|tu', 'て te', 'と to'],
  ['な行', 'な na', 'に ni', 'ぬ nu', 'ね ne', 'の no'],
  ['は行', 'は ha', 'ひ hi', 'ふ fu|hu', 'へ he', 'ほ ho'],
  ['ま行', 'ま ma', 'み mi', 'む mu', 'め me', 'も mo'],
  ['や行', 'や ya', '', 'ゆ yu', '', 'よ yo'],
  ['ら行', 'ら ra', 'り ri', 'る ru', 'れ re', 'ろ ro'],
  ['わ行', 'わ wa', '', '', '', 'を wo|o'],
  ['ん', 'ん n|nn', '', '', '', ''],
];

const DAKUON: RowSpec[] = [
  ['が行', 'が ga', 'ぎ gi', 'ぐ gu', 'げ ge', 'ご go'],
  ['ざ行', 'ざ za', 'じ ji|zi', 'ず zu', 'ぜ ze', 'ぞ zo'],
  ['だ行', 'だ da', 'ぢ ji|di', 'づ zu|du', 'で de', 'ど do'],
  ['ば行', 'ば ba', 'び bi', 'ぶ bu', 'べ be', 'ぼ bo'],
  ['ぱ行', 'ぱ pa', 'ぴ pi', 'ぷ pu', 'ぺ pe', 'ぽ po'],
];

const YOON: RowSpec[] = [
  ['きゃ行', 'きゃ kya', 'きゅ kyu', 'きょ kyo'],
  ['しゃ行', 'しゃ sha|sya', 'しゅ shu|syu', 'しょ sho|syo'],
  ['ちゃ行', 'ちゃ cha|tya', 'ちゅ chu|tyu', 'ちょ cho|tyo'],
  ['にゃ行', 'にゃ nya', 'にゅ nyu', 'にょ nyo'],
  ['ひゃ行', 'ひゃ hya', 'ひゅ hyu', 'ひょ hyo'],
  ['みゃ行', 'みゃ mya', 'みゅ myu', 'みょ myo'],
  ['りゃ行', 'りゃ rya', 'りゅ ryu', 'りょ ryo'],
  ['ぎゃ行', 'ぎゃ gya', 'ぎゅ gyu', 'ぎょ gyo'],
  ['じゃ行', 'じゃ ja|jya|zya', 'じゅ ju|jyu|zyu', 'じょ jo|jyo|zyo'],
  ['びゃ行', 'びゃ bya', 'びゅ byu', 'びょ byo'],
  ['ぴゃ行', 'ぴゃ pya', 'ぴゅ pyu', 'ぴょ pyo'],
];

// 聽起來和別的假名一樣的字：聽力題不會把它們互相當成干擾選項
const SAME_SOUND: Record<string, string> = { を: 'お', ぢ: 'じ', づ: 'ず' };

const NOTES: Record<string, string> = {
  は: '當助詞用時讀作「wa」。',
  へ: '當助詞用時讀作「e」。',
  を: '只當助詞用，實際發音和「お」一樣。',
  ん: '鼻音，不會出現在字首。',
  ふ: '介於 fu 和 hu 之間，嘴唇不要咬到。',
  つ: '舌尖抵住上排牙齒後方發音。',
  ぢ: '發音和「じ」相同，現代日文很少用。',
  づ: '發音和「ず」相同，現代日文很少用。',
};

function toRows(specs: RowSpec[], kata: boolean): CharRow[] {
  const conv = (s: string) => (kata ? toKatakana(s) : s);
  return specs.map(([label, ...cells]) => ({
    label: conv(label),
    cells: cells.map((c) => {
      if (!c) return null;
      const h = c.split(' ')[0];
      // 助詞相關的說明只對平假名有意義
      const note = kata && 'はへをぢづ'.includes(h) ? undefined : NOTES[h];
      return ch(conv(c), { note, sound: SAME_SOUND[h] ? conv(SAME_SOUND[h]) : undefined });
    }),
  }));
}

const BASIC_GROUPS = [[0], [1], [2], [3], [4], [5], [6], [7], [8], [9, 10]];
const YOON_GROUPS = [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9, 10]];

export const KANA_UNITS: Unit[] = [
  charUnit('ja.kana.h1', 'あ', '平假名：清音', '46 個基本假名', toRows(BASIC, false), BASIC_GROUPS),
  vocabUnit('ja.kana.hread', '🐱', '讀讀看：平假名單字', '用剛學會的假名讀出單字', [
    ja('ねこ', '貓'),
    ja('いぬ', '狗'),
    ja('さくら', '櫻花'),
    ja('やま', '山'),
    ja('うみ', '海'),
    ja('そら', '天空'),
    ja('はな', '花'),
    ja('ほし', '星星'),
    ja('あめ', '雨'),
    ja('ゆき', '雪'),
  ]),
  charUnit('ja.kana.h2', 'が', '平假名：濁音・半濁音', '右上角加「゛」或「゜」', toRows(DAKUON, false)),
  charUnit('ja.kana.h3', 'きゃ', '平假名：拗音', '「い段」＋小寫的 ゃ ゅ ょ', toRows(YOON, false), YOON_GROUPS),
  charUnit('ja.kana.k1', 'ア', '片假名：清音', '用來寫外來語、擬聲詞', toRows(BASIC, true), BASIC_GROUPS),
  charUnit('ja.kana.k2', 'ガ', '片假名：濁音・半濁音', '右上角加「゛」或「゜」', toRows(DAKUON, true)),
  charUnit('ja.kana.k3', 'キャ', '片假名：拗音', '「イ段」＋小寫的 ャ ュ ョ', toRows(YOON, true), YOON_GROUPS),
  vocabUnit('ja.kana.kread', '📺', '讀讀看：外來語', '唸出來就猜得到意思', [
    ja('カメラ', '相機'),
    ja('テレビ', '電視'),
    ja('バス', '公車'),
    ja('タクシー', '計程車', undefined, { note: '「ー」是長音符號，把前一個母音拉長一拍。' }),
    ja('アイスクリーム', '冰淇淋'),
    ja('ハンバーガー', '漢堡'),
    ja('バナナ', '香蕉'),
    ja('ジュース', '果汁'),
    ja('アニメ', '動畫'),
    ja('ゲーム', '遊戲'),
  ]),
];
