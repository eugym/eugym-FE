// hooks/useRegister.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/app/api/lib/api";
// import { setAccessToken, setRefreshToken } from "@/app/api/lib/token";
import { useAuthStore } from "@/app/store/auth";
import toast from "react-hot-toast";
// import { RegisterInput, RegisterResponse } from "@/types/auth";

export const useRegister = () => {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  //   // types/auth.ts
  //  type UserRole = "COMPANY" | "MANUFACTURER" | "OTHER"; // adjust roles if needed

  interface User {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }

  interface RegisterInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
  }

  interface RegisterResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
  }

  const mutation = useMutation<RegisterResponse, any, RegisterInput>({
    mutationFn: async (payload) => {
      const { data } = await api.post<RegisterResponse>(
        "/auth/register",
        payload
      );
      return data;
    },
    onSuccess: ({ user, accessToken, refreshToken }) => {
      // 1️⃣ Store tokens
      //   setAccessToken(accessToken);
      //   setRefreshToken(refreshToken);

      // 2️⃣ Set user in Zustand
      setUser(user as any);

      // 3️⃣ Hydrate /me query
      qc.setQueryData<User>(["me"], user);

      toast.success("Registration Successful");
    },
    onError: (err: any) => {
      console.error("Registration failed:", err);
      toast.error(err?.response?.data?.message || "Registration failed");
    },
  });

  return mutation;
};

// hooks/useRegister.ts
// hooks/useLogout.ts
