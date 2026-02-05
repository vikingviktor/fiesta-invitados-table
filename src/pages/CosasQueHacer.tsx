import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TreePine, Church, Mountain, Camera, UtensilsCrossed, Footprints } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CosasQueHacer = () => {
  const { t } = useLanguage();

  const actividades = [
    {
      icon: TreePine,
      titleKey: "things.hayedo.title",
      descriptionKey: "things.hayedo.description",
      distanceKey: "things.hayedo.distance"
    },
    {
      icon: Mountain,
      titleKey: "things.pueblos.title",
      descriptionKey: "things.pueblos.description",
      distanceKey: "things.pueblos.distance"
    },
    {
      icon: Church,
      titleKey: "things.iglesias.title",
      descriptionKey: "things.iglesias.description",
      distanceKey: "things.iglesias.distance"
    },
    {
      icon: Footprints,
      titleKey: "things.senderismo.title",
      descriptionKey: "things.senderismo.description",
      distanceKey: "things.senderismo.distance"
    },
    {
      icon: Camera,
      titleKey: "things.miradores.title",
      descriptionKey: "things.miradores.description",
      distanceKey: "things.miradores.distance"
    },
    {
      icon: UtensilsCrossed,
      titleKey: "things.gastronomia.title",
      descriptionKey: "things.gastronomia.description",
      distanceKey: "things.gastronomia.distance"
    }
  ];

  const pueblosRecomendados = [
    { nombre: "Valverde de los Arroyos", descriptionKey: "things.village.valverde" },
    { nombre: "Majaelrayo", descriptionKey: "things.village.majaelrayo" },
    { nombre: "Campillo de Ranas", descriptionKey: "things.village.campillo" },
    { nombre: "Robleluengo", descriptionKey: "things.village.robleluengo" },
    { nombre: "Tamajón", descriptionKey: "things.village.tamajon" }
  ];

  const tips = [
    "things.tip1",
    "things.tip2",
    "things.tip3",
    "things.tip4"
  ];

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
        <section className="max-w-6xl mx-auto py-12 px-4">
          <div className="relative bg-white/90 rounded-xl shadow-xl p-8 border border-white/40 backdrop-blur-sm">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-3 font-elvish text-primary">
                {t("things.title")}
              </h1>
              <p className="text-lg text-gray-700">
                {t("things.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {actividades.map((actividad, index) => {
                const IconComponent = actividad.icon;
                return (
                  <Card key={index} className="bg-white/80 border-gray-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{t(actividad.titleKey)}</CardTitle>
                          <CardDescription className="text-primary font-medium">
                            {t(actividad.distanceKey)}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{t(actividad.descriptionKey)}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                {t("things.villages.title")}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pueblosRecomendados.map((pueblo, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{pueblo.nombre}</h3>
                      <p className="text-sm text-gray-600">{t(pueblo.descriptionKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">{t("things.tips.title")}</h3>
              <ul className="space-y-2 text-gray-700">
                {tips.map((tipKey, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>{t(tipKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CosasQueHacer;
