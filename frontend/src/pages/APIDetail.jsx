import React, { useState, useEffect } from "react";
import { Settings, Users, Lock, Code2, Search } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardNavbar from "../componentes/DashboardNavbar";
import { API_BASE_URL } from "../config";

const tabs = [
  { id: "api", label: "API", icon: Code2 },
  { id: "settings", label: "Configuración", icon: Settings },
  { id: "colaborators", label: "Colaboradores", icon: Users },
  { id: "permissions", label: "Permisos", icon: Lock },
];

const APIDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("api");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/apis/${id}`);
        setApiData(res.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos de la API");
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [id]);
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/apis/${id}`, {
        name: apiData.name,
        description: apiData.description,
        method: apiData.method,
        visibility: apiData.visibility,
      });
      alert("Configuración guardada exitosamente");
    } catch (err) {
      console.error(err);
      alert("Error al guardar configuración");
    }
  };

  const handleDeleteApi = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar esta API? Esta acción no se puede deshacer.")) return;
    try {
      await axios.delete(`${API_BASE_URL}/apis/${id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la API");
    }
  };

  const handleRemoveCollaborator = async (collabId) => {
    try {
      await axios.delete(`${API_BASE_URL}/apis/${id}/colaborators/${collabId}`);
      setApiData(prev => ({
        ...prev,
        collaborators: prev.collaborators.filter(c => c.id !== collabId),
      }));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar colaborador");
    }
  };

  const handleAddCollaborator = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/apis/${id}/colaborators`, { query: searchQuery });
      setApiData(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, res.data],
      }));
      setSearchQuery("");
    } catch (err) {
      console.error(err);
      alert("Error al añadir colaborador");
    }
  };

  if (loading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!apiData) return null;
  return (
    <>
      <DashboardNavbar />
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Menú</h2>
          </div>
          <nav className="flex flex-col">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 text-left text-sm hover:bg-gray-100 border-l-4 ${activeTab === tab.id
                    ? "font-semibold bg-gray-50 border-blue-500 text-blue-600"
                    : "border-transparent text-gray-700"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-10">
          {activeTab === "api" && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">{apiData.name}</h2>
              <p className="mb-2">{apiData.description}</p>
              <div className="bg-white rounded-xl shadow p-4 mb-4">
                <h3 className="font-semibold">Endpoint:</h3>
                <code>{apiData.endpoint}</code>
              </div>
              <div className="bg-white rounded-xl shadow p-4 mb-4">
                <h3 className="font-semibold">Parámetros:</h3>
                <ul className="list-disc ml-5">
                  {apiData.parameters.map((param, i) => (
                    <li key={i}>
                      <strong>{param.name}</strong> ({param.type}) – {param.description}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow p-4 mb-4">
                <h3 className="font-semibold">Retorna:</h3>
                <p>{apiData.returns}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 mb-4">
                <h3 className="font-semibold">Ejemplo de uso:</h3>
                <pre className="bg-gray-100 p-2 rounded whitespace-pre-line">{apiData.example}</pre>
              </div>
              <div className="pt-6">
                <button
                  onClick={handleDeleteApi}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Eliminar API
                </button>
              </div>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Configuración de la API
                </h3>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      value={apiData.name}
                      onChange={e => setApiData({ ...apiData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      value={apiData.description}
                      onChange={e => setApiData({ ...apiData, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Método</label>
                      <select
                        value={apiData.method}
                        onChange={e => setApiData({ ...apiData, method: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      >
                        {["GET", "POST", "PUT", "DELETE"].map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Visibilidad</label>
                      <select
                        value={apiData.visibility}
                        onChange={e => setApiData({ ...apiData, visibility: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      >
                        {["public", "private", "restricted"].map(v => (
                          <option key={v} value={v}>
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "colaborators" && (
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow border space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Colaboradores</h3>
              {apiData.collaborators.map(c => (
                <div key={c.id} className="flex items-center justify-between bg-gray-50 border rounded-md p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-sm text-gray-500">{c.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveCollaborator(c.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <div className="pt-4 border-t space-y-3">
                <label className="block text-sm font-medium text-gray-700">Añadir colaborador</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o correo"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Search size={18} />
                  </span>
                </div>
                <button
                  onClick={handleAddCollaborator}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Añadir
                </button>
              </div>
            </div>
          )}

          {activeTab === "permissions" && (
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" /> Permisos de Visibilidad
              </h3>
              {["public", "private", "restricted"].map(v => (
                <div key={v} className="flex items-center gap-3">
                  <input
                    type="radio"
                    id={v}
                    name="visibility"
                    value={v}
                    checked={apiData.visibility === v}
                    onChange={() => setApiData({ ...apiData, visibility: v })}
                  />
                  <label htmlFor={v} className="text-sm font-medium text-gray-700">
                    {v.charAt(0).toUpperCase() + v.slice(1)} –{" "}
                    {v === "public"
                      ? "Cualquiera puede acceder a esta API."
                      : v === "private"
                        ? "Solo tú y tus colaboradores pueden acceder."
                        : "Acceso privado pero se puede compartir con enlace."}
                  </label>
                </div>
              ))}

              {apiData.visibility === "restricted" && (
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enlace de acceso
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      readOnly
                      value={`https://midominio.app/api/share/${apiData.endpoint}`}
                      className="w-full rounded-l-md border border-gray-300 px-3 py-2 bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(`https://midominio.app/api/share/${apiData.endpoint}`)
                      }
                      className="px-4 bg-blue-600 text-white text-sm rounded-r-md hover:bg-blue-700"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              )}
              <div className="pt-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Guardar permisos
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default APIDetail;
