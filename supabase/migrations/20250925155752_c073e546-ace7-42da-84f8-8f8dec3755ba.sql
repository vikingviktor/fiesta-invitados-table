-- Fix security vulnerability: Restrict guests table access to authenticated users only
-- This replaces the current public policies with authentication-required policies

-- Drop existing public policies
DROP POLICY IF EXISTS "Public Delete Guests" ON public.guests;
DROP POLICY IF EXISTS "Public Insert Guests" ON public.guests; 
DROP POLICY IF EXISTS "Public Select Guests" ON public.guests;
DROP POLICY IF EXISTS "Public Update Guests" ON public.guests;

-- Create new authentication-required policies
CREATE POLICY "Authenticated users can select guests" 
ON public.guests 
FOR SELECT 
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert guests" 
ON public.guests 
FOR INSERT 
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update guests" 
ON public.guests 
FOR UPDATE 
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete guests" 
ON public.guests 
FOR DELETE 
TO authenticated
USING (auth.role() = 'authenticated');