import React, { useState } from "react";
import { Guest, MenuOption } from "@/types/guestTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const menuOptions: { label: string; value: string }[] = [
  { label: "Normal", value: "normal" },
  { label: "Vegetariano", value: "vegetariano" },
  { label: "Vegano", value: "vegano" },
  { label: "Sin gluten", value: "sin gluten" },
  { label: "Otro", value: "otro" },
];

interface GuestEditModalProps {
  guest: Guest & { mesa?: string | null };
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const GuestEditModal: React.FC<GuestEditModalProps> = ({ guest, open, onClose, onSaved }) => {
  const [form, setForm] = useState({
    nombre: guest.nombre,
    email: guest.email || "",
    menu: guest.menu,
    plusOne: guest.plusOne,
    nombreAcompanante: guest.nombreAcompanante || "",
    menuAcompanante: guest.menuAcompanante || "normal",
    comentario: guest.comentario || "",
    cancionFavorita: guest.cancionFavorita || "",
    conNinos: guest.conNinos,
    numeroNinos: guest.numeroNinos ?? 0,
    comentariosNinos: guest.comentariosNinos || "",
    pernoctaSabado: guest.pernoctaSabado,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("guests")
      .update({
        nombre: form.nombre,
        email: form.email || null,
        menu: form.menu,
        plus_one: form.plusOne,
        nombre_acompanante: form.plusOne ? form.nombreAcompanante : null,
        menu_acompanante: form.plusOne ? form.menuAcompanante : null,
        comentario: form.comentario || null,
        cancion_favorita: form.cancionFavorita || null,
        con_ninos: form.conNinos,
        numero_ninos: form.conNinos ? form.numeroNinos : 0,
        comentarios_ninos: form.conNinos ? form.comentariosNinos || null : null,
        pernocta_sabado: form.pernoctaSabado,
      })
      .eq("id", guest.id);

    if (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Invitado actualizado" });
      onSaved();
      onClose();
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar invitado</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div>
            <Label>Nombre</Label>
            <Input value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
          </div>
          <div>
            <Label>Menú</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.menu}
              onChange={(e) => handleChange("menu", e.target.value)}
            >
              {menuOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Label>Acompañante (+1)</Label>
            <Switch checked={form.plusOne} onCheckedChange={(v) => handleChange("plusOne", v)} />
          </div>

          {form.plusOne && (
            <>
              <div>
                <Label>Nombre acompañante</Label>
                <Input value={form.nombreAcompanante} onChange={(e) => handleChange("nombreAcompanante", e.target.value)} />
              </div>
              <div>
                <Label>Menú acompañante</Label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.menuAcompanante}
                  onChange={(e) => handleChange("menuAcompanante", e.target.value)}
                >
                  {menuOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <Label>Comentarios</Label>
            <Textarea value={form.comentario} onChange={(e) => handleChange("comentario", e.target.value)} />
          </div>
          <div>
            <Label>Canción favorita</Label>
            <Input value={form.cancionFavorita} onChange={(e) => handleChange("cancionFavorita", e.target.value)} />
          </div>

          <div className="flex items-center gap-3">
            <Label>Con niños</Label>
            <Switch checked={form.conNinos} onCheckedChange={(v) => handleChange("conNinos", v)} />
          </div>

          {form.conNinos && (
            <>
              <div>
                <Label>Nº niños</Label>
                <Input type="number" min={0} value={form.numeroNinos} onChange={(e) => handleChange("numeroNinos", Number(e.target.value))} />
              </div>
              <div>
                <Label>Comentarios niños</Label>
                <Textarea value={form.comentariosNinos} onChange={(e) => handleChange("comentariosNinos", e.target.value)} />
              </div>
            </>
          )}

          <div className="flex items-center gap-3">
            <Label>Pernocta sábado</Label>
            <Switch checked={form.pernoctaSabado} onCheckedChange={(v) => handleChange("pernoctaSabado", v)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuestEditModal;
