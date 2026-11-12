// 英文情境路線：海外生活。
// 每個單元分成幾個小情境，每課先看說明卡（什麼時候這樣說、語氣與文化），再練關鍵片語和整句（標出是誰說的），
// 最後是情境應答題：聽對方說的話，選出合適的回答（也是多益 Part 2 的練習）。
import type { GrammarNote, Item, Unit } from '../core/types';
import { cz, drillUnit, en, note, qa, sceneUnit, ss, type GrammarPart } from './dsl';

const tip = (title: string, body: string[], ex: string[] = []): GrammarNote => note(title, body, ex);
const part = (title: string, n: GrammarNote, items: Item[]): GrammarPart => ({ title, notes: [n], items });
const answer = (items: Item[]): GrammarPart => ({ title: '情境應答', items });

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
