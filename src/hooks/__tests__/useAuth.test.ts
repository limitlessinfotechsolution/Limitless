import { renderHook } from '@testing-library/react';
import { useAuth } from '../useAuth';

const mockUnsubscribe = jest.fn();

jest.mock('../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: mockUnsubscribe,
          },
        },
      })),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signOut: jest.fn(() => Promise.resolve()),
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: { id: 'user1', role: 'admin' }, error: null })),
          })),
        })),
      })),
    },
  },
}));

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
