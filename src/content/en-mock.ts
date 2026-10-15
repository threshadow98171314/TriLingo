// 英文實戰模擬考：仿多益（TOEIC Listening & Reading）的題型，題目全部是原創。
// 第一份對應橘色、棕色證書，第二份對應綠色、藍色證書。每次從題庫隨機抽題，所以每次考的都不太一樣。
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

const blue = mockExam({
  id: 'en.mock.blue',
  title: '多益模擬考：綠色・藍色',
  subtitle: '聽力 Part 1–4＋閱讀 Part 5–7（含多篇閱讀）',
  about:
    '正式的多益是聽力 100 題（45 分鐘）＋閱讀 100 題（75 分鐘），滿分 990 分。這份模擬考涵蓋全部七個大題，約 37 題、30 分鐘，難度對應綠色到藍色證書（約 470–855 分）。Part 1 沒辦法放照片，改成看文字描述選句子。',
  after: 'en.green',
  minutes: 30,
  pass: 0.6,
  levels: [
    { min: 0.85, label: '藍色證書程度', desc: '這個程度的題目幾乎難不倒你，可以往金色證書（860 分以上）衝刺了。' },
    { min: 0.6, label: '綠色證書程度', desc: '大約落在綠色證書（470–725 分）的範圍。把答錯的題型整理起來，特別是 Part 3、4 的長聽力。' },
    { min: 0.4, label: '棕色證書程度', desc: '基礎已經穩了。建議把綠色證書的單元上完，多練被動語態、關係子句和商務單字。' },
    { min: 0, label: '先打穩基礎', desc: '建議先完成棕色證書的單元，再回來挑戰。' },
  ],
  sections: [
    {
      id: 'p1',
      title: 'Part 1 照片描述（文字版）',
      intro: '正式考試會看一張照片、聽四個句子。這裡把照片寫成文字，選出最符合的描述。注意動作和狀態的差別。',
      pick: 3,
      groups: [
        one('（照片：一名女子站在影印機前影印文件）', ['A woman is making copies.', 'A woman is repairing a machine.', 'A woman is carrying some boxes.', 'A woman is writing on a whiteboard.'], 'making copies＝影印。照片裡有影印機，但她不是在修理。', '一名女子正在影印。'),
        one('（照片：餐廳裡的桌子都已經擺好餐具，沒有客人）', ['The tables have been set.', 'The tables are being cleaned.', 'Some customers are eating.', 'A waiter is pouring water.'], '沒有人在場，用完成被動 have been set（已經擺好）。', '桌子都已經擺好餐具了。'),
        one('（照片：幾艘船停靠在碼頭邊）', ['Some boats are docked at a pier.', 'Some boats are sailing in the ocean.', 'People are swimming near the boats.', 'A boat is being painted.'], 'docked at a pier＝停靠在碼頭。照片裡的船沒有在航行。', '幾艘船停靠在碼頭邊。'),
        one('（照片：一名男子蹲著綁鞋帶）', ['A man is tying his shoes.', 'A man is putting on a jacket.', 'A man is buying some shoes.', 'A man is running on a track.'], 'tie one’s shoes＝綁鞋帶。', '一名男子正在綁鞋帶。'),
        one('（照片：一名工人站在梯子上換燈泡）', ['A worker is standing on a ladder.', 'A worker is carrying a ladder.', 'A ladder is lying on the floor.', 'A worker is painting the ceiling.'], '他「站在」梯子上；梯子沒有被搬，也沒有倒在地上。', '一名工人站在梯子上。'),
      ],
    },
    {
      id: 'p2',
      title: 'Part 2 應答問題',
      intro: '聽一個問題或一句話，選出最適當的回應。這一級常出「間接回答」，不一定會直接說 Yes 或 No。',
      listening: true,
      pick: 5,
      groups: [
        set({ script: ['M: Who is going to lead the training session next week?'], zh: '下週的培訓課程由誰帶？' }, mq(undefined, ["I think it's someone from headquarters.", 'In the training room.', 'Yes, it was very useful.'], 'Who 問人；「我想是總部的人」是間接但合理的回答。')),
        set({ script: ["F: Why don't we order lunch from the new sandwich shop?"], zh: '我們何不從那家新的三明治店訂午餐？' }, mq(undefined, ["Sure, I've heard it's good.", 'Because I was hungry.', 'At twelve thirty.'], "Why don't we…? 是提議，不是問原因；Because 開頭的選項是陷阱。")),
        set({ script: ['M: Has the budget for next year been approved?'], zh: '明年的預算核准了嗎？' }, mq(undefined, ['The board will decide on Friday.', 'About two million dollars.', 'I approve of your plan.'], '間接回答：還沒，要等董事會星期五決定。重複 approve 的選項是陷阱。')),
        set({ script: ['F: Where can I find the latest sales figures?'], zh: '最新的銷售數字在哪裡可以找到？' }, mq(undefined, ["They're on the shared drive.", 'Sales went up last month.', 'I found it yesterday.'], 'Where 問地點；shared drive＝共用雲端硬碟。')),
        set({ script: ["M: You went to the trade show in Berlin, didn't you?"], zh: '你去了柏林的商展，對吧？' }, mq(undefined, ['Yes, and I met several new clients.', 'The show starts at nine.', 'No, I prefer trains.'], '附加問句：照事實回答，再補充資訊。')),
        set({ script: ["F: I'm afraid the shipment won't arrive until Thursday."], zh: '恐怕貨要到星期四才會到。' }, mq(undefined, ["Then we'll have to tell the customer.", "I'm not afraid of it.", 'It arrived on Monday.'], '直述句：回應接下來怎麼處理；重複 afraid 的選項是陷阱。')),
        set({ script: ['M: Would you rather meet in person or talk over the phone?'], zh: '你比較想當面談還是講電話？' }, mq(undefined, ['A video call would be easiest for me.', 'Yes, I would.', 'The phone is on the desk.'], '選擇問句也可以提出第三個方案（視訊），一樣是自然的回答。')),
        set({ script: ['F: How did the client like our proposal?'], zh: '客戶覺得我們的提案怎麼樣？' }, mq(undefined, ['She asked for a few changes.', 'By express mail.', 'I like it too.'], 'How did … like…? 問感想；「她要求修改幾個地方」是合理的回答。')),
      ],
    },
    {
      id: 'p3',
      title: 'Part 3 簡短對話',
      intro: '聽一段兩人的對話，回答三個問題。先看題目再按播放，邊聽邊找答案。',
      listening: true,
      pick: 2,
      groups: [
        set(
          {
            script: [
              'F: Hi, Mark. Do you have a minute? I wanted to talk about the new product launch.',
              'M: Sure. Is there a problem?',
              "F: The factory just told me the packaging won't be ready until the end of the month. That's two weeks later than planned.",
              "M: Then we should move the launch event to the first week of next month. I'll call the hotel to change our reservation.",
            ],
            zh: '女：嗨，Mark，有空嗎？我想談新產品上市的事。／男：好，有什麼問題嗎？／女：工廠剛通知我，包裝要到月底才會好，比計畫晚了兩週。／男：那我們應該把上市活動延到下個月第一週。我來打給飯店改預約。',
          },
          mq('What are the speakers mainly discussing?', ['A product launch', 'A hiring plan', 'A factory tour', 'A hotel renovation'], '開頭就說 talk about the new product launch。'),
          mq('What problem does the woman mention?', ['Some packaging will be late.', 'A factory has closed.', 'A hotel is fully booked.', 'A product is too expensive.'], "the packaging won't be ready until the end of the month＝包裝會延遲。"),
          mq('What will the man most likely do next?', ['Contact a hotel', 'Visit the factory', 'Design new packaging', 'Cancel the product'], "I'll call the hotel to change our reservation。"),
        ),
        set(
          {
            script: [
              "M: Good morning. I'd like to open a business account for my company.",
              'F: Certainly. Do you have your business registration certificate with you?',
              'M: I have a copy, but not the original.',
              "F: I'm sorry, but we need the original. You can bring it in any time this week, and the process only takes about thirty minutes.",
            ],
            zh: '男：早安，我想幫公司開一個企業帳戶。／女：好的，您有帶公司登記證明嗎？／男：我有影本，但沒有正本。／女：抱歉，我們需要正本。這週任何時候帶來都可以，手續大約只要三十分鐘。',
          },
          mq('Where does the conversation most likely take place?', ['At a bank', 'At a post office', 'At a law firm', 'At a printing shop'], 'open a business account＝在銀行開戶。'),
          mq('What does the woman need from the man?', ['An original document', 'A copy of his passport', 'A payment', 'His business card'], 'we need the original＝需要正本文件。'),
          mq('How long will the process take?', ['About thirty minutes', 'About one week', 'About three days', 'About an hour'], 'the process only takes about thirty minutes。this week 是指這週什麼時候來都可以。'),
        ),
        set(
          {
            script: [
              "F: Mr. Ito, thanks for coming in. We're interested in your company's delivery service.",
              'M: Thank you. We deliver to over two hundred cities in Asia, usually within forty-eight hours.',
              "F: That's impressive. We ship about five hundred packages a month. Could you send us a price list?",
              'M: Of course. And since you ship so many packages, I can offer you a ten percent discount.',
            ],
            zh: '女：伊藤先生，謝謝您過來。我們對貴公司的配送服務有興趣。／男：謝謝。我們配送到亞洲兩百多個城市，通常四十八小時內送達。／女：真厲害。我們每個月寄大約五百件包裹，可以給我們一份價目表嗎？／男：當然。而且因為您寄的量很大，我可以提供九折優惠。',
          },
          mq("What does the man's company provide?", ['Delivery services', 'Office supplies', 'Travel tours', 'Packaging design'], 'delivery service＝配送服務。'),
          mq('What does the woman ask for?', ['A price list', 'A free sample', 'A contract', 'Faster delivery'], 'Could you send us a price list?'),
          mq('Why does the man offer a discount?', ["The woman's company ships a large volume.", 'It is a holiday sale.', 'A delivery was late.', 'The woman is a new customer.'], 'since you ship so many packages＝因為量大。'),
        ),
      ],
    },
    {
      id: 'p4',
      title: 'Part 4 簡短獨白',
      intro: '聽一個人說的公告、留言或廣告，回答三個問題。開頭通常會說出場合，結尾常是請聽眾做的事。',
      listening: true,
      pick: 2,
      groups: [
        set(
          {
            script: [
              'M: Good morning, and welcome to the third annual Green Energy Conference. Before we begin, a few announcements.',
              "M: Lunch will be served in the main hall at noon. This afternoon's workshop on solar power has been moved from Room 201 to Room 305.",
              'M: Finally, please complete the online survey at the end of the day. Everyone who completes it will receive a free conference T-shirt.',
            ],
            zh: '早安，歡迎來到第三屆綠色能源研討會。開始之前有幾項公告：午餐中午在主廳供應。今天下午的太陽能工作坊從 201 室改到 305 室。最後，請在今天結束時填寫線上問卷，填完的人都會拿到一件研討會 T 恤。',
          },
          mq('Where is the talk most likely taking place?', ['At a conference', 'At a restaurant', 'At a factory', 'At a clothing store'], 'welcome to the … Conference。'),
          mq('What has changed?', ['The location of a workshop', 'The time of lunch', 'The date of the conference', 'The price of a T-shirt'], 'workshop … has been moved from Room 201 to Room 305＝工作坊換地點。'),
          mq('How can listeners get a free T-shirt?', ['By completing a survey', 'By attending a workshop', 'By eating lunch in the main hall', 'By registering early'], 'Everyone who completes it (the survey) will receive a free T-shirt。'),
        ),
        set(
          {
            script: [
              "F: Hello, Mr. Brown. This is Linda from Sunrise Dental Clinic. I'm calling to remind you about your appointment tomorrow at 10 a.m.",
              "F: Unfortunately, Dr. Kim is sick and won't be in tomorrow. Dr. Lopez can see you at the same time, or you can reschedule with Dr. Kim for next week.",
              'F: Please call us back at 555-0167 to let us know which you prefer.',
            ],
            zh: '布朗先生您好，我是日出牙醫診所的 Linda，打電話提醒您明天早上十點的預約。很遺憾，金醫師生病了，明天不會來。羅培茲醫師可以在同一時間幫您看診，或者您也可以改約下週給金醫師看。請回電 555-0167 告訴我們您想選哪一個。',
          },
          mq('Why is the speaker calling?', ['To discuss an appointment', 'To ask for a payment', 'To offer a job', 'To advertise a new clinic'], "I'm calling to remind you about your appointment。"),
          mq('What problem does the speaker mention?', ['A doctor is not available.', 'The clinic is closing.', 'A bill was not paid.', 'The appointment time was wrong.'], "Dr. Kim is sick and won't be in＝醫師不在。"),
          mq('What is Mr. Brown asked to do?', ['Return a call', 'Arrive early', 'Visit another clinic', 'Fill out a form'], 'Please call us back＝回電。'),
        ),
        set(
          {
            script: [
              'M: Looking for a relaxing weekend? Come to Lakeview Resort, just one hour from the city.',
              'M: Enjoy our hot springs, fresh local food, and beautiful mountain views.',
              'M: This month only, guests who stay two nights will get a free dinner for two. Book now on our website.',
            ],
            zh: '想度過輕鬆的週末嗎？歡迎來到湖景度假村，離市區只要一小時。享受溫泉、新鮮在地美食和美麗的山景。只限本月，住兩晚的房客可以獲得雙人免費晚餐。現在就上官網預訂。',
          },
          mq('What is being advertised?', ['A resort', 'A restaurant', 'A tour company', 'A real estate agency'], 'Come to Lakeview Resort。'),
          mq('What can guests enjoy at the resort?', ['Hot springs', 'A golf course', 'A shopping mall', 'A water park'], 'Enjoy our hot springs…。'),
          mq('How can guests get a free dinner?', ['By staying two nights', 'By booking by phone', 'By visiting on a weekday', 'By bringing a friend'], 'guests who stay two nights will get a free dinner for two。'),
        ),
      ],
    },
    {
      id: 'p5',
      title: 'Part 5 句子填空',
      intro: '選出最適合填入空格的答案。這一級除了詞性，還常考被動語態、關係詞、假設語氣與分詞。',
      pick: 8,
      groups: [
        one('The annual report ___ to all shareholders next week.', ['will be sent', 'sent', 'will send', 'sending'], '報告是被寄送的，next week 用未來被動。', '年度報告將在下週寄給所有股東。'),
        one('Applicants ___ have at least three years of experience will be considered.', ['who', 'which', 'whose', 'what'], '先行詞是人（applicants），當主詞用 who。', '至少有三年經驗的應徵者才會被考慮。'),
        one('___ the heavy rain, the outdoor concert was held as planned.', ['Despite', 'Although', 'Because', 'Unless'], 'Despite ＋ 名詞＝儘管；Although 後面要接子句。', '儘管下大雨，戶外音樂會仍照計畫舉行。'),
        one('The new software allows employees to work more ___.', ['efficiently', 'efficient', 'efficiency', 'efficiencies'], '修飾動詞 work 用副詞。', '新軟體讓員工能更有效率地工作。'),
        one('If the order had been placed earlier, it ___ on time.', ['would have arrived', 'will arrive', 'arrived', 'had arrived'], '與過去事實相反的假設：would have ＋ 過去分詞。', '如果早點下訂單，貨就會準時到了。'),
        one('Please ___ the attached form and return it by Friday.', ['complete', 'completion', 'completely', 'completing'], 'Please 後面接原形動詞。', '請填寫附件的表格，並在星期五前寄回。'),
        one('Ms. Lopez has been ___ to regional sales manager.', ['promoted', 'promoting', 'promotion', 'promote'], '被升職：has been ＋ 過去分詞。', '羅培茲小姐已經升為區域業務經理。'),
        one('All visitors must ___ at the front desk.', ['register', 'registration', 'registered', 'registering'], 'must 後面接原形動詞。', '所有訪客都必須在櫃台登記。'),
        one('The board of directors will meet ___ the proposal next Monday.', ['to discuss', 'discussing', 'discussed', 'discuss'], 'to V 表示目的：為了討論。', '董事會將在下週一開會討論這項提案。'),
        one('___ you need further information, please do not hesitate to call us.', ['Should', 'Would', 'Had', 'Were'], '省略 if 的倒裝：Should you need…', '如果您需要更多資訊，請隨時來電。'),
        one("The company's profits increased ___ this year.", ['considerably', 'considerable', 'consider', 'consideration'], '修飾動詞 increased 用副詞。', '公司今年的利潤大幅增加。'),
        one('Neither the manager ___ his assistant was at the meeting.', ['nor', 'or', 'and', 'but'], 'neither A nor B＝A 和 B 都不。', '經理和他的助理都沒有出席會議。'),
        one('This contract is valid ___ December 31.', ['until', 'by', 'since', 'during'], 'until＝一直持續到某個時間點；by 是「最晚在…之前」完成。', '這份合約的有效期到 12 月 31 日。'),
        one('___ in 1985, Brown & Co. is one of the oldest law firms in the city.', ['Founded', 'Founding', 'Found', 'To found'], '公司是「被創立」的，分詞構句用過去分詞。', '創立於 1985 年的 Brown & Co. 是市內最老的律師事務所之一。'),
      ],
    },
    {
      id: 'p6',
      title: 'Part 6 段落填空',
      intro: '閱讀一篇短文，選出最適合填入每個空格的答案；其中一題要選出最適合放進空格的「句子」。',
      pick: 1,
      groups: [
        set(
          {
            passage:
              'To: All Employees\nFrom: Human Resources\nSubject: Health Check\n\nOur annual health check will take place on March 15 and 16 in the main conference room. All employees are __(1)__ to attend on one of these days. __(2)__ Please sign up for a time slot on the HR website by March 10. Those who cannot attend __(3)__ either day should contact HR directly. We hope everyone takes this __(4)__ to check on their health.',
            zh: '致全體員工（人資部）：年度健康檢查將在 3 月 15、16 日於大會議室舉行，所有員工都必須在其中一天參加。檢查大約需要三十分鐘。請在 3 月 10 日前到人資網站登記時段。這兩天都無法參加的人請直接聯絡人資部。希望大家把握這個機會關心自己的健康。',
          },
          mq('空格 (1)', ['required', 'requiring', 'requirement', 'require'], 'be required to V＝必須（被要求）做…。'),
          mq('空格 (2)：選出最適合放進這個位置的句子', ['The check takes about thirty minutes.', 'The conference room was painted last year.', 'Thank you for your recent order.', 'Our new office opened in March.'], '前一句說要在這兩天之一參加，接著補充「檢查大約三十分鐘」最自然；其他句子和健康檢查無關。'),
          mq('空格 (3)', ['on', 'in', 'at', 'for'], '某一天前面用 on：on either day。'),
          mq('空格 (4)', ['opportunity', 'opportune', 'opportunities', 'opportunely'], 'this 後面接單數名詞：this opportunity（這個機會）。'),
        ),
        set(
          {
            passage:
              'Dear Valued Customer,\n\nThank you for shopping at Home Plus. Our store on Park Road will be closed for renovation from April 1 to April 20. __(1)__, our online store will remain open as usual. When the store __(2)__ on April 21, it will feature a larger kitchen section and a new café. __(3)__ We look forward to __(4)__ you soon.\n\nSincerely,\nHome Plus Customer Service',
            zh: '親愛的顧客：感謝您在 Home Plus 購物。我們在公園路的門市將於 4 月 1 日到 20 日整修暫停營業。不過，網路商店照常營業。門市 4 月 21 日重新開幕後，將有更大的廚房用品區和新的咖啡廳。開幕第一週所有商品享 85 折。期待很快再見到您。Home Plus 客服部 敬上',
          },
          mq('空格 (1)', ['However', 'Therefore', 'For example', 'Otherwise'], '前面說門市關閉，後面說網路商店照常營業，意思轉折用 However。'),
          mq('空格 (2)', ['reopens', 'reopened', 'will have reopened', 'reopening'], '時間副詞子句（When…）用現在式表示未來。'),
          mq('空格 (3)：選出最適合放進這個位置的句子', ['All items will be 15% off during the first week.', 'Our café closed last year.', 'Please return the item within 30 days.', 'The kitchen is on the second floor of your home.'], '前面介紹重新開幕後的新設施，接著說開幕週的優惠最自然。'),
          mq('空格 (4)', ['seeing', 'see', 'seen', 'to see'], 'look forward to 的 to 是介系詞，後面接 V-ing。'),
        ),
      ],
    },
    {
      id: 'p7',
      title: 'Part 7 閱讀理解（含多篇）',
      intro: '閱讀電子郵件、廣告、訊息等，回答問題。雙篇閱讀的答案常常要把兩篇的資訊合起來看。',
      pick: 2,
      groups: [
        set(
          {
            passage:
              'From: Rachel Green, Office Manager\nTo: All Staff\nSubject: New Recycling Program\n\nStarting September 15, our office will begin a new recycling program. Blue bins for paper will be placed next to every printer, and green bins for plastic bottles will be placed in the kitchen. Please do not put food waste in either bin. A short training session will be held on September 10 at 3 p.m. in Room 402. Attendance is optional, but we encourage everyone to join. If you have questions, please contact me at extension 215.',
            zh: '寄件人：辦公室經理 Rachel Green；收件人：全體員工；主旨：新的資源回收計畫。9 月 15 日起辦公室開始新的回收計畫：每台印表機旁會放藍色的紙類回收桶，廚房會放綠色的寶特瓶回收桶。兩種桶子都請不要丟廚餘。9 月 10 日下午三點在 402 室有簡短的說明會，自由參加，但鼓勵大家都來。有問題請打分機 215 找我。',
          },
          mq('What is the purpose of the e-mail?', ['To announce a new program', 'To introduce a new manager', 'To request new printers', 'To change office hours'], 'our office will begin a new recycling program。'),
          mq('Where will the green bins be placed?', ['In the kitchen', 'Next to every printer', 'In Room 402', 'At the front desk'], 'green bins for plastic bottles will be placed in the kitchen。'),
          mq('What is indicated about the training session?', ['Employees are not required to attend it.', 'It will last all afternoon.', 'It will be held on September 15.', 'It is only for managers.'], 'Attendance is optional＝不強制參加（換句話說）。'),
        ),
        set(
          {
            passage:
              'ADVERTISEMENT\nCityLink Coworking Space\nFlexible desks: $15 per day or $250 per month\nPrivate offices: $900 per month\nAll members enjoy free coffee, high-speed Internet, and access to meeting rooms. Members who sign up for six months or longer get one month free.\n\nE-MAIL\nTo: CityLink Coworking Space\nFrom: Daniel Ho\nI am a freelance designer and would like to rent a flexible desk starting next Monday. I plan to stay for at least six months. Do you have a quiet area away from the meeting rooms? I often talk to clients on the phone.',
            zh: '（廣告）CityLink 共享辦公室：彈性座位每天 15 美元或每月 250 美元；獨立辦公室每月 900 美元。所有會員都可享免費咖啡、高速網路並使用會議室。簽約六個月以上送一個月。（電子郵件）寄件人 Daniel Ho：我是自由接案的設計師，想從下週一開始租彈性座位，至少會待六個月。你們有遠離會議室的安靜區域嗎？我常常要和客戶講電話。',
          },
          mq('How much will Mr. Ho most likely pay per month?', ['$250', '$15', '$900', '$450'], '他要租彈性座位（flexible desk），月租 250 美元。'),
          mq('What will Mr. Ho probably receive?', ['One free month', 'A private office', 'A free phone', 'A discount on coffee'], '要合起來看：廣告說簽六個月以上送一個月，他打算至少待六個月。'),
          mq('What does Mr. Ho ask about?', ['A quiet place to work', 'The price of meeting rooms', 'Parking for visitors', 'The Internet speed'], 'Do you have a quiet area away from the meeting rooms?'),
        ),
        set(
          {
            passage:
              "Jason Lee (2:10 P.M.): Hi Amy, the client from Seoul just called. Her flight was delayed, so she won't arrive until 6.\nAmy Park (2:12 P.M.): Then we can't have the meeting at 4. Should we move it to tomorrow morning?\nJason Lee (2:13 P.M.): Good idea. I'll book the conference room for 9 a.m.\nAmy Park (2:14 P.M.): Thanks. I'll let the restaurant know we won't need the dinner reservation tonight.",
            zh: 'Jason（2:10）：嗨 Amy，首爾的客戶剛打來，她的班機延誤，要六點才會到。／Amy（2:12）：那四點的會議開不成了，要改到明天早上嗎？／Jason（2:13）：好主意，我來訂明天早上九點的會議室。／Amy（2:14）：謝謝，我會通知餐廳今晚的晚餐預約不需要了。',
          },
          mq('Why will the meeting be rescheduled?', ["A client's flight was delayed.", 'The conference room is not available.', 'Mr. Lee is sick.', 'The restaurant is closed.'], 'Her flight was delayed＝客戶的班機延誤。'),
          mq('What will Ms. Park most likely do next?', ['Contact a restaurant', 'Book a conference room', 'Call the client', 'Go to the airport'], "I'll let the restaurant know…＝聯絡餐廳。訂會議室的是 Jason。"),
        ),
      ],
    },
  ],
});

export const EN_MOCKS: MockExam[] = [brown, blue];
