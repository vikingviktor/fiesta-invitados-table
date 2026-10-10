import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const db = supabase as any;

export const DIET_TAGS = [
  { key: "celiaco", label: "Celíaco" },
  { key: "vegetariano", label: "Vegetariano" },
  { key: "vegano", label: "Vegano" },
  { key: "otro", label: "Otro" },
] as const;

export const esVeg = (tags: string[]) => tags.includes("vegetariano") || tags.includes("vegano");

interface Plato { curso: string; plato: string; plato_vegetariano: string | null; orden: number }
interface GMenu { guest_id: string; is_plus_one: boolean; tags: string[]; otro: string | null; con_jamon: boolean }
interface Guest { id: string; nombre: string; plus_one: boolean; nombre_acompanante: string | null; menu: string; menu_acompanante: string | null }
interface Persona { key: string; guestId: string; isPlusOne: boolean; nombre: string; titular?: string; menuRsvp: string | null }

const CURSO_LABEL: Record<string, string> = { cocktail: "Cocktail", primero: "Primer plato", segundo: "Segundo plato", postre: "Postre" };

const inferTags = (menu: string | null): string[] => {
  const m = (menu ?? "").toLowerCase();
  const t: string[] = [];
  if (m.includes("vegan")) t.push("vegano");
  else if (m.includes("vegetar")) t.push("vegetariano");
  if (m.includes("celia") || m.includes("gluten")) t.push("celiaco");
  return t;
};

const MenusTab: React.FC = () => {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [platoDraft, setPlatoDraft] = useState<Record<string, { plato: string; veg: string }>>({});
  const [guests, setGuests] = useState<Guest[]>([]);
  const [menus, setMenus] = useState<Record<string, GMenu>>({});
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const fetchAll = useCallback(async () => {
    const [p, g, m] = await Promise.all([
      db.from("menu_platos").select("*").order("orden"),
      supabase.from("guests").select("id,nombre,plus_one,nombre_acompanante,menu,menu_acompanante").order("nombre"),
      db.from("guest_menus").select("guest_id,is_plus_one,tags,otro,con_jamon"),
    ]);
    setPlatos(p.data ?? []);
    setGuests((g.data as Guest[]) ?? []);
    const map: Record<string, GMenu> = {};
    ((m.data as GMenu[]) ?? []).forEach((x) => (map[`${x.guest_id}:${x.is_plus_one}`] = x));
    setMenus(map);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const personas: Persona[] = useMemo(() => {
    const out: Persona[] = [];
    guests.forEach((g) => {
      out.push({ key: `${g.id}:false`, guestId: g.id, isPlusOne: false, nombre: g.nombre, menuRsvp: g.menu });
      if (g.plus_one) out.push({ key: `${g.id}:true`, guestId: g.id, isPlusOne: true, nombre: g.nombre_acompanante || `+1 de ${g.nombre}`, titular: g.nombre, menuRsvp: g.menu_acompanante });
    });
    return out;
  }, [guests]);

  const menuOf = (p: Persona): GMenu =>
    menus[p.key] ?? { guest_id: p.guestId, is_plus_one: p.isPlusOne, tags: inferTags(p.menuRsvp), otro: null, con_jamon: false };

  const saveMenu = async (p: Persona, patch: Partial<GMenu>) => {
    const next = { ...menuOf(p), ...patch };
    if (!esVeg(next.tags)) next.con_jamon = false;
    if (!next.tags.includes("otro")) next.otro = null;
    setMenus((s) => ({ ...s, [p.key]: next }));
    const { error } = await db.from("guest_menus").upsert(
      { guest_id: next.guest_id, is_plus_one: next.is_plus_one, tags: next.tags, otro: next.otro?.trim().slice(0, 200) || null, con_jamon: next.con_jamon },
      { onConflict: "guest_id,is_plus_one" },
    );
    if (error) { toast({ title: "Error al guardar", description: error.message, variant: "destructive" }); fetchAll(); }
  };

  const toggleTag = (p: Persona, tag: string) => {
    const cur = menuOf(p).tags;
    saveMenu(p, { tags: cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag] });
  };

  const savePlato = async (pl: Plato) => {
    const d = platoDraft[pl.curso];
    if (!d) return;
    const plato = d.plato.trim().slice(0, 100);
    if (!plato) { toast({ title: "El plato no puede estar vacío", variant: "destructive" }); return; }
    const { error } = await db.from("menu_platos").update({ plato, plato_vegetariano: d.veg.trim().slice(0, 100) || null }).eq("curso", pl.curso);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Plato guardado" }); setPlatoDraft((s) => { const n = { ...s }; delete n[pl.curso]; return n; }); fetchAll(); }
  };

  const platoFor = (pl: Plato, tags: string[]) => (esVeg(tags) && pl.plato_vegetariano ? pl.plato_vegetariano : pl.plato);

  const filtered = personas.filter((p) => {
    const q = search.trim().toLowerCase();
    if (q && !p.nombre.toLowerCase().includes(q) && !(p.titular ?? "").toLowerCase().includes(q)) return false;
    const m = menuOf(p);
    if (filtro === "sin") return m.tags.length === 0;
    if (filtro === "jamon") return m.con_jamon;
    if (filtro !== "todos") return m.tags.includes(filtro);
    return true;
  });

  const resumen = useMemo(() => {
    const tagCount: Record<string, number> = {};
    const platoCount: Record<string, Record<string, number>> = {};
    let jamon = 0;
    personas.forEach((p) => {
      const m = menuOf(p);
      m.tags.forEach((t) => (tagCount[t] = (tagCount[t] ?? 0) + 1));
      if (m.con_jamon) jamon++;
      platos.forEach((pl) => {
        const name = platoFor(pl, m.tags);
        platoCount[pl.curso] ??= {};
        platoCount[pl.curso][name] = (platoCount[pl.curso][name] ?? 0) + 1;
      });
    });
    return { tagCount, platoCount, jamon };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personas, menus, platos]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-card p-4">
        <h3 className="text-lg mb-3">Platos del menú</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {platos.map((pl) => {
            const d = platoDraft[pl.curso] ?? { plato: pl.plato, veg: pl.plato_vegetariano ?? "" };
            const set = (patch: Partial<typeof d>) => setPlatoDraft((s) => ({ ...s, [pl.curso]: { ...d, ...patch } }));
            return (
              <div key={pl.curso} className="rounded border p-3 space-y-2">
                <div className="text-sm text-muted-foreground">{CURSO_LABEL[pl.curso] ?? pl.curso}</div>
                <Input value={d.plato} onChange={(e) => set({ plato: e.target.value })} placeholder="Plato" />
                <Input value={d.veg} onChange={(e) => set({ veg: e.target.value })} placeholder="Alternativa vegetariana/vegana (opcional)" />
                {platoDraft[pl.curso] && <Button size="sm" onClick={() => savePlato(pl)}>Guardar</Button>}
                <div className="flex flex-wrap gap-2 pt-1 text-xs">
                  {Object.entries(resumen.platoCount[pl.curso] ?? {}).map(([n, c]) => (
                    <span key={n} className="rounded-full bg-muted px-2 py-0.5">{n}: {c}</span>
                  ))}
                  {pl.curso === "primero" && <span className="rounded-full bg-muted px-2 py-0.5">Veg. con jamón: {resumen.jamon}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-muted px-3 py-1">Personas: {personas.length}</span>
          {DIET_TAGS.map((t) => (
            <span key={t.key} className="rounded-full bg-muted px-3 py-1">{t.label}: {resumen.tagCount[t.key] ?? 0}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Input className="max-w-xs" placeholder="Buscar por nombre o +1" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="rounded-md border bg-background px-3 text-sm" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todos">Todos</option>
            {DIET_TAGS.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
            <option value="jamon">Con jamón</option>
            <option value="sin">Sin etiquetas</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-2">Persona</th>
                <th className="p-2">Menú RSVP</th>
                <th className="p-2">Etiquetas</th>
                <th className="p-2">Jamón en 1º</th>
                {platos.map((pl) => <th key={pl.curso} className="p-2">{CURSO_LABEL[pl.curso] ?? pl.curso}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const m = menuOf(p);
                const veg = esVeg(m.tags);
                return (
                  <tr key={p.key} className="border-t align-top">
                    <td className="p-2">
                      {p.nombre}
                      {p.titular && <div className="text-xs text-muted-foreground">+1 de {p.titular}</div>}
                    </td>
                    <td className="p-2 text-muted-foreground">{p.menuRsvp || "—"}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {DIET_TAGS.map((t) => {
                          const on = m.tags.includes(t.key);
                          return (
                            <button key={t.key} type="button" onClick={() => toggleTag(p, t.key)}
                              className={`rounded-full border px-2 py-0.5 text-xs ${on ? "bg-primary text-primary-foreground border-primary" : "bg-background"}`}>
                              {t.label}
                            </button>
                          );
                        })}
                      </div>
                      {m.tags.includes("otro") && (
                        <Input className="mt-1 h-8" defaultValue={m.otro ?? ""} placeholder="Escribe la restricción"
                          onBlur={(e) => e.target.value !== (m.otro ?? "") && saveMenu(p, { otro: e.target.value })} />
                      )}
                    </td>
                    <td className="p-2">
                      {veg ? (
                        <input type="checkbox" checked={m.con_jamon} onChange={(e) => saveMenu(p, { con_jamon: e.target.checked })} />
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                    {platos.map((pl) => (
                      <td key={pl.curso} className="p-2">
                        {platoFor(pl, m.tags)}
                        {pl.curso === "primero" && m.con_jamon && " + jamón"}
                        {pl.curso === "primero" && veg && !m.con_jamon && " (sin jamón)"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MenusTab;
