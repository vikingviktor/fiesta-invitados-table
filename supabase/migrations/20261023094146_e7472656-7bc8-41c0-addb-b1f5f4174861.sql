WITH people AS (
 SELECT id, nombre AS name, false AS plus_one FROM public.guests
 UNION ALL SELECT id, nombre_acompanante, true FROM public.guests WHERE plus_one AND nullif(trim(nombre_acompanante),'') IS NOT NULL
), unique_people AS (
 SELECT lower(translate(trim(name),'áéíóúüñÁÉÍÓÚÜÑ','aeiouunAEIOUUN')) AS normalized, (array_agg(id))[1] AS id, bool_or(plus_one) AS plus_one
 FROM people GROUP BY lower(translate(trim(name),'áéíóúüñÁÉÍÓÚÜÑ','aeiouunAEIOUUN')) HAVING count(*)=1
), rebuilt AS (
 SELECT p.id, jsonb_agg(t.value || jsonb_build_object('seats', (SELECT jsonb_agg(CASE WHEN u.id IS NOT NULL AND s.value->>'guestId' IS NULL THEN s.value || jsonb_build_object('guestId', u.id, 'plusOne', u.plus_one) ELSE s.value END ORDER BY s.ord) FROM jsonb_array_elements(t.value->'seats') WITH ORDINALITY s(value,ord) LEFT JOIN unique_people u ON u.normalized=lower(translate(trim(s.value->>'name'),'áéíóúüñÁÉÍÓÚÜÑ','aeiouunAEIOUUN')))) ORDER BY t.ord) AS layout
 FROM public.wedding_seating_plan p, jsonb_array_elements(p.layout) WITH ORDINALITY t(value,ord) WHERE p.id='official' GROUP BY p.id
)
UPDATE public.wedding_seating_plan p SET layout=r.layout, revision=p.revision+1, updated_at=now() FROM rebuilt r WHERE p.id=r.id AND p.layout IS DISTINCT FROM r.layout;
INSERT INTO public.wedding_seating_plan (id,layout,revision) VALUES ('grid', '{"width":30,"height":20,"positions":{}}'::jsonb,0) ON CONFLICT (id) DO NOTHING;