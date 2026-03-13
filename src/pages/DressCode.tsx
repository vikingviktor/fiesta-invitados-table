import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Shirt, Sparkles, Ban, Gem, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const DressCode = () => {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/couple-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="absolute inset-0 bg-black/10"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <Navbar />
        <section className="max-w-3xl mx-auto py-12 px-4">
          {/* Toggle button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mx-auto mb-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm text-primary font-semibold shadow-md hover:bg-white/80 transition-colors"
          >
            {collapsed ? (
              <>
                {t("dresscode.title")} <ChevronDown className="h-4 w-4" />
              </>
            ) : (
              <>
                Ver imagen <ChevronUp className="h-4 w-4" />
              </>
            )}
          </button>

          {!collapsed && (
            <div className="relative bg-white/85 rounded-xl shadow-xl p-8 border border-white/50 backdrop-blur-sm">
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-3 font-elvish text-primary">
                  {t("dresscode.title")}
                </h1>
                <p className="text-lg text-gray-700">
                  {t("dresscode.subtitle")}
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-primary/30 bg-white/80">
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="bg-primary/10 p-2 rounded-full shrink-0 flex justify-center items-center">
                      <img src="/ring.png" alt="Ring" className="h-8 w-8 object-contain drop-shadow-sm" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-primary mb-1">
                        {t("dresscode.theme.title")}
                      </h3>
                      <p className="text-gray-700">
                        {t("dresscode.theme.description")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-300/60 bg-white/80">
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="bg-amber-100 p-3 rounded-full shrink-0">
                      <Sparkles className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-amber-800 mb-1">
                        {t("dresscode.noobligation.title")}
                      </h3>
                      <p className="text-gray-700">
                        {t("dresscode.noobligation.description")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-300/40 bg-emerald-50/50">
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="bg-emerald-100 p-3 rounded-full shrink-0">
                      <Shirt className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-emerald-800 mb-1">
                        {t("dresscode.encouraged.title")}
                      </h3>
                      <p className="text-gray-700">
                        {t("dresscode.encouraged.description")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-400/50 bg-red-50/60 shadow-md">
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="bg-red-100 p-3 rounded-full shrink-0">
                      <Ban className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-red-700 mb-1">
                        {t("dresscode.rule.title")}
                      </h3>
                      <p className="text-gray-700 font-medium">
                        {t("dresscode.rule.description")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-semibold text-primary mb-3">
                    {t("dresscode.tips.title")}
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {t("dresscode.tips.tip1")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {t("dresscode.tips.tip2")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {t("dresscode.tips.tip3")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {t("dresscode.tips.tip4")}
                    </li>
                  </ul>
                </div>

                <div className="mt-8 p-4 bg-secondary/5 rounded-lg border border-secondary/10">
                  <h3 className="font-semibold text-black mb-3">
                    {t("dresscode.buy.title")}
                  </h3>
                  <ul className="list-disc list-inside text-blue-600">
                    <li>
                      <a href="https://lacortedeltejon.shop/categoria-producto/colecciones/el-senor-de-los-anillos/hobbits/" target="_blank" rel="noopener noreferrer">
                        lacortedeltejon.shop – El Señor de los Anillos / Hobbits
                      </a>
                    </li>
                    <li>
                      <a href="https://burgschneider.com/es-eu/collections/ropa-de-larp/fantasy" target="_blank" rel="noopener noreferrer">
                        burgschneider.com – ropa LARP / fantasy
                      </a>
                    </li>
                    <li>
                      <a href="https://epicarmoury.com/collections/clothing" target="_blank" rel="noopener noreferrer">
                        epicarmoury.com – fantasy clothing
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DressCode;
