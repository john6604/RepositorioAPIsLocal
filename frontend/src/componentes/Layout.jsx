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
          headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true", },
          body: JSON.stringify({ token_sesion: tokenSesion }),
        });
  
        const data = await response.json();
  
        const vieneDeLogin = performance.navigation.type === 0 || performance.getEntriesByType("navigation")[0]?.type === "navigate";
  
        if (data.valida && location.pathname === "/" && vieneDeLogin) {
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
    return (
      <>
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077ba] mb-4"></div>
            <p className="text-gray-600 text-sm">Cargando APIs…</p>
          </div>
        </div>
      </>
    );
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
