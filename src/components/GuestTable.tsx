
import React, { useState } from "react";
import { Guest, MenuOption } from "@/types/guestTypes";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import GuestTableRow from "./GuestTableRow";
import { mapDbGuestToGuest, getGuestMenuCounts, menuTranslation } from "@/utils/guestUtils";

const mesas = Array.from({ length: 11 }, (_, i) => i + 1);

const GuestTable: React.FC<{
  guests: (Guest & { mesa?: number | null })[];
  loading: boolean;
  fetchGuests: () => void;
  fetchDeletedGuests: () => void;
}> = ({ guests, loading, fetchGuests, fetchDeletedGuests }) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [mesaValues, setMesaValues] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  // Usar función utilitaria para los contadores del menú
  const counts = getGuestMenuCounts(guests);

  // Asignar mesa
  const handleMesaSelect = (guestId: string, value: string) => {
    setMesaValues((v) => ({ ...v, [guestId]: value }));
  };

  const handleAssignMesa = async (guest: Guest & { mesa?: number | null }) => {
    const mesaNumber = Number(mesaValues[guest.id]);
    if (isNaN(mesaNumber) || mesaNumber < 1 || mesaNumber > 11) {
      toast({
        title: "Número de mesa inválido",
        description: "Por favor, selecciona un número entre 1 y 11.",
        variant: "destructive",
      });
      return;
    }
    setSavingId(guest.id);
    const { error } = await supabase
      .from("guests")
      .update({ mesa: mesaNumber })
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
        description: `Mesa ${mesaNumber} asignada correctamente.`,
      });
      setMesaValues((v) => ({ ...v, [guest.id]: "" }));
      await fetchGuests();
    }
    setSavingId(null);
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
      <div className="flex gap-6 mb-4 flex-wrap">
        <div className="bg-secondary px-5 py-3 rounded shadow">
          <b>Total de comensales:</b> {counts.total}
        </div>
        {["normal", "vegetariano", "vegano", "sin gluten"].map((k) => (
          <div className="bg-secondary px-5 py-3 rounded shadow" key={k}>
            <b>{menuTranslation[k]}:</b> {counts[k]}
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-background border rounded-lg shadow-md text-left">
          <thead>
            <tr>
              <th className="p-3 border-b">Nombre</th>
              <th className="p-3 border-b">+1</th>
              <th className="p-3 border-b">Nombre de acompañante</th>
              <th className="p-3 border-b">Menú</th>
              <th className="p-3 border-b">Comentarios</th>
              <th className="p-3 border-b">Canción favorita</th>
              <th className="p-3 border-b">Fecha registro</th>
              <th className="p-3 border-b">Mesa</th>
              <th className="p-3 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center p-5">Cargando...</td>
              </tr>
            ) : guests.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-5">Aún no hay invitados registrados.</td>
              </tr>
            ) : (
              guests.map(g => (
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
