import axios from "axios";
import { getAccessToken } from "./token";
import { isTokenExpired } from "@/app/utilities/isTokenExpired";
import { clearAuth } from "./auth-storage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  if (!config.headers.Authorization) {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* Handle expired token globally */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expired → Logging out");

      clearAuth();

      // Kill all cached queries
      // queryClient.clear();   relaxed

      // Hard redirect (safe even outside React)
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export default api;
