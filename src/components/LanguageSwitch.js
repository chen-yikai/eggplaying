import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../theme/styles';

export default function LanguageSwitch({ language, setLanguage }) {
  return (
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
}
