import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Testimonial } from '../types';
import { Tables } from '../types/supabase';
import Card from '../components/ui/Card';
import CardEnhanced from '../components/ui/Card-enhanced';
import StarRating from '../components/ui/StarRating';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import LazyImage from '../components/ui/LazyImage';
import InteractiveParticleBackground from '../components/ui/InteractiveParticleBackground';

import IndustryServiceFilters from '../components/testimonials/IndustryServiceFilters';
import ReviewSubmission from '../components/testimonials/ReviewSubmission';
import SocialShare from '../components/testimonials/SocialShare';
import { TrendingUp, Award, Users, Star } from 'lucide-react';



type TestimonialRow = Tables<'testimonials'>;

interface EnhancedTestimonial extends Testimonial {
  industry?: string;
  service?: string;
  featured?: boolean;
  created_at?: string;
}

const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    featured: 0
  });
  
  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        setError(error.message);
        console.error('Error fetching testimonials:', error);
      } else if (data) {
        // Use the data as-is since there are no category/tag relationships
        setReviews(data);
        
        // Calculate stats
        const total = data.length;
        const featured = data.filter((t: TestimonialRow) => t.rating >= 5).length;
        const avgRating = total > 0 
          ? data.reduce((sum: number, t: TestimonialRow) => sum + t.rating, 0) / total 
          : 0;
          
        setStats({
          total,
          averageRating: parseFloat(avgRating.toFixed(1)),
          featured
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);





  // Enhanced testimonials with industry and service data
  const enhancedReviews = reviews.map(review => ({
    ...review,
    name: review.name,
    role: review.role,
    company: review.company,
    content: review.content,
    rating: review.rating,
    image: review.image || undefined,
    industry: (review as unknown as EnhancedTestimonial).industry || 'Technology',
    service: (review as unknown as EnhancedTestimonial).service || 'Web Development',
    featured: review.rating >= 5
  }));

  const [filteredReviews, setFilteredReviews] = useState<EnhancedTestimonial[]>(enhancedReviews as EnhancedTestimonial[]);

  useEffect(() => {
    setFilteredReviews(enhancedReviews as EnhancedTestimonial[]);
  }, [reviews]);

  return (
    <div className="pt-20">
      {/* Enhanced Header with Premium Design */}
      <header className="section-padding relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-accent/5 dark:from-gray-900 dark:via-gray-800 dark:to-accent/10">
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
        
        {/* Animated Geometric Shapes */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-accent-orange/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Client Testimonials
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            See what our clients say about working with us. Their success is our success.
          </motion.p>
          
          {/* Enhanced CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          >
            <button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent/25">
              Submit Your Review
            </button>
            <button className="border-2 border-accent text-accent hover:bg-accent hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              View Our Success Stories
            </button>
          </motion.div>
        </motion.div>
      </header>

      {/* Filters and Text Testimonials */}
      <section className="section-padding bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent">
              All Testimonials
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Browse through all our client reviews and success stories
            </p>
          </motion.div>

          {/* Enhanced Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <IndustryServiceFilters
              testimonials={enhancedReviews}
              onFilteredChange={setFilteredReviews}
              className="mb-12"
            />
          </motion.div>

          {/* Filtered Testimonials Grid - Enhanced with better alignment and card design */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="p-8 h-full flex flex-col">
                  <div className="flex items-center space-x-4 mb-4">
                    <SkeletonLoader width="4rem" height="4rem" rounded />
                    <div className="flex-1">
                      <SkeletonLoader width="60%" height="1.5rem" className="mb-2" />
                      <SkeletonLoader width="40%" height="1rem" />
                    </div>
                  </div>
                  <SkeletonLoader width="100%" height="1rem" className="mb-2" />
                  <SkeletonLoader width="90%" height="1rem" className="mb-2" />
                  <SkeletonLoader width="80%" height="1rem" />
                </Card>
              ))}
            </div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-6 rounded-xl max-w-md mx-auto">
                <p className="font-medium">Error loading testimonials</p>
                <p className="mt-2 text-sm">{error}</p>
                <button 
                  onClick={() => fetchTestimonials()}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
            >
              {filteredReviews.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <CardEnhanced 
                    variant='elevated' 
                    hover='lift' 
                    className="p-8 h-full flex flex-col border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 group"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <LazyImage
                          src={testimonial.image || `https://i.pravatar.cc/150?u=${testimonial.id}`}
                          alt={testimonial.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md group-hover:shadow-lg transition-shadow duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-accent to-accent-orange rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}, {testimonial.company}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-gradient-to-r from-accent/20 to-accent-orange/20 text-accent px-2 py-1 rounded-full">
                            {testimonial.industry}
                          </span>
                          <span className="text-xs bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                            {testimonial.service}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic flex-grow mb-4">"{testimonial.content}"</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <StarRating rating={testimonial.rating} />
                      <div className="flex items-center space-x-2">
                        {testimonial.featured && (
                          <span className="text-xs bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded-full flex items-center">
                            ⭐ Featured
                          </span>
                        )}
                        <SocialShare testimonial={testimonial} />
                      </div>
                    </div>
                  </CardEnhanced>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Enhanced Stats Section - Improved alignment and card design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20"
          >
            <CardEnhanced 
              variant='elevated' 
              hover='lift' 
              className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm group"
            >
              <motion.div 
                className="flex justify-center mb-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
              </motion.div>
              <motion.h3 
                className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {stats.total}+
              </motion.h3>
              <p className="text-gray-600 dark:text-gray-300">Total Reviews</p>
            </CardEnhanced>
            
            <CardEnhanced 
              variant='elevated' 
              hover='lift' 
              className="p-6 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200/50 dark:border-yellow-700/50 backdrop-blur-sm group"
            >
              <motion.div 
                className="flex justify-center mb-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400 group-hover:text-yellow-700 dark:group-hover:text-yellow-300 transition-colors" />
              </motion.div>
              <motion.h3 
                className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {stats.averageRating}
              </motion.h3>
              <p className="text-gray-600 dark:text-gray-300">Average Rating</p>
            </CardEnhanced>
            
            <CardEnhanced 
              variant='elevated' 
              hover='lift' 
              className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm group"
            >
              <motion.div 
                className="flex justify-center mb-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Award className="w-8 h-8 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors" />
              </motion.div>
              <motion.h3 
                className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {stats.featured}
              </motion.h3>
              <p className="text-gray-600 dark:text-gray-300">Featured</p>
            </CardEnhanced>
            
            <CardEnhanced 
              variant='elevated' 
              hover='lift' 
              className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm group"
            >
              <motion.div 
                className="flex justify-center mb-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
              </motion.div>
              <motion.h3 
                className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                100%
              </motion.h3>
              <p className="text-gray-600 dark:text-gray-300">Satisfaction</p>
            </CardEnhanced>
          </motion.div>
          
          {/* Enhanced Review Submission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ReviewSubmission
              onSubmit={async (data) => {
                try {
                  const { error } = await supabase.from('testimonials').insert([
                    {
                      ...data,
                      approved: false,
                      industry: (data as unknown as EnhancedTestimonial).industry,
                      service: (data as unknown as EnhancedTestimonial).service,
                      // Note: attachments and projectSnippet are handled in ReviewSubmission component
                    }
                  ]);

                  if (error) {
                    throw new Error(error.message);
                  }
                  
                  // Refresh testimonials after submission
                  fetchTestimonials();
                } catch (err) {
                  alert('Error submitting review: ' + (err instanceof Error ? err.message : 'Unknown error'));
                }
              }}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
