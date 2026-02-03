import React, { useState, useEffect } from "react";
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

export type AlojamientoFormData = {
  id?: string;
  propiedad: string;
  habitacion: string;
  tipo_cama: string;
  plazas: number;
  observaciones: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: AlojamientoFormData) => Promise<void>;
  initialData?: AlojamientoFormData | null;
  existingPropiedades: string[];
};

const AlojamientoFormModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  initialData,
  existingPropiedades,
}) => {
  const [formData, setFormData] = useState<AlojamientoFormData>({
    propiedad: "",
    habitacion: "",
    tipo_cama: "",
    plazas: 1,
    observaciones: "",
  });
  const [saving, setSaving] = useState(false);
  const [useNewPropiedad, setUseNewPropiedad] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        propiedad: initialData.propiedad,
        habitacion: initialData.habitacion,
        tipo_cama: initialData.tipo_cama || "",
        plazas: initialData.plazas,
        observaciones: initialData.observaciones || "",
      });
      setUseNewPropiedad(false);
    } else {
      setFormData({
        propiedad: "",
        habitacion: "",
        tipo_cama: "",
        plazas: 1,
        observaciones: "",
      });
      setUseNewPropiedad(existingPropiedades.length === 0);
    }
  }, [initialData, open, existingPropiedades.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.propiedad.trim() || !formData.habitacion.trim()) {
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const isEditing = !!initialData?.id;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Alojamiento" : "Añadir Alojamiento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propiedad">Propiedad *</Label>
            {existingPropiedades.length > 0 && !useNewPropiedad ? (
              <div className="space-y-2">
                <select
                  id="propiedad-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.propiedad}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, propiedad: e.target.value }))
                  }
                >
                  <option value="">Seleccionar propiedad...</option>
                  {existingPropiedades.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() => {
                    setUseNewPropiedad(true);
                    setFormData((prev) => ({ ...prev, propiedad: "" }));
                  }}
                >
                  + Añadir nueva propiedad
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  id="propiedad"
                  placeholder="Nombre de la propiedad"
                  value={formData.propiedad}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, propiedad: e.target.value }))
                  }
                  required
                />
                {existingPropiedades.length > 0 && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="p-0 h-auto"
                    onClick={() => setUseNewPropiedad(false)}
                  >
                    Seleccionar propiedad existente
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="habitacion">Habitación *</Label>
            <Input
              id="habitacion"
              placeholder="Nombre o número de habitación"
              value={formData.habitacion}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, habitacion: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_cama">Tipo de cama</Label>
              <Input
                id="tipo_cama"
                placeholder="Ej: Doble, Individual..."
                value={formData.tipo_cama}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tipo_cama: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plazas">Plazas *</Label>
              <Input
                id="plazas"
                type="number"
                min={1}
                max={20}
                value={formData.plazas}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    plazas: parseInt(e.target.value) || 1,
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              placeholder="Notas adicionales..."
              value={formData.observaciones}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, observaciones: e.target.value }))
              }
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : isEditing ? "Actualizar" : "Añadir"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AlojamientoFormModal;
