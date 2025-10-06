'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, AlertCircle, Shield, Smartphone } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'totp' | 'email'>('totp');
  const [deviceFingerprint] = useState(() => {
    // Generate a simple device fingerprint
    return btoa(navigator.userAgent + Date.now().toString()).substring(0, 32);
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          deviceFingerprint,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setIsLoggingIn(false);
        return;
      }

      if (data.twoFactorRequired) {
        setTwoFactorRequired(true);
        setTwoFactorMethod(data.method);
        setIsLoggingIn(false);
        return;
      }

      // Login successful, redirect to dashboard
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Login error:', err);
      setIsLoggingIn(false);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    try {
      const response = await fetch('/api/admin/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          twoFactorCode,
          deviceFingerprint,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '2FA verification failed');
        setIsLoggingIn(false);
        return;
      }

      // 2FA verification successful, redirect to dashboard
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('2FA verification error:', err);
      setIsLoggingIn(false);
    }
  };

  const handleBackToLogin = () => {
    setTwoFactorRequired(false);
    setTwoFactorCode('');
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
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
        className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Email Field */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              placeholder="admin@limitlessinfotech.com"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
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
            className="w-full bg-accent text-white py-2 sm:py-3 px-4 rounded-lg font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            {isLoggingIn ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Access Admin Panel</span>
              </>
            )}
          </button>

          {/* Demo Credentials */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Demo Credentials:</strong>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Email: admin@limitlessinfotech.com<br />
              Password: Try@Admin123
            </p>
          </div>

          {/* Enterprise Link */}
          <div className="mt-4 text-center">
            <a
              href="/enterprise/login"
              className="text-sm text-accent hover:text-accent-dark dark:text-accent-light dark:hover:text-accent transition-colors"
            >
              Enterprise Suite Login →
            </a>
          </div>
        </motion.form>
    </motion.div>
  );
};

export default AdminLogin;
