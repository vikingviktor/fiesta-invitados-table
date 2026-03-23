import React, { useState, useEffect, useCallback } from "react";
import GuestForm from "@/components/GuestForm";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { RotateCcw } from "lucide-react";

const WEDDING_DATE = new Date("2026-11-14T12:00:00");

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = WEDDING_DATE.getTime() - now.getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const [doorHidden, setDoorHidden] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setDoorOpen(false);
    setContentVisible(false);
    setDoorHidden(false);
    setHeroVisible(false);

    const img = new Image();
    img.src = "/hobbit-door-2.png";

    const startAnimation = () => {
      const doorTimer = setTimeout(() => setDoorOpen(true), 1500);
      const contentTimer = setTimeout(() => setContentVisible(true), 3500);
      const hideTimer = setTimeout(() => setDoorHidden(true), 10000);
      return () => {
        clearTimeout(doorTimer);
        clearTimeout(contentTimer);
        clearTimeout(hideTimer);
      };
    };

    let cleanup: (() => void) | undefined;

    if (img.complete) {
      cleanup = startAnimation();
    } else {
      img.onload = () => { cleanup = startAnimation(); };
      const fallback = setTimeout(() => { cleanup = startAnimation(); }, 3000);
      img.onerror = () => { clearTimeout(fallback); cleanup = startAnimation(); };
      return () => { clearTimeout(fallback); cleanup?.(); };
    }

    return () => { cleanup?.(); };
  }, [animationKey]);

  const handleReplay = useCallback(() => {
    setAnimationKey((k) => k + 1);
    setShowForm(false);
    setDoorHidden(false);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f8f6f1]">
      {/* Original background - visible initially, fades out */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-[2s] ease-out ${
          contentVisible ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: "url('/generic-bg-2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Hero background - only visible after door is fully gone */}
      <div
        className={`absolute inset-0 z-0 transition-all duration-[2s] ease-out ${
          doorHidden
            ? "opacity-100 scale-100"
            : "opacity-0 scale-110"
        }`}
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* White light flash on transition */}
      <div
        className={`absolute inset-0 z-[1] pointer-events-none transition-opacity ${
          doorOpen && !contentVisible ? "opacity-70 duration-[0.8s]" : "opacity-0 duration-[1.5s]"
        }`}
        style={{ background: "radial-gradient(circle, rgba(255,255,230,1) 0%, rgba(255,255,240,0.8) 100%)" }}
      />
      {/* Subtle overlay for text readability */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-[2s] ${
          contentVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 100%)" }}
      />

      {/* Door scene - with "entering" zoom effect, hidden after transition */}
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center ${
          contentVisible ? "pointer-events-none" : ""
        }`}
        style={{
          perspective: "1200px",
          display: doorHidden ? "none" : undefined,
          transform: contentVisible ? "scale(4)" : "scale(1)",
          opacity: contentVisible ? 0 : 1,
          transition: contentVisible
            ? "transform 6s cubic-bezier(0.4, 0, 0.2, 1), opacity 2s ease-in 4s"
            : "none",
        }}
      >
        <div className={`hobbit-frame relative ${contentVisible ? "hobbit-frame--clear" : ""}`} key={animationKey}>
          <div className="hobbit-arch">
            <div className="hobbit-vine hobbit-vine--left" />
            <div className="hobbit-vine hobbit-vine--right" />
          </div>
          <div className={`hobbit-door ${doorOpen ? "hobbit-door--open" : ""}`}>
            <div className="hobbit-door__wood" />
            <div className={`hobbit-door__text ${doorOpen ? "hobbit-door__text--fade" : ""}`}>
              <span>A Very Special</span>
              <span>Wedding Party!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - appears after door disappears */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen transition-opacity duration-1000 ${
          doorHidden ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="text-center px-4 py-8 max-w-lg mx-auto mt-16">
          <p className="text-base sm:text-lg md:text-xl text-amber-100 font-antiqua mb-3 leading-relaxed whitespace-pre-line drop-shadow-lg">
            {t("index.venue")}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-amber-200 italic font-antiqua mb-2 max-w-md mx-auto leading-relaxed drop-shadow-lg">
            {t("index.quote1")}
            <br />
            {t("index.quote2")}
          </p>
          {/* Countdown */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-6">
            {[
              { val: timeLeft.days, label: t("index.countdown.days") },
              { val: timeLeft.hours, label: t("index.countdown.hours") },
              { val: timeLeft.minutes, label: t("index.countdown.minutes") },
            ].map(({ val, label }) => (
              <div
                key={label}
                className="flex flex-col items-center bg-black/30 border border-amber-400/30 rounded-lg px-3 py-2 sm:px-4 sm:py-3 min-w-[56px] sm:min-w-[70px] backdrop-blur-sm"
              >
                <span className="text-2xl sm:text-3xl font-bold text-amber-100 drop-shadow-md">
                  {val}
                </span>
                <span className="text-[10px] sm:text-xs text-amber-300 uppercase tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-sm sm:text-base text-amber-200/90 font-antiqua mb-4 drop-shadow-md">
            {t("index.rsvp.description")}
          </p>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-amber-700/80 hover:bg-amber-600/90 text-amber-100 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 border border-amber-500/30 backdrop-blur-sm"
          >
            {showForm ? t("index.rsvp.edit") : t("index.rsvp.button")}
          </button>
        </div>

        {/* Guest form below */}
        {showForm && (
          <div className="w-full max-w-2xl mx-auto px-4 pb-12 mt-6 z-20 relative">
            <GuestForm />
          </div>
        )}
      </div>

      {/* Replay button */}
      <button
        onClick={handleReplay}
        className="fixed bottom-4 right-4 z-50 bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 p-2 rounded-full backdrop-blur-sm border border-amber-700/30 transition-all"
        title="Replay animation"
      >
        <RotateCcw className="h-4 w-4" />
      </button>

      {/* Navbar appears after door opens */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-1000 ${
          doorHidden
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full"
        }`}
      >
        <Navbar transparent />
      </div>
    </div>
  );
};

export default Index;
