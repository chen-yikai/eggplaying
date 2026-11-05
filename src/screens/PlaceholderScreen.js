import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../theme/styles';

// Adventure, Challenge, "I have an idea" and "Pick for me" are all still coming-soon pages.
export default function PlaceholderScreen({ page, language, t, switchLanguage, goHome }) {
  const zh = language === 'zh';
  const detail = {
    adventure: ['🗺️', zh ? '冒險遊戲' : 'Adventure Games', t.adventure],
    challenge: ['🏆', zh ? '挑戰遊戲' : 'Challenge Games', t.gameComing],
  }[page] || ['🎲', zh ? '開始探索吧！' : "Let's Explore!", t.gameComing];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {switchLanguage}
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backText}>{t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.detailEmoji}>{detail[0]}</Text>
        <Text style={styles.detailTitle}>{detail[1]}</Text>
        <Text style={styles.emptyText}>{detail[2]}</Text>
      </View>
    </SafeAreaView>
  );
}
