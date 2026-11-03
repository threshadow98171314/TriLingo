// 活用道場：日文動詞變化。N5～N4 常用動詞，依動詞種類（五段、一段、する、来る）套規則變化，
// 干擾選項是學習者最常犯的錯（把「帰る」當一段動詞、て形音便用錯、可能形和受身形搞混…）。
import { furiKana, furiPlain } from '../furigana';
import { pick, sample, type Rng } from '../../core/rng';
import type { DrillQ } from './types';

type Cls = 'g' | 'i' | 's' | 'k';
export type ConjForm = 'masu' | 'te' | 'ta' | 'nai' | 'pot' | 'vol' | 'ba' | 'pass' | 'caus';

export interface Verb {
  furi: string;
  cls: Cls;
  m: string;
  /** 「～る」結尾但其實是五段動詞（帰る、入る…） */
  trap: boolean;
  /** 不自然、不出題的變化：P 可能、V 意向、S 受身、C 使役 */
  skip: string;
}

// 一行一個：原文|種類（g 五段、G 長得像一段的五段、i 一段、s する、k 来る）|意思|不出題的變化
const RAW = `
会[あ]う|g|見面|S
買[か]う|g|買
言[い]う|g|說
使[つか]う|g|使用
洗[あら]う|g|洗
歌[うた]う|g|唱歌
習[なら]う|g|學習|S
手伝[てつだ]う|g|幫忙|S
払[はら]う|g|付錢
笑[わら]う|g|笑
思[おも]う|g|想
書[か]く|g|寫
聞[き]く|g|聽；問
歩[ある]く|g|走路|S
働[はたら]く|g|工作|S
置[お]く|g|放
泣[な]く|g|哭|V
行[い]く|g|去|S
泳[およ]ぐ|g|游泳|S
急[いそ]ぐ|g|趕快|PS
脱[ぬ]ぐ|g|脫|S
話[はな]す|g|說話
貸[か]す|g|借出|S
返[かえ]す|g|歸還
消[け]す|g|關掉
押[お]す|g|按；推
出[だ]す|g|拿出；交出
探[さが]す|g|尋找
待[ま]つ|g|等|S
持[も]つ|g|拿|S
立[た]つ|g|站
勝[か]つ|g|贏|S
死[し]ぬ|g|死
遊[あそ]ぶ|g|玩|S
呼[よ]ぶ|g|叫
飛[と]ぶ|g|飛|S
選[えら]ぶ|g|選
読[よ]む|g|讀
飲[の]む|g|喝
休[やす]む|g|休息|S
住[す]む|g|居住|S
頼[たの]む|g|拜託
作[つく]る|g|做
乗[の]る|g|搭乘|S
取[と]る|g|拿
送[おく]る|g|寄送
終[お]わる|g|結束|PVS
座[すわ]る|g|坐|S
分[わ]かる|g|懂|PVS
売[う]る|g|賣
頑張[がんば]る|g|努力|S
帰[かえ]る|G|回去|S
入[はい]る|G|進入
走[はし]る|G|跑|S
切[き]る|G|切
知[し]る|G|知道|P
要[い]る|G|需要|PVSC
減[へ]る|G|減少|PVSC
喋[しゃべ]る|G|聊天|S
滑[すべ]る|G|滑|S
握[にぎ]る|G|握
食[た]べる|i|吃
見[み]る|i|看
起[お]きる|i|起床|S
寝[ね]る|i|睡覺
出[で]る|i|出去
着[き]る|i|穿（上衣）
教[おし]える|i|教
開[あ]ける|i|打開
閉[し]める|i|關上
忘[わす]れる|i|忘記
覚[おぼ]える|i|記住
借[か]りる|i|借入
浴[あ]びる|i|淋（浴）|S
降[お]りる|i|下（車）|S
始[はじ]める|i|開始
続[つづ]ける|i|繼續
答[こた]える|i|回答|S
考[かんが]える|i|思考
調[しら]べる|i|調查
決[き]める|i|決定
入[い]れる|i|放進
出[で]かける|i|出門|S
見[み]せる|i|給～看|C
信[しん]じる|i|相信
捨[す]てる|i|丟掉
着替[きが]える|i|換衣服
疲[つか]れる|i|累|PVS
遅[おく]れる|i|遲到|PVS
落[お]ちる|i|掉落|PVSC
足[た]りる|i|足夠|PVSC
する|s|做
勉強[べんきょう]する|s|唸書|S
練習[れんしゅう]する|s|練習|S
掃除[そうじ]する|s|打掃
散歩[さんぽ]する|s|散步|S
来[く]る|k|來
`;

export const VERBS: Verb[] = RAW.trim()
  .split('\n')
  .map((line) => {
    const [furi, c, m, skip = ''] = line.trim().split('|');
    return { furi, cls: (c === 'G' ? 'g' : c) as Cls, m, trap: c === 'G', skip };
  });

export const FORM_NAME: Record<ConjForm, string> = {
  masu: 'ます形',
  te: 'て形',
  ta: 'た形（過去）',
  nai: 'ない形（否定）',
  pot: '可能形（能～）',
  vol: '意向形（～吧）',
  ba: 'ば形（如果～）',
  pass: '受身形（被～）',
  caus: '使役形（讓～）',
};

export const BASIC_FORMS: ConjForm[] = ['masu', 'te', 'ta', 'nai'];
export const ADV_FORMS: ConjForm[] = ['pot', 'vol', 'ba', 'pass', 'caus'];

const FORM_CODE: Partial<Record<ConjForm, string>> = { pot: 'P', vol: 'V', pass: 'S', caus: 'C' };

/** 這個動詞的這種變化自然嗎（例如「分かる」沒有可能形） */
export const canForm = (v: Verb, f: ConjForm): boolean => !FORM_CODE[f] || !v.skip.includes(FORM_CODE[f]!);

/** 五段動詞的あ、い、う、え、お段 */
const ROW: Record<string, string> = {
  う: 'わいうえお',
  く: 'かきくけこ',
  ぐ: 'がぎぐげご',
  す: 'さしすせそ',
  つ: 'たちつてと',
  ぬ: 'なにぬねの',
  ぶ: 'ばびぶべぼ',
  む: 'まみむめも',
  る: 'らりるれろ',
};

const isIku = (v: Verb) => v.furi === '行[い]く';

/** 五段動詞的て形音便 */
function teEnd(u: string, iku: boolean): string {
  if (iku || 'うつる'.includes(u)) return 'って';
  if ('むぶぬ'.includes(u)) return 'んで';
  if (u === 'く') return 'いて';
  if (u === 'ぐ') return 'いで';
  return 'して';
}

const toTa = (te: string) => te.replace(/て$/, 'た').replace(/で$/, 'だ');

const SURU: Record<ConjForm, string> = { masu: 'します', te: 'して', ta: 'した', nai: 'しない', pot: 'できる', vol: 'しよう', ba: 'すれば', pass: 'される', caus: 'させる' };
const KURU: Record<ConjForm, string> = {
  masu: '来[き]ます',
  te: '来[き]て',
  ta: '来[き]た',
  nai: '来[こ]ない',
  pot: '来[こ]られる',
  vol: '来[こ]よう',
  ba: '来[く]れば',
  pass: '来[こ]られる',
  caus: '来[こ]させる',
};
const ICHI: Record<ConjForm, string> = { masu: 'ます', te: 'て', ta: 'た', nai: 'ない', pot: 'られる', vol: 'よう', ba: 'れば', pass: 'られる', caus: 'させる' };

/** 動詞變化（回傳「漢字[よみ]」標註的字串） */
export function conjugate(v: Verb, f: ConjForm): string {
  if (v.cls === 's') return v.furi.slice(0, -2) + SURU[f];
  if (v.cls === 'k') return KURU[f];
  const stem = v.furi.slice(0, -1);
  if (v.cls === 'i') return stem + ICHI[f];
  const u = v.furi.slice(-1);
  const r = ROW[u];
  switch (f) {
    case 'masu':
      return stem + r[1] + 'ます';
    case 'te':
      return stem + teEnd(u, isIku(v));
    case 'ta':
      return stem + toTa(teEnd(u, isIku(v)));
    case 'nai':
      return stem + r[0] + 'ない';
    case 'pot':
      return stem + r[3] + 'る';
    case 'vol':
      return stem + r[4] + 'う';
    case 'ba':
      return stem + r[3] + 'ば';
    case 'pass':
      return stem + r[0] + 'れる';
    case 'caus':
      return stem + r[0] + 'せる';
  }
}

/** 常見的錯誤變化（可能和正確答案重複，出題時會過濾） */
export function wrongForms(v: Verb, f: ConjForm): string[] {
  if (v.cls === 's') {
    const W: Record<ConjForm, string[]> = {
      masu: ['すます', 'さます', 'しります'],
      te: ['すて', 'しって', 'さして'],
      ta: ['すた', 'しった', 'さした'],
      nai: ['すない', 'さない', 'せない'],
      pot: ['しられる', 'すれる', 'される'],
      vol: ['すよう', 'しろう', 'そう'],
      ba: ['しれば', 'せば', 'さば'],
      pass: ['できる', 'しられる', 'させる'],
      caus: ['しさせる', 'される', 'すさせる'],
    };
    return W[f].map((x) => v.furi.slice(0, -2) + x);
  }
  if (v.cls === 'k') {
    const W: Record<ConjForm, string[]> = {
      masu: ['来[こ]ます', '来[く]ます', '来[き]ります'],
      te: ['来[こ]て', '来[く]て', '来[き]って'],
      ta: ['来[こ]た', '来[く]た', '来[き]った'],
      nai: ['来[き]ない', '来[く]ない', '来[こ]らない'],
      pot: ['来[き]られる', '来[く]られる', '来[こ]させる'],
      vol: ['来[き]よう', '来[く]よう', '来[こ]ろう'],
      ba: ['来[こ]れば', '来[き]れば', '来[く]ば'],
      pass: ['来[こ]させる', '来[き]られる', '来[く]られる'],
      caus: ['来[き]させる', '来[こ]られる', '来[く]させる'],
    };
    return W[f];
  }
  const stem = v.furi.slice(0, -1);
  if (v.cls === 'i') {
    // 一段動詞常被當成五段動詞變化
    const W: Record<ConjForm, string[]> = {
      masu: ['ります', 'います', 'るます'],
      te: ['って', 'んで', 'りて'],
      ta: ['った', 'んだ', 'りた'],
      nai: ['らない', 'りない', 'るない'],
      pot: ['させる', 'らる', 'れられる'],
      vol: ['ろう', 'りよう', 'おう'],
      ba: ['らば', 'るば', 'えば'],
      pass: ['させる', 'らせる', 'られれる'],
      caus: ['らせる', 'られる', 'せる'],
    };
    return W[f].map((x) => stem + x);
  }
  const u = v.furi.slice(-1);
  const r = ROW[u];
  switch (f) {
    case 'masu':
      return [stem + 'ます', stem + r[0] + 'ます', stem + r[3] + 'ます'];
    case 'te':
    case 'ta': {
      const ends = ['って', 'んで', 'いて', 'いで', 'して', r[1] + 'て', 'て'];
      return ends.map((e) => stem + (f === 'ta' ? toTa(e) : e));
    }
    case 'nai':
      return [stem + 'ない', stem + r[1] + 'ない', u === 'う' ? stem + 'あない' : stem + r[3] + 'ない'];
    case 'pot':
      // 「れられる」是把可能形又加一次可能的常見錯誤
      return [stem + 'られる', stem + r[0] + 'れる', stem + r[1] + 'れる', stem + r[3] + 'られる'];
    case 'vol':
      return [stem + 'よう', stem + r[4] + 'よう', stem + r[0] + 'う'];
    case 'ba':
      // 「帰るれば」：把れば接在辭書形後面
      return [stem + 'れば', stem + r[0] + 'ば', stem + r[1] + 'ば', stem + r[2] + 'れば'];
    case 'pass':
      return [stem + 'られる', stem + r[3] + 'る', stem + r[0] + 'せる', stem + r[1] + 'られる'];
    case 'caus':
      return [stem + 'させる', stem + r[0] + 'れる', stem + r[3] + 'させる', stem + r[1] + 'させる'];
  }
}

const GODAN_RULE: Record<ConjForm, string> = {
  masu: 'う段改成い段＋ます（書く → 書きます）',
  te: '',
  ta: '',
  nai: 'う段改成あ段＋ない；「う」結尾改成「わ」（買う → 買わない）',
  pot: 'う段改成え段＋る（書く → 書ける）',
  vol: 'う段改成お段＋う（書く → 書こう）',
  ba: 'う段改成え段＋ば（書く → 書けば）',
  pass: 'う段改成あ段＋れる（書く → 書かれる）',
  caus: 'う段改成あ段＋せる（書く → 書かせる）',
};

/** 作答後的說明 */
export function conjExplain(v: Verb, f: ConjForm): string {
  const dict = furiPlain(v.furi);
  const right = furiPlain(conjugate(v, f));
  if (v.cls === 's') return `${dict} 是「する」動詞（不規則）：する → ${furiPlain(SURU[f])}，所以是 ${right}。`;
  if (v.cls === 'k') return `来る 是不規則動詞，漢字的讀音會變：来ます（き）、来ない（こ）、来れば（く），所以是 ${right}（${furiKana(conjugate(v, f))}）。`;
  if (v.cls === 'i') return `${dict} 是一段動詞：去掉「る」再接「${ICHI[f]}」，所以是 ${right}。`;
  const u = v.furi.slice(-1);
  let rule: string;
  if (f === 'te' || f === 'ta') {
    const t = f === 'ta' ? 'た' : 'て';
    const d = f === 'ta' ? 'だ' : 'で';
    rule = isIku(v)
      ? `行く 是例外：く結尾卻變成「行っ${t}」`
      : `五段動詞的音便：う・つ・る → っ${t}，む・ぶ・ぬ → ん${d}，く → い${t}，ぐ → い${d}，す → し${t}`;
  } else rule = `五段動詞：${GODAN_RULE[f]}`;
  const trap = v.trap ? `「${dict}」雖然是「～${furiKana(v.furi).slice(-2)}」結尾，其實是五段動詞，不是一段動詞。` : '';
  return `${trap}${rule}。${dict}（${u} 結尾）→ ${right}。`;
}

/** 出一場題目：mode 是 basic（ます・て・た・ない）、adv（可能・意向・ば・受身・使役）或 all */
export function conjQuestions(rng: Rng, mode: string, n: number): DrillQ[] {
  const forms = mode === 'basic' ? BASIC_FORMS : mode === 'adv' ? ADV_FORMS : [...BASIC_FORMS, ...ADV_FORMS];
  const out: DrillQ[] = [];
  const used = new Set<string>();
  for (let guard = 0; out.length < n && guard < n * 50; guard++) {
    const v = pick(VERBS, rng);
    const ok = forms.filter((f) => canForm(v, f));
    if (!ok.length) continue;
    const f = pick(ok, rng);
    const key = `${v.furi}|${f}`;
    if (used.has(key)) continue;
    used.add(key);
    const right = conjugate(v, f);
    const wrong = [...new Set(wrongForms(v, f))].filter((x) => x !== right);
    if (wrong.length < 3) continue;
    out.push({
      prompt: v.furi,
      hint: `${FORM_NAME[f]}・${v.m}`,
      opts: [right, ...sample(wrong, 3, rng)],
      explain: conjExplain(v, f),
      say: furiKana(right),
    });
  }
  return out;
}
