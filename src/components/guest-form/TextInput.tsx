
import React from "react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  type?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  type = "text",
}) => (
  <div>
    <label className="block font-medium mb-1 font-antiqua text-2xl">{label}</label>
    <input
      type={type}
      className="w-full border rounded px-3 py-2 focus:outline-primary"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      maxLength={maxLength}
    />
  </div>
);

export default TextInput;
