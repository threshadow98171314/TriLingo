// 英文棕色證書單字庫：辦公室日常、電話與會議、旅行與生活情境，以及多益最常出現的基礎動詞、形容詞、副詞。
import type { Unit } from '../core/types';
import { deck, enList } from './dsl';

const OFFICE = '辦公室與聯絡';
const LIFE = '旅行與生活';
const CORE = '多益基礎字';

const PHOTO = 'Part 1 照片描述';

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
  deck('en.brown.bank.office2', '🗄️', '辦公室裡的東西', OFFICE, enList(`
    staple|n./v.|釘書針；釘起來|Please staple the pages together.|請把這幾頁釘在一起。
    filing cabinet|n.|檔案櫃|The contracts are in the filing cabinet.|合約放在檔案櫃裡。
    copier|n.|影印機|The copier on the third floor is out of order.|三樓的影印機故障了。
    scanner|n.|掃描器|Use the scanner to send the documents by email.|用掃描器把文件掃描後用電子郵件寄出。
    shredder|n.|碎紙機|Put old documents in the shredder.|把舊文件放進碎紙機。
    highlighter|n.|螢光筆|She marked the key points with a highlighter.|她用螢光筆標出重點。
    notepad|n.|便條本|There is a notepad next to the phone.|電話旁有一本便條本。
    sticky note|n.|便利貼|He left a sticky note on my monitor.|他在我的螢幕上留了一張便利貼。
    planner|n.|行事曆本；規劃人員|I write all my meetings in my planner.|我把所有會議都寫在行事曆上。
    cubicle|n.|辦公隔間|My cubicle is next to the window.|我的辦公隔間在窗邊。
    hallway|n.|走廊|The restroom is at the end of the hallway.|洗手間在走廊盡頭。
    corridor|n.|走廊（較長、較正式）|The meeting rooms are along this corridor.|會議室在這條走廊上。
    break room|n.|休息室；茶水間|Coffee is available in the break room.|茶水間有咖啡。
    keycard|n.|門禁卡|You need a keycard to enter the building.|進大樓需要門禁卡。
    notice board|n.|公告欄|The schedule is posted on the notice board.|行程表貼在公告欄上。|※美式也常說 bulletin board。
    cable|n.|電線；纜線|The printer cable is too short.|印表機的線太短了。
    plug|n./v.|插頭；插上|Make sure the plug is in the socket.|確認插頭有插進插座。
    webcam|n.|網路攝影機|Please turn on your webcam for the video call.|視訊會議請打開攝影機。
    inbox|n.|收件匣|I have fifty emails in my inbox.|我的收件匣有五十封信。
  `)),
  deck('en.brown.bank.officeact', '🖱️', '辦公室動作 ②', OFFICE, enList(`
    photocopy|v./n.|影印|Could you photocopy this form for me?|可以幫我影印這張表嗎？
    shred|v.|用碎紙機銷毀|Shred any papers with customer information.|有客戶資料的紙張都要用碎紙機銷毀。
    pile|n./v.|一堆；堆放|There is a pile of letters on her desk.|她桌上有一堆信。
    rearrange|v.|重新安排；重新排列|We rearranged the desks for the workshop.|我們為了研習重新排了桌子。
    tidy|v./adj.|整理；整齊的|Please tidy your desk before you leave.|下班前請整理桌面。
    vacuum|v./n.|用吸塵器吸|The cleaners vacuum the carpet every night.|清潔人員每晚吸地毯。
    take down|v.|拆下；記下|Please take down the old posters.|請把舊海報拆下來。
    unplug|v.|拔掉插頭|Unplug the heater before you go home.|回家前把暖氣的插頭拔掉。
    log out|v.|登出|Always log out of your account on shared computers.|在共用電腦上一定要登出帳號。
    sign in|v.|簽到；登入|Visitors must sign in at the front desk.|訪客必須在櫃台簽到。
    write down|v.|寫下|Let me write down your phone number.|我把你的電話號碼寫下來。
    paste|v.|貼上|Copy the link and paste it into the chat.|複製連結貼到聊天室。
    delete|v.|刪除|I accidentally deleted the file.|我不小心把檔案刪掉了。
  `)),
  deck('en.brown.bank.travel2', '🧳', '旅行與交通 ②', LIFE, enList(`
    visa|n.|簽證|Do I need a visa to visit Japan?|去日本需要簽證嗎？
    baggage claim|n.|行李提領處|Please pick up your bags at baggage claim.|請到行李提領處領取行李。
    carousel|n.|行李轉盤|Your luggage will come out on carousel five.|您的行李會在五號轉盤出來。
    carry on|n.|隨身行李|You can bring one carry on bag.|可以帶一件隨身行李。|※也寫作 carry-on。
    suitcase|n.|行李箱|My suitcase is too heavy.|我的行李箱太重了。
    backpack|n.|背包|He travels with just a backpack.|他只帶一個背包旅行。
    aisle seat|n.|靠走道座位|I'd prefer an aisle seat, please.|我想要靠走道的位子。|※aisle 的 s 不發音。
    cabin crew|n.|機組人員|The cabin crew will serve drinks shortly.|機組人員即將提供飲料。
    booking|n.|預訂|I made a booking for two nights.|我訂了兩晚。
    confirmation|n.|確認；確認信|You will receive a confirmation email.|您會收到一封確認信。
    concierge|n.|禮賓服務員|Ask the concierge to book a taxi.|請禮賓人員幫忙叫計程車。
    suite|n.|套房|The suite has a living room and a bedroom.|套房有客廳和臥室。|※和 sweet 同音。
    minibar|n.|客房小冰箱|Items from the minibar will be charged to your room.|小冰箱的東西會記在房帳上。
    taxi stand|n.|計程車招呼站|The taxi stand is outside the main exit.|計程車招呼站在大門出口外。
    timetable|n.|時刻表|Check the bus timetable before you go.|出門前查一下公車時刻表。
    rush hour|n.|尖峰時段|Avoid driving during rush hour.|盡量避開尖峰時段開車。
    traffic jam|n.|塞車|We were stuck in a traffic jam for an hour.|我們塞車塞了一小時。
    detour|n.|繞道|Because of the construction, we had to take a detour.|因為施工，我們只好繞道。
    toll|n.|通行費|You have to pay a toll on this road.|這條路要付通行費。
    highway|n.|高速公路|Take the highway to save time.|走高速公路比較省時間。
    intersection|n.|十字路口|Turn right at the next intersection.|在下一個路口右轉。
    crosswalk|n.|斑馬線|Always cross the street at the crosswalk.|過馬路一定要走斑馬線。
    sidewalk|n.|人行道|Don't park your bike on the sidewalk.|不要把腳踏車停在人行道上。
  `)),
  deck('en.brown.bank.dining2', '🥗', '餐廳、健康與購物 ②', LIFE, enList(`
    specials|n.|今日特餐|Today's specials are on the board.|今日特餐寫在黑板上。
    entree|n.|主菜（美式）|The entree comes with soup or salad.|主菜附湯或沙拉。|※在英國和法國指前菜，注意差別。
    beverage|n.|飲料（正式）|Beverages are not included in the price.|價格不含飲料。
    gratuity|n.|小費（正式）|A fifteen percent gratuity is added for large groups.|大型團體會加收百分之十五的服務費。
    patio|n.|露台|We had lunch on the patio.|我們在露台吃午餐。
    server|n.|服務生；伺服器|Our server recommended the fish.|服務生推薦了魚。
    hostess|n.|帶位員；女主人|The hostess showed us to our table.|帶位員帶我們到座位。
    dishwasher|n.|洗碗機；洗碗工|Put the plates in the dishwasher.|把盤子放進洗碗機。
    straw|n.|吸管|Many cafes now use paper straws.|很多咖啡店現在改用紙吸管。
    lid|n.|蓋子|Put a lid on the cup.|把杯蓋蓋上。
    serving|n.|一人份|This package contains four servings.|這一包有四人份。
    mild|adj.|溫和的；不辣的|I'll have the mild curry, please.|我要不辣的咖哩。
    frozen|adj.|冷凍的|Frozen vegetables are in aisle six.|冷凍蔬菜在第六走道。
    raw|adj.|生的|Do you eat raw fish?|你吃生魚嗎？
    vegan|adj./n.|純素的；純素者|Do you have any vegan options?|有純素的選擇嗎？
    stomachache|n.|胃痛|I have a stomachache after lunch.|我午餐後胃痛。
    crutches|n.|拐杖|He has to walk on crutches for a month.|他得撐拐杖一個月。
    examination|n.|檢查；考試|The doctor gave me a full examination.|醫生幫我做了完整的檢查。
    ward|n.|病房|She is staying in the children's ward.|她住在兒童病房。
    coverage|n.|保險範圍；報導|Does your insurance coverage include dental care?|你的保險有包含牙科嗎？
    cavity|n.|蛀牙|The dentist found a cavity.|牙醫發現一顆蛀牙。
    shopper|n.|購物者|The mall was full of holiday shoppers.|購物中心擠滿了假日購物人潮。
    cash register|n.|收銀機|Please pay at the cash register.|請到收銀台結帳。
    gift wrap|n./v.|禮品包裝|Would you like it gift wrapped?|需要包裝成禮物嗎？
    boutique|n.|精品店|She owns a small boutique downtown.|她在市中心開了一家小精品店。
    sold out|adj.|售完的|The concert tickets are sold out.|演唱會門票賣完了。
  `)),
  deck('en.brown.bank.weather2', '🌦️', '天氣與環境', LIFE, enList(`
    chilly|adj.|涼颼颼的|It's a bit chilly this morning.|今天早上有點冷。
    drizzle|n./v.|毛毛雨|There will be light drizzle in the afternoon.|下午會有毛毛雨。
    thunderstorm|n.|雷雨|The flight was delayed because of a thunderstorm.|班機因為雷雨延誤了。
    heat wave|n.|熱浪|Stay indoors during the heat wave.|熱浪期間請待在室內。
    foggy|adj.|起霧的|It's too foggy to see the mountains.|霧太大，看不到山。
    shower|n.|陣雨；淋浴|Scattered showers are expected tomorrow.|明天預計有零星陣雨。
    breeze|n.|微風|A cool breeze came from the sea.|一陣涼風從海上吹來。
    freezing|adj.|極冷的|It's freezing outside.|外面冷死了。
    pollution|n.|污染|Air pollution is a serious problem in big cities.|空氣污染是大城市的嚴重問題。
    recycle|v.|回收|Please recycle your plastic bottles.|請回收塑膠瓶。
    recycling|n.|回收|The recycling bins are by the door.|回收桶在門邊。
    energy|n.|能源；精力|We need to save energy at the office.|辦公室要節省能源。
    solar|adj.|太陽的|The building uses solar panels.|這棟大樓使用太陽能板。
    renewable|adj.|可再生的|The company invests in renewable energy.|公司投資再生能源。
    emission|n.|排放（物）|The new cars have lower emissions.|新車的排放量比較低。
    landfill|n.|垃圾掩埋場|Most of this waste ends up in a landfill.|這些垃圾大部分最後進了掩埋場。
    conserve|v.|節約；保育|Please conserve water during the dry season.|乾季請節約用水。
    environment|n.|環境|We should protect the environment.|我們應該保護環境。
    environmental|adj.|環境的|The project passed the environmental review.|這個計畫通過了環境評估。
    sustainable|adj.|永續的|The company uses sustainable materials.|這家公司使用永續材料。
    eco friendly|adj.|環保的|These bags are eco friendly.|這些袋子很環保。|※一般寫作 eco-friendly。
    climate|n.|氣候|The climate here is warm all year.|這裡一年四季氣候溫暖。
    carbon|n.|碳|The goal is to reduce carbon emissions.|目標是減少碳排放。
    garbage|n.|垃圾|Take out the garbage on Tuesday.|星期二把垃圾拿出去。
    trash|n.|垃圾|Throw the trash in the bin.|把垃圾丟進垃圾桶。
    compost|n./v.|堆肥|We compost our food waste.|我們把廚餘做成堆肥。
    plastic|n./adj.|塑膠|The store no longer offers plastic bags.|這家店不再提供塑膠袋。
    reusable|adj.|可重複使用的|Bring a reusable cup to get a discount.|帶環保杯可以打折。
  `)),
  deck('en.brown.bank.community', '📰', '社區與媒體', LIFE, enList(`
    parade|n.|遊行|The city holds a parade every New Year.|市政府每年新年都舉辦遊行。
    fair|n./adj.|博覽會；公平的|We met many employers at the job fair.|我們在就業博覽會見了很多雇主。
    carnival|n.|嘉年華|The carnival will be held in the park.|嘉年華會在公園舉行。
    celebration|n.|慶祝活動|There will be a celebration for the store's anniversary.|商店週年會有慶祝活動。
    donation|n.|捐款；捐贈|All donations will go to the children's hospital.|所有捐款都會捐給兒童醫院。
    donate|v.|捐贈|Employees donated books to the library.|員工捐書給圖書館。
    charity|n.|慈善機構；慈善|The company supports a local charity.|公司贊助一個在地慈善機構。
    fundraising|n.|募款|The fundraising event raised ten thousand dollars.|募款活動籌到一萬美元。
    resident|n.|居民|Residents can park here for free.|居民可以免費在這裡停車。
    community|n.|社區；團體|The library is open to the whole community.|圖書館對整個社區開放。
    broadcast|v./n.|播出；廣播|The game will be broadcast live.|比賽會現場直播。
    headline|n.|頭條|The news made the headlines.|這則新聞上了頭條。
    episode|n.|（一）集|The final episode airs tonight.|最後一集今晚播出。
    channel|n.|頻道|What channel is the news on?|新聞在哪一台？
    subscriber|n.|訂閱者|The channel has a million subscribers.|這個頻道有一百萬訂閱者。
    podcast|n.|播客；Podcast|I listen to a business podcast on my way to work.|我上班途中聽商業 Podcast。
    newsletter|n.|電子報；通訊|Sign up for our monthly newsletter.|訂閱我們的每月電子報。
    article|n.|文章；條款|Did you read the article about the merger?|你看了那篇合併的報導嗎？
    editor|n.|編輯|The editor checked the article for errors.|編輯檢查了文章的錯誤。
    journalist|n.|記者|The journalist asked the mayor a tough question.|記者問了市長一個尖銳的問題。
    publisher|n.|出版社|The publisher will release the book in May.|出版社五月會出版這本書。
    viewer|n.|觀眾|The show attracted millions of viewers.|這個節目吸引了數百萬觀眾。
    listener|n.|聽眾|Thank you to all our listeners.|謝謝所有的聽眾。
    critic|n.|評論家|Film critics loved the movie.|影評人都很喜歡這部電影。
    rating|n.|評分；收視率|The hotel has a five star rating.|這家飯店有五星評價。
  `)),
  deck('en.brown.bank.housing2', '🏡', '住家與修繕 ②', LIFE, enList(`
    studio|n.|套房；工作室|I rent a small studio near the station.|我在車站附近租了一間小套房。
    unfurnished|adj.|沒附家具的|The apartment is unfurnished.|這間公寓沒附家具。
    balcony|n.|陽台|Our room has a balcony with a sea view.|我們的房間有看得到海的陽台。
    backyard|n.|後院|The kids are playing in the backyard.|孩子們在後院玩。
    fence|n.|圍籬|They painted the fence white.|他們把圍籬漆成白色。
    ceiling|n.|天花板|There is a leak in the ceiling.|天花板在漏水。
    remodel|v.|改建；翻修|We are remodeling the kitchen.|我們正在翻修廚房。
    plumbing|n.|水管系統|The old building has plumbing problems.|這棟老建築的水管有問題。
    faucet|n.|水龍頭|The faucet in the bathroom is dripping.|浴室的水龍頭在滴水。
    pipe|n.|管子|A water pipe burst last night.|昨晚有一條水管爆了。
    wiring|n.|電線配置|The electrician checked the wiring.|電工檢查了配線。
  `)),
  deck('en.brown.bank.photo1', '📷', 'Part 1 照片描述：人物動作（進行式）', PHOTO, enList(`
    leaning over|v.|彎身探向|A woman is leaning over the counter.|一位女士正彎身靠向櫃台。
    piled up|adj.|堆起來|The boxes are piled up near the door.|箱子堆在門邊。
    browse|v.|瀏覽；隨意看看|Some shoppers are browsing in a bookstore.|有些顧客在書店裡隨意翻看。
    kneel|v.|跪下|A man is kneeling to fix a tire.|一名男子跪著修輪胎。
    bending over|v.|彎腰|She is bending over to pick up a pen.|她彎腰撿起一支筆。
    reaching for|v.|伸手拿|He is reaching for a book on the top shelf.|他伸手去拿最上層的書。
    resting on|v.|擱在…上|Her hands are resting on the keyboard.|她的手擱在鍵盤上。
    tow|v.|拖吊|A truck is towing a car.|一輛卡車正在拖吊一部車。
    mow|v.|割草|A man is mowing the lawn.|一名男子在割草。
    rake|v./n.|用耙子耙；耙子|Someone is raking leaves in the yard.|有人在院子裡耙落葉。
    prune|v.|修剪（樹枝）|A gardener is pruning the bushes.|園丁正在修剪灌木。
    watering the plants|v.|澆花|A woman is watering the plants.|一位女士正在澆花。
    sweeping the floor|v.|掃地|A worker is sweeping the floor.|一名工作人員正在掃地。
    wiping the counter|v.|擦櫃台|A server is wiping the counter.|一位服務生在擦櫃台。
    pushing a cart|v.|推推車|A shopper is pushing a cart.|一位購物者在推推車。
    carrying a box|v.|搬箱子|Two men are carrying a box.|兩名男子正在搬一個箱子。
    holding a railing|v.|扶著欄杆|A woman is holding a railing on the stairs.|一位女士扶著樓梯的欄杆。
    crossing the street|v.|過馬路|People are crossing the street.|人們正在過馬路。
    waiting in line|v.|排隊等候|Customers are waiting in line.|顧客正在排隊。
    standing in line|v.|排隊|Passengers are standing in line at the gate.|乘客在登機門前排隊。
    sitting on a bench|v.|坐在長椅上|An elderly man is sitting on a bench.|一位老先生坐在長椅上。
    lying on the grass|v.|躺在草地上|Some people are lying on the grass.|有些人躺在草地上。
    walking along|v.|沿著…走|A couple is walking along the beach.|一對情侶沿著海灘散步。
    stroll|v.|散步|Tourists are strolling through the market.|觀光客在市場裡閒逛。
    jog|v.|慢跑|A man is jogging in the park.|一名男子在公園慢跑。
    pedal|v.|踩（腳踏車）|A cyclist is pedaling up a hill.|一位騎士正踩著腳踏車上坡。
    row|v./n.|划（船）；一排|Two people are rowing a boat.|兩個人在划船。|※in a row＝一排、連續。
    paddle|v./n.|用槳划；槳|A man is paddling a canoe.|一名男子在划獨木舟。
    anchor|v./n.|下錨；錨|A boat is anchored in the harbor.|一艘船停泊在港口。
    hanging on the wall|v.|掛在牆上|A clock is hanging on the wall.|一個時鐘掛在牆上。
    leaning on the fence|v.|靠在圍籬上|A bicycle is leaning on the fence.|一輛腳踏車靠在圍籬上。
  `)),
  deck('en.brown.bank.photo2', '🏗️', 'Part 1 照片描述：物品與場景', PHOTO, enList(`
    scaffolding|n.|鷹架|Scaffolding has been put up around the building.|大樓四周搭起了鷹架。
    wheelbarrow|n.|手推車（獨輪）|A worker is pushing a wheelbarrow.|一名工人在推獨輪手推車。
    crane|n.|起重機|A crane is lifting steel beams.|起重機正在吊起鋼樑。
    trolley|n.|手推車；路面電車|Luggage trolleys are lined up at the entrance.|行李推車在入口排成一排。
    railing|n.|欄杆|The railing is made of glass.|欄杆是玻璃做的。
    staircase|n.|樓梯|A spiral staircase leads to the second floor.|螺旋樓梯通往二樓。
    escalator|n.|手扶梯|People are riding the escalator.|人們正在搭手扶梯。
    statue|n.|雕像|There is a statue in the middle of the square.|廣場中央有一座雕像。
    pier|n.|碼頭；棧橋|Some boats are tied to the pier.|有幾艘船繫在碼頭邊。
    harbor|n.|港口|Ships are docked in the harbor.|船隻停泊在港口。
    canopy|n.|遮篷；天篷|A canopy has been set up over the tables.|桌子上方搭起了遮篷。
    awning|n.|（店門口的）雨篷|The cafe has a striped awning.|咖啡店有一個條紋雨篷。
    potted plant|n.|盆栽|Potted plants are placed by the window.|盆栽擺在窗邊。
    vase|n.|花瓶|Flowers have been arranged in a vase.|花插在花瓶裡。
    bookshelf|n.|書架|The bookshelf is full of binders.|書架上擺滿了資料夾。
    microscope|n.|顯微鏡|A scientist is looking through a microscope.|一位科學家正在用顯微鏡觀察。
    beaker|n.|燒杯|The beakers are filled with liquid.|燒杯裡裝著液體。
    apron|n.|圍裙|The chef is wearing an apron.|廚師穿著圍裙。
    helmet|n.|安全帽|Workers must wear a helmet on site.|工人在工地必須戴安全帽。
    goggles|n.|護目鏡|He is wearing safety goggles.|他戴著護目鏡。
    lined up|adj.|排成一排的|Cars are lined up at the traffic light.|車子在紅綠燈前排成一排。
    propped against|adj.|靠在…上|A ladder is propped against the wall.|一把梯子靠在牆上。
    suspended from|adj.|懸掛在…|Lamps are suspended from the ceiling.|燈從天花板垂吊下來。
    occupied|adj.|有人使用的|All the seats are occupied.|所有座位都有人坐了。
    unoccupied|adj.|沒人使用的|Some of the tables are unoccupied.|有些桌子沒人坐。
    deserted|adj.|空無一人的|The street is deserted.|街上空無一人。
    shaded|adj.|有遮蔭的|The benches are shaded by trees.|長椅有樹蔭遮著。
    reflected in|adj.|倒映在…|The buildings are reflected in the water.|大樓倒映在水面上。
    stacked|adj.|疊起來的|Chairs are stacked in the corner.|椅子疊在角落。
    on display|adj.|陳列中|Some items are on display in the window.|有些商品陳列在櫥窗裡。
    leaning against|adj.|靠著…|A bicycle is leaning against a tree.|一輛腳踏車靠在樹上。
    facing each other|adj.|面對面|Two people are sitting facing each other.|兩個人面對面坐著。
    side by side|adv.|並排|Two cars are parked side by side.|兩輛車並排停著。
    in a row|adv.|成一排；連續|The bottles are arranged in a row.|瓶子排成一排。
    overlooking|adj.|俯瞰…的|The hotel has rooms overlooking the lake.|飯店有看得到湖景的房間。
  `)),
];
