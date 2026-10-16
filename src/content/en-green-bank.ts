// 英文綠色證書單字庫：多益商務核心字彙（人事、行銷、銷售、財務、生產物流、採購、法務、文件、活動、科技、公司營運、經濟），以及商務必背動詞與形容詞。
import type { Unit } from '../core/types';
import { deck, enList } from './dsl';

const PEOPLE = '人事與行銷';
const OPS = '財務與營運';
const DOCS = '法務、文件與活動';
const BIZ = '科技、公司與市場';
const CORE = '商務必背字';

export const GREEN_BANK: Unit[] = [
  deck('en.green.bank.hiring', '🧑‍💼', '人事與招募', PEOPLE, enList(`
    job opening|n.|職缺|We have a job opening in the sales department.|業務部有一個職缺。
    job description|n.|職務說明|Please read the job description carefully.|請仔細閱讀職務說明。
    requirement|n.|必要條件|A college degree is a requirement for this position.|大學學歷是這個職位的必要條件。
    qualification|n.|資格；條件|What qualifications do you have?|你有什麼資格條件？
    experienced|adj.|有經驗的|We are looking for an experienced accountant.|我們在找有經驗的會計師。
    skill|n.|技能|Good communication skills are important.|良好的溝通技能很重要。
    certificate|n.|證書|You need a teaching certificate.|你需要教師證書。
    license|n.|執照|Do you have a driver's license?|你有駕照嗎？
    application|n.|申請；申請書|Please submit your application by May 1.|請在五月一日前提交申請書。
    cover letter|n.|求職信|Please send a resume and a cover letter.|請寄履歷和求職信。
    interviewer|n.|面試官|The interviewer asked about my experience.|面試官問了我的經歷。
    employer|n.|雇主|My employer pays for my training.|我的雇主負擔我的培訓費用。
    employment|n.|就業；雇用|He found employment at a bank.|他在銀行找到工作。
    full time|adj./adv.|全職|She works full time.|她是全職員工。
    part time|adj./adv.|兼職|I work part time at a cafe.|我在咖啡館打工。
    temporary|adj.|臨時的|This is a temporary position.|這是臨時職位。
    permanent|adj.|永久的；正式的|She got a permanent job.|她找到了一份正職工作。
    probation|n.|試用期|New employees have a three month probation period.|新進員工有三個月的試用期。
    orientation|n.|新人說明會|New employees must attend orientation.|新員工必須參加新人說明會。
    training|n.|訓練|All staff receive safety training.|全體員工都要接受安全訓練。
    trainee|n.|受訓者|The trainees will start on Monday.|受訓人員星期一開始上班。
    human resources|n.|人力資源部|Please send your application to human resources.|請將申請書寄到人力資源部。
    job fair|n.|就業博覽會|Many companies attended the job fair.|很多公司參加了就業博覽會。
    headhunter|n.|獵人頭顧問|A headhunter contacted me about a new job.|有獵人頭顧問聯絡我談新工作。
    shortlist|v./n.|列入決選名單|We shortlisted five candidates.|我們把五位候選人列入了決選名單。
  `)),
  deck('en.green.bank.career', '📈', '員工與職涯', PEOPLE, enList(`
    raise|n./v.|加薪；提高|She asked her boss for a raise.|她向老闆要求加薪。
    bonus|n.|獎金|Employees receive a bonus at the end of the year.|員工年底會領到獎金。
    wage|n.|工資|The minimum wage will go up next year.|基本工資明年會調漲。
    paycheck|n.|薪水|I get my paycheck every two weeks.|我每兩週領一次薪水。
    payroll|n.|薪資帳冊；薪資部門|The payroll department handles salaries.|薪資部門負責處理薪水。
    pension|n.|退休金|He receives a monthly pension.|他每個月領退休金。
    vacation|n.|休假|I'm taking a week of vacation in July.|我七月要休一週假。
    sick leave|n.|病假|She is on sick leave today.|她今天請病假。
    paid leave|n.|帶薪假|Employees get fifteen days of paid leave.|員工有十五天的帶薪假。
    shift|n.|輪班|I work the night shift this week.|我這週上夜班。
    performance review|n.|績效考核|My performance review is next week.|我的績效考核在下週。
    evaluate|v.|評估|Managers evaluate staff twice a year.|主管一年評估員工兩次。
    evaluation|n.|評估|The evaluation will be based on sales.|評估將以業績為準。
    achievement|n.|成就|Winning the award was a great achievement.|得獎是一項很大的成就。
    award|n./v.|獎；頒發|She received an award for her work.|她因為工作表現得了獎。
    reward|n./v.|報酬；獎勵|Hard work will be rewarded.|努力會有回報。
    resign|v.|辭職|He resigned from the company last month.|他上個月從公司辭職了。
    resignation|n.|辭呈；辭職|She handed in her resignation.|她遞出了辭呈。
    relocate|v.|調派；搬遷|The company relocated him to Singapore.|公司把他調派到新加坡。
    mentor|n.|導師；指導者|My mentor gave me good advice.|我的指導者給了我很好的建議。
    workload|n.|工作量|My workload has doubled this month.|我這個月的工作量加倍了。
    teamwork|n.|團隊合作|Good teamwork is the key to success.|良好的團隊合作是成功的關鍵。
    work from home|v.|在家工作|I work from home on Fridays.|我星期五在家工作。
    job title|n.|職稱|What is your job title?|你的職稱是什麼？
    leave of absence|n.|留職停薪；長假|She took a leave of absence to care for her mother.|她請了長假照顧母親。
  `)),
  deck('en.green.bank.marketing', '📣', '行銷與廣告', PEOPLE, enList(`
    marketing|n.|行銷|She works in marketing.|她從事行銷工作。
    advertisement|n.|廣告|I saw your advertisement in the newspaper.|我在報紙上看到你們的廣告。
    commercial|n./adj.|電視廣告；商業的|The commercial will air next week.|這支廣告下週播出。
    slogan|n.|標語|The new slogan is easy to remember.|新標語很好記。
    logo|n.|標誌|The company changed its logo.|公司換了標誌。
    publicity|n.|宣傳；曝光|The event got a lot of publicity.|這場活動得到很多曝光。
    sponsor|v./n.|贊助|A local bank sponsored the race.|一家地方銀行贊助了這場賽跑。
    flyer|n.|傳單|We handed out flyers at the station.|我們在車站發傳單。
    brochure|n.|簡介手冊|Please take a brochure.|請拿一份簡介手冊。
    catalog|n.|型錄|Our new catalog is now available.|我們的新型錄現已推出。
    market research|n.|市場調查|We conducted market research before the launch.|上市前我們做了市場調查。
    customer base|n.|客群|We want to expand our customer base.|我們想擴大客群。
    trend|n.|趨勢|We follow the latest trends.|我們追隨最新的趨勢。
    feedback|n.|回饋意見|We welcome your feedback.|我們歡迎您的回饋。
    social media|n.|社群媒體|We advertise on social media.|我們在社群媒體上打廣告。
    influencer|n.|網紅；有影響力的人|The company hired an influencer to promote the product.|公司請了網紅來宣傳產品。
    press release|n.|新聞稿|The company issued a press release.|公司發布了新聞稿。
    publicize|v.|宣傳|We need to publicize the event.|我們需要宣傳這場活動。
    appeal|v./n.|吸引；呼籲|The design appeals to young people.|這個設計很吸引年輕人。
    attract|v.|吸引|The sale attracted many shoppers.|特賣吸引了許多購物者。
    free sample|n.|免費試用品|They were giving out free samples.|他們在發免費試用品。
    loyal|adj.|忠實的|We offer discounts to loyal customers.|我們提供折扣給忠實顧客。
    exposure|n.|曝光|The ad gave us a lot of exposure.|那則廣告讓我們獲得很多曝光。
    billboard|n.|廣告看板|The billboard is next to the highway.|廣告看板就在高速公路旁。
    target audience|n.|目標受眾|Our target audience is college students.|我們的目標受眾是大學生。
  `)),
  deck('en.green.bank.sales', '🤝', '銷售與客戶', PEOPLE, enList(`
    sales|n.|業績；銷售|Sales were up this quarter.|本季業績上升。
    salesperson|n.|業務員|The salesperson showed us the new model.|業務員向我們展示了新機型。
    sales representative|n.|業務代表|A sales representative will call you.|業務代表會打電話給你。
    quote|n./v.|報價|Could you send me a price quote?|可以寄報價給我嗎？
    deal|n.|交易|We closed a big deal yesterday.|我們昨天談成了一筆大交易。
    account manager|n.|客戶經理|Your account manager will contact you.|您的客戶經理會與您聯絡。
    prospect|n.|潛在客戶；前景|We have many new prospects this month.|我們這個月有很多潛在客戶。
    potential|adj./n.|潛在的；潛力|We met with a potential client.|我們和一位潛在客戶會面。
    order form|n.|訂購單|Please fill in the order form.|請填寫訂購單。
    bulk|n.|大量|We offer discounts on bulk orders.|大量訂購有折扣。
    wholesale|adj./n.|批發|We buy products at wholesale prices.|我們以批發價購買產品。
    retail|n./adj.|零售|The retail price is fifty dollars.|零售價是五十美元。
    retailer|n.|零售商|The retailer sells our products online.|那家零售商在網路上販售我們的產品。
    merchandise|n.|商品|All merchandise is ten percent off.|所有商品九折。
    sell out|v.|賣光|The tickets will sell out quickly.|票很快就會賣光。
    best seller|n.|暢銷商品|This book is a best seller.|這本書是暢銷書。
    commission|n.|佣金|Salespeople earn a commission on each sale.|業務員每賣出一筆就有佣金。
    negotiation|n.|談判；協商|The negotiation took three hours.|談判花了三個小時。
    satisfied|adj.|滿意的|Our customers are satisfied with the service.|我們的顧客對服務很滿意。
    satisfaction|n.|滿意|Customer satisfaction is our top priority.|顧客滿意是我們的首要目標。
    repeat customer|n.|回頭客|Most of our business comes from repeat customers.|我們大部分的生意來自回頭客。
    order number|n.|訂單編號|Please tell me your order number.|請告訴我您的訂單編號。
    backorder|n.|延後交貨的訂單|The item is on backorder.|這個商品目前延後出貨。
    sales figures|n.|銷售數字|The sales figures look good this month.|這個月的銷售數字很好看。
    trade|n./v.|貿易|Trade between the two countries is growing.|兩國之間的貿易持續成長。
  `)),
  deck('en.green.bank.finance', '💹', '財務與會計', OPS, enList(`
    accountant|n.|會計師|Our accountant checks the books every month.|我們的會計師每個月查帳。
    audit|n./v.|稽核；查帳|The company is audited every year.|公司每年都接受稽核。
    auditor|n.|稽核員|The auditors found a few errors.|稽核員發現了幾個錯誤。
    financial|adj.|財務的|The financial report will be released tomorrow.|財務報告明天公布。
    finance|n.|財務；金融|She works in the finance department.|她在財務部工作。
    asset|n.|資產|The company has many assets.|這家公司有很多資產。
    income|n.|收入|Her monthly income is about two thousand dollars.|她的月收入大約兩千美元。
    earnings|n.|收入；盈餘|The company's earnings rose last year.|公司去年盈餘增加。
    loss|n.|損失；虧損|The company reported a loss this year.|公司今年出現虧損。
    cash flow|n.|現金流|Good cash flow is important for small businesses.|良好的現金流對小企業很重要。
    tax return|n.|報稅單|I need to file my tax return.|我得申報所得稅。
    deduct|v.|扣除|Taxes are deducted from your salary.|稅金會從薪水中扣除。
    deduction|n.|扣除額|There is a deduction for medical expenses.|醫療費用有扣除額。
    balance sheet|n.|資產負債表|Please review the balance sheet.|請審閱資產負債表。
    spreadsheet|n.|試算表|I keep the data in a spreadsheet.|我把資料存在試算表裡。
    calculate|v.|計算|Please calculate the total cost.|請計算總成本。
    transaction|n.|交易|All transactions are recorded.|所有交易都有紀錄。
    fiscal year|n.|會計年度|Our fiscal year ends in March.|我們的會計年度在三月結束。
    shareholder|n.|股東|The shareholders' meeting is in June.|股東大會在六月。
    stock|n.|股票；庫存|She bought stock in a tech company.|她買了一家科技公司的股票。
    dividend|n.|股利|The company paid a dividend to shareholders.|公司發放股利給股東。
    payment|n.|付款|Payment is due within thirty days.|款項須在三十天內支付。
    outstanding|adj.|未付的；傑出的|We have an outstanding balance of two hundred dollars.|我們還有兩百美元的款項未付。
    bankrupt|adj.|破產的|The company went bankrupt last year.|那家公司去年破產了。
    funding|n.|資金|The project needs more funding.|這個專案需要更多資金。
  `)),
  deck('en.green.bank.costs', '💰', '預算與成本', OPS, enList(`
    costly|adj.|昂貴的；代價高的|The mistake was very costly.|那個錯誤代價很高。
    expenditure|n.|支出|We must cut our expenditure.|我們必須削減支出。
    cut costs|v.|削減成本|The company is trying to cut costs.|公司正努力削減成本。
    overspend|v.|超支|We overspent on the party.|我們辦派對超支了。
    allocate|v.|分配（資金）|The money was allocated to marketing.|這筆錢分配給了行銷部門。
    fund|n./v.|基金；資助|The city funded the new park.|市政府資助了新公園。
    grant|n.|補助金|The school received a government grant.|學校獲得了政府補助。
    subsidy|n.|補貼|Farmers receive a subsidy from the government.|農民獲得政府補貼。
    price increase|n.|漲價|There will be a price increase next month.|下個月會漲價。
    affordable|adj.|負擔得起的|We offer affordable housing.|我們提供負擔得起的住宅。
    inexpensive|adj.|便宜的|This is an inexpensive way to travel.|這是一種便宜的旅行方式。
    economical|adj.|經濟實惠的；省錢的|This car is very economical.|這台車很省油。
    pricing|n.|定價|We need to review our pricing.|我們需要檢討定價。
    breakdown|n.|明細；故障|Here is a breakdown of the costs.|這是費用明細。
    itemize|v.|逐項列出|Please itemize your expenses.|請逐項列出你的開支。
    petty cash|n.|零用金|We pay for office snacks from petty cash.|辦公室點心用零用金支付。
    quotation|n.|報價單|We received three quotations.|我們收到了三份報價單。
    cost effective|adj.|划算的；成本效益高的|This is the most cost effective solution.|這是最划算的解決方案。
    spending|n.|支出；花費|Consumer spending fell last month.|上個月消費支出下降。
    save|v.|節省；儲蓄|We can save money by buying in bulk.|大量購買可以省錢。
    waste|v./n.|浪費|Don't waste paper.|不要浪費紙張。
    surplus|n.|盈餘；過剩|The city has a budget surplus this year.|市政府今年有預算盈餘。
    deficit|n.|赤字|The government has a large deficit.|政府有龐大的赤字。
    overcharge|v.|多收費|I think the hotel overcharged me.|我想飯店多收了我的錢。
    free trial|n.|免費試用|Sign up for a thirty day free trial.|註冊享三十天免費試用。
  `)),
  deck('en.green.bank.production', '🏭', '製造與生產', OPS, enList(`
    factory|n.|工廠|The factory produces car parts.|這家工廠生產汽車零件。
    plant|n.|工廠；植物|The company is building a new plant in Vietnam.|公司正在越南蓋新工廠。
    produce|v.|生產|We produce ten thousand units a day.|我們每天生產一萬件。
    production|n.|生產|Production will start next month.|下個月開始生產。
    productivity|n.|生產力|New machines improved productivity.|新機器提高了生產力。
    assembly line|n.|生產線|He works on the assembly line.|他在生產線上工作。
    machinery|n.|機械|The factory bought new machinery.|工廠買了新機械。
    equipment|n.|設備|Please wear safety equipment.|請穿戴安全裝備。
    raw material|n.|原料|The price of raw materials has risen.|原料價格上漲了。
    component|n.|零件；成分|We import some components from Japan.|我們從日本進口部分零件。
    part|n.|零件；部分|We need to order spare parts.|我們需要訂購備用零件。
    quality control|n.|品質管理|Quality control is very strict here.|這裡的品管非常嚴格。
    inspection|n.|檢查|The machines passed the safety inspection.|機器通過了安全檢查。
    safety|n.|安全|Safety comes first.|安全第一。
    regulation|n.|規定；法規|Please follow the safety regulations.|請遵守安全規定。
    automate|v.|自動化|The company automated its warehouse.|公司把倉庫自動化了。
    prototype|n.|原型；樣品|The engineers built a prototype.|工程師做出了原型機。
    batch|n.|一批|The first batch of products was shipped.|第一批產品已出貨。
    defective|adj.|有瑕疵的|Defective products will be replaced.|有瑕疵的產品會換新。
    recall|v./n.|召回|The company recalled ten thousand cars.|公司召回了一萬輛車。
    shut down|v.|關閉；停機|The factory will shut down for repairs.|工廠將停工維修。
    technician|n.|技術人員|A technician will fix the machine.|技術人員會來修機器。
    engineer|n.|工程師|My sister is an engineer.|我姊姊是工程師。
    worker|n.|工人；員工|The factory has two hundred workers.|這家工廠有兩百名工人。
    manual|n./adj.|手冊；手動的|Read the manual before using the machine.|使用機器前請先閱讀手冊。
  `)),
  deck('en.green.bank.logistics', '🚚', '物流與運輸', OPS, enList(`
    shipping|n.|運送；運費|Shipping is free for orders over fifty dollars.|訂單滿五十美元免運費。
    freight|n.|貨運|The freight will arrive by sea.|貨物將以海運送達。
    cargo|n.|貨物|The ship carries cargo to Europe.|那艘船載貨到歐洲。
    container|n.|貨櫃；容器|The goods are packed in containers.|貨物裝在貨櫃裡。
    port|n.|港口|The ship arrived at the port.|船抵達了港口。
    dock|n.|碼頭；裝卸平台|The truck is waiting at the loading dock.|卡車正在裝卸平台等候。
    logistics|n.|物流|She works in logistics.|她從事物流業。
    supply chain|n.|供應鏈|The storm affected the supply chain.|暴風雨影響了供應鏈。
    goods|n.|貨物；商品|The goods were damaged during shipping.|貨物在運送途中受損。
    dispatch|v.|發送；派遣|Your order will be dispatched today.|您的訂單今天會發出。
    track|v.|追蹤|You can track your package online.|您可以在網路上追蹤包裹。
    delivery date|n.|交貨日期|The delivery date has been moved to Friday.|交貨日期改到星期五了。
    express|adj.|快速的；快遞的|Send it by express delivery.|用快遞寄送。
    overnight|adj./adv.|隔夜的|We offer overnight shipping.|我們提供隔夜送達服務。
    in transit|phr.|運送途中|Your package is in transit.|您的包裹正在運送中。
    damaged|adj.|損壞的|The box arrived damaged.|箱子送到時已經損壞。
    pallet|n.|棧板|Load the boxes onto the pallet.|把箱子放到棧板上。
    forklift|n.|堆高機|He is driving a forklift.|他正在開堆高機。
    packaging|n.|包裝|The packaging is made from recycled paper.|包裝是用再生紙做的。
    storage|n.|儲存；倉儲|We need more storage space.|我們需要更多儲存空間。
    import|v./n.|進口|We import coffee from Brazil.|我們從巴西進口咖啡。
    export|v./n.|出口|Japan exports many cars.|日本出口很多汽車。
    carrier|n.|運輸業者；航空公司|We use a reliable carrier for shipping.|我們用可靠的貨運業者送貨。
    fleet|n.|車隊；船隊|The company has a fleet of fifty trucks.|公司有五十輛卡車的車隊。
    distribution|n.|配銷；分配|The distribution center is near the airport.|配銷中心在機場附近。
  `)),
  deck('en.green.bank.purchasing', '📦', '採購與供應', OPS, enList(`
    vendor|n.|供應商；小販|We changed vendors to reduce costs.|為了降低成本我們換了供應商。
    supply|n./v.|供應；用品|We supply parts to car makers.|我們供應零件給汽車製造商。
    purchasing|n.|採購（部門）|Please send the request to purchasing.|請把需求送到採購部。
    procurement|n.|採購|She is in charge of procurement.|她負責採購。
    purchase order|n.|訂購單|We received a purchase order from the client.|我們收到了客戶的訂購單。
    place an order|v.|下訂單|I'd like to place an order.|我想下訂單。
    restock|v.|補貨|We will restock the shelves tonight.|我們今晚會補貨上架。
    run out of|v.|用完|We have run out of paper.|我們的紙用完了。
    shortage|n.|短缺|There is a shortage of nurses.|護理師短缺。
    stockroom|n.|庫房|Extra paper is in the stockroom.|多的紙在庫房裡。
    reorder|v.|再訂購|It's time to reorder printer paper.|該再訂印表機紙了。
    lead time|n.|交貨前置時間|The lead time for this product is two weeks.|這項產品的交貨期是兩週。
    minimum order|n.|最低訂購量|The minimum order is one hundred units.|最低訂購量是一百件。
    unit price|n.|單價|What is the unit price?|單價是多少？
    sample|n.|樣品|Could you send us a sample?|可以寄樣品給我們嗎？
    specification|n.|規格|The product meets all specifications.|這項產品符合所有規格。
    bid|n./v.|投標；出價|Three companies placed bids on the project.|有三家公司投標這個案子。
    contractor|n.|承包商|The contractor finished the work on time.|承包商準時完工。
    source|v./n.|採購來源；來源|We source our coffee beans from Colombia.|我們的咖啡豆從哥倫比亞採購。
    reliable|adj.|可靠的|We need a reliable supplier.|我們需要可靠的供應商。
    on order|phr.|已訂購（尚未到貨）|The parts are on order.|零件已經訂了，還沒到。
    backup|n.|備用；備份|We keep a backup supply of masks.|我們備有口罩的備用庫存。
    consignment|n.|託運的貨物|The consignment arrived this morning.|託運的貨今天早上到了。
    stock up|v.|囤貨|Let's stock up on water before the typhoon.|颱風來之前先囤點水吧。
    durable|adj.|耐用的|These boots are very durable.|這雙靴子非常耐用。
  `)),
  deck('en.green.bank.legal', '⚖️', '合約與法務', DOCS, enList(`
    contract|n.|合約|Both sides signed the contract.|雙方簽了合約。
    legal|adj.|法律的；合法的|We need legal advice.|我們需要法律建議。
    lawyer|n.|律師|You should talk to a lawyer.|你應該找律師談談。
    attorney|n.|律師|Her attorney will contact you.|她的律師會聯絡你。
    law|n.|法律|The new law takes effect next year.|新法明年生效。
    policy|n.|政策；規定|Please read our privacy policy.|請閱讀我們的隱私權政策。
    condition|n.|條件；狀況|The car is in good condition.|這台車的狀況很好。
    valid|adj.|有效的|Your passport must be valid for six months.|您的護照效期必須還有六個月。
    invalid|adj.|無效的|This ticket is invalid.|這張票無效。
    breach|n./v.|違約；違反|That is a breach of contract.|那是違約行為。
    violate|v.|違反|Do not violate the rules.|不要違反規定。
    comply|v.|遵守|All employees must comply with the rules.|所有員工都必須遵守規定。
    compliance|n.|遵守；合規|We check compliance every year.|我們每年檢查合規情況。
    permit|n./v.|許可證；允許|You need a permit to park here.|在這裡停車需要許可證。
    authorize|v.|授權|Only managers can authorize refunds.|只有經理能授權退款。
    approve|v.|批准|The plan was approved by the board.|計畫已獲董事會批准。
    approval|n.|批准|We are waiting for approval.|我們正在等待批准。
    dispute|n.|爭議|They settled the dispute out of court.|他們在庭外和解了這起爭議。
    settle|v.|解決；和解|The two companies settled the case.|兩家公司和解了這個案子。
    court|n.|法院|The case went to court.|這個案子上了法院。
    confidential|adj.|機密的|This information is confidential.|這個資訊是機密的。
    liable|adj.|負有法律責任的|The company is liable for the damage.|公司要為損害負責。
    penalty|n.|罰款；處罰|There is a penalty for late payment.|逾期付款會被罰款。
    amendment|n.|修正案；修訂|We made an amendment to the contract.|我們修訂了合約。
    terminate|v.|終止|Either party may terminate the contract.|任一方都可以終止合約。
  `)),
  deck('en.green.bank.documents', '📝', '商務書信與文件', DOCS, enList(`
    draft|n./v.|草稿；起草|Please send me a draft of the letter.|請把信的草稿寄給我。
    revise|v.|修改|Please revise the report and send it again.|請修改報告後再寄一次。
    revision|n.|修訂|I made a few revisions to the plan.|我對計畫做了幾處修改。
    proofread|v.|校對|Please proofread the document before sending it.|寄出前請校對文件。
    format|n.|格式|Please use the standard format.|請使用標準格式。
    template|n.|範本|You can use this template for the report.|報告可以使用這個範本。
    original|n./adj.|原件；原本的|Please keep the original.|請保留原件。
    duplicate|n./v.|副本；複製|Please make a duplicate of this key.|請把這把鑰匙複製一把。
    summary|n.|摘要|Here is a summary of the meeting.|這是會議摘要。
    outline|n.|大綱|Please send me an outline of your plan.|請把你的計畫大綱寄給我。
    appendix|n.|附錄|The data is in the appendix.|資料在附錄裡。
    letterhead|n.|印有公司抬頭的信紙|Please print the letter on company letterhead.|請用公司信紙列印這封信。
    subject line|n.|郵件主旨|Write the order number in the subject line.|請在主旨欄寫上訂單編號。
    in response to|phr.|回應|I am writing in response to your letter.|我寫這封信是為了回覆您的來信。
    with regard to|phr.|關於|With regard to your request, we will reply soon.|關於您的請求，我們會盡快回覆。
    as requested|phr.|依照您的要求|As requested, I have attached the price list.|依照您的要求，我附上了價目表。
    on behalf of|phr.|代表|I am writing on behalf of my manager.|我代表我的經理寫這封信。
    best regards|phr.|敬祝（書信結尾）|Best regards, Kevin Lee|李凱文 敬上
    dear|adj.|親愛的（書信開頭）|Dear Mr. Smith, thank you for your email.|親愛的史密斯先生，感謝您的來信。
    inform|v.|通知|We are pleased to inform you that you passed.|我們很高興通知您已經通過。
    information|n.|資訊|For more information, visit our website.|更多資訊請上我們的網站。
    detail|n.|細節|Please send me the details.|請把細節寄給我。
    clarify|v.|澄清；釐清|Could you clarify this point?|可以釐清一下這一點嗎？
    mention|v.|提到|As I mentioned, the meeting is canceled.|如我所提，會議取消了。
    record|n./v.|紀錄；記錄|Please keep a record of all payments.|請保存所有付款紀錄。
  `)),
  deck('en.green.bank.events', '🎤', '活動與研討會', DOCS, enList(`
    event|n.|活動|The event starts at seven.|活動七點開始。
    seminar|n.|研討會|I attended a seminar on marketing.|我參加了一場行銷研討會。
    workshop|n.|工作坊|The workshop is free for members.|工作坊對會員免費。
    trade show|n.|商展|We will have a booth at the trade show.|我們將在商展設攤。
    speaker|n.|演講者|The speaker talked about climate change.|講者談論了氣候變遷。
    guest speaker|n.|特邀講者|Our guest speaker is a famous chef.|我們的特邀講者是位名廚。
    panel|n.|座談小組|The panel discussed the future of work.|座談小組討論了工作的未來。
    session|n.|場次；會議時段|The afternoon session begins at two.|下午場兩點開始。
    register|v.|報名；登記|Please register online by Friday.|請在星期五前上網報名。
    sign up|v.|報名|You can sign up for the class online.|你可以上網報名這門課。
    organizer|n.|主辦者|The organizers thanked everyone for coming.|主辦單位感謝大家蒞臨。
    volunteer|n./v.|志工；自願|We need volunteers for the event.|我們需要活動志工。
    reception|n.|歡迎會；接待處|There will be a reception after the ceremony.|典禮後有歡迎酒會。
    ceremony|n.|典禮|The awards ceremony is on Friday night.|頒獎典禮在星期五晚上。
    celebrate|v.|慶祝|We celebrated our tenth anniversary.|我們慶祝了十週年。
    anniversary|n.|週年紀念|The company's anniversary is in May.|公司週年慶在五月。
    invitation|n.|邀請函|Did you get the invitation?|你收到邀請函了嗎？
    invite|v.|邀請|We invited all our clients.|我們邀請了所有客戶。
    attendance|n.|出席人數；出席|Attendance was higher than expected.|出席人數比預期多。
    rehearsal|n.|彩排|The rehearsal starts at five.|彩排五點開始。
    banner|n.|橫幅|Hang the banner above the stage.|把橫幅掛在舞台上方。
    stage|n.|舞台；階段|The singer walked onto the stage.|歌手走上舞台。
    microphone|n.|麥克風|Please speak into the microphone.|請對著麥克風說話。
    fundraiser|n.|募款活動|The school held a fundraiser for the library.|學校為圖書館舉辦了募款活動。
    program|n.|節目單；計畫|Please check the program for the schedule.|請看節目單上的時間表。
  `)),
  deck('en.green.bank.tech', '💻', '科技與網路', BIZ, enList(`
    software|n.|軟體|We need to update the software.|我們需要更新軟體。
    update|v./n.|更新|Please update your contact information.|請更新您的聯絡資訊。
    install|v.|安裝|The technician installed a new printer.|技術人員安裝了新印表機。
    download|v.|下載|You can download the app for free.|你可以免費下載這個應用程式。
    upload|v.|上傳|Please upload your photo.|請上傳你的照片。
    website|n.|網站|Visit our website for more details.|更多細節請上我們的網站。
    online|adj./adv.|線上的；在網路上|You can pay online.|你可以線上付款。
    log in|v.|登入|Please log in with your email address.|請用電子郵件地址登入。
    username|n.|使用者名稱|Enter your username and password.|請輸入使用者名稱和密碼。
    database|n.|資料庫|All customer data is stored in a database.|所有顧客資料都存在資料庫裡。
    network|n.|網路；人脈|The network is down this morning.|今天早上網路斷了。
    wireless|adj.|無線的|The hotel offers free wireless internet.|飯店提供免費無線網路。
    internet|n.|網際網路|The internet connection is slow.|網路連線很慢。
    connection|n.|連線；關聯|I lost my internet connection.|我的網路連線斷了。
    device|n.|裝置|Please turn off all electronic devices.|請關閉所有電子裝置。
    technology|n.|科技|New technology changes how we work.|新科技改變了我們的工作方式。
    technical|adj.|技術的|We are having technical problems.|我們遇到技術問題。
    digital|adj.|數位的|We use digital receipts now.|我們現在使用電子收據。
    data|n.|資料|Please back up your data.|請備份你的資料。
    back up|v.|備份|Remember to back up your files.|記得備份你的檔案。
    virus|n.|病毒|My computer has a virus.|我的電腦中毒了。
    secure|adj.|安全的|Our website is safe and secure.|我們的網站安全可靠。
    troubleshoot|v.|排除故障|The IT team will troubleshoot the problem.|資訊團隊會排除這個問題。
    user|n.|使用者|The app has over one million users.|這個應用程式有一百多萬名使用者。
    upgrade|v./n.|升級|We upgraded our computers last year.|我們去年升級了電腦。
  `)),
  deck('en.green.bank.service', '🛎️', '客服與品質', BIZ, enList(`
    customer support|n.|客戶支援|Contact customer support for help.|如需協助請聯絡客戶支援。
    help desk|n.|服務台|Call the help desk if your computer breaks.|電腦壞掉的話打給服務台。
    inquire|v.|詢問|I'm calling to inquire about my order.|我打來詢問我的訂單。
    complain|v.|抱怨|Several guests complained about the noise.|好幾位客人抱怨噪音。
    resolve|v.|解決|We will resolve the problem as soon as possible.|我們會盡快解決這個問題。
    solution|n.|解決方法|We need to find a solution quickly.|我們需要盡快找到解決方法。
    solve|v.|解決|The technician solved the problem.|技術人員解決了問題。
    issue|n.|問題；議題|We are aware of the issue.|我們已經知道這個問題。
    apology|n.|道歉|Please accept our apology.|請接受我們的道歉。
    compensate|v.|補償|We will compensate you for the delay.|我們會補償您延誤的損失。
    compensation|n.|補償；薪酬|The airline offered compensation.|航空公司提供了賠償。
    voucher|n.|禮券；抵用券|We'll give you a voucher for your next stay.|我們會送您一張下次住宿的抵用券。
    standard|n./adj.|標準|Our products meet high standards.|我們的產品符合高標準。
    guarantee|n./v.|保證|We guarantee delivery within two days.|我們保證兩天內送達。
    courteous|adj.|有禮貌的|The staff were courteous and helpful.|員工有禮貌又樂於助人。
    polite|adj.|有禮貌的|Please be polite to customers.|請對顧客有禮貌。
    patience|n.|耐心|Thank you for your patience.|感謝您的耐心等候。
    waiting list|n.|候補名單|We put your name on the waiting list.|我們把您的名字列入候補名單。
    hotline|n.|服務專線|Call our hotline for support.|請撥打我們的服務專線尋求協助。
    instructions|n.|說明；指示|Follow the instructions on the box.|請依照盒子上的說明操作。
    return policy|n.|退貨規定|What is your return policy?|你們的退貨規定是什麼？
    replacement|n.|替換品|We will send you a replacement.|我們會寄給您替換品。
    malfunction|n./v.|故障|The machine malfunctioned again.|機器又故障了。
    out of order|phr.|故障|The elevator is out of order.|電梯故障了。
    escalate|v.|升級處理；擴大|I will escalate your complaint to my manager.|我會把您的客訴轉給我的經理處理。
  `)),
  deck('en.green.bank.company', '🏢', '公司與組織', BIZ, enList(`
    corporation|n.|公司；企業|She works for a large corporation.|她在一家大企業工作。
    firm|n.|公司；事務所|He works at a law firm.|他在一家律師事務所工作。
    enterprise|n.|企業|The government supports small enterprises.|政府支持小型企業。
    subsidiary|n.|子公司|The company has a subsidiary in Japan.|這家公司在日本有子公司。
    division|n.|部門；事業部|She manages the sales division.|她管理業務事業部。
    board of directors|n.|董事會|The board of directors meets every month.|董事會每個月開會一次。
    chairman|n.|董事長；主席|The chairman will give a speech.|董事長將發表演說。
    president|n.|總裁；總統|The president of the company visited our branch.|公司總裁參訪了我們的分公司。
    executive|n./adj.|主管；行政的|She is a senior executive at the bank.|她是那家銀行的高階主管。
    chief|adj./n.|首席的；主管|He is the chief engineer.|他是總工程師。
    founder|n.|創辦人|The founder started the company in his garage.|創辦人在自家車庫創立了公司。
    found|v.|創立|The company was founded in 1990.|這家公司創立於 1990 年。
    establish|v.|建立；設立|The firm was established fifty years ago.|這家公司成立於五十年前。
    merger|n.|合併|The merger was announced yesterday.|合併案昨天宣布了。
    merge|v.|合併|The two banks will merge next year.|兩家銀行明年將合併。
    acquire|v.|收購；獲得|The company acquired a small startup.|公司收購了一家新創公司。
    acquisition|n.|收購|The acquisition cost two billion dollars.|這筆收購花了二十億美元。
    startup|n.|新創公司|He works for a startup in Taipei.|他在台北的一家新創公司工作。
    partnership|n.|合作關係|We formed a partnership with a Japanese firm.|我們和一家日本公司建立了合作關係。
    organization|n.|組織|She works for a nonprofit organization.|她在一個非營利組織工作。
    structure|n.|結構|The company changed its management structure.|公司改變了管理結構。
    expand|v.|擴大；擴展|We plan to expand into Asia.|我們計畫拓展到亞洲。
    expansion|n.|擴張|The expansion will create new jobs.|這次擴張會創造新工作機會。
    mission|n.|使命；任務|Our mission is to help small businesses.|我們的使命是幫助小企業。
    goal|n.|目標|Our goal is to double sales.|我們的目標是讓業績加倍。
  `)),
  deck('en.green.bank.property', '🏗️', '不動產與設施', BIZ, enList(`
    property|n.|房地產；財產|The company owns property in the city.|公司在市區擁有房地產。
    office space|n.|辦公空間|We are looking for office space downtown.|我們正在找市中心的辦公空間。
    floor plan|n.|平面圖|Here is the floor plan of the office.|這是辦公室的平面圖。
    square meter|n.|平方公尺|The apartment is eighty square meters.|這間公寓八十平方公尺。
    residential|adj.|住宅的|This is a quiet residential area.|這是一個安靜的住宅區。
    construction|n.|建設；施工|The road is closed due to construction.|道路因施工封閉。
    architect|n.|建築師|The architect designed the new library.|建築師設計了新圖書館。
    blueprint|n.|藍圖|The engineers studied the blueprints.|工程師研究了藍圖。
    site|n.|地點；工地|Visitors must wear helmets at the site.|訪客在工地必須戴安全帽。
    location|n.|地點|The new store is in a great location.|新店位在很好的地點。
    parking space|n.|停車位|Each tenant has one parking space.|每位房客有一個停車位。
    lot|n.|一塊地；停車場|They bought a lot to build a house.|他們買了一塊地蓋房子。
    occupy|v.|佔用；佔據|The company occupies three floors.|公司佔用三層樓。
    vacant|adj.|空著的|The office next door is vacant.|隔壁的辦公室空著。
    security guard|n.|保全|The security guard checked our badges.|保全檢查了我們的識別證。
    renovation|n.|翻修|The lobby is closed for renovation.|大廳因翻修而關閉。
    fire exit|n.|逃生出口|Do not block the fire exit.|請勿堵住逃生出口。
    sprinkler|n.|灑水器|The sprinklers water the lawn every morning.|灑水器每天早上幫草坪澆水。
    heating|n.|暖氣（系統）|The heating isn't working.|暖氣系統壞了。
    ventilation|n.|通風|The room has poor ventilation.|這個房間通風不良。
    lighting|n.|照明|The lighting in this room is too dim.|這個房間的照明太暗了。
    inspector|n.|檢查員|A building inspector will visit tomorrow.|建築檢查員明天會來。
    mortgage|n.|房貸|They took out a mortgage to buy the house.|他們辦房貸買了房子。
    premises|n.|場所；營業場所|Smoking is not allowed on the premises.|場所內禁止吸菸。
    layout|n.|配置；版面|We changed the layout of the office.|我們改變了辦公室的配置。
  `)),
  deck('en.green.bank.economy', '🌐', '經濟與市場', BIZ, enList(`
    economy|n.|經濟|The economy is growing slowly.|經濟成長緩慢。
    economic|adj.|經濟的|The country faces economic problems.|這個國家面臨經濟問題。
    industry|n.|產業|The tourism industry is growing.|觀光產業正在成長。
    market|n.|市場|The company wants to enter the Asian market.|公司想進入亞洲市場。
    growth|n.|成長|The company had strong growth this year.|公司今年成長強勁。
    decline|v./n.|下降；衰退|Sales declined last quarter.|上一季銷售下滑。
    rise|v./n.|上升|Prices rise every year.|物價每年上漲。
    inflation|n.|通貨膨脹|Inflation is rising.|通膨正在上升。
    recession|n.|經濟衰退|Many people lost their jobs during the recession.|經濟衰退期間很多人失業。
    unemployment|n.|失業|Unemployment fell to three percent.|失業率降到百分之三。
    interest rate|n.|利率|The bank raised its interest rate.|銀行調高了利率。
    stock market|n.|股市|The stock market fell today.|今天股市下跌。
    investor|n.|投資者|The investors are happy with the results.|投資人對結果很滿意。
    investment|n.|投資|Real estate is a good investment.|房地產是很好的投資。
    global|adj.|全球的|We are a global company.|我們是全球性的公司。
    international|adj.|國際的|She works for an international bank.|她在一家國際銀行工作。
    domestic|adj.|國內的|Domestic flights leave from Terminal 1.|國內航班從第一航廈出發。
    foreign|adj.|外國的|We accept foreign currency.|我們接受外幣。
    competition|n.|競爭；比賽|Competition in this market is strong.|這個市場的競爭很激烈。
    compete|v.|競爭|We compete with larger companies.|我們和較大的公司競爭。
    monopoly|n.|壟斷|The company has a monopoly on the market.|那家公司壟斷了市場。
    supply and demand|phr.|供需|Prices depend on supply and demand.|價格取決於供需。
    outlook|n.|前景|The economic outlook is good.|經濟前景良好。
    boom|n.|繁榮；熱潮|There is a building boom in the city.|這座城市正迎來建築熱潮。
    tariff|n.|關稅|The government raised tariffs on imported cars.|政府提高了進口車的關稅。
  `)),
  deck('en.green.bank.verbs1', '🏃', '商務動詞 ①', CORE, enList(`
    achieve|v.|達成|We achieved our sales goal.|我們達成了業績目標。
    analyze|v.|分析|We need to analyze the data.|我們需要分析資料。
    coordinate|v.|協調|She coordinates the training program.|她負責協調訓練計畫。
    collaborate|v.|合作|We collaborate with several universities.|我們和幾所大學合作。
    conduct|v.|進行；實施|We conducted a survey of our customers.|我們對顧客進行了調查。
    determine|v.|決定；查明|The price will be determined later.|價格稍後決定。
    develop|v.|開發；發展|They are developing a new product.|他們正在開發新產品。
    ensure|v.|確保|Please ensure that all doors are locked.|請確保所有門都已上鎖。
    examine|v.|檢查；審查|The doctor examined the patient.|醫生檢查了病人。
    focus|v./n.|專注；重點|Let's focus on the main issue.|我們專注在主要議題上吧。
    implement|v.|實施|The new system will be implemented next month.|新系統將於下個月實施。
    indicate|v.|指出；表明|The survey indicates that customers are happy.|調查顯示顧客很滿意。
    maintain|v.|維持；保養|We must maintain high quality.|我們必須維持高品質。
    obtain|v.|取得|You must obtain permission first.|你必須先取得許可。
    participate|v.|參加|Everyone is encouraged to participate.|鼓勵大家參加。
    perform|v.|執行；表演|The software performs well.|這個軟體效能很好。
    predict|v.|預測|Experts predict strong sales.|專家預測業績會很強勁。
    present|v.|發表；呈現|She will present the results tomorrow.|她明天要發表結果。
    propose|v.|提議|I propose that we meet again next week.|我提議下週再開一次會。
    pursue|v.|追求；從事|She wants to pursue a career in law.|她想從事法律工作。
    submit|v.|提交|Please submit your report by Friday.|請在星期五前提交報告。
    measure|v./n.|測量；措施|We measure customer satisfaction every year.|我們每年測量顧客滿意度。
    modify|v.|修改|We modified the design.|我們修改了設計。
    select|v.|挑選|Please select a seat.|請選擇座位。
    adjust|v.|調整|You can adjust the height of the chair.|你可以調整椅子的高度。
  `)),
  deck('en.green.bank.verbs2', '🏃', '商務動詞 ②', CORE, enList(`
    accept|v.|接受|We accept all major credit cards.|我們接受各大信用卡。
    access|v./n.|存取；使用權|You can access the files from home.|你可以在家存取這些檔案。
    anticipate|v.|預期|We anticipate a busy season.|我們預期會是忙碌的季節。
    benefit|v./n.|有益於；好處|The new policy will benefit all employees.|新政策將使全體員工受益。
    contribute|v.|貢獻|Everyone contributed to the project.|每個人都對這個專案有貢獻。
    create|v.|創造|The project will create new jobs.|這個專案將創造新工作。
    deal with|v.|處理|I'll deal with the problem.|我來處理這個問題。
    demonstrate|v.|示範；展示|He demonstrated how to use the machine.|他示範了如何使用這台機器。
    encourage|v.|鼓勵|We encourage staff to share ideas.|我們鼓勵員工分享想法。
    exceed|v.|超過|Sales exceeded our expectations.|業績超出了我們的預期。
    extend|v.|延長；延伸|We extended the deadline by a week.|我們把截止日延長了一週。
    fulfill|v.|履行；完成|We were able to fulfill all the orders.|我們完成了所有訂單。
    generate|v.|產生|The new store will generate more sales.|新店將帶來更多業績。
    identify|v.|辨認；找出|We identified the cause of the problem.|我們找出了問題的原因。
    involve|v.|牽涉；包含|The job involves a lot of travel.|這份工作需要經常出差。
    justify|v.|證明…有理|Can you justify the cost?|你能說明這筆費用的合理性嗎？
    outsource|v.|外包|We outsource our customer service.|我們把客服外包出去。
    oversee|v.|監督|She oversees the marketing team.|她監督行銷團隊。
    prioritize|v.|排定優先順序|We need to prioritize these tasks.|我們需要排定這些工作的優先順序。
    reflect|v.|反映|The price reflects the high quality.|價格反映了高品質。
    reject|v.|拒絕|The client rejected our proposal.|客戶拒絕了我們的提案。
    specialize|v.|專精於|The firm specializes in tax law.|這家事務所專精於稅法。
    transform|v.|轉變|The internet transformed the way we shop.|網路改變了我們購物的方式。
    utilize|v.|利用|We utilize the latest technology.|我們運用最新科技。
    assess|v.|評估|We need to assess the risks.|我們需要評估風險。
  `)),
  deck('en.green.bank.adjectives', '🎨', '商務形容詞', CORE, enList(`
    efficient|adj.|有效率的|The new system is more efficient.|新系統更有效率。
    effective|adj.|有效的|This is an effective way to save money.|這是省錢的有效方法。
    accurate|adj.|準確的|Please make sure the numbers are accurate.|請確保數字正確。
    appropriate|adj.|適當的|Please wear appropriate clothing.|請穿著適當的服裝。
    competitive|adj.|有競爭力的|We offer competitive prices.|我們提供有競爭力的價格。
    considerable|adj.|相當大的|The project took a considerable amount of time.|這個專案花了相當多時間。
    eligible|adj.|有資格的|You are eligible for a discount.|您符合折扣資格。
    essential|adj.|必要的|Teamwork is essential for success.|團隊合作是成功的必要條件。
    exclusive|adj.|獨家的；專屬的|Members get exclusive offers.|會員享有獨家優惠。
    flexible|adj.|有彈性的|We offer flexible working hours.|我們提供彈性工時。
    innovative|adj.|創新的|The company is known for innovative products.|那家公司以創新產品聞名。
    mandatory|adj.|強制的|Attendance at the meeting is mandatory.|這場會議必須出席。
    optional|adj.|可選擇的|The tour on the last day is optional.|最後一天的行程可自由參加。
    overall|adj./adv.|整體的|Overall, the event was a success.|整體而言，活動很成功。
    preferred|adj.|偏好的；優先的|Please choose your preferred date.|請選擇您偏好的日期。
    previous|adj.|之前的|The previous manager retired last year.|前任經理去年退休了。
    primary|adj.|主要的|Our primary goal is customer satisfaction.|我們的主要目標是顧客滿意。
    productive|adj.|有生產力的|It was a very productive meeting.|那是一場很有成效的會議。
    profitable|adj.|有利潤的|The new store is very profitable.|新店非常賺錢。
    relevant|adj.|相關的|Please include all relevant information.|請附上所有相關資訊。
    responsible|adj.|負責的|Who is responsible for this project?|誰負責這個專案？
    sufficient|adj.|足夠的|We don't have sufficient funds.|我們的資金不足。
    upcoming|adj.|即將到來的|Please check the upcoming events.|請查看即將舉行的活動。
    valuable|adj.|有價值的|Thank you for your valuable advice.|感謝您寶貴的建議。
    various|adj.|各種的|We sell various kinds of tea.|我們販售各式各樣的茶。
  `)),
];
