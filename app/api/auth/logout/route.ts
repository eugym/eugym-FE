import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = request.cookies.get("auth_session");

  if (session?.value) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.value}`,
      },
    }).catch(() => {
      // Ignore backend logout failure; client session is cleared regardless
    });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("auth_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
