import { useState } from "react";
import DashboardNavbar from "../componentes/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const CrearApi = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [version, setVersion] = useState("1.0");
  const [metodo, setMetodo] = useState("GET");
  const [endpoint, setEndpoint] = useState("");
  const [parametros, setParametros] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const tokenSesion = localStorage.getItem("token_sesion");
    if (!tokenSesion) {
      alert("No se encontró token de sesión");
      return;
    }
  
    // Parsear los campos JSON con manejo de errores
    let parametrosObj = null;
    let requestBodyObj = null;
    let respuestaObj = null;
  
    try {
      parametrosObj = parametros ? JSON.parse(parametros) : null;
    } catch {
      alert("Parámetros JSON inválidos");
      return;
    }
  
    try {
      requestBodyObj = requestBody ? JSON.parse(requestBody) : null;
    } catch {
      alert("Cuerpo de la solicitud JSON inválido");
      return;
    }
  
    try {
      respuestaObj = respuesta ? JSON.parse(respuesta) : null;
    } catch {
      alert("Respuesta esperada JSON inválida");
      return;
    }
  
    const nuevaApi = {
      nombre,
      descripcion,
      version,
      metodo,
      endpoint,
      parametros: parametrosObj,
      requestBody: requestBodyObj,
      respuesta: respuestaObj,
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
                <span className="text-sm text-gray-700 font-medium">john6604</span>
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Método HTTP <span className="text-red-500">*</span>
            </label>
            <select
              value={metodo}
              onChange={(e) => setMetodo(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Endpoint <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm"
              placeholder="/miapi/ejemplo"
            />
          </div>

          {/* Parámetros */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Parámetros (JSON)
            </label>
            <textarea
              value={parametros}
              onChange={(e) => setParametros(e.target.value)}
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
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-mono"
              rows={3}
              placeholder={`{\n  "nombre": "Juan",\n  "edad": 30\n}`}
            />
          </div>

          {/* Respuesta esperada */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Respuesta esperada (JSON)
            </label>
            <textarea
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-mono"
              rows={3}
              placeholder={`{\n  "mensaje": "Éxito",\n  "resultado": {...}\n}`}
            />
          </div>


          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          >
            Crear API
          </button>
        </form>
      </div>
    </>
  );
};

export default CrearApi;
