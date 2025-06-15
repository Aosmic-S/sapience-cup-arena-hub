
-- Allow public access to banner_settings for admin functionality
CREATE POLICY "Allow public read access to banner_settings" 
ON public.banner_settings 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow public insert/update access to banner_settings for admin functionality
CREATE POLICY "Allow public write access to banner_settings" 
ON public.banner_settings 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);
