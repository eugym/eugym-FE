import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiUrl } from "@/app/api/lib/url";

/**
 * Authenticated pass-through to the backend API.
 *
 * /api/backend/admin/members  →  <NEXT_PUBLIC_API_URL>/admin/members
 *
 * Every dashboard page needs the same three things: read the httpOnly
 * auth_session cookie, attach it as a Bearer token, forward the call. Writing
 * that per resource is how /api/users/all ended up pointing at "user/all" — an
 * endpoint that does not exist — and silently breaking User Management. One
 * route means one place to get it right.
 *
 * The token stays server-side: the browser only ever talks to same-origin
 * /api/backend/*, so there is no CORS and no token in client JS.
 */

const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH"]);

async function forward(request: NextRequest, path: string[]) {
  const session = (await cookies()).get("auth_session");

  if (!session?.value) {
    return NextResponse.json(
      { message: "Your session has expired. Please sign in again.", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  // Preserve query strings (?page=2&status=active)
  const search = request.nextUrl.search;
  const target = apiUrl(path.join("/")) + search;

  const init: RequestInit = {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.value}`,
    },
    cache: "no-store",
  };

  if (METHODS_WITH_BODY.has(request.method)) {
    init.body = await request.text();
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(target, init);
  } catch {
    return NextResponse.json(
      { message: "Can't reach the server. Please try again in a moment.", code: "UNREACHABLE" },
      { status: 503 }
    );
  }

  // Some endpoints (e.g. DELETE) legitimately return an empty body.
  const text = await backendRes.text();
  if (!text) return new NextResponse(null, { status: backendRes.status });

  try {
    return NextResponse.json(JSON.parse(text), { status: backendRes.status });
  } catch {
    return new NextResponse(text, {
      status: backendRes.status,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, { params }: Ctx) {
  return forward(request, (await params).path);
}

export async function POST(request: NextRequest, { params }: Ctx) {
  return forward(request, (await params).path);
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  return forward(request, (await params).path);
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  return forward(request, (await params).path);
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  return forward(request, (await params).path);
}
