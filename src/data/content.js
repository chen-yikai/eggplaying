// 四大分類
export const categories = [
  { id: 'puzzle', zh: '益智遊戲', en: 'Puzzle Games', emoji: '🧩' },
  { id: 'challenge', zh: '挑戰遊戲', en: 'Challenge Games', emoji: '🏆' },
  { id: 'adventure', zh: '冒險遊戲', en: 'Adventure Games', emoji: '🗺️' },
  { id: 'social', zh: '話題交流', en: 'Social Hub', emoji: '💬' },
];

export const options = [
  { id: 'idea', zh: '我有想法！', en: 'I have an idea!', emoji: '💡' },
  { id: 'random', zh: '幫我選一個！', en: 'Pick for me!', emoji: '🎲' },
];

export const puzzleGames = [
  ['數獨', 'Sudoku', '🔢'],
  ['找字遊戲', 'Word Search', '🔤'],
  ['找不同', 'Find the Difference', '🔍'],
  ['火柴棒謎題', 'Matchstick Puzzle', '🔥'],
  ['數字拼圖', 'Number Puzzle', '🧩'],
  ['記憶配對', 'Memory Match', '🃏'],
  ['圖像猜謎', 'Rebus Puzzle', '🧠'],
  ['迷宮', 'Maze', '🌀'],
  ['邏輯推理', 'Logic Puzzle', '💭'],
  ['數字合成 2048', '2048', '🎯'],
];

export const topics = [
  {
    id: 1,
    zh: '如果可以擁有一種超能力，你會選什麼？',
    en: 'If you could have one superpower, what would it be?',
    comments: [
      { text: '瞬間移動，這樣就不用趕車了！', anonymous: true },
      { text: '我想要時間暫停！', anonymous: false },
    ],
  },
  {
    id: 2,
    zh: '如果明天不用上課或上班，你最想做什麼？',
    en: 'What would you do if you had a free day tomorrow?',
    comments: [
      { text: '睡到自然醒！', anonymous: false },
    ],
  },
  {
    id: 3,
    zh: '你覺得友情中最重要的是什麼？',
    en: 'What matters most in a friendship?',
    comments: [],
  },
  {
    id: 4,
    zh: '如果能去世界任何一個地方，你想去哪裡？',
    en: 'Where would you go if you could visit anywhere?',
    comments: [],
  },
];
