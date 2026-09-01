import { NextRequest, NextResponse } from "next/server";
import {
  extractToken,
  extractUser,
  proxyHeaders,
  respondWithSession,
} from "@/app/api/lib/authSession";

export async function POST(request: NextRequest) {
  const body = await request.json();

  let backendRes: Response;
  try {
    backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: proxyHeaders(request),
      body: JSON.stringify(body),
    });
  } catch {
    // The API is down or unreachable. Say so plainly rather than letting this
    // surface as an opaque 500.
    return NextResponse.json(
      { message: "Can't reach the server. Please try again in a moment." },
      { status: 503 }
    );
  }

  const data = await backendRes.json();

  // Pass validation and conflict errors straight through — the backend's messages
  // and per-field `errors` map are what the form renders.
  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  // Registration signs the user in, so set the same cookies login does.
  const token = extractToken(data);
  const user = extractUser(data);

  if (!token || !user) {
    console.error("[register] no token/user in backend response:", JSON.stringify(data));
    return NextResponse.json(
      { message: "Account created, but sign-in failed. Please log in." },
      { status: 500 }
    );
  }

  return respondWithSession(user, token);
}
