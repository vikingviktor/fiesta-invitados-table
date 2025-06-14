
-- Agrega el campo 'cancion_favorita' a ambos registros de invitados
ALTER TABLE public.guests ADD COLUMN cancion_favorita text;
ALTER TABLE public.deleted_guests ADD COLUMN cancion_favorita text;
