import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const url = body.token
    ? `${process.env.NEXT_PUBLIC_API_URL}/auth/login?token=${body.token}`
    : `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

  const backendRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  const token = data?.data?.tokens?.accessToken;
  const user = data?.data?.user;

  if (!token) {
    return NextResponse.json(
      { error: { message: "No token returned from backend" } },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ user, token });
  response.cookies.set("auth_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
