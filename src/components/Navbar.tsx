import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Settings } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    <nav className="w-full flex flex-col items-center bg-background sticky top-0 left-0 z-40 border-b">
      <div className="flex items-center justify-center gap-6 py-5 w-full">
        <Link
          to="/"
          className={`font-medium px-4 py-2 rounded transition-colors ${
            pathname === "/"
              ? "bg-primary text-primary-foreground shadow"
              : "hover:bg-primary/10 text-primary"
          }`}
        >
          {t("nav.home")}
        </Link>

        <Link
          to="/alojamiento"
          className={`font-medium px-4 py-2 rounded transition-colors ${
            pathname === "/alojamiento"
              ? "bg-primary text-primary-foreground shadow"
              : "hover:bg-primary/10 text-primary"
          }`}
        >
          {t("nav.accommodation")}
        </Link>

        <Link
          to="/cosas-que-hacer"
          className={`font-medium px-4 py-2 rounded transition-colors ${
            pathname === "/cosas-que-hacer"
              ? "bg-primary text-primary-foreground shadow"
              : "hover:bg-primary/10 text-primary"
          }`}
        >
          {t("nav.things_to_do")}
        </Link>

        <LanguageSelector />

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
      </div>
      <span className="text-4xl font-elvish text-primary tracking-widest pb-4">Sara & Victor</span>
    </nav>
  );
};

export default Navbar;
