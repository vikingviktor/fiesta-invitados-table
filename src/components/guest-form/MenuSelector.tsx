
import React from "react";
import { MenuOption } from "@/types/guestTypes";

const menuOptions: { label: string; value: MenuOption }[] = [
  { label: "Normal", value: "normal" },
  { label: "Vegetariano", value: "vegetariano" },
  { label: "Vegano", value: "vegano" },
  { label: "Sin gluten", value: "sin gluten" },
];

interface MenuSelectorProps {
  label: string;
  value: MenuOption;
  onChange: (v: MenuOption) => void;
  disabled?: boolean;
}

const MenuSelector: React.FC<MenuSelectorProps> = ({
  label,
  value,
  onChange,
  disabled = false,
}) => (
  <div>
    <label className="block mb-1 font-cinzel text-xl">{label}</label>
    <select
      className="w-full border rounded px-3 py-2"
      value={value}
      onChange={e => onChange(e.target.value as MenuOption)}
      disabled={disabled}
    >
      {menuOptions.map(opt => (
        <option value={opt.value} key={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default MenuSelector;
