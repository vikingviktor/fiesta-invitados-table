import React, { useState } from "react";
import { Guest, MenuOption } from "@/types/guestTypes";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import TextInput from "./guest-form/TextInput";
import TextareaInput from "./guest-form/TextareaInput";
import MenuSelector from "./guest-form/MenuSelector";
import PlusOneFields from "./guest-form/PlusOneFields";
import { ChevronDown, ChevronUp } from "lucide-react";

interface GuestFormProps {
  onSubmit?: (guest: Guest) => void;
}

const GuestForm: React.FC<GuestFormProps> = ({ onSubmit }) => {
  const { t } = useLanguage();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    if (!nombre.trim()) {
      setMensaje(t("form.error.name"));
      return;
    }
    if (!email.trim()) {
      setMensaje(t("form.error.email"));
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

    // Check for duplicate email
    const { data: existingGuest } = await supabase
      .from("guests")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (existingGuest) {
      setLoading(false);
      setMensaje(t("form.error.duplicate_email"));
      return;
    }

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
    const { error } = await supabase.from("guests").insert([
      {
        nombre: nuevoInvitado.nombre,
        email: email.trim().toLowerCase(),
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
    ]);

    setLoading(false);
    if (error) {
      setMensaje(t("form.error.submit"));
      return;
    }
    if (onSubmit) {
      onSubmit({
        id: crypto.randomUUID(),
        ...nuevoInvitado,
      });
    }
    setMensaje(t("form.success"));
    setSubmitted(true);
  };

  const handlePlusOneChange = (checked: boolean) => {
    setPlusOne(checked);
    if (!checked) {
      setNombreAcompanante("");
      setMenuAcompanante("normal");
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-md max-w-lg mx-auto flex flex-col">
      {/* Header - always visible */}
      <div
        className={`flex items-center justify-between p-8 pb-4 ${submitted ? "cursor-pointer" : ""}`}
        onClick={submitted ? () => setSubmitted(!submitted) : undefined}
      >
        <h2 className="text-4xl font-semibold text-center font-antiqua flex-1">{t("form.title")}</h2>
        {submitted && (
          <button
            type="button"
            className="ml-2 text-amber-700 hover:text-amber-900 transition"
            onClick={(e) => {
              e.stopPropagation();
              setSubmitted(prev => !prev);
            }}
          >
            {submitted ? <ChevronDown className="h-6 w-6" /> : <ChevronUp className="h-6 w-6" />}
          </button>
        )}
      </div>

      {/* Success message when collapsed */}
      {submitted && (
        <div className="px-8 pb-4">
          <div className="rounded px-4 py-2 text-center bg-green-100 text-green-800">
            {t("form.success")}
          </div>
          <p className="text-sm text-amber-700 text-center mt-2 font-elvish text-lg">
            {t("form.expand_to_review")}
          </p>
        </div>
      )}

      {/* Form content - collapsible after submit */}
      {!submitted && (
        <form className="px-8 pb-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          <TextInput
            label={t("form.name")}
            value={nombre}
            onChange={setNombre}
            placeholder={t("form.name.placeholder")}
            maxLength={60}
            disabled={loading}
            required
          />
          <TextInput
            label={t("form.email")}
            value={email}
            onChange={setEmail}
            placeholder={t("form.email.placeholder")}
            maxLength={100}
            disabled={loading}
            required
            type="email"
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
              <span className="font-elvish text-2xl">{t("form.plusone")}</span>
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
              <span className="font-elvish text-2xl">{t("form.children")}</span>
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
              <span className="font-elvish text-2xl">{t("form.overnight")}</span>
            </label>
          </div>
          <TextareaInput
            label={t("form.comments")}
            value={comentario}
            onChange={setComentario}
            placeholder={t("form.comments.placeholder")}
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
              <span className="font-elvish text-2xl">
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
                mensaje === t("form.success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {mensaje}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default GuestForm;
