
import React, { useEffect, useState, useCallback } from "react";
import GuestTable from "@/components/GuestTable";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import DeletedGuestTable from "@/components/DeletedGuestTable";
import MesaAdminTab from "@/components/MesaAdminTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Admin = () => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Estado compartido
  const [guests, setGuests] = useState([]);
  const [deletedGuests, setDeletedGuests] = useState([]);
  const [loadingGuests, setLoadingGuests] = useState(true);
  const [loadingDeleted, setLoadingDeleted] = useState(true);

  // Autenticación
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

  // --- FUNCIONES DE REFRESCO ---
  const fetchGuests = useCallback(async () => {
    setLoadingGuests(true);
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("date", { ascending: false });
    setGuests(data ?? []);
    setLoadingGuests(false);
  }, []);

  const fetchDeletedGuests = useCallback(async () => {
    setLoadingDeleted(true);
    const { data, error } = await supabase
      .from("deleted_guests")
      .select("*")
      .order("deleted_at", { ascending: false });
    setDeletedGuests(data ?? []);
    setLoadingDeleted(false);
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchGuests();
    fetchDeletedGuests();
  }, [fetchGuests, fetchDeletedGuests]);

  // Logout
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
        <Tabs defaultValue="invitados" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="invitados">Invitados</TabsTrigger>
            <TabsTrigger value="mesas">Mesas</TabsTrigger>
            <TabsTrigger value="eliminados">Eliminados</TabsTrigger>
          </TabsList>

          <TabsContent value="invitados">
            <GuestTable
              guests={guests}
              loading={loadingGuests}
              fetchGuests={fetchGuests}
              fetchDeletedGuests={fetchDeletedGuests}
            />
          </TabsContent>

          <TabsContent value="mesas">
            <MesaAdminTab />
          </TabsContent>

          <TabsContent value="eliminados">
            <DeletedGuestTable
              deletedGuests={deletedGuests}
              loading={loadingDeleted}
              fetchGuests={fetchGuests}
              fetchDeletedGuests={fetchDeletedGuests}
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Admin;

