import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Banner, Button, Group, Page, Row, Section, Segmented, T } from '../components/ui';
import { GAMES } from '../games/catalog';
import { useStore } from '../state/store';
import { useColors } from '../theme/tokens';

export default function ProfileScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { tr, user, lang, setLang, played, favorites, signOut, setAuthOpen, dbError } = useStore();
  const count = GAMES.filter(g => played[g.id]).length;
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Page>
        <T v="largeTitle" accessibilityRole="header" style={{ marginTop: 8 }}>{user ? user.name : tr('訪客', 'Guest')}</T>
        <T v="subhead" color={c.secondary} style={{ marginTop: 2 }}>{user ? user.email : tr('紀錄只存在這台裝置', 'Your progress stays on this device')}</T>
        {user && dbError && <Banner tone="error" text={tr(`資料庫連線問題：${dbError}`, `Database problem: ${dbError}`)} />}
        <Section title={tr('紀錄', 'Progress')}>
          <Group>
            <Row title={tr('玩過的遊戲', 'Games played')} trailing={<T v="headline">{count} / {GAMES.length}</T>} />
            <Row last title={tr('收藏', 'Saved')} trailing={<T v="headline">{favorites.length}</T>} />
          </Group>
        </Section>
        <Section title={tr('語言', 'Language')}>
          <Segmented value={lang} onChange={setLang} items={[{ id: 'zh', label: '繁體中文' }, { id: 'en', label: 'English' }]} />
        </Section>
        <Button style={{ marginTop: 28 }} kind="secondary" icon={user ? 'log-out-outline' : 'log-in-outline'} title={user ? tr('登出', 'Log Out') : tr('登入／註冊', 'Log In / Sign Up')} onPress={() => (user ? signOut() : setAuthOpen(true))} />
      </Page>
    </View>
  );
}
