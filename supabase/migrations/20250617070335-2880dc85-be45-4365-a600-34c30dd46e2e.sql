
-- Add password and unique team number to registrations table
ALTER TABLE public.registrations 
ADD COLUMN team_number VARCHAR(20) UNIQUE,
ADD COLUMN password_hash TEXT;

-- Create a sequence for team numbers
CREATE SEQUENCE IF NOT EXISTS team_number_seq START 1001;

-- Create function to generate team numbers
CREATE OR REPLACE FUNCTION generate_team_number()
RETURNS VARCHAR(20)
LANGUAGE plpgsql
AS $$
DECLARE
    next_num INTEGER;
    team_num VARCHAR(20);
BEGIN
    next_num := nextval('team_number_seq');
    team_num := 'TEAM' || LPAD(next_num::TEXT, 4, '0');
    RETURN team_num;
END;
$$;

-- Create leaderboard table
CREATE TABLE public.leaderboard (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    team_number VARCHAR(20) REFERENCES public.registrations(team_number),
    game TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    matches_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    rank_position INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create match results table for tracking individual matches
CREATE TABLE public.match_results (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    team_number VARCHAR(20) REFERENCES public.registrations(team_number),
    game TEXT NOT NULL,
    match_date DATE NOT NULL,
    points_earned INTEGER DEFAULT 0,
    result TEXT CHECK (result IN ('win', 'loss', 'draw')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_leaderboard_game_rank ON public.leaderboard(game, rank_position);
CREATE INDEX idx_leaderboard_team_game ON public.leaderboard(team_number, game);
CREATE INDEX idx_match_results_team_game ON public.match_results(team_number, game);

-- Enable RLS on new tables
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for leaderboard (public read access)
CREATE POLICY "Anyone can view leaderboard" 
ON public.leaderboard 
FOR SELECT 
TO anon, authenticated
USING (true);

-- RLS policies for match_results (teams can only see their own results)
CREATE POLICY "Teams can view their own match results" 
ON public.match_results 
FOR SELECT 
TO authenticated
USING (team_number IN (
    SELECT team_number FROM public.registrations 
    WHERE team_number = match_results.team_number
));

-- Function to update leaderboard rankings
CREATE OR REPLACE FUNCTION update_leaderboard_rankings()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    game_name TEXT;
BEGIN
    -- Update rankings for each game
    FOR game_name IN SELECT DISTINCT game FROM public.leaderboard LOOP
        WITH ranked_teams AS (
            SELECT 
                id,
                ROW_NUMBER() OVER (ORDER BY points DESC, wins DESC, matches_played ASC) as new_rank
            FROM public.leaderboard 
            WHERE game = game_name
        )
        UPDATE public.leaderboard 
        SET rank_position = ranked_teams.new_rank,
            last_updated = now()
        FROM ranked_teams 
        WHERE public.leaderboard.id = ranked_teams.id;
    END LOOP;
END;
$$;

-- Trigger to automatically update leaderboard when match results change
CREATE OR REPLACE FUNCTION update_leaderboard_from_match()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert or update leaderboard entry
    INSERT INTO public.leaderboard (team_number, game, points, matches_played, wins, losses)
    VALUES (NEW.team_number, NEW.game, NEW.points_earned, 1, 
            CASE WHEN NEW.result = 'win' THEN 1 ELSE 0 END,
            CASE WHEN NEW.result = 'loss' THEN 1 ELSE 0 END)
    ON CONFLICT (team_number, game) 
    DO UPDATE SET
        points = leaderboard.points + NEW.points_earned,
        matches_played = leaderboard.matches_played + 1,
        wins = leaderboard.wins + CASE WHEN NEW.result = 'win' THEN 1 ELSE 0 END,
        losses = leaderboard.losses + CASE WHEN NEW.result = 'loss' THEN 1 ELSE 0 END,
        last_updated = now();
    
    -- Update rankings
    PERFORM update_leaderboard_rankings();
    
    RETURN NEW;
END;
$$;

-- Add unique constraint for team_number and game combination in leaderboard
ALTER TABLE public.leaderboard ADD CONSTRAINT unique_team_game UNIQUE (team_number, game);

-- Create trigger for automatic leaderboard updates
CREATE TRIGGER trigger_update_leaderboard
    AFTER INSERT OR UPDATE ON public.match_results
    FOR EACH ROW
    EXECUTE FUNCTION update_leaderboard_from_match();
