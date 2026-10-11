import { Guest } from "../types/guestTypes";
import { menuTranslation } from "./guestUtils";

// CSV compatible con Excel en español: BOM UTF-8, separador ; y saltos de línea CRLF
export const EXPORT_HEADERS = [
  "Nombre",
  "Nombre del +1",
  "Menú",
  "Menú del acompañante",
  "Niños",
  "Nº niños",
] as const;

const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export function buildGuestsCsv(guests: (Guest & { mesa?: string | null })[]): string {
  const rows = guests.map((g) => [
    g.nombre ?? "",
    g.plusOne ? g.nombreAcompanante ?? "" : "",
    menuTranslation[g.menu] ?? g.menu ?? "",
    g.menuAcompanante ? menuTranslation[g.menuAcompanante] ?? g.menuAcompanante : "",
    g.conNinos ? "Sí" : "No",
    g.conNinos ? g.numeroNinos ?? 0 : 0,
  ]);
  return "\uFEFF" + [EXPORT_HEADERS, ...rows].map((r) => r.map(cell).join(";")).join("\r\n") + "\r\n";
}

export function exportFilename(): string {
  return `invitados-${new Date().toISOString().slice(0, 10)}.csv`;
}
