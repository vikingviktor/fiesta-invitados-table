
import React, { useState, useEffect } from "react";
import GuestForm from "@/components/GuestForm";
import Navbar from "@/components/Navbar";

const WEDDING_DATE = new Date("2026-11-14T12:00:00");

const Index = () => {
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
      <section className="max-w-2xl mx-auto py-12 px-2 flex flex-col gap-8 items-center">
        <div
          className="
            relative bg-white/90 rounded-xl shadow-xl p-8 border text-center flex flex-col gap-5
            overflow-hidden
          "
          style={{
            backgroundImage: "url('/flowers-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md pointer-events-none" aria-hidden="true" />
          <div className="relative z-10 flex flex-col gap-5">
            <h1 className="text-5xl font-bold mb-2 font-elvish">
              ¡Te invitamos a nuestra boda!
            </h1>
            
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-semibold text-primary">
                Sábado 14 de Noviembre 2026
              </p>
              <p className="text-lg text-muted-foreground">
                Aldea Tejera Negra, Campillo de Ranas, Guadalajara
              </p>
            </div>

            <div className="flex justify-center gap-4 my-4">
              <div className="flex flex-col items-center bg-primary/10 rounded-lg px-4 py-3 min-w-[70px]">
                <span className="text-3xl font-bold text-primary">{timeLeft.days}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">días</span>
              </div>
              <div className="flex flex-col items-center bg-primary/10 rounded-lg px-4 py-3 min-w-[70px]">
                <span className="text-3xl font-bold text-primary">{timeLeft.hours}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">horas</span>
              </div>
              <div className="flex flex-col items-center bg-primary/10 rounded-lg px-4 py-3 min-w-[70px]">
                <span className="text-3xl font-bold text-primary">{timeLeft.minutes}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">min</span>
              </div>
              <div className="flex flex-col items-center bg-primary/10 rounded-lg px-4 py-3 min-w-[70px]">
                <span className="text-3xl font-bold text-primary">{timeLeft.seconds}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">seg</span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground">
              Por favor, confirma tu asistencia rellenando el siguiente formulario. <br />
              ¡Esperamos compartir este día tan especial contigo!
            </p>
          </div>
        </div>
        <GuestForm />
      </section>
      </div>
    </div>
  );
};

export default Index;
