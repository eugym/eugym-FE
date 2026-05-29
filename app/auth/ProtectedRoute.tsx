"use client";

import { useAuthStore } from "@/app/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMe } from "@/hooks/useMe";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { isLoading } = useMe();
  const [ready, setReady] = useState(false);

  // Wait one tick after useMe settles before deciding to redirect.
  // This prevents a flash-redirect when the session is being restored on refresh.
  useEffect(() => {
    if (!isLoading) setReady(true);
  }, [isLoading]);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/auth/login");
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#19b24b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
