// 英文情境路線：旅遊英語、商務英語、海外生活。
// 每個單元分成幾個小情境，每課先看說明卡（什麼時候這樣說、語氣與文化），再練關鍵片語和整句（標出是誰說的），
// 最後是情境應答題：聽對方說的話，選出合適的回答（也是多益 Part 2 的練習）。
import type { GrammarNote, Item, Unit } from '../core/types';
import { cz, drillUnit, en, note, qa, sceneUnit, ss, type GrammarPart } from './dsl';

const tip = (title: string, body: string[], ex: string[] = []): GrammarNote => note(title, body, ex);
const part = (title: string, n: GrammarNote, items: Item[]): GrammarPart => ({ title, notes: [n], items });
const answer = (items: Item[]): GrammarPart => ({ title: '情境應答', items });

// ───────── 旅遊英語 ─────────

export const EN_TRAVEL_UNITS: Unit[] = [
  sceneUnit('en.travel.airport', '🛫', '機場與飛機', '報到、安檢、機上、入境', [
    part(
      '報到與托運',
      tip('Check-in：報到', ['報到櫃台常問：Do you have any bags to check?（有要托運的行李嗎？）', '座位：window seat（靠窗）、aisle seat（靠走道），aisle 的 s 不發音。', '隨身行李叫 carry-on，托運行李叫 checked baggage。'], ['I have one bag to check.|我有一件行李要托運。']),
      [
        en('boarding time', 'n.', '登機時間', 'Boarding time is thirty minutes before departure.|登機時間是起飛前三十分鐘。'),
        en('extra legroom', 'n.', '較寬的腿部空間', 'Exit row seats have extra legroom.|緊急出口那排的座位腿部空間比較大。'),
        ss('I have one bag to check.', '我有一件行李要托運。', '你'),
        ss('Is it possible to sit together?', '我們可以坐在一起嗎？', '你'),
        ss('Your flight is boarding at gate twelve.', '您的班機在 12 號登機門登機。', '地勤'),
      ],
    ),
    part(
      '安檢與機上',
      tip('Security & on board：安檢與機上', ['安檢常聽到：Please take your laptop out of your bag.、Empty your pockets.', '液體要裝在 100 毫升以下的容器，放進透明夾鏈袋。', '機上要東西用 Could I get…?；想換位子用 Would you mind…?'], ['Could I get a blanket, please?|可以給我一條毯子嗎？']),
      [
        en('empty your pockets', 'v.', '把口袋清空', 'Please empty your pockets and take off your belt.|請把口袋清空並解下皮帶。'),
        en('tray table', 'n.', '（座椅後的）餐桌', 'Please put your tray table up for landing.|降落前請收起餐桌。'),
        ss('Please take your laptop out of your bag.', '請把筆電從包包裡拿出來。', '安檢人員'),
        ss('Could I get a blanket, please?', '可以給我一條毯子嗎？', '你'),
        ss('Would you mind switching seats with me?', '您介意和我換位子嗎？', '你'),
      ],
    ),
    part(
      '入境與領行李',
      tip('Immigration：入境審查', ['常見問題：What is the purpose of your visit?（來訪目的）、How long will you be staying?（停留多久）。', '回答簡短就好：Sightseeing. / About a week. / At a hotel downtown.', '行李沒出來：到 baggage claim 旁的航空公司櫃台登記。'], ["I'm here on vacation.|我是來度假的。"]),
      [
        en('purpose of your visit', 'n.', '來訪目的', 'Please state the purpose of your visit.|請說明您的來訪目的。'),
        en('long layover', 'n.', '長時間轉機', 'We have a long layover in Dubai.|我們在杜拜要轉機很久。'),
        ss("I'm here on vacation.", '我是來度假的。', '你'),
        ss("I'll be staying for about a week.", '我會待大約一個星期。', '你'),
        ss('My suitcase never showed up.', '我的行李箱一直沒出來。', '你'),
      ],
    ),
    answer([
      qa('What is the purpose of your visit?', ['Sightseeing.', 'About a week.', 'At the Hilton.'], '您來訪的目的是什麼？', '問目的（purpose），回答觀光、出差（business）等。'),
      qa('Do you have anything to declare?', ['No, nothing to declare.', 'Window seat, please.', 'For two weeks.'], '有要申報的東西嗎？', 'declare 是海關申報。'),
      qa('Window or aisle?', ['Aisle, please.', 'Yes, please.', 'Gate twelve.'], '要靠窗還是靠走道？', '二選一的問題不能用 Yes/No 回答。'),
      qa('Chicken or beef?', ['Chicken, please.', 'Yes, I do.', 'In the overhead bin.'], '要雞肉還是牛肉？（機上餐）', '選擇疑問句直接說要哪一個。'),
    ]),
  ]),
  sceneUnit('en.travel.hotel', '🏨', '飯店', '入住、提出需求、反映問題、退房', [
    part(
      '入住',
      tip('Checking in：辦理入住', ['開口：I have a reservation under the name Chen.（我用陳這個名字訂了房）', '櫃台常說：May I see your passport and a credit card?（信用卡是押金用）', 'deposit 是押金，退房時會退回。'], ['I have a reservation under the name Chen.|我用「陳」這個名字訂了房。']),
      [
        en('room key', 'n.', '房卡；房間鑰匙', 'I left my room key in the room.|我把房卡忘在房間裡了。'),
        en('late checkout', 'n.', '延後退房', 'Is a late checkout possible?|可以延後退房嗎？'),
        ss('I have a reservation under the name Chen.', '我用「陳」這個名字訂了房。', '你'),
        ss('What time is breakfast served?', '早餐幾點供應？', '你'),
        ss('Could I check in early?', '可以提早入住嗎？', '你'),
      ],
    ),
    part(
      '提出需求',
      tip('Requests：向櫃台提出需求', ['客氣地請求：Could you…? / Would it be possible to…?', '要東西：Could we get some extra towels?', '寄放行李：Can I leave my luggage here until five?'], ['Would it be possible to get a quieter room?|可以換一間比較安靜的房間嗎？']),
      [
        en('extra towels', 'n.', '多的毛巾', 'Could we get some extra towels?|可以多給我們一些毛巾嗎？'),
        en('luggage storage', 'n.', '行李寄放', 'Does the hotel offer luggage storage?|飯店有提供行李寄放嗎？'),
        ss('Can I leave my luggage here until five?', '我可以把行李寄放在這裡到五點嗎？', '你'),
        ss('Would it be possible to get a quieter room?', '可以換一間比較安靜的房間嗎？', '你'),
        ss("What's the Wi-Fi password?", 'Wi-Fi 密碼是多少？', '你'),
      ],
    ),
    part(
      '反映問題與退房',
      tip('Problems & checkout：反映問題、退房', ["房間有問題直接說：The air conditioner isn't working.（冷氣壞了）", "熱水：There's no hot water.", "退房時確認帳單：I think there's a mistake on my bill."], ["I'd like to check out, please.|我要退房。"]),
      [
        en('change rooms', 'v.', '換房間', 'Could we change rooms, please?|我們可以換房間嗎？'),
        ss("There's no hot water in the shower.", '淋浴間沒有熱水。', '你'),
        ss("I'd like to check out, please.", '我要退房。', '你'),
        ss("I think there's a mistake on my bill.", '我覺得我的帳單有錯。', '你'),
      ],
    ),
    answer([
      qa('How many nights will you be staying?', ['Three nights.', 'Two people.', 'On the fifth floor.'], '您要住幾晚？', 'How many nights 問住幾晚。'),
      qa('Would you like a wake-up call?', ['Yes, at six thirty, please.', 'No, I called yesterday.', 'The room is nice.'], '需要早上叫醒服務嗎？', '需要就說時間。'),
      qa('Is everything all right with your room?', ["Actually, the heater isn't working.", 'Yes, I booked it online.', 'Room 512.'], '房間一切都還好嗎？', '有問題可以趁機反映，用 Actually 開頭很自然。'),
      qa('Can I have your last name, please?', ["It's Chen, C-H-E-N.", 'For three nights.', 'Yes, I have.'], '請問您貴姓？', '報姓氏時順便拼出來，對方比較好查。'),
    ]),
  ]),
  sceneUnit('en.travel.food', '🍽️', '餐廳點餐', '訂位、點餐、過敏、結帳與小費', [
    part(
      '訂位與帶位',
      tip('Getting a table：訂位與帶位', ['沒訂位：Do you have a table for two?', '要等：How long is the wait?', '美國很多餐廳會問 Inside or outside?（室內或戶外）'], ["I'd like to book a table for Friday night.|我想訂星期五晚上的位子。"]),
      [
        en('table for two', 'n.', '兩人桌', 'Do you have a table for two?|有兩人的位子嗎？'),
        en('outdoor seating', 'n.', '戶外座位', 'Do you have outdoor seating?|有戶外座位嗎？'),
        ss('How long is the wait?', '要等多久？', '你'),
        ss("I'd like to book a table for Friday night.", '我想訂星期五晚上的位子。', '你'),
        ss('Can we sit by the window?', '我們可以坐窗邊嗎？', '你'),
      ],
    ),
    part(
      '點餐與過敏',
      tip('Ordering：點餐', ["點餐：I'll have the…（我要…）、Could I get…?", '牛排熟度：rare（三分）、medium（五分）、well-done（全熟）。', "過敏一定要說：I'm allergic to peanuts.（我對花生過敏）"], ['What do you recommend?|你推薦什麼？']),
      [
        en('allergic to', 'adj.', '對…過敏', "I'm allergic to shellfish.|我對有殼海鮮過敏。"),
        en('daily special', 'n.', '今日特餐', "What's the daily special?|今日特餐是什麼？"),
        ss("I'll have the grilled salmon.", '我要烤鮭魚。', '你'),
        ss('What do you recommend?', '你推薦什麼？', '你'),
        ss('Could I get the dressing on the side?', '醬汁可以另外放嗎？', '你'),
      ],
    ),
    part(
      '結帳與小費',
      tip('Paying：結帳與小費', ['請服務生拿帳單：Could we get the check, please?（英式說 bill）', '美國餐廳小費通常是 15～20%，信用卡簽單上有 tip 欄可以填。', '打包剩菜：Could I get a box for this?'], ['Could we get the check, please?|麻煩幫我們結帳。']),
      [
        en('pay separately', 'v.', '分開付', 'We decided to pay separately.|我們決定分開付。'),
        ss('Could we get the check, please?', '麻煩幫我們結帳。', '你'),
        ss('Is the tip included?', '小費包含在內了嗎？', '你'),
        ss('Could I get a box for this?', '這個可以幫我打包嗎？', '你'),
      ],
    ),
    answer([
      qa('Are you ready to order?', ['Could we have a few more minutes?', 'Yes, it was delicious.', 'A table for four.'], '準備好點餐了嗎？', '還沒決定就請對方再給幾分鐘。'),
      qa('How would you like your steak?', ['Medium, please.', 'With a fork.', 'Very much.'], '牛排要幾分熟？', 'How would you like… 問做法、熟度。'),
      qa('Is everything okay here?', ["Yes, everything's great, thanks.", "No, I'm here.", 'Okay, see you.'], '餐點都還好嗎？', '服務生來關心時的固定回答。'),
      qa('For here or to go?', ['To go, please.', 'Yes, here it is.', "I'll go there."], '內用還是外帶？', 'to go 就是外帶。'),
    ]),
  ]),
  sceneUnit('en.travel.transport', '🚇', '交通與問路', '買票、問路、計程車與叫車', [
    part(
      '買票與搭車',
      tip('Tickets：買票與搭車', ['來回票：round-trip ticket（英式 return ticket）；單程：one-way。', '問班次：When is the next train to…?', '問轉乘：Do I need to change trains?'], ['Does this bus go to the airport?|這班公車有到機場嗎？']),
      [
        en('day pass', 'n.', '一日券', 'A day pass lets you ride all day.|一日券可以整天無限搭乘。'),
        en('next stop', 'n.', '下一站', 'The next stop is Central Park.|下一站是中央公園。'),
        ss('Does this bus go to the airport?', '這班公車有到機場嗎？', '你'),
        ss('Do I need to change trains?', '我需要換車嗎？', '你'),
        ss('Where can I buy a ticket?', '在哪裡可以買票？', '你'),
      ],
    ),
    part(
      '問路',
      tip('Directions：問路', ['問路：How do I get to…? / Is it within walking distance?', "指路常用：go straight（直走）、turn left（左轉）、It's on your right.（在你的右手邊）", "block 是一個街區：It's two blocks away."], ['How do I get to City Hall?|市政府要怎麼去？']),
      [
        en('walking distance', 'n.', '走路可到的距離', 'The museum is within walking distance.|博物館走路就到得了。'),
        en('turn left', 'v.', '左轉', 'Turn left at the second traffic light.|在第二個紅綠燈左轉。'),
        ss('How do I get to City Hall?', '市政府要怎麼去？', '你'),
        ss("It's two blocks down on your right.", '往前兩個街區，在你的右手邊。', '路人'),
        ss('Could you show me on the map?', '可以在地圖上指給我看嗎？', '你'),
      ],
    ),
    part(
      '計程車與叫車',
      tip('Taxis & rideshares：計程車與叫車', ['給司機看地址：Could you take me to this address?', '叫車 App 會說 pickup point（上車地點）。', '要下車：You can drop me off here.（在這裡讓我下車就好）'], ['Keep the change.|不用找了。']),
      [
        en('pickup point', 'n.', '上車地點', 'The pickup point is in front of the hotel.|上車地點在飯店前面。'),
        en('take me to', 'v.', '載我到…', 'Please take me to the train station.|請載我到火車站。'),
        ss('Could you take me to this address?', '可以載我到這個地址嗎？', '你'),
        ss('How long will it take to get there?', '到那裡要多久？', '你'),
        ss('Keep the change.', '不用找了。', '你'),
      ],
    ),
    answer([
      qa('Excuse me, is this seat taken?', ['No, go ahead.', 'Yes, I took the bus.', 'At the next stop.'], '不好意思，這個位子有人坐嗎？', '沒人坐就說 No, go ahead.（請坐）。回答 Yes 表示有人。'),
      qa('Where to?', ['The Grand Hotel, please.', 'Two tickets.', 'In ten minutes.'], '去哪裡？（計程車司機）', '直接說目的地。'),
      qa('Is it far from here?', ["It's about a ten-minute walk.", "Yes, it's from here.", 'I came by train.'], '離這裡遠嗎？', '用時間回答距離是英文常見的說法。'),
      qa('Do I need to change trains to get to the airport?', ['Yes, change at Central Station.', 'The airport is big.', 'Yes, I have some change.'], '去機場需要換車嗎？', 'change 也有「零錢」的意思，小心陷阱。'),
    ]),
  ]),
  sceneUnit('en.travel.shop', '🛍️', '購物與退換貨', '試穿、付款退稅、退換貨', [
    part(
      '試穿與尺寸',
      tip('Trying on：試穿與尺寸', ["只是看看：I'm just looking, thanks.", '試穿：Can I try this on?；試衣間叫 fitting room。', '尺寸：Do you have this in a medium?、Do you have it in a smaller size?'], ["I'm just looking, thanks.|我只是看看，謝謝。"]),
      [
        en('smaller size', 'n.', '小一號的尺寸', 'I think I need a smaller size.|我想我需要小一號的。'),
        en('perfect fit', 'n.', '非常合身', 'These jeans are a perfect fit.|這條牛仔褲非常合身。'),
        ss("I'm just looking, thanks.", '我只是看看，謝謝。', '你'),
        ss('Do you have this in a smaller size?', '這件有小一點的尺寸嗎？', '你'),
        ss('It fits perfectly.', '很合身。', '你'),
      ],
    ),
    part(
      '付款與退稅',
      tip('Paying：付款與退稅', ['問折扣：Is this on sale?、Is there a discount if I buy two?', '退稅：Can I get a tax refund?（要帶護照）', '刷卡：Do you take credit cards?'], ['Do you take credit cards?|可以刷卡嗎？']),
      [
        en('buy one get one free', 'phr.', '買一送一', 'The T-shirts are buy one get one free.|T 恤買一送一。'),
        en('tax refund', 'n.', '退稅', 'You can get a tax refund at the airport.|你可以在機場辦退稅。'),
        ss('Do you take credit cards?', '可以刷卡嗎？', '你'),
        ss('Is there a discount if I buy two?', '買兩件有折扣嗎？', '你'),
        ss('Could you gift wrap it?', '可以幫我包裝成禮物嗎？', '你'),
      ],
    ),
    part(
      '退換貨',
      tip('Returns：退換貨', ["退貨：I'd like to return this.；換貨：Can I exchange this for a larger size?", '一定要帶收據（receipt）。', '退款是 refund；有些店只給 store credit（購物金）。'], ["I'd like to return this.|我想退這個。"]),
      [
        en('store credit', 'n.', '購物金', 'They gave me store credit instead of cash.|他們給我購物金，而不是退現金。'),
        en('full refund', 'n.', '全額退款', "I'd like a full refund.|我想要全額退款。"),
        ss("I'd like to return this.", '我想退這個。', '你'),
        ss('Can I exchange this for a larger size?', '這個可以換大一號嗎？', '你'),
        ss("Here's the receipt.", '這是收據。', '你'),
      ],
    ),
    answer([
      qa('Can I help you find anything?', ["I'm just looking, thanks.", 'Yes, I found it yesterday.', "It's on sale."], '需要幫您找什麼嗎？', '只是逛逛就這樣回答。'),
      qa('How would you like to pay?', ['By card, please.', 'Very much.', 'Two of them.'], '您要怎麼付款？', '回答付款方式：cash 或 card。'),
      qa('Do you have your receipt?', ['Yes, here you go.', 'I received a call.', 'It costs thirty dollars.'], '有收據嗎？', '有就遞出去說 Here you go；聽到 receipt 就選 received 是發音陷阱。'),
      qa('Would you like to try it on?', ['Yes, where is the fitting room?', 'Yes, it is on sale.', 'No, it was turned on.'], '要試穿看看嗎？', '想試穿就問試衣間（fitting room）在哪裡。'),
    ]),
  ]),
  sceneUnit('en.travel.trouble', '🆘', '突發狀況', '東西掉了、生病受傷、行程出狀況', [
    part(
      '東西掉了',
      tip('Lost & stolen：遺失與被偷', ['遺失：I lost my wallet.；被偷：My bag was stolen.', '失物招領：lost and found。', '報警拿 police report（報案證明），之後才能申請保險理賠。'], ['I think I left my phone in the taxi.|我好像把手機忘在計程車上了。']),
      [
        en('left behind', 'v.', '遺留；忘了帶走', 'Items left behind on the bus go to the main office.|遺留在公車上的物品會送到總站辦公室。'),
        en('police report', 'n.', '報案證明', 'You need a police report for the insurance claim.|申請保險理賠需要報案證明。'),
        ss('I think I left my phone in the taxi.', '我好像把手機忘在計程車上了。', '你'),
        ss('My wallet was stolen.', '我的錢包被偷了。', '你'),
        ss('Where is the nearest police station?', '最近的警察局在哪裡？', '你'),
      ],
    ),
    part(
      '生病受傷',
      tip('Feeling sick：生病受傷', ["不舒服：I don't feel well.；頭痛：I have a headache.", '藥局：pharmacy（美國也常說 drugstore）。', '緊急電話：美國、加拿大 911；英國 999；歐盟 112。'], ["I don't feel well.|我覺得不太舒服。"]),
      [
        en('feel sick', 'v.', '覺得不舒服；想吐', 'I started to feel sick on the bus.|我在公車上開始覺得不舒服。'),
        en('travel insurance', 'n.', '旅遊保險', 'Does your travel insurance cover this?|你的旅遊保險有給付這個嗎？'),
        ss("I don't feel well.", '我覺得不太舒服。', '你'),
        ss('I need to see a doctor.', '我需要看醫生。', '你'),
        ss('Please call an ambulance!', '請叫救護車！', '你'),
      ],
    ),
    part(
      '行程出狀況',
      tip('Travel problems：行程出狀況', ['班機取消：My flight was canceled.', '趕不上：I missed the last train.', '請櫃台幫忙改：Can you put me on the next flight?'], ['Could you speak more slowly, please?|可以請你說慢一點嗎？']),
      [
        en('next flight', 'n.', '下一班飛機', 'Can you put me on the next flight?|可以幫我改搭下一班飛機嗎？'),
        ss('My flight was canceled.', '我的班機被取消了。', '你'),
        ss('I missed the last train.', '我錯過末班車了。', '你'),
        ss('Is there anyone here who speaks Chinese?', '這裡有人會說中文嗎？', '你'),
        ss('Could you speak more slowly, please?', '可以請你說慢一點嗎？', '你'),
      ],
    ),
    answer([
      qa('What seems to be the problem?', ['I lost my passport.', 'No problem at all.', "It's next to the bank."], '發生什麼事了？', '說明狀況。No problem 是「沒問題」，不是在回答。'),
      qa('When did you last see your bag?', ['About an hour ago, at the café.', "It's black.", 'Yes, I saw it.'], '你最後一次看到包包是什麼時候？', 'When 問時間。'),
      qa('Do you have travel insurance?', ['Yes, I bought it online.', 'No, I traveled alone.', 'Twice a year.'], '你有保旅遊險嗎？', '照事實回答。'),
      qa('Should I call an ambulance?', ["No, I'm okay. I just need to sit down.", 'Yes, I called him.', 'The hospital is big.'], '要幫你叫救護車嗎？', '沒那麼嚴重就說明自己的狀況。'),
    ]),
  ]),
  drillUnit(
    'en.travel.quiz',
    '🎯',
    '旅遊情境綜合測驗',
    '12 題・聽地勤、店員、司機說的話選回答',
    [
      qa('Would you like a window seat or an aisle seat?', ['A window seat, please.', 'Yes, I would.', 'At gate five.'], '要靠窗還是靠走道的座位？', '選擇疑問句不能用 Yes/No 回答。'),
      qa('May I see your passport, please?', ['Sure, here you are.', 'I passed the test.', 'No, I can see it.'], '可以看一下您的護照嗎？', '遞東西時說 Here you are 或 Here you go。'),
      qa('How long will you be staying?', ['For ten days.', 'At a hotel.', 'Since last year.'], '您要待多久？', 'How long 問時間長度。'),
      qa('Is breakfast included?', ["Yes, it's served from seven to ten.", 'No, I had lunch.', "It's a big room."], '有含早餐嗎？', '回答有沒有包含，順便說明時間。'),
      qa("I'm sorry, we're fully booked tonight.", ['Do you know any other hotels nearby?', "Great, I'll take it.", "Yes, I've read the book."], '抱歉，今晚客滿了。', 'booked 是預訂，和 book（書）無關。'),
      qa('Would you like anything to drink?', ['Just water, please.', 'The drinks are cold.', 'I drove here.'], '要喝點什麼嗎？', '回答想喝的飲料。'),
      qa('Could you tell me the way to the station?', ['Sure. Go straight and turn right.', 'The station is old.', "I'll tell him."], '可以告訴我到車站怎麼走嗎？', '指路的回答。'),
      qa('Do you want me to take a picture of you?', ["That'd be great, thanks.", 'Yes, I took it.', 'It was a nice picture.'], '要我幫你拍照嗎？', '接受好意並道謝。'),
      qa('Cash or card?', ['Card, please.', 'Yes, please.', 'It was expensive.'], '現金還是刷卡？', '二選一直接回答。'),
      qa('Where did you buy that jacket?', ['At a shop near my hotel.', 'Last weekend.', 'It was forty dollars.'], '那件外套在哪裡買的？', 'Where 問地點。'),
      qa('Your flight has been delayed by two hours.', ['Can I get a meal voucher?', 'Yes, it flies.', 'Two hours ago.'], '您的班機延誤兩個小時。', '延誤時可以問有沒有餐券（meal voucher）。'),
      qa('Should I call a taxi for you?', ["Yes, please. I'm going to the airport.", 'No, I called her yesterday.', 'The taxi was yellow.'], '要幫您叫計程車嗎？', '需要就說要去哪裡。'),
    ],
    6,
    'listening',
  ),
];

// ───────── 商務英語 ─────────

export const EN_BIZ_UNITS: Unit[] = [
  sceneUnit('en.biz.intro', '🤝', '自我介紹與寒暄', '初次見面、閒聊、保持聯絡', [
    part(
      '初次見面',
      tip('Introductions：商務場合的自我介紹', ["名字＋公司＋部門：I'm Amy Chen from ABC Trading. I work in sales.", '握手時說 Nice to meet you.，道別時說 It was nice meeting you.', '英文名片不必雙手遞，但正面朝向對方仍然是好禮貌。'], ["I'm Amy Chen from ABC Trading.|我是 ABC 貿易的陳艾咪。"]),
      [
        en('business card', 'n.', '名片', "Here's my business card.|這是我的名片。"),
        en('report to', 'v.', '直屬於（某主管）', 'I report to the regional manager.|我的直屬主管是區域經理。'),
        ss("I'm Amy Chen from ABC Trading.", '我是 ABC 貿易的陳艾咪。', '你'),
        ss("I don't think we've met. I'm Kevin.", '我們好像還沒見過，我是凱文。', '你'),
        ss('I work in the marketing department.', '我在行銷部工作。', '你'),
      ],
    ),
    part(
      '閒聊',
      tip('Small talk：閒聊', ['開會前、電梯裡常聊天氣、交通、週末：How was your flight?、Did you have a good weekend?', '避免政治、宗教、收入、年齡等話題。', '回答後反問 How about you?，對話就接得下去。'], ['Is this your first time in Taipei?|這是你第一次來台北嗎？']),
      [
        en('small talk', 'n.', '寒暄；閒聊', "He's good at small talk.|他很會閒聊。"),
        en('catch up', 'v.', '交換近況；敘舊', "Let's grab coffee and catch up.|我們去喝杯咖啡聊聊近況吧。"),
        ss('How was your flight?', '你的班機還順利嗎？', '你'),
        ss('Is this your first time in Taipei?', '這是你第一次來台北嗎？', '你'),
        ss('How about you?', '你呢？', '你'),
      ],
    ),
    part(
      '保持聯絡',
      tip('Keeping in touch：保持聯絡', ['結束對話：It was great talking with you.', "保持聯絡：Let's keep in touch.、I'll send you an email.", '介紹別人：Let me introduce you to my manager, Lisa.'], ["Let's keep in touch.|保持聯絡喔。"]),
      [
        en('nice meeting you', 'phr.', '很高興認識你（道別時）', 'It was nice meeting you, Mr. Brown.|布朗先生，很高興認識您。'),
        en('touch base', 'v.', '（簡短地）聯絡一下', "Let's touch base next week.|我們下週再聯絡一下。"),
        ss('Let me introduce you to my manager.', '我來把你介紹給我的經理。', '你'),
        ss('It was great talking with you.', '跟你聊天很愉快。', '你'),
        ss('Please say hello to Mr. Brown for me.', '請代我向布朗先生問好。', '你'),
      ],
    ),
    answer([
      qa('Nice to meet you, Ms. Chen.', ['Nice to meet you too.', 'Yes, I met him.', 'Meet me at five.'], '很高興認識您，陳小姐。', '回 Nice to meet you too.'),
      qa('How was your trip?', ['Pretty smooth, thanks.', 'Next Monday.', 'By plane.'], '旅途還順利嗎？', 'How was… 問感想；By plane 是回答「怎麼來」的陷阱。'),
      qa('What do you do?', ["I'm a project manager at a tech company.", "I'm doing fine.", 'I do it every day.'], '你是做什麼工作的？', 'What do you do? 問職業，不是問「正在做什麼」。'),
      qa('Have you two met before?', ["No, I don't think we have.", 'Yes, we have two.', 'Meet me at two.'], '你們兩位之前見過嗎？', "還沒見過就說 No, I don't think we have.，對方通常會接著介紹。"),
    ]),
  ]),
  sceneUnit('en.biz.phone', '☎️', '電話與視訊會議', '接電話、轉接留言、線上會議', [
    part(
      '接電話與轉接',
      tip('Answering calls：接電話', ['接公司電話：Good morning, ABC Trading. How may I help you?', "問對方是誰：May I ask who's calling?", "轉接：I'll put you through. / Please hold."], ["May I ask who's calling?|請問是哪位？"]),
      [
        en('transfer your call', 'v.', '轉接您的電話', "I'll transfer your call to the sales department.|我幫您把電話轉到業務部。"),
        en('on hold', 'adj.', '（電話）保留等候中', 'I was on hold for twenty minutes.|我在線上等了二十分鐘。'),
        ss("May I ask who's calling?", '請問是哪位？', '你'),
        ss("I'm calling about the order we placed last week.", '我打來是想問上週下的訂單。', '來電者'),
        ss('Could you speak up a little?', '可以說大聲一點嗎？', '你'),
      ],
    ),
    part(
      '留言',
      tip('Taking messages：留言', ["不在：I'm afraid she's not at her desk right now.", '問要不要留言：Would you like to leave a message?', '複誦電話號碼確認：Let me read that back to you.'], ["I'll make sure she gets the message.|我一定會把留言轉給她。"]),
      [
        en('leave a message', 'v.', '留言', 'Would you like to leave a message?|您要留言嗎？'),
        en('return your call', 'v.', '回您電話', "She'll return your call after lunch.|她午餐後會回您電話。"),
        ss("I'm afraid he's in a meeting right now.", '不好意思，他現在在開會。', '你'),
        ss('Let me read that back to you.', '我再跟您複誦一次。', '你'),
        ss("I'll make sure she gets the message.", '我一定會把留言轉給她。', '你'),
      ],
    ),
    part(
      '視訊會議',
      tip('Video calls：視訊會議', ["常用：You're on mute.（你靜音了）、Can everyone see my screen?", "訊號不好：You're breaking up.（你的聲音斷斷續續）", "沒聽清楚：Sorry, I didn't catch that."], ["Sorry, I didn't catch that.|抱歉，我沒聽清楚。"]),
      [
        en('on mute', 'adj.', '靜音中', "I think you're on mute.|你好像靜音了。"),
        en('share my screen', 'v.', '分享我的螢幕', 'Let me share my screen.|我來分享我的螢幕。'),
        ss("You're breaking up a little.", '你的聲音有點斷斷續續。', '你'),
        ss('Can everyone see my screen?', '大家看得到我的螢幕嗎？', '你'),
        ss("Sorry, I didn't catch that.", '抱歉，我沒聽清楚。', '你'),
      ],
    ),
    answer([
      qa('Could I speak to Ms. Lee, please?', ["I'm sorry, she's out of the office today.", 'Yes, I can speak English.', 'Speak slowly.'], '可以請李小姐聽電話嗎？', '不在時說明原因。'),
      qa('Would you like to leave a message?', ['Yes, please ask him to call me back.', 'No, I left it at home.', "I'll leave at five."], '您要留言嗎？', 'leave 有「留下」和「離開」兩個意思，小心陷阱。'),
      qa("I think you're on mute.", ['Oh, sorry. Can you hear me now?', "Yes, it's a mute button.", 'I like music.'], '你好像靜音了。', '解除靜音並確認對方聽得到。'),
      qa('Can I put you on hold for a moment?', ['Sure, no problem.', 'Hold the door, please.', 'Yes, I put it there.'], '可以請您在線上稍等一下嗎？', 'put someone on hold 是讓對方在線上等候。'),
    ]),
  ]),
  sceneUnit('en.biz.mail', '📧', '商務郵件', '開頭、請求與附件、結尾', [
    part(
      '郵件開頭',
      tip('Openings：信的開頭', ['稱呼：Dear Mr. Smith,（正式）、Hi Tom,（熟一點）', "開頭說目的：I'm writing to…、I'm writing with regard to…", '回信：Thank you for your prompt reply.'], ["I'm writing to confirm our meeting on Monday.|來信確認我們星期一的會議。"]),
      [
        en('as discussed', 'adv.', '如先前討論的', "As discussed, I've attached the contract.|如先前討論的，合約已附上。"),
        en('prompt reply', 'n.', '迅速的回覆', 'Thank you for your prompt reply.|感謝您迅速回覆。'),
        ss("I'm writing to confirm our meeting on Monday.", '來信確認我們星期一的會議。', '寄件人'),
        ss('Thank you for your inquiry.', '感謝您的詢問。', '寄件人'),
        ss('I hope this email finds you well.', '希望您一切安好。', '寄件人'),
      ],
    ),
    part(
      '請求與附件',
      tip('Requests：請求與附件', ['附件：Please find attached the quotation.（附件是報價單）', '客氣地請求：I would appreciate it if you could…', '期限：Could you let me know by Friday?'], ['Please see the attached file for details.|詳情請見附件。']),
      [
        en('find attached', 'v.', '附件為…', 'Please find attached the revised schedule.|附件是修改後的時程表。'),
        en('by the end of the week', 'adv.', '在這週結束前', 'Please reply by the end of the week.|請在這週結束前回覆。'),
        ss("I'd appreciate it if you could send me the contract.", '如果您能把合約寄給我，我會很感激。', '寄件人'),
        ss('Could you let me know by Friday?', '可以在星期五前告訴我嗎？', '寄件人'),
        ss('Please see the attached file for details.', '詳情請見附件。', '寄件人'),
      ],
    ),
    part(
      '郵件結尾',
      tip('Closings：信的結尾', ['結尾句：Please let me know if you have any questions.', '期待回覆：I look forward to hearing from you.（to 後面接 V-ing）', '署名前：Best regards, / Sincerely,'], ['I look forward to hearing from you.|期待您的回覆。']),
      [
        en('hear from', 'v.', '收到（某人的）消息', 'We hope to hear from you soon.|希望很快收到您的回音。'),
        en('reply all', 'v.', '全部回覆', "Please don't reply all to this email.|請不要對這封信按全部回覆。"),
        ss('Please let me know if you have any questions.', '有任何問題請告訴我。', '寄件人'),
        ss('Sorry for the late reply.', '抱歉這麼晚回覆。', '寄件人'),
      ],
    ),
    {
      title: '郵件填空',
      items: [
        cz('I look forward to ___ from you.', ['hearing', 'hear', 'heard', 'be heard'], '期待您的回覆。', 'look forward to 的 to 是介系詞，後面接動名詞。'),
        cz('Please find ___ the updated price list.', ['attached', 'attach', 'attaching', 'attachment'], '附件是更新後的價目表。', '固定說法 Please find attached…（attached 是過去分詞）。'),
        cz("I'd appreciate it ___ you could reply by Friday.", ['if', 'that', 'what', 'unless'], '如果您能在星期五前回覆，我會很感激。', 'I would appreciate it if… 是客氣請求的固定句型。'),
        cz('Thank you for your ___ reply.', ['prompt', 'promptly', 'prompting', 'promptness'], '感謝您迅速回覆。', '名詞 reply 前面放形容詞 prompt。'),
      ],
    },
  ]),
  sceneUnit('en.biz.meeting', '📊', '會議與簡報', '主持會議、表達意見、做簡報', [
    part(
      '主持會議',
      tip('Running a meeting：主持會議', ["開場：Let's get started.、The purpose of today's meeting is to…", '議程是 agenda：The first item on the agenda is…', "收尾：Let's wrap up.、To sum up, …"], ["Let's get started.|我們開始吧。"]),
      [
        en('on the agenda', 'adj.', '在議程上', "What's next on the agenda?|議程上的下一項是什麼？"),
        en('any other business', 'n.', '其他事項（議程最後一項）', 'Is there any other business before we finish?|結束前還有其他事項嗎？'),
        ss("Let's get started.", '我們開始吧。', '主持人'),
        ss("The purpose of today's meeting is to review the budget.", '今天開會的目的是檢討預算。', '主持人'),
        ss('Does anyone have any questions?', '大家有問題嗎？', '主持人'),
      ],
    ),
    part(
      '表達意見',
      tip('Opinions：表達意見', ['表達意見：In my opinion, … / I think we should…', "完全同意：I couldn't agree more.", "委婉反對：I see your point, but…、I'm not sure that's the best approach."], ["I couldn't agree more.|我完全同意。"]),
      [
        en('see your point', 'v.', '明白你的意思', 'I see your point, but the cost is too high.|我明白你的意思，但費用太高了。'),
        en('agree with', 'v.', '同意（某人）', 'I agree with Tom on this.|這點我同意湯姆。'),
        ss("I couldn't agree more.", '我完全同意。', '你'),
        ss("I'm not sure that's the best approach.", '我不確定那是最好的做法。', '你'),
        ss('Could you clarify what you mean?', '可以說明一下你的意思嗎？', '你'),
      ],
    ),
    part(
      '做簡報',
      tip('Presentations：做簡報', ["開場：Today I'd like to talk about…", "轉換話題：Moving on to…、Let's take a look at this chart.", '結尾：That brings me to the end of my presentation.'], ['As you can see, sales have doubled.|如各位所見，銷售額翻倍了。']),
      [
        en('move on to', 'v.', '進入（下一個話題）', "Let's move on to the next slide.|我們進入下一張投影片。"),
        en('take a look at', 'v.', '看一下', "Let's take a look at the sales figures.|我們來看一下銷售數字。"),
        ss("Today I'd like to talk about our new product.", '今天我想談談我們的新產品。', '簡報者'),
        ss('As you can see, sales have doubled.', '如各位所見，銷售額翻倍了。', '簡報者'),
        ss('That brings me to the end of my presentation.', '我的簡報到此結束。', '簡報者'),
      ],
    ),
    answer([
      qa('What do you think of the proposal?', ["It looks good, but I'm worried about the cost.", 'I proposed last year.', 'It was on Monday.'], '你覺得這個提案怎麼樣？', '先肯定再提出疑慮，是會議中常見的說法。'),
      qa('Should we take a short break?', ["Good idea. Let's meet back in ten minutes.", 'It broke yesterday.', 'Yes, I took it.'], '我們要不要休息一下？', '接受提議並約好回來的時間。'),
      qa('Who will take the minutes?', ["I'll do it.", 'About thirty minutes.', 'It took a minute.'], '誰來做會議紀錄？', 'minutes 在這裡是「會議紀錄」，不是「分鐘」。'),
      qa('Can we move on to the next item?', ['Sure. Next is the marketing plan.', 'Yes, I moved last month.', "It's the next item."], '我們可以進入下一個議題嗎？', 'move on to 是進入下一個話題；moved 是「搬家」的陷阱。'),
    ]),
  ]),
  sceneUnit('en.biz.schedule', '📅', '約時間與出差', '約時間、改期、出差報帳', [
    part(
      '約時間',
      tip('Scheduling：約時間', ['問對方方便：Are you available on Thursday?、When works best for you?', "提出時間：How about two o'clock?", '確認：Let me check my calendar.'], ['When works best for you?|你什麼時候最方便？']),
      [
        en('work for', 'v.', '（時間）對…方便', 'Does Tuesday work for you?|星期二你方便嗎？'),
        en('check my calendar', 'v.', '查看我的行事曆', 'Let me check my calendar first.|我先看一下我的行事曆。'),
        ss('Are you available on Thursday afternoon?', '你星期四下午有空嗎？', '你'),
        ss("How about two o'clock?", '兩點如何？', '你'),
        ss('When works best for you?', '你什麼時候最方便？', '你'),
      ],
    ),
    part(
      '改期與取消',
      tip('Rescheduling：改期與取消', ['改期：Could we reschedule our meeting?', '原因說得簡短就好：Something urgent has come up.', '道歉：Sorry for the short notice.（抱歉臨時通知）'], ["I'm afraid I can't make it on Monday.|恐怕我星期一沒辦法到。"]),
      [
        en('short notice', 'n.', '臨時通知', 'Sorry for the short notice.|抱歉臨時通知。'),
        en('push back', 'v.', '延後', 'Can we push back the meeting to Friday?|會議可以延到星期五嗎？'),
        ss('Could we reschedule our meeting?', '我們的會議可以改期嗎？', '你'),
        ss('Something urgent has come up.', '臨時有急事。', '你'),
        ss("I'm afraid I can't make it on Monday.", '恐怕我星期一沒辦法到。', '你'),
      ],
    ),
    part(
      '出差',
      tip('Business trips：出差', ['出差是 business trip；報帳單是 expense report。', '訂機票飯店：I need to book a flight to Tokyo.', '收據要留好：Keep all your receipts for reimbursement.（報銷）'], ["I'll be out of the office next week.|我下週不在公司。"]),
      [
        en('travel expenses', 'n.', '差旅費', 'The company covers all travel expenses.|公司負擔所有差旅費。'),
        en('expense report', 'n.', '出差報帳單', 'Please submit your expense report by Friday.|請在星期五前交出差報帳單。'),
        ss('I need to book a flight to Tokyo.', '我需要訂一張去東京的機票。', '你'),
        ss('Keep all your receipts for reimbursement.', '所有收據都要留著報帳。', '主管'),
        ss("I'll be out of the office next week.", '我下週不在公司。', '你'),
      ],
    ),
    answer([
      qa('Are you free on Thursday?', ["I'm afraid I have meetings all day.", 'Yes, it is free of charge.', 'It was last Thursday.'], '你星期四有空嗎？', 'free 是「有空」；free of charge 是「免費」，小心陷阱。'),
      qa('Can we push the meeting back to three?', ['Sure, three works for me.', 'Push the door.', 'I came back at three.'], '會議可以延到三點嗎？', '確認新時間可以。'),
      qa('When will you be back from your trip?', ['Next Wednesday.', 'By train.', 'To Singapore.'], '你出差什麼時候回來？', 'When 問時間。'),
      qa('Has the meeting been canceled?', ["No, it's been moved to Friday.", 'Yes, I can sell it.', 'In the meeting room.'], '會議取消了嗎？', '沒取消而是改期，就說明新時間；canceled 和 can sell 發音相近。'),
    ]),
  ]),
  sceneUnit('en.biz.deal', '💰', '議價與客訴', '報價議價、達成協議、處理客訴', [
    part(
      '報價與議價',
      tip('Negotiating：報價與議價', ['要報價：Could you send me a price quote?', '議價：Is there any room for negotiation?、Do you offer a volume discount?', '讓步要附條件：If you order 500 units, we can offer 10% off.'], ['Is there any room for negotiation?|還有議價空間嗎？']),
      [
        en('volume discount', 'n.', '大量訂購折扣', 'We offer a volume discount on large orders.|大量訂購有折扣。'),
        en('price quote', 'n.', '報價', 'Could you send me a price quote?|可以寄報價給我嗎？'),
        ss('Is there any room for negotiation?', '還有議價空間嗎？', '你'),
        ss('If you order five hundred units, we can offer ten percent off.', '如果訂五百個，我們可以打九折。', '業務'),
        ss("That's a little over our budget.", '這有點超出我們的預算。', '你'),
      ],
    ),
    part(
      '達成協議',
      tip('Closing the deal：達成協議', ['接受：That sounds reasonable.、We have a deal.', "確認細節：Let's go over the terms once more.", '簽約是 sign the contract；交期是 delivery date。'], ['That sounds reasonable.|聽起來很合理。']),
      [
        en('meet halfway', 'v.', '各退一步', 'Could we meet halfway on the price?|價格上我們可以各退一步嗎？'),
        en('payment terms', 'n.', '付款條件', 'The payment terms are thirty days.|付款條件是三十天內付清。'),
        ss('That sounds reasonable.', '聽起來很合理。', '你'),
        ss("Let's go over the terms once more.", '我們再把條款確認一次。', '你'),
        ss('We have a deal.', '成交。', '你'),
      ],
    ),
    part(
      '處理客訴',
      tip('Complaints：處理客訴', ["先道歉並表示理解：I'm very sorry for the inconvenience.", "說明處理方式：We'll send a replacement right away.", "提出補償：We'd like to offer you a full refund."], ["I'll look into it right away.|我馬上去了解。"]),
      [
        en('get to the bottom of', 'v.', '查清楚（問題的原因）', "We'll get to the bottom of this.|我們會查清楚這件事。"),
        en('send a replacement', 'v.', '寄送替換品', "We'll send a replacement right away.|我們會馬上寄替換品給您。"),
        ss("I'm very sorry for the inconvenience.", '造成您的不便，非常抱歉。', '你'),
        ss('Could you give me your order number?', '可以告訴我您的訂單編號嗎？', '你'),
        ss("We'd like to offer you a full refund.", '我們願意全額退款給您。', '你'),
      ],
    ),
    answer([
      qa('The items we received were damaged.', ["I'm very sorry. We'll send replacements right away.", 'Yes, we received them.', "That's great news."], '我們收到的商品有損壞。', '先道歉再說處理方式。'),
      qa('Can you lower the price a little?', ['We can offer five percent off for orders over a hundred units.', 'The price is on the tag.', 'Lower the volume, please.'], '價格可以再低一點嗎？', '有條件地讓步。'),
      qa('When can you deliver?', ['Within two weeks of receiving the order.', 'To our warehouse.', 'By credit card.'], '你們什麼時候可以交貨？', 'When 問時間。'),
      qa('Can you guarantee delivery by May first?', ['Yes, as long as we receive the order this week.', 'It was delivered by hand.', 'May I come in?'], '你們能保證五月一日前交貨嗎？', '答應時加上條件（as long as），是談判常見的說法。'),
    ]),
  ]),
  drillUnit(
    'en.biz.quiz',
    '🎯',
    '商務情境綜合測驗',
    '12 題・電話、會議、郵件、約時間',
    [
      qa("Why don't we discuss this over lunch?", ['Sure, I know a good place nearby.', 'Because I ate lunch.', 'We discussed it yesterday.'], '我們何不邊吃午餐邊談？', "Why don't we…? 是提議，不是問原因。"),
      qa('Has the client signed the contract yet?', ["Not yet. They're still reviewing it.", 'Sign here, please.', 'The client is from Japan.'], '客戶簽約了嗎？', '還沒就說 Not yet.'),
      qa('Who is going to lead the project?', ['Ms. Park from the design team.', 'Next quarter.', 'It led to a problem.'], '誰要帶領這個專案？', 'Who 問人。'),
      qa('Could you send me the slides after the meeting?', ["Sure, I'll email them to you.", 'They slid down.', 'The meeting was long.'], '開完會可以把投影片寄給我嗎？', '答應並說會用 email 寄。'),
      qa("I'm calling to confirm my appointment tomorrow.", ['May I have your name, please?', 'I confirmed it yesterday.', 'Tomorrow is Friday.'], '我打來確認明天的預約。', '先確認對方的名字。'),
      qa('How did the presentation go?', ['Really well. The client loved it.', 'It goes to the second floor.', 'At ten tomorrow.'], '簡報進行得怎麼樣？', 'How did… go? 問結果。'),
      qa('Where should I send the invoice?', ['To our accounting department.', 'Last Friday.', 'Thirty days.'], '發票要寄到哪裡？', 'Where 問地點。'),
      qa('Would you like me to make copies of the report?', ['Yes, ten copies, please.', 'I reported it.', 'It was copied.'], '要我把報告影印幾份嗎？', '需要就說份數。'),
      cz('Could you ___ me through to the sales department?', ['put', 'give', 'take', 'make'], '可以幫我轉接業務部嗎？', 'put someone through 是電話轉接。'),
      cz("I'm afraid I can't ___ it to the meeting on time.", ['make', 'do', 'go', 'come'], '恐怕我沒辦法準時到會議。', 'make it 是「趕到、能出席」。'),
      cz("Let's ___ up the meeting here.", ['wrap', 'take', 'make', 'give'], '會議就到這裡吧。', 'wrap up 是收尾、結束。'),
      cz('Sorry for the short ___.', ['notice', 'notion', 'noticed', 'notify'], '抱歉臨時通知。', 'short notice 是固定搭配。'),
    ],
    6,
    'listening',
  ),
];

// ───────── 海外生活 ─────────

export const EN_LIFE_UNITS: Unit[] = [
  sceneUnit('en.life.home', '🔑', '租屋與報修', '找房子、簽約搬入、東西壞了', [
    part(
      '找房子',
      tip('Renting：找房子', ['租屋廣告常見：furnished（附家具）、utilities included（含水電瓦斯）、lease（租約）。', '押金是 security deposit；月租是 monthly rent。', '問房東：Is the apartment still available?'], ['Is the apartment still available?|那間公寓還在出租嗎？']),
      [
        en('security deposit', 'n.', '押金', "The security deposit is one month's rent.|押金是一個月的房租。"),
        en('utilities included', 'adj.', '含水電瓦斯', 'The rent is twelve hundred dollars, utilities included.|房租一千二，含水電瓦斯。'),
        ss('Is the apartment still available?', '那間公寓還在出租嗎？', '你'),
        ss('Is it furnished?', '有附家具嗎？', '你'),
        ss('How long is the lease?', '租約多長？', '你'),
      ],
    ),
    part(
      '簽約與搬入',
      tip('Moving in：簽約與搬入', ['簽約前看清楚：Can I have a copy of the lease?', '能不能養寵物：Are pets allowed?', '搬入是 move in；搬出是 move out。'], ['When is the rent due?|房租什麼時候要繳？']),
      [
        en('monthly rent', 'n.', '月租', 'The monthly rent is nine hundred dollars.|月租是九百美元。'),
        en('sign the lease', 'v.', '簽租約', 'You need to sign the lease before you move in.|搬進去之前要先簽租約。'),
        ss('Are pets allowed?', '可以養寵物嗎？', '你'),
        ss('Can I have a copy of the lease?', '可以給我一份租約影本嗎？', '你'),
        ss('When is the rent due?', '房租什麼時候要繳？', '你'),
      ],
    ),
    part(
      '報修',
      tip('Repairs：報修', ['東西壞了聯絡房東（landlord）或大樓管理員（building manager）。', '描述問題：The sink is leaking.（水槽漏水）、The heater stopped working.（暖氣壞了）', '約修理時間：When can someone come to fix it?'], ['The sink is leaking.|水槽在漏水。']),
      [
        en('leaking faucet', 'n.', '漏水的水龍頭', 'The landlord fixed the leaking faucet.|房東修好了漏水的水龍頭。'),
        en('building manager', 'n.', '大樓管理員', "Call the building manager if there's a problem.|有問題就打給大樓管理員。"),
        ss('The sink is leaking.', '水槽在漏水。', '你'),
        ss('The heater stopped working.', '暖氣壞了。', '你'),
        ss('When can someone come to fix it?', '什麼時候可以有人來修？', '你'),
      ],
    ),
    answer([
      qa('Are utilities included in the rent?', ['Water is included, but electricity is extra.', 'Yes, I rent it.', 'Twelve months.'], '房租有含水電嗎？', 'extra 是另外收費。'),
      qa('When would you like to see the apartment?', ['Is Saturday morning okay?', 'It has two bedrooms.', 'I saw it online.'], '您想什麼時候來看房？', '提出時間並徵詢對方。'),
      qa('My kitchen sink is leaking.', ["I'll send a plumber this afternoon.", 'The kitchen is big.', 'Yes, it is a sink.'], '我廚房的水槽在漏水。', '房東的回應：派水電工（plumber）來。'),
      qa('How much is the security deposit?', ["It's the same as one month's rent.", 'The security guard is nice.', 'I deposited it yesterday.'], '押金是多少？', '押金常以「幾個月的房租」計算。'),
    ]),
  ]),
  sceneUnit('en.life.bank', '🏦', '銀行與手機', '開戶、轉帳、辦門號', [
    part(
      '開戶',
      tip('Opening an account：開戶', ["開戶：I'd like to open an account.", '支票帳戶 checking account、儲蓄帳戶 savings account。', '常要準備身分證件（ID）和地址證明（proof of address，例如水電帳單）。'], ['What documents do I need?|我需要準備什麼文件？']),
      [
        en('open an account', 'v.', '開戶', "I'd like to open an account.|我想開戶。"),
        en('proof of address', 'n.', '地址證明', 'A utility bill can be used as proof of address.|水電帳單可以當作地址證明。'),
        ss('What documents do I need?', '我需要準備什麼文件？', '你'),
        ss('Is there a monthly fee?', '有月費嗎？', '你'),
        ss('Can I set up online banking?', '可以開通網路銀行嗎？', '你'),
      ],
    ),
    part(
      '轉帳與卡片',
      tip('Transfers & cards：轉帳與卡片', ['轉帳是 transfer money；匯到國外是 international transfer。', '手續費是 fee；匯率是 exchange rate。', '卡片被提款機吃掉：My card got stuck in the ATM.'], ["What's today's exchange rate?|今天的匯率是多少？"]),
      [
        en('wire transfer', 'n.', '電匯', 'A wire transfer usually takes two days.|電匯通常要兩天。'),
        en('transfer money', 'v.', '轉帳', 'I need to transfer money to my family in Taiwan.|我需要轉帳給台灣的家人。'),
        ss('How much is the fee for an international transfer?', '國際匯款的手續費是多少？', '你'),
        ss('My card got stuck in the ATM.', '我的卡被提款機吃掉了。', '你'),
        ss("I think there's an error on my statement.", '我覺得我的對帳單有錯。', '你'),
      ],
    ),
    part(
      '辦手機',
      tip('Phone plans：辦手機', ['預付卡是 prepaid plan；月租方案是 monthly plan；綁約是 contract。', '流量是 data；吃到飽是 unlimited data。', '只要 SIM 卡：I just need a SIM card.'], ['Is there a contract?|要綁約嗎？']),
      [
        en('unlimited data', 'n.', '無限流量（吃到飽）', 'Does this plan come with unlimited data?|這個方案有無限流量嗎？'),
        en('prepaid plan', 'n.', '預付方案', 'A prepaid plan is cheaper for short stays.|短期停留用預付方案比較便宜。'),
        ss('I just need a SIM card.', '我只需要一張 SIM 卡。', '你'),
        ss('Is there a contract?', '要綁約嗎？', '你'),
        ss('How much data do I get?', '有多少流量？', '你'),
      ],
    ),
    answer([
      qa('What kind of account would you like to open?', ['A checking account, please.', 'At nine in the morning.', 'Yes, it is open.'], '您想開哪一種帳戶？', 'open 可以是「開戶」也可以是「營業中」，小心陷阱。'),
      qa('Could you enter your PIN, please?', ['Okay, just a second.', 'Yes, I have a pen.', 'In the inside pocket.'], '請輸入密碼。', 'PIN 是個人密碼，和 pen 發音相近。'),
      qa('Would you like a monthly plan or a prepaid one?', ["Prepaid, please. I'm only here for three months.", 'Yes, I would.', 'I paid last month.'], '您要月租方案還是預付的？', '選擇疑問句直接選一個，並說明原因。'),
      qa('Do you have proof of address?', ['Will a utility bill work?', 'Yes, I proved it.', 'My address is long.'], '有地址證明嗎？', '問對方水電帳單可不可以用。'),
    ]),
  ]),
  sceneUnit('en.life.clinic', '🏥', '看醫生與藥局', '預約看診、說明症狀、領藥', [
    part(
      '預約看診',
      tip('Appointments：預約看診', ["國外看醫生通常要先預約：I'd like to make an appointment with Dr. Lee.", "第一次去：I'm a new patient.", '急診是 emergency room（ER）；小病可以去 urgent care（急症診所）。'], ["I'd like to see a doctor today.|我今天想看醫生。"]),
      [
        en('walk in', 'v.', '不預約直接去', 'Can I just walk in without an appointment?|我可以不預約直接去嗎？'),
        en('new patient', 'n.', '初診病人', 'New patients should arrive fifteen minutes early.|初診病人請提早十五分鐘到。'),
        ss("I'd like to see a doctor today.", '我今天想看醫生。', '你'),
        ss('Do you accept my insurance?', '你們接受我的保險嗎？', '你'),
        ss("I'm a new patient.", '我是初診。', '你'),
      ],
    ),
    part(
      '說明症狀',
      tip('Symptoms：說明症狀', ["描述症狀：I have a fever.（發燒）、I've been coughing for three days.（咳了三天）", '痛：It hurts here.（這裡痛）', "過敏：I'm allergic to penicillin."], ["I've had a fever since last night.|我從昨晚就開始發燒。"]),
      [
        en('stuffy nose', 'n.', '鼻塞', 'I have a stuffy nose and a headache.|我鼻塞又頭痛。'),
        en('runny nose', 'n.', '流鼻水', 'My son has had a runny nose all week.|我兒子流鼻水一整個星期了。'),
        ss("I've had a fever since last night.", '我從昨晚就開始發燒。', '你'),
        ss('It hurts when I swallow.', '吞東西時會痛。', '你'),
        ss("I'm allergic to penicillin.", '我對盤尼西林過敏。', '你'),
      ],
    ),
    part(
      '在藥局',
      tip('At the pharmacy：在藥局', ['處方藥是 prescription；成藥是 over-the-counter medicine。', '用法：Take one tablet twice a day after meals.', '問副作用：Are there any side effects?'], ['Will this make me sleepy?|吃了會想睡嗎？']),
      [
        en('side effects', 'n.', '副作用', 'This medicine has few side effects.|這個藥的副作用很少。'),
        en('fill a prescription', 'v.', '照處方配藥', 'I need to fill a prescription.|我需要領處方藥。'),
        ss('Take one tablet twice a day after meals.', '一天兩次，每次一顆，飯後吃。', '藥師'),
        ss('Will this make me sleepy?', '吃了會想睡嗎？', '你'),
        ss('Do you have anything for a cold?', '有治感冒的藥嗎？', '你'),
      ],
    ),
    answer([
      qa('What brings you in today?', ["I've had a bad cough for a week.", 'I came by bus.', 'Yes, I brought it.'], '今天哪裡不舒服？', '醫生的開場白，問來看診的原因；By bus 是回答「怎麼來」的陷阱。'),
      qa('Are you taking any other medication?', ['Just some vitamins.', 'I took a taxi.', 'Twice a day.'], '你有在吃其他藥嗎？', '問有沒有吃其他藥；Twice a day 是回答頻率。'),
      qa('Do you have a prescription?', ["No, I'm looking for something over the counter.", 'Yes, I described it.', "It's on the counter."], '你有處方箋嗎？', 'over the counter 是不用處方的成藥；on the counter 是「在櫃台上」。'),
      qa('Do you have an appointment?', ["No, but I'd like to see a doctor today.", 'Yes, I appointed him.', 'At the hospital.'], '您有預約嗎？', '沒預約就說明想今天看診。'),
    ]),
  ]),
  sceneUnit('en.life.neighbor', '🏘️', '鄰居與社區', '認識鄰居、生活小事、垃圾與規定', [
    part(
      '認識鄰居',
      tip('Neighbors：認識鄰居', ['剛搬來：Hi, I just moved in next door.', "自我介紹：I'm Amy, by the way.", '美國的鄰居之間常揮手打招呼、聊幾句天氣。'], ['How long have you lived here?|你住這裡多久了？']),
      [
        en('next door', 'adv.', '隔壁', 'I just moved in next door.|我剛搬到隔壁。'),
        en('by the way', 'adv.', '對了；順便一提', "I'm Amy, by the way.|對了，我叫艾咪。"),
        ss('Nice to finally meet you.', '終於見到你了，很高興認識你。', '你'),
        ss('How long have you lived here?', '你住這裡多久了？', '你'),
        ss('Let me know if you ever need anything.', '有需要什麼隨時跟我說。', '鄰居'),
      ],
    ),
    part(
      '生活小事',
      tip('Favors & noise：生活小事', ['請鄰居幫忙收包裹：Could you hold a package for me?', '噪音：Could you keep it down a little?（可以小聲一點嗎）', '先說一句 Sorry to bother you, but… 比較不會傷感情。'], ['Thanks for letting me know.|謝謝你告訴我。']),
      [
        en('keep it down', 'v.', '小聲一點', 'Could you keep it down after ten?|十點以後可以小聲一點嗎？'),
        en('sorry to bother you', 'phr.', '不好意思打擾了', 'Sorry to bother you, but is this your package?|不好意思打擾了，這是你的包裹嗎？'),
        ss('Could you hold a package for me?', '可以幫我代收包裹嗎？', '你'),
        ss('Your music is a little loud.', '你的音樂有點大聲。', '你'),
        ss('Thanks for letting me know.', '謝謝你告訴我。', '鄰居'),
      ],
    ),
    part(
      '垃圾與社區規定',
      tip('Trash & rules：垃圾與社區規定', ['垃圾是 trash（美式）或 rubbish（英式）；回收是 recycling。', '收垃圾的日子叫 trash day。', '社區告示：No parking（禁止停車）、Quiet hours（安靜時段）。'], ['Which bin is for recycling?|哪一個桶子是回收用的？']),
      [
        en('trash day', 'n.', '收垃圾日', 'Tuesday is trash day on our street.|我們這條街星期二收垃圾。'),
        en('quiet hours', 'n.', '安靜時段', 'Quiet hours are from ten at night to seven in the morning.|安靜時段是晚上十點到早上七點。'),
        ss('Which bin is for recycling?', '哪一個桶子是回收用的？', '你'),
        ss('Where should I put the trash?', '垃圾應該放哪裡？', '你'),
        ss("You can't park here.", '這裡不能停車。', '鄰居'),
      ],
    ),
    answer([
      qa('Hi, are you new here?', ['Yes, I just moved in last week.', "No, it's old.", "I'm here."], '嗨，你是新搬來的嗎？', '回答並簡單介紹自己。'),
      qa('Sorry, is the music too loud?', ['Just a little. Could you turn it down a bit?', 'Yes, it is music.', 'I bought it yesterday.'], '抱歉，音樂太大聲嗎？', '客氣地請對方調小聲。'),
      qa('A package came for you while you were out.', ['Oh, thank you for taking it in.', 'I went out at seven.', 'Yes, I packed it.'], '你出門時有你的包裹送來。', '謝謝鄰居代收。'),
      qa('Do you know when trash day is?', ["It's every Tuesday morning.", 'Yes, I know him.', 'It was trashed.'], '你知道哪天收垃圾嗎？', '回答收垃圾的日子。'),
    ]),
  ]),
  sceneUnit('en.life.work', '💼', '求職與面試', '應徵、面試、工作條件', [
    part(
      '應徵',
      tip('Applying：應徵', ['履歷：résumé（美）、CV（英）；求職信：cover letter。', "應徵：I'd like to apply for the sales position.", "問進度：I'm following up on my application."], ['Is the position still open?|這個職缺還有嗎？']),
      [
        en('job posting', 'n.', '徵才啟事', 'I saw your job posting online.|我在網路上看到你們的徵才啟事。'),
        en('work experience', 'n.', '工作經驗', 'Do you have any work experience in retail?|你有零售業的工作經驗嗎？'),
        ss("I'm following up on my application.", '我想詢問我的應徵進度。', '你'),
        ss('Is the position still open?', '這個職缺還有嗎？', '你'),
        ss('I have three years of experience in sales.', '我有三年的業務經驗。', '你'),
      ],
    ),
    part(
      '面試',
      tip('Interviews：面試', ['常見題：Tell me about yourself.、What are your strengths?、Why do you want to work here?', '回答要有具體例子，最後連結到這份工作。', '最後通常會問 Do you have any questions for us?，準備一兩個問題比較好。'], ['Tell me about yourself.|請介紹一下你自己。']),
      [
        en('strengths and weaknesses', 'n.', '優點和缺點', 'Be ready to talk about your strengths and weaknesses.|準備好談談你的優缺點。'),
        en('team player', 'n.', '有團隊精神的人', "I'm a team player.|我很有團隊精神。"),
        ss('Tell me about yourself.', '請介紹一下你自己。', '面試官'),
        ss('Why do you want to work here?', '你為什麼想在這裡工作？', '面試官'),
        ss('Do you have any questions for us?', '你有什麼問題想問我們嗎？', '面試官'),
      ],
    ),
    part(
      '工作條件',
      tip('Job offers：工作條件', ['薪水：salary（年薪、月薪）、hourly wage（時薪）。', '福利是 benefits，例如 health insurance、paid leave（有薪假）。', '問開始日期：When would you like me to start?'], ['Thank you for your time today.|謝謝您今天撥空。']),
      [
        en('trial period', 'n.', '試用期', "There's a three-month trial period.|有三個月的試用期。"),
        en('hourly wage', 'n.', '時薪', 'The hourly wage is eighteen dollars.|時薪是十八美元。'),
        ss('What are the working hours?', '工作時間是幾點到幾點？', '你'),
        ss('When would you like me to start?', '您希望我什麼時候開始上班？', '你'),
        ss('Thank you for your time today.', '謝謝您今天撥空。', '你'),
      ],
    ),
    answer([
      qa('Why are you interested in this position?', ['I want to use my sales experience at an international company.', "Because it's on the fifth floor.", 'I was interested yesterday.'], '你為什麼對這個職位有興趣？', '把自己的經驗和職位連起來。'),
      qa('What is your biggest strength?', ["I'm very organized and I always meet deadlines.", 'I go to the gym.', "It's very strong."], '你最大的優點是什麼？', '說優點並舉例。'),
      qa('When can you start?', ['I can start in two weeks.', 'It started at nine.', 'At the start.'], '你什麼時候可以開始上班？', '回答可以開始的時間。'),
      qa('Is there anything you would like to ask us?', ['Yes. What does a typical day look like in this role?', 'No, I have no answers.', 'Yes, I asked them.'], '你有什麼問題想問我們嗎？', '面試最後準備一個問題，表示你對這份工作有興趣。'),
    ]),
  ]),
  sceneUnit('en.life.service', '📦', '客服與網購', '打客服、包裹配送、取消與退款', [
    part(
      '打客服電話',
      tip('Customer service：打客服電話', ['語音選單：Press one for billing.（帳務請按 1）', "要轉真人客服：I'd like to speak to a representative.", '說明問題：I was charged twice for the same order.'], ['Could you check the status of my order?|可以幫我查訂單狀態嗎？']),
      [
        en('automated message', 'n.', '自動語音', 'An automated message asked me to press one.|自動語音要我按 1。'),
        en('speak to a representative', 'v.', '和真人客服通話', "I'd like to speak to a representative.|我想跟真人客服通話。"),
        ss('I was charged twice for the same order.', '同一筆訂單被扣了兩次款。', '你'),
        ss('Could you check the status of my order?', '可以幫我查訂單狀態嗎？', '你'),
        ss('Can I have a reference number?', '可以給我一個案件編號嗎？', '你'),
      ],
    ),
    part(
      '包裹配送',
      tip('Deliveries：包裹配送', ['追蹤包裹要用 tracking number。', "包裹沒到：My package hasn't arrived yet.", '寄錯：I received the wrong item.'], ["My package hasn't arrived yet.|我的包裹還沒到。"]),
      [
        en('out for delivery', 'adj.', '配送中', 'Your package is out for delivery.|您的包裹正在配送中。'),
        en('wrong item', 'n.', '寄錯的商品', 'I received the wrong item.|我收到的商品寄錯了。'),
        ss("My package hasn't arrived yet.", '我的包裹還沒到。', '你'),
        ss('The box was damaged when it arrived.', '箱子送到時就已經壞了。', '你'),
        ss('Can I change the delivery address?', '可以更改配送地址嗎？', '你'),
      ],
    ),
    part(
      '取消與退款',
      tip('Cancellations：取消與退款', ["取消訂閱：I'd like to cancel my subscription.", '問退款要多久：How long will the refund take?', '自動續約是 auto-renewal，免費試用（free trial）結束前記得先關掉。'], ['How long will the refund take?|退款要多久？']),
      [
        en('cancel my subscription', 'v.', '取消我的訂閱', "I'd like to cancel my subscription.|我想取消訂閱。"),
        en('billing cycle', 'n.', '帳單週期', 'The charge will appear in your next billing cycle.|這筆費用會出現在下一期帳單。'),
        ss('How long will the refund take?', '退款要多久？', '你'),
        ss('Can you turn off auto-renewal for me?', '可以幫我關掉自動續約嗎？', '你'),
        ss('I never signed up for this service.', '我從來沒有註冊過這個服務。', '你'),
      ],
    ),
    answer([
      qa('How can I help you today?', ['I was charged twice for my order.', 'I helped him yesterday.', "I'm fine today."], '今天有什麼可以為您服務的？', '直接說明問題。'),
      qa('Can I have your order number, please?', ['Sure, just a moment while I find it.', 'I ordered a lamp.', 'The number is wrong.'], '可以給我您的訂單編號嗎？', '先答應，再去找編號。'),
      qa('Would you like a refund or a replacement?', ['A refund, please.', 'Yes, I would.', 'I placed it there.'], '您要退款還是換貨？', '選擇疑問句不能用 Yes/No 回答。'),
      qa('Your refund will take five to seven business days.', ['Okay, thanks for letting me know.', 'I took five of them.', 'It was a business trip.'], '退款需要五到七個工作天。', 'business days 是工作天（不含週末假日）。'),
    ]),
  ]),
  drillUnit(
    'en.life.quiz',
    '🎯',
    '生活情境綜合測驗',
    '12 題・租屋、醫院、銀行、鄰居、網購',
    [
      qa('Is the apartment close to public transportation?', ['Yes, the subway station is a five-minute walk.', 'It closes at six.', 'Yes, I transport goods.'], '公寓離大眾運輸近嗎？', 'close 當形容詞是「近的」，當動詞是「關門」，小心陷阱。'),
      qa("I'd like to make an appointment with Dr. Kim.", ['Is Thursday at ten okay?', 'I made it myself.', 'Dr. Kim is a doctor.'], '我想預約金醫生的門診。', '提出可預約的時間。'),
      qa('Did you remember to pay the electricity bill?', ["Oh no, I'll pay it online now.", 'The lights are on.', 'I remember him.'], '你記得繳電費了嗎？', '忘了就說馬上處理。'),
      qa('How long have you been feeling this way?', ['Since Monday.', 'Very badly.', 'This way, please.'], '這種情況持續多久了？', 'How long 問持續的時間，用 since 或 for 回答。'),
      qa("Could you water my plants while I'm away?", ['Sure, no problem.', 'They are green plants.', "I'm away on business."], '我不在的時候可以幫我澆花嗎？', '答應就說 Sure, no problem.'),
      qa('When does the store close on Sundays?', ['At six in the evening.', 'Near the bank.', 'Yes, it closed.'], '這家店星期日幾點關門？', 'When 問時間。'),
      qa('Your package will arrive on Friday.', ['Great. Will I need to sign for it?', 'I packed it on Friday.', 'The box is heavy.'], '您的包裹星期五會送到。', '確認收件細節。'),
      qa('Would you prefer to pay in cash or by card?', ['By card, please.', 'Yes, I prefer.', 'It costs a lot.'], '您想付現還是刷卡？', '選擇疑問句直接選一個。'),
      cz('The rent is ___ on the first of every month.', ['due', 'during', 'duty', 'dual'], '房租每個月一號要繳。', 'due 是「到期、應繳」。'),
      cz("I'm allergic ___ peanuts.", ['to', 'with', 'for', 'of'], '我對花生過敏。', 'allergic to 是固定搭配。'),
      cz("I'd like to ___ an appointment for next week.", ['make', 'do', 'put', 'give'], '我想預約下週看診。', '預約是 make an appointment。'),
      cz('The baby is sleeping. Could you keep it ___?', ['down', 'up', 'off', 'out'], '寶寶在睡覺，可以小聲一點嗎？', 'keep it down 是請人小聲一點；keep it up 是「繼續保持」。'),
    ],
    6,
    'listening',
  ),
];
