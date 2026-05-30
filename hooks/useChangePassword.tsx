import { useMutation } from "@tanstack/react-query";
import api from "@/app/api/lib/api";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const res = await api.post("/auth/change-password", payload);
      return res.data;
    },
  });
}
