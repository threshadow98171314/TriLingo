// 英文橘色證書單字庫：生活基礎單字（家人、住家、食物、服裝、天氣、時間、城市、交通、身體、學校）。
import type { Unit } from '../core/types';
import { deck, enList } from './dsl';

const LIFE = '生活基礎';
const TOWN = '城市與交通';
const BODY = '身體與學習';

export const ORANGE_BANK: Unit[] = [
  deck('en.orange.bank.people', '👪', '家人與人物', LIFE, enList(`
    family|n.|家人；家庭|My family lives in Tainan.|我的家人住在台南。
    parent|n.|父母（其中一方）|Parents must sign this form.|家長必須簽這張表。
    father|n.|父親|My father works at a bank.|我父親在銀行工作。
    mother|n.|母親|My mother cooks dinner every day.|我母親每天煮晚餐。
    son|n.|兒子|Their son is five years old.|他們的兒子五歲。
    daughter|n.|女兒|Her daughter goes to school by bus.|她女兒搭公車上學。
    brother|n.|兄弟|I have two brothers.|我有兩個兄弟。
    sister|n.|姊妹|My sister is a nurse.|我姊姊是護理師。
    husband|n.|丈夫|Her husband is a teacher.|她丈夫是老師。
    wife|n.|妻子|He went shopping with his wife.|他和太太去購物。
    child|n.|小孩|The child is playing in the park.|小孩在公園玩。
    baby|n.|嬰兒|The baby is sleeping.|小寶寶在睡覺。
    grandfather|n.|祖父；外公|My grandfather is eighty years old.|我爺爺八十歲了。
    grandmother|n.|祖母；外婆|I visit my grandmother every Sunday.|我每週日去看奶奶。
    uncle|n.|叔叔；舅舅|My uncle has a small restaurant.|我叔叔開了一間小餐廳。
    aunt|n.|阿姨；姑姑|My aunt lives in Japan.|我阿姨住在日本。
    cousin|n.|堂、表兄弟姊妹|My cousin is coming to visit.|我表哥要來玩。
    friend|n.|朋友|She is my best friend.|她是我最好的朋友。
    neighbor|n.|鄰居|Our neighbor has a big dog.|我們的鄰居養了一隻大狗。
    guest|n.|客人|We have guests for dinner tonight.|今晚有客人來吃晚餐。
    adult|n.|成人|Tickets are ten dollars for adults.|成人票十美元。
    teenager|n.|青少年|Many teenagers use this app.|很多青少年使用這個應用程式。
    member|n.|成員；會員|All members get a free drink.|所有會員都可免費獲得一杯飲料。
    boss|n.|老闆；上司|My boss is very kind.|我的老闆人很好。
    coworker|n.|同事|I had lunch with a coworker.|我和同事吃了午餐。
  `)),
  deck('en.orange.bank.home', '🏠', '住家', LIFE, enList(`
    house|n.|房子|They bought a new house.|他們買了新房子。
    apartment|n.|公寓|I live in a small apartment.|我住在一間小公寓。
    room|n.|房間|This room is too small.|這個房間太小了。
    kitchen|n.|廚房|My mother is in the kitchen.|我媽媽在廚房。
    bathroom|n.|浴室；洗手間|Where is the bathroom?|洗手間在哪裡？
    bedroom|n.|臥室|The house has three bedrooms.|這棟房子有三間臥室。
    living room|n.|客廳|The TV is in the living room.|電視在客廳。
    garden|n.|花園；庭院|My grandmother grows flowers in the garden.|奶奶在花園裡種花。
    garage|n.|車庫|The car is in the garage.|車子在車庫裡。
    door|n.|門|Please close the door.|請關門。
    window|n.|窗戶|Can I open the window?|我可以開窗嗎？
    floor|n.|地板；樓層|The office is on the fifth floor.|辦公室在五樓。
    wall|n.|牆壁|There is a clock on the wall.|牆上有一個時鐘。
    roof|n.|屋頂|There is snow on the roof.|屋頂上有雪。
    stairs|n.|樓梯|Please use the stairs.|請走樓梯。
    key|n.|鑰匙|I can't find my key.|我找不到我的鑰匙。
    sofa|n.|沙發|The cat is sleeping on the sofa.|貓在沙發上睡覺。
    bed|n.|床|I go to bed at eleven.|我十一點上床睡覺。
    chair|n.|椅子|Please sit on this chair.|請坐這張椅子。
    closet|n.|衣櫃；壁櫥|Put your coat in the closet.|把外套放進衣櫃裡。
    lamp|n.|燈；檯燈|Turn on the lamp, please.|請打開檯燈。
    mirror|n.|鏡子|She looked in the mirror.|她照了照鏡子。
    curtain|n.|窗簾|Please close the curtains.|請拉上窗簾。
    carpet|n.|地毯|The carpet is very soft.|地毯很柔軟。
    furniture|n.|家具|We need new furniture for the office.|我們辦公室需要新家具。
  `)),
  deck('en.orange.bank.items', '🧴', '日用品', LIFE, enList(`
    towel|n.|毛巾|Can I have another towel?|可以再給我一條毛巾嗎？
    soap|n.|肥皂|Wash your hands with soap.|用肥皂洗手。
    toothbrush|n.|牙刷|I forgot my toothbrush.|我忘了帶牙刷。
    umbrella|n.|雨傘|Take an umbrella with you.|帶把傘去吧。
    bag|n.|包包；袋子|Your bag is on the chair.|你的包包在椅子上。
    box|n.|箱子；盒子|Put the books in this box.|把書放進這個箱子。
    bottle|n.|瓶子|I bought a bottle of water.|我買了一瓶水。
    cup|n.|杯子|Would you like a cup of tea?|要來杯茶嗎？
    glass|n.|玻璃杯；玻璃|Can I have a glass of water?|可以給我一杯水嗎？
    plate|n.|盤子|Put the cake on a plate.|把蛋糕放在盤子上。
    bowl|n.|碗|I had a bowl of rice.|我吃了一碗飯。
    spoon|n.|湯匙|Could I have a spoon?|可以給我一支湯匙嗎？
    fork|n.|叉子|We need a knife and fork.|我們需要刀叉。
    knife|n.|刀子|Be careful with that knife.|小心那把刀。
    clock|n.|時鐘|The clock on the wall is slow.|牆上的時鐘慢了。
    watch|n.|手錶|My watch is five minutes fast.|我的手錶快了五分鐘。
    phone|n.|電話；手機|Please turn off your phone.|請關掉手機。
    battery|n.|電池|The battery is almost dead.|電池快沒電了。
    charger|n.|充電器|Do you have a phone charger?|你有手機充電器嗎？
    scissors|n.|剪刀|Can I borrow your scissors?|可以借我剪刀嗎？
    tape|n.|膠帶|Close the box with tape.|用膠帶把箱子封起來。
    pen|n.|筆|Can I use your pen?|可以用你的筆嗎？
    pencil|n.|鉛筆|Please write your name in pencil.|請用鉛筆寫你的名字。
    notebook|n.|筆記本|I wrote it in my notebook.|我把它寫在筆記本上了。
    calendar|n.|月曆；行事曆|I marked the date on my calendar.|我在行事曆上標記了日期。
  `)),
  deck('en.orange.bank.food', '🍞', '食物', LIFE, enList(`
    bread|n.|麵包|I buy bread every morning.|我每天早上買麵包。
    rice|n.|米飯|Would you like rice or bread?|您要飯還是麵包？
    egg|n.|蛋|I had two eggs for breakfast.|我早餐吃了兩顆蛋。
    meat|n.|肉|I don't eat much meat.|我不太吃肉。
    chicken|n.|雞肉；雞|I'll have the chicken, please.|我要雞肉。
    beef|n.|牛肉|This beef is very tender.|這牛肉很嫩。
    pork|n.|豬肉|This dish is made with pork.|這道菜是用豬肉做的。
    fish|n.|魚|We had fish for dinner.|我們晚餐吃了魚。
    vegetable|n.|蔬菜|Eat more vegetables.|多吃蔬菜。
    fruit|n.|水果|I eat fruit every day.|我每天吃水果。
    apple|n.|蘋果|An apple a day keeps the doctor away.|一天一蘋果，醫生遠離我。
    banana|n.|香蕉|Bananas are cheap here.|這裡的香蕉很便宜。
    potato|n.|馬鈴薯|I'd like baked potatoes with my steak.|我的牛排想搭配烤馬鈴薯。
    tomato|n.|番茄|Add some tomatoes to the salad.|在沙拉裡加些番茄。
    salad|n.|沙拉|I'll have a green salad.|我要一份蔬菜沙拉。
    soup|n.|湯|The soup of the day is corn soup.|今日例湯是玉米濃湯。
    sandwich|n.|三明治|I had a sandwich for lunch.|我午餐吃了三明治。
    noodles|n.|麵|Let's have noodles for lunch.|午餐吃麵吧。
    cheese|n.|起司|Would you like cheese on your burger?|你的漢堡要加起司嗎？
    butter|n.|奶油|Please pass the butter.|請把奶油遞給我。
    sugar|n.|糖|No sugar in my coffee, please.|我的咖啡不要加糖。
    salt|n.|鹽|Add a little salt.|加一點鹽。
    cake|n.|蛋糕|We bought a birthday cake.|我們買了生日蛋糕。
    cookie|n.|餅乾|She baked some cookies.|她烤了一些餅乾。
    steak|n.|牛排|How would you like your steak?|您的牛排要幾分熟？
  `)),
  deck('en.orange.bank.kitchen', '🍳', '飲料與廚房', LIFE, enList(`
    water|n.|水|Can I have some water?|可以給我一些水嗎？
    tea|n.|茶|Would you like some tea?|要喝點茶嗎？
    milk|n.|牛奶|I drink milk every morning.|我每天早上喝牛奶。
    juice|n.|果汁|One orange juice, please.|請給我一杯柳橙汁。
    beer|n.|啤酒|Two beers, please.|請給我們兩杯啤酒。
    wine|n.|葡萄酒|Would you like red wine or white wine?|您要紅酒還是白酒？
    coffee|n.|咖啡|Let's get some coffee.|我們去喝杯咖啡吧。
    lunch|n.|午餐|Let's have lunch together.|我們一起吃午餐吧。
    dinner|n.|晚餐|Dinner is ready.|晚餐準備好了。
    chef|n.|主廚|The chef made a special dish for us.|主廚為我們做了一道特別的菜。
    cook|v.|煮；做菜|My father likes to cook on weekends.|我父親週末喜歡下廚。
    bake|v.|烘焙|She bakes bread every Sunday.|她每週日烤麵包。
    boil|v.|煮沸；水煮|Boil the eggs for ten minutes.|把蛋煮十分鐘。
    fry|v.|油炸；煎|Fry the onions until they are brown.|把洋蔥炒到變褐色。
    taste|v./n.|嚐；味道|This soup tastes great.|這湯很好喝。
    sweet|adj.|甜的|This cake is too sweet.|這蛋糕太甜了。
    sour|adj.|酸的|The lemon is very sour.|檸檬很酸。
    bitter|adj.|苦的|This coffee is a little bitter.|這咖啡有點苦。
    salty|adj.|鹹的|The soup is too salty.|湯太鹹了。
    fresh|adj.|新鮮的|The fish here is very fresh.|這裡的魚很新鮮。
    hungry|adj.|餓的|I'm very hungry.|我好餓。
    thirsty|adj.|口渴的|I'm thirsty. Let's get a drink.|我口渴了，去買杯飲料吧。
    recipe|n.|食譜|Can you give me the recipe?|可以給我這道菜的食譜嗎？
    oven|n.|烤箱|Put the cake in the oven.|把蛋糕放進烤箱。
    refrigerator|n.|冰箱|Put the milk in the refrigerator.|把牛奶放進冰箱。
  `)),
  deck('en.orange.bank.clothes', '👕', '服裝', LIFE, enList(`
    shirt|n.|襯衫|He is wearing a white shirt.|他穿著白襯衫。
    jacket|n.|夾克；外套|Take a jacket. It's cold outside.|帶件外套，外面很冷。
    coat|n.|大衣|Where can I hang my coat?|我的大衣可以掛在哪裡？
    sweater|n.|毛衣|This sweater is warm.|這件毛衣很暖和。
    pants|n.|長褲|These pants are too long.|這條褲子太長了。
    skirt|n.|裙子|She bought a blue skirt.|她買了一條藍色裙子。
    dress|n.|洋裝|That dress looks good on you.|那件洋裝很適合你。
    suit|n.|西裝|He wears a suit to work.|他穿西裝上班。
    tie|n.|領帶|You don't need to wear a tie.|你不需要打領帶。
    shoes|n.|鞋子|Please take off your shoes.|請脫鞋。
    boots|n.|靴子|I need new boots for winter.|我需要新的冬靴。
    socks|n.|襪子|I bought three pairs of socks.|我買了三雙襪子。
    hat|n.|帽子|Wear a hat in the sun.|在太陽下要戴帽子。
    gloves|n.|手套|Don't forget your gloves.|別忘了手套。
    scarf|n.|圍巾|She is wearing a red scarf.|她圍著紅色圍巾。
    uniform|n.|制服|All staff must wear a uniform.|所有員工都必須穿制服。
    size|n.|尺寸|Do you have this in a smaller size?|這個有小一點的尺寸嗎？
    color|n.|顏色|What color do you like?|你喜歡什麼顏色？
    pocket|n.|口袋|My phone is in my pocket.|我的手機在口袋裡。
    button|n.|鈕扣；按鈕|Press this button to start.|按這個按鈕開始。
    belt|n.|皮帶|This belt is too tight.|這條皮帶太緊了。
    jeans|n.|牛仔褲|I usually wear jeans on weekends.|我週末通常穿牛仔褲。
    glasses|n.|眼鏡|I can't read without my glasses.|沒戴眼鏡我看不了字。
    ring|n.|戒指|He gave her a ring.|他送她一枚戒指。
    wear|v.|穿；戴|What should I wear to the party?|派對要穿什麼？
  `)),
  deck('en.orange.bank.weather', '🌤️', '天氣與季節', LIFE, enList(`
    weather|n.|天氣|How is the weather today?|今天天氣怎麼樣？
    sunny|adj.|晴朗的|It will be sunny tomorrow.|明天會是晴天。
    cloudy|adj.|多雲的|It's cloudy this morning.|今天早上多雲。
    rainy|adj.|下雨的|I don't like rainy days.|我不喜歡下雨天。
    windy|adj.|颳風的|It's very windy today.|今天風很大。
    snowy|adj.|下雪的|It was a snowy morning.|那是個下雪的早晨。
    hot|adj.|熱的|It's too hot to go outside.|太熱了，不想出門。
    cold|adj.|冷的|It's cold in this room.|這個房間很冷。
    warm|adj.|溫暖的|It's warm today.|今天很暖和。
    cool|adj.|涼爽的|It's cool in the evening.|晚上很涼爽。
    spring|n.|春天|Cherry blossoms bloom in spring.|櫻花在春天開。
    summer|n.|夏天|We go to the beach every summer.|我們每年夏天都去海邊。
    fall|n.|秋天|The leaves turn red in fall.|秋天葉子會變紅。
    winter|n.|冬天|Winter in Korea is very cold.|韓國的冬天非常冷。
    season|n.|季節|Which season do you like best?|你最喜歡哪個季節？
    temperature|n.|溫度；體溫|The temperature is twenty degrees.|溫度是二十度。
    degree|n.|度|It's thirty degrees outside.|外面三十度。
    forecast|n.|預報|The forecast says it will rain.|預報說會下雨。
    storm|n.|暴風雨|The storm closed the airport.|暴風雨讓機場關閉了。
    rain|n./v.|雨；下雨|It started to rain.|開始下雨了。
    snow|n./v.|雪；下雪|It snowed all night.|下了一整晚的雪。
    wind|n.|風|The wind is very strong.|風很大。
    cloud|n.|雲|There are no clouds in the sky.|天空中沒有雲。
    sky|n.|天空|The sky is blue today.|今天天空很藍。
    humid|adj.|潮濕的|Summer in Taipei is hot and humid.|台北的夏天又熱又潮濕。
  `)),
  deck('en.orange.bank.time', '🕒', '時間與頻率', LIFE, enList(`
    morning|n.|早上|I run every morning.|我每天早上跑步。
    afternoon|n.|下午|See you this afternoon.|今天下午見。
    evening|n.|傍晚；晚上|We're free this evening.|我們今晚有空。
    night|n.|夜晚|I work at night.|我晚上工作。
    noon|n.|中午|Let's meet at noon.|我們中午見吧。
    midnight|n.|午夜|The store is open until midnight.|這家店營業到午夜。
    hour|n.|小時|The trip takes two hours.|這趟旅程要兩小時。
    minute|n.|分鐘|Wait a minute, please.|請稍等一下。
    week|n.|星期；週|I'll see you next week.|下週見。
    month|n.|月|The rent is due at the end of the month.|房租月底到期。
    year|n.|年|I started this job last year.|我去年開始這份工作。
    date|n.|日期|What's the date today?|今天幾號？
    day off|n.|休假日|Tomorrow is my day off.|明天是我的休假日。
    tonight|adv./n.|今晚|What are you doing tonight?|你今晚要做什麼？
    ago|adv.|…之前|I came here two years ago.|我兩年前來到這裡。
    later|adv.|之後；稍後|I'll call you later.|我晚點打給你。
    soon|adv.|很快；不久|The bus will come soon.|公車很快就來了。
    already|adv.|已經|I have already eaten lunch.|我已經吃過午餐了。
    yet|adv.|還（沒）；已經（疑問句）|Have you finished yet?|你完成了嗎？
    still|adv.|仍然|He is still at the office.|他還在辦公室。
    always|adv.|總是|She always arrives early.|她總是很早到。
    usually|adv.|通常|I usually take the bus.|我通常搭公車。
    sometimes|adv.|有時候|Sometimes I work from home.|我有時候在家工作。
    often|adv.|經常|How often do you go to the gym?|你多常去健身房？
    never|adv.|從不|I never drink coffee at night.|我晚上從不喝咖啡。
  `)),
  deck('en.orange.bank.city', '🏙️', '城市與地點', TOWN, enList(`
    city|n.|城市|Taipei is a big city.|台北是個大城市。
    town|n.|城鎮|I grew up in a small town.|我在一個小鎮長大。
    village|n.|村莊|The village is near the mountains.|那個村莊靠近山區。
    street|n.|街道|The bank is on Main Street.|銀行在大街上。
    road|n.|道路|The road is closed today.|這條路今天封閉。
    corner|n.|轉角|Turn left at the corner.|在轉角左轉。
    bridge|n.|橋|Cross the bridge and turn right.|過橋後右轉。
    museum|n.|博物館|The museum is closed on Mondays.|博物館星期一休館。
    theater|n.|劇院；電影院|We met in front of the theater.|我們在劇院前碰面。
    stadium|n.|體育場|The stadium holds fifty thousand people.|這座體育場能容納五萬人。
    shop|n.|商店|There is a flower shop next to the station.|車站旁邊有一家花店。
    store|n.|商店|The store opens at ten.|那家店十點開門。
    mall|n.|購物中心|Let's go shopping at the mall.|我們去購物中心逛街吧。
    downtown|adv./n.|市中心|I work downtown.|我在市中心上班。
    building|n.|建築物；大樓|Our office is in that tall building.|我們的辦公室在那棟高樓裡。
    entrance|n.|入口|Meet me at the main entrance.|在大門口跟我碰面。
    exit|n.|出口|Use the north exit.|請走北出口。
    address|n.|地址|What's your address?|你的地址是什麼？
    church|n.|教堂|There is an old church in the town.|鎮上有一座老教堂。
    temple|n.|寺廟|We visited a famous temple in Kyoto.|我們參觀了京都一座有名的寺廟。
    zoo|n.|動物園|The children love the zoo.|孩子們很喜歡動物園。
    beach|n.|海灘|Let's go to the beach.|我們去海灘吧。
    mountain|n.|山|We climbed the mountain last weekend.|我們上週末去爬山。
    river|n.|河|There is a park by the river.|河邊有一座公園。
    neighborhood|n.|鄰近地區；社區|This is a quiet neighborhood.|這是個安靜的社區。
  `)),
  deck('en.orange.bank.transport', '🚗', '交通與問路', TOWN, enList(`
    car|n.|汽車|I go to work by car.|我開車上班。
    bus|n.|公車|The bus is late again.|公車又誤點了。
    taxi|n.|計程車|Let's take a taxi.|我們搭計程車吧。
    subway|n.|地鐵|The subway is faster than the bus.|地鐵比公車快。
    bike|n.|腳踏車|I ride my bike to school.|我騎腳踏車上學。
    truck|n.|卡車|A truck is parked in front of the store.|一輛卡車停在店門口。
    ship|n.|船|The ship leaves at noon.|船中午出發。
    plane|n.|飛機|The plane landed safely.|飛機安全降落了。
    driver|n.|司機；駕駛|The bus driver was very kind.|公車司機人很好。
    passenger|n.|乘客|All passengers must wear seat belts.|所有乘客都必須繫安全帶。
    seat|n.|座位|Is this seat taken?|這個位子有人坐嗎？
    ride|v.|搭乘；騎|Can you ride a bike?|你會騎腳踏車嗎？
    drive|v.|開車|I drive to work every day.|我每天開車上班。
    walk|v.|走路|It's a five minute walk from here.|從這裡走路五分鐘。
    cross|v.|穿越；過（馬路）|Cross the street at the light.|在紅綠燈處過馬路。
    turn|v.|轉彎|Turn right at the next corner.|在下一個轉角右轉。
    map|n.|地圖|Can you show me on the map?|可以在地圖上指給我看嗎？
    direction|n.|方向|Which direction is the station?|車站在哪個方向？
    left|n./adv.|左邊|The bank is on the left.|銀行在左邊。
    right|n./adv.|右邊|Turn right at the bank.|在銀行右轉。
    straight|adv.|直直地|Go straight for two blocks.|直走兩個街區。
    near|prep./adj.|在…附近|Is there a bank near here?|這附近有銀行嗎？
    far|adj./adv.|遠|Is the airport far from here?|機場離這裡遠嗎？
    block|n.|街區|The hotel is two blocks away.|飯店在兩個街區外。
    traffic light|n.|紅綠燈|Turn left at the traffic light.|在紅綠燈左轉。
  `)),
  deck('en.orange.bank.body', '🩺', '身體與健康', BODY, enList(`
    head|n.|頭|My head hurts.|我頭痛。
    face|n.|臉|Wash your face.|洗臉。
    eye|n.|眼睛|She has brown eyes.|她有一雙褐色的眼睛。
    ear|n.|耳朵|My ear hurts.|我耳朵痛。
    nose|n.|鼻子|I have a runny nose.|我流鼻水。
    mouth|n.|嘴巴|Open your mouth, please.|請張開嘴巴。
    tooth|n.|牙齒|I have a bad tooth.|我有一顆蛀牙。
    hand|n.|手|Raise your hand.|請舉手。
    arm|n.|手臂|I hurt my arm.|我手臂受傷了。
    leg|n.|腿|My legs are tired.|我的腿好累。
    foot|n.|腳|I walked here on foot.|我走路來的。
    back|n.|背；後面|My back hurts.|我背痛。
    stomach|n.|胃；肚子|I have a stomachache.|我肚子痛。
    heart|n.|心臟；心|Exercise is good for your heart.|運動對心臟有益。
    body|n.|身體|Sleep is important for your body.|睡眠對身體很重要。
    sick|adj.|生病的|I was sick yesterday.|我昨天生病了。
    pain|n.|疼痛|I have a pain in my knee.|我膝蓋痛。
    cough|n./v.|咳嗽|I have a bad cough.|我咳得很厲害。
    medicine|n.|藥|Take this medicine after meals.|飯後吃這個藥。
    doctor|n.|醫生|You should see a doctor.|你應該去看醫生。
    nurse|n.|護理師|The nurse took my temperature.|護理師幫我量了體溫。
    dentist|n.|牙醫|I have a dentist appointment today.|我今天要看牙醫。
    rest|n./v.|休息|You need to get some rest.|你需要休息一下。
    healthy|adj.|健康的|She eats healthy food.|她吃健康的食物。
    exercise|n./v.|運動|I exercise three times a week.|我一週運動三次。
  `)),
  deck('en.orange.bank.school', '🎒', '學校與學習', BODY, enList(`
    student|n.|學生|She is a university student.|她是大學生。
    teacher|n.|老師|My English teacher is from Canada.|我的英文老師來自加拿大。
    class|n.|課；班級|The class starts at nine.|課九點開始。
    lesson|n.|課程；一堂課|I take piano lessons on Saturdays.|我星期六上鋼琴課。
    homework|n.|作業|Did you finish your homework?|你作業寫完了嗎？
    test|n.|測驗|I have a math test tomorrow.|我明天有數學考試。
    exam|n.|考試|She passed the exam.|她通過了考試。
    grade|n.|成績；年級|I got a good grade in English.|我英文成績很好。
    question|n.|問題|Do you have any questions?|你有任何問題嗎？
    answer|n./v.|答案；回答|Please answer the question.|請回答這個問題。
    problem|n.|問題；麻煩|No problem.|沒問題。
    mistake|n.|錯誤|I made a mistake.|我犯了一個錯。
    dictionary|n.|字典|Look it up in the dictionary.|查一下字典。
    textbook|n.|課本|Open your textbook to page ten.|請把課本翻到第十頁。
    subject|n.|科目；主題|What is your favorite subject?|你最喜歡哪一科？
    math|n.|數學|Math is my favorite subject.|數學是我最喜歡的科目。
    science|n.|科學|She teaches science at a high school.|她在高中教自然科學。
    history|n.|歷史|I'm interested in Japanese history.|我對日本歷史很有興趣。
    language|n.|語言|How many languages do you speak?|你會說幾種語言？
    study|v.|讀書；學習|I study English every night.|我每晚讀英文。
    learn|v.|學習；學會|I want to learn Korean.|我想學韓文。
    teach|v.|教|Can you teach me how to swim?|你可以教我游泳嗎？
    practice|v./n.|練習|Practice makes perfect.|熟能生巧。
    understand|v.|理解；懂|I don't understand this word.|我不懂這個字。
    university|n.|大學|My brother goes to university in Taipei.|我哥哥在台北讀大學。
  `)),
];
