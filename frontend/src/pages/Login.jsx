import { useState } from "react";
import Navbar from "../componentes/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
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
  
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/login@csrf_exempt
def registrar_usuario(request):
    if request.method == "POST":
        try:
            # Leer datos del request
            data = json.loads(request.body)
            correo = data.get("correo")
            clave = data.get("contrasena")

            if not correo or not clave:
                return JsonResponse({"error": "Datos incompletos."}, status=400)

            # Verificar si el correo ya está registrado
            if Usuario.objects.filter(correo=correo).exists():
                return JsonResponse({"error": "El correo ya está registrado."}, status=409)

            # Crear el usuario
            usuario = Usuario.objects.create(
                correo=correo,
                contrasena_hash=make_password(clave),
                nombres=correo.split("@")[0],
                apellidos=None,
                estado="activo",
                rol_id=2,
                creado_en=timezone.now(),
                actualizado_en=timezone.now()
            )

            # Generar un token de sesión para el usuario
            token_sesion = secrets.token_hex(16)  # Token aleatorio de 32 caracteres hexadecimales

            # Guardar el token en la base de datos en la tabla Sesion
            Sesion.objects.create(
                usuario_id=usuario.id,
                token_sesion=token_sesion,
                expira_en=timezone.now() + timezone.timedelta(days=1),  # Expira en 1 día
                activa=True
            )

            # Responder con el mensaje de éxito y el token
            return JsonResponse({
                "mensaje": "Usuario registrado con éxito.",
                "token_sesion": token_sesion  # Incluir el token en la respuesta
            }, status=201)

        except Exception as e:
            # Manejo de errores
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Método no permitido."}, status=405)/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          contrasena: clave,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario_id", data.usuario_id);
        localStorage.setItem("nombre_usuario", `${data.nombres} ${data.apellidos}`);
        localStorage.setItem("rol_id", data.rol_id);
  
        alert("Inicio de sesión exitoso");
        navigate("/dashboard"); // Redirigir al dashboard
      } else {
        alert(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      alert("Error de red al intentar iniciar sesión");
      console.error("Login error:", error);
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
