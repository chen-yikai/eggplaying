import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { puzzleGames } from '../data/content';
import FindDifferent from '../games/puzzle/FindDifferent';
import Matchstick from '../games/puzzle/Matchstick';
import NumberPuzzle from '../games/puzzle/NumberPuzzle';
import Sudoku from '../games/puzzle/Sudoku';
import WordSearch from '../games/puzzle/WordSearch';
import { styles } from '../theme/styles';

export default function PuzzleScreen({ language, t, switchLanguage, goHome }) {
  const [activeGame, setActiveGame] = useState(null);

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
