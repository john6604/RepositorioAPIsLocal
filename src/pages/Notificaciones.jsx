import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import DashboardNavbar from "../componentes/DashboardNavbar";

const Notificaciones = () => {

  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    setNotificaciones([
      {
        id: 1,
        titulo: "Nuevo API añadido",
        descripcion: "Has creado una nueva API llamada 'Predicción del clima'.",
        fecha: "2025-05-09 14:30",
      },
      {
        id: 2,
        titulo: "Colaborador aceptado",
        descripcion: "juan@example.com ahora colabora en tu API.",
        fecha: "2025-05-08 18:20",
      },
      {
        id: 3,
        titulo: "API favorita actualizada",
        descripcion: "La API 'Análisis de suelos' ha sido actualizada.",
        fecha: "2025-05-07 09:15",
      },
    ]);
  }, []);

  return (
    <>
    <DashboardNavbar />
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-[#0077ba] mb-6 flex items-center gap-2">
          <Bell size={24} /> Notificaciones
        </h1>

        {notificaciones.length === 0 ? (
          <p className="text-gray-600 text-center">No hay notificaciones por el momento.</p>
        ) : (
          <ul className="space-y-4">
            {notificaciones.map((n) => (
              <li key={n.id} className="border rounded p-4 bg-gray-50 shadow-sm">
                <h2 className="font-semibold text-[#0077ba]">{n.titulo}</h2>
                <p className="text-gray-700">{n.descripcion}</p>
                <p className="text-xs text-gray-500 mt-1">{n.fecha}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </>
  );
};

export default Notificaciones;