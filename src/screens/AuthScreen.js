import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Mascot from '../components/Mascot';
import { Banner, Button, Field, Group, IconButton, Page, T } from '../components/ui';
import { useStore } from '../state/store';
import { useColors } from '../theme/tokens';

function explain(error, tr) {
  const m = error?.message || '';
  if (/invalid login/i.test(m)) return tr('Email 或密碼不正確，請再試一次。', 'That email or password is incorrect. Try again.');
  if (error?.code === 'email_address_invalid' || /email address .*invalid/i.test(m)) return tr('Supabase 不接受這個 Email，請換一個真實可收信的地址。', 'Supabase rejected this email. Use a real address that can receive mail.');
  if (/already registered/i.test(m)) return tr('這個 Email 已經註冊過了，請直接登入。', 'This email is already registered. Log in instead.');
  if (/not confirmed/i.test(m)) return tr('這個帳號尚未完成 Email 驗證。', 'This account has not confirmed its email.');
  if (/rate limit|too many/i.test(m)) return tr('嘗試太多次了，請稍後再試。', 'Too many attempts. Try again shortly.');
  return m || tr('連線失敗，請稍後再試。', 'Could not connect. Try again shortly.');
}

function FieldRow({ label, children, last }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 16, borderBottomWidth: last ? 0 : 1, borderBottomColor: c.separator }}>
      <T v="body" style={{ width: 64 }}>{label}</T>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>{children}</View>
    </View>
  );
}

export default function AuthScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { tr, signIn, signUp, skipAuth, setAuthOpen } = useStore();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [reveal, setReveal] = useState(false);
  const [covering, setCovering] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);
  const passwordRef = useRef(null);
  const register = mode === 'register';

  const close = () => { skipAuth(); setAuthOpen(false); };

  async function submit() {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setNote({ tone: 'error', text: tr('請輸入正確的 Email。', 'Enter a valid email.') });
    // Supabase Auth rejects Gmail names under 6 characters, so say why before sending anything.
    const [name, domain] = email.trim().toLowerCase().split('@');
    if (domain === 'gmail.com' && name.length < 6) return setNote({ tone: 'error', text: tr('Gmail 帳號 @ 前面至少要 6 個字元，請確認地址是否正確。', 'Gmail names need at least 6 characters before the @. Check the address.') });
    if (password.length < 6) return setNote({ tone: 'error', text: tr('密碼至少需要 6 個字元。', 'Password needs at least 6 characters.') });
    if (register && !nickname.trim()) return setNote({ tone: 'error', text: tr('請輸入暱稱。', 'Enter a nickname.') });
    setBusy(true); setNote(null);
    try {
      const { data, error } = register ? await signUp(email, password, nickname) : await signIn(email, password);
      if (error) return setNote({ tone: 'error', text: explain(error, tr) });
      if (register && !data.session) {
        setMode('login');
        setNote({ tone: 'info', text: tr('帳號已建立，但 Supabase 的 Confirm email 還開著，關閉後才能直接登入。', 'Account created, but Confirm email is still on in Supabase. Turn it off to log in right away.') });
      }
    } catch (e) {
      setNote({ tone: 'error', text: explain(e, tr) });
    } finally {
      setBusy(false);
    }
  }

  const switchMode = () => { setMode(register ? 'login' : 'register'); setNote(null); };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ paddingTop: insets.top, paddingHorizontal: 8, alignItems: 'flex-start' }}>
        <IconButton icon="close" label={tr('先逛逛', 'Browse first')} onPress={close} color={c.secondary} />
      </View>
      <Page>
        <Mascot covering={covering && !reveal} />
        <T v="title" accessibilityRole="header" style={{ textAlign: 'center', marginTop: 18 }}>{register ? tr('建立帳號', 'Create Account') : tr('歡迎回來', 'Welcome Back')}</T>
        <T v="subhead" color={c.secondary} style={{ textAlign: 'center', marginTop: 4, marginBottom: 22 }}>
          {register ? tr('收藏、遊玩紀錄會跟著帳號走', 'Your saves and history follow your account') : tr('登入後就能收藏遊戲、加入聊天', 'Log in to save games and join the chat')}
        </T>
        <Group>
          {register && (
            <FieldRow label={tr('暱稱', 'Name')}>
              <Field accessibilityLabel={tr('暱稱', 'Name')} style={{ flex: 1 }} value={nickname} onChangeText={setNickname} placeholder={tr('大家會看到的名字', 'Shown to others')} maxLength={40} autoComplete="nickname" />
            </FieldRow>
          )}
          <FieldRow label="Email">
            <Field accessibilityLabel="Email" style={{ flex: 1 }} value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} />
          </FieldRow>
          <FieldRow label={tr('密碼', 'Password')} last>
            <Field ref={passwordRef} accessibilityLabel={tr('密碼', 'Password')} style={{ flex: 1 }} value={password} onChangeText={setPassword} placeholder={tr('至少 6 個字元', 'At least 6 characters')} secureTextEntry={!reveal} autoCapitalize="none" autoComplete={register ? 'new-password' : 'current-password'} returnKeyType="go" onSubmitEditing={submit} onFocus={() => setCovering(true)} onBlur={() => setCovering(false)} />
            <IconButton icon={reveal ? 'eye-off-outline' : 'eye-outline'} label={reveal ? tr('隱藏密碼', 'Hide password') : tr('顯示密碼', 'Show password')} onPress={() => setReveal(!reveal)} color={c.secondary} />
          </FieldRow>
        </Group>
        {note && <Banner tone={note.tone} text={note.text} />}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
          <Button kind="secondary" style={{ flex: 1 }} title={register ? tr('返回登入', 'Back to Log In') : tr('註冊', 'Sign Up')} onPress={switchMode} />
          <Button style={{ flex: 1 }} disabled={busy} title={busy ? tr('處理中…', 'Working…') : register ? tr('註冊', 'Sign Up') : tr('登入', 'Log In')} onPress={submit} />
        </View>
      </Page>
    </KeyboardAvoidingView>
  );
}
