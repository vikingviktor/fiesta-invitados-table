import React, { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Settings2, GripVertical } from "lucide-react";
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
    const [mesasRes, configRes] = await Promise.all([
      supabase.from("mesa_positions").select("*").order("created_at"),
      supabase.from("mesa_layout_config").select("*").limit(1).single(),
    ]);

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
    });

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

  // Colors for mesas
  const mesaColors = [
    "bg-blue-200 border-blue-400",
    "bg-green-200 border-green-400",
    "bg-amber-200 border-amber-400",
    "bg-rose-200 border-rose-400",
    "bg-purple-200 border-purple-400",
    "bg-cyan-200 border-cyan-400",
    "bg-orange-200 border-orange-400",
    "bg-teal-200 border-teal-400",
    "bg-pink-200 border-pink-400",
    "bg-indigo-200 border-indigo-400",
  ];

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
              <div className={`w-4 h-4 rounded border ${mesaColors[i % mesaColors.length]}`} />
              <span>{mesa.mesa_name}</span>
              <span className="text-muted-foreground text-xs">({mesa.width}×{mesa.height})</span>
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
        >
          {mesas.map((mesa, i) => (
            <div
              key={mesa.id}
              className={`absolute rounded border-2 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-sm transition-shadow hover:shadow-md ${mesaColors[i % mesaColors.length]} ${dragging === mesa.id ? "opacity-80 shadow-lg z-10" : "z-0"}`}
              style={{
                left: mesa.x * CELL_SIZE,
                top: mesa.y * CELL_SIZE,
                width: mesa.width * CELL_SIZE,
                height: mesa.height * CELL_SIZE,
              }}
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
        </div>
      </div>

      {mesas.length === 0 && (
        <p className="text-center text-muted-foreground mt-4 text-sm">
          No hay mesas creadas. Haz clic en "Añadir Mesa" para empezar.
        </p>
      )}
    </div>
  );
};

export default MapaMesasTab;
