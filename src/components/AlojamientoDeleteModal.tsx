import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  alojamientoName: string;
  guestCount: number;
};

const AlojamientoDeleteModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  alojamientoName,
  guestCount,
}) => {
  const [deleting, setDeleting] = React.useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar alojamiento?</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a eliminar <strong>{alojamientoName}</strong>.
            {guestCount > 0 && (
              <>
                {" "}
                Actualmente hay <strong>{guestCount} persona(s)</strong> asignadas
                a este alojamiento. Se les desasignará automáticamente.
              </>
            )}
            <br />
            <br />
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlojamientoDeleteModal;
