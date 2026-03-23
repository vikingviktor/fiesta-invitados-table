
import React from "react";
import { MenuOption } from "@/types/guestTypes";
import { useLanguage } from "@/contexts/LanguageContext";

const menuOptionValues: MenuOption[] = ["normal", "vegetariano", "vegano", "sin gluten", "otro"];

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
}) => {
  const { t } = useLanguage();

  return (
    <div>
      <label className="block mb-1 font-cinzel text-xl">{label}</label>
      <select
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={e => onChange(e.target.value as MenuOption)}
        disabled={disabled}
      >
        {menuOptionValues.map(val => (
          <option value={val} key={val}>{t(`form.menu.${val}`)}</option>
        ))}
      </select>
    </div>
  );
};

export default MenuSelector;
