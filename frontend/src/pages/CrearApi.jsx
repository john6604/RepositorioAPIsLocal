import { useState, useEffect } from "react";
import DashboardNavbar from "../componentes/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { motion } from "framer-motion";
import { useRequireAuth } from "../hooks/useRequireAuth";
import axios from "axios";


const metodosHttp = ["GET", "POST", "PUT", "DELETE", "PATCH"];

const CrearApi = () => {
  useRequireAuth();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [version, setVersion] = useState("1.0");
  const [metodoActivo, setMetodoActivo] = useState("GET");
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [tematicas, setTematicas] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [subcategoria, setSubcategoria] = useState("");
  const [tematica, setTematica] = useState("");
  const [detallesTecnicos, setDetallesTecnicos] = useState("");


  const [datosMetodo, setDatosMetodo] = useState({
    GET: { endpoint: "", parametros: "", requestBody: "", respuesta: "", codigo: "" },
    POST: { endpoint: "", parametros: "", requestBody: "", respuesta: "", codigo: "" },
    PUT: { endpoint: "", parametros: "", requestBody: "", respuesta: "", codigo: "" },
    DELETE: { endpoint: "", parametros: "", requestBody: "", respuesta: "", codigo: "" },
    PATCH: { endpoint: "", parametros: "", requestBody: "", respuesta: "", codigo: "" },
  });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/categorias/`).then((res) => {
      setCategorias(res.data);
    });

    axios.get(`${API_BASE_URL}/subcategorias/`).then((res) => {
      setSubcategorias(res.data);
    });

    axios.get(`${API_BASE_URL}/tematicas/`).then((res) => {
      setTematicas(res.data);
    });
  }, []);

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

  /*const handleSubmit = async (e) => {
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
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const tokenSesion = localStorage.getItem("token_sesion");
    if (!tokenSesion) {
      alert("No se encontró token de sesión");
      return;
    }
  
    const nuevaApi = {
      nombre,
      descripcion,
      version,
      metodos: datosMetodo,
      id_categoria: categoria,
      id_subcategoria: subcategoria,
      id_tematica: tematica,
      detalles_tecnicos: detallesTecnicos, // <- aquí va el campo nuevo

    };
  
    try {
      const response = await fetch(`${API_BASE_URL}/crearapimetodos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenSesion}`,  
        },
        body: JSON.stringify(nuevaApi),
      });
  
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
  
      if (response.ok) {
        alert("API creada correctamente");
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

             {/* Detalles técnicos (requerimientos) */}
             <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detalles técnicos / Requerimientos
            </label>
            <textarea
              value={detallesTecnicos}
              onChange={(e) => setDetallesTecnicos(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-mono"
              rows={2}
              placeholder="numpy, pandas, scikit-learn"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lista de librerías requeridas separadas por comas.
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border rounded-md text-sm"
              >
                <option value="">Seleccione una categoría...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subcategoría <span className="text-red-500">*</span>
              </label>
              <select
                value={subcategoria}
                onChange={(e) => setSubcategoria(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border rounded-md text-sm"
              >
                <option value="">Seleccione una subcategoría...</option>
                {subcategorias.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temática <span className="text-red-500">*</span>
              </label>
              <select
                value={tematica}
                onChange={(e) => setTematica(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border rounded-md text-sm"
              >
                <option value="">Seleccione una temática...</option>
                {tematicas.map((tema) => (
                  <option key={tema.id} value={tema.id}>
                    {tema.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {/* Tabs de métodos con estilo toggle mejorado */}
            <div className="flex rounded-lg overflow-hidden border border-gray-300 mb-6">
              {metodosHttp.map((method) => (
                <button
                  key={method}
                  onClick={() => setMetodoActivo(method)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors duration-300 ${
                    metodoActivo === method
                      ? "bg-[#0077ba] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  type="button"
                >
                  {method}
                </button>
              ))}
            </div>

            <motion.div
              key={metodoActivo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Endpoint */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

              {/* Parámetros */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

              {/* Cuerpo de la solicitud */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

              {/* Respuesta esperada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

              {/* Código */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código
                </label>
                <textarea
                  value={campos.codigo}
                  onChange={(e) => handleChange("codigo", e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-mono"
                  rows={5}
                  placeholder={"Inserte el código (Python)"}
                />
              </div>
            </motion.div>
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