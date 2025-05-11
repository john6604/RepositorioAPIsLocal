import React, { useState } from "react";
import axios from "axios";
import DashboardNavbar from "../componentes/DashboardNavbar";
import { API_BASE_URL } from "../config";

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("version", version);
    formData.append("visibilidad", visibilidad);
    formData.append("readme", readme);
    formData.append("gitignore", gitignore);
    formData.append("licencia", licencia);
    if (archivoApi) {
      formData.append("archivo_api", archivoApi);
    }
    formData.append("ejemplo_uso", ejemploUso);

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/apis/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(`API registrada correctamente con ID: ${response.data.id}`);
      // Reset form
      setNombre("");
      setDescripcion("");
      setVersion("1.0");
      setVisibilidad("publica");
      setReadme(false);
      setGitignore("");
      setLicencia("");
      setArchivoApi(null);
      setEjemploUso("");
    } catch (error) {
      console.error(error);
      const status = error.response?.status;
      alert(`Error al registrar la API (code ${status})`);
    } finally {
      setLoading(false);
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
            <label className="block text-sm font-medium text-gray-700">
              Nombre de la API <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm"
              required
            />
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
              { ["publica", "privada", "restringida"].map((tipo) => (
                <label key={tipo} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    value={tipo}
                    checked={visibilidad === tipo}
                    onChange={() => setVisibilidad(tipo)}
                  />
                  <span>
                    <strong>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</strong>
                  </span>
                </label>
              )) }
            </div>
          </div>

          {/* README Checkbox */}
          <div className="border-t pt-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={readme}
                onChange={(e) => setReadme(e.target.checked)}
              />
              Añadir un archivo README
            </label>
          </div>

          {/* .gitignore */}
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
              <option value="Apache-2.0">Apache 2.0</option>
            </select>
          </div>

          {/* Archivo ZIP */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Archivo de la API (.zip) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setArchivoApi(e.target.files[0])}
              className="mt-1 w-full text-sm"
              required
            />
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
          </div>

          {/* Botón y estado */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md disabled:opacity-50"
          >
            { loading ? "Creando..." : "Crear API" }
          </button>
        </form>
      </div>
    </>
  );
};

export default CrearApi;
