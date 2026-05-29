"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearSessionToken } from "@/app/api/lib/session";
import { useAuthStore } from "@/app/store/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useLogout() {
  const clearUser = useAuthStore((s) => s.clearUser);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      clearSessionToken();
      clearUser();
      queryClient.clear();
      router.push("/auth/login");
      toast.success("Logged out successfully");
    },
    onError: () => {
      clearSessionToken();
      clearUser();
      queryClient.clear();
      router.push("/auth/login");
    },
  });
}
