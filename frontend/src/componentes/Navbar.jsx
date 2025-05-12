import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogIn, UserPlus } from "lucide-react";
import logoUazuay from "../assets/logoUazuay.png";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [scrollActivo, setScrollActivo] = useState(false);

  const serviciosRef = useRef(null);
  const usuariosRef = useRef(null);
  const refsMap = {
    Servicios: serviciosRef,
    Usuarios: usuariosRef,
  };

  const toggleMenu = (menu, e) => {
    e.stopPropagation();
    setMenuAbierto(prev => (prev === menu ? null : menu));
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

  const MenuDropdown = ({ nombre, opciones, dropdownRef }) => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => toggleMenu(nombre, e)}
        className="flex items-center gap-1 px-4 py-2 rounded-md text-white hover:bg-[#005f99] transition"
      >
        {nombre} <ChevronDown size={16} />
      </button>
      <div
        className={`absolute top-full right-0 w-56 bg-white rounded-md shadow-lg border transition-all duration-200 overflow-hidden origin-top-right transform ${
          menuAbierto === nombre ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {opciones.map((item, idx) => (
          <Link
            key={idx}
            to={item.to}
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-blue-50 transition"
            onClick={() => setMenuAbierto(null)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrollActivo ? "bg-[#0077ba]/90 backdrop-blur-md shadow-md" : "bg-[#0077ba]"
      }`}
    >
      <div className="w-full px-4 py-4 md:py-5 flex items-center justify-between">
        <Link to="/">
          <img
            src={logoUazuay}
            alt="Universidad del Azuay"
            className="h-12 w-auto object-contain"
          />
        </Link>

        <div className="flex gap-4 items-center">
          <MenuDropdown
            nombre="Servicios"
            opciones={[
              { to: "/apis", label: "Registro de APIs" },
              /*{ to: "/dashboard", label: "Ver dashboard" },
              { to: "/crear", label: "Crear API" },
              { to: "/modificar", label: "Modificar API" },
              { to: "/eliminar", label: "Eliminar API" },*/
            ]}
            dropdownRef={serviciosRef}
          />
          <MenuDropdown
            nombre="Usuarios"
            opciones={[
              { to: "/registro", label: "Gestión de Permisos" },
              /*{ to: "/validar", label: "Validar Usuario" },
              { to: "/perfil", label: "Mi Perfil" },*/
            ]}
            dropdownRef={usuariosRef}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="border border-[1px] hidden md:flex items-center bg-white/10 border-white rounded-lg overflow-hidden px-3 py-1 backdrop-blur">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white/70 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar o ir a..."
              className="bg-transparent outline-none text-md text-white placeholder-white/60 w-40"
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
