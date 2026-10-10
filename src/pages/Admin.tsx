import React, { useEffect, useState, useCallback } from "react";
import GuestTable from "@/components/GuestTable";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import DeletedGuestTable from "@/components/DeletedGuestTable";
import MesaAdminTab from "@/components/MesaAdminTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mapDbGuestToGuest } from "@/utils/guestUtils";
import CancionesTab from "@/components/CancionesTab";
import HabitacionesAdminTab from "@/components/HabitacionesAdminTab";
import MapaMesasTab from "@/components/MapaMesasTab";
import PagosTab from "@/components/PagosTab";
import MenusTab from "@/components/MenusTab";

const Admin = () => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isViewer, setIsViewer] = useState(false);

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
          setCheckingAuth(false);
          return;
        }
        supabase
          .from("user_roles" as any)
          .select("role")
          .eq("user_id", session.user.id)
          .then(({ data }) => {
            if (ignore) return;
            setIsViewer(((data as any[]) ?? []).some((r) => r.role === "viewer"));
            setCheckingAuth(false);
          });
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth", { replace: true });
    });
    return () => { ignore = true; sub.subscription.unsubscribe(); };
  }, [navigate]);

  // --- FUNCIONES DE REFRESCO ---
  const fetchGuests = useCallback(async () => {
    setLoadingGuests(true);
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("date", { ascending: false });
    // Aplicar el mapeo aquí
    const mappedData = (data ?? []).map(mapDbGuestToGuest);
    setGuests(mappedData);
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
        {isViewer && (
          <p className="text-center mb-4 text-muted-foreground">Modo solo lectura</p>
        )}
        <Tabs defaultValue="invitados" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="invitados">Invitados</TabsTrigger>
            <TabsTrigger value="mesas">Mesas</TabsTrigger>
            <TabsTrigger value="habitaciones">Habitaciones</TabsTrigger>
            <TabsTrigger value="eliminados">Eliminados</TabsTrigger>
            <TabsTrigger value="canciones">Canciones</TabsTrigger>
            <TabsTrigger value="mapa">Mapa Mesas</TabsTrigger>
            <TabsTrigger value="menus">Menús</TabsTrigger>
            {!isViewer && <TabsTrigger value="pagos">Pagos</TabsTrigger>}
          </TabsList>
        <fieldset disabled={isViewer} className={isViewer ? "[&_[draggable]]:pointer-events-none" : ""}>

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

          <TabsContent value="habitaciones">
            <HabitacionesAdminTab />
          </TabsContent>

          <TabsContent value="eliminados">
            <DeletedGuestTable
              deletedGuests={deletedGuests}
              loading={loadingDeleted}
              fetchGuests={fetchGuests}
              fetchDeletedGuests={fetchDeletedGuests}
            />
          </TabsContent>

          <TabsContent value="canciones">
            <CancionesTab />
          </TabsContent>

          <TabsContent value="mapa">
            <MapaMesasTab />
          </TabsContent>

          <TabsContent value="menus">
            <MenusTab />
          </TabsContent>

          {!isViewer && (
            <TabsContent value="pagos">
              <PagosTab />
            </TabsContent>
          )}
        </fieldset>
        </Tabs>
      </section>
    </div>
  );
};

export default Admin;
