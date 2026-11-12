// 英文情境路線：商務英語。
// 每個單元分成幾個小情境，每課先看說明卡（什麼時候這樣說、語氣與文化），再練關鍵片語和整句（標出是誰說的），
// 最後是情境應答題：聽對方說的話，選出合適的回答（也是多益 Part 2 的練習）。
import type { GrammarNote, Item, Unit } from '../core/types';
import { cz, drillUnit, en, note, qa, sceneUnit, ss, type GrammarPart } from './dsl';

const tip = (title: string, body: string[], ex: string[] = []): GrammarNote => note(title, body, ex);
const part = (title: string, n: GrammarNote, items: Item[]): GrammarPart => ({ title, notes: [n], items });
const answer = (items: Item[]): GrammarPart => ({ title: '情境應答', items });

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
