-- KoNomad initial schema
-- Decisions:
--   A. tags / environment / best_season are stored as text[] columns with GIN indexes (no join tables).
--   B. City rankings/likes/dislikes are denormalized counters maintained by triggers.
--   C. Volatile weather data lives in city_weather to keep cities stable for cache.

-- ============================================================================
-- Enums
-- ============================================================================
create type budget_band as enum ('100만원 이하', '100~200만원', '200만원 이상');
create type area_region as enum ('수도권', '경상도', '전라도', '강원도', '제주도', '충청도');

-- ============================================================================
-- profiles (mirrors auth.users)
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  current_city_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- cities
-- ============================================================================
create table public.cities (
  id uuid primary key default gen_random_uuid(),
  name_ko text not null,
  name_en text not null unique,
  region text not null,                -- 수도권/영남권/호남권/충청권/강원권/제주권
  image_url text not null,
  nomad_score numeric(2,1) not null default 0,
  monthly_cost integer not null,
  internet_speed integer not null,
  safety_score numeric(2,1) not null default 0,
  rank integer,
  budget budget_band not null,
  area area_region not null,
  tags text[] not null default '{}',
  environment text[] not null default '{}',
  best_season text[] not null default '{}',
  review_count integer not null default 0,
  like_count integer not null default 0,
  dislike_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cities_rank_idx on public.cities (rank);
create index cities_budget_idx on public.cities (budget);
create index cities_area_idx on public.cities (area);
create index cities_tags_gin on public.cities using gin (tags);
create index cities_env_gin on public.cities using gin (environment);
create index cities_season_gin on public.cities using gin (best_season);

alter table public.profiles
  add constraint profiles_current_city_fk foreign key (current_city_id) references public.cities(id) on delete set null;

-- ============================================================================
-- city_weather (updated by a separate 기상청 배치, so split from cities)
-- ============================================================================
create table public.city_weather (
  city_id uuid primary key references public.cities(id) on delete cascade,
  current_temp integer,
  weather_emoji text,
  aqi integer,
  observed_at timestamptz not null default now()
);

-- ============================================================================
-- reviews
-- ============================================================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city_id uuid not null references public.cities(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  stay_duration text not null,
  content text not null,
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  like_count integer not null default 0,
  comment_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reviews_city_created_idx on public.reviews (city_id, created_at desc);
create index reviews_user_idx on public.reviews (user_id);

-- ============================================================================
-- review_likes
-- ============================================================================
create table public.review_likes (
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);

-- ============================================================================
-- city_votes (👍/👎 on city cards)
-- ============================================================================
create table public.city_votes (
  city_id uuid not null references public.cities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  vote smallint not null check (vote in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (city_id, user_id)
);

-- ============================================================================
-- meetups
-- ============================================================================
create table public.meetups (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  title text,
  event_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.meetup_attendees (
  meetup_id uuid not null references public.meetups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (meetup_id, user_id)
);

-- ============================================================================
-- chat_messages (global nomad chat)
-- ============================================================================
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (length(content) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index chat_messages_created_idx on public.chat_messages (created_at desc);

-- ============================================================================
-- press_quotes (semi-static but edited by admins)
-- ============================================================================
create table public.press_quotes (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  source text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Triggers: keep denormalized counters in sync
-- ============================================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger cities_touch before update on public.cities
  for each row execute function public.touch_updated_at();
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger reviews_touch before update on public.reviews
  for each row execute function public.touch_updated_at();

create or replace function public.bump_city_review_count()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update public.cities set review_count = review_count + 1 where id = new.city_id;
  elsif tg_op = 'DELETE' then
    update public.cities set review_count = greatest(review_count - 1, 0) where id = old.city_id;
  end if;
  return null;
end;
$$;

create trigger reviews_count_trg
after insert or delete on public.reviews
for each row execute function public.bump_city_review_count();

create or replace function public.bump_review_like_count()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update public.reviews set like_count = like_count + 1 where id = new.review_id;
  elsif tg_op = 'DELETE' then
    update public.reviews set like_count = greatest(like_count - 1, 0) where id = old.review_id;
  end if;
  return null;
end;
$$;

create trigger review_likes_count_trg
after insert or delete on public.review_likes
for each row execute function public.bump_review_like_count();

create or replace function public.apply_city_vote()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    if new.vote = 1 then
      update public.cities set like_count = like_count + 1 where id = new.city_id;
    else
      update public.cities set dislike_count = dislike_count + 1 where id = new.city_id;
    end if;
  elsif tg_op = 'DELETE' then
    if old.vote = 1 then
      update public.cities set like_count = greatest(like_count - 1, 0) where id = old.city_id;
    else
      update public.cities set dislike_count = greatest(dislike_count - 1, 0) where id = old.city_id;
    end if;
  elsif tg_op = 'UPDATE' and new.vote <> old.vote then
    if new.vote = 1 then
      update public.cities
        set like_count = like_count + 1,
            dislike_count = greatest(dislike_count - 1, 0)
        where id = new.city_id;
    else
      update public.cities
        set dislike_count = dislike_count + 1,
            like_count = greatest(like_count - 1, 0)
        where id = new.city_id;
    end if;
  end if;
  return null;
end;
$$;

create trigger city_votes_apply_trg
after insert or update or delete on public.city_votes
for each row execute function public.apply_city_vote();

-- ============================================================================
-- Auth hook: auto-create profile row on signup
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles          enable row level security;
alter table public.cities            enable row level security;
alter table public.city_weather      enable row level security;
alter table public.reviews           enable row level security;
alter table public.review_likes      enable row level security;
alter table public.city_votes        enable row level security;
alter table public.meetups           enable row level security;
alter table public.meetup_attendees  enable row level security;
alter table public.chat_messages     enable row level security;
alter table public.press_quotes      enable row level security;

-- Public read for reference data
create policy cities_read      on public.cities       for select using (true);
create policy weather_read     on public.city_weather for select using (true);
create policy meetups_read     on public.meetups      for select using (true);
create policy press_read       on public.press_quotes for select using (true);
create policy profiles_read    on public.profiles     for select using (true);
create policy reviews_read     on public.reviews      for select using (true);
create policy review_likes_read on public.review_likes for select using (true);
create policy city_votes_read  on public.city_votes   for select using (true);
create policy attendees_read   on public.meetup_attendees for select using (true);

-- Profiles: only owner writes
create policy profiles_insert_self on public.profiles
  for insert with check ((select auth.uid()) = id);
create policy profiles_update_self on public.profiles
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Reviews: owner-only write
create policy reviews_insert_self on public.reviews
  for insert with check ((select auth.uid()) = user_id);
create policy reviews_update_self on public.reviews
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy reviews_delete_self on public.reviews
  for delete using ((select auth.uid()) = user_id);

-- Review likes: owner-only write
create policy review_likes_insert_self on public.review_likes
  for insert with check ((select auth.uid()) = user_id);
create policy review_likes_delete_self on public.review_likes
  for delete using ((select auth.uid()) = user_id);

-- City votes: owner-only write
create policy city_votes_insert_self on public.city_votes
  for insert with check ((select auth.uid()) = user_id);
create policy city_votes_update_self on public.city_votes
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy city_votes_delete_self on public.city_votes
  for delete using ((select auth.uid()) = user_id);

-- Meetup attendees: owner-only rsvp
create policy attendees_insert_self on public.meetup_attendees
  for insert with check ((select auth.uid()) = user_id);
create policy attendees_delete_self on public.meetup_attendees
  for delete using ((select auth.uid()) = user_id);

-- Chat: authenticated only, write only as self, delete only self within 24h
create policy chat_read on public.chat_messages
  for select using ((select auth.role()) in ('authenticated', 'anon'));
create policy chat_insert_self on public.chat_messages
  for insert with check ((select auth.uid()) = user_id);
create policy chat_delete_self on public.chat_messages
  for delete using (
    (select auth.uid()) = user_id
    and created_at > now() - interval '24 hours'
  );

-- cities / city_weather / meetups / press_quotes are admin-write only (service_role).
-- No insert/update/delete policies on purpose — RLS will block anon/authenticated writes.

-- ============================================================================
-- Realtime publication (chat + reviews + profiles)
-- ============================================================================
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.reviews;
alter publication supabase_realtime add table public.profiles;
