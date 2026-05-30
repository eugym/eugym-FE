import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("auth_session");
  const userInfo = request.cookies.get("user_info");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && (!session?.value || !userInfo?.value)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
