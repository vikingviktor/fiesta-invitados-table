import React from "react";
import Navbar from "@/components/Navbar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { EXTRA_ACOMM } from "@/data/accommodations";

const Alojamiento = () => {
  const { t, language } = useLanguage();
  const [filterLocality, setFilterLocality] = React.useState("");

  const normalizeUrl = (url: string) =>
    url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;

  const localities = Array.from(new Set(EXTRA_ACOMM.map((a) => a.locality[language])));

  const filteredExtras = filterLocality
    ? EXTRA_ACOMM.filter((a) => a.locality[language] === filterLocality)
    : EXTRA_ACOMM;

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

            {/* Accommodation details */}
            {EXTRA_ACOMM.length > 0 && (
              <div className="mt-6 md:mt-8">
                <Accordion type="single" collapsible>
                  <AccordionItem value="extras">
                    <AccordionTrigger className="text-primary">
                      {t("accommodation.more.title")}
                    </AccordionTrigger>
                    <AccordionContent>
                      {/* locality filter */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          {t("accommodation.filter.locality")}
                        </label>
                        <select
                          value={filterLocality}
                          onChange={(e) => setFilterLocality(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                        >
                          <option value="">{t("accommodation.filter.all")}</option>
                          {localities.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Desktop table */}
                      <div className="hidden md:block">
                        <table className="w-full text-left">
                          <thead className="border-b">
                            <tr>
                              <th className="py-1">{t("accommodation.table.name")}</th>
                              <th className="py-1">{t("accommodation.table.locality")}</th>
                              <th className="py-1">{t("accommodation.table.phone")}</th>
                              <th className="py-1">{t("accommodation.table.website")}</th>
                              <th className="py-1">{t("accommodation.table.details")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredExtras.map((a) => (
                              <tr key={a.name} className="border-b last:border-none">
                                <td className="py-1">{a.name}</td>
                                <td className="py-1">{a.locality[language]}</td>
                                <td className="py-1">{a.phone}</td>
                                <td className="py-1">
                                  {a.website ? (
                                    <a href={normalizeUrl(a.website)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                      {a.website}
                                    </a>
                                  ) : "–"}
                                </td>
                                <td className="py-1 text-gray-600 text-sm">
                                  {a.details[language] || "–"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile cards */}
                      <div className="md:hidden space-y-3">
                        {filteredExtras.map((a) => (
                          <div key={a.name} className="bg-white/70 rounded-lg p-3 border border-gray-200 space-y-1">
                            <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                            <p className="text-xs text-gray-500">{a.locality[language]}</p>
                            <p className="text-xs text-gray-700">📞 {a.phone}</p>
                            {a.website && (
                              <a href={normalizeUrl(a.website)} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline break-all">
                                {a.website}
                              </a>
                            )}
                            {a.details && (
                              <p className="text-xs text-gray-600 pt-1">{a.details[language]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>

          {/* Map section */}
          <div className="mt-8 relative bg-white/90 rounded-xl shadow-xl p-8 border border-white/40 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 font-elvish text-primary text-center">
              Mapa de la zona
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <div className="cursor-pointer overflow-hidden rounded-lg border border-primary/20 hover:border-primary/50 transition-colors shadow-sm bg-white/50">
                  <img src="/CampillejoMap.png" alt="Mapa de Campillejo y alrededores" className="w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-300 rounded-t-lg" />
                  <p className="text-center text-sm text-gray-500 py-3 font-medium bg-white">Haz clic en la imagen para ampliar</p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] md:max-w-5xl w-full p-1 md:p-0 border-none bg-transparent shadow-none">
                <img src="/CampillejoMap.png" alt="Mapa de Campillejo y alrededores ampliado" className="w-full h-auto rounded-lg shadow-2xl object-contain max-h-[90vh]" />
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Alojamiento;
