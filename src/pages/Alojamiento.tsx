import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, MapPin, Star } from "lucide-react";

type Alojamiento = {
  id: string;
  propiedad: string;
  habitacion: string;
  tipo_cama: string | null;
  plazas: number;
  observaciones: string | null;
};

const ALOJAMIENTOS_PRINCIPALES = [
  "Aldea Tejera Negra",
  "La Casona de Campillo",
  "Apartamentos La Plaza",
  "La Casona de Majaelrayo"
];

const Alojamiento = () => {
  const [alojamientos, setAlojamientos] = useState<Alojamiento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlojamientos();
  }, []);

  const fetchAlojamientos = async () => {
    try {
      const { data, error } = await supabase
        .from("alojamientos")
        .select("*")
        .order("propiedad", { ascending: true });

      if (error) throw error;
      setAlojamientos(data || []);
    } catch (error) {
      console.error("Error fetching alojamientos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener lista única de propiedades
  const propiedades = Array.from(new Set(alojamientos.map(a => a.propiedad)));
  
  // Separar principales y otros
  const propiedadesPrincipales = propiedades.filter(p => ALOJAMIENTOS_PRINCIPALES.includes(p));
  const otrasPropiedades = propiedades.filter(p => !ALOJAMIENTOS_PRINCIPALES.includes(p));

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/rivendell-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-emerald-900/20 to-amber-900/30 backdrop-blur-[2px]" aria-hidden="true" />
      <div className="relative z-10">
        <Navbar />
        <section className="max-w-5xl mx-auto py-12 px-4">
          <div className="relative bg-white/90 rounded-xl shadow-xl p-8 border border-white/40 backdrop-blur-sm">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-3 font-elvish text-primary">
                Alojamientos Disponibles
              </h1>
              <p className="text-lg text-gray-700">
                Disponemos de varios alojamientos en la zona de los Pueblos Negros de Guadalajara.
                Aquí puedes ver las opciones disponibles.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Cargando alojamientos...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Alojamientos Principales - Incluidos en el paquete */}
                <div>
                  <div className="mb-6 p-5 bg-primary/10 rounded-lg border-2 border-primary/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="h-6 w-6 text-primary fill-primary" />
                      <h2 className="text-2xl font-bold text-primary font-elvish">
                        Alojamientos Incluidos en Nuestro Paquete
                      </h2>
                    </div>
                    <p className="text-gray-700 ml-9">
                      Estos alojamientos están incluidos y no tienen coste adicional para nuestros invitados.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {propiedadesPrincipales.map((propiedad) => (
                      <Card key={propiedad} className="bg-primary/5 border-primary/30 border-2 hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                              <Home className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-lg text-gray-800">{propiedad}</CardTitle>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Otros Alojamientos Disponibles */}
                {otrasPropiedades.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      Otros Alojamientos Disponibles en la Zona
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {otrasPropiedades.map((propiedad) => (
                        <Card key={propiedad} className="bg-white/60 border-gray-200 hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <Home className="h-5 w-5 text-gray-600" />
                              <CardTitle className="text-base text-gray-800">{propiedad}</CardTitle>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Alojamiento;
