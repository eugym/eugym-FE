"use client";

import { useMe } from "@/hooks/useMe";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#19b24b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
