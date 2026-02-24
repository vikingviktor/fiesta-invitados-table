import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Home, Hotel, MapPin, Clock, Shirt } from "lucide-react";
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
      <div className="flex items-center justify-center gap-3 md:gap-6 py-4 md:py-5 w-full px-2">
        <Link
          to="/"
          className={`p-2 md:px-4 md:py-2 rounded transition-colors flex items-center gap-2 ${
            pathname === "/"
              ? "bg-primary text-primary-foreground shadow"
              : "hover:bg-primary/10 text-primary"
          }`}
          title={t("nav.home")}
        >
          <Home className="h-5 w-5" />
          <span className="hidden md:inline font-medium">{t("nav.home")}</span>
        </Link>

        <Link
          to="/alojamiento"
          className={`p-2 md:px-4 md:py-2 rounded transition-colors flex items-center gap-2 ${
            pathname === "/alojamiento"
              ? "bg-primary text-primary-foreground shadow"
              : "hover:bg-primary/10 text-primary"
          }`}
          title={t("nav.accommodation")}
        >
          <Hotel className="h-5 w-5" />
          <span className="hidden md:inline font-medium">{t("nav.accommodation")}</span>
        </Link>

        <Link
          to="/cosas-que-hacer"
          className={`p-2 md:px-4 md:py-2 rounded transition-colors flex items-center gap-2 ${
            pathname === "/cosas-que-hacer"
              ? "bg-primary text-primary-foreground shadow"
              : "hover:bg-primary/10 text-primary"
          }`}
          title={t("nav.things_to_do")}
        >
          <MapPin className="h-5 w-5" />
          <span className="hidden md:inline font-medium">{t("nav.things_to_do")}</span>
        </Link>

        <Link
          to="/horarios"
          className={`p-2 md:px-4 md:py-2 rounded transition-colors flex items-center gap-2 ${
            pathname === "/horarios"
              ? "bg-primary text-primary-foreground shadow"
              : "hover:bg-primary/10 text-primary"
          }`}
          title={t("nav.schedule")}
        >
          <Clock className="h-5 w-5" />
          <span className="hidden md:inline font-medium">{t("nav.schedule")}</span>
        </Link>

        <Link
          to="/etiqueta"
          className={`p-2 md:px-4 md:py-2 rounded transition-colors flex items-center gap-2 ${
            pathname === "/etiqueta"
              ? "bg-primary text-primary-foreground shadow"
              : "hover:bg-primary/10 text-primary"
          }`}
          title={t("nav.dress_code")}
        >
          <Shirt className="h-5 w-5" />
          <span className="hidden md:inline font-medium">{t("nav.dress_code")}</span>
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
            className="ml-2 font-medium px-3 md:px-4 py-2 bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition text-sm md:text-base"
          >
            <span className="hidden md:inline">Cerrar sesión</span>
            <span className="md:hidden">Salir</span>
          </button>
        )}
      </div>
      <span className="text-2xl md:text-4xl font-elvish text-primary tracking-widest pb-3 md:pb-4">Sara & Victor</span>
      <p className="md:hidden text-xs text-muted-foreground text-center px-4 pb-2 -mt-1">{t("nav.mobile_hint")}</p>
    </nav>
  );
};

export default Navbar;
