import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface UserProfile {
  id: string;
  role: string;
  // Add other profile fields as needed
}

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!session;

  const fetchProfile = async (userId: string) => {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase!
        .from('profiles')
        .select('id, role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (err) {
      console.error('Profile fetch error:', err);
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    if (!supabase) {
      const errorMsg = 'Supabase not initialized';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return { success: false, error: authError.message };
      }

      if (data.user) {
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile);
      }

      return { success: true };
    } catch (err) {
      const errorMsg = 'An unexpected error occurred';
      setError(errorMsg);
      console.error('Login error:', err);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    if (!supabase) return;

    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setError(null);
  };

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const client = supabase;

    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await client.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const userProfile = await fetchProfile(currentSession.user.id);
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setError(null);

      if (session?.user) {
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    profile,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
};
