import React, { useState } from "react";
import DashboardNavbar from "../componentes/DashboardNavbar";
import { useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const metodosHttp = ["GET", "POST", "PUT", "DELETE", "PATCH"];

const APIDetail = () => {
  const { apiId } = useParams();
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
    categoria: "",
    subcategoria: "",
    tematica: "",
  });  
  const [metodoActivo, setMetodoActivo] = useState("GET");

  const [loading, setLoading] = useState(true);
  const [activeTab] = useState("api");
  const [usuarioActualId, setUsuarioActualId] = useState(null);
  // eslint-disable-next-line
  const [isOwner, setIsOwner] = useState(false);
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    if (activeTab === "api" && apiData.metodos) {
      for (const method of metodosHttp) {
        const info = apiData.metodos[method];
        const tieneInfo =
          info &&
          (info.endpoint || info.parametros || info.requestBody || info.respuesta);
        if (tieneInfo) {
          setMetodoActivo(method);
          break;
        }
      }
    }
  }, [activeTab, apiData]);

  useEffect(() => {
      axios
        .get(`${API_BASE_URL}/colaboradores/${apiId}/`)
        .then(res => setCollaborators(res.data))
        .catch(() => setCollaborators([]));
  }, [activeTab, apiId]);

  useEffect(() => {
    if (activeTab === "colaborators") {
      axios
        .get(`${API_BASE_URL}/colaboradores/${apiId}/`)
        .then(res => setCollaborators(res.data))
        .catch(() => setCollaborators([]));
    }
  }, [activeTab, apiId]);

  const metodoInfo = apiData.metodos ? apiData.metodos[metodoActivo] : null;

  const metodoSinInfo =
    metodoInfo &&
    !metodoInfo.endpoint &&
    !metodoInfo.parametros &&
    !metodoInfo.requestBody &&
    !metodoInfo.respuesta;

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
    if (!usuarioActualId || !apiData) {
      setIsOwner(false);
      return;
    }
  
    const esOwner = Number(usuarioActualId) === Number(apiData.creado_por);
    const esColaborador = collaborators.some(
      (colab) => Number(colab.usuario?.id) === Number(usuarioActualId)
    );
  
    setIsOwner(esOwner || esColaborador);
  }, [usuarioActualId, apiData, collaborators]);

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
      <div className="flex min-h-screen bg-gray-100">

        {/* Main content */}
        <main className="flex-1 p-10">
          {activeTab === "api" && (
            <div className="max-w-4xl mx-auto">
              {/* Nombre, descripción y versión */}
              <h2 className="text-2xl font-bold mb-4">{apiData.nombre}</h2>
              <p className="mb-2">{apiData.descripcion}</p>
              <p className="mb-6">Versión: {apiData.documentacion}</p>
              <p className="mb-2">Dependencias: {apiData.detalles_tecnicos || "No contiene dependencias"}</p>
              <p className="mb-2">Categoría: {apiData.categoria || "Sin categoría"}</p>
              <p className="mb-2">Subcategoría: {apiData.subcategoria || "Sin subcategoría"}</p>
              <p className="mb-6">Temática: {apiData.tematica || "Sin temática"}</p>

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
                    <h3 className="font-semibold mb-2">Parámetros de Entrada:</h3>
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
                    <h3 className="font-semibold mb-2">Salida:</h3>
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
        </main>
      </div>
    </>
  );
};

export default APIDetail;