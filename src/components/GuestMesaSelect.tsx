
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Guest } from "@/types/guestTypes";
import { supabase } from "@/integrations/supabase/client";

interface GuestMesaSelectProps {
  guest: Guest & { mesa?: string | null };
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
  const value = mesaValue !== undefined && mesaValue !== "" ? mesaValue : guest.mesa ? guest.mesa : "";

  const [mesaNames, setMesaNames] = useState<string[]>([]);
  const [mesaCounters, setMesaCounters] = useState<Record<string, number>>({});

  useEffect(() => {
    // Fetch mesa names from mesa_positions
    supabase
      .from("mesa_positions")
      .select("mesa_name")
      .order("mesa_name")
      .then(({ data }) => {
        setMesaNames((data ?? []).map((d: any) => d.mesa_name));
      });

    // Fetch guest counts per mesa
    supabase
      .from("guests")
      .select("mesa, plus_one")
      .not("mesa", "is", null)
      .then(({ data }) => {
        const counters: Record<string, number> = {};
        if (data) {
          data.forEach((g: any) => {
            if (g.mesa) {
              counters[g.mesa] = (counters[g.mesa] || 0) + (g.plus_one ? 2 : 1);
            }
          });
        }
        setMesaCounters(counters);
      });
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-44" aria-label="Mesa">
          <SelectValue placeholder="Sin mesa" />
        </SelectTrigger>
        <SelectContent>
          {mesaNames.map((name) => (
            <SelectItem value={name} key={name}>
              {`${name} (${mesaCounters[name] || 0})`}
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
          value === (guest.mesa || "")
        }
      >
        {savingId === guest.id ? "Guardando..." : "Asignar"}
      </Button>
    </div>
  );
};

export default GuestMesaSelect;
