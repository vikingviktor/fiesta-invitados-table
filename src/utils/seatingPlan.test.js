import { describe, expect, test } from 'bun:test';
import { capacity, hasAdultMenu, initialPlan, personDetails, planSchema, resizeTable, seatingCsv, swapSeats } from './seatingPlan';
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
  test('un niño con menú adulto sigue siendo niño y usa la variante de menú adulto', () => {
    const plan = initialPlan();
    const child = plan.flatMap(t => t.seats).find(p => p?.type === 'Niños');
    expect(child).toBeDefined();
    const adultChild = { ...child, adultMenu: true };
    expect(hasAdultMenu(adultChild)).toBe(true);
    expect(adultChild.type).toBe('Niños');
    expect(hasAdultMenu({ ...adultChild, adultMenu: false })).toBe(false);
    expect(hasAdultMenu({ ...adultChild, type: 'Amigos' })).toBe(false);
  });
  test('las etiquetas y el menú adulto sobreviven al guardado y al cambio de asiento', () => {
    const plan = initialPlan();
    plan[0].seats[0] = { name: 'Bebé', type: 'Niños', guestId: null, plusOne: false, adultMenu: true, tags: ['Lucía', 'Trona'] };
    const saved = planSchema.parse(JSON.parse(JSON.stringify(plan)));
    const moved = swapSeats(saved, { table: plan[0].id, seat: 0 }, { table: plan[4].id, seat: 0 });
    expect(moved[4].seats[0]?.tags).toEqual(['Lucía', 'Trona']);
    expect(moved[4].seats[0]?.adultMenu).toBe(true);
    expect(personDetails(moved[4].seats[0])).toBe('Menú adulto · Lucía · Trona');
  });
  test('la exportación incluye etiquetas y menú adulto', () => {
    const plan = initialPlan();
    plan[0].seats[0] = { name: 'Bebé', type: 'Niños', guestId: null, plusOne: false, adultMenu: true, tags: ['Lucía', 'Trona'] };
    expect(seatingCsv(plan)).toContain('"Bebé";"Niños";"Sí";"Lucía · Trona"');
  });
  test('el menú especial conserva categoría y restricciones al guardar y mover', () => {
    const plan = initialPlan();
    plan[0].seats[0] = { name: 'Lucía', type: 'Niños', guestId: null, plusOne: false, adultMenu: true, specialMenu: true, tags: ['Sin gluten'] };
    const saved = planSchema.parse(JSON.parse(JSON.stringify(plan)));
    const moved = swapSeats(saved, { table: plan[0].id, seat: 0 }, { table: plan[4].id, seat: 0 });
    expect(moved[4].seats[0]).toEqual(plan[0].seats[0]);
    expect(moved[4].seats[0]?.type).toBe('Niños');
    expect(hasAdultMenu(moved[4].seats[0])).toBe(true);
    expect(seatingCsv(moved)).toContain('"Lucía";"Niños";"Sí";"Sin gluten";"Sí"');
  });
  test('las etiquetas generales no activan menú especial automáticamente', () => {
    const person = planSchema.parse(initialPlan())[0].seats[0];
    expect(person?.specialMenu).toBeUndefined();
    expect(planSchema.parse([{ ...initialPlan()[0], seats: initialPlan()[0].seats.map(p => p ? { ...p, tags: ['Trona'], specialMenu: false } : p) }])[0].seats[0]?.specialMenu).toBe(false);
  });
});