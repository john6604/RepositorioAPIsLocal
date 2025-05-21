import { useState, useEffect } from "react";
import DashboardNavbar from "../componentes/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const metodosHttp = ["GET", "POST", "PUT", "DELETE", "PATCH"];

const CrearApi = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [version, setVersion] = useState("1.0");
  const [metodoActivo, setMetodoActivo] = useState("GET");

  const [datosMetodo, setDatosMetodo] = useState({
    GET: { endpoint: "", parametros: "", requestBody: "", respuesta: "", codigo: "" },
    POST: { endpoint: "", parametros: "", requestBody: "", respuesta: "", codigo: "" },
    PUT: { endpoint: "", parametros: "", requestBody: "", respuesta: "", codigo: "" },
    DELETE: { endpoint: "", parametros: "", requestBody: "", respuesta: "", codigo: "" },
    PATCH: { endpoint: "", parametros: "", requestBody: "", respuesta: "", codigo: "" },
  });
  // eslint-disable-next-line
  const [requestBody, setRequestBody] = useState("");
  // eslint-disable-next-line
  const [respuesta, setRespuesta] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cuenta/perfil/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token_sesion")}`,
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setFormData({
            username: data.username || "",
          });
        } else {
          const err = await response.json();
          alert("Error al obtener perfil: " + err.detail);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudo cargar el perfil.");
      }
    };
  
    fetchPerfil();
  }, []);

  const handleChange = (campo, valor) => {
    setDatosMetodo((prev) => ({
      ...prev,
      [metodoActivo]: {
        ...prev[metodoActivo],
        [campo]: valor,
      },
    }));
  };

  const campos = datosMetodo[metodoActivo];

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const tokenSesion = localStorage.getItem("token_sesion");
    if (!tokenSesion) {
      alert("No se encontró token de sesión");
      return;
    }
  
    //Se modificó para aplicar tabs, faltan atributos los cuales no se enviarán
    const nuevaApi = {
      nombre,
      descripcion,
      version,
      requestBody,
      respuesta,
      token_sesion: tokenSesion,
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}/crearapi/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaApi),
      });
  
      const data = await response.json();
      console.log("Nueva API:", nuevaApi)

      if (response.ok) {
        alert("API creada correctamente");
        console.log("Resultado:", data);
        navigate("/dashboard");
      } else {
        alert("Error al crear la API: " + data.error);
      }
  
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error al enviar la solicitud");
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="max-w-3xl mx-auto mt-8 bg-white shadow border rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Crear una nueva API
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la API <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center space-x-2">
              {/* Autor (no editable) */}
              <div className="flex items-center space-x-2 px-3 py-2 border rounded-md bg-black/5">
                <span className="text-sm text-gray-700 font-medium">{formData.username}</span>
              </div>

              <span className="text-gray-500 mr-1">/</span>

              {/* Campo editable para el nombre */}
              <div className="flex items-center px-3 py-2 border rounded-md flex-1">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="flex-1 outline-none text-sm"
                  placeholder="nombre-de-la-api"
                  required
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Elige un nombre corto y descriptivo para tu API.
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Explica brevemente qué hace tu API.
            </p>
          </div>

          {/* Versión */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Versión inicial <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm"
            />
          </div>

          <div className="space-y-4">
            {/* Tabs de métodos */}
            <div className="flex space-x-2 mb-4">
              {metodosHttp.map((metodo) => (
                <button
                  key={metodo}
                  className={`px-3 py-1 rounded ${
                    metodoActivo === metodo ? "bg-[#0077ba] text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setMetodoActivo(metodo)}
                  type="button"
                >
                  {metodo}
                </button>
              ))}
            </div>

            {/* Campos específicos por método */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Endpoint <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={campos.endpoint}
                onChange={(e) => handleChange("endpoint", e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-md text-sm"
                placeholder="/miapi/ejemplo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Parámetros (JSON)
              </label>
              <textarea
                value={campos.parametros}
                onChange={(e) => handleChange("parametros", e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-mono"
                rows={3}
                placeholder={`[\n  { "nombre": "ciudad", "tipo": "string", "requerido": true }\n]`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cuerpo de la solicitud (JSON)
              </label>
              <textarea
                value={campos.requestBody}
                onChange={(e) => handleChange("requestBody", e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-mono"
                rows={3}
                placeholder={`{\n  "nombre": "Juan",\n  "edad": 30\n}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Respuesta esperada (JSON)
              </label>
              <textarea
                value={campos.respuesta}
                onChange={(e) => handleChange("respuesta", e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-mono"
                rows={3}
                placeholder={`{\n  "mensaje": "Éxito",\n  "resultado": {...}\n}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Código (Python)
              </label>
              <textarea
                value={campos.codigo}
                onChange={(e) => handleChange("codigo", e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-mono"
                rows={4}
                placeholder={`Tu código en Python`}
              />
            </div>
          </div>


          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-[#0077ba] hover:bg-[#003366] transition text-white py-2 rounded-md"
          >
            Crear API
          </button>
        </form>
      </div>
    </>
  );
};

export default CrearApi;