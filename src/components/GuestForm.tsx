
import React, { useState } from "react";
import { Guest, MenuOption } from "@/types/guest";
import { supabase } from "@/integrations/supabase/client";

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
  const [nombreAcompanante, setNombreAcompanante] = useState("");
  const [menu, setMenu] = useState<MenuOption>("normal");
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    if (!nombre.trim()) {
      setMensaje("Por favor, introduce tu nombre.");
      return;
    }
    if (plusOne && !nombreAcompanante.trim()) {
      setMensaje("Por favor, introduce el nombre de tu acompañante.");
      return;
    }
    setLoading(true);
    // Insertar en Supabase
    const nuevoInvitado: Omit<Guest, "id"> = {
      nombre,
      plusOne,
      nombreAcompanante: plusOne ? nombreAcompanante : undefined,
      menu,
      comentario,
      date: new Date().toISOString(),
    };
    const { data, error } = await supabase.from("guests").insert([
      {
        nombre: nuevoInvitado.nombre,
        plus_one: nuevoInvitado.plusOne,
        nombre_acompanante: nuevoInvitado.nombreAcompanante ?? null,
        menu: nuevoInvitado.menu,
        comentario: nuevoInvitado.comentario,
        date: nuevoInvitado.date,
      }
    ]).select().single();

    setLoading(false);
    if (error) {
      setMensaje("Ocurrió un error al registrar tu invitación. Por favor intenta de nuevo.");
      return;
    }
    if (onSubmit && data) {
      onSubmit({
        id: data.id,
        nombre: data.nombre,
        plusOne: data.plus_one,
        nombreAcompanante: data.nombre_acompanante ?? undefined,
        menu: data.menu,
        comentario: data.comentario ?? "",
        date: data.date,
      });
    }
    setMensaje("¡Registro enviado! Gracias por confirmar tu asistencia.");
    setNombre("");
    setPlusOne(false);
    setNombreAcompanante("");
    setMenu("normal");
    setComentario("");
    setTimeout(() => setMensaje(""), 3500);
  };

  return (
    <form
      className="bg-white border rounded-2xl shadow-md max-w-lg mx-auto p-8 flex flex-col gap-5"
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
          disabled={loading}
        />
      </div>
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-primary"
            checked={plusOne}
            onChange={e => {
              setPlusOne(e.target.checked);
              if (!e.target.checked) setNombreAcompanante("");
            }}
            disabled={loading}
          />
          ¿Llevo acompañante? (+1)
        </label>
      </div>
      {plusOne && (
        <div>
          <label className="block font-medium mb-1">Nombre del acompañante</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-primary"
            value={nombreAcompanante}
            onChange={e => setNombreAcompanante(e.target.value)}
            placeholder="Ej: Pedro López"
            maxLength={60}
            disabled={loading}
          />
        </div>
      )}
      <div>
        <label className="block font-medium mb-1">Menú preferido</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={menu}
          onChange={e => setMenu(e.target.value as MenuOption)}
          disabled={loading}
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
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white font-semibold py-2 rounded shadow hover:bg-primary/80 transition"
        disabled={loading}
      >
        {loading ? "Registrando..." : "Confirmar asistencia"}
      </button>
      {mensaje && (
        <div className={`rounded px-4 py-2 text-center mt-2 ${
            mensaje.includes("Gracias") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {mensaje}
        </div>
      )}
    </form>
  );
};

export default GuestForm;
