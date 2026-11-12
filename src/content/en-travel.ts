// 英文情境路線：旅遊英語。
// 每個單元分成幾個小情境，每課先看說明卡（什麼時候這樣說、語氣與文化），再練關鍵片語和整句（標出是誰說的），
// 最後是情境應答題：聽對方說的話，選出合適的回答（也是多益 Part 2 的練習）。
import type { GrammarNote, Item, Unit } from '../core/types';
import { drillUnit, en, note, qa, sceneUnit, ss, type GrammarPart } from './dsl';

const tip = (title: string, body: string[], ex: string[] = []): GrammarNote => note(title, body, ex);
const part = (title: string, n: GrammarNote, items: Item[]): GrammarPart => ({ title, notes: [n], items });
const answer = (items: Item[]): GrammarPart => ({ title: '情境應答', items });

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
