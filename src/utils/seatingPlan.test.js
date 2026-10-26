import { describe, expect, test } from 'bun:test';
import { capacity, initialPlan, resizeTable, swapSeats } from './seatingPlan';
describe('Mesas de tres personas por lado y dos cabeceras', () => {
  test('un módulo tiene 8 plazas', () => expect(capacity(1)).toBe(8));
  test('dos módulos unidos tienen 14 plazas', () => expect(capacity(2)).toBe(14));
  test('tres módulos unidos tienen 20 plazas', () => expect(capacity(3)).toBe(20));
  test('se respeta la propuesta 4 del HTML, no el CSV', () => {
    const plan = initialPlan();
    expect(plan.map(t => t.seats.length)).toEqual([14,20,20,20,14,20]);
    expect(plan.flatMap(t => t.seats).filter(Boolean)).toHaveLength(105);
    expect(plan[0].seats[2]?.name).toBe('Beatriz Rubio Alonso');
    expect(plan[0].color).toBeNull();
    expect(plan[2].seats[1]?.name).toBe('Carla');
  });
  test('intercambia personas entre mesas sin perderlas', () => {
    const p = initialPlan(); const next = swapSeats(p, { table: p[0].id, seat: 0 }, { table: p[4].id, seat: 0 });
    expect(next[4].seats[0]?.name).toBe('Jose Quintana'); expect(next[0].seats[0]).toBeNull();
    expect(p[0].seats[0]?.name).toBe('Jose Quintana');
  });
  test('no permite quitar un módulo ocupado', () => expect(() => resizeTable(initialPlan()[0], 1)).toThrow());
});