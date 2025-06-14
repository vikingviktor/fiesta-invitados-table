import React, { useState } from "react";
import { Guest, MenuOption } from "@/types/guest";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const menuTranslation: Record<MenuOption, string> = {
  normal: "Normal",
  vegetariano: "Vegetariano",
  vegano: "Vegano",
  "sin gluten": "Sin gluten",
};

const mesas = Array.from({ length: 11 }, (_, i) => i + 1);

const GuestTable: React.FC<{
  guests: Guest[];
  loading: boolean;
  fetchGuests: () => void;
  fetchDeletedGuests: () => void;
}> = ({ guests, loading, fetchGuests, fetchDeletedGuests }) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [mesaValues, setMesaValues] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  // Contadores por menú
  const counts = guests.reduce(
    (acc, g) => {
      acc["total"] += 1 + (g.plusOne ? 1 : 0);
      acc[g.menu] = (acc[g.menu] || 0) + 1 + (g.plusOne ? 1 : 0);
      return acc;
    },
    { total: 0, normal: 0, vegetariano: 0, vegano: 0, "sin gluten": 0 } as Record<string, number>
  );

  // Asignar mesa
  const handleMesaSelect = (guestId: string, value: string) => {
    setMesaValues((v) => ({ ...v, [guestId]: value }));
  };

  const handleAssignMesa = async (guest: Guest) => {
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
      // Prevenir valores null o indefinidos en campos obligatorios
      const plus_one_correct = typeof guest.plusOne === "boolean" ? guest.plusOne : false;
      // Insertar en deleted_guests con nuevo UUID v4
      const res = await supabase.from("deleted_guests").insert({
        id: generateUUIDv4(),
        nombre: guest.nombre ?? "",
        plus_one: plus_one_correct,
        menu: guest.menu,
        comentario: guest.comentario ?? "",
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
      // Refrescar ambas tablas!
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
              <th className="p-3 border-b">Fecha registro</th>
              <th className="p-3 border-b">Mesa</th>
              <th className="p-3 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center p-5">Cargando...</td>
              </tr>
            ) : guests.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-5">Aún no hay invitados registrados.</td>
              </tr>
            ) : (
              guests.map((g) => {
                // Parse mesa:
                let mesaValueInDB: string | undefined =
                  typeof (g as any).mesa === "number" && (g as any).mesa >= 1 && (g as any).mesa <= 11
                    ? String((g as any).mesa)
                    : undefined;

                // The displayed value is either local select, or DB value, or undefined (for placeholder)
                const selectValue = 
                  mesaValues[g.id] !== undefined && mesaValues[g.id] !== ""
                    ? mesaValues[g.id]
                    : mesaValueInDB;

                return (
                  <tr key={g.id} className="hover:bg-secondary/50">
                    <td className="p-3 border-b">{g.nombre}</td>
                    <td className="p-3 border-b text-center">{g.plusOne ? "Sí" : "No"}</td>
                    <td className="p-3 border-b">
                      {(g.plusOne && g.nombreAcompanante) ? g.nombreAcompanante : (g.plusOne ? "Sin nombre" : "-")}
                    </td>
                    <td className="p-3 border-b">{menuTranslation[g.menu]}</td>
                    <td className="p-3 border-b">{g.comentario || "-"}</td>
                    <td className="p-3 border-b text-xs">{new Date(g.date).toLocaleString()}</td>
                    <td className="p-3 border-b">
                      <div className="flex items-center gap-2">
                        <Select
                          value={selectValue}
                          onValueChange={val => handleMesaSelect(g.id, val)}
                        >
                          <SelectTrigger className="w-24" aria-label="Mesa">
                            <SelectValue placeholder="Sin mesa" />
                          </SelectTrigger>
                          <SelectContent>
                            {mesas.map((mesaNum) => (
                              <SelectItem value={String(mesaNum)} key={mesaNum}>
                                Mesa {mesaNum}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAssignMesa(g)}
                          disabled={
                            savingId === g.id ||
                            mesaValues[g.id] === undefined ||
                            mesaValues[g.id] === ""
                          }
                        >
                          {savingId === g.id ? "Guardando..." : "Asignar"}
                        </Button>
                      </div>
                    </td>
                    <td className="p-3 border-b">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(g.id)}
                        disabled={loadingDelete}
                      >
                        Borrar
                      </Button>
                      {/* Modal de confirmación */}
                      {deleteId === g.id && (
                        <div className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center">
                          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                            <div className="mb-4">
                              <h3 className="font-semibold text-lg mb-2">¿Borrar invitado?</h3>
                              <div className="text-gray-700">
                                ¿Seguro que quieres borrar a <span className="font-bold">{g.nombre}</span>?<br />
                                Este registro se archivará como eliminado.
                              </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                              <Button
                                variant="secondary"
                                onClick={() => setDeleteId(null)}
                                disabled={loadingDelete}
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(g.id)}
                                disabled={loadingDelete}
                              >
                                {loadingDelete ? "Eliminando..." : "Borrar"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestTable;
