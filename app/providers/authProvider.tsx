"use client";

// AuthProvider is intentionally minimal.
// The dashboard layout (Server Component) handles session validation server-side.
// useMe is only called from hooks that need the in-memory Axios token on public pages.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
