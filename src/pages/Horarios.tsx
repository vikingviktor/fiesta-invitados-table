import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Wine, UtensilsCrossed, PartyPopper, Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Horarios = () => {
  const { t } = useLanguage();

  const eventos = [
    {
      icon: Wine,
      titleKey: "schedule.cocktail.title",
      timeKey: "schedule.cocktail.time",
      descriptionKey: "schedule.cocktail.description",
    },
    {
      icon: UtensilsCrossed,
      titleKey: "schedule.banquet.title",
      timeKey: "schedule.banquet.time",
      descriptionKey: "schedule.banquet.description",
    },
    {
      icon: PartyPopper,
      titleKey: "schedule.openbar.title",
      timeKey: "schedule.openbar.time",
      descriptionKey: "schedule.openbar.description",
    },
    {
      icon: Coffee,
      titleKey: "schedule.latesupper.title",
      timeKey: "schedule.latesupper.time",
      descriptionKey: "schedule.latesupper.description",
    },
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
        <section className="max-w-3xl mx-auto py-12 px-4">
          <div className="relative bg-white/90 rounded-xl shadow-xl p-8 border border-white/40 backdrop-blur-sm">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-3 font-elvish text-primary">
                {t("schedule.title")}
              </h1>
              <p className="text-lg text-gray-700">
                {t("schedule.subtitle")}
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/30 hidden md:block" />

              <div className="space-y-6">
                {eventos.map((evento, index) => {
                  const IconComponent = evento.icon;
                  return (
                    <Card key={index} className="bg-white/80 border-gray-200 hover:shadow-lg transition-shadow md:ml-12">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-1">{t(evento.titleKey)}</CardTitle>
                            <div className="flex items-center gap-2 text-primary font-semibold">
                              <Clock className="h-4 w-4" />
                              <span>{t(evento.timeKey)}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{t(evento.descriptionKey)}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Horarios;
