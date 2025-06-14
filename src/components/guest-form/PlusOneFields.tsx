
import React from "react";
import TextInput from "./TextInput";
import MenuSelector from "./MenuSelector";
import { MenuOption } from "@/types/guestTypes";

interface PlusOneFieldsProps {
  nombreAcompanante: string;
  onNombreAcompananteChange: (v: string) => void;
  menuAcompanante: MenuOption;
  onMenuAcompananteChange: (v: MenuOption) => void;
  disabled?: boolean;
}

const PlusOneFields: React.FC<PlusOneFieldsProps> = ({
  nombreAcompanante,
  onNombreAcompananteChange,
  menuAcompanante,
  onMenuAcompananteChange,
  disabled = false,
}) => (
  <>
    <TextInput
      label="Nombre del acompañante"
      value={nombreAcompanante}
      onChange={onNombreAcompananteChange}
      placeholder="Ej: Pedro López"
      maxLength={60}
      disabled={disabled}
    />
    <MenuSelector
      label="Menú del acompañante"
      value={menuAcompanante}
      onChange={onMenuAcompananteChange}
      disabled={disabled}
    />
  </>
);

export default PlusOneFields;
