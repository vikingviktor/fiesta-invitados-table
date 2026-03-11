ALTER TABLE public.guests ADD COLUMN email text;

-- Create unique index on email (only for non-null values)
CREATE UNIQUE INDEX guests_email_unique ON public.guests (email) WHERE email IS NOT NULL;

-- Add permissive SELECT policy for anon to check duplicate emails
CREATE POLICY "Anyone can check email exists"
ON public.guests
FOR SELECT
TO anon
USING (true);