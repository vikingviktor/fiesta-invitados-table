
import { Guest, MenuOption, ColorOption } from "../types/guestTypes";

// Función para transformar de snake_case a camelCase
export function mapDbGuestToGuest(dbGuest: any): Guest & { mesa?: number | null } {
  return {
    id: dbGuest.id,
    nombre: dbGuest.nombre,
    plusOne: dbGuest.plus_one,
    nombreAcompanante: dbGuest.nombre_acompanante ?? "",
    menu: dbGuest.menu,
    comentario: dbGuest.comentario ?? "",
    date: dbGuest.date,
    cancionFavorita: dbGuest.cancion_favorita ?? "",
    mesa: dbGuest.mesa ?? null,
    consentimientoPublicacion: !!dbGuest.consentimiento_publicacion,
    menuAcompanante: dbGuest.menu_acompanante ?? undefined, // NUEVO
    color: dbGuest.color as ColorOption ?? undefined,
    colorAcompanante: dbGuest.color_acompanante as ColorOption ?? undefined,
    habitacion: dbGuest.habitacion ?? undefined,
    conNinos: !!dbGuest.con_ninos,
    numeroNinos: dbGuest.numero_ninos ?? 0,
    comentariosNinos: dbGuest.comentarios_ninos ?? undefined,
    pernoctaSabado: !!dbGuest.pernocta_sabado,
    email: dbGuest.email ?? undefined,
  };
}

// Contador de asistentes y menús
export function getGuestMenuCounts(guests: (Guest & { mesa?: number | null })[]) {
  return guests.reduce(
    (acc, g) => {
      acc["total"] += 1 + (g.plusOne ? 1 : 0);
      // Contar el menú del invitado
      acc[g.menu] = (acc[g.menu] || 0) + 1;
      // Contar el menú del acompañante (usa su propio menú si existe, si no, el del invitado)
      if (g.plusOne) {
        const companionMenu = g.menuAcompanante || g.menu;
        acc[companionMenu] = (acc[companionMenu] || 0) + 1;
      }
      return acc;
    },
    { total: 0, normal: 0, vegetariano: 0, vegano: 0, "sin gluten": 0, otro: 0 } as Record<string, number>
  );
}

// Traducción de menús
export const menuTranslation: Record<string, string> = {
  normal: "Normal",
  vegetariano: "Vegetariano",
  vegano: "Vegano",
  "sin gluten": "Sin gluten",
  otro: "Otro",
};
