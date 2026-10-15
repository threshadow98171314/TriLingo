// 英文綠色證書（470–725 分）：商務書信、人事招募、行銷、財務，
// 加上 Part 5／6 常考的被動語態、關係子句、轉折語，以及 Part 3 簡短對話。
import type { Unit } from '../core/types';
import { cz, en, grammarUnit, note, talk, vocabUnit } from './dsl';

const letter = vocabUnit('en.green.letter', '📨', '商務書信', 'Business Correspondence', [
  en('enclose', 'v.', '隨信附上', 'Please find enclosed a copy of the contract.|隨信附上合約影本一份。'),
  en('acknowledge', 'v.', '確認收到；承認', 'We acknowledge receipt of your payment.|我們確認已收到您的款項。'),
  en('prompt', 'adj.', '迅速的；即時的', 'Thank you for your prompt reply.|感謝您迅速的回覆。'),
  en('notify', 'v.', '通知', 'We will notify you when your order ships.|您的訂單出貨時我們會通知您。'),
  en('verify', 'v.', '核對；確認', 'Please verify your address before you place the order.|下單前請核對您的地址。'),
  en('correspondence', 'n.', '往來信件', 'Please keep all correspondence with the client.|請保留和客戶的所有往來信件。'),
  en('apologize', 'v.', '道歉', 'We apologize for the delay in shipping.|出貨延遲，我們深感抱歉。', { note: 'apologize for ＋ 事情；apologize to ＋ 人。' }),
  en('inconvenience', 'n.', '不便', 'We are sorry for any inconvenience this may cause.|造成任何不便，我們深感抱歉。'),
  en('appreciate', 'v.', '感激；重視', 'We appreciate your patience.|感謝您的耐心等候。'),
  en('assistance', 'n.', '協助', 'Thank you for your assistance with the event.|感謝您協助這次活動。'),
  en('at your convenience', 'phr.', '在您方便的時候', 'Please call me back at your convenience.|請在您方便的時候回電給我。'),
  en('reference', 'n.', '參考；推薦信', 'Please include the order number for reference.|請附上訂單編號以便查詢。', { note: 'reference 也指「推薦信、推薦人」，求職時常見。' }),
]);

const hr = vocabUnit('en.green.hr', '🧑‍💼', '人事與招募', 'Hiring & HR', [
  en('applicant', 'n.', '應徵者', 'Each applicant must submit a resume.|每位應徵者都必須繳交履歷。'),
  en('candidate', 'n.', '候選人', 'She is the best candidate for the job.|她是這份工作最好的人選。'),
  en('qualified', 'adj.', '有資格的；合格的', 'We are looking for a qualified engineer.|我們在找一位合格的工程師。'),
  en('resume', 'n.', '履歷', 'Please send your resume by email.|請用電子郵件寄送履歷。', { note: '當「履歷」時也寫成 résumé；當動詞 resume 是「恢復、繼續」。' }),
  en('interview', 'n./v.', '面試', 'The interview will take about an hour.|面試大約需要一個小時。'),
  en('position', 'n.', '職位', 'The position requires three years of experience.|這個職位需要三年經驗。'),
  en('recruit', 'v.', '招募', 'The company plans to recruit fifty new staff.|公司計畫招募五十名新員工。'),
  en('benefits', 'n.', '員工福利', 'The job offers good benefits, such as health insurance.|這份工作有不錯的福利，例如健康保險。'),
  en('salary', 'n.', '薪水', 'The salary will depend on your experience.|薪水依經驗而定。'),
  en('apply', 'v.', '應徵；申請', 'You can apply for the job online.|你可以上網應徵這份工作。', { note: 'apply for＝應徵；applicant 是應徵者，application 是申請（書）。' }),
  en('career', 'n.', '職業生涯', 'He started his career as a sales clerk.|他的職業生涯是從店員開始的。'),
  en('experience', 'n.', '經驗', 'Do you have any experience in marketing?|你有行銷方面的經驗嗎？'),
]);

const g1 = grammarUnit('en.green.g1', '🔄', '文法①：被動語態', 'Passive Voice', [
  {
    title: '被動語態的基本形',
    notes: [
      note(
        '被動語態：be ＋ 過去分詞',
        [
          '主詞是「被…」的一方時用被動：The report was sent.（報告被寄出了）',
          '時態看 be 動詞：is made／was made／will be made／has been made。',
          '動作者用 by 帶出；不重要或不知道是誰時就省略。',
          '多益常考：主詞是物（報告、包裹、會議）時，動詞多半用被動。',
        ],
        ['The meeting was postponed until Friday.|會議被延到星期五。', 'The report will be sent tomorrow.|報告明天會寄出。'],
      ),
    ],
    items: [
      cz('The package ___ yesterday afternoon.', ['was delivered', 'delivered', 'is delivering', 'has delivered'], '包裹昨天下午送達了。', '包裹是「被送」的，yesterday 用過去式被動 was delivered。'),
      cz('All employees ___ to attend the safety training.', ['are required', 'require', 'requiring', 'are requiring'], '所有員工都必須參加安全訓練。', 'be required to V＝被要求、必須。'),
      cz('The new product will ___ next month.', ['be launched', 'launch', 'launching', 'be launching'], '新產品將在下個月推出。', '產品是「被推出」的：will be ＋ 過去分詞。'),
      cz('This bridge ___ in 1990.', ['was built', 'built', 'has built', 'is building'], '這座橋建於 1990 年。', '橋是被建造的，1990 是過去的時間，用 was built。'),
      cz('Your order has already ___.', ['been shipped', 'shipped', 'shipping', 'be shipped'], '您的訂單已經出貨了。', '現在完成式被動：has been ＋ 過去分詞。'),
    ],
  },
  {
    title: '助動詞、進行式與常見搭配',
    notes: [
      note(
        '被動語態的進階用法',
        [
          '助動詞 ＋ be ＋ 過去分詞：must be submitted、can be found、should be checked。',
          '進行被動：is / are being ＋ 過去分詞，例如 The room is being cleaned.',
          '常見搭配：be located in（位於）、be satisfied with（對…滿意）、be involved in（參與）、be scheduled for（排定在）。',
          '判斷方法：空格後面有受詞 → 主動；沒有受詞、主詞是被動作的一方 → 被動。',
        ],
        ['Applications must be submitted by Friday.|申請書必須在星期五前提交。', 'The conference room is being cleaned now.|會議室現在正在打掃。'],
      ),
    ],
    items: [
      cz('All forms must ___ by May 1.', ['be submitted', 'submit', 'submitting', 'have submit'], '所有表格必須在五月一日前提交。', '助動詞 must ＋ be ＋ 過去分詞。'),
      cz('The conference room ___ right now, so please use Room B.', ['is being cleaned', 'is cleaning', 'cleans', 'has cleaned'], '會議室現在正在打掃，請使用 B 會議室。', '房間是被打掃的、而且正在進行：is being cleaned。'),
      cz('Our main office is ___ in Taichung.', ['located', 'locating', 'location', 'locate'], '我們的總公司位於台中。', 'be located in＝位於。'),
      cz('Most customers were ___ with the new service.', ['satisfied', 'satisfying', 'satisfy', 'satisfaction'], '大多數顧客對新服務很滿意。', 'be satisfied with＝對…感到滿意。'),
      cz('The manager ___ the proposal after a long discussion.', ['approved', 'was approved', 'is approved', 'been approved'], '經過長時間討論，經理批准了提案。', '後面有受詞 the proposal，用主動。'),
    ],
  },
]);

const market = vocabUnit('en.green.market', '📣', '行銷與銷售', 'Marketing & Sales', [
  en('advertise', 'v.', '廣告；宣傳', 'We advertise our products on social media.|我們在社群媒體上宣傳產品。'),
  en('campaign', 'n.', '活動（宣傳）', 'The new ad campaign starts next month.|新的廣告活動下個月開始。'),
  en('promotion', 'n.', '促銷；升遷', 'The store is running a special promotion this week.|這家店這週在做特別促銷。', { note: 'promotion 也有「升遷」的意思：get a promotion＝升職。' }),
  en('launch', 'v./n.', '推出；上市', 'The company will launch a new phone in May.|公司將在五月推出新手機。'),
  en('target', 'n./v.', '目標；以…為對象', 'Our target customers are young professionals.|我們的目標客群是年輕上班族。'),
  en('survey', 'n.', '問卷調查', 'We conducted a survey of five hundred customers.|我們對五百位顧客做了問卷調查。'),
  en('consumer', 'n.', '消費者', 'Consumers want lower prices and better quality.|消費者想要更低的價格和更好的品質。'),
  en('brand', 'n.', '品牌', 'This brand is very popular in Asia.|這個品牌在亞洲很受歡迎。'),
  en('demand', 'n.', '需求', 'Demand for electric cars is growing.|電動車的需求正在成長。'),
  en('competitor', 'n.', '競爭對手', 'Our main competitor lowered its prices.|我們的主要競爭對手降價了。'),
  en('strategy', 'n.', '策略', 'We need a new marketing strategy.|我們需要新的行銷策略。'),
  en('market share', 'n.', '市佔率', 'The company increased its market share last year.|公司去年提高了市佔率。'),
]);

const part3 = grammarUnit(
  'en.green.part3',
  '🗣️',
  '聽力：Part 3 簡短對話',
  '聽兩人對話，回答問題',
  [
    {
      title: '地點、問題與細節',
      notes: [
        note(
          'Part 3 簡短對話',
          [
            '正式考試會聽一段兩到三人的對話，每段回答三個問題；這裡每段先練一題。',
            '先看問題再聽：問主旨要抓開頭，問細節要抓關鍵字。',
            '常見問題：Where most likely are the speakers?（地點）、What problem does … mention?（問題）、What will … do next?（下一步）。',
            '正確答案常常是「換句話說」，和對話裡用的字不一樣。',
          ],
          ['What is the conversation mainly about?|這段對話主要在談什麼？'],
        ),
      ],
      items: [
        talk(
          ['F: Hi, I would like to return this jacket. It is too small.', 'M: Sure. Do you have your receipt?', 'F: Yes, here it is.'],
          'Where most likely are the speakers?',
          ['At a clothing store', 'At a bank', 'At a restaurant', 'At a post office'],
          '女：你好，我想退這件夾克，太小了。／男：好的，您有收據嗎？／女：有，在這裡。',
          '退夾克、要收據，地點是服飾店。',
        ),
        talk(
          ['M: Lisa, did you book the meeting room for tomorrow?', 'F: I tried, but it was already taken. I reserved the small room on the third floor instead.', 'M: That should be fine. There are only four of us.'],
          'What problem does the woman mention?',
          ['The meeting room was not available.', 'The meeting was canceled.', 'The third floor is closed.', 'Too many people will attend.'],
          '男：Lisa，你訂了明天的會議室嗎？／女：我試過了，但已經被訂走了，所以改訂三樓的小會議室。／男：那應該沒問題，我們只有四個人。',
          '「it was already taken」＝被訂走了＝not available，這就是換句話說。',
        ),
        talk(
          ['F: The printer on our floor is jammed again.', 'M: I will call the repair company this afternoon.', 'F: Thanks. Until then, I will use the one downstairs.'],
          'What will the woman probably do?',
          ['Use another printer', 'Call a repair company', 'Buy a new printer', 'Go home early'],
          '女：我們這層的印表機又卡紙了。／男：我今天下午會打給維修公司。／女：謝謝，在那之前我先用樓下那台。',
          '女生說會用樓下那台（the one downstairs）＝另一台印表機。打電話的是男生。',
        ),
        talk(
          ['M: Excuse me, how often does the airport shuttle run?', 'F: Every thirty minutes. The next one leaves at two fifteen.', 'M: Great, I will wait here then.'],
          'When does the next shuttle leave?',
          ['At 2:15', 'At 2:30', 'At 3:00', 'In an hour'],
          '男：不好意思，機場接駁車多久一班？／女：每三十分鐘一班，下一班兩點十五分出發。／男：太好了，那我在這裡等。',
          'The next one leaves at two fifteen。「每三十分鐘一班」是陷阱。',
        ),
        talk(
          ['F: Have you seen the sales figures for May?', 'M: Yes, they are up fifteen percent. The new advertising campaign really worked.', "F: That's great news. Let's share it at the meeting on Monday."],
          'What caused the increase in sales?',
          ['A new advertising campaign', 'Lower prices', 'A new store', 'More sales staff'],
          '女：你看了五月的銷售數字嗎？／男：看了，成長了百分之十五，新的廣告活動真的有效。／女：真是好消息，星期一開會時跟大家分享吧。',
          '男生說 The new advertising campaign really worked。',
        ),
      ],
    },
    {
      title: '請求與下一步',
      items: [
        talk(
          ["M: Hi, this is Ken from accounting. Could you send me last month's travel receipts?", "F: Sure. I'll scan them and email them to you this afternoon.", 'M: Thanks. I need them by Thursday.'],
          'What does the man ask the woman to do?',
          ['Send some receipts', 'Book a business trip', 'Visit the accounting department', 'Pay a bill'],
          '男：嗨，我是會計部的 Ken，可以把上個月的差旅收據寄給我嗎？／女：好，我今天下午掃描後用電子郵件寄給你。／男：謝謝，我星期四前需要。',
          'Could you send me … travel receipts?＝請她寄收據。',
        ),
        talk(
          ['F: Our client from Osaka arrives tomorrow morning.', 'M: Should I pick him up at the airport?', "F: No, he'll take a taxi. But could you reserve a table for lunch?"],
          'What will the man most likely do next?',
          ['Make a restaurant reservation', 'Drive to the airport', 'Call a taxi', 'Fly to Osaka'],
          '女：大阪的客戶明天早上到。／男：要我去機場接他嗎？／女：不用，他會搭計程車。不過你可以訂午餐的位子嗎？',
          'reserve a table for lunch＝訂餐廳。去機場接人的提議被拒絕了。',
        ),
        talk(
          ['M: The new software update will be installed tonight.', 'F: Will we be able to use our computers tomorrow morning?', 'M: Yes, but please save your files before you leave today.'],
          'What does the man ask the woman to do?',
          ['Save her files', 'Install the software', 'Come in early', 'Turn off the lights'],
          '男：新的軟體更新會在今晚安裝。／女：明天早上可以用電腦嗎？／男：可以，但今天下班前請先存好檔案。',
          'please save your files before you leave today。',
        ),
        talk(
          ["F: I heard you're moving to the Singapore office.", "M: That's right. I'll be managing the new sales team there.", 'F: Congratulations! When do you start?', 'M: At the beginning of next month.'],
          'What will the man do in Singapore?',
          ['Manage a sales team', 'Open a restaurant', 'Attend a conference', 'Study marketing'],
          '女：聽說你要調到新加坡辦公室。／男：對，我要去管理那裡新的業務團隊。／女：恭喜！什麼時候開始？／男：下個月初。',
          "I'll be managing the new sales team there。",
        ),
        talk(
          ['M: Excuse me, I ordered a large coffee, but this is a small one.', "F: I'm so sorry. I'll make you a new one right away.", 'M: Thank you.'],
          'What problem does the man have?',
          ['He received the wrong size.', 'His coffee is cold.', 'He was charged twice.', 'The shop is closed.'],
          '男：不好意思，我點的是大杯咖啡，但這是小杯的。／女：非常抱歉，我馬上幫您重做一杯。／男：謝謝。',
          '點大杯拿到小杯＝尺寸錯了（wrong size）。',
        ),
      ],
    },
  ],
  'listening',
);

const finance = vocabUnit('en.green.finance', '💰', '財務與預算', 'Finance & Budget', [
  en('budget', 'n.', '預算', 'We are over budget this month.|我們這個月超出預算了。'),
  en('expense', 'n.', '費用；開支', 'Travel expenses will be paid by the company.|差旅費由公司支付。'),
  en('invoice', 'n.', '請款單；發票', 'Please send us an invoice for the order.|請把這筆訂單的請款單寄給我們。'),
  en('revenue', 'n.', '營收', 'Revenue rose by ten percent this year.|今年營收成長了百分之十。'),
  en('profit', 'n.', '利潤', 'The company made a large profit last year.|公司去年獲利豐厚。'),
  en('estimate', 'n./v.', '估價；估計', 'Can you give me an estimate for the repair?|可以給我修理的估價嗎？'),
  en('reimburse', 'v.', '報銷；償還', 'The company will reimburse your taxi fare.|公司會報銷你的計程車費。'),
  en('deposit', 'n./v.', '訂金；存款', 'A deposit of fifty dollars is required.|需要五十美元的訂金。'),
  en('quarter', 'n.', '季（一年的四分之一）', 'Sales increased in the third quarter.|第三季銷售成長了。'),
  en('afford', 'v.', '負擔得起', 'We cannot afford a new office this year.|我們今年負擔不起新辦公室。'),
  en('loan', 'n.', '貸款', 'The bank approved our loan.|銀行核准了我們的貸款。'),
  en('figure', 'n.', '數字', 'The sales figures will be announced on Monday.|銷售數字會在星期一公布。'),
]);

const g2 = grammarUnit('en.green.g2', '🔗', '文法②：關係子句', 'Relative Clauses', [
  {
    title: 'who・which・that',
    notes: [
      note(
        '關係代名詞：把兩個句子接起來',
        [
          '關係子句修飾前面的名詞（先行詞）。人 → who（主格）／whom（受格）；物 → which；人和物都可以用 that。',
          '逗號後面的補充說明不能用 that。',
          '關係代名詞當受詞時可以省略：the report (that) I wrote。',
        ],
        ['The woman who called you is my manager.|打電話給你的那位女士是我的經理。', 'This is the report that I wrote.|這是我寫的報告。'],
      ),
    ],
    items: [
      cz('The man ___ is standing by the door is our new director.', ['who', 'which', 'whose', 'where'], '站在門邊的那位男士是我們的新主任。', '先行詞是人（the man），當主詞用 who。'),
      cz('Please return the book ___ you borrowed last week.', ['that', 'who', 'whose', 'where'], '請歸還你上週借的那本書。', '先行詞是物，用 that 或 which。'),
      cz('We hired an assistant ___ speaks three languages.', ['who', 'which', 'whom', 'what'], '我們僱用了一位會說三種語言的助理。', '先行詞是人，當主詞用 who。'),
      cz('The laptop, ___ I bought last year, is already broken.', ['which', 'that', 'who', 'what'], '我去年買的那台筆電已經壞了。', '逗號後面的補充說明不能用 that，物要用 which。'),
      cz('Customers ___ order before noon will receive their items the same day.', ['who', 'which', 'whose', 'whom'], '中午前下單的顧客當天就能收到商品。', '先行詞 customers 是人，當主詞用 who。'),
    ],
  },
  {
    title: 'whose・where・when・what',
    notes: [
      note(
        '其他關係詞',
        [
          'whose ＋ 名詞：表示所有關係（…的）。',
          'where 修飾地點、when 修飾時間，後面接完整的句子。',
          'what＝the thing(s) that，前面沒有先行詞。',
          '多益常考：空格後面句子完整 → where / when；缺主詞或受詞 → who / which / that。',
        ],
        ['This is the hotel where we stayed last year.|這是我們去年住的飯店。', 'I know a man whose son works at the bank.|我認識一位兒子在銀行工作的男士。'],
      ),
    ],
    items: [
      cz('We met a designer ___ work has won many awards.', ['whose', 'who', 'which', 'what'], '我們見到一位作品得過很多獎的設計師。', '空格後面接名詞 work，表示「他的作品」，用 whose。'),
      cz('This is the restaurant ___ we had our team dinner.', ['where', 'which', 'what', 'whose'], '這是我們辦團隊聚餐的那家餐廳。', 'we had our team dinner 是完整的句子，先行詞是地點，用 where。'),
      cz('Friday is the day ___ the new system will start.', ['when', 'where', 'which', 'what'], '星期五是新系統啟用的日子。', '先行詞是時間，後面句子完整，用 when。'),
      cz('___ the customer wants is a quick reply.', ['What', 'That', 'Which', 'Who'], '顧客想要的是快速的回覆。', 'What＝the thing that，前面沒有先行詞。'),
      cz('The city ___ I visited last month was very beautiful.', ['that', 'where', 'what', 'whose'], '我上個月去的那座城市非常漂亮。', '注意：visited 後面缺受詞，要用 that 或 which，不能用 where。'),
    ],
  },
]);

const part6 = grammarUnit('en.green.part6', '🧩', '閱讀：Part 6 段落填空', '轉折語・代名詞・時態', [
  {
    title: '轉折語',
    notes: [
      note(
        'Part 6 段落填空',
        [
          'Part 6 是一篇短文裡有四個空格，要看前後文才能選；其中一題是選「放進空格的句子」。',
          '轉折語：However（然而）、Therefore（因此）、In addition（此外）、For example（例如）、As a result（結果）、Otherwise（否則）、Meanwhile（同時）。',
          '轉折語前面通常是句號、後面加逗號；Because、Although 是連接詞，要連接兩個子句。',
        ],
        ['The store will be closed on Monday. However, online orders will be processed as usual.|本店週一公休。不過網路訂單會照常處理。'],
      ),
    ],
    items: [
      cz('Our office will be closed next Monday for a national holiday. ___, customers can still place orders online.', ['However', 'Therefore', 'For example', 'As a result'], '本公司下週一因國定假日休息。不過顧客仍然可以在網路上下單。', '前後意思相反（休息 ↔ 仍可下單），用 However。'),
      cz('Many customers said our website was hard to use. ___, we have redesigned it.', ['Therefore', 'However', 'Otherwise', 'For example'], '很多顧客說我們的網站很難用，因此我們重新設計了網站。', '前面是原因、後面是結果，用 Therefore。'),
      cz('The hotel offers free Wi-Fi in every room. ___, guests can use the fitness center at no charge.', ['In addition', 'However', 'Instead', 'Otherwise'], '飯店每間客房都有免費無線網路。此外，房客還可以免費使用健身房。', '再補充一項優點，用 In addition。'),
      cz('Please submit your expense report by Friday. ___, your payment may be delayed.', ['Otherwise', 'Therefore', 'In addition', 'For example'], '請在星期五前提交費用報告，否則款項可能會延遲撥付。', '「不這樣做的話」用 Otherwise。'),
      cz('We offer many ways to pay. ___, you can use a credit card, a bank transfer, or a mobile app.', ['For example', 'However', 'Otherwise', 'As a result'], '我們提供多種付款方式，例如信用卡、銀行轉帳或手機應用程式。', '後面列舉具體的例子，用 For example。'),
    ],
  },
  {
    title: '看上下文選詞與時態',
    notes: [
      note(
        '看上下文判斷',
        [
          '代名詞要對得上：前面提到 the employees，後面就用 they / their。',
          '時態：文章說「下個月將會…」用 will；說「上週已經…」用過去式；Since then 用現在完成式。',
          '單字題：同一篇文章的關鍵字常常換個說法再出現一次。',
        ],
        ['The new cafeteria opened last week. It has already become popular with employees.|新的員工餐廳上週開幕，已經很受員工歡迎。'],
      ),
    ],
    items: [
      cz('The new cafeteria opened last week. Since then, it ___ very popular with employees.', ['has become', 'will become', 'becomes', 'became'], '新的員工餐廳上週開幕，從那之後就很受員工歡迎。', 'Since then 表示從過去持續到現在，用現在完成式。'),
      cz('All staff members must attend the safety training next Tuesday. ___ will receive a certificate after the session.', ['They', 'It', 'He', 'We'], '所有員工都必須參加下週二的安全訓練，結束後他們會拿到證書。', '代名詞指前面的 All staff members（複數的人），用 They。'),
      cz('Thank you for your application. We will review it and ___ you within two weeks.', ['contact', 'contacted', 'contacting', 'to contact'], '感謝您的申請。我們會審核並在兩週內與您聯絡。', 'will review and contact：and 連接兩個原形動詞。'),
      cz("Due to heavy snow, tomorrow's flight to Seoul has been ___. Passengers will receive a full refund.", ['canceled', 'delayed', 'booked', 'boarded'], '因為大雪，明天飛往首爾的班機已經取消，旅客會拿到全額退款。', '後面說「全額退款」，代表班機取消了，不是延誤。'),
      cz('Our new branch in Kaohsiung will open on June 1. To celebrate the ___, all customers will receive a free gift.', ['opening', 'closing', 'meeting', 'interview'], '我們高雄的新分店將在六月一日開幕。為了慶祝開幕，所有顧客都會拿到贈品。', '前一句說新分店開幕，所以慶祝的是 opening。'),
    ],
  },
]);

export const GREEN_UNITS: Unit[] = [letter, hr, g1, market, part3, finance, g2, part6];
