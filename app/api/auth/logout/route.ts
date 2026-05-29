import { NextRequest, NextResponse } from "next/server";

const CLEAR = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 0,
};

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
      // Backend logout failure is non-fatal — clear local session regardless
    });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("auth_session", "", CLEAR);
  response.cookies.set("user_info", "", CLEAR);
  return response;
}
