// 英文棕色證書（220–465 分）：會議、電話、電子郵件、通勤等職場基本情境，
// 加上 Part 5 詞性題、時態、比較級、動名詞與不定詞，以及 Part 1 照片描述與 Part 2 進階題型。
import type { Unit } from '../core/types';
import { cz, en, grammarUnit, note, qa, vocabUnit } from './dsl';

const meeting = vocabUnit('en.brown.meeting', '📅', '會議與行程', 'Meetings & Schedules', [
  en('agenda', 'n.', '議程', "Let's go over today's agenda.|我們來看一下今天的議程。"),
  en('attend', 'v.', '出席；參加', 'All managers must attend the meeting.|所有經理都必須出席會議。'),
  en('conference', 'n.', '研討會；大型會議', 'She will speak at a conference in Tokyo.|她將在東京的研討會上演講。'),
  en('presentation', 'n.', '簡報', 'His presentation was clear and short.|他的簡報清楚又簡短。'),
  en('participant', 'n.', '參加者', 'Each participant will receive a name tag.|每位參加者都會拿到名牌。'),
  en('confirm', 'v.', '確認', 'Please confirm the time of the meeting.|請確認會議的時間。'),
  en('postpone', 'v.', '延後', 'The meeting was postponed until Friday.|會議延到星期五。'),
  en('reschedule', 'v.', '重新安排時間', 'Can we reschedule our appointment?|我們可以改約時間嗎？'),
  en('cancel', 'v.', '取消', 'The client canceled the meeting.|客戶取消了會議。', { note: '美式拼法 canceled，英式拼法 cancelled，兩種都對。' }),
  en('minutes', 'n.', '會議紀錄', 'Who will take the minutes today?|今天誰負責做會議紀錄？', { note: '當「會議紀錄」時固定用複數 minutes。' }),
]);

const phone = vocabUnit('en.brown.phone', '📞', '電話應對', 'On the Phone', [
  en('extension', 'n.', '分機', 'Please call me at extension 205.|請打分機 205 找我。'),
  en('hold on', 'phr.', '稍等（不要掛斷）', 'Could you hold on for a moment?|可以請您稍等一下嗎？'),
  en('connect', 'v.', '轉接；連接', 'I will connect you to the sales department.|我幫您轉接業務部。'),
  en('unavailable', 'adj.', '無法接聽的；沒空的', 'Mr. Chen is unavailable right now.|陳先生現在無法接聽。'),
  en('message', 'n.', '留言；訊息', 'May I take a message?|需要幫您留言嗎？'),
  en('voicemail', 'n.', '語音信箱', 'I left a voicemail for him.|我在他的語音信箱留了言。'),
  en('call back', 'phr.', '回電', 'I will call back after lunch.|我午餐後回電。'),
  en('reach', 'v.', '聯絡上', 'You can reach me at this number.|您可以打這支電話聯絡我。'),
  en('line', 'n.', '電話線路', 'The line is busy.|電話佔線中。'),
  en('hang up', 'phr.', '掛斷電話', 'Please do not hang up.|請不要掛斷。'),
]);

const g1 = grammarUnit('en.brown.g1', '🔍', '文法①：詞性判斷', 'Part 5 名詞・形容詞・副詞', [
  {
    title: '名詞與形容詞',
    notes: [
      note(
        '看位置判斷詞性',
        [
          '多益 Part 5 最常見的題型：四個選項是同一個字的不同詞性，看空格的位置就能選。',
          '冠詞（a / an / the）、所有格（your / our）、形容詞後面 → 名詞。',
          'be 動詞後面、名詞前面 → 形容詞。',
          '常見字尾：名詞 -tion / -ment / -ness / -ity；形容詞 -ful / -ive / -able / -al；副詞 -ly。',
        ],
        ['Thank you for your cooperation.|謝謝您的合作。', 'We offer competitive prices.|我們提供有競爭力的價格。'],
      ),
    ],
    items: [
      cz('Thank you for your ___.', ['cooperation', 'cooperate', 'cooperative', 'cooperatively'], '謝謝您的合作。', '所有格 your 後面要接名詞。'),
      cz('The manager made an important ___.', ['decision', 'decide', 'decisive', 'decisively'], '經理做了一個重要的決定。', '形容詞 important 後面要接名詞。'),
      cz('The new office is very ___.', ['spacious', 'space', 'spaciously', 'spaces'], '新辦公室非常寬敞。', 'be 動詞＋very 後面接形容詞。'),
      cz('We offer ___ prices to all members.', ['competitive', 'compete', 'competition', 'competitively'], '我們為所有會員提供有競爭力的價格。', '名詞 prices 前面要用形容詞修飾。'),
      cz('The ___ of the new branch was delayed.', ['opening', 'open', 'opened', 'opens'], '新分店的開幕延後了。', 'The 和 of 中間要放名詞；opening 在這裡是名詞「開幕」。'),
    ],
  },
  {
    title: '動詞與副詞',
    notes: [
      note(
        '副詞修飾動詞與形容詞',
        [
          '副詞（多半是 -ly 結尾）修飾動詞、形容詞或整個句子：read carefully、extremely busy。',
          '助動詞（will / can / should）後面接原形動詞。',
          '陷阱：hard 本身就是副詞（努力地），hardly 的意思是「幾乎不」。',
        ],
        ['Please read the contract carefully.|請仔細閱讀合約。', 'Sales increased significantly last year.|去年銷售額大幅成長。'],
      ),
    ],
    items: [
      cz('Please read the contract ___.', ['carefully', 'careful', 'care', 'cares'], '請仔細閱讀合約。', '修飾動詞 read 要用副詞。'),
      cz('Sales increased ___ last quarter.', ['significantly', 'significant', 'significance', 'signify'], '上一季銷售額大幅成長。', '修飾動詞 increased 要用副詞。'),
      cz('The team worked ___ to finish the project on time.', ['hard', 'hardly', 'harden', 'hardness'], '團隊努力工作，準時完成了專案。', 'hard 當副詞就是「努力地」；hardly 是「幾乎不」，是常見陷阱。'),
      cz('The new system will ___ costs.', ['reduce', 'reduction', 'reduced', 'reducing'], '新系統將會降低成本。', '助動詞 will 後面接原形動詞。'),
      cz('This printer is ___ easy to use.', ['extremely', 'extreme', 'extremes', 'extremity'], '這台印表機非常容易使用。', '修飾形容詞 easy 要用副詞。'),
    ],
  },
]);

const email = vocabUnit('en.brown.email', '✉️', '電子郵件用語', 'Business Email', [
  en('regarding', 'prep.', '關於', 'I am writing regarding your order.|我寫信是關於您的訂單。'),
  en('inquiry', 'n.', '詢問', 'Thank you for your inquiry.|感謝您的詢問。'),
  en('attach', 'v.', '附加', 'I have attached the file.|我已附上檔案。'),
  en('attachment', 'n.', '附件', 'Please see the attachment.|請參閱附件。'),
  en('forward', 'v.', '轉寄', 'I will forward the email to my manager.|我會把這封信轉寄給我的經理。'),
  en('reply', 'v./n.', '回覆', 'Thank you for your quick reply.|感謝您的迅速回覆。'),
  en('recipient', 'n.', '收件人', 'Check the recipient before you send it.|寄出前請確認收件人。'),
  en('urgent', 'adj.', '緊急的', 'This is an urgent request.|這是一項緊急的請求。'),
  en('sincerely', 'adv.', '誠摯地', 'We sincerely apologize for the delay.|我們誠摯地為延誤致歉。', {
    note: '英文書信常用「Sincerely,」當結尾敬語，相當於「敬上」。',
  }),
  en('look forward to', 'phr.', '期待', 'I look forward to hearing from you.|期待您的回音。', {
    note: 'to 是介系詞，後面接名詞或動名詞（V-ing），不是原形動詞。',
  }),
]);

const dept = vocabUnit('en.brown.dept', '🏢', '公司部門與職務', 'Departments & Roles', [
  en('department', 'n.', '部門', 'She works in the sales department.|她在業務部工作。'),
  en('accounting', 'n.', '會計（部門）', 'Please send the receipts to accounting.|請把收據送到會計部。'),
  en('personnel', 'n.', '人事；全體人員', 'The personnel office is on the third floor.|人事室在三樓。'),
  en('headquarters', 'n.', '總部', 'Our headquarters is in Taipei.|我們的總部在台北。'),
  en('branch', 'n.', '分公司；分店', 'The bank opened a new branch downtown.|這家銀行在市中心開了一間新分行。'),
  en('director', 'n.', '主任；董事', 'The director approved the plan.|主任批准了這項計畫。'),
  en('intern', 'n.', '實習生', 'We are hiring two interns this summer.|我們今年夏天要招兩名實習生。'),
  en('hire', 'v.', '僱用', 'The company plans to hire more staff.|公司打算僱用更多員工。'),
  en('promote', 'v.', '升職；促銷', 'She was promoted to manager last year.|她去年升為經理。'),
  en('retire', 'v.', '退休', 'Mr. Wang will retire next year.|王先生明年退休。'),
]);

const g2 = grammarUnit('en.brown.g2', '⏱️', '文法②：進行式與完成式', 'Progressive & Perfect', [
  {
    title: '進行式',
    notes: [
      note(
        '進行式：be ＋ V-ing',
        [
          '現在進行式：此刻正在做的事，或已經安排好的近期計畫：We are meeting the client tomorrow.',
          '過去進行式：過去某個時間點正在進行的事，常和 when ＋ 過去式搭配。',
          '常見提示字：now、right now、at the moment、currently。',
        ],
        ['She is talking on the phone right now.|她現在正在講電話。', 'I was writing an email when he arrived.|他到的時候，我正在寫電子郵件。'],
      ),
    ],
    items: [
      cz('Ms. Lee ___ on the phone right now.', ['is talking', 'talks', 'talked', 'has talked'], '李小姐現在正在講電話。', 'right now 表示此刻正在進行，用現在進行式。'),
      cz('We ___ a new product at the moment.', ['are developing', 'develop', 'developed', 'have developed'], '我們目前正在開發一項新產品。', 'at the moment 提示正在進行。'),
      cz('I ___ lunch when the manager called me.', ['was having', 'am having', 'have', 'will have'], '經理打電話給我的時候，我正在吃午餐。', '過去某個時間點正在進行的動作，用過去進行式。'),
      cz('The company is currently ___ for a new accountant.', ['looking', 'look', 'looked', 'looks'], '公司目前正在找新的會計。', 'is ＋ V-ing 構成現在進行式；currently 是提示字。'),
    ],
  },
  {
    title: '現在完成式',
    notes: [
      note(
        '現在完成式：have / has ＋ 過去分詞',
        [
          '表示從過去持續到現在的事、到目前為止的經驗，或剛完成的事。',
          'since ＋ 時間點（since 2020）；for ＋ 一段時間（for three years）。',
          '常見提示字：already、yet、just、ever、never、so far、recently。',
          '句子裡有明確的過去時間（yesterday、last year、ago）就不能用完成式，要用過去式。',
        ],
        ['I have already sent the invoice.|我已經寄出發票了。', 'She has worked here since 2020.|她從 2020 年起就在這裡工作。'],
      ),
    ],
    items: [
      cz('I have already ___ the invoice.', ['sent', 'send', 'sending', 'sends'], '我已經寄出發票了。', 'have ＋ 過去分詞；send 的過去分詞是 sent。'),
      cz('She ___ here since 2020.', ['has worked', 'works', 'is working', 'worked'], '她從 2020 年起就在這裡工作。', 'since ＋ 時間點，表示從過去持續到現在，用現在完成式。'),
      cz('We have known Mr. Kim ___ ten years.', ['for', 'since', 'ago', 'during'], '我們認識金先生十年了。', 'for ＋ 一段時間；since ＋ 時間點。'),
      cz('___ you ever visited our factory?', ['Have', 'Did', 'Are', 'Do'], '您曾經參觀過我們的工廠嗎？', 'ever ＋ 過去分詞 visited，用 Have 開頭的現在完成式。'),
      cz('The shipment ___ yesterday.', ['arrived', 'has arrived', 'arrives', 'has been arriving'], '貨物昨天到了。', '有明確的過去時間 yesterday，要用過去式，不能用完成式。'),
    ],
  },
]);

const product = vocabUnit('en.brown.product', '📦', '產品與服務', 'Products & Services', [
  en('product', 'n.', '產品', 'This product is very popular with students.|這項產品很受學生歡迎。'),
  en('service', 'n.', '服務', 'The service at this hotel is excellent.|這家飯店的服務非常好。'),
  en('quality', 'n.', '品質', 'We check the quality of every item.|我們檢查每件商品的品質。'),
  en('feature', 'n.', '特色；功能', 'The new phone has many useful features.|這支新手機有很多實用的功能。'),
  en('warranty', 'n.', '保固', 'The laptop comes with a two-year warranty.|這台筆電附兩年保固。'),
  en('in stock', 'phr.', '有庫存', 'Is this item in stock?|這個商品有庫存嗎？', { note: '相反是 out of stock（缺貨）。' }),
  en('deliver', 'v.', '遞送', 'We deliver within three days.|我們三天內送達。'),
  en('refund', 'n./v.', '退款', 'You can get a full refund within 30 days.|三十天內可以全額退款。'),
  en('replace', 'v.', '更換', 'We will replace the broken part for free.|我們會免費更換壞掉的零件。'),
  en('complaint', 'n.', '客訴；抱怨', 'We received a complaint from a customer.|我們收到一位顧客的客訴。'),
]);

const PART2_NOTE = note(
  'Part 2 進階題型',
  [
    '選擇問句（A or B?）：通常不用 Yes / No 回答，而是選一個、兩個都要或都不要。',
    '是非問句（Did you…? / Is it…?）：正確答案常常是「間接回答」，例如「讓我查一下」。',
    '直述句：對方只是說了一件事，要選最自然的反應。',
    '陷阱：重複題目裡的字、或發音相近的字的選項，往往是錯的。',
  ],
  ['Would you prefer tea or coffee? — Coffee, please.|您想喝茶還是咖啡？— 咖啡，謝謝。'],
);

const listening = grammarUnit(
  'en.brown.listen',
  '🎧',
  '聽力：Part 2 進階',
  '選擇問句・間接回答',
  [
    {
      title: '選擇與是非問句',
      notes: [PART2_NOTE],
      items: [
        qa('Would you like a window seat or an aisle seat?', ['An aisle seat, please.', 'Yes, I would.', 'The window is open.'], '您想要靠窗還是靠走道的座位？', '選擇問句不回答 Yes / No，直接選一個。'),
        qa('Should we take a taxi or the subway?', ['The subway is faster at this hour.', 'Yes, we should.', 'I paid the taxi driver.'], '我們該搭計程車還是地鐵？', '選擇問句：選其中一個並說明原因。'),
        qa('Did you finish the sales report?', ["I'll have it done by noon.", 'Sales were good this year.', 'At the front desk.'], '你完成銷售報告了嗎？', '間接回答：沒有直接說 No，而是說中午前會完成。重複 sales 的選項是陷阱。'),
        qa('Is the conference room free this afternoon?', ['Let me check the schedule.', 'It has six chairs.', 'Yes, the conference was long.'], '會議室今天下午有空嗎？', '「讓我查一下行程」是很常見的間接回答。'),
        qa("Isn't the store open on Sundays?", ["No, it's closed on weekends.", 'Yes, I bought it there.', 'Please open the door.'], '這家店星期日不是有營業嗎？', '否定問句照事實回答：沒營業就說 No。'),
      ],
    },
    {
      title: '直述句與間接回答',
      items: [
        qa("I can't find my car keys.", ['Did you check your coat pocket?', 'Yes, I can.', 'The car is new.'], '我找不到我的車鑰匙。', '直述句：選合理的反應，例如提出建議。'),
        qa('The printer is out of paper again.', ["I'll get some from the supply room.", 'Please print two copies.', 'It was in the newspaper.'], '印表機又沒紙了。', '直述句：回應如何解決問題；重複 paper 的選項是陷阱。'),
        qa('Why was the meeting canceled?', ['The manager is out sick today.', 'In meeting room B.', 'Yes, it was canceled.'], '會議為什麼取消了？', 'Why 問原因；重複 canceled 的 Yes 選項是陷阱。'),
        qa('When will the new manager start?', ["I haven't heard yet.", 'At the main office.', 'She is very kind.'], '新經理什麼時候到任？', '「我還沒聽說」也是常見的正確答案。'),
        qa("Let's have lunch at the new Italian restaurant.", ['Sounds great.', 'Italy is a beautiful country.', 'Yes, it is new.'], '我們去那家新開的義大利餐廳吃午餐吧。', "Let's… 是提議，回答接受或婉拒；用聯想字 Italy 的選項是陷阱。"),
      ],
    },
  ],
  'listening',
);

const commute = vocabUnit('en.brown.commute', '🚉', '交通與通勤', 'Getting Around', [
  en('commute', 'v./n.', '通勤', 'It takes me an hour to commute to work.|我通勤上班要一個小時。'),
  en('traffic', 'n.', '交通（車流量）', 'There was heavy traffic this morning.|今天早上車很多。', { note: 'traffic jam＝塞車；heavy traffic＝車流量大。' }),
  en('fare', 'n.', '車資', 'The bus fare is two dollars.|公車車資是兩美元。'),
  en('platform', 'n.', '月台', 'The train to Taipei leaves from platform four.|往台北的火車從四號月台出發。'),
  en('transfer', 'v./n.', '轉乘；調職', 'You need to transfer at the next station.|你要在下一站轉車。'),
  en('shuttle', 'n.', '接駁車', 'A free shuttle runs between the hotel and the airport.|飯店和機場之間有免費接駁車。'),
  en('parking lot', 'n.', '停車場', 'The parking lot behind the building is full.|大樓後面的停車場滿了。'),
  en('pedestrian', 'n.', '行人', 'This street is for pedestrians only.|這條街是行人專用。'),
  en('route', 'n.', '路線', 'Which route is the fastest to the airport?|去機場哪條路線最快？'),
  en('crowded', 'adj.', '擁擠的', 'The train was very crowded this morning.|今天早上的火車非常擠。'),
]);

const part1 = grammarUnit('en.brown.part1', '📷', 'Part 1 照片描述', '人物動作・物品狀態與位置', [
  {
    title: '人物的動作',
    notes: [
      note(
        'Part 1：看人物的動作',
        [
          '正式考試會看一張照片、聽四個句子，選出最符合照片的描述。這裡把照片寫成（照片：…）。',
          '人物照片最常用現在進行式 is / are ＋ V-ing，重點是「正在做什麼」。',
          '陷阱：wearing 是「穿戴著」的狀態，putting on 是「正在穿上」的動作；照片裡已經戴好帽子就選 wearing。',
          '選項提到照片裡有的東西、但動作不對，是最常見的陷阱。',
        ],
        ['A man is wearing a helmet.|一名男子戴著安全帽。', 'A woman is putting on her coat.|一名女子正在穿外套。'],
      ),
    ],
    items: [
      cz('（照片：一名男子戴著安全帽站在工地）The man is ___ a helmet.', ['wearing', 'putting on', 'taking off', 'buying'], '那名男子戴著安全帽。', '已經戴在頭上的狀態用 wearing；putting on 是「正在戴上」的動作。'),
      cz('（照片：一名女子正把外套穿上）The woman is ___ her coat.', ['putting on', 'hanging up', 'washing', 'folding'], '那名女子正在穿外套。', '照片拍到「穿上」的動作，用 putting on。'),
      cz('（照片：一名男子正把咖啡倒進杯子）The man is ___ some coffee.', ['pouring', 'drinking', 'ordering', 'spilling'], '那名男子正在倒咖啡。', 'pour＝倒（液體）。他還沒喝，所以不是 drinking。'),
      cz('（照片：一名女子坐在電腦前打字）The woman is ___ on a keyboard.', ['typing', 'printing', 'repairing', 'leaning'], '那名女子正在用鍵盤打字。', 'type＝打字。'),
      cz('（照片：兩名工人一起搬一張桌子）The workers are ___ a table.', ['carrying', 'cleaning', 'setting', 'painting'], '工人們正在搬一張桌子。', 'carry＝搬運；set the table 是擺餐具。'),
      cz('（照片：一群人在會議室裡看著螢幕上的圖表）Some people are ___ a chart.', ['looking at', 'drawing', 'hanging', 'printing'], '一群人正在看一張圖表。', '大家在看螢幕，用 looking at。'),
    ],
  },
  {
    title: '物品的狀態與位置',
    notes: [
      note(
        'Part 1：看物品的狀態與位置',
        [
          '照片裡沒有人時，常用 has / have been ＋ 過去分詞或 be ＋ 過去分詞，描述「已經被…」的狀態。',
          'is / are being ＋ 過去分詞是「正在被…」，照片裡一定要有人正在做這件事。',
          '位置的說法：next to（旁邊）、across from（對面）、along（沿著）、against（靠著）、on top of（在…上面）。',
        ],
        ['Some chairs have been stacked against the wall.|幾張椅子靠牆疊放著。', 'The wall is being painted.|牆壁正在被油漆。'],
      ),
    ],
    items: [
      cz('（照片：會議室裡沒有人，椅子都已經疊好靠在牆邊）Some chairs ___ stacked against the wall.', ['have been', 'are being', 'is being', 'has'], '幾張椅子已經靠牆疊放好了。', '畫面裡沒有人在疊，不能用 are being stacked；已經疊好的狀態用 have been stacked。'),
      cz('（照片：一名工人正拿著滾筒油漆牆壁）The wall ___ painted.', ['is being', 'has been', 'have been', 'were'], '牆壁正在被油漆。', '有人正在油漆，用進行被動 is being painted。'),
      cz('（照片：幾輛車沿著路邊停放）Some cars are parked ___ the street.', ['along', 'above', 'into', 'through'], '幾輛車沿著街道停著。', 'along the street＝沿著街道。'),
      cz('（照片：一把梯子靠在牆上）A ladder is leaning ___ the wall.', ['against', 'over', 'under', 'between'], '一把梯子靠在牆上。', 'lean against＝靠著。'),
      cz('（照片：兩個人隔著桌子面對面坐著）The two people are sitting ___ each other.', ['across from', 'next to', 'behind', 'on top of'], '兩個人面對面坐著。', 'across from＝在…的對面。'),
      cz('（照片：書架上的書排得很整齊，旁邊沒有人）Some books ___ arranged on the shelves.', ['have been', 'are being', 'is being', 'was'], '書已經整齊地排在書架上。', '沒有人在整理，用已經完成的狀態 have been arranged。'),
    ],
  },
]);

const g3 = grammarUnit('en.brown.g3', '📊', '文法③：比較級與最高級', 'Comparatives & Superlatives', [
  {
    title: '比較級',
    notes: [
      note(
        '比較級：兩個東西比較',
        [
          '短的形容詞加 -er：cheap → cheaper、large → larger、big → bigger；長的形容詞前面加 more：more expensive。',
          '後面常接 than：This model is lighter than that one.',
          '加強比較級用 much、far、even、a lot，不能用 very：much cheaper。',
          '不規則變化：good → better → best、bad → worse → worst、many / much → more → most、little → less → least。',
        ],
        ['The new office is larger than the old one.|新辦公室比舊的大。', 'This plan is much more expensive.|這個方案貴得多。'],
      ),
    ],
    items: [
      cz('The new printer is ___ than the old one.', ['faster', 'fast', 'fastest', 'more fast'], '新印表機比舊的快。', 'than 前面用比較級；fast 是短字，加 -er。'),
      cz('This hotel is ___ expensive than the one near the station.', ['more', 'most', 'much', 'very'], '這家飯店比車站附近那家貴。', 'expensive 是長字，比較級是 more expensive。'),
      cz('Sales this year were much ___ than last year.', ['better', 'good', 'best', 'well'], '今年的銷售比去年好得多。', 'good 的比較級是 better；much 用來加強比較級。'),
      cz('The second option is ___ cheaper than the first.', ['far', 'very', 'so', 'too'], '第二個方案比第一個便宜得多。', '加強比較級用 far、much、even，不能用 very。'),
      cz('We need ___ time to finish the report.', ['more', 'many', 'most', 'few'], '我們需要更多時間來完成報告。', 'time 不可數，「更多的」用 more；many、few 只能接可數名詞。'),
    ],
  },
  {
    title: '最高級與原級比較',
    notes: [
      note(
        '最高級與 as … as',
        [
          '三個以上比較用最高級：the ＋ -est / the most ＋ 形容詞，後面常接 in ＋ 範圍或 of ＋ 群體。',
          'one of the ＋ 最高級 ＋ 複數名詞：最…的其中之一。',
          'as ＋ 原級 ＋ as：和…一樣；not as … as：不如…。',
          '比較級 ＋ than any other ＋ 單數名詞，意思等於最高級。',
        ],
        ['This is the most popular model in our store.|這是我們店裡最受歡迎的型號。', 'The new phone is as light as the old one.|新手機和舊的一樣輕。'],
      ),
    ],
    items: [
      cz('This is the ___ popular product in our store.', ['most', 'more', 'much', 'very'], '這是我們店裡最受歡迎的產品。', 'the ＋ most ＋ 長形容詞＝最高級。'),
      cz('Ms. Chen is one of the most experienced ___ in our company.', ['engineers', 'engineer', 'engineering', 'engineered'], '陳小姐是我們公司最有經驗的工程師之一。', 'one of the ＋ 最高級 ＋ 複數名詞。'),
      cz('The new model is ___ light as the old one.', ['as', 'so', 'more', 'than'], '新型號和舊型號一樣輕。', 'as ＋ 原級 ＋ as：和…一樣。'),
      cz('It was the ___ day of the year.', ['hottest', 'hotter', 'hot', 'most hot'], '那是一年中最熱的一天。', 'hot 的最高級要重複字尾 t：hottest。'),
      cz('Our service is better than ___ other company in the city.', ['any', 'all', 'every', 'some'], '我們的服務比市內任何一家公司都好。', '比較級 ＋ than any other ＋ 單數名詞，意思等於最高級。'),
    ],
  },
]);

const g4 = grammarUnit('en.brown.g4', '🔁', '文法④：動名詞與不定詞', 'V-ing & to V', [
  {
    title: '動詞後面接 V-ing 還是 to V',
    notes: [
      note(
        '動名詞（V-ing）與不定詞（to V）',
        [
          '後面接 V-ing 的動詞：enjoy、finish、avoid、consider、suggest、mind、keep、postpone。',
          '後面接 to V 的動詞：want、plan、decide、hope、agree、offer、promise、refuse、need、expect。',
          '介系詞後面一定接 V-ing：interested in working、before leaving、thank you for coming。',
          '陷阱：look forward to、be used to 的 to 是介系詞，後面接 V-ing。',
        ],
        ['Would you mind closing the window?|可以麻煩你關窗嗎？', 'We decided to open a new branch.|我們決定開一間新分店。'],
      ),
    ],
    items: [
      cz('Would you mind ___ the door?', ['closing', 'to close', 'close', 'closed'], '可以麻煩你關門嗎？', 'mind 後面接 V-ing。'),
      cz('The company plans ___ a new branch next year.', ['to open', 'opening', 'open', 'opened'], '公司計畫明年開一間新分店。', 'plan 後面接 to V。'),
      cz('Mr. Kim finished ___ the report at midnight.', ['writing', 'to write', 'write', 'written'], '金先生在半夜寫完了報告。', 'finish 後面接 V-ing。'),
      cz('We look forward to ___ you at the conference.', ['seeing', 'see', 'saw', 'be seen'], '我們期待在研討會上見到您。', 'look forward to 的 to 是介系詞，後面接 V-ing。'),
      cz('The manager agreed ___ the budget.', ['to increase', 'increasing', 'increase', 'increased'], '經理同意增加預算。', 'agree 後面接 to V。'),
    ],
  },
  {
    title: '當主詞、表目的與意思會變的動詞',
    notes: [
      note(
        'V-ing 與 to V 的其他用法',
        [
          'V-ing 可以當主詞：Exercising every day is good for your health.',
          'to V 表示目的「為了…」：She called to confirm the reservation.',
          'stop ＋ V-ing＝不再做…；stop ＋ to V＝停下來去做…。',
          'remember / forget ＋ V-ing＝記得／忘了做過…；＋ to V＝記得／忘了要去做…。',
        ],
        ['Please remember to lock the door.|請記得鎖門。', 'He stopped smoking last year.|他去年戒菸了。'],
      ),
    ],
    items: [
      cz('___ a second language takes time.', ['Learning', 'Learn', 'Learned', 'Learns'], '學第二外語需要時間。', 'V-ing 可以當主詞。'),
      cz('She called the hotel ___ her reservation.', ['to confirm', 'confirming', 'confirm', 'confirmed'], '她打電話給飯店確認訂房。', 'to V 表示目的：為了確認。'),
      cz('Please remember ___ off the lights when you leave.', ['to turn', 'turning', 'turn', 'turned'], '離開時請記得關燈。', 'remember to V＝記得要去做（還沒做）。'),
      cz('He stopped ___ coffee because he could not sleep.', ['drinking', 'to drink', 'drink', 'drunk'], '他因為睡不著而不再喝咖啡了。', 'stop ＋ V-ing＝不再做某事。'),
      cz('Thank you for ___ our store.', ['visiting', 'visit', 'to visit', 'visited'], '感謝您光臨本店。', '介系詞 for 後面接 V-ing。'),
    ],
  },
]);

export const BROWN_UNITS: Unit[] = [meeting, phone, g1, email, dept, g2, product, listening, commute, part1, g3, g4];
