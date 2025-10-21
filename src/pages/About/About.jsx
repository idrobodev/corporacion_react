import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Breadcrumbs from "features/dashboard/Breadcrumbs";
import SEO from "features/landing/SEO";
import HeroSection from "./components/HeroSection";
import SedesSection from "./components/SedesSection";
import HistorySection from "./components/HistorySection";
import TeamSection from "./components/TeamSection";
import ValuesSection from "./components/ValuesSection";

// Diagnostic logs for performance analysis
// console.time('About Component Render');
// console.log('About component mounted');

const About = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);


  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: {
      "@type": "Organization",
      name: "Corporación Todo por un Alma",
      description:
        "Centro especializado en tratamiento de adicciones que combina terapia psicológica profesional con guía espiritual basada en la Palabra de Dios.",
      foundingDate: "2020",
      address: [
        {
          "@type": "PostalAddress",
          addressLocality: "Bello",
          addressRegion: "Antioquia",
          addressCountry: "Colombia",
        },
        {
          "@type": "PostalAddress",
          addressLocality: "Apartadó",
          addressRegion: "Antioquia",
          addressCountry: "Colombia",
        },
      ],
      employee: [
        {
          "@type": "Person",
          name: "Dr. Juan Camilo Machado",
          jobTitle: "Director Psicológico - Sede Masculina Bello",
          telephone: "3145702708",
        },
        {
          "@type": "Person",
          name: "Dra. Mildrey Leonel Melo",
          jobTitle: "Directora Psicológica - Sede Femenina Bello",
          telephone: "3216481687",
        },
      ],
    },
  };

  return (
    <>
      <SEO
        title="Sobre Nosotros - Todo por un Alma | Centro de Rehabilitación"
        description="Conoce la historia, valores y equipo profesional de Todo por un Alma. Centro especializado en tratamiento de adicciones con enfoque cristiano en Bello y Apartadó, Colombia."
        keywords="sobre nosotros, historia, equipo profesional, valores cristianos, centro rehabilitación, Bello, Apartadó, psicólogos, terapeutas, adicciones"
        url="/about"
        type="website"
        structuredData={aboutStructuredData}
      />
      <Breadcrumbs title="Sobre Nosotros" />

      <HeroSection />
      <SedesSection />
      <HistorySection />
      <TeamSection />
      <ValuesSection />
    </>
  );
};

export default About;
