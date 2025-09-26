import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import ProfessionalCard from '../ui/ProfessionalCard';
import InnovativeBackground from '../ui/InnovativeBackground';
import { UI_CONFIG } from '../../config/uiConfig';

interface ProfessionalHeroProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const ProfessionalHero: React.FC<ProfessionalHeroProps> = ({
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
}) => {
  return (
    <motion.section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${UI_CONFIG.colors.background.light}, ${UI_CONFIG.colors.accent}05)`
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Enhanced Aurora Background */}
      <InnovativeBackground
        variant="aurora"
        intensity="medium"
        speed="slow"
        className="absolute inset-0"
      />
      
      {/* Floating Icons with Enhanced Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-accent/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          >
            {i % 4 === 0 ? <Icons.Code className="w-8 h-8" /> : 
             i % 4 === 1 ? <Icons.Globe className="w-8 h-8" /> : 
             i % 4 === 2 ? <Icons.Zap className="w-8 h-8" /> : 
             <Icons.Cpu className="w-8 h-8" />}
          </motion.div>
        ))}
      </div>

      {/* Geometric Shapes for Premium Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-orange/5 blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-accent/20 to-accent-orange/20 text-accent rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 backdrop-blur-sm border border-accent/30 shadow-lg"
          >
            <Icons.Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent-orange animate-pulse" />
            <span>Professional & Innovative Solutions</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent">
              {title}
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              {subtitle}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent mb-6 sm:mb-8"
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mt-10"
          >
            <ProfessionalCard
              variant="premium"
              size="lg"
              hover="lift"
              alignContent="center"
              borderGlow={true}
              className="shadow-2xl bg-gradient-to-r from-accent to-accent-orange text-white border-0 rounded-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer"
              animated={false}
            >
              <a 
                href={ctaLink} 
                className="inline-flex items-center px-8 py-4 text-lg sm:text-xl font-bold"
              >
                {ctaText}
                <Icons.ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </ProfessionalCard>
            
            {secondaryCtaText && secondaryCtaLink && (
              <ProfessionalCard
                variant="glass"
                size="lg"
                hover="subtle"
                alignContent="center"
                className="border-2 border-accent/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                animated={false}
              >
                <a 
                  href={secondaryCtaLink} 
                  className="inline-flex items-center px-8 py-4 text-lg sm:text-xl font-bold text-gray-900 dark:text-white"
                >
                  {secondaryCtaText}
                </a>
              </ProfessionalCard>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Enhanced Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-accent"
        >
          <span className="text-sm mb-3 font-medium hidden sm:block">Explore Our Solutions</span>
          <div className="flex flex-col items-center">
            <Icons.ChevronDown className="w-6 h-6 animate-bounce" />
            <div className="w-1 h-16 bg-gradient-to-b from-accent to-transparent rounded-full mt-2"></div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default ProfessionalHero;