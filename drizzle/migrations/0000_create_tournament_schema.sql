-- ============================================================
-- Sapience eSports Cup 2025 - full application schema
-- ============================================================

-- ---------- GAMES ----------
create table public.games (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_name text not null,
  color text default 'bg-gradient-to-r from-blue-600 to-purple-600',
  description text,
  icon text default 'gamepad',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.games TO anon, authenticated;
GRANT ALL ON public.games TO service_role;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "games_select" ON public.games FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "games_insert" ON public.games FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "games_update" ON public.games FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "games_delete" ON public.games FOR DELETE TO anon, authenticated USING (true);

-- ---------- REGISTRATIONS ----------
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  class_section text,
  game text,
  entry_type text not null default 'solo',
  team_name text,
  team_uid text,
  phone_number text,
  in_game_id text,
  uid text,
  team_number text not null unique,
  password_hash text not null,
  members text[],
  created_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrations TO anon, authenticated;
GRANT ALL ON public.registrations TO service_role;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "registrations_select" ON public.registrations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "registrations_insert" ON public.registrations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "registrations_update" ON public.registrations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "registrations_delete" ON public.registrations FOR DELETE TO anon, authenticated USING (true);

-- ---------- BANNER SETTINGS ----------
create table public.banner_settings (
  id integer primary key default 1,
  text text default '',
  is_blinking boolean default false,
  color text default 'bg-gradient-to-r from-red-600 to-orange-600',
  is_active boolean default false,
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banner_settings TO anon, authenticated;
GRANT ALL ON public.banner_settings TO service_role;
ALTER TABLE public.banner_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banner_select" ON public.banner_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "banner_write" ON public.banner_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ---------- SYSTEM SETTINGS ----------
create table public.system_settings (
  id integer primary key default 1,
  registration_open boolean not null default false,
  max_participants integer not null default 100,
  auto_approval boolean not null default true,
  email_notifications boolean not null default false,
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO anon, authenticated;
GRANT ALL ON public.system_settings TO service_role;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "system_select" ON public.system_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "system_write" ON public.system_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ---------- RULES CONTENT ----------
create table public.rules_content (
  id integer primary key default 1,
  general text default '',
  freefire text default '',
  codm text default '',
  fcmobile text default '',
  conduct text default '',
  tournament text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rules_content TO anon, authenticated;
GRANT ALL ON public.rules_content TO service_role;
ALTER TABLE public.rules_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rules_select" ON public.rules_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "rules_write" ON public.rules_content FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ---------- ANNOUNCEMENTS ----------
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  priority text not null default 'normal',
  created_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO anon, authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements_select" ON public.announcements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "announcements_write" ON public.announcements FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ---------- MATCH DAYS ----------
create table public.match_days (
  id uuid primary key default gen_random_uuid(),
  date timestamptz not null,
  game text not null,
  time text not null,
  description text,
  created_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.match_days TO anon, authenticated;
GRANT ALL ON public.match_days TO service_role;
ALTER TABLE public.match_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "match_days_select" ON public.match_days FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "match_days_write" ON public.match_days FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ---------- MATCH RESULTS ----------
create table public.match_results (
  id uuid primary key default gen_random_uuid(),
  team_number text not null,
  game text not null,
  match_date date not null,
  points_earned integer not null default 0,
  result text not null default 'win',
  notes text,
  created_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.match_results TO anon, authenticated;
GRANT ALL ON public.match_results TO service_role;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "match_results_select" ON public.match_results FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "match_results_write" ON public.match_results FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ---------- LEADERBOARD ----------
create table public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  team_number text not null references public.registrations(team_number) on delete cascade,
  game text not null,
  points integer not null default 0,
  wins integer not null default 0,
  losses integer not null default 0,
  draws integer not null default 0,
  matches_played integer not null default 0,
  rank_position integer not null default 0,
  last_updated timestamptz not null default now(),
  unique (team_number, game)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leaderboard TO anon, authenticated;
GRANT ALL ON public.leaderboard TO service_role;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leaderboard_select" ON public.leaderboard FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "leaderboard_write" ON public.leaderboard FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ---------- TEAM NUMBER GENERATION ----------
create sequence if not exists public.team_number_seq start 1001;

create or replace function public.generate_team_number()
returns text
language sql
security definer
set search_path = public
as $$
  select 'TEAM' || nextval('public.team_number_seq')::text
$$;
GRANT EXECUTE ON FUNCTION public.generate_team_number() TO anon, authenticated;

-- ---------- LEADERBOARD RECALCULATION ----------
create or replace function public.update_leaderboard_rankings()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  with ranked as (
    select id,
           row_number() over (
             partition by game
             order by points desc, wins desc, matches_played asc
           ) as rn
    from leaderboard
  )
  update leaderboard l
  set rank_position = r.rn
  from ranked r
  where l.id = r.id;
end;
$$;
GRANT EXECUTE ON FUNCTION public.update_leaderboard_rankings() TO anon, authenticated;

-- ---------- AUTO UPDATE LEADERBOARD ON MATCH RESULT ----------
create or replace function public.update_leaderboard_from_match()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into leaderboard (team_number, game, points, wins, losses, draws, matches_played, last_updated)
  values (
    new.team_number,
    new.game,
    new.points_earned,
    case when new.result = 'win' then 1 else 0 end,
    case when new.result = 'loss' then 1 else 0 end,
    case when new.result = 'draw' then 1 else 0 end,
    1,
    now()
  )
  on conflict (team_number, game) do update
    set points = leaderboard.points + excluded.points,
        wins = leaderboard.wins + excluded.wins,
        losses = leaderboard.losses + excluded.losses,
        draws = leaderboard.draws + excluded.draws,
        matches_played = leaderboard.matches_played + 1,
        last_updated = now();

  perform public.update_leaderboard_rankings();
  return new;
end;
$$;

drop trigger if exists match_results_leaderboard on public.match_results;
create trigger match_results_leaderboard
  after insert on public.match_results
  for each row execute function public.update_leaderboard_from_match();

-- ---------- REALTIME FOR BANNER ----------
alter publication supabase_realtime add table public.banner_settings;

-- ---------- SEED DATA ----------
insert into public.games (name, display_name, color, description, icon) values
  ('free-fire', 'Free Fire', 'bg-gradient-to-r from-red-600 to-orange-600', 'Battle Royale squad matches', 'flame'),
  ('codm', 'CODM', 'bg-gradient-to-r from-yellow-600 to-red-600', 'Call of Duty Mobile multiplayer', 'crosshair'),
  ('fc-mobile', 'FC Mobile', 'bg-gradient-to-r from-green-600 to-teal-600', 'Football simulation matches', 'trophy')
on conflict (name) do nothing;

insert into public.banner_settings (id, text, is_blinking, color, is_active) values
  (1, 'Sapience eSports Cup 2025 - Tournament under school approval. Registration opening soon!', true, 'bg-gradient-to-r from-orange-600 to-red-600', true)
on conflict (id) do nothing;

insert into public.system_settings (id, registration_open, max_participants, auto_approval, email_notifications) values
  (1, false, 100, true, false)
on conflict (id) do nothing;

insert into public.rules_content (id, general, freefire, codm, fcmobile, conduct, tournament) values
  (1,
   '1. The tournament is open to students of Class 9 and above at The Sapience School, Vikasnagar.
2. Each participant may register for one game only.
3. Team entries may have up to 5 members.
4. All entries must be approved by the tournament committee before the first match.
5. Bring your own device and charger. The school is not responsible for lost or damaged devices.
6. Match schedules are final. Late arrivals may be disqualified from that match.',
   'Free Fire: Squad mode, 4 players plus 1 substitute.
1. Only in-game sensitivity and graphics settings may be changed.
2. Emulators and external overlays are strictly prohibited.
3. Any use of hacks, scripts or mods leads to immediate disqualification.
4. Points are awarded per placement and kill as announced by the committee.',
   'CODM: Multiplayer, 5v5.
1. Devices must be on Do Not Disturb during play.
2. Controllers and emulators are not allowed.
3. Custom lobbies are created by the committee only.
4. Pausing or quitting mid-match is treated as a forfeit.',
   'FC Mobile: 1v1 knockout and group stage.
1. Only the club and squad registered before the match may be used.
2. Injuries and management sim sliders must be set to the committee defaults.
3. Extra time is played where the format requires a winner.
4. Reconnecting is allowed once per match within 5 minutes.',
   'Code of Conduct and Disqualification:
1. Abuse, cheating, or unsportsmanlike behaviour towards opponents, officials or staff leads to immediate disqualification.
2. No use of third-party software, mods, hacks or exploits of any kind.
3. Players must follow the committee''s decision; it is final and binding.
4. Mobile phones must be silenced in the match area.
5. Damaging school property results in forfeiture of all entries.',
   'Tournament Format and Prize Structure:
1. Format: group stage followed by knockout rounds, announced by the committee.
2. Prizes are awarded for first and second place in each game only.
3. First place: Trophy + Cash prize + Certificate.
4. Second place: Cash prize + Certificate.
5. Standings are updated after each match and shown on the public leaderboard.
6. The tournament is currently under school management approval and dates will be confirmed after approval.')
on conflict (id) do nothing;