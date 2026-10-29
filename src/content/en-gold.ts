// 英文金色證書（860–990）的學習路線：同義詞替換（Paraphrasing）、高頻陷阱題。
// 單字庫在 en-gold-bank.ts。cz／read 的第一個選項是正確答案。
import type { Unit } from '../core/types';
import { cz, grammarUnit, note, read } from './dsl';

const para = grammarUnit('en.gold.para', '🔁', '同義詞替換（Paraphrasing）', '正確答案很少照抄原文', [
  {
    title: '片語換成單字',
    notes: [
      note(
        '多益的正確答案幾乎都會「換句話說」',
        [
          'Part 3、4、7 的正確選項很少照抄原文，而是換成同義詞或不同的句型；照抄原文單字的選項反而常是陷阱。',
          '常見的換法：片語動詞 ↔ 單字（put off ↔ postpone）、形容詞 ↔ 片語（free ↔ at no charge）、肯定 ↔ 否定（behind schedule ↔ not on time）。',
          '練習方法：讀到一句話，就想想「還可以怎麼說」。',
        ],
        ['The meeting has been postponed. = The meeting has been put off.|會議延期了。', 'Admission is free. = You can enter at no charge.|免費入場。'],
      ),
    ],
    items: [
      cz('The meeting has been postponed. → The meeting has been ___.', ['put off', 'called off', 'brought up', 'taken over'], '會議延期了。', 'postpone＝put off（延後）；call off 是取消。'),
      cz('The company is seeking a qualified accountant. → The company is ___ a qualified accountant.', ['looking for', 'laying off', 'reporting to', 'training'], '公司正在徵求合格的會計師。', 'seek＝look for（尋找、徵求）。'),
      cz('Ms. Chen will step down as CEO next month. → Ms. Chen will ___ next month.', ['leave her position', 'take on a new client', 'be promoted', 'launch a company'], '陳女士下個月將卸下執行長一職。', 'step down（辭去職位）＝resign / leave the position。'),
      cz('Mr. Davis is in charge of the marketing team. → Mr. Davis ___ the marketing team.', ['supervises', 'joined', 'left', 'interviewed'], 'Davis 先生負責管理行銷團隊。', 'in charge of＝supervise / manage / oversee。'),
      cz('We are running low on printer paper. → We will ___ printer paper soon.', ['run out of', 'pick out', 'deliver', 'recycle'], '印表機的紙快用完了。', 'running low on＝快用完了：will run out of it soon。'),
      cz('The new policy will take effect on May 1. → The new policy will ___ on May 1.', ['go into effect', 'be reviewed', 'be canceled', 'be proposed'], '新政策五月一日起生效。', 'take effect＝go into effect / come into force（生效）。'),
    ],
  },
  {
    title: '形容詞、副詞的改寫',
    items: [
      cz('Admission is free for members. → Members can enter ___.', ['at no charge', 'at a discount', 'after hours', 'by invitation only'], '會員免費入場。', 'free＝at no charge / free of charge / complimentary。'),
      cz('The project is behind schedule. → The project is ___.', ['running late', 'under budget', 'nearly complete', 'ahead of time'], '專案進度落後。', 'behind schedule＝running late / delayed。'),
      cz('The store is understaffed this week. → The store does not have ___ this week.', ['enough employees', 'enough customers', 'enough inventory', 'enough space'], '這週店裡人手不足。', 'understaffed＝員工不夠：not have enough employees。'),
      cz('The factory operates around the clock. → The factory operates ___.', ['24 hours a day', 'only on weekdays', 'during the daytime', 'seasonally'], '工廠全天候運作。', 'around the clock＝24 hours a day（日夜不停）。'),
      cz('Sales went up sharply in the third quarter. → There was a ___ in sales in the third quarter.', ['significant increase', 'slight decline', 'gradual drop', 'temporary pause'], '第三季業績大幅成長。', 'went up sharply＝significant increase（大幅成長）。'),
      cz('The item is currently out of stock. → The item is ___ at the moment.', ['unavailable', 'on sale', 'being repaired', 'brand new'], '這個商品目前缺貨。', 'out of stock＝unavailable / sold out。'),
    ],
  },
  {
    title: '閱讀：找換句話說的答案',
    notes: [
      note(
        'Part 7 的解題順序',
        [
          '先看題目，再回原文找關鍵句；正確選項通常用不同的字說同一件事。',
          '和原文用字一模一樣、但意思不對的選項，是最常見的陷阱。',
        ],
      ),
    ],
    items: [
      read(
        ['Notice to all tenants: The water supply will be shut off on Tuesday from 9 a.m. to noon for pipe maintenance. We apologize for any inconvenience.'],
        'What will happen on Tuesday morning?',
        ['Water will be temporarily unavailable.', 'The building will be closed.', 'Rent will be collected.', 'New pipes will be sold.'],
        '致全體住戶：週二上午九點到中午將停水，進行水管維修。造成不便，敬請見諒。',
        '原文 The water supply will be shut off → 選項換成 Water will be temporarily unavailable。',
      ),
      read(
        ['Thank you for your order. Because of high demand, your shipment will arrive three to five days later than originally estimated.'],
        'What is the purpose of the message?',
        ['To report a delivery delay', 'To confirm a cancellation', 'To request a payment', 'To advertise a new product'],
        '感謝您的訂購。由於需求量大，您的貨品會比原本預估的晚三到五天送達。',
        'arrive later than estimated → 選項換成 a delivery delay。',
      ),
      read(
        ['Starting next month, employees may work from home up to two days a week, provided that their manager approves the arrangement in advance.'],
        'What is required to work from home?',
        ['Prior approval from a supervisor', 'A signed contract with a client', 'Two years of experience', 'A company laptop'],
        '從下個月起，員工每週最多可以在家工作兩天，前提是主管事先核准。',
        'manager approves in advance → 選項換成 prior approval from a supervisor（manager → supervisor、in advance → prior）。',
      ),
      read(
        ['Reminder: The quarterly sales report is due on Friday. Please send your figures to Ms. Lee by Wednesday so that she has time to review them.'],
        'What are employees asked to do?',
        ['Submit their numbers by midweek', 'Review Ms. Lee’s report', 'Attend a meeting on Friday', 'Call Ms. Lee on Wednesday'],
        '提醒：季度業績報告週五截止。請在週三前把數字寄給李小姐，讓她有時間審閱。',
        'send your figures by Wednesday → 選項換成 Submit their numbers by midweek（figures → numbers、Wednesday → midweek）。',
      ),
    ],
  },
]);

const traps = grammarUnit('en.gold.traps', '🪤', '高頻陷阱題', '長得像的字、介系詞與連接詞、倒裝', [
  {
    title: '長得像的字',
    notes: [
      note(
        '拼法只差一點，意思和用法完全不同',
        [
          'affect（動詞：影響）／effect（名詞：效果）；rise（不及物：上升）／raise（及物：提高某物）。',
          'ensure（確保）／insure（投保）／assure（向某人保證，後面接人）。',
          'adopt（採用）／adapt（適應、改編）；economic（經濟的）／economical（省錢的）；considerable（相當大的）／considerate（體貼的）。',
        ],
        ['The new rules will affect small businesses.|新規定會影響小型企業。', 'Prices are expected to rise.|價格預計會上漲。'],
      ),
    ],
    items: [
      cz('The new regulations will ___ small businesses.', ['affect', 'effect', 'effective', 'affection'], '新法規會影響小型企業。', 'affect 是動詞「影響」；effect 多當名詞「效果」。'),
      cz('Prices are expected to ___ next quarter.', ['rise', 'raise', 'arise', 'rouse'], '價格預計下一季會上漲。', 'rise 是不及物（自己上升）；raise 是及物，要接受詞（raise prices）。'),
      cz('The company plans to ___ its prices by 5 percent.', ['raise', 'rise', 'arise', 'lie'], '公司打算漲價 5%。', 'raise＋受詞：提高某物。'),
      cz('Please ___ that all the doors are locked before leaving.', ['ensure', 'insure', 'assure', 'reassure'], '離開前請確保所有門都上鎖。', 'ensure that＝確保；insure 是投保；assure 要接人（assure you that）。'),
      cz('The firm decided to ___ a more flexible work policy.', ['adopt', 'adapt', 'adept', 'adhere'], '公司決定採用更有彈性的工作制度。', 'adopt＝採用（政策、方法）；adapt＝適應、改編。'),
      cz('We need a more ___ car to cut fuel costs.', ['economical', 'economic', 'economy', 'economist'], '我們需要更省油的車來降低燃料費。', 'economical＝節省的、划算的；economic＝經濟（學）上的。'),
      cz('The renovation required a ___ amount of time.', ['considerable', 'considerate', 'considering', 'consideration'], '整修花了相當多的時間。', 'considerable＝相當大的；considerate＝體貼的。'),
    ],
  },
  {
    title: '介系詞還是連接詞',
    notes: [
      note(
        '看空格後面接的是名詞還是句子',
        [
          '介系詞＋名詞：despite、in spite of、during、because of。',
          '連接詞＋句子（主詞＋動詞）：although、even though、while、because。',
          'by（期限：在～之前完成）／until（持續到～）。',
        ],
        ['Despite the rain, the event went ahead.|儘管下雨，活動仍照常舉行。', 'Although it rained, the event went ahead.|雖然下了雨，活動仍照常舉行。'],
      ),
    ],
    items: [
      cz('___ the heavy rain, the outdoor event went ahead as planned.', ['Despite', 'Although', 'Even though', 'However'], '儘管下大雨，戶外活動仍照計畫進行。', 'despite 是介系詞，後面接名詞；although／even though 是連接詞，後面接句子。'),
      cz('___ the weather was bad, the event went ahead as planned.', ['Although', 'Despite', 'In spite of', 'Because of'], '雖然天氣很差，活動仍照計畫進行。', '後面是完整的句子（主詞＋動詞），要用連接詞 although。'),
      cz('Please keep your phone on silent ___ the presentation.', ['during', 'while', 'when', 'meanwhile'], '簡報期間請把手機調成靜音。', 'during＋名詞；while＋句子。'),
      cz('The report must be submitted ___ Friday at 5 p.m.', ['by', 'until', 'since', 'for'], '報告必須在週五下午五點前交。', '期限（在～之前完成）用 by；until 表示動作持續到某個時間。'),
      cz('The store will remain open ___ 10 p.m. during the holidays.', ['until', 'by', 'since', 'within'], '假期期間，店會營業到晚上十點。', '持續到某個時間用 until。'),
    ],
  },
  {
    title: '主詞動詞一致與倒裝',
    notes: [
      note(
        '990 分常錯的句型',
        [
          'each of＋複數名詞：主詞是 each，動詞用單數。',
          'neither A nor B／either A or B：動詞跟最靠近的 B 一致。',
          'Hardly／No sooner／Not until／Never 放句首時，主要子句要倒裝（像問句一樣把助動詞放前面）。',
        ],
        ['Hardly had the meeting started when the alarm went off.|會議才剛開始，警報就響了。'],
      ),
    ],
    items: [
      cz('Each of the candidates ___ interviewed by the panel.', ['was', 'were', 'have been', 'are'], '每位候選人都接受了評審小組的面試。', 'Each of＋複數名詞，主詞是 each，動詞用單數。'),
      cz('Neither the manager nor the assistants ___ aware of the change.', ['were', 'was', 'is', 'has been'], '經理和助理們都不知道這項變更。', 'neither A nor B：動詞跟最靠近的 B（assistants）一致，用複數。'),
      cz('Hardly ___ the meeting started when the fire alarm went off.', ['had', 'has', 'did', 'was'], '會議才剛開始，火警警報就響了。', 'Hardly 放句首要倒裝：Hardly had＋主詞＋過去分詞 … when …。'),
      cz('Not until the contract was signed ___ the project officially begin.', ['did', 'was', 'had', 'does'], '直到合約簽訂，專案才正式開始。', 'Not until … 放句首，主要子句要倒裝：did＋主詞＋原形動詞。'),
    ],
  },
]);

export const GOLD_UNITS: Unit[] = [para, traps];
