// 英文：以多益 TOEIC 證書顏色分級。橘 → 棕 → 綠 → 藍 → 金（最高，860–990）
import type { Unit } from '../core/types';
import { cz, en, grammarUnit, note, qa, vocabUnit } from './dsl';
import { BLUE_UNITS } from './en-blue';
import { BROWN_UNITS } from './en-brown';
import { GREEN_UNITS } from './en-green';
import { DRILL_LR } from './en-drill-lr';
import { DRILL_P5A } from './en-drill-p5a';
import { DRILL_P5B } from './en-drill-p5b';
import { DRILL_P5C } from './en-drill-p5c';
import { TOWN_UNITS } from './en-town';

// ───────── 橘色證書（10–215）：基礎起步 ─────────

const office = vocabUnit('en.orange.office', '🏢', '辦公室', 'Office Basics', [
  en('office', 'n.', '辦公室', 'She works in a small office.|她在一間小辦公室工作。'),
  en('desk', 'n.', '書桌；辦公桌', 'The report is on your desk.|報告在你的桌上。'),
  en('computer', 'n.', '電腦', 'My computer is very slow today.|我的電腦今天很慢。'),
  en('printer', 'n.', '印表機', 'The printer is out of paper.|印表機沒紙了。'),
  en('meeting', 'n.', '會議', 'The meeting starts at ten.|會議十點開始。'),
  en('email', 'n.', '電子郵件', 'I will send you an email.|我會寄電子郵件給你。'),
  en('document', 'n.', '文件', 'Please sign this document.|請簽署這份文件。'),
  en('schedule', 'n.', '行程表；時間表', 'Let me check my schedule.|讓我看一下我的行程。'),
  en('copy', 'n./v.', '影本；影印', 'Can you make a copy of this?|你可以影印這個嗎？'),
  en('report', 'n.', '報告', 'The report is due on Friday.|報告星期五要交。'),
]);

const people = vocabUnit('en.orange.people', '👔', '職場人物', 'People at Work', [
  en('manager', 'n.', '經理', 'The manager is in a meeting.|經理正在開會。'),
  en('employee', 'n.', '員工', 'The company has fifty employees.|這家公司有五十名員工。'),
  en('customer', 'n.', '顧客', 'The customer asked for a refund.|顧客要求退款。'),
  en('client', 'n.', '客戶', 'We have a meeting with a client.|我們和客戶有個會議。'),
  en('staff', 'n.', '全體職員', 'The hotel staff is very friendly.|飯店的員工非常友善。'),
  en('assistant', 'n.', '助理', 'My assistant will call you.|我的助理會打電話給你。'),
  en('colleague', 'n.', '同事', 'He is having lunch with a colleague.|他正在和同事吃午餐。'),
  en('supervisor', 'n.', '主管', 'Please ask your supervisor first.|請先詢問你的主管。'),
  en('receptionist', 'n.', '接待員', 'The receptionist answered the phone.|接待員接了電話。'),
  en('visitor', 'n.', '訪客', 'All visitors must sign in.|所有訪客都必須簽到。'),
]);

const time = vocabUnit('en.orange.time', '⏰', '時間與日期', 'Time & Dates', [
  en('today', 'adv./n.', '今天', 'I am very busy today.|我今天很忙。'),
  en('tomorrow', 'adv./n.', '明天', 'The store opens at nine tomorrow.|這家店明天九點開門。'),
  en('yesterday', 'adv./n.', '昨天', 'I sent the email yesterday.|我昨天寄了那封電子郵件。'),
  en('weekend', 'n.', '週末', 'The office is closed on weekends.|辦公室週末不開放。'),
  en('deadline', 'n.', '截止期限', 'The deadline is next Monday.|截止期限是下週一。'),
  en('appointment', 'n.', '預約；約定的會面', 'I have an appointment at three.|我三點有預約。'),
  en('early', 'adj./adv.', '早的；提早', 'She came to work early.|她提早來上班。'),
  en('late', 'adj./adv.', '晚的；遲到', 'The train is ten minutes late.|火車誤點十分鐘。'),
  en('daily', 'adj./adv.', '每日的；每天', 'We have a daily meeting.|我們每天都有會議。'),
  en('holiday', 'n.', '假日', 'The bank is closed on holidays.|銀行在假日不營業。'),
]);

const money = vocabUnit('en.orange.money', '💳', '購物與金錢', 'Shopping & Money', [
  en('price', 'n.', '價格', 'What is the price of this bag?|這個包包的價格是多少？'),
  en('pay', 'v.', '付款', 'Can I pay by credit card?|我可以用信用卡付款嗎？'),
  en('buy', 'v.', '買', 'I want to buy a new phone.|我想買一支新手機。'),
  en('sell', 'v.', '賣', 'They sell office supplies.|他們販售辦公用品。'),
  en('cheap', 'adj.', '便宜的', 'This hotel is clean and cheap.|這間飯店又乾淨又便宜。'),
  en('expensive', 'adj.', '昂貴的', 'The ticket is too expensive.|這張票太貴了。'),
  en('discount', 'n.', '折扣', 'Members get a ten percent discount.|會員可享九折優惠。'),
  en('receipt', 'n.', '收據', 'Please keep your receipt.|請保留您的收據。'),
  en('cash', 'n.', '現金', 'We only accept cash.|我們只收現金。'),
  en('order', 'n./v.', '訂單；訂購', 'Your order will arrive tomorrow.|您的訂單明天會送達。'),
]);

const travel = vocabUnit('en.orange.travel', '✈️', '交通與旅行', 'Travel', [
  en('airport', 'n.', '機場', 'How do I get to the airport?|我要怎麼去機場？'),
  en('ticket', 'n.', '票', 'I bought a train ticket online.|我在網路上買了火車票。'),
  en('flight', 'n.', '航班', 'Our flight leaves at noon.|我們的航班中午起飛。'),
  en('station', 'n.', '車站', 'The station is near the hotel.|車站在飯店附近。'),
  en('reservation', 'n.', '預約；訂位', 'I have a reservation for two nights.|我訂了兩晚。'),
  en('passport', 'n.', '護照', 'May I see your passport?|可以看一下您的護照嗎？'),
  en('luggage', 'n.', '行李', 'You can leave your luggage here.|您可以把行李放在這裡。'),
  en('arrive', 'v.', '抵達', 'We will arrive at six.|我們六點會抵達。'),
  en('leave', 'v.', '離開；出發', 'The bus leaves in five minutes.|公車五分鐘後出發。'),
  en('delay', 'n./v.', '延誤', 'There is a short delay.|有短暫的延誤。'),
]);

const dining = vocabUnit('en.orange.dining', '🍽️', '餐廳', 'Dining', [
  en('menu', 'n.', '菜單', 'Could I see the menu, please?|可以給我看菜單嗎？'),
  en('waiter', 'n.', '服務生', 'The waiter brought some water.|服務生拿了一些水來。'),
  en('bill', 'n.', '帳單', 'Can we have the bill, please?|可以給我們帳單嗎？'),
  en('meal', 'n.', '餐點；一餐', 'The meal was delicious.|這頓餐點很美味。'),
  en('breakfast', 'n.', '早餐', 'Breakfast is served until ten.|早餐供應到十點。'),
  en('dessert', 'n.', '甜點', 'Would you like some dessert?|您想來點甜點嗎？'),
  en('drink', 'n./v.', '飲料；喝', 'What would you like to drink?|您想喝點什麼？'),
  en('table', 'n.', '桌子；餐桌', 'A table for two, please.|兩位，謝謝。'),
  en('delicious', 'adj.', '美味的', 'This soup is delicious.|這湯很好喝。'),
  en('tip', 'n.', '小費', 'He left a tip for the waiter.|他留了小費給服務生。'),
]);

const verbs = vocabUnit('en.orange.verbs', '🏃', '常用動詞', 'Common Verbs', [
  en('send', 'v.', '寄送', 'Please send me the file.|請把檔案寄給我。'),
  en('receive', 'v.', '收到', 'Did you receive my message?|你有收到我的訊息嗎？'),
  en('call', 'v.', '打電話', 'I will call you back later.|我晚點回電給你。'),
  en('visit', 'v.', '拜訪；參觀', 'We will visit the factory tomorrow.|我們明天將參觀工廠。'),
  en('open', 'v.', '打開；開始營業', 'The shop opens at ten.|這家店十點開始營業。'),
  en('close', 'v.', '關閉', 'Please close the door.|請關門。'),
  en('start', 'v.', '開始', 'The class starts at seven.|課程七點開始。'),
  en('finish', 'v.', '完成', 'I finished the report.|我完成了報告。'),
  en('need', 'v.', '需要', 'I need more time.|我需要更多時間。'),
  en('help', 'v./n.', '幫助', 'Can you help me with this box?|你可以幫我搬這個箱子嗎？'),
]);

const adjectives = vocabUnit('en.orange.adj', '🎨', '常用形容詞', 'Common Adjectives', [
  en('busy', 'adj.', '忙碌的', 'The manager is busy now.|經理現在很忙。'),
  en('free', 'adj.', '有空的；免費的', 'Are you free this afternoon?|你今天下午有空嗎？'),
  en('easy', 'adj.', '容易的', 'The test was easy.|這個測驗很簡單。'),
  en('difficult', 'adj.', '困難的', 'This question is difficult.|這個問題很難。'),
  en('important', 'adj.', '重要的', 'This is an important meeting.|這是一場重要的會議。'),
  en('ready', 'adj.', '準備好的', 'Your order is ready.|您訂的東西準備好了。'),
  en('available', 'adj.', '可用的；有空的', 'Is this seat available?|這個座位是空的嗎？'),
  en('full', 'adj.', '滿的', 'The parking lot is full.|停車場滿了。'),
  en('quick', 'adj.', '快速的', 'Thank you for your quick reply.|感謝您的迅速回覆。'),
  en('quiet', 'adj.', '安靜的', 'Please be quiet in the library.|在圖書館請保持安靜。'),
]);

const g1 = grammarUnit('en.orange.g1', '📝', '文法①：be 動詞與現在簡單式', 'Part 5 入門', [
  {
    title: 'be 動詞',
    notes: [
      note(
        'be 動詞：am / is / are',
        [
          '主詞決定 be 動詞：I → am；He / She / It 或單數名詞 → is；You / We / They 或複數名詞 → are。',
          '否定在 be 動詞後面加 not；疑問句把 be 動詞移到句首。',
        ],
        ['She is a manager.|她是經理。', 'They are not in the office.|他們不在辦公室。', 'Are you free today?|你今天有空嗎？'],
      ),
    ],
    items: [
      cz('She ___ a manager at a bank.', ['is', 'am', 'are', 'be'], '她是銀行的經理。', '主詞 She 是第三人稱單數，be 動詞用 is。'),
      cz('They ___ in the meeting room now.', ['are', 'is', 'am', 'be'], '他們現在在會議室。', '主詞 They 是複數，be 動詞用 are。'),
      cz('I ___ ready for the meeting.', ['am', 'is', 'are', 'be'], '我準備好開會了。', '主詞 I 固定搭配 am。'),
      cz('We ___ not open on Sundays.', ['are', 'is', 'does', 'am'], '我們星期日不營業。', 'open 在這裡是形容詞（營業中），主詞 We 搭配 are。'),
      cz('___ you free tomorrow afternoon?', ['Are', 'Is', 'Am', 'Do'], '你明天下午有空嗎？', 'free 是形容詞，疑問句要用 be 動詞；主詞 you 搭配 Are。'),
    ],
  },
  {
    title: '現在簡單式',
    notes: [
      note(
        '現在簡單式：習慣與事實',
        [
          '主詞是第三人稱單數（he / she / it / 單數名詞）時，動詞要加 -s 或 -es：go → goes、open → opens、have → has。',
          '否定用 do not / does not ＋ 原形動詞；疑問句用 Do / Does 開頭。',
        ],
        ['He goes to work by bus.|他搭公車上班。', 'Does she work here?|她在這裡工作嗎？', 'The printer does not work.|印表機壞了。'],
      ),
    ],
    items: [
      cz('He ___ to work by bus every day.', ['goes', 'go', 'going', 'gone'], '他每天搭公車上班。', '主詞 He 是第三人稱單數，現在簡單式動詞加 -es。'),
      cz('The store ___ at nine every morning.', ['opens', 'open', 'opening', 'to open'], '這家店每天早上九點開門。', 'The store 是單數名詞，動詞加 -s。'),
      cz('___ she work in this office?', ['Does', 'Do', 'Is', 'Are'], '她在這間辦公室工作嗎？', '一般動詞 work 的疑問句用助動詞；主詞 she 用 Does。'),
      cz('My colleagues ___ lunch at noon.', ['have', 'has', 'is having', 'having'], '我的同事們中午吃午餐。', 'colleagues 是複數，用原形 have。'),
      cz('The printer ___ not work.', ['does', 'do', 'is', 'are'], '印表機不能用。', '一般動詞的否定：does not ＋ 原形動詞；主詞是單數。'),
    ],
  },
]);

const g2 = grammarUnit('en.orange.g2', '📍', '文法②：時間與地點介系詞', 'at / on / in', [
  {
    title: '時間：at / on / in',
    notes: [
      note(
        '時間介系詞',
        [
          'at ＋ 時間點：at 9:00、at noon、at night。',
          'on ＋ 星期與日期：on Monday、on July 1st。',
          'in ＋ 月份、年份、季節、一天中的時段：in June、in 2026、in the afternoon。',
          '慣用語：on time（準時）。',
        ],
        ['The meeting starts at 10 a.m.|會議上午十點開始。', 'The office is closed on Sunday.|辦公室星期日不開放。'],
      ),
    ],
    items: [
      cz('The meeting starts ___ 10 a.m.', ['at', 'on', 'in', 'to'], '會議上午十點開始。', '明確的時間點用 at。'),
      cz('The office is closed ___ Sunday.', ['on', 'at', 'in', 'for'], '辦公室星期日不開放。', '星期幾用 on。'),
      cz('She joined the company ___ 2020.', ['in', 'at', 'on', 'by'], '她在 2020 年加入公司。', '年份用 in。'),
      cz('The sale begins ___ July 1st.', ['on', 'at', 'in', 'of'], '特賣從七月一日開始。', '特定日期用 on。'),
      cz('He usually takes a break ___ the afternoon.', ['in', 'at', 'on', 'by'], '他通常在下午休息。', 'in the morning / afternoon / evening 是固定用法。'),
      cz('The bank closes ___ noon.', ['at', 'on', 'in', 'for'], '銀行中午關門。', 'noon（正午）是時間點，用 at。'),
    ],
  },
  {
    title: '地點：at / on / in',
    notes: [
      note(
        '地點介系詞',
        [
          'at ＋ 一個「點」：at the airport、at the station、at the door。',
          'on ＋ 表面：on the desk、on the wall、on the second floor。',
          'in ＋ 空間或大範圍：in the room、in Taipei、in the box。',
        ],
        ['I will see you at the airport.|我們機場見。', 'The report is on the desk.|報告在桌上。'],
      ),
    ],
    items: [
      cz('I will see you ___ the airport.', ['at', 'on', 'to', 'of'], '我們機場見。', '把機場當成一個會面的地點，用 at。'),
      cz('The report is ___ the desk.', ['on', 'in', 'at', 'to'], '報告在桌上。', '在物體表面上用 on。'),
      cz('Our store is ___ Taipei.', ['in', 'at', 'on', 'to'], '我們的店在台北。', '城市、國家等大範圍用 in。'),
      cz('Please arrive ___ time.', ['on', 'at', 'in', 'by'], '請準時抵達。', 'on time 是慣用語，意思是「準時」。'),
    ],
  },
]);

const g3 = grammarUnit('en.orange.g3', '⏳', '文法③：過去式與未來式', 'Tenses', [
  {
    title: '過去簡單式',
    notes: [
      note(
        '過去簡單式',
        [
          '規則動詞加 -ed：visit → visited、finish → finished。',
          '常見不規則動詞：go → went、send → sent、buy → bought、leave → left、is/am → was、are → were。',
          '否定與疑問用 did：did not ＋ 原形、Did ＋ 主詞 ＋ 原形？',
          '常見時間詞：yesterday、last week、two hours ago。',
        ],
        ['I sent the email yesterday.|我昨天寄了那封電子郵件。', 'Did you finish the report?|你完成報告了嗎？'],
      ),
    ],
    items: [
      cz('I ___ the email yesterday.', ['sent', 'send', 'sends', 'sending'], '我昨天寄了那封電子郵件。', 'yesterday 表示過去，send 的過去式是 sent。'),
      cz('They ___ a new printer last week.', ['bought', 'buy', 'buys', 'will buy'], '他們上週買了一台新印表機。', 'last week 表示過去，buy 的過去式是 bought。'),
      cz('He ___ late for work this morning.', ['was', 'is', 'were', 'be'], '他今天早上上班遲到了。', '已經過去的今天早上用過去式；主詞 He 用 was。'),
      cz('___ you finish the report yesterday?', ['Did', 'Do', 'Does', 'Will'], '你昨天完成報告了嗎？', '過去式的疑問句用 Did ＋ 原形動詞。'),
      cz('The flight ___ two hours ago.', ['left', 'leaves', 'will leave', 'leave'], '航班兩小時前起飛了。', 'ago 表示過去，leave 的過去式是 left。'),
      cz('I ___ not go to the office last Friday.', ['did', 'do', 'does', 'will'], '我上週五沒有去辦公室。', '過去式的否定：did not ＋ 原形動詞。'),
    ],
  },
  {
    title: '未來式',
    notes: [
      note(
        '未來式：will 與 be going to',
        [
          'will ＋ 原形動詞：表示未來會發生的事或當下的決定。',
          'be going to ＋ 原形動詞：表示已經計畫好的事。',
          '常見時間詞：tomorrow、next week、later。',
        ],
        ['She will visit the client next Monday.|她下週一會去拜訪客戶。', 'We are going to have a meeting tomorrow.|我們明天要開會。'],
      ),
    ],
    items: [
      cz('She ___ the client next Monday.', ['will visit', 'visited', 'visit', 'visiting'], '她下週一會去拜訪客戶。', 'next Monday 表示未來，用 will ＋ 原形動詞。'),
      cz('We ___ going to have a meeting tomorrow.', ['are', 'is', 'was', 'be'], '我們明天要開會。', 'be going to 的 be 動詞隨主詞變化；We 搭配 are。'),
      cz('The manager will ___ you later.', ['call', 'calls', 'called', 'calling'], '經理晚點會打電話給你。', '助動詞 will 後面一定接原形動詞。'),
      cz('Our new store ___ open next month.', ['will', 'did', 'was', 'does'], '我們的新店下個月開幕。', 'next month 表示未來，用 will。'),
    ],
  },
]);

const PART2_NOTE = note(
  '多益 Part 2：應答問題',
  [
    '聽一個問題，選出最適當的回應。關鍵是抓住句首的疑問詞：',
    'Where → 地點；When → 時間；Who → 人；How much → 價錢；How long → 多久；Why → 原因。',
    '以疑問詞開頭的問題，不會用 Yes / No 回答，聽到可以直接刪去。',
  ],
  ['Where is the meeting room? — On the second floor.|會議室在哪裡？— 在二樓。'],
);

const listening = grammarUnit(
  'en.orange.listen',
  '🎧',
  '聽力：簡短應答',
  'Part 2 入門',
  [
    {
      title: '疑問詞 ①',
      notes: [PART2_NOTE],
      items: [
        qa('Where is the meeting room?', ['On the second floor.', "At ten o'clock.", 'Yes, I am.'], '會議室在哪裡？', 'Where 問地點，要回答位置。'),
        qa('When does the store open?', ['At nine a.m.', 'Near the station.', 'By credit card.'], '這家店幾點開門？', 'When 問時間，要回答時間點。'),
        qa('Who is the new manager?', ['Ms. Lin is.', 'Next Monday.', 'In the office.'], '新的經理是誰？', 'Who 問人，要回答人名或職稱。'),
        qa('How much is this ticket?', ["It's twenty dollars.", "It's very far.", 'For two hours.'], '這張票多少錢？', 'How much 問價錢。'),
        qa('Would you like some coffee?', ['Yes, please.', "It's on the desk.", 'He is busy.'], '您想來點咖啡嗎？', 'Would you like…? 是提議，回答接受或婉拒。'),
      ],
    },
    {
      title: '疑問詞 ②',
      items: [
        qa('How do you go to work?', ['By bus.', 'At eight.', 'I work at a bank.'], '你怎麼去上班？', 'How 在這裡問交通方式。'),
        qa('Can you help me with this report?', ['Sure, no problem.', 'It was yesterday.', 'At the front desk.'], '你可以幫我處理這份報告嗎？', 'Can you…? 是請求，回答願意或不方便。'),
        qa('Why are you late?', ['Because the train was delayed.', 'At the station.', 'Yes, I am late.'], '你為什麼遲到？', 'Why 問原因；疑問詞問句不會用 Yes / No 回答。'),
        qa('Whose bag is this?', ["It's mine.", "It's black.", 'On the table.'], '這是誰的包包？', 'Whose 問所有者。'),
        qa('How long is the flight?', ['About three hours.', 'Two hundred dollars.', 'At gate five.'], '航程多久？', 'How long 問時間長度。'),
      ],
    },
  ],
  'listening',
);

/** 各關卡的單元（關卡名稱、說明、預定大綱在 meta.ts） */
export const UNITS: Record<string, Unit[]> = {
  'en.orange': [office, people, g1, time, money, g2, travel, dining, verbs, g3, adjectives, listening],
  'en.brown': BROWN_UNITS,
  'en.green': GREEN_UNITS,
  'en.blue': BLUE_UNITS,
  'en.drill': [...DRILL_P5A, ...DRILL_P5B, ...DRILL_P5C, ...DRILL_LR],
  'en.town': TOWN_UNITS,
};

export { EN_MOCKS as MOCKS } from './en-mock';
export { CONCEPTS } from './en-concepts';
