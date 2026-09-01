import { NextRequest, NextResponse } from "next/server";
import {
  extractToken,
  extractUser,
  proxyHeaders,
  respondWithSession,
} from "@/app/api/lib/authSession";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const url = body.token
    ? `${process.env.NEXT_PUBLIC_API_URL}/auth/login?token=${body.token}`
    : `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

  let backendRes: Response;
  try {
    backendRes = await fetch(url, {
      method: "POST",
      headers: proxyHeaders(request),
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json(
      { message: "Can't reach the server. Please try again in a moment." },
      { status: 503 }
    );
  }

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  const token = extractToken(data);
  const user = extractUser(data);

  if (!token || !user) {
    console.error("[login] could not extract token/user from backend:", JSON.stringify(data));
    return NextResponse.json(
      { message: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }

  return respondWithSession(user, token);
}
