/**
 * Authentication Store (Zustand)
 * 
 * Manages user authentication state across the application
 */

import { create } from 'zustand';

// Module-level guard to prevent multiple simultaneous fetchUser calls
// This persists across component remounts and store updates
let fetchUserCallInProgress = false;
let lastFetchUserCallTime = 0;
const FETCH_USER_CALL_COOLDOWN = 2000; // 2 second cooldown between calls
import { getCurrentUser, login as apiLogin, register as apiRegister, logout as apiLogout, type User } from '@/lib/api/auth';
import { getAuthToken, getRefreshToken, clearAuthTokens } from '@/lib/api/client';
import { track } from '@/components/providers/AnalyticsProvider';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    full_name: string,
    password: string,
    consent_data_processing: boolean,
    consent_marketing: boolean,
    consent_cookies: boolean
  ) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiLogin({ email, password });
          // Token is automatically stored by apiLogin
          await get().fetchUser();
          // Track successful login
          track.login('email');
        } catch (error: any) {
          const errorMessage = error?.data?.detail || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (
        email: string,
        full_name: string,
        password: string,
        consent_data_processing: boolean,
        consent_marketing: boolean,
        consent_cookies: boolean
      ) => {
        set({ isLoading: true, error: null });
        try {
          await apiRegister({
            email,
            full_name,
            password,
            consent_data_processing,
            consent_marketing,
            consent_cookies,
          });
          // Track signup
          track.signup('email');
          // Auto-login after registration
          await get().login(email, password);
        } catch (error: any) {
          const errorMessage = error?.data?.detail || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        apiLogout();
        clearAuthTokens();
        set({ user: null, isAuthenticated: false, error: null });
      },

      fetchUser: async () => {
        const token = getAuthToken();
        const refreshToken = getRefreshToken();
        
        // If no tokens at all, clear state
        if (!token && !refreshToken) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        // Module-level guard to prevent concurrent calls (persists across remounts)
        const now = Date.now();
        if (fetchUserCallInProgress || (now - lastFetchUserCallTime < FETCH_USER_CALL_COOLDOWN)) {
          console.log('[AuthStore] fetchUser call in progress or too soon, skipping');
          return;
        }

        // Prevent concurrent calls at store level too
        const currentState = get();
        if (currentState.isLoading) {
          console.log('[AuthStore] fetchUser already in progress (store level), skipping');
          return;
        }

        fetchUserCallInProgress = true;
        lastFetchUserCallTime = now;
        
        set({ isLoading: true, error: null });
        try {
          console.log('[AuthStore] Calling getCurrentUser');
          const user = await getCurrentUser();
          console.log('[AuthStore] getCurrentUser completed, updating state');
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          // If unauthorized after refresh attempt, clear auth state
          if (error?.status === 401) {
            clearAuthTokens();
            set({ user: null, isAuthenticated: false, isLoading: false });
          } else {
            set({ error: error?.data?.detail || 'Failed to fetch user', isLoading: false });
          }
        } finally {
          fetchUserCallInProgress = false;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    })
);

