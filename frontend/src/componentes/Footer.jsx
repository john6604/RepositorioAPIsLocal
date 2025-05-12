import { Link } from "react-router-dom";
import logoFooter from "../assets/logo-footer-uazuay.png";

const Footer = () => {
  return (
    <footer className="bg-[#0077ba] text-white pt-10 pb-6 mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm items-start">
        {/* Información institucional */}
        <div className="md:col-span-2">
          <h4 className="text-lg font-semibold mb-2">Universidad del Azuay</h4>
          <p>Facultad de Ciencias de la Administración</p>
          <p>Cuenca, Ecuador</p>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Enlaces útiles</h4>
          <ul className="space-y-1">
            <li><Link to="/apis" className="hover:underline">Ver APIs</Link></li>
            <li><Link to="/crear" className="hover:underline">Publicar API</Link></li>
            <li><Link to="/registro" className="hover:underline">Registrarse</Link></li>
            <li><Link to="/login" className="hover:underline">Iniciar sesión</Link></li>
          </ul>
        </div>

        {/* Logo en el lado derecho */}
        <div className="flex justify-center md:justify-end items-center">
            <a
                href="https://www.uazuay.edu.ec/"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                src={logoFooter}
                alt="Logo Universidad del Azuay"
                className="h-24 w-auto hover:opacity-90 transition"
                />
            </a>
        </div>
      </div>

      <div className="text-center text-xs mt-8 border-t border-blue-100 pt-4">
        © {new Date().getFullYear()} Universidad del Azuay — Todos los derechos reservados
      </div>
    </footer>
  );
};

export default Footer;