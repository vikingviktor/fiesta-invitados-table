
export type MenuOption = "normal" | "vegetariano" | "vegano" | "sin gluten";

export interface Guest {
  id: string;
  nombre: string;
  plusOne: boolean;
  menu: MenuOption;
  comentario: string;
  date: string;
}
