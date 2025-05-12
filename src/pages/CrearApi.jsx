import { useState } from "react";
import DashboardNavbar from "../componentes/DashboardNavbar";

const CrearApi = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [version, setVersion] = useState("1.0");
  const [visibilidad, setVisibilidad] = useState("publica");
  const [readme, setReadme] = useState(false);
  const [gitignore, setGitignore] = useState("");
  const [licencia, setLicencia] = useState("");
  const [archivoApi, setArchivoApi] = useState(null);
  const [ejemploUso, setEjemploUso] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaApi = {
      nombre,
      descripcion,
      version,
      visibilidad,
      readme,
      gitignore,
      licencia,
      archivoApi,
      ejemploUso,
    };
    console.log("API creada:", nuevaApi);
    alert("API registrada (aún no conectado al backend)");
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
              Versión inicial
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

          {/* Inicialización */}
          <div className="border-t pt-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={readme}
                onChange={(e) => setReadme(e.target.checked)}
              />
              Añadir un archivo README
            </label>
            <p className="text-xs text-gray-500 ml-6">
              Escribe una descripción larga de tu proyecto más adelante.
            </p>
          </div>

          {/* Gitignore */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Plantilla .gitignore
            </label>
            <select
              value={gitignore}
              onChange={(e) => setGitignore(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm"
            >
              <option value="">Ninguna</option>
              <option value="Node">Node</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
            </select>
          </div>

          {/* Licencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Licencia
            </label>
            <select
              value={licencia}
              onChange={(e) => setLicencia(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm"
            >
              <option value="">Ninguna</option>
              <option value="MIT">MIT</option>
              <option value="GPL">GPL</option>
              <option value="Apache">Apache 2.0</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Define los permisos y restricciones de uso de tu código.
            </p>
          </div>

          {/* Subir archivo de la API */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Archivo de la API (.zip)
            </label>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setArchivoApi(e.target.files[0])}
              className="mt-1 w-full text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Sube un archivo .zip que contenga tu API (código, documentación, etc).
            </p>
          </div>

          {/* Ejemplo de uso */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ejemplo de uso
            </label>
            <textarea
              value={ejemploUso}
              onChange={(e) => setEjemploUso(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-mono"
              rows={4}
              placeholder={`curl -X GET https://miapi.com/endpoint\n# o código en JS, Python, etc.`}
          />
            <p className="text-xs text-gray-500 mt-1">
              Incluye un ejemplo real de cómo consumir tu API.
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
