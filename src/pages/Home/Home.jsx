import React, { Suspense, lazy } from "react";
import Banner from "features/landing/Banner";
import SEO from "features/landing/SEO";
import LoadingSkeleton from "components/UI/LoadingSkeleton";

// Lazy load components below the fold for better performance
const TransformationStories = lazy(() => import("features/landing/TransformationStories"));
const HappyCustomers = lazy(() => import("features/landing/HappyCustomers"));
const CustomerReviews = lazy(() => import("features/landing/CustomerReviews"));
const Feature = lazy(() => import("features/landing/Feature"));

const Home = () => {
  return (
    <>
      <SEO 
        title="Todo por un Alma - Centro de Rehabilitación y Desintoxicación en Colombia"
        description="Centro especializado en tratamiento de adicciones que combina terapia psicológica profesional con guía espiritual basada en la Palabra de Dios. Transformamos vidas en Bello y Apartadó, Colombia."
        keywords="rehabilitación, desintoxicación, adicciones, centro de rehabilitación, terapia cognitivo conductual, logoterapia, Bello, Apartadó, Colombia, tratamiento adicciones, recuperación, transformación de vidas, centro cristiano"
        url="/"
        type="website"
      />
      <div>
        <Banner />
        <Suspense fallback={<LoadingSkeleton height="h-96" className="mx-auto max-w-7xl" />}>
          <TransformationStories />
        </Suspense>
        <Suspense fallback={<LoadingSkeleton height="h-80" className="mx-auto max-w-5xl" />}>
          <HappyCustomers />
        </Suspense>
        <Suspense fallback={<LoadingSkeleton height="h-96" className="mx-auto max-w-7xl" />}>
          <CustomerReviews />
        </Suspense>
        <Suspense fallback={<LoadingSkeleton height="h-64" className="mx-auto max-w-7xl" />}>
          <Feature />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
