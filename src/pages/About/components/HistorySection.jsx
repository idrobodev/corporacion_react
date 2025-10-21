import React from "react";
import { GradientText } from "components/UI";
import historiaImage from "assets/images/nosotros/nuestra_historia.webp";

const HistorySection = () => {
  return (
    <section
      id="historia"
      data-animate
      className="py-12 md:py-20 bg-gradient-to-br from-white via-gray-50 to-primary/5"
    >
      <div className="container px-4">
        <div className="text-center mb-8 md:mb-12 overflow-hidden">
          <div
            className="inline-block overflow-hidden"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 hover:scale-105 transition-transform duration-500 inline-block"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="100"
            >
              <GradientText>Nuestra Historia</GradientText>
            </h2>
          </div>
          <div
            className="overflow-hidden"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="100"
          >
            <p
              className="text-gray-700 text-base md:text-lg mb-4 max-w-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-500 px-4"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="200"
            >
              Cada paso de nuestro viaje está marcado por la fe y la transformación de vidas
            </p>
          </div>
          <div
            className="w-20 md:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="200"
          ></div>
        </div>

        <div className="lg:flex items-center gap-8 md:gap-16">
          <div
            className="lg:w-2/5 mb-6 md:mb-8 lg:mb-0"
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="200"
          >
            <div
              className="relative group"
              data-aos="zoom-in"
              data-aos-duration="1000"
              data-aos-delay="300"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-[#434194]/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:rotate-1"></div>
              <img
                src={historiaImage}
                alt="Nuestra Historia"
                className="relative w-full max-w-md mx-auto rounded-xl shadow-lg transform group-hover:scale-105 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 aspect-[2/3] object-cover"
                data-aos="zoom-in"
                data-aos-duration="1000"
                data-aos-delay="300"
              />
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="space-y-4 md:space-y-6">
              <div
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-primary/10 hover:border-primary/30 transform hover:-translate-y-1"
                data-aos="fade-left"
                data-aos-duration="800"
                data-aos-delay="300"
              >
                <h3 className="text-xl md:text-2xl font-bold text-[#434194] mb-3 md:mb-4">
                  Nuestros Inicios
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  Fundada con la visión de transformar vidas a través del amor de Cristo, nuestra corporación nació del deseo de ofrecer esperanza a quienes luchan contra las adicciones.
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-[#434194]/10">
                <h3 className="text-xl md:text-2xl font-bold text-[#434194] mb-3 md:mb-4">
                  Nuestro Crecimiento
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  A lo largo de los años, hemos expandido nuestros servicios a múltiples sedes, manteniendo siempre nuestro compromiso con la excelencia y el amor incondicional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;