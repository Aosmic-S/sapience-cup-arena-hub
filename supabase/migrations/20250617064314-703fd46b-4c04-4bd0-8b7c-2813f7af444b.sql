
-- Create a table for storing editable tournament rules content
CREATE TABLE public.rules_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  general TEXT DEFAULT '',
  freefire TEXT DEFAULT '',
  codm TEXT DEFAULT '',
  fcmobile TEXT DEFAULT '',
  conduct TEXT DEFAULT '',
  tournament TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default row
INSERT INTO public.rules_content (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Add constraint to ensure only one row exists
ALTER TABLE public.rules_content ADD CONSTRAINT rules_content_single_row CHECK (id = 1);
