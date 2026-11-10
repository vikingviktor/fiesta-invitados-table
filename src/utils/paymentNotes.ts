export const normalizePaymentNote = (note: string | null | undefined) =>
  (note ?? '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('es');

export function paymentNoteOptions(notes: (string | null | undefined)[]) {
  const options = new Map<string, string>();
  notes.forEach(note => {
    const value = normalizePaymentNote(note);
    if (value && !options.has(value)) options.set(value, (note ?? '').trim().replace(/\s+/g, ' '));
  });
  return Array.from(options, ([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }));
}

// null = all notes; empty string = no note; other values = exact normalized note.
export const matchesPaymentNote = (note: string | null | undefined, filter: string | null) =>
  filter === null || normalizePaymentNote(note) === filter;