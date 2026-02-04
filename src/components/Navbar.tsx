
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Settings } from "lucide-react";

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
      <Link
        to="/"
        className={`font-medium px-4 py-2 rounded transition-colors ${
          pathname === "/"
            ? "bg-primary text-primary-foreground shadow"
            : "hover:bg-primary/10 text-primary"
        }`}
      >
        Inicio
      </Link>

      <span className="text-2xl font-elvish text-primary">Sara & Victor</span>

      <Link
        to="/admin"
        className={`p-2 rounded transition-colors ${
          pathname === "/admin"
            ? "bg-primary text-primary-foreground shadow"
            : "hover:bg-primary/10 text-primary"
        }`}
        title="Administrar invitados"
      >
        <Settings className="h-5 w-5" />
      </Link>

      {session && pathname === "/admin" && (
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/auth", { replace: true });
          }}
          className="ml-2 font-medium px-4 py-2 bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition"
        >
          Cerrar sesión
        </button>
      )}
    </nav>
  );
};

export default Navbar;
