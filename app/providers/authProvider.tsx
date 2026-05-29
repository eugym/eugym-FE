"use client";

import { useMe } from "@/hooks/useMe";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Fires useMe silently in background to restore session token + Zustand user
  // from the httpOnly cookie. Does NOT block render — the middleware already
  // handles server-side dashboard protection before the page is sent to the client.
  useMe();
  return <>{children}</>;
}
