-- Add color selection fields to guests table
ALTER TABLE public.guests 
ADD COLUMN color text,
ADD COLUMN color_acompanante text;