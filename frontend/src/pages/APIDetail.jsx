import React from "react";
import DashboardNavbar from "../componentes/DashboardNavbar";

const APIDetail = () => {

  const apiData = {
    name: "Clasificador de Imágenes",
    description: "API que clasifica imágenes en categorías.",
    endpoint: "/api/clasificador",
    method: "POST",
    parameters: [
      { name: "image", type: "file", required: true, description: "Imagen a clasificar" }
    ],
    returns: "Categoría de la imagen",
    example: `POST /api/clasificador\n{ image: <archivo> }`
  };

  return (
    <>
    <DashboardNavbar/>
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{apiData.name}</h2>
      <p className="mb-2">{apiData.description}</p>
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <h3 className="font-semibold">Endpoint:</h3>
        <code>{apiData.endpoint}</code>
      </div>
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <h3 className="font-semibold">Parámetros:</h3>
        <ul className="list-disc ml-5">
          {apiData.parameters.map((param, index) => (
            <li key={index}>
              <strong>{param.name}</strong> ({param.type}) – {param.description}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <h3 className="font-semibold">Retorna:</h3>
        <p>{apiData.returns}</p>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold">Ejemplo de uso:</h3>
        <pre className="bg-gray-100 p-2 rounded">{apiData.example}</pre>
      </div>
    </div>
    </>
  );
};

export default APIDetail;
