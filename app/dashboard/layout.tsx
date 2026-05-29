import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell from "./components/DashboardShell";
import type { User } from "@/app/store/auth";

async function getSessionUser(
  token: string
): Promise<{ user: User | null; error?: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return { user: null, error: `backend returned ${res.status}` };
    const data = await res.json();
    const user = data?.data?.user ?? data?.user ?? null;
    return { user };
  } catch (err) {
    return { user: null, error: String(err) };
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth_session");

  if (!session?.value) {
    redirect("/auth/login");
  }

  const { user } = await getSessionUser(session.value);

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <DashboardShell user={user} token={session.value}>
      {children}
    </DashboardShell>
  );
}
