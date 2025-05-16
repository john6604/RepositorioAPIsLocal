import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const APIs = () => {
  const query = useQuery();
  const termino = query.get("q");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const buscar = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/buscar-apis-publicas?q=${encodeURIComponent(termino)}`);
        const data = await res.json();
        setResultados(data.resultados || []);
      } catch (error) {
        console.error("Error al buscar APIs:", error);
      } finally {
        setCargando(false);
      }
    };

    if (termino) {
      buscar();
    }
  }, [termino]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Resultados de búsqueda para: “{termino}”</h2>
      {cargando ? (
        <p>Cargando...</p>
      ) : resultados.length === 0 ? (
        <p>No se encontraron resultados.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {resultados.map((api) => (
            <li key={api.id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{api.nombre}</h3>
              <p className="text-sm text-gray-600 mb-2">{api.descripcion}</p>
              <p className="text-xs text-gray-400">Autor: {api.autor}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default APIs;
/*import { useEffect, useState } from "react";

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

export default Apis;*/
