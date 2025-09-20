import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Limitless Infotech',
  description: 'The page you are looking for does not exist. Return to our homepage or explore our services.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400" />
          </div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off into the digital void.
          Don't worry, let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-600 dark:text-gray-400">Try searching for:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/services"
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-left"
            >
              <div className="font-medium text-gray-900 dark:text-white">Our Services</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Explore what we offer</div>
            </Link>
            <Link
              href="/about"
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-left"
            >
              <div className="font-medium text-gray-900 dark:text-white">About Us</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Learn about our company</div>
            </Link>
            <Link
              href="/portfolio"
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-left"
            >
              <div className="font-medium text-gray-900 dark:text-white">Portfolio</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">View our work</div>
            </Link>
            <Link
              href="/contact"
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-left"
            >
              <div className="font-medium text-gray-900 dark:text-white">Contact</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Get in touch</div>
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Still can't find what you're looking for?
          </p>
          <a
            href="mailto:support@limitlessinfotech.com"
            className="text-accent hover:underline font-medium"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </div>
  );
}
