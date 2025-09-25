import React from "react";
import { ColorOption } from "@/types/guestTypes";

interface ColorDisplayProps {
  color?: ColorOption;
  size?: "sm" | "md" | "lg";
}

const colorMap: Record<ColorOption, string> = {
  verde: "#22c55e",
  azul: "#3b82f6",
  rojo: "#ef4444",
  amarillo: "#eab308",
  marron: "#a16207",
  morado: "#a855f7",
  gris: "#6b7280",
  negro: "#000000",
  blanco: "#ffffff",
  dorado: "#fbbf24",
  rosa: "#ec4899"
};

const ColorDisplay: React.FC<ColorDisplayProps> = ({ color, size = "sm" }) => {
  if (!color) return <span className="text-gray-400 text-xs">-</span>;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full border border-gray-300 flex-shrink-0`}
        style={{ backgroundColor: colorMap[color] }}
        title={color.charAt(0).toUpperCase() + color.slice(1)}
      />
      <span className="text-xs capitalize">{color}</span>
    </div>
  );
};

export default ColorDisplay;