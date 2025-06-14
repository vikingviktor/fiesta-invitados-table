
import React, { useState } from "react";
import { Guest, MenuOption } from "@/types/guest";

const menuOptions: { label: string; value: MenuOption }[] = [
  { label: "Normal", value: "normal" },
  { label: "Vegetariano", value: "vegetariano" },
  { label: "Vegano", value: "vegano" },
  { label: "Sin gluten", value: "sin gluten" },
];

interface GuestFormProps {
  onSubmit?: (guest: Guest) => void;
}

const GuestForm: React.FC<GuestFormProps> = ({ onSubmit }) => {
  const [nombre, setNombre] = useState("");
  const [plusOne, setPlusOne] = useState(false);
  const [menu, setMenu] = useState<MenuOption>("normal");
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState("");

  const saveToLocalStorage = (guest: Guest) => {
    const list = JSON.parse(localStorage.getItem("guests") || "[]");
    localStorage.setItem("guests", JSON.stringify([...list, guest]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setMensaje("Por favor, introduce tu nombre.");
      return;
    }
    const guest: Guest = {
      id: Date.now().toString(),
      nombre,
      plusOne,
      menu,
      comentario,
      date: new Date().toISOString(),
    };
    saveToLocalStorage(guest);
    if (onSubmit) onSubmit(guest);
    setMensaje("¡Registro enviado! Gracias por confirmar tu asistencia.");
    setNombre("");
    setPlusOne(false);
    setMenu("normal");
    setComentario("");
    setTimeout(() => setMensaje(""), 3500);
  };

  return (
    <form
      className="bg-white border rounded-2xl shadow-md max-w-lg mx-auto p-8
      flex flex-col gap-5"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold mb-2 text-center">Confirma tu asistencia</h2>
      <div>
        <label className="block font-medium mb-1">Nombre completo</label>
        <input
          className="w-full border rounded px-3 py-2 focus:outline-primary"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
          placeholder="Ej: Ana García"
          maxLength={60}
        />
      </div>
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-primary"
            checked={plusOne}
            onChange={e => setPlusOne(e.target.checked)}
          />
          ¿Llevo acompañante? (+1)
        </label>
      </div>
      <div>
        <label className="block font-medium mb-1">Menú preferido</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={menu}
          onChange={e => setMenu(e.target.value as MenuOption)}
        >
          {menuOptions.map(opt => (
            <option value={opt.value} key={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Comentarios/adicionales</label>
        <textarea
          className="w-full border rounded px-3 py-2 min-h-[80px]"
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          placeholder="¿Alguna alergia, petición o mensaje para los novios?"
          maxLength={200}
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white font-semibold py-2 rounded shadow hover:bg-primary/80 transition"
      >
        Confirmar asistencia
      </button>
      {mensaje && (
        <div className="rounded bg-green-100 text-green-800 px-4 py-2 text-center mt-2">
          {mensaje}
        </div>
      )}
    </form>
  );
};

export default GuestForm;
