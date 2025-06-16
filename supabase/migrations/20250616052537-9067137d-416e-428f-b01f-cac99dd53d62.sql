
-- Allow public insert access to registrations table for tournament registration
CREATE POLICY "Allow public registration" 
ON public.registrations 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow public read access to registrations for admin purposes
CREATE POLICY "Allow public read registrations" 
ON public.registrations 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow public update access to registrations for admin purposes
CREATE POLICY "Allow public update registrations" 
ON public.registrations 
FOR UPDATE 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Allow public delete access to registrations for admin purposes
CREATE POLICY "Allow public delete registrations" 
ON public.registrations 
FOR DELETE 
TO anon, authenticated 
USING (true);
