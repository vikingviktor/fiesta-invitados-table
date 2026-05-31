import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import PaymentCard from "@/components/viaje/PaymentCard";
import hobbitsAsiaBg from "@/assets/hobbits-in-asia.png";

// Reemplaza estos valores cuando los tengas listos
const IBAN = "ES49 0073 0100 5406 3622 2286";
const IBAN_HOLDER = "Sara & Victor";
const BIZUM = "+34 6XX XXX XXX";
const PAYPAL = "https://paypal.me/sarayvictor";

const Viaje: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Sara & Victor · " + t("viaje.title");

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);

    return () => {
      document.title = prevTitle;
      document.head.removeChild(meta);
    };
  }, [t]);

  return (
    <div
      className="min-h-screen text-amber-950 bg-[#f8f6f1] bg-fixed bg-center bg-cover relative"
      style={{ backgroundImage: `url(${hobbitsAsiaBg})` }}
    >
      {/* Cream overlay for readability */}
      <div className="absolute inset-0 bg-[#f8f6f1]/75 backdrop-blur-[2px] pointer-events-none" />
      <div className="relative z-10">
      <header className="flex items-center justify-between px-4 md:px-8 py-4">
        <Link
          to="/"
          className="font-antiqua text-sm md:text-base text-amber-900 hover:text-amber-700 transition-colors"
        >
          {t("viaje.back")}
        </Link>
        <LanguageSelector />
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-16 pt-4 md:pt-8">
        <h1 className="font-cinzel text-3xl md:text-5xl text-center text-amber-900 mb-6 leading-tight">
          {t("viaje.title")}
        </h1>

        <div className="flex justify-center mb-8">
          <div className="h-px w-24 bg-amber-900/30" />
        </div>

        <p className="font-antiqua text-base md:text-lg text-center text-amber-950/90 mb-4 leading-relaxed">
          {t("viaje.intro1")}
        </p>
        <p className="font-antiqua text-sm md:text-base text-center text-amber-950/75 mb-10 leading-relaxed">
          {t("viaje.intro2")}
        </p>

        <div className="space-y-4">
          <PaymentCard
            label={t("viaje.iban.label")}
            value={IBAN}
            subline={`${t("viaje.iban.holder")}: ${IBAN_HOLDER}`}
            featured
            mono
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PaymentCard label={t("viaje.bizum.label")} value={BIZUM} mono />
            <PaymentCard label={t("viaje.paypal.label")} value={PAYPAL} />
          </div>
        </div>

        <p className="font-cinzel text-center text-amber-900/70 mt-12 text-sm md:text-base tracking-wider">
          {t("viaje.closing")}
        </p>
      </main>
      </div>
    </div>
  );
};

export default Viaje;