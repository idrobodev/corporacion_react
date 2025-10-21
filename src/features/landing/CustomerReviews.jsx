import React, { useEffect } from "react";
import Review from "./Review";
import { GradientText } from "components/UI";

const reviews = [
  {
    key: "testimonial1",
    name: "María González",
    title: "Testimonio de Transformación",
    videoId: "kKsQRkOyKCI"
  },
  {
    key: "testimonial2",
    name: "Carlos Rodríguez",
    title: "Historia de Superación",
    videoId: "EsCm0WnK-CE"
  },
  {
    key: "testimonial3",
    name: "Ana Martínez",
    title: "Experiencia de Cambio",
    videoId: "AjohVQntKuY"
  }
];

const CustomerReviews = () => {
  // Optimize bfcache by pausing YouTube iframes on page unload
  useEffect(() => {
    const handleUnload = () => {
      const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');
      iframes.forEach(iframe => {
        // Send pause command to YouTube API
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      });
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return (
    <section className="py-8 md:py-12 lg:py-16 xl:py-24 bg-gradient-to-br from-gray-50 via-white to-primary/5">
      <div className="container px-4">
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12 lg:mb-16">
          <p className="text-primary font-semibold text-sm md:text-base lg:text-lg mb-2 md:mb-3 tracking-wide">TESTIMONIOS</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-4 lg:mb-6">
            <GradientText>Historias de Transformación</GradientText>
          </h1>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed px-4 md:px-0 max-w-3xl mx-auto">
            Conoce las experiencias reales de quienes han encontrado esperanza y transformación
            a través de nuestro acompañamiento. Sus historias son testimonio del poder del amor y la fe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 xl:gap-10 justify-items-center max-w-7xl mx-auto px-2 md:px-0">
          {reviews.map((review) => (
            <div key={review.key} className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-sm xl:max-w-sm">
              <Review review={review} />
            </div>
          ))}
        </div>
        
        <div className="mt-8 md:mt-12 lg:mt-16 mb-6 md:mb-8 lg:mb-12 text-center">
          <div className="inline-flex items-center justify-center space-x-2 bg-primary/10 px-4 md:px-6 py-2.5 md:py-3 rounded-full ring-1 ring-primary/20 relative z-10">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-primary font-medium text-sm md:text-base">Transformando vidas con amor y esperanza</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
