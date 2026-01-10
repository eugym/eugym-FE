// "use client";

// import { useEffect } from "react";
// import { useMe } from "@/hooks/useMe";
// import { useAuthStore } from "@/app/store/auth";

// export default function AuthProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { data, isSuccess, isError } = useMe();
//   const setUser = useAuthStore((s) => s.setUser);
//   const logout = useAuthStore((s) => s.logout);

//   useEffect(() => {
//     if (isSuccess && data) {
//       setUser(data);
//     }
//     if (isError) {
//       logout();
//     }
//   }, [isSuccess, isError, data, setUser, logout]);

//   return <>{children}</>;
// }

"use client";

import { useMe } from "@/hooks/useMe";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useMe();

  if (isLoading) return <div>Loading...</div>; // optional spinner

  return <>{children}</>;
}
