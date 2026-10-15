// 英文情境小鎮（職場與生活情境）：16 個多益常考的地點，每個地點有單字（第一個是地點本身）、對話與解題提示。
// 地點的順序就是地圖上的排列（一排四個）。
import type { Unit } from '../core/types';
import { enList, note, placeUnit, ss } from './dsl';

export const TOWN_UNITS: Unit[] = [
  placeUnit(
    'en.town.station',
    '🚉',
    '車站',
    note('Train station：車站', [
      '多益 Part 1 常見車站照片：Passengers are waiting on the platform.（乘客在月台等車）。',
      '問路：How do I get to …?；問月台：Which platform does the train to … leave from?',
      '廣播常聽到 delayed（延誤）、canceled（取消）、departing（即將出發），是 Part 4 公告題的常客。',
    ]),
    enList(`
      train station|n.|火車站|The train station is a ten-minute walk from here.|火車站離這裡走路十分鐘。
      platform|n.|月台|The train to Boston leaves from platform three.|開往波士頓的火車從三號月台出發。
      ticket|n.|車票|I bought a round-trip ticket.|我買了來回票。
      delay|n./v.|延誤|The train was delayed by twenty minutes.|火車延誤了二十分鐘。
      transfer|v.|轉乘|You need to transfer at Central Station.|你需要在中央車站轉車。
      departure|n.|出發|The departure time has changed.|出發時間改了。
      commuter|n.|通勤者|The train is crowded with commuters.|火車上擠滿了通勤族。
    `),
    [
      ss('Excuse me, how do I get to the city museum?', '不好意思，請問市立博物館怎麼去？', '你'),
      ss('Take the green line and get off at Park Street.', '搭綠線，在公園街下車。', '站務員'),
      ss('Which platform does the express train leave from?', '快車從哪個月台出發？', '你'),
      ss('The next train is delayed by ten minutes.', '下一班車延誤十分鐘。', '廣播'),
      ss('Please stand behind the yellow line.', '請站在黃線後方。', '廣播'),
    ],
  ),
  placeUnit(
    'en.town.konbini',
    '🏪',
    '便利商店',
    note('Convenience store：便利商店', [
      '結帳時店員常問：Would you like a bag?、Cash or card?、Do you need a receipt?',
      '報價的固定說法：That’ll be four fifty.（一共四塊五）。',
      '多益 Part 2 常考：Do you have this in a larger size? → Let me check in the back.（我去後面倉庫看看）。',
    ]),
    enList(`
      convenience store|n.|便利商店|I grabbed a sandwich at the convenience store.|我在便利商店買了個三明治。
      cashier|n.|收銀員|The cashier gave me my change.|收銀員把零錢找給我。
      receipt|n.|收據|Please keep your receipt.|請保留收據。
      change|n.|找的零錢|Here is your change.|這是找您的零錢。
      snack|n.|零食|I bought some snacks for the trip.|我買了些路上吃的零食。
      discount|n.|折扣|Members get a five percent discount.|會員打九五折。
      plastic bag|n.|塑膠袋|Plastic bags cost ten cents each.|塑膠袋一個十分錢。
    `),
    [
      ss('Would you like a bag?', '需要袋子嗎？', '店員'),
      ss('No, thanks. I have my own.', '不用，謝謝，我有自己的袋子。', '你'),
      ss('Cash or card?', '付現還是刷卡？', '店員'),
      ss('Card, please.', '刷卡，謝謝。', '你'),
      ss('Do you need a receipt?', '需要收據嗎？', '店員'),
    ],
  ),
  placeUnit(
    'en.town.cafe',
    '☕',
    '咖啡廳',
    note('Coffee shop：咖啡廳', [
      '點餐用 Can I get a medium latte? 或 I’d like an iced americano.，比 I want… 更有禮貌。',
      '店員會問 For here or to go?（內用還是外帶），回答 To go, please.',
      '多益常把咖啡廳當成同事碰面、和客戶開會的地方：Let’s meet at the café across the street.',
    ]),
    enList(`
      coffee shop|n.|咖啡廳|We met at a coffee shop near the office.|我們在辦公室附近的咖啡廳碰面。
      order|v./n.|點餐；訂購|Are you ready to order?|準備好點餐了嗎？
      to go|phr.|外帶|I'll have a latte to go.|我要一杯外帶拿鐵。
      refill|n.|續杯|Refills are free.|續杯免費。
      decaf|adj.|低咖啡因的|I'll have a decaf coffee.|我要一杯低咖啡因咖啡。
      pastry|n.|糕點|The café sells fresh pastries.|這家咖啡廳賣新鮮糕點。
      counter|n.|櫃台|Please pick up your drink at the counter.|請到櫃台取飲料。
    `),
    [
      ss('Can I get a medium iced latte?', '可以給我一杯中杯冰拿鐵嗎？', '你'),
      ss('For here or to go?', '內用還是外帶？', '店員'),
      ss('To go, please.', '外帶，謝謝。', '你'),
      ss('Can I have your name for the order?', '可以告訴我您的名字嗎？', '店員'),
      ss('Your drink will be ready at the counter.', '您的飲料會在櫃台準備好。', '店員'),
    ],
  ),
  placeUnit(
    'en.town.hotel',
    '🏨',
    '飯店',
    note('Hotel：飯店', [
      '多益超常考飯店：訂房 reservation、入住 check in、退房 check out、客房服務 room service。',
      '入住時最好用的一句：I have a reservation under the name Lin.',
      'amenities（設施）、complimentary（免費招待的）是 Part 7 飯店廣告的高頻字。',
    ]),
    enList(`
      hotel|n.|飯店|The hotel is close to the convention center.|飯店離會展中心很近。
      reservation|n.|預約|I made a reservation for two nights.|我訂了兩晚。
      check in|v.|入住|You can check in after three o'clock.|三點以後可以入住。
      front desk|n.|櫃台|Please leave your key at the front desk.|請把鑰匙留在櫃台。
      complimentary|adj.|免費招待的|Breakfast is complimentary for all guests.|所有房客免費享用早餐。
      amenities|n.|設施|The hotel's amenities include a pool and a gym.|飯店設施包括游泳池和健身房。
      room service|n.|客房服務|I ordered room service last night.|我昨晚叫了客房服務。
    `),
    [
      ss('I have a reservation under the name Lin.', '我有用林這個名字訂房。', '你'),
      ss('Could I see your passport, please?', '可以看一下您的護照嗎？', '櫃台人員'),
      ss('What time is breakfast served?', '早餐幾點供應？', '你'),
      ss('Could you keep my luggage after I check out?', '退房後可以幫我保管行李嗎？', '你'),
      ss('Of course. Here is your claim tag.', '當然，這是您的行李牌。', '櫃台人員'),
    ],
  ),
  placeUnit(
    'en.town.post',
    '📮',
    '郵局',
    note('Post office：郵局', [
      '寄東西：I’d like to send this package to Taiwan.；問時間：How long will it take to arrive?',
      '多益常見 express mail（快捷）、registered mail（掛號）、tracking number（追蹤號碼）。',
      'Part 7 常出現出貨延誤的信件：shipment（貨物）、delivery（遞送）、be shipped（寄出）。',
    ]),
    enList(`
      post office|n.|郵局|The post office closes at five.|郵局五點關門。
      package|n.|包裹|I need to pick up a package.|我需要去領包裹。
      stamp|n.|郵票|I bought ten stamps.|我買了十張郵票。
      envelope|n.|信封|Put the letter in an envelope.|把信放進信封。
      express mail|n.|快捷郵件|Express mail takes two days.|快捷郵件要兩天。
      tracking number|n.|追蹤號碼|Here is your tracking number.|這是您的追蹤號碼。
      deliver|v.|遞送|The package will be delivered tomorrow.|包裹明天會送達。
    `),
    [
      ss("I'd like to send this package to Taiwan.", '我想把這個包裹寄到台灣。', '你'),
      ss('Would you like to send it by air or by sea?', '要寄航空還是海運？', '職員'),
      ss('By air, please.', '航空，謝謝。', '你'),
      ss('How long will it take to arrive?', '大概多久會到？', '你'),
      ss('It usually takes about a week.', '通常大約一週。', '職員'),
    ],
  ),
  placeUnit(
    'en.town.bank',
    '🏦',
    '銀行',
    note('Bank：銀行', [
      '多益銀行情境：open an account（開戶）、deposit（存款）、withdraw（提款）、transfer（轉帳）。',
      '換錢說 I’d like to exchange some money.，匯率是 exchange rate。',
      'Part 7 常見帳單與通知：balance（餘額）、statement（對帳單）、due date（到期日）。',
    ]),
    enList(`
      bank|n.|銀行|The bank is open until four.|銀行營業到四點。
      account|n.|帳戶|I opened a savings account.|我開了一個儲蓄帳戶。
      deposit|v./n.|存款|I deposited my paycheck.|我把薪水存了進去。
      withdraw|v.|提款|I need to withdraw some cash.|我需要提一些現金。
      exchange rate|n.|匯率|What's today's exchange rate?|今天的匯率是多少？
      balance|n.|餘額|Please check your account balance.|請確認您的帳戶餘額。
      fee|n.|手續費|There is a small fee for this service.|這項服務要收一點手續費。
    `),
    [
      ss("I'd like to exchange Taiwan dollars for euros.", '我想把台幣換成歐元。', '你'),
      ss('Please take a number and wait to be called.', '請抽號碼牌等候叫號。', '行員'),
      ss('Is there a fee for this?', '這個要收手續費嗎？', '你'),
      ss('Please enter your PIN.', '請輸入密碼。', 'ATM'),
      ss('I would like to open an account.', '我想開一個帳戶。', '你'),
    ],
  ),
  placeUnit(
    'en.town.restaurant',
    '🍽️',
    '餐廳',
    note('Restaurant：餐廳', [
      '入座 A table for two, please.；點餐 I’ll have the steak.；結帳 Could we have the check, please?',
      '在美國餐廳通常要給小費（tip），大約 15～20%。',
      '多益常考訂位 book a table、外燴 catering、菜單上的 appetizer（前菜）與 entrée（主菜）。',
    ]),
    enList(`
      restaurant|n.|餐廳|The restaurant is fully booked tonight.|餐廳今晚訂滿了。
      menu|n.|菜單|Could I see the menu, please?|可以給我看菜單嗎？
      appetizer|n.|前菜|We shared an appetizer.|我們分了一份前菜。
      bill|n.|帳單|Could we have the bill, please?|可以給我們帳單嗎？
      tip|n.|小費|We left a twenty percent tip.|我們留了兩成的小費。
      spicy|adj.|辣的|Is this dish spicy?|這道菜辣嗎？
      book|v.|預訂|I booked a table for six.|我訂了六人的位子。
    `),
    [
      ss('A table for two, please.', '兩位，謝謝。', '你'),
      ss('Are you ready to order?', '準備好點餐了嗎？', '服務生'),
      ss("I'll have the grilled chicken.", '我要烤雞。', '你'),
      ss('Is this dish very spicy?', '這道菜很辣嗎？', '你'),
      ss('Could we have the check, please?', '可以給我們帳單嗎？', '你'),
    ],
  ),
  placeUnit(
    'en.town.office',
    '🏢',
    '辦公室',
    note('Office：辦公室', [
      '多益最大宗的場景：開會 meeting、截止日 deadline、報告 report、出差 business trip。',
      '請人幫忙用 Could you…? 或 Would you mind…? 比 Please… 更委婉。',
      'Part 2 經典：When is the meeting? → It’s been moved to Friday.——沒直接報時間的回答也常是正解。',
    ]),
    enList(`
      office|n.|辦公室|I usually get to the office at eight.|我通常八點到辦公室。
      meeting|n.|會議|The meeting has been postponed.|會議延期了。
      deadline|n.|截止期限|The deadline is next Friday.|截止日是下週五。
      colleague|n.|同事|My colleague helped me with the report.|同事幫我完成報告。
      supervisor|n.|主管|I need to ask my supervisor.|我需要問我的主管。
      business trip|n.|出差|She is on a business trip to Tokyo.|她到東京出差。
      overtime|n.|加班|I worked overtime yesterday.|我昨天加班。
    `),
    [
      ss('Good morning. Did you get my email?', '早安，你收到我的郵件了嗎？', '同事'),
      ss('Could you review this report by Friday?', '可以在週五前看一下這份報告嗎？', '主管'),
      ss('Sure, I will get it done.', '沒問題，我會完成。', '你'),
      ss("The meeting has been moved to three o'clock.", '會議改到三點了。', '同事'),
      ss("I'm heading out. See you tomorrow.", '我先走了，明天見。', '你'),
    ],
  ),
  placeUnit(
    'en.town.hospital',
    '🏥',
    '醫院',
    note('Hospital：醫院', [
      '看病先預約：I’d like to make an appointment.；描述症狀：I have a fever / a sore throat.',
      '多益常見 appointment（預約）、reschedule（改期）、prescription（處方）。',
      '診所的語音留言是 Part 4 經典題：注意改到哪一天、要帶哪些文件。',
    ]),
    enList(`
      hospital|n.|醫院|He was taken to the hospital.|他被送到醫院。
      appointment|n.|預約（看診、會面）|I have a doctor's appointment at ten.|我十點有看診預約。
      fever|n.|發燒|I have had a fever since yesterday.|我從昨天開始發燒。
      sore throat|n.|喉嚨痛|I have a sore throat.|我喉嚨痛。
      reschedule|v.|改期|I need to reschedule my appointment.|我需要改預約時間。
      symptom|n.|症狀|What are your symptoms?|你有什麼症狀？
      recover|v.|康復|I hope you recover soon.|希望你早日康復。
    `),
    [
      ss('What seems to be the problem?', '哪裡不舒服？', '醫生'),
      ss('I have had a sore throat since yesterday.', '我從昨天開始喉嚨痛。', '你'),
      ss('Do you have a fever?', '有發燒嗎？', '醫生'),
      ss('Yes, about thirty eight degrees.', '有，大約三十八度。', '你'),
      ss('Get plenty of rest.', '多休息。', '醫生'),
    ],
  ),
  placeUnit(
    'en.town.pharmacy',
    '💊',
    '藥局',
    note('Pharmacy：藥局', [
      '美式說 pharmacy 或 drugstore，英式說 chemist。',
      '買藥：Do you have anything for a headache?；看說明：Take two tablets three times a day.',
      '多益常見 prescription（處方）、pick up（領取）、side effects（副作用）。',
    ]),
    enList(`
      pharmacy|n.|藥局|There is a pharmacy on the corner.|轉角有一家藥局。
      prescription|n.|處方|I need to fill this prescription.|我需要拿這張處方領藥。
      headache|n.|頭痛|I have a terrible headache.|我頭痛得很厲害。
      tablet|n.|藥片|Take two tablets after meals.|飯後吃兩顆藥。
      side effect|n.|副作用|This medicine has no side effects.|這個藥沒有副作用。
      pharmacist|n.|藥劑師|Ask the pharmacist for advice.|向藥劑師諮詢。
      painkiller|n.|止痛藥|I took a painkiller.|我吃了止痛藥。
    `),
    [
      ss('Do you have anything for a headache?', '有治頭痛的藥嗎？', '你'),
      ss('Try this one. It works well.', '試試這個，很有效。', '藥劑師'),
      ss('How often should I take it?', '要多久吃一次？', '你'),
      ss('Take two tablets three times a day.', '一天三次，每次兩顆。', '藥劑師'),
      ss('It may make you sleepy.', '可能會讓你想睡。', '藥劑師'),
    ],
  ),
  placeUnit(
    'en.town.supermarket',
    '🛒',
    '超市',
    note('Supermarket：超市', [
      '找商品：Where can I find the eggs? → They’re in aisle five.（在第五走道）。',
      '多益 Part 1 超市照片常考：Some shelves are being stocked.（有人在補貨上架）。',
      '促銷常見 on sale（特價）、buy one get one free（買一送一）、coupon（折價券）。',
    ]),
    enList(`
      supermarket|n.|超市|I go to the supermarket once a week.|我每週去一次超市。
      aisle|n.|走道|Rice is in aisle three.|米在第三走道。
      shelf|n.|貨架|The shelves are fully stocked.|貨架都補滿了。
      on sale|phr.|特價中|These apples are on sale.|這些蘋果正在特價。
      coupon|n.|折價券|I used a coupon for the milk.|我買牛奶用了折價券。
      cart|n.|購物車|She pushed the cart down the aisle.|她推著購物車走過走道。
      checkout|n.|結帳處|There is a long line at the checkout.|結帳處排了很長的隊。
    `),
    [
      ss('Excuse me, where can I find the eggs?', '不好意思，雞蛋在哪裡？', '你'),
      ss("They're in aisle five, next to the milk.", '在第五走道，牛奶旁邊。', '店員'),
      ss('Is this on sale?', '這個在特價嗎？', '你'),
      ss('Paper or plastic?', '要紙袋還是塑膠袋？', '店員'),
      ss('Do you have a membership card?', '您有會員卡嗎？', '店員'),
    ],
  ),
  placeUnit(
    'en.town.library',
    '📚',
    '圖書館',
    note('Library：圖書館', [
      '借書是 borrow 或 check out，還書是 return；逾期罰款叫 late fee。',
      '多益常見圖書館公告：extended hours（延長開放時間）、renovation（整修）、temporarily closed（暫停開放）。',
      '別混淆 borrow（借入）與 lend（借出）：Can I borrow your pen? ＝ Can you lend me your pen?',
    ]),
    enList(`
      library|n.|圖書館|I study at the library on weekends.|我週末在圖書館念書。
      borrow|v.|借入|You can borrow up to five books.|最多可以借五本書。
      lend|v.|借出|Could you lend me your notes?|可以借我你的筆記嗎？
      return|v.|歸還|Please return the books by Monday.|請在週一前還書。
      due date|n.|到期日|The due date is printed on the receipt.|到期日印在收據上。
      overdue|adj.|逾期的|This book is two days overdue.|這本書逾期兩天了。
      library card|n.|借書證|I need to renew my library card.|我需要更新借書證。
    `),
    [
      ss('I would like to check out these books.', '我想借這幾本書。', '你'),
      ss('May I see your library card?', '可以看一下您的借書證嗎？', '館員'),
      ss('How long can I keep them?', '可以借多久？', '你'),
      ss('They are due in two weeks.', '兩週後到期。', '館員'),
      ss('Please keep your voice down.', '請降低音量。', '館員'),
    ],
  ),
  placeUnit(
    'en.town.police',
    '👮',
    '警察局',
    note('Police station：警察局', [
      '報遺失：I lost my wallet.；被偷：My bag was stolen.（被動語態，多益文法常考）。',
      '緊急電話：美國 911、英國 999；非緊急事件可以到警察局報案（file a report）。',
      'lost and found 是失物招領處，車站、機場、百貨公司都有。',
    ]),
    enList(`
      police station|n.|警察局|I went to the police station to report it.|我去警察局報案。
      wallet|n.|錢包|I left my wallet in the taxi.|我把錢包忘在計程車上了。
      lost and found|n.|失物招領處|Check the lost and found.|去失物招領處看看。
      report|v./n.|報案；報告|I'd like to report a stolen bike.|我要報案腳踏車被偷。
      stolen|adj.|被偷的|My phone was stolen.|我的手機被偷了。
      witness|n.|目擊者|Were there any witnesses?|有目擊者嗎？
      emergency|n.|緊急情況|Call this number in an emergency.|緊急時撥這個號碼。
    `),
    [
      ss('Excuse me, I lost my wallet.', '不好意思，我的錢包掉了。', '你'),
      ss('Where did you last see it?', '你最後在哪裡看到它？', '警察'),
      ss('I think I left it on the bus.', '我想我把它忘在公車上了。', '你'),
      ss('Please fill out this form.', '請填寫這份表格。', '警察'),
      ss('We will contact you if we find it.', '找到的話會聯絡你。', '警察'),
    ],
  ),
  placeUnit(
    'en.town.school',
    '🏫',
    '學校',
    note('School：學校', [
      '美國學制：elementary school（小學）、middle school（國中）、high school（高中）、college／university（大學）。',
      '多益常見培訓課程：workshop（研習）、seminar（研討會）、enroll（報名）、tuition（學費）。',
      'assignment（作業、任務）比 homework 更常出現在大學與職場訓練。',
    ]),
    enList(`
      school|n.|學校|My school starts at eight.|我的學校八點開始上課。
      assignment|n.|作業；任務|The assignment is due on Friday.|作業週五要交。
      semester|n.|學期|The new semester starts in September.|新學期九月開始。
      enroll|v.|註冊；報名|She enrolled in an evening class.|她報名了夜間課程。
      tuition|n.|學費|Tuition has gone up this year.|今年學費漲了。
      graduate|v.|畢業|He graduated from college last year.|他去年大學畢業。
      lecture|n.|講課；演講|The lecture was very interesting.|那堂課很有趣。
    `),
    [
      ss('Excuse me, I have a question.', '不好意思，我有個問題。', '學生'),
      ss('Please hand in your assignment by Friday.', '請在週五前交作業。', '老師'),
      ss('Can I sign up for this course?', '我可以報名這門課嗎？', '你'),
      ss('Registration closes next week.', '報名下週截止。', '職員'),
      ss('Do you want to study together?', '要一起念書嗎？', '同學'),
    ],
  ),
  placeUnit(
    'en.town.park',
    '🌳',
    '公園',
    note('Park：公園', [
      '多益 Part 1 公園照片超常見：People are sitting on a bench.、A man is walking his dog.——注意現在進行式。',
      '公告常見 picnic area（野餐區）、admission is free（免費入場）、closed for maintenance（維修關閉）。',
      '聊天氣是英文的萬用開場：Lovely weather today, isn’t it?',
    ]),
    enList(`
      park|n.|公園|We had a picnic in the park.|我們在公園野餐。
      bench|n.|長椅|An old man is sitting on a bench.|一位老先生坐在長椅上。
      fountain|n.|噴水池|Children are playing near the fountain.|孩子們在噴水池旁玩。
      picnic|n.|野餐|Let's have a picnic this weekend.|這週末去野餐吧。
      path|n.|小路|They are jogging along the path.|他們沿著小路慢跑。
      lawn|n.|草坪|Please keep off the lawn.|請勿踐踏草坪。
      walk the dog|phr.|遛狗|I walk the dog every morning.|我每天早上遛狗。
    `),
    [
      ss("Lovely weather today, isn't it?", '今天天氣真好，對吧？', '鄰居'),
      ss('It sure is. Perfect for a walk.', '真的，很適合散步。', '你'),
      ss("Let's sit on that bench over there.", '我們坐那邊的長椅吧。', '朋友'),
      ss('The park is closed for maintenance today.', '公園今天維修關閉。', '公告'),
      ss('Please take your trash with you.', '請把垃圾帶走。', '公告'),
    ],
  ),
  placeUnit(
    'en.town.airport',
    '✈️',
    '機場',
    note('Airport：機場', [
      '多益機場題超常見：boarding pass（登機證）、gate（登機門）、board（登機）、carry-on（隨身行李）、delay（延誤）。',
      '登機廣播：Flight 205 to Tokyo is now boarding at Gate 12.——注意航班、目的地、登機門三個資訊。',
      '過海關會被問 What’s the purpose of your visit?，回答 Sightseeing.（觀光）或 Business.（商務）。',
    ]),
    enList(`
      airport|n.|機場|We arrived at the airport two hours early.|我們提早兩小時到機場。
      boarding pass|n.|登機證|Please show your boarding pass.|請出示登機證。
      gate|n.|登機門|The flight leaves from gate twelve.|班機從十二號登機門出發。
      board|v.|登機|Passengers may now board the plane.|旅客現在可以登機了。
      luggage|n.|行李|My luggage did not arrive.|我的行李沒到。
      customs|n.|海關|We went through customs quickly.|我們很快通過海關。
      flight|n.|班機|My flight was canceled.|我的班機取消了。
    `),
    [
      ss('May I see your passport and boarding pass?', '可以看一下您的護照和登機證嗎？', '地勤人員'),
      ss('Would you like a window or an aisle seat?', '您要靠窗還是靠走道的位子？', '地勤人員'),
      ss('A window seat, please.', '靠窗，謝謝。', '你'),
      ss('Flight 205 is now boarding at gate twelve.', '205 班機現在在十二號登機門登機。', '廣播'),
      ss("What's the purpose of your visit?", '你這次來的目的是什麼？', '海關人員'),
    ],
  ),
];
