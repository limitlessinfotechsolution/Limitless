'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UI_CONFIG } from '../../config/uiConfig';

interface InnovativeBackgroundProps {
  className?: string;
  variant?: 'particles' | 'waves' | 'geometric' | 'gradient' | 'aurora';
  intensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
}

const InnovativeBackground: React.FC<InnovativeBackgroundProps> = ({
  className = '',
  variant = 'particles',
  intensity = 'medium',
  interactive = false,
  speed = 'normal',
}) => {
  const intensitySettings = {
    low: { count: 20, speed: 0.5 },
    medium: { count: 50, speed: 1 },
    high: { count: 100, speed: 1.5 },
  };

  const speedSettings = {
    slow: 0.5,
    normal: 1,
    fast: 1.5,
  };

  const settings = intensitySettings[intensity];
  const speedMultiplier = speedSettings[speed];

  // Create a more sophisticated aurora effect
  const createAuroraEffect = () => {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at center, ${UI_CONFIG.colors.innovative.primary} 0%, transparent 70%)`,
          }}
          animate={{
            background: [
              `radial-gradient(ellipse at 0% 0%, ${UI_CONFIG.colors.innovative.primary} 0%, transparent 70%)`,
              `radial-gradient(ellipse at 100% 100%, ${UI_CONFIG.colors.innovative.secondary} 0%, transparent 70%)`,
              `radial-gradient(ellipse at 50% 100%, ${UI_CONFIG.colors.innovative.accent} 0%, transparent 70%)`,
              `radial-gradient(ellipse at 0% 0%, ${UI_CONFIG.colors.innovative.primary} 0%, transparent 70%)`,
            ],
          }}
          transition={{
            duration: 15 / (settings.speed * speedMultiplier),
            repeat: Infinity,
            ease: UI_CONFIG.animations.professional.smooth,
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, ${UI_CONFIG.colors.innovative.primary}, ${UI_CONFIG.colors.innovative.secondary}, ${UI_CONFIG.colors.innovative.accent}, ${UI_CONFIG.colors.innovative.primary})`,
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 25 / (settings.speed * speedMultiplier),
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    );
  };

  const createInnovativeBackground = () => {
    switch (variant) {
      case 'aurora':
        return createAuroraEffect();

      case 'particles':
        return (
          <div className={`absolute inset-0 overflow-hidden ${className}`}>
            {Array.from({ length: settings.count }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.random() * 50 - 25, 0],
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 8 / (settings.speed * speedMultiplier),
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: UI_CONFIG.animations.professional.smooth,
                }}
              />
            ))}
          </div>
        );

      case 'waves':
        return (
          <div className={`absolute inset-0 ${className}`}>
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at 30% 40%, ${UI_CONFIG.colors.innovative.primary} 0%, transparent 50%),
                            radial-gradient(circle at 70% 60%, ${UI_CONFIG.colors.innovative.secondary} 0%, transparent 50%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20 / (settings.speed * speedMultiplier),
                repeat: Infinity,
                ease: UI_CONFIG.animations.professional.smooth,
              }}
            />
          </div>
        );

      case 'geometric':
        return (
          <div className={`absolute inset-0 overflow-hidden ${className}`}>
            {Array.from({ length: settings.count / 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute border border-indigo-300/30"
                style={{
                  width: `${Math.random() * 200 + 50}px`,
                  height: `${Math.random() * 200 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 15 / (settings.speed * speedMultiplier),
                  repeat: Infinity,
                  delay: Math.random() * 10,
                  ease: UI_CONFIG.animations.professional.bounce,
                }}
              />
            ))}
          </div>
        );

      case 'gradient':
        return (
          <motion.div
            className={`absolute inset-0 ${className}`}
            style={{
              background: UI_CONFIG.colors.professional.gradient,
            }}
            animate={{
              background: [
                UI_CONFIG.colors.professional.gradient,
                'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                UI_CONFIG.colors.professional.gradient,
              ],
            }}
            transition={{
              duration: 10 / (settings.speed * speedMultiplier),
              repeat: Infinity,
              ease: UI_CONFIG.animations.professional.smooth,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative ${interactive ? 'cursor-pointer' : ''}`}>
      {createInnovativeBackground()}
    </div>
  );
};

export default InnovativeBackground;