import React, { useEffect, useState } from "react";
import GuestTable from "@/components/GuestTable";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import DeletedGuestTable from "@/components/DeletedGuestTable";

const Admin = () => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Verificar si hay usuario logueado, si no, redireccionar a login
  useEffect(() => {
    let ignore = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!ignore) {
        if (!session) {
          navigate("/auth", { replace: true });
        }
        setCheckingAuth(false);
      }
    });
    return () => { ignore = true; };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  if (checkingAuth) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <section className="py-10">
        <div className="flex justify-end mb-6 mr-4">
          <Button variant="secondary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
        <GuestTable />
        <DeletedGuestTable />
      </section>
    </div>
  );
};

export default Admin;
