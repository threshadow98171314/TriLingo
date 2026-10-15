// 英文觀念講堂：多益各大題的解題技巧＋常考文法觀念。每篇最後有小測驗（cz：第一個選項是正確答案）。
import type { Concept } from '../core/types';
import { concept, cz, sec } from './dsl';

const S = '解題技巧';
const G = '文法觀念';

export const CONCEPTS: Concept[] = [
  // ───────── 解題技巧 ─────────
  concept(
    'en.c.overview',
    S,
    '🗺️',
    '多益總覽與時間分配',
    '200 題、兩小時：先知道每一大題考什麼、閱讀要怎麼分配 75 分鐘。',
    [
      sec('考試結構', ['多益聽力＋閱讀各 100 題、各 495 分，總分 990。聽力約 45 分鐘，跟著音檔走；閱讀 75 分鐘，時間自己分配。'], {
        table: [
          ['大題', '題型', '題數'],
          ['Part 1', '照片描述', '6'],
          ['Part 2', '應答問題', '25'],
          ['Part 3', '簡短對話', '39'],
          ['Part 4', '簡短獨白', '30'],
          ['Part 5', '句子填空', '30'],
          ['Part 6', '段落填空', '16'],
          ['Part 7', '單篇／多篇閱讀', '54'],
        ],
      }),
      sec('閱讀 75 分鐘的分配', ['建議 Part 5 約 10 分鐘（一題 20 秒）、Part 6 約 8 分鐘、Part 7 留 55 分鐘以上。Part 7 題數最多、最花時間，前面省下來的每一分鐘都要留給它。'], {
        tip: '卡住的題目先猜一個答案、做記號往下寫。多益答錯不倒扣，空白一定比猜錯虧。',
      }),
      sec('聽力的節奏', ['聽力每題之間有幾秒空檔：Part 3、4 要利用這段時間「先看下一組題目」，知道要聽什麼再聽。'], {
        tip: '某一題沒聽懂就果斷放掉，專心聽下一題，不要讓一題拖垮後面三題。',
      }),
    ],
    [
      cz('TOEIC has ___ questions in total.', ['200', '100', '150'], '多益總共有 200 題。', '聽力 100 題＋閱讀 100 題。'),
      cz('The reading section lasts ___ minutes.', ['75', '45', '120'], '閱讀測驗 75 分鐘。', '聽力約 45 分鐘、閱讀 75 分鐘。'),
      cz('Part 7 has the most questions, so you should save ___ time for it.', ['the most', 'the least', 'no'], 'Part 7 題數最多，要留最多時間。', 'Part 7 有 54 題，建議留 55 分鐘以上。'),
      cz('If you don’t know an answer, you should ___.', ['guess and move on', 'leave it blank', 'stop the test'], '不會的題目要猜一個答案再往下。', '多益答錯不倒扣，空白最虧。'),
      cz('In Parts 3 and 4, you should read the ___ before the audio starts.', ['questions', 'scripts', 'answers'], 'Part 3、4 要先看題目。', '先知道要聽什麼，聽的時候才抓得到重點。'),
    ],
  ),
  concept(
    'en.c.part1',
    S,
    '📷',
    'Part 1 照片描述：先看人、再看物',
    '照片題只描述「看得到的事實」：人在做什麼、東西在哪裡、處於什麼狀態。',
    [
      sec('人物照：抓動作', ['有人的照片，答案通常描述人「正在做的動作」，用現在進行式 is / are + V-ing。'], {
        ex: ['A woman is typing on a keyboard.|一位女士正在用鍵盤打字。', 'Some people are waiting in line.|有些人正在排隊。'],
        tip: '小心「動作錯一點點」的陷阱：照片是 holding（拿著）、選項說 putting on（正在穿上）就錯。',
      }),
      sec('物品照：抓位置與狀態', ['沒有人的照片，答案描述東西的位置或狀態，常用 There is / are、be + p.p.、has been + p.p.。'], {
        ex: ['Some chairs have been stacked in the corner.|有些椅子被疊放在角落。', 'A lamp is on the desk.|桌上有一盞燈。'],
        tip: '照片裡沒有人時，出現 is being + p.p.（正在被…）的選項幾乎都是錯的：沒有人怎麼「正在被做」？',
      }),
      sec('刪去法', ['聽到照片裡「沒有出現的東西」就刪；聽到照片裡有的字不代表對，常是用相同單字設計的陷阱。'], {}),
    ],
    [
      cz('(Photo: a man is reading a newspaper) A man is ___ a newspaper.', ['reading', 'buying', 'folding'], '一名男子正在看報紙。', '照片的動作是 reading，buying、folding 都是照片沒有的動作。'),
      cz('(Photo: an empty room with chairs in rows) Some chairs have been ___ in rows.', ['arranged', 'arranging', 'arrange'], '有些椅子已經排成一列一列。', 'have been + p.p. 表示「已經被…」，描述物品現在的狀態。'),
      cz('(Photo: no people) Which description is LEAST likely correct? ___', ['The floor is being cleaned.', 'The floor is clean.', 'There is a rug on the floor.'], '照片沒有人時，最不可能對的是哪一句？', 'is being cleaned 表示「正在被打掃」，照片沒有人就不可能。'),
      cz('(Photo: two women talking) The women are ___ each other.', ['facing', 'leaving', 'calling'], '兩位女士面對面。', 'facing 描述位置關係，是照片題的常客。'),
      cz('In Part 1, people’s actions are usually described with the ___ tense.', ['present progressive', 'past', 'future'], 'Part 1 的人物動作通常用現在進行式。', 'is / are + V-ing。'),
    ],
    '橘色',
  ),
  concept(
    'en.c.part2',
    S,
    '💬',
    'Part 2 應答問題：抓開頭的疑問詞',
    '只聽一次、沒有文字。前三個字決定答案方向；小心發音相似的陷阱。',
    [
      sec('疑問詞決定答案', ['Who 答人、When 答時間、Where 答地點、Why 答理由、How 答方法或程度。只要聽清楚第一個字，就能刪掉一半選項。'], {
        table: [
          ['問句開頭', '要找的答案'],
          ['Who', '人名、職稱、部門'],
          ['When', '時間（Next week. / At three.）'],
          ['Where', '地點（In the lobby.）'],
          ['Why', '理由（Because… / To…）'],
          ['How long / How often', '時間長度／頻率'],
        ],
      }),
      sec('相似音陷阱', ['選項裡出現和題目發音很像的字（copy／coffee、meeting／eating），通常是陷阱。'], {
        ex: ['Q: Where can I make copies? A: The copier is on the second floor.|哪裡可以影印？影印機在二樓。'],
        tip: '聽到和題目一模一樣或很像的字，先保持懷疑。',
      }),
      sec('「間接回答」常是正解', ['真實對話不一定直接回答：問「When is the meeting?」，答「It’s been postponed.」（延期了）或「Let me check my calendar.」（我查一下）都是正解。'], {
        tip: '直接答案找不到時，找「合理的回應」：反問、推給別人、說不知道，都可能是對的。',
      }),
    ],
    [
      cz('Q: When does the store open? A: ___', ['At nine o’clock.', 'Near the station.', 'Yes, it does.'], '店幾點開？九點。', 'When 問時間，答 At nine o’clock。'),
      cz('Q: Who is in charge of the project? A: ___', ['Ms. Kim from Marketing.', 'Next Monday.', 'In the conference room.'], '誰負責這個專案？行銷部的金小姐。', 'Who 問人。'),
      cz('Q: Why was the flight delayed? A: ___', ['Because of the bad weather.', 'At gate twelve.', 'Two hours ago.'], '班機為什麼延誤？因為天氣不好。', 'Why 問理由。'),
      cz('Q: When is the budget meeting? A: ___', ['It’s been postponed.', 'In the budget.', 'Yes, I met him.'], '預算會議什麼時候？延期了。', '間接回答也是正解；In the budget 是重複字陷阱。'),
      cz('Q: Would you like some coffee? A: ___', ['No, thanks. I just had some.', 'The copy machine is broken.', 'It’s on the table.'], '要不要喝咖啡？不用了，我剛喝過。', 'coffee 和 copy 發音相近是陷阱。'),
    ],
    '橘色',
  ),
  concept(
    'en.c.part34',
    S,
    '🎧',
    'Part 3／4 對話與獨白：先讀題、抓關鍵字',
    '一段話考三題，題目順序就是內容順序。先看題目再聽，邊聽邊作答。',
    [
      sec('先讀題目', ['音檔播放前，先看三個題目的關鍵字（who、what、why、when），知道要聽什麼。三題的答案依序出現在對話裡。'], {
        tip: '題目裡的人稱很重要：問「What does the man want?」就專心聽男生說的話。',
      }),
      sec('常見題型', ['主旨題（What are the speakers discussing?）答案多在開頭；細節題要聽具體的數字、地點；下一步題（What will the woman do next?）答案在最後。'], {
        ex: ['What is the purpose of the call?|這通電話的目的是什麼？', 'What will the speaker probably do next?|說話者接下來可能會做什麼？'],
      }),
      sec('同義改寫', ['正確選項很少用原句的字，而是換句話說：對話說 car broke down（車壞了），選項寫 vehicle problem（車輛問題）。'], {
        tip: '選項裡出現對話原封不動的字，反而要小心；看懂「意思一樣」才是重點。',
      }),
    ],
    [
      cz('Before the audio starts, you should read the ___.', ['questions', 'transcript', 'answer key'], '音檔開始前先讀題目。', '先知道要聽什麼。'),
      cz('The answer to “What will the man do next?” is usually near the ___ of the talk.', ['end', 'beginning', 'title'], '「接下來會做什麼」的答案通常在最後。', '下一步的行動通常在對話結尾。'),
      cz('In the talk: “My car broke down.” The answer choice probably says: ___', ['A vehicle problem', 'A broken phone', 'A new car'], '對話說車壞了，選項可能寫「車輛問題」。', '正解常是同義改寫。'),
      cz('“What are the speakers mainly discussing?” is a ___ question.', ['main idea', 'detail', 'inference'], '「主要在討論什麼」是主旨題。', '主旨題答案多在開頭。'),
      cz('The three answers usually appear in the ___ order as the questions.', ['same', 'reverse', 'random'], '三題的答案通常照題目順序出現。', '題目順序＝內容順序。'),
    ],
    '棕色',
  ),
  concept(
    'en.c.part5',
    S,
    '✏️',
    'Part 5 句子填空：先看選項判斷題型',
    '一題 20 秒的關鍵：先看四個選項長什麼樣，就知道這題在考什麼，常常不用讀完整句。',
    [
      sec('四種題型', ['先看選項：如果是同一個字的不同詞性（success／successful／successfully），就是詞性題；同一個動詞的不同形（attend／attended／attending），是動詞形態題；四個意思不同的字，是單字題；介系詞、連接詞混在一起，是連接詞題。'], {
        table: [
          ['選項長相', '題型', '要看哪裡'],
          ['同字根不同詞性', '詞性題', '空格前後的字'],
          ['同動詞不同形', '時態／語態題', '主詞、時間副詞、受詞'],
          ['意思不同的字', '單字題', '整句意思與搭配詞'],
          ['because / because of…', '連接詞 vs 介系詞', '後面接句子還是名詞'],
        ],
      }),
      sec('詞性題只看前後', ['冠詞後面、形容詞前面缺的是名詞；動詞前後缺的是副詞；be 動詞後面多半是形容詞。'], {
        ex: ['The new policy will be ___ next month. → effective|新政策下個月生效。', 'She spoke ___ about the plan. → confidently|她很有自信地談這個計畫。'],
        tip: '詞性題 5 秒就能解，把省下的時間留給 Part 7。',
      }),
      sec('單字題看搭配詞', ['單字題要看固定搭配：make a decision、meet a deadline、place an order。這種題目平常多讀例句最有效。'], {}),
    ],
    [
      cz('The manager approved the ___ to extend the deadline.', ['request', 'requested', 'requesting', 'requests to'], '經理批准了延長期限的請求。', 'the 後面要名詞；request 是名詞。'),
      cz('All employees must ___ the safety training by Friday.', ['complete', 'completion', 'completely', 'completed'], '所有員工必須在週五前完成安全訓練。', 'must 後面接原形動詞。'),
      cz('The sales team worked ___ to meet the target.', ['hard', 'hardly', 'hardness', 'harder than'], '業務團隊努力工作達成目標。', 'hard 當副詞是「努力地」；hardly 是「幾乎不」。'),
      cz('We need to ___ a decision before the end of the day.', ['make', 'do', 'take on', 'have to'], '我們要在今天結束前做出決定。', 'make a decision 是固定搭配。'),
      cz('The package arrived late ___ the snowstorm.', ['because of', 'because', 'although', 'so that'], '因為暴風雪，包裹晚到了。', '後面是名詞片語，用介系詞 because of。'),
    ],
    '棕色',
  ),
  concept(
    'en.c.part6',
    S,
    '🧩',
    'Part 6 段落填空：看上下文，不要只看一句',
    '和 Part 5 很像，但要看整段文章；每篇還有一題「選一個句子放進空格」。',
    [
      sec('時態要看整篇', ['同一封信裡，如果前面說會議「已經舉行」，空格就要用過去式；文章的時間點決定時態。'], {
        tip: '讀到空格時，往前後各看一句，確認時間和人稱。',
      }),
      sec('句子插入題', ['四個句子都文法正確，要選「和前後文接得起來」的那句。看空格前一句的最後、和後一句的開頭有沒有呼應（代名詞、連接副詞）。'], {
        ex: ['However, the deadline cannot be changed.|然而，期限不能改。', 'In addition, we will offer free shipping.|此外，我們會提供免運。'],
      }),
      sec('連接副詞', ['However（然而）、Therefore（因此）、In addition（此外）、For example（例如）、As a result（結果）——看前後兩句是轉折、因果還是補充。'], {
        table: [
          ['關係', '常用連接副詞'],
          ['轉折', 'However, Nevertheless'],
          ['因果', 'Therefore, As a result, Consequently'],
          ['補充', 'In addition, Moreover, Furthermore'],
          ['舉例', 'For example, For instance'],
        ],
      }),
    ],
    [
      cz('Sales fell last quarter. ___, we are hiring more staff.', ['However', 'Therefore', 'For example', 'As a result'], '上一季業績下滑；然而，我們還在增聘人手。', '前後意思相反，用轉折的 However。'),
      cz('The printer is broken. ___, please use the one on the third floor.', ['Therefore', 'However', 'In contrast', 'Otherwise'], '印表機壞了，因此請用三樓那台。', '前因後果，用 Therefore。'),
      cz('We offer free delivery. ___, members get a ten percent discount.', ['In addition', 'However', 'Instead', 'Otherwise'], '我們提供免費配送；此外，會員打九折。', '補充另一個好處，用 In addition。'),
      cz('The meeting ___ last Tuesday, so the minutes are now available.', ['was held', 'will be held', 'is holding', 'holds'], '會議上週二舉行，所以會議紀錄已經可以看了。', 'last Tuesday 是過去時間，用過去式被動。'),
      cz('Many products are on sale. ___, laptops are thirty percent off.', ['For example', 'However', 'Therefore', 'Instead'], '很多商品在特價，例如筆電打七折。', '舉出具體例子，用 For example。'),
    ],
    '綠色',
  ),
  concept(
    'en.c.part7',
    S,
    '📰',
    'Part 7 閱讀：先看題目，再回文章找',
    '54 題、時間最緊。不要從頭讀到尾：先看題目，帶著關鍵字回文章找答案。',
    [
      sec('題目導向的讀法', ['先看題目和選項，劃出關鍵字（人名、日期、數字），再回文章找對應的段落。主旨題通常看第一段就答得出來。'], {
        tip: '題目裡有「NOT」的題型（Which is NOT mentioned?）要逐一對照選項，最花時間，可以留到最後。',
      }),
      sec('常見題型', ['主旨（What is the purpose of the e-mail?）、細節（When will the event take place?）、推論（What is suggested about…?）、同義字（The word “address” in paragraph 2 is closest in meaning to…）、句子插入。'], {
        ex: ['What is the purpose of the notice?|這則公告的目的是什麼？', 'What is implied about Mr. Lee?|關於李先生，文中暗示了什麼？'],
      }),
      sec('多篇閱讀', ['兩篇、三篇文章一組的題目，至少有一題要「兩篇對照」才答得出來：例如第一篇是價目表、第二篇是訂購信，要算出總價。'], {
        tip: '多篇題組先看每篇的標題和類型（e-mail、廣告、表格），知道每篇在講什麼再作答。',
      }),
    ],
    [
      cz('The best first step in Part 7 is to read the ___.', ['questions', 'whole passage twice', 'title only'], 'Part 7 最好的第一步是先看題目。', '題目導向，帶著關鍵字找答案。'),
      cz('“What is the purpose of the letter?” The answer is usually in the ___ paragraph.', ['first', 'last', 'middle'], '「這封信的目的是什麼」答案通常在第一段。', '目的、主旨多在開頭。'),
      cz('A question with “NOT” takes the most time, so you can do it ___.', ['last', 'first', 'never'], 'NOT 題最花時間，可以留到最後。', '要逐一對照每個選項。'),
      cz('In a double passage, some questions require information from ___ texts.', ['both', 'neither', 'only the first'], '雙篇題組有些題目要兩篇對照。', '例如價目表＋訂購信算總價。'),
      cz('“The word ‘address’ is closest in meaning to ___.” (address the problem)', ['deal with', 'write down', 'live at'], 'address the problem 的 address 意思最接近「處理」。', '同義字題要看上下文，address 在這裡是動詞「處理」。'),
    ],
    '綠色',
  ),

  // ───────── 文法觀念 ─────────
  concept(
    'en.c.pos',
    G,
    '🔤',
    '詞性判斷：空格的位置決定答案',
    'Part 5 最多的題型。看字尾認詞性，看空格前後決定要哪一種。',
    [
      sec('看字尾認詞性', ['不用懂意思也能判斷詞性：字尾就是線索。'], {
        table: [
          ['詞性', '常見字尾', '例子'],
          ['名詞', '-tion, -ment, -ness, -ity, -ance', 'decision, payment, kindness, ability'],
          ['形容詞', '-ful, -ive, -able, -ous, -al', 'helpful, active, available, famous, annual'],
          ['副詞', '-ly', 'quickly, carefully, recently'],
          ['動詞', '-ize, -ify, -en', 'organize, notify, widen'],
        ],
      }),
      sec('位置規則', ['冠詞（a, the）或所有格（our, his）後面：名詞（或形容詞＋名詞）。be 動詞後面：形容詞。修飾動詞、形容詞或整句：副詞。'], {
        ex: ['Our ___ is to satisfy customers. → goal|我們的目標是讓顧客滿意。', 'The results were ___ positive. → extremely|結果非常正面。'],
        tip: '「冠詞＋___＋名詞」→ 形容詞；「冠詞＋形容詞＋___」→ 名詞。',
      }),
    ],
    [
      cz('The company announced the ___ of a new branch.', ['opening', 'open', 'opened', 'opens'], '公司宣布新分店開幕。', 'the 後面、of 前面要名詞；opening 是動名詞當名詞用。'),
      cz('Please read the instructions ___ before using the device.', ['carefully', 'careful', 'care', 'carefulness'], '使用裝置前請仔細閱讀說明。', '修飾動詞 read 要用副詞。'),
      cz('The hotel offers a ___ breakfast every morning.', ['delicious', 'deliciously', 'deliciousness', 'deliciouser'], '飯店每天早上提供美味的早餐。', '冠詞與名詞之間要形容詞。'),
      cz('Customer ___ is our top priority.', ['satisfaction', 'satisfy', 'satisfied', 'satisfying'], '顧客滿意是我們的首要任務。', '主詞位置要名詞，satisfaction 是名詞。'),
      cz('The new software is very ___ to use.', ['easy', 'easily', 'ease', 'easiness'], '新軟體非常好用。', 'be 動詞後面要形容詞。'),
    ],
    '棕色',
  ),
  concept(
    'en.c.tense',
    G,
    '⏰',
    '時態：跟著時間副詞走',
    '時態題先找句子裡的時間線索：yesterday、since、by next week…',
    [
      sec('時間線索對照', ['看到這些字，時態幾乎就決定了。'], {
        table: [
          ['時間線索', '時態', '例子'],
          ['yesterday, last week, ago', '過去式', 'We met last week.'],
          ['since, for, so far, recently', '現在完成式', 'She has worked here since 2020.'],
          ['tomorrow, next month', '未來式', 'The store will open next month.'],
          ['by + 未來時間', '未來完成式', 'By May, we will have finished.'],
          ['by the time + 過去事件', '過去完成式', 'The train had left by the time I arrived.'],
        ],
      }),
      sec('條件、時間子句用現在式', ['if、when、as soon as 引導的子句，雖然講的是未來，也用現在式。'], {
        ex: ['I will call you when I arrive.|我到了就打給你。', 'If it rains tomorrow, the event will be canceled.|如果明天下雨，活動會取消。'],
        tip: '「when I will arrive」是常見錯誤，多益很愛考。',
      }),
    ],
    [
      cz('Mr. Tan ___ for this company since 2018.', ['has worked', 'works', 'worked', 'will work'], '陳先生從 2018 年起就在這家公司工作。', 'since 用現在完成式。'),
      cz('The shipment ___ two days ago.', ['arrived', 'has arrived', 'arrives', 'will arrive'], '貨物兩天前到了。', 'ago 用過去式。'),
      cz('By the end of next year, we ___ three new stores.', ['will have opened', 'opened', 'have opened', 'open'], '到明年底，我們將已開設三家新店。', 'by + 未來時間用未來完成式。'),
      cz('Please let me know as soon as you ___ the report.', ['receive', 'will receive', 'received', 'receiving'], '收到報告請馬上告訴我。', 'as soon as 引導的時間子句用現在式代替未來。'),
      cz('When I arrived at the station, the train ___.', ['had already left', 'already leaves', 'has already left', 'will leave'], '我到車站時，火車已經開走了。', '比過去更早發生，用過去完成式。'),
    ],
    '綠色',
  ),
  concept(
    'en.c.passive',
    G,
    '🔄',
    '主動與被動：看後面有沒有受詞',
    '動詞後面有受詞用主動；主詞是「被做」的那一方、後面沒有受詞，就用被動（be + p.p.）。',
    [
      sec('判斷法', ['先問：主詞是做動作的人，還是被處理的東西？會議、報告、產品通常是「被」安排、「被」寄出。'], {
        ex: ['The report was submitted on time.|報告準時提交了。', 'We submitted the report on time.|我們準時提交了報告。'],
        tip: '空格後面直接接名詞（受詞）→ 主動；接 by…、介系詞片語或句點 → 被動。',
      }),
      sec('常考的被動片語', ['be expected to（預計）、be required to（被要求）、be scheduled for（預定）、be located in（位於）、be interested in（有興趣）。'], {
        ex: ['The new branch is located on Main Street.|新分店位於主街。', 'All visitors are required to sign in.|所有訪客都必須登記。'],
      }),
    ],
    [
      cz('The annual conference ___ in Tokyo next spring.', ['will be held', 'will hold', 'holds', 'is holding'], '年度會議明年春天將在東京舉行。', '會議是「被舉辦」，後面沒有受詞，用被動。'),
      cz('Our team ___ the new product last month.', ['launched', 'was launched', 'is launched', 'has been launched'], '我們團隊上個月推出了新產品。', '後面有受詞 the new product，用主動。'),
      cz('Employees are ___ to wear their ID badges.', ['required', 'requiring', 'require', 'requirement'], '員工必須配戴識別證。', 'be required to 是被動片語。'),
      cz('The museum is ___ near the central station.', ['located', 'locating', 'location', 'locate'], '博物館位於中央車站附近。', 'be located 表示「位於」。'),
      cz('The documents ___ by the manager yesterday.', ['were signed', 'signed', 'have signed', 'sign'], '文件昨天由經理簽了。', 'by + 動作者，用被動；yesterday 用過去式。'),
    ],
    '綠色',
  ),
  concept(
    'en.c.participle',
    G,
    '🎭',
    '分詞：-ing 是主動、-ed 是被動',
    'interesting 和 interested、attached 和 attaching：判斷「誰做、誰被影響」。',
    [
      sec('情緒形容詞', ['-ing 形容「帶來這種感覺的東西」，-ed 形容「有這種感覺的人」。'], {
        ex: ['The presentation was interesting.|簡報很有趣。', 'Everyone was interested in the presentation.|大家對簡報很感興趣。'],
        table: [
          ['-ing（令人…的）', '-ed（感到…的）'],
          ['boring', 'bored'],
          ['exciting', 'excited'],
          ['confusing', 'confused'],
          ['satisfying', 'satisfied'],
        ],
      }),
      sec('分詞修飾名詞', ['名詞自己做動作用 -ing，名詞被處理用 -ed。'], {
        ex: ['Please see the attached file.|請看附件檔案。', 'The man sitting by the window is our client.|坐在窗邊的那位是我們的客戶。'],
        tip: 'the attached document（被附上的文件）、the remaining seats（剩下的座位）、the proposed plan（被提出的計畫）都是多益常客。',
      }),
    ],
    [
      cz('The audience was ___ by the speaker’s story.', ['moved', 'moving', 'move', 'movement'], '觀眾被講者的故事感動了。', '人被感動用 -ed。'),
      cz('The tour was so ___ that some people fell asleep.', ['boring', 'bored', 'bore', 'boredom'], '導覽無聊到有人睡著了。', '令人無聊的東西用 -ing。'),
      cz('Please review the ___ contract and sign it.', ['attached', 'attaching', 'attach', 'attachment to'], '請檢閱附上的合約並簽名。', '合約是被附上的，用 -ed。'),
      cz('Tickets for the ___ concert are sold out.', ['upcoming', 'upcame', 'upcomed', 'upcomes'], '即將到來的演唱會門票賣完了。', 'upcoming 是「即將到來的」。'),
      cz('Customers ___ with the service can ask for a refund.', ['dissatisfied', 'dissatisfying', 'dissatisfy', 'dissatisfaction'], '對服務不滿意的顧客可以要求退款。', '顧客「感到」不滿意用 -ed。'),
    ],
    '藍色',
  ),
  concept(
    'en.c.relative',
    G,
    '🔗',
    '關係代名詞：who、which、that、whose、what',
    '用一個字把兩個句子接起來。先看前面的名詞是人還是物，再看後面缺什麼。',
    [
      sec('選哪一個', ['人用 who、物用 which、兩者都能用 that；後面接名詞表示所有關係用 whose；前面沒有名詞、自己就代表「…的東西」用 what。'], {
        table: [
          ['先行詞', '主格／受格', '所有格'],
          ['人', 'who（whom）/ that', 'whose'],
          ['物', 'which / that', 'whose'],
          ['沒有先行詞', 'what（＝the thing that）', '－'],
        ],
        ex: ['The woman who called you is my manager.|打給你的那位女士是我的經理。', 'This is the client whose order was delayed.|這是訂單延誤的那位客戶。'],
      }),
      sec('逗號後面不用 that', ['非限定用法（前面有逗號）只能用 who 或 which，不能用 that。'], {
        ex: ['Our CEO, who founded the company in 1990, will retire.|我們的執行長，也就是 1990 年創立公司的人，即將退休。'],
        tip: '看到「名詞 + ___ + 名詞 + 動詞」通常是 whose；「___ + 動詞」前面沒有名詞是 what。',
      }),
    ],
    [
      cz('The employee ___ won the award will give a speech.', ['who', 'which', 'whose', 'what'], '得獎的那位員工會致詞。', '先行詞是人、後面缺主詞，用 who。'),
      cz('We visited the factory ___ produces our parts.', ['that', 'who', 'whose', 'what'], '我們參觀了生產零件的工廠。', '先行詞是物，用 that 或 which。'),
      cz('She is the designer ___ work appeared in the magazine.', ['whose', 'who', 'which', 'that'], '她就是作品登上雜誌的那位設計師。', '後面接名詞 work，表示所有關係用 whose。'),
      cz('___ the customers want is faster delivery.', ['What', 'Which', 'That', 'Who'], '顧客想要的是更快的配送。', '前面沒有先行詞、代表「…的東西」，用 what。'),
      cz('The report, ___ was published last week, received good reviews.', ['which', 'that', 'what', 'who'], '那份上週發表的報告獲得好評。', '逗號後面的非限定用法，物要用 which。'),
    ],
    '藍色',
  ),
  concept(
    'en.c.conj',
    G,
    '🌉',
    '連接詞 vs 介系詞：後面接什麼？',
    'although／despite、because／because of、while／during：意思一樣，差別在後面接句子還是名詞。',
    [
      sec('一表搞定', ['連接詞後面接「主詞＋動詞」的句子；介系詞後面接名詞或 V-ing。'], {
        table: [
          ['意思', '連接詞（＋句子）', '介系詞（＋名詞）'],
          ['雖然', 'although, though, even though', 'despite, in spite of'],
          ['因為', 'because, since, as', 'because of, due to, owing to'],
          ['在…期間', 'while', 'during'],
          ['如果沒有', 'unless', 'without'],
        ],
        ex: ['Although it rained, the event was a success.|雖然下雨，活動還是很成功。', 'Despite the rain, the event was a success.|儘管下雨，活動還是很成功。'],
      }),
      sec('副詞不能連接兩個句子', ['however、therefore 是副詞，不能直接把兩個句子接在一起（要用分號或句號）。'], {
        tip: '先數空格後面有沒有動詞：有動詞 → 連接詞；只有名詞 → 介系詞。',
      }),
    ],
    [
      cz('___ the heavy traffic, she arrived on time.', ['Despite', 'Although', 'Because', 'However'], '儘管交通繁忙，她還是準時到了。', '後面是名詞片語，用介系詞 despite。'),
      cz('The flight was canceled ___ the pilot was sick.', ['because', 'because of', 'due to', 'despite'], '因為機長生病，班機取消了。', '後面是句子（主詞＋動詞），用連接詞 because。'),
      cz('Please turn off your phone ___ the performance.', ['during', 'while', 'when', 'as'], '表演期間請關手機。', '後面是名詞，用介系詞 during。'),
      cz('You cannot enter the building ___ you have an ID card.', ['unless', 'without', 'despite', 'during'], '除非你有識別證，否則不能進入大樓。', '後面是句子，用連接詞 unless。'),
      cz('The store closed early ___ a power outage.', ['due to', 'because', 'although', 'while'], '因為停電，店提早關門。', '後面是名詞片語，用 due to。'),
    ],
    '綠色',
  ),
  concept(
    'en.c.agreement',
    G,
    '⚖️',
    '主詞動詞一致與數量詞',
    '找到真正的主詞，決定動詞要不要加 s；much／many、few／little 看名詞可不可數。',
    [
      sec('找真正的主詞', ['主詞後面常跟著介系詞片語，干擾判斷：The list of names is…（主詞是 list）。'], {
        ex: ['The number of visitors has increased.|訪客人數增加了。', 'A number of visitors have complained.|有許多訪客抱怨。'],
        tip: 'the number of（…的數量）是單數；a number of（許多）是複數。',
      }),
      sec('數量詞', ['可數名詞用 many、few、a number of；不可數名詞用 much、little、an amount of。each、every 後面接單數名詞和單數動詞。'], {
        table: [
          ['搭配', '可數（books）', '不可數（information）'],
          ['很多', 'many, a number of', 'much, a great deal of'],
          ['很少', 'few, a few', 'little, a little'],
          ['兩者都可', 'a lot of, plenty of, some', 'a lot of, plenty of, some'],
        ],
      }),
    ],
    [
      cz('The list of new members ___ posted on the board.', ['is', 'are', 'were', 'have been'], '新會員名單貼在公告欄上。', '主詞是 list（單數），不是 members。'),
      cz('Each participant ___ a certificate.', ['receives', 'receive', 'are receiving', 'have received'], '每位參加者都會拿到證書。', 'each 接單數動詞。'),
      cz('We don’t have ___ information about the new policy yet.', ['much', 'many', 'a few', 'several'], '我們還沒有太多關於新政策的資訊。', 'information 不可數，用 much。'),
      cz('A number of employees ___ asked for flexible hours.', ['have', 'has', 'is', 'was'], '許多員工要求彈性工時。', 'a number of 表示「許多」，接複數動詞。'),
      cz('Only ___ seats are left for tonight’s show.', ['a few', 'a little', 'much', 'little'], '今晚的表演只剩幾個位子。', 'seats 可數，用 a few。'),
    ],
    '綠色',
  ),
  concept(
    'en.c.subjunctive',
    G,
    '🔮',
    '假設語氣與倒裝：Should you have any questions…',
    '與事實相反的假設要「時態往前退一格」；正式書信常把 if 省略、主詞與助動詞倒裝。',
    [
      sec('三種假設', ['與現在相反用過去式，與過去相反用過去完成式，主要子句加 would／could。'], {
        table: [
          ['類型', 'if 子句', '主要子句'],
          ['與現在相反', 'If I were…（過去式）', 'would + 原形'],
          ['與過去相反', 'If I had known…（had + p.p.）', 'would have + p.p.'],
          ['未來不太可能', 'If you should…', 'please / will…'],
        ],
        ex: ['If I were you, I would accept the offer.|如果我是你，我會接受這個工作機會。', 'If we had left earlier, we would have caught the train.|如果我們早點出發，就趕上火車了。'],
      }),
      sec('省略 if 的倒裝', ['商務書信的固定句型：Should you have any questions, please contact us.（如果有任何問題，請聯絡我們）＝ If you should have…。Had I known…＝ If I had known…。'], {
        tip: '句首看到 Should／Had／Were + 主詞，就是省略 if 的倒裝。',
      }),
    ],
    [
      cz('___ you have any questions, please do not hesitate to contact us.', ['Should', 'Would', 'Could', 'Will'], '如果您有任何問題，請不要猶豫跟我們聯絡。', '省略 if 的倒裝：Should you have…'),
      cz('If I ___ more time, I would join the team.', ['had', 'have', 'will have', 'would have'], '如果我有更多時間，我會加入這個團隊。', '與現在事實相反用過去式。'),
      cz('If we had booked earlier, we ___ a better price.', ['would have gotten', 'would get', 'will get', 'got'], '如果早點訂，我們就能拿到更好的價格了。', '與過去相反：would have + p.p.'),
      cz('___ I known about the delay, I would have taken a taxi.', ['Had', 'Have', 'If', 'Should'], '要是我早知道會延誤，我就搭計程車了。', 'Had I known ＝ If I had known。'),
      cz('If I ___ you, I would ask the manager first.', ['were', 'am', 'was being', 'will be'], '如果我是你，我會先問經理。', '假設語氣 be 動詞一律用 were（正式）。'),
    ],
    '藍色',
  ),
  concept(
    'en.c.gerund',
    G,
    '🎯',
    '不定詞與動名詞：to do 還是 doing？',
    '有些動詞後面接 to + 原形，有些接 V-ing，還有 look forward to + V-ing 這種陷阱。',
    [
      sec('接 to do 的動詞', ['和「未來、意圖」有關：want, plan, decide, hope, agree, offer, promise, expect, need, refuse。'], {
        ex: ['We plan to expand overseas.|我們計畫拓展海外。'],
      }),
      sec('接 V-ing 的動詞', ['和「已經在做、經驗」有關：enjoy, finish, avoid, consider, suggest, recommend, mind, postpone, keep。'], {
        ex: ['Would you mind closing the window?|你介意把窗戶關上嗎？', 'We are considering opening a new branch.|我們正在考慮開新分店。'],
      }),
      sec('to 是介系詞的陷阱', ['look forward to、be committed to、be used to、in addition to 的 to 是介系詞，後面接 V-ing。'], {
        ex: ['I look forward to hearing from you.|期待您的回覆。'],
        tip: '「I look forward to hear from you」是最常見的錯誤，多益很愛考。',
      }),
    ],
    [
      cz('We look forward to ___ you at the conference.', ['seeing', 'see', 'saw', 'be seen'], '期待在會議上見到您。', 'look forward to 的 to 是介系詞，接 V-ing。'),
      cz('The company decided ___ its headquarters to Osaka.', ['to move', 'moving', 'move', 'moved'], '公司決定把總部搬到大阪。', 'decide 接 to do。'),
      cz('Have you finished ___ the budget report?', ['writing', 'to write', 'write', 'written'], '你寫完預算報告了嗎？', 'finish 接 V-ing。'),
      cz('Our manager suggested ___ the meeting to Thursday.', ['moving', 'to move', 'move', 'moved'], '經理建議把會議改到星期四。', 'suggest 接 V-ing。'),
      cz('We are committed to ___ high-quality service.', ['providing', 'provide', 'provided', 'be provided'], '我們致力於提供高品質的服務。', 'be committed to 的 to 是介系詞，接 V-ing。'),
    ],
    '藍色',
  ),
  concept(
    'en.c.compare',
    G,
    '📊',
    '比較級與最高級',
    '看到 than 用比較級，看到 the 和範圍（in, of, ever）用最高級。',
    [
      sec('基本規則', ['短的形容詞加 -er／-est（cheaper, cheapest），長的用 more／most（more expensive）。不規則：good-better-best、bad-worse-worst、many-more-most、little-less-least。'], {
        ex: ['This model is cheaper than that one.|這個型號比那個便宜。', 'It is the most popular product in our store.|這是我們店裡最受歡迎的商品。'],
      }),
      sec('常考句型', ['as + 原級 + as（和…一樣）、the + 比較級, the + 比較級（越…越…）、much／far／even + 比較級（強調）。'], {
        ex: ['The sooner, the better.|越快越好。', 'Sales this year are much higher than last year.|今年的業績比去年高很多。'],
        tip: '強調比較級用 much、far、even、still，不能用 very。',
      }),
    ],
    [
      cz('The new laptop is ___ than the old one.', ['lighter', 'light', 'lightest', 'more light'], '新筆電比舊的輕。', '看到 than 用比較級。'),
      cz('This is the ___ hotel in the city.', ['most expensive', 'more expensive', 'expensive', 'expensiver'], '這是城裡最貴的飯店。', 'the + 範圍（in the city）用最高級。'),
      cz('Profits are ___ higher than we expected.', ['much', 'very', 'many', 'more'], '利潤比預期高得多。', '強調比較級用 much，不能用 very。'),
      cz('The second presentation was as ___ as the first one.', ['informative', 'more informative', 'most informative', 'informatively'], '第二場簡報和第一場一樣有料。', 'as + 原級 + as。'),
      cz('The more you practice, the ___ you will become.', ['better', 'good', 'best', 'well'], '你練習越多，就會變得越好。', 'the + 比較級, the + 比較級。'),
    ],
    '綠色',
  ),
  concept(
    'en.c.prep',
    G,
    '📍',
    '介系詞與常考搭配詞',
    'in／on／at 的時間地點，加上 responsible for、comply with 這類要整組背的搭配詞。',
    [
      sec('時間的 in／on／at', ['範圍越大用 in，越小用 at：in 2026、in October、on Monday、on May 5、at 3 p.m.、at noon。'], {
        table: [
          ['介系詞', '時間', '地點'],
          ['in', '年、月、季節（in June）', '城市、國家、空間內（in Tokyo）'],
          ['on', '星期、日期（on Friday）', '表面、樓層、街道（on Main Street）'],
          ['at', '時刻（at 9 a.m.）', '地點的一點（at the station）'],
        ],
      }),
      sec('要整組背的搭配詞', ['多益最愛考「這個字固定配哪個介系詞」。'], {
        table: [
          ['搭配', '意思'],
          ['be responsible for', '負責'],
          ['comply with', '遵守'],
          ['be eligible for', '有資格'],
          ['in charge of', '負責、主管'],
          ['apply for', '申請'],
          ['depend on', '取決於'],
          ['participate in', '參加'],
        ],
        tip: '平常看到這種組合就把介系詞一起記，比死背規則有效。',
      }),
    ],
    [
      cz('The meeting will start ___ 10 a.m.', ['at', 'in', 'on', 'by'], '會議早上十點開始。', '時刻用 at。'),
      cz('Our office is located ___ the fifth floor.', ['on', 'in', 'at', 'to'], '我們的辦公室在五樓。', '樓層用 on。'),
      cz('Ms. Chen is responsible ___ training new staff.', ['for', 'of', 'to', 'with'], '陳小姐負責訓練新進員工。', 'be responsible for。'),
      cz('All employees must comply ___ the safety rules.', ['with', 'to', 'for', 'on'], '所有員工都必須遵守安全規定。', 'comply with。'),
      cz('Only full-time staff are eligible ___ the bonus.', ['for', 'to', 'of', 'at'], '只有全職員工有資格領獎金。', 'be eligible for。'),
    ],
    '橘色',
  ),
];
