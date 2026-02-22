
-- Table to store mesa positions in the interactive map
CREATE TABLE public.mesa_positions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  mesa_name text NOT NULL,
  x integer NOT NULL DEFAULT 0,
  y integer NOT NULL DEFAULT 0,
  width integer NOT NULL DEFAULT 2,
  height integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Space dimensions config (single row)
CREATE TABLE public.mesa_layout_config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  space_width integer NOT NULL DEFAULT 20,
  space_height integer NOT NULL DEFAULT 15,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.mesa_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mesa_layout_config ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Authenticated users can manage mesa_positions"
ON public.mesa_positions FOR ALL
USING (auth.role() = 'authenticated'::text)
WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can manage mesa_layout_config"
ON public.mesa_layout_config FOR ALL
USING (auth.role() = 'authenticated'::text)
WITH CHECK (auth.role() = 'authenticated'::text);
