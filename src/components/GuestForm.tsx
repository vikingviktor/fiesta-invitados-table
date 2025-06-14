
import React, { useState } from "react";
import { Guest, MenuOption } from "@/types/guestTypes";
import { supabase } from "@/integrations/supabase/client";
import TextInput from "./guest-form/TextInput";
import TextareaInput from "./guest-form/TextareaInput";
import MenuSelector from "./guest-form/MenuSelector";
import PlusOneFields from "./guest-form/PlusOneFields";

interface GuestFormProps {
  onSubmit?: (guest: Guest) => void;
}

const GuestForm: React.FC<GuestFormProps> = ({ onSubmit }) => {
  const [nombre, setNombre] = useState("");
  const [plusOne, setPlusOne] = useState(false);
  const [nombreAcompanante, setNombreAcompanante] = useState("");
  const [menu, setMenu] = useState<MenuOption>("normal");
  const [comentario, setComentario] = useState("");
  const [cancionFavorita, setCancionFavorita] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [consentimientoPublicacion, setConsentimientoPublicacion] = useState(false);
  const [menuAcompanante, setMenuAcompanante] = useState<MenuOption>("normal");

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
    if (!consentimientoPublicacion) {
      setMensaje("Debes aceptar el consentimiento para salir en fotos/vídeos.");
      return;
    }
    setLoading(true);
    const nuevoInvitado: Omit<Guest, "id"> = {
      nombre,
      plusOne,
      nombreAcompanante: plusOne ? nombreAcompanante : undefined,
      menu,
      comentario,
      date: new Date().toISOString(),
      cancionFavorita: cancionFavorita.trim() || undefined,
      consentimientoPublicacion,
      menuAcompanante: plusOne ? menuAcompanante : undefined,
    };
    const { data, error } = await supabase.from("guests").insert([
      {
        nombre: nuevoInvitado.nombre,
        plus_one: nuevoInvitado.plusOne,
        nombre_acompanante: nuevoInvitado.nombreAcompanante ?? null,
        menu: nuevoInvitado.menu,
        comentario: nuevoInvitado.comentario,
        date: nuevoInvitado.date,
        cancion_favorita: nuevoInvitado.cancionFavorita ?? null,
        consentimiento_publicacion: nuevoInvitado.consentimientoPublicacion,
        menu_acompanante: nuevoInvitado.menuAcompanante ?? null,
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
        menu: data.menu as MenuOption,
        comentario: data.comentario ?? "",
        date: data.date,
        cancionFavorita: data.cancion_favorita ?? undefined,
        consentimientoPublicacion: !!data.consentimiento_publicacion,
        menuAcompanante: data.menu_acompanante ?? undefined,
      });
    }
    setMensaje("¡Registro enviado! Gracias por confirmar tu asistencia.");
    setNombre("");
    setPlusOne(false);
    setNombreAcompanante("");
    setMenu("normal");
    setComentario("");
    setCancionFavorita("");
    setConsentimientoPublicacion(false);
    setMenuAcompanante("normal");  // <-- Ensure this is always a valid MenuOption
    setTimeout(() => setMensaje(""), 3500);
  };

  return (
    <form
      className="bg-white border rounded-2xl shadow-md max-w-lg mx-auto p-8 flex flex-col gap-5"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold mb-2 text-center">Confirma tu asistencia</h2>
      <TextInput
        label="Nombre completo"
        value={nombre}
        onChange={setNombre}
        placeholder="Ej: Ana García"
        maxLength={60}
        disabled={loading}
        required
      />
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-primary"
            checked={plusOne}
            onChange={e => {
              setPlusOne(e.target.checked);
              if (!e.target.checked) {
                setNombreAcompanante("");
                setMenuAcompanante("normal"); // <-- Ensure this is always a valid MenuOption
              }
            }}
            disabled={loading}
          />
          ¿Llevo acompañante? (+1)
        </label>
      </div>
      {plusOne && (
        <PlusOneFields
          nombreAcompanante={nombreAcompanante}
          onNombreAcompananteChange={setNombreAcompanante}
          menuAcompanante={menuAcompanante}
          onMenuAcompananteChange={setMenuAcompanante}
          disabled={loading}
        />
      )}
      <MenuSelector
        label="Menú preferido"
        value={menu}
        onChange={setMenu}
        disabled={loading}
      />
      <TextInput
        label="¿Qué canción no puede faltar en la fiesta?"
        value={cancionFavorita}
        onChange={setCancionFavorita}
        placeholder="Ej: La Macarena, Caballo Dorado, We Found Love..."
        maxLength={100}
        disabled={loading}
      />
      <TextareaInput
        label="Comentarios/adicionales"
        value={comentario}
        onChange={setComentario}
        placeholder="¿Alguna alergia, petición o mensaje para los novios?"
        maxLength={200}
        disabled={loading}
      />
      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-primary mt-1"
            checked={consentimientoPublicacion}
            onChange={e => setConsentimientoPublicacion(e.target.checked)}
            disabled={loading}
          />
          <span>
            Doy mi consentimiento para aparecer en fotos y vídeos públicos de la boda (en redes, web, etc).
          </span>
        </label>
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
