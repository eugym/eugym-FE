import { NextRequest, NextResponse } from "next/server";
import { proxyHeaders } from "@/app/api/lib/authSession";

/**
 * Requests a password-reset link (backend: POST /auth/forgot-password).
 *
 * proxyHeaders matters more here than anywhere else: the backend guards this
 * route with passwordResetLimiter at 3 requests per 15 minutes *per IP*. Every
 * call arrives from the Next server, so without forwarding the caller's address
 * all users share one bucket and three strangers lock out everybody.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  let backendRes: Response;
  try {
    backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: proxyHeaders(request),
        body: JSON.stringify(body),
      }
    );
  } catch {
    return NextResponse.json(
      { message: "Can't reach the server. Please try again in a moment." },
      { status: 503 }
    );
  }

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
