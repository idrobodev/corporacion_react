import React from "react";
import { GradientText } from "components/UI";
import story from "assets/images/nosotros/nosotros_uno.webp";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-[#434194]/10">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/5"></div>
      <div className="container relative z-10 lg:flex py-12 md:py-20 items-center px-4">
        <div className="h-full lg:w-1/2 w-full mb-6 md:mb-8 lg:mb-0">
          <div className="relative group">
            <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-primary/20 to-[#434194]/20 rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <img
              className="relative w-full rounded-xl md:rounded-2xl shadow-2xl transform group-hover:scale-105 transition duration-700"
              src={story}
              alt="Corporación Todo por un Alma"
            />
          </div>
        </div>
        <div className="lg:w-1/2 lg:pl-8 md:lg:pl-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            <GradientText>Corporación Todo por un Alma</GradientText>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 md:mb-8">
            Somos un centro de desintoxicación que combina enfoques psicológicos validados con guía espiritual basada en la Palabra de Dios para el tratamiento integral de adicciones.
          </p>
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {[
              "Terapia Cognitivo-Conductual",
              "Logoterapia y Guía Espiritual",
              "Programas de Reinserción Social",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center group cursor-pointer"
              >
                <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-primary to-secondary rounded-full mr-3 md:mr-4 group-hover:scale-150 transition-transform duration-300"></div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;