import { useState } from "react";
import Navbar from "../componentes/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useNavigate } from 'react-router-dom';
//import { useRequireAuth } from "../hooks/useRequireAuth";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Registro = () => {
  //useRequireAuth();
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

  const registrarUsuarioConGoogle = async ({ correo, username, nombres, sub }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/registraruser/`, {
        correo,
        contrasena: sub, 
        username,
        nombres,
        origen: "google"
      });
  
      localStorage.setItem("token_sesion", response.data.token_sesion);
      navigate("/dashboard");
  
    } catch (error) {
      console.error("Error al registrar con Google:", error.response || error.message);
      const mensaje = error.response?.data?.error || 'Error al conectar con el servidor.';
      setErrores(prev => ({ ...prev, api: mensaje }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresDetectados = validarFormulario();
    setErrores(erroresDetectados);

    if (Object.keys(erroresDetectados).length === 0) {
      try {
        // Generar username automáticamente a partir del correo
        const username = correo.split('@')[0];
        const payload = {
          correo,
          contrasena: clave,
          username
        };
        console.log("Enviando payload de registro:", payload); // Verificar que username esté incluido

        const response = await axios.post(`${API_BASE_URL}/registraruser/`, payload);
        console.log("Respuesta del servidor al registrar usuario:", response.data);

        alert("¡Registro exitoso!");
        localStorage.setItem("token_sesion", response.data.token_sesion);

        // Reset campos
        setCorreo("");
        setClave("");
        setConfirmacion("");
        setErrores({});
        navigate("/dashboard");
      } catch (error) {
        console.error("Error en registro:", error.response || error.message);
        const message = error.response?.data?.error || 'Error al conectar con el servidor.';
        setErrores(prev => ({ ...prev, api: message }));
      }
    }
  };

  const inputClass = (campo) =>
    `w-full px-4 py-2 border rounded-md focus:outline-none transition duration-200 ${
      errores[campo] ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-300"
    }`;

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-xl rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-[#0077ba]">Registro de Usuario</h2>
        {errores.api && <p className="text-center text-red-600 mb-4">{errores.api}</p>}
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

        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const token = credentialResponse.credential;
              const decoded = jwtDecode(token);
            
              console.log("Datos decodificados:", decoded);
            
              const correo = decoded.email;
              const username = correo.split('@')[0];
              const nombres = decoded.name;
              const sub = decoded.sub;
            
              registrarUsuarioConGoogle({ correo, username, nombres, sub });
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>

        <p className="text-sm text-center mt-4">
          Ya tiene una cuenta.{' '}
          <Link to="/login" className="text-[#0077ba] underline hover:text-[#00509e]">
            Iniciar Sesión.
          </Link>
        </p>
      </div>
    </>
  );
};

export default Registro;
