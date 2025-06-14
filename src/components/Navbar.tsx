
import React from "react";
import { Link, useLocation } from "react-router-dom";

const navs = [
  { to: "/", label: "Inicio" },
  { to: "/admin", label: "Administrar invitados" },
];

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
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
    </nav>
  );
};

export default Navbar;
