import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import OneRingEasterEgg from "@/components/OneRingEasterEgg";
import { Shirt, Sparkles, Ban, AlertTriangle, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const outfitIdeas = [
  "dresscode.tips.tip1",
  "dresscode.tips.tip2",
  "dresscode.tips.tip3",
  "dresscode.tips.tip4",
];

const DressCode = () => {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* Fixed background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/couple-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10">
        <Navbar transparent />

        <section className="py-16 sm:py-24 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Toggle button */}
            <div className="text-center mb-6">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/40 backdrop-blur-sm text-amber-300 font-cinzel text-sm border border-amber-400/30 hover:border-amber-400/50 hover:bg-black/50 transition-all"
              >
                {collapsed ? (
                  <>
                    {t("dresscode.title")} <ChevronDown className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    {t("dresscode.viewimage")} <ChevronUp className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {!collapsed && (
              <>
                {/* Section Header */}
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Shirt className="w-5 h-5 text-amber-400" />
                    <span className="font-cinzel text-amber-400/80 text-sm tracking-[0.3em] uppercase">
                      {t("dresscode.subtitle")}
                    </span>
                    <Shirt className="w-5 h-5 text-amber-400" />
                  </div>
                  <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent mb-4">
                    {t("dresscode.title")}
                  </h1>
                </div>

                {/* Main Content - Two column layout like Vestimenta.tsx */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                  {/* Style Card - Light parchment style */}
                  <div className="bg-amber-50/90 backdrop-blur-sm rounded-2xl p-8 text-stone-800">
                    <div className="flex items-center gap-3 mb-6">
                      <OneRingEasterEgg>
                        <div className="shrink-0 flex justify-center items-center hover:scale-110 transition-transform duration-200">
                          <img src="/ring.png" alt="Ring" className="h-12 w-12 object-contain drop-shadow-md" />
                        </div>
                      </OneRingEasterEgg>
                      <h3 className="font-cinzel text-2xl text-stone-700">
                        {t("dresscode.theme.title")}
                      </h3>
                    </div>

                    <p className="font-cinzel text-base leading-relaxed mb-6">
                      {t("dresscode.theme.description")}
                    </p>

                    <div className="bg-stone-700/10 rounded-xl p-6">
                      <h4 className="font-cinzel text-lg text-stone-700 mb-4">
                        {t("dresscode.tips.title")}
                      </h4>
                      <ul className="space-y-3">
                        {outfitIdeas.map((tipKey, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                            <span className="font-cinzel text-base">{t(tipKey)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Rules Cards - Dark style */}
                  <div className="space-y-6">
                    {/* Important Rule */}
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-red-500/30">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                        <h3 className="font-cinzel text-xl text-red-400">
                          {t("dresscode.rule.title")}
                        </h3>
                      </div>
                      <div className="flex items-start gap-4">
                        <Ban className="w-6 h-6 text-red-400 flex-shrink-0" />
                        <p className="font-cinzel text-amber-100/80 leading-relaxed">
                          {t("dresscode.rule.description")}
                        </p>
                      </div>
                    </div>

                    {/* No Obligation */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-amber-400/20">
                      <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-6 h-6 text-amber-400" />
                        <h3 className="font-cinzel text-xl text-amber-300">
                          {t("dresscode.noobligation.title")}
                        </h3>
                      </div>
                      <p className="font-cinzel text-amber-100/80 leading-relaxed">
                        {t("dresscode.noobligation.description")}
                      </p>
                    </div>

                    {/* Encouragement */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20">
                      <div className="flex items-center gap-3 mb-4">
                        <Shirt className="w-6 h-6 text-green-400" />
                        <h3 className="font-cinzel text-xl text-green-400">
                          {t("dresscode.encouraged.title")}
                        </h3>
                      </div>
                      <p className="font-cinzel text-amber-100/80 leading-relaxed">
                        {t("dresscode.encouraged.description")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stores Section */}
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-amber-400/20">
                  <h3 className="font-cinzel text-2xl text-amber-300 text-center mb-8">
                    {t("dresscode.buy.title")}
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: "La Corte del Tejón", url: "lacortedeltejon.shop/categoria-producto/colecciones/el-senor-de-los-anillos/hobbits/", desc: "Ropa temática LOTR" },
                      { name: "Burgschneider", url: "burgschneider.com/es-eu/collections/ropa-de-larp/fantasy", desc: "Ropa LARP y fantasy" },
                      { name: "Epic Armoury", url: "epicarmoury.com/collections/clothing", desc: "Vestimenta medieval" },
                      { name: "EMP Online", url: "www.emp-online.es/fan-merch/el-senor-de-los-anillos/", desc: "Merchandising LOTR" },
                    ].map((tienda, index) => (
                      <a
                        key={index}
                        href={`https://${tienda.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block text-center p-5 rounded-xl bg-amber-400/5 border border-amber-400/20 hover:border-amber-400/50 hover:bg-amber-400/10 transition-all duration-300"
                      >
                        <h4 className="font-cinzel text-amber-200 group-hover:text-amber-300 mb-1">
                          {tienda.name}
                        </h4>
                        <p className="font-cinzel text-xs text-amber-100/40">
                          {tienda.desc}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DressCode;
