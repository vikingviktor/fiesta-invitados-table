
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Guest } from "@/types/guestTypes";
import GuestMesaSelect from "./GuestMesaSelect";

type GuestWithMesa = Guest & { mesa?: string | null };

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
    consentimientoPublicacion: !!dbGuest.consentimiento_publicacion,
    cancionFavorita: dbGuest.cancion_favorita ?? "",
    menuAcompanante: dbGuest.menu_acompanante ?? undefined,
    conNinos: !!dbGuest.con_ninos,
    pernoctaSabado: !!dbGuest.pernocta_sabado,
    email: dbGuest.email ?? undefined,
  };
}

function countPeopleInMesa(guests: GuestWithMesa[]): number {
  return guests.reduce((total, g) => total + (g.plusOne ? 2 : 1), 0);
}

const MesaAdminTab: React.FC = () => {
  const [mesaNames, setMesaNames] = useState<string[]>([]);
  const [selectedMesa, setSelectedMesa] = useState<string>("");
  const [guests, setGuests] = useState<GuestWithMesa[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<null | string>(null);
  const [mesaValues, setMesaValues] = useState<Record<string, string>>({});

  // Fetch available mesa names from mesa_positions
  useEffect(() => {
    supabase
      .from("mesa_positions")
      .select("mesa_name")
      .order("mesa_name")
      .then(({ data }) => {
        const names = (data ?? []).map((d: any) => d.mesa_name);
        setMesaNames(names);
        if (names.length > 0 && !selectedMesa) {
          setSelectedMesa(names[0]);
        }
      });
  }, []);

  const fetchGuestsByMesa = async (mesa: string) => {
    if (!mesa) return;
    setLoading(true);
    const { data } = await supabase
      .from("guests")
      .select("*")
      .eq("mesa", mesa)
      .order("nombre", { ascending: true });

    setGuests((data ?? []).map(mapDbGuestToGuestWithMesa));
    setLoading(false);
  };

  useEffect(() => {
    if (selectedMesa) fetchGuestsByMesa(selectedMesa);
  }, [selectedMesa]);

  const handleMesaChange = (guestId: string, value: string) => {
    setMesaValues((v) => ({ ...v, [guestId]: value }));
  };

  const handleAssign = async (guest: GuestWithMesa) => {
    setSavingId(guest.id);
    const mesaName = mesaValues[guest.id] || guest.mesa || "";
    if (!mesaName) {
      toast({ title: "Mesa no seleccionada", variant: "destructive" });
      setSavingId(null);
      return;
    }
    const { error } = await supabase
      .from("guests")
      .update({ mesa: mesaName })
      .eq("id", guest.id);
    if (error) {
      toast({ title: "Error al asignar mesa", variant: "destructive" });
    } else {
      toast({ title: "Mesa asignada", description: "Mesa asignada correctamente." });
      setMesaValues((v) => ({ ...v, [guest.id]: "" }));
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
            onChange={e => setSelectedMesa(e.target.value)}
          >
            {mesaNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
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
                    <GuestMesaSelect
                      guest={g}
                      mesaValue={mesaValues[g.id] ?? ""}
                      savingId={savingId}
                      onChange={(val) => handleMesaChange(g.id, val)}
                      onSave={() => handleAssign(g)}
                      disabled={savingId === g.id}
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
