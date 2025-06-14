
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Guest } from "@/types/guestTypes"; // Usar SIEMPRE guestTypes
import { supabase } from "@/integrations/supabase/client";

const mesas = Array.from({ length: 11 }, (_, i) => i + 1);

interface GuestMesaSelectProps {
  guest: Guest & { mesa?: number | null };
  mesaValue: string;
  savingId: string | null;
  onChange: (value: string) => void;
  onSave: () => void;
  disabled: boolean;
}

// Cuenta invitados por mesa considerando +1 como 2 personas, sin +1 como 1 persona
async function fetchMesaCounters(): Promise<Record<number, number>> {
  // Consulta todos los invitados con campo mesa asignado
  const { data, error } = await supabase
    .from("guests")
    .select("mesa, plus_one")
    .not("mesa", "is", null);

  const counters: Record<number, number> = {};
  if (data) {
    data.forEach((g: { mesa: number; plus_one: boolean }) => {
      if (g.mesa) {
        counters[g.mesa] = (counters[g.mesa] || 0) + (g.plus_one ? 2 : 1);
      }
    });
  }
  return counters;
}

const GuestMesaSelect: React.FC<GuestMesaSelectProps> = ({
  guest,
  mesaValue,
  savingId,
  onChange,
  onSave,
  disabled,
}) => {
  // La lógica para mostrar el valor: el value es la mesa asignada o "" si no tiene mesa
  const value = mesaValue !== undefined && mesaValue !== "" ? mesaValue : guest.mesa ? String(guest.mesa) : "";

  const [mesaCounters, setMesaCounters] = useState<Record<number, number>>({});

  // Actualiza el contador de personas por mesa al cargar o al abrir el selector
  useEffect(() => {
    fetchMesaCounters().then(setMesaCounters);
    // Si quieres que esté más actualizado, puedes volver a consultar después de asignar.
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-36" aria-label="Mesa">
          <SelectValue placeholder="Sin mesa" />
        </SelectTrigger>
        <SelectContent>
          {mesas.map((mesaNum) => (
            <SelectItem value={String(mesaNum)} key={mesaNum}>
              {`Mesa ${mesaNum} (${mesaCounters[mesaNum] || 0})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant="outline"
        onClick={onSave}
        disabled={
          disabled ||
          value === "" ||
          value === (guest.mesa ? String(guest.mesa) : "")
        }
      >
        {savingId === guest.id ? "Guardando..." : "Asignar"}
      </Button>
    </div>
  );
};

export default GuestMesaSelect;
