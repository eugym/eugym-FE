// hooks/use-auth.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { api } from '@/lib/api-client';
import { User, AuthResponse } from "@/types/auth";
import axios from "axios";

export const AUTH_KEY = ["auth-user"];

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Required for HttpOnly Cookies
});

// Intercept responses to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic to clear local state or redirect if necessary
    }
    return Promise.reject(error);
  }
);

export function useAuth() {
  const queryClient = useQueryClient();

  // Get current user (Check session)
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User | null>({
    queryKey: AUTH_KEY,
    queryFn: async () => {
      try {
        const { data } = await api.get("/auth/me");
        return data;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 10, // Consider user data fresh for 10 mins
    retry: false,
  });

  // Login Mutation
  const login = useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      const { data } = await api.post<AuthResponse>("/auth/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEY, data.user);
    },
  });

  // Logout Mutation
  const logout = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEY, null);
      queryClient.clear(); // Wipe cache for security
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: login.mutateAsync,
    logout: logout.mutateAsync,
    isLoggingIn: login.isPending,
  };
}
