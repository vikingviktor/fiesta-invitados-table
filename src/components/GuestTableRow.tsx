
import React from "react";
import { Guest, MenuOption } from "@/types/guestTypes";
import GuestMesaSelect from "./GuestMesaSelect";
import GuestDeleteModal from "./GuestDeleteModal";
import { menuTranslation } from "@/utils/guestUtils"; // Correct import

interface GuestTableRowProps {
  guest: Guest & { mesa?: number | null };
  mesaValue: string;
  savingId: string | null;
  deleteId: string | null;
  loadingDelete: boolean;
  onMesaChange: (guestId: string, value: string) => void;
  onMesaSave: (guest: Guest & { mesa?: number | null }) => void;
  onDeleteClick: (guestId: string) => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: (guestId: string) => void;
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
}) => (
  <tr className="hover:bg-secondary/50">
    <td className="p-3 border-b">{guest.nombre}</td>
    <td className="p-3 border-b text-center">{guest.plusOne ? "Sí" : "No"}</td>
    <td className="p-3 border-b">
      {(guest.plusOne && guest.nombreAcompanante) ? guest.nombreAcompanante : (guest.plusOne ? "Sin nombre" : "-")}
    </td>
    <td className="p-3 border-b">{menuTranslation[guest.menu]}</td>
    <td className="p-3 border-b">{guest.comentario || "-"}</td>
    <td className="p-3 border-b">{guest.cancionFavorita || "-"}</td>
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
    <td className="p-3 border-b">
      <button
        className="bg-destructive text-destructive-foreground rounded px-3 py-1 text-sm hover:bg-destructive/90 transition"
        onClick={() => onDeleteClick(guest.id)}
        disabled={loadingDelete}
        style={{ minWidth: 60 }}
      >
        Borrar
      </button>
      {/* Modal de confirmación */}
      {deleteId === guest.id && (
        <GuestDeleteModal
          guestName={guest.nombre}
          onCancel={onDeleteCancel}
          onConfirm={() => onDeleteConfirm(guest.id)}
          loading={loadingDelete}
        />
      )}
    </td>
  </tr>
);

export default GuestTableRow;
