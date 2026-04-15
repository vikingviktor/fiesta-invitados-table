
import React, { useState } from "react";
import { Guest, MenuOption } from "@/types/guestTypes";
import GuestMesaSelect from "./GuestMesaSelect";
import GuestDeleteModal from "./GuestDeleteModal";
import GuestEditModal from "./GuestEditModal";
import { menuTranslation } from "@/utils/guestUtils";
import { Switch } from "@/components/ui/switch";

interface GuestTableRowProps {
  guest: Guest & { mesa?: string | null };
  mesaValue: string;
  savingId: string | null;
  deleteId: string | null;
  loadingDelete: boolean;
  onMesaChange: (guestId: string, value: string) => void;
  onMesaSave: (guest: Guest & { mesa?: string | null }) => void;
  onDeleteClick: (guestId: string) => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: (guestId: string) => void;
  onConsentChange: (guestId: string, value: boolean) => void;
  consentSavingId: string | null;
  onGuestUpdated: () => void;
}

const GuestTableRow: React.FC<GuestTableRowProps> = ({
  guest,
  mesaValue,
  savingId,
  deleteId,
  loadingDelete,
  onMesaChange,
  onMesaSave,
  onDeleteClick,
  onDeleteCancel,
  onDeleteConfirm,
  onConsentChange,
  consentSavingId,
  onGuestUpdated,
}) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <tr className="hover:bg-secondary/50">
      <td className="p-3 border-b">{guest.nombre}</td>
      <td className="p-3 border-b">{guest.email || "-"}</td>
      <td className="p-3 border-b text-center">{guest.plusOne ? "Sí" : "No"}</td>
      <td className="p-3 border-b">
        {(guest.plusOne && guest.nombreAcompanante) ? guest.nombreAcompanante : (guest.plusOne ? "Sin nombre" : "-")}
      </td>
      <td className="p-3 border-b">
        {(guest.plusOne && guest.menuAcompanante) ? menuTranslation[guest.menuAcompanante] : (guest.plusOne ? "Normal" : "-")}
      </td>
      <td className="p-3 border-b">{menuTranslation[guest.menu]}</td>
      <td className="p-3 border-b">{guest.comentario || "-"}</td>
      <td className="p-3 border-b">{guest.cancionFavorita || "-"}</td>
      <td className="p-3 border-b text-center">{guest.conNinos ? "Sí" : "No"}</td>
      <td className="p-3 border-b text-center">{guest.conNinos ? (guest.numeroNinos ?? 0) : "-"}</td>
      <td className="p-3 border-b text-xs">{guest.conNinos ? (guest.comentariosNinos || "-") : "-"}</td>
      <td className="p-3 border-b text-center">{guest.pernoctaSabado ? "Sí" : "No"}</td>
      <td className="p-3 border-b text-xs">{new Date(guest.date).toLocaleString()}</td>
      <td className="p-3 border-b">
        <GuestMesaSelect
          guest={guest}
          mesaValue={mesaValue}
          savingId={savingId}
          onChange={val => onMesaChange(guest.id, val)}
          onSave={() => onMesaSave(guest)}
          disabled={savingId === guest.id}
        />
      </td>
      <td className="p-3 border-b text-center">
        <div className="flex flex-col items-center gap-1">
          <Switch
            checked={!!guest.consentimientoPublicacion}
            disabled={consentSavingId === guest.id}
            onCheckedChange={(val) => {
              if (val !== guest.consentimientoPublicacion) {
                onConsentChange(guest.id, val);
              }
            }}
            aria-label={guest.consentimientoPublicacion ? "Quitar consentimiento" : "Dar consentimiento"}
          />
          {consentSavingId === guest.id ? (
            <span className="text-xs text-muted-foreground animate-pulse">Guardando…</span>
          ) : (
            <span className={guest.consentimientoPublicacion ? "text-green-700 font-semibold text-xs" : "text-red-700 font-semibold text-xs"}>
              {guest.consentimientoPublicacion ? "Sí" : "No"}
            </span>
          )}
        </div>
      </td>
      <td className="p-3 border-b">
        <div className="flex gap-1">
          <button
            className="bg-primary text-primary-foreground rounded px-3 py-1 text-sm hover:bg-primary/90 transition"
            onClick={() => setEditOpen(true)}
            style={{ minWidth: 50 }}
          >
            Editar
          </button>
          <button
            className="bg-destructive text-destructive-foreground rounded px-3 py-1 text-sm hover:bg-destructive/90 transition"
            onClick={() => onDeleteClick(guest.id)}
            disabled={loadingDelete}
            style={{ minWidth: 50 }}
          >
            Borrar
          </button>
        </div>
        {deleteId === guest.id && (
          <GuestDeleteModal
            guestName={guest.nombre}
            onCancel={onDeleteCancel}
            onConfirm={() => onDeleteConfirm(guest.id)}
            loading={loadingDelete}
          />
        )}
        {editOpen && (
          <GuestEditModal
            guest={guest}
            open={editOpen}
            onClose={() => setEditOpen(false)}
            onSaved={onGuestUpdated}
          />
        )}
      </td>
    </tr>
  );
};

export default GuestTableRow;
