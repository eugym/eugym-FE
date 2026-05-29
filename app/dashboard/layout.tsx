import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell from "./components/DashboardShell";
import type { User } from "@/app/store/auth";

async function getSessionUser(
  token: string
): Promise<{ user: User | null }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[DashboardLayout] /auth/me returned", res.status);
      return { user: null };
    }

    const data = await res.json();

    // Handle common backend response shapes
    const user: User | null =
      data?.data?.user ??   // { data: { user: {...} } }
      data?.user ??          // { user: {...} }
      (data?.id ? data : null); // flat user object

    if (!user) {
      console.error("[DashboardLayout] Could not extract user from /auth/me response:", JSON.stringify(data));
    }

    return { user };
  } catch (err) {
    console.error("[DashboardLayout] /auth/me fetch failed:", err);
    return { user: null };
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
