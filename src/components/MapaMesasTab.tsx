import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { planSchema, type SeatingTable } from '@/utils/seatingPlan';
import { gridSchema, reconcileGrid, tableFootprint, type SeatingGrid } from '@/utils/seatingGrid';

export default function MapaMesasTab({ readOnly = false }: { readOnly?: boolean }) {
  const [tables, setTables] = useState<SeatingTable[]>([]);
  const [grid, setGrid] = useState<SeatingGrid | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data, error: err } = await supabase.from('wedding_seating_plan').select('id,layout').in('id', ['official', 'grid']);
        if (err) throw err;
        const plan = planSchema.parse(data?.find(r => r.id === 'official')?.layout);
        const layout = reconcileGrid(gridSchema.parse(data?.find(r => r.id === 'grid')?.layout), plan);
        if (active) { setTables(plan); setGrid(layout); }
      } catch { if (active) setError('No se ha podido abrir el mapa de mesas.'); }
    };
    void load();
    return () => { active = false; };
  }, []);
  if (error) return <p role="alert" className="p-8 text-center">{error}</p>;
  if (!grid) return <p className="p-8 text-center">Cargando mapa…</p>;
  return <section className="mx-auto max-w-[1500px] px-4 py-6" aria-readonly={readOnly}>
    <h2 className="mb-4 text-xl font-normal">Mapa Mesas</h2>
    <div className="overflow-auto">
      <div className="relative border bg-background" style={{ width: grid.width * 36, height: grid.height * 36 }}>
        {tables.map(table => {
          const pos = grid.positions[table.id];
          if (!pos) return null;
          const size = tableFootprint(table.modules);
          return <div key={table.id} className="absolute flex items-center justify-center overflow-hidden border bg-secondary p-2 text-center text-xs text-secondary-foreground" style={{ left: pos.x * 36, top: pos.y * 36, width: size.width * 36, height: size.height * 36 }}>
            <span>{table.name}<span className="block">{table.seats.filter(Boolean).length}/{table.seats.length}</span></span>
          </div>;
        })}
      </div>
    </div>
  </section>;
}