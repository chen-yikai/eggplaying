import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Banner, Button, EmptyState, Field, Group, IconButton, NavBar, Page, Row, T } from '../components/ui';
import { ROOMS } from '../data/rooms';
import { supabase } from '../lib/supabase';
import { useStore } from '../state/store';
import { useColors } from '../theme/tokens';

export function ChatListScreen({ nav }) {
  const insets = useSafeAreaInsets();
  const { tr } = useStore();
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Page>
        <T v="largeTitle" accessibilityRole="header" style={{ marginTop: 8, marginBottom: 16 }}>{tr('聊天室', 'Chat')}</T>
        <Group>
          {ROOMS.map((r, i) => (
            <Row key={r.id} last={i === ROOMS.length - 1} label={tr(r.zh, r.en)} title={tr(r.zh, r.en)}
              leading={<Text style={{ fontSize: 28 }}>{r.emoji}</Text>} onPress={() => nav.push('room', { room: r.id })} />
          ))}
        </Group>
      </Page>
    </View>
  );
}

const unavailable = (msg, tr) => (/does not exist|schema cache|not find/i.test(msg || '')
  ? tr('聊天室資料表還沒建立，請先執行 npm run db:migrate。', 'Chat tables are missing. Run npm run db:migrate first.')
  : tr(`聊天室連線失敗：${msg}`, `Chat connection failed: ${msg}`));

export default function ChatRoomScreen({ room: roomId, nav }) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { tr, user, setAuthOpen } = useStore();
  const room = ROOMS.find(r => r.id === roomId);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scroll = useRef(null);

  const add = m => setMessages(old => (old.some(x => x.id === m.id) ? old : [...old, m]));

  useEffect(() => {
    let alive = true;
    supabase.from('chat_messages').select('id,user_id,author,body,created_at').eq('room', roomId).order('created_at', { ascending: false }).limit(50)
      .then(({ data, error: e }) => {
        if (!alive) return;
        if (e) setError(e.message); else setMessages(old => { const seen = new Set(data.map(m => m.id)); return [...[...data].reverse(), ...old.filter(m => !seen.has(m.id))]; });
        setLoading(false);
      });
    const channel = supabase.channel(`room-${roomId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room=eq.${roomId}` }, p => add(p.new))
      .subscribe();
    return () => { alive = false; supabase.removeChannel(channel); };
  }, [roomId]);

  async function send() {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    const { data, error: e } = await supabase.from('chat_messages').insert({ room: roomId, user_id: user.id, author: user.name.slice(0, 40), body }).select('id,user_id,author,body,created_at').single();
    setSending(false);
    if (e) { setError(e.message); return; }
    setError(null); setDraft(''); add(data);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <NavBar title={tr('聊天室', 'Chat')} backLabel={tr('返回', 'Back')} onBack={nav.back} />
      <Page bottom={12} scrollRef={scroll} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}>
        <T v="title2" accessibilityRole="header" style={{ marginVertical: 8 }}>{room.emoji} {tr(room.zh, room.en)}</T>
        {error && <Banner tone="error" text={unavailable(error, tr)} />}
        {loading && <ActivityIndicator color={c.accent} style={{ marginTop: 24 }} />}
        {!loading && !error && !messages.length && <EmptyState emoji="👋" title={tr('還沒有人說話', 'No Messages Yet')} body={tr('當第一個開口的人吧！', 'Be the first to say something!')} />}
        {messages.map(m => {
          const mine = user && m.user_id === user.id;
          return (
            <View key={m.id} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '82%', marginTop: 10 }}>
              {!mine && <T v="caption" color={c.secondary} style={{ marginBottom: 3, marginLeft: 4 }}>{m.author}</T>}
              <View style={{ backgroundColor: mine ? c.accent : c.surface, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 9 }}>
                <T v="body" color={mine ? c.onAccent : c.label}>{m.body}</T>
              </View>
            </View>
          );
        })}
      </Page>
      <View style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 8 + insets.bottom, backgroundColor: c.surface, borderTopWidth: 1, borderTopColor: c.separator }}>
        {user ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, width: '100%', maxWidth: 640, alignSelf: 'center' }}>
            <Field accessibilityLabel={tr('訊息', 'Message')} style={{ flex: 1, paddingHorizontal: 12 }} value={draft} onChangeText={setDraft} placeholder={tr('說點什麼…', 'Say something…')} maxLength={500} returnKeyType="send" onSubmitEditing={send} />
            <IconButton icon="send" label={tr('送出', 'Send')} onPress={send} color={draft.trim() ? c.accent : c.placeholder} />
          </View>
        ) : (
          <Button kind="secondary" icon="log-in-outline" title={tr('登入後加入聊天', 'Log In to Chat')} onPress={() => setAuthOpen(true)} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
