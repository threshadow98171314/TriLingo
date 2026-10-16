// 聽日文歌學日語的歌單：Billboard Japan Hot 100（2026 年 10 月 14 日公布）榜上的歌，
// 都是官方頻道的 MV（確認可以嵌入播放）。這裡只放歌名、歌手和影片 id，不放歌詞。

export interface Song {
  id: string;
  title: string;
  artist: string;
  /** 歌名的中文意思 */
  zh: string;
  /** YouTube 影片 id（官方頻道） */
  yt: string;
  /** 榜上名次 */
  rank: number;
  /** 補充：主題曲、歌名的意思… */
  note?: string;
}

export const CHART_NAME = 'Billboard Japan Hot 100';
export const CHART_DATE = '2026 年 10 月 14 日公布';

export const SONGS: Song[] = [
  { id: 'ko1keyz', title: 'KO1KEYZ', artist: 'KO1KEYZ', zh: 'KO1KEYZ', yt: '75MEFldsJKc', rank: 1, note: '這週的冠軍，歌名和團名相同。' },
  { id: 'kyouhan', title: '共犯', artist: 'Mrs. GREEN APPLE', zh: '共犯', yt: 'zq9B35oai2w', rank: 2 },
  { id: 'musubi', title: '結び', artist: 'Ayumu Imazu', zh: '結（繫在一起）', yt: 'LnG4ekpYFug', rank: 5, note: '官方歌詞影片：畫面上就有日文歌詞，很適合跟著讀。' },
  { id: 'powerlove', title: 'ぱわーオブらぶ', artist: 'FRUITS ZIPPER', zh: '愛的力量（Power of Love）', yt: 'GGo__iXs4bA', rank: 6, note: '歌名把英文「power of love」用平假名寫，偶像歌常見的可愛寫法。' },
  { id: 'brandnew', title: 'Brand New', artist: 'Mrs. GREEN APPLE', zh: '全新的', yt: 'dePs7UPp6GQ', rank: 7 },
  { id: 'sukisugite', title: '好きすぎて滅！', artist: 'M!LK', zh: '喜歡到要毀滅了！', yt: 'ZVUxJsPfoX8', rank: 9, note: '「〜すぎて」＝太…以至於，日常會話超常用的句型。' },
  { id: 'shiwaawase', title: 'しわあわせ', artist: 'Vaundy', zh: '皺紋與幸福', yt: 'JwmGruvGt_I', rank: 10, note: '電影『ママがもうこの世界にいなくても 私の命の日記』主題歌。歌名是「しわ（皺紋）」和「しあわせ（幸福）」的文字遊戲。' },
  { id: 'unmei', title: '運命さがし', artist: 'マカロニえんぴつ', zh: '尋找命運', yt: '2AuJJ_hyclI', rank: 13, note: '「〜さがし」＝尋找…：「宝[たから]さがし」（尋寶）、「自分[じぶん]さがし」（尋找自我）。' },
  { id: 'myonly', title: 'マイオンリー', artist: 'SixTONES', zh: '我的唯一（My Only）', yt: '3lOsboT-IWU', rank: 18 },
  { id: 'goodday', title: 'GOOD DAY', artist: 'Mrs. GREEN APPLE', zh: '美好的一天', yt: 'TLJqi0IjMwo', rank: 22, note: '在第 76 回 NHK 紅白歌合戰演唱過。' },
  { id: 'mishiranu', title: '見知らぬ糸', artist: 'スピッツ', zh: '陌生的線', yt: 'sBAv1wx4ghE', rank: 23, note: 'TBS 金曜劇『Tシャツが乾くまで』主題歌。「見知らぬ」＝不認識的、陌生的。' },
  { id: 'yuzutsu', title: '夕星-ゆうづつ-', artist: 'RADWIMPS', zh: '黃昏之星', yt: 'L-tQ2lx27t8', rank: 24, note: '電影『汝、星のごとく』主題歌。「夕星」是傍晚最早出現的金星。' },
  { id: 'odoriko', title: '夜の踊り子', artist: 'サカナクション', zh: '夜之舞者', yt: '2I25AFSBm2g', rank: 25, note: '2012 年的歌，最近在網路上重新爆紅、回到排行榜。' },
  { id: 'koihajime', title: '恋、はじめました。', artist: '＝LOVE', zh: '戀愛，開始了。', yt: 'ikFaEAlO5N0', rank: 28, note: '歌名讓人聯想到店家常見的告示「冷[ひ]やし中華[ちゅうか]、はじめました。」（開始賣涼麵了）。' },
  { id: 'akanesasu', title: 'あかねさす頃', artist: 'ずっと真夜中でいいのに。', zh: '夕陽映紅的時候', yt: 'Z_k0hvdXYjM', rank: 29, note: '「あかねさす」是古典和歌裡形容陽光映紅的說法。' },
  { id: 'sparkle', title: 'スパークル', artist: 'RADWIMPS', zh: '閃耀（Sparkle）', yt: 'a2GujJZfXpg', rank: 30, note: '電影《你的名字。》的插曲，長青的經典名曲。' },
  { id: 'irisout', title: 'IRIS OUT', artist: '米津玄師', zh: '圓形淡出（電影轉場手法）', yt: 'LmZD-TU96q4', rank: 40, note: '劇場版『チェンソーマン レゼ篇』主題歌，2026 上半年 Billboard Japan 年中榜第一名。' },
];

export const SONG_BY_ID = new Map(SONGS.map((s) => [s.id, s]));
