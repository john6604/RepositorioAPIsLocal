import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config";
import DashboardNavbar from "../componentes/DashboardNavbar";
import {
  Star,
  Eye,
  User,
  Home as HomeIcon,
  Grid,
  List,
  Clipboard, 
} from "lucide-react";
import { Link } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const APIs = () => {
  const query = useQuery();
  const termino = query.get("q");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [stats, setStats] = useState({ total: 0});

  useEffect(() => {
    const buscar = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/buscar-apis-publicas?q=${encodeURIComponent(termino)}`);
        const data = await res.json();
        setResultados(data.resultados || []);
        setStats({
          total: data.resultados.length
        });
      } catch (error) {
        console.error("Error al buscar APIs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (termino) {
      buscar();
    }
  }, [termino]);

  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077ba] mb-4"></div>
            <p className="text-gray-600 text-sm">Cargando APIs…</p>
          </div>
        </div>
      </>
    );
  }

  const cardClass = (active) =>
    `cursor-pointer rounded-xl shadow p-6 text-center ${active ? "bg-[#0077ba] text-white" : "bg-white"}`;

  return (
    <>
      <DashboardNavbar/>
      <div className="flex min-h-screen bg-gray-50 pt-2 ">
        {/* SideBar */}
        <aside className="w-56 bg-white shadow-lg p-4 sticky inset-y-16 left-0 overflow-auto">
          <nav>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100">
                  <HomeIcon className="w-5 h-5 text-gray-600" /> Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100">
                  <Clipboard className="w-5 h-5 text-gray-600" /> Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 ml-8">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <h1 className="text-3xl font-bold text-[#0077ba]">Resultados de búsqueda para: “{termino}”</h1>
            <div className="flex gap-2">
              <button aria-label="Vista en cuadrícula"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#0077ba] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#0077ba] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Estadisticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={cardClass(null)} >
              <h2 className="text-2xl font-semibold">{stats.total}</h2>
              <p className="text-sm">Total de APIs</p>
            </div>
          </div>

          {/* APIs */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultados.map(api => (
                <Link
                  to={`/api/${api.id}`}
                  key={api.id}
                  className="block bg-white rounded-xl shadow hover:shadow-md transition p-6"
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-[#0077ba]">{api.nombre}</h2>
                    <span
                      className={
                        api.permiso === 'publico'
                          ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs'
                          : api.permiso === 'privado'
                            ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs'
                            : 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'
                      }
                    >
                      {api.permiso}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">{api.descripcion}</p>
                  <div className="flex items-center justify-between mt-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1"><Star className="w-4 h-4" /><span>{api.estrellas}</span></div>
                    <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{api.vistas}</span></div>
                    <div className="flex items-center gap-1"><User className="w-4 h-4" /><span className="truncate max-w-[80px]">{api.username}</span></div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <ul className="space-y-4">
              {resultados.map(api => (
                <li key={api.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                  <Link to={`/api/${api.id}`} className="text-[#0077ba] font-semibold hover:underline">
                    {api.nombre}
                  </Link>
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1"><Star className="w-4 h-4" /><span>{api.estrellas}</span></div>
                    <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{api.vistas}</span></div>
                    <div className="flex items-center gap-1"><User className="w-4 h-4" /><span className="truncate max-w-[80px]">{api.username}</span></div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </>
  );
};

export default APIs;
/*import { useEffect, useState } from "react";

const Apis = () => {
  const [apis, setApis] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Simulación temporal de datos
  useEffect(() => {
    setApis([
      {
        id: 1,
        nombre: "Clasificador de Texto",
        autor: "Juan Pérez",
        descripcion: "Clasifica texto usando NLP.",
        visibilidad: "Pública",
      },
      {
        id: 2,
        nombre: "Detección de Fraude",
        autor: "María Gómez",
        descripcion: "Detecta transacciones fraudulentas.",
        visibilidad: "Privada",
      },
    ]);
  }, []);

  const apisFiltradas = apis.filter(api =>
    api.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">Repositorio de APIs</h2>
      <input
        type="text"
        placeholder="Buscar APIs..."
        className="w-full mb-4 px-4 py-2 border rounded-md"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="grid md:grid-cols-2 gap-6">
        {apisFiltradas.map(api => (
          <div key={api.id} className="bg-white p-4 shadow rounded-md border border-blue-100">
            <h3 className="text-lg font-bold text-blue-800">{api.nombre}</h3>
            <p className="text-sm text-gray-700 mt-1">{api.descripcion}</p>
            <p className="text-xs mt-2 text-gray-500">Autor: {api.autor}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
              api.visibilidad === "Pública" ? "bg-green-100 text-green-800" :
              api.visibilidad === "Privada" ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }`}>
              {api.visibilidad}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apis;*/
