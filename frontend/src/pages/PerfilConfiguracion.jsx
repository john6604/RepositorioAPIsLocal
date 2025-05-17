import { useState } from "react";
import { User, Settings, Bell, Lock, Upload, Trash2, Eye, EyeOff, ClipboardCopy, Users } from "lucide-react";
import DashNavbar from "../componentes/DashboardNavbar";

const tabs = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "account", label: "Cuenta", icon: Settings },
  { id: "notifications", label: "Notificaciones", icon: Bell },
  { id: "password", label: "Contraseñas", icon: Lock },
  { id: "colaborators", label: "Colaboradores", icon: Users},
];

const PerfilConfiguracion = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "Juan Pérez",
    email: "juan@example.com",
    bio: "Desarrollador apasionado por las APIs.",
  });
  const [currentPassword, setCurrentPassword] = useState("MiContraseñaSegura123");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos guardados:", formData);
    alert("¡Cambios guardados!");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      console.log("Cuenta eliminada");
      alert("Cuenta eliminada permanentemente.");
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
                  <div className="flex items-center gap-6">
                    <img
                      src="https://avatars.githubusercontent.com/u/9919?s=200&v=4"
                      alt="Foto de perfil"
                      className="w-16 h-16 rounded-full border"
                    />
                    <div>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Subir nueva foto de perfil.
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, GIF or PNG. Max size 1MB.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Full name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
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
                      type="submit"
                      className="px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Guardar Cambios
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
                            Nombre de usuario
                          </label>
                          <input
                            type="text"
                            name="username"
                            value="juanperez"
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
                          <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            <option>Activo</option>
                            <option>Desactivado</option>
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
                    
                    {/* Contraseña actual con toggle y copiar */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                      <div className="relative flex">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(currentPassword);
                            alert("Contraseña copiada al portapapeles");
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <ClipboardCopy className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
                      <input
                        type="password"
                        name="newPassword"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Recuperación de cuenta */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold mb-2">Recuperación de cuenta</h4>
                      <p className="text-sm text-gray-600 mb-2">Correo de recuperación configurado:</p>
                      <div className="flex items-center justify-between bg-gray-100 p-3 rounded">
                        <span className="text-sm">juan@example.com</span>
                        <button className="text-blue-500 text-sm hover:underline">Cambiar</button>
                      </div>
                    </div>

                    {/* Sesiones y dispositivos */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold mb-2">Sesiones activas</h4>
                      <p className="text-sm text-gray-600 mb-2">Cierra sesión en todos los dispositivos si sospechas actividad sospechosa.</p>
                      <button
                        type="button"
                        onClick={() => alert("Se cerraron todas las sesiones.")}
                        className="inline-flex justify-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-600"
                      >
                        Cerrar sesión en todos los dispositivos
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="mt-6 inline-flex justify-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-600"
                    >
                      Guardar cambios
                    </button>
                  </form>
                </div>
              )}
              {activeTab === "colaborators" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Colaboradores
                  </h3>

                  {/* Formulario para agregar colaborador */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // Aquí iría la lógica para agregar colaborador
                      alert("Colaborador agregado");
                    }}
                    className="mb-6 space-y-4"
                  >
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        className="flex-1 border rounded px-3 py-2 text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="flex-1 border rounded px-3 py-2 text-sm"
                      />
                      <select className="border rounded px-3 py-2 text-sm">
                        <option value="viewer">Lector</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Administrador</option>
                      </select>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                      >
                        Agregar
                      </button>
                    </div>
                  </form>

                  {/* Lista de colaboradores */}
                  <div className="border rounded-md overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 text-sm text-gray-600">
                        <tr>
                          <th className="px-6 py-3 text-left">Nombre</th>
                          <th className="px-6 py-3 text-left">Correo</th>
                          <th className="px-6 py-3 text-left">Rol</th>
                          <th className="px-6 py-3 text-left">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100 text-sm">
                        {/* Aquí podrías mapear los colaboradores desde el estado */}
                        <tr>
                          <td className="px-6 py-4">María López</td>
                          <td className="px-6 py-4">maria@ejemplo.com</td>
                          <td className="px-6 py-4">
                            <select className="border rounded px-2 py-1">
                              <option value="viewer">Lector</option>
                              <option value="editor" selected>Editor</option>
                              <option value="admin">Administrador</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <button
                              onClick={() => alert("Invitación reenviada")}
                              className="text-blue-600 hover:underline"
                            >
                              Reenviar invitación
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("¿Eliminar a este colaborador?")) {
                                  alert("Colaborador eliminado");
                                }
                              }}
                              className="text-red-600 hover:underline"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                        {/* Repite este bloque por cada colaborador */}
                      </tbody>
                    </table>
                  </div>

                  {/* Enlace de invitación */}
                  <div className="mt-6 flex items-center justify-between bg-gray-50 border rounded p-4">
                    <p className="text-sm text-gray-700">Invita a nuevos colaboradores con este enlace:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="https://miapp.com/invitar?token=xyz123"
                        className="text-sm px-2 py-1 border rounded w-64"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("https://miapp.com/invitar?token=xyz123");
                          alert("Enlace copiado");
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
                      >
                        Copiar enlace
                      </button>
                    </div>
                  </div>
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
