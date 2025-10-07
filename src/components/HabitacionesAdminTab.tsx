import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/types/guestTypes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type GuestWithHabitacion = Guest & { habitacion?: string | null };

function mapDbGuestToGuestWithHabitacion(dbGuest: any): GuestWithHabitacion {
  return {
    id: dbGuest.id,
    nombre: dbGuest.nombre,
    plusOne: dbGuest.plus_one,
    nombreAcompanante: dbGuest.nombre_acompanante ?? "",
    menu: dbGuest.menu,
    comentario: dbGuest.comentario ?? "",
    date: dbGuest.date,
    cancionFavorita: dbGuest.cancion_favorita ?? "",
    consentimientoPublicacion: !!dbGuest.consentimiento_publicacion,
    menuAcompanante: dbGuest.menu_acompanante ?? undefined,
    color: dbGuest.color ?? undefined,
    colorAcompanante: dbGuest.color_acompanante ?? undefined,
    habitacion: dbGuest.habitacion ?? null,
  };
}

const HabitacionesAdminTab: React.FC = () => {
  const [guests, setGuests] = useState<GuestWithHabitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  const fetchAllGuests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      toast.error("Error al cargar invitados");
      console.error(error);
    } else {
      const mapped = (data ?? []).map(mapDbGuestToGuestWithHabitacion);
      setGuests(mapped);
      const initialValues: Record<string, string> = {};
      mapped.forEach((g) => {
        initialValues[g.id] = g.habitacion ?? "";
      });
      setValues(initialValues);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllGuests();
  }, []);

  const handleHabitacionChange = (guest: GuestWithHabitacion, value: string) => {
    setValues((prev) => ({ ...prev, [guest.id]: value }));
  };

  const handleAssign = async (guest: GuestWithHabitacion) => {
    setSavingId(guest.id);
    const newHabitacion = values[guest.id] || null;

    const { error } = await supabase
      .from("guests")
      .update({ habitacion: newHabitacion })
      .eq("id", guest.id);

    if (error) {
      toast.error("Error al asignar habitación");
      console.error(error);
    } else {
      toast.success(`Habitación asignada a ${guest.nombre}`);
      await fetchAllGuests();
    }
    setSavingId(null);
  };

  const getGuestsByHabitacion = () => {
    const grouped: Record<string, GuestWithHabitacion[]> = {};
    guests.forEach((g) => {
      const hab = g.habitacion || "Sin asignar";
      if (!grouped[hab]) grouped[hab] = [];
      grouped[hab].push(g);
    });
    return grouped;
  };

  const groupedGuests = getGuestsByHabitacion();
  const habitaciones = Object.keys(groupedGuests).sort();

  return (
    <div className="px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Gestión de Habitaciones</h2>
        <p className="text-sm text-gray-600 mb-4">
          Asigna habitaciones específicas a los invitados que se quedarán en la finca.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {habitaciones.map((hab) => (
            <div key={hab} className="p-4 bg-blue-50 rounded border">
              <h3 className="font-semibold mb-1">{hab}</h3>
              <p className="text-sm text-gray-600">
                {groupedGuests[hab].length} invitado(s)
              </p>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando invitados...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Plus One</TableHead>
              <TableHead>Habitación Actual</TableHead>
              <TableHead>Nueva Habitación</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>{guest.nombre}</TableCell>
                <TableCell>
                  {guest.plusOne
                    ? `Sí (${guest.nombreAcompanante || "Sin nombre"})`
                    : "No"}
                </TableCell>
                <TableCell>
                  {guest.habitacion || (
                    <span className="text-gray-400 italic">Sin asignar</span>
                  )}
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    placeholder="Ej: Individual 1, Doble 2"
                    value={values[guest.id] ?? ""}
                    onChange={(e) => handleHabitacionChange(guest, e.target.value)}
                    className="max-w-[200px]"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => handleAssign(guest)}
                    disabled={savingId === guest.id}
                  >
                    {savingId === guest.id ? "Guardando..." : "Asignar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default HabitacionesAdminTab;
