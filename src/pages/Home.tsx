import React, { Suspense } from 'react';
import HeroSection from '../components/home/HeroSection';
import Partners from '../components/home/Partners';
import ClientLogos from '../components/home/ClientLogos';
import ProjectsAndProducts from '../components/home/ProjectsAndProducts';

// Lazy load components below the fold for better performance
const SolutionsOverview = React.lazy(() => import('../components/home/SolutionsOverview'));
const CoreServices = React.lazy(() => import('../components/home/CoreServices'));
const WhyLimitless = React.lazy(() => import('../components/home/WhyLimitless'));
const TestimonialsCarousel = React.lazy(() => import('../components/home/TestimonialsCarousel'));
const Faq = React.lazy(() => import('../components/home/Faq'));
const FinalCta = React.lazy(() => import('../components/home/FinalCta'));

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <Partners />
      <ClientLogos />
      <ProjectsAndProducts />

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <SolutionsOverview />
      </Suspense>

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <CoreServices />
      </Suspense>

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <WhyLimitless />
      </Suspense>

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <TestimonialsCarousel />
      </Suspense>

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Faq />
      </Suspense>

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <FinalCta />
      </Suspense>
    </>
  );
};

export default Home;
