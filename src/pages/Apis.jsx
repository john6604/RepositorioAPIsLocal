import { useEffect, useState } from "react";

const Apis = () => {
  const [apis, setApis] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Simulación temporal de datos
  useEffect(() => {
    setApis([
      {
        id: 1,
        nombre: "Clasificador de Texto",
        autor: "Juan Pérez",
        descripcion: "Clasifica texto usando NLP.",
        visibilidad: "Pública",
      },
      {
        id: 2,
        nombre: "Detección de Fraude",
        autor: "María Gómez",
        descripcion: "Detecta transacciones fraudulentas.",
        visibilidad: "Privada",
      },
    ]);
  }, []);

  const apisFiltradas = apis.filter(api =>
    api.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">Repositorio de APIs</h2>
      <input
        type="text"
        placeholder="Buscar APIs..."
        className="w-full mb-4 px-4 py-2 border rounded-md"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="grid md:grid-cols-2 gap-6">
        {apisFiltradas.map(api => (
          <div key={api.id} className="bg-white p-4 shadow rounded-md border border-blue-100">
            <h3 className="text-lg font-bold text-blue-800">{api.nombre}</h3>
            <p className="text-sm text-gray-700 mt-1">{api.descripcion}</p>
            <p className="text-xs mt-2 text-gray-500">Autor: {api.autor}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
              api.visibilidad === "Pública" ? "bg-green-100 text-green-800" :
              api.visibilidad === "Privada" ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }`}>
              {api.visibilidad}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apis;
