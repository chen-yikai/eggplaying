
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

// 四大分類
const categories = [
  { id: 'puzzle', zh: '益智遊戲', en: 'Puzzle Games', emoji: '🧩' },
  { id: 'challenge', zh: '挑戰遊戲', en: 'Challenge Games', emoji: '🏆' },
  { id: 'adventure', zh: '冒險遊戲', en: 'Adventure Games', emoji: '🗺️' },
  { id: 'social', zh: '話題交流', en: 'Social Hub', emoji: '💬' },
];

const options = [
  { id: 'idea', zh: '我有想法！', en: 'I have an idea!', emoji: '💡' },
  { id: 'random', zh: '幫我選一個！', en: 'Pick for me!', emoji: '🎲' },
];

const puzzleGames = [
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

const topics = [
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

const translations = {
  zh: {
    subtitle: '找點有趣的事情做吧！',
    categories: '遊戲類型',
    today: '今天想做什麼？',
    selected: '已選擇',
    confirm: '就決定是你了！',
    back: '← 返回首頁',
    discussion: '話題討論',
    friends: '好友',
    groups: '群組',
    anonymous: '匿名留言',
    send: '送出留言',
    placeholder: '寫下你的想法...',
    invite: '邀請朋友',
    inviteDesc: '分享邀請碼，讓朋友加入你。',
    copyCode: '複製邀請碼',
    createGroup: '建立群組',
    groupName: '輸入群組名稱',
    create: '建立',
    noGroups: '目前還沒有群組。',
    noFriends: '目前還沒有好友。',
    comments: '則留言',
    adventure: '冒險遊戲內容即將推出！',
    gameComing: '遊戲內容即將推出！',
  },
  en: {
    subtitle: 'Find something fun to do!',
    categories: 'Categories',
    today: 'What do you want to do today?',
    selected: 'Selected',
    confirm: "You're the one!",
    back: '← Back to Home',
    discussion: 'Topics',
    friends: 'Friends',
    groups: 'Groups',
    anonymous: 'Post anonymously',
    send: 'Send',
    placeholder: 'Write your thoughts...',
    invite: 'Invite Friends',
    inviteDesc: 'Share your invite code with friends.',
    copyCode: 'Copy Invite Code',
    createGroup: 'Create Group',
    groupName: 'Enter group name',
    create: 'Create',
    noGroups: 'No groups yet.',
    noFriends: 'No friends yet.',
    comments: 'comments',
    adventure: 'Adventure games coming soon!',
    gameComing: 'Game content coming soon!',
  },
};

export default function App() {
  const [language, setLanguage] = useState('zh');
  const [page, setPage] = useState('home');
  const [selected, setSelected] = useState(null);

  // 社群功能狀態
  const [socialTab, setSocialTab] = useState('topics');
  const [activeTopic, setActiveTopic] = useState(null);
  const [topicData, setTopicData] = useState(topics);
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [friends] = useState([]);
  const [inviteCode] = useState('PLAY2026');

  // 益智遊戲狀態
  const [activeGame, setActiveGame] = useState(null);

  const t = translations[language];

  const switchLanguage = (
    <View style={styles.languageRow}>
      <TouchableOpacity onPress={() => setLanguage('zh')}>
        <Text style={language === 'zh' ? styles.activeLang : styles.lang}>
          中文
        </Text>
      </TouchableOpacity>
      <Text style={styles.lang}> | </Text>
      <TouchableOpacity onPress={() => setLanguage('en')}>
        <Text style={language === 'en' ? styles.activeLang : styles.lang}>
          EN
        </Text>
      </TouchableOpacity>
    </View>
  );

  const goHome = () => {
    setPage('home');
    setSelected(null);
    setActiveTopic(null);
    setActiveGame(null);
  };

  const confirmSelection = () => {
    if (selected) {
      setPage(selected.id);
      setSelected(null);
      setSocialTab('topics');
      setActiveTopic(null);
      setActiveGame(null);
    }
  };

  // 首頁
  if (page === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {switchLanguage}

          <Text style={styles.logo}>Let's Play!</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>

          <Text style={styles.sectionTitle}>{t.categories}</Text>

          <View style={styles.grid}>
            {categories.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  selected?.id === item.id && styles.selectedCard,
                ]}
                onPress={() => setSelected(item)}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.cardTitle}>
                  {language === 'zh' ? item.zh : item.en}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>{t.today}</Text>

          {options.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.optionCard,
                selected?.id === item.id && styles.selectedCard,
              ]}
              onPress={() => setSelected(item)}
            >
              <Text style={styles.optionEmoji}>{item.emoji}</Text>
              <Text style={styles.cardTitle}>
                {language === 'zh' ? item.zh : item.en}
              </Text>
            </TouchableOpacity>
          ))}

          {selected && (
            <View style={styles.confirmArea}>
              <Text style={styles.selectedText}>
                {t.selected}：
                {language === 'zh' ? selected.zh : selected.en}
              </Text>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmSelection}
              >
                <Text style={styles.confirmText}>{t.confirm}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 益智遊戲
  if (page === 'puzzle') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {switchLanguage}

          <TouchableOpacity
            onPress={() => {
              if (activeGame !== null) {
                setActiveGame(null);
              } else {
                goHome();
              }
            }}
          >
            <Text style={styles.backText}>
              {activeGame !== null
                ? (language === 'zh' ? '← 返回遊戲列表' : '← Back to Games')
                : t.back}
            </Text>
          </TouchableOpacity>

          {activeGame === null ? (
            <>
              <Text style={styles.logo}>
                🧩 {language === 'zh' ? '益智遊戲' : 'Puzzle Games'}
              </Text>
              <Text style={styles.subtitle}>
                {language === 'zh'
                  ? '選一款遊戲開始挑戰！'
                  : 'Choose a game to play!'}
              </Text>

              {puzzleGames.map((game, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.gameCard}
                  onPress={() => setActiveGame(index)}
                >
                  <Text style={styles.gameEmoji}>{game[2]}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>
                      {language === 'zh' ? game[0] : game[1]}
                    </Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <>
              <Text style={styles.logo}>
                {puzzleGames[activeGame][2]}{' '}
                {language === 'zh'
                  ? puzzleGames[activeGame][0]
                  : puzzleGames[activeGame][1]}
              </Text>

              {activeGame === 0 && <Sudoku zh={language === 'zh'} />}
              {activeGame === 1 && <WordSearch zh={language === 'zh'} />}
              {activeGame === 2 && <FindDifferent zh={language === 'zh'} />}
              {activeGame === 3 && <Matchstick zh={language === 'zh'} />}
              {activeGame === 4 && <NumberPuzzle zh={language === 'zh'} />}
              {activeGame > 4 && (
                <Text style={styles.emptyText}>
                  {language === 'zh'
                    ? '這款遊戲正在準備中！'
                    : 'This game is coming soon!'}
                </Text>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 話題交流
  if (page === 'social') {
    const selectedTopic = topicData.find(
      item => item.id === activeTopic
    );

    const addComment = () => {
      if (!comment.trim() || !selectedTopic) return;

      setTopicData(old =>
        old.map(item =>
          item.id === activeTopic
            ? {
                ...item,
                comments: [
                  ...item.comments,
                  { text: comment.trim(), anonymous },
                ],
              }
            : item
        )
      );

      setComment('');
    };

    const createNewGroup = () => {
      if (!groupName.trim()) return;

      setGroups(old => [...old, groupName.trim()]);
      setGroupName('');

      Alert.alert(
        language === 'zh' ? '建立成功' : 'Created',
        language === 'zh' ? '群組已建立！' : 'Your group has been created!'
      );
    };

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {switchLanguage}

          <TouchableOpacity onPress={goHome}>
            <Text style={styles.backText}>{t.back}</Text>
          </TouchableOpacity>

          <Text style={styles.logo}>
            💬 {language === 'zh' ? '話題交流' : 'Social Hub'}
          </Text>

          <Text style={styles.subtitle}>
            {language === 'zh'
              ? '分享想法，認識更多朋友！'
              : 'Share ideas and meet new friends!'}
          </Text>

          <View style={styles.tabRow}>
            {[
              ['topics', t.discussion],
              ['friends', t.friends],
              ['groups', t.groups],
            ].map(([id, label]) => (
              <TouchableOpacity
                key={id}
                onPress={() => setSocialTab(id)}
                style={[
                  styles.tab,
                  socialTab === id && styles.activeTab,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    socialTab === id && styles.activeTabText,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {socialTab === 'topics' && !selectedTopic && (
            <>
              <Text style={styles.sectionTitle}>
                {language === 'zh' ? '今日話題' : "Today's Topics"}
              </Text>

              {topicData.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.topicCard}
                  onPress={() => setActiveTopic(item.id)}
                >
                  <Text style={styles.topicLabel}>
                    {language === 'zh' ? '熱門話題' : 'TOPIC'}
                  </Text>
                  <Text style={styles.topicTitle}>
                    {language === 'zh' ? item.zh : item.en}
                  </Text>
                  <Text style={styles.commentCount}>
                    {item.comments.length} {t.comments} →
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {socialTab === 'topics' && selectedTopic && (
            <>
              <TouchableOpacity onPress={() => setActiveTopic(null)}>
                <Text style={styles.backText}>
                  {language === 'zh' ? '← 返回話題' : '← Back to Topics'}
                </Text>
              </TouchableOpacity>

              <View style={styles.topicCard}>
                <Text style={styles.topicTitle}>
                  {language === 'zh'
                    ? selectedTopic.zh
                    : selectedTopic.en}
                </Text>
              </View>

              <Text style={styles.sectionTitle}>
                {language === 'zh' ? '留言區' : 'Comments'}
              </Text>

              {selectedTopic.comments.map((item, index) => (
                <View key={index} style={styles.commentCard}>
                  <Text style={styles.commentName}>
                    {item.anonymous
                      ? (language === 'zh' ? '匿名使用者' : 'Anonymous')
                      : (language === 'zh' ? '使用者' : 'User')}
                  </Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              ))}

              <View style={styles.commentInputArea}>
                <TextInput
                  style={styles.input}
                  value={comment}
                  onChangeText={setComment}
                  placeholder={t.placeholder}
                  multiline
                />

                <TouchableOpacity
                  style={styles.anonymousRow}
                  onPress={() => setAnonymous(!anonymous)}
                >
                  <Text style={styles.checkbox}>
                    {anonymous ? '☑' : '☐'}
                  </Text>
                  <Text>{t.anonymous}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={addComment}
                >
                  <Text style={styles.confirmText}>{t.send}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {socialTab === 'friends' && (
            <>
              <View style={styles.topicCard}>
                <Text style={styles.topicTitle}>🔗 {t.invite}</Text>
                <Text style={styles.subtitle}>{t.inviteDesc}</Text>
                <Text style={styles.inviteCode}>{inviteCode}</Text>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => Alert.alert(
                    language === 'zh' ? '邀請碼' : 'Invite Code',
                    language === 'zh'
                      ? '這是示範邀請碼，正式版需要串接好友系統。'
                      : 'Demo invite code. A real friend system is needed.'
                  )}
                >
                  <Text style={styles.confirmText}>{t.copyCode}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>{t.friends}</Text>

              {friends.length === 0 ? (
                <Text style={styles.emptyText}>{t.noFriends}</Text>
              ) : (
                friends.map((friend, index) => (
                  <View key={index} style={styles.commentCard}>
                    <Text>{'👤 ' + friend}</Text>
                  </View>
                ))
              )}
            </>
          )}

          {socialTab === 'groups' && (
            <>
              <Text style={styles.sectionTitle}>{t.createGroup}</Text>

              <TextInput
                style={styles.input}
                value={groupName}
                onChangeText={setGroupName}
                placeholder={t.groupName}
              />

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={createNewGroup}
              >
                <Text style={styles.confirmText}>{t.create}</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>{t.groups}</Text>

              {groups.length === 0 ? (
                <Text style={styles.emptyText}>{t.noGroups}</Text>
              ) : (
                groups.map((group, index) => (
                  <View key={index} style={styles.commentCard}>
                    <Text style={styles.cardTitle}>👥 {group}</Text>
                  </View>
                ))
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 冒險遊戲
  if (page === 'adventure') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {switchLanguage}
          <TouchableOpacity onPress={goHome}>
            <Text style={styles.backText}>{t.back}</Text>
          </TouchableOpacity>
          <Text style={styles.detailEmoji}>🗺️</Text>
          <Text style={styles.detailTitle}>
            {language === 'zh' ? '冒險遊戲' : 'Adventure Games'}
          </Text>
          <Text style={styles.emptyText}>{t.adventure}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 挑戰遊戲、我有想法、幫我選一個
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {switchLanguage}
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backText}>{t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.detailEmoji}>
          {page === 'challenge' ? '🏆' : '🎲'}
        </Text>
        <Text style={styles.detailTitle}>
          {page === 'challenge'
            ? (language === 'zh' ? '挑戰遊戲' : 'Challenge Games')
            : (language === 'zh' ? '開始探索吧！' : "Let's Explore!")}
        </Text>
        <Text style={styles.emptyText}>{t.gameComing}</Text>
      </View>
    </SafeAreaView>
  );
}

// =====================================
// 益智遊戲 1：數獨
// =====================================

function Sudoku({ zh }) {
  const puzzle = [
    [1, 0, 0, 4],
    [0, 4, 1, 0],
    [2, 0, 4, 0],
    [0, 3, 0, 1],
  ];

  const solution = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1],
  ];

  const [board, setBoard] = useState(
    puzzle.map(row => [...row])
  );
  const [selected, setSelected] = useState(null);

  const chooseNumber = number => {
    if (!selected) return;

    const [r, c] = selected;
    if (puzzle[r][c] !== 0) return;

    const next = board.map(row => [...row]);
    next[r][c] = number;
    setBoard(next);
  };

  const check = () => {
    const correct = board.every((row, r) =>
      row.every((value, c) => value === solution[r][c])
    );

    Alert.alert(
      zh ? '檢查結果' : 'Result',
      correct
        ? (zh ? '答對了！太棒了！🎉' : 'Correct! Great job! 🎉')
        : (zh ? '還有錯誤，再試試看！' : 'Not quite. Try again!')
    );
  };

  return (
    <View>
      <Text style={styles.instruction}>
        {zh
          ? '填入 1～4，每一列和每一行都不能重複。'
          : 'Fill in 1–4. No repeats in each row or column.'}
      </Text>

      <View style={styles.board}>
        {board.map((row, r) =>
          row.map((value, c) => (
            <TouchableOpacity
              key={`${r}-${c}`}
              style={[
                styles.sudokuCell,
                selected?.[0] === r && selected?.[1] === c
                  ? styles.selected
                  : null,
                puzzle[r][c] !== 0 && styles.fixedCell,
              ]}
              onPress={() => setSelected([r, c])}
            >
              <Text style={styles.number}>{value || ''}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.numberRow}>
        {[1, 2, 3, 4].map(n => (
          <TouchableOpacity
            key={n}
            style={styles.numberButton}
            onPress={() => chooseNumber(n)}
          >
            <Text style={styles.number}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.action} onPress={check}>
        <Text style={styles.actionText}>
          {zh ? '檢查答案' : 'Check Answer'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryAction}
        onPress={() => {
          setBoard(puzzle.map(row => [...row]));
          setSelected(null);
        }}
      >
        <Text style={styles.secondaryText}>
          {zh ? '重新開始' : 'Restart'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// =====================================
// 益智遊戲 2：找字遊戲
// =====================================

function WordSearch({ zh }) {
  const letters = [
    'C', 'A', 'T', 'B',
    'D', 'O', 'G', 'E',
    'F', 'I', 'S', 'H',
    'P', 'E', 'N', 'S',
  ];

  const [chosen, setChosen] = useState([]);
  const [finished, setFinished] = useState(false);

  const tap = index => {
    if (finished) return;

    const next = [...chosen, index];
    setChosen(next);

    const word = next.map(i => letters[i]).join('');

    if (word === 'CAT') {
      setFinished(true);
      Alert.alert(
        zh ? '答對了！🎉' : 'Correct! 🎉',
        zh ? '你找到了 CAT！' : 'You found CAT!'
      );
    } else if (!'CAT'.startsWith(word)) {
      setChosen([]);
    }
  };

  const restart = () => {
    setChosen([]);
    setFinished(false);
  };

  return (
    <View>
      <Text style={styles.instruction}>
        {zh ? '依序點選字母，找出 CAT（貓）。' : 'Tap the letters in order to find CAT.'}
      </Text>

      <View style={styles.letterGrid}>
        {letters.map((letter, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.letterCell,
              chosen.includes(i) && styles.selected,
            ]}
            onPress={() => tap(i)}
          >
            <Text style={styles.number}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.resultText}>
        {finished
          ? (zh ? '完成！' : 'Completed!')
          : (zh ? `目前選擇：${chosen.map(i => letters[i]).join('')}` : `Selected: ${chosen.map(i => letters[i]).join('')}`)}
      </Text>

      <TouchableOpacity style={styles.action} onPress={restart}>
        <Text style={styles.actionText}>
          {zh ? '重新開始' : 'Restart'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// =====================================
// 益智遊戲 3：找不同
// =====================================

function FindDifferent({ zh }) {
  const different = 7;
  const [found, setFound] = useState(false);

  return (
    <View>
      <Text style={styles.instruction}>
        {zh ? '找出唯一不同的圖案！' : 'Find the different symbol!'}
      </Text>

      <View style={styles.differentGrid}>
        {Array.from({ length: 16 }, (_, i) => (
          <TouchableOpacity
            key={i}
            style={styles.differentCell}
            onPress={() => {
              if (i === different) {
                setFound(true);
                Alert.alert(
                  zh ? '答對了！🎉' : 'Correct! 🎉',
                  zh ? '你找到不一樣的蘋果了！' : 'You found the different apple!'
                );
              } else {
                Alert.alert(
                  zh ? '再試試看！' : 'Try again!',
                  zh ? '這個不是答案喔。' : 'That is not the answer.'
                );
              }
            }}
          >
            <Text style={styles.emoji}>
              {i === different ? '🍎' : '🍏'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {found && (
        <Text style={styles.resultText}>
          {zh ? '挑戰成功！' : 'Challenge completed!'}
        </Text>
      )}

      <TouchableOpacity
        style={styles.action}
        onPress={() => setFound(false)}
      >
        <Text style={styles.actionText}>
          {zh ? '重新挑戰' : 'Try Again'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// =====================================
// 益智遊戲 4：火柴棒謎題
// =====================================

function Matchstick({ zh }) {
  const [answer, setAnswer] = useState(null);

  const choices = [1, 2, 3, 4];

  return (
    <View>
      <Text style={styles.instruction}>
        {zh
          ? '觀察算式，選出正確答案。'
          : 'Look at the equation and choose the correct answer.'}
      </Text>

      <Text style={styles.mathQuestion}>6 - 4 = ?</Text>

      {choices.map(n => (
        <TouchableOpacity
          key={n}
          style={[
            styles.choice,
            answer === n && styles.selected,
          ]}
          onPress={() => setAnswer(n)}
        >
          <Text style={styles.number}>{n}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.action}
        onPress={() => {
          if (answer === null) {
            Alert.alert(
              zh ? '提醒' : 'Notice',
              zh ? '請先選擇答案！' : 'Please choose an answer first!'
            );
            return;
          }

          Alert.alert(
            zh ? '答案' : 'Answer',
            answer === 2
              ? (zh ? '答對了！🎉' : 'Correct! 🎉')
              : (zh ? '再想想看！' : 'Try again!')
          );
        }}
      >
        <Text style={styles.actionText}>
          {zh ? '確認答案' : 'Check'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// =====================================
// 益智遊戲 5：數字拼圖
// =====================================

function NumberPuzzle({ zh }) {
  const [tiles, setTiles] = useState([
    1, 2, 3,
    4, 5, 6,
    7, 0, 8,
  ]);

  const move = index => {
    const empty = tiles.indexOf(0);

    const sameRow =
      Math.floor(index / 3) === Math.floor(empty / 3);

    const adjacent =
      (Math.abs(index - empty) === 3) ||
      (sameRow && Math.abs(index - empty) === 1);

    if (!adjacent) return;

    const next = [...tiles];
    [next[index], next[empty]] = [next[empty], next[index]];

    setTiles(next);

    if (next.join(',') === '1,2,3,4,5,6,7,8,0') {
      Alert.alert(
        zh ? '完成！🎉' : 'Completed! 🎉',
        zh ? '你成功完成拼圖了！' : 'You solved the puzzle!'
      );
    }
  };

  const restart = () => {
    setTiles([
      1, 2, 3,
      4, 5, 6,
      7, 0, 8,
    ]);
  };

  return (
    <View>
      <Text style={styles.instruction}>
        {zh
          ? '點擊空格旁邊的數字，將數字排成 1～8。'
          : 'Tap a tile next to the empty space to arrange 1–8.'}
      </Text>

      <View style={styles.puzzleBoard}>
        {tiles.map((n, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.puzzleCell,
              n === 0 && styles.emptyCell,
            ]}
            onPress={() => move(i)}
          >
            <Text style={styles.number}>
              {n === 0 ? '' : n}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.action} onPress={restart}>
        <Text style={styles.actionText}>
          {zh ? '重新開始' : 'Restart'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// =====================================
// 共用樣式
// =====================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    padding: 22,
    paddingBottom: 40,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  lang: {
    color: '#999',
    fontSize: 14,
  },
  activeLang: {
    color: '#6688CC',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    color: '#888',
    marginTop: 7,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 22,
    marginBottom: 13,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#6688CC',
    backgroundColor: '#EEF3FF',
  },
  emoji: {
    fontSize: 30,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: 15,
  },
  confirmArea: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 18,
    marginTop: 15,
  },
  selectedText: {
    textAlign: 'center',
    marginBottom: 12,
  },
  confirmButton: {
    backgroundColor: '#6688CC',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  confirmText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backText: {
    color: '#6688CC',
    marginVertical: 12,
    fontSize: 15,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
  },
  gameEmoji: {
    fontSize: 28,
    marginRight: 15,
  },
  arrow: {
    color: '#999',
    fontSize: 24,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#EAEAEA',
    borderRadius: 12,
    padding: 4,
    marginVertical: 15,
  },
  tab: {
    flex: 1,
    padding: 11,
    alignItems: 'center',
    borderRadius: 9,
  },
  activeTab: {
    backgroundColor: '#FFF',
  },
  tabText: {
    color: '#777',
    fontSize: 13,
  },
  activeTabText: {
    color: '#6688CC',
    fontWeight: 'bold',
  },
  topicCard: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 15,
    marginBottom: 13,
  },
  topicLabel: {
    color: '#6688CC',
    fontSize: 12,
    marginBottom: 10,
  },
  topicTitle: {
    color: '#333',
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 25,
  },
  commentCount: {
    color: '#888',
    marginTop: 14,
    fontSize: 12,
  },
  commentCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  commentName: {
    color: '#6688CC',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commentText: {
    color: '#444',
    lineHeight: 22,
  },
  commentInputArea: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 14,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 13,
    minHeight: 45,
    marginBottom: 10,
    color: '#333',
  },
  anonymousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  checkbox: {
    fontSize: 20,
    color: '#6688CC',
    marginRight: 8,
  },
  inviteCode: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#6688CC',
    textAlign: 'center',
    letterSpacing: 3,
    marginTop: 15,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
  },
  detailEmoji: {
    fontSize: 65,
    textAlign: 'center',
    marginTop: 100,
  },
  detailTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  instruction: {
    color: '#777',
    fontSize: 15,
    lineHeight: 24,
    marginVertical: 18,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    alignSelf: 'center',
    marginVertical: 20,
  },
  sudokuCell: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#AAA',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedCell: {
    backgroundColor: '#EAEAEA',
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  numberButton: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    width: 48,
    alignItems: 'center',
  },
  number: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#333',
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    alignSelf: 'center',
  },
  letterCell: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  differentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 280,
    alignSelf: 'center',
  },
  differentCell: {
    width: 70,
    height: 70,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  mathQuestion: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
  choice: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  puzzleBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    alignSelf: 'center',
    marginVertical: 20,
  },
  puzzleCell: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: '#E4EBFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCell: {
    backgroundColor: '#F7F7F7',
  },
  selected: {
    backgroundColor: '#DCE7FF',
    borderColor: '#6688CC',
  },
  action: {
    backgroundColor: '#6688CC',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  actionText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryAction: {
    backgroundColor: '#E8ECF5',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryText: {
    color: '#6688CC',
    fontWeight: 'bold',
  },
  resultText: {
    textAlign: 'center',
    color: '#6688CC',
    fontWeight: 'bold',
    marginTop: 18,
  },
});
