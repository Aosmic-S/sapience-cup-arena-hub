ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS admission_no text, ADD COLUMN IF NOT EXISTS status text DEFAULT 'active', ADD COLUMN IF NOT EXISTS dq_reason text, ADD COLUMN IF NOT EXISTS player_rank text, ADD COLUMN IF NOT EXISTS player_level integer, ADD COLUMN IF NOT EXISTS team_ovr integer;
ALTER TABLE public.rules_content ADD COLUMN IF NOT EXISTS bgmi text DEFAULT '';
CREATE TABLE public.team_members (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), team_number text NOT NULL REFERENCES public.registrations(team_number) ON DELETE CASCADE, full_name text NOT NULL, admission_no text NOT NULL, class_section text NOT NULL, in_game_id text NOT NULL, uid text NOT NULL, phone_number text NOT NULL, role text NOT NULL DEFAULT 'Fragger', player_rank text, player_level integer, slot integer NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(team_number, slot), UNIQUE(team_number, uid), UNIQUE(team_number, admission_no));
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.register_tournament_entry(payload jsonb) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE code text; game_name text; mode_name text; count_members integer; parent public.registrations; next_status text; BEGIN
IF NOT EXISTS (SELECT 1 FROM public.system_settings WHERE id=1 AND registration_open=true) THEN RAISE EXCEPTION 'The tournament is under school approval. Registration is not open yet.'; END IF;
IF length(trim(coalesce(payload->>'full_name',''))) NOT BETWEEN 2 AND 100 OR length(trim(coalesce(payload->>'admission_no',''))) NOT BETWEEN 2 AND 50 OR length(trim(coalesce(payload->>'uid',''))) NOT BETWEEN 3 AND 60 OR length(trim(coalesce(payload->>'in_game_id',''))) NOT BETWEEN 2 AND 60 OR coalesce(payload->>'phone_number','') !~ '^[0-9+ ()-]{7,20}$' OR coalesce(payload->>'class_section','') !~ '^(9|10|11|12)([^0-9]|$)' THEN RAISE EXCEPTION 'Please enter valid player details, an admission number and Class 9 or above.'; END IF;
mode_name:=payload->>'mode'; game_name:=payload->>'game';
IF game_name NOT IN ('bgmi','fc-mobile') OR NOT EXISTS(SELECT 1 FROM public.games WHERE name=game_name AND is_active) THEN RAISE EXCEPTION 'This game is not available.'; END IF;
IF mode_name='join' THEN
code:=trim(payload->>'team_code'); SELECT * INTO parent FROM public.registrations WHERE team_number=code FOR UPDATE;
IF parent.id IS NULL OR parent.game<>'bgmi' THEN RAISE EXCEPTION 'BGMI squad not found.'; END IF;
IF parent.status NOT IN ('active','waitlisted') THEN RAISE EXCEPTION 'This squad cannot accept players.'; END IF;
SELECT count(*) INTO count_members FROM public.team_members WHERE team_number=code;
IF count_members>=5 THEN RAISE EXCEPTION 'This squad already has 5 players.'; END IF;
ELSE
IF mode_name NOT IN ('create','solo') OR (game_name='bgmi' AND mode_name<>'create') OR (game_name='fc-mobile' AND mode_name<>'solo') THEN RAISE EXCEPTION 'Invalid entry type.'; END IF;
IF length(coalesce(payload->>'password','')) NOT BETWEEN 6 AND 100 THEN RAISE EXCEPTION 'Password must have 6 to 100 characters.'; END IF;
IF game_name='bgmi' AND length(trim(coalesce(payload->>'team_name',''))) NOT BETWEEN 2 AND 60 THEN RAISE EXCEPTION 'Please enter a squad name.'; END IF;
PERFORM pg_advisory_xact_lock(2026);
code:=CASE WHEN game_name='fc-mobile' THEN 'FCM-'||nextval('public.team_number_seq')::text ELSE (100000+nextval('public.team_number_seq')%900000)::text END;
next_status:=CASE WHEN game_name='bgmi' AND (SELECT count(*) FROM public.registrations WHERE game='bgmi' AND status='active')>=32 THEN 'waitlisted' ELSE 'active' END;
INSERT INTO public.registrations(full_name,admission_no,class_section,game,entry_type,team_name,phone_number,in_game_id,uid,team_number,password_hash,status,player_rank,player_level,team_ovr) VALUES(trim(payload->>'full_name'),trim(payload->>'admission_no'),payload->>'class_section',game_name,CASE WHEN game_name='bgmi' THEN 'team' ELSE 'solo' END,CASE WHEN game_name='bgmi' THEN trim(payload->>'team_name') END,payload->>'phone_number',payload->>'in_game_id',payload->>'uid',code,payload->>'password',next_status,payload->>'player_rank',nullif(payload->>'player_level','')::integer,nullif(payload->>'team_ovr','')::integer);
count_members:=0;
END IF;
IF game_name='bgmi' THEN
IF coalesce(payload->>'role','Fragger') NOT IN ('IGL','Fragger','Sniper','Scout','Support') THEN RAISE EXCEPTION 'Invalid player role.'; END IF;
INSERT INTO public.team_members(team_number,full_name,admission_no,class_section,in_game_id,uid,phone_number,role,player_rank,player_level,slot) VALUES(code,trim(payload->>'full_name'),trim(payload->>'admission_no'),payload->>'class_section',payload->>'in_game_id',payload->>'uid',payload->>'phone_number',CASE WHEN count_members=0 THEN 'IGL' ELSE coalesce(payload->>'role','Fragger') END,payload->>'player_rank',nullif(payload->>'player_level','')::integer,count_members+1);
END IF;
RETURN code;
EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'This admission number or in-game UID is already in the squad.';
END; $$;
REVOKE ALL ON FUNCTION public.register_tournament_entry(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_tournament_entry(jsonb) TO anon, authenticated, service_role;
CREATE OR REPLACE FUNCTION public.squad_roster(code text) RETURNS TABLE(in_game_id text, role text, player_rank text, slot integer) LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT m.in_game_id,m.role,m.player_rank,m.slot FROM public.team_members m WHERE m.team_number=code ORDER BY m.slot $$;
REVOKE ALL ON FUNCTION public.squad_roster(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.squad_roster(text) TO anon,authenticated,service_role;
CREATE OR REPLACE FUNCTION public.validate_match_entry() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN IF NOT EXISTS(SELECT 1 FROM public.registrations WHERE team_number=NEW.team_number AND game=NEW.game AND status='active') THEN RAISE EXCEPTION 'Only active entries in the selected game can receive match results.'; END IF; RETURN NEW; END; $$;
CREATE TRIGGER validate_match_entry BEFORE INSERT OR UPDATE ON public.match_results FOR EACH ROW EXECUTE FUNCTION public.validate_match_entry();
CREATE OR REPLACE FUNCTION public.reverse_deleted_match() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN UPDATE public.leaderboard SET points=points-OLD.points_earned,wins=wins-CASE WHEN OLD.result='win' THEN 1 ELSE 0 END,losses=losses-CASE WHEN OLD.result='loss' THEN 1 ELSE 0 END,draws=draws-CASE WHEN OLD.result='draw' THEN 1 ELSE 0 END,matches_played=greatest(0,matches_played-1),last_updated=now() WHERE team_number=OLD.team_number AND game=OLD.game; PERFORM public.update_leaderboard_rankings(); RETURN OLD; END; $$;
CREATE TRIGGER reverse_deleted_match AFTER DELETE ON public.match_results FOR EACH ROW EXECUTE FUNCTION public.reverse_deleted_match();