import { useState } from "react";
import Navbar from "../componentes/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena: clave }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token_sesion", data.token);
        localStorage.setItem("usuario_id", data.usuario_id);
        localStorage.setItem("nombre_usuario", `${data.nombres} ${data.apellidos}`);
        alert("Inicio de sesión exitoso");
        navigate("/dashboard");
      } else {
        alert(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      alert("Error de red al intentar iniciar sesión");
      console.error("Login error:", error);
    }
  };

  const inputClass = (campo) =>
    `w-full px-4 py-2 border rounded-md focus:outline-none transition duration-200 ${errores[campo] ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-300"
    }`;

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-xl rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-[#0077ba] text-center">Iniciar Sesión</h2>
        <p className="text-sm text-center mb-4">
          No tienes una cuenta?{" "}
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
          <div className="relative">
            <label className="block text-sm">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              className={inputClass("clave")}
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errores.clave && <p className="text-sm text-red-600 mt-1">{errores.clave}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-[#0077ba] hover:bg-[#00509e] text-white py-2 rounded-md transition duration-200"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 font-medium">O</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const decoded = jwtDecode(credentialResponse.credential);
                const { email, sub, given_name, family_name } = decoded;

                const response = await fetch(`${API_BASE_URL}/login/`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    correo: email,
                    contrasena: sub,
                    origen: "google",
                    nombres: given_name,
                    apellidos: family_name
                  })
                });

                const data = await response.json();
                if (response.ok) {
                  localStorage.setItem("token_sesion", data.token);
                  localStorage.setItem("usuario_id", data.usuario_id);
                  localStorage.setItem("nombre_usuario", `${data.nombres} ${data.apellidos}`);
                  alert("Inicio de sesión exitoso");
                  navigate("/dashboard");
                } else {
                  alert(data.error || "Error al iniciar sesión con Google");
                }
              } catch (error) {
                console.error("Error al iniciar sesión con Google:", error);
                alert("Error al procesar el inicio de sesión con Google");
              }
            }}
            onError={() => {
              console.log("Login con Google fallido");
            }}
            width="100%" // Esto fuerza el ancho completo del botón
          />
        </div>

        <p className="text-sm text-center mt-4">
          <Link to="/registro" className="text-[#0077ba] underline hover:text-[#00509e]">
            Olvidó su contraseña?
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
