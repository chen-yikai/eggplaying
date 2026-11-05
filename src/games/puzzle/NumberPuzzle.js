import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../theme/styles';

export default function NumberPuzzle({ zh }) {
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
