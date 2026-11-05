# Let's Play

Expo (SDK 55) demo app. `npm start`, then press `w` for web or `a` for Android.

```
index.js                 Expo entry
src/
  App.js                 Page state and routing
  screens/               One file per page
  games/puzzle/          Playable puzzle games
  games/catalog.js       20-game catalog and Gemini question loaders (not wired in yet)
  components/            LanguageSwitch, plus ui.js (new UI kit, not wired in yet)
  data/  i18n/           Static content and translations
  state/                 useSocialState, plus store.js (Supabase store, not wired in yet)
  theme/                 styles.js (current UI), tokens.js (new design tokens)
  lib/                   Supabase and Gemini clients
  legacy/                Earlier screens nothing imports; kept for reference
supabase/schema.sql      Paste into the Supabase SQL Editor
.env.example             Copy to .env.local for the Gemini key
```
