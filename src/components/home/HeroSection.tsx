import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ParallaxSection from './ParallaxSection';
import InteractiveParticleBackground from '../ui/InteractiveParticleBackground';
import HeroContent from './HeroContent';
import HeroVisual from './HeroVisual';

const HeroSection: React.FC = React.memo(() => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <ParallaxSection className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 via-white to-accent/5 dark:from-gray-900 dark:via-gray-800 dark:to-accent/10 overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, #1A237E 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Interactive Particle Background */}
      <InteractiveParticleBackground
        particleCount={50}
        className="absolute inset-0"
      />

      {/* Floating Elements with Parallax */}
      <motion.div
        className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-accent to-accent-dark rounded-full opacity-20 blur-xl"
        style={{ y: y1 }}
      ></motion.div>
      <motion.div
        className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-accent-orange to-accent rounded-full opacity-30 blur-xl animate-pulse"
        style={{ y: y2 }}
      ></motion.div>
      <motion.div
        className="absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-br from-accent to-accent-orange rounded-full opacity-25 blur-xl"
        style={{ y: y3 }}
      ></motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <HeroContent />

          {/* Visual/Stats */}
          <HeroVisual />
        </div>
      </div>
    </ParallaxSection>
  );
});

export default HeroSection;
