<<<<<<< HEAD
import { useState } from "react";

const CrearApi = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [version, setVersion] = useState("1.0");
  const [visibilidad, setVisibilidad] = useState("Pública");

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaApi = { nombre, descripcion, version, visibilidad };
    // Aquí se enviaría a Django con axios
    console.log("API creada:", nuevaApi);
    alert("API registrada (aún no conectado al backend)");
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white shadow p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-blue-900">Crear Nueva API</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Nombre de la API</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            rows={3}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm">Versión</label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Visibilidad</label>
          <select
            value={visibilidad}
            onChange={(e) => setVisibilidad(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="Pública">Pública</option>
            <option value="Privada">Privada</option>
            <option value="Restringida">Restringida</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-md"
        >
          Publicar API
        </button>
      </form>
    </div>
  );
};

export default CrearApi;
=======
import { useState } from "react";

const CrearApi = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [version, setVersion] = useState("1.0");
  const [visibilidad, setVisibilidad] = useState("Pública");

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaApi = { nombre, descripcion, version, visibilidad };
    // Aquí se enviaría a Django con axios
    console.log("API creada:", nuevaApi);
    alert("API registrada (aún no conectado al backend)");
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white shadow p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-blue-900">Crear Nueva API</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Nombre de la API</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            rows={3}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm">Versión</label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Visibilidad</label>
          <select
            value={visibilidad}
            onChange={(e) => setVisibilidad(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="Pública">Pública</option>
            <option value="Privada">Privada</option>
            <option value="Restringida">Restringida</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-md"
        >
          Publicar API
        </button>
      </form>
    </div>
  );
};

export default CrearApi;
>>>>>>> feature/dashboard-sidebar
