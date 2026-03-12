import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, AuthResponse } from "../types/auth.type";

interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: number | null;
  setAuth: (data: AuthResponse) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      expiresAt: null,

      setAuth: (data) => {
        const expiresAt = data.session
          ? Date.now() + data.session.expires_in * 1000
          : null;
        set({
          user: data.user,
          token: data.session?.access_token || null,
          expiresAt,
        });
      },

      clearAuth: () => {
        set({ user: null, token: null, expiresAt: null });
      },

      isAuthenticated: () => {
        const { token, expiresAt } = get();
        if (!token || !expiresAt) return false;
        return Date.now() < expiresAt;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
