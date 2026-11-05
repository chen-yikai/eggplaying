import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { categories, options } from '../data/content';
import { styles } from '../theme/styles';

export default function HomeScreen({ language, t, switchLanguage, selected, setSelected, confirmSelection }) {
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
