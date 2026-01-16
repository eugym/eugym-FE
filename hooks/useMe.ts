"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/app/api/lib/api";
import { getAccessToken } from "@/app/api/lib/token";
import { useAuthStore } from "@/app/store/auth";

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery({
    queryKey: ["me"],

    queryFn: async () => {
      const token = getAccessToken();
      if (!token) {
        throw new Error("No access token");
      }

      const res = await api.get("/auth/me");
      return res.data;
    },

    // enabled: typeof window !== "undefined" && !!getAccessToken(),
    enabled: false,
    retry: false,
    staleTime: 1000 * 60 * 30, // ✅ 30 minutes
    gcTime: 1000 * 60 * 60, // ✅ 1 hour
  });

  // ✅ Sync server user → auth store
  useEffect(() => {
    const user = query.data?.data?.user;
    if (user) {
      setUser(user);
    }
  }, [query.data, setUser]);

  return query;
}
