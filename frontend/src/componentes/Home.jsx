import portada from "../assets/data-science.png";

const Home = () => {
  return (
    <div className="space-y-16 px-4 md:px-8 lg:px-16 py-10">
      {/* Hero principal */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-12 bg-white shadow-md rounded-xl p-10">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0077ba] mb-4">
            Gestor y Repositorio de APIs de Ciencia de Datos
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Plataforma que permite registrar, documentar y publicar APIs de algoritmos de ciencia de datos de forma segura, reutilizable y organizada.
          </p>
        </div>
        <div className="flex-1">
          <img
            src={portada}
            alt="Ilustración ciencia de datos"
            className="rounded-xl w-full shadow-lg"
          />
        </div>
      </section>

      {/* Qué es el proyecto */}
      <section>
        <h2 className="text-2xl font-bold text-[#0077ba] mb-4">¿Qué es este proyecto?</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Este gestor fue desarrollado como parte de una práctica preprofesional con el objetivo de facilitar la publicación y consumo de algoritmos
          de minería de datos encapsulados como APIs RESTful.
          <br /><br />
          Está pensado para ser utilizado por investigadores, docentes y estudiantes que desean compartir modelos, clasificadores, predictores u otras herramientas de análisis de datos de forma estandarizada.
        </p>
      </section>

      {/* Características clave */}
      <section>
        <h2 className="text-2xl font-bold text-[#0077ba] mb-6">¿Qué puedes hacer con este sistema?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Registrar APIs",
              desc: "Documenta y publica tus algoritmos como APIs accesibles.",
            },
            {
              title: "Gestionar permisos",
              desc: "Controla quién puede acceder a cada API (público, privado, restringido).",
            },
            {
              title: "Explorar y buscar",
              desc: "Filtra por autor, categoría o palabra clave para encontrar lo que necesitas.",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-6 shadow rounded-xl border hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-[#0077ba] mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-700">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
