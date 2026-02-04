import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Bed, MapPin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Alojamiento = {
  id: string;
  propiedad: string;
  habitacion: string;
  tipo_cama: string | null;
  plazas: number;
  observaciones: string | null;
};

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
        .order("propiedad", { ascending: true })
        .order("habitacion", { ascending: true });

      if (error) throw error;
      setAlojamientos(data || []);
    } catch (error) {
      console.error("Error fetching alojamientos:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedAlojamientos = alojamientos.reduce((acc, aloj) => {
    if (!acc[aloj.propiedad]) {
      acc[aloj.propiedad] = [];
    }
    acc[aloj.propiedad].push(aloj);
    return acc;
  }, {} as Record<string, Alojamiento[]>);

  const getTotalPlazas = (habitaciones: Alojamiento[]) => {
    return habitaciones.reduce((sum, h) => sum + h.plazas, 0);
  };

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
              <Accordion type="single" collapsible className="space-y-4">
                {Object.entries(groupedAlojamientos).map(([propiedad, habitaciones]) => (
                  <AccordionItem 
                    key={propiedad} 
                    value={propiedad}
                    className="border rounded-lg bg-white/50 overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:bg-white/70 transition-colors">
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <Home className="h-6 w-6 text-primary flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800">{propiedad}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {habitaciones.length} habitaciones • {getTotalPlazas(habitaciones)} plazas totales
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="grid gap-3 pt-4">
                        {habitaciones.map((hab) => (
                          <div 
                            key={hab.id}
                            className="flex items-start gap-4 p-4 bg-white/80 rounded-lg border border-gray-200"
                          >
                            <Bed className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{hab.habitacion}</h4>
                              {hab.tipo_cama && (
                                <p className="text-sm text-gray-600 mt-1">{hab.tipo_cama}</p>
                              )}
                              {hab.observaciones && (
                                <p className="text-sm text-gray-500 mt-1 italic">{hab.observaciones}</p>
                              )}
                            </div>
                            <Badge variant="secondary" className="flex-shrink-0">
                              {hab.plazas} {hab.plazas === 1 ? 'plaza' : 'plazas'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Alojamiento;
