import React, { useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PickerSheet from '../components/PickerSheet';
import { Button, Group, Page, Row, Section, T, Tile } from '../components/ui';
import { ROOMS } from '../data/rooms';
import { GAMES, gameById } from '../games/catalog';
import { useStore } from '../state/store';
import { useColors } from '../theme/tokens';

export default function HomeScreen({ nav }) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const { tr, played, favorites } = useStore();
  const [picking, setPicking] = useState(false);
  const fresh = GAMES.filter(g => !played[g.id]).length;
  const stacked = fontScale >= 1.4;
  const saved = favorites.map(gameById).filter(Boolean);
  const room = ROOMS[new Date().getDate() % ROOMS.length];

  const TypeTile = ({ type, emoji, title, edge, blurb }) => (
    <Tile edge={edge} depth={7} radius={22} style={{ flex: stacked ? undefined : 1 }} label={title}
      faceStyle={{ minHeight: 164, padding: 16, alignItems: 'flex-start', justifyContent: 'flex-end' }}
      onPress={() => nav.push('list', { type })}>
      <Text style={{ fontSize: 44, marginBottom: 10 }}>{emoji}</Text>
      <T v="title2">{title}</T>
      <T v="footnote" color={c.secondary} style={{ marginTop: 2 }}>{blurb}</T>
    </Tile>
  );

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Page>
        <T v="largeTitle" accessibilityRole="header" style={{ marginTop: 8 }}>玩擲</T>
        <T v="subhead" color={c.secondary} style={{ marginTop: 2, marginBottom: 18 }}>
          {fresh ? tr(`還有 ${fresh} 款沒玩過，每局不用三分鐘`, `${fresh} games still new, each under three minutes`) : tr('全部玩過了！題目每次都不一樣', 'You played them all! Questions change every time')}
        </T>
        <View style={{ flexDirection: stacked ? 'column' : 'row', gap: 12 }}>
          <TypeTile type="puzzle" emoji="🧩" edge={c.puzzle} title={tr('益智遊戲', 'Puzzle')} blurb={tr('10 款 · 動動腦', '10 games · think')} />
          <TypeTile type="challenge" emoji="🏆" edge={c.challenge} title={tr('挑戰遊戲', 'Challenge')} blurb={tr('10 款 · 拚手速', '10 games · race')} />
        </View>
        <Button style={{ marginTop: 16 }} icon="dice" title={tr('不知道玩什麼？幫我選！', "Can't decide? Pick for Me!")} onPress={() => setPicking(true)} />

        <Section title={tr('我的收藏', 'Saved')}>
          {saved.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 8 }}>
              {saved.map(g => (
                <Tile key={g.id} depth={4} radius={16} label={tr(g.zh, g.en)} style={{ width: 104 }} faceStyle={{ padding: 10, minHeight: 92 }} onPress={() => nav.push('game', { id: g.id })}>
                  <Text style={{ fontSize: 30 }}>{g.emoji}</Text>
                  <T v="footnote" numberOfLines={2} style={{ textAlign: 'center', marginTop: 4, fontWeight: '600' }}>{tr(g.zh, g.en)}</T>
                </Tile>
              ))}
            </ScrollView>
          ) : (
            <Pressable accessibilityRole="button" onPress={() => nav.tab('favorites')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, backgroundColor: c.surface }}>
              <Ionicons name="heart-outline" size={22} color={c.secondary} />
              <T v="subhead" color={c.secondary} style={{ flex: 1 }}>{tr('按遊戲旁的愛心，喜歡的就不會忘記', 'Tap the heart beside a game to keep it here')}</T>
            </Pressable>
          )}
        </Section>

        <Section title={tr('聊天室', 'Chat')}>
          <Group>
            <Row last label={tr(room.zh, room.en)} title={tr(room.zh, room.en)} subtitle={tr('今日話題，進來聊聊', "Today's topic, come say hi")}
              leading={<Text style={{ fontSize: 28 }}>{room.emoji}</Text>} onPress={() => nav.push('room', { room: room.id })} />
          </Group>
        </Section>
      </Page>
      {picking && <PickerSheet onClose={() => setPicking(false)} onPlay={g => { setPicking(false); nav.push('game', { id: g.id }); }} />}
    </View>
  );
}
