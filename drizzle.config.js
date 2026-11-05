import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local', quiet: true });

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.js',
  out: './supabase/migrations',
  dbCredentials: { url: process.env.DATABASE_URL },
  schemaFilter: ['public'],
  // Only manage our tables: `profiles` already exists and must not be dropped by a push.
  tablesFilter: ['favorites', 'plays', 'chat_messages'],
  entities: { roles: { provider: 'supabase' } },
});
