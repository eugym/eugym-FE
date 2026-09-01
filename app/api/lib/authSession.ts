import { NextRequest, NextResponse } from "next/server";

/**
 * Shared between /api/auth/login and /api/auth/register.
 *
 * Both endpoints return the same envelope from the backend and must set the same
 * two cookies, so the extraction and cookie-writing live here — otherwise the two
 * routes drift and one of them quietly stops logging people in.
 */

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

/**
 * Headers for a server-side call to the backend, carrying the browser's address.
 *
 * These routes proxy from the Next.js server, so without this the backend sees
 * the Next server's IP on every request and its per-IP auth rate limit becomes a
 * single global bucket — one user mistyping a password would throttle everyone.
 *
 * The backend runs `app.set('trust proxy', 1)`, so it reads the caller's address
 * from this header rather than the socket.
 */
export function proxyHeaders(request: NextRequest): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const forwarded =
    request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");

  if (forwarded) headers["x-forwarded-for"] = forwarded;

  return headers;
}

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

/** Pull the access token out of whichever shape the backend used. */
export function extractToken(data: any): string | null {
  return (
    data?.data?.tokens?.accessToken ??
    data?.data?.accessToken ??
    data?.tokens?.accessToken ??
    data?.accessToken ??
    data?.token ??
    null
  );
}

/**
 * The backend stores roles as a lowercase Postgres enum (`super_admin`,
 * `affiliate_partner`, …) and returns them verbatim. Every consumer on this
 * side — the `Role` union, `NAV_ITEMS_BY_ROLE`, the `stats/page.tsx` switch —
 * is keyed on SCREAMING_SNAKE. Without this normalisation every role falls
 * through to the default branch and renders "Dashboard unavailable".
 *
 * This is the single choke point: both /api/auth/login and /api/auth/register
 * write the `user_info` cookie through `respondWithSession` below.
 */
function normaliseRole(role: unknown): string {
  return typeof role === "string" && role.length
    ? role.toUpperCase()
    : "VISITOR";
}

/** Pull the user object out and normalise its field names. */
export function extractUser(data: any): SessionUser | null {
  const raw = data?.data?.user ?? data?.user ?? null;
  if (!raw) return null;

  return {
    id: raw.id ?? raw._id ?? "",
    email: raw.email ?? "",
    firstName:
      raw.firstName ?? raw.first_name ?? raw.name?.split(" ")[0] ?? "",
    lastName:
      raw.lastName ??
      raw.last_name ??
      raw.name?.split(" ").slice(1).join(" ") ??
      "",
    role: normaliseRole(raw.role),
  };
}

/**
 * Build the JSON response and attach the session cookies.
 *
 * `auth_session` holds the JWT and `user_info` the user metadata; both are
 * httpOnly so JS cannot read them and the dashboard Server Component can.
 */
export function respondWithSession(user: SessionUser, token: string) {
  const response = NextResponse.json({ user, token });
  response.cookies.set("auth_session", token, COOKIE_OPTS);
  response.cookies.set("user_info", JSON.stringify(user), COOKIE_OPTS);
  return response;
}
