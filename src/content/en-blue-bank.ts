// 英文藍色證書單字庫：多益 730 分以上常見的進階動詞、形容詞、副詞、名詞，金融、人資、行銷、專案管理用語，以及 Part 7 常見片語。
import type { Unit } from '../core/types';
import { deck, enList } from './dsl';

const VERB = '進階動詞';
const ADJ = '進階形容詞與副詞';
const NOUN = '進階名詞';
const FIELD = '專業領域';
const PHRASE = 'Part 7 片語';

export const BLUE_BANK: Unit[] = [
  deck('en.blue.bank.verbs1', '🏃', '進階動詞 ①', VERB, enList(`
    accommodate|v.|容納；通融|The hall can accommodate three hundred guests.|大廳可容納三百位賓客。
    accompany|v.|陪同；伴隨|Children must be accompanied by an adult.|兒童須由成人陪同。
    accumulate|v.|累積|You can accumulate points with every purchase.|每次消費都能累積點數。
    adhere|v.|遵守；黏附|All staff must adhere to the safety rules.|全體員工都必須遵守安全規定。
    administer|v.|管理；執行|The test is administered twice a year.|這項考試一年舉辦兩次。
    advocate|v./n.|提倡；擁護者|She advocates for flexible working hours.|她提倡彈性工時。
    alleviate|v.|減輕；緩和|The new road will alleviate traffic.|新道路將紓解交通。
    amend|v.|修訂|The contract was amended last week.|合約上週修訂了。
    appoint|v.|任命；指定|She was appointed head of sales.|她被任命為業務主管。
    assign|v.|分配；指派|The manager assigned the task to me.|經理把這項工作分派給我。
    attain|v.|達到|We attained our goal ahead of schedule.|我們提前達成了目標。
    bolster|v.|增強；支持|The ads helped bolster sales.|廣告幫助提振了業績。
    comprise|v.|包含；組成|The team comprises five engineers.|這個團隊由五名工程師組成。
    consolidate|v.|整合；合併|We consolidated our two offices into one.|我們把兩間辦公室整併成一間。
    constitute|v.|構成|Women constitute half of our staff.|女性佔我們員工的一半。
    convene|v.|召開|The board will convene next Monday.|董事會將於下週一召開。
    curtail|v.|削減；縮短|The company curtailed travel expenses.|公司削減了差旅費。
    designate|v.|指定|This area is designated for smoking.|這區是指定吸菸區。
    diminish|v.|減少；減弱|The noise diminished after midnight.|半夜過後噪音減少了。
    disclose|v.|透露；公開|The company did not disclose the price.|公司沒有透露價格。
    discontinue|v.|停止（生產、服務）|This model has been discontinued.|這款型號已經停產。
    dispose of|v.|處理掉；丟棄|Please dispose of the batteries properly.|請妥善處理廢電池。
    divert|v.|轉向；轉移|Traffic was diverted because of the accident.|因為車禍，交通被改道。
    endorse|v.|背書；代言|Several famous athletes endorse the brand.|好幾位知名運動員為這個品牌代言。
    enhance|v.|提升|The new software will enhance productivity.|新軟體將提升生產力。
  `)),
  deck('en.blue.bank.verbs2', '🏃', '進階動詞 ②', VERB, enList(`
    enforce|v.|執行；實施|The rules are strictly enforced.|規定嚴格執行。
    exempt|adj./v.|免除的；豁免|Food is exempt from sales tax.|食品免徵營業稅。
    expedite|v.|加速處理|Can you expedite the shipping?|可以加快出貨嗎？
    facilitate|v.|促進；使便利|The new system will facilitate communication.|新系統將促進溝通。
    finalize|v.|定案|We will finalize the contract tomorrow.|我們明天會敲定合約。
    formulate|v.|制定|We need to formulate a new plan.|我們需要制定新計畫。
    foster|v.|培養；促進|We want to foster a culture of teamwork.|我們想培養團隊合作的文化。
    hinder|v.|阻礙|Bad weather hindered the work.|惡劣天氣阻礙了工作。
    impose|v.|強加；課（稅）|The city imposed a new tax on hotels.|市政府對飯店課徵新稅。
    incorporate|v.|納入；合併|We incorporated your ideas into the design.|我們把你的想法納入了設計。
    initiate|v.|發起；開始|The company initiated a new recycling program.|公司發起了新的回收計畫。
    instruct|v.|指示；教導|Staff were instructed to leave the building.|員工被指示離開大樓。
    interrupt|v.|打斷|Sorry to interrupt, but you have a call.|抱歉打擾一下，你有電話。
    leverage|v.|善用|We can leverage our experience in Asia.|我們可以善用在亞洲的經驗。
    mitigate|v.|減輕|We took steps to mitigate the risk.|我們採取措施減輕風險。
    navigate|v.|導航；應付|The app helps you navigate the city.|這個應用程式幫你在城市裡導航。
    nominate|v.|提名|She was nominated for the award.|她被提名角逐這個獎。
    outperform|v.|表現優於|Our new product outperformed the competition.|我們的新產品表現優於競爭對手。
    overhaul|v./n.|徹底檢修；全面改革|The company overhauled its website.|公司全面改版了網站。
    overlook|v.|忽略；俯瞰|We overlooked a small mistake.|我們忽略了一個小錯誤。
    persuade|v.|說服|She persuaded the client to sign the contract.|她說服客戶簽了合約。
    precede|v.|在…之前|A short speech will precede the dinner.|晚宴前會有簡短致詞。
    preserve|v.|保存；保護|We must preserve the old building.|我們必須保存這棟老建築。
    procure|v.|取得；採購|We procured new computers for the office.|我們為辦公室採購了新電腦。
    prohibit|v.|禁止|Smoking is prohibited in all areas.|所有區域都禁止吸菸。
  `)),
  deck('en.blue.bank.verbs3', '🏃', '進階動詞 ③', VERB, enList(`
    qualify|v.|具備資格|You qualify for free shipping.|您符合免運資格。
    reassure|v.|使安心|The doctor reassured the patient.|醫生讓病人安心。
    reconcile|v.|核對；調和|Please reconcile the accounts at the end of the month.|請在月底核對帳目。
    refer|v.|提及；轉介|The doctor referred me to a specialist.|醫生把我轉介給專科醫師。
    refrain from|v.|避免；克制|Please refrain from using your phone.|請勿使用手機。
    reinforce|v.|強化|The training reinforced safety rules.|這次訓練強化了安全規定。
    relieve|v.|減輕；解除|This medicine will relieve the pain.|這個藥會減輕疼痛。
    render|v.|提供；使成為|We are grateful for the services you rendered.|我們很感謝您提供的服務。
    retain|v.|保留；留住|We want to retain our best employees.|我們想留住最優秀的員工。
    retrieve|v.|取回；檢索|You can retrieve your files from the server.|你可以從伺服器取回檔案。
    revoke|v.|撤銷|His license was revoked.|他的執照被吊銷了。
    safeguard|v./n.|保護；保障|We safeguard customer data.|我們保護顧客資料。
    scrutinize|v.|仔細檢查|The auditors scrutinized every document.|稽核員仔細檢查了每份文件。
    simplify|v.|簡化|We simplified the application process.|我們簡化了申請流程。
    solicit|v.|徵求；請求|We are soliciting feedback from customers.|我們正在徵求顧客的意見。
    stabilize|v.|穩定|Prices have stabilized.|價格已經穩定下來。
    stimulate|v.|刺激|The government cut taxes to stimulate the economy.|政府減稅以刺激經濟。
    streamline|v.|簡化（流程）|We streamlined the ordering process.|我們簡化了訂購流程。
    strengthen|v.|加強|We need to strengthen our brand.|我們需要強化品牌。
    subscribe|v.|訂閱|I subscribe to two business magazines.|我訂閱了兩本商業雜誌。
    substitute|v./n.|代替；替代品|You can substitute soy milk for regular milk.|你可以用豆漿代替一般牛奶。
    supervise|v.|監督|She supervises twenty workers.|她監督二十名員工。
    supplement|v./n.|補充；補充品|He supplements his income by teaching.|他靠教書增加收入。
    surpass|v.|超越|Sales surpassed last year's record.|業績超越了去年的紀錄。
    sustain|v.|維持；承受|The company cannot sustain these losses.|公司無法承受這些虧損。
  `)),
  deck('en.blue.bank.verbs4', '🏃', '進階動詞 ④', VERB, enList(`
    undergo|v.|經歷；接受|The building will undergo repairs next month.|這棟大樓下個月要進行修繕。
    undertake|v.|承擔；著手|The company will undertake a major project.|公司將承接一個大型專案。
    underestimate|v.|低估|Don't underestimate the competition.|不要低估競爭對手。
    unveil|v.|揭幕；公開|The company unveiled its new car.|公司發表了新車。
    uphold|v.|維護；堅守|We uphold high ethical standards.|我們堅守高道德標準。
    validate|v.|確認；使生效|Please validate your parking ticket at the front desk.|請在櫃台認證您的停車券。
    waive|v.|免除|The bank waived the annual fee.|銀行免除了年費。
    allot|v.|分配|Each speaker is allotted ten minutes.|每位講者分配到十分鐘。
    attribute|v.|歸因於|He attributes his success to hard work.|他把成功歸功於努力。
    commence|v.|開始|The ceremony will commence at ten.|典禮將於十點開始。
    compile|v.|彙編；收集|We compiled a list of suppliers.|我們彙整了一份供應商名單。
    convey|v.|傳達|Please convey my thanks to your team.|請代我向您的團隊致謝。
    deem|v.|認為|The plan was deemed too expensive.|這個計畫被認為太貴。
    deploy|v.|部署|We will deploy the new system next week.|我們下週將部署新系統。
    depict|v.|描繪|The painting depicts a busy market.|這幅畫描繪了熱鬧的市場。
    diversify|v.|多元化|The company diversified its products.|公司讓產品多元化。
    elevate|v.|提升|The new design elevates the brand image.|新設計提升了品牌形象。
    enact|v.|制定（法律）|The government enacted a new law.|政府制定了一項新法。
    exhibit|v./n.|展示；展覽品|The museum exhibits modern art.|博物館展出現代藝術。
    incur|v.|招致；產生（費用）|You may incur extra charges.|您可能會產生額外費用。
    oblige|v.|使有義務；施惠|We are obliged to inform you of any changes.|我們有義務通知您任何變更。
    pledge|v./n.|承諾；保證|The company pledged to cut emissions.|公司承諾減少排放。
    remit|v.|匯款|Please remit payment within thirty days.|請在三十天內匯款。
    specify|v.|具體說明|Please specify the size and color.|請具體註明尺寸和顏色。
    tailor|v.|量身打造|We tailor our services to your needs.|我們依您的需求量身打造服務。
  `)),
  deck('en.blue.bank.adj1', '🎨', '進階形容詞 ①', ADJ, enList(`
    adequate|adj.|足夠的；適當的|The room has adequate lighting.|房間的照明足夠。
    adjacent|adj.|鄰近的|The hotel is adjacent to the station.|飯店緊鄰車站。
    apparent|adj.|明顯的|It was apparent that he was tired.|很明顯他累了。
    applicable|adj.|適用的|Fill in all applicable fields.|請填寫所有適用的欄位。
    approximate|adj.|大約的|The approximate cost is two thousand dollars.|大約費用是兩千美元。
    attentive|adj.|細心的；周到的|The staff were very attentive.|員工非常周到。
    authentic|adj.|道地的；真正的|This restaurant serves authentic Thai food.|這家餐廳供應道地的泰國菜。
    beneficial|adj.|有益的|Exercise is beneficial to health.|運動對健康有益。
    comparable|adj.|可比較的；相當的|The two products are comparable in price.|這兩項產品的價格差不多。
    compatible|adj.|相容的|This software is compatible with most computers.|這個軟體和大部分電腦相容。
    comprehensive|adj.|全面的|We offer comprehensive insurance.|我們提供全面性的保險。
    confident|adj.|有信心的|I'm confident that we will win.|我有信心我們會贏。
    consecutive|adj.|連續的|Sales have risen for three consecutive years.|銷售額連續三年成長。
    consistent|adj.|一致的；穩定的|The quality is consistent.|品質很穩定。
    conventional|adj.|傳統的；慣例的|This is a conventional design.|這是傳統的設計。
    critical|adj.|關鍵的；批判的|This is a critical time for the company.|這是公司的關鍵時期。
    crucial|adj.|至關重要的|Timing is crucial in business.|在商場上時機至關重要。
    customary|adj.|慣例的|It is customary to tip in the United States.|在美國給小費是慣例。
    decisive|adj.|果斷的；決定性的|We need a decisive leader.|我們需要一位果斷的領導者。
    dedicated|adj.|專注的；專用的|She is a dedicated teacher.|她是一位盡心盡力的老師。
    dependable|adj.|可靠的|He is a dependable worker.|他是個可靠的員工。
    diverse|adj.|多元的|We have a diverse team.|我們的團隊很多元。
    eager|adj.|渴望的|She is eager to learn.|她很渴望學習。
    elaborate|adj./v.|精心的；詳細說明|They prepared an elaborate dinner.|他們準備了一頓精心的晚餐。
    enthusiastic|adj.|熱情的|The audience was enthusiastic.|觀眾非常熱情。
  `)),
  deck('en.blue.bank.adj2', '🎨', '進階形容詞 ②', ADJ, enList(`
    exceptional|adj.|優異的；例外的|She did an exceptional job.|她表現得非常出色。
    excessive|adj.|過多的|Excessive noise is not allowed.|不允許過度的噪音。
    extensive|adj.|廣泛的|He has extensive experience in sales.|他在業務方面經驗豐富。
    feasible|adj.|可行的|Is the plan feasible?|這個計畫可行嗎？
    frequent|adj.|頻繁的|He is a frequent customer.|他是常客。
    functional|adj.|實用的；運作中的|The design is simple and functional.|設計簡單又實用。
    generous|adj.|慷慨的|Thank you for your generous donation.|謝謝您慷慨的捐款。
    genuine|adj.|真正的|This bag is made of genuine leather.|這個包包是真皮做的。
    imperative|adj.|必要的|It is imperative that we act now.|我們必須立刻行動。
    inclusive|adj.|包含的|The price is inclusive of tax.|價格含稅。
    informative|adj.|資訊豐富的|The seminar was very informative.|研討會內容非常豐富。
    integral|adj.|不可或缺的|Customer service is an integral part of our business.|客服是我們業務不可或缺的一部分。
    intensive|adj.|密集的|I took an intensive English course.|我上了一門密集英文課。
    interim|adj.|臨時的；過渡的|She is the interim manager.|她是代理經理。
    knowledgeable|adj.|知識豐富的|Our staff are knowledgeable and friendly.|我們的員工知識豐富又友善。
    lucrative|adj.|有利可圖的|It is a lucrative business.|那是一門賺錢的生意。
    meticulous|adj.|一絲不苟的|She is meticulous about details.|她對細節一絲不苟。
    minimal|adj.|最低限度的|The damage was minimal.|損害很輕微。
    moderate|adj.|適度的；中等的|Prices are moderate.|價格適中。
    mutual|adj.|共同的；互相的|We have a mutual friend.|我們有一位共同的朋友。
    notable|adj.|值得注意的；著名的|There has been a notable increase in sales.|銷售額有顯著增加。
    noticeable|adj.|明顯的|There is a noticeable difference in quality.|品質有明顯差異。
    numerous|adj.|許多的|We received numerous complaints.|我們收到許多客訴。
    obsolete|adj.|過時的|This model is now obsolete.|這款型號已經過時了。
    outdated|adj.|過時的|The information is outdated.|這個資訊過時了。
  `)),
  deck('en.blue.bank.adj3', '🎨', '進階形容詞 ③', ADJ, enList(`
    persistent|adj.|持續的；堅持不懈的|He was persistent and finally got the job.|他堅持不懈，終於得到了這份工作。
    pertinent|adj.|相關的；中肯的|Please include all pertinent documents.|請附上所有相關文件。
    preliminary|adj.|初步的|The preliminary results look good.|初步結果看起來不錯。
    prestigious|adj.|有聲望的|She graduated from a prestigious university.|她畢業於一所名校。
    prominent|adj.|著名的；顯眼的|He is a prominent lawyer.|他是一位知名律師。
    prospective|adj.|未來的；潛在的|We welcome prospective students.|我們歡迎未來的學生。
    punctual|adj.|準時的|Please be punctual for the meeting.|開會請準時。
    rapid|adj.|快速的|The city has seen rapid growth.|這座城市快速成長。
    redundant|adj.|多餘的|Please remove redundant information.|請刪除多餘的資訊。
    reluctant|adj.|不情願的|He was reluctant to change his plans.|他不願意改變計畫。
    renowned|adj.|有名的|The hotel is renowned for its service.|這家飯店以服務聞名。
    respective|adj.|各自的|They returned to their respective offices.|他們回到各自的辦公室。
    robust|adj.|強健的；穩健的|The economy remains robust.|經濟依然強健。
    rigorous|adj.|嚴格的|All products go through rigorous testing.|所有產品都經過嚴格測試。
    routine|adj./n.|例行的|This is a routine inspection.|這是例行檢查。
    scarce|adj.|稀少的|Water is scarce in this region.|這個地區缺水。
    seasonal|adj.|季節性的|We hire seasonal workers in summer.|我們夏天會僱用季節性員工。
    selective|adj.|有選擇性的；挑剔的|The university is very selective.|這所大學錄取很挑剔。
    significant|adj.|重大的；顯著的|There was a significant drop in sales.|銷售額大幅下滑。
    simultaneous|adj.|同時的|There will be simultaneous translation.|會提供同步口譯。
    sophisticated|adj.|精密的；精緻的|The factory uses sophisticated machines.|工廠使用精密的機器。
    stable|adj.|穩定的|Prices have remained stable.|價格維持穩定。
    steady|adj.|穩定的|We have seen steady growth.|我們看到穩定的成長。
    stringent|adj.|嚴格的|The company has stringent safety rules.|公司有嚴格的安全規定。
    subsequent|adj.|隨後的|Subsequent meetings will be held online.|之後的會議將在線上舉行。
  `)),
  deck('en.blue.bank.adj4', '🎨', '進階形容詞 ④', ADJ, enList(`
    substantial|adj.|大量的；可觀的|We received a substantial discount.|我們得到了可觀的折扣。
    superior|adj.|較優的|Our products are of superior quality.|我們的產品品質較優。
    supplementary|adj.|補充的|Supplementary materials are available online.|補充教材可在網路上取得。
    tentative|adj.|暫定的|We have a tentative date for the meeting.|我們暫定了開會日期。
    thorough|adj.|徹底的|The police did a thorough search.|警方進行了徹底的搜查。
    tremendous|adj.|巨大的|The project was a tremendous success.|這個專案非常成功。
    unanimous|adj.|一致同意的|The decision was unanimous.|這個決定是全體一致通過的。
    unprecedented|adj.|史無前例的|The company saw unprecedented growth.|公司經歷了史無前例的成長。
    versatile|adj.|多用途的；多才多藝的|This is a versatile tool.|這是一個多用途的工具。
    viable|adj.|可行的|We need a viable solution.|我們需要可行的解決方案。
    vital|adj.|極重要的|Your support is vital to our success.|您的支持對我們的成功至關重要。
    accessible|adj.|可進入的；易取得的|The building is accessible by wheelchair.|這棟建築可以讓輪椅進出。
    advanced|adj.|進階的；先進的|This course is for advanced students.|這門課是給進階學生上的。
    ample|adj.|充足的|There is ample parking.|停車位很充足。
    complex|adj.|複雜的|This is a complex problem.|這是個複雜的問題。
    cooperative|adj.|合作的|The staff were very cooperative.|員工非常配合。
    definite|adj.|明確的|We need a definite answer by Friday.|我們需要在星期五前得到明確答覆。
    desirable|adj.|理想的；令人想要的|Experience in sales is desirable.|有業務經驗者佳。
    distinguished|adj.|傑出的|He is a distinguished scientist.|他是一位傑出的科學家。
    evident|adj.|明顯的|It was evident that the plan had failed.|很明顯計畫失敗了。
    favorable|adj.|有利的；贊同的|We received favorable reviews.|我們獲得了好評。
    hazardous|adj.|有危險的|Hazardous waste must be handled carefully.|有害廢棄物必須小心處理。
    inevitable|adj.|不可避免的|Some delays are inevitable.|有些延誤是不可避免的。
    initial|adj.|最初的|The initial cost is high.|初期費用很高。
    legitimate|adj.|合法的；正當的|Is this a legitimate business?|這是正當的生意嗎？
  `)),
  deck('en.blue.bank.adv1', '↪️', '進階副詞 ①', ADJ, enList(`
    accordingly|adv.|相應地；因此|Plans changed, so we adjusted the schedule accordingly.|計畫有變，所以我們相應調整了行程。
    adequately|adv.|充分地|The staff were not adequately trained.|員工沒有受到充分訓練。
    considerably|adv.|相當地|Prices have risen considerably.|價格上漲了不少。
    consistently|adv.|一貫地|She consistently meets her targets.|她總是達成目標。
    conveniently|adv.|方便地|The hotel is conveniently located.|飯店位置很方便。
    eventually|adv.|最終|Eventually, we reached an agreement.|最終我們達成了協議。
    exclusively|adv.|專門地；獨家地|This product is sold exclusively online.|這項產品只在網路上販售。
    extensively|adv.|廣泛地|She has traveled extensively in Asia.|她在亞洲到處旅行過。
    frequently|adv.|經常|These questions are frequently asked.|這些是常被問到的問題。
    gradually|adv.|逐漸地|Sales gradually improved.|業績逐漸改善。
    increasingly|adv.|越來越|Online shopping is increasingly popular.|網路購物越來越受歡迎。
    initially|adv.|起初|Initially, the plan seemed simple.|起初這個計畫看起來很簡單。
    mutually|adv.|互相地|We found a mutually agreeable time.|我們找到了雙方都同意的時間。
    namely|adv.|也就是|Two people were absent, namely Tom and Lisa.|有兩個人缺席，也就是湯姆和麗莎。
    notably|adv.|特別是；顯著地|Several cities, notably Tokyo, are very expensive.|有好幾個城市，特別是東京，物價都很高。
    occasionally|adv.|偶爾|I occasionally work on weekends.|我偶爾週末要工作。
    periodically|adv.|定期地|The machines are checked periodically.|機器會定期檢查。
    precisely|adv.|精確地；正是|The train left at precisely nine o'clock.|火車在九點整出發。
    primarily|adv.|主要地|The store sells primarily to young people.|這家店主要客群是年輕人。
    promptly|adv.|迅速地；準時地|The meeting started promptly at ten.|會議十點準時開始。
    rapidly|adv.|快速地|The company is growing rapidly.|公司成長迅速。
    readily|adv.|輕易地；樂意地|The information is readily available.|這些資訊很容易取得。
    relatively|adv.|相對地|The test was relatively easy.|考試相對簡單。
    roughly|adv.|大約|Roughly fifty people attended.|大約有五十人出席。
    significantly|adv.|顯著地|Costs have increased significantly.|成本顯著增加。
  `)),
  deck('en.blue.bank.adv2', '↪️', '進階副詞 ②', ADJ, enList(`
    simultaneously|adv.|同時地|The two events will take place simultaneously.|兩場活動將同時舉行。
    slightly|adv.|稍微|Prices rose slightly last month.|上個月價格稍微上漲。
    solely|adv.|唯一地；僅僅|You are solely responsible for your account.|您須獨自為您的帳戶負責。
    steadily|adv.|穩定地|Our sales have grown steadily.|我們的業績穩定成長。
    strictly|adv.|嚴格地|Smoking is strictly prohibited.|嚴格禁止吸菸。
    subsequently|adv.|隨後|He subsequently became the manager.|他後來成為經理。
    substantially|adv.|大幅地|Costs were reduced substantially.|成本大幅降低。
    temporarily|adv.|暫時地|The store is temporarily closed.|這家店暫停營業。
    thoroughly|adv.|徹底地|Please read the contract thoroughly.|請仔細閱讀合約。
    unanimously|adv.|一致地|The proposal was unanimously approved.|提案一致通過。
    ultimately|adv.|最終|Ultimately, the decision is yours.|最終決定權在你。
    approximately|adv.|大約|The flight takes approximately three hours.|飛行時間大約三小時。
    briefly|adv.|簡短地|Let me briefly explain the plan.|讓我簡短說明計畫。
    closely|adv.|密切地；仔細地|We are working closely with our partners.|我們和夥伴密切合作。
    comparatively|adv.|相對地|The rent here is comparatively low.|這裡的房租相對便宜。
    entirely|adv.|完全地|The decision is entirely up to you.|這完全由你決定。
    formerly|adv.|以前|The building was formerly a school.|這棟建築以前是學校。
    hardly|adv.|幾乎不|I could hardly hear him.|我幾乎聽不到他說話。
    heavily|adv.|大量地；嚴重地|It rained heavily all night.|下了一整晚大雨。
    largely|adv.|主要地；大部分|The project was largely successful.|專案大致上很成功。
    merely|adv.|僅僅|It was merely a suggestion.|那只是個建議。
    moderately|adv.|適度地|The restaurant is moderately priced.|這家餐廳價格中等。
    newly|adv.|新近地|We moved into a newly built office.|我們搬進了新落成的辦公室。
    previously|adv.|先前|I previously worked in Japan.|我之前在日本工作。
    specifically|adv.|特別地；明確地|The course is designed specifically for beginners.|這門課是專為初學者設計的。
  `)),
  deck('en.blue.bank.noun1', '🧩', '進階名詞 ①', NOUN, enList(`
    adjustment|n.|調整|We made a few adjustments to the schedule.|我們對行程做了一些調整。
    advancement|n.|晉升；進步|There are many opportunities for advancement.|有很多晉升機會。
    alliance|n.|聯盟|The two airlines formed an alliance.|兩家航空公司結成了聯盟。
    allowance|n.|津貼|Employees receive a travel allowance.|員工可以領交通津貼。
    alternative|n./adj.|替代方案|Is there an alternative?|有替代方案嗎？
    analysis|n.|分析|The analysis shows that sales are rising.|分析顯示銷售額正在上升。
    appliance|n.|家電|We sell kitchen appliances.|我們販售廚房家電。
    appraisal|n.|評估；估價|The house appraisal took two hours.|房屋估價花了兩個小時。
    arrangement|n.|安排|We made arrangements for the visitors.|我們為訪客做了安排。
    assessment|n.|評估|The assessment will be completed next week.|評估將在下週完成。
    assurance|n.|保證|We give you our assurance that it will be fixed.|我們向您保證會修好。
    authority|n.|權力；當局|Only the manager has the authority to approve it.|只有經理有權批准。
    authorization|n.|授權|You need authorization to enter this area.|進入這個區域需要授權。
    availability|n.|可用性；有空|Please let me know your availability.|請告訴我你什麼時候有空。
    bankruptcy|n.|破產|The company filed for bankruptcy.|公司申請破產。
    beneficiary|n.|受益人|She is the beneficiary of the insurance.|她是這份保險的受益人。
    breakthrough|n.|突破|Scientists made a major breakthrough.|科學家有了重大突破。
    circulation|n.|發行量；流通|The magazine has a circulation of one million.|這本雜誌的發行量有一百萬份。
    clearance|n.|清倉；許可|There is a clearance sale this weekend.|這個週末有清倉特賣。
    collaboration|n.|合作|The project is a collaboration between two firms.|這個專案是兩家公司的合作。
    commitment|n.|承諾；投入|Thank you for your commitment to the team.|感謝你對團隊的投入。
    complication|n.|併發症；複雜情況|There were some complications with the order.|訂單出了一些狀況。
    consensus|n.|共識|We reached a consensus.|我們達成了共識。
    consultation|n.|諮詢|We offer a free consultation.|我們提供免費諮詢。
    contingency|n.|意外事件；應變|We have a plan for every contingency.|我們對每種意外狀況都有應變計畫。
  `)),
  deck('en.blue.bank.noun2', '🧩', '進階名詞 ②', NOUN, enList(`
    criteria|n.|標準；準則|What are the criteria for the award?|這個獎的評選標準是什麼？
    delegation|n.|代表團|A delegation from Japan visited our factory.|日本代表團參觀了我們的工廠。
    discrepancy|n.|差異；不一致|There is a discrepancy in the figures.|數字有出入。
    disruption|n.|中斷；擾亂|The strike caused major disruptions.|罷工造成嚴重的中斷。
    diversity|n.|多樣性|We value diversity in the workplace.|我們重視職場的多元性。
    documentation|n.|文件；證明文件|Please provide the necessary documentation.|請提供必要的證明文件。
    eligibility|n.|資格|Check your eligibility before you apply.|申請前請確認你的資格。
    emphasis|n.|強調；重點|The company puts emphasis on safety.|公司重視安全。
    endorsement|n.|代言；支持|The singer signed an endorsement deal.|那位歌手簽了代言合約。
    enrollment|n.|註冊；入學人數|Enrollment opens in August.|八月開放註冊。
    excess|n./adj.|超過；過量|There is a fee for excess baggage.|超重行李要收費。
    exemption|n.|免除|You may qualify for a tax exemption.|你可能符合免稅資格。
    expertise|n.|專業知識|We need someone with expertise in finance.|我們需要有財務專業的人。
    feasibility|n.|可行性|We are studying the feasibility of the plan.|我們正在研究計畫的可行性。
    fluctuation|n.|波動|Fluctuations in currency affect our profits.|匯率波動影響我們的利潤。
    guideline|n.|指導方針|Please follow these guidelines.|請遵守這些指導方針。
    hazard|n.|危險|Wet floors are a safety hazard.|濕地板有安全危險。
    implementation|n.|實施|The implementation of the plan will take a year.|這個計畫的實施需要一年。
    incentive|n.|誘因；獎勵|We offer incentives to top salespeople.|我們提供獎勵給頂尖業務員。
    influx|n.|湧入|The city expects an influx of tourists.|這座城市預期觀光客將大量湧入。
    infrastructure|n.|基礎建設|The government will invest in infrastructure.|政府將投資基礎建設。
    initiative|n.|倡議；主動性|The new initiative aims to reduce waste.|新倡議的目標是減少浪費。
    insight|n.|洞見|The report gives insight into consumer behavior.|這份報告提供了對消費者行為的洞見。
    installation|n.|安裝|Installation is free.|免費安裝。
    integrity|n.|正直；誠信|We look for people with integrity.|我們要找正直的人。
  `)),
  deck('en.blue.bank.noun3', '🧩', '進階名詞 ③', NOUN, enList(`
    interruption|n.|中斷|Sorry for the interruption.|抱歉打擾了。
    investigation|n.|調查|The police started an investigation.|警方展開了調查。
    liability|n.|責任；負債|The company accepts no liability for lost items.|公司對遺失物品不負責任。
    limitation|n.|限制|There are some limitations on the offer.|這項優惠有一些限制。
    margin|n.|利潤；邊緣|Our margin on this product is small.|這項產品的利潤很薄。
    milestone|n.|里程碑|Reaching one million users was a milestone.|突破一百萬名使用者是一個里程碑。
    momentum|n.|動能；氣勢|The campaign is gaining momentum.|這場活動越來越有聲勢。
    objective|n.|目標|What is the main objective of the project?|這個專案的主要目標是什麼？
    occupancy|n.|入住率；佔用|The hotel has a high occupancy rate.|這家飯店的住房率很高。
    outcome|n.|結果|We are waiting for the outcome of the meeting.|我們在等會議的結果。
    oversight|n.|疏忽；監督|The error was due to an oversight.|錯誤是因為疏忽造成的。
    patron|n.|顧客；贊助者|The restaurant is popular with local patrons.|這家餐廳很受當地顧客歡迎。
    perspective|n.|觀點|Let's look at this from a different perspective.|我們從不同的觀點來看這件事吧。
    precaution|n.|預防措施|Take precautions against fire.|請做好防火措施。
    premium|n./adj.|保費；高級的|The insurance premium went up.|保費調漲了。
    preference|n.|偏好|Do you have a seating preference?|您對座位有偏好嗎？
    prerequisite|n.|先決條件|This course is a prerequisite for the advanced class.|這門課是進階課程的先修課。
    priority|n.|優先事項|Safety is our top priority.|安全是我們的首要任務。
    proceeds|n.|收益|The proceeds will go to charity.|收益將捐給慈善機構。
    proficiency|n.|精通；熟練|English proficiency is required.|需要精通英語。
    projection|n.|預測；投影|Sales projections for next year are strong.|明年的銷售預測很樂觀。
    provision|n.|規定；供應|The contract includes a provision for delays.|合約中有關於延誤的條款。
    publication|n.|出版品；發表|The report is ready for publication.|報告已準備好發表。
    quota|n.|配額|Each salesperson has a monthly quota.|每位業務員都有每月業績配額。
    ratio|n.|比率|The ratio of students to teachers is ten to one.|學生和老師的比例是十比一。
  `)),
  deck('en.blue.bank.noun4', '🧩', '進階名詞 ④', NOUN, enList(`
    recognition|n.|表揚；認可|She received recognition for her hard work.|她因努力工作受到表揚。
    refreshment|n.|茶點|Refreshments will be served after the talk.|演講後會提供茶點。
    reimbursement|n.|報銷；償還|Submit receipts for reimbursement.|請提交收據以申請報銷。
    reputation|n.|名聲|The hotel has an excellent reputation.|這家飯店名聲很好。
    resolution|n.|解決；決議|We hope for a quick resolution.|我們希望能盡快解決。
    retention|n.|保留；留任|Employee retention is a challenge.|留住員工是一項挑戰。
    scope|n.|範圍|That is outside the scope of the project.|那超出了專案的範圍。
    shortfall|n.|短缺；不足|There is a shortfall in the budget.|預算有缺口。
    stakeholder|n.|利害關係人|We will meet with all stakeholders.|我們將與所有利害關係人會面。
    statistics|n.|統計數據|The statistics show a rise in tourism.|統計數據顯示觀光業成長。
    subscription|n.|訂閱|Your subscription expires next month.|您的訂閱下個月到期。
    successor|n.|繼任者|Who will be her successor?|誰會是她的繼任者？
    surveillance|n.|監視|The store has surveillance cameras.|店裡有監視器。
    sustainability|n.|永續性|The company focuses on sustainability.|公司重視永續發展。
    threshold|n.|門檻|Sales passed the threshold of one million.|銷售額突破一百萬的門檻。
    tribute|n.|致敬|The concert was a tribute to the late singer.|這場演唱會是向已故歌手致敬。
    turnover|n.|營業額；人員流動率|The company has a high staff turnover.|公司的員工流動率很高。
    venture|n.|事業；冒險|The new venture was a success.|新事業很成功。
    workforce|n.|勞動力；全體員工|Our workforce has grown to five hundred.|我們的員工已增加到五百人。
    yield|n./v.|產量；產生|The investment yielded a good return.|這筆投資帶來不錯的報酬。
    accountability|n.|責任歸屬|We need more accountability in management.|管理階層需要更明確的責任歸屬。
    adherence|n.|遵守|Strict adherence to the rules is required.|必須嚴格遵守規定。
    affiliate|n./v.|附屬機構；隸屬|The hotel is an affiliate of a large chain.|這家飯店隸屬於一家大型連鎖集團。
    aptitude|n.|天資；才能|She has an aptitude for languages.|她很有語言天分。
    backlog|n.|積壓的工作|We have a backlog of orders.|我們有一堆積壓的訂單。
  `)),
  deck('en.blue.bank.finance', '💹', '金融與投資', FIELD, enList(`
    portfolio|n.|投資組合；作品集|She has a diverse investment portfolio.|她有多元的投資組合。
    equity|n.|股權；淨值|He owns ten percent equity in the company.|他擁有公司百分之十的股權。
    capital|n.|資本；首都|We need more capital to grow.|我們需要更多資本來成長。
    quarterly|adj./adv.|每季的|We publish a quarterly report.|我們每季發布報告。
    bond|n.|債券|Government bonds are a safe investment.|政府債券是安全的投資。
    commodity|n.|商品；原物料|Oil is an important commodity.|石油是重要的原物料。
    broker|n.|經紀人|She works as a stock broker.|她是股票經紀人。
    valuation|n.|估值|The company's valuation reached one billion dollars.|公司估值達到十億美元。
    collateral|n.|擔保品|The bank asked for collateral.|銀行要求提供擔保品。
    lender|n.|貸方；放款人|The lender approved the loan.|放款機構核准了貸款。
    borrower|n.|借款人|The borrower must repay the loan in five years.|借款人必須在五年內還款。
    repay|v.|償還|You can repay the loan in monthly installments.|您可以按月分期償還貸款。
    profit margin|n.|利潤率|We need to improve our profit margin.|我們需要提高利潤率。
    net|adj.|淨的|Our net profit rose by five percent.|我們的淨利成長了百分之五。
    gross|adj.|總的；毛的|What is your gross income?|你的總收入是多少？
    revenue stream|n.|收入來源|We want to add a new revenue stream.|我們想增加新的收入來源。
    financial statement|n.|財務報表|Please review the financial statements.|請審閱財務報表。
    annual report|n.|年報|The annual report will be published in April.|年報將於四月發布。
    stock price|n.|股價|The stock price rose sharply.|股價大幅上漲。
    risk|n.|風險|Every investment carries some risk.|每項投資都有一定風險。
    return on investment|n.|投資報酬率|The return on investment was high.|投資報酬率很高。
    liquidity|n.|流動性|The company has good liquidity.|公司的資金流動性良好。
    accrue|v.|累積（利息）|Interest accrues every month.|利息每月累積。
    default|n./v.|違約；預設|The company defaulted on its loan.|那家公司拖欠貸款。
    overdraft|n.|透支|There is a fee for overdrafts.|透支要收費。
  `)),
  deck('en.blue.bank.hr', '🧑‍🤝‍🧑', '人力資源進階', FIELD, enList(`
    staffing|n.|人員配置|We have staffing problems during holidays.|假期期間我們有人手配置的問題。
    recruitment|n.|招募|Recruitment for summer jobs begins in April.|暑期工作的招募四月開始。
    layoff|n.|裁員|The factory announced layoffs.|工廠宣布裁員。
    downsize|v.|縮編|The company plans to downsize next year.|公司計畫明年縮編。
    restructure|v.|重組|The bank restructured its departments.|銀行重組了各部門。
    succession|n.|繼承；接班|We need a clear succession plan.|我們需要明確的接班計畫。
    seniority|n.|年資|Promotions are based on seniority.|升遷依年資而定。
    headcount|n.|員工人數|We need to reduce headcount.|我們需要減少員工人數。
    telecommute|v.|遠距工作|Many employees telecommute twice a week.|許多員工一週遠距工作兩天。
    freelance|adj./adv.|自由業的|She works as a freelance designer.|她是自由接案的設計師。
    apprentice|n.|學徒|He started as an apprentice chef.|他從學徒廚師做起。
    internship|n.|實習|She did an internship at a bank.|她在銀行實習過。
    credentials|n.|資歷證明|Please bring your credentials to the interview.|面試時請帶你的資歷證明。
    competency|n.|能力|The test measures basic competency.|這項測驗評量基本能力。
    morale|n.|士氣|Staff morale is high.|員工士氣高昂。
    grievance|n.|申訴；不滿|Employees can file a grievance with human resources.|員工可以向人資部門提出申訴。
    harassment|n.|騷擾|The company has a strict policy against harassment.|公司對騷擾行為有嚴格規範。
    onboarding|n.|新人到職引導|Onboarding takes about two weeks.|新人到職引導大約兩週。
    job satisfaction|n.|工作滿意度|Job satisfaction is important for keeping staff.|工作滿意度對留才很重要。
    work environment|n.|工作環境|We provide a safe work environment.|我們提供安全的工作環境。
    labor|n.|勞動；勞工|Labor costs have increased.|勞動成本增加了。
    union|n.|工會|The union negotiated higher wages.|工會爭取到更高的工資。
    strike|n./v.|罷工|The workers went on strike.|工人們罷工了。
    dismiss|v.|解僱；駁回|He was dismissed for being late too often.|他因太常遲到被解僱。
    overtime pay|n.|加班費|Workers receive overtime pay on holidays.|假日工作有加班費。
  `)),
  deck('en.blue.bank.strategy', '🎯', '行銷與策略進階', FIELD, enList(`
    positioning|n.|定位|Brand positioning is key to success.|品牌定位是成功的關鍵。
    segment|n.|區隔；部分|This product targets a new market segment.|這項產品瞄準新的市場區隔。
    demographic|n./adj.|人口統計；族群|Our main demographic is young families.|我們的主要客群是年輕家庭。
    niche|n.|利基|The company found a niche in the market.|這家公司在市場上找到了利基。
    rebrand|v.|品牌重塑|The company decided to rebrand.|公司決定重塑品牌。
    testimonial|n.|顧客推薦見證|Read testimonials from our customers.|請看看我們顧客的推薦見證。
    word of mouth|n.|口碑|Most of our customers come by word of mouth.|我們大部分的顧客都是靠口碑來的。
    viral|adj.|爆紅的|The video went viral.|那支影片爆紅了。
    outreach|n.|推廣；外展服務|The museum runs an outreach program for schools.|博物館為學校舉辦推廣計畫。
    engagement|n.|參與；互動|Customer engagement on social media has increased.|顧客在社群媒體上的互動增加了。
    conversion|n.|轉換（率）|The website has a high conversion rate.|這個網站的轉換率很高。
    benchmark|n.|基準|We use last year's sales as a benchmark.|我們以去年的業績作為基準。
    competitive edge|n.|競爭優勢|Quality gives us a competitive edge.|品質讓我們具有競爭優勢。
    brand awareness|n.|品牌知名度|The campaign increased brand awareness.|這次活動提高了品牌知名度。
    consumer behavior|n.|消費者行為|We study consumer behavior.|我們研究消費者行為。
    customer retention|n.|留住顧客|Customer retention is cheaper than finding new customers.|留住舊客比開發新客便宜。
    pricing strategy|n.|定價策略|We changed our pricing strategy.|我們改變了定價策略。
    launch event|n.|發表會|The launch event will be held in Tokyo.|發表會將在東京舉行。
    focus group|n.|焦點團體|We tested the product with a focus group.|我們找焦點團體測試了產品。
    questionnaire|n.|問卷|Please fill out the questionnaire.|請填寫問卷。
    promotional|adj.|促銷的|We offer promotional prices this week.|本週我們提供促銷價。
    loyalty program|n.|會員忠誠計畫|Join our loyalty program and earn points.|加入我們的會員計畫賺取點數。
    market leader|n.|市場領導者|The company is the market leader in Asia.|這家公司是亞洲的市場龍頭。
    penetrate|v.|打入（市場）|We plan to penetrate the European market.|我們計畫打入歐洲市場。
    distinctive|adj.|獨特的|The brand has a distinctive logo.|這個品牌有獨特的標誌。
  `)),
  deck('en.blue.bank.project', '🗂️', '營運與專案管理', FIELD, enList(`
    deliverable|n.|交付成果|Please list the deliverables for each phase.|請列出每個階段的交付成果。
    timeline|n.|時程表|The timeline for the project is tight.|專案的時程很緊。
    kickoff|n.|啟動|The kickoff meeting is on Monday.|專案啟動會議在星期一。
    progress report|n.|進度報告|Please send a weekly progress report.|請每週寄送進度報告。
    status update|n.|進度更新|Can you give me a status update?|可以跟我說一下進度嗎？
    bottleneck|n.|瓶頸|The bottleneck is in the packing area.|瓶頸在包裝區。
    workflow|n.|工作流程|The new software improved our workflow.|新軟體改善了我們的工作流程。
    contingency plan|n.|應變計畫|We need a contingency plan in case of rain.|我們需要準備雨天的應變計畫。
    risk assessment|n.|風險評估|A risk assessment is required before the event.|活動前需要進行風險評估。
    resource|n.|資源|We don't have enough resources.|我們的資源不夠。
    feasibility study|n.|可行性研究|We conducted a feasibility study.|我們做了可行性研究。
    pilot program|n.|試行計畫|The pilot program will run for three months.|試行計畫將進行三個月。
    phase|n.|階段|The first phase is complete.|第一階段已經完成。
    roll out|v.|推出|We will roll out the new system in May.|我們將在五月推出新系統。
    quality assurance|n.|品質保證|Quality assurance tests every product.|品保部門測試每一項產品。
    best practice|n.|最佳做法|We follow industry best practices.|我們遵循業界的最佳做法。
    procedure|n.|程序|Please follow the safety procedures.|請遵守安全程序。
    protocol|n.|規範；協定|Follow the protocol in an emergency.|緊急時請依照規範處理。
    efficiency|n.|效率|We want to improve efficiency.|我們想提升效率。
    allocation|n.|分配|The allocation of funds was approved.|資金分配已獲核准。
    coordination|n.|協調|Good coordination between teams is essential.|團隊之間的良好協調是必要的。
    on track|phr.|按計畫進行|The project is on track.|專案按計畫進行中。
    wrap up|v.|結束；收尾|Let's wrap up the meeting.|我們結束會議吧。
    follow through|v.|貫徹到底|It's important to follow through on your promises.|履行承諾到底很重要。
    debrief|v./n.|任務後檢討|The team will debrief after the event.|活動結束後團隊會進行檢討。
  `)),
  deck('en.blue.bank.phrases1', '📌', 'Part 7 常見片語 ①', PHRASE, enList(`
    in accordance with|phr.|依照|Please act in accordance with the rules.|請依照規定行事。
    in light of|phr.|鑒於|In light of the weather, the event was canceled.|鑒於天氣狀況，活動取消了。
    on account of|phr.|由於|The flight was delayed on account of fog.|班機因起霧而延誤。
    in conjunction with|phr.|與…一起|The event is held in conjunction with the city.|這場活動與市政府合辦。
    with the exception of|phr.|除了…之外|The store is open daily with the exception of Monday.|除了星期一之外這家店每天營業。
    as of|phr.|自…起|As of April 1, the price will increase.|自四月一日起價格將調漲。
    prior to|phr.|在…之前|Please arrive prior to the start of the meeting.|請在會議開始前到達。
    subject to|phr.|受…約束；可能會|Prices are subject to change.|價格可能變動。
    regardless of|phr.|不論|Everyone pays the same price regardless of age.|不論年齡，每個人都付一樣的價錢。
    in terms of|phr.|就…而言|In terms of price, this is the best option.|就價格而言，這是最好的選擇。
    in the event of|phr.|萬一|In the event of fire, use the stairs.|萬一發生火災，請走樓梯。
    at the discretion of|phr.|由…決定|Refunds are given at the discretion of the manager.|是否退款由經理決定。
    on short notice|phr.|臨時通知|Thank you for coming on short notice.|謝謝你臨時接到通知還能趕來。
    until further notice|phr.|直到另行通知|The pool is closed until further notice.|游泳池暫停開放，直到另行通知。
    take effect|v.|生效|The new rules take effect next month.|新規定下個月生效。
    entitled to|phr.|有權享有|Members are entitled to a discount.|會員有權享有折扣。
    account for|v.|佔（比例）；說明|Online sales account for half of our revenue.|線上銷售佔我們營收的一半。
    look into|v.|調查|We will look into the problem.|我們會調查這個問題。
    carry out|v.|執行|We will carry out the survey next month.|我們下個月將執行調查。
    set aside|v.|撥出；留出|Please set aside some time for the training.|請撥出一些時間參加訓練。
    in place|phr.|就位；實施中|The new rules are now in place.|新規定已經實施。
    in addition to|phr.|除了…之外還有|In addition to salary, we offer bonuses.|除了薪水，我們還提供獎金。
    due to|phr.|由於|The game was canceled due to rain.|比賽因雨取消。
    as a result|phr.|結果；因此|Sales rose. As a result, we hired more staff.|業績上升，因此我們僱用了更多員工。
    in the meantime|phr.|在此期間|The new manager starts next month. In the meantime, Ms. Lin will help.|新經理下個月上任，在此期間由林小姐協助。
  `)),
  deck('en.blue.bank.phrases2', '📌', 'Part 7 常見片語 ②', PHRASE, enList(`
    in a timely manner|phr.|及時地|Please respond in a timely manner.|請及時回覆。
    at no extra cost|phr.|不另收費|Breakfast is included at no extra cost.|早餐不另收費。
    on a first come first served basis|phr.|先到先得|Seats are available on a first come first served basis.|座位先到先得。
    for further information|phr.|欲知詳情|For further information, please call us.|欲知詳情請來電。
    feel free to|phr.|請隨時|Feel free to contact me.|請隨時與我聯絡。
    aware of|adj.|知道；意識到|Please be aware of the new rules.|請注意新規定。
    up to date|adj.|最新的|Please keep your contact information up to date.|請保持聯絡資訊為最新。
    out of date|adj.|過時的|This map is out of date.|這張地圖過時了。
    at your earliest convenience|phr.|在您方便時盡早|Please reply at your earliest convenience.|請在您方便時盡早回覆。
    about to|phr.|即將|The meeting is about to start.|會議即將開始。
    on the other hand|phr.|另一方面|On the other hand, the cost is high.|另一方面，成本很高。
    in contrast|phr.|相比之下|In contrast, our competitor raised prices.|相比之下，我們的競爭對手漲價了。
    for instance|phr.|例如|Some cities, for instance Osaka, are cheaper.|有些城市，例如大阪，比較便宜。
    in particular|phr.|特別是|I like Italian food, pasta in particular.|我喜歡義大利菜，特別是義大利麵。
    as well as|phr.|以及|We sell books as well as magazines.|我們賣書也賣雜誌。
    rather than|phr.|而不是|Let's take the train rather than drive.|我們搭火車而不是開車吧。
    according to|phr.|根據|According to the report, sales are up.|根據報告，銷售額上升了。
    instead of|phr.|而不是；代替|You can use a credit card instead of cash.|你可以用信用卡代替現金。
    in favor of|phr.|贊成|Most members voted in favor of the plan.|大多數成員投票贊成這個計畫。
    on schedule|phr.|按時程|The project is on schedule.|專案按時程進行。
    at least|phr.|至少|Please arrive at least ten minutes early.|請至少提早十分鐘到。
    no later than|phr.|不晚於|Submit the form no later than Friday.|最晚請在星期五前提交表格。
    make sure|v.|確保|Please make sure the door is locked.|請確認門有上鎖。
    take part in|v.|參加|Everyone is welcome to take part in the event.|歡迎大家參加這場活動。
    look over|v.|瀏覽；檢查|Could you look over my report?|你可以幫我看一下報告嗎？
  `)),
];
