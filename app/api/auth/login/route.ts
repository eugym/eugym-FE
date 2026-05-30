import { NextRequest, NextResponse } from "next/server";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

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

  // Normalise across common backend response shapes
  const token =
    data?.data?.tokens?.accessToken ??
    data?.data?.accessToken ??
    data?.tokens?.accessToken ??
    data?.accessToken ??
    data?.token ??
    null;

  const rawUser =
    data?.data?.user ??
    data?.user ??
    null;

  if (!token || !rawUser) {
    console.error("[login] could not extract token/user from backend:", JSON.stringify(data));
    return NextResponse.json(
      { error: { message: "Authentication failed. Please try again." } },
      { status: 500 }
    );
  }

  const user = {
    id: rawUser.id ?? rawUser._id ?? "",
    email: rawUser.email ?? "",
    firstName: rawUser.firstName ?? rawUser.first_name ?? rawUser.name?.split(" ")[0] ?? "",
    lastName: rawUser.lastName ?? rawUser.last_name ?? rawUser.name?.split(" ").slice(1).join(" ") ?? "",
    role: rawUser.role ?? "visitor",
  };

  const response = NextResponse.json({ user, token });

  // auth_session: the JWT — httpOnly so JS cannot read it
  response.cookies.set("auth_session", token, COOKIE_OPTS);

  // user_info: serialised user metadata — httpOnly so the dashboard Server Component
  // can read it on every page load without calling the backend
  response.cookies.set("user_info", JSON.stringify(user), COOKIE_OPTS);

  return response;
}
