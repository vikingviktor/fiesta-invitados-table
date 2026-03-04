import React from "react";
import Navbar from "@/components/Navbar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

// datos de alojamientos adicionales extraídos del PDF
const EXTRA_ACOMM = [
  {
    name: "El Abejaruco",
    locality: "Campillo de Ranas",
    phone: "686 662 477",
    website: "www.escapadarural.com/casa-rural/guadalajara/el-abejaruco",
    details: "Alquiler íntegro. Dispone de 5 dormitorios. Capacidad de 10 a 13 personas (tres de ellas en cama supletoria)."
  },
  {
    name: "Refugio del Valle Negro",
    locality: "Campillo de Ranas",
    phone: "600 626 23",
    website: "https://refugiosdelvallenegro.com",
    details: "Los Refugios constan de 4 apartamentos para dos adultos y hasta dos niños, 1 apartamento familiar con capacidad de 4 a 6 personas y una suite para 2 a 4 personas."
  },
  {
    name: "La Era de la Tía Donata",
    locality: "Campillo de Ranas",
    phone: "637 747 809",
    website: "www.laeradelatiadonata.com",
    details: "Se alquila por habitaciones. Dispone de 6 habitaciones dobles. Capacidad para 12 personas. Personas de contacto: María y Javier."
  },
  {
    name: "Apartamentos rurales El Acebo y El Acebuche",
    locality: "Campillo de Ranas",
    phone: "629 74 54 18",
    website: "http://apartamentosruraleselacebo.com",
    details: "Son dos apartamentos con capacidad para cuatro personas cada uno de ellos. Persona de contacto: Paco"
  },
  {
    name: "Refugio del Ocejón",
    locality: "Campillo de Ranas",
    phone: "607 896 902",
    website: "www.refugiodelocejon.es",
    details: "Apartamento para 2 personas. Persona de contacto: Beatriz"
  },
  {
    name: "Casa rural La Gata",
    locality: "Campillo de Ranas",
    phone: "659 28 98 78",
    website: "www.casarurallagata.es",
    details: "Alquiler íntegro. Dispone de dos habitaciones. Capacidad para máxima seis personas. Persona de contacto: Carmen"
  },
  {
    name: "Los Tres Olivos",
    locality: "Campillo de Ranas",
    phone: "601 244 006",
    website: "www.casalostresolivos.com",
    details: "Alquiler íntegro. Dispone de tres habitaciones. Capacidad para seis personas. Persona de contacto: Germán"
  },
  {
    name: "Casa del Sol",
    locality: "Campillo de Ranas",
    phone: "626 06 61 27",
    website: "www.casaruralcasadelsol.es",
    details: "Se alquila por habitaciones o entera. La casa consta de 3 habitaciones dobles y 1 suite, todas tienen baño privado. Personas de contacto: Carolina o Jorge"
  },
  {
    name: "El Roble Hueco",
    locality: "El Campillejo (5 km de Campillo de Ranas)",
    phone: "686 662 477",
    website: "www.casasruralesdeguadalajara.com/casa-rural-campillejo-guadalajara.html",
    details: "Alquiler íntegro. Dispone de un total de 16 plazas + 5 extras distribuidas en 8 habitaciones y 10 baños. Persona de contacto: Carolina"
  },
  {
    name: "La Pizarra Negra",
    locality: "El Campillejo (5 km de Campillo de Ranas)",
    phone: "618 290 656",
    website: "www.lapizarranegra.com",
    details: "Alquiler íntegro. La Pizarra Negra dispone de un total de 12 plazas + 3 extras distribuidas en 6 habitaciones y 6 baños. Persona de contacto: Rafa"
  },
  {
    name: "Los doce Robles",
    locality: "El Campillejo (5 km de Campillo de Ranas)",
    phone: "616 967 919",
    website: "https://losdocerobles.com/casa-rural/",
    details: "Se alquila por habitaciones. Dispone de 4 habitaciones. Capacidad de 2 a 11 personas. Persona de contacto: Esther"
  },
  {
    name: "Casa Carma",
    locality: "El Espinar (2,6 km de Campillo de Ranas)",
    phone: "626 79 46 22",
    website: "https://casa-carma-campillo-de-ranas.hotelmix.es/",
    details: "Alquiler íntegro. La casa cuenta con 2 dormitorios y 2 baños. Capacidad para 4 personas. Personas de contacto: Mario o Susana"
  },
  {
    name: "Al Viento del Ocejón",
    locality: "El Espinar (2,6 km de Campillo de Ranas)",
    phone: "620 23 68 25",
    website: "https://alvientodelocejon.com",
    details: "Alquiler íntegro. Dispone de 6 habitaciones dobles. Capacidad para 12 personas. Persona de contacto: Alicia"
  },
  {
    name: "El Postigo",
    locality: "Robleluengo (3,4 km de Campillo de Ranas)",
    phone: "619 680 522",
    website: "https://casaruralelpostigo.com",
    details: "Alquiler íntegro. Dispone de tres habitaciones. Capacidad para siete personas."
  },
  {
    name: "Apartamentos Las Cabezadas",
    locality: "Majaelrayo (3,6 km de Campillo de Ranas)",
    phone: "667 945 034",
    website: "https://www.lascabezadas.com",
    details: "Son 4 apartamentos independientes de 4 personas (y hasta 2 niños más) cada uno. Persona de contacto: Beatriz"
  },
  {
    name: "La Majada del rayo",
    locality: "Majaelrayo (3,6 km de Campillo de Ranas)",
    phone: "676 163 040",
    website: "https://lamajadadelrayo.com",
    details: "Alquiler íntegro. Dispone de 5 habitaciones dobles, con una capacidad de diez personas. Persona de contacto: Antonio"
  },
  {
    name: "El Cuento de La Encina",
    locality: "Majaelrayo (3,6 km de Campillo de Ranas)",
    phone: "606 649 853",
    website: "https://www.escapadarural.com/casa-rural/guadalajara/el-cuento-de-la-encina",
    details: "Alquiler íntegro. Dispone de 5 habitaciones. Capacidad para 2 a 8 personas. Persona de contacto: Miguel"
  },
  {
    name: "El Olmo y La Jara",
    locality: "Majaelrayo (3,6 km de Campillo de Ranas)",
    phone: "629 511 014",
    website: "https://elolmoylajara.es",
    details: "Alquiler íntegro. La casa está formada por dos estancias independientes: El Olmo y La Jara, que se pueden alquilar de manera conjunta o individual. El Olmo dispone de tres habitaciones dobles con posibilidad de 1 supletoria en dos de ellas y una habitación infantil con tres literas. La Jara dispone de una habitación doble con cama supletoria."
  },
  {
    name: "Cerezas y Miel",
    locality: "Majaelrayo (3,6 km de Campillo de Ranas)",
    phone: "699 172 953",
    website: "https://www.cerezasymiel.es",
    details: "Alquiler íntegro. Dispone de 4 dormitorios. Capacidad de 12/14 personas."
  },
  {
    name: "La Casa Beba",
    locality: "Majaelrayo (3,6 km de Campillo de Ranas)",
    phone: "628 522 040",
    website: "https://www.clubrural.com/casa-rural/guadalajara/majaelrayo/casa-rural-beba_152958",
    details: "Alquiler íntegro. Dispone de 2 habitaciones. Capacidad para 4 personas."
  },
  {
    name: "El Pajar Negro",
    locality: "Majaelrayo (3,6 km de Campillo de Ranas)",
    phone: "639 445 449",
    website: "https://elpajarnegro.com",
    details: "Alquiler íntegro. Dispone de 4 habitaciones. Capacidad para 8 plazas y 2 extras."
  },
  {
    name: "Casa del Ocejón",
    locality: "Majaelrayo (3,6 km de Campillo de Ranas)",
    phone: "692 697 285",
    website: "https://www.casadelocejon.com",
    details: "Alquiler íntegro. La casa cuenta con dos módulos que pueden alquilarse conjuntamente o de forma independiente. El primer módulo es La Casona (tiene una capacidad de 12-14 personas. En la planta baja hay 2 dormitorios suites dobles y en la planta alta 2 habitaciones y otras 2 habitaciones dobles convertibles en una habitación cuádruple). El segundo módulo es El Apartamento (tiene una capacidad de 6-8 personas. En la planta inferior hay un sofá-cama doble y en la planta superior hay 1 habitación doble y 1 habitación familiar apta para 4 personas)."
  },
  {
    name: "El Callejón de la Gata",
    locality: "Majaelrayo (3,6 km de Campillo de Ranas)",
    phone: "626 000 077",
    website: "https://www.tuscasasrurales.com%2Fel-callejon-de-la-gata",
    details: "Alquiler íntegro. Dispone de 7 habitaciones. Capacidad de 12 plazas + 3 extras. Persona de contacto: Paloma"
  },
  {
    name: "El Pequeño Pajar",
    locality: "Majaelrayo (3,6 km de Campillo de Ranas)",
    phone: "687 909 378/ 639 445 449",
    website: "www.elpequeñopajar.com",
    details: "Alquiler íntegro. Dispone de 1 habitación. Capacidad para dos personas. Personas de contacto: Gloria y Santiago"
  },
];


const Alojamiento = () => {
  const { t } = useLanguage();
  const [filterLocality, setFilterLocality] = React.useState("");

  const normalizeUrl = (url: string) =>
    url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;

  const localities = Array.from(new Set(EXTRA_ACOMM.map((a) => a.locality)));

  const filteredExtras = filterLocality
    ? EXTRA_ACOMM.filter((a) => a.locality === filterLocality)
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
                                <td className="py-1">{a.locality}</td>
                                <td className="py-1">{a.phone}</td>
                                <td className="py-1">
                                  {a.website ? (
                                    <a href={normalizeUrl(a.website)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                      {a.website}
                                    </a>
                                  ) : "–"}
                                </td>
                                <td className="py-1 text-gray-600 text-sm">
                                  {a.details || "–"}
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
                            <p className="text-xs text-gray-500">{a.locality}</p>
                            <p className="text-xs text-gray-700">📞 {a.phone}</p>
                            {a.website && (
                              <a href={normalizeUrl(a.website)} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline break-all">
                                {a.website}
                              </a>
                            )}
                            {a.details && (
                              <p className="text-xs text-gray-600 pt-1">{a.details}</p>
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
