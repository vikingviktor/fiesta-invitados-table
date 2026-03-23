import React from "react";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen relative">
      {/* Fixed background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/rivendell-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10">
        <Navbar transparent />

        <section className="py-16 sm:py-24 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span className="font-cinzel text-amber-400/80 text-sm tracking-[0.3em] uppercase">
                  {t("things.subtitle")}
                </span>
                <MapPin className="w-5 h-5 text-amber-400" />
              </div>
              <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent mb-4">
                {t("things.title")}
              </h1>
            </div>

            {/* Activities Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {actividades.map((actividad, index) => {
                const IconComponent = actividad.icon;
                return (
                  <div
                    key={index}
                    className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-400/20 hover:border-amber-400/40 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-400/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-cinzel text-xl text-amber-300 mb-1">
                          {t(actividad.titleKey)}
                        </h3>
                        <p className="font-cinzel text-sm text-amber-400/70 mb-2">
                          {t(actividad.distanceKey)}
                        </p>
                        <p className="font-cinzel text-amber-100/80">{t(actividad.descriptionKey)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Villages Section */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-amber-400/20 mb-8">
              <h2 className="font-cinzel text-2xl text-amber-300 mb-6 flex items-center gap-3">
                <MapPin className="h-6 w-6 text-amber-400" />
                {t("things.villages.title")}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pueblosRecomendados.map((pueblo, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-amber-400/5 rounded-lg border border-amber-400/10">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-cinzel text-amber-200">{pueblo.nombre}</h3>
                      <p className="font-cinzel text-sm text-amber-100/60">{t(pueblo.descriptionKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-amber-400/20">
              <h3 className="font-cinzel text-xl text-amber-300 mb-4">{t("things.tips.title")}</h3>
              <ul className="space-y-3">
                {tips.map((tipKey, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span className="font-cinzel text-amber-100/80">{t(tipKey)}</span>
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
