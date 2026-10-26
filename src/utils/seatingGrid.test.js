import { describe, expect, test } from 'bun:test';
import { canPlace, reconcileGrid, tableFootprint } from './seatingGrid';

const tables = [
  { id: 'a', name: 'A', modules: 2, seats: Array(14).fill(null) },
  { id: 'b', name: 'B', modules: 3, seats: Array(20).fill(null) },
];
const grid = { width: 30, height: 20, positions: { a: { x: 0, y: 0 }, b: { x: 0, y: 5 } } };

describe('Giro de mesas en la cuadrícula', () => {
  test('una mesa de 2 módulos mide 8x3 en horizontal y 3x8 girada', () => {
    expect(tableFootprint(2, 0)).toEqual({ width: 8, height: 3 });
    expect(tableFootprint(2, 90)).toEqual({ width: 3, height: 8 });
  });
  test('girar una mesa respeta los límites de la cuadrícula', () => {
    expect(canPlace(grid, tables, 'a', 27, 0, 90)).toBe(true);
    expect(canPlace(grid, tables, 'a', 28, 0, 90)).toBe(false);
    expect(canPlace(grid, tables, 'a', 0, 13, 90)).toBe(false);
  });
  test('una mesa girada no puede solaparse con otra', () => {
    expect(canPlace(grid, tables, 'b', 0, 1, 90)).toBe(false);
    expect(canPlace(grid, tables, 'b', 4, 1, 90)).toBe(true);
  });
  test('reconcileGrid conserva el giro guardado', () => {
    const input = { width: 30, height: 20, positions: { a: { x: 0, y: 0, rotation: 90 }, b: { x: 10, y: 0 } } };
    const out = reconcileGrid(input, tables);
    expect(out.positions.a.rotation).toBe(90);
    expect(out.positions.b).toEqual({ x: 10, y: 0 });
  });
});
