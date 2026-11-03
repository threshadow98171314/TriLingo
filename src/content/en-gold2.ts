// 英文金色證書（860–990）的學習路線（二）：長篇閱讀速讀、推論題攻略、滿分衝刺。
// read／talk／cz 的第一個選項是正確答案。題目全部是原創。
import type { Unit } from '../core/types';
import { cz, grammarUnit, note, read, talk } from './dsl';

const speed = grammarUnit('en.gold.speed', '⏱️', '長篇閱讀速讀', 'Part 7：先看題目、掃描關鍵字、多篇對照', [
  {
    title: '單篇：郵件與公告',
    notes: [
      note(
        'Part 7 的時間分配',
        [
          'Part 7 有 54 題，閱讀測驗 75 分鐘裡，Part 5、6 最好在 20 分鐘內做完，留 55 分鐘給 Part 7：平均一題一分鐘。',
          '先看題目，圈出關鍵字（人名、日期、數字、地點），再回文章「掃描」那一段，不用每個字都讀。',
          '郵件看主旨、寄件人和最後一段（通常是請對方做什麼）；公告看日期、條件和例外（however、except、only）。',
        ],
      ),
    ],
    items: [
      read(
        [
          'To: All staff',
          'From: Facilities Department',
          'Subject: Elevator maintenance',
          'The east elevators will be out of service from Monday, May 12, to Wednesday, May 14, for scheduled maintenance. During this period, please use the west elevators or the stairs. Staff who need assistance moving heavy equipment between floors should contact Facilities at extension 4410 at least one day in advance.',
        ],
        'What should employees do if they need to move heavy equipment?',
        ['Contact the Facilities Department ahead of time', 'Wait until the maintenance is finished', 'Use the east elevators', 'Ask a coworker to help them carry it'],
        '致全體員工，寄件人：總務部，主旨：電梯維修。東側電梯將於 5 月 12 日（一）到 14 日（三）定期維修暫停使用，這段期間請搭乘西側電梯或走樓梯。需要協助在樓層之間搬運重型設備的員工，請至少提前一天撥分機 4410 聯絡總務部。',
        '題目的 move heavy equipment 對應最後一句；at least one day in advance → 選項換成 ahead of time。',
      ),
      read(
        [
          'Notice to Customers',
          'Beginning June 1, Harbor Grocery will extend its weekday hours to 10 P.M. Weekend hours will remain 8 A.M. to 8 P.M. In addition, our online ordering service, which was previously available only to members, will now be open to all customers. Members will continue to receive free delivery on orders over $50.',
        ],
        'What change is being announced?',
        ['Online ordering will be available to everyone.', 'Weekend hours will be extended.', 'Delivery will become free for all customers.', 'The store will close earlier on weekdays.'],
        '顧客須知：6 月 1 日起，Harbor 超市平日營業時間延長到晚上 10 點，週末營業時間維持早上 8 點到晚上 8 點。此外，原本只開放會員使用的線上訂購服務，將開放給所有顧客。會員訂單滿 50 美元繼續享有免運。',
        'which was previously available only to members, will now be open to all customers → 選項 1。免運只有會員，週末時間不變。',
      ),
      read(
        [
          'Dear Mr. Okafor,',
          'Thank you for your interest in the regional sales manager position. We were impressed by your application and would like to invite you to a second interview with our vice president, Ms. Lindqvist. She is available on Thursday or Friday afternoon next week. Please reply by Monday to let us know which day suits you, and bring a copy of your most recent sales report.',
          'Sincerely, Rita Gomez, Human Resources',
        ],
        'What is Mr. Okafor asked to do?',
        ['Choose a day for an interview', 'Send his application again', 'Meet Ms. Gomez on Monday', 'Prepare a presentation for the vice president'],
        'Okafor 先生您好：感謝您應徵區域業務經理一職。我們對您的申請印象深刻，想邀請您與副總裁 Lindqvist 女士進行第二次面試。她下週四或週五下午有空，請在週一前回覆哪一天方便，並帶一份您最近的業績報告。人資部 Rita Gomez 敬上',
        'Please reply by Monday to let us know which day suits you → Choose a day。週一是回覆期限，不是見面的日子。',
      ),
      read(
        [
          'Greenfield Library will host a free workshop on starting a small business on Saturday, March 8, from 10 A.M. to noon. The session will be led by local entrepreneur Dana Price, who opened three cafés in the area. Space is limited to 30 participants, so registration is required. Sign up at the front desk or on our Web site by March 5.',
        ],
        'What is indicated about the workshop?',
        ['Participants must register in advance.', 'It will last all day.', 'It is intended for café owners only.', 'It will be held on March 5.'],
        'Greenfield 圖書館將於 3 月 8 日（六）上午 10 點到中午舉辦免費的小型創業講座，由在當地開了三家咖啡廳的創業家 Dana Price 主講。名額限 30 人，必須報名。請在 3 月 5 日前到服務台或上網報名。',
        'registration is required → Participants must register in advance。3 月 5 日是報名截止日；講座只有兩小時。',
      ),
    ],
  },
  {
    title: '單篇：文章與報導',
    notes: [
      note(
        '報導型文章怎麼掃',
        [
          '第一段通常就是主旨（Who did what?），問 What is the article mainly about? 先看第一段。',
          '細節題用關鍵字定位：數字、年份、公司名，在文章裡通常只出現一次。',
          '引述句（"…," said Ms. Lee）常用來考意見或計畫。',
        ],
      ),
    ],
    items: [
      read(
        [
          'NORTHPORT — Brightline Bicycles announced on Tuesday that it will open a second factory in Northport next spring. The company, which currently employs 200 people at its Westfield plant, expects to hire about 120 workers for the new facility. "Demand for our electric bikes has doubled in two years," said CEO Martin Hale. "This expansion will help us shorten delivery times."',
        ],
        'Why is Brightline Bicycles opening a new factory?',
        ['To meet growing demand for its products', 'To replace its Westfield plant', 'To start making traditional bicycles', 'To reduce the number of employees'],
        'Northport 報導：Brightline 自行車公司週二宣布，明年春天將在 Northport 開設第二座工廠。該公司目前在 Westfield 工廠有 200 名員工，預計新廠將招募約 120 人。執行長 Martin Hale 表示：「我們電動自行車的需求兩年內成長了一倍，這次擴廠有助於縮短交貨時間。」',
        'Demand has doubled → growing demand。原本的工廠沒有要關閉（second factory）。',
      ),
      read(
        [
          'More companies are offering four-day workweeks on a trial basis, according to a survey by the Business Research Institute. Of the 500 firms surveyed, 18 percent reported testing a shorter week in the past year, up from 7 percent the year before. Most of these firms said productivity remained the same, while employee satisfaction rose. However, many service businesses said the schedule was difficult to apply to customer-facing roles.',
        ],
        'According to the article, what challenge did some businesses report?',
        ['Applying the schedule to jobs that involve serving customers', 'Keeping productivity at the same level', 'Finding enough firms to participate in the survey', 'Reducing employee satisfaction'],
        '根據企業研究所的調查，越來越多公司試行一週上班四天。受訪的 500 家公司中，有 18% 表示過去一年曾試行較短的工作週，前一年是 7%。大部分公司表示生產力維持不變，員工滿意度則上升。不過，許多服務業表示，這種排班很難套用在需要面對顧客的職位上。',
        'However 之後是困難：difficult to apply to customer-facing roles → jobs that involve serving customers。',
      ),
      read(
        [
          'The city council approved a plan on Monday to convert the old Fulton train station into a public market. Construction will begin in August and is expected to take eighteen months. The market will house up to 40 vendors selling local produce, baked goods, and crafts. Council member Ana Ruiz noted that the historic building’s original clock tower will be preserved.',
        ],
        'What is mentioned about the Fulton station building?',
        ['Part of its original structure will be kept.', 'It will be demolished in August.', 'It will reopen as a train station.', 'It currently houses 40 vendors.'],
        '市議會週一通過計畫，將舊的 Fulton 火車站改建成公共市場。工程 8 月開工，預計需要 18 個月。市場最多可容納 40 個攤商，販售當地農產品、烘焙食品和手工藝品。市議員 Ana Ruiz 指出，這座歷史建築原本的鐘樓將會保留。',
        'the original clock tower will be preserved → Part of its original structure will be kept。40 個攤商是完工後的規模。',
      ),
      read(
        [
          'Tech firm Corvana has delayed the release of its new tablet until October. The company originally planned to launch the device in July but said a shortage of display panels had slowed production. Pre-orders will still be accepted, and customers who have already placed orders will receive a discount coupon for accessories.',
        ],
        'What will customers who have already ordered the tablet receive?',
        ['A coupon for accessories', 'A full refund', 'An earlier delivery date', 'A free display panel'],
        '科技公司 Corvana 把新平板的上市延到 10 月。公司原本計畫 7 月推出，但表示螢幕面板短缺拖慢了生產。仍然接受預購，已經下訂的顧客會收到配件的折價券。',
        '最後一句：customers who have already placed orders will receive a discount coupon for accessories。',
      ),
    ],
  },
  {
    title: '雙篇閱讀：兩篇對照',
    notes: [
      note(
        '多篇閱讀的關鍵：跨篇比對',
        [
          '雙篇、三篇題組裡，一定有幾題要把兩篇的資訊合起來才答得出（例如一篇是價目表，另一篇是訂單）。',
          '先判斷每篇的類型和關係：廣告＋詢問信、公告＋回覆、表格＋電子郵件。',
          '看到題目提到某篇沒寫的數字或名字，就去另一篇找。',
        ],
      ),
    ],
    items: [
      read(
        [
          '[Advertisement] Lakeside Conference Center — Meeting rooms for rent. Small room (up to 20 people): $150 per day. Medium room (up to 50 people): $300 per day. Large hall (up to 150 people): $700 per day. Projectors are included in all rooms. Catering is available for an additional fee.',
          '[E-mail] Hello, I would like to reserve a room for our sales training on April 22. We expect 45 participants, and we will need a projector and lunch for everyone. Could you send me a quote? — Mei Tan',
        ],
        'Which room will Ms. Tan most likely reserve?',
        ['The medium room', 'The small room', 'The large hall', 'Two small rooms'],
        '【廣告】湖畔會議中心出租會議室：小間（最多 20 人）每天 150 美元；中間（最多 50 人）每天 300 美元；大廳（最多 150 人）每天 700 美元。所有會議室都附投影機，餐飲另外收費。【郵件】您好，我想預約 4 月 22 日的業務訓練用會議室。預計有 45 人參加，需要投影機和所有人的午餐。可以給我報價嗎？Mei Tan',
        '跨篇比對：第二篇說 45 人，第一篇中間會議室最多 50 人。',
      ),
      read(
        [
          '[Notice] Riverside Apartments: The parking garage will be repaved from July 7 to July 11. Residents must move their vehicles to the temporary lot on Pine Street during this time. Vehicles left in the garage will be towed at the owner’s expense.',
          '[E-mail] To the management office: I will be traveling for work from July 5 to July 15, and my car is parked in the garage. Is there someone who could move it for me if I leave the key at the front desk? — Ben Arnott, Unit 3B',
        ],
        'What problem does Mr. Arnott have?',
        ['He will be away when his car needs to be moved.', 'He cannot find the temporary parking lot.', 'His car was towed from the garage.', 'He lost the key to his car.'],
        '【公告】河濱公寓：停車場將於 7 月 7 日到 11 日重鋪路面，這段期間住戶必須把車移到 Pine 街的臨時停車場，留在停車場內的車輛將被拖吊，費用由車主負擔。【郵件】致管理處：我 7 月 5 日到 15 日要出差，車停在停車場裡。如果我把鑰匙留在櫃台，有人可以幫我移車嗎？3B 住戶 Ben Arnott',
        '跨篇比對：出差期間（7/5–7/15）涵蓋施工期間（7/7–7/11），所以他沒辦法自己移車。',
      ),
      read(
        [
          '[Product page] The Aurora X2 vacuum cleaner offers 60 minutes of battery life, weighs only 2.1 kilograms, and comes with a two-year warranty. Price: $249.',
          '[Customer review] I bought the Aurora X2 last month. It is light and easy to carry upstairs, which matters to me because I live in a three-story house. My only complaint is that the battery lasts closer to 45 minutes than the advertised hour. — Rating: 4 out of 5',
        ],
        'What does the reviewer suggest about the product?',
        ['The battery life is shorter than advertised.', 'It is too heavy to carry upstairs.', 'Its warranty period is too short.', 'It is more expensive than other vacuums.'],
        '【商品頁】Aurora X2 吸塵器電池續航 60 分鐘，只重 2.1 公斤，附兩年保固，售價 249 美元。【顧客評論】我上個月買了 Aurora X2。它很輕，搬上樓很容易，這對住三層樓房子的我很重要。唯一的抱怨是電池比較接近 45 分鐘，不是廣告寫的一小時。評分：5 分給 4 分',
        '跨篇比對：商品頁寫 60 minutes，評論說 closer to 45 minutes → 比廣告短。',
      ),
      read(
        [
          '[Schedule] Westbrook Film Festival — Friday: Opening ceremony, 7 P.M., Grand Theater. Saturday: Documentary screenings, 1 P.M.–6 P.M., Hall B. Sunday: Awards night, 8 P.M., Grand Theater.',
          '[Text message] Hi Lena, I can’t make it to the awards night because of a family dinner, but I’d love to see the documentaries with you. Let’s meet in front of Hall B ten minutes before the first screening. — Sam',
        ],
        'When will Sam and Lena most likely meet?',
        ['On Saturday at 12:50 P.M.', 'On Friday at 6:50 P.M.', 'On Sunday at 7:50 P.M.', 'On Saturday at 5:50 P.M.'],
        '【節目表】Westbrook 影展：週五晚上 7 點開幕典禮（大劇院）；週六下午 1 點到 6 點紀錄片放映（B 廳）；週日晚上 8 點頒獎典禮（大劇院）。【簡訊】嗨 Lena，因為家庭聚餐，我沒辦法去頒獎典禮，但很想和你一起看紀錄片。我們在第一場放映前十分鐘，到 B 廳前面見吧。Sam',
        '跨篇計算：紀錄片週六 1 P.M. 開始，前十分鐘 → 12:50 P.M.。',
      ),
    ],
  },
  {
    title: '三篇閱讀：資訊整合',
    notes: [
      note(
        '三篇題組的解法',
        [
          '三篇題組常是：公告／廣告＋電子郵件＋表格（訂單、時刻表、收據）。',
          '先讀題目，標出每題需要哪幾篇；要算錢、算日期的題目，答案通常要用到兩篇以上。',
          '時間不夠時，先做單篇就答得出來的細節題，最後再做跨篇推論題。',
        ],
      ),
    ],
    items: [
      read(
        [
          '[Memo] All department heads: Please submit your budget requests for next year by October 15. Requests over $10,000 must include a written justification.',
          '[E-mail] From: Jun Park (Marketing) — I’ve attached our request for $12,500 to cover two trade shows and a new Web site.',
          '[E-mail] From: Finance — Thank you, Jun. Before we can review your request, we need the written justification mentioned in the memo. Please send it by October 15.',
        ],
        'Why did the Finance Department contact Mr. Park?',
        ['His request was missing a required document.', 'His request was submitted after the deadline.', 'His budget was too small for two trade shows.', 'He sent the request to the wrong department.'],
        '【備忘錄】各部門主管：請在 10 月 15 日前提交明年的預算申請，超過 1 萬美元的申請必須附書面說明。【郵件】行銷部 Jun Park：附上我們 12,500 美元的申請，用於兩場商展和新網站。【郵件】財務部：謝謝 Jun。審核之前，我們需要備忘錄提到的書面說明，請在 10 月 15 日前寄來。',
        '三篇整合：12,500 美元超過 1 萬美元，依照備忘錄必須附書面說明，而他還沒附上。',
      ),
      read(
        [
          '[Price list] Coastal Print Shop — Business cards: $40 per 500. Flyers: $90 per 1,000. Posters: $15 each. Orders over $150 receive 10 percent off.',
          '[Order form] Customer: Hana Ito. Items: 500 business cards, 1,000 flyers, 2 posters.',
          '[E-mail] Hi Hana, your order is ready for pickup. Because your total exceeded $150, a discount has been applied. — Coastal Print Shop',
        ],
        'How much will Ms. Ito most likely pay?',
        ['$144', '$160', '$150', '$135'],
        '【價目表】Coastal 印刷店：名片 500 張 40 美元；傳單 1,000 張 90 美元；海報每張 15 美元。訂單超過 150 美元打九折。【訂單】顧客 Hana Ito：名片 500 張、傳單 1,000 張、海報 2 張。【郵件】Hana 您好，您的訂單可以取件了。因為總額超過 150 美元，已經套用折扣。',
        '跨篇計算：40 + 90 + 15×2 = 160，超過 150 打九折 → 160 × 0.9 = 144。',
      ),
      read(
        [
          '[Job posting] Bayview Hotel seeks a front desk supervisor. Requirements: at least three years of hotel experience and fluency in English and one other language. Weekend availability required.',
          '[Résumé summary] Applicant: Carlos Mendes. Experience: four years as a front desk clerk at Harbor Inn. Languages: Portuguese (native), English (fluent), Spanish (conversational).',
          '[E-mail] Dear Mr. Mendes, thank you for applying. Before scheduling an interview, could you confirm that you are able to work on Saturdays and Sundays? — Bayview Hotel HR',
        ],
        'Which requirement has the hotel NOT yet confirmed that Mr. Mendes meets?',
        ['Weekend availability', 'Hotel experience', 'Fluency in English', 'Knowledge of another language'],
        '【徵才】Bayview 飯店誠徵櫃台主管。條件：至少三年飯店經驗，英語流利並會另一種語言，週末須能上班。【履歷摘要】應徵者 Carlos Mendes：在 Harbor Inn 擔任櫃台人員四年；語言：葡萄牙語（母語）、英語（流利）、西班牙語（會話程度）。【郵件】Mendes 先生您好，感謝您應徵。安排面試前，可以確認您週六、週日都能上班嗎？Bayview 飯店人資部',
        '三篇整合：經驗（四年）和語言都已經從履歷看出符合，郵件才在確認週末能不能上班。',
      ),
      read(
        [
          '[Train schedule] Express 12 departs Hollis at 8:05 A.M. and arrives in Marlow at 9:40 A.M. Local 34 departs Hollis at 8:20 A.M. and arrives in Marlow at 10:30 A.M.',
          '[Meeting invitation] Client meeting with Verdant Foods at their Marlow office, 10:00 A.M.',
          '[Text message] Running late — I just missed the 8:05 train. — Priya',
        ],
        'What will most likely happen to Priya?',
        ['She will arrive at the client meeting late.', 'She will arrive in Marlow at 9:40 A.M.', 'She will miss the meeting entirely.', 'She will take an express train.'],
        '【時刻表】特快 12 號 8:05 從 Hollis 出發，9:40 抵達 Marlow；區間 34 號 8:20 從 Hollis 出發，10:30 抵達 Marlow。【會議邀請】上午 10 點在 Verdant Foods 的 Marlow 辦公室和客戶開會。【簡訊】我要遲到了，剛錯過 8:05 的車。Priya',
        '三篇整合：錯過 8:05 的特快，只能搭 8:20 的區間車，10:30 才到，會議 10 點開始 → 會遲到（但不是完全錯過）。',
      ),
    ],
  },
]);

const infer = grammarUnit('en.gold.infer', '🔍', '推論題攻略', 'most likely、imply、說話者的意圖', [
  {
    title: 'Part 3／4：說話者的意圖',
    notes: [
      note(
        '「What does the man mean when he says …?」',
        [
          '意圖題考的是「這句話在這個情境裡想表達什麼」，不是字面意思：I’ve been there before 可能是在說「我知道路」。',
          '聽題目引用的那句話「前後」：前一句是問題，後一句常是解釋。',
          '和那句話用字最像的選項，常常是陷阱。',
        ],
      ),
    ],
    items: [
      talk(
        ['M: The client wants the revised design by Thursday instead of Friday.', 'F: Thursday? We still haven’t received their feedback on the colors.', 'M: I know. I’ll call them this morning and ask for the comments today.'],
        'What does the woman imply when she says, "We still haven’t received their feedback on the colors"?',
        ['The new deadline may be difficult to meet.', 'She prefers a different color scheme.', 'The client has already approved the design.', 'She will contact the client herself.'],
        '男：客戶希望修改後的設計週四交，不是週五。女：週四？我們連他們對顏色的意見都還沒收到。男：我知道。我今天早上會打電話給他們，請他們今天給意見。',
        '女生的話是在說：連客戶的意見都還沒拿到，提早到週四很困難。男生的回應（去催意見）也證明了這點。',
      ),
      talk(
        ['F: Do you know how to get to the Hamilton Building? I have an interview there at two.', 'M: I used to work across the street from it.', 'F: Oh, great. Is it far from the subway?'],
        'Why does the man say, "I used to work across the street from it"?',
        ['To show that he can give directions', 'To explain why he changed jobs', 'To suggest that the woman apply for his old job', 'To complain about the location'],
        '女：你知道 Hamilton 大樓怎麼去嗎？我兩點在那裡有面試。男：我以前就在它對面上班。女：太好了。它離地鐵站遠嗎？',
        '男生不是在講自己的經歷，而是暗示「我熟那一帶，可以告訴你怎麼走」；女生接著問路，證明了這個意圖。',
      ),
      talk(
        ['M: Should we order more printer paper? We’re down to the last box.', 'F: The supply company is having a sale next week.', 'M: Then I’ll put in the order on Monday.'],
        'What does the woman mean when she says, "The supply company is having a sale next week"?',
        ['They should wait before placing an order.', 'They should change supply companies.', 'The paper is already on its way.', 'The supply company is closing soon.'],
        '男：我們要多訂一些印表機用紙嗎？只剩最後一箱了。女：文具公司下週有特價。男：那我週一再下訂。',
        '女生在暗示「等下週特價再訂」；男生回答週一再訂，正好呼應。',
      ),
      talk(
        ['F: I know many of you have asked about the new parking permits. They’re not ready yet. In the meantime, just leave your current permit on your dashboard, and security won’t give you a ticket. We’ll send an e-mail as soon as the new ones arrive.'],
        'What does the speaker imply when she says, "They’re not ready yet"?',
        ['Employees should keep using their current permits.', 'The parking lot is closed.', 'Employees must apply for permits again.', 'Security will start issuing tickets.'],
        '我知道很多人問過新停車證的事，還沒準備好。在這段期間，把現在的停車證放在儀表板上就好，警衛不會開罰單。新的一到我們會寄電子郵件通知。',
        '「還沒好」之後立刻說「先放舊的停車證」，意思是請大家繼續用現在的停車證。',
      ),
    ],
  },
  {
    title: 'Part 3／4：推測地點、身分、下一步',
    notes: [
      note(
        'most likely 題：用線索推',
        [
          'Where does the conversation most likely take place? → 找場所相關的字：boarding pass、gate（機場），prescription（藥局），check-in、room key（飯店）。',
          'Who most likely is the man? → 找職業線索：I’ll check your account（銀行）、Your table is ready（餐廳）。',
          'What will the woman most likely do next? → 答案幾乎都在最後一兩句：I’ll …／Let me …。',
        ],
      ),
    ],
    items: [
      talk(
        ['F: I’d like to pick up the prescription for Laura Chen.', 'M: Let me check… It’s ready. Have you taken this medication before?', 'F: No, this is the first time.', 'M: Then I’ll explain how often to take it.'],
        'Where does the conversation most likely take place?',
        ['At a pharmacy', 'At a bank', 'At a library', 'At a restaurant'],
        '女：我要領 Laura Chen 的處方藥。男：我查一下……好了。您以前吃過這個藥嗎？女：沒有，第一次。男：那我說明一下要多久吃一次。',
        'prescription（處方）、medication（藥）、how often to take it → 藥局。',
      ),
      talk(
        ['M: Welcome back, Ms. Diaz. Your usual table by the window is available.', 'F: Great. And could you tell the chef I can’t eat peanuts?', 'M: Of course. I’ll let the kitchen know right away.'],
        'Who most likely is the man?',
        ['A restaurant host', 'A hotel receptionist', 'A chef', 'A travel agent'],
        '男：歡迎回來，Diaz 小姐。您常坐的窗邊座位是空的。女：太好了。可以幫我轉告主廚我不能吃花生嗎？男：當然，我馬上告訴廚房。',
        'usual table、tell the chef、let the kitchen know → 帶位的服務人員。主廚是他要轉告的對象。',
      ),
      talk(
        ['F: The projector in Room 5 still isn’t working, and my presentation starts in twenty minutes.', 'M: Room 8 is free this morning, and its equipment was just checked.', 'F: Perfect. I’ll move my things there now.'],
        'What will the woman most likely do next?',
        ['Go to a different room', 'Repair the projector', 'Postpone her presentation', 'Call a technician'],
        '女：5 號會議室的投影機還是不能用，我的簡報二十分鐘後就開始了。男：8 號會議室今天早上沒人用，設備也剛檢查過。女：太好了，我現在就把東西搬過去。',
        '最後一句 I’ll move my things there now → 去另一間會議室。',
      ),
      talk(
        ['M: Thank you for calling Summit Airlines. Due to a storm in the Denver area, all afternoon flights to Denver have been canceled. Passengers can rebook online at no charge or speak with an agent by pressing two. To hear this message again, press nine.'],
        'What are listeners most likely going to do if they want to talk to a person?',
        ['Press two', 'Press nine', 'Rebook online', 'Go to the airport'],
        '感謝您致電 Summit 航空。由於丹佛地區有暴風雨，所有下午飛往丹佛的班機都已取消。旅客可以免費上網改訂，或按 2 與客服人員通話。重聽這段訊息請按 9。',
        'speak with an agent（和客服人員說話）by pressing two；talk to a person 是同義改寫。',
      ),
    ],
  },
  {
    title: 'Part 7：暗示與推論',
    notes: [
      note(
        'What is suggested／implied／most likely true?',
        [
          '推論題的答案文章裡沒有直接寫，但一定有根據：把兩三個線索合起來想。',
          '常見的根據：日期（剛開幕、即將退休）、比較（more than last year）、語氣（unfortunately、we are pleased）。',
          '選項說得太遠、太絕對（always、never、all）通常不對；正確答案往往是保守的推論。',
        ],
      ),
    ],
    items: [
      read(
        [
          'Dear valued customer, we are writing to let you know that the Elm Street branch will close on September 30. Your accounts will be transferred automatically to our Main Avenue branch, just two blocks away, and your account numbers will not change. Our Main Avenue branch has recently been renovated and now offers extended hours on Saturdays.',
        ],
        'What is suggested about the Main Avenue branch?',
        ['It is near the Elm Street branch.', 'It will also close soon.', 'It is not open on weekends.', 'It requires customers to open new accounts.'],
        '親愛的顧客：謹通知您，Elm 街分行將於 9 月 30 日關閉。您的帳戶會自動轉到只隔兩條街的 Main 大道分行，帳號不會改變。Main 大道分行最近剛整修好，現在週六也延長營業時間。',
        'just two blocks away → 離 Elm 街分行很近。帳號不變、週六有營業，所以其他選項都錯。',
      ),
      read(
        [
          'After fifteen years as head chef at Oliva, Marco Bellini will cook his final dinner service on December 20. Bellini, who trained the restaurant’s current sous-chef, Tessa Wong, said he plans to spend more time with his family and write a cookbook. Wong will take over the kitchen in January.',
        ],
        'What can be inferred about Ms. Wong?',
        ['She has worked with Mr. Bellini.', 'She is writing a cookbook.', 'She will open a new restaurant.', 'She started working at Oliva in January.'],
        '在 Oliva 擔任主廚十五年的 Marco Bellini，將在 12 月 20 日做最後一次晚餐服務。曾親自培養現任副主廚 Tessa Wong 的 Bellini 表示，他打算多陪家人並寫一本食譜。Wong 將在 1 月接管廚房。',
        'Bellini trained Ms. Wong → 她跟 Bellini 一起工作過。寫食譜的是 Bellini；1 月是她接手的時間，不是開始工作的時間。',
      ),
      read(
        [
          'Thank you for registering for the Data Analytics Summit. Your badge will be available at the registration desk on the first floor. Please note that the keynote speech by Dr. Amara Singh has been moved from the main hall to the east auditorium because of the larger-than-expected number of attendees.',
        ],
        'What is implied about the summit?',
        ['More people registered than the organizers expected.', 'Dr. Singh canceled her speech.', 'Badges will be mailed to attendees.', 'The main hall is under renovation.'],
        '感謝您報名數據分析高峰會。您的名牌可以到一樓報到處領取。請注意，因為出席人數比預期多，Amara Singh 博士的主題演講從主廳改到東側演講廳。',
        'because of the larger-than-expected number of attendees → 報名的人比主辦單位預期的多。',
      ),
      read(
        [
          'Mia, the shipment of winter coats arrived this morning, but about half of the boxes were labeled for our Lakewood store. I’ve set them aside in the back room. Could you call the Lakewood manager before noon so they can send a driver today? Our own coats will be on the shelves by this afternoon. — Owen',
        ],
        'What is most likely true about the shipment?',
        ['Part of it was delivered to the wrong store.', 'It arrived later than scheduled.', 'All of the coats were damaged.', 'It must be returned to the supplier.'],
        'Mia，冬季外套的貨今天早上到了，但大約一半的箱子標示是給 Lakewood 店的。我已經把它們放在後面的倉庫。可以請你中午前打電話給 Lakewood 的店長，讓他們今天派司機來載嗎？我們自己的外套今天下午就會上架。Owen',
        'half of the boxes were labeled for our Lakewood store → 有一部分送錯店了。',
      ),
    ],
  },
  {
    title: 'Part 7：NOT 題與句子插入',
    notes: [
      note(
        '兩種最花時間的題型',
        [
          'NOT 題（What is NOT mentioned?）：把四個選項一個一個回文章找，找到的就刪掉，剩下的就是答案。',
          '句子插入（In which position does the sentence best belong?）：看要插入的句子裡的指示詞和連接詞（this、these、however、also），找出它要接的前一句。',
          '兩種題型都很花時間，時間不夠時可以先跳過，最後再回來做。',
        ],
      ),
    ],
    items: [
      read(
        [
          'The Pinecrest Community Center offers a range of programs for residents. Morning yoga classes are held daily at 7 A.M. The center also runs a weekly book club and free computer lessons for seniors on Wednesdays. Children can join our summer art camp, which runs from July to August.',
        ],
        'What is NOT mentioned as a program offered by the center?',
        ['Swimming lessons', 'Yoga classes', 'A book club', 'Computer lessons'],
        'Pinecrest 社區中心為居民提供各種課程：每天早上 7 點有晨間瑜伽，每週有讀書會，週三有給長者的免費電腦課，孩子可以參加 7 月到 8 月的暑期美術營。',
        'NOT 題：瑜伽、讀書會、電腦課都有寫，只有游泳課沒有出現。',
      ),
      read(
        [
          'Our new mobile app makes it easier than ever to manage your account. [1] You can check your balance, pay bills, and transfer money in just a few taps. [2] In addition, you can now deposit checks by simply taking a photo of them. [3] Download the app today from your phone’s app store. [4]',
          'Sentence to insert: "This feature alone will save you a trip to the bank."',
        ],
        'In which of the positions marked [1], [2], [3], and [4] does the sentence best belong?',
        ['[3]', '[1]', '[2]', '[4]'],
        '我們新的手機 App 讓管理帳戶比以往更容易。[1] 只要點幾下，就能查餘額、繳帳單、轉帳。[2] 此外，現在只要拍一張支票的照片就能存支票。[3] 今天就到手機的應用程式商店下載吧。[4] 要插入的句子：「光是這個功能，就能省下您跑一趟銀行。」',
        'This feature 指前一句的「拍照存支票」，省去去銀行存支票的麻煩，所以放在 [3]。',
      ),
      read(
        [
          'Halvorsen Furniture is pleased to announce the opening of its new showroom in downtown Fairview on May 3. The showroom features more than 200 pieces of furniture, a design consultation area, and a children’s play corner. Customers who visit during the opening week will receive a 15 percent discount on all purchases.',
        ],
        'What is NOT stated about the new showroom?',
        ['It offers free delivery.', 'It has a design consultation area.', 'It displays more than 200 pieces of furniture.', 'It offers a discount during the opening week.'],
        'Halvorsen 家具很高興宣布，新的展示中心將於 5 月 3 日在 Fairview 市中心開幕。展示中心有超過 200 件家具、設計諮詢區和兒童遊戲區。開幕週來店的顧客，所有商品享 85 折。',
        '設計諮詢區、超過 200 件、開幕週折扣都有寫；免運費沒有提到。',
      ),
      read(
        [
          'Thank you for choosing Coastline Rentals. [1] Your car will be ready for pickup at 9 A.M. on Friday. [2] Please bring a valid driver’s license and the credit card used for the reservation. [3] Without them, we will not be able to release the vehicle. [4]',
          'Sentence to insert: "If you need to change your pickup time, please call us at least 24 hours in advance."',
        ],
        'In which of the positions marked [1], [2], [3], and [4] does the sentence best belong?',
        ['[2]', '[1]', '[3]', '[4]'],
        '感謝您選擇 Coastline 租車。[1] 您的車週五上午 9 點可以取車。[2] 請攜帶有效的駕照和預約時使用的信用卡。[3] 沒有的話我們無法交車。[4] 要插入的句子：「如果需要更改取車時間，請至少提前 24 小時來電。」',
        '插入句講「更改取車時間」，要接在提到取車時間（9 A.M. on Friday）的句子後面，所以是 [2]。放在 [3]、[4] 會打斷「證件」那兩句的連貫。',
      ),
    ],
  },
]);

const final = grammarUnit('en.gold.final', '🏆', '滿分衝刺', '990 分等級的 Part 5：假設、倒裝、商務慣用語', [
  {
    title: '假設語氣與倒裝',
    notes: [
      note(
        '高分題最常考的句型',
        [
          '要求、建議類的 that 子句用原形動詞：It is essential that he be…、The manager recommended that she submit…。',
          '省略 if 的倒裝：Should you have any questions…（= If you should have）、Had we known…（= If we had known）。',
          'Only after／Not only 放句首也要倒裝。',
        ],
        ['It is essential that every employee attend the training.|每位員工都必須參加訓練。', 'Should you have any questions, please contact us.|如果有任何問題，請與我們聯絡。'],
      ),
    ],
    items: [
      cz('It is essential that every participant ___ the safety guidelines before entering the lab.', ['read', 'reads', 'will read', 'has read'], '每位參加者進入實驗室前都必須閱讀安全守則。', 'It is essential that 後面用原形動詞（假設語氣），所以是 read，不是 reads。'),
      cz('___ you require further assistance, please do not hesitate to contact our support team.', ['Should', 'Would', 'Unless', 'Whether'], '如果您需要進一步的協助，請隨時聯絡我們的客服團隊。', 'Should you require… = If you should require…，省略 if 的倒裝。'),
      cz('___ we known about the road closure, we would have taken a different route.', ['Had', 'If', 'Have', 'Were'], '如果我們早知道道路封閉，就會走別的路了。', 'Had we known = If we had known（與過去事實相反），省略 if 要倒裝。'),
      cz('The board recommended that the merger ___ until the market stabilizes.', ['be postponed', 'is postponed', 'was postponed', 'will be postponed'], '董事會建議合併案延到市場穩定之後。', 'recommend that 後面用原形動詞，被動就是 be postponed。'),
      cz('Not only ___ the project on time, but it also came in under budget.', ['was the team able to complete', 'the team was able to complete', 'the team completed', 'completing the team'], '團隊不但準時完成專案，而且還低於預算。', 'Not only 放句首要倒裝：Not only was the team able to…。'),
      cz('Only after the contract was signed ___ the details to the press.', ['did the company release', 'the company released', 'the company did release', 'released the company'], '直到合約簽訂之後，公司才向媒體公布細節。', 'Only after … 放句首，主要子句倒裝：did + 主詞 + 原形動詞。'),
    ],
  },
  {
    title: '商務慣用語與介系詞',
    notes: [
      note(
        '一看就要知道的搭配',
        [
          'on behalf of（代表）、in lieu of（代替）、in compliance with（遵守）、in accordance with（依照）、notwithstanding（儘管）。',
          'adhere to、comply with、be entitled to、be eligible for、be subject to：介系詞是固定的。',
          'a number of + 複數動詞（很多）；the number of + 單數動詞（～的數量）。',
        ],
      ),
    ],
    items: [
      cz('I am writing ___ the entire sales team to thank you for your support this year.', ['on behalf of', 'in spite of', 'in case of', 'instead of'], '我代表整個業務團隊寫信感謝您今年的支持。', 'on behalf of ＝代表某人、以某人的名義。'),
      cz('All visitors must ___ the security procedures while on the premises.', ['comply with', 'comply', 'complying', 'compliance with'], '所有訪客在場內期間都必須遵守安全程序。', 'comply with ＝遵守，介系詞固定是 with；must 後面要原形動詞。'),
      cz('Full-time employees are ___ to twenty days of paid leave per year.', ['entitled', 'eligible', 'qualified', 'allowed'], '全職員工每年享有二十天的帶薪休假。', 'be entitled to + 名詞 ＝有權享有；eligible 要接 for，allowed／qualified to 後面接動詞。'),
      cz('The number of applicants for the internship ___ increased sharply this year.', ['has', 'have', 'are', 'were'], '今年實習職缺的應徵人數大幅增加。', 'The number of ＋複數名詞，主詞是 number（單數），所以用 has。'),
      cz('A number of customers ___ complained about the new checkout system.', ['have', 'has', 'is', 'was'], '有不少顧客抱怨新的結帳系統。', 'A number of ＝很多，後面的複數名詞才是主詞，用 have。'),
      cz('All prices are ___ to change without prior notice.', ['subject', 'liable', 'likely', 'responsible'], '所有價格可能隨時變更，恕不另行通知。', 'be subject to change ＝可能變更，是公告、合約的固定說法。'),
    ],
  },
  {
    title: '連接詞與高階字彙',
    notes: [
      note(
        '容易選錯的連接詞與單字',
        [
          'provided that／as long as（只要）、in the event that（萬一）、whereas（然而，用於對比）、albeit（雖然，後面常接形容詞或片語）。',
          '高階字彙看搭配：comprehensive review、provisional agreement、at the discretion of、imperative that。',
        ],
      ),
    ],
    items: [
      cz('Employees may work from home on Fridays, ___ their projects are on schedule.', ['provided that', 'in case', 'unless', 'even if'], '只要專案進度正常，員工星期五可以在家工作。', 'provided that ＝只要（條件）；unless 意思相反，in case 是「以防」。'),
      cz('___ the event is canceled due to weather, all ticket holders will receive a full refund.', ['In the event that', 'So that', 'Even though', 'As soon as'], '萬一活動因天候取消，所有持票人都會獲得全額退款。', 'In the event that ＝萬一、如果發生。'),
      cz('The first model is lightweight and affordable, ___ the second offers more advanced features.', ['whereas', 'because', 'therefore', 'so that'], '第一款又輕又便宜，然而第二款提供更進階的功能。', 'whereas 用來對比兩件事；therefore 是副詞，不能直接連接兩個子句。'),
      cz('The renovation was completed on time, ___ slightly over budget.', ['albeit', 'despite', 'although of', 'however'], '整修準時完成，只是稍微超出預算。', 'albeit ＝雖然、儘管（後面接形容詞或片語，比 although 正式）。'),
      cz('The committee will conduct a ___ review of all safety procedures.', ['comprehensive', 'comprehensible', 'comprehending', 'comprehension'], '委員會將全面檢討所有安全程序。', 'comprehensive ＝全面的；comprehensible 是「可理解的」。'),
      cz('Refunds for opened items are issued at the ___ of the store manager.', ['discretion', 'discrete', 'discreet', 'discretely'], '已拆封商品是否退款，由店長斟酌決定。', 'at the discretion of ＝由～斟酌決定；discreet 是「謹慎的」，discrete 是「分開的」。'),
    ],
  },
]);

export const GOLD_UNITS_2: Unit[] = [speed, infer, final];
