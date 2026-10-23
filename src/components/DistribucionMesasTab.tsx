import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Pencil, Plus, Printer, RotateCcw, Search, Trash2, Undo2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { capacity, initialPlan, normalizeName, PERSON_TYPES, planSchema, resizeTable, seatLabel, seatingCsv, swapSeats, type SeatingPerson, type SeatingTable, type SeatPosition } from '@/utils/seatingPlan';
import type { Json } from '@/integrations/supabase/types';

const typeClass: Record<string, string> = { Novios: 'seat-newlyweds', 'Familia V': 'seat-family-v', 'Familia S': 'seat-family-s', Amigos: 'seat-friends', Niños: 'seat-children', Otros: 'seat-other' };
type PersonOption = SeatingPerson & { detail: string };

export default function DistribucionMesasTab({ readOnly = false }: { readOnly?: boolean }) {
  const [plan, setPlan] = useState<SeatingTable[]>([]);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [people, setPeople] = useState<PersonOption[]>([]);
  const [selected, setSelected] = useState<SeatPosition | null>(null);
  const [moving, setMoving] = useState<SeatPosition | null>(null);
  const [personSearch, setPersonSearch] = useState('');
  const [personType, setPersonType] = useState<SeatingPerson['type']>('Otros');
  const [edit, setEdit] = useState<SeatingTable | null>(null);
  const [history, setHistory] = useState<SeatingTable[][]>([]);
  const drag = useRef<SeatPosition | null>(null);
  const busy = useRef(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    const { data, error: err } = await supabase.from('wedding_seating_plan').select('layout,revision').eq('id', 'official').maybeSingle();
    if (err || !data) { setError('No se ha podido abrir la distribución guardada.'); setLoading(false); return; }
    const parsed = planSchema.safeParse(data.layout);
    if (!parsed.success) { setError('La distribución guardada no tiene un formato válido.'); setLoading(false); return; }
    setPlan(parsed.data); setRevision(data.revision); setHistory([]); setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    let active = true;
    const loadPeople = async () => {
      const options: PersonOption[] = [];
      for (let offset = 0; ; offset += 1000) {
        const { data, error: err } = await supabase.from('guests').select('id,nombre,nombre_acompanante,plus_one').order('id').range(offset, offset + 999);
        if (err) { toast({ title: 'No se pudo cargar la lista de invitados', variant: 'destructive' }); break; }
        for (const guest of data ?? []) {
          options.push({ name: guest.nombre, guestId: guest.id, plusOne: false, type: 'Otros', detail: 'Invitado' });
          if (guest.plus_one) options.push({ name: guest.nombre_acompanante || `+1 de ${guest.nombre}`, guestId: guest.id, plusOne: true, type: 'Otros', detail: `+1 de ${guest.nombre}` });
        }
        if ((data?.length ?? 0) < 1000) break;
      }
      if (active) setPeople(options);
    };
    void loadPeople(); return () => { active = false; };
  }, []);

  const save = async (next: SeatingTable[], recordHistory = true) => {
    if (readOnly || busy.current) return false;
    const parsed = planSchema.safeParse(next);
    if (!parsed.success) { toast({ title: 'Distribución inválida', variant: 'destructive' }); return false; }
    busy.current = true; setSaving(true);
    try {
      const { data, error: err } = await supabase.from('wedding_seating_plan').update({ layout: parsed.data as unknown as Json, revision: revision + 1 }).eq('id', 'official').eq('revision', revision).select('revision');
      if (err) throw err;
      if (!data?.length) { toast({ title: 'Otra sesión ha cambiado el mapa', description: 'Se ha recargado la última distribución; vuelve a intentar el cambio.', variant: 'destructive' }); await load(); return false; }
      if (recordHistory) setHistory(h => [...h.slice(-19), structuredClone(plan)]);
      setPlan(parsed.data); setRevision(data[0].revision); return true;
    } catch { toast({ title: 'No se ha guardado el cambio', description: 'La distribución anterior se conserva. Comprueba tu conexión y sesión.', variant: 'destructive' }); return false; }
    finally { busy.current = false; setSaving(false); }
  };
  const exchange = async (from: SeatPosition, to: SeatPosition) => {
    if (from.table === to.table && from.seat === to.seat) { setMoving(null); return; }
    if (await save(swapSeats(plan, from, to))) { setMoving(null); setSelected(null); }
  };
  const place = async (person: SeatingPerson | null) => {
    if (!selected) return;
    const next = structuredClone(plan); const table = next.find(t => t.id === selected.table);
    if (!table) return;
    if (person && next.some(t => t.seats.some((p, i) => p && !(t.id === selected.table && i === selected.seat) && (normalizeName(p.name) === normalizeName(person.name) || (person.guestId && p.guestId === person.guestId && p.plusOne === person.plusOne))))) {
      toast({ title: 'Esta persona ya tiene asiento', description: 'Selecciona su asiento para moverla.', variant: 'destructive' }); return;
    }
    table.seats[selected.seat] = person;
    if (await save(next)) setSelected(null);
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([seatingCsv(plan)], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'mesas-boda.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const editSave = async () => {
    if (!edit) return;
    try {
      const existing = plan.find(t => t.id === edit.id);
      const updated = existing ? { ...resizeTable(existing, edit.modules), name: edit.name.trim() } : resizeTable(edit, edit.modules);
      if (await save(existing ? plan.map(t => t.id === edit.id ? updated : t) : [...plan, updated])) setEdit(null);
    } catch (e) { toast({ title: e instanceof Error ? e.message : 'Mesa inválida', variant: 'destructive' }); }
  };
  const selectedTable = plan.find(t => t.id === selected?.table);
  const selectedPerson = selected && selectedTable ? selectedTable.seats[selected.seat] : null;
  const q = normalizeName(search);
  const occupied = plan.flatMap(t => t.seats).filter((p): p is SeatingPerson => p !== null);
  const options = people.filter(p => !occupied.some(s => normalizeName(s.name) === normalizeName(p.name) || (s.guestId === p.guestId && s.plusOne === p.plusOne))).filter(p => normalizeName(p.name + ' ' + p.detail).includes(normalizeName(personSearch))).slice(0, 50);

  const seat = (table: SeatingTable, index: number) => {
    const p = table.seats[index]; const pos = { table: table.id, seat: index };
    const isMoving = moving?.table === table.id && moving.seat === index;
    return <Button key={index} variant="outline" className={`long-seat ${p ? typeClass[p.type] : 'seat-empty'} ${q && p && normalizeName(p.name).includes(q) ? 'seat-match' : ''} ${isMoving ? 'seat-selected' : ''}`} title={`${seatLabel(index)} · ${p?.name ?? 'Libre'}`} aria-label={`${table.name}, ${seatLabel(index)}: ${p?.name ?? 'Libre'}`} disabled={saving}
      draggable={!readOnly && !saving && !!p}
      onDragStart={e => { drag.current = pos; e.dataTransfer.setData('text/plain', JSON.stringify(pos)); e.dataTransfer.effectAllowed = 'move'; }} onDragEnd={() => { drag.current = null; }}
      onDragOver={e => { if (!readOnly && drag.current) e.preventDefault(); }}
      onDrop={e => { e.preventDefault(); if (!readOnly && drag.current) void exchange(drag.current, pos); drag.current = null; }}
      onClick={() => { if (moving && !readOnly) void exchange(moving, pos); else { setSelected(pos); setPersonSearch(''); setPersonType(p?.type ?? 'Otros'); } }}>
      <span>{p?.name ?? 'Libre'}</span>
    </Button>;
  };

  if (loading) return <p className="p-8 text-center">Cargando distribución...</p>;
  if (error) return <div className="p-8 text-center space-y-4"><p role="alert">{error}</p><Button onClick={load}>Reintentar</Button></div>;

  return <div className="seating-plan mx-auto w-full max-w-[1500px] px-4 py-6">
    <header className="seating-toolbar flex flex-wrap items-center gap-3 mb-5">
      <div className="mr-auto"><h2 className="text-xl font-normal">Distribucion mesas</h2><p className="text-sm text-muted-foreground" aria-live="polite">{occupied.length} personas · {plan.reduce((n, t) => n + t.seats.length, 0) - occupied.length} plazas libres · {saving ? 'Guardando…' : 'Guardado'}</p></div>
      <label className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Buscar persona en las mesas" placeholder="Buscar persona…" className="pl-9 w-60" value={search} onChange={e => setSearch(e.target.value)} /></label>
      <Button variant="outline" size="icon" title="Descargar CSV" aria-label="Descargar CSV" onClick={download}><Download /></Button>
      <Button variant="outline" size="icon" title="Imprimir" aria-label="Imprimir" onClick={() => window.print()}><Printer /></Button>
      {!readOnly && <><Button variant="outline" size="icon" title="Deshacer" aria-label="Deshacer" disabled={!history.length || saving} onClick={async () => { const previous = history[history.length - 1]; if (previous && await save(previous, false)) setHistory(h => h.slice(0, -1)); }}><Undo2 /></Button>
      <Button variant="outline" size="icon" title="Restaurar propuesta 4" aria-label="Restaurar propuesta 4" disabled={saving} onClick={() => { if (window.confirm('¿Restaurar la propuesta 4 del HTML? Se reemplazará la distribución actual.')) void save(initialPlan()); }}><RotateCcw /></Button>
      <Button onClick={() => setEdit({ id: crypto.randomUUID(), name: `Mesa ${plan.length + 1}`, modules: 1, seats: Array(8).fill(null) })} disabled={saving}><Plus />Añadir mesa</Button></>}
    </header>
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs mb-5">{PERSON_TYPES.map(type => <span key={type} className="inline-flex items-center gap-2"><i className={`seat-swatch ${typeClass[type]}`} />{type} ({occupied.filter(p => p.type === type).length})</span>)}</div>
    {moving && <div className="seating-toolbar flex items-center gap-3 mb-4 text-sm"><span>Moviendo: {plan.find(t => t.id === moving.table)?.seats[moving.seat]?.name}</span><Button variant="ghost" size="icon" title="Cancelar movimiento" aria-label="Cancelar movimiento" onClick={() => setMoving(null)}><X /></Button></div>}
    <main className="space-y-5">{plan.map(table => {
      const count = table.seats.filter(Boolean).length;
      return <section key={table.id} className="long-table-section border-b pb-5" aria-label={table.name}>
        <div className="flex flex-wrap items-center gap-2 mb-3"><h3 className="text-sm font-normal mr-auto">{table.name}</h3><span className="text-xs text-muted-foreground">{table.modules} mesas unidas · {count}/{table.seats.length} · {table.seats.length - count} libres</span>{!readOnly && <Button variant="ghost" size="icon" className="size-8" title={`Editar ${table.name}`} aria-label={`Editar ${table.name}`} onClick={() => setEdit(structuredClone(table))}><Pencil /></Button>}</div>
        <div className="long-table-scroll"><div className="long-table-layout">{seat(table, 0)}<div className="long-table-middle"><div className="long-table-row">{Array.from({ length: table.modules * 3 }, (_, i) => seat(table, 2 + i * 2))}</div><div className="long-table-surface">{Array.from({ length: table.modules }, (_, i) => <span key={i} className="long-table-module" />)}</div><div className="long-table-row">{Array.from({ length: table.modules * 3 }, (_, i) => seat(table, 3 + i * 2))}</div></div>{seat(table, 1)}</div></div>
      </section>;
    })}</main>

    <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent><DialogHeader><DialogTitle>{selectedPerson?.name ?? 'Asignar persona'}</DialogTitle></DialogHeader>
      <p className="text-xs text-muted-foreground">{selectedTable?.name} · {selected ? seatLabel(selected.seat) : ''}</p>
      {selectedPerson ? <><p className="text-sm">{selectedPerson.type}</p>{!readOnly && <><Button onClick={() => { setMoving(selected); setSelected(null); }}>Mover / intercambiar</Button><Button variant="destructive" disabled={saving} onClick={() => place(null)}><Trash2 />Quitar de este asiento</Button></>}</> : !readOnly && <>
      <Input autoFocus aria-label="Buscar invitado o acompañante" placeholder="Buscar invitado o +1 / escribir nombre" value={personSearch} onChange={e => setPersonSearch(e.target.value)} maxLength={200} />
      <label className="text-sm">Categoría<select aria-label="Categoría de persona" className="seating-select mt-1" value={personType} onChange={e => setPersonType(e.target.value as SeatingPerson['type'])}>{PERSON_TYPES.map(t => <option key={t}>{t}</option>)}</select></label>
      <div className="max-h-64 overflow-y-auto flex flex-col gap-1">{options.map(p => <Button variant="ghost" key={`${p.guestId}-${p.plusOne}`} className="h-auto whitespace-normal text-left justify-between" disabled={saving} onClick={() => place({ name: p.name, guestId: p.guestId, plusOne: p.plusOne, type: personType })}><span>{p.name}</span><span className="text-xs text-muted-foreground">{p.detail}</span></Button>)}{!options.length && <p className="text-sm text-muted-foreground">Sin personas disponibles.</p>}</div>
      {personSearch.trim() && <Button disabled={saving} variant="outline" className="whitespace-normal h-auto" onClick={() => place({ name: personSearch.trim(), guestId: null, plusOne: false, type: personType })}><Plus />Añadir «{personSearch.trim()}»</Button>}
      </>}
    </DialogContent></Dialog>
    <Dialog open={!!edit} onOpenChange={open => { if (!open) setEdit(null); }}><DialogContent><DialogHeader><DialogTitle>{plan.some(t => t.id === edit?.id) ? 'Editar mesa' : 'Añadir mesa'}</DialogTitle></DialogHeader>{edit && <>
      <label className="text-sm">Nombre<Input aria-label="Nombre de mesa" value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} maxLength={200} /></label>
      <label className="text-sm">Mesas unidas<Input aria-label="Número de mesas unidas" type="number" min={1} max={10} value={edit.modules} onChange={e => setEdit({ ...edit, modules: Number(e.target.value) })} /></label><p className="text-sm text-muted-foreground">{capacity(edit.modules)} plazas</p>
      <Button disabled={saving} onClick={editSave}>Guardar mesa</Button>
      {plan.some(t => t.id === edit.id) && <Button variant="destructive" disabled={saving} onClick={async () => { if (edit.seats.some(Boolean)) { toast({ title: 'La mesa tiene personas asignadas', description: 'Muévelas o quítalas antes de eliminar la mesa.', variant: 'destructive' }); return; } if (window.confirm('¿Eliminar esta mesa vacía?') && await save(plan.filter(t => t.id !== edit.id))) setEdit(null); }}><Trash2 />Eliminar mesa</Button>}
    </>}</DialogContent></Dialog>
  </div>;
}