
-- 1. Agrega el campo menu_acompanante (opcional) a la tabla guests.
ALTER TABLE public.guests
ADD COLUMN menu_acompanante TEXT;

-- 2. Agrega el campo menu_acompanante (opcional) en deleted_guests para mantener la trazabilidad.
ALTER TABLE public.deleted_guests
ADD COLUMN menu_acompanante TEXT;
