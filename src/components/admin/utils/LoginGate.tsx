'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
<<<<<<< Updated upstream:src/components/admin/LoginGate.tsx
import { useAuth } from '../../hooks/useAuth';
=======
import { supabase } from '../../../lib/supabaseClient';
>>>>>>> Stashed changes:src/components/admin/utils/LoginGate.tsx

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
<<<<<<< Updated upstream:src/components/admin/LoginGate.tsx
    if (isAuthenticated && profile && !isAdminAuthenticated) {
      logout();
      setError('Access denied. Admin privileges required.');
    }
  }, [isAuthenticated, profile, isAdminAuthenticated, logout]);
=======
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        if (!supabase) {
          setError('Supabase client not initialized');
          setIsLoading(false);
          return;
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if user has admin role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role === 'admin' || profile?.role === 'super_admin') {
            setIsAuthenticated(true);
          } else {
            if (supabase && supabase.auth) {
              await supabase.auth.signOut();
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase && supabase.auth ? supabase.auth.onAuthStateChange(async (event, session) => {
      if (!supabase) return;
      
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'admin' || profile?.role === 'super_admin') {
          setIsAuthenticated(true);
        } else {
          if (supabase && supabase.auth) {
            await supabase.auth.signOut();
          }
          setError('Access denied. Admin privileges required.');
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setEmail('');
        setPassword('');
        setError('');
      }
    }) : { data: { subscription: { unsubscribe: () => {} } } };

    return () => subscription.unsubscribe();
  }, []);
>>>>>>> Stashed changes:src/components/admin/utils/LoginGate.tsx

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

<<<<<<< Updated upstream:src/components/admin/LoginGate.tsx
    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || 'Login failed');
    } else if (profile && profile.role !== 'admin' && profile.role !== 'super_admin') {
      setError('Access denied. Admin privileges required.');
      await logout();
=======
    try {
      if (!supabase) {
        setError('Supabase client not initialized');
        setIsLoggingIn(false);
        return;
      }
      
      // Sign in with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setIsLoggingIn(false);
        return;
      }

      if (data.user) {
        // Check if user has admin role
        if (!supabase) {
          setError('Supabase client not initialized');
          setIsLoggingIn(false);
          return;
        }
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          setError('Failed to verify admin access');
          if (supabase && supabase.auth) {
            await supabase.auth.signOut();
          }
          setIsLoggingIn(false);
          return;
        }

        if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
          setError('Access denied. Admin privileges required.');
          if (supabase && supabase.auth) {
            await supabase.auth.signOut();
          }
          setIsLoggingIn(false);
          return;
        }

        setIsAuthenticated(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Login error:', err);
      setIsLoggingIn(false);
>>>>>>> Stashed changes:src/components/admin/utils/LoginGate.tsx
    }

    setIsLoggingIn(false);
  };



  const handleLogout = async () => {
<<<<<<< Updated upstream:src/components/admin/LoginGate.tsx
    await logout();
    setEmail('');
    setPassword('');
    setError('');
=======
    if (supabase && supabase.auth) {
      await supabase.auth.signOut();
    }
>>>>>>> Stashed changes:src/components/admin/utils/LoginGate.tsx
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="w-30 h-30 sm:w-20 sm:h-20  bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
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
