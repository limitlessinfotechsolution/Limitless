import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Building, User, Star } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Testimonial } from '../../types';

import StarRating from '../ui/StarRating';
import SkeletonLoader from '../ui/SkeletonLoader';
import LazyImage from '../ui/LazyImage';
import CardEnhanced from '../ui/CardEnhanced';

const TestimonialsCarousel: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('id');
      
      if (data) {
        setTestimonials(data as Testimonial[]);
      }
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  const nextTestimonial = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (testimonials.length > 1 && !isPaused) {
      timerRef.current = setInterval(nextTestimonial, 5000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [testimonials.length, nextTestimonial, isPaused]);

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <SkeletonLoader width="60%" height="3rem" className="mx-auto mb-4" />
            <SkeletonLoader width="80%" height="1.5rem" className="mx-auto" />
          </div>
          <div className="relative max-w-3xl mx-auto">
            <CardEnhanced variant="elevated" className="p-8 md:p-12 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <SkeletonLoader width="6rem" height="6rem" rounded className="mx-auto mb-6" />
                <SkeletonLoader width="100%" height="1.5rem" className="mb-2" />
                <SkeletonLoader width="90%" height="1.5rem" className="mb-2" />
                <SkeletonLoader width="80%" height="1.5rem" className="mb-6" />
                <SkeletonLoader width="8rem" height="1.5rem" className="mx-auto mb-2" />
                <SkeletonLoader width="6rem" height="1rem" className="mx-auto mb-4" />
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <SkeletonLoader key={i} width="1rem" height="1rem" rounded />
                  ))}
                </div>
              </div>
            </CardEnhanced>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Or a placeholder
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Trusted by Global Partners</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our clients' success stories are the best measure of our own.
          </p>
        </div>
        <div className="relative max-w-3xl mx-auto">
          <CardEnhanced 
            variant="elevated" 
            className="p-8 md:p-12 overflow-hidden min-h-[400px] flex items-center justify-center group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {currentTestimonial.image ? (
                  <LazyImage
                    src={currentTestimonial.image}
                    alt={`${currentTestimonial.name} avatar`}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-accent object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-accent bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <span className="text-2xl font-bold text-accent">
                      {currentTestimonial.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {/* Quote Icon */}
                <div className="flex justify-center mb-4">
                  <Quote className="w-8 h-8 text-accent/30" />
                </div>

                <p className="text-lg italic text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">
                  "{currentTestimonial.content}"
                </p>

                {/* Enhanced testimonial info */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                  {currentTestimonial.image ? (
                    <LazyImage
                      src={currentTestimonial.image}
                      alt={`${currentTestimonial.name} avatar`}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full border-2 border-accent object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full border-2 border-accent bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      <User className="w-8 h-8 text-accent" />
                    </div>
                  )}

                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-900 dark:text-white">{currentTestimonial.name}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      {currentTestimonial.role}
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-accent text-sm font-medium">
                      <Building className="w-3 h-3" />
                      <span>{currentTestimonial.company}</span>
                    </div>
                  </div>
                </div>

                {/* Service and Industry badges */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {currentTestimonial.service && (
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-accent/20 to-accent-orange/20 text-accent text-xs font-medium rounded-full">
                      <Star className="w-3 h-3 mr-1" />
                      {currentTestimonial.service}
                    </span>
                  )}
                  {currentTestimonial.industry && (
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                      {currentTestimonial.industry}
                    </span>
                  )}
                </div>

                <StarRating rating={currentTestimonial.rating} className="justify-center" />
              </motion.div>
            </AnimatePresence>
          </CardEnhanced>
          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 -left-4 md:-left-16 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition hover:shadow-xl"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 -right-4 md:-right-16 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition hover:shadow-xl"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;