// hooks/useAuth.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import api, { getAccessToken, setAccessToken } from "@/app/api/lib/api";
import api from "@/app/api/lib/api";
import { saveAuth, useAuthStore } from "@/app/store/auth";
import type { LoginResponse, RegisterResponse, User } from "@/types/auth";
import { getAccessToken, setAccessToken } from "@/app/api/lib/token";
import { setUserRole } from "@/app/api/lib/role";
import { useEffect, useState } from "react";
import { AuthUser, getStoredUser } from "@/app/store/auth";
import axios from "axios";
import toast from "react-hot-toast";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
    retry: false,
    enabled: true, // allow fetch when token exists
  });
}

// export function useLogin() {
//   const setUser = useAuthStore((s) => s.setUser);

//   return useMutation({
//     mutationFn: async (payload: { email: string; password: string }) => {
//       const response = await api.post("/auth/login", payload);
//       return response.data;
//     },
//     onSuccess: (data) => {
//       const token = data?.data?.tokens?.accessToken;
//       const user = data?.data?.user?.role;

//       saveAuth(token, {
//         id: "user_regular_001",
//         email: "alice@example.com",
//         fullName: "Alice Regular",
//         role: "REGULAR",
//       });

//       if (!token) {
//         console.error("No token returned from backend");
//         return;
//       }

//       // SAVE TOKEN CORRECTLY
//       setAccessToken(token);
//       setUserRole(user);
//       // SAVE USER
//       setUser(user);
//     },
//     onError: (err) => {
//       console.error("Login failed: ", err);
//     },
//   });
// }

/* ---------------- useRegister ---------------- */
export function useRegister() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
      name?: string;
    }) => {
      const { data } = await api.post<RegisterResponse>(
        "/auth/register",
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      const token = data?.accessToken ?? null;
      const user = data?.user ?? null;
      if (token) setAccessToken(token);
      // if (user) setUser(user);
      qc.setQueryData(["me"], user);
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Registratipn failed";

        console.error(" ERROR:", {
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

/* ---------------- useLogout ---------------- */
export function useLogout() {
  const qc = useQueryClient();
  const logoutStore = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post("/auth/logout");
      } catch (err) {
        // ignore server error; still clear local state
      }
    },
    onSuccess: () => {
      // setAccessToken(null);
      logoutStore();

      qc.clear();
    },
  });
}

// ************* useAuth ************
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return user;
};

// *********** Forgot password **************

// export function useForgotPassword() {
//   return useMutation({
//     mutationFn: async (payload: { email: string }) => {
//       const response = await api.post("/auth/forgot-password", payload);
//       return response.data;
//     },

//     onSuccess: (data) => {
//       // toast.success("Send to your mail");
//     },

//     onError: (error: unknown) => {
//       if (axios.isAxiosError(error)) {
//         const message =
//           error.response?.data?.message ||
//           error.response?.data?.error ||
//           "failed";

//         console.error("ERROR:", {
//           status: error.response?.status,
//           message,
//           data: error.response?.data,
//         });
//       } else {
//         console.error("Unexpected error:", error);
//       }
//     },
//   });
// }

interface ForgotPasswordPayload {
  email: string;
}

const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const response = await api.post("/auth/forgot-password", payload);
  return response.data;
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
  });
};
