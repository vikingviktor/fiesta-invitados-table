CREATE TABLE public.mesa_seats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  x integer NOT NULL,
  y integer NOT NULL,
  guest_id uuid REFERENCES public.guests(id) ON DELETE CASCADE,
  is_plus_one boolean NOT NULL DEFAULT false,
  nombre text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (x, y)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mesa_seats TO authenticated;
GRANT ALL ON public.mesa_seats TO service_role;
ALTER TABLE public.mesa_seats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated manage mesa_seats" ON public.mesa_seats FOR ALL TO authenticated USING (true) WITH CHECK (true);