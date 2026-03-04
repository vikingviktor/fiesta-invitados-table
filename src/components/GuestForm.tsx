import React, { useState } from "react";
import { Guest, MenuOption } from "@/types/guestTypes";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import TextInput from "./guest-form/TextInput";
import TextareaInput from "./guest-form/TextareaInput";
import MenuSelector from "./guest-form/MenuSelector";
import PlusOneFields from "./guest-form/PlusOneFields";


interface GuestFormProps {
  onSubmit?: (guest: Guest) => void;
}

const GuestForm: React.FC<GuestFormProps> = ({ onSubmit }) => {
  const { t } = useLanguage();
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
  const [conNinos, setConNinos] = useState(false);
  const [numeroNinos, setNumeroNinos] = useState(0);
  const [comentariosNinos, setComentariosNinos] = useState("");
  const [pernoctaSabado, setPernoctaSabado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    if (!nombre.trim()) {
      setMensaje(t("form.error.name"));
      return;
    }
    if (plusOne && !nombreAcompanante.trim()) {
      setMensaje(t("form.error.companion"));
      return;
    }
    if (!consentimientoPublicacion) {
      setMensaje(t("form.error.consent"));
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
      conNinos,
      numeroNinos: conNinos ? numeroNinos : undefined,
      comentariosNinos: conNinos ? comentariosNinos.trim() || undefined : undefined,
      pernoctaSabado,
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
        con_ninos: nuevoInvitado.conNinos,
        numero_ninos: nuevoInvitado.numeroNinos ?? 0,
        comentarios_ninos: nuevoInvitado.comentariosNinos ?? null,
        pernocta_sabado: nuevoInvitado.pernoctaSabado,
      }
    ]).select().single();

    setLoading(false);
    if (error) {
      setMensaje(t("form.error.submit"));
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
        conNinos: !!data.con_ninos,
        numeroNinos: data.numero_ninos ?? 0,
        comentariosNinos: data.comentarios_ninos ?? undefined,
        pernoctaSabado: !!data.pernocta_sabado,
      });
    }
    setMensaje(t("form.success"));
    setNombre("");
    setPlusOne(false);
    setNombreAcompanante("");
    setMenu("normal");
    setComentario("");
    setCancionFavorita("");
    setConsentimientoPublicacion(false);
    setMenuAcompanante("normal"); // always assign a valid MenuOption, not empty string
    setConNinos(false);
    setNumeroNinos(0);
    setComentariosNinos("");
    setPernoctaSabado(false);
    setTimeout(() => setMensaje(""), 3500);
  };

  const handlePlusOneChange = (checked: boolean) => {
    setPlusOne(checked);
    if (!checked) {
      setNombreAcompanante("");
      setMenuAcompanante("normal"); // assign valid MenuOption, not ""
    }
  };

  return (
    <form
      className="bg-white border rounded-2xl shadow-md max-w-lg mx-auto p-8 flex flex-col gap-5"
      onSubmit={handleSubmit}
    >
      <h2 className="text-4xl font-semibold mb-2 text-center font-elvish">{t("form.title")}</h2>
      <TextInput
        label={t("form.name")}
        value={nombre}
        onChange={setNombre}
        placeholder={t("form.name.placeholder")}
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
            onChange={e => handlePlusOneChange(e.target.checked)}
            disabled={loading}
          />
          {t("form.plusone")}
        </label>
      </div>
      {plusOne && (
        <PlusOneFields
          nombreAcompanante={nombreAcompanante}
          onNombreAcompananteChange={setNombreAcompanante}
          menuAcompanante={menuAcompanante}
          onMenuAcompananteChange={setMenuAcompanante as (v: MenuOption) => void}
          disabled={loading}
        />
      )}
      <MenuSelector
        label={t("form.menu")}
        value={menu}
        onChange={setMenu}
        disabled={loading}
      />
      <TextInput
        label={t("form.song")}
        value={cancionFavorita}
        onChange={setCancionFavorita}
        placeholder={t("form.song.placeholder")}
        maxLength={100}
        disabled={loading}
      />
      <TextareaInput
        label={t("form.comments")}
        value={comentario}
        onChange={setComentario}
        placeholder={t("form.comments.placeholder")}
        maxLength={200}
        disabled={loading}
      />
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-primary"
            checked={conNinos}
            onChange={e => {
              setConNinos(e.target.checked);
              if (!e.target.checked) {
                setNumeroNinos(0);
                setComentariosNinos("");
              }
            }}
            disabled={loading}
          />
          <span>{t("form.children")}</span>
        </label>
        {conNinos && (
          <div className="mt-3 ml-6 flex flex-col gap-3">
            <div>
              <label className="block font-medium mb-1 font-elvish text-2xl">{t("form.children.count")}</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 focus:outline-primary"
                value={numeroNinos || ""}
                onChange={e => setNumeroNinos(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="0"
                min={0}
                max={20}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block font-medium mb-1 font-elvish text-2xl">{t("form.children.names")}</label>
              <textarea
                className="w-full border rounded px-3 py-2 min-h-[60px]"
                value={comentariosNinos}
                onChange={e => setComentariosNinos(e.target.value)}
                placeholder={t("form.children.names.placeholder")}
                maxLength={300}
                disabled={loading}
              />
            </div>
          </div>
        )}
      </div>
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-primary"
            checked={pernoctaSabado}
            onChange={e => setPernoctaSabado(e.target.checked)}
            disabled={loading}
          />
          <span>{t("form.overnight")}</span>
        </label>
      </div>
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
            {t("form.consent")}
          </span>
        </label>
      </div>
      <button
        type="submit"
        className="bg-primary text-white font-semibold py-2 rounded shadow hover:bg-primary/80 transition"
        disabled={loading}
      >
        {loading ? "..." : t("form.submit")}
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
