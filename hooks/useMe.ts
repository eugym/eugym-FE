"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { setSessionToken } from "@/app/api/lib/session";
import { useAuthStore } from "@/app/store/auth";
import type { User } from "@/app/store/auth";

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (!response.ok) throw data;
      return data as { user: User; token: string };
    },
    enabled: true,
    retry: false,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (query.data) {
      const { user, token } = query.data;
      setSessionToken(token);
      setUser(user);
    }
  }, [query.data, setUser]);

  return query;
}
