import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuOption } from "@/types/guestTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import TextInput from "./guest-form/TextInput";
import TextareaInput from "./guest-form/TextareaInput";
import MenuSelector from "./guest-form/MenuSelector";
import PlusOneFields from "./guest-form/PlusOneFields";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GuestAddModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const GuestAddModal: React.FC<GuestAddModalProps> = ({ open, onClose, onAdded }) => {
  const { t } = useLanguage();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [plusOne, setPlusOne] = useState(false);
  const [nombreAcompanante, setNombreAcompanante] = useState("");
  const [menu, setMenu] = useState<MenuOption>("normal");
  const [menuAcompanante, setMenuAcompanante] = useState<MenuOption>("normal");
  const [comentario, setComentario] = useState("");
  const [cancionFavorita, setCancionFavorita] = useState("");
  const [consentimientoPublicacion, setConsentimientoPublicacion] = useState(false);
  const [conNinos, setConNinos] = useState(false);
  const [numeroNinos, setNumeroNinos] = useState(0);
  const [comentariosNinos, setComentariosNinos] = useState("");
  const [pernoctaSabado, setPernoctaSabado] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const resetForm = () => {
    setNombre("");
    setEmail("");
    setPlusOne(false);
    setNombreAcompanante("");
    setMenu("normal");
    setMenuAcompanante("normal");
    setComentario("");
    setCancionFavorita("");
    setConsentimientoPublicacion(false);
    setConNinos(false);
    setNumeroNinos(0);
    setComentariosNinos("");
    setPernoctaSabado(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast({ title: "Falta el nombre", description: "Introduce el nombre del invitado.", variant: "destructive" });
      return;
    }
    if (plusOne && !nombreAcompanante.trim()) {
      toast({ title: "Falta el acompañante", description: "Introduce el nombre del acompañante.", variant: "destructive" });
      return;
    }

    setLoading(true);

    if (email.trim()) {
      const { data: existingGuest } = await supabase
        .from("guests")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();
      if (existingGuest) {
        setLoading(false);
        toast({ title: "Email duplicado", description: "Ya existe un invitado con ese correo electrónico.", variant: "destructive" });
        return;
      }
    }

    const { error } = await supabase.from("guests").insert([
      {
        nombre: nombre.trim(),
        email: email.trim() ? email.trim().toLowerCase() : null,
        plus_one: plusOne,
        nombre_acompanante: plusOne ? nombreAcompanante.trim() : null,
        menu,
        menu_acompanante: plusOne ? menuAcompanante : null,
        comentario: comentario.trim() || null,
        cancion_favorita: cancionFavorita.trim() || null,
        consentimiento_publicacion: consentimientoPublicacion,
        con_ninos: conNinos,
        numero_ninos: conNinos ? numeroNinos : 0,
        comentarios_ninos: conNinos ? comentariosNinos.trim() || null : null,
        pernocta_sabado: pernoctaSabado,
        date: new Date().toISOString(),
      },
    ]);

    setLoading(false);
    if (error) {
      toast({ title: "Error al añadir invitado", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Invitado añadido", description: `${nombre} se ha registrado correctamente.` });
    resetForm();
    onAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white border rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-2 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-cinzel">Añadir invitado</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form className="px-6 pb-6 flex flex-col gap-4" onSubmit={handleSubmit}>
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
            type="email"
          />
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-primary"
                checked={plusOne}
                onChange={(e) => {
                  setPlusOne(e.target.checked);
                  if (!e.target.checked) {
                    setNombreAcompanante("");
                    setMenuAcompanante("normal");
                  }
                }}
                disabled={loading}
              />
              <span className="font-cinzel text-xl">{t("form.plusone")}</span>
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
          <MenuSelector label={t("form.menu")} value={menu} onChange={setMenu} disabled={loading} />
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
                onChange={(e) => {
                  setConNinos(e.target.checked);
                  if (!e.target.checked) {
                    setNumeroNinos(0);
                    setComentariosNinos("");
                  }
                }}
                disabled={loading}
              />
              <span className="font-cinzel text-xl">{t("form.children")}</span>
            </label>
            {conNinos && (
              <div className="mt-3 ml-6 flex flex-col gap-3">
                <div>
                  <label className="block mb-1 font-cinzel text-xl">{t("form.children.count")}</label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2 focus:outline-primary"
                    value={numeroNinos || ""}
                    onChange={(e) => setNumeroNinos(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="0"
                    min={0}
                    max={20}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-cinzel text-xl">{t("form.children.names")}</label>
                  <textarea
                    className="w-full border rounded px-3 py-2 min-h-[60px]"
                    value={comentariosNinos}
                    onChange={(e) => setComentariosNinos(e.target.value)}
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
                onChange={(e) => setPernoctaSabado(e.target.checked)}
                disabled={loading}
              />
              <span className="font-cinzel text-xl">{t("form.overnight")}</span>
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
                onChange={(e) => setConsentimientoPublicacion(e.target.checked)}
                disabled={loading}
              />
              <span className="font-cinzel text-xl">{t("form.consent")}</span>
            </label>
          </div>
          <button
            type="submit"
            className="bg-primary text-white py-2 rounded shadow hover:bg-primary/80 transition font-cinzel"
            disabled={loading}
          >
            {loading ? "..." : "Añadir invitado"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuestAddModal;
