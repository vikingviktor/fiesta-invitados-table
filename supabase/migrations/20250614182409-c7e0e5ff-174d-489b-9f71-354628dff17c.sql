
-- Crear tabla para registros de invitados eliminados
CREATE TABLE public.deleted_guests (
    id UUID PRIMARY KEY,
    nombre TEXT NOT NULL,
    plus_one BOOLEAN NOT NULL,
    menu TEXT NOT NULL,
    comentario TEXT,
    date TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- (Opcional) Si deseas registrar qué usuario lo eliminó, se puede agregar un campo user_id aquí.

-- Agregar la tabla a la publicación realtime de Supabase si quieres que sea reactiva.
ALTER TABLE public.deleted_guests REPLICA IDENTITY FULL;

-- Permitir acceso total (leer y escribir) a cualquier usuario autenticado en deleted_guests
ALTER TABLE public.deleted_guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated actions" ON public.deleted_guests
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

