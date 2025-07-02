import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import logoUazuay from "../assets/logoUazuay.png";
import { useNavigate } from "react-router-dom";
import logoLidi from "../assets/LIDI_logo2.png";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [scrollActivo, setScrollActivo] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  const serviciosRef = useRef(null);
  const usuariosRef = useRef(null);
  const refsMap = {
    Servicios: serviciosRef,
    Usuarios: usuariosRef,
  };

  const manejarBusqueda = (e) => {
    if (e.key === "Enter" && busqueda.trim() !== "") {
      navigate(`/resultados-busqueda?q=${encodeURIComponent(busqueda.trim())}`);
    }
  };

  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (menuAbierto && refsMap[menuAbierto].current && !refsMap[menuAbierto].current.contains(e.target)) {
        setMenuAbierto(null);
      }
    };
    document.addEventListener("mousedown", manejarClickFuera);
    return () => document.removeEventListener("mousedown", manejarClickFuera);
    // eslint-disable-next-line
  }, [menuAbierto]);

  useEffect(() => {
    const manejarScroll = () => setScrollActivo(window.scrollY > 0);
    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrollActivo ? "bg-[#0077ba]/90 backdrop-blur-md shadow-md" : "bg-[#0077ba]"
      }`}
    >
      <div className="w-full px-4 py-4 md:py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
    {/* Primer logo */}
          <Link to="/">
            <img
              src={logoUazuay}
              alt="Universidad del Azuay"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Línea divisora estilo pipe */}
          <div className="text-white text-xl font-light">|</div>

          {/* Segundo logo (reemplaza 'RUTA_DE_TU_OTRO_LOGO' cuando lo tengas) */}
          <Link to="/">
            <img
              src={logoLidi}
              alt="Segundo logo"
              className="h-16 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
        <div
            className={`hidden md:flex items-center bg-white/10 border border-white rounded-lg overflow-hidden px-3 py-1 backdrop-blur transition-all duration-300 ${
              isFocused ? 'w-72 border-white shadow-[0_0_8px_white]' : 'w-40'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white/70 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar o ir a..."
              className="bg-transparent outline-none text-md text-white placeholder-white/60 w-full"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={manejarBusqueda}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <kbd className="ml-2 text-white/50 text-xs border border-white/30 rounded px-1">/</kbd>
          </div>

          {/* Separador visual */}
        <div className="hidden md:block h-6 w-px bg-white/30 mx-2"></div>
          <Link
            to="/login"
            className="flex items-center gap-1 text-white px-4 py-2 rounded-lg hover:bg-[#00509e] transition"
          >
            <LogIn size={16} /> Iniciar Sesión
          </Link>
          <Link
            to="/registro"
            className="bg-white text-[#0077ba] px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-1 font-medium"
          >
            <UserPlus size={16} /> Registrarse
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
