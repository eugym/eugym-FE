// import { create } from "zustand";

// export interface User {
//   id: string;
//   email: string;
//   // role: string;
//   role?: "ADMIN" | "USER" | "MANAGER";
// }

// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   setUser: (user: User | null) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   isAuthenticated: false,

//   setUser: (user) =>
//     set({
//       user,
//       isAuthenticated: !!user,
//     }),

//   logout: () =>
//     set({
//       user: null,
//       isAuthenticated: false,
//     }),
// }));

import { create } from "zustand";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?:
    | "super-admin"
    | "ADMIN"
    | "affiliate"
    | "TRAINER"
    | "REGULAR"
    | "standard"
    | "premium"
    | "visitor";
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// lib/auth-storage.ts
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "AFFILIATE_PARTNER"
    | "CORPORATE_ADMIN"
    | "TRAINER"
    | "REGULAR"
    | "STANDARD"
    | "PREMIUM"
    | "visitor";
}

// const TOKEN_KEY = "accessToken";
const AUTH_KEYS = {
  TOKEN: "access_token",
  USER: "user",
};
export const saveAuth = (token: string, user: AuthUser) => {
  localStorage.setItem(AUTH_KEYS.TOKEN, token);
  localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
};
