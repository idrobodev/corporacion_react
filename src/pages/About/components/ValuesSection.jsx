import React from "react";
import { GradientText } from "components/UI";

const values = [
  {
    icon: "❤️",
    title: "Compasión",
    description:
      "Tratamos a cada persona con amor incondicional y comprensión profunda de su dolor.",
  },
  {
    icon: "🙏",
    title: "Fe",
    description:
      "Creemos en el poder transformador de Dios y en la capacidad de restauración de cada alma.",
  },
  {
    icon: "🤝",
    title: "Integridad",
    description:
      "Actuamos con honestidad, transparencia y coherencia en todos nuestros procesos.",
  },
  {
    icon: "🌟",
    title: "Esperanza",
    description:
      "Mantenemos viva la esperanza de transformación y nueva vida para cada persona.",
  },
  {
    icon: "👥",
    title: "Comunidad",
    description:
      "Creamos un ambiente de apoyo mutuo donde cada persona se siente valorada y acompañada.",
  },
  {
    icon: "📚",
    title: "Excelencia",
    description:
      "Nos comprometemos con la calidad y mejora continua en todos nuestros servicios.",
  },
];

const ValuesSection = () => {
  return (
    <section
      id="valores"
      data-animate
      className="py-12 md:py-20 bg-gradient-to-br from-primary/5 to-[#434194]/8"
    >
      <div className="container px-4">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 md:mb-6">
            <GradientText>Nuestros Valores</GradientText>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Los principios que guían cada una de nuestras acciones y decisiones
          </p>
          <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4 md:mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-primary/20"
            >
              <div className="absolute top-2 md:top-4 right-2 md:right-4 w-1.5 h-1.5 md:w-2 md:h-2 bg-primary/20 rounded-full group-hover:bg-primary transition-colors duration-300"></div>
              <div className="text-4xl md:text-6xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;