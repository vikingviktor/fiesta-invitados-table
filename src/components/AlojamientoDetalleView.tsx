import React, { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/types/guestTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Bed, Users, X, UserPlus, Home, Search } from "lucide-react";

type GuestWithHabitacion = Guest & { habitacion?: string | null };

export type AlojamientoItem = {
  id: string;
  propiedad: string;
  habitacion: string;
  tipo_cama: string | null;
  plazas: number;
  observaciones: string | null;
};

type Props = {
  alojamientos: AlojamientoItem[];
  guests: GuestWithHabitacion[];
  propiedades: string[];
  loading: boolean;
  onChanged: () => Promise<void> | void;
};

const personasDe = (g: GuestWithHabitacion) => 1 + (g.plusOne ? 1 : 0);

const AlojamientoDetalleView: React.FC<Props> = ({
  alojamientos,
  guests,
  propiedades,
  loading,
  onChanged,
}) => {
  const [propiedad, setPropiedad] = useState<string>(propiedades[0] ?? "");
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [dragGuestId, setDragGuestId] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Si aún no hay propiedad seleccionada y ya cargaron, escoger la primera
  React.useEffect(() => {
    if (!propiedad && propiedades.length > 0) setPropiedad(propiedades[0]);
  }, [propiedades, propiedad]);

  const habitaciones = useMemo(
    () =>
      alojamientos
        .filter((a) => a.propiedad === propiedad)
        .sort((a, b) => a.habitacion.localeCompare(b.habitacion)),
    [alojamientos, propiedad]
  );

  const guestsPorHabitacion = useMemo(() => {
    const map: Record<string, GuestWithHabitacion[]> = {};
    guests.forEach((g) => {
      if (!g.habitacion) return;
      if (!map[g.habitacion]) map[g.habitacion] = [];
      map[g.habitacion].push(g);
    });
    return map;
  }, [guests]);

  const sinAsignar = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guests
      .filter((g) => !g.habitacion)
      .filter((g) =>
        q
          ? g.nombre.toLowerCase().includes(q) ||
            (g.nombreAcompanante ?? "").toLowerCase().includes(q)
          : true
      );
  }, [guests, search]);

  const moverInvitado = async (guestId: string, habitacionKey: string | null) => {
    setSaving(true);
    const { error } = await supabase
      .from("guests")
      .update({ habitacion: habitacionKey })
      .eq("id", guestId);
    if (error) {
      toast.error("No se pudo mover al invitado");
      console.error(error);
    } else {
      toast.success(habitacionKey ? "Invitado asignado" : "Invitado desasignado");
      await onChanged();
    }
    setSelectedGuestId(null);
    setSaving(false);
  };

  const handleDropEnHabitacion = (key: string) => {
    const id = dragGuestId ?? selectedGuestId;
    setDragGuestId(null);
    setDragOverKey(null);
    if (id) moverInvitado(id, key);
  };

  const totalPlazas = habitaciones.reduce((s, h) => s + h.plazas, 0);
  const totalOcupadas = habitaciones.reduce((s, h) => {
    const key = `${h.propiedad} - ${h.habitacion}`;
    return s + (guestsPorHabitacion[key] ?? []).reduce((c, g) => c + personasDe(g), 0);
  }, 0);

  const GuestChip: React.FC<{
    guest: GuestWithHabitacion;
    onRemove?: () => void;
  }> = ({ guest, onRemove }) => {
    const isSelected = selectedGuestId === guest.id;
    return (
      <div
        draggable
        onDragStart={() => setDragGuestId(guest.id)}
        onDragEnd={() => setDragGuestId(null)}
        onClick={() => setSelectedGuestId(isSelected ? null : guest.id)}
        className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-sm cursor-grab active:cursor-grabbing transition-colors ${
          isSelected
            ? "border-primary bg-primary/10 ring-1 ring-primary"
            : "border-border bg-card hover:bg-accent"
        }`}
        title="Arrastra a una habitación o pulsa para seleccionar"
      >
        <span className="font-medium">{guest.nombre}</span>
        {guest.plusOne && (
          <Badge variant="secondary" className="text-[10px]">
            +1 {guest.nombreAcompanante ? `· ${guest.nombreAcompanante}` : ""}
          </Badge>
        )}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="opacity-50 hover:opacity-100 text-destructive"
            title="Quitar de la habitación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-muted-foreground" />
          <Select value={propiedad} onValueChange={setPropiedad}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Selecciona un alojamiento..." />
            </SelectTrigger>
            <SelectContent>
              {propiedades.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {propiedad && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" /> {habitaciones.length} hab.
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {totalOcupadas}/{totalPlazas} plazas
            </span>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Arrastra a las personas entre habitaciones, o pulsa una persona y luego la
        habitación de destino.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Habitaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {habitaciones.length === 0 && (
            <div className="text-muted-foreground text-sm">
              Este alojamiento no tiene habitaciones registradas.
            </div>
          )}
          {habitaciones.map((h) => {
            const key = `${h.propiedad} - ${h.habitacion}`;
            const ocupantes = guestsPorHabitacion[key] ?? [];
            const plazasOcupadas = ocupantes.reduce((c, g) => c + personasDe(g), 0);
            const libre = h.plazas - plazasOcupadas;
            const isOver = dragOverKey === key;
            return (
              <div
                key={h.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverKey(key);
                }}
                onDragLeave={() => setDragOverKey((k) => (k === key ? null : k))}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropEnHabitacion(key);
                }}
                onClick={() => {
                  if (selectedGuestId) handleDropEnHabitacion(key);
                }}
                className={`rounded-lg border p-3 bg-card transition-all ${
                  isOver ? "ring-2 ring-primary border-primary" : ""
                } ${selectedGuestId ? "cursor-pointer hover:border-primary" : ""}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{h.habitacion}</h4>
                    {h.tipo_cama && (
                      <p className="text-xs text-muted-foreground">{h.tipo_cama}</p>
                    )}
                  </div>
                  <Badge
                    variant={
                      libre <= 0 ? "destructive" : plazasOcupadas > 0 ? "secondary" : "outline"
                    }
                  >
                    {plazasOcupadas}/{h.plazas}
                  </Badge>
                </div>

                <div className="space-y-1.5 min-h-[52px]">
                  {ocupantes.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic border border-dashed rounded-md py-3 text-center">
                      Vacía — suelta aquí
                    </div>
                  ) : (
                    ocupantes.map((g) => (
                      <GuestChip
                        key={g.id}
                        guest={g}
                        onRemove={() => moverInvitado(g.id, null)}
                      />
                    ))
                  )}
                </div>

                {h.observaciones && (
                  <p className="mt-2 text-[11px] text-muted-foreground">{h.observaciones}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Panel sin asignar */}
        <div className="rounded-lg border p-3 bg-muted/30 h-fit lg:sticky lg:top-4">
          <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
            <UserPlus className="w-4 h-4" />
            Sin asignar ({sinAsignar.length})
          </h4>
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="pl-7 h-8 text-sm"
            />
          </div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = dragGuestId;
              setDragGuestId(null);
              if (id) moverInvitado(id, null);
            }}
            className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1"
          >
            {sinAsignar.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                Todo el mundo tiene habitación.
              </p>
            ) : (
              sinAsignar.map((g) => <GuestChip key={g.id} guest={g} />)
            )}
          </div>
          {selectedGuestId && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full"
              onClick={() => setSelectedGuestId(null)}
              disabled={saving}
            >
              Cancelar selección
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlojamientoDetalleView;
