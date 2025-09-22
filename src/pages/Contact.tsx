import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

import CardEnhanced from '../components/ui/Card-enhanced';
import InteractiveParticleBackground from '../components/ui/InteractiveParticleBackground';
import GeneralInquiryForm from '../components/contact/GeneralInquiryForm';
import AdvancedClientForm from '../components/contact/AdvancedClientForm';
import LiveChatWidget from '../components/contact/LiveChatWidget';
import FAQPreviewSection from '../components/contact/FAQPreviewSection';
import VirtualTour from '../components/contact/VirtualTour';
import SocialMediaIntegration from '../components/contact/SocialMediaIntegration';
import { useContactBehaviorTracking } from '../hooks/useContactBehaviorTracking';
import { usePersonalization } from '../hooks/usePersonalization';

const Contact: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inquiry' | 'project'>('inquiry');
  const { trackTabSwitch } = useContactBehaviorTracking();
  const personalizationHook = usePersonalization();
  const { personalizedContent, trackInterest } = personalizationHook || {};
  
  // Default content as fallback
  const defaultContent = {
    headline: "Let's Connect",
    subheading: "Whether you have a question or are ready to start a project, we're here to help.",
    ctaText: "Get Started",
    recommendedServices: []
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#get-started') {
      setActiveTab('project');
      if (trackInterest) {
        trackInterest('project');
      }
    }
  }, [trackInterest]);

  const handleTabChange = (tab: 'inquiry' | 'project') => {
    setActiveTab(tab);
    if (trackTabSwitch) {
      trackTabSwitch(tab);
    }
    if (trackInterest) {
      trackInterest(tab);
    }
  };

  // Use default content if personalizedContent is not available
  const content = personalizedContent || defaultContent;

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
          isFixed={true}
        />
        
        {/* Animated Geometric Shapes */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-accent-orange/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {content.headline}
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {content.subheading}
          </motion.p>
          
          {/* Enhanced CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          >
            <button 
              className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent/25 min-w-[200px]"
              onClick={() => {
                if (trackInterest) {
                  trackInterest('project');
                }
                setActiveTab('project');
              }}
            >
              {content.ctaText}
            </button>
            <button 
              className="border-2 border-accent text-accent hover:bg-accent hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 min-w-[200px]"
              onClick={() => {
                if (trackInterest) {
                  trackInterest('consultation');
                }
              }}
            >
              Schedule a Call
            </button>
          </motion.div>
        </motion.div>
      </header>
      
      {/* FAQ Preview Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="container-custom">
          <FAQPreviewSection />
        </div>
      </section>

      <div className="section-padding bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
            {/* Contact Info - Enhanced card design */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <motion.h2 
                className="text-3xl font-bold mb-6 bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Contact Information
              </motion.h2>
              <motion.p 
                className="text-gray-600 dark:text-gray-300 mb-8 text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {content.recommendedServices && content.recommendedServices.length > 0 
                  ? `We see you're interested in ${content.recommendedServices.join(' and ')}. Let's discuss how we can help with your project.`
                  : 'Fill out the form and our team will get back to you within 24 hours.'}
              </motion.p>
              
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <CardEnhanced 
                  variant="elevated" 
                  hover="lift" 
                  className="p-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-accent/20 to-accent-orange/20 p-3 rounded-full transition-all duration-300 group-hover:from-accent/30 group-hover:to-accent-orange/30 flex-shrink-0">
                      <Phone className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                      <a href="tel:+917710909492" className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors truncate block">
                        +91 7710909492
                      </a>
                    </div>
                  </div>
                </CardEnhanced>
                
                <CardEnhanced 
                  variant="elevated" 
                  hover="lift" 
                  className="p-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-accent/20 to-accent-orange/20 p-3 rounded-full transition-all duration-300 group-hover:from-accent/30 group-hover:to-accent-orange/30 flex-shrink-0">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                      <a href="mailto:Info@limitlessinfotech.com" className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors truncate block">
                        Info@limitlessinfotech.com
                      </a>
                    </div>
                  </div>
                </CardEnhanced>
                
                <CardEnhanced 
                  variant="elevated" 
                  hover="lift" 
                  className="p-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-accent/20 to-accent-orange/20 p-3 rounded-full mt-1 transition-all duration-300 group-hover:from-accent/30 group-hover:to-accent-orange/30 flex-shrink-0">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Office</h3>
                      <div className="text-gray-600 dark:text-gray-300">
                        <p className="truncate">123 Business Park,</p>
                        <p className="truncate">Mumbai, Maharashtra, India</p>
                      </div>
                    </div>
                  </div>
                </CardEnhanced>
              </motion.div>

              {/* Virtual Tour - Enhanced card design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10"
              >
                <VirtualTour />
              </motion.div>
            </motion.div>

            {/* Forms - Enhanced card design */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <CardEnhanced 
                variant='elevated' 
                hover='lift' 
                className="p-4 sm:p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
              >
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 rounded-t-lg overflow-hidden">
                  <button
                    onClick={() => handleTabChange('inquiry')}
                    className={`flex-1 py-4 font-semibold transition-colors relative text-center ${activeTab === 'inquiry' ? 'text-accent bg-white dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'}`}
                  >
                    General Inquiry
                    {activeTab === 'inquiry' && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                        layoutId="tabIndicator"
                      />
                    )}
                  </button>
                  <button
                    id="get-started"
                    onClick={() => handleTabChange('project')}
                    className={`flex-1 py-4 font-semibold transition-colors relative text-center ${activeTab === 'project' ? 'text-accent bg-white dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'}`}
                  >
                    Start a Project
                    {activeTab === 'project' && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                        layoutId="tabIndicator"
                      />
                    )}
                  </button>
                </div>

                {activeTab === 'inquiry' ? <GeneralInquiryForm /> : <AdvancedClientForm />}
              </CardEnhanced>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Social Media Integration - Enhanced card design */}
      <section className="section-padding bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="container-custom">
          <CardEnhanced 
            variant="elevated" 
            alignContent="center"
            className="p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
          >
            <SocialMediaIntegration />
          </CardEnhanced>
        </div>
      </section>

      {/* Live Chat Widget */}
      <LiveChatWidget />
    </div>
  );
};

export default Contact;