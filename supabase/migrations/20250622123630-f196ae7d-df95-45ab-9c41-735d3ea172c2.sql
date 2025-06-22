
-- Add team_uid column to registrations table
ALTER TABLE public.registrations 
ADD COLUMN team_uid TEXT;
