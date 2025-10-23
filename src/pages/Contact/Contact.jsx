import React, { useState, useEffect } from "react";
import Breadcrumbs from "features/dashboard/Breadcrumbs";
import SEO from "features/landing/SEO";

import { GradientText } from "components/UI";

const Contact = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const contactInfo = [
    {
      icon: "📧",
      title: "Correos Electrónicos",
      details: ["fundacion@todoporunalma.org", "info@todoporunalma.org"],
    },
    {
      icon: "📞",
      title: "Teléfonos",
      details: [
        "Bello: 3145702708 / 3216481687",
        "Apartadó: 3104577835",
        "Principal: 3145702708",
      ],
    },
  ];

  const socialNetworks = [
    {
      name: "Facebook",
      icon: "📘",
      url: "https://www.facebook.com/todoporunalmacorporacion/",
      color: "from-blue-600 to-blue-700",
      hoverColor: "hover:from-blue-700 hover:to-blue-800",
    },
    {
      name: "Instagram",
      icon: "📷",
      url: "https://www.instagram.com/corporaciontodoporunalma/",
      color: "from-pink-500 to-purple-600",
      hoverColor: "hover:from-pink-600 hover:to-purple-700",
    },
    {
      name: "WhatsApp",
      icon: "💬",
      url: "https://wa.me/573145702708",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
    },
    {
      name: "YouTube",
      icon: "📺",
      url: "#",
      color: "from-red-500 to-red-600",
      hoverColor: "hover:from-red-600 hover:to-red-700",
    },
    {
      name: "TikTok",
      icon: "🎵",
      url: "#",
      color: "from-black to-gray-800",
      hoverColor: "hover:from-gray-800 hover:to-black",
    },
  ];


  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": "Organization",
      name: "Corporación Todo por un Alma",
      telephone: ["+57-314-570-2708", "+57-321-648-1687", "+57-310-457-7835"],
      email: ["fundacion@todoporunalma.org", "info@todoporunalma.org"],
      address: [
        {
          "@type": "PostalAddress",
          streetAddress: "Vereda Potreritos, Finca el Alto",
          addressLocality: "Bello",
          addressRegion: "Antioquia",
          addressCountry: "Colombia",
        },
        {
          "@type": "PostalAddress",
          streetAddress: "Calle 102BB #76-34, Barrio 20 de Enero",
          addressLocality: "Apartadó",
          addressRegion: "Antioquia",
          addressCountry: "Colombia",
        },
      ],
    },
  };

  return (
    <div>
      <SEO
        title="Contacto - Todo por un Alma | Centro de Rehabilitación en Bello y Apartadó"
        description="Contáctanos para información sobre nuestros programas de rehabilitación. Estamos disponibles 24/7 en Bello y Apartadó. Llámanos, escríbenos o visítanos."
        keywords="contacto, teléfono, dirección, Bello, Apartadó, centro rehabilitación, ayuda inmediata, emergencia, información programas"
        url="/contact"
        type="website"
        structuredData={contactStructuredData}
      />
      <Breadcrumbs title="Contacto" />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-[#434194]/10 py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/5"></div>
        <div className="container relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            <GradientText>¿Necesitas Ayuda Inmediata?</GradientText>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6 md:mb-8 px-4">
            No esperes más. Da el primer paso hacia tu recuperación hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <a
              href="tel:3145702708"
              className="bg-white text-primary px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              📞 Llamar Ahora
            </a>
            <a
              href="https://wa.me/573145702708"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Información de Contacto */}
      <section
        id="contacto-info"
        data-animate
        className={`py-12 md:py-20 bg-gradient-to-br from-primary/5 to-[#434194]/8 transition-all duration-1000 ${
          isVisible["contacto-info"]
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center lg:text-left mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
                <GradientText>Información de Contacto</GradientText>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto lg:mx-0">
                Estamos disponibles para atenderte <span className="font-semibold text-primary">las 24 horas del día</span>, los 7 días de la semana.
              </p>
              <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-primary via-[#434194] to-secondary mx-auto lg:mx-0 rounded-full mt-4 md:mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white via-gray-50/50 to-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30 hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4 md:space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary/10 to-[#434194]/10 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-4xl group-hover:scale-110 transition-transform duration-300">
                        {info.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300">
                        {info.title}
                      </h3>
                      <div className="space-y-2 md:space-y-3">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-700 leading-relaxed text-base md:text-lg">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="group bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-200 hover:border-amber-300 hover:-translate-y-1 md:col-span-2">
                <div className="flex items-start space-x-4 md:space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-4xl group-hover:scale-110 transition-transform duration-300">
                      💡
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-amber-900 mb-3 md:mb-4 group-hover:text-amber-800 transition-colors duration-300">
                      Consejo Importante
                    </h3>
                    <p className="text-amber-800 leading-relaxed text-base md:text-lg font-medium">
                      Si estás en una situación de <span className="font-bold text-red-600">emergencia o Crisis</span>, no dudes en llamarnos inmediatamente. Estamos aquí para ayudarte en cualquier momento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa Mejorado */}
      <section className="relative py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              <GradientText>Nuestras Ubicaciones</GradientText>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Visítanos en cualquiera de nuestras sedes
            </p>
            <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4 md:mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Mapa de Bello */}
            <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-48 md:h-64 relative">
                <iframe
                  className="w-full h-full"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d-75.55773348523147!3d6.326506295411078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e442f1c8f8f8f8f%3A0x8f8f8f8f8f8f8f8f!2sBello%2C%20Antioquia%2C%20Colombia!5e0!3m2!1ses!2sco!4v1633349781164!5m2!1ses!2sco"
                  allowFullScreen=""
                  loading="lazy"
                  title="Ubicación Bello"
                ></iframe>
                <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-white px-3 md:px-4 py-1 md:py-2 rounded-lg shadow-md">
                  <span className="text-primary font-semibold text-sm md:text-base">Sede Bello</span>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Sede Bello</h3>
                <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">Dirección: Calle 50 # 50-50, Bello, Antioquia</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 md:px-2.5 py-0.5 rounded">Atención 24/7</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 md:px-2.5 py-0.5 rounded">Parqueadero disponible</span>
                </div>
              </div>
            </div>

            {/* Mapa de Apartadó */}
            <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-48 md:h-64 relative">
                <iframe
                  className="w-full h-full"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.012258376609!2d-76.6547226852319!3d6.2018707954113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e442f1c8f8f8f8f%3A0x8f8f8f8f8f8f8f8f!2sApartad%C3%B3%2C%20Antioquia%2C%20Colombia!5e0!3m2!1ses!2sco!4v1633349781164!5m2!1ses!2sco"
                  allowFullScreen=""
                  loading="lazy"
                  title="Ubicación Apartadó"
                ></iframe>
                <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-white px-3 md:px-4 py-1 md:py-2 rounded-lg shadow-md">
                  <span className="text-primary font-semibold text-sm md:text-base">Sede Apartadó</span>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Sede Apartadó</h3>
                <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">Carrera 100 # 50-50, Apartadó, Antioquia</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 md:px-2.5 py-0.5 rounded">Atención 24/7</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 md:px-2.5 py-0.5 rounded">Zona de espera</span>
                </div>
              </div>
            </div>

            {/* Mapa de Medellín */}
            <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-48 md:h-64 relative">
                <iframe
                  className="w-full h-full"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d-75.55773348523147!3d6.326506295411078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e442f1c8f8f8f8f%3A0x8f8f8f8f8f8f8f8f!2sMedell%C3%ADn%2C%20Antioquia%2C%20Colombia!5e0!3m2!1ses!2sco!4v1633349781164!5m2!1ses!2sco"
                  allowFullScreen=""
                  loading="lazy"
                  title="Ubicación Medellín"
                ></iframe>
                <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-white px-3 md:px-4 py-1 md:py-2 rounded-lg shadow-md">
                  <span className="text-primary font-semibold text-sm md:text-base">Sede Medellín</span>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Sede Medellín</h3>
                <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">Carrera 70 # 45-12, Medellín, Antioquia</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 md:px-2.5 py-0.5 rounded">Atención 24/7</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 md:px-2.5 py-0.5 rounded">Centro urbano</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Redes Sociales Section */}
      <section
        id="redes-sociales"
        data-animate
        className={`py-12 md:py-20 bg-gradient-to-br from-white via-gray-50 to-primary/5 transition-all duration-1000 ${
          isVisible["redes-sociales"]
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              <GradientText>Síguenos en Redes Sociales</GradientText>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Mantente conectado con nosotros y sé parte de nuestra comunidad de
              esperanza y transformación
            </p>
            <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-primary to-[#434194] mx-auto rounded-full mt-4 md:mt-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto">
            {socialNetworks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div
                  className={`bg-gradient-to-br ${social.color} ${social.hoverColor} rounded-2xl md:rounded-3xl p-4 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-2`}
                >
                  <div className="text-4xl md:text-6xl mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </div>
                  <h3 className="text-white font-bold text-sm md:text-lg group-hover:text-yellow-300 transition-colors duration-300">
                    {social.name}
                  </h3>
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 w-1.5 h-1.5 md:w-2 md:h-2 bg-white/30 rounded-full group-hover:bg-yellow-300 transition-colors duration-300"></div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
