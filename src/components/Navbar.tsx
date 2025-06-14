
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const navs = [
  { to: "/", label: "Inicio" },
  { to: "/admin", label: "Administrar invitados" },
];

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="w-full flex items-center justify-center gap-6 py-5 bg-background sticky top-0 left-0 z-40 border-b">
      {navs.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          className={`font-medium px-4 py-2 rounded transition-colors ${
            pathname === n.to
              ? "bg-primary text-white shadow"
              : "hover:bg-primary/10 text-primary"
          }`}
        >
          {n.label}
        </Link>
      ))}
      {session ? (
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/auth", { replace: true });
          }}
          className="ml-6 font-medium px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
        >
          Cerrar sesión
        </button>
      ) : (
        <Link
          to="/auth"
          className="ml-6 font-medium px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
        >
          Acceder
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
