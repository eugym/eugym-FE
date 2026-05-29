"use client";

import { useMutation } from "@tanstack/react-query";

/* ---------------- useRegister ---------------- */
interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await fetch("/api/auth/register", {
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
