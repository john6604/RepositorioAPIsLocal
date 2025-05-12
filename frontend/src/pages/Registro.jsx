import { useState } from "react";
import Navbar from "../componentes/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!correo.includes("@")) {
      nuevosErrores.correo = "Correo inválido.";
    }
    if (clave.length < 6) {
      nuevosErrores.clave = "La contraseña debe tener al menos 6 caracteres.";
    }
    if (clave !== confirmacion) {
      nuevosErrores.confirmacion = "Las contraseñas no coinciden.";
    }
    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresDetectados = validarFormulario();
    setErrores(erroresDetectados);
  
    console.log("Errores detectados:", erroresDetectados); // Verifica si se están detectando errores correctamente
  
    if (Object.keys(erroresDetectados).length === 0) {
      try {
        console.log("Enviando datos:", { correo, contrasena: clave });
        const response = await axios.post(`${API_BASE_URL}/registraruser/`, {
          correo,
          contrasena: clave
        });
  
        console.log("Respuesta del servidor:", response.data); // Depuración
        alert("¡Registro exitoso!");
  
        // Guardar el token de sesión en el localStorage
        const tokenSesion = response.data.token_sesion;
        localStorage.setItem("token_sesion", tokenSesion);  // Guardamos el token
  
        setCorreo(""); setClave(""); setConfirmacion("");
        
        // Redirigir al dashboard o a cualquier otra página
        navigate("/dashboard");
  
      } catch (error) {
        console.error("Error:", error); // Agregar más información de error para depuración
        if (error.response?.data?.error) {
          alert("Error: " + error.response.data.error);
        } else {
          alert("Error al conectar con el servidor.");
        }
      }
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
      <h2 className="text-2xl font-semibold mb-6 text-[#0077ba]">Registro de Usuario</h2>
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
        <div>
          <label className="block text-sm">Confirmar contraseña</label>
          <input
            type="password"
            className={inputClass("confirmacion")}
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
          />
          {errores.confirmacion && <p className="text-sm text-red-600 mt-1">{errores.confirmacion}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-[#0077ba] hover:bg-[#00509e] text-white py-2 rounded-md transition duration-200"
        >
          Registrarse
        </button>
      </form>
      <div className="mt-6 border-t pt-4">
        <p className="text-center text-sm text-gray-500 mb-2">O</p>
        <button
          onClick={null}
          className="w-full flex items-center justify-center border border-gray-300 hover:border-gray-500 py-2 rounded-md transition duration-200"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Regístrate con Google
        </button>
      </div>
      <p className="text-sm text-center mt-4">
        Ya tiene una cuenta.{" "}
        <Link to="/login" className="text-[#0077ba] underline hover:text-[#00509e]">
          Iniciar Sesión.
        </Link>
      </p>
    </div>
  </>
  );
};

export default Registro;
