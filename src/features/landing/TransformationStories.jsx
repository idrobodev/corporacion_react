import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Import images
import carruselUno from 'assets/images/carrusel_home/carrusel_uno.webp';
import carruselDos from 'assets/images/carrusel_home/carrusel_dos.webp';
import carruselTres from 'assets/images/carrusel_home/carrusel_tres.webp';
import carruselCuatro from 'assets/images/carrusel_home/carrusel_cuatro.webp';
import carruselCinco from 'assets/images/carrusel_home/carrusel_cinco.webp';
import carruselSeis from 'assets/images/carrusel_home/carrusel_seis.webp';
import carruselSiete from 'assets/images/carrusel_home/carrusel_siete.webp';
import carruselOcho from 'assets/images/carrusel_home/carrusel_ocho.webp';

const TransformationStories = () => {
  // Estado de carrusel y visibilidad
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(1);

  const stories = [
    {
      id: 1,
      image: carruselUno,
    },
    {
      id: 2,
      image: carruselDos,
    },
    {
      id: 3,
      image: carruselTres,
    },
    {
      id: 4,
      image: carruselCuatro,
    },
    {
      id: 5,
      image: carruselCinco,
    },
    {
      id: 6,
      image: carruselSeis,
    },
    {
      id: 7,
      image: carruselSiete,
    },
    {
      id: 8,
      image: carruselOcho,
    },
  ];

  // Cálculo responsivo de ítems visibles (alineado con breakpoints Tailwind)
  useEffect(() => {
    const computeItems = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 0;
      if (w >= 1024) return 4; // lg
      if (w >= 768) return 3; // md
      if (w >= 640) return 2; // sm
      return 1; // xs
    };

    const update = () => {
      const next = computeItems();
      setItemsPerView(prev => {
        if (prev !== next) {
          // Asegurar que el índice actual no quede fuera de rango al cambiar el layout
          setCurrentSlide((prevSlide) => {
            const maxIndex = Math.max(0, stories.length - next);
            return Math.min(prevSlide, maxIndex);
          });
        }
        return next;
      });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [stories.length]);

  // Auto-advance por intervalo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const maxIndex = Math.max(0, stories.length - itemsPerView);
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [stories.length, itemsPerView]);

  // Intersection Observer para animación de entrada
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('transformation-stories');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const maxIndex = Math.max(0, stories.length - itemsPerView);
      if (prev >= maxIndex) return 0;
      return prev + 1;
    });
  }, [stories.length, itemsPerView]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const maxIndex = Math.max(0, stories.length - itemsPerView);
      if (prev <= 0) return maxIndex;
      return prev - 1;
    });
  }, [stories.length, itemsPerView]);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(stories.length / itemsPerView)), [stories.length, itemsPerView]);
  const activePage = useMemo(() => Math.floor(currentSlide / itemsPerView), [currentSlide, itemsPerView]);

  const goToPage = useCallback((pageIdx) => {
    const target = pageIdx * itemsPerView;
    setCurrentSlide(Math.min(target, Math.max(0, stories.length - itemsPerView)));
  }, [stories.length, itemsPerView]);

  // Helper: padding-top en % según relación de aspecto deseada
  // Todas las imágenes usan formato 4:5
  const aspectRatio = useMemo(() => '4:5', []);
  const ratioToPadding = useCallback((ratio) => {
    const [w, h] = ratio.split(':').map(Number);
    if (!w || !h) return '125%'; // fallback 4:5
    return `${(h / w) * 100}%`;
  }, []);

  // Transform del track basado en el slide actual
  const trackTranslatePercent = useMemo(() => currentSlide * (100 / itemsPerView), [currentSlide, itemsPerView]);

  return (
    <section
      id="transformation-stories"
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-primary/5 overflow-hidden"
    >
      <div className="container mx-auto px-4">

        {/* Carrusel (4 visibles en desktop) */}
        <div
          className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative rounded-3xl overflow-visible">
            {/* Viewport */}
            <div className="overflow-hidden">
              {/* Track */}
              <div
                className="flex -mx-2 transition-transform duration-700 ease-out will-change-transform"
                style={{ transform: `translateX(-${trackTranslatePercent}%)` }}
              >
                {stories.map((story, index) => {
                  return (
                    <div
                      key={story.id}
                      className="flex-none px-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                      aria-hidden={false}
                    >
                      <div className="group relative rounded-2xl overflow-hidden bg-white/30 backdrop-blur-sm ring-1 ring-black/5 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                        {/* Aspect Ratio Wrapper */}
                        <div
                          className="relative w-full"
                          style={{ paddingTop: ratioToPadding(aspectRatio) }}
                        >
                          <img
                            src={story.image}
                            alt="Historia de transformación"
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            width="400"
                            height="500"
                            fetchPriority={index === 0 ? "high" : "auto"}
                          />

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Flechas de navegación */}
            <button
              onClick={prevSlide}
              aria-label="Ver historias anteriores de transformación"
              className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 hover:bg-gray-100 p-2.5 rounded-full shadow-lg ring-1 ring-black/5 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              aria-label="Ver siguientes historias de transformación"
              className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 hover:bg-gray-100 p-2.5 rounded-full shadow-lg ring-1 ring-black/5 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicadores por página */}
            <div className="mt-6 flex items-center justify-center space-x-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  aria-label={`Ir a la página ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === activePage
                      ? 'w-6 bg-primary'
                      : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TransformationStories;
