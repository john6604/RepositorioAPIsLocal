import DashboardNavbar from "../componentes/DashboardNavbar";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

import {
  Star,
  Eye,
  User,
  Home as HomeIcon,
  Grid,
  List,
  PlusCircle,
  LogOut,
  Bookmark,
} from "lucide-react";


const Dashboard = () => {
  const [apis, setApis] = useState([]);
  const [stats, setStats] = useState({ total: 0, public: 0, private: 0, draft: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' o 'list'
  const [filterCategory, setFilterCategory] = useState(null); // null | 'favoritas' | 'guardadas' | 'Pública' | 'Privada' | 'Borrador'

  //agregar un lading mientras carga
  const [loading, setLoading] = useState(true);

  const tokenSesion = localStorage.getItem("token_sesion");

  useEffect(() => {
    const fetchApis = async () => {
      if (!tokenSesion) {
        console.error("Token de sesión no encontrado.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${API_BASE_URL}/listarapis/`, {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token_sesion: tokenSesion }),
        });

        setApis(data);
        setStats({
          total: data.length,
          public: data.filter(a => a.permiso === "publico").length,
          private: data.filter(a => a.permiso === "privado").length,
          restricted: data.filter(a => a.permiso === "restringido").length,
        });
      } catch (err) {
        console.error("No se pudieron cargar las APIs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApis();
  }, [tokenSesion]);

  const handleLogout = async () => {
    try {
      const tokenSesion = localStorage.getItem("token_sesion");
  
      if (!tokenSesion) {
        console.error("No se encontró el token de sesión en localStorage.");
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token_sesion: tokenSesion }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.clear();
        window.location.href = '/login';
      } else {
        console.error('Error al cerrar sesión:', data.error);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

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

  const handleCategory = category => setFilterCategory(prev => prev === category ? null : category);
  const filteredApis = apis.filter(api => {
    const matchesSearch = api.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterCategory === 'favoritas') return api.favorito;
    if (filterCategory === 'guardadas') return api.guardada;
    if (filterCategory === 'Pública') {
      return api.visibilidad === 'Pública';
    }
    if (filterCategory === 'Privada') {
      return api.visibilidad === 'Privada';
    }
    if (filterCategory === 'Borrador') {
      return api.visibilidad === 'Borrador';
    }
    return true;
  });
  const cardClass = (active) =>
    `cursor-pointer rounded-xl shadow p-6 text-center ${active ? "bg-[#0077ba] text-white" : "bg-white"}`;
  return (
    <>
      <DashboardNavbar />
      <div className="flex min-h-screen bg-gray-50 pt-2 ">
        {/* Sidebar */}
        <aside className="w-56 bg-white shadow-lg p-4 sticky inset-y-16 left-0 overflow-auto">
          <input
            type="text"
            placeholder="Buscar mi API..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-[#0077ba]"
          />
          <nav>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100">
                  <HomeIcon className="w-5 h-5 text-gray-600" /> Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleCategory(null)}
                  className={`flex w-full items-center gap-2 px-4 py-2 rounded ${filterCategory === null ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'}`}
                >
                  <List className="w-5 h-5 text-gray-600" /> Mis APIs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategory('favoritas')}
                  className={`flex w-full items-center gap-2 px-4 py-2 rounded ${filterCategory === 'favoritas' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'}`}
                >
                  <Star className="w-5 h-5 text-gray-600" /> Favoritas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategory('guardadas')}
                  className={`flex w-full items-center gap-2 px-4 py-2 rounded ${filterCategory === 'guardadas' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'}`}
                >
                  <Bookmark className="w-5 h-5 text-gray-600" /> Guardadas
                </button>
              </li>
              <li>
                <Link to="/crear" className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100">
                  <PlusCircle className="w-5 h-5 text-gray-600" /> Crear API
                </Link>
              </li>
              <li className="mt-6">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 w-full rounded hover:bg-gray-100 text-red-600"
                >
                  <LogOut className="w-5 h-5" /> Salir
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        {/* Contenido principal */}
        <main className="flex-1 p-8 ml-8">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <h1 className="text-3xl font-bold text-[#0077ba]">Dashboard de APIs</h1>
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
          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={cardClass(filterCategory === null)} onClick={() => handleCategory(null)}>
              <h2 className="text-2xl font-semibold">{stats.total}</h2>
              <p className="text-sm">Total de APIs</p>
            </div>
            <div className={cardClass(filterCategory === 'Pública')} onClick={() => handleCategory('Pública')}>
              <h2 className="text-2xl font-semibold">{stats.public}</h2>
              <p className="text-sm">Públicas</p>
            </div>
            <div className={cardClass(filterCategory === 'Privada')} onClick={() => handleCategory('Privada')}>
              <h2 className="text-2xl font-semibold">{stats.private}</h2>
              <p className="text-sm">Privadas</p>
            </div>
            <div className={cardClass(filterCategory === 'Borrador')} onClick={() => handleCategory('Borrador')}>
              <h2 className="text-2xl font-semibold">{stats.draft}</h2>
              <p className="text-sm">Borrador</p>
            </div>
          </div>
          {/* Vista de APIs */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApis.map(api => (
                <Link
                  to={`/api/${api.id}`}
                  key={api.id}
                  className="block bg-white rounded-xl shadow hover:shadow-md transition p-6"
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-[#0077ba]">{api.nombre}</h2>
                    <span
                      className={
                        api.visibilidad === 'Pública'
                          ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs'
                          : api.visibilidad === 'Privada'
                            ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs'
                            : 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'
                      }
                    >
                      {api.visibilidad}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">{api.descripcion}</p>
                  <div className="flex items-center justify-between mt-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1"><Star className="w-4 h-4" /><span>{api.estrellas}</span></div>
                    <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{api.vistas}</span></div>
                    <div className="flex items-center gap-1"><User className="w-4 h-4" /><span className="truncate max-w-[80px]">{api.autor}</span></div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredApis.map(api => (
                <li key={api.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                  <Link to={`/api/${api.id}`} className="text-[#0077ba] font-semibold hover:underline">
                    {api.nombre}
                  </Link>
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1"><Star className="w-4 h-4" /><span>{api.estrellas}</span></div>
                    <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{api.vistas}</span></div>
                    <div className="flex items-center gap-1"><User className="w-4 h-4" /><span className="truncate max-w-[80px]">{api.autor}</span></div>
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
export default Dashboard;