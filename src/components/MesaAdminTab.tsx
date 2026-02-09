import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Guest } from "@/types/guestTypes"; // Usar SIEMPRE guestTypes

type GuestWithMesa = Guest & { mesa?: number | null };

const mesas = Array.from({ length: 11 }, (_, i) => i + 1);

// Helper to map DB fields into GuestWithMesa (snake_case to camelCase)
function mapDbGuestToGuestWithMesa(dbGuest: any): GuestWithMesa {
  return {
    id: dbGuest.id,
    nombre: dbGuest.nombre,
    plusOne: dbGuest.plus_one,
    nombreAcompanante: dbGuest.nombre_acompanante ?? "",
    menu: dbGuest.menu,
    comentario: dbGuest.comentario ?? "",
    date: dbGuest.date,
    mesa: dbGuest.mesa ?? null,
    consentimientoPublicacion: !!dbGuest.consentimiento_publicacion, // Para coherencia con el modelo actual
    cancionFavorita: dbGuest.cancion_favorita ?? "",
    menuAcompanante: dbGuest.menu_acompanante ?? undefined,
    conNinos: !!dbGuest.con_ninos,
    pernoctaSabado: !!dbGuest.pernocta_sabado,
  };
}

// Función para contar personas en la mesa seleccionada
function countPeopleInMesa(guests: GuestWithMesa[]): number {
  // Cada Invitado vale 2 si plusOne, 1 si no
  return guests.reduce((total, g) => total + (g.plusOne ? 2 : 1), 0);
}

const MesaAdminTab: React.FC = () => {
  const [selectedMesa, setSelectedMesa] = useState<number>(1);
  const [guests, setGuests] = useState<GuestWithMesa[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<null|string>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  const fetchGuestsByMesa = async (mesa: number) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("mesa", mesa)
      .order("nombre", { ascending: true });

    // Map DB fields to TS types
    const typedGuests: GuestWithMesa[] = (data ?? []).map(mapDbGuestToGuestWithMesa);
    setGuests(typedGuests);
    setLoading(false);
  };

  useEffect(() => {
    fetchGuestsByMesa(selectedMesa);
    // eslint-disable-next-line
  }, [selectedMesa]);

  const handleMesaChange = (guest: GuestWithMesa, value: string) => {
    setValues((v) => ({ ...v, [guest.id]: value }));
  };

  const handleAssign = async (guest: GuestWithMesa) => {
    setSavingId(guest.id);
    const mesaValue = Number(values[guest.id] ?? guest.mesa ?? "");
    if (isNaN(mesaValue) || mesaValue < 1 || mesaValue > 11) {
      toast({
        title: "Número de mesa inválido",
        description: "Por favor, asigna un número de mesa entre 1 y 11.",
        variant: "destructive",
      });
      setSavingId(null);
      return;
    }
    const { error } = await supabase
      .from("guests")
      .update({ mesa: mesaValue })
      .eq("id", guest.id);
    if (error) {
      toast({
        title: "Error al asignar mesa",
        description: "Ocurrió un error al guardar.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Mesa asignada",
        description: "Mesa asignada correctamente.",
      });
      setValues((v) => ({ ...v, [guest.id]: "" }));
      fetchGuestsByMesa(selectedMesa);
    }
    setSavingId(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-bold text-xl">Asignar invitados por mesa</h2>
        <div className="flex items-center gap-2">
          <label className="mr-2 font-medium">Mesa:</label>
          <select
            className="border rounded px-2 py-1 bg-background text-foreground"
            value={selectedMesa}
            onChange={e => setSelectedMesa(Number(e.target.value))}
          >
            {mesas.map(m => (
              <option key={m} value={m}>Mesa {m}</option>
            ))}
          </select>
          {/* Contador de personas en la mesa */}
          <span className="ml-2 text-xs bg-accent px-2 py-1 rounded font-mono text-accent-foreground">
            {countPeopleInMesa(guests)} persona{countPeopleInMesa(guests) !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="p-4 text-center">Cargando invitados...</div>
      ) : guests.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No hay nadie asignado aún a la mesa seleccionada.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Acompañante</TableHead>
                <TableHead>Menú</TableHead>
                <TableHead>Mesa asignada</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map(g => (
                <TableRow key={g.id}>
                  <TableCell>{g.nombre}</TableCell>
                  <TableCell>{g.plusOne ? g.nombreAcompanante || "Sin nombre" : "-"}</TableCell>
                  <TableCell>{g.menu}</TableCell>
                  <TableCell>
                    <Input
                      className="w-16"
                      type="number"
                      min={1}
                      max={11}
                      value={values[g.id] ?? (g.mesa ?? "")}
                      onChange={e => handleMesaChange(g, e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleAssign(g)}
                      disabled={savingId === g.id}
                    >
                      {savingId === g.id ? "Guardando..." : "Guardar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MesaAdminTab;
