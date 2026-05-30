import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiUrl } from "@/app/api/lib/url";

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth_session");

  if (!session?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendRes = await fetch(apiUrl("user/all"), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.value}`,
    },
    cache: "no-store",
  });

  if (!backendRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: backendRes.status }
    );
  }

  const data = await backendRes.json();

  const users: any[] =
    data?.data?.allUser?.users ??
    data?.data?.users ??
    data?.users ??
    data?.data ??
    [];

  // Derive stats from user list
  const byRole: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  for (const u of users) {
    const role = (u.role ?? "unknown").toUpperCase();
    byRole[role] = (byRole[role] ?? 0) + 1;

    const status = u.isActive ? "active" : (u.status ?? "unknown").toLowerCase();
    byStatus[status] = (byStatus[status] ?? 0) + 1;
  }

  const stats = {
    totalUsers:       users.length,
    totalTrainers:    byRole["TRAINER"] ?? 0,
    totalAffiliates:  byRole["AFFILIATE_PARTNER"] ?? 0,
    totalAdmins:      (byRole["ADMIN"] ?? 0) + (byRole["SUPER_ADMIN"] ?? 0),
    totalRegular:     byRole["REGULAR"] ?? 0,
    totalStandard:    byRole["STANDARD"] ?? 0,
    totalPremium:     byRole["PREMIUM"] ?? 0,
    totalCorporate:   byRole["CORPORATE_ADMIN"] ?? 0,
    activeUsers:      byStatus["active"] ?? 0,
    inactiveUsers:    byStatus["inactive"] ?? 0,
    byRole,
    byStatus,
  };

  return NextResponse.json({ data: stats });
}
