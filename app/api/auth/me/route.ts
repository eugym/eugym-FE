import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("auth_session");

  if (!session?.value) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${session.value}`,
      },
    }
  );

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  const user = data?.data?.user ?? data?.user ?? data;

  return NextResponse.json({ user, token: session.value });
}
