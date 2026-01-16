// "use client";
// import { ReactNode, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useMe } from "@/hooks/useMe";
// import { getAccessToken, clearAccessToken } from "@/app/api/lib/token";

// export default function ProtectedRoute({ children }: { children: ReactNode }) {
//   const router = useRouter();

//   // Force client-only token read
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     setToken(getAccessToken());
//   }, []);

//   const { isLoading, isError, isFetched } = useMe({
//     enabled: !!token,
//     queryKey: ["me"], // proper query key
//   });

//   // Handle redirect / logout
//   useEffect(() => {
//     if (token === null) return; // still initializing

//     if (!token) {
//       router.replace("/auth/login");
//       return;
//     }

//     if (isFetched && isError) {
//       clearAccessToken();
//       router.replace("/auth/login");
//     }
//   }, [token, isFetched, isError, router]);

//   // if (!token || isLoading) return <div>Checking authentication...</div>;

//   return <>{children}</>;
// }

// ******** new *******

// "use client";

// import { useAuthStore } from "@/app/store/auth";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function ProtectedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const user = useAuthStore((s) => s.user);
//   const router = useRouter();

//   useEffect(() => {
//     if (!user) {
//       router.replace("auth/login");
//     }
//   }, [user]);

//   if (!user) return null;

//   return <>{children}</>;
// }

"use client";

import { useAuthStore } from "@/app/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAccessToken } from "@/app/api/lib/token";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const hasToken = typeof window !== "undefined" && !!getAccessToken();

  // console.log("hasToken right?", hasToken);
  // console.log("hasToken user?", user);

  useEffect(() => {
    if (!hasToken) {
      router.replace("/auth/login");
    }
  }, [hasToken]);

  // if (hasToken && !user) {
  //   return <div>Loading...</div>;
  // }

  // if (!user) return null;

  return <>{children}</>;
}
