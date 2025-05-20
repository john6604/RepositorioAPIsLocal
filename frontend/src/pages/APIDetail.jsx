import React, { useState } from "react";
import {
  Settings,
  Users,
  Lock,
  Code2,
  Search,
} from "lucide-react";
import DashboardNavbar from "../componentes/DashboardNavbar";
import { useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";

const APIDetail = () => {
    const { apiId } = useParams();
    const navigate = useNavigate();
    const [apiData, setApiData] = useState({
      nombre: "",
      descripcion: "",
      detalles_tecnicos: "",
      documentacion: "",
      permiso: "",
      estado: "",
      creado_en: "",
      actualizado_en: "",
    });
    const [metodosApi, setMetodosApi] = useState([]);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("api");
    const [searchQuery, setSearchQuery] = useState("");
    const [usuarioActualId, setUsuarioActualId] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const allTabs = [
      { id: "api", label: "API", icon: Code2 },
      { id: "settings", label: "Configuración", icon: Settings },
      { id: "colaborators", label: "Colaboradores", icon: Users },
      { id: "permissions", label: "Permisos", icon: Lock },
    ];
    
    const visibleTabs = isOwner
      ? allTabs
      : allTabs.filter((tab) => tab.id === "api");
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setApiData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const obtenerUsuarioActual = async () => {
      try {
        const tokenSesion = localStorage.getItem("token_sesion");
    
        const response = await fetch(`${API_BASE_URL}/usuario_actual/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token_sesion: tokenSesion }),
        });
    
        if (response.ok) {
          const data = await response.json();
          setUsuarioActualId(data.usuario_id);
        } else {
          console.warn("Token inválido o usuario no autenticado");
          setUsuarioActualId(null);
        }
      } catch (error) {
        console.error("Error en obtenerUsuarioActual:", error);
      }
    };

    const handleGuardarCambios = async (e) => {
      e.preventDefault();
    
      try {
        const response = await fetch(`${API_BASE_URL}/listarapis/${apiData.id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        });
    
        if (response.ok) {
          const updatedData = await response.json();
          setApiData(updatedData);
          alert("Cambios guardados correctamente.");
          navigate("/dashboard");
        } else {
          const error = await response.json();
          console.error("Error al guardar cambios:", error);
          alert("Hubo un error al guardar los cambios.");
        }
      } catch (err) {
        console.error("Error al enviar solicitud:", err);
        alert("No se pudo conectar con el servidor.");
      }
    };

    const handlePublicarAPI = async () => {
      const nuevaApiData = { ...apiData, permiso: "publico" };
    
      try {
        const response = await fetch(`${API_BASE_URL}/listarapis/${nuevaApiData.id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevaApiData),
        });
    
        if (response.ok) {
          const updatedData = await response.json();
          setApiData(updatedData);
          alert("API publicada correctamente.");
          navigate("/dashboard"); 
        } else {
          const error = await response.json();
          console.error("Error al publicar:", error);
          alert("Hubo un error al publicar la API.");
        }
      } catch (err) {
        console.error("Error al enviar solicitud:", err);
        alert("No se pudo conectar con el servidor.");
      }
    };

    const handleEliminarAPI = async () => {
      const tokenSesion = localStorage.getItem("token_sesion");

      if (!tokenSesion) {
        alert("No hay token de sesión. Inicia sesión primero.");
        return;
      }

      const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta API? Esta acción no se puede deshacer.");
      if (!confirmacion) return;
    
      try {
        const response = await fetch(`${API_BASE_URL}/eliminarapi/${apiId}/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token_sesion")}`,
            "Content-Type": "application/json",
          },
        });
    
        if (response.status === 204) {
          alert("API eliminada con éxito.");
          navigate("/dashboard")
        } else {
          const data = await response.json();
          alert(`Error al eliminar API: ${data.detail}`);
        }
      } catch (error) {
        console.error("Error al eliminar API:", error);
        alert("Error al eliminar la API.");
      }
    };
    
    useEffect(() => {
      const token = localStorage.getItem("token_sesion");
      if (token) {
        obtenerUsuarioActual();
      } else {
        setUsuarioActualId(null);
      }
    
      obtenerDetalleAPI(apiId);       // Información general de la API
    }, [apiId]);
    

    const obtenerDetalleAPI = async (apiId) => {
      console.log("ID recibido desde useParams:", apiId);
      try {
        const url = `${API_BASE_URL}/listarmodelo/${apiId}/`;
        const response = await fetch(url);

        const data = await response.json();
        if (response.ok) {
          setMetodosApi(data);
        } else {
          console.error("Error:", data.detail);
        }
      } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
      }
    };


   

    useEffect(() => {
      if (usuarioActualId && apiData?.creado_por) {
        setIsOwner(usuarioActualId === apiData.creado_por);
      } else {
        setIsOwner(false); 
      }
    }, [usuarioActualId, apiData]);

    if (loading || !apiData) {
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
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 text-left text-sm hover:bg-gray-100 border-l-4 ${
                  activeTab === tab.id
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
                <h2 className="text-2xl font-bold mb-4">{apiData.nombre}</h2>
                <p className="mb-2">{apiData.descripcion}</p>
                <p className="mb-2">Versión: {apiData.documentacion}</p>
                <div className="bg-white rounded-xl shadow p-4 mb-4">
                  <h3 className="font-semibold">Endpoint:</h3>
                  
                </div>
                <div className="bg-white rounded-xl shadow p-4 mb-4">
                  <h3 className="font-semibold">Parámetros:</h3>
                </div>
                <div className="bg-white rounded-xl shadow p-4 mb-4">
                  <h3 className="font-semibold">Retorna:</h3>
                  
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-semibold">Ejemplo de uso:</h3>
                  <pre className="bg-gray-100 p-2 rounded whitespace-pre-line">
                    
                  </pre>
                </div>
                {metodosApi.length > 0 ? (
  <div className="mt-6">
    <h3 className="text-xl font-semibold text-[#0077ba] mb-2">Métodos disponibles:</h3>
    <ul className="space-y-4">
      {metodosApi.map((metodo, index) => (
        <li key={index} className="p-4 bg-gray-100 rounded-lg shadow">
          <p><strong>Método:</strong> {metodo.metodo}</p>
          <p><strong>Endpoint:</strong> {metodo.endpoint}</p>
          <p><strong>Descripción:</strong> {metodo.descripcion || "Sin descripción"}</p>
          <p><strong>Lenguaje:</strong> {metodo.lenguaje_codigo || "No especificado"}</p>
        </li>
      ))}
    </ul>
  </div>
) : (
  <p className="text-gray-600 mt-6">No hay métodos registrados para esta API.</p>
)}

              </div>
            )}

            {activeTab === "settings" && (
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Configuración General */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuración de la API
                  </h3>
                  <form className="space-y-4" onSubmit={handleGuardarCambios}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={apiData.nombre}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descripción</label>
                      <textarea
                        name="descripcion"
                        value={apiData.descripcion}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows={3}
                      />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Versión</label>
                    <input
                      type="text"
                      name="documentacion"
                      value={apiData.documentacion}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Endpoint</label>
                      <input
                        type="text"
                        defaultValue=""
                        readOnly
                        className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Método</label>
                      <select
                        defaultValue=""
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>DELETE</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-white p-6 rounded-xl shadow border border-red-300">
                <h3 className="text-lg font-semibold text-red-600 mb-2">Zona de peligro</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Esta acción eliminará permanentemente esta API del sistema. Esta operación no se puede deshacer.
                </p>
                <button
                  onClick={handleEliminarAPI}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Eliminar API
                </button>
              </div>
            </div>
          )}

          {activeTab === "colaborators" && (
            <div className="mx-auto max-w-6xl bg-white p-6 rounded-lg shadow border space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Colaboradores</h3>
            
              {/* Lista de colaboradores */}
              <div className="space-y-4">
                {/*{apiData.collaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className="flex items-center justify-between bg-gray-50 border rounded-md p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                        {collab.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{collab.name}</p>
                        <p className="text-sm text-gray-500">{collab.email}</p>
                      </div>
                    </div>
                    {isOwner && (
                      <button
                        onClick={null}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar colaborador"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}*/}
              </div>
            
              {/* Añadir colaborador */}
              <div className="pt-4 border-t space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Añadir colaborador
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o correo"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Search size={18}/>
                  </span>
                </div>
                <button
                  onClick={null}
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
                <Lock className="w-5 h-5" />
                Permisos de Visibilidad
              </h3>

              <div className="space-y-4">
              <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="privado"
                    name="permiso"
                    value="privado"
                    checked={apiData.permiso === "privado"}
                    onChange={(e) =>
                      setApiData({ ...apiData, permiso: e.target.value })
                    }
                  />
                  <label
                    htmlFor="privado"
                    className="text-sm font-medium text-gray-700"
                  >
                    Privado – Solo tú tienes acceso a la API.
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="restringido"
                    name="permiso"
                    value="restringido"
                    checked={apiData.permiso === "restringido"}
                    onChange={(e) =>
                      setApiData({ ...apiData, permiso: e.target.value })
                    }
                  />
                  <label
                    htmlFor="restringido"
                    className="text-sm font-medium text-gray-700"
                  >
                    Restringida – Acceso privado pero se puede compartir con enlace.
                  </label>
                </div>

                {apiData.visibility === "restricted" && (
                  <div className="pt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enlace de acceso
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        readOnly
                        value={`https://midominio.com/api/share/${apiData.endpoint}`}
                        className="w-full rounded-l-md border border-gray-300 px-3 py-2 bg-gray-50 text-sm"
                      />
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `https://midominio.com/api/share/${apiData.endpoint}`
                          )
                        }
                        className="px-4 bg-blue-600 text-white text-sm rounded-r-md hover:bg-blue-700"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-x-4">
                {(apiData.permiso === "privado" || apiData.permiso === "restringido") && (
                  <button
                    className="px-4 py-2 bg-[#0077ba] text-white rounded hover:bg-[#003366] transition"
                    onClick={handleGuardarCambios}
                  >
                    Guardar Cambios
                  </button>
                )}
                <button
                  className="px-4 py-2 bg-[#0077ba] text-white rounded hover:bg-[#003366] transition"
                  onClick={handlePublicarAPI}
                >
                  Publicar API
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