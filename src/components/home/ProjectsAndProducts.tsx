'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CardEnhanced from '../ui/CardEnhanced';
import { AdaptiveContainer, AdaptiveGrid, AdaptiveFlex, AdaptiveText } from '../ui/AdaptiveContainer';

const ProjectsAndProducts: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <AdaptiveContainer>
        <AdaptiveGrid cols={{ xs: 1, lg: 2 }} gap="lg">
          {/* Ongoing Client Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <CardEnhanced 
              variant="elevated" 
              className="h-full p-6 border border-gray-200/50 dark:border-gray-700/50"
            >
              <AdaptiveText size="2xl" weight="bold" className="mb-6 text-gray-900 dark:text-white">
                Ongoing client projects
              </AdaptiveText>
              
              <AdaptiveFlex direction="col" gap="md">
                <AdaptiveFlex 
                  align="center" 
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold mr-4">
                    1
                  </div>
                  <AdaptiveText weight="medium" className="text-gray-900 dark:text-white">
                    IVOLEX
                  </AdaptiveText>
                </AdaptiveFlex>
                
                <AdaptiveFlex 
                  align="center" 
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold mr-4">
                    2
                  </div>
                  <AdaptiveText weight="medium" className="text-gray-900 dark:text-white">
                    Wakilni
                  </AdaptiveText>
                </AdaptiveFlex>
                
                {/* Placeholder for future data */}
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-center">
                  <AdaptiveText className="text-gray-500 dark:text-gray-400 italic">
                    Updating Soon
                  </AdaptiveText>
                </div>
              </AdaptiveFlex>
            </CardEnhanced>
          </motion.div>
          
          {/* Internal Products Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CardEnhanced 
              variant="elevated" 
              className="h-full p-6 border border-gray-200/50 dark:border-gray-700/50"
            >
              <AdaptiveText size="2xl" weight="bold" className="mb-6 text-gray-900 dark:text-white">
                Internal products developed by Limitless Infotech
              </AdaptiveText>
              
              <AdaptiveGrid cols={{ xs: 1, sm: 2 }} gap="md">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <AdaptiveText weight="medium" className="text-gray-900 dark:text-white">
                    TrackIt
                  </AdaptiveText>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <AdaptiveText weight="medium" className="text-gray-900 dark:text-white">
                    WorkTeack
                  </AdaptiveText>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <AdaptiveText weight="medium" className="text-gray-900 dark:text-white">
                    TrackO
                  </AdaptiveText>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <AdaptiveText weight="medium" className="text-gray-900 dark:text-white">
                    IT-TMS
                  </AdaptiveText>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <AdaptiveText weight="medium" className="text-gray-900 dark:text-white">
                    HRIMS
                  </AdaptiveText>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <AdaptiveText weight="medium" className="text-gray-900 dark:text-white">
                    Baseless
                  </AdaptiveText>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <AdaptiveText weight="medium" className="text-gray-900 dark:text-white">
                    MailO
                  </AdaptiveText>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <AdaptiveText weight="medium" className="text-gray-900 dark:text-white">
                    CRM's
                  </AdaptiveText>
                </div>
              </AdaptiveGrid>
              
              {/* Placeholder for future data */}
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-center">
                <AdaptiveText className="text-gray-500 dark:text-gray-400 italic">
                  Updating Soon
                </AdaptiveText>
              </div>
            </CardEnhanced>
          </motion.div>
        </AdaptiveGrid>
      </AdaptiveContainer>
    </section>
  );
};

export default ProjectsAndProducts;