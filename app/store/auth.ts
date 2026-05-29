import { create } from "zustand";

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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
