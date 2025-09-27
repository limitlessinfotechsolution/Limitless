'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

const ClientLogos: React.FC = () => {
  const clients = [
    {
      name: 'TechStart Inc.',
      logo: '/images/clients/techstart-logo.png',
      industry: 'Technology',
      className: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      name: 'InnovateLab',
      logo: '/images/clients/innovatelab-logo.png',
      industry: 'Innovation',
      className: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      name: 'GrowthCorp',
      logo: '/images/clients/growthcorp-logo.png',
      industry: 'Business',
      className: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      name: 'MediCare Solutions',
      logo: '/images/clients/medicare-logo.png',
      industry: 'Healthcare',
      className: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      name: 'FinTech Global',
      logo: '/images/clients/fintech-logo.png',
      industry: 'Finance',
      className: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      name: 'EduTech Academy',
      logo: '/images/clients/edutech-logo.png',
      industry: 'Education',
      className: 'bg-indigo-100 dark:bg-indigo-900/30'
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Trusted by Leading Companies
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who have transformed their businesses with our innovative solutions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`${client.className} w-16 h-16 rounded-lg flex items-center justify-center mb-3 shadow-md`}>
                <Building2 className="w-8 h-8 text-gray-700 dark:text-gray-300" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white mb-1">{client.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{client.industry}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Over 120+ projects delivered across 18+ countries with 5M+ active users.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              View Our Work
            </button>
            <button className="border-2 border-accent text-accent hover:bg-accent hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Become Our Partner
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
