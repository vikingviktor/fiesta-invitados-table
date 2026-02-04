import React from "react";
import { ColorOption } from "@/types/guestTypes";

interface ColorSelectorProps {
  label: string;
  value?: ColorOption;
  onChange: (color: ColorOption) => void;
  disabled?: boolean;
  required?: boolean;
}

const colorMap: Record<ColorOption, string> = {
  verde: "#a7f3d0",
  azul: "#bfdbfe",
  rojo: "#fecaca",
  amarillo: "#fef08a",
  marron: "#d8b4a0",
  morado: "#e9d5ff",
  gris: "#d1d5db",
  negro: "#6b7280",
  blanco: "#ffffff",
  dorado: "#fde68a",
  rosa: "#fbcfe8"
};

const ColorSelector: React.FC<ColorSelectorProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
}) => {
  const colors: ColorOption[] = ["verde", "azul", "rojo", "amarillo", "marron", "morado", "gris", "negro", "blanco", "dorado", "rosa"];

  return (
    <div>
      <label className="block text-2xl font-medium text-gray-700 mb-2 font-elvish">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-6 gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            disabled={disabled}
            className={`
              w-8 h-8 rounded-full border-2 relative transition-all duration-200
              ${value === color 
                ? "border-gray-800 scale-110 shadow-lg" 
                : "border-gray-300 hover:border-gray-500 hover:scale-105"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${color === "blanco" ? "border-gray-400" : ""}
            `}
            style={{ backgroundColor: colorMap[color] }}
            title={color.charAt(0).toUpperCase() + color.slice(1)}
          >
            {value === color && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${
                  color === "blanco" || color === "amarillo" || color === "dorado" 
                    ? "bg-gray-800" 
                    : "bg-white"
                }`} />
              </div>
            )}
          </button>
        ))}
      </div>
      {value && (
        <p className="text-xs text-gray-500 mt-1 capitalize">
          Seleccionado: {value}
        </p>
      )}
    </div>
  );
};

export default ColorSelector;