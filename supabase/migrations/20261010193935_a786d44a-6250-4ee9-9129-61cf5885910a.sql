CREATE TABLE public.menu_platos (
  curso text PRIMARY KEY,
  plato text NOT NULL DEFAULT '',
  plato_vegetariano text,
  orden integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_platos TO authenticated;
GRANT ALL ON public.menu_platos TO service_role;
ALTER TABLE public.menu_platos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth manage menu_platos" ON public.menu_platos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "No viewer insert" ON public.menu_platos AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (NOT has_role(auth.uid(),'viewer'));
CREATE POLICY "No viewer update" ON public.menu_platos AS RESTRICTIVE FOR UPDATE TO authenticated USING (NOT has_role(auth.uid(),'viewer'));
CREATE POLICY "No viewer delete" ON public.menu_platos AS RESTRICTIVE FOR DELETE TO authenticated USING (NOT has_role(auth.uid(),'viewer'));
INSERT INTO public.menu_platos (curso, plato, plato_vegetariano, orden) VALUES
 ('cocktail','Cocktail',NULL,1),('primero','Salmorejo',NULL,2),('segundo','Cordero','Risotto de setas',3),('postre','Postre',NULL,4);

CREATE TABLE public.guest_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  is_plus_one boolean NOT NULL DEFAULT false,
  tags text[] NOT NULL DEFAULT '{}',
  otro text,
  con_jamon boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (guest_id, is_plus_one)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guest_menus TO authenticated;
GRANT ALL ON public.guest_menus TO service_role;
ALTER TABLE public.guest_menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth manage guest_menus" ON public.guest_menus FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "No viewer insert" ON public.guest_menus AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (NOT has_role(auth.uid(),'viewer'));
CREATE POLICY "No viewer update" ON public.guest_menus AS RESTRICTIVE FOR UPDATE TO authenticated USING (NOT has_role(auth.uid(),'viewer'));
CREATE POLICY "No viewer delete" ON public.guest_menus AS RESTRICTIVE FOR DELETE TO authenticated USING (NOT has_role(auth.uid(),'viewer'));
CREATE TRIGGER guest_menus_updated_at BEFORE UPDATE ON public.guest_menus FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER menu_platos_updated_at BEFORE UPDATE ON public.menu_platos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();