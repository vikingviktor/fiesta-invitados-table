
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Link as LinkIcon } from "lucide-react";

type CancionRow = {
  nombre: string;
  cancionFavorita: string;
  id: string;
};

const CancionesTab: React.FC = () => {
  const [canciones, setCanciones] = useState<CancionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar solo los invitados con campo cancion_favorita no vacío
    const fetchCanciones = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("guests")
        .select("id, nombre, cancion_favorita")
        .neq("cancion_favorita", "")
        .neq("cancion_favorita", null);

      if (data) {
        setCanciones(
          data
            .filter((row: any) => row.cancion_favorita && row.cancion_favorita.trim() !== "")
            .map((row: any) => ({
              id: row.id,
              nombre: row.nombre,
              cancionFavorita: row.cancion_favorita,
            }))
        );
      }
      setLoading(false);
    };
    fetchCanciones();
  }, []);

  const makeSpotifyUrl = (cancion: string) =>
    `https://open.spotify.com/search/${encodeURIComponent(cancion)}`;

  return (
    <div className="py-6">
      <Card>
        <CardHeader>
          <CardTitle>Canciones propuestas por los invitados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin mr-2" />
              Cargando...
            </div>
          ) : canciones.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              Aún no se ha añadido ninguna canción
            </div>
          ) : (
            <ul className="divide-y divide-muted">
              {canciones.map((cancion) => (
                <li
                  key={cancion.id}
                  className="py-3 flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-medium">{cancion.cancionFavorita}</span>
                    <span className="text-muted-foreground text-sm ml-2">
                      — {cancion.nombre}
                    </span>
                  </div>
                  <a
                    href={makeSpotifyUrl(cancion.cancionFavorita)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Buscar en Spotify"
                    className="flex items-center gap-1 text-green-600 hover:underline"
                  >
                    <LinkIcon size={20} />
                    Spotify
                  </a>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CancionesTab;

