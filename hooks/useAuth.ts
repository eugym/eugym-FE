"use client";

import { useMutation } from "@tanstack/react-query";
import { setSessionToken } from "@/app/api/lib/session";
import { useAuthStore } from "@/app/store/auth";
import type { User } from "@/app/store/auth";

/* ---------------- useRegister ---------------- */
// Mirrors the backend's /auth/register schema exactly. `phone` — not
// `phoneNumber` — is the field name the API expects; sending the wrong one is
// what made every signup fail with a 400.
interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data as { user: User; token: string };
    },
    // Registration signs the user in, so hydrate the session exactly as login does.
    onSuccess: ({ user, token }) => {
      setSessionToken(token);
      setUser(user);
    },
  });
}

/* ---------------- useCompanyRegister ---------------- */
// Corporate sign-up posts to /api/auth/company-register.
//
// NOTE: the backend has no /auth/company-register route yet — corporate
// accounts are currently created by an admin. Until that endpoint exists this
// call returns "Route not found", which the form now surfaces as a real message
// instead of failing silently. Tracked for the backend module.
interface CompanyRegisterPayload {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export function useCompanyRegister() {
  return useMutation({
    mutationFn: async (payload: CompanyRegisterPayload) => {
      const response = await fetch("/api/auth/company-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    },
  });
}

/* ---------------- useForgotPassword ---------------- */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    },
  });
}
