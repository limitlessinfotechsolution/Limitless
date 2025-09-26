'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
  triggerPoint?: number; // 0-1, how far through the viewport trigger the effect
}

const ParallaxCard: React.FC<ParallaxCardProps> = ({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
  triggerPoint = 0.5
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const { scrollY } = useScroll();

  const y = useTransform(
    scrollY,
    [elementTop - clientHeight * triggerPoint, elementTop + clientHeight * (1 - triggerPoint)],
    direction === 'up' 
      ? [clientHeight * speed, -clientHeight * speed] 
      : [-clientHeight * speed, clientHeight * speed]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setElementTop(rect.top + scrollTop);
      setClientHeight(window.innerHeight);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxCard;