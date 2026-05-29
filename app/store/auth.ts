import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "AFFILIATE_PARTNER"
  | "CORPORATE_ADMIN"
  | "TRAINER"
  | "REGULAR"
  | "STANDARD"
  | "PREMIUM"
  | "visitor";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "eugym-user",
      // Only persist user metadata — the auth token stays in the httpOnly cookie
      partialize: (state) => ({ user: state.user }),
    }
  )
);
