import React from "react";
import { GradientText } from "components/UI";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import belloSedeImage from "assets/images/nosotros/sedes/bello1.png";
import medellinSedeImage from "assets/images/nosotros/sedes/bello2.webp";
import apartadoSedeImage from "assets/images/nosotros/sedes/apartado.jpg";

const sedes = [
  {
    id: "bello",
    name: "Sede Bello",
    location: "Bello, Antioquia",
    address: "Carrera 50 # 52 - 21",
    phone: "+57 310 457 7835",
    director: "Dr. Juan Pérez - Director Médico",
    image: belloSedeImage,
  },
  {
    id: "apartado",
    name: "Sede Apartadó",
    location: "Apartadó, Antioquia",
    address: "Calle 10 # 15 - 30",
    phone: "+57 310 457 7837",
    director: "Dr. Carlos Rojas - Director Sede",
    image: apartadoSedeImage,
  },
  {
    id: "medellin",
    name: "Sede Medellín",
    location: "Medellín, Antioquia",
    address: "Carrera 70 # 45 - 12",
    phone: "+57 310 457 7836",
    director: "Dra. Ana María López - Directora Médica",
    image: medellinSedeImage,
  },
];

const SedesSection = () => {
  return (
    <section
      id="sedes"
      data-animate
      className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-primary/8"
    >
      <div className="container px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            <GradientText>Nuestras Sedes</GradientText>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg px-4">
            Conoce nuestras sedes, diseñadas para brindar el mejor ambiente para la recuperación
          </p>
          <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4 md:mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sedes.map((sede) => (
            <div
              key={sede.id}
              className="group relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 bg-white"
            >
              <img
                src={sede.image}
                alt={`Sede de ${sede.location}`}
                className="w-full h-48 md:h-64 lg:h-72 object-cover transform group-hover:scale-105 transition duration-700"
              />
              <div className="p-4 md:p-6">
                <div className="flex items-center mb-2 text-gray-800">
                  <FaMapMarkerAlt className="mr-2 text-primary text-sm md:text-base" />
                  <span className="text-xs md:text-sm font-medium">{sede.location}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{sede.name}</h3>
                <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">{sede.address}</p>
                <div className="space-y-2 md:space-y-3 mt-3 md:mt-4">
                  <div className="flex items-center text-xs md:text-sm text-gray-600">
                    <FaPhone className="mr-2 text-primary" />
                    <span>{sede.phone}</span>
                  </div>
                  <p className="text-xs md:text-sm font-medium text-gray-700">
                    {sede.director}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SedesSection;