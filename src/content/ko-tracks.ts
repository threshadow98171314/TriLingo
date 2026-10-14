// 韓文主題路線：對應「去韓國旅遊能正常溝通」與「看韓劇、綜藝不用字幕」兩個目標。
import type { Unit } from '../core/types';
import { ko, vocabUnit } from './dsl';

const H = (hanja: string) => ({ note: `漢字詞：${hanja}` });
const P = { kind: 'phrase' as const };

export const KO_TRAVEL_UNITS: Unit[] = [
  vocabUnit(
    'ko.travel.basic',
    '🙋',
    '基本應對',
    '走到哪都用得到',
    [
      ko('이거 주세요', 'igeo juseyo', '請給我這個'),
      ko('얼마예요?', 'eolmayeyo', '多少錢？', undefined, P),
      ko('화장실이 어디예요?', 'hwajangsiri eodiyeyo', '洗手間在哪裡？'),
      ko('영어 메뉴 있어요?', 'yeongeo menyu isseoyo', '有英文菜單嗎？'),
      ko('계산해 주세요', 'gyesanhae juseyo', '請幫我結帳'),
      ko('카드 돼요?', 'kadeu dwaeyo', '可以刷卡嗎？'),
      ko('다시 한번 말해 주세요', 'dasi hanbeon malhae juseyo', '請再說一次'),
      ko('한국어를 조금 해요', 'hangugeoreul jogeum haeyo', '我會一點韓文'),
      ko('사진 찍어도 돼요?', 'sajin jjigeodo dwaeyo', '可以拍照嗎？'),
      ko('필요 없어요', 'piryo eopseoyo', '不需要'),
      ko('도와주세요', 'dowajuseyo', '請幫幫我', undefined, P),
      ko('저기요', 'jeogiyo', '不好意思（叫店員、叫住人）', undefined, P),
    ],
    { chunk: 4, kind: 'phrases' },
  ),
  vocabUnit(
    'ko.travel.dining',
    '🍲',
    '餐廳點餐',
    '從入座到結帳',
    [
      ko('두 명이에요', 'du myeongieyo', '兩位'),
      ko('메뉴판 좀 주세요', 'menyupan jom juseyo', '請給我菜單'),
      ko('추천해 주세요', 'chucheonhae juseyo', '請推薦一下'),
      ko('이거 매워요?', 'igeo maewoyo', '這個會辣嗎？'),
      ko('안 맵게 해 주세요', 'an maepge hae juseyo', '請做不辣的'),
      ko('물 좀 주세요', 'mul jom juseyo', '請給我水'),
      ko('포장해 주세요', 'pojanghae juseyo', '請幫我打包（外帶）'),
      ko('맛있어요', 'masisseoyo', '很好吃', undefined, P),
      ko('여기 불고기 이 인분 주세요', 'yeogi bulgogi i inbun juseyo', '這裡請給我兩人份的烤肉'),
      ko('따로 계산해 주세요', 'ttaro gyesanhae juseyo', '請分開結帳'),
    ],
    { kind: 'phrases' },
  ),
  vocabUnit(
    'ko.travel.transit',
    '🚇',
    '交通',
    '地鐵、計程車與問路',
    [
      ko('이 지하철 명동에 가요?', 'i jihacheol myeongdonge gayo', '這班地鐵到明洞嗎？'),
      ko('표는 어디에서 사요?', 'pyoneun eodieseo sayo', '票在哪裡買？'),
      ko('다음 역이 어디예요?', 'daeum yeogi eodiyeyo', '下一站是哪裡？'),
      ko('공항까지 가 주세요', 'gonghangkkaji ga juseyo', '請到機場'),
      ko('얼마나 걸려요?', 'eolmana geollyeoyo', '要多久？'),
      ko('여기서 내려요', 'yeogiseo naeryeoyo', '我在這裡下車'),
      ko('길을 잃었어요', 'gireul ireosseoyo', '我迷路了'),
      ko('여기가 어디예요?', 'yeogiga eodiyeyo', '這裡是哪裡？'),
    ],
    { chunk: 4, kind: 'phrases' },
  ),
];

export const KO_DRAMA_UNITS: Unit[] = [
  vocabUnit('ko.drama.words', '⚡', '韓劇高頻詞', '一集裡會聽到好幾次', [
    ko('진짜', 'jinjja', '真的'),
    ko('대박', 'daebak', '太讚了；不得了'),
    ko('어떡해', 'eotteokae', '怎麼辦'),
    ko('괜찮아', 'gwaenchana', '沒關係；沒事（半語）'),
    ko('사랑해', 'saranghae', '我愛你'),
    ko('미안해', 'mianhae', '對不起（半語）'),
    ko('고마워', 'gomawo', '謝謝（半語）'),
    ko('가자', 'gaja', '走吧'),
    ko('잠깐만', 'jamkkanman', '等一下'),
    ko('왜', 'wae', '為什麼'),
    ko('뭐', 'mwo', '什麼'),
    ko('아이고', 'aigo', '哎呀'),
    ko('화이팅', 'hwaiting', '加油', undefined, { note: '來自英文 fighting，也寫作 파이팅。' }),
    ko('하지 마', 'haji ma', '不要這樣'),
    ko('말도 안 돼', 'maldo an dwae', '太扯了；不像話'),
    ko('헐', 'heol', '傻眼（表示驚訝）'),
    ko('보고 싶어', 'bogo sipeo', '好想你'),
    ko('걱정 마', 'geokjeong ma', '別擔心'),
    ko('알았어', 'arasseo', '知道了'),
    ko('몰라', 'molla', '不知道'),
  ]),
  vocabUnit('ko.drama.titles', '🗣️', '稱呼與關係', '聽稱呼就知道兩人的關係', [
    ko('선배', 'seonbae', '前輩；學長姊', undefined, H('先輩')),
    ko('후배', 'hubae', '後輩；學弟妹', undefined, H('後輩')),
    ko('아저씨', 'ajeossi', '大叔'),
    ko('아줌마', 'ajumma', '大嬸；阿姨'),
    ko('사장님', 'sajangnim', '老闆；社長', undefined, H('社長＋敬稱 님')),
    ko('여보', 'yeobo', '老公；老婆（夫妻互稱）'),
    ko('자기야', 'jagiya', '親愛的（情侶之間）'),
    ko('남자 친구', 'namja chingu', '男朋友'),
    ko('여자 친구', 'yeoja chingu', '女朋友'),
    ko('막내', 'mangnae', '老么', undefined, { note: '發音變化：ㄱ 遇到 ㄴ 會變成 ㅇ，唸作 mangnae。' }),
  ]),
];
