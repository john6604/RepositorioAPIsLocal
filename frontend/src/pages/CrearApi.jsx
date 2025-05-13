import { useState } from "react";
import DashboardNavbar from "../componentes/DashboardNavbar";
import { useNavigate } from "react-router-dom";

const CrearApi = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [version, setVersion] = useState("1.0");
  const [visibilidad, setVisibilidad] = useState("publica");
  const [ejemploUso, setEjemploUso] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const tokenSesion = localStorage.getItem("tokenSesion");
    if (!tokenSesion) {
      alert("No se encontró token de sesión");
      return;
    }
  
    const nuevaApi = {
      nombre,
      descripcion,
      version, // se guardará en documentacion
      permiso: visibilidad, // aquí mapeamos directamente visibilidad -> permiso
      ejemploUso, // se guarda en detalles_tecnicos
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

          {/* Visibilidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibilidad
            </label>
            <div className="space-y-2">
              {["publica", "privada", "restringida"].map((tipo) => (
                <label key={tipo} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    value={tipo}
                    checked={visibilidad === tipo}
                    onChange={() => setVisibilidad(tipo)}
                  />
                  {tipo === "publica" && (
                    <span>
                      <strong>Pública</strong>: Visible para todos.
                    </span>
                  )}
                  {tipo === "privada" && (
                    <span>
                      <strong>Privada</strong>: Solo visible para ti.
                    </span>
                  )}
                  {tipo === "restringida" && (
                    <span>
                      <strong>Restringida</strong>: Visible solo para usuarios autorizados.
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Ejemplo de uso */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Código de la API
            </label>
            <textarea
              value={ejemploUso}
              onChange={(e) => setEjemploUso(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-mono"
              rows={4}
              placeholder={`curl -X GET https://miapi.com/endpoint\n# o código en JS, Python, etc.`}
          />
            <p className="text-xs text-gray-500 mt-1">
              Incluye tu código de la API.
            </p>
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
