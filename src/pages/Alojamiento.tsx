import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Star } from "lucide-react";

const ALOJAMIENTOS_PRINCIPALES = [
  "Aldea Tejera Negra",
  "La Casona de Campillo",
  "Apartamentos La Plaza",
  "La Casona de Majaelrayo"
];

const OTROS_ALOJAMIENTOS = [
  "El Abejaruco",
  "Apartamento Acebuche",
  "Apartamento Acebo",
  "Casa Rural 1786",
  "La Casa del Sol",
  "Los 3 Olivos",
  "La Era de la Tía Donata",
  "Las Cabezadas",
  "La Majada del Rayo",
  "Casa Rural Beba",
  "Cerezas y Miel"
];

const Alojamiento = () => {

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/rivendell-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-emerald-900/20 to-amber-900/30" aria-hidden="true" />
      <div className="relative">
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
                  {ALOJAMIENTOS_PRINCIPALES.map((propiedad) => (
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
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Otros Alojamientos Disponibles en la Zona
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {OTROS_ALOJAMIENTOS.map((propiedad) => (
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Alojamiento;
