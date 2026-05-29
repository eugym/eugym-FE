import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell from "./components/DashboardShell";
import type { User } from "@/app/store/auth";

function parseUserCookie(raw: string): User | null {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.id || !parsed?.role) return null;
    return parsed as User;
  } catch {
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("auth_session");
  const userCookie = cookieStore.get("user_info");

  // No token → definitely not authenticated
  if (!sessionCookie?.value) {
    redirect("/auth/login");
  }

  // Parse user from the cookie set at login — no backend call needed
  const user = userCookie?.value ? parseUserCookie(userCookie.value) : null;

  if (!user) {
    // user_info cookie missing or corrupted — treat as expired session
    redirect("/auth/login");
  }

  return (
    <DashboardShell user={user} token={sessionCookie.value}>
      {children}
    </DashboardShell>
  );
}
