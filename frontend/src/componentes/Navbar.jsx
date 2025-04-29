<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import React, { useState, useEffect, useRef } from "react";
>>>>>>> feature/dashboard-sidebar
import { Link } from "react-router-dom";
import { ChevronDown, LogIn, UserPlus } from "lucide-react";
import logoUazuay from "../assets/logoUazuay.png";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [scrollActivo, setScrollActivo] = useState(false);

<<<<<<< HEAD
  const toggleMenu = (menu) => {
    setMenuAbierto((prev) => (prev === menu ? null : menu));
  };

  useEffect(() => {
    const manejarScroll = () => {
      setScrollActivo(window.scrollY > 0);
    };
=======
  const apisRef = useRef(null);
  const usuariosRef = useRef(null);
  const permisosRef = useRef(null);
  const refsMap = {
    APIs: apisRef,
    Usuarios: usuariosRef,
    Permisos: permisosRef,
  };

  const toggleMenu = (menu, e) => {
    e.stopPropagation();
    setMenuAbierto(prev => (prev === menu ? null : menu));
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (menuAbierto && refsMap[menuAbierto].current && !refsMap[menuAbierto].current.contains(e.target)) {
        setMenuAbierto(null);
      }
    };
    document.addEventListener("mousedown", manejarClickFuera);
    return () => document.removeEventListener("mousedown", manejarClickFuera);
  }, [menuAbierto]);

  useEffect(() => {
    const manejarScroll = () => setScrollActivo(window.scrollY > 0);
>>>>>>> feature/dashboard-sidebar
    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

<<<<<<< HEAD
  const MenuDropdown = ({ nombre, opciones }) => (
    <div className="relative">
      <button
        onClick={() => toggleMenu(nombre)}
=======
  const MenuDropdown = ({ nombre, opciones, dropdownRef }) => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => toggleMenu(nombre, e)}
>>>>>>> feature/dashboard-sidebar
        className="flex items-center gap-1 px-4 py-2 rounded-md text-white hover:bg-[#005f99] transition"
      >
        {nombre} <ChevronDown size={16} />
      </button>
      <div
<<<<<<< HEAD
        className={`absolute top-full right-0 w-56 bg-white rounded-md shadow-lg border transition-all duration-200 overflow-hidden ${
          menuAbierto === nombre
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
=======
        className={`absolute top-full right-0 w-56 bg-white rounded-md shadow-lg border transition-all duration-200 overflow-hidden origin-top-right transform ${
          menuAbierto === nombre ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
>>>>>>> feature/dashboard-sidebar
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
<<<<<<< HEAD
        scrollActivo
          ? "bg-[#0077ba]/90 backdrop-blur-md shadow-md"
          : "bg-[#0077ba]"
=======
        scrollActivo ? "bg-[#0077ba]/90 backdrop-blur-md shadow-md" : "bg-[#0077ba]"
>>>>>>> feature/dashboard-sidebar
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 md:py-5 flex items-center justify-between">
        <Link to="/">
          <img
            src={logoUazuay}
            alt="Universidad del Azuay"
            className="h-12 w-auto object-contain"
          />
        </Link>

        <div className="flex gap-4 items-center">
          <MenuDropdown
            nombre="APIs"
            opciones={[
              { to: "/apis", label: "Ver APIs" },
<<<<<<< HEAD
=======
              { to: "/dashboard", label: "Ver dashboard" },
>>>>>>> feature/dashboard-sidebar
              { to: "/crear", label: "Crear API" },
              { to: "/modificar", label: "Modificar API" },
              { to: "/eliminar", label: "Eliminar API" },
            ]}
<<<<<<< HEAD
=======
            dropdownRef={apisRef}
>>>>>>> feature/dashboard-sidebar
          />
          <MenuDropdown
            nombre="Usuarios"
            opciones={[
              { to: "/registro", label: "Registrar Usuario" },
              { to: "/validar", label: "Validar Usuario" },
              { to: "/perfil", label: "Mi Perfil" },
            ]}
<<<<<<< HEAD
=======
            dropdownRef={usuariosRef}
>>>>>>> feature/dashboard-sidebar
          />
          <MenuDropdown
            nombre="Permisos"
            opciones={[
              { to: "/permiso/publico", label: "Cambiar a Público" },
              { to: "/permiso/privado", label: "Cambiar a Privado" },
              { to: "/permiso/restringido", label: "Cambiar a Restringido" },
            ]}
<<<<<<< HEAD
=======
            dropdownRef={permisosRef}
>>>>>>> feature/dashboard-sidebar
          />
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="flex items-center gap-1 text-white px-4 py-2 rounded-lg hover:bg-[#00509e] transition"
          >
<<<<<<< HEAD
            <LogIn size={16} />
            Iniciar Sesión
=======
            <LogIn size={16} /> Iniciar Sesión
>>>>>>> feature/dashboard-sidebar
          </Link>
          <Link
            to="/registro"
            className="bg-white text-[#0077ba] px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-1 font-medium"
          >
<<<<<<< HEAD
            <UserPlus size={16} />
            Registrarse
=======
            <UserPlus size={16} /> Registrarse
>>>>>>> feature/dashboard-sidebar
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
