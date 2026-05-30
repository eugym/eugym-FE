"use client";

import { useMutation } from "@tanstack/react-query";
import { setSessionToken } from "@/app/api/lib/session";
import { useAuthStore } from "@/app/store/auth";
import type { User } from "@/app/store/auth";

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
      token?: string | null;
    }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data as { user: User; token: string };
    },
    onSuccess: ({ user, token }) => {
      setSessionToken(token);
      setUser(user);
    },
  });
}
