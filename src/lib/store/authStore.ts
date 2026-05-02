import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@types/index';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: AuthUser | null;
  setCredentials: (token: string, user: AuthUser) => void;
  clearCredentials: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      user: null,
      setCredentials: (token, user) => set({ token, user, isAuthenticated: true }),
      clearCredentials: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'gastito-auth-storage',
    }
  )
);
