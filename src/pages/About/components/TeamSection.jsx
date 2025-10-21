import React from "react";
import { GradientText } from "components/UI";

const teamMembers = [
  {
    name: "Dr. Juan Camilo Machado",
    role: "Director Psicológico - Sede Masculina Bello",
    specialty: "Especialista en Adicciones y Terapia Cognitivo-Conductual",
    email: "juan.machado@todoporunalma.org",
  },
  {
    name: "Dra. Mildrey Leonel Melo",
    role: "Directora Psicológica - Sede Femenina Bello",
    specialty: "Especialista en Terapia Familiar y Logoterapia",
    email: "mildrey.melo@todoporunalma.org",
  },
];

const TeamSection = () => {
  return (
    <section
      id="equipo"
      data-animate
      className="py-12 md:py-20 bg-gradient-to-br from-white via-gray-50 to-primary/5"
    >
      <div className="container px-4">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 md:mb-6">
            <GradientText>Nuestro Equipo Profesional</GradientText>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Profesionales altamente capacitados comprometidos con tu recuperación
          </p>
          <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4 md:mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-primary/20"
            >
              <div className="flex items-start space-x-4 md:space-x-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary/20 to-[#434194]/20 rounded-full flex items-center justify-center group-hover:from-primary group-hover:to-[#434194] transition-all duration-500 flex-shrink-0">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:text-white transition-colors duration-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-primary font-medium text-sm md:text-base">{member.role}</p>
                  <p className="text-gray-600 mt-1 text-sm md:text-base">{member.specialty}</p>
                  <div className="flex items-center text-gray-600 mt-2">
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 mr-2 text-primary flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a href={`mailto:${member.email}`} className="hover:text-primary transition-colors text-xs md:text-sm break-all">
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;