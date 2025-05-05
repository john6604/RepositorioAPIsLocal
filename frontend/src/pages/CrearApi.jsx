import axios from "axios";

const handleSubmit = async (e) => {
  e.preventDefault();
  const nuevaApi = { nombre, descripcion, version, visibilidad };

  try {
    const response = await axios.post(
      "https://meticulous-perception-production.up.railway.app/apis/",
      nuevaApi
    );
    console.log("Respuesta del backend:", response.data);
    alert("API registrada exitosamente");
  } catch (error) {
    console.error("Error al crear API:", error);
    alert("Error al registrar la API");
  }
};
