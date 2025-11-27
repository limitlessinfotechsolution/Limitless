'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'Web Development', path: '/services#web' },
      { name: 'Mobile App Development', path: '/services#mobile' },
      { name: 'Custom Software', path: '/services#business' },
      { name: 'CRM Solutions', path: '/services#business' },
      { name: 'AI Integration', path: '/services#ai' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Portfolio', path: '/portfolio' },
      { name: 'Testimonials', path: '/testimonials' },
      { name: 'Contact Us', path: '/contact' },
    ],
    support: [
      { name: 'Documentation', path: '#' },
      { name: 'Help Centre', path: '/faq' },
      { name: 'Privacy Policy', path: '#' },
      { name: 'Terms of Service', path: '#' },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-secondary-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <Logo />
            </div>
            <p className="text-secondary-300 mb-8 text-sm leading-relaxed">
              Empowering businesses with technology that is secure, unique, and limitless. 
              We deliver end-to-end digital solutions that transform operations and drive growth.
            </p>
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 rounded-lg bg-secondary-800 group-hover:bg-primary-600 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-primary-400 group-hover:text-white" />
                </div>
                <a href="mailto:Info@limitlessinfotech.com" className="text-secondary-300 group-hover:text-white transition-colors">
                  Info@limitlessinfotech.com
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 rounded-lg bg-secondary-800 group-hover:bg-primary-600 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-primary-400 group-hover:text-white" />
                </div>
                <a href="tel:+917710909492" className="text-secondary-300 group-hover:text-white transition-colors">
                  +91 7710909492
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 rounded-lg bg-secondary-800 group-hover:bg-primary-600 transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-primary-400 group-hover:text-white" />
                </div>
                <span className="text-secondary-300 group-hover:text-white transition-colors">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-6 text-white flex items-center">
              <span className="w-8 h-1 bg-primary-500 rounded-full mr-3"></span>
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-secondary-300 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-6 text-white flex items-center">
              <span className="w-8 h-1 bg-primary-500 rounded-full mr-3"></span>
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-secondary-300 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-6 text-white flex items-center">
              <span className="w-8 h-1 bg-primary-500 rounded-full mr-3"></span>
              Support
            </h3>
            <ul className="space-y-3 mb-8">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-secondary-300 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Social Links */}
            <div>
              <h4 className="text-sm font-medium mb-4 text-secondary-300">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 text-secondary-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-primary-500/30"
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-secondary-400">
              © {currentYear} Limitless Infotech Solution. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-secondary-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-secondary-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-secondary-400 hover:text-primary-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
