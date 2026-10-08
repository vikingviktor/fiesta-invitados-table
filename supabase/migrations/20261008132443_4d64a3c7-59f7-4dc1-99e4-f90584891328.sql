CREATE TABLE public.guest_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id uuid NOT NULL UNIQUE REFERENCES public.guests(id) ON DELETE CASCADE,
  importe numeric(10,2) NOT NULL DEFAULT 0,
  nota text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guest_payments TO authenticated;
GRANT ALL ON public.guest_payments TO service_role;
ALTER TABLE public.guest_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated manage guest_payments" ON public.guest_payments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER guest_payments_updated_at BEFORE UPDATE ON public.guest_payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();