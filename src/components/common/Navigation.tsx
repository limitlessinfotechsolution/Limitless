'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/ui/useTheme';
import Logo from './Logo';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px, hide navbar
        setIsNavVisible(false);
      } else {
        // Scrolling up, show navbar
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);


  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return Sun;
    if (theme === 'dark') return Moon;
    if (theme === 'system') {
      if (typeof window !== 'undefined') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemDark ? Moon : Sun;
      } else {
        return Sun; // default icon during SSR
      }
    }
    return Sun;
  };

  const ThemeIcon = getThemeIcon();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent" role="navigation" aria-label="Main navigation">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
            <Logo />
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {/* Placeholder for navigation links */}
              <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-18 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }


  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-glass border-b border-white/20 dark:border-gray-800/50 py-2'
        : 'bg-transparent py-4'
    } ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`} role="navigation" aria-label="Main navigation">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop Navigation - Shows on medium screens and up */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group overflow-hidden ${
                  isActivePath(link.path)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {!isActivePath(link.path) && (
                  <span className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full -z-0"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Theme Toggle & CTA */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={() => {
                const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
                setTheme(nextTheme);
              }}
              className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 text-secondary-600 dark:text-secondary-300 transition-all duration-300 theme-toggle focus:ring-2 focus:ring-primary-500"
              aria-label="Cycle theme"
            >
              <ThemeIcon className="w-5 h-5" />
            </button>

            {/* Get Started Button - Hidden on mobile, shown on small screens and up */}
            <Link
              href="/contact#get-started"
              className="hidden sm:inline-flex btn-primary rounded-full shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40"
            >
              Get Started
            </Link>

            {/* Mobile Menu Button - Shown on mobile and small screens */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-600 dark:text-secondary-300 transition-colors focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Shows on mobile and small screens */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden rounded-b-2xl mx-4 mt-2"
            >
              <div className="py-4 px-4 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.path}
                      onClick={handleLinkClick}
                      className={`block px-4 py-3 rounded-xl font-medium transition-all ${
                        isActivePath(link.path)
                          ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:pl-6'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Get Started Button in Mobile Menu */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2"
                >
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/contact#get-started');
                    }}
                    className="block w-full px-4 py-3 mt-2 btn-primary text-center rounded-xl shadow-lg shadow-primary-500/20"
                  >
                    Get Started
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;
