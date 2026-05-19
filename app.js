const WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const ZHI_ELEMENT = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水",
};
const GENERATES = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const CONTROLS = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };
const COLOR_BANK = {
  金: [
    ["白色", "#ffffff"],
    ["乳白色", "#fff8e8"],
    ["银色", "#c8d0dc"],
    ["杏色", "#f2d2a6"],
    ["浅金色", "#f8dd8d"],
  ],
  木: [
    ["青色", "#14a6b8"],
    ["绿色", "#34a853"],
    ["翠色", "#00a870"],
    ["浅绿色", "#9bdc9a"],
  ],
  水: [
    ["黑色", "#20242a"],
    ["蓝色", "#2f6fe4"],
    ["深灰色", "#5b6472"],
  ],
  火: [
    ["红色", "#e03131"],
    ["紫色", "#9c36b5"],
    ["粉色", "#f783ac"],
    ["橙色", "#f76707"],
    ["花色", "#ff8ab3"],
  ],
  土: [
    ["黄色", "#ffd43b"],
    ["棕色", "#8d6e63"],
    ["咖色", "#6f4e37"],
    ["褐色", "#7b5e47"],
  ],
};

const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63,
];

const ENGLISH_WORDS = [
  ["clarify", "/ˈklærɪfaɪ/", "澄清；说明白", "Could you clarify this requirement?", "你能说明一下这个需求吗？", "clear 是“清楚”，clarify 就是让事情变清楚。"],
  ["submit", "/səbˈmɪt/", "提交", "Please submit the form by noon.", "请在中午前提交表格。", "sub + mit，可以想成把文件“送上去”。"],
  ["approve", "/əˈpruːv/", "批准；同意", "My manager approved the request.", "我的经理批准了这个申请。", "和流程、预算、请假都常搭配。"],
  ["arrange", "/əˈreɪndʒ/", "安排；整理", "I will arrange a meeting for tomorrow.", "我会安排明天的会议。", "range 有“排列”的感觉，arrange 就是把事情排好。"],
  ["remind", "/rɪˈmaɪnd/", "提醒", "Please remind me before the meeting.", "请在会议前提醒我。", "re + mind，把事情重新放回脑海里。"],
  ["adjust", "/əˈdʒʌst/", "调整", "We need to adjust the timeline.", "我们需要调整时间线。", "项目推进中经常要 adjust。"],
  ["request", "/rɪˈkwest/", "请求；申请", "I sent a request this morning.", "我今天早上发了一个申请。", "工作系统里常见 request form。"],
  ["confirm", "/kənˈfɜːrm/", "确认", "Please confirm your attendance.", "请确认你是否参加。", "con + firm，让事情变得确定。"],
  ["available", "/əˈveɪləbl/", "有空的；可用的", "Are you available at 3 p.m.?", "你下午 3 点有空吗？", "约会议、查库存、问资源都能用。"],
  ["feedback", "/ˈfiːdbæk/", "反馈", "Thanks for your helpful feedback.", "谢谢你有帮助的反馈。", "feed back，像把信息“喂回去”。"],
];

const KOREAN_WORDS = [
  ["설명하다", "seol-myeong-ha-da", "说明；解释", "다시 설명해 주세요.", "请再说明一下。", "설명 是“说明”，하다 是“做”。"],
  ["제출하다", "je-chul-ha-da", "提交", "보고서를 제출했어요.", "我提交了报告。", "常用于作业、文件、报告。"],
  ["승인하다", "seung-in-ha-da", "批准；认可", "요청을 승인해 주세요.", "请批准这个请求。", "승인 是“承认/批准”。"],
  ["준비하다", "jun-bi-ha-da", "准备", "회의 자료를 준비했어요.", "我准备好了会议资料。", "준비 就是“准备”。"],
  ["알려주다", "al-lyeo-ju-da", "告诉；告知", "결과를 알려 주세요.", "请告诉我结果。", "알다 是“知道”，알려주다 是“让别人知道”。"],
  ["확인하다", "hwa-gin-ha-da", "确认；核实", "메일을 확인해 주세요.", "请确认一下邮件。", "하다 是“做”，확인하다 就是做确认。"],
  ["일정", "il-jeong", "日程；安排", "내일 일정이 어떻게 돼요?", "明天的安排是怎样的？", "정 有“定”的感觉，把一天定下来。"],
  ["회의", "hoe-ui", "会议", "오후에 회의가 있어요.", "下午有会议。", "회 像“会”，很好联想。"],
  ["예산", "ye-san", "预算", "예산을 확인해야 해요.", "需要确认预算。", "예 像“预”，산 想成“算”。"],
  ["가능하다", "ga-neung-ha-da", "可以；可能；可行", "내일 미팅 가능하세요?", "明天可以开会吗？", "가능 是“可能/可行”。"],
];

const FACTS = [
  ["为什么雨后会闻到一股“泥土香”？", "这股味道有个很浪漫的名字，叫“雨后土香”。它主要来自土壤里的放线菌产生的一种物质：土臭素。平时它藏在泥土和尘埃里，雨滴砸到地面时，会把微小气泡弹起来，像迷你喷雾一样把气味分子带到空气中。植物在干燥时释放的油脂，也会参与这场“香味合奏”。所以雨后闻到的不是单纯的泥巴味，而是微生物、植物和雨滴一起调出来的自然香水。"],
  ["为什么飞机窗户大多是圆角？", "这不是为了好看，而是为了安全。飞机在高空飞行时，机舱内外压力差很大，机身会经历反复加压和泄压。尖角容易集中应力，就像纸从小缺口开始更容易撕开一样。圆角能把压力更均匀地分散开，减少金属疲劳风险。你看到的圆角舷窗，其实是工程师用形状在保护整架飞机。"],
  ["为什么冰箱里的气味会“串味”？", "很多食物都会释放挥发性分子，比如洋葱、榴莲、熟食和调味料。冰箱空间小、空气流动慢，这些分子就容易停留并附着在其他食物表面。脂肪类食物尤其容易吸附气味，所以奶油、肉类、蛋糕更容易被影响。密封盒、活性炭和定期清理冷凝水槽，都能明显减少串味。"],
  ["为什么打哈欠会传染？", "打哈欠传染可能和大脑的共情、注意力同步有关。看到别人打哈欠时，大脑会自动模拟对方的状态，像是在做一次无声的“情绪和生理校准”。这不代表你真的缺氧，而可能是群体动物保持警觉和同步节奏的一种遗留机制。越熟悉的人之间，这种传染感往往越强。"],
  ["为什么咖啡放凉后会更苦？", "热咖啡的香气更活跃，会掩盖一部分苦味；温度下降后，香气挥发减少，舌头对苦味的感知反而更明显。同时，咖啡中的某些酸味和甜感在低温下不那么突出，整体平衡被打破，于是你会觉得它变苦了。不是咖啡突然变坏，而是温度改变了味觉的舞台灯光。"],
];

const HISTORY_BY_DATE = {
  "05-18": {
    title: "1998 年 5 月 18 日，微软反垄断案拉开序幕",
    body: "1998 年 5 月 18 日，美国司法部对微软提起反垄断诉讼，指控它在个人电脑操作系统市场维持垄断，并把 Internet Explorer 与 Windows 深度绑定，挤压浏览器竞争。今天回头看，这不只是“微软和浏览器”的官司，而是互联网时代早期对平台权力的一次重要追问：当一个系统掌握入口，它能不能顺手决定用户用什么软件？这场案件后来影响了科技行业对捆绑、默认入口和平台竞争的讨论。",
    sources: [
      ["U.S. DOJ", "https://www.justice.gov/archive/opa/pr/1998/May/223.htm.html"],
      ["Computer History Museum", "https://www.computerhistory.org/tdih/may/18/"],
    ],
  },
  "05-19": {
    title: "2001 年 5 月 19 日，苹果零售店正式开门迎客",
    body: "2001 年 5 月 19 日，第一批 Apple Store 在美国开业。那时很多人并不看好电脑公司自己开店，觉得成本高、风险大。但苹果把门店做成了体验空间：用户可以直接试用产品、参加课程、找 Genius Bar 解决问题。后来，Apple Store 不只是卖货渠道，也成了品牌体验的一部分。它改变了科技产品和消费者见面的方式。",
    sources: [["Apple", "https://www.apple.com/newsroom/2001/05/15Apple-to-Open-25-Retail-Stores-in-2001/"]],
  },
};

const FALLBACK_HISTORY = [
  {
    title: "1928 年 5 月 15 日，《Plane Crazy》进行试映",
    body: "动画短片《Plane Crazy》被认为是最早制作完成的米老鼠动画之一。它灵感来自飞行热潮：米老鼠在片中自己造飞机，还带着米妮来了一场乱糟糟的空中冒险。它最初没有找到发行商，真正让米老鼠成名的是稍后带同步声音上映的《Steamboat Willie》。回头看，《Plane Crazy》像米老鼠的“草稿本首秀”。",
    sources: [["D23", "https://d23.com/a-to-z/plane-crazy-film/"]],
  },
];

const ZODIAC_SIGNS = ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"];
const SIGN_ELEMENTS = ["火", "土", "风", "水", "火", "土", "风", "水", "火", "土", "风", "水"];
const ELEMENT_MOOD = {
  火: "节奏更明亮直接，适合把话说清楚",
  土: "能量更落地，适合处理现实细节",
  风: "信息流动变快，适合沟通和重新命名问题",
  水: "感受被放大，适合照顾真实的情绪",
};
const MOON_PHASES = [
  "新月后",
  "上弦前",
  "上弦后",
  "盈凸月",
  "满月前后",
  "亏凸月",
  "下弦后",
  "残月期",
];
const WATER_SIGNS = [
  { name: "巨蟹座", signIndex: 3, ruler: "moon" },
  { name: "天蝎座", signIndex: 7, ruler: "mars" },
  { name: "双鱼座", signIndex: 11, ruler: "jupiter" },
];

let renderedDateKey = "";

function shanghaiParts() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(value.year),
    month: Number(value.month),
    day: Number(value.day),
  };
}

function utcDate({ year, month, day }) {
  return new Date(Date.UTC(year, month - 1, day));
}

function dateKey(parts) {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function seedFromDate(parts) {
  return parts.year * 10000 + parts.month * 100 + parts.day;
}

function seededIndex(seed, length, step = 0) {
  const value = Math.abs(Math.sin(seed * 12.9898 + step * 78.233) * 43758.5453);
  return Math.floor((value % 1) * length);
}

function pickMany(list, count, seed) {
  const copy = [...list];
  const picked = [];
  for (let i = 0; i < count && copy.length; i += 1) {
    const index = seededIndex(seed + i * 17, copy.length, i);
    picked.push(copy.splice(index, 1)[0]);
  }
  return picked;
}

function normalizeAngle(degrees) {
  return ((degrees % 360) + 360) % 360;
}

function sinDeg(degrees) {
  return Math.sin((degrees * Math.PI) / 180);
}

function planetInfo(label, longitude) {
  const lon = normalizeAngle(longitude);
  const signIndex = Math.floor(lon / 30) % 12;
  return {
    label,
    lon,
    sign: ZODIAC_SIGNS[signIndex],
    element: SIGN_ELEMENTS[signIndex],
  };
}

function lines(...items) {
  return items.map((item) => `<p>${item}</p>`).join("");
}

function bulletList(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function quoteBlock(...items) {
  return `<blockquote>${items.map((item) => `<span>${item}</span>`).join("")}</blockquote>`;
}

function currentTransits(parts) {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 4));
  const days = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86400000;
  const sunMean = normalizeAngle(280.46 + 0.9856474 * days);
  const sunAnomaly = normalizeAngle(357.528 + 0.9856003 * days);
  const sunLon = sunMean + 1.915 * sinDeg(sunAnomaly) + 0.02 * sinDeg(2 * sunAnomaly);
  const moonMean = normalizeAngle(218.316 + 13.176396 * days);
  const moonAnomaly = normalizeAngle(134.963 + 13.064993 * days);
  const moonLon = moonMean + 6.289 * sinDeg(moonAnomaly);
  const phaseAngle = normalizeAngle(moonLon - sunLon);
  const phaseIndex = Math.floor(((phaseAngle + 22.5) % 360) / 45);

  return {
    sun: planetInfo("太阳", sunLon),
    moon: planetInfo("月亮", moonLon),
    mercury: planetInfo("水星", 252.251 + 4.09233445 * days),
    venus: planetInfo("金星", 181.98 + 1.60213034 * days),
    mars: planetInfo("火星", 355.433 + 0.52402068 * days),
    jupiter: planetInfo("木星", 34.351 + 0.08309135 * days),
    saturn: planetInfo("土星", 50.077 + 0.03345965 * days),
    phase: MOON_PHASES[phaseIndex],
  };
}

function buildHoroscope(sign, transits) {
  if (sign.name === "巨蟹座") {
    return {
      love:
        lines(
          `月亮今天在${transits.moon.sign}，你会更容易察觉别人话里的停顿。`,
          "你在意的不是热闹，而是对方有没有认真接住你的感受。",
          "单身的人适合慢慢聊，不急着定性。有伴侣的人适合说需求，不适合翻旧账。",
        ),
      work:
        lines(`太阳在${transits.sun.sign}，适合把手上的事落到具体清单。`, "今天适合：") +
        bulletList(["整理需求", "对齐时间线", "处理需要耐心的沟通"]) +
        lines("不适合：") +
        bulletList(["临时答应额外任务", "替别人承担模糊责任"]),
      money:
        lines(
          `木星在${transits.jupiter.sign}，会放大你对安全感的需求。`,
          `${transits.phase}适合看账单、订阅和长期预算，不适合因为一时心软买单。`,
        ) +
        quoteBlock("这笔钱是在照顾生活，还是在安抚情绪？"),
      advice: quoteBlock("先把边界放稳，再去照顾别人。", "你不需要把所有人都安顿好，才允许自己轻松。"),
    };
  }

  if (sign.name === "天蝎座") {
    return {
      love:
        lines(
          `火星今天在${transits.mars.sign}，行动感会更强，也容易急着要答案。`,
          "你可能很快看出对方有没有回避问题，但不必马上追问到底。",
          "单身的人适合观察行动。有伴侣的人适合把话说直接，不适合冷处理。",
        ),
      work:
        lines(`水星在${transits.mercury.sign}，适合拆细节、查漏洞。`, "今天适合：") +
        bulletList(["复盘", "处理数据", "推进卡住的事项"]) +
        lines("不适合：") +
        bulletList(["同时硬扛多条线", "用猜测代替确认"]),
      money:
        lines(
          `金星在${transits.venus.sign}，会让你更想买有质感、有存在感的东西。`,
          "如果它只是为了证明“我值得”，先缓一缓。",
        ) +
        quoteBlock("真正需要的东西，不会因为晚一天就失效。"),
      advice: quoteBlock("把锋利用在判断上。", "今天适合做减法，留下最关键的一步。"),
    };
  }

  return {
    love:
      lines(
        `月亮今天在${transits.moon.sign}，情绪共鸣感会比较明显。`,
        "你会更在意：谁真正理解你，而不是谁最热情。",
        "单身的人容易和聊得来的人升温。有伴侣的人适合聊真心话，不适合翻旧账。",
      ),
    work:
      lines(`太阳在${transits.sun.sign}，事情需要落地，但木星也在给你灵感。`, "今天适合：") +
      bulletList(["创意", "沟通", "提方案"]) +
      lines("不适合：") +
      bulletList(["机械重复工作", "同时开太多任务"]),
    money:
      lines(
        `金星在${transits.venus.sign}，容易被“提升生活氛围感”的东西吸引。`,
        "买之前先停一下，尤其是那些看起来很治愈、但不一定常用的东西。",
      ) +
      quoteBlock("我是真的需要，还是只是想安慰自己？"),
    advice: quoteBlock("今天别急着追结果。", "把一个小目标做好，事情会慢慢靠近你。"),
  };
}

function lunarYearDays(year) {
  let sum = 348;
  const info = LUNAR_INFO[year - 1900];
  for (let bit = 0x8000; bit > 0x8; bit >>= 1) {
    sum += info & bit ? 1 : 0;
  }
  return sum + leapDays(year);
}

function leapMonth(year) {
  return LUNAR_INFO[year - 1900] & 0xf;
}

function leapDays(year) {
  if (!leapMonth(year)) return 0;
  return LUNAR_INFO[year - 1900] & 0x10000 ? 30 : 29;
}

function monthDays(year, month) {
  return LUNAR_INFO[year - 1900] & (0x10000 >> month) ? 30 : 29;
}

function solarToLunar(date) {
  const baseDate = Date.UTC(1900, 0, 31);
  let offset = Math.floor((date.getTime() - baseDate) / 86400000);
  let year = 1900;
  let daysOfYear = 0;
  while (year < 2101 && offset > 0) {
    daysOfYear = lunarYearDays(year);
    if (offset < daysOfYear) break;
    offset -= daysOfYear;
    year += 1;
  }

  const leap = leapMonth(year);
  let isLeap = false;
  let month = 1;
  let daysOfMonth = 0;
  while (month < 13 && offset > 0) {
    if (leap > 0 && month === leap + 1 && !isLeap) {
      month -= 1;
      isLeap = true;
      daysOfMonth = leapDays(year);
    } else {
      daysOfMonth = monthDays(year, month);
    }

    if (offset < daysOfMonth) break;
    offset -= daysOfMonth;

    if (isLeap && month === leap) {
      isLeap = false;
    }
    month += 1;
  }

  return { year, month, day: offset + 1, isLeap };
}

function lunarMonthName(month) {
  return ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"][month - 1];
}

function lunarDayName(day) {
  const prefix = ["初", "十", "廿", "三"];
  const nums = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  if (day === 10) return "初十";
  if (day === 20) return "二十";
  if (day === 30) return "三十";
  return `${prefix[Math.floor(day / 10)]}${nums[(day - 1) % 10]}`;
}

function dayGanZhi(date) {
  const baseDate = Date.UTC(1900, 0, 31);
  const offset = Math.floor((date.getTime() - baseDate) / 86400000);
  const gan = GAN[offset % 10];
  const zhi = ZHI[(offset + 4) % 12];
  const element = ZHI_ELEMENT[zhi];
  return { gan, zhi, text: `${gan}${zhi}日`, element };
}

function renderWordCards(target, words, isKorean = false) {
  target.innerHTML = words
    .map(
      ([word, pron, meaning, example, translation, hint], index) => `
        <article class="word-card ${isKorean ? "korean" : ""}">
          <div class="word-top">
            <span class="word-number">${index + 1}</span>
            <span class="word">${word}</span>
            ${renderSpeakButton(word, isKorean ? "ko-KR" : "en-US")}
            <span class="pron">${pron}</span>
          </div>
          <p><strong>词义：</strong>${meaning}</p>
          <p><strong>例句：</strong>${example}</p>
          <p><strong>翻译：</strong>${translation}</p>
          <div class="hint">记忆提示：${hint}</div>
        </article>
      `,
    )
    .join("");
}

function renderColorCards(element) {
  const most = GENERATES[element];
  const avoid = CONTROLS[element];
  const rows = [
    ["最吉", most, COLOR_BANK[most]],
    ["次吉", element, COLOR_BANK[element]],
    ["忌色", avoid, COLOR_BANK[avoid]],
  ];
  document.querySelector("#color-grid").innerHTML = rows
    .map(
      ([title, rowElement, colors]) => `
        <article class="color-card">
          <h3>${title} · ${rowElement}</h3>
          <div class="swatches">
            ${colors
              .map(
                ([name, color]) => `
                  <span class="swatch">
                    <span class="dot" style="background:${color}"></span>${name}
                  </span>
                `,
              )
              .join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderZodiac(parts) {
  const transits = currentTransits(parts);
  document.querySelector("#zodiac-grid").innerHTML = WATER_SIGNS.map((sign) => {
    const fortune = buildHoroscope(sign, transits);
    return `
      <article class="zodiac-card">
        <h3>${sign.name}今日运势</h3>
        <div class="zodiac-part">
          <h4>感情</h4>
          ${fortune.love}
        </div>
        <div class="zodiac-part">
          <h4>工作</h4>
          ${fortune.work}
        </div>
        <div class="zodiac-part">
          <h4>财运</h4>
          ${fortune.money}
        </div>
        <div class="zodiac-part">
          <h4>今日建议</h4>
          ${fortune.advice}
        </div>
      </article>
    `;
  }).join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSpeakButton(word, lang) {
  const safeWord = escapeHtml(word);
  return `
    <button class="speak-button" type="button" data-speak-word="${safeWord}" data-speak-lang="${lang}" aria-label="播放 ${safeWord} 的发音">
      <span class="speaker-icon" aria-hidden="true"></span>
    </button>
  `;
}

function renderGeneratedWordCards(target, words, isKorean = false) {
  target.innerHTML = words
    .map(
      (item, index) => `
        <article class="word-card ${isKorean ? "korean" : ""}">
          <div class="word-top">
            <span class="word-number">${index + 1}</span>
            <span class="word">${escapeHtml(item.word)}</span>
            ${renderSpeakButton(item.word, isKorean ? "ko-KR" : "en-US")}
            <span class="pron">${escapeHtml(item.pronunciation)}</span>
          </div>
          <p><strong>词义：</strong>${escapeHtml(item.meaning)}</p>
          <p><strong>例句：</strong>${escapeHtml(item.example)}</p>
          <p><strong>翻译：</strong>${escapeHtml(item.translation)}</p>
          <div class="hint">记忆提示：${escapeHtml(item.memoryTip)}</div>
        </article>
      `,
    )
    .join("");
}

function generatedParagraphs(items = []) {
  return items.map((item) => `<p>${escapeHtml(item)}</p>`).join("");
}

function generatedList(items = []) {
  if (!items.length) return "";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function generatedQuote(section = {}) {
  const quotes = section.quotes?.length ? section.quotes : section.quote ? [section.quote] : [];
  if (!quotes.length) return "";
  return `<blockquote>${quotes.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</blockquote>`;
}

function renderGeneratedZodiac(zodiac) {
  document.querySelector("#zodiac-grid").innerHTML = zodiac
    .map((item) => {
      const love = item.sections?.love || {};
      const work = item.sections?.work || {};
      const money = item.sections?.money || {};
      const advice = item.sections?.advice || {};
      return `
        <article class="zodiac-card">
          <h3>${escapeHtml(item.sign)}今日运势</h3>
          <div class="zodiac-part">
            <h4>感情</h4>
            ${generatedParagraphs(love.paragraphs)}
            ${generatedQuote(love)}
          </div>
          <div class="zodiac-part">
            <h4>工作</h4>
            ${generatedParagraphs(work.paragraphs)}
            ${work.good?.length ? "<p>今天适合：</p>" : ""}
            ${generatedList(work.good)}
            ${work.avoid?.length ? "<p>不适合：</p>" : ""}
            ${generatedList(work.avoid)}
            ${generatedQuote(work)}
          </div>
          <div class="zodiac-part">
            <h4>财运</h4>
            ${generatedParagraphs(money.paragraphs)}
            ${generatedQuote(money)}
          </div>
          <div class="zodiac-part">
            <h4>今日建议</h4>
            ${generatedParagraphs(advice.paragraphs)}
            ${generatedQuote(advice)}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderGeneratedContent(content) {
  if (!content) return;
  if (Array.isArray(content.englishWords) && content.englishWords.length === 5) {
    renderGeneratedWordCards(document.querySelector("#english-words"), content.englishWords, false);
  }
  if (Array.isArray(content.koreanWords) && content.koreanWords.length === 5) {
    renderGeneratedWordCards(document.querySelector("#korean-words"), content.koreanWords, true);
  }
  if (content.fact?.question && content.fact?.answer) {
    document.querySelector("#fact-title").textContent = content.fact.question;
    document.querySelector("#fact-answer").textContent = content.fact.answer;
  }
  if (content.history?.title && content.history?.body) {
    document.querySelector("#history-title").textContent = content.history.title;
    document.querySelector("#history-answer").textContent = content.history.body;
    document.querySelector("#history-sources").innerHTML = (content.history.sources || [])
      .map(([name, href]) => `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(name)}</a>`)
      .join("");
  }
  if (Array.isArray(content.zodiac) && content.zodiac.length === 3) {
    renderGeneratedZodiac(content.zodiac);
  }
}

async function loadGeneratedContent(key) {
  try {
    const response = await fetch(`/.netlify/functions/daily?date=${encodeURIComponent(key)}`, {
      cache: "no-store",
    });
    if (!response.ok) return;
    const payload = await response.json();
    if (payload.ok && payload.content?.date === key) {
      renderGeneratedContent(payload.content);
    }
  } catch (error) {
    console.info("Using local fallback content.", error);
  }
}

let speechVoices = [];

function refreshSpeechVoices() {
  if (!("speechSynthesis" in window)) return;
  speechVoices = window.speechSynthesis.getVoices();
}

function pickSpeechVoice(lang) {
  const target = lang.toLowerCase();
  const family = target.split("-")[0];
  return (
    speechVoices.find((voice) => voice.lang.toLowerCase() === target) ||
    speechVoices.find((voice) => voice.lang.toLowerCase().startsWith(`${family}-`)) ||
    null
  );
}

function speakWord(word, lang, trigger) {
  if (!word || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  refreshSpeechVoices();

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = lang;
  utterance.voice = pickSpeechVoice(lang);
  utterance.rate = lang === "ko-KR" ? 0.88 : 0.92;
  utterance.pitch = 1;

  document.querySelectorAll(".speak-button.is-speaking").forEach((button) => {
    button.classList.remove("is-speaking");
  });
  trigger?.classList.add("is-speaking");
  utterance.onend = () => trigger?.classList.remove("is-speaking");
  utterance.onerror = () => trigger?.classList.remove("is-speaking");

  window.speechSynthesis.speak(utterance);
}

if ("speechSynthesis" in window) {
  refreshSpeechVoices();
  window.speechSynthesis.addEventListener("voiceschanged", refreshSpeechVoices);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest(".speak-button");
  if (!button) return;
  speakWord(button.dataset.speakWord, button.dataset.speakLang, button);
});

function render() {
  const parts = shanghaiParts();
  const key = dateKey(parts);
  const date = utcDate(parts);
  const weekday = WEEKDAYS[date.getUTCDay()];
  const lunar = solarToLunar(date);
  const ganzhi = dayGanZhi(date);
  const seed = seedFromDate(parts);
  const monthDayKey = `${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
  const fact = FACTS[seededIndex(seed, FACTS.length)];
  const history = HISTORY_BY_DATE[monthDayKey] || FALLBACK_HISTORY[seededIndex(seed, FALLBACK_HISTORY.length)];

  document.querySelector("#today-eyebrow").textContent = `${key} · ${weekday}`;
  document.querySelector("#solar-date").textContent = `${parts.year}年${parts.month}月${parts.day}日 ${weekday}`;
  document.querySelector("#lunar-date").textContent = `农历${lunar.isLeap ? "闰" : ""}${lunarMonthName(lunar.month)}${lunarDayName(lunar.day)}`;
  document.querySelector("#ganzhi-date").textContent = `${ganzhi.text} · ${ganzhi.element}日`;

  renderColorCards(ganzhi.element);
  renderZodiac(parts);
  renderWordCards(document.querySelector("#english-words"), pickMany(ENGLISH_WORDS, 5, seed), false);
  renderWordCards(document.querySelector("#korean-words"), pickMany(KOREAN_WORDS, 5, seed + 31), true);

  document.querySelector("#fact-title").textContent = fact[0];
  document.querySelector("#fact-answer").textContent = fact[1];
  document.querySelector("#history-title").textContent = history.title;
  document.querySelector("#history-answer").textContent = history.body;
  document.querySelector("#history-sources").innerHTML = history.sources
    .map(([name, href]) => `<a href="${href}" target="_blank" rel="noreferrer">${name}</a>`)
    .join("");

  renderedDateKey = key;
  loadGeneratedContent(key);
}

render();

setInterval(() => {
  const nextKey = dateKey(shanghaiParts());
  if (nextKey !== renderedDateKey) render();
}, 60 * 1000);
