import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface NavbarProps {
  transparent?: boolean;
}
import { supabase } from "@/integrations/supabase/client";
import { Settings, Home, Hotel, MapPin, Clock, Shirt } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const linkClass = (path: string) => {
    const isActive = pathname === path;
    if (transparent) {
      return `p-2 md:px-4 md:py-2 rounded transition-colors flex items-center gap-2 ${
        isActive
          ? "bg-amber-500/20 text-amber-400 shadow"
          : "hover:bg-amber-500/10 text-amber-300"
      }`;
    }
    return `p-2 md:px-4 md:py-2 rounded transition-colors flex items-center gap-2 ${
      isActive
        ? "bg-primary text-primary-foreground shadow"
        : "hover:bg-primary/10 text-primary"
    }`;
  };

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
    <nav className={`w-full flex flex-col items-center sticky top-0 left-0 z-40 ${transparent ? 'bg-transparent border-transparent' : 'bg-background border-b'}`}>
      <div className="flex items-center justify-center gap-3 md:gap-6 py-4 md:py-5 w-full px-2">
        <Link to="/" className={linkClass("/")} title={t("nav.home")}>
          <Home className="h-5 w-5" />
          <span className="hidden md:inline font-medium font-antiqua">{t("nav.home")}</span>
        </Link>

        <Link to="/alojamiento" className={linkClass("/alojamiento")} title={t("nav.accommodation")}>
          <Hotel className="h-5 w-5" />
          <span className="hidden md:inline font-medium font-antiqua">{t("nav.accommodation")}</span>
        </Link>

        <Link to="/cosas-que-hacer" className={linkClass("/cosas-que-hacer")} title={t("nav.things_to_do")}>
          <MapPin className="h-5 w-5" />
          <span className="hidden md:inline font-medium font-antiqua">{t("nav.things_to_do")}</span>
        </Link>

        <Link to="/horarios" className={linkClass("/horarios")} title={t("nav.schedule")}>
          <Clock className="h-5 w-5" />
          <span className="hidden md:inline font-medium font-antiqua">{t("nav.schedule")}</span>
        </Link>

        <Link to="/etiqueta" className={linkClass("/etiqueta")} title={t("nav.dress_code")}>
          <Shirt className="h-5 w-5" />
          <span className="hidden md:inline font-medium font-antiqua">{t("nav.dress_code")}</span>
        </Link>

        <LanguageSelector transparent={transparent} />

        <Link
          to="/admin"
          className={`p-2 rounded transition-colors ${
            transparent
              ? (pathname === "/admin" ? "bg-amber-500/20 text-amber-400 shadow" : "hover:bg-amber-500/10 text-amber-300")
              : (pathname === "/admin" ? "bg-primary text-primary-foreground shadow" : "hover:bg-primary/10 text-primary")
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
      <span className={`text-3xl md:text-4xl font-cinzel tracking-widest pb-3 md:pb-4 font-bold ${transparent ? 'text-amber-400' : 'text-primary'}`}>Sara & Victor</span>
      <p className={`md:hidden text-sm font-semibold text-center px-4 pb-2 -mt-1 ${transparent ? 'text-amber-300/70' : 'text-muted-foreground'}`}>{t("nav.mobile_hint")}</p>
    </nav>
  );
};

export default Navbar;
