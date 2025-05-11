import { useState } from "react";
import Navbar from "../componentes/Navbar";
import { Link } from "react-router-dom";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [errores, setErrores] = useState({});

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!correo.includes("@")) {
      nuevosErrores.correo = "Correo inválido.";
    }
    if (!clave) {
      nuevosErrores.clave = "Debes ingresar la contraseña.";
    }
    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresDetectados = validarFormulario();
    setErrores(erroresDetectados);

    if (Object.keys(erroresDetectados).length === 0) {
      console.log("Iniciando sesión:", { correo, clave });
      alert("¡Inicio de sesión exitoso! (Falta conectar con backend)");
      setCorreo(""); setClave("");
    }
  };

  const inputClass = (campo) =>
    `w-full px-4 py-2 border rounded-md focus:outline-none transition duration-200 ${
      errores[campo] ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-300"
    }`;

  return (
    <>
    <Navbar/>
    <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-[#0077ba] text-center">Iniciar Sesión</h2>
      <p className="text-sm text-center mb-4">
        No tiene una cuenta.{" "}
        <Link to="/registro" className="text-[#0077ba] underline hover:text-[#00509e]">
          Regístrate
        </Link>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Correo electrónico</label>
          <input
            type="email"
            className={inputClass("correo")}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          {errores.correo && <p className="text-sm text-red-600 mt-1">{errores.correo}</p>}
        </div>
        <div>
          <label className="block text-sm">Contraseña</label>
          <input
            type="password"
            className={inputClass("clave")}
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />
          {errores.clave && <p className="text-sm text-red-600 mt-1">{errores.clave}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-[#0077ba] hover:bg-[#00509e] text-white py-2 rounded-md transition duration-200"
        >
          Iniciar Sesión
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        <Link to="/registro" className="text-[#0077ba] underline hover:text-[#00509e]">
          Olvidó su contraseña.
        </Link>
      </p>
    </div>
  </>
  );
};

export default Login;
