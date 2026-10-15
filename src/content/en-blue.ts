// 英文藍色證書（730–855 分）：合約談判、製造物流、出差與會展，
// 加上假設語氣、分詞構句、易混淆字，以及 Part 4 簡短獨白與 Part 7（含多篇）閱讀。
import type { Unit } from '../core/types';
import { cz, en, grammarUnit, note, read, talk, vocabUnit } from './dsl';

const contract = vocabUnit('en.blue.contract', '🤝', '合約與談判', 'Contracts & Negotiation', [
  en('negotiate', 'v.', '談判；協商', 'We negotiated a lower price with the supplier.|我們和供應商談到了更低的價格。'),
  en('terms', 'n.', '條款；條件', 'Please read the terms and conditions carefully.|請仔細閱讀條款與細則。'),
  en('agreement', 'n.', '協議', 'Both companies signed the agreement yesterday.|兩家公司昨天簽了協議。'),
  en('clause', 'n.', '（合約的）條文', 'This clause explains the payment schedule.|這條條文說明付款時程。'),
  en('renew', 'v.', '續約；更新', 'We decided to renew the contract for two more years.|我們決定續約兩年。'),
  en('expire', 'v.', '到期', 'The contract expires at the end of June.|合約在六月底到期。'),
  en('obligation', 'n.', '義務', 'The supplier has an obligation to deliver on time.|供應商有準時交貨的義務。'),
  en('proposal', 'n.', '提案', 'The board accepted our proposal.|董事會接受了我們的提案。'),
  en('compromise', 'n./v.', '妥協；折衷', 'Both sides finally reached a compromise.|雙方終於達成妥協。'),
  en('binding', 'adj.', '有約束力的', 'This agreement is legally binding.|這份協議具有法律約束力。'),
  en('party', 'n.', '（合約的）一方', 'Both parties must sign the contract.|雙方都必須在合約上簽名。', { note: '在合約裡 party 不是派對，而是「當事人、一方」。' }),
  en('signature', 'n.', '簽名', 'We need your signature on the last page.|最後一頁需要您簽名。'),
]);

const g1 = grammarUnit('en.blue.g1', '🔮', '文法①：假設語氣', 'Conditionals & Subjunctive', [
  {
    title: '與現在、過去事實相反',
    notes: [
      note(
        '假設語氣的時態',
        [
          '與現在事實相反：If ＋ 過去式, would ＋ 原形（be 動詞一律用 were）。',
          '與過去事實相反：If ＋ had ＋ 過去分詞, would have ＋ 過去分詞。',
          '真的可能發生的條件：If ＋ 現在式, will ＋ 原形。',
          '多益常考：看主要子句的動詞形式，反推 if 子句的時態。',
        ],
        ['If I had more time, I would join the club.|如果我有更多時間，就會加入社團。', 'If we had left earlier, we would have caught the train.|如果我們早點出發，就趕上火車了。'],
      ),
    ],
    items: [
      cz('If I ___ you, I would accept the job offer.', ['were', 'am', 'will be', 'had been'], '如果我是你，我會接受這份工作。', '與現在事實相反，be 動詞一律用 were。'),
      cz('If we had more staff, we ___ finish the project sooner.', ['could', 'can', 'will', 'have'], '如果我們有更多人手，就能更早完成專案。', 'if 子句用過去式 had，主要子句用 could / would ＋ 原形。'),
      cz('If the shipment ___ earlier, we would have met the deadline.', ['had arrived', 'arrived', 'arrives', 'has arrived'], '如果貨早點到，我們就能趕上截止日了。', '主要子句是 would have met（與過去事實相反），if 子句用 had ＋ 過去分詞。'),
      cz('If it rains tomorrow, the outdoor event ___ moved inside.', ['will be', 'would be', 'was', 'had been'], '如果明天下雨，戶外活動會移到室內。', '真的可能發生的條件：If ＋ 現在式, will ＋ 原形。'),
      cz('We ___ the contract if the price had been lower.', ['would have signed', 'will sign', 'signed', 'had signed'], '如果價格再低一點，我們就會簽約了。', 'if 子句是 had been（過去），主要子句用 would have ＋ 過去分詞。'),
    ],
  },
  {
    title: '倒裝與其他假設句型',
    notes: [
      note(
        '商務英文常見的假設句型',
        [
          '省略 if 的倒裝：Should you have any questions…＝If you should have any questions…（商業書信常用）。',
          'Had I known…＝If I had known…。',
          'I wish ＋ 過去式：希望現在…（但其實不是）。',
          'It is important / essential that ＋ 主詞 ＋ 原形動詞；request / suggest that ＋ 主詞 ＋ 原形動詞。',
        ],
        ['Should you have any questions, please contact us.|如有任何問題，請與我們聯絡。', 'Had I known about the meeting, I would have attended.|要是我知道有這個會議，我就會參加了。'],
      ),
    ],
    items: [
      cz('___ you have any questions, please feel free to contact us.', ['Should', 'Would', 'Could', 'Unless'], '如果您有任何問題，歡迎隨時與我們聯絡。', '省略 if 的倒裝：Should you have…＝If you should have…。'),
      cz('___ I known about the traffic, I would have left earlier.', ['Had', 'If', 'Have', 'Did'], '要是我知道會塞車，就會早點出發。', 'Had I known＝If I had known（倒裝）。'),
      cz('It is essential that every employee ___ the safety rules.', ['follow', 'follows', 'followed', 'following'], '每位員工都必須遵守安全規定。', 'It is essential that ＋ 主詞 ＋ 原形動詞（不加 s）。'),
      cz('I wish I ___ more time to travel this year.', ['had', 'have', 'will have', 'having'], '真希望我今年有更多時間旅行。', 'I wish ＋ 過去式：和現在事實相反的願望。'),
      cz('The manager requested that the report ___ by noon.', ['be submitted', 'is submitted', 'was submitted', 'submits'], '經理要求報告在中午前提交。', 'request that ＋ 主詞 ＋ 原形動詞；報告是被提交的，用 be submitted。'),
    ],
  },
]);

const logistics = vocabUnit('en.blue.logistics', '🏭', '製造與物流', 'Manufacturing & Logistics', [
  en('manufacture', 'v.', '製造', 'The factory manufactures car parts.|這間工廠製造汽車零件。'),
  en('assemble', 'v.', '組裝', 'Workers assemble the machines by hand.|工人們用手工組裝機器。'),
  en('facility', 'n.', '設施；廠房', 'Our new facility is in Taichung.|我們的新廠房在台中。'),
  en('warehouse', 'n.', '倉庫', 'The goods are stored in a warehouse near the port.|貨物存放在港口附近的倉庫。'),
  en('inventory', 'n.', '庫存', 'We check the inventory every Friday.|我們每週五盤點庫存。'),
  en('shipment', 'n.', '貨物；出貨', 'The shipment was delayed by bad weather.|這批貨因為天候不佳而延誤。'),
  en('supplier', 'n.', '供應商', 'We are looking for a new supplier.|我們在找新的供應商。'),
  en('distribute', 'v.', '經銷；分發', 'The company distributes its products across Asia.|公司在亞洲各地經銷產品。'),
  en('capacity', 'n.', '產能；容量', 'The factory is running at full capacity.|工廠正在全產能運轉。'),
  en('defect', 'n.', '瑕疵', 'Every product is checked for defects.|每件產品都會檢查有沒有瑕疵。'),
  en('inspect', 'v.', '檢查', 'Inspectors inspect the machines every month.|檢查員每個月檢查機器。'),
  en('output', 'n.', '產量', "The factory's output increased by twenty percent.|工廠的產量增加了百分之二十。"),
]);

const part4 = grammarUnit(
  'en.blue.part4',
  '📢',
  '聽力：Part 4 簡短獨白',
  '公告、語音留言、廣告與廣播',
  [
    {
      title: '公告與語音留言',
      notes: [
        note(
          'Part 4 簡短獨白',
          [
            'Part 4 是一個人說話：公告、廣播、語音留言、導覽、廣告、會議開場等，每段回答三個問題；這裡每段先練一題。',
            '先看問題、抓關鍵字（Who／Where／Why／What … next）再聽。',
            '開頭一兩句通常會說出「誰在對誰說、在什麼場合」；最後一兩句常常是請聽眾做的事。',
            '語音留言要注意打電話的目的（I am calling to…）和請對方做什麼（Please call me back…）。',
          ],
          ['Attention, passengers. The train to Kaohsiung will depart from platform three.|各位旅客請注意，開往高雄的列車將從三號月台出發。'],
        ),
      ],
      items: [
        talk(
          ['F: Attention, shoppers. The store will close in fifteen minutes. Please bring your items to the registers at the front of the store. Thank you for shopping with us.'],
          'What are the listeners asked to do?',
          ['Go to the registers', 'Leave the store immediately', 'Visit the front desk', 'Come back tomorrow'],
          '各位顧客請注意，本店將在十五分鐘後打烊。請把商品帶到前面的收銀台，感謝您的光臨。',
          'Please bring your items to the registers＝到收銀台結帳。',
        ),
        talk(
          ["M: Hello, this is David Chen from Blue Sky Travel. I'm calling about your trip to Tokyo next week. Your flight time has changed to 9 a.m. Please call me back at 555-0198 to confirm."],
          'Why is the speaker calling?',
          ['To report a schedule change', 'To sell a new tour', 'To cancel a hotel booking', 'To ask for a payment'],
          '你好，我是藍天旅行社的 David Chen，打電話是關於您下週的東京行程。您的班機時間改成早上九點，請回電 555-0198 確認。',
          '班機時間改了＝schedule change。',
        ),
        talk(
          ['F: Good morning, everyone, and welcome to the Green Hill Museum. Our tour will last about one hour. Please do not take photos inside the main gallery. The gift shop is next to the exit.'],
          'Who most likely is the speaker?',
          ['A tour guide', 'A shop owner', 'A photographer', 'A pilot'],
          '大家早安，歡迎來到綠丘博物館。導覽大約一個小時，主展廳內請勿拍照。紀念品店在出口旁邊。',
          '歡迎來到博物館、介紹導覽時間＝導覽員。',
        ),
        talk(
          ['M: Attention, passengers on Flight 307 to Singapore. Because of bad weather, departure has been delayed by one hour. The new boarding time is 4:30. We apologize for the inconvenience.'],
          'What is the new boarding time?',
          ['4:30', '3:30', '3:07', '5:30'],
          '飛往新加坡的 307 班機旅客請注意。因為天候不佳，起飛延後一小時，新的登機時間是四點半。造成不便，敬請見諒。',
          'The new boarding time is 4:30。307 是班機號碼，是陷阱。',
        ),
        talk(
          ["F: Hi Tom, it's Sarah. I'm stuck in traffic and will be about twenty minutes late for our meeting. Could you start without me? I'll join as soon as I arrive."],
          'What does the speaker ask Tom to do?',
          ['Start the meeting without her', 'Pick her up', 'Cancel the meeting', 'Call her back'],
          '嗨 Tom，我是 Sarah。我塞在車陣中，開會大概會遲到二十分鐘。你們可以先開始嗎？我一到就加入。',
          'Could you start without me?＝請他先開始。',
        ),
      ],
    },
    {
      title: '廣告、廣播與會議',
      items: [
        talk(
          ['M: Are you looking for a new phone? This weekend only, Max Electronics is offering twenty percent off all smartphones. Visit any of our stores or shop online.'],
          'What is being advertised?',
          ['A sale on smartphones', 'A new store opening', 'A job opening', 'A free repair service'],
          '想換新手機嗎？只限這個週末，Max 電子全館智慧型手機打八折。歡迎到任何一家門市或上網選購。',
          'twenty percent off all smartphones＝手機特價。',
        ),
        talk(
          ['F: And now for the traffic report. Highway 1 is closed near the airport because of an accident. Drivers should use Route 5 instead. Traffic downtown is moving smoothly.'],
          'What are drivers advised to do?',
          ['Take a different road', 'Drive to the airport', 'Stay downtown', 'Take the train'],
          '接下來是路況報導。一號公路在機場附近因為車禍封閉，駕駛人請改走五號公路。市區車流順暢。',
          'Drivers should use Route 5 instead＝改走別條路。',
        ),
        talk(
          ["M: Thanks for coming, everyone. Before we start, I'd like to welcome our new team member, Emily Park. Emily joins us from the London office and will lead our online marketing projects."],
          'What is the purpose of the talk?',
          ['To introduce a new employee', 'To announce a holiday', 'To explain a new product', 'To say goodbye to a coworker'],
          '謝謝大家來開會。開始之前，我想歡迎新成員 Emily Park。Emily 從倫敦辦公室調來，將負責我們的網路行銷專案。',
          'welcome our new team member＝介紹新同事。',
        ),
        talk(
          ['F: Thank you for calling City Bank. Our offices are now closed. Our business hours are 9 a.m. to 5 p.m., Monday through Friday. If you have lost your card, please press one.'],
          'Why should a caller press one?',
          ['To report a lost card', 'To open an account', 'To hear the business hours', 'To speak to a manager'],
          '感謝您致電城市銀行。目前已經下班，營業時間是週一到週五早上九點到下午五點。如果您遺失了卡片，請按一。',
          'If you have lost your card, please press one。',
        ),
        talk(
          ['M: Good afternoon. Because of renovation work, the company cafeteria will be closed from Monday to Wednesday next week. During this time, free sandwiches will be provided in the lobby at noon.'],
          'What will be provided next week?',
          ['Free sandwiches', 'Discount coupons', 'A shuttle bus', 'New uniforms'],
          '午安。因為整修，員工餐廳下週一到週三暫停營業，這段期間中午會在大廳提供免費三明治。',
          'free sandwiches will be provided in the lobby。',
        ),
      ],
    },
  ],
  'listening',
);

const trip = vocabUnit('en.blue.trip', '🧳', '出差與會展', 'Business Travel & Events', [
  en('itinerary', 'n.', '行程表', 'Please check the itinerary for your trip.|請確認你的出差行程表。'),
  en('accommodation', 'n.', '住宿', 'The company will arrange your accommodation.|公司會幫你安排住宿。'),
  en('venue', 'n.', '（活動的）場地', 'The venue for the conference has changed.|研討會的場地改了。'),
  en('exhibition', 'n.', '展覽', 'The trade exhibition opens on Monday.|貿易展星期一開幕。'),
  en('booth', 'n.', '攤位', 'Please visit our booth at the trade show.|歡迎到商展參觀我們的攤位。'),
  en('registration', 'n.', '報名；登記', 'Online registration closes on Friday.|線上報名星期五截止。'),
  en('keynote', 'n.', '主題（演講）', 'The CEO will give the keynote speech.|執行長將發表主題演講。'),
  en('attendee', 'n.', '與會者', 'All attendees will receive a free bag.|所有與會者都會拿到一個免費的袋子。'),
  en('boarding pass', 'n.', '登機證', 'Please show your boarding pass at the gate.|請在登機門出示登機證。'),
  en('delegate', 'n.', '代表', 'Delegates from ten countries attended the meeting.|來自十個國家的代表出席了會議。'),
  en('convention', 'n.', '大會；會議', 'The convention center is next to the station.|會議中心就在車站旁邊。'),
  en('jet lag', 'n.', '時差（造成的疲勞）', 'I still have jet lag after my long flight.|長途飛行之後我還在調時差。'),
]);

const g2 = grammarUnit('en.blue.g2', '✂️', '文法②：分詞構句與分詞形容詞', 'Participles', [
  {
    title: '分詞構句',
    notes: [
      note(
        '分詞構句：把子句變短',
        [
          '主詞相同時，可以去掉連接詞和主詞，把動詞改成分詞。',
          '主動用 V-ing：Walking to the station, I met an old friend.',
          '被動用過去分詞：Built in 1920, the hotel is the oldest in the city.',
          '完成用 Having ＋ 過去分詞：Having finished the report, she went home.（先完成，再做下一件事）',
        ],
        ['Located near the station, the hotel is popular with business travelers.|這家飯店位在車站附近，很受商務旅客歡迎。', 'Having read the contract, he signed it.|他看完合約後就簽了名。'],
      ),
    ],
    items: [
      cz('___ near the airport, the hotel is convenient for business travelers.', ['Located', 'Locating', 'Locate', 'To locate'], '這家飯店位在機場附近，對商務旅客很方便。', '飯店是「被設置在」機場附近，用過去分詞 Located。'),
      cz('___ the report, she sent it to her manager.', ['Having finished', 'Finished', 'Having been finished', 'To have finished'], '她寫完報告後寄給了經理。', '先完成報告再寄出，主動的完成式分詞 Having finished。'),
      cz('___ in 1920, the building is the oldest in the city.', ['Built', 'Building', 'Having built', 'To build'], '這棟建於 1920 年的建築是市內最古老的。', '建築是「被建造」的，用過去分詞 Built。'),
      cz('___ the instructions carefully, you can assemble the desk in ten minutes.', ['Following', 'Followed', 'Follow', 'To be followed'], '仔細照著說明，十分鐘就能組好書桌。', '主詞 you 主動照著做，用 V-ing。'),
      cz('When ___ the new software, please read the user guide first.', ['installing', 'installed', 'install', 'to install'], '安裝新軟體時，請先閱讀使用手冊。', 'When ＋ V-ing：「在做…的時候」，主詞（you）是主動安裝的人。'),
    ],
  },
  {
    title: '分詞形容詞',
    notes: [
      note(
        '-ing 還是 -ed？',
        [
          '-ing 形容詞：「令人…的」，修飾帶來感受的事物：an exciting game、a confusing message。',
          '-ed 形容詞：「感到…的」，修飾有感受的人：excited fans、confused customers。',
          '名詞前的分詞：主動用 V-ing（rising costs），被動用過去分詞（attached file、experienced staff）。',
        ],
        ['The results were surprising.|結果令人驚訝。', 'Please see the attached file.|請參閱附件。'],
      ),
    ],
    items: [
      cz('The customers were ___ by the sudden price change.', ['confused', 'confusing', 'confuse', 'confusion'], '顧客們被突然的價格變動搞糊塗了。', '人「感到」困惑用 -ed：confused。'),
      cz('The results of the survey were very ___.', ['surprising', 'surprised', 'surprise', 'surprisingly'], '調查結果非常令人驚訝。', '結果「令人」驚訝，用 -ing。'),
      cz('Please review the ___ document before the meeting.', ['attached', 'attaching', 'attach', 'attachment'], '開會前請看一下附加的文件。', '文件是「被附加」的，用過去分詞 attached。'),
      cz('We are looking for ___ staff with at least five years of experience.', ['experienced', 'experiencing', 'experience', 'experiences'], '我們在找至少有五年經驗、資歷豐富的員工。', 'experienced＝有經驗的。'),
      cz('___ costs have forced many companies to raise their prices.', ['Rising', 'Risen', 'Raised', 'Raising'], '上漲的成本迫使許多公司調漲價格。', '成本自己「上漲」，用 rise 的 V-ing：Rising。raise 是「提高某物」。'),
    ],
  },
]);

const confusing = grammarUnit('en.blue.confusing', '🌀', '易混淆字', '拼法或意思相近的字', [
  {
    title: '動詞',
    notes: [
      note(
        '容易搞混的動詞',
        [
          'affect（動詞：影響）／effect（名詞：效果）。',
          'rise（不及物：上升）／raise（及物：提高、舉起某物）。',
          'lend（借出）／borrow（借入）。',
          'adopt（採用、收養）／adapt（適應、改編）。',
          'ensure（確保）／insure（投保）。',
        ],
        ['The bad weather affected sales.|惡劣的天氣影響了銷售。', 'The company raised its prices.|公司調漲了價格。'],
      ),
    ],
    items: [
      cz('The new law will ___ small businesses.', ['affect', 'effect', 'effective', 'affection'], '新法律會影響小型企業。', 'will 後面要動詞：affect（影響）；effect 通常當名詞。'),
      cz('Prices ___ by five percent last month.', ['rose', 'raised', 'risen', 'raising'], '上個月價格上漲了百分之五。', '後面沒有受詞（價格自己上升），用不及物的 rise，過去式 rose。'),
      cz('Could you ___ me your pen for a minute?', ['lend', 'borrow', 'rent', 'owe'], '可以借我你的筆一下嗎？', '把東西借給別人用 lend；borrow 是向別人借。'),
      cz('The company decided to ___ a new policy on remote work.', ['adopt', 'adapt', 'adept', 'adore'], '公司決定採用新的遠距工作政策。', 'adopt a policy＝採用政策；adapt 是適應。'),
      cz('Please ___ that all doors are locked before you leave.', ['ensure', 'insure', 'assure', 'sure'], '離開前請確認所有門都已上鎖。', 'ensure that＝確保；insure 是投保，assure 後面通常接人。'),
    ],
  },
  {
    title: '名詞與形容詞',
    notes: [
      note(
        '容易搞混的名詞與形容詞',
        [
          'economic（經濟的）／economical（節省的、划算的）。',
          'considerable（相當多的）／considerate（體貼的）。',
          'personal（個人的）／personnel（人事；全體人員）。',
          'complement（補足、相配）／compliment（稱讚）。',
          'respectively（分別地）／respectfully（恭敬地）。',
        ],
        ['This car is very economical.|這台車很省油。', 'Please send the form to the personnel department.|請把表格送到人事部。'],
      ),
    ],
    items: [
      cz('A smaller car is more ___ for city driving.', ['economical', 'economic', 'economy', 'economics'], '在城市裡開車，小一點的車比較省。', 'economical＝節省的、划算的；economic 是「經濟上的」。'),
      cz('The project required a ___ amount of time.', ['considerable', 'considerate', 'consideration', 'considering'], '這個專案花了相當多的時間。', 'considerable＝相當大的、相當多的；considerate 是體貼的。'),
      cz('Please contact the ___ department about your vacation days.', ['personnel', 'personal', 'person', 'personally'], '關於休假天數，請聯絡人事部。', 'personnel department＝人事部；personal 是「個人的」。'),
      cz('The manager gave her a ___ on her excellent presentation.', ['compliment', 'complement', 'complaint', 'compliance'], '經理稱讚她的簡報做得很好。', 'compliment＝稱讚；complement 是「補足、相配」。'),
      cz('The first and second prizes went to Ms. Lin and Mr. Ito, ___.', ['respectively', 'respectfully', 'respective', 'respectable'], '一等獎和二等獎分別由林小姐和伊藤先生獲得。', 'respectively＝分別地（照前面的順序對應）。'),
    ],
  },
]);

const part7 = grammarUnit('en.blue.part7', '📰', '閱讀：Part 7 單篇與多篇', '公告、廣告、郵件、訊息', [
  {
    title: '單篇閱讀',
    notes: [
      note(
        'Part 7 閱讀理解',
        [
          'Part 7 有單篇、雙篇、三篇文章，題數佔閱讀測驗一半以上，時間最容易不夠。',
          '先看問題、再回文章找答案；常見題型：目的（purpose）、細節、推論（most likely）、同義字。',
          '答案常常是換句話說：文章寫 given out，選項寫 distributed。',
          '多篇閱讀：答案常常要把兩篇的資訊合起來才找得到。',
        ],
        ['What is the purpose of the e-mail?|這封電子郵件的目的是什麼？'],
      ),
    ],
    items: [
      read(
        ['Notice to All Tenants', 'The water will be turned off on Thursday, May 8, from 10 a.m. to 2 p.m. for pipe repairs. Please store enough water in advance. We apologize for any inconvenience.', 'Building Management'],
        'Why will the water be turned off?',
        ['For repairs', 'For cleaning', 'Because of a storm', 'Because of unpaid bills'],
        '致全體住戶：5 月 8 日（四）上午十點到下午兩點因修理水管停水，請事先儲水。造成不便敬請見諒。大樓管理處',
        'for pipe repairs＝為了修理（水管）。',
      ),
      read(
        ['Help Wanted: Part-Time Cashier', 'Sunny Bakery is looking for a friendly cashier to work weekends. No experience is necessary, but applicants must be available from 7 a.m. to 1 p.m. on Saturdays and Sundays. Apply in person at our Main Street store.'],
        'What is a requirement for the job?',
        ['Being available on weekend mornings', 'Having experience as a cashier', 'Living on Main Street', 'Working full-time'],
        '徵人：兼職收銀員。陽光烘焙坊徵求週末上班、親切的收銀員。不需經驗，但週六、週日早上七點到下午一點必須能上班。請親自到大街門市應徵。',
        'must be available … on Saturdays and Sundays。No experience is necessary，所以經驗不是條件。',
      ),
      read(
        ['From: Karen Liu', 'To: All Staff', 'Subject: Parking', 'Starting next month, the parking lot behind our building will be used only by visitors. Employees should park in the new garage on Pine Street. Parking passes will be given out at the front desk this Friday.'],
        'What will happen this Friday?',
        ['Parking passes will be distributed.', 'The parking lot will close.', 'A new garage will be built.', 'Visitors will receive a discount.'],
        '寄件人 Karen Liu，收件人全體員工，主旨：停車。下個月起，大樓後方的停車場只給訪客使用，員工請停到松街的新停車場。停車證本週五在櫃台發放。',
        'given out＝distributed（換句話說）。',
      ),
      read(
        ['Chris Wu (10:02 A.M.): Are you still at the printing shop?', 'Mia Chen (10:04 A.M.): Yes. The brochures are almost ready.', 'Chris Wu (10:05 A.M.): Great. Could you also pick up some coffee for the meeting?', 'Mia Chen (10:06 A.M.): No problem.'],
        'What will Ms. Chen most likely do next?',
        ['Buy some coffee', 'Print more brochures', 'Start the meeting', 'Call the printing shop'],
        'Chris：你還在印刷店嗎？／Mia：對，手冊快好了。／Chris：太好了，可以順便幫開會買些咖啡嗎？／Mia：沒問題。',
        'Mia 答應了 Chris 的請求，接下來會去買咖啡。',
      ),
    ],
  },
  {
    title: '多篇閱讀',
    items: [
      read(
        ['ADVERTISEMENT', 'Green Leaf Hotel: Rooms from $120 per night. Free breakfast for guests who book three nights or more. Free airport shuttle every hour.', '', 'E-MAIL', 'Dear Green Leaf Hotel, I would like to book a room from June 3 to June 6 (three nights). I will arrive at the airport at 3 p.m. Ken Sato'],
        'What will Mr. Sato most likely receive?',
        ['Free breakfast', 'A discount on the shuttle', 'A room upgrade', 'A late checkout'],
        '（廣告）綠葉飯店：每晚 120 美元起。訂三晚以上的房客免費早餐。每小時一班免費機場接駁車。（電子郵件）綠葉飯店您好，我想訂 6 月 3 日到 6 日（三晚）的房間，我下午三點抵達機場。佐藤健',
        '要把兩篇合起來看：廣告說訂三晚以上免費早餐，佐藤先生訂了三晚。接駁車本來就免費，不是折扣。',
      ),
      read(
        ['NOTICE', 'The Riverside Library will be closed for renovation from July 1 to July 14. Books may be returned to the drop box at the front door.', '', 'E-MAIL', 'Hi Ben, I am planning to return my books to the library on July 5 and borrow some new ones for my trip. Anna'],
        'What problem will Anna have?',
        ['She cannot borrow books on July 5.', 'She cannot return her books.', 'Her trip will be canceled.', 'The library will move.'],
        '（公告）河濱圖書館 7 月 1 日到 14 日整修休館，書可以還到正門口的還書箱。（電子郵件）嗨 Ben，我打算 7 月 5 日去圖書館還書，再借幾本新書帶去旅行。Anna',
        '7 月 5 日在休館期間：還書可以用還書箱，但借不到新書。',
      ),
      read(
        ['MEMO', 'The monthly team lunch will be held at Rosa Italian Restaurant on Friday at 12:30. Please tell Jenny by Wednesday if you cannot attend.', '', 'E-MAIL', 'Hi Jenny, I have a client meeting on Friday afternoon, so I will miss the lunch this time. Mark'],
        'Why did Mark write to Jenny?',
        ['To say he cannot attend the lunch', 'To book a restaurant', 'To change the meeting time', 'To invite a client to lunch'],
        '（備忘錄）每月的團隊午餐週五 12:30 在 Rosa 義大利餐廳舉行，不能參加的人請在週三前告訴 Jenny。（電子郵件）嗨 Jenny，我週五下午要見客戶，這次會錯過午餐。Mark',
        '備忘錄說不能參加要告訴 Jenny，Mark 的信就是在通知自己不能參加。',
      ),
      read(
        ['PRICE LIST: COPY PLUS', 'Black and white copies: 10 cents each. Color copies: 50 cents each. Orders of 500 copies or more get 20% off.', '', 'ORDER FORM', 'Item: event poster. Color copies: 200. Pick up on Monday.'],
        'How much will the order cost?',
        ['$100', '$80', '$20', '$16'],
        '（價目表）Copy Plus：黑白影印每張 10 美分，彩色每張 50 美分，500 張以上打八折。（訂單）活動海報，彩色影印 200 張，週一取件。',
        '200 張 × 0.5 美元＝100 美元；沒有到 500 張，不打折。',
      ),
    ],
  },
]);

export const BLUE_UNITS: Unit[] = [contract, g1, logistics, part4, trip, g2, confusing, part7];
