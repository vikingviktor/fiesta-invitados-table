-- Crear tabla de alojamientos con todas las propiedades y habitaciones
CREATE TABLE public.alojamientos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  propiedad TEXT NOT NULL,
  habitacion TEXT NOT NULL,
  tipo_cama TEXT,
  plazas INTEGER NOT NULL DEFAULT 1,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.alojamientos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para usuarios autenticados
CREATE POLICY "Authenticated users can view alojamientos"
ON public.alojamientos
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert alojamientos"
ON public.alojamientos
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update alojamientos"
ON public.alojamientos
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete alojamientos"
ON public.alojamientos
FOR DELETE
USING (auth.role() = 'authenticated');

-- Insertar todos los alojamientos del Excel

-- ALDEA TEJERA NEGRA (Casillos 1-4)
INSERT INTO public.alojamientos (propiedad, habitacion, tipo_cama, plazas, observaciones) VALUES
('Aldea Tejera Negra', 'Casillo 1 - Hab. 1', 'Cama individual x2 + supletoria', 3, 'Habitación con baño completo'),
('Aldea Tejera Negra', 'Casillo 1 - Hab. 2', 'Cama individual x2 + supletoria', 3, 'Habitación con baño completo'),
('Aldea Tejera Negra', 'Casillo 1 - Salón', 'Sofá-cama doble x2', 4, NULL),
('Aldea Tejera Negra', 'Casillo 2 - Hab. 1', 'Cama individual x2 + supletoria', 3, 'Habitación con baño completo'),
('Aldea Tejera Negra', 'Casillo 2 - Hab. 2', 'Cama individual x2 + supletoria', 3, 'Habitación con baño completo'),
('Aldea Tejera Negra', 'Casillo 2 - Salón', 'Sofá-cama doble x2', 4, NULL),
('Aldea Tejera Negra', 'Casillo 3 - Hab. 1', 'Cama individual x2 + supletoria', 3, 'Habitación con baño completo'),
('Aldea Tejera Negra', 'Casillo 3 - Hab. 2', 'Cama individual x2 + supletoria', 3, 'Habitación con baño completo'),
('Aldea Tejera Negra', 'Casillo 3 - Salón', 'Sofá-cama doble x2', 4, NULL),
('Aldea Tejera Negra', 'Casillo 4 - Hab. 1', 'Cama individual x2 + supletoria', 3, 'Habitación con baño completo'),
('Aldea Tejera Negra', 'Casillo 4 - Hab. 2', 'Cama individual x2', 2, 'Habitación con baño completo'),
('Aldea Tejera Negra', 'Casillo 4 - Salón', 'Sofá-cama doble x2', 4, NULL),

-- LA CASONA DE CAMPILLO
('La Casona de Campillo', 'Planta Baja - Nº 1', 'Cama doble', 2, 'Baño planta baja'),
('La Casona de Campillo', 'Planta Baja - Nº 2', 'Cama doble', 2, NULL),
('La Casona de Campillo', 'Planta Baja - Nº 3', 'Cama individual x2', 2, NULL),
('La Casona de Campillo', 'Planta Baja - Nº 4', 'Cama individual x2', 2, NULL),
('La Casona de Campillo', 'Buhardilla 1 - Nº 5', 'Sofá-cama doble x2', 4, 'Baño planta alta'),
('La Casona de Campillo', 'Buhardilla 1 - Nº 6', 'Cama individual x2', 2, NULL),
('La Casona de Campillo', 'Buhardilla 2 - Nº 7', 'Cama doble', 2, NULL),

-- EL ABEJARUCO
('El Abejaruco', 'Tejo', 'Cama individual x2 + supletoria', 3, 'Baño completo'),
('El Abejaruco', 'Haya', 'Cama individual x2', 2, 'Baño completo'),
('El Abejaruco', 'Roble', 'Cama doble', 2, 'Baño completo'),
('El Abejaruco', 'Chopo', 'Cama individual x2 + supletoria', 3, 'Baño completo'),
('El Abejaruco', 'Fresno', 'Cama individual x2 + supletoria', 3, 'Baño completo'),

-- APARTAMENTO ACEBUCHE
('Apartamento Acebuche', 'Nº 1', 'Cama individual x2', 2, 'Apartamento con 1 baño'),
('Apartamento Acebuche', 'Nº 2', 'Cama doble', 2, NULL),

-- APARTAMENTO ACEBO
('Apartamento Acebo', 'Nº 1', 'Cama doble', 2, 'Apartamento con 1 baño'),
('Apartamento Acebo', 'Nº 2', 'Cama doble', 2, NULL),

-- CASA RURAL 1786
('Casa Rural 1786', 'Nº 1', 'Cama doble', 2, '1 baño'),
('Casa Rural 1786', 'Nº 2', 'Cama individual x2', 2, NULL),
('Casa Rural 1786', 'Nº 3', 'Cama supletoria', 1, NULL),

-- LA CASA DEL SOL
('La Casa del Sol', 'Nº 1', 'Cama individual x2', 2, 'Baño completo'),
('La Casa del Sol', 'Nº 2', 'Cama doble', 2, 'Baño completo'),
('La Casa del Sol', 'Nº 3', 'Cama doble', 2, 'Baño completo'),
('La Casa del Sol', 'Suite', 'Cama doble + supletoria', 3, 'Baño completo'),

-- LOS 3 OLIVOS
('Los 3 Olivos', 'Nº 1', 'Cama doble', 2, '2 baños'),
('Los 3 Olivos', 'Nº 2', '2 Camas', 2, NULL),
('Los 3 Olivos', 'Nº 3', '2 Camas', 2, NULL),

-- LA ERA DE LA TIA DONATA
('La Era de la Tía Donata', 'Robleluengo', 'Cama doble', 2, 'Baño completo'),
('La Era de la Tía Donata', 'La Vereda', 'Cama individual x2 + supletorias', 4, 'Baño completo'),
('La Era de la Tía Donata', 'Matallana', 'Cama doble + supletorias', 4, 'Baño completo'),
('La Era de la Tía Donata', 'Campillejo', 'Cama doble', 2, 'Baño completo'),
('La Era de la Tía Donata', 'El Espinar', 'Cama doble', 2, 'Baño completo'),
('La Era de la Tía Donata', 'Roblelacasa', 'Cama individual x2', 2, 'Baño completo'),

-- LA CASONA DE MAJAELRAYO
('La Casona de Majaelrayo', 'Nº 1', 'Cama individual x2', 2, 'Baño completo'),
('La Casona de Majaelrayo', 'Nº 2', 'Cama individual x2', 2, 'Baño completo'),
('La Casona de Majaelrayo', 'Nº 3', 'Cama doble + supletoria', 3, 'Baño completo'),
('La Casona de Majaelrayo', 'Nº 4', 'Cama doble + supletoria', 3, 'Baño completo'),
('La Casona de Majaelrayo', 'Nº 5', 'Cama individual x2', 2, 'Baño completo'),
('La Casona de Majaelrayo', 'Nº 6', 'Cama doble', 2, 'Baño completo'),
('La Casona de Majaelrayo', 'Nº 7', 'Cama doble', 2, 'Baño completo'),
('La Casona de Majaelrayo', 'Nº 8', 'Cama doble', 2, 'Baño completo'),
('La Casona de Majaelrayo', 'Nº 9', 'Cama doble + supletoria', 3, 'Baño completo'),
('La Casona de Majaelrayo', 'Nº 10', 'Cama doble', 2, 'Baño completo'),
('La Casona de Majaelrayo', 'Nº 11', 'Litera x4', 4, 'Baño completo'),
('La Casona de Majaelrayo', 'Salón', 'Sofá-cama doble', 2, '2 aseos'),

-- APARTAMENTOS LA PLAZA
('Apartamentos La Plaza', 'Apto. 1 - Hab. 1', 'Cama doble + supletoria', 3, 'Baño completo'),
('Apartamentos La Plaza', 'Apto. 1 - Salón', 'Sofá-cama doble', 2, NULL),
('Apartamentos La Plaza', 'Apto. 2 - Hab. 1', 'Cama individual x2 + supletoria', 3, 'Baño completo'),
('Apartamentos La Plaza', 'Apto. 2 - Salón', 'Sofá-cama doble', 2, NULL),
('Apartamentos La Plaza', 'Apto. 3 - Hab. 1', 'Cama doble + supletoria', 3, 'Baño completo'),
('Apartamentos La Plaza', 'Apto. 3 - Salón', 'Sofá-cama doble', 2, NULL),
('Apartamentos La Plaza', 'Apto. 4 - Hab. 1', 'Cama individual x2 + supletoria', 3, 'Baño completo'),
('Apartamentos La Plaza', 'Apto. 4 - Salón', 'Sofá-cama doble', 2, NULL),

-- LAS CABEZADAS
('Las Cabezadas', 'Las Retichuelas - Hab. 1', 'Cama doble', 2, 'Baño completo'),
('Las Cabezadas', 'Las Retichuelas - Hab. 2', 'Cama individual x2', 2, NULL),
('Las Cabezadas', 'Las Retichuelas - Salón', 'Sofá-cama doble', 2, NULL),
('Las Cabezadas', 'Los Lapuchares - Hab. 1', 'Cama doble', 2, 'Baño completo'),
('Las Cabezadas', 'Los Lapuchares - Hab. 2', 'Cama individual x2', 2, NULL),
('Las Cabezadas', 'Los Lapuchares - Salón', 'Sofá-cama doble', 2, NULL),
('Las Cabezadas', 'Las Paraillas - Hab. 1', 'Cama doble', 2, 'Baño completo'),
('Las Cabezadas', 'Las Paraillas - Hab. 2', 'Cama individual x2', 2, NULL),
('Las Cabezadas', 'Las Paraillas - Salón', 'Sofá-cama doble', 2, NULL),
('Las Cabezadas', 'Peña Bernardo - Hab. 1', 'Cama doble', 2, 'Baño completo'),
('Las Cabezadas', 'Peña Bernardo - Hab. 2', 'Cama individual x2', 2, NULL),
('Las Cabezadas', 'Peña Bernardo - Salón', 'Sofá-cama doble', 2, NULL),

-- LA MAJADA DEL RAYO
('La Majada del Rayo', 'Nº 1', 'Cama individual x2 + supletoria', 3, '2 baños compartidos'),
('La Majada del Rayo', 'Nº 2', 'Cama individual x2', 2, NULL),
('La Majada del Rayo', 'Nº 3', 'Cama individual x2', 2, NULL),
('La Majada del Rayo', 'Nº 4', 'Cama individual x2 + supletoria', 3, NULL),
('La Majada del Rayo', 'Nº 5', 'Cama doble', 2, 'Baño con bañera hidromasaje'),

-- CASA RURAL BEBA
('Casa Rural Beba', 'Nº 1', 'Cama individual x2', 2, '1 baño'),
('Casa Rural Beba', 'Nº 2', 'Cama doble', 2, NULL),

-- CEREZAS Y MIEL
('Cerezas y Miel', 'Nº 1', 'Cama doble', 2, '1 baño completo'),
('Cerezas y Miel', 'Nº 2', 'Cama doble', 2, '2 baños completos'),
('Cerezas y Miel', 'Nº 3', 'Cama doble', 2, NULL),
('Cerezas y Miel', 'Nº 4', 'Cama individual x2 + litera', 4, NULL),

-- EL POSTIGO
('El Postigo', 'Nº 1', 'Cama doble + supletoria niños', 3, NULL),
('El Postigo', 'Nº 2', 'Cama doble', 2, NULL),
('El Postigo', 'Nº 3', 'Cama individual x2', 2, NULL),

-- LA CASITA DEL OCEJÓN
('La Casita del Ocejón', 'Nº 1', 'Cama doble', 2, '1 Baño y 1 Aseo'),
('La Casita del Ocejón', 'Nº 2', 'Cama doble', 2, NULL),
('La Casita del Ocejón', 'Nº 3', 'Litera', 2, NULL),
('La Casita del Ocejón', 'Salón', 'Sofá-cama', 2, NULL),

-- AL VIENTO DEL OCEJÓN
('Al Viento del Ocejón', 'Nº 1', 'Cama doble', 2, 'Baño completo'),
('Al Viento del Ocejón', 'Nº 2', 'Cama doble', 2, 'Baño completo'),
('Al Viento del Ocejón', 'Nº 3', 'Cama doble', 2, 'Baño completo'),
('Al Viento del Ocejón', 'Nº 4', 'Cama individual x2', 2, 'Baño completo'),
('Al Viento del Ocejón', 'Nº 5', 'Cama individual x2', 2, 'Baño completo'),
('Al Viento del Ocejón', 'Nº 6', 'Cama individual x2', 2, 'Baño completo'),

-- LA PIZARRA NEGRA
('La Pizarra Negra', 'Ayllón', 'Cama doble + supletoria', 3, 'Baño completo'),
('La Pizarra Negra', 'Pico del Lobo', 'Cama individual x2 + supletoria', 3, 'Baño completo'),
('La Pizarra Negra', 'Sonzaz', 'Cama doble + supletoria', 3, 'Baño completo'),
('La Pizarra Negra', 'Tejera Negra', 'Cama individual x2', 2, 'Baño completo'),
('La Pizarra Negra', 'Jarama', 'Cama individual x2', 2, 'Baño completo'),
('La Pizarra Negra', 'Ocejón', 'Cama individual x2', 2, 'Baño completo'),

-- EL ROBLE HUECO
('El Roble Hueco', 'Nº 1', 'Cama individual x2', 2, 'Baño completo'),
('El Roble Hueco', 'Nº 2', 'Cama individual x2', 2, 'Baño completo'),
('El Roble Hueco', 'Nº 3', 'Cama individual x2', 2, 'Baño completo'),
('El Roble Hueco', 'Nº 4', 'Cama individual x2 + supletoria', 3, 'Baño completo'),
('El Roble Hueco', 'Nº 5', 'Cama individual x2 + supletoria', 3, 'Baño completo'),
('El Roble Hueco', 'Nº 6', 'Cama individual x2 + supletoria', 3, 'Baño completo'),
('El Roble Hueco', 'Nº 7', 'Cama individual x2 + supletoria', 3, 'Baño completo'),
('El Roble Hueco', 'Nº 8', 'Cama individual x2 + supletoria', 3, 'Baño completo'),

-- LOS 12 ROBLES
('Los 12 Robles', 'Campillejo', 'Cama doble', 2, 'Baño completo'),
('Los 12 Robles', 'El Espinar', 'Cama individual x2', 2, 'Baño completo'),
('Los 12 Robles', 'La Vereda', 'Cama doble', 2, 'Baño completo'),
('Los 12 Robles', 'Matallana', 'Cama individual x2', 2, 'Baño completo'),
('Los 12 Robles', 'Roblelacasa', 'Cama doble + supletoria', 3, 'Baño completo');