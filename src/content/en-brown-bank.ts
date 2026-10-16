// 英文棕色證書單字庫：辦公室日常、電話與會議、旅行與生活情境，以及多益最常出現的基礎動詞、形容詞、副詞。
import type { Unit } from '../core/types';
import { deck, enList } from './dsl';

const OFFICE = '辦公室與聯絡';
const LIFE = '旅行與生活';
const CORE = '多益基礎字';

export const BROWN_BANK: Unit[] = [
  deck('en.brown.bank.equipment', '🖨️', '辦公設備與文具', OFFICE, enList(`
    projector|n.|投影機|The projector isn't working.|投影機壞了。
    screen|n.|螢幕；銀幕|Look at the screen, please.|請看螢幕。
    monitor|n.|螢幕；監視器|I need a bigger monitor.|我需要更大的螢幕。
    keyboard|n.|鍵盤|The keyboard is missing some keys.|鍵盤少了幾個鍵。
    laptop|n.|筆記型電腦|She works on her laptop in the cafe.|她在咖啡館用筆電工作。
    cabinet|n.|櫃子；檔案櫃|The files are in the cabinet.|檔案在櫃子裡。
    drawer|n.|抽屜|The scissors are in the top drawer.|剪刀在最上面的抽屜裡。
    folder|n.|資料夾|Put the documents in a folder.|把文件放進資料夾。
    file|n./v.|檔案；歸檔|Please file these papers.|請把這些文件歸檔。
    binder|n.|活頁夾|The reports are in the blue binder.|報告在藍色活頁夾裡。
    stapler|n.|釘書機|Can I borrow your stapler?|可以借我你的釘書機嗎？
    paper clip|n.|迴紋針|Hold the pages together with a paper clip.|用迴紋針把這幾頁夾在一起。
    label|n.|標籤|Put a label on each box.|在每個箱子上貼標籤。
    whiteboard|n.|白板|She wrote the plan on the whiteboard.|她把計畫寫在白板上。
    marker|n.|麥克筆|This marker is dry.|這支麥克筆沒水了。
    cord|n.|電線|The cord isn't long enough.|電線不夠長。
    outlet|n.|插座；暢貨中心|Is there an outlet near the desk?|書桌附近有插座嗎？
    ink|n.|墨水|The printer is out of ink.|印表機沒墨水了。
    cartridge|n.|墨水匣|We need a new ink cartridge.|我們需要新的墨水匣。
    office supplies|n.|辦公用品|Office supplies are in the storage room.|辦公用品在儲藏室裡。
    headset|n.|耳機麥克風|Put on your headset before the call.|通話前請戴上耳機麥克風。
    badge|n.|識別證|Visitors must wear a badge.|訪客必須配戴識別證。
    workstation|n.|工作站；座位|Each employee has a workstation.|每位員工都有自己的工作座位。
    bulletin board|n.|公告欄|The schedule is posted on the bulletin board.|行程表貼在公告欄上。
    photocopier|n.|影印機|The photocopier on the third floor is jammed.|三樓的影印機卡紙了。
  `)),
  deck('en.brown.bank.actions', '🧹', '辦公室動作（Part 1 常考）', OFFICE, enList(`
    type|v.|打字|She is typing an email.|她正在打電子郵件。
    print|v.|列印|Please print two copies.|請印兩份。
    scan|v.|掃描|Scan the document and send it to me.|把文件掃描後寄給我。
    sign|v.|簽名|Please sign here.|請在這裡簽名。
    sort|v.|分類；整理|He is sorting the mail.|他正在分類郵件。
    stack|v./n.|堆疊；一疊|The boxes are stacked against the wall.|箱子靠牆堆著。
    arrange|v.|排列；安排|Chairs have been arranged in a circle.|椅子排成了一圈。
    organize|v.|整理；籌辦|She is organizing the files.|她正在整理檔案。
    hang|v.|懸掛|A picture is hanging on the wall.|牆上掛著一幅畫。
    lean against|v.|靠在…上|Don't lean against the glass door.|不要靠在玻璃門上。
    point at|v.|指著|Please don't point at people.|請不要用手指著別人。
    hand out|v.|分發|Please hand out these flyers.|請把這些傳單發出去。
    pick up|v.|拿起；接（人）；領取|I'll pick up the package after work.|我下班後去領包裹。
    put away|v.|收好|Please put away your phones.|請把手機收起來。
    set up|v.|架設；設立|Can you set up the projector?|你可以架設投影機嗎？
    fill out|v.|填寫|Please fill out this form.|請填寫這張表格。
    plug in|v.|插上電源|Plug in the laptop before the meeting.|開會前先把筆電插上電。
    turn on|v.|打開（電源）|Turn on the lights, please.|請開燈。
    turn off|v.|關掉（電源）|Please turn off the air conditioner.|請關掉冷氣。
    wipe|v.|擦拭|He is wiping the table.|他正在擦桌子。
    sweep|v.|掃（地）|A woman is sweeping the floor.|一名女子正在掃地。
    mop|v.|拖（地）|The floor was mopped this morning.|地板今天早上拖過了。
    load|v.|裝載|Workers are loading boxes onto a truck.|工人正把箱子裝上卡車。
    unload|v.|卸貨|They are unloading the truck.|他們正在卸貨。
    lift|v.|舉起|He is lifting a heavy box.|他正舉起一個重箱子。
  `)),
  deck('en.brown.bank.phone', '📞', '電話與聯絡', OFFICE, enList(`
    dial|v.|撥（號）|Dial nine for an outside line.|撥九可以打外線。
    operator|n.|接線生；操作員|Please hold. The operator will be with you shortly.|請稍候，接線生馬上為您服務。
    caller|n.|來電者|The caller didn't leave a name.|來電者沒有留下名字。
    text|v./n.|傳訊息；簡訊|I'll text you when I arrive.|我到的時候傳訊息給你。
    contact|v./n.|聯絡；聯絡人|Please contact me by email.|請用電子郵件聯絡我。
    phone number|n.|電話號碼|Can I have your phone number?|可以給我你的電話號碼嗎？
    put through|v.|（電話）轉接|Your call will be put through to the sales department.|您的電話將轉接到業務部。
    speak up|v.|說大聲點|Could you speak up, please?|可以請您大聲一點嗎？
    get back to|v.|回覆（某人）|I'll get back to you tomorrow.|我明天回覆你。
    in charge of|phr.|負責|Who is in charge of this project?|誰負責這個專案？
    missed call|n.|未接來電|I have three missed calls from my boss.|我有三通老闆的未接來電。
    reach out|v.|聯繫|Feel free to reach out if you have questions.|有問題歡迎隨時聯繫。
    follow up|v.|後續追蹤|I'll follow up with an email.|我會再寄郵件追蹤後續。
    in person|phr.|親自|Please apply in person.|請親自來應徵。
    let me know|phr.|告訴我；通知我|Let me know if you need help.|需要幫忙的話告訴我。
    on the phone|phr.|在講電話|She is on the phone right now.|她現在正在講電話。
    cell phone|n.|手機|Please turn off your cell phone.|請關掉手機。
    landline|n.|市內電話|We still have a landline at home.|我們家還有市話。
    area code|n.|區域碼|What is the area code for Taichung?|台中的區碼是多少？
    directory|n.|通訊錄；名錄|You can find his number in the company directory.|你可以在公司通訊錄找到他的號碼。
    receiver|n.|聽筒；收件者|He picked up the receiver.|他拿起了聽筒。
    respond|v.|回應|Please respond by Friday.|請在星期五前回覆。
    response|n.|回應；回覆|We received a quick response.|我們很快就收到回覆。
    notice|n./v.|通知；注意到|Did you notice the change?|你有注意到這個變化嗎？
    memo|n.|備忘錄|The manager sent a memo to all staff.|經理發了一份備忘錄給全體員工。
  `)),
  deck('en.brown.bank.meeting', '🗣️', '會議與簡報', OFFICE, enList(`
    discuss|v.|討論|Let's discuss this at the meeting.|我們在會議上討論這件事吧。
    discussion|n.|討論|We had a long discussion about the budget.|我們針對預算討論了很久。
    suggest|v.|建議|I suggest that we start early.|我建議我們早點開始。
    suggestion|n.|建議|Do you have any suggestions?|你有什麼建議嗎？
    opinion|n.|意見|What's your opinion?|你的意見是什麼？
    idea|n.|點子；想法|That's a great idea.|那是個好點子。
    topic|n.|主題|The main topic is next year's budget.|主要議題是明年的預算。
    point|n.|重點；論點|That's a good point.|說得好。
    slide|n.|投影片|Please go back to the previous slide.|請回到上一張投影片。
    chart|n.|圖表|This chart shows our sales.|這張圖表顯示我們的業績。
    graph|n.|圖表；曲線圖|The graph shows a steady increase.|這張圖顯示穩定成長。
    handout|n.|講義|Please take a handout.|請拿一份講義。
    host|v./n.|主辦；主持人|Our company will host the event.|我們公司將主辦這場活動。
    lead|v.|帶領；主持|Ms. Chen will lead the meeting.|陳小姐將主持會議。
    introduce|v.|介紹|Let me introduce our new manager.|讓我介紹我們的新經理。
    summarize|v.|總結|Let me summarize the main points.|讓我總結一下重點。
    explain|v.|解釋|Could you explain that again?|可以再解釋一次嗎？
    decide|v.|決定|We need to decide by Friday.|我們必須在星期五前決定。
    decision|n.|決定|The final decision is up to the director.|最後的決定權在主任。
    vote|v./n.|投票|Let's vote on it.|我們來投票表決吧。
    agree|v.|同意|I agree with you.|我同意你的看法。
    disagree|v.|不同意|I'm afraid I disagree.|恐怕我不同意。
    conference room|n.|會議室|The meeting is in conference room B.|會議在 B 會議室。
    conference call|n.|電話會議|We have a conference call with Tokyo at ten.|我們十點要和東京開電話會議。
    take notes|v.|做筆記|Could you take notes during the meeting?|開會時你可以做筆記嗎？
  `)),
  deck('en.brown.bank.time', '📅', '行程與時間管理', OFFICE, enList(`
    plan|n./v.|計畫|What are your plans for the weekend?|你週末有什麼計畫？
    on time|phr.|準時|The train arrived on time.|火車準時到達。
    in time|phr.|及時|We arrived just in time.|我們剛好及時趕到。
    ahead of schedule|phr.|進度超前|The project is ahead of schedule.|專案進度超前。
    behind schedule|phr.|進度落後|We are two weeks behind schedule.|我們進度落後兩週。
    as soon as possible|phr.|盡快|Please reply as soon as possible.|請盡快回覆。
    in advance|phr.|事先|Please book your tickets in advance.|請事先訂票。
    by the end of|phr.|在…結束前|Finish the report by the end of the week.|在本週結束前完成報告。
    weekday|n.|平日|The office is open on weekdays.|辦公室平日開放。
    business hours|n.|營業時間|Our business hours are nine to six.|我們的營業時間是九點到六點。
    period|n.|期間|The sale period ends on Sunday.|特賣期間到星期日為止。
    duration|n.|持續時間|The duration of the course is six weeks.|課程為期六週。
    remind|v.|提醒|Please remind me about the meeting.|請提醒我開會的事。
    reminder|n.|提醒（通知）|I set a reminder on my phone.|我在手機上設了提醒。
    check|v.|確認；檢查|Let me check my calendar.|讓我查一下行事曆。
    fit in|v.|擠出時間（安排）|Can you fit in a meeting on Friday?|你星期五能擠出時間開會嗎？
    free time|n.|空閒時間|What do you do in your free time?|你空閒時間做什麼？
    spend|v.|花（時間、錢）|I spend an hour on the train every day.|我每天在火車上花一個小時。
    last|v.|持續|The meeting will last about an hour.|會議大約持續一小時。
    until|prep.|直到|The store is open until nine.|這家店營業到九點。
    during|prep.|在…期間|Please turn off your phone during the movie.|看電影時請關掉手機。
    within|prep.|在…之內|Please reply within three days.|請在三天內回覆。
    since|prep./conj.|自從|I have worked here since 2020.|我從 2020 年起就在這裡工作。
    recently|adv.|最近|I recently moved to Taipei.|我最近搬到台北。
    currently|adv.|目前|She is currently on vacation.|她目前在休假。
  `)),
  deck('en.brown.bank.flight', '✈️', '機場與搭機', LIFE, enList(`
    airline|n.|航空公司|Which airline are you flying with?|你搭哪家航空？
    baggage|n.|行李|How many pieces of baggage do you have?|您有幾件行李？
    window seat|n.|靠窗座位|I'd like a window seat, please.|我想要靠窗的座位。
    security check|n.|安全檢查|Please arrive early for the security check.|請提早到以通過安檢。
    immigration|n.|入境審查|We waited in line at immigration.|我們在入境審查處排隊。
    arrival|n.|抵達；入境|The arrival time is three thirty.|抵達時間是三點半。
    take off|v.|起飛|The plane will take off in ten minutes.|飛機將在十分鐘後起飛。
    land|v.|降落|We landed in Tokyo at noon.|我們中午降落東京。
    connecting flight|n.|轉機航班|I have a connecting flight in Hong Kong.|我在香港要轉機。
    layover|n.|轉機停留|We have a three hour layover in Seoul.|我們在首爾轉機停留三小時。
    direct flight|n.|直飛航班|Is there a direct flight to Paris?|有直飛巴黎的航班嗎？
    round trip|n.|來回|A round trip ticket is cheaper.|來回票比較便宜。
    one way|n.|單程|I'd like a one way ticket to Osaka.|我要一張到大阪的單程票。
    destination|n.|目的地|What is your final destination?|您的最終目的地是哪裡？
    travel agency|n.|旅行社|I booked the trip through a travel agency.|我透過旅行社訂了這趟旅行。
    tourist|n.|觀光客|The city is full of tourists in summer.|夏天城裡滿是觀光客。
    sightseeing|n.|觀光|We went sightseeing in Kyoto.|我們在京都觀光。
    souvenir|n.|紀念品|I bought souvenirs for my coworkers.|我買了紀念品給同事。
    overhead bin|n.|頭頂置物櫃|Please put your bag in the overhead bin.|請把包包放在頭頂置物櫃。
    seat belt|n.|安全帶|Please fasten your seat belt.|請繫好安全帶。
    flight attendant|n.|空服員|The flight attendant brought us some water.|空服員給我們拿了些水。
    pilot|n.|機長；飛行員|The pilot announced that we will land soon.|機長廣播說我們即將降落。
    terminal|n.|航廈|Our flight leaves from Terminal 2.|我們的班機從第二航廈出發。
    boarding|n.|登機|Boarding will begin at gate 12.|將在 12 號登機門開始登機。
    cancellation|n.|取消|There was a cancellation due to the storm.|因為暴風雨，有班次取消。
  `)),
  deck('en.brown.bank.hotel', '🏨', '飯店與住宿', LIFE, enList(`
    single room|n.|單人房|I'd like to book a single room.|我想訂一間單人房。
    double room|n.|雙人房|A double room costs one hundred dollars a night.|雙人房一晚一百美元。
    vacancy|n.|空房；職缺|Do you have any vacancies tonight?|今晚還有空房嗎？
    fully booked|phr.|客滿|I'm sorry, we are fully booked.|抱歉，我們已經客滿了。
    lobby|n.|大廳|Let's meet in the lobby.|我們在大廳碰面吧。
    elevator|n.|電梯|Take the elevator to the tenth floor.|搭電梯到十樓。
    key card|n.|房卡|My key card doesn't work.|我的房卡不能用。
    wake up call|n.|晨喚服務|Can I have a wake up call at six?|可以六點打電話叫我起床嗎？
    housekeeping|n.|房務部|Housekeeping will clean your room soon.|房務人員很快會來打掃您的房間。
    laundry|n.|洗衣服務；待洗衣物|Is there a laundry service?|有洗衣服務嗎？
    view|n.|景觀|The room has a great view of the sea.|這個房間的海景很棒。
    pool|n.|游泳池|The pool is on the roof.|游泳池在頂樓。
    gym|n.|健身房|The hotel has a gym and a pool.|飯店有健身房和游泳池。
    air conditioner|n.|冷氣|The air conditioner in my room is too loud.|我房間的冷氣太吵了。
    heater|n.|暖氣機|Can you turn on the heater?|你可以開暖氣嗎？
    blanket|n.|毯子|Could I have an extra blanket?|可以多給我一條毯子嗎？
    pillow|n.|枕頭|This pillow is too hard.|這個枕頭太硬了。
    stay|v./n.|住宿；停留|How long will you stay?|您要住多久？
    guest room|n.|客房|All guest rooms have free Wi-Fi.|所有客房都有免費無線網路。
    rate|n.|價格；費率|What is the rate for one night?|一晚的價錢是多少？
    include|v.|包含|Breakfast is included in the price.|價格包含早餐。
    extra|adj.|額外的|There is an extra charge for parking.|停車要額外收費。
    charge|n./v.|費用；收費|Is there a charge for Wi-Fi?|無線網路要收費嗎？
    porter|n.|行李員|The porter will take your bags to your room.|行李員會把您的行李送到房間。
    inn|n.|小旅館|We stayed at a small inn by the lake.|我們住在湖邊的一間小旅館。
  `)),
  deck('en.brown.bank.dining', '🍽️', '餐廳與聚餐', LIFE, enList(`
    reserve|v.|預訂|I'd like to reserve a table for six.|我想訂一張六人桌。
    main course|n.|主菜|What would you like for your main course?|您的主菜要點什麼？
    side dish|n.|配菜|The steak comes with two side dishes.|牛排附兩道配菜。
    dish|n.|菜餚；盤子|This is our most popular dish.|這是我們最受歡迎的菜。
    portion|n.|份量|The portions here are very large.|這裡的份量很大。
    vegetarian|n./adj.|素食者；素食的|Do you have any vegetarian dishes?|你們有素食料理嗎？
    allergy|n.|過敏|I have a peanut allergy.|我對花生過敏。
    napkin|n.|餐巾|Could I have another napkin?|可以再給我一張餐巾嗎？
    tray|n.|托盤|The waiter carried a tray of drinks.|服務生端著一盤飲料。
    buffet|n.|自助餐|Breakfast is a buffet.|早餐是自助式的。
    catering|n.|外燴|We ordered catering for the party.|我們為派對訂了外燴。
    banquet|n.|宴會|The company holds a banquet every December.|公司每年十二月舉辦宴會。
    toast|n./v.|敬酒；吐司|Let's make a toast to the new team.|讓我們為新團隊乾杯。
    treat|v./n.|請客|Lunch is my treat today.|今天午餐我請客。
    split|v.|分攤|Let's split the bill.|我們分攤帳單吧。
    separate|adj./v.|分開的|Can we have separate checks?|可以分開結帳嗎？
    takeout|n.|外帶|Let's get takeout tonight.|今晚叫外帶吧。
    delivery|n.|外送；配送|Do you offer delivery?|你們有外送嗎？
    leftovers|n.|剩菜|Can I take the leftovers home?|剩菜可以打包回家嗎？
    specialty|n.|招牌菜；專長|Seafood is the specialty of this restaurant.|海鮮是這家餐廳的招牌。
    flavor|n.|口味|What flavor of ice cream do you want?|你要什麼口味的冰淇淋？
    cafeteria|n.|自助餐廳；員工餐廳|The cafeteria is on the first floor.|員工餐廳在一樓。
    bakery|n.|麵包店|The bakery opens at seven.|麵包店七點開門。
    grill|n./v.|烤架；燒烤|We grilled fish in the garden.|我們在花園烤魚。
    waitress|n.|女服務生|The waitress took our order.|女服務生幫我們點餐。
  `)),
  deck('en.brown.bank.shopping', '🛍️', '購物與付款', LIFE, enList(`
    credit card|n.|信用卡|Do you take credit cards?|你們收信用卡嗎？
    coin|n.|硬幣|I need coins for the machine.|我需要硬幣投機器。
    price tag|n.|價格標籤|There is no price tag on this shirt.|這件襯衫沒有價格標籤。
    cost|v./n.|花費；成本|How much does it cost?|這要多少錢？
    sale|n.|特賣；銷售|The summer sale starts tomorrow.|夏季特賣明天開始。
    bargain|n.|便宜貨|This jacket was a real bargain.|這件夾克真是撿到便宜。
    try on|v.|試穿|Can I try on this jacket?|可以試穿這件夾克嗎？
    fitting room|n.|試衣間|The fitting room is over there.|試衣間在那邊。
    exchange|v./n.|交換；換貨|Can I exchange this for a larger size?|這個可以換大一號嗎？
    item|n.|品項；商品|This item is very popular.|這項商品很受歡迎。
    out of stock|phr.|缺貨|Sorry, that size is out of stock.|抱歉，那個尺寸缺貨了。
    display|v./n.|陳列|The new phones are displayed near the entrance.|新手機陳列在入口附近。
    basket|n.|籃子|Please use a basket.|請使用購物籃。
    total|n.|總計|The total comes to forty dollars.|總共四十美元。
    tax|n.|稅|Does the price include tax?|價格含稅嗎？
    installment|n.|分期付款|You can pay in installments.|您可以分期付款。
    gift card|n.|禮物卡|I bought a gift card for my friend.|我買了一張禮物卡送朋友。
    online shopping|n.|網路購物|Online shopping is convenient.|網路購物很方便。
    shop around|v.|貨比三家|It's better to shop around before you buy.|買之前最好貨比三家。
    purchase|v./n.|購買|You can purchase tickets online.|你可以在網路上購買門票。
    wrap|v.|包裝|Could you wrap it as a gift?|可以幫我包成禮物嗎？
    clerk|n.|店員|The clerk helped me find my size.|店員幫我找到我的尺寸。
    free of charge|phr.|免費|Delivery is free of charge.|運送免費。
    customer service|n.|客服|Please call customer service.|請打電話給客服。
    membership|n.|會員資格|Membership is free.|會員資格是免費的。
  `)),
  deck('en.brown.bank.housing', '🔧', '租屋與修繕', LIFE, enList(`
    rent|n./v.|租金；租|How much is the rent?|房租多少？
    landlord|n.|房東|The landlord fixed the heater.|房東修好了暖氣。
    tenant|n.|房客|Tenants must pay rent by the fifth.|房客必須在五號前繳房租。
    lease|n.|租約|I signed a one year lease.|我簽了一年的租約。
    move in|v.|搬入|We move in next Monday.|我們下週一搬進去。
    move out|v.|搬出|When do you plan to move out?|你打算什麼時候搬走？
    utilities|n.|水電瓦斯費|The rent includes utilities.|房租包含水電費。
    repair|v./n.|修理|The repair will take two days.|修理需要兩天。
    fix|v.|修理|Can you fix my bike?|你能修我的腳踏車嗎？
    plumber|n.|水電工|We called a plumber to fix the sink.|我們找了水電工來修水槽。
    leak|v./n.|漏水|The roof is leaking.|屋頂在漏水。
    broken|adj.|壞掉的|The washing machine is broken.|洗衣機壞了。
    maintenance|n.|維護；保養|The elevator is under maintenance.|電梯正在保養。
    renovate|v.|翻修|They are renovating the kitchen.|他們正在翻修廚房。
    paint|v./n.|油漆；粉刷|We painted the walls white.|我們把牆壁漆成白色。
    ladder|n.|梯子|He is standing on a ladder.|他站在梯子上。
    tool|n.|工具|I need the right tools for the job.|我需要合適的工具。
    sink|n.|水槽|The sink is full of dishes.|水槽裡堆滿了碗盤。
    washing machine|n.|洗衣機|The washing machine is in the basement.|洗衣機在地下室。
    basement|n.|地下室|We keep old furniture in the basement.|我們把舊家具放在地下室。
    real estate|n.|不動產|She works in real estate.|她從事房地產業。
    agent|n.|代理人；仲介|The agent showed us three apartments.|仲介帶我們看了三間公寓。
    furnished|adj.|附家具的|The apartment is fully furnished.|這間公寓附全套家具。
    spacious|adj.|寬敞的|The living room is bright and spacious.|客廳明亮又寬敞。
    electricity|n.|電力|The electricity went out last night.|昨晚停電了。
  `)),
  deck('en.brown.bank.health', '💊', '醫療與健康', LIFE, enList(`
    clinic|n.|診所|The clinic opens at nine.|診所九點開門。
    patient|n.|病人|The doctor is with a patient now.|醫生正在看病人。
    checkup|n.|健康檢查|I have my annual checkup next week.|我下週要做年度健康檢查。
    injury|n.|受傷|He has a knee injury.|他膝蓋受傷了。
    hurt|v.|受傷；疼痛|Did you hurt yourself?|你受傷了嗎？
    treatment|n.|治療|The treatment takes about a month.|治療大約需要一個月。
    surgery|n.|手術|She had surgery on her knee.|她膝蓋動了手術。
    allergic|adj.|過敏的|I'm allergic to cats.|我對貓過敏。
    flu|n.|流感|I think I have the flu.|我好像得了流感。
    ambulance|n.|救護車|Call an ambulance!|叫救護車！
    emergency room|n.|急診室|He was taken to the emergency room.|他被送到急診室。
    insurance|n.|保險|Does your insurance cover this?|你的保險有給付這個嗎？
    health insurance|n.|健康保險|The company provides health insurance.|公司提供健康保險。
    pill|n.|藥丸|Take one pill twice a day.|一天兩次，每次一顆。
    dose|n.|劑量|Do not take more than the recommended dose.|服用量請勿超過建議劑量。
    bandage|n.|繃帶|The nurse put a bandage on my arm.|護理師幫我的手臂包上繃帶。
    diet|n.|飲食；節食|A healthy diet is important.|健康的飲食很重要。
    weight|n.|體重；重量|I want to lose weight.|我想減重。
    stress|n.|壓力|Exercise helps reduce stress.|運動有助於減輕壓力。
    relax|v.|放鬆|Try to relax and take a deep breath.|試著放鬆，深呼吸。
    sleep|v./n.|睡覺；睡眠|I couldn't sleep last night.|我昨晚睡不著。
    tired|adj.|疲累的|You look tired.|你看起來很累。
    dizzy|adj.|頭暈的|I feel dizzy.|我覺得頭暈。
    fitness|n.|健身；體能|She goes to a fitness class twice a week.|她一週上兩次健身課。
    vitamin|n.|維他命|I take vitamins every morning.|我每天早上吃維他命。
  `)),
  deck('en.brown.bank.leisure', '🎭', '休閒與娛樂', LIFE, enList(`
    hobby|n.|嗜好|My hobby is taking photos.|我的嗜好是拍照。
    movie|n.|電影|Let's see a movie tonight.|今晚去看電影吧。
    concert|n.|音樂會；演唱會|We went to a concert last night.|我們昨晚去聽了演唱會。
    festival|n.|節慶；藝術節|The music festival is held every summer.|音樂節每年夏天舉辦。
    performance|n.|表演；表現|The performance starts at eight.|表演八點開始。
    audience|n.|觀眾|The audience loved the show.|觀眾很喜歡這場表演。
    admission|n.|入場（費）|Admission is free for children.|兒童免費入場。
    gallery|n.|美術館；畫廊|The gallery has a new exhibition.|美術館有新的展覽。
    tour|n./v.|導覽；旅遊|We took a tour of the factory.|我們參觀了工廠。
    guide|n.|導遊；指南|Our guide spoke very good English.|我們的導遊英文說得很好。
    hiking|n.|健行|We went hiking in the mountains.|我們去山上健行。
    camping|n.|露營|Camping is popular in summer.|露營在夏天很受歡迎。
    fishing|n.|釣魚|My father goes fishing on weekends.|我爸週末去釣魚。
    swimming|n.|游泳|Swimming is good exercise.|游泳是很好的運動。
    jogging|n.|慢跑|I go jogging every morning.|我每天早上去慢跑。
    team|n.|隊伍；團隊|Which team do you support?|你支持哪一隊？
    match|n.|比賽|The match was canceled because of rain.|比賽因雨取消了。
    game|n.|比賽；遊戲|Did you watch the game last night?|你昨晚有看比賽嗎？
    win|v.|贏|I hope our team wins the game.|希望我們隊贏得比賽。
    lose|v.|輸；遺失|They lost the final match.|他們輸了決賽。
    musician|n.|音樂家|The musician played the piano beautifully.|那位音樂家的鋼琴彈得很美。
    painting|n.|畫作|This painting is very famous.|這幅畫非常有名。
    photograph|n.|照片|Photographs are not allowed in the museum.|博物館內禁止拍照。
    magazine|n.|雜誌|I read a magazine on the train.|我在火車上看雜誌。
    novel|n.|小說|She is reading a mystery novel.|她正在讀一本推理小說。
  `)),
  deck('en.brown.bank.bank', '🏦', '銀行與郵局', LIFE, enList(`
    bank account|n.|銀行帳戶|I'd like to open a bank account.|我想開一個銀行帳戶。
    savings|n.|存款|I keep my savings in the bank.|我把存款放在銀行。
    interest|n.|利息；興趣|The bank pays two percent interest.|銀行支付百分之二的利息。
    teller|n.|銀行櫃員|The teller helped me open an account.|櫃員幫我開了帳戶。
    cash machine|n.|提款機|Is there a cash machine near here?|這附近有提款機嗎？
    currency|n.|貨幣|You can exchange currency at the airport.|你可以在機場換外幣。
    statement|n.|對帳單；聲明|I check my bank statement every month.|我每個月都會檢查銀行對帳單。
    password|n.|密碼|Don't share your password.|不要把密碼告訴別人。
    mail|n./v.|郵件；寄|I'll mail the letter today.|我今天會把信寄出去。
    letter|n.|信|I received a letter from my aunt.|我收到了阿姨的來信。
    postcard|n.|明信片|I sent a postcard from Paris.|我從巴黎寄了一張明信片。
    parcel|n.|包裹|This parcel is for you.|這個包裹是給你的。
    postage|n.|郵資|How much is the postage?|郵資多少？
    mailbox|n.|信箱|There is a letter in the mailbox.|信箱裡有一封信。
    courier|n.|快遞公司；快遞員|The documents were sent by courier.|文件以快遞寄出。
    weigh|v.|秤重|Please weigh this package.|請把這個包裹秤重。
    fragile|adj.|易碎的|This box is fragile. Handle it with care.|這箱是易碎品，請小心處理。
    form|n.|表格|Please sign the form at the bottom.|請在表格底部簽名。
    identification|n.|身分證明|Please show your identification.|請出示您的身分證明。
    sender|n.|寄件人|Write the sender's address here.|在這裡寫寄件人地址。
    credit|n.|信用；學分|She has good credit.|她的信用很好。
    debt|n.|債務|He paid off all his debt.|他還清了所有債務。
    invest|v.|投資|She invests in stocks.|她投資股票。
    safe|n./adj.|保險箱；安全的|Keep your passport in the safe.|把護照放在保險箱裡。
    overseas|adj./adv.|海外的；在國外|I need to send money overseas.|我需要匯款到國外。
  `)),
  deck('en.brown.bank.verbs', '🏃', '多益常用動詞', CORE, enList(`
    provide|v.|提供|We provide free parking for guests.|我們為客人提供免費停車。
    require|v.|需要；要求|This job requires a driver's license.|這份工作需要駕照。
    offer|v./n.|提供；提議|We offer a discount to students.|我們提供學生折扣。
    prepare|v.|準備|I need to prepare for the meeting.|我需要為會議做準備。
    complete|v.|完成|Please complete the form.|請填完表格。
    increase|v./n.|增加|Sales increased by ten percent.|銷售額增加了百分之十。
    decrease|v./n.|減少|The number of visitors decreased.|訪客人數減少了。
    improve|v.|改善|We need to improve our service.|我們需要改善服務。
    expect|v.|預期|We expect a large crowd tonight.|我們預期今晚會有很多人。
    review|v./n.|審閱；評論|Please review the contract.|請審閱合約。
    announce|v.|宣布|The company announced a new product.|公司宣布了新產品。
    locate|v.|位於；找到|The office is located near the station.|辦公室位於車站附近。
    operate|v.|運作；操作|The store operates seven days a week.|這家店每週營業七天。
    handle|v.|處理|She handles customer complaints.|她負責處理客訴。
    manage|v.|管理；設法做到|He manages a team of ten.|他管理一個十人的團隊。
    assist|v.|協助|Can I assist you with anything?|有什麼我可以協助您的嗎？
    recommend|v.|推薦|Can you recommend a good hotel?|你能推薦一家好飯店嗎？
    consider|v.|考慮|We are considering moving to a larger office.|我們正在考慮搬到更大的辦公室。
    allow|v.|允許|Pets are not allowed in the building.|大樓內不允許攜帶寵物。
    reduce|v.|減少|We need to reduce costs.|我們需要降低成本。
    share|v.|分享；共用|We share an office.|我們共用一間辦公室。
    seem|v.|似乎|He seems busy today.|他今天似乎很忙。
    become|v.|變成|She wants to become a manager.|她想成為經理。
    succeed|v.|成功|She succeeded in passing the exam.|她成功通過了考試。
    remove|v.|移除；脫下|Please remove your shoes.|請脫鞋。
  `)),
  deck('en.brown.bank.adjectives', '🎨', '多益常用形容詞', CORE, enList(`
    convenient|adj.|方便的|The hotel is in a convenient location.|飯店的位置很方便。
    necessary|adj.|必要的|Is it necessary to book in advance?|需要事先預訂嗎？
    possible|adj.|可能的|Is it possible to change my seat?|可以換座位嗎？
    popular|adj.|受歡迎的|This restaurant is very popular.|這家餐廳很受歡迎。
    famous|adj.|有名的|The city is famous for its night markets.|這座城市以夜市聞名。
    local|adj.|當地的|We hired a local guide.|我們請了一位當地導遊。
    public|adj.|公共的；公開的|The library is open to the public.|圖書館對大眾開放。
    private|adj.|私人的|This is a private meeting.|這是私人會議。
    special|adj.|特別的|We have a special offer this week.|我們本週有特別優惠。
    excellent|adj.|優秀的|The food was excellent.|食物非常棒。
    professional|adj.|專業的|She gave a very professional presentation.|她做了一場非常專業的簡報。
    reasonable|adj.|合理的|The prices here are reasonable.|這裡的價格很合理。
    comfortable|adj.|舒適的|These chairs are very comfortable.|這些椅子很舒服。
    modern|adj.|現代的|The office has a modern design.|辦公室是現代化的設計。
    traditional|adj.|傳統的|We had a traditional Japanese meal.|我們吃了一頓傳統日本料理。
    successful|adj.|成功的|The event was very successful.|這次活動非常成功。
    helpful|adj.|有幫助的|The staff were very helpful.|員工非常樂於助人。
    current|adj.|目前的|What is your current address?|你目前的地址是什麼？
    recent|adj.|最近的|Here is our most recent report.|這是我們最新的報告。
    annual|adj.|年度的|The annual meeting is in March.|年度大會在三月。
    monthly|adj.|每月的|We have a monthly sales meeting.|我們每個月有業務會議。
    weekly|adj.|每週的|The weekly report is due on Friday.|週報星期五要交。
    correct|adj.|正確的|Is this information correct?|這個資訊正確嗎？
    wrong|adj.|錯誤的|I think you have the wrong number.|我想你打錯電話了。
    nearby|adj./adv.|附近的|Is there a pharmacy nearby?|附近有藥局嗎？
  `)),
  deck('en.brown.bank.linking', '🔗', '多益常用副詞與連接詞', CORE, enList(`
    however|adv.|然而|The plan is good. However, it's too expensive.|計畫很好，然而太貴了。
    therefore|adv.|因此|He was sick. Therefore, he stayed home.|他生病了，因此待在家。
    also|adv.|也|She also speaks French.|她也會說法語。
    instead|adv.|取而代之|Let's take the train instead.|我們改搭火車吧。
    probably|adv.|可能|He will probably be late.|他可能會遲到。
    especially|adv.|特別；尤其|I love fruit, especially apples.|我愛吃水果，尤其是蘋果。
    almost|adv.|幾乎|The report is almost finished.|報告快完成了。
    nearly|adv.|將近|Nearly fifty people came.|將近五十人來了。
    finally|adv.|最後；終於|We finally finished the project.|我們終於完成了專案。
    immediately|adv.|立刻|Please call me immediately.|請立刻打給我。
    directly|adv.|直接地|Please contact me directly.|請直接聯絡我。
    quickly|adv.|快速地|The problem was quickly solved.|問題很快就解決了。
    carefully|adv.|仔細地|Please read the instructions carefully.|請仔細閱讀說明。
    together|adv.|一起|Let's work together.|我們一起努力吧。
    abroad|adv.|在國外|She studied abroad for a year.|她出國留學了一年。
    anyway|adv.|無論如何；反正|It's raining, but let's go anyway.|下雨了，不過我們還是去吧。
    although|conj.|雖然|Although it was raining, we went out.|雖然在下雨，我們還是出門了。
    because|conj.|因為|I'm late because the bus was late.|我遲到是因為公車誤點。
    unless|conj.|除非|Don't call me unless it's urgent.|除非緊急，否則別打給我。
    while|conj.|當…時；然而|He called while I was out.|我外出時他打來了。
    whether|conj.|是否|I'm not sure whether he will come.|我不確定他會不會來。
    either|adv./conj.|任一；也（否定）|You can pay by cash or card. Either is fine.|您可以付現或刷卡，都可以。
    neither|adv./conj.|兩者都不|Neither of us knows the answer.|我們兩個都不知道答案。
    otherwise|adv.|否則|Hurry up, otherwise we'll miss the train.|快點，不然我們會錯過火車。
    besides|adv.|此外|Besides, the hotel is close to the station.|此外，飯店離車站很近。
  `)),
];
