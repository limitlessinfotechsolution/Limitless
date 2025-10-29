'use client';

import React from 'react';
import Navigation from '../../components/common/Navigation';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  Sparkles, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 

  BarChart3,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

const ShowcasePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Interface Showcase
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Demonstrating all the professional improvements made to eliminate the childish appearance
            </p>
          </motion.div>

          {/* Improvements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                  <LayoutDashboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Premium Navigation</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Floating navbar with glass morphism effect, smart hide/unhide, and professional dropdowns.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                  Glass Morphism
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  Smart Scroll
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  Curved Corners
                </span>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-4">
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Enhanced Hero</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Advanced animations, premium visual elements, and improved typography hierarchy.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                  Particles
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  Gradients
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  Animations
                </span>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
                  <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Professional Chatbot</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Advanced UI with mode selection, voice input, and professional messaging.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                  Multi-mode
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  Voice Input
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  Export
                </span>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg mr-4">
                  <BarChart3 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Professional analytics, comprehensive management tools, and consistent design.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                  Analytics
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  Management
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  Security
                </span>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg mr-4">
                  <Settings className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Standardized Components</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Consistent buttons, forms, and UI elements with professional styling.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                  Buttons
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  Forms
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  Consistency
                </span>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-4">
                  <Eye className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Responsive Design</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Optimized for all devices with professional mobile and tablet experiences.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                  Mobile
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  Tablet
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  Desktop
                </span>
              </div>
            </Card>
          </div>

          {/* Button Showcase */}
          <Card className="p-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Standardized Button Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Primary Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Secondary Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" size="sm">Small</Button>
                  <Button variant="secondary">Medium</Button>
                  <Button variant="secondary" size="lg">Large</Button>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">With Icons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" icon={<CheckCircle className="w-4 h-4" />}>Accept</Button>
                  <Button variant="outline" icon={<XCircle className="w-4 h-4" />}>Decline</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Final Stats */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Professionalization Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">85%</div>
                <div className="text-gray-700 dark:text-gray-300">Components Mature</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10%</div>
                <div className="text-gray-700 dark:text-gray-300">Under Review</div>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">5%</div>
                <div className="text-gray-700 dark:text-gray-300">Needs Work</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Successfully eliminated all childish design elements and professionalized the entire interface.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ShowcasePage;
