import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();

  const hideFooter = location.pathname === "/";
  const hideNavbar = location.pathname === "/";
  /*const hideNavL = location.pathname === "/login";
  const hideNavR = location.pathname === "/registro";*/

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
