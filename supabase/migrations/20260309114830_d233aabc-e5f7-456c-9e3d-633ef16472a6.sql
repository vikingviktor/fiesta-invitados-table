DROP POLICY "Anyone can insert guests" ON public.guests;

CREATE POLICY "Anyone can insert guests"
ON public.guests
FOR INSERT
TO anon
WITH CHECK (true);