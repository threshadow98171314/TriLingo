// 英文金色證書單字庫：多益 860 分以上的高階字彙、商務搭配詞、片語動詞，以及 Part 5 常考的易混淆字。
import type { Unit } from '../core/types';
import { deck, enList } from './dsl';

const VERB = '高階動詞';
const ADJ = '高階形容詞';
const NOUN = '高階名詞';
const PHRASE = '搭配詞與片語動詞';
const TRAP = '易混淆字';

export const GOLD_BANK: Unit[] = [
  deck('en.gold.bank.verbs1', '🏃', '高階動詞 ①', VERB, enList(`
    abide by|v.|遵守|All members must abide by the rules.|所有會員都必須遵守規定。
    adjourn|v.|休會；延期|The meeting will adjourn at five.|會議將於五點休會。
    amass|v.|累積；積聚|He managed to amass a large fortune.|他累積了一大筆財富。
    append|v.|附加|Please append your signature to the form.|請在表格上簽名。
    articulate|v./adj.|清楚表達；口齒清晰的|She can articulate complex ideas clearly.|她能清楚表達複雜的想法。
    ascertain|v.|查明；確定|We need to ascertain the cause of the delay.|我們需要查明延誤的原因。
    attest|v.|證明|Our many awards attest to our quality.|我們獲得的眾多獎項證明了我們的品質。
    augment|v.|增加；擴大|He teaches at night to augment his income.|他晚上教課以增加收入。
    avert|v.|避免；防止|Quick action helped avert a crisis.|迅速的行動避免了一場危機。
    bestow|v.|授予|The prize is bestowed on one employee each year.|這個獎每年頒給一位員工。
    capitalize on|v.|利用；趁機|We should capitalize on this opportunity.|我們應該好好利用這個機會。
    cater to|v.|迎合；滿足需求|Our menu can cater to all tastes.|我們的菜單能滿足各種口味。
    coincide|v.|同時發生；一致|The sale will coincide with the holiday.|特賣活動將和連假同時進行。
    commemorate|v.|紀念|The statue commemorates the city's founder.|這座雕像紀念城市的創建者。
    commend|v.|稱讚；表揚|The manager commended the team for its hard work.|經理表揚了團隊的努力。
    compel|v.|迫使|The storm compelled us to cancel the trip.|暴風雨迫使我們取消旅行。
    concede|v.|承認；讓步|He conceded that the plan had problems.|他承認計畫有問題。
    concur|v.|同意|I concur with your opinion.|我同意你的意見。
    condense|v.|濃縮；精簡|Please condense the report into one page.|請把報告精簡成一頁。
    confer|v.|商議；授予|I need to confer with my partner first.|我需要先和我的合夥人商量。
    conform|v.|符合；遵守|All products must conform to safety standards.|所有產品都必須符合安全標準。
    corroborate|v.|證實|The data corroborates our findings.|資料證實了我們的發現。
    culminate|v.|達到頂點；以…告終|The tour will culminate in a gala dinner.|這趟行程將以盛大晚宴畫下句點。
    defer|v.|延期|You can defer payment until next month.|你可以延到下個月再付款。
    delineate|v.|描述；劃定|The contract delineates each party's duties.|合約明定了各方的職責。
  `)),
  deck('en.gold.bank.verbs2', '🏃', '高階動詞 ②', VERB, enList(`
    deplete|v.|耗盡|Our supplies are almost depleted.|我們的存貨快耗盡了。
    deter|v.|阻止；嚇阻|High prices may deter customers.|高價可能會讓顧客卻步。
    devise|v.|設計；想出|We devised a new plan to cut costs.|我們想出了降低成本的新方案。
    disburse|v.|支付；撥款|Funds will be disbursed next week.|款項將於下週撥付。
    discern|v.|辨別|It is hard to discern the difference.|很難分辨其中的差異。
    disseminate|v.|散播；傳播|The report was disseminated to all staff.|報告已發送給全體員工。
    dissuade|v.|勸阻|We tried to dissuade him from quitting.|我們試著勸他不要辭職。
    embark on|v.|開始；著手|The company will embark on a new project.|公司將展開一項新計畫。
    encompass|v.|包含；涵蓋|The course encompasses all areas of marketing.|這門課涵蓋行銷的所有領域。
    endeavor|v./n.|努力；嘗試|We endeavor to answer all emails within a day.|我們努力在一天內回覆所有郵件。
    entail|v.|牽涉；需要|The job entails a lot of paperwork.|這份工作需要處理很多文書。
    envision|v.|想像；展望|We envision a future without paper.|我們展望一個無紙化的未來。
    exacerbate|v.|使惡化|The rain exacerbated the traffic problems.|下雨使交通問題更加惡化。
    forfeit|v.|喪失；被沒收|You will forfeit your deposit if you cancel.|如果取消，訂金將不予退還。
    fortify|v.|強化；鞏固|The company fortified its position in the market.|公司鞏固了它在市場上的地位。
    gauge|v./n.|評估；測量儀|We sent a survey to gauge customer interest.|我們寄出問卷以評估顧客的興趣。
    hamper|v.|妨礙|Heavy snow hampered the rescue.|大雪妨礙了救援。
    harness|v.|利用；駕馭|We harness solar power to run the factory.|我們利用太陽能運轉工廠。
    heed|v.|注意；聽從|Please heed the warning signs.|請注意警告標誌。
    impede|v.|阻礙|Construction may impede traffic.|施工可能會妨礙交通。
    induce|v.|引起；勸誘|The drug may induce sleep.|這種藥可能會引起睡意。
    inhibit|v.|抑制|High taxes inhibit investment.|高稅負會抑制投資。
    intervene|v.|介入；干預|The manager had to intervene in the dispute.|經理不得不介入這場爭執。
    jeopardize|v.|危及|Being late could jeopardize the deal.|遲到可能會危及這筆交易。
    mandate|v./n.|規定；授權|The law mandates safety training for all workers.|法律規定所有員工都要接受安全訓練。
  `)),
  deck('en.gold.bank.verbs3', '🏃', '高階動詞 ③', VERB, enList(`
    merit|v./n.|值得；優點|The proposal merits further discussion.|這個提案值得進一步討論。
    mobilize|v.|動員|We mobilized volunteers to help with the cleanup.|我們動員志工協助清理。
    necessitate|v.|使成為必要|The change will necessitate new training.|這項變更將需要新的訓練。
    offset|v.|抵銷|Higher sales offset the rising costs.|較高的業績抵銷了上升的成本。
    outweigh|v.|勝過|The benefits outweigh the risks.|好處多於風險。
    overrule|v.|駁回；否決|The director overruled the decision.|主任否決了這個決定。
    preclude|v.|排除；阻止|Bad weather may preclude outdoor events.|惡劣天氣可能使戶外活動無法舉行。
    prescribe|v.|開（藥）；規定|The doctor prescribed some medicine.|醫生開了一些藥。
    prolong|v.|延長|We decided to prolong our stay.|我們決定延長住宿。
    quantify|v.|量化|It is hard to quantify the benefits.|好處很難量化。
    ratify|v.|批准|The agreement was ratified by both countries.|這項協議獲得兩國批准。
    rectify|v.|改正；糾正|We will rectify the error immediately.|我們會立刻更正錯誤。
    refurbish|v.|翻新|The hotel lobby was refurbished last year.|飯店大廳去年翻新過。
    reiterate|v.|重申|Let me reiterate our main goals.|讓我重申我們的主要目標。
    relinquish|v.|放棄；讓出|He relinquished control of the company.|他交出了公司的控制權。
    remedy|v./n.|補救；解決方法|We took steps to remedy the situation.|我們採取措施補救情況。
    replenish|v.|補充|Please replenish the paper in the printer.|請補充印表機的紙。
    rescind|v.|撤銷；廢除|The company rescinded the job offer.|公司撤銷了錄取通知。
    revamp|v.|改造；翻新|We revamped our website last month.|我們上個月改版了網站。
    revitalize|v.|使恢復活力|The new mall helped revitalize the area.|新購物中心讓這個地區恢復了活力。
    stipulate|v.|規定；訂明|The contract stipulates a delivery date.|合約明定了交貨日期。
    subside|v.|平息；減弱|The rain should subside by tonight.|雨勢應該會在今晚減弱。
    supersede|v.|取代|This version supersedes all earlier ones.|這個版本取代所有先前的版本。
    suspend|v.|暫停；停職|Train service was suspended due to the storm.|鐵路服務因暴風雨暫停。
    underscore|v.|強調|The report underscores the need for change.|報告強調了改變的必要。
  `)),
  deck('en.gold.bank.verbs4', '🏃', '高階動詞 ④', VERB, enList(`
    undermine|v.|削弱；破壞|Rumors can undermine trust.|謠言會破壞信任。
    withhold|v.|扣留；保留|The company may withhold payment until the work is done.|公司可能會等工作完成才付款。
    vouch for|v.|擔保；保證|I can vouch for his honesty.|我可以擔保他的誠實。
    proliferate|v.|激增；擴散|Coffee shops have proliferated in the city.|城裡的咖啡店如雨後春筍般增加。
    propel|v.|推動|Strong sales propelled the company to the top.|強勁的業績推動公司登上龍頭。
    abstain|v.|棄權；戒除|Two members abstained from the vote.|兩位成員投票時棄權。
    accredit|v.|認證；授權|The school is accredited by the government.|這所學校獲得政府認證。
    aggregate|adj./n./v.|總計的；合計|The aggregate cost was higher than expected.|總成本比預期高。
    apportion|v.|分配|The costs were apportioned among the partners.|費用由合夥人分攤。
    arbitrate|v.|仲裁|A third party will arbitrate the dispute.|將由第三方仲裁這起爭議。
    bypass|v./n.|繞過；繞道|The new road will bypass the city center.|新道路將繞過市中心。
    circumvent|v.|規避|They tried to circumvent the rules.|他們試圖規避規定。
    contend|v.|主張；競爭|Three companies are contending for the contract.|三家公司正在爭取這份合約。
    denote|v.|表示；代表|The red marks denote errors.|紅色記號表示錯誤。
    eradicate|v.|根除|The program aims to eradicate poverty.|這個計畫的目標是根除貧窮。
    evoke|v.|喚起|The song evokes happy memories.|這首歌喚起美好的回憶。
    exploit|v.|利用；剝削|We should exploit this new technology.|我們應該善用這項新技術。
    fabricate|v.|捏造；製造|He was accused of fabricating the data.|他被控捏造資料。
    liquidate|v.|清算；變賣|The company was forced to liquidate its assets.|公司被迫變賣資產。
    magnify|v.|放大|This lens can magnify objects ten times.|這個鏡頭能把物體放大十倍。
    obstruct|v.|阻塞；妨礙|Please do not obstruct the emergency exit.|請勿阻擋緊急出口。
    perpetuate|v.|使永久延續|Stereotypes are perpetuated by the media.|刻板印象被媒體延續下去。
    tabulate|v.|列表；製表|The results were tabulated in a spreadsheet.|結果被整理成試算表。
    suffice|v.|足夠|A short email will suffice.|一封簡短的郵件就足夠了。
    transcend|v.|超越|Good music transcends language.|好音樂超越語言。
  `)),
  deck('en.gold.bank.adj1', '🎨', '高階形容詞 ①', ADJ, enList(`
    abundant|adj.|豐富的|The region has abundant natural resources.|這個地區有豐富的天然資源。
    adverse|adj.|不利的|The drug has no adverse effects.|這種藥沒有不良反應。
    affluent|adj.|富裕的|They live in an affluent neighborhood.|他們住在富裕的社區。
    ambiguous|adj.|模稜兩可的|The instructions were ambiguous.|說明很含糊。
    arbitrary|adj.|任意的；武斷的|The decision seemed arbitrary.|這個決定看起來很武斷。
    auxiliary|adj.|輔助的；備用的|The hospital has an auxiliary power supply.|醫院有備用電源。
    candid|adj.|坦率的|Thank you for your candid feedback.|謝謝你坦率的意見。
    coherent|adj.|有條理的；連貫的|She gave a clear and coherent explanation.|她做了清楚有條理的說明。
    collective|adj.|集體的|It was a collective decision.|這是集體的決定。
    commensurate|adj.|相稱的|Salary will be commensurate with experience.|薪資將依經驗而定。
    compelling|adj.|令人信服的；引人入勝的|He made a compelling argument.|他提出了令人信服的論點。
    complacent|adj.|自滿的|We cannot become complacent after one success.|我們不能因為一次成功就自滿。
    concise|adj.|簡潔的|Please keep your answers concise.|請保持回答簡潔。
    conducive|adj.|有助於…的|A quiet room is conducive to study.|安靜的房間有助於讀書。
    conscientious|adj.|認真負責的|She is a conscientious worker.|她是個認真負責的員工。
    contemporary|adj.|當代的|The gallery shows contemporary art.|這間畫廊展出當代藝術。
    contingent|adj.|視…而定的|The deal is contingent on approval.|這筆交易視核准與否而定。
    cordial|adj.|親切的；誠摯的|We received a cordial welcome.|我們受到熱情的歡迎。
    cumulative|adj.|累積的|The cumulative effect of small changes is large.|小改變累積起來的影響很大。
    detrimental|adj.|有害的|Smoking is detrimental to your health.|抽菸有害健康。
    diligent|adj.|勤奮的|He is a diligent student.|他是個勤奮的學生。
    discreet|adj.|謹慎的；低調的|Please be discreet about this matter.|這件事請低調處理。
    eloquent|adj.|雄辯的；有說服力的|She gave an eloquent speech.|她發表了一場動人的演說。
    exemplary|adj.|模範的|His work has been exemplary.|他的工作表現堪稱模範。
    explicit|adj.|明確的|Please give explicit instructions.|請給予明確的指示。
  `)),
  deck('en.gold.bank.adj2', '🎨', '高階形容詞 ②', ADJ, enList(`
    exquisite|adj.|精美的|The hotel has an exquisite garden.|飯店有一座精緻的花園。
    fiscal|adj.|財政的；會計的|The government announced new fiscal policies.|政府宣布了新的財政政策。
    formidable|adj.|強大的；難以對付的|We face a formidable competitor.|我們面對一個強大的對手。
    impartial|adj.|公正的|The judge must be impartial.|法官必須公正。
    imminent|adj.|即將發生的|A storm is imminent.|暴風雨即將來臨。
    incidental|adj.|附帶的；伴隨的|There may be some incidental expenses.|可能會有一些附帶費用。
    indispensable|adj.|不可或缺的|She is an indispensable member of the team.|她是團隊中不可或缺的成員。
    inherent|adj.|固有的|There are risks inherent in any investment.|任何投資都有其固有風險。
    intricate|adj.|錯綜複雜的|The machine has an intricate design.|這台機器的設計很複雜精密。
    lenient|adj.|寬鬆的；寬大的|The new rules are more lenient.|新規定比較寬鬆。
    marginal|adj.|微小的；邊緣的|There was only a marginal increase in sales.|銷售額只有些微增加。
    negligent|adj.|疏忽的|The driver was found negligent.|司機被認定有過失。
    nominal|adj.|象徵性的；名義上的|There is a nominal fee for the service.|這項服務只收象徵性的費用。
    obligatory|adj.|義務的；必須的|Attendance is obligatory for all staff.|全體員工都必須出席。
    optimal|adj.|最佳的|The optimal temperature is twenty degrees.|最適溫度是二十度。
    paramount|adj.|最重要的|Safety is of paramount importance.|安全是最重要的。
    pivotal|adj.|關鍵的|She played a pivotal role in the project.|她在專案中扮演關鍵角色。
    plausible|adj.|似乎合理的|His explanation sounds plausible.|他的解釋聽起來合理。
    pragmatic|adj.|務實的|We need a pragmatic approach.|我們需要務實的做法。
    precarious|adj.|不穩定的；危險的|The company is in a precarious financial position.|公司的財務狀況岌岌可危。
    predominant|adj.|主要的；佔優勢的|English is the predominant language at the meeting.|會議中主要使用英語。
    proactive|adj.|主動積極的|We take a proactive approach to safety.|我們以主動積極的方式處理安全問題。
    proficient|adj.|熟練的|She is proficient in three languages.|她精通三種語言。
    prolific|adj.|多產的|He is a prolific writer.|他是一位多產作家。
    prudent|adj.|謹慎的；精明的|It would be prudent to save some money.|存點錢是明智的。
  `)),
  deck('en.gold.bank.adj3', '🎨', '高階形容詞 ③', ADJ, enList(`
    reciprocal|adj.|互惠的|The two countries signed a reciprocal agreement.|兩國簽署了互惠協定。
    reputable|adj.|有聲譽的|Buy only from reputable dealers.|只向有信譽的經銷商購買。
    resilient|adj.|有韌性的|The economy has proved resilient.|經濟展現了韌性。
    sporadic|adj.|零星的|There were sporadic showers in the afternoon.|下午有零星陣雨。
    stagnant|adj.|停滯的|Sales have been stagnant for months.|銷售額已停滯好幾個月。
    stationary|adj.|靜止的|The car was stationary when it was hit.|車子被撞時是靜止的。
    stellar|adj.|傑出的|She has a stellar reputation.|她的名聲非常好。
    strenuous|adj.|費力的|Avoid strenuous exercise after surgery.|手術後避免激烈運動。
    succinct|adj.|簡明扼要的|Please give a succinct summary.|請給一份簡明的摘要。
    superfluous|adj.|多餘的|Remove any superfluous words.|刪掉多餘的字。
    susceptible|adj.|易受影響的|Older people are more susceptible to the flu.|年長者比較容易感染流感。
    tangible|adj.|有形的；具體的|We need tangible results.|我們需要具體的成果。
    tedious|adj.|冗長乏味的|Data entry can be tedious.|資料輸入可能很乏味。
    transparent|adj.|透明的；公開的|The company wants to be transparent with customers.|公司希望對顧客公開透明。
    unforeseen|adj.|未預見的|The project was delayed due to unforeseen problems.|專案因意料之外的問題而延誤。
    unparalleled|adj.|無與倫比的|The hotel offers unparalleled views of the city.|飯店擁有無與倫比的城市景觀。
    unwavering|adj.|堅定的|Thank you for your unwavering support.|感謝您堅定的支持。
    vigilant|adj.|警覺的|Please remain vigilant at all times.|請隨時保持警覺。
    volatile|adj.|不穩定的；易變的|The stock market is volatile.|股市波動很大。
    worthwhile|adj.|值得的|The trip was worthwhile.|這趟旅程很值得。
    alternate|adj./v.|交替的；輪流|We hold meetings on alternate Mondays.|我們隔週一開會。
    collaborative|adj.|合作的|It was a collaborative effort.|這是合作努力的成果。
    conclusive|adj.|決定性的；確鑿的|There is no conclusive evidence.|沒有確鑿的證據。
    dormant|adj.|休眠的；靜止的|The account has been dormant for two years.|這個帳戶已經兩年沒有動靜。
    decent|adj.|像樣的；體面的|The hotel offers decent rooms at low prices.|這家飯店以低價提供像樣的房間。
  `)),
  deck('en.gold.bank.noun1', '🧩', '高階名詞 ①', NOUN, enList(`
    adversity|n.|逆境|She showed great courage in the face of adversity.|她在逆境中展現了極大的勇氣。
    affiliation|n.|隸屬關係|Please state your affiliation.|請說明您的所屬單位。
    anomaly|n.|異常|The auditor found an anomaly in the accounts.|稽核員在帳目中發現了異常。
    arbitration|n.|仲裁|The dispute went to arbitration.|這起爭議交付仲裁。
    attrition|n.|自然減員；耗損|The company reduced staff through attrition.|公司透過自然離職減少人力。
    autonomy|n.|自主權|Employees have a lot of autonomy here.|這裡的員工有很大的自主權。
    bureaucracy|n.|官僚體制|There is too much bureaucracy in the government.|政府的官僚作風太嚴重。
    caliber|n.|水準；才幹|We hire people of the highest caliber.|我們只聘用最高水準的人才。
    clientele|n.|（全體）客戶|The restaurant has a loyal clientele.|這家餐廳有一群忠實的客人。
    coalition|n.|聯盟|A coalition of businesses supports the plan.|一個企業聯盟支持這項計畫。
    conglomerate|n.|企業集團|The company was bought by a large conglomerate.|公司被一個大企業集團收購了。
    consortium|n.|財團；聯合企業|A consortium of banks will fund the project.|一個銀行財團將資助這項計畫。
    credibility|n.|可信度|The scandal damaged the company's credibility.|醜聞損害了公司的信譽。
    deterioration|n.|惡化|We noticed a deterioration in quality.|我們注意到品質下降了。
    discretion|n.|斟酌權；謹慎|Please use your discretion.|請自行斟酌。
    entity|n.|實體；單位|The two companies are separate legal entities.|這兩家公司是不同的法律實體。
    franchise|n.|加盟店；經銷權|He owns a fast food franchise.|他擁有一家速食加盟店。
    hierarchy|n.|階層；等級制度|The company has a flat hierarchy.|公司的階層很扁平。
    impetus|n.|推動力|The new law gave impetus to green energy.|新法推動了綠色能源的發展。
    inception|n.|開始；創辦|The company has grown rapidly since its inception.|公司自創立以來快速成長。
    jurisdiction|n.|管轄權|This case is outside our jurisdiction.|這個案件不在我們的管轄範圍內。
    leeway|n.|迴旋餘地|The schedule gives us some leeway.|這個時程讓我們有一些彈性空間。
    liaison|n.|聯絡人；聯繫|She acts as a liaison between the two teams.|她擔任兩個團隊之間的聯絡人。
    moratorium|n.|暫停；延期償付|The city put a moratorium on new buildings.|市政府暫停核准新建築。
    overhead|n.|營運費用；經常開支|We moved to a smaller office to reduce overhead.|我們搬到較小的辦公室以減少營運開支。
  `)),
  deck('en.gold.bank.noun2', '🧩', '高階名詞 ②', NOUN, enList(`
    paradigm|n.|典範；模式|The internet created a new business paradigm.|網路創造了新的商業模式。
    prerogative|n.|特權；權利|Hiring is the manager's prerogative.|聘用是經理的權限。
    proximity|n.|鄰近|The hotel is popular due to its proximity to the airport.|這家飯店因鄰近機場而很受歡迎。
    quorum|n.|法定人數|We cannot vote without a quorum.|沒有達到法定人數就不能表決。
    rapport|n.|融洽關係|She has a good rapport with her clients.|她和客戶的關係很融洽。
    recourse|n.|求助；追索權|We may have to take legal recourse.|我們可能必須尋求法律途徑。
    remuneration|n.|報酬|The job offers attractive remuneration.|這份工作的報酬很吸引人。
    repercussion|n.|（不良）後果|The decision had serious repercussions.|這個決定帶來了嚴重的後果。
    stipulation|n.|規定；條款|The contract includes a stipulation about payment.|合約中有關於付款的規定。
    surcharge|n.|附加費|There is a fuel surcharge on all flights.|所有航班都有燃油附加費。
    synergy|n.|綜效；協同作用|The merger will create synergy between the two firms.|合併將為兩家公司帶來綜效。
    tenure|n.|任期；終身職|During his tenure, sales doubled.|在他任內，業績倍增。
    transparency|n.|透明度|We value transparency in our business.|我們重視經營的透明度。
    trajectory|n.|軌跡；發展方向|The company is on an upward trajectory.|公司正處於上升軌道。
    upkeep|n.|維護費用；保養|The upkeep of the building is expensive.|這棟建築的維護費很高。
    accolade|n.|讚譽；獎項|The film received many accolades.|這部電影獲得許多讚譽。
    aftermath|n.|餘波；後果|Many businesses closed in the aftermath of the storm.|暴風雨過後，許多商家停業了。
    backlash|n.|強烈反彈|The price increase caused a backlash from customers.|漲價引起顧客強烈反彈。
    caveat|n.|警告；但書|There is one caveat: the offer ends Friday.|有一點要注意：優惠星期五結束。
    cornerstone|n.|基石|Trust is the cornerstone of our business.|信任是我們事業的基石。
    downturn|n.|衰退；下滑|The company survived the economic downturn.|公司撐過了經濟衰退。
    endowment|n.|捐贈基金|The university has a large endowment.|這所大學有一大筆捐贈基金。
    hindrance|n.|阻礙|The old system is a hindrance to growth.|舊系統是成長的阻礙。
    insolvency|n.|無力償債|The firm is facing insolvency.|這家公司面臨無力償債的困境。
    litigation|n.|訴訟|The case is in litigation.|這個案子正在訴訟中。
  `)),
  deck('en.gold.bank.collocations', '🧷', '商務搭配詞', PHRASE, enList(`
    meet a deadline|v.|趕上截止期限|We worked late to meet a deadline.|我們為了趕上截止期限而加班。
    meet the requirements|v.|符合要求|All applicants must meet the requirements.|所有應徵者都必須符合要求。
    make a reservation|v.|預約；訂位|I'd like to make a reservation for two.|我想訂兩個人的位子。
    make a payment|v.|付款|You can make a payment online.|您可以線上付款。
    file a complaint|v.|提出申訴|You can file a complaint with the manager.|你可以向經理提出申訴。
    file a claim|v.|提出（理賠）申請|You should file a claim with your insurance company.|你應該向保險公司申請理賠。
    raise funds|v.|募款|The school is trying to raise funds for a new gym.|學校正在為新體育館募款。
    hold a meeting|v.|舉行會議|We will hold a meeting next Tuesday.|我們下週二將舉行會議。
    chair a meeting|v.|主持會議|Ms. Kim will chair a meeting on the budget tomorrow.|金小姐明天將主持一場預算會議。
    take over|v.|接管；接手|Mr. Lee will take over the project next week.|李先生下週將接手這個專案。
    take into account|v.|考慮到|We must take into account the cost of shipping.|我們必須把運費考慮進去。
    take advantage of|v.|利用；把握|Take advantage of our special offer.|把握我們的特別優惠。
    take place|v.|舉行；發生|The conference will take place in Seoul.|研討會將在首爾舉行。
    give a presentation|v.|做簡報|She will give a presentation on the new product.|她將針對新產品做簡報。
    run a business|v.|經營事業|It isn't easy to run a business.|經營事業並不容易。
    reach an agreement|v.|達成協議|We hope to reach an agreement soon.|我們希望很快達成協議。
    sign a contract|v.|簽約|The two companies will sign a contract next month.|兩家公司下個月將簽約。
    cover the cost|v.|支付費用|The company will cover the cost of training.|公司會支付培訓費用。
    pay off|v.|還清；有回報|Hard work will pay off.|努力會有回報。
    cut back on|v.|減少|We need to cut back on spending.|我們需要減少開支。
    come up with|v.|想出|Can you come up with a better idea?|你能想出更好的點子嗎？
    put off|v.|延後|Don't put off your work until tomorrow.|不要把工作拖到明天。
    call off|v.|取消|They had to call off the game because of rain.|他們因雨不得不取消比賽。
    turn down|v.|拒絕；調低|She decided to turn down the job offer.|她決定拒絕這份工作。
    fill in|v.|填寫；代班|Please fill in your name and address.|請填寫姓名和地址。
  `)),
  deck('en.gold.bank.phrasal', '🧷', '片語動詞', PHRASE, enList(`
    bring up|v.|提出（話題）|I'll bring up the issue at the meeting.|我會在會議上提出這個問題。
    carry over|v.|延續；轉入|Unused vacation days carry over to next year.|沒用完的假可以累積到明年。
    catch up on|v.|補做；趕上|I need to catch up on my email.|我需要把積下的郵件處理完。
    drop off|v.|放下；送達|I'll drop off the documents at your office.|我會把文件送到你的辦公室。
    figure out|v.|想出；弄明白|We need to figure out how to fix it.|我們需要想出修好它的方法。
    get along with|v.|和…相處|It's easy to get along with him.|和他很好相處。
    go over|v.|檢查；複習|Let's go over the plan again.|我們再檢查一次計畫吧。
    hand in|v.|繳交|Please hand in your report by Friday.|請在星期五前交報告。
    keep up with|v.|跟上|It's hard to keep up with the latest trends.|很難跟上最新的潮流。
    lay off|v.|裁員|The company plans to lay off two hundred workers.|公司計畫裁員兩百人。
    lay out|v.|說明；規劃；陳列|Let me lay out the plan for you.|讓我向你說明這個計畫。
    line up|v.|排隊；安排|People line up early for the sale.|人們很早就來排隊搶購。
    live up to|v.|達到（期望）|The hotel did not live up to our expectations.|這家飯店不如我們的預期。
    make up for|v.|彌補|We will give you a discount to make up for the delay.|我們會給您折扣以彌補延誤。
    phase out|v.|逐步淘汰|The company will phase out its old models.|公司將逐步淘汰舊型號。
    point out|v.|指出|She was the first to point out the mistake.|她是第一個指出錯誤的人。
    run into|v.|偶遇；遇到（問題）|We may run into some problems.|我們可能會遇到一些問題。
    set out|v.|出發；著手|We set out early in the morning.|我們一大早就出發了。
    sort out|v.|解決；整理|I'll sort out the problem tomorrow.|我明天會解決這個問題。
    stand out|v.|突出；顯眼|Bright colors make the ad stand out.|鮮豔的顏色讓廣告更醒目。
    step down|v.|辭職；卸任|The CEO will step down next month.|執行長將於下個月卸任。
    sum up|v.|總結|To sum up, sales are growing.|總結來說，業績正在成長。
    take on|v.|承擔；接下|I can't take on any more work.|我無法再接更多工作了。
    turn out|v.|結果是|It may turn out to be a good idea.|結果可能會是個好主意。
    work out|v.|解決；健身；結果順利|I hope everything will work out.|希望一切都會順利。
  `)),
  deck('en.gold.bank.traps', '⚠️', '易混淆字（Part 5 陷阱）', TRAP, enList(`
    effect|n.|效果；影響|The new law will have a big effect on prices.|新法會對物價有很大影響。|※effect 多當名詞（影響、效果）；affect 是動詞（影響）。
    adopt|v.|採用；收養|The company decided to adopt a new system.|公司決定採用新系統。|※adopt＝採用、收養；adapt＝適應、改編。
    adapt|v.|適應；改編|It took me a month to adapt to the new job.|我花了一個月才適應新工作。|※adapt to＝適應；adopt＝採用。
    complement|v./n.|補足；相輔相成|The wine complements the meal perfectly.|這款酒和餐點非常相配。|※complement＝互補、搭配；compliment＝讚美。
    compliment|n./v.|讚美|She received many compliments on her speech.|她的演講獲得許多讚美。|※compliment＝讚美；complimentary＝免費招待的、讚美的。
    principal|adj./n.|主要的；校長；本金|The principal reason for the delay was the weather.|延誤的主要原因是天氣。|※principal＝主要的、校長；principle＝原則。
    principle|n.|原則|We never break our principles.|我們從不違背原則。|※principle＝原則；principal＝主要的、校長。
    stationery|n.|文具|Please order more stationery for the office.|請幫辦公室多訂一些文具。|※stationery（e，文具）；stationary（a，靜止的）。
    insure|v.|為…投保|Please insure the package before you send it.|寄出前請為包裹投保。|※insure＝投保；ensure＝確保。
    legible|adj.|（字跡）清楚可讀的|Please make sure your handwriting is legible.|請確保字跡清楚可讀。|※legible＝字跡清楚；eligible＝有資格的。
    proceed|v.|繼續進行；前往|Please proceed to gate five.|請前往五號登機門。|※proceed＝繼續、前往；precede＝在…之前。
    personal|adj.|個人的|Please do not make personal calls at work.|上班時請不要打私人電話。|※personal（個人的）；personnel（人事、全體員工）。
    loose|adj.|鬆的|This shirt is too loose.|這件襯衫太鬆了。|※loose（形容詞，鬆的）；lose（動詞，遺失、輸）。
    latter|n./adj.|後者|Of the two plans, I prefer the latter.|兩個計畫中，我比較喜歡後者。|※latter＝後者；later＝之後；former＝前者。
    respectful|adj.|恭敬的|Please be respectful to our guests.|請對我們的客人保持尊重。|※respectful（恭敬的）；respective（各自的）；respectable（體面的）。
    considerate|adj.|體貼的|It was very considerate of you to call.|你打電話來真是體貼。|※considerate（體貼的）；considerable（相當大的）。
    sensible|adj.|明智的；合理的|That sounds like a sensible plan.|那聽起來是個明智的計畫。|※sensible＝明智的；sensitive＝敏感的。
    sensitive|adj.|敏感的；機密的|This is sensitive information.|這是敏感資訊。|※sensitive＝敏感的；sensible＝明智的。
    imply|v.|暗示；意味著|Are you implying that I'm wrong?|你是在暗示我錯了嗎？|※imply（說話者暗示）；infer（聽者推斷）。
    infer|v.|推論；推斷|What can we infer from the data?|我們能從資料中推斷出什麼？|※infer（聽者推斷）；imply（說話者暗示）。
    continual|adj.|一再發生的|We are tired of the continual delays.|我們受夠了一再的延誤。|※continual（反覆、斷斷續續）；continuous（不間斷的）。
    continuous|adj.|連續不斷的|The machine runs on continuous power.|這台機器靠不間斷的電力運轉。|※continuous（不間斷）；continual（反覆發生）。
    further|adj./adv.|進一步的|For further details, please call us.|欲知進一步細節，請來電。|※further＝進一步（抽象）；farther＝更遠（距離）。
    advise|v.|建議；通知|I advise you to book early.|我建議你早點訂。|※advise 是動詞（s 發 z 音）；advice 是名詞。
    advice|n.|建議|Thank you for your advice.|謝謝你的建議。|※advice 是不可數名詞，不說 an advice；動詞是 advise。
  `)),
];
