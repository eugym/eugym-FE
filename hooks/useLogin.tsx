"use client";

import api from "@/app/api/lib/api";
import { setAccessToken } from "@/app/api/lib/token";
import { getStoredUser, saveAuth, useAuthStore } from "@/app/store/auth";
import { useMutation } from "@tanstack/react-query";
import { setUserRole } from "@/app/api/lib/role";

import axios from "axios";
export function useLogin() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const response = await api.post("/auth/login", payload);
      return response.data;
    },

    onSuccess: (data) => {
      const token = data?.data?.tokens?.accessToken;
      const user = data?.data?.user;
      const role = user?.role;

      if (!token) {
        console.error("No token returned from backend");
        return;
      }

      saveAuth(token, user);
      setAccessToken(token);
      setUserRole(role);
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed";

        console.error("LOGIN ERROR:", {
          status: error.response?.status,
          message,
          data: error.response?.data,
        });
      } else {
        console.error("Unexpected error:", error);
      }
    },
  });
}
