const CONTENT_VERSION = 5;
const ZODIAC_SIGNS = ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"];
const DAILY_ZODIAC_SIGNS = ["双鱼座", "巨蟹座", "白羊座"];
const SIGN_ELEMENTS = ["火", "土", "风", "水", "火", "土", "风", "水", "火", "土", "风", "水"];
const WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const MOON_PHASES = ["新月后", "上弦前", "上弦后", "盈凸月", "满月前后", "亏凸月", "下弦后", "残月期"];
const DAILY_SIGN_DATA = {
  双鱼座: { signIndex: 11, ruler: "neptune", coRuler: "jupiter" },
  巨蟹座: { signIndex: 3, ruler: "moon" },
  白羊座: { signIndex: 0, ruler: "mars" },
};
const PLANET_NUMBERS = { sun: 1, moon: 2, jupiter: 3, uranus: 4, mercury: 5, venus: 6, neptune: 7, saturn: 8, mars: 9 };
const WEEKDAY_RULERS = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
const ELEMENT_NUMBERS = { 火: 9, 土: 8, 风: 5, 水: 2 };
const MOON_PHASE_NUMBERS = [1, 3, 4, 6, 6, 8, 8, 9];

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
    longitude: Number(lon.toFixed(2)),
    sign: ZODIAC_SIGNS[signIndex],
    element: SIGN_ELEMENTS[signIndex],
  };
}

function aspectAngleDistance(a, b) {
  const diff = Math.abs(normalizeAngle(a - b));
  return diff > 180 ? 360 - diff : diff;
}

function importantAspects(planets) {
  const aspectTypes = [
    { name: "合相", angle: 0, orb: 7 },
    { name: "六合", angle: 60, orb: 4 },
    { name: "四分", angle: 90, orb: 5 },
    { name: "三分", angle: 120, orb: 5 },
    { name: "对分", angle: 180, orb: 6 },
  ];
  const entries = Object.values(planets);
  const aspects = [];

  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const distance = aspectAngleDistance(entries[i].longitude, entries[j].longitude);
      const aspect = aspectTypes
        .map((item) => ({ ...item, orbValue: Math.abs(distance - item.angle) }))
        .filter((item) => item.orbValue <= item.orb)
        .sort((a, b) => a.orbValue - b.orbValue)[0];
      if (aspect) {
        aspects.push({
          label: `${entries[i].label}${aspect.name}${entries[j].label}`,
          angle: Math.round(distance),
          orb: Number(aspect.orbValue.toFixed(1)),
        });
      }
    }
  }

  return aspects.sort((a, b) => a.orb - b.orb).slice(0, 6);
}

export function shanghaiParts(offsetDays = 0) {
  const date = new Date(Date.now() + offsetDays * 86400000);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(value.year),
    month: Number(value.month),
    day: Number(value.day),
  };
}

export function parseDateKey(key) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key || "");
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

export function dateKey(parts) {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

export function weekdayName(parts) {
  return WEEKDAYS[new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay()];
}

export function currentTransits(parts) {
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
  const planets = {
    sun: planetInfo("太阳", sunLon),
    moon: planetInfo("月亮", moonLon),
    mercury: planetInfo("水星", 252.251 + 4.09233445 * days),
    venus: planetInfo("金星", 181.98 + 1.60213034 * days),
    mars: planetInfo("火星", 355.433 + 0.52402068 * days),
    jupiter: planetInfo("木星", 34.351 + 0.08309135 * days),
    saturn: planetInfo("土星", 50.077 + 0.03345965 * days),
    uranus: planetInfo("天王星", 314.055 + 0.01172834 * days),
    neptune: planetInfo("海王星", 304.348 + 0.00598103 * days),
  };

  return {
    ...planets,
    phase: MOON_PHASES[phaseIndex],
    phaseIndex,
    aspects: importantAspects(planets),
  };
}

function normalizeWord(item) {
  return {
    word: String(item.word || "").trim(),
    pronunciation: String(item.pronunciation || "").trim(),
    meaning: String(item.meaning || "").trim(),
    example: String(item.example || "").trim(),
    translation: String(item.translation || "").trim(),
    memoryTip: String(item.memoryTip || item.tip || "").trim(),
  };
}

function normalizeZodiac(item) {
  const luckyNumber = Number(item.luckyNumber);
  const sections = item.sections || {};
  const normalizeSection = (section = {}) => ({
    paragraphs: Array.isArray(section.paragraphs) ? section.paragraphs.map(String).filter(Boolean).slice(0, 4) : [],
    good: Array.isArray(section.good) ? section.good.map(String).filter(Boolean).slice(0, 5) : [],
    avoid: Array.isArray(section.avoid) ? section.avoid.map(String).filter(Boolean).slice(0, 5) : [],
    quote: section.quote ? String(section.quote) : "",
    quotes: Array.isArray(section.quotes) ? section.quotes.map(String).filter(Boolean).slice(0, 2) : [],
  });
  return {
    sign: String(item.sign || "").trim(),
    luckyNumber: Number.isInteger(luckyNumber) && luckyNumber >= 1 && luckyNumber <= 99 ? luckyNumber : null,
    sections: {
      love: normalizeSection(sections.love),
      work: normalizeSection(sections.work),
      money: normalizeSection(sections.money),
      advice: normalizeSection(sections.advice),
    },
  };
}

function digitalRoot(number) {
  return ((number - 1) % 9) + 1;
}

function astrologicalLuckyNumber(parts, signName, transits) {
  const sign = DAILY_SIGN_DATA[signName];
  if (!sign) return 1;
  const weekdayIndex = new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay();
  const dayRuler = WEEKDAY_RULERS[weekdayIndex];
  const rulerNumber = PLANET_NUMBERS[sign.ruler] || 1;
  const weekdayNumber = PLANET_NUMBERS[dayRuler] || 1;
  const transitElement = transits[sign.ruler]?.element || SIGN_ELEMENTS[sign.signIndex];
  const transitNumber = ELEMENT_NUMBERS[transitElement] || rulerNumber;
  const moonPhaseNumber = MOON_PHASE_NUMBERS[transits.phaseIndex] || 2;
  const dailyActivationNumber = digitalRoot(weekdayNumber + transitNumber + moonPhaseNumber);
  return Number(`${rulerNumber}${dailyActivationNumber}`);
}

function fallbackLuckyNumberReason(parts, signName, transits) {
  const sign = DAILY_SIGN_DATA[signName];
  if (!sign) return "";
  const weekdayIndex = new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay();
  const dayRuler = WEEKDAY_RULERS[weekdayIndex];
  const ruler = transits[sign.ruler];
  const day = transits[dayRuler];
  const aspect = (transits.aspects || []).find((item) => ruler && item.label.includes(ruler.label));
  return [
    `${signName}今天先看守护星${ruler?.label || ""}，它对应数字 ${PLANET_NUMBERS[sign.ruler]}。`,
    `今日星期主星是${day?.label || ""}，月亮落在${transits.moon.sign}，让当天的情绪底色更清楚。`,
    aspect ? `${aspect.label}带来额外的推动，所以这个数字更适合今天。` : `${transits.phase}让能量适合收束到一个简单明确的数字上。`,
  ].filter(Boolean).join("");
}

function validateContent(raw, parts, transits) {
  const zodiacItems = (raw.zodiac || []).map(normalizeZodiac).filter((item) => item.sign);
  const content = {
    version: CONTENT_VERSION,
    date: dateKey(parts),
    weekday: weekdayName(parts),
    generatedAt: new Date().toISOString(),
    transits,
    englishWords: (raw.englishWords || []).map(normalizeWord).filter((item) => item.word).slice(0, 5),
    koreanWords: (raw.koreanWords || []).map(normalizeWord).filter((item) => item.word).slice(0, 5),
    fact: {
      question: String(raw.fact?.question || "").trim(),
      answer: String(raw.fact?.answer || "").trim(),
    },
    history: {
      title: String(raw.history?.title || "").trim(),
      body: String(raw.history?.body || "").trim(),
      sources: Array.isArray(raw.history?.sources) ? raw.history.sources.map((source) => [String(source[0] || ""), String(source[1] || "")]).filter(([name, href]) => name && href).slice(0, 3) : [],
    },
    zodiac: DAILY_ZODIAC_SIGNS.map((sign) => {
      const item = zodiacItems.find((entry) => entry.sign === sign);
      if (!item) return null;
      return {
        ...item,
        luckyNumber: item.luckyNumber || astrologicalLuckyNumber(parts, sign, transits),
      };
    }).filter(Boolean),
  };

  if (content.englishWords.length !== 5) throw new Error("AI response must contain exactly 5 English words.");
  if (content.koreanWords.length !== 5) throw new Error("AI response must contain exactly 5 Korean words.");
  if (!content.fact.question || !content.fact.answer) throw new Error("AI response missing fact.");
  if (!content.history.title || !content.history.body) throw new Error("AI response missing history.");
  if (content.zodiac.length !== 3) throw new Error("AI response must contain 3 zodiac entries.");
  if (content.zodiac.map((item) => item.sign).join("、") !== DAILY_ZODIAC_SIGNS.join("、")) throw new Error(`AI response zodiac signs must be ${DAILY_ZODIAC_SIGNS.join("、")}.`);
  return content;
}

export async function generateDailyContent(parts, used = {}) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not configured.");

  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
  const key = dateKey(parts);
  const transits = currentTransits(parts);
  const usedFacts = (used.facts || []).slice(-30);
  const usedHistory = (used.history || []).slice(-30);

  const prompt = `请为 ${key}（${weekdayName(parts)}，北京时间）生成一个每日小知识网站的数据。

已计算出的真实天象（黄道星座和近似黄经）如下，星座运势必须基于这些数据写，不要凭空写模板：
${JSON.stringify(transits, null, 2)}

最近用过的冷知识问题，避免重复：
${usedFacts.join("；") || "无"}

最近用过的历史标题，避免重复：
${usedHistory.join("；") || "无"}

请只返回严格 JSON，不要 Markdown，不要解释。JSON 结构如下：
{
  "englishWords": [{"word":"","pronunciation":"","meaning":"","example":"","translation":"","memoryTip":""}],
  "koreanWords": [{"word":"","pronunciation":"","meaning":"","example":"","translation":"","memoryTip":""}],
  "fact": {"question":"","answer":""},
  "history": {"title":"","body":"","sources":[]},
  "zodiac": [
    {
      "sign": "双鱼座",
      "luckyNumber": 7,
      "sections": {
        "love": {"paragraphs": []},
        "work": {"paragraphs": [], "good": [], "avoid": []},
        "money": {"paragraphs": [], "quote": ""},
        "advice": {"quotes": []}
      }
    }
  ]
}

内容要求：
1. englishWords 必须 5 个，生活/职场常用，含词义、音标、英文例句、中文翻译、记忆提示。
2. koreanWords 必须 5 个，偏生活化和日常交流，优先选择吃饭、咖啡、购物、便利店、交通、问路、天气、身体感受、家居和出门场景中的常用词；少选会议、文件、预算、审批等职场词。含词义、发音罗马音、韩文例句、中文翻译、记忆提示。
3. fact 先抛问题再回答，answer 控制在 200-300 个中文字符，轻松、有趣、通俗。
4. history 从科技、电影、音乐等领域挑一个“历史上的今天”相关事件，body 控制在 200-300 个中文字符。不要编造来源链接，sources 可以为空数组。
5. zodiac 按顺序只写双鱼座、巨蟹座、白羊座。每个星座必须包含 luckyNumber；其他内容只包含 感情/工作/财运/今日建议 四栏。
6. 星座文案参考这种风格：具体、短句、有节奏，可以有“今天适合/不适合”列表和一个提问式 quote；不要幸运色、综合运势、关键词。
7. 今日建议只写 1-2 句，有力量感，不鸡汤，不宿命论，不夸张预测。

幸运数字生成规则：
你是一位现代西方占星师，也懂基础数字象征学。请为每个 zodiac 星座生成今日幸运数字。
- 自动使用今天日期：${key}。
- 基于上方今日真实天象来判断，不要随机编。
- 综合考虑：该星座守护星、守护星对应数字、今日星期对应行星、今日月亮星座、今日重要相位、当日整体能量氛围。
- 常用行星数字对应：太阳 = 1，月亮 = 2，木星 = 3，天王星 = 4，水星 = 5，金星 = 6，海王星 = 7，土星 = 8，火星 = 9。
- 双鱼座按现代守护星海王星判断，可把传统守护星木星作为辅助参考；巨蟹座看月亮；白羊座看火星。
- luckyNumber 必须是 1-99 的整数。
- 不要输出幸运数字理由字段，理由只用于你判断数字，不要写入 JSON。`;

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      stream: false,
      thinking: { type: "disabled" },
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "你是严谨的中文内容编辑、实用语言老师和现代西方占星内容作者。你必须输出可解析 JSON。" },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`DeepSeek API error ${response.status}: ${message}`);
  }

  const completion = await response.json();
  const text = completion.choices?.[0]?.message?.content;
  if (!text) throw new Error("DeepSeek API returned an empty response.");
  return validateContent(JSON.parse(text), parts, transits);
}

export function updateUsedTopics(used = {}, content) {
  return {
    facts: [...(used.facts || []), content.fact.question].filter(Boolean).slice(-120),
    history: [...(used.history || []), content.history.title].filter(Boolean).slice(-120),
  };
}
