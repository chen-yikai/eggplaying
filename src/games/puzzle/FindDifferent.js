import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../theme/styles';

export default function FindDifferent({ zh }) {
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
