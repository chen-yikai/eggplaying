import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateJSON, hasGemini } from '../lib/gemini';

const g = (id, type, zh, en, emoji, secs, kind, dz, de, extra = {}) => ({ id, type, zh, en, emoji, secs, kind, dz, de, ...extra });

export const GAMES = [
  g('sudoku', 'puzzle', '迷你數獨', 'Mini Sudoku', '🔢', 90, 'sudoku', '每列每行 1～4 不重複', 'No repeats in any row or column'),
  g('wordsearch', 'puzzle', '找字遊戲', 'Word Search', '🔤', 60, 'wordsearch', '依序點出藏起來的單字', 'Tap the hidden word in order'),
  g('finddiff', 'puzzle', '找不同', 'Spot the Odd', '🔍', 45, 'finddiff', '一眼抓出不一樣的圖案', 'Find the one that differs'),
  g('matchstick', 'puzzle', '火柴棒謎題', 'Matchsticks', '🔥', 90, 'matchstick', '移動一根，算式就成立', 'Move one stick to fix the sum'),
  g('slide', 'puzzle', '數字拼圖', 'Sliding Tiles', '🧩', 120, 'slide', '把數字滑回 1～8', 'Slide the tiles back to 1–8'),
  g('memory', 'puzzle', '記憶配對', 'Memory Match', '🃏', 90, 'memory', '翻牌找出所有配對', 'Flip cards to find every pair'),
  g('rebus', 'puzzle', '圖像猜謎', 'Emoji Rebus', '🧠', 90, 'quiz', '看表情符號猜答案', 'Guess the answer from emoji', { ai: 'rebus' }),
  g('maze', 'puzzle', '迷宮', 'Maze', '🌀', 60, 'maze', '每次都是新迷宮', 'A brand-new maze every time'),
  g('logic', 'puzzle', '邏輯推理', 'Logic Puzzles', '💭', 120, 'quiz', '短短幾句，推出答案', 'Short clues, one conclusion', { ai: 'logic' }),
  g('g2048', 'puzzle', '數字合成', '2048 Sprint', '🎯', 180, 'g2048', '三分鐘衝最高分', 'Highest score in three minutes'),
  g('quizrush', 'challenge', '快問快答', 'Quiz Rush', '⚡', 45, 'quiz', '45 秒答越多越好', 'Answer fast for 45 seconds', { ai: 'quiz', limit: 45 }),
  g('truefalse', 'challenge', '是非搶答', 'True or False', '⭕', 30, 'quiz', '30 秒判斷真假', 'Call it in 30 seconds', { ai: 'truefalse', limit: 30 }),
  g('idiom', 'challenge', '成語填空', 'Proverb Fill', '📜', 45, 'quiz', '補上缺的那個字', 'Fill in the missing word', { ai: 'idiom', limit: 45 }),
  g('riddle', 'challenge', '謎語衝刺', 'Riddle Dash', '🎭', 60, 'quiz', '腦筋急轉彎限時版', 'Brain teasers against the clock', { ai: 'riddle', limit: 60 }),
  g('oddone', 'challenge', '誰是異類', 'Odd One Out', '👀', 45, 'quiz', '選出不屬於同類的', 'Pick what does not belong', { ai: 'oddone', limit: 45 }),
  g('mental', 'challenge', '心算衝刺', 'Mental Math', '➕', 45, 'mental', '45 秒連續心算', 'Rapid sums for 45 seconds'),
  g('stroop', 'challenge', '顏色陷阱', 'Colour Trap', '🎨', 30, 'stroop', '選字的顏色，不是字義', 'Pick the ink, not the word'),
  g('reaction', 'challenge', '反應力', 'Reaction', '🚦', 30, 'reaction', '看到提示立刻按', 'Tap the moment it says go'),
  g('schulte', 'challenge', '數字追擊', 'Number Chase', '🏃', 40, 'schulte', '照順序點完 1～16', 'Tap 1 to 16 in order'),
  g('simon', 'challenge', '記憶序列', 'Sequence', '🎵', 60, 'simon', '跟著亮燈順序按', 'Repeat the growing sequence'),
];
export const gameById = id => GAMES.find(x => x.id === id);
export const shuffle = a => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

const q = (zp, ep, zo, eo, answer) => ({ zh: { prompt: zp, options: zo, answer }, en: { prompt: ep, options: eo, answer } });
const TF = [['對', '錯'], ['True', 'False']];
const tf = (zp, ep, yes) => q(zp, ep, TF[0], TF[1], yes ? 0 : 1);

const BUILTIN = {
  rebus: [
    q('🌧️ + 🏹 猜天氣現象', '🌧️ + 🏹 guess the weather', ['彩虹', '颱風', '閃電', '下雪'], ['Rainbow', 'Typhoon', 'Lightning', 'Snow'], 0),
    q('🐝 + 🍯 猜甜食來源', '🐝 + 🍯 guess the food', ['蜂蜜', '果醬', '砂糖', '巧克力'], ['Honey', 'Jam', 'Sugar', 'Chocolate'], 0),
    q('🌙 + 🍰 猜節慶', '🌙 + 🍰 guess the festival', ['中秋節', '端午節', '元宵節', '清明節'], ['Mid-Autumn', 'Dragon Boat', 'Lantern', 'Qingming'], 0),
    q('🧊 + 🏔️ 猜地形', '🧊 + 🏔️ guess the landform', ['冰川', '沙漠', '火山', '草原'], ['Glacier', 'Desert', 'Volcano', 'Prairie'], 0),
    q('🐉 + 🛶 猜節慶', '🐉 + 🛶 guess the festival', ['端午節', '春節', '中秋節', '重陽節'], ['Dragon Boat', 'Lunar New Year', 'Mid-Autumn', 'Double Ninth'], 0),
  ],
  logic: [
    q('小明比小華高，小華比小美高。誰最矮？', 'Al is taller than Bo, Bo is taller than Cy. Who is shortest?', ['小美', '小華', '小明', '無法判斷'], ['Cy', 'Bo', 'Al', 'Cannot tell'], 0),
    q('所有貓都是動物，咪咪是貓。所以？', 'All cats are animals. Mimi is a cat. So?', ['咪咪是動物', '動物都是貓', '咪咪不是動物', '無法判斷'], ['Mimi is an animal', 'All animals are cats', 'Mimi is not an animal', 'Cannot tell'], 0),
    q('2、4、8、16，下一個數字？', '2, 4, 8, 16, what comes next?', ['32', '24', '20', '18'], ['32', '24', '20', '18'], 0),
    q('今天星期三，再過 10 天是星期幾？', 'Today is Wednesday. What day is it in 10 days?', ['星期六', '星期五', '星期日', '星期一'], ['Saturday', 'Friday', 'Sunday', 'Monday'], 0),
    q('三人排隊，甲不在最前，乙在最後。誰在最前？', 'Three queue. A is not first, B is last. Who is first?', ['丙', '甲', '乙', '無法判斷'], ['C', 'A', 'B', 'Cannot tell'], 0),
  ],
  quiz: [
    q('太陽系最大的行星？', 'Largest planet in the solar system?', ['木星', '土星', '地球', '海王星'], ['Jupiter', 'Saturn', 'Earth', 'Neptune'], 0),
    q('水的化學式？', 'Chemical formula of water?', ['H₂O', 'CO₂', 'O₂', 'NaCl'], ['H₂O', 'CO₂', 'O₂', 'NaCl'], 0),
    q('一年有幾個季節？', 'How many seasons in a year?', ['4', '3', '5', '6'], ['4', '3', '5', '6'], 0),
    q('彩虹通常有幾種顏色？', 'How many colours in a rainbow?', ['7', '5', '6', '8'], ['7', '5', '6', '8'], 0),
    q('世界最高的山峰？', 'World\'s highest mountain?', ['聖母峰', '玉山', '富士山', 'K2'], ['Everest', 'Yushan', 'Fuji', 'K2'], 0),
  ],
  truefalse: [
    tf('章魚有三顆心臟。', 'An octopus has three hearts.', true),
    tf('聲音在真空中傳得最快。', 'Sound travels fastest in a vacuum.', false),
    tf('香蕉在植物學上屬於漿果。', 'Botanically, a banana is a berry.', true),
    tf('金星是離太陽最近的行星。', 'Venus is the closest planet to the Sun.', false),
    tf('人體最大的器官是皮膚。', 'Skin is the largest human organ.', true),
  ],
  idiom: [
    q('一石二＿', 'Kill two birds with one ＿', ['鳥', '魚', '馬', '虎'], ['stone', 'stick', 'arrow', 'hand'], 0),
    q('畫蛇添＿', 'A picture is worth a thousand ＿', ['足', '翼', '尾', '角'], ['words', 'coins', 'days', 'lines'], 0),
    q('守株待＿', 'The early bird catches the ＿', ['兔', '鹿', '羊', '鳥'], ['worm', 'fish', 'cat', 'seed'], 0),
    q('對牛彈＿', 'Don\'t cry over spilled ＿', ['琴', '笛', '鼓', '歌'], ['milk', 'tea', 'wine', 'water'], 0),
    q('亡羊補＿', 'Better late than ＿', ['牢', '門', '牆', '網'], ['never', 'sorry', 'early', 'ever'], 0),
  ],
  riddle: [
    q('什麼東西越洗越髒？', 'What gets wetter the more it dries?', ['水', '衣服', '碗', '手'], ['A towel', 'A river', 'A cup', 'Rain'], 0),
    q('什麼東西有腳卻不會走？', 'What has legs but cannot walk?', ['桌子', '小狗', '小鳥', '螞蟻'], ['A table', 'A dog', 'A bird', 'An ant'], 0),
    q('什麼門永遠關不上？', 'What has keys but opens no locks?', ['球門', '大門', '車門', '房門'], ['A piano', 'A door', 'A safe', 'A car'], 0),
    q('什麼東西有很多牙齒卻不會咬人？', 'What has many teeth but cannot bite?', ['梳子', '老虎', '鯊魚', '恐龍'], ['A comb', 'A tiger', 'A shark', 'A dinosaur'], 0),
    q('什麼東西你用得越多，它就越小？', 'What gets smaller the more you use it?', ['肥皂', '書本', '手機', '鞋子'], ['Soap', 'A book', 'A phone', 'A shoe'], 0),
  ],
  oddone: [
    q('哪個不是水果？', 'Which is not a fruit?', ['高麗菜', '蘋果', '香蕉', '葡萄'], ['Cabbage', 'Apple', 'Banana', 'Grape'], 0),
    q('哪個不是哺乳類？', 'Which is not a mammal?', ['鱷魚', '鯨魚', '蝙蝠', '海豚'], ['Crocodile', 'Whale', 'Bat', 'Dolphin'], 0),
    q('哪個不是樂器？', 'Which is not an instrument?', ['書桌', '鋼琴', '小提琴', '吉他'], ['Desk', 'Piano', 'Violin', 'Guitar'], 0),
    q('哪個不是行星？', 'Which is not a planet?', ['月球', '火星', '金星', '土星'], ['The Moon', 'Mars', 'Venus', 'Saturn'], 0),
    q('哪個不是交通工具？', 'Which is not a vehicle?', ['雨傘', '公車', '火車', '腳踏車'], ['Umbrella', 'Bus', 'Train', 'Bicycle'], 0),
  ],
};
const BUILTIN_WORDS = [['CAT', '貓', 'A pet that purrs'], ['MOON', '月亮', 'It orbits Earth'], ['APPLE', '蘋果', 'A crunchy fruit'], ['RIVER', '河流', 'Flowing water'], ['TIGER', '老虎', 'A striped big cat'], ['BREAD', '麵包', 'Baked at breakfast']];
const BUILTIN_PAIRS = [['🐶', '🐱'], ['⭐', '🌙'], ['🍎', '🍌'], ['🚗', '🚲'], ['☀️', '☁️'], ['🐟', '🐢']];
const BUILTIN_EMOJI = ['🍕', '🐼', '🚀', '🎸', '🌵', '🦊', '🍩', '⚽', '🌈', '🐙', '🎈', '🍉'];

const MCQ_SCHEMA = { type: 'object', properties: { questions: { type: 'array', minItems: 3, maxItems: 12, items: { type: 'object', properties: {
  prompt: { type: 'string' }, options: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 4 }, answer: { type: 'integer', minimum: 0, maximum: 3 },
}, required: ['prompt', 'options', 'answer'] } } }, required: ['questions'] };

const STYLE = {
  rebus: '用 2 到 4 個 emoji 暗示一個常見事物，提問並給 4 個選項',
  logic: '三句話以內的邏輯推理或數列題，答案必須能嚴格推導，給 4 個選項',
  quiz: '十秒內能回答的有趣常識題，給 4 個選項',
  truefalse: '令人意外但確實為真或為假的冷知識敘述，options 固定為對與錯（英文為 True 與 False）',
  idiom: '中文時為成語缺一字（用＿標示），英文時為諺語缺一字，給 4 個選項',
  riddle: '簡短的謎語或腦筋急轉彎，答案要公認，給 4 個選項',
  oddone: '列出同類事物中混入一個異類，問哪個不屬於同類，給 4 個選項',
};

const norm = s => String(s || '').trim();
const validMCQ = x => {
  const options = (x.options || []).map(norm);
  return norm(x.prompt) && options.length >= 2 && options.every(Boolean) && new Set(options).size === options.length
    && Number.isInteger(x.answer) && x.answer >= 0 && x.answer < options.length;
};
const shuffleOptions = x => {
  const correct = x.options[x.answer];
  const options = shuffle(x.options);
  return { prompt: x.prompt, options, answer: options.indexOf(correct) };
};

async function seen(id) { try { return JSON.parse(await AsyncStorage.getItem(`seen:${id}`)) || []; } catch { return []; } }
async function remember(id, items) { try { await AsyncStorage.setItem(`seen:${id}`, JSON.stringify([...items, ...(await seen(id))].slice(0, 40))); } catch {} }

const langName = lang => (lang === 'zh' ? '繁體中文（台灣用語）' : 'English');
const SYSTEM = '你是手機休閒遊戲的出題者。題目要新鮮有趣、事實正確、適合所有年齡、十秒內能讀完，不要重複已列出的題目。';

// Returns { items, source }. Any failure falls back to the built-in bank so play never stalls.
export async function loadQuiz(game, lang, count = 8) {
  const avoid = await seen(game.id);
  if (hasGemini()) {
    try {
      const { questions } = await generateJSON({
        system: SYSTEM, schema: MCQ_SCHEMA,
        input: `語言：${langName(lang)}。題型：${STYLE[game.ai]}。出 ${count} 題。answer 是正確選項在 options 的索引。避開：${JSON.stringify(avoid.slice(0, 20))}`,
      });
      const items = questions.filter(validMCQ).map(x => ({ ...x, prompt: norm(x.prompt), options: x.options.map(norm) })).filter(x => !avoid.includes(x.prompt));
      if (items.length >= 3) { remember(game.id, items.map(i => i.prompt)); return { items: items.map(shuffleOptions), source: 'gemini' }; }
    } catch (e) { console.warn('Gemini quiz fallback:', e.message); }
  }
  return { items: shuffle(BUILTIN[game.ai]).map(x => shuffleOptions(x[lang])), source: 'builtin' };
}

export async function loadWords(lang, count = 3) {
  if (hasGemini()) {
    try {
      const avoid = await seen('wordsearch');
      const { words } = await generateJSON({
        system: SYSTEM,
        schema: { type: 'object', properties: { words: { type: 'array', minItems: 3, maxItems: 6, items: { type: 'object', properties: { word: { type: 'string' }, hint: { type: 'string' } }, required: ['word', 'hint'] } } }, required: ['words'] },
        input: `給 ${count + 2} 個 3 到 5 個字母的常見英文單字（全大寫 A-Z），hint 用${langName(lang)}提示意思。避開：${JSON.stringify(avoid.slice(0, 20))}`,
      });
      const items = words.map(w => ({ word: norm(w.word).toUpperCase(), hint: norm(w.hint) })).filter(w => /^[A-Z]{3,5}$/.test(w.word) && w.hint && !avoid.includes(w.word));
      if (items.length >= count) { remember('wordsearch', items.map(i => i.word)); return { items: items.slice(0, count), source: 'gemini' }; }
    } catch (e) { console.warn('Gemini words fallback:', e.message); }
  }
  return { items: shuffle(BUILTIN_WORDS).slice(0, count).map(([word, z, e]) => ({ word, hint: lang === 'zh' ? z : e })), source: 'builtin' };
}

const EMOJI_RE = /^[^\x00-\x7F]{1,8}$/;
export async function loadPairs(count = 3) {
  if (hasGemini()) {
    try {
      const { pairs } = await generateJSON({
        system: SYSTEM,
        schema: { type: 'object', properties: { pairs: { type: 'array', minItems: 3, maxItems: 6, items: { type: 'object', properties: { base: { type: 'string' }, odd: { type: 'string' } }, required: ['base', 'odd'] } } }, required: ['pairs'] },
        input: `給 ${count + 1} 組外形相近但形狀可分辨的 emoji（不可只靠顏色區分），base 與 odd 各一個 emoji。`,
      });
      const items = pairs.map(p => [norm(p.base), norm(p.odd)]).filter(([a, b]) => a !== b && EMOJI_RE.test(a) && EMOJI_RE.test(b));
      if (items.length >= count) return { items: items.slice(0, count), source: 'gemini' };
    } catch (e) { console.warn('Gemini pairs fallback:', e.message); }
  }
  return { items: shuffle(BUILTIN_PAIRS).slice(0, count), source: 'builtin' };
}

export async function loadEmoji(count = 6) {
  if (hasGemini()) {
    try {
      const { emoji } = await generateJSON({
        system: SYSTEM,
        schema: { type: 'object', properties: { emoji: { type: 'array', minItems: 6, maxItems: 10, items: { type: 'string' } } }, required: ['emoji'] },
        input: `隨機挑一個主題，給 ${count + 2} 個屬於該主題、彼此外形明顯不同的 emoji。`,
      });
      const items = [...new Set(emoji.map(norm))].filter(e => EMOJI_RE.test(e));
      if (items.length >= count) return { items: items.slice(0, count), source: 'gemini' };
    } catch (e) { console.warn('Gemini emoji fallback:', e.message); }
  }
  return { items: shuffle(BUILTIN_EMOJI).slice(0, count), source: 'builtin' };
}
