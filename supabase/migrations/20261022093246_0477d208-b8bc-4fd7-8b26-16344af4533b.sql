CREATE TABLE public.wedding_seating_plan (
 id text PRIMARY KEY,
 layout jsonb NOT NULL,
 revision integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_seating_plan TO authenticated;
GRANT ALL ON public.wedding_seating_plan TO service_role;
ALTER TABLE public.wedding_seating_plan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read seating plan" ON public.wedding_seating_plan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors insert seating plan" ON public.wedding_seating_plan FOR INSERT TO authenticated WITH CHECK (NOT public.has_role(auth.uid(), 'viewer'));
CREATE POLICY "Editors update seating plan" ON public.wedding_seating_plan FOR UPDATE TO authenticated USING (NOT public.has_role(auth.uid(), 'viewer')) WITH CHECK (NOT public.has_role(auth.uid(), 'viewer'));
CREATE POLICY "Editors delete seating plan" ON public.wedding_seating_plan FOR DELETE TO authenticated USING (NOT public.has_role(auth.uid(), 'viewer'));
CREATE TRIGGER wedding_seating_plan_updated_at BEFORE UPDATE ON public.wedding_seating_plan FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();