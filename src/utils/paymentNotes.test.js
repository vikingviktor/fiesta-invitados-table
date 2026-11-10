import { describe, expect, test } from 'bun:test';
import { matchesPaymentNote, paymentNoteOptions } from './paymentNotes';

describe('Filtro por nota de pago', () => {
  test('ofrece Transferencia, Bizum y cualquier nota personalizada sin duplicar mayúsculas o espacios', () => {
    expect(paymentNoteOptions(['Transferencia', 'Bizum', ' bizum ', 'Efectivo', null, ' '])).toEqual([
      { value: 'bizum', label: 'Bizum' },
      { value: 'efectivo', label: 'Efectivo' },
      { value: 'transferencia', label: 'Transferencia' },
    ]);
  });
  test('seleccionar Transferencia excluye Bizum y notas distintas', () => {
    expect(['Transferencia', ' transferencia ', 'Bizum', 'Transferencia parcial', null].filter(note => matchesPaymentNote(note, 'transferencia'))).toEqual(['Transferencia', ' transferencia ']);
  });
  test('permite todas las notas y solo registros sin nota', () => {
    expect(matchesPaymentNote('Bizum', null)).toBe(true);
    expect(matchesPaymentNote(null, '')).toBe(true);
    expect(matchesPaymentNote(' ', '')).toBe(true);
    expect(matchesPaymentNote('Bizum', '')).toBe(false);
  });
});