// 不規則動詞：原形 → 過去式 → 過去分詞（多益 Part 5 常考完成式、被動語態，一定要背熟）。
// 干擾選項是另一個時態、照規則加 -ed 的錯誤寫法，以及容易混淆的字（rise／raise、lie／lay）；
// 兩種寫法都對的（got／gotten、showed／shown）不會拿來當錯誤選項。
import { pick, sample, type Rng } from '../../core/rng';
import type { DrillQ } from './types';

export interface IrrVerb {
  base: string;
  past: string;
  pp: string;
  m: string;
  /** 也算對的寫法 */
  alt: string[];
  /** 額外的錯誤寫法（常見的錯） */
  extra: string[];
}

// 一行一個：原形 過去式 過去分詞|意思|也算對的寫法|常見的錯誤寫法
const RAW = `
arise arose arisen|出現；發生||arised arosen
become became become|成為||becomed becomen
begin began begun|開始||beginned begin
bend bent bent|彎曲||bended bend
bite bit bitten|咬||bited bote
blow blew blown|吹||blowed blewn
break broke broken|打破||breaked broked
bring brought brought|帶來||brang brung
build built built|建造||builded build
buy bought bought|買||buyed brought
catch caught caught|抓；趕上||catched caughten
choose chose chosen|選擇||choosed chosed
come came come|來||comed camed
cut cut cut|切；削減||cutted cutten
deal dealt dealt|處理；交易||dealed delt
dig dug dug|挖||digged dugged
do did done|做||doed doen
draw drew drawn|畫；吸引||drawed drewn
drink drank drunk|喝||drinked dranken
drive drove driven|開車||drived droven
eat ate eaten|吃||eated aten
fall fell fallen|掉落；下降||falled felled
feed fed fed|餵||feeded fedden
feel felt felt|感覺||feeled felten
fight fought fought|打架；奮鬥||fighted foughten
find found found|找到||finded founded
fly flew flown|飛||flied flewn
forbid forbade forbidden|禁止|forbad|forbidded forbode
forget forgot forgotten|忘記||forgetted forgoten
forgive forgave forgiven|原諒||forgived forgaven
freeze froze frozen|冷凍；凍結||freezed frozed
get got gotten|得到|got|getted gotted
give gave given|給||gived gaven
go went gone|去||goed wented
grow grew grown|成長；種植||growed grewn
hang hung hung|掛||hanged hunged
have had had|有||haved hadden
hear heard heard|聽到||heared hearden
hide hid hidden|隱藏||hided hidded
hit hit hit|打；撞||hitted hat
hold held held|舉行；拿著||holded helden
hurt hurt hurt|傷害||hurted hurten
keep kept kept|保持||keeped kepten
know knew known|知道||knowed knewn
lay laid laid|放置；產卵||layed lain
lead led led|帶領||leaded lead
leave left left|離開；留下||leaved lefted
lend lent lent|借出||lendt lant
let let let|讓||letted letten
lie lay lain|躺||lied laid
lose lost lost|失去；遺失||losed losted
make made made|做；製造||maked maden
mean meant meant|意思是||meaned meanted
meet met met|見面||meeted metten
pay paid paid|付錢||payed paied
put put put|放||putten pat
quit quit quit|辭職；戒除|quitted|quitten quat
read read read|讀||readed readen
ride rode ridden|騎；搭乘||rided roden
ring rang rung|（鈴）響||ringed ranged
rise rose risen|上升||rised raised
run ran run|跑；經營||runned ranned
say said said|說||sayed sayd
see saw seen|看||seed sawn
seek sought sought|尋求||seeked soughten
sell sold sold|賣||selled solden
send sent sent|寄送||sended senten
set set set|設定；放置||setted setten
shake shook shaken|搖||shaked shooken
shoot shot shot|射擊；拍攝||shooted shotten
show showed shown|展示|showed|showen shownd
shrink shrank shrunk|縮小||shrinked shrunken
shut shut shut|關上||shutted shutten
sing sang sung|唱歌||singed sanged
sink sank sunk|下沉||sinked sanked
sit sat sat|坐||sitted satten
sleep slept slept|睡覺||sleeped slepten
speak spoke spoken|說話||speaked spoked
spend spent spent|花費||spended spented
spread spread spread|散布；塗抹||spreaded spreaden
stand stood stood|站||standed stooden
steal stole stolen|偷||stealed stoled
stick stuck stuck|黏；堅持||sticked stucken
strike struck struck|打擊；罷工||striked stroke
swim swam swum|游泳||swimmed swimed
take took taken|拿；花（時間）||taked tooken
teach taught taught|教||teached taughten
tear tore torn|撕||teared toren
tell told told|告訴||telled tolden
think thought thought|想||thinked thoughten
throw threw thrown|丟||throwed threwn
understand understood understood|理解||understanded understanden
wake woke woken|醒來|waked|woked wokened
wear wore worn|穿；戴||weared woren
win won won|贏||winned wonned
withdraw withdrew withdrawn|提領；撤回||withdrawed withdrewn
write wrote written|寫||writed wroten
overcome overcame overcome|克服||overcomed overcamed
undertake undertook undertaken|承擔；著手||undertaked undertooken
oversee oversaw overseen|監督||overseed oversawn
mislead misled misled|誤導||misleaded misleaden
`;

export const IRREGULARS: IrrVerb[] = RAW.trim()
  .split('\n')
  .map((line) => {
    const [forms, m, alt, extra] = line.trim().split('|');
    const [base, past, pp] = forms.split(' ');
    return { base, past, pp, m, alt: alt ? alt.split(' ') : [], extra: extra ? extra.split(' ') : [] };
  });

/** 照規則加 -ed（錯誤示範）：write → writed、study → studied */
export function regularized(base: string): string {
  if (base.endsWith('e')) return `${base}d`;
  if (/[^aeiou]y$/.test(base)) return `${base.slice(0, -1)}ied`;
  return `${base}ed`;
}

/** 三態的類型（說明用） */
function pattern(v: IrrVerb): string {
  if (v.base === v.past && v.past === v.pp) return 'AAA 型：三態都一樣';
  if (v.base === v.pp) return 'ABA 型：過去分詞和原形一樣';
  if (v.past === v.pp) return 'ABB 型：過去式和過去分詞一樣';
  return 'ABC 型：三態都不一樣';
}

const TRAPS: Record<string, string> = {
  lie: 'lie（躺）是 lie → lay → lain；lay（放置）是 lay → laid → laid；lie（說謊）是規則變化 lied。',
  lay: 'lay（放置，後面要接受詞）→ laid → laid；別和 lie（躺）→ lay → lain 搞混。',
  rise: 'rise（上升，不接受詞）→ rose → risen；raise（提高，要接受詞）是規則變化 raised。',
  find: 'find（找到）→ found → found；found 本身也是另一個規則動詞「創立」（found → founded）。',
  fall: 'fall（掉落）→ fell → fallen；fell 本身也是另一個規則動詞「砍倒」（felled）。',
  hang: 'hang（掛）→ hung → hung；當「吊死、處絞刑」時才用規則變化 hanged。',
  read: 'read 三態拼法都一樣，但過去式和過去分詞念成 /red/。',
  get: '過去分詞 gotten 是美式、got 是英式，兩個都對。',
  show: '過去分詞 shown 最常用，showed 也可以。',
};

export function irregularExplain(v: IrrVerb): string {
  return `${v.base} → ${v.past} → ${v.pp}（${v.m}）。${pattern(v)}。${TRAPS[v.base] ?? ''}`;
}

/** 某一格（過去式或過去分詞）的錯誤選項 */
export function irregularWrongs(v: IrrVerb, which: 'past' | 'pp'): string[] {
  const right = v[which];
  const other = which === 'past' ? v.pp : v.past;
  const ok = new Set([right, ...v.alt]);
  return [...new Set([other, regularized(v.base), ...v.extra, v.base])].filter((x) => !ok.has(x));
}

export function irregularQuestions(rng: Rng, mode: string, n: number): DrillQ[] {
  const out: DrillQ[] = [];
  const used = new Set<string>();
  for (let guard = 0; out.length < n && guard < n * 50; guard++) {
    const v = pick(IRREGULARS, rng);
    const which: 'past' | 'pp' = mode === 'past' ? 'past' : mode === 'pp' ? 'pp' : rng() < 0.5 ? 'past' : 'pp';
    const key = `${v.base}${which}`;
    const wrong = irregularWrongs(v, which);
    if (used.has(key) || wrong.length < 3) continue;
    used.add(key);
    // 前兩個錯誤選項（另一個時態、照規則加 -ed）一定放，最後一個從其他錯誤寫法挑
    const [first, second, ...rest] = wrong;
    out.push({
      prompt: v.base,
      hint: `${v.m}・${which === 'past' ? '過去式' : '過去分詞'}`,
      opts: [v[which], first, second, ...sample(rest, 1, rng)].filter(Boolean),
      explain: irregularExplain(v),
      say: `${v.base}, ${v.past}, ${v.pp}`,
    });
  }
  return out;
}
