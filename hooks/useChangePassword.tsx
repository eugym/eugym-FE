import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        payload
      );
      return res.data;
    },
  });
}
