
-- Create table for managing available games
CREATE TABLE public.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  color text NOT NULL,
  description text,
  icon text DEFAULT 'gamepad',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active games
CREATE POLICY "Allow public read access to games" ON public.games FOR SELECT USING (true);

-- Insert default games
INSERT INTO public.games (name, display_name, color, description, is_active) VALUES
('free-fire', 'Free Fire', 'bg-gradient-to-r from-red-600 to-orange-600', 'Battle royale shooter game', true),
('codm', 'Call of Duty: Mobile', 'bg-gradient-to-r from-blue-600 to-purple-600', 'First-person shooter mobile game', true),
('fc-mobile', 'FC Mobile', 'bg-gradient-to-r from-green-600 to-teal-600', 'Football simulation game', true);
