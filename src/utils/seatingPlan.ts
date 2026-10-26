import { z } from 'zod';
import proposal from '@/data/seatingProposal4.json';

export const PERSON_TYPES = ['Novios', 'Familia V', 'Familia S', 'Amigos', 'Niños', 'Otros'] as const;
export const personSchema = z.object({ name: z.string().trim().min(1).max(200), type: z.enum(PERSON_TYPES), guestId: z.string().nullable(), plusOne: z.boolean() });
export const TABLE_COLORS = ['#f4d03f', '#aed6f1', '#f5b7b1', '#abebc6', '#f5cba7', '#d7bde2', '#a2d9ce', '#f9e79f', '#d5dbdb', '#f0b27a', '#85c1e9', '#f1948a'] as const;
export const tableSchema = z.object({ id: z.string(), name: z.string().trim().min(1).max(200), modules: z.number().int().min(1).max(10), color: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable().default(null), seats: z.array(personSchema.nullable()) }).refine(t => t.seats.length === capacity(t.modules));
export const planSchema = z.array(tableSchema);
export type SeatingPerson = z.infer<typeof personSchema>;
export type SeatingTable = z.infer<typeof tableSchema>;
export type SeatPosition = { table: string; seat: number };
export const capacity = (modules: number) => modules * 6 + 2;
export const normalizeName = (name: string) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
export const initialPlan = () => planSchema.parse(structuredClone(proposal));
export const seatLabel = (seat: number) => seat === 0 ? 'Cabecera izquierda' : seat === 1 ? 'Cabecera derecha' : `${seat % 2 === 0 ? 'Lado superior' : 'Lado inferior'} ${Math.floor((seat - 2) / 2) + 1}`;
export function swapSeats(plan: SeatingTable[], from: SeatPosition, to: SeatPosition) {
  const next = structuredClone(plan);
  const a = next.find(t => t.id === from.table);
  const b = next.find(t => t.id === to.table);
  if (!a || !b || from.seat < 0 || to.seat < 0 || from.seat >= a.seats.length || to.seat >= b.seats.length) throw new Error('Asiento inválido');
  const person = a.seats[from.seat];
  a.seats[from.seat] = b.seats[to.seat];
  b.seats[to.seat] = person;
  return next;
}
export function resizeTable(table: SeatingTable, modules: number): SeatingTable {
  const size = capacity(modules);
  if (table.seats.slice(size).some(Boolean)) throw new Error('Hay personas en los asientos que se eliminarían. Muévelas primero.');
  return tableSchema.parse({ ...table, modules, seats: Array.from({ length: size }, (_, i) => table.seats[i] ?? null) });
}
export function seatingCsv(plan: SeatingTable[]) {
  const rows = [['Mesa', 'Posición', 'Invitado', 'Tipo']];
  plan.forEach(t => t.seats.forEach((p, i) => rows.push([t.name, seatLabel(i), p?.name ?? '', p?.type ?? ''])));
  return '\ufeff' + rows.map(r => r.map(v => '"' + v.replace(/"/g, '""') + '"').join(';')).join('\r\n');
}