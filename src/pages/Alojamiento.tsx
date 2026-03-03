import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
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

// principales que no se muestran en la tabla desplegable
const MAIN_PROPS = [
  "Aldea Tejera Negra",
  "La Casona de Majaelrayo",
  "La Plaza de Majaelrayo",
  "La Casona de Campillo",
  "Las Cabezadas"
];

// rellenar con datos reales extraídos del PDF
const EXTRA_ACOMM = ALOJAMIENTOS
  .filter((p) => !MAIN_PROPS.includes(p))
  .map((name) => ({ name, details: "" }));


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

            {/* collapsible list of extras */}
            {EXTRA_ACOMM.length > 0 && (
              <div className="mt-8">
                <Accordion type="single" collapsible>
                  <AccordionItem value="extras">
                    <AccordionTrigger className="text-primary">
                      {t("accommodation.more.title")}
                    </AccordionTrigger>
                    <AccordionContent>
                      <table className="w-full text-left">
                        <thead className="border-b">
                          <tr>
                            <th className="py-1">{t("accommodation.table.name")}</th>
                            <th className="py-1">{t("accommodation.table.details")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {EXTRA_ACOMM.map((a) => (
                            <tr key={a.name} className="border-b last:border-none">
                              <td className="py-1">{a.name}</td>
                              <td className="py-1 text-gray-600 text-sm">
                                {a.details || "–"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Alojamiento;
