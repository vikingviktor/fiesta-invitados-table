import React from "react";
import Navbar from "@/components/Navbar";
import { Clock, Wine, UtensilsCrossed, PartyPopper, Coffee, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EventItem {
  time: string;
  titleKey: string;
  descKey: string;
  icon: React.ElementType;
}

const Horarios = () => {
  const { t } = useLanguage();

  const events: EventItem[] = [
    {
      time: "13:00",
      titleKey: "schedule.ceremony.title",
      descKey: "schedule.ceremony.description",
      icon: Heart,
    },
    {
      time: "14:00",
      titleKey: "schedule.cocktail.title",
      descKey: "schedule.cocktail.description",
      icon: Wine,
    },
    {
      time: "15:00",
      titleKey: "schedule.banquet.title",
      descKey: "schedule.banquet.description",
      icon: UtensilsCrossed,
    },
    {
      time: "17:15",
      titleKey: "schedule.openbar.title",
      descKey: "schedule.openbar.description",
      icon: PartyPopper,
    },
    {
      time: "20:30",
      titleKey: "schedule.latesupper.title",
      descKey: "schedule.latesupper.description",
      icon: Coffee,
    },
    {
      time: "22:00",
      titleKey: "schedule.end.title",
      descKey: "schedule.end.description",
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/rivendell-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10">
        <Navbar transparent />

        <section className="py-24 sm:py-32 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-cinzel text-amber-400/80 text-sm tracking-[0.3em] uppercase">
                  {t("schedule.subtitle")}
                </span>
                <Heart className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent mb-4">
                {t("schedule.title")}
              </h1>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6" />
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/50 via-amber-400 to-amber-400/50 sm:-translate-x-1/2" />

              {/* Events */}
              <div className="space-y-12">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className={`relative flex items-start gap-8 ${
                      index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                  >
                    {/* Time Badge - Mobile */}
                    <div className="sm:hidden absolute left-0 top-0">
                      <div className="w-16 h-16 rounded-full bg-amber-500 border-4 border-gray-900 flex items-center justify-center z-10 relative">
                        <span className="font-cinzel text-sm font-bold text-white">{event.time}</span>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div
                      className={`ml-24 sm:ml-0 sm:w-5/12 ${
                        index % 2 === 0 ? "sm:text-right sm:pr-12" : "sm:text-left sm:pl-12"
                      }`}
                    >
                      <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-amber-400/20 hover:border-amber-400/40 transition-all duration-300 group">
                        <div
                          className={`flex items-center gap-3 mb-3 ${
                            index % 2 === 0 ? "sm:flex-row-reverse" : ""
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center group-hover:bg-amber-400/30 transition-colors">
                            <event.icon className="w-5 h-5 text-amber-400" />
                          </div>
                          <h3 className="font-cinzel text-xl text-amber-400">
                            {t(event.titleKey)}
                          </h3>
                        </div>
                        <p className="font-serif text-lg text-amber-100/70 leading-relaxed">
                          {t(event.descKey)}
                        </p>
                      </div>
                    </div>

                    {/* Center Node - Desktop */}
                    <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 top-0">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-gray-900 flex items-center justify-center z-10 shadow-lg shadow-amber-400/30">
                        <span className="font-cinzel text-lg font-bold text-white">{event.time}</span>
                      </div>
                    </div>

                    {/* Empty Space for alternating layout */}
                    <div className="hidden sm:block sm:w-5/12" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Quote */}
            <div className="text-center mt-16">
              <p className="font-serif italic text-xl text-amber-100/80">
                "Es peligroso, Frodo, salir por tu puerta. <br />
                Das un paso y si no cuidas tus pasos, no hay manera de saber a dónde te arrastrarán."
              </p>
              <p className="font-cinzel text-sm text-amber-400/70 mt-3">— Bilbo Bolsón</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Horarios;
