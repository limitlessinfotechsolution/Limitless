import { renderHook } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('should return auth state and functions', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('session');
    expect(result.current).toHaveProperty('profile');
    expect(result.current).toHaveProperty('isAuthenticated');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');

    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('should initialize with loading state when supabase is available', () => {
    // Mock supabase to be available
    jest.mock('../../lib/supabaseClient', () => ({
      supabase: {},
    }));

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should not load when supabase is not available', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });
});
