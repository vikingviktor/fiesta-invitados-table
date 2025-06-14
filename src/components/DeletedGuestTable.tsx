
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";

type DeletedGuest = Database["public"]["Tables"]["deleted_guests"]["Row"];

const menuTranslation: Record<string, string> = {
  normal: "Normal",
  vegetariano: "Vegetariano",
  vegano: "Vegano",
  "sin gluten": "Sin gluten",
};

const DeletedGuestTable: React.FC = () => {
  const [deletedGuests, setDeletedGuests] = useState<DeletedGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchDeleted = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("deleted_guests")
      .select("*")
      .order("deleted_at", { ascending: false });
    if (!error && data) setDeletedGuests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeleted();
    // opcional: escucha en tiempo real
    // eslint-disable-next-line
  }, []);

  const handlePermanentDelete = async (id: string) => {
    setLoadingDelete(true);
    const { error } = await supabase
      .from("deleted_guests")
      .delete()
      .eq("id", id);
    setLoadingDelete(false);
    setDeletingId(null);
    if (!error) fetchDeleted();
    else alert("Error eliminando: " + error.message);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 px-2">
      <h3 className="text-xl font-bold mb-2 text-red-700">Registros eliminados</h3>
      {loading ? (
        <div className="p-6 text-center">Cargando...</div>
      ) : deletedGuests.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">No hay registros eliminados.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-background border rounded-lg shadow-md text-left">
            <thead>
              <tr>
                <th className="p-3 border-b">Nombre</th>
                <th className="p-3 border-b">+1</th>
                <th className="p-3 border-b">Menú</th>
                <th className="p-3 border-b">Comentarios</th>
                <th className="p-3 border-b">Eliminado el</th>
                <th className="p-3 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {deletedGuests.map((g) => (
                <tr key={g.id} className="hover:bg-secondary/50">
                  <td className="p-3 border-b">{g.nombre}</td>
                  <td className="p-3 border-b text-center">{g.plus_one ? "Sí" : "No"}</td>
                  <td className="p-3 border-b">{menuTranslation[g.menu] || g.menu}</td>
                  <td className="p-3 border-b">{g.comentario || "-"}</td>
                  <td className="p-3 border-b text-xs">{new Date(g.deleted_at).toLocaleString()}</td>
                  <td className="p-3 border-b">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingId(g.id)}
                      disabled={loadingDelete}
                    >
                      Eliminar permanente
                    </Button>
                    {/* Modal de confirmación */}
                    {deletingId === g.id && (
                      <div className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                          <div className="mb-4">
                            <h4 className="font-semibold text-lg mb-2">
                              ¿Eliminar permanentemente?
                            </h4>
                            <div className="text-gray-700">
                              ¿Seguro que quieres borrar definitivamente a{" "}
                              <span className="font-bold">{g.nombre}</span>?<br />
                              Esta acción es irreversible.
                            </div>
                          </div>
                          <div className="flex gap-3 justify-end">
                            <Button
                              variant="secondary"
                              onClick={() => setDeletingId(null)}
                              disabled={loadingDelete}
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handlePermanentDelete(g.id)}
                              disabled={loadingDelete}
                            >
                              {loadingDelete ? "Eliminando..." : "Eliminar"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeletedGuestTable;
