import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { planSchema, type SeatingTable } from '@/utils/seatingPlan';
import { gridSchema, reconcileGrid, canPlace, tableFootprint, type SeatingGrid } from '@/utils/seatingGrid';

const CELL = 36;

type DragState = { id: string; x: number; y: number };

export default function MapaMesasTab({ readOnly = false }: { readOnly?: boolean }) {
  const [tables, setTables] = useState<SeatingTable[]>([]);
  const [grid, setGrid] = useState<SeatingGrid | null>(null);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [widthInput, setWidthInput] = useState('30');
  const [heightInput, setHeightInput] = useState('20');
  const [drag, setDrag] = useState<DragState | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; offX: number; offY: number; startX: number; startY: number } | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data, error: err } = await supabase
          .from('wedding_seating_plan')
          .select('id,layout,revision')
          .in('id', ['official', 'grid']);
        if (err) throw err;
        const plan = planSchema.parse(data?.find(r => r.id === 'official')?.layout);
        const gridRow = data?.find(r => r.id === 'grid');
        const layout = reconcileGrid(gridSchema.parse(gridRow?.layout), plan);
        if (active) {
          setTables(plan);
          setGrid(layout);
          setRevision(gridRow?.revision ?? 0);
          setWidthInput(String(layout.width));
          setHeightInput(String(layout.height));
        }
      } catch {
        if (active) setError('No se ha podido abrir el mapa de mesas.');
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  const save = async (next: SeatingGrid) => {
    setSaving(true);
    setNotice('');
    const { data, error: err } = await supabase
      .from('wedding_seating_plan')
      .update({ layout: JSON.parse(JSON.stringify(next)), revision: revision + 1 })
      .eq('id', 'grid')
      .eq('revision', revision)
      .select('revision');
    if (err || !data?.length) {
      setNotice('No se pudo guardar: otra persona ha modificado el mapa. Recarga la página.');
    } else {
      setRevision(data[0].revision);
      setGrid(next);
      setDirty(false);
      setNotice('Mapa guardado.');
    }
    setSaving(false);
  };

  const cellFromEvent = (e: React.PointerEvent) => {
    const rect = gridRef.current!.getBoundingClientRect();
    return {
      x: Math.round((e.clientX - rect.left) / CELL),
      y: Math.round((e.clientY - rect.top) / CELL),
    };
  };

  const onPointerDown = (e: React.PointerEvent, table: SeatingTable) => {
    if (readOnly || !grid) return;
    const pos = grid.positions[table.id];
    if (!pos) return;
    const cell = cellFromEvent(e);
    dragRef.current = { id: table.id, offX: cell.x - pos.x, offY: cell.y - pos.y, startX: pos.x, startY: pos.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ id: table.id, x: pos.x, y: pos.y });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || !grid || !gridRef.current) return;
    const table = tables.find(t => t.id === d.id);
    if (!table) return;
    const size = tableFootprint(table.modules, grid.positions[d.id]?.rotation ?? 0);
    const cell = cellFromEvent(e);
    const x = Math.max(0, Math.min(cell.x - d.offX, grid.width - size.width));
    const y = Math.max(0, Math.min(cell.y - d.offY, grid.height - size.height));
    setDrag(prev => (prev && prev.x === x && prev.y === y ? prev : { id: d.id, x, y }));
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d || !grid) { setDrag(null); return; }
    setDrag(current => {
      if (!current) return null;
      const old = grid.positions[d.id];
      const moved = old && (old.x !== current.x || old.y !== current.y);
      if (moved && canPlace(grid, tables, d.id, current.x, current.y)) {
        setGrid({ ...grid, positions: { ...grid.positions, [d.id]: { x: current.x, y: current.y, rotation: old?.rotation } } });
        setDirty(true);
      } else if (!moved) {
        setSelected(prev => (prev === d.id ? null : d.id));
      }
      return null;
    });
  };

  const rotate = (table: SeatingTable) => {
    if (!grid) return;
    const pos = grid.positions[table.id];
    if (!pos) return;
    const nextRotation = (pos.rotation ?? 0) === 90 ? 0 : 90;
    if (!canPlace(grid, tables, table.id, pos.x, pos.y, nextRotation)) {
      setNotice('La mesa no cabe girada en esa posición. Muévela primero.');
      return;
    }
    setGrid({ ...grid, positions: { ...grid.positions, [table.id]: { ...pos, rotation: nextRotation } } });
    setDirty(true);
    setNotice('');
  };

  const applySize = () => {
    if (!grid) return;
    const width = parseInt(widthInput, 10);
    const height = parseInt(heightInput, 10);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 5 || height < 5 || width > 100 || height > 100) {
      setNotice('El tamaño debe ser un número entero entre 5 y 100.');
      return;
    }
    try {
      const next = reconcileGrid({ width, height, positions: grid.positions }, tables);
      void save(next);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Las mesas no caben en esta cuadrícula. Aumenta su tamaño.');
    }
  };

  if (error) return <p role="alert" className="p-8 text-center">{error}</p>;
  if (!grid) return <p className="p-8 text-center">Cargando mapa…</p>;

  return (
    <section className="mx-auto max-w-[1500px] px-4 py-6" aria-readonly={readOnly}>
      <h2 className="mb-4 text-xl font-normal">Mapa Mesas</h2>

      {!readOnly && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            Ancho
            <input
              type="number" min={5} max={100} value={widthInput}
              onChange={e => setWidthInput(e.target.value)}
              className="w-20 rounded border bg-background px-2 py-1"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            Alto
            <input
              type="number" min={5} max={100} value={heightInput}
              onChange={e => setHeightInput(e.target.value)}
              className="w-20 rounded border bg-background px-2 py-1"
            />
          </label>
          <button
            type="button" onClick={applySize} disabled={saving}
            className="rounded border bg-secondary px-3 py-1 text-sm text-secondary-foreground disabled:opacity-50"
          >
            Aplicar tamaño
          </button>
          <button
            type="button" onClick={() => grid && void save(grid)} disabled={!dirty || saving}
            className="rounded border bg-primary px-3 py-1 text-sm text-primary-foreground disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Guardar posiciones'}
          </button>
          {notice && <span className="text-sm text-muted-foreground" role="status">{notice}</span>}
        </div>
      )}
      {readOnly && notice && <p className="mb-4 text-sm text-muted-foreground" role="status">{notice}</p>}

      <div className="overflow-auto">
        <div
          ref={gridRef}
          className="relative border bg-background"
          style={{
            width: grid.width * CELL,
            height: grid.height * CELL,
            backgroundImage:
              'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: `${CELL}px ${CELL}px`,
            touchAction: readOnly ? 'auto' : 'none',
          }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {tables.map(table => {
            const pos = drag?.id === table.id ? drag : grid.positions[table.id];
            if (!pos) return null;
            const rotation = grid.positions[table.id]?.rotation ?? 0;
            const size = tableFootprint(table.modules, rotation);
            const invalid = drag?.id === table.id && !canPlace(grid, tables, table.id, drag.x, drag.y);
            const isSelected = selected === table.id && !readOnly;
            return (
              <div
                key={table.id}
                onPointerDown={e => onPointerDown(e, table)}
                className={`absolute flex items-center justify-center overflow-visible border bg-secondary p-2 text-center text-xs text-secondary-foreground select-none ${
                  readOnly ? '' : 'cursor-grab active:cursor-grabbing'
                } ${invalid ? 'border-destructive' : ''} ${isSelected ? 'ring-2 ring-primary' : ''}`}
                style={{ left: pos.x * CELL, top: pos.y * CELL, width: size.width * CELL, height: size.height * CELL, backgroundColor: table.color ?? undefined }}
              >
                <span>
                  {table.name}
                  <span className="block">{table.seats.filter(Boolean).length}/{table.seats.length}</span>
                </span>
                {isSelected && (
                  <button
                    type="button"
                    aria-label={`Girar ${table.name} 90 grados`}
                    title="Girar 90°"
                    onPointerDown={e => e.stopPropagation()}
                    onClick={e => { e.stopPropagation(); rotate(table); }}
                    className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full border bg-primary text-sm text-primary-foreground shadow"
                  >
                    ↻
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {!readOnly && (
        <p className="mt-2 text-sm text-muted-foreground">
          Arrastra las mesas para colocarlas. Pulsa una mesa para seleccionarla y usa el botón ↻ para girarla 90°.
        </p>
      )}
    </section>
  );
}
