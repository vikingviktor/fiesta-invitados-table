
import React from "react";

interface TextareaInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

const TextareaInput: React.FC<TextareaInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  maxLength,
}) => (
  <div>
    <label className="block font-medium mb-1 font-antiqua text-2xl">{label}</label>
    <textarea
      className="w-full border rounded px-3 py-2 min-h-[80px]"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
    />
  </div>
);

export default TextareaInput;
