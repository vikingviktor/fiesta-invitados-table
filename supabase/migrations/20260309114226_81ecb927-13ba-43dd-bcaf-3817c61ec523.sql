CREATE POLICY "Anyone can insert guests"
ON public.guests
FOR INSERT
TO anon
WITH CHECK (true);