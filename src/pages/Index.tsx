
import React from "react";
import GuestForm from "@/components/GuestForm";
import Navbar from "@/components/Navbar";

const Index = () => {
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
            // Usamos una imagen floral clara como fondo decorativo
            backgroundImage: "url('/flowers-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md pointer-events-none" aria-hidden="true" />
          <div className="relative z-10 flex flex-col gap-5">
            <h1 className="text-4xl font-bold mb-2 font-elvish">
              ¡Te invitamos a nuestra boda!
            </h1>
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
