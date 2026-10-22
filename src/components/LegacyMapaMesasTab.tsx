import React, { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Settings2, GripVertical, Pencil, User, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Mesa {
  id: string;
  mesa_name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string | null;
}

const PALETTE = ["#bfdbfe","#bbf7d0","#fde68a","#fecdd3","#e9d5ff","#a5f3fc","#fed7aa","#99f6e4","#fbcfe8","#c7d2fe","#d6c7a8","#e5e7eb"];
const darken = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.round(v * 0.7)).toString(16).padStart(2, "0");
  return `#${f(n >> 16)}${f((n >> 8) & 255)}${f(n & 255)}`;
};
const mesaColor = (m: Mesa, i: number) => m.color || PALETTE[i % PALETTE.length];

const ColorPicker: React.FC<{ value: string; onChange: (c: string) => void }> = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-2 items-center">
    {PALETTE.map((c) => (
      <button key={c} type="button" onClick={() => onChange(c)} title={c}
        className={`w-7 h-7 rounded-full border-2 ${value === c ? "ring-2 ring-offset-1 ring-foreground" : ""}`}
        style={{ backgroundColor: c, borderColor: darken(c) }} />
    ))}
    <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 cursor-pointer" title="Color personalizado" />
  </div>
);

interface Seat {
  id: string;
  x: number;
  y: number;
  guest_id: string | null;
  is_plus_one: boolean;
  nombre: string;
}

interface GuestLite {
  id: string;
  nombre: string;
  plus_one: boolean;
  nombre_acompanante: string | null;
  mesa: string | null;
}

interface LayoutConfig {
  id: string;
  space_width: number;
  space_height: number;
}

const CELL_SIZE = 36; // px per grid cell

const MapaMesasTab: React.FC = () => {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [config, setConfig] = useState<LayoutConfig | null>(null);
  const [spaceWidth, setSpaceWidth] = useState(20);
  const [spaceHeight, setSpaceHeight] = useState(15);
  const [loading, setLoading] = useState(true);

  // Add mesa dialog
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newWidth, setNewWidth] = useState(2);
  const [newHeight, setNewHeight] = useState(1);
  const [newColor, setNewColor] = useState(PALETTE[0]);

  // Seats
  const [seats, setSeats] = useState<Seat[]>([]);
  const [guestList, setGuestList] = useState<GuestLite[]>([]);
  const [seatCell, setSeatCell] = useState<{ x: number; y: number } | null>(null);
  const [seatSearch, setSeatSearch] = useState("");
  const [viewSeat, setViewSeat] = useState<Seat | null>(null);

  // Edit mesa dialog
  const [editMesa, setEditMesa] = useState<Mesa | null>(null);

  // Config dialog
  const [configOpen, setConfigOpen] = useState(false);
  const [editWidth, setEditWidth] = useState(20);
  const [editHeight, setEditHeight] = useState(15);

  // Dragging
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [mesasRes, configRes, seatsRes, guestsRes] = await Promise.all([
      supabase.from("mesa_positions").select("*").order("created_at"),
      supabase.from("mesa_layout_config").select("*").limit(1).single(),
      (supabase as any).from("mesa_seats").select("*"),
      supabase.from("guests").select("id,nombre,plus_one,nombre_acompanante,mesa").order("nombre"),
    ]);
    setSeats((seatsRes.data as Seat[]) ?? []);
    setGuestList((guestsRes.data as GuestLite[]) ?? []);

    setMesas((mesasRes.data as Mesa[]) ?? []);

    if (configRes.data) {
      const c = configRes.data as LayoutConfig;
      setConfig(c);
      setSpaceWidth(c.space_width);
      setSpaceHeight(c.space_height);
      setEditWidth(c.space_width);
      setEditHeight(c.space_height);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveConfig = async () => {
    if (editWidth < 5 || editHeight < 5 || editWidth > 50 || editHeight > 50) {
      toast({ title: "Dimensiones inválidas", description: "Min 5, max 50.", variant: "destructive" });
      return;
    }

    if (config) {
      await supabase.from("mesa_layout_config").update({ space_width: editWidth, space_height: editHeight }).eq("id", config.id);
    } else {
      await supabase.from("mesa_layout_config").insert({ space_width: editWidth, space_height: editHeight });
    }
    setSpaceWidth(editWidth);
    setSpaceHeight(editHeight);
    setConfigOpen(false);
    fetchData();
    toast({ title: "Espacio actualizado" });
  };

  const addMesa = async () => {
    if (!newName.trim()) {
      toast({ title: "Nombre requerido", variant: "destructive" });
      return;
    }
    if (newWidth < 1 || newHeight < 1 || newWidth > 20 || newHeight > 20) {
      toast({ title: "Dimensiones inválidas", description: "Min 1, max 20.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("mesa_positions").insert({
      mesa_name: newName.trim(),
      x: 0,
      y: 0,
      width: newWidth,
      height: newHeight,
      color: newColor,
    } as any);

    if (error) {
      toast({ title: "Error al añadir mesa", variant: "destructive" });
    } else {
      toast({ title: "Mesa añadida" });
      setNewName("");
      setNewWidth(2);
      setNewHeight(1);
      setAddOpen(false);
      fetchData();
    }
  };

  const saveEditMesa = async () => {
    if (!editMesa) return;
    const { id, mesa_name, width, height, color } = editMesa;
    if (!mesa_name.trim() || width < 1 || height < 1 || width > 20 || height > 20) {
      toast({ title: "Datos inválidos", description: "Nombre requerido, tamaño 1-20.", variant: "destructive" });
      return;
    }
    const old = mesas.find((m) => m.id === id);
    const x = Math.max(0, Math.min(editMesa.x, spaceWidth - width));
    const y = Math.max(0, Math.min(editMesa.y, spaceHeight - height));
    const { error } = await supabase.from("mesa_positions")
      .update({ mesa_name: mesa_name.trim(), width, height, color, x, y } as any).eq("id", id);
    if (error) { toast({ title: "Error al guardar", variant: "destructive" }); return; }
    if (old && old.mesa_name !== mesa_name.trim()) {
      await supabase.from("guests").update({ mesa: mesa_name.trim() }).eq("mesa", old.mesa_name);
    }
    toast({ title: "Mesa actualizada" });
    setEditMesa(null);
    fetchData();
  };

  const handleGridClick = (e: React.MouseEvent) => {
    if (e.target !== gridRef.current || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    if (seats.some((s) => s.x === x && s.y === y)) return;
    setSeatSearch("");
    setSeatCell({ x, y });
  };

  const addSeat = async (nombre: string, guest_id: string | null, is_plus_one: boolean) => {
    if (!seatCell || !nombre.trim()) return;
    const { error } = await (supabase as any).from("mesa_seats").insert({
      x: seatCell.x, y: seatCell.y, nombre: nombre.trim().slice(0, 100), guest_id, is_plus_one,
    });
    if (error) { toast({ title: "Error al colocar persona", description: error.message, variant: "destructive" }); return; }
    setSeatCell(null);
    fetchData();
  };

  const removeSeat = async (id: string) => {
    await (supabase as any).from("mesa_seats").delete().eq("id", id);
    setViewSeat(null);
    fetchData();
  };

  const seatOptions = (() => {
    const q = seatSearch.trim().toLowerCase();
    const opts: { label: string; sub: string; guest_id: string; plus: boolean }[] = [];
    guestList.forEach((g) => {
      opts.push({ label: g.nombre, sub: "Invitado", guest_id: g.id, plus: false });
      if (g.plus_one) opts.push({ label: g.nombre_acompanante || `+1 de ${g.nombre}`, sub: `+1 de ${g.nombre}`, guest_id: g.id, plus: true });
    });
    return opts
      .filter((o) => !seats.some((s) => s.guest_id === o.guest_id && s.is_plus_one === o.plus))
      .filter((o) => !q || o.label.toLowerCase().includes(q) || o.sub.toLowerCase().includes(q))
      .slice(0, 50);
  })();

  const deleteMesa = async (id: string) => {
    await supabase.from("mesa_positions").delete().eq("id", id);
    fetchData();
    toast({ title: "Mesa eliminada" });
  };

  const updateMesaPosition = async (id: string, x: number, y: number) => {
    await supabase.from("mesa_positions").update({ x, y }).eq("id", id);
  };

  // --- Drag handlers ---
  const handleMouseDown = (e: React.MouseEvent, mesa: Mesa) => {
    e.preventDefault();
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const cellX = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const cellY = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    setDragging(mesa.id);
    setDragOffset({ x: cellX - mesa.x, y: cellY - mesa.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const cellX = Math.floor((e.clientX - rect.left) / CELL_SIZE);
      const cellY = Math.floor((e.clientY - rect.top) / CELL_SIZE);

      const mesa = mesas.find((m) => m.id === dragging);
      if (!mesa) return;

      const newX = Math.max(0, Math.min(spaceWidth - mesa.width, cellX - dragOffset.x));
      const newY = Math.max(0, Math.min(spaceHeight - mesa.height, cellY - dragOffset.y));

      if (newX !== mesa.x || newY !== mesa.y) {
        setMesas((prev) =>
          prev.map((m) => (m.id === dragging ? { ...m, x: newX, y: newY } : m))
        );
      }
    },
    [dragging, dragOffset, mesas, spaceWidth, spaceHeight]
  );

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      const mesa = mesas.find((m) => m.id === dragging);
      if (mesa) {
        updateMesaPosition(mesa.id, mesa.x, mesa.y);
      }
      setDragging(null);
    }
  }, [dragging, mesas]);

  if (loading) {
    return <div className="p-8 text-center">Cargando mapa de mesas...</div>;
  }

  const gridWidthPx = spaceWidth * CELL_SIZE;
  const gridHeightPx = spaceHeight * CELL_SIZE;


  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-bold text-xl">Mapa de Mesas</h2>
        <div className="flex gap-2">
          <Dialog open={configOpen} onOpenChange={setConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="w-4 h-4 mr-1" /> Espacio ({spaceWidth}×{spaceHeight})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurar tamaño del espacio</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex gap-4 items-center">
                  <label className="w-20 text-sm font-medium">Ancho:</label>
                  <Input
                    type="number"
                    min={5}
                    max={50}
                    value={editWidth}
                    onChange={(e) => setEditWidth(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <label className="w-20 text-sm font-medium">Alto:</label>
                  <Input
                    type="number"
                    min={5}
                    max={50}
                    value={editHeight}
                    onChange={(e) => setEditHeight(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
                <Button onClick={saveConfig}>Guardar</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" /> Añadir Mesa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir nueva mesa</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex gap-4 items-center">
                  <label className="w-20 text-sm font-medium">Nombre:</label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={`Mesa ${mesas.length + 1}`}
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <label className="w-20 text-sm font-medium">Ancho:</label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={newWidth}
                    onChange={(e) => setNewWidth(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <label className="w-20 text-sm font-medium">Alto:</label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={newHeight}
                    onChange={(e) => setNewHeight(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
                <div className="flex gap-4 items-start">
                  <label className="w-20 text-sm font-medium pt-1">Color:</label>
                  <ColorPicker value={newColor} onChange={setNewColor} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Cada unidad = 1 cuadrado en la cuadrícula. Ej: 7×2 = mesa de 7 cuadrados de ancho por 2 de alto.
                </p>
                <Button onClick={addMesa}>Añadir</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Legend */}
      {mesas.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {mesas.map((mesa, i) => (
            <div key={mesa.id} className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded border" style={{ backgroundColor: mesaColor(mesa, i), borderColor: darken(mesaColor(mesa, i)) }} />
              <span>{mesa.mesa_name}</span>
              <span className="text-muted-foreground text-xs">({mesa.width}×{mesa.height})</span>
              <button
                onClick={() => setEditMesa({ ...mesa, color: mesaColor(mesa, i) })}
                className="text-muted-foreground hover:text-foreground ml-1"
                title="Editar mesa"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteMesa(mesa.id)}
                className="text-destructive hover:text-destructive/80 ml-1"
                title="Eliminar mesa"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="overflow-auto border rounded-lg bg-muted/30 p-2">
        <div
          ref={gridRef}
          className="relative select-none"
          style={{
            width: gridWidthPx,
            height: gridHeightPx,
            backgroundImage:
              `linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
               linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleGridClick}
        >
          {mesas.map((mesa, i) => (
            <div
              key={mesa.id}
              className={`absolute rounded border-2 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-sm transition-shadow hover:shadow-md ${dragging === mesa.id ? "opacity-80 shadow-lg z-10" : "z-0"}`}
              style={{
                left: mesa.x * CELL_SIZE,
                top: mesa.y * CELL_SIZE,
                width: mesa.width * CELL_SIZE,
                height: mesa.height * CELL_SIZE,
                backgroundColor: mesaColor(mesa, i),
                borderColor: darken(mesaColor(mesa, i)),
              }}
              onDoubleClick={() => setEditMesa({ ...mesa, color: mesaColor(mesa, i) })}
              onMouseDown={(e) => handleMouseDown(e, mesa)}
            >
              <div className="flex items-center gap-1 pointer-events-none">
                <GripVertical className="w-3 h-3 opacity-50" />
                <span className="text-xs font-semibold truncate max-w-[80px]">
                  {mesa.mesa_name}
                </span>
              </div>
            </div>
          ))}
          {seats.map((seat) => (
            <button
              key={seat.id}
              type="button"
              onClick={() => setViewSeat(seat)}
              title={seat.nombre}
              className="absolute z-20 flex items-center justify-center"
              style={{ left: seat.x * CELL_SIZE, top: seat.y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE }}
            >
              <span className={`flex items-center justify-center rounded-full border-2 shadow w-7 h-7 ${seat.guest_id ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-muted-foreground"}`}>
                <User className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Haz clic en una casilla vacía para sentar a alguien. Haz clic en una persona para ver quién es.
      </p>

      <Dialog open={!!seatCell} onOpenChange={(o) => !o && setSeatCell(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Colocar persona</DialogTitle>
          </DialogHeader>
          <Input autoFocus placeholder="Buscar invitado o escribir un nombre..." value={seatSearch}
            onChange={(e) => setSeatSearch(e.target.value)} maxLength={100} />
          <div className="max-h-72 overflow-y-auto flex flex-col gap-1">
            {seatOptions.map((o) => (
              <button key={o.guest_id + o.plus} type="button" onClick={() => addSeat(o.label, o.guest_id, o.plus)}
                className="text-left px-3 py-2 rounded hover:bg-muted flex justify-between gap-2">
                <span>{o.label}</span>
                <span className="text-xs text-muted-foreground">{o.sub}</span>
              </button>
            ))}
            {seatOptions.length === 0 && <p className="text-sm text-muted-foreground px-3 py-2">Sin coincidencias.</p>}
          </div>
          {seatSearch.trim() && (
            <Button variant="outline" onClick={() => addSeat(seatSearch, null, false)}>
              <Plus className="w-4 h-4 mr-1" /> Añadir "{seatSearch.trim()}" (fuera de la lista)
            </Button>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewSeat} onOpenChange={(o) => !o && setViewSeat(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewSeat?.nombre}</DialogTitle>
          </DialogHeader>
          {viewSeat && (() => {
            const g = guestList.find((x) => x.id === viewSeat.guest_id);
            return (
              <div className="flex flex-col gap-2 text-sm">
                <p>{!g ? "Persona fuera de la lista de invitados" : viewSeat.is_plus_one ? `Acompañante (+1) de ${g.nombre}` : "Invitado"}</p>
                {g?.mesa && <p className="text-muted-foreground">Mesa asignada: {g.mesa}</p>}
                <Button variant="destructive" className="mt-2" onClick={() => removeSeat(viewSeat.id)}>
                  <X className="w-4 h-4 mr-1" /> Quitar de este sitio
                </Button>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editMesa} onOpenChange={(o) => !o && setEditMesa(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar mesa</DialogTitle>
          </DialogHeader>
          {editMesa && (
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex gap-4 items-center">
                <label className="w-20 text-sm font-medium">Nombre:</label>
                <Input value={editMesa.mesa_name} onChange={(e) => setEditMesa({ ...editMesa, mesa_name: e.target.value })} />
              </div>
              <div className="flex gap-4 items-center">
                <label className="w-20 text-sm font-medium">Ancho:</label>
                <Input type="number" min={1} max={20} className="w-24" value={editMesa.width}
                  onChange={(e) => setEditMesa({ ...editMesa, width: Number(e.target.value) })} />
              </div>
              <div className="flex gap-4 items-center">
                <label className="w-20 text-sm font-medium">Alto:</label>
                <Input type="number" min={1} max={20} className="w-24" value={editMesa.height}
                  onChange={(e) => setEditMesa({ ...editMesa, height: Number(e.target.value) })} />
              </div>
              <div className="flex gap-4 items-start">
                <label className="w-20 text-sm font-medium pt-1">Color:</label>
                <ColorPicker value={editMesa.color || PALETTE[0]} onChange={(c) => setEditMesa({ ...editMesa, color: c })} />
              </div>
              <p className="text-xs text-muted-foreground">Si cambias el nombre, los invitados asignados se actualizan automáticamente.</p>
              <Button onClick={saveEditMesa}>Guardar cambios</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {mesas.length === 0 && (
        <p className="text-center text-muted-foreground mt-4 text-sm">
          No hay mesas creadas. Haz clic en "Añadir Mesa" para empezar.
        </p>
      )}
    </div>
  );
};

export default MapaMesasTab;
