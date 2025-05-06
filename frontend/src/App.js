// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./componentes/Layout";
import Home        from "./componentes/Home";
import Apis        from "./pages/Apis";
import CrearApi    from "./pages/CrearApi";
import Login       from "./pages/Login";
import Registro    from "./pages/Registro";
import APIDetail   from "./pages/APIDetail";
import Dashboard   from "./pages/Dashboard";
function App() {
  return (
    <Router>
          <Routes>
            <Route element={<Layout/>}>
              <Route path="/"         element={<Home      />} />
              <Route path="/apis"     element={<Apis      />} />
              <Route path="/crear"    element={<CrearApi   />} />
              <Route path="/login"    element={<Login     />} />
              <Route path="/registro" element={<Registro  />} />
              <Route path="/api/:id"  element={<APIDetail />} />
              <Route path="/dashboard"element={<Dashboard/>} />
            </Route>
          </Routes>
    </Router>
  );
}
export default App;