import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../theme/styles';

export default function Matchstick({ zh }) {
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
