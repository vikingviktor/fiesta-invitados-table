
import React from "react";
import { Button } from "@/components/ui/button";

interface GuestDeleteModalProps {
  guestName: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const GuestDeleteModal: React.FC<GuestDeleteModalProps> = ({
  guestName,
  onCancel,
  onConfirm,
  loading,
}) => (
  <div className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">¿Borrar invitado?</h3>
        <div className="text-gray-700">
          ¿Seguro que quieres borrar a <span className="font-bold">{guestName}</span>?<br />
          Este registro se archivará como eliminado.
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={loading}>
          {loading ? "Eliminando..." : "Borrar"}
        </Button>
      </div>
    </div>
  </div>
);

export default GuestDeleteModal;
