
import React, { useEffect, useState } from "react";
import { Guest } from "@/types/guest";

const menuTranslation: Record<string, string> = {
  normal: "Normal",
  vegetariano: "Vegetariano",
  vegano: "Vegano",
  "sin gluten": "Sin gluten",
};

const getGuests = (): Guest[] =>
  JSON.parse(localStorage.getItem("guests") || "[]");

const GuestTable: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    setGuests(getGuests());
    // Listen to storage event to update table if another tab changes data
    const onStorage = () => setGuests(getGuests());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Contadores por menú
  const counts = guests.reduce(
    (acc, g) => {
      acc["total"] += 1 + (g.plusOne ? 1 : 0);
      acc[g.menu] = (acc[g.menu] || 0) + 1 + (g.plusOne ? 1 : 0);
      return acc;
    },
    { total: 0, normal: 0, vegetariano: 0, vegano: 0, "sin gluten": 0 } as Record<string, number>
  );

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 px-2">
      <h2 className="text-2xl font-bold mb-4">Invitados registrados</h2>
      <div className="flex gap-6 mb-4 flex-wrap">
        <div className="bg-secondary px-5 py-3 rounded shadow">
          <b>Total de comensales:</b> {counts.total}
        </div>
        {["normal", "vegetariano", "vegano", "sin gluten"].map((k) => (
          <div className="bg-secondary px-5 py-3 rounded shadow" key={k}>
            <b>{menuTranslation[k]}:</b> {counts[k]}
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-background border rounded-lg shadow-md text-left">
          <thead>
            <tr>
              <th className="p-3 border-b">Nombre</th>
              <th className="p-3 border-b">+1</th>
              <th className="p-3 border-b">Menú</th>
              <th className="p-3 border-b">Comentarios</th>
              <th className="p-3 border-b">Fecha registro</th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-5">Aún no hay invitados registrados.</td>
              </tr>
            )}
            {guests.map((g) => (
              <tr key={g.id} className="hover:bg-secondary/50">
                <td className="p-3 border-b">{g.nombre}</td>
                <td className="p-3 border-b text-center">{g.plusOne ? "Sí" : "No"}</td>
                <td className="p-3 border-b">{menuTranslation[g.menu]}</td>
                <td className="p-3 border-b">{g.comentario || "-"}</td>
                <td className="p-3 border-b text-xs">{new Date(g.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestTable;
