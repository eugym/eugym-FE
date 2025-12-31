import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/app/api/lib/api";
import { removeAccessToken, getAccessToken } from "@/app/api/lib/token";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/app/store/auth";

export function useLogout() {
  // const clearUser = useAuthStore((s) => s.clearUser);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const token = getAccessToken();
      return api.post("/auth/logout", { verificationToken: token });
    },
    onSuccess: () => {
      // setAccessToken(null);
      removeAccessToken();
      queryClient.clear();
      router.push("/auth/login");
      toast.success("logout success");
    },

    onError: (err) => {
      console.error("Logout failed: ", err);
      toast.error(err?.message || "failed");
    },
  });
}
