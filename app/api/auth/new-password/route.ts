import { NextRequest, NextResponse } from "next/server";
import { proxyHeaders } from "@/app/api/lib/authSession";

/**
 * Consumes a password-reset token and sets the new password.
 *
 * Note the naming: the sibling /api/auth/reset-password route forwards to the
 * backend's *forgot*-password (send me a link), while this one forwards to the
 * backend's reset-password (here is my token and new password). The two halves
 * of the flow are named the other way round on each side of the proxy.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  let backendRes: Response;
  try {
    backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
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
