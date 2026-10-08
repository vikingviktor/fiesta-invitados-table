import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Row {
  id: string;
  nombre: string;
  plus_one: boolean;
  nombre_acompanante: string | null;
}
interface Pago { guest_id: string; importe: number; nota: string | null }

const fmt = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

const PagosTab: React.FC = () => {
  const [guests, setGuests] = useState<Row[]>([]);
  const [pagos, setPagos] = useState<Record<string, Pago>>({});
  const [drafts, setDrafts] = useState<Record<string, { importe: string; nota: string }>>({});
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [g, p] = await Promise.all([
      supabase.from("guests").select("id,nombre,plus_one,nombre_acompanante").order("nombre"),
      (supabase as any).from("guest_payments").select("guest_id,importe,nota"),
    ]);
    setGuests((g.data as Row[]) ?? []);
    const map: Record<string, Pago> = {};
    ((p.data as Pago[]) ?? []).forEach((x) => (map[x.guest_id] = { ...x, importe: Number(x.importe) }));
    setPagos(map);
    setDrafts({});
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const draftOf = (id: string) =>
    drafts[id] ?? { importe: pagos[id] ? String(pagos[id].importe) : "", nota: pagos[id]?.nota ?? "" };

  const save = async (id: string) => {
    const d = draftOf(id);
    const importe = Number(d.importe.replace(",", ".") || 0);
    if (isNaN(importe) || importe < 0 || importe > 100000) {
      toast({ title: "Importe inválido", variant: "destructive" });
      return;
    }
    setSaving(id);
    const { error } = await (supabase as any)
      .from("guest_payments")
      .upsert({ guest_id: id, importe, nota: d.nota.trim().slice(0, 300) || null }, { onConflict: "guest_id" });
    setSaving(null);
    if (error) { toast({ title: "Error al guardar", description: error.message, variant: "destructive" }); return; }
    setPagos((p) => ({ ...p, [id]: { guest_id: id, importe, nota: d.nota.trim() || null } }));
    setDrafts((dr) => { const n = { ...dr }; delete n[id]; return n; });
    toast({ title: "Pago guardado" });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guests.filter((g) => {
      if (q && !g.nombre.toLowerCase().includes(q) && !(g.nombre_acompanante ?? "").toLowerCase().includes(q)) return false;
      const paid = (pagos[g.id]?.importe ?? 0) > 0;
      if (filtro === "pagado" && !paid) return false;
      if (filtro === "pendiente" && paid) return false;
      return true;
    });
  }, [guests, pagos, search, filtro]);

  const total = Object.values(pagos).reduce((s, p) => s + p.importe, 0);
  const totalFiltrado = filtered.reduce((s, g) => s + (pagos[g.id]?.importe ?? 0), 0);
  const numPagados = guests.filter((g) => (pagos[g.id]?.importe ?? 0) > 0).length;

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 px-2">
      <h2 className="text-2xl font-bold mb-4">Pagos</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="bg-secondary px-5 py-3 rounded shadow"><b>Total recibido:</b> {fmt(total)}</div>
        <div className="bg-secondary px-5 py-3 rounded shadow"><b>Han pagado:</b> {numPagados} de {guests.length}</div>
        {(search || filtro !== "todos") && (
          <div className="bg-secondary px-5 py-3 rounded shadow"><b>Total filtrado:</b> {fmt(totalFiltrado)}</div>
        )}
      </div>
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <Input className="max-w-xs" placeholder="Buscar por nombre o +1..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="border px-2 py-2 rounded">
          <option value="todos">Todos</option>
          <option value="pagado">Han pagado</option>
          <option value="pendiente">Sin pago</option>
        </select>
        <span className="text-sm text-muted-foreground">{filtered.length} de {guests.length} invitados</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-background border rounded-lg shadow-md text-left">
          <thead>
            <tr>
              <th className="p-3 border-b">Nombre</th>
              <th className="p-3 border-b">+1</th>
              <th className="p-3 border-b">Importe pagado (€)</th>
              <th className="p-3 border-b">Nota</th>
              <th className="p-3 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-5 text-center">Cargando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="p-5 text-center">Sin resultados.</td></tr>
            ) : filtered.map((g) => {
              const d = draftOf(g.id);
              const dirty = !!drafts[g.id];
              return (
                <tr key={g.id} className="border-b">
                  <td className="p-3">{g.nombre}</td>
                  <td className="p-3">{g.plus_one ? (g.nombre_acompanante || "Sí") : "-"}</td>
                  <td className="p-3">
                    <Input type="text" inputMode="decimal" className="w-28" value={d.importe} placeholder="0"
                      onChange={(e) => setDrafts((x) => ({ ...x, [g.id]: { ...d, importe: e.target.value } }))}
                      onKeyDown={(e) => e.key === "Enter" && save(g.id)} />
                  </td>
                  <td className="p-3">
                    <Input className="min-w-[160px]" value={d.nota} maxLength={300} placeholder="Bizum, transferencia..."
                      onChange={(e) => setDrafts((x) => ({ ...x, [g.id]: { ...d, nota: e.target.value } }))}
                      onKeyDown={(e) => e.key === "Enter" && save(g.id)} />
                  </td>
                  <td className="p-3">
                    <Button size="sm" disabled={!dirty || saving === g.id} onClick={() => save(g.id)}>
                      {saving === g.id ? "..." : "Guardar"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PagosTab;
