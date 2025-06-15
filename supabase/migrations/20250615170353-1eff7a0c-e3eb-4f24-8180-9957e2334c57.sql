
-- Table for banner settings
CREATE TABLE public.banner_settings (
  id smallint PRIMARY KEY DEFAULT 1,
  text text,
  is_blinking boolean DEFAULT false,
  color text,
  is_active boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);

-- Table for system settings
CREATE TABLE public.system_settings (
  id smallint PRIMARY KEY DEFAULT 1,
  registration_open boolean DEFAULT true,
  max_participants integer DEFAULT 100,
  auto_approval boolean DEFAULT true,
  email_notifications boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);

-- Table for match days/calendar
CREATE TABLE public.match_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  game text NOT NULL,
  "time" text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Table for announcements
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  priority text DEFAULT 'normal',
  created_at timestamptz DEFAULT now()
);

-- Table for registrations
CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  class_section text NOT NULL,
  game text NOT NULL,
  entry_type text NOT NULL,
  team_name text,
  phone_number text NOT NULL,
  in_game_id text,
  uid text,
  members text[],
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security for all new tables
ALTER TABLE public.banner_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to data that should be visible to everyone
CREATE POLICY "Allow public read access to banner settings" ON public.banner_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access to match days" ON public.match_days FOR SELECT USING (true);
CREATE POLICY "Allow public read access to announcements" ON public.announcements FOR SELECT USING (true);

-- Insert initial default data for settings tables
INSERT INTO public.banner_settings (id, text, is_blinking, color, is_active)
VALUES (1, 'Welcome to the tournament!', false, 'bg-gradient-to-r from-blue-600 to-purple-600', true);

INSERT INTO public.system_settings (id, registration_open, max_participants, auto_approval, email_notifications)
VALUES (1, true, 100, true, false);
