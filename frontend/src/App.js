// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./componentes/Layout";
import Home        from "./componentes/Home";
import CrearApi    from "./pages/CrearApi";
import Login       from "./pages/Login";
import Registro    from "./pages/Registro";
import APIDetail   from "./pages/APIDetail";
import APIDetail2   from "./pages/APIDetail2";
import Dashboard   from "./pages/Dashboard";
import Notificaciones from "./pages/Notificaciones";
import Configuracion from "./pages/PerfilConfiguracion";
import ResultadosBusqueda from "./pages/Apis";
import Categoria from "./pages/CrearCategoria";
import Subcategoria from "./pages/CrearSubcategoria";
import Tematica from "./pages/CrearTematica";

function App() {
  return (
    <Router>
          <Routes>
            <Route element={<Layout/>}>
              <Route path="/"         element={<Home      />} />
              <Route path="/resultados-busqueda" element={<ResultadosBusqueda />} />
              <Route path="/crear"    element={<CrearApi   />} />
              <Route path="/login"    element={<Login     />} />
              <Route path="/registro" element={<Registro  />} />
              <Route path="/api/:apiId"  element={<APIDetail />} />
              <Route path="/api2/:apiId"  element={<APIDetail2 />} />
              <Route path="/dashboard"element={<Dashboard/>} />
              <Route path="/notificaciones" element={<Notificaciones />} />
              <Route path="/perfilConfig" element={<Configuracion />} />
              <Route path="/crearCategoria" element={<Categoria />} />
              <Route path="/crearSubcategoria" element={<Subcategoria />} />
              <Route path="/crearTematica" element={<Tematica />} />
            </Route>
          </Routes>
    </Router>
  );
}
export default App;