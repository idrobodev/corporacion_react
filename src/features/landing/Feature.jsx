import React from "react";
import FeatureItem from "./FeatureItem";

const features = [
  {
    key: "HG42h",
    icon: "fas fa-heart",
    title: "Modelo Biopsicosocial-Espiritual",
    detail: "Combinamos enfoques psicológicos validados con guía espiritual basada en la Palabra de Dios.",
  },
  {
    key: "SSF4",
    icon: "fas fa-users",
    title: "Atención por Género",
    detail: "Espacios separados para hombres y mujeres en cada sede.",
  },
  {
    key: "GH54",
    icon: "fas fa-graduation-cap",
    title: "Reinserción Real",
    detail: "Programas productivos con formación técnica y salida laboral exitosa.",
  },
  {
    key: "RT88",
    icon: "fas fa-home",
    title: "Enfoque Familiar",
    detail: "Tratamiento integral que incluye al núcleo familiar en el proceso de recuperación.",
  },
];

const Feature = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-12 md:py-16 -mt-16 md:-mt-20 relative z-0">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 xl:gap-12">
          {features.map((feature) => (
            <FeatureItem key={feature.key} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feature;
