import React from 'react';
import { motion } from 'framer-motion';
import ProfessionalCard from '../ui/ProfessionalCard';

interface StatItem {
  number: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

interface InnovativeStatsProps {
  stats: StatItem[];
  title?: string;
  subtitle?: string;
}

const InnovativeStats: React.FC<InnovativeStatsProps> = ({
  stats,
  title,
  subtitle,
}) => {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
            {subtitle && (
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <ProfessionalCard
                variant="premium"
                size="lg"
                hover="lift"
                alignContent="center"
                borderGlow={true}
                className="h-full text-center"
              >
                {stat.icon && (
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-accent to-accent-orange text-white mb-6">
                    {stat.icon}
                  </div>
                )}
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {stat.description}
                </p>
              </ProfessionalCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InnovativeStats;