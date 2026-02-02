import { useState } from "react";
import DashboardNavbar from "../componentes/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { useRequireAuth } from "../hooks/useRequireAuth";

const CrearSubcategoria = () => {
  useRequireAuth();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tokenSesion = localStorage.getItem("token_sesion");
    if (!tokenSesion) {
      alert("No se encontró token de sesión");
      return;
    }

    const nuevaSubcategoria = {
      nombre,
      descripcion,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/subcategorias/crear/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(nuevaSubcategoria),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Subcategoría creada correctamente");
        navigate("/dashboard");
      } else {
        alert("Error al crear la categoría: " + data.error);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error al enviar la solicitud");
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="max-w-xl mx-auto mt-8 bg-white shadow border rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Crear una nueva subcategoría
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre de la categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la subcategoría <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center px-3 py-2 border rounded-md flex-1">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="flex-1 outline-none text-sm"
                  placeholder="nombre-de-la-categoria"
                  required
                />
              </div>
            </div>
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
              placeholder="Describe brevemente esta subcategoría"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-[#0077ba] hover:bg-[#003366] transition text-white py-2 rounded-md"
          >
            Crear Subcategoría
          </button>
        </form>
      </div>
    </>
  );
};

export default CrearSubcategoria;
