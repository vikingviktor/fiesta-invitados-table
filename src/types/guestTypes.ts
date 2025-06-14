
export type MenuOption = "normal" | "vegetariano" | "vegano" | "sin gluten";

export interface Guest {
  id: string;
  nombre: string;
  plusOne: boolean;
  nombreAcompanante?: string;
  menu: MenuOption;
  comentario: string;
  date: string;
}
