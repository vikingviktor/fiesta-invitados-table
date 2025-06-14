
import React from "react";
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

const mesas = Array.from({ length: 11 }, (_, i) => i + 1);

interface GuestMesaSelectProps {
  guest: Guest & { mesa?: number | null };
  mesaValue: string;
  savingId: string | null;
  onChange: (value: string) => void;
  onSave: () => void;
  disabled: boolean;
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

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value}
        onValueChange={onChange}
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
