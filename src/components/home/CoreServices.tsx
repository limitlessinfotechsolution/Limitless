import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { Service } from '../../types';
import * as Icons from 'lucide-react';
import CardEnhanced from '../ui/Card-enhanced';
import SkeletonLoader from '../ui/SkeletonLoader';

const CoreServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*').order('id').limit(5);
      if (data) {
        setServices(data as Service[]);
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Core Services</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A comprehensive suite of services to power your digital transformation from every angle.
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(5)].map((_, index) => (
              <CardEnhanced key={index} variant="elevated" className="p-8 h-full flex flex-col">
                <div className="flex items-center space-x-4 mb-4">
                  <SkeletonLoader width="3rem" height="3rem" rounded />
                  <SkeletonLoader width="60%" height="1.5rem" />
                </div>
                <SkeletonLoader width="100%" height="1rem" className="mb-2" />
                <SkeletonLoader width="90%" height="1rem" className="mb-2" />
                <SkeletonLoader width="80%" height="1rem" className="mb-6" />
                <SkeletonLoader width="40%" height="1rem" />
              </CardEnhanced>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const Icon = (Icons as any)[service.icon] || Icons.Code;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <CardEnhanced variant="elevated" hover="lift" className="p-8 h-full flex flex-col group border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-accent/20 to-accent-orange/20 rounded-lg transition-all duration-300 group-hover:from-accent/30 group-hover:to-accent-orange/30">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">{service.description}</p>
                    <Link href={`/services#${service.id}`} className="font-medium text-accent hover:text-accent-orange transition-colors mt-auto flex items-center">
                      View Details <span className="ml-1">→</span>
                    </Link>
                  </CardEnhanced>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CoreServices;