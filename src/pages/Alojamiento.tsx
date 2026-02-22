import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ALOJAMIENTOS = [
  "Aldea Tejera Negra",
  "La Casona de Campillo",
  "Apartamentos La Plaza",
  "La Casona de Majaelrayo",
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
  const { t } = useLanguage();

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
                {t("accommodation.title")}
              </h1>
              <p className="text-lg text-gray-700">
                {t("accommodation.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALOJAMIENTOS.map((propiedad) => (
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
        </section>
      </div>
    </div>
  );
};

export default Alojamiento;
