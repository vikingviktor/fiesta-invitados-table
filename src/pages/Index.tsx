
import React from "react";
import GuestForm from "@/components/GuestForm";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <Navbar />
      <section className="max-w-2xl mx-auto py-12 px-2 flex flex-col gap-8 items-center">
        <div className="bg-white/90 rounded-xl shadow-xl p-8 border text-center flex flex-col gap-5">
          <h1 className="text-4xl font-bold mb-2">
            ¡Te invitamos a nuestra boda!
          </h1>
          <p className="text-lg text-muted-foreground">
            Por favor, confirma tu asistencia rellenando el siguiente formulario. <br />
            ¡Esperamos compartir este día tan especial contigo!
          </p>
        </div>
        <GuestForm />
      </section>
    </div>
  );
};

export default Index;
