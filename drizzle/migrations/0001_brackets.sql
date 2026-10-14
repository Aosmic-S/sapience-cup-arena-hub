ALTER TABLE public.games ADD COLUMN IF NOT EXISTS bracket_size integer NOT NULL DEFAULT 32;

CREATE TABLE public.brackets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game text NOT NULL,
  name text NOT NULL,
  size integer NOT NULL DEFAULT 32,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brackets TO anon, authenticated;
GRANT ALL ON public.brackets TO service_role;
ALTER TABLE public.brackets ENABLE ROW LEVEL SECURITY;
CREATE POLICY brackets_all ON public.brackets FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.bracket_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bracket_id uuid NOT NULL REFERENCES public.brackets(id) ON DELETE CASCADE,
  round integer NOT NULL,
  position integer NOT NULL,
  team_a text,
  team_b text,
  score_a integer,
  score_b integer,
  winner text,
  UNIQUE (bracket_id, round, position)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bracket_matches TO anon, authenticated;
GRANT ALL ON public.bracket_matches TO service_role;
ALTER TABLE public.bracket_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY bracket_matches_all ON public.bracket_matches FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);