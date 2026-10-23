import { z } from 'zod';
import type { SeatingTable } from './seatingPlan';

export const gridSchema = z.object({
  width: z.number().int().min(5).max(100),
  height: z.number().int().min(5).max(100),
  positions: z.record(z.object({ x: z.number().int().min(0), y: z.number().int().min(0) })),
});
export type SeatingGrid = z.infer<typeof gridSchema>;
export const tableFootprint = (modules: number) => ({ width: modules * 3 + 2, height: 3 });
export function canPlace(grid: SeatingGrid, tables: SeatingTable[], id: string, x: number, y: number) {
  const table = tables.find(t => t.id === id);
  if (!table || !Number.isInteger(x) || !Number.isInteger(y)) return false;
  const size = tableFootprint(table.modules);
  if (x < 0 || y < 0 || x + size.width > grid.width || y + size.height > grid.height) return false;
  return tables.every(t => {
    const pos = grid.positions[t.id];
    if (t.id === id || !pos) return true;
    const other = tableFootprint(t.modules);
    return x + size.width <= pos.x || pos.x + other.width <= x || y + size.height <= pos.y || pos.y + other.height <= y;
  });
}
export function reconcileGrid(input: SeatingGrid, tables: SeatingTable[]): SeatingGrid {
  const grid: SeatingGrid = { ...gridSchema.parse(input), positions: {} };
  for (const table of tables) {
    const old = input.positions[table.id];
    if (old && canPlace(grid, tables, table.id, old.x, old.y)) grid.positions[table.id] = old;
  }
  for (const table of tables) {
    if (grid.positions[table.id]) continue;
    let placed = false;
    for (let y = 0; y < grid.height && !placed; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (canPlace(grid, tables, table.id, x, y)) {
          grid.positions[table.id] = { x, y }; placed = true; break;
        }
      }
    }
    if (!placed) throw new Error('Las mesas no caben en esta cuadrícula. Aumenta su tamaño.');
  }
  return grid;
}