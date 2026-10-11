import React, { useEffect, useMemo } from "react";
import { Download } from "lucide-react";
import { Guest } from "@/types/guestTypes";
import { buildGuestsCsv, exportFilename } from "@/utils/guestExport";
import { Button } from "@/components/ui/button";

const GuestExportButton: React.FC<{ guests: (Guest & { mesa?: string | null })[] }> = ({ guests }) => {
  const url = useMemo(
    () =>
      URL.createObjectURL(
        new Blob([buildGuestsCsv(guests)], { type: "text/csv;charset=utf-8;" })
      ),
    [guests]
  );

  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  return (
    <Button asChild size="sm" variant="outline" title="Se descarga un archivo que Excel abre directamente">
      <a href={url} download={exportFilename()} className="inline-flex items-center gap-2">
        <Download className="h-4 w-4" />
        Descargar Excel / CSV
      </a>
    </Button>
  );
};

export default GuestExportButton;
