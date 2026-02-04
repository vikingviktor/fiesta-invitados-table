import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TreePine, Church, Mountain, Camera, UtensilsCrossed, Footprints } from "lucide-react";

const CosasQueHacer = () => {
  const actividades = [
    {
      icon: TreePine,
      title: "Hayedo de Tejera Negra",
      description: "Parque Natural declarado Patrimonio de la Humanidad por la UNESCO. Disfruta de sus rutas de senderismo entre hayas centenarias, especialmente espectaculares en otoño.",
      distancia: "A 5 km"
    },
    {
      icon: Mountain,
      title: "Pueblos Negros",
      description: "Recorre los encantadores pueblos de arquitectura negra: Campillo de Ranas, Majaelrayo, Valverde de los Arroyos, Robleluengo. Casas construidas con pizarra que les dan ese color oscuro característico.",
      distancia: "En la zona"
    },
    {
      icon: Church,
      title: "Iglesias y Ermitas",
      description: "Visita las iglesias románicas y ermitas con encanto de la zona. Destacan la iglesia de Campillo de Ranas y la ermita de la Virgen de la Soledad.",
      distancia: "En el pueblo"
    },
    {
      icon: Footprints,
      title: "Rutas de Senderismo",
      description: "Múltiples rutas señalizadas por el valle del río Sorbe, cascadas, miradores naturales y paisajes de montaña. Desde rutas sencillas hasta más exigentes.",
      distancia: "Diversas distancias"
    },
    {
      icon: Camera,
      title: "Miradores Naturales",
      description: "Disfruta de impresionantes vistas panorámicas desde los diversos miradores de la zona. Perfectos para fotografía de paisajes y naturaleza.",
      distancia: "Por toda la zona"
    },
    {
      icon: UtensilsCrossed,
      title: "Gastronomía Local",
      description: "Degusta la cocina tradicional serrana: cabrito asado, judías del Barco, trucha del río, setas de temporada y miel de la zona. Varios restaurantes en los pueblos cercanos.",
      distancia: "En los pueblos"
    }
  ];

  const pueblosRecomendados = [
    { nombre: "Valverde de los Arroyos", descripcion: "Uno de los pueblos más bonitos de la arquitectura negra" },
    { nombre: "Majaelrayo", descripcion: "Pueblo con encanto, ideal para pasear por sus calles empedradas" },
    { nombre: "Campillo de Ranas", descripcion: "Pueblo base, punto de partida para muchas rutas" },
    { nombre: "Robleluengo", descripcion: "Pequeño pueblo tranquilo con vistas impresionantes" },
    { nombre: "Tamajón", descripcion: "Pueblo más grande con servicios y restaurantes" }
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
                Qué Hacer en la Zona
              </h1>
              <p className="text-lg text-gray-700">
                Los Pueblos Negros de Guadalajara ofrecen naturaleza, cultura e historia.
                Aquí tienes algunas sugerencias para disfrutar de tu estancia.
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
                          <CardTitle className="text-xl mb-1">{actividad.title}</CardTitle>
                          <CardDescription className="text-primary font-medium">
                            {actividad.distancia}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{actividad.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Pueblos Recomendados para Visitar
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pueblosRecomendados.map((pueblo, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{pueblo.nombre}</h3>
                      <p className="text-sm text-gray-600">{pueblo.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">💡 Consejos Útiles</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Lleva calzado cómodo para caminar por las calles empedradas y rutas de montaña</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>La zona es ideal para desconectar; la cobertura móvil puede ser limitada en algunos puntos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>En otoño (octubre-noviembre) el hayedo está en su máximo esplendor con colores espectaculares</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Reserva con antelación en restaurantes, especialmente los fines de semana</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CosasQueHacer;
