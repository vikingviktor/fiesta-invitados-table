
-- Agrega el campo 'mesa' (número de mesa, permite nulos) a la tabla de invitados:
ALTER TABLE public.guests ADD COLUMN mesa integer;

-- Permite actualizar y seleccionar el campo nueva columna en políticas existentes:
-- (Las políticas ya permiten seleccionar y actualizar cualquier campo)

-- Opcional: puedes agregar una verificación de que la mesa esté entre 1 y 11 directamente en el frontend; no usaremos CHECK en la base de datos para evitar problemas, según las mejores prácticas.
