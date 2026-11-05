# 玩擲

Expo (SDK 55) app with a Node API and Postgres. `npm start`, then press `w` for web or `a` for Android.

```
index.js                 Expo entry
src/
  App.js                 Providers, tabs and navigation
  screens/               One file per page
  games/views/           The game screens, one file per game type
  games/catalog.js       20-game catalog, built-in questions, Gemini question loaders
  components/            ui.js (UI kit and springs), icons.js (all SVG icons), Logo, Mascot, GameRow, PickerSheet
  assets/                logo.js (the app icon as a data URI, so Snack's git import still works)
  data/                  Chat room topics
  state/                 store.js (session, saves, play history, language)
  theme/                 tokens.js (colours and type)
  lib/                   API and Gemini clients
  legacy/                Earlier screens nothing imports; kept for reference
backend/                 Express API, chat WebSocket and SQL migrations
web/                     Web image: nginx serves the site and passes /api to the API
docker-compose.yml       Website, API and database as one deployment
.env.example             Copy to .env
```

## Deploy

```
cp .env.example .env     # set POSTGRES_PASSWORD and JWT_SECRET (openssl rand -hex 32)
docker compose up -d --build
```

The site is then on port `WEB_PORT` (8080 by default). Only the web container publishes a port. The database keeps its data in the `db-data` volume, and the API applies `backend/migrations/` when it starts.

To point a phone or a local preview at a deployment, set `EXPO_PUBLIC_API_URL` to its address and restart Expo. There is no TLS in this stack, so put an HTTPS proxy in front of it before using it publicly.

To change the schema, add a new numbered file to `backend/migrations/`. Each file runs once.
