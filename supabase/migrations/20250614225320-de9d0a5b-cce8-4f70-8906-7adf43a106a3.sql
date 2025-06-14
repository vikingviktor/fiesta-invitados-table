
-- Añadir campo de consentimiento a la tabla de invitados
ALTER TABLE public.guests ADD COLUMN consentimiento_publicacion boolean NOT NULL DEFAULT false;

-- Añadir campo de consentimiento a la tabla de invitados eliminados
ALTER TABLE public.deleted_guests ADD COLUMN consentimiento_publicacion boolean NOT NULL DEFAULT false;
