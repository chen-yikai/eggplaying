// Source of truth for the database schema. Used only by drizzle-kit: the app must never import
// this folder, because a direct Postgres connection would ship the database password in the bundle.
// At runtime the app talks to these tables through supabase-js, protected by the policies below.
import { sql } from 'drizzle-orm';
import { bigint, boolean, check, index, pgPolicy, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { anonRole, authenticatedRole, authUid, authUsers } from 'drizzle-orm/supabase';

const userId = () => uuid('user_id').notNull().default(sql`auth.uid()`).references(() => authUsers.id, { onDelete: 'cascade' });
const ownRow = sql`user_id = ${authUid}`;
const timestamptz = name => timestamp(name, { withTimezone: true }).notNull().defaultNow();

export const favorites = pgTable('favorites', {
  userId: userId(),
  gameId: text('game_id').notNull(),
  createdAt: timestamptz('created_at'),
}, t => [
  primaryKey({ columns: [t.userId, t.gameId] }),
  pgPolicy('own favorites', { for: 'all', to: authenticatedRole, using: ownRow, withCheck: ownRow }),
]).enableRLS();

export const plays = pgTable('plays', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: userId(),
  gameId: text('game_id').notNull(),
  won: boolean('won'),
  playedAt: timestamptz('played_at'),
}, t => [
  index('plays_user_played_idx').on(t.userId, t.playedAt.desc()),
  pgPolicy('own plays', { for: 'all', to: authenticatedRole, using: ownRow, withCheck: ownRow }),
]).enableRLS();

export const chatMessages = pgTable('chat_messages', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  room: text('room').notNull(),
  userId: userId(),
  author: text('author').notNull(),
  body: text('body').notNull(),
  createdAt: timestamptz('created_at'),
}, t => [
  index('chat_messages_room_idx').on(t.room, t.createdAt.desc()),
  index('chat_messages_user_idx').on(t.userId),
  check('chat_messages_author_length', sql`char_length(${t.author}) between 1 and 40`),
  check('chat_messages_body_length', sql`char_length(${t.body}) between 1 and 500`),
  pgPolicy('anyone reads chat', { for: 'select', to: [anonRole, authenticatedRole], using: sql`true` }),
  pgPolicy('members post as themselves', { for: 'insert', to: authenticatedRole, withCheck: ownRow }),
]).enableRLS();
