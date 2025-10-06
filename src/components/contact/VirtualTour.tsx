'use client';

import { motion } from 'framer-motion';
import { MapPin, Eye, Navigation } from 'lucide-react';
import LazyImage from '../ui/LazyImage';
import CardEnhanced from '../ui/CardEnhanced';

interface VirtualTourProps {
  className?: string;
}

const VirtualTour: React.FC<VirtualTourProps> = ({ className = '' }) => {
  const locations = [
    {
      id: 'mumbai-office',
      name: 'Mumbai Headquarters',
      address: '123 Business Park, Mumbai, Maharashtra, India',
      description: 'Our main office featuring modern workspaces, collaboration areas, and state-of-the-art technology labs.',
      image: '/images/office-mumbai.jpg',
      virtualTourUrl: 'https://example.com/virtual-tour-mumbai',
      mapUrl: 'https://maps.google.com/?q=123+Business+Park+Mumbai+India'
    }
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header Section */}
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Virtual Office Tour</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Take a virtual tour of our offices or find us on the map
        </p>
      </div>

      {/* Office Locations Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {locations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CardEnhanced 
              variant="elevated" 
              hover="lift" 
              className="h-full border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
            >
              {/* Office Image */}
              <div className="relative rounded-t-2xl overflow-hidden">
                <LazyImage
                  src={location.image}
                  alt={location.name}
                  width={400}
                  height={250}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h4 className="text-xl font-bold text-white">{location.name}</h4>
                </div>
              </div>

              {/* Office Details */}
              <div className="p-6">
                {/* Address */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="mt-1 p-2 bg-accent/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Office Address</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{location.address}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {location.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.a
                    href={location.virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-3 rounded-lg transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Virtual Tour</span>
                  </motion.a>

                  <motion.a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Directions</span>
                  </motion.a>
                </div>
              </div>
            </CardEnhanced>
          </motion.div>
        ))}
      </div>

      {/* Embedded Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CardEnhanced 
          variant="elevated" 
          hover="lift" 
          className="p-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
        >
          <div className="flex items-center mb-6">
            <div className="p-2 bg-accent/10 rounded-lg mr-3">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Find Us on the Map</h4>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1160982328!2d72.74109995473154!3d19.08250200331395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sus!4v1678886472481!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </CardEnhanced>
      </motion.div>
    </div>
  );
};

export default VirtualTour;