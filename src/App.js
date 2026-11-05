import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenEnter, T } from './components/ui';
import AuthScreen from './screens/AuthScreen';
import ChatRoomScreen, { ChatListScreen } from './screens/ChatScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import GameListScreen from './screens/GameListScreen';
import GameScreen from './screens/GameScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import { StoreProvider, useStore } from './state/store';
import { useColors } from './theme/tokens';

const TABS = [
  { id: 'home', icon: 'game-controller', zh: '首頁', en: 'Home' },
  { id: 'favorites', icon: 'heart', zh: '收藏', en: 'Saved' },
  { id: 'chat', icon: 'chatbubbles', zh: '聊天室', en: 'Chat' },
  { id: 'me', icon: 'person', zh: '我的', en: 'Me' },
];

function TabBar({ tab, onChange }) {
  const c = useColors();
  const { tr } = useStore();
  const insets = useSafeAreaInsets();
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', backgroundColor: c.surface, borderTopWidth: 1, borderTopColor: c.separator, paddingBottom: insets.bottom }}>
      {TABS.map(item => {
        const on = item.id === tab;
        const color = on ? c.accent : c.secondary;
        return (
          <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => onChange(item.id)}
            style={{ flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 }}>
            <Ionicons name={on ? item.icon : `${item.icon}-outline`} size={24} color={color} />
            <T v="caption" color={color} style={{ fontWeight: on ? '700' : '500' }}>{tr(item.zh, item.en)}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

function Root() {
  const c = useColors();
  const store = useStore();
  const [tab, setTab] = useState('home');
  const [stack, setStack] = useState([]);
  const dir = useRef(0);

  const nav = {
    push: (name, params) => { dir.current = 1; setStack(s => [...s, { name, params, key: `${name}-${Date.now()}` }]); },
    replace: (name, params) => { dir.current = 1; setStack(s => [...s.slice(0, -1), { name, params, key: `${name}-${Date.now()}` }]); },
    back: () => { dir.current = -1; setStack(s => s.slice(0, -1)); },
    tab: id => { dir.current = 0; setStack([]); setTab(id); },
  };

  const needsAuth = store.authOpen || (!store.user && !store.skippedAuth);
  useEffect(() => { if (store.user && store.authOpen) store.setAuthOpen(false); }, [store.user?.id]);

  useEffect(() => {
    const sub = BackHandler.addEventListener?.('hardwareBackPress', () => {
      if (store.authOpen) { store.setAuthOpen(false); return true; }
      if (stack.length) { nav.back(); return true; }
      if (tab !== 'home') { nav.tab('home'); return true; }
      return false;
    });
    return () => sub?.remove?.();
  }, [stack.length, tab, store.authOpen]);

  if (!store.ready) return <View style={{ flex: 1, backgroundColor: c.bg }} />;
  if (needsAuth) return <AuthScreen />;

  const top = stack[stack.length - 1];
  const content = top ? (
    top.name === 'game' ? <GameScreen gameId={top.params.id} nav={nav} />
      : top.name === 'list' ? <GameListScreen type={top.params.type} nav={nav} />
        : <ChatRoomScreen room={top.params.room} nav={nav} />
  ) : tab === 'home' ? <HomeScreen nav={nav} />
    : tab === 'favorites' ? <FavoritesScreen nav={nav} />
      : tab === 'chat' ? <ChatListScreen nav={nav} />
        : <ProfileScreen />;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, overflow: 'hidden' }}>
      <ScreenEnter key={top ? top.key : `tab-${tab}`} dir={dir.current}>{content}</ScreenEnter>
      {!top && <TabBar tab={tab} onChange={nav.tab} />}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="auto" />
        <Root />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
