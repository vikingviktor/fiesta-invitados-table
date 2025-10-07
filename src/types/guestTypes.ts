
// Antes:
// export type MenuOption = "normal" | "vegetariano" | "vegano" | "sin gluten";
// Después:
export type MenuOption = string;

export type ColorOption = "verde" | "azul" | "rojo" | "amarillo" | "marron" | "morado" | "gris" | "negro" | "blanco" | "dorado" | "rosa";

export interface Guest {
  id: string;
  nombre: string;
  plusOne: boolean;
  nombreAcompanante?: string;
  menu: MenuOption;
  comentario: string;
  date: string;
  cancionFavorita?: string; // nuevo campo opcional
  consentimientoPublicacion: boolean; // nuevo campo obligatorio
  menuAcompanante?: MenuOption; // NUEVO campo opcional
  color?: ColorOption; // nuevo campo opcional para color del invitado
  colorAcompanante?: ColorOption; // nuevo campo opcional para color del acompañante
  habitacion?: string; // nuevo campo opcional para habitación
}
