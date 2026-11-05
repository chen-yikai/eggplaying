import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../theme/styles';

export default function WordSearch({ zh }) {
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
