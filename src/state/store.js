import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { GAMES } from '../games/catalog';

const KEY = 'letsplay:state:v2';
const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [state, setState] = useState({ lang: 'zh', favorites: [], played: {}, skippedAuth: false });
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [dbError, setDbError] = useState(null);
  const uid = session?.user?.id;

  useEffect(() => {
    AsyncStorage.getItem(KEY).then(raw => { if (raw) setState(s => ({ ...s, ...JSON.parse(raw) })); }).catch(() => {}).finally(() => setReady(true));
    supabase.auth.getSession().then(({ data }) => setSession(data.session)).catch(() => {});
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {}); }, [state, ready]);

  // Signed in: the database is the source of truth. Guests keep data on this device only.
  useEffect(() => {
    if (!uid) return;
    (async () => {
      const [fav, plays] = await Promise.all([
        supabase.from('favorites').select('game_id').order('created_at', { ascending: false }),
        supabase.from('plays').select('game_id,played_at').order('played_at', { ascending: false }).limit(200),
      ]);
      const error = fav.error || plays.error;
      setDbError(error ? error.message : null);
      if (error) return;
      const played = {};
      plays.data.forEach(p => { played[p.game_id] = played[p.game_id] || new Date(p.played_at).getTime(); });
      setState(s => ({ ...s, favorites: fav.data.map(f => f.game_id), played }));
    })().catch(e => setDbError(e.message));
  }, [uid]);

  const report = ({ error }) => setDbError(error ? error.message : null);

  const toggleFavorite = useCallback(id => {
    setState(s => {
      const on = s.favorites.includes(id);
      if (uid) {
        (on ? supabase.from('favorites').delete().eq('game_id', id).eq('user_id', uid)
            : supabase.from('favorites').upsert({ user_id: uid, game_id: id })).then(report);
      }
      return { ...s, favorites: on ? s.favorites.filter(f => f !== id) : [id, ...s.favorites] };
    });
  }, [uid]);

  const markPlayed = useCallback((id, won) => {
    setState(s => ({ ...s, played: { ...s.played, [id]: Date.now() } }));
    if (uid) supabase.from('plays').insert({ user_id: uid, game_id: id, won: won ?? null }).then(report);
  }, [uid]);

  // For the undecided who crave novelty: never-played first, then whatever was played longest ago.
  const pickFresh = useCallback((exclude, type) => {
    const pool = GAMES.filter(g => g.id !== exclude && (!type || g.type === type));
    const never = pool.filter(g => !state.played[g.id]);
    const from = never.length ? never : [...pool].sort((a, b) => state.played[a.id] - state.played[b.id]).slice(0, Math.ceil(pool.length / 3));
    return from[Math.floor(Math.random() * from.length)];
  }, [state.played]);

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email: email.trim(), password });
  const signUp = (email, password, nickname) => supabase.auth.signUp({ email: email.trim(), password, options: { data: { nickname: nickname.trim() } } });
  const signOut = useCallback(async () => {
    await supabase.auth.signOut().catch(() => {});
    setState(s => ({ ...s, favorites: [], played: {} }));
  }, []);

  const user = session?.user ? { id: uid, email: session.user.email, name: session.user.user_metadata?.nickname || session.user.email } : null;

  const value = useMemo(() => ({
    ...state, ready, user, dbError, zh: state.lang === 'zh', tr: (z, e) => (state.lang === 'zh' ? z : e),
    setLang: lang => setState(s => ({ ...s, lang })), skipAuth: () => setState(s => ({ ...s, skippedAuth: true })),
    toggleFavorite, markPlayed, pickFresh, signIn, signUp, signOut, authOpen, setAuthOpen,
  }), [state, ready, uid, dbError, toggleFavorite, markPlayed, pickFresh, signOut, authOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
