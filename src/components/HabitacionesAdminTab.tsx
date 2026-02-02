import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/types/guestTypes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Home, Users, Bed } from "lucide-react";

type GuestWithHabitacion = Guest & { habitacion?: string | null };

type Alojamiento = {
  id: string;
  propiedad: string;
  habitacion: string;
  tipo_cama: string | null;
  plazas: number;
  observaciones: string | null;
};

function mapDbGuestToGuestWithHabitacion(dbGuest: any): GuestWithHabitacion {
  return {
    id: dbGuest.id,
    nombre: dbGuest.nombre,
    plusOne: dbGuest.plus_one,
    nombreAcompanante: dbGuest.nombre_acompanante ?? "",
    menu: dbGuest.menu,
    comentario: dbGuest.comentario ?? "",
    date: dbGuest.date,
    cancionFavorita: dbGuest.cancion_favorita ?? "",
    consentimientoPublicacion: !!dbGuest.consentimiento_publicacion,
    menuAcompanante: dbGuest.menu_acompanante ?? undefined,
    color: dbGuest.color ?? undefined,
    colorAcompanante: dbGuest.color_acompanante ?? undefined,
    habitacion: dbGuest.habitacion ?? null,
  };
}

const HabitacionesAdminTab: React.FC = () => {
  const [guests, setGuests] = useState<GuestWithHabitacion[]>([]);
  const [alojamientos, setAlojamientos] = useState<Alojamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  const fetchAlojamientos = async () => {
    const { data, error } = await supabase
      .from("alojamientos")
      .select("*")
      .order("propiedad", { ascending: true })
      .order("habitacion", { ascending: true });

    if (error) {
      toast.error("Error al cargar alojamientos");
      console.error(error);
    } else {
      setAlojamientos(data ?? []);
    }
  };

  const fetchAllGuests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      toast.error("Error al cargar invitados");
      console.error(error);
    } else {
      const mapped = (data ?? []).map(mapDbGuestToGuestWithHabitacion);
      setGuests(mapped);
      const initialValues: Record<string, string> = {};
      mapped.forEach((g) => {
        initialValues[g.id] = g.habitacion ?? "";
      });
      setValues(initialValues);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlojamientos();
    fetchAllGuests();
  }, []);

  const handleHabitacionChange = (guestId: string, value: string) => {
    setValues((prev) => ({ ...prev, [guestId]: value === "none" ? "" : value }));
  };

  const handleAssign = async (guest: GuestWithHabitacion) => {
    setSavingId(guest.id);
    const newHabitacion = values[guest.id] || null;

    const { error } = await supabase
      .from("guests")
      .update({ habitacion: newHabitacion })
      .eq("id", guest.id);

    if (error) {
      toast.error("Error al asignar habitación");
      console.error(error);
    } else {
      toast.success(`Habitación asignada a ${guest.nombre}`);
      await fetchAllGuests();
    }
    setSavingId(null);
  };

  // Agrupar alojamientos por propiedad
  const propiedadesAgrupadas = alojamientos.reduce((acc, aloj) => {
    if (!acc[aloj.propiedad]) {
      acc[aloj.propiedad] = [];
    }
    acc[aloj.propiedad].push(aloj);
    return acc;
  }, {} as Record<string, Alojamiento[]>);

  // Contar ocupación por habitación
  const getOcupacionHabitacion = (habitacionKey: string) => {
    return guests.filter((g) => {
      if (g.habitacion !== habitacionKey) return false;
      return true;
    }).reduce((count, g) => count + 1 + (g.plusOne ? 1 : 0), 0);
  };

  // Resumen por propiedad
  const getResumenPropiedades = () => {
    const resumen: Record<string, { total: number; ocupadas: number; plazasTotal: number; plazasOcupadas: number }> = {};
    
    Object.entries(propiedadesAgrupadas).forEach(([propiedad, habitaciones]) => {
      const plazasTotal = habitaciones.reduce((sum, h) => sum + h.plazas, 0);
      let plazasOcupadas = 0;
      let habitacionesOcupadas = 0;
      
      habitaciones.forEach((h) => {
        const key = `${h.propiedad} - ${h.habitacion}`;
        const ocupacion = getOcupacionHabitacion(key);
        if (ocupacion > 0) {
          habitacionesOcupadas++;
          plazasOcupadas += ocupacion;
        }
      });
      
      resumen[propiedad] = {
        total: habitaciones.length,
        ocupadas: habitacionesOcupadas,
        plazasTotal,
        plazasOcupadas,
      };
    });
    
    return resumen;
  };

  const resumenPropiedades = getResumenPropiedades();
  const propiedadesOrdenadas = Object.keys(propiedadesAgrupadas).sort();

  return (
    <div className="px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Home className="w-6 h-6" />
          Gestión de Habitaciones
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Asigna habitaciones específicas a los invitados. Los alojamientos han sido importados del Excel.
        </p>

        {/* Resumen de propiedades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
          {propiedadesOrdenadas.map((propiedad) => {
            const info = resumenPropiedades[propiedad];
            const porcentajeOcupacion = info.plazasTotal > 0 
              ? Math.round((info.plazasOcupadas / info.plazasTotal) * 100) 
              : 0;
            
            return (
              <div 
                key={propiedad} 
                className="p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border shadow-sm"
              >
                <h3 className="font-semibold text-sm mb-2 truncate" title={propiedad}>
                  {propiedad}
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    <span>{info.ocupadas}/{info.total} hab.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{info.plazasOcupadas}/{info.plazasTotal} plazas</span>
                  </div>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all" 
                    style={{ width: `${porcentajeOcupacion}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando invitados...</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Plus One</TableHead>
                <TableHead>Habitación Actual</TableHead>
                <TableHead className="min-w-[300px]">Asignar Habitación</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">{guest.nombre}</TableCell>
                  <TableCell>
                    {guest.plusOne ? (
                      <Badge variant="secondary">
                        {guest.nombreAcompanante || "Acompañante"}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {guest.habitacion ? (
                      <Badge variant="outline" className="text-xs">
                        {guest.habitacion}
                      </Badge>
                    ) : (
                      <span className="text-gray-400 italic text-sm">Sin asignar</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={values[guest.id] || "none"}
                      onValueChange={(value) => handleHabitacionChange(guest.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar habitación..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="none">
                          <span className="text-gray-400">Sin asignar</span>
                        </SelectItem>
                        {propiedadesOrdenadas.map((propiedad) => (
                          <React.Fragment key={propiedad}>
                            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 sticky top-0">
                              {propiedad}
                            </div>
                            {propiedadesAgrupadas[propiedad].map((aloj) => {
                              const key = `${aloj.propiedad} - ${aloj.habitacion}`;
                              const ocupacion = getOcupacionHabitacion(key);
                              const disponible = aloj.plazas - ocupacion;
                              
                              return (
                                <SelectItem 
                                  key={aloj.id} 
                                  value={key}
                                  disabled={disponible <= 0 && values[guest.id] !== key}
                                >
                                  <div className="flex items-center justify-between w-full gap-2">
                                    <span>{aloj.habitacion}</span>
                                    <span className={`text-xs ${disponible <= 0 ? 'text-red-500' : 'text-green-600'}`}>
                                      ({ocupacion}/{aloj.plazas})
                                    </span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleAssign(guest)}
                      disabled={savingId === guest.id || values[guest.id] === (guest.habitacion ?? "")}
                    >
                      {savingId === guest.id ? "Guardando..." : "Guardar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default HabitacionesAdminTab;
