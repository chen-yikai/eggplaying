-- Run once in Supabase: SQL Editor > New query > paste > Run. Safe to re-run.
create table if not exists public.favorites (
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  game_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, game_id)
);
create table if not exists public.plays (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  game_id text not null,
  won boolean,
  played_at timestamptz not null default now()
);
create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  room text not null,
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  author text not null check (char_length(author) between 1 and 40),
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_room_idx on public.chat_messages (room, created_at desc);

alter table public.favorites enable row level security;
alter table public.plays enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "own favorites" on public.favorites;
create policy "own favorites" on public.favorites for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "own plays" on public.plays;
create policy "own plays" on public.plays for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "anyone reads chat" on public.chat_messages;
create policy "anyone reads chat" on public.chat_messages for select to anon, authenticated using (true);
drop policy if exists "members post as themselves" on public.chat_messages;
create policy "members post as themselves" on public.chat_messages for insert to authenticated
  with check (user_id = auth.uid());

do $$ begin
  alter publication supabase_realtime add table public.chat_messages;
exception when duplicate_object then null; end $$;
