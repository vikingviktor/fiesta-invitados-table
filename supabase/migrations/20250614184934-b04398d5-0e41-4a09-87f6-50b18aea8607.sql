
-- Crear la tabla principal de invitados
create table public.guests (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  plus_one boolean not null,
  nombre_acompanante text,
  menu text not null,
  comentario text,
  date timestamp without time zone not null default now()
);

-- Permitir acceso público (sin RLS por ahora)
alter table public.guests enable row level security;
create policy "Public Select Guests" on public.guests for select using (true);
create policy "Public Insert Guests" on public.guests for insert with check (true);
create policy "Public Delete Guests" on public.guests for delete using (true);

-- Opcional: permite actualización si algún día se quiere editar invitado
create policy "Public Update Guests" on public.guests for update using (true);

