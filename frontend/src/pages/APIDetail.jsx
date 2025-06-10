import React, { useState } from "react";
import {
  Settings,
  Users,
  Lock,
  Code2,
  Search,
  FileTerminal,
} from "lucide-react";
import DashboardNavbar from "../componentes/DashboardNavbar";
import { useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { XCircle } from "lucide-react";
import AsyncSelect from 'react-select/async';

//import { useRequireAuth } from "../hooks/useRequireAuth";

const metodosHttp = ["GET", "POST", "PUT", "DELETE", "PATCH"];

const APIDetail = () => {
  //useRequireAuth();
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
    metodos: {},
  });
  const [metodoActivo, setMetodoActivo] = useState("GET");

  const [respuestaAPI, setRespuestaAPI] = React.useState('');

  const [cargando, setCargando] = useState(false);



  async function handleSubmit(e) {
    e.preventDefault();
    setCargando(true); // Inicia el estado de carga
    setRespuestaAPI(""); // Limpia el resultado anterior

    const codigo = metodoInfo.requestBody || "";
    let parametros = {};

    try {
      parametros = JSON.parse(metodoInfo.parametros || "{}");
    } catch {
      setRespuestaAPI("Error: Parámetros JSON inválidos");
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ejecutar/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo,
          parametros,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRespuestaAPI(`Error: ${data.error || "Error desconocido"}`);
      } else {
        setRespuestaAPI(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setRespuestaAPI("Error en la petición: " + error.message);
    } finally {
      setCargando(false); // Termina el estado de carga
    }
  }



  const handleChangeGeneral = (e) => {
    const { name, value } = e.target;
    setApiData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMetodoChange = (metodoActivo, name, value) => {
    setApiData((prevData) => ({
      ...prevData,
      metodos: {
        ...prevData.metodos,
        [metodoActivo]: {
          ...prevData.metodos[metodoActivo],
          [name]: value,
        },
      },
    }));
  };


  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("api");
  //const [searchQuery, setSearchQuery] = useState("");
  const [usuarioActualId, setUsuarioActualId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  // Estados para la sección de colaboradores
  const [searchOptions, setSearchOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [collaborators, setCollaborators] = useState([]);

  // Al montar, carga los colaboradores actuales
  useEffect(() => {
    if (activeTab === "colaborators") {
      axios
        .get(`${API_BASE_URL}/colaboradores/${apiId}/`)
        .then(res => setCollaborators(res.data))
        .catch(() => setCollaborators([]));
    }
  }, [activeTab, apiId]);
  
  const loadUserOptions = async (inputValue) => {
    if (!inputValue) return [];
    const { data } = await axios.get(`${API_BASE_URL}/usuarios/search/`, {
      params: { q: inputValue }
    });
    return data.map((u) => ({
      value: u.id,
      label: `${u.username} — ${u.nombres || ''} ${u.apellidos || ''} (${u.correo || u.email || ''})`,
    }));
  };

  const handleAdd = async () => {
    if (!selectedUser) return;
    console.log(selectedUser.value);
  
    try {
      await axios.post(`${API_BASE_URL}/colaborador/agregar/`, {
        api_id: apiId,
        colaborador_id: selectedUser.value,
      });
  
      setSelectedUser(null);
      setSearchOptions([]);
  
      const { data } = await axios.get(`${API_BASE_URL}/colaboradores/${apiId}/`);
      setCollaborators(data);
  
    } catch (error) {
      console.error('Error detalle:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error al añadir colaborador');
    }
  };

  // Eliminar colaborador
  const handleRemove = async (permId) => {
    await axios.delete(
      `${API_BASE_URL}/colaboradores/eliminar/${permId}/`
    );
    setCollaborators(collaborators.filter(c => c.id !== permId));
    
  };
  const allTabs = [
    { id: "api", label: "API", icon: Code2 },
    { id: "settings", label: "Configuración", icon: Settings },
    { id: "colaborators", label: "Colaboradores", icon: Users },
    { id: "permissions", label: "Permisos", icon: Lock },
    { id: "consume", label: "Consumir", icon: FileTerminal },
  ];

  const metodoInfo = apiData.metodos ? apiData.metodos[metodoActivo] : null;

  const metodoSinInfo =
    metodoInfo &&
    !metodoInfo.endpoint &&
    !metodoInfo.parametros &&
    !metodoInfo.requestBody &&
    !metodoInfo.respuesta;

  const visibleTabs = isOwner
    ? allTabs
    : allTabs.filter((tab) => tab.id === "api" || tab.id === "consume");

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
    }
    else {
      setUsuarioActualId(null);
    }
    obtenerDetalleAPI(apiId);
  }, [apiId]);

  const obtenerDetalleAPI = async (apiId) => {
    try {
      const url = `${API_BASE_URL}/listarapis/${apiId}/`;
      const response = await fetch(url);

      const data = await response.json();
      if (response.ok) {
        setApiData(data);
        setLoading(false);
        console.log(data);
      } else {
        console.error("Error:", data.detail);
      }
    } catch (error) {
      console.error("Error al obtener los datos de la API:", error);
    }
  };


  useEffect(() => {
    if (
      apiData.metodos &&
      !Array.isArray(apiData.metodos) &&
      typeof apiData.metodos === "object" &&
      Object.keys(apiData.metodos).length > 0
    ) {
      return;
    }

    if (Array.isArray(apiData.metodos)) {
      const metodosTransformados = {};
      apiData.metodos.forEach((m) => {
        metodosTransformados[m.metodo] = {
          endpoint: m.endpoint || "",
          parametros: m.parametros || "",
          requestBody: m.codigo || "",
          respuesta: m.retorno || "",
        };
      });

      setApiData((prev) => ({
        ...prev,
        metodos: metodosTransformados,
      }));

      const primeros = Object.keys(metodosTransformados);
      if (primeros.length > 0) setMetodoActivo(primeros[0]);
    }
  }, [apiData.metodos]);

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
              {/* Nombre, descripción y versión */}
              <h2 className="text-2xl font-bold mb-4">{apiData.nombre}</h2>
              <p className="mb-2">{apiData.descripcion}</p>
              <p className="mb-6">Versión: {apiData.documentacion}</p>

              {/* Toggle de métodos HTTP */}
              <div className="flex rounded-lg overflow-hidden border border-gray-300 mb-6">
                {metodosHttp.map((method) => (
                  <button
                    key={method}
                    onClick={() => setMetodoActivo(method)}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors duration-300 ${metodoActivo === method
                        ? "bg-[#0077ba] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {/* Contenido del método activo */}
              {metodoInfo && !metodoSinInfo ? (
                <motion.div
                  key={metodoActivo}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Endpoint */}
                  <div className="bg-white rounded-xl shadow p-4">
                    <h3 className="font-semibold mb-2">Endpoint:</h3>
                    <code className="text-blue-700 font-mono">
                      {metodoInfo.endpoint || "No definido"}
                    </code>
                  </div>

                  {/* Parámetros */}
                  <div className="bg-white rounded-xl shadow p-4">
                    <h3 className="font-semibold mb-2">Parámetros:</h3>
                    <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap font-mono">
                      {metodoInfo.parametros || "Ninguno"}
                    </pre>
                  </div>

                  {/* Cuerpo */}
                  <div className="bg-white rounded-xl shadow p-4">
                    <h3 className="font-semibold mb-2">Cuerpo (body):</h3>
                    <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap font-mono">
                      {metodoInfo.requestBody || "Ninguno"}
                    </pre>
                  </div>

                  {/* Respuesta esperada */}
                  <div className="bg-white rounded-xl shadow p-4">
                    <h3 className="font-semibold mb-2">Respuesta esperada:</h3>
                    <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap font-mono">
                      {metodoInfo.respuesta || "Ninguna"}
                    </pre>
                  </div>
                </motion.div>
              ) : (
                <div className="text-gray-500">Este método no tiene información disponible.</div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Configuración general */}
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

                  {/* Toggle de métodos HTTP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Métodos</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300">
                      {metodosHttp.map((method) => (
                        <button
                          type="button"
                          key={method}
                          onClick={() => setMetodoActivo(method)}
                          className={`flex-1 py-2 text-sm font-semibold transition-colors duration-300 ${metodoActivo === method
                              ? "bg-[#0077ba] text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Campos editables del método activo */}
                  <motion.div
                    key={metodoActivo}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 mt-6"
                  >
                    {/* Endpoint */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Endpoint</label>
                      <input
                        type="text"
                        value={metodoInfo?.endpoint || ""}
                        onChange={(e) =>
                          metodoInfo && handleMetodoChange(metodoActivo, "endpoint", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        placeholder="/miapi/ejemplo"
                      />
                    </div>

                    {/* Parámetros */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Parámetros (JSON)</label>
                      <textarea
                        value={metodoInfo?.parametros || ""}
                        onChange={(e) => handleMetodoChange(metodoActivo, "parametros", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm font-mono"
                        rows={3}
                        placeholder={`[\n  { "nombre": "ciudad", "tipo": "string", "requerido": true }\n]`}
                      />
                    </div>

                    {/* Body */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cuerpo (Body - JSON)</label>
                      <textarea
                        value={metodoInfo?.requestBody || ""}
                        onChange={(e) => handleMetodoChange(metodoActivo, "requestBody", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm font-mono"
                        rows={3}
                        placeholder={`{\n  "nombre": "Juan",\n  "edad": 30\n}`}
                      />
                    </div>

                    {/* Respuesta esperada */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Respuesta esperada (JSON)</label>
                      <textarea
                        value={metodoInfo?.respuesta || ""}
                        onChange={(e) => handleMetodoChange(metodoActivo, "respuesta", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm font-mono"
                        rows={3}
                        placeholder={`{\n  "mensaje": "Éxito",\n  "resultado": {...}\n}`}
                      />
                    </div>

                    {/* Código */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Código</label>
                      <textarea
                        value={metodoInfo?.requestBody || ""}
                        onChange={(e) => handleMetodoChange(metodoActivo, "requestBody", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm font-mono"
                        rows={5}
                        placeholder={"Inserte el código (Python)"}
                      />
                    </div>
                  </motion.div>

                  {/* Botón guardar */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>
              </div>

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

              {/* Añadir colaborador */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadUserOptions}
                  onChange={(option) => setSelectedUser(option)}
                  value={selectedUser}
                  placeholder="Búsqueda por usuario, nombres o email."
                  isClearable
                />
                </div>
                <button
                  onClick={handleAdd}
                  disabled={!selectedUser}
                  className={`px-6 py-2 rounded-lg font-medium ${selectedUser
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                  Añadir
                </button>
              </div>

              {/* Listado de colaboradores existentes */}
              {collaborators.length === 0 ? (
                <p className="text-gray-500">No hay colaboradores aún.</p>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {collaborators.map((permiso) => (
                    <div
                      key={permiso.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{permiso.usuario.username}</p>
                        <p className="text-sm text-gray-500">{permiso.usuario.email}</p>
                      </div>
                      {isOwner && (
                        <button
                          onClick={() => handleRemove(permiso.id)}
                          className="p-1 hover:text-red-600 text-gray-400"
                        >
                          <XCircle size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                {/*<div className="flex items-center gap-3">
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
                </div>*/}

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

          {activeTab === "consume" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileTerminal className="w-5 h-5" />
                Consumir la API
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={apiData.nombre}
                    onChange={handleChangeGeneral}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Versión */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Versión</label>
                  <input
                    type="text"
                    name="documentacion"
                    value={apiData.documentacion}
                    onChange={handleChangeGeneral}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex space-x-2 mb-4">
                  {metodosHttp.map((metodo) => (
                    <button
                      key={metodo}
                      className={`px-3 py-1 rounded ${metodoActivo === metodo ? "bg-[#0077ba] text-white" : "bg-gray-200"
                        }`}
                      onClick={() => setMetodoActivo(metodo)}
                      type="button"
                    >
                      {metodo}
                    </button>
                  ))}
                </div>

                {/* Endpoint */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Endpoint</label>
                    <input
                      type="text"
                      value={metodoInfo.endpoint || ""}
                      onChange={(e) => handleMetodoChange(metodoActivo, "endpoint", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      placeholder="/ejemplo"
                    />
                  </div>
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parámetros (JSON)</label>
                  <textarea
                    rows={4}
                    value={metodoInfo.parametros || ""}
                    onChange={(e) => handleMetodoChange(metodoActivo, "parametros", e.target.value)}
                    placeholder={`{\n  "param1": "valor1",\n  "param2": "valor2"\n}`}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Respuesta</label>
                  {cargando ? (
                    <div className="mt-1 p-2 bg-yellow-100 rounded text-sm text-yellow-800 font-mono">
                      Cargando...
                    </div>
                  ) : (
                    <textarea
                      rows={6}
                      value={respuestaAPI}
                      readOnly
                      placeholder="Aquí se mostrará la respuesta de la API..."
                      className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm text-sm font-mono text-gray-700"
                    />
                  )}
                </div>


                {/* Botón */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0077ba] hover:bg-[#003366] transition text-white rounded"
                  >
                    Consumir API
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default APIDetail;