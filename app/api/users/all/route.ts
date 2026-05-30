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

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  return NextResponse.json(data);
}
