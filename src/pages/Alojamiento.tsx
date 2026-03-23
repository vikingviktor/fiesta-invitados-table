import React from "react";
import Navbar from "@/components/Navbar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { EXTRA_ACOMM } from "@/data/accommodations";
import { Hotel } from "lucide-react";

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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Hotel className="w-5 h-5 text-amber-400" />
                <span className="font-cinzel text-amber-400/80 text-sm tracking-[0.3em] uppercase">
                  {t("accommodation.subtitle")}
                </span>
                <Hotel className="w-5 h-5 text-amber-400" />
              </div>
              <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent mb-4">
                {t("accommodation.title")}
              </h1>
            </div>

            {/* Map section */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-amber-400/20 mb-8">
              <h2 className="font-cinzel text-2xl text-amber-300 mb-4 text-center">
                Mapa de la zona
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer overflow-hidden rounded-lg border border-amber-400/20 hover:border-amber-400/40 transition-colors shadow-sm">
                    <img src="/CampillejoMap.png" alt="Mapa de Campillejo y alrededores" className="w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-300" />
                    <p className="text-center font-cinzel text-sm text-amber-100/60 py-3 bg-black/30">Haz clic en la imagen para ampliar</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] md:max-w-5xl w-full p-1 md:p-0 border-none bg-transparent shadow-none">
                  <img src="/CampillejoMap.png" alt="Mapa de Campillejo y alrededores ampliado" className="w-full h-auto rounded-lg shadow-2xl object-contain max-h-[90vh]" />
                </DialogContent>
              </Dialog>
            </div>

            {/* Accommodation details */}
            {EXTRA_ACOMM.length > 0 && (
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-amber-400/20">
                <Accordion type="single" collapsible defaultValue="extras">
                  <AccordionItem value="extras" className="border-amber-400/20">
                    <AccordionTrigger className="font-cinzel text-amber-300 hover:text-amber-200 hover:no-underline">
                      {t("accommodation.more.title")}
                    </AccordionTrigger>
                    <AccordionContent>
                      {/* locality filter */}
                      <div className="mb-4">
                        <label className="block font-cinzel text-sm text-amber-300/80 mb-1">
                          {t("accommodation.filter.locality")}
                        </label>
                        <select
                          value={filterLocality}
                          onChange={(e) => setFilterLocality(e.target.value)}
                          className="mt-1 block w-full rounded-md bg-black/30 border-amber-400/30 text-amber-100 font-cinzel focus:border-amber-400 focus:ring-amber-400"
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
                        <table className="w-full text-left font-cinzel">
                          <thead className="border-b border-amber-400/30">
                            <tr className="text-amber-300">
                              <th className="py-2">{t("accommodation.table.name")}</th>
                              <th className="py-2">{t("accommodation.table.locality")}</th>
                              <th className="py-2">{t("accommodation.table.phone")}</th>
                              <th className="py-2">{t("accommodation.table.website")}</th>
                              <th className="py-2">{t("accommodation.table.details")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredExtras.map((a) => (
                              <tr key={a.name} className="border-b border-amber-400/10 last:border-none text-amber-100/80">
                                <td className="py-2">{a.name}</td>
                                <td className="py-2">{a.locality[language]}</td>
                                <td className="py-2">{a.phone}</td>
                                <td className="py-2">
                                  {a.website ? (
                                    <a href={normalizeUrl(a.website)} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">
                                      {a.website}
                                    </a>
                                  ) : "–"}
                                </td>
                                <td className="py-2 text-amber-100/60 text-sm">
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
                          <div key={a.name} className="bg-black/30 rounded-lg p-3 border border-amber-400/10 space-y-1 font-cinzel">
                            <p className="text-amber-200 text-sm">{a.name}</p>
                            <p className="text-xs text-amber-100/50">{a.locality[language]}</p>
                            <p className="text-xs text-amber-100/70">📞 {a.phone}</p>
                            {a.website && (
                              <a href={normalizeUrl(a.website)} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-400 underline break-all">
                                {a.website}
                              </a>
                            )}
                            {a.details && (
                              <p className="text-xs text-amber-100/60 pt-1">{a.details[language]}</p>
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
        </section>
      </div>
    </div>
  );
};

export default Alojamiento;
