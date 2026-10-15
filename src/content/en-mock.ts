// 英文實戰模擬考：仿多益（TOEIC Listening & Reading）的題型，題目全部是原創。
// 難度對應橘色、棕色證書的課程內容。每次從題庫隨機抽題，所以每次考的都不太一樣。
import type { MockExam } from '../core/types';
import { mockExam, mq, one, set } from './mockDsl';

const brown = mockExam({
  id: 'en.mock.brown',
  title: '多益模擬考：橘色・棕色',
  subtitle: '聽力 Part 2、3＋閱讀 Part 5、6、7',
  about:
    '正式的多益是聽力 100 題（45 分鐘）＋閱讀 100 題（75 分鐘），滿分 990 分。這份模擬考把題型縮小成約 28 題、20 分鐘，難度對應橘色到棕色證書（約 10–465 分），用來確認實力、熟悉題型。',
  after: 'en.brown',
  minutes: 20,
  pass: 0.6,
  levels: [
    { min: 0.85, label: '棕色證書很穩', desc: '這個程度的題目幾乎難不倒你，可以往綠色證書（470 分以上）前進了。' },
    { min: 0.6, label: '棕色證書程度', desc: '大約落在棕色證書的範圍。把答錯的題目整理起來，再多練幾次就會更穩。' },
    { min: 0.35, label: '橘色證書程度', desc: '基礎已經有了。建議把棕色證書的單元上完，特別是會議、電話和電子郵件用語。' },
    { min: 0, label: '先打穩基礎', desc: '建議先把橘色證書的單元和複習做完，再回來挑戰。' },
  ],
  sections: [
    {
      id: 'p2',
      title: 'Part 2 應答問題',
      intro: '聽一個問題或一句話，選出最適當的回應。實際考試的選項也是用聽的，這裡印出來方便練習。',
      listening: true,
      pick: 6,
      groups: [
        set({ script: ['F: Where should I put these boxes?'], zh: '這些箱子要放在哪裡？' }, mq(undefined, ['In the storage room, please.', 'Yes, I put them on.', 'About ten boxes.'], 'Where 問地點，要回答位置；疑問詞問句不會用 Yes 回答。')),
        set({ script: ['M: When does the next train to Taipei leave?'], zh: '下一班往台北的火車什麼時候開？' }, mq(undefined, ['In about twenty minutes.', 'From platform three.', 'A round-trip ticket.'], 'When 問時間。From platform three 回答的是地點。')),
        set({ script: ['F: Who is in charge of the new project?'], zh: '新專案由誰負責？' }, mq(undefined, ['Ms. Chen from marketing.', 'It starts next week.', 'Yes, it is a new one.'], 'Who 問人，回答人名或職稱。')),
        set({ script: ['M: How long will the meeting last?'], zh: '會議會開多久？' }, mq(undefined, ['About an hour.', 'In room 302.', 'Last Monday.'], 'How long 問時間長度。Last Monday 是用 last 這個字設下的陷阱。')),
        set({ script: ['F: Why did you call the client this morning?'], zh: '你今天早上為什麼打電話給客戶？' }, mq(undefined, ['To confirm the delivery date.', "At nine o'clock.", "No, I didn't."], 'Why 問原因，常見的回答是 To ＋ 動詞（為了…）或 Because…。')),
        set({ script: ['M: Could you send me the sales report by Friday?'], zh: '你可以在星期五前把銷售報告寄給我嗎？' }, mq(undefined, ["Sure, I'll email it to you.", 'It was a good report.', 'I reported it to him.'], 'Could you…? 是請求，回答答應或婉拒。另外兩個選項重複了 report 這個字，是典型陷阱。')),
        set({ script: ['F: Would you like to join us for lunch?'], zh: '要不要跟我們一起吃午餐？' }, mq(undefined, ["I'd love to, thanks.", 'Lunch is in the cafeteria.', 'I joined last year.'], 'Would you like to…? 是邀請，回答接受或婉拒。')),
        set({ script: ['M: Is this seat taken?'], zh: '這個位子有人坐嗎？' }, mq(undefined, ['No, go ahead.', "I'll take it.", "It's a comfortable seat."], '回答「沒有，請坐」。take 和 seat 重複出現的選項是陷阱。')),
        set({ script: ['F: Do you know where the printer is?'], zh: '你知道印表機在哪裡嗎？' }, mq(undefined, ["It's next to the copy machine.", 'Yes, I printed it.', 'Twenty pages.'], '間接問句 Do you know where… 還是在問地點，直接回答位置最自然。')),
        set({ script: ["M: Haven't you finished the budget yet?"], zh: '你還沒做完預算嗎？' }, mq(undefined, ["I'm almost done.", 'The budget is very large.', 'Yes, I will start it.'], '否定疑問句照事實回答：「快好了」最自然。Yes, I will start it 前後矛盾。')),
        set({ script: ['F: Should we meet in the morning or in the afternoon?'], zh: '我們該約早上還是下午？' }, mq(undefined, ['The afternoon works better for me.', 'Yes, we should.', 'In the meeting room.'], '選擇問句（A or B）通常不用 Yes／No 回答，直接選一個。')),
        set({ script: ['M: The elevator is out of order.'], zh: '電梯故障了。' }, mq(undefined, ["Let's take the stairs, then.", "I'll order it now.", "It's on the fifth floor."], '直述句：選最合理的反應。order 是用發音相同的字設的陷阱。')),
      ],
    },
    {
      id: 'p3',
      title: 'Part 3 簡短對話',
      intro: '聽一段兩人的對話，回答三個問題。可以先看題目，再按播放。',
      listening: true,
      pick: 2,
      groups: [
        set(
          {
            script: [
              'F: Hi, Tom. Did you order the paper for the printer?',
              "M: Not yet. The supplier's website was down this morning.",
              "F: Could you call them instead? We'll run out by Thursday.",
              "M: Sure, I'll call them right after lunch.",
            ],
            zh: '女：嗨，Tom，你訂印表機的紙了嗎？／男：還沒，供應商的網站今天早上掛了。／女：那你可以改打電話給他們嗎？我們星期四前就會用完了。／男：好，我吃完午餐馬上打。',
          },
          mq('What problem does the man mention?', ['A website was not working.', 'The printer was broken.', 'The paper was too expensive.', 'The supplier closed early.'], 'The website was down＝網站掛了。'),
          mq('When will they run out of paper?', ['By Thursday', 'This morning', 'After lunch', 'Next week'], "女生說 We'll run out by Thursday。"),
          mq('What will the man probably do after lunch?', ['Call a supplier', 'Fix the printer', 'Visit a website', 'Buy lunch for the woman'], "I'll call them right after lunch，them 指供應商。"),
        ),
        set(
          {
            script: [
              "M: Hello, I'd like to book a table for four this Friday at seven.",
              "F: I'm sorry, we're fully booked at seven. We have a table at eight thirty.",
              'M: That is a little late. Our guests from Japan have an early flight the next morning.',
              'F: Then how about six o’clock? A table by the window just became available.',
              "M: Perfect. We'll take it.",
            ],
            zh: '男：你好，我想訂這星期五晚上七點、四個人的位子。／女：抱歉，七點已經訂滿了，八點半有位子。／男：有點晚，我們的日本客人隔天一早要搭飛機。／女：那六點呢？剛好空出一張靠窗的桌子。／男：太好了，就訂這個。',
          },
          mq('Where does the woman most likely work?', ['At a restaurant', 'At an airport', 'At a hotel front desk', 'At a travel agency'], 'book a table（訂位）、fully booked 都是餐廳的用語。'),
          mq('Why is eight thirty a problem for the man?', ['His guests have an early flight.', 'The restaurant closes at eight.', 'He has another meeting.', 'His guests do not like the window seats.'], 'Our guests … have an early flight the next morning。'),
          mq('What time is the reservation?', ["At six o'clock", "At seven o'clock", 'At eight thirty', "At four o'clock"], '女生提議六點，男生說 Perfect. We’ll take it。'),
        ),
        set(
          {
            script: [
              'F: Good morning. Are you Kevin, the new sales assistant?',
              "M: Yes, that's me. Today is my first day.",
              "F: Welcome! I'm Lisa from personnel. First I'll show you to your desk, and then we have a short training session at ten.",
              'M: Great. Should I bring anything to the training?',
              "F: Just your ID card. We'll give you a laptop there.",
            ],
            zh: '女：早安，你是新來的業務助理 Kevin 嗎？／男：是的，今天是我第一天上班。／女：歡迎！我是人事部的 Lisa。我先帶你到座位，十點有一場簡短的訓練。／男：好的，訓練需要帶什麼嗎？／女：帶員工證就好，筆電會在那裡發給你。',
          },
          mq('Who is the man?', ['A new employee', 'A personnel manager', 'A sales client', 'A computer technician'], 'Today is my first day＝新進員工。'),
          mq("What will happen at ten o'clock?", ['A training session', 'A sales meeting', 'A job interview', 'A lunch break'], 'we have a short training session at ten。'),
          mq('What should the man bring?', ['His ID card', 'A laptop', 'A sales report', 'His resume'], "Just your ID card。筆電是 We'll give you a laptop，會發給他。"),
        ),
      ],
    },
    {
      id: 'p5',
      title: 'Part 5 句子填空',
      intro: '選出最適合填入空格的答案。先看空格前後的詞性，很多題不用看完整句就能選。',
      pick: 8,
      groups: [
        one('Please ___ the attached file before the meeting.', ['review', 'reviewing', 'reviewed', 'reviewer'], 'Please 後面接原形動詞。', '開會前請先看過附件。'),
        one('Our store is open ___ 9 a.m. to 6 p.m. on weekdays.', ['from', 'at', 'on', 'since'], 'from A to B：從 A 到 B。', '本店平日從早上九點營業到晚上六點。'),
        one('Ms. Park has worked at this company ___ 2018.', ['since', 'for', 'ago', 'during'], 'since ＋ 時間點，搭配現在完成式。', '朴小姐從 2018 年起就在這家公司工作。'),
        one('The conference room is ___ for the whole afternoon.', ['available', 'availability', 'avail', 'availably'], 'be 動詞後面接形容詞。', '會議室整個下午都可以使用。'),
        one('Mr. Lee asked his assistant to ___ the meeting to Thursday.', ['postpone', 'cancel', 'attend', 'reply'], 'postpone A to B：把 A 延到 B。cancel 是取消，不會接 to Thursday。', '李先生請助理把會議延到星期四。'),
        one('We received many ___ about the new product.', ['complaints', 'complain', 'complained', 'complaining'], 'many 後面接複數名詞。', '我們收到很多關於新產品的客訴。'),
        one('The shipment will arrive ___ two or three days.', ['within', 'among', 'between', 'during'], 'within ＋ 一段時間：在…之內。', '貨物會在兩三天內送達。'),
        one('Could you ___ me the sales figures by email?', ['send', 'sent', 'sending', 'to send'], 'Could you 後面接原形動詞。', '可以用電子郵件把銷售數字寄給我嗎？'),
        one('The printer on the second floor is not working ___.', ['properly', 'proper', 'property', 'propriety'], '修飾動詞 working 要用副詞。', '二樓的印表機運作不正常。'),
        one('If you have any questions, please ___ hesitate to contact us.', ['do not', 'not', 'are not', 'no'], '祈使句的否定：please do not ＋ 原形動詞。', '如果有任何問題，請不要猶豫，隨時與我們聯絡。'),
        one('Each participant ___ a name tag at the front desk.', ['receives', 'receive', 'receiving', 'to receive'], 'each ＋ 單數名詞，動詞用第三人稱單數。', '每位參加者都在櫃台領取名牌。'),
        one('The hotel offers free breakfast to ___ guests.', ['all', 'every', 'each', 'much'], 'guests 是複數，只能用 all；every、each 接單數，much 接不可數名詞。', '飯店提供所有房客免費早餐。'),
        one('I am writing ___ your order from last week.', ['regarding', 'regard', 'regarded', 'regards'], 'regarding 是介系詞，意思是「關於」。', '我寫信是關於您上週的訂單。'),
        one('The new model is much ___ than the old one.', ['lighter', 'light', 'lightest', 'more light'], 'than 前面用比較級；much 可以加強比較級。', '新型號比舊型號輕很多。'),
        one('Please make sure to ___ your reservation by phone.', ['confirm', 'confirmation', 'confirmed', 'confirming'], 'make sure to ＋ 原形動詞。', '請務必打電話確認您的預約。'),
        one('Our headquarters ___ in Taipei, but we have branches in Japan and Korea.', ['is located', 'locates', 'location', 'locating'], '公司「位於」某地用被動 be located in。', '我們的總部在台北，但在日本和韓國都有分公司。'),
      ],
    },
    {
      id: 'p6',
      title: 'Part 6 段落填空',
      intro: '閱讀一篇短文，選出最適合填入每個空格的答案。要看前後文才能判斷。',
      pick: 1,
      groups: [
        set(
          {
            passage:
              'To: All Staff\nFrom: Office Manager\nSubject: Printer maintenance\n\nThe printers on the third floor will be __(1)__ for maintenance this Friday from 1 p.m. to 3 p.m. If you need to print documents during this time, please use the printers on the second floor. __(2)__, the copy machine in the lobby will be available as usual. We __(3)__ for any inconvenience.',
            zh: '致全體員工：三樓的印表機本週五下午一點到三點進行維修，無法使用。這段時間如果需要列印，請使用二樓的印表機。此外，大廳的影印機照常可以使用。造成不便，敬請見諒。',
          },
          mq('空格 (1)', ['unavailable', 'available', 'availability', 'unavailably'], '維修期間「無法使用」；be 動詞後面接形容詞。'),
          mq('空格 (2)', ['In addition', 'Because', 'Although', 'Unless'], '空格後面是完整的句子並用逗號隔開，要用轉折副詞 In addition（此外）。Because、Although、Unless 是連接詞，不能這樣單獨開頭。'),
          mq('空格 (3)', ['apologize', 'apology', 'apologizing', 'apologetic'], '主詞 We 後面需要動詞：We apologize for any inconvenience 是道歉的固定說法。'),
        ),
        set(
          {
            passage:
              'Notice to Customers\n\nStarting next Monday, our store will open one hour __(1)__, at 9 a.m. instead of 10 a.m. We hope this change will make shopping more __(2)__ for customers who work during the day. Members can also __(3)__ a 10% discount on all items during the first week.',
            zh: '顧客公告：從下週一起，本店提早一小時營業，改為早上九點開門（原本十點）。希望讓白天上班的顧客購物更方便。第一週會員全品項還能享九折優惠。',
          },
          mq('空格 (1)', ['earlier', 'early', 'earliest', 'more early'], '九點比十點早，用比較級 earlier。'),
          mq('空格 (2)', ['convenient', 'convenience', 'conveniently', 'convene'], 'make ＋ 受詞 ＋ 形容詞：讓…變得方便。'),
          mq('空格 (3)', ['receive', 'received', 'receiving', 'receipt'], '助動詞 can 後面接原形動詞。'),
        ),
      ],
    },
    {
      id: 'p7',
      title: 'Part 7 閱讀理解',
      intro: '閱讀廣告、電子郵件、公告等短文，回答問題。先看題目再找答案會比較快。',
      pick: 2,
      groups: [
        set(
          {
            passage:
              'City Fitness Center — Summer Special\n\nJoin before July 31 and get your first month free! We are open from 6 a.m. to 11 p.m., seven days a week. Members can use the swimming pool, the gym, and all group classes at no extra cost. Personal training is available for an additional fee. Visit our front desk or call 555-0142 for details.',
            zh: '城市健身中心夏季優惠：七月三十一日前加入，第一個月免費！每天早上六點營業到晚上十一點，全年無休。會員可以免費使用游泳池、健身房與所有團體課程。個人教練課需另外付費。詳情請洽櫃台或撥打 555-0142。',
          },
          mq('What is being offered?', ['A free first month for new members', 'Free personal training', 'A discount on swimming lessons', 'A free gym bag'], 'Join before July 31 and get your first month free。'),
          mq('What costs extra?', ['Personal training', 'The swimming pool', 'Group classes', 'The gym'], 'Personal training is available for an additional fee（需額外付費）。'),
          mq('When is the center open?', ['Every day from 6 a.m. to 11 p.m.', 'Only on weekdays', 'From 6 p.m. to 11 p.m.', 'Only until July 31'], 'seven days a week＝每天。'),
        ),
        set(
          {
            passage:
              'Dear Mr. Wang,\n\nThank you for your order of 20 office chairs. Unfortunately, the black chairs you ordered are currently out of stock. We expect to receive more on May 15. If you prefer, we can send gray chairs of the same model today at no extra charge. Please let us know which option you would like by replying to this email.\n\nSincerely,\nAmy Lin, Customer Service',
            zh: '王先生您好：感謝您訂購 20 張辦公椅。很抱歉，您訂的黑色椅子目前缺貨，預計五月十五日到貨。如果您願意，我們今天就可以免費改寄同款的灰色椅子。請直接回覆這封信，告訴我們您想選哪一種。客服部 Amy Lin 敬上',
          },
          mq('Why did Ms. Lin write the email?', ['To report a problem with an order', 'To ask for a payment', 'To offer a job', 'To cancel a meeting'], '黑色椅子缺貨（out of stock），是訂單出了問題。'),
          mq('What does Ms. Lin offer to do?', ['Send chairs in a different color', 'Give a full refund', 'Deliver the chairs on May 1', 'Lower the price of the black chairs'], 'we can send gray chairs of the same model today。'),
          mq('What should Mr. Wang do next?', ['Reply to the email', 'Call the store', 'Visit the warehouse', 'Order 20 more chairs'], 'let us know … by replying to this email。'),
        ),
        set(
          {
            passage:
              'MEMO\nTo: Sales Team\n\nThe monthly sales meeting has been moved from Tuesday to Wednesday at 2 p.m. because the meeting room is being painted. We will meet in Conference Room B on the fifth floor. Please bring your sales report for May. Lunch will not be provided this time.',
            zh: '備忘錄（致業務團隊）：每月業務會議因為會議室在油漆，從星期二改到星期三下午兩點，地點在五樓的 B 會議室。請帶五月的業務報告。這次不提供午餐。',
          },
          mq('Why was the meeting moved?', ['The meeting room is being painted.', 'The manager is on a business trip.', 'The sales reports are not ready.', 'Tuesday is a holiday.'], 'because the meeting room is being painted。'),
          mq('What should team members bring?', ['Their May sales report', 'Their lunch', 'A laptop', 'Paint samples'], 'Please bring your sales report for May。午餐只說不提供，沒有要大家帶。'),
        ),
      ],
    },
  ],
});

export const EN_MOCKS: MockExam[] = [brown];
