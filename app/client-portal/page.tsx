'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  FileText,
  BarChart3,
  Settings,
  Download,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react';

const ClientPortal: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: 'Project Documentation',
      description: 'Access all project documentation, specifications, and technical details.'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor project progress, milestones, and delivery timelines.'
    },
    {
      icon: Shield,
      title: 'Secure Access',
      description: 'Enterprise-grade security with role-based access control.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Connect with your project team and stakeholders.'
    },
    {
      icon: Download,
      title: 'Resource Downloads',
      description: 'Download project assets, reports, and deliverables.'
    },
    {
      icon: Settings,
      title: 'Account Management',
      description: 'Manage your account settings and preferences.'
    }
  ];

  const quickActions = [
    { label: 'View Projects', href: '/client-portal/projects', icon: FileText },
    { label: 'Download Reports', href: '/client-portal/reports', icon: Download },
    { label: 'Contact Support', href: '/contact', icon: Mail },
    { label: 'Schedule Meeting', href: '/contact', icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent via-accent-dark to-accent-orange text-white py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Client Portal
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Access your projects, track progress, and manage deliverables all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-accent font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-accent transition-colors duration-200"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools and resources to manage your projects effectively.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Common tasks and shortcuts for efficient project management.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Link
                    href={action.href}
                    className="block bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:bg-accent hover:text-white transition-colors duration-200 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="w-8 h-8 text-accent group-hover:text-white" />
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-white">
                      {action.label}
                    </h3>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact us to set up your client portal access and start managing your projects more effectively.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-accent font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Us Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ClientPortal;
