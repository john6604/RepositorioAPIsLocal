import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { API_BASE_URL } from "../config";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);

  const hideFooter = location.pathname === "/";
  const hideNavbar = location.pathname === "/";
  /*const hideNavL = location.pathname === "/login";
  const hideNavR = location.pathname === "/registro";*/

  useEffect(() => {
    const validarSesion = async () => {
      const tokenSesion = localStorage.getItem("token_sesion");

      if (!tokenSesion) {
        setCargando(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/validar-sesion/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token_sesion: tokenSesion }),
        });

        const data = await response.json();

        if (data.valida && location.pathname === "/") {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error al validar sesión:", error);
        localStorage.removeItem("token_sesion");
      } finally {
        setCargando(false);
      }
    };

    validarSesion();
  }, [location.pathname, navigate]);

  if (cargando) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {hideNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
      {hideFooter && <Footer />}
    </div>
  );
};

export default Layout;