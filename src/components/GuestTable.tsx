
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Guest, MenuOption } from "@/types/guestTypes";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import GuestTableRow from "./GuestTableRow";
import { mapDbGuestToGuest, getGuestMenuCounts, menuTranslation } from "@/utils/guestUtils";



const consentimientoOptions = [
  { label: "Todos", value: "todos" },
  { label: "Sólo con consentimiento", value: "con" },
  { label: "Sólo sin consentimiento", value: "sin" },
];

const ninosOptions = [
  { label: "Todos", value: "todos" },
  { label: "Con niños", value: "con" },
  { label: "Sin niños", value: "sin" },
];

const pernoctaOptions = [
  { label: "Todos", value: "todos" },
  { label: "Pernoctan", value: "si" },
  { label: "No pernoctan", value: "no" },
];

const menuFilterOptions = [
  { label: "Todos", value: "todos" },
  { label: "Normal", value: "normal" },
  { label: "Vegetariano", value: "vegetariano" },
  { label: "Vegano", value: "vegano" },
  { label: "Sin gluten", value: "sin gluten" },
  { label: "Otro", value: "otro" },
];

const GuestTable: React.FC<{
  guests: (Guest & { mesa?: string | null })[];
  loading: boolean;
  fetchGuests: () => void;
  fetchDeletedGuests: () => void;
}> = ({ guests, loading, fetchGuests, fetchDeletedGuests }) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [mesaValues, setMesaValues] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [consentimientoFilter, setConsentimientoFilter] = useState("todos");
  const [consentSavingId, setConsentSavingId] = useState<string | null>(null);
  const [ninosFilter, setNinosFilter] = useState("todos");
  const [pernoctaFilter, setPernoctaFilter] = useState("todos");
  const [menuFilter, setMenuFilter] = useState("todos");

  // Refs for dual scrollbar sync
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [tableWidth, setTableWidth] = useState(0);

  const syncScroll = useCallback((source: 'top' | 'bottom') => {
    if (source === 'top' && topScrollRef.current && bottomScrollRef.current) {
      bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    } else if (source === 'bottom' && topScrollRef.current && bottomScrollRef.current) {
      topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft;
    }
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (tableRef.current) {
        setTableWidth(tableRef.current.scrollWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    if (tableRef.current) observer.observe(tableRef.current);
    return () => observer.disconnect();
  }, [guests, loading]);

  // Usar función utilitaria para los contadores del menú
  const counts = getGuestMenuCounts(guests);

  // Filtro de consentimiento
  const filterGuests = (guests: (Guest & { mesa?: string | null })[]) => {
    let filtered = guests;
    if (consentimientoFilter === "con") {
      filtered = filtered.filter(g => g.consentimientoPublicacion);
    } else if (consentimientoFilter === "sin") {
      filtered = filtered.filter(g => !g.consentimientoPublicacion);
    }
    if (ninosFilter === "con") {
      filtered = filtered.filter(g => g.conNinos);
    } else if (ninosFilter === "sin") {
      filtered = filtered.filter(g => !g.conNinos);
    }
    if (pernoctaFilter === "si") {
      filtered = filtered.filter(g => g.pernoctaSabado);
    } else if (pernoctaFilter === "no") {
      filtered = filtered.filter(g => !g.pernoctaSabado);
    }
    if (menuFilter !== "todos") {
      filtered = filtered.filter(g => g.menu === menuFilter || (g.plusOne && (g.menuAcompanante || g.menu) === menuFilter));
    }
    return filtered;
  };

  // Asignar mesa
  const handleMesaSelect = (guestId: string, value: string) => {
    setMesaValues((v) => ({ ...v, [guestId]: value }));
  };

  const handleAssignMesa = async (guest: Guest & { mesa?: string | null }) => {
    const mesaName = mesaValues[guest.id];
    if (!mesaName) {
      toast({
        title: "Mesa no seleccionada",
        description: "Por favor, selecciona una mesa.",
        variant: "destructive",
      });
      return;
    }
    setSavingId(guest.id);
    const { error } = await supabase
      .from("guests")
      .update({ mesa: mesaName })
      .eq("id", guest.id);
    if (error) {
      toast({
        title: "Error al asignar mesa",
        description: "No se pudo actualizar la mesa para el invitado.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Mesa asignada",
        description: `${mesaName} asignada correctamente.`,
      });
      setMesaValues((v) => ({ ...v, [guest.id]: "" }));
      await fetchGuests();
    }
    setSavingId(null);
  };

  // CAMBIO: Manejar cambio de consentimiento en línea
  const handleConsentimientoChange = async (guestId: string, value: boolean) => {
    setConsentSavingId(guestId);
    const { error } = await supabase
      .from("guests")
      .update({ consentimiento_publicacion: value })
      .eq("id", guestId);
    if (error) {
      toast({
        title: "Error al actualizar el consentimiento",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Consentimiento actualizado",
        description: value ? "El invitado ahora DA consentimiento." : "El invitado ahora NO da consentimiento.",
      });
      await fetchGuests();
    }
    setConsentSavingId(null);
  };

  // Eliminar invitado: pasa a Supabase (deleted_guests) y borra de guests
  async function handleDelete(id: string) {
    setLoadingDelete(true);
    try {
      const guest = guests.find(g => g.id === id);
      if (!guest) {
        alert("Invitado no encontrado.");
        setLoadingDelete(false);
        return;
      }
      const plus_one_correct = typeof guest.plusOne === "boolean" ? guest.plusOne : false;
      // Insertar en deleted_guests con nuevo UUID v4
      const res = await supabase.from("deleted_guests").insert({
        id: generateUUIDv4(),
        nombre: guest.nombre ?? "",
        plus_one: plus_one_correct,
        menu: guest.menu,
        comentario: guest.comentario ?? "",
        cancion_favorita: guest.cancionFavorita ?? null,
        date: guest.date,
      });
      if (res.error) {
        alert("Error al mover el invitado eliminado a Supabase: " + res.error.message);
        setLoadingDelete(false);
        return;
      }
      // Eliminar invitado de la tabla guests
      const { error: delError } = await supabase.from("guests").delete().eq("id", id);
      if (delError) {
        alert("Error al eliminar invitado: " + delError.message);
        setLoadingDelete(false);
        return;
      }
      setDeleteId(null);
      await fetchGuests();
      await fetchDeletedGuests();
    } finally {
      setLoadingDelete(false);
    }
  }

  function generateUUIDv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 px-2">
      <h2 className="text-2xl font-bold mb-4">Invitados registrados</h2>
      <div className="flex flex-wrap gap-4 justify-between items-end mb-4">
        <div className="flex gap-6 flex-wrap">
          <div className="bg-secondary px-5 py-3 rounded shadow">
            <b>Total de comensales:</b> {counts.total}
          </div>
          {["normal", "vegetariano", "vegano", "sin gluten", "otro"].map((k) => (
            <div className="bg-secondary px-5 py-3 rounded shadow" key={k}>
              <b>{menuTranslation[k]}:</b> {counts[k]}
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-semibold" htmlFor="consentimiento-filter">Consentimiento:</label>
          <select
            id="consentimiento-filter"
            value={consentimientoFilter}
            onChange={e => setConsentimientoFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {consentimientoOptions.map(opt =>
              <option value={opt.value} key={opt.value}>{opt.label}</option>
            )}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-semibold" htmlFor="menu-filter">Menú:</label>
          <select
            id="menu-filter"
            value={menuFilter}
            onChange={e => setMenuFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {menuFilterOptions.map(opt =>
              <option value={opt.value} key={opt.value}>{opt.label}</option>
            )}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-semibold" htmlFor="ninos-filter">Niños:</label>
          <select
            id="ninos-filter"
            value={ninosFilter}
            onChange={e => setNinosFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {ninosOptions.map(opt =>
              <option value={opt.value} key={opt.value}>{opt.label}</option>
            )}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-semibold" htmlFor="pernocta-filter">Pernocta:</label>
          <select
            id="pernocta-filter"
            value={pernoctaFilter}
            onChange={e => setPernoctaFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {pernoctaOptions.map(opt =>
              <option value={opt.value} key={opt.value}>{opt.label}</option>
            )}
          </select>
        </div>
      </div>
      {/* Top scrollbar */}
      <div
        ref={topScrollRef}
        onScroll={() => syncScroll('top')}
        className="overflow-x-auto"
        style={{ height: '20px' }}
      >
        <div style={{ width: tableWidth, height: '1px' }} />
      </div>
      <div
        ref={bottomScrollRef}
        onScroll={() => syncScroll('bottom')}
        className="overflow-x-auto"
      >
        <table ref={tableRef} className="min-w-full bg-background border rounded-lg shadow-md text-left">
          <thead>
            <tr>
              <th className="p-3 border-b">Nombre</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">+1</th>
              <th className="p-3 border-b">Nombre de acompañante</th>
              <th className="p-3 border-b">Menú acompañante</th>
              <th className="p-3 border-b">Menú</th>
              <th className="p-3 border-b">Comentarios</th>
              <th className="p-3 border-b">Canción favorita</th>
              <th className="p-3 border-b">Niños</th>
              <th className="p-3 border-b">Nº niños</th>
              <th className="p-3 border-b">Comentarios niños</th>
              <th className="p-3 border-b">Pernocta</th>
              <th className="p-3 border-b">Fecha registro</th>
              <th className="p-3 border-b">Mesa</th>
              <th className="p-3 border-b">Consent.</th>
              <th className="p-3 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={16} className="text-center p-5">Cargando...</td>
              </tr>
            ) : filterGuests(guests).length === 0 ? (
              <tr>
                <td colSpan={16} className="text-center p-5">Aún no hay invitados registrados.</td>
              </tr>
            ) : (
              filterGuests(guests).map(g => (
                <GuestTableRow
                  key={g.id}
                  guest={g}
                  mesaValue={mesaValues[g.id] ?? ""}
                  savingId={savingId}
                  deleteId={deleteId}
                  loadingDelete={loadingDelete}
                  onMesaChange={handleMesaSelect}
                  onMesaSave={handleAssignMesa}
                  onDeleteClick={setDeleteId}
                  onDeleteCancel={() => setDeleteId(null)}
                  onDeleteConfirm={handleDelete}
                  onConsentChange={handleConsentimientoChange}
                  consentSavingId={consentSavingId}
                  onGuestUpdated={fetchGuests}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestTable;
