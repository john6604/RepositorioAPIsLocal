import { useState, useEffect } from "react";
import { User, Settings, Bell, Lock, Trash2 } from "lucide-react";
import DashNavbar from "../componentes/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { useRequireAuth } from "../hooks/useRequireAuth";

const tabs = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "account", label: "Cuenta", icon: Settings },
  { id: "notifications", label: "Notificaciones", icon: Bell },
  { id: "password", label: "Contraseñas", icon: Lock },
];

const PerfilConfiguracion = () => {
  useRequireAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    bio: "",
    username: "",
  });
  
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
            name: data.nombres || "",
            lastName: data.apellidos || "",
            email: data.correo || "",
            bio: data.biografia || "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos guardados:", formData);
    alert("¡Cambios guardados!");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      try {
        const response = await fetch(`${API_BASE_URL}/cuenta/eliminar/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token_sesion")}`,
            "Content-Type": "application/json",
          },
        });
  
        if (response.status === 204) {
          alert("Cuenta eliminada permanentemente.");
          localStorage.clear();
          window.location.href = "/login";
        } else {
          const data = await response.json();
          alert("Error al eliminar cuenta: " + data.detail);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error de red o del servidor.");
      }
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cuenta/actualizar/`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token_sesion")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres: formData.name,
          apellidos: formData.lastName,
          correo: formData.email,
          biografia: formData.bio,
          username: formData.username,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Datos actualizados correctamente.");
      } else {
        alert("Error: " + result.detail);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de red o servidor.");
    }
  };
  
  
  const handleLogoutSession = async () => {
    const token = localStorage.getItem("token_sesion");
  
    if (!token) {
      alert("No se encontró el token de sesión.");
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/cerrarsesiones/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token_sesion: token }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Todas las sesiones han sido cerradas correctamente.");
        localStorage.clear();
        navigate("/login");
      } else {
        alert(data.error || "Error al cerrar las sesiones.");
      }
    } catch (error) {
      console.error("Error al cerrar sesiones:", error);
      alert("Error de red al cerrar sesiones.");
    }
  };

  return (
    <>
      <DashNavbar />
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Configuración</h2>
          </div>
          <nav className="flex flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 text-left text-sm hover:bg-gray-100 border-l-4 ${
                  activeTab === tab.id
                    ? "font-semibold bg-gray-50 border-blue-500 text-blue-600"
                    : "border-transparent text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-10">
          <div className="max-w-3xl mx-auto bg-white border rounded-md shadow-sm">
            <div className="border-b px-6 py-4">
              <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h3>
            </div>
            <div className="p-6">
              {activeTab === "profile" && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium">Nombres</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Apellidos</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Nombre de Usuario</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.username}
                      onChange={handleChange}
                      className="mt-1 block w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-200"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleUpdateUser}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>
              )}

                {activeTab === "account" && (
                  <div className="space-y-8">
                    <section>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Configuración de cuenta
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nombres
                          </label>
                          <input
                            type="text"
                            name="username"
                            value={`${formData.name} ${formData.lastName}`.trim()}
                            disabled
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100 shadow-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nombre de Usuario
                          </label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            disabled
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100 shadow-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Dirección de correo electrónico
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100 shadow-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Estado de la cuenta
                          </label>
                          <select
                            name="estado"
                            value={formData.bio}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          >
                            <option value="Activo">Activo</option>
                            <option value="Desactivado">Desactivado</option>
                          </select>
                        </div>
                      </div>
                    </section>

                    <section className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2">
                        <Trash2 className="w-5 h-5" />
                        Danger Zone
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Una vez que elimines tu cuenta, no podrás recuperarla.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-700"
                      >
                        Eliminar cuenta
                      </button>
                    </section>
                  </div>
                )}
              {activeTab === "notifications" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notificaciones
                  </h3>
                  <form onSubmit={(e) => { e.preventDefault(); alert("Preferencias guardadas"); }} className="space-y-6">
                    
                    <div>
                      <h4 className="text-md font-semibold mb-2">Canales de notificación</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          Notificaciones por correo electrónico
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Notificaciones push en navegador
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-semibold mb-2">Preferencias</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          Actividad en mi cuenta
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          Nuevos seguidores
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Mensajes directos
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-4 inline-flex justify-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-600"
                    >
                      Guardar preferencias
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "password" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Contraseña y seguridad
                  </h3>

                  <form onSubmit={(e) => { e.preventDefault(); alert("Contraseña actualizada"); }} className="space-y-6 max-w-md">

                    {/* Sesiones y dispositivos */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold mb-2">Sesiones activas</h4>
                      <p className="text-sm text-gray-600 mb-2">Cierra sesión en todos los dispositivos si sospechas actividad sospechosa.</p>
                      <button
                        type="button"
                        onClick={handleLogoutSession}
                        className="inline-flex justify-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-600"
                      >
                        Cerrar sesión en todos los dispositivos
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PerfilConfiguracion;
