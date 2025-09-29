'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LoginGateProps {
  children?: React.ReactNode;
}

const LoginGate: React.FC<LoginGateProps> = ({ children }) => {
  const { isAuthenticated, profile, isLoading, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isAdminAuthenticated = isAuthenticated && (profile?.role === 'admin' || profile?.role === 'super_admin');

  useEffect(() => {
    if (isAuthenticated && profile && !isAdminAuthenticated) {
      logout();
      setError('Access denied. Admin privileges required.');
    }
  }, [isAuthenticated, profile, isAdminAuthenticated, logout]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || 'Login failed');
    } else if (profile && profile.role !== 'admin' && profile.role !== 'super_admin') {
      setError('Access denied. Admin privileges required.');
      await logout();
    }

    setIsLoggingIn(false);
  };



  const handleLogout = async () => {
    await logout();
    setEmail('');
    setPassword('');
    setError('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5 p-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Access
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* Login Form */}
          <motion.form
            onSubmit={handleLogin}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Email Field */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base"
                  placeholder="admin@limitlessinfotech.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm mb-4 sm:mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{error}</span>
              </motion.div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-accent text-white py-3 px-4 rounded-lg font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-base"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Access Admin Panel</span>
                </>
              )}
            </button>




          </motion.form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Logout"
      >
        <Lock className="w-5 h-5" />
      </motion.button>

      {children}
    </div>
  );
};

export default LoginGate;
