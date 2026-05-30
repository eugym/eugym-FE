# Auth Redesign — Design Spec
**Date:** 2026-05-29  
**Status:** Approved  
**Scope:** Restructure and secure the eugym authentication system

---

## Background & Motivation

The current auth system has several critical bugs and architectural issues:

1. **Duplicate storage keys** — `token.ts` uses `"accessToken"`, `auth-storage.ts` uses `"access_token"`. Login writes to both; reads can silently miss.
2. **`useMe` permanently disabled** — `enabled: false` means user data is never fetched from the server. Auth relies 100% on unvalidated localStorage reads.
3. **Token in `localStorage`** — Persistent, JS-readable. Unacceptable for an app that handles payments.
4. **Two Zustand auth stores** — `app/api/lib/auth.ts` and `app/store/auth.ts` export `useAuthStore` with different shapes. Import confusion is a latent bug.
5. **Role stored separately** in a distinct `userRole` localStorage key — easy to desync from user data.
6. **`ProtectedRoute` checks token existence only** — no server validation, no expiry check.
7. **SideNav hooks violation** — `usePathname()` is called conditionally inside a mounted check (React rules of hooks violation).
8. **Heavy dead code** — multiple commented-out old implementations remain throughout.

---

## Goals

- Token never stored in `localStorage` or `sessionStorage`
- Session survives page refresh (via httpOnly cookie)
- Role derived from the Zustand user object (single source of truth)
- Server-side route protection via Next.js middleware
- Dead code eliminated; one file per responsibility

---

## Architecture

### Token Lifecycle

```
LOGIN
  Client → POST /api/auth/login (Next.js route handler)
         → Next.js calls backend POST /auth/login
         → Gets { token, user }
         → Sets httpOnly cookie "auth_session" (Secure, SameSite=Strict)
         → Returns { user, token } to client
  Client (useLogin onSuccess):
         → calls setSessionToken(token)  [in-memory module variable — not Web Storage]
         → stores user in Zustand

PAGE REFRESH
  AuthProvider mounts → calls useMe
  useMe → GET /api/auth/me (Next.js route handler)
        → Next.js reads "auth_session" httpOnly cookie
        → Calls backend GET /auth/me with Authorization: Bearer <cookie value>
        → Returns { user, token }
  Client → stores user in Zustand, calls setSessionToken(token)

LOGOUT
  Client → POST /api/auth/logout (Next.js route handler)
         → Next.js clears "auth_session" cookie
  Client → clearUser() in Zustand, clearSessionToken()
         → Redirect to /auth/login

401 RESPONSE (any API call)
  Axios interceptor → clearSessionToken() + clearUser() + redirect to /auth/login
```

### In-Memory Token (Non-Auth API Calls)

Axios needs the token to attach `Authorization: Bearer` headers to calls to the external backend. Since the token cannot be read from the httpOnly cookie in JS, it is kept in a **module-level variable** in `app/api/lib/api.ts`:

```typescript
let _sessionToken: string | null = null;

export const setSessionToken = (token: string) => { _sessionToken = token; };
export const clearSessionToken = () => { _sessionToken = null; };
export const getSessionToken = () => _sessionToken;
```

This is **cleared on page refresh** and **restored silently** by `AuthProvider` → `useMe` reading the httpOnly cookie. The token is never written to any Web Storage API.

---

## File Changes

### New Files

| File | Purpose |
|---|---|
| `app/api/auth/login/route.ts` | Proxy login, set httpOnly cookie |
| `app/api/auth/logout/route.ts` | Clear httpOnly cookie |
| `app/api/auth/me/route.ts` | Read cookie, call backend `/auth/me`, return user |
| `app/api/auth/register/route.ts` | Proxy user registration |
| `app/api/auth/company-register/route.ts` | Proxy company registration |
| `app/api/auth/reset-password/route.ts` | Proxy password reset request |
| `app/api/auth/verify-email/route.ts` | Proxy email verification |

### Modified Files

| File | Change |
|---|---|
| `app/api/lib/api.ts` | Add `setSessionToken` / `clearSessionToken` / `getSessionToken`; Axios interceptor reads `getSessionToken()` instead of localStorage |
| `app/store/auth.ts` | Single `useAuthStore` — `{ user, setUser, clearUser }`; remove `saveAuth`, `getStoredUser`, `AuthUser` export |
| `app/providers/authProvider.tsx` | Call `useMe` unconditionally on mount; show spinner while loading; redirect on error |
| `app/auth/ProtectedRoute.tsx` | Check `useAuthStore` user (not localStorage token) |
| `app/dashboard/layout.tsx` | Pass role from Zustand to SideNav instead of `getUserRole()` |
| `app/dashboard/stats/page.tsx` | Read role from Zustand `user?.role` instead of `getUserRole()` |
| `middleware.ts` | Check `auth_session` cookie; redirect unauthenticated requests to `/dashboard/*` |
| `hooks/useLogin.tsx` | POST to `/api/auth/login`; call `setSessionToken`; store user |
| `hooks/useMe.ts` | GET `/api/auth/me`; `enabled: true`; call `setSessionToken` on success |
| `hooks/useLogout.ts` | POST `/api/auth/logout`; call `clearSessionToken` + `clearUser` |
| `hooks/useRegister.ts` | POST to `/api/auth/register` |
| `components/sideNav/index.tsx` | Move `usePathname()` to top of component (unconditional); use `mounted` only for render guard |

### Deleted Files

| File | Reason |
|---|---|
| `app/api/lib/token.ts` | Replaced by in-memory module variable in `api.ts` |
| `app/api/lib/auth-storage.ts` | localStorage auth storage eliminated |
| `app/api/lib/auth.ts` | Duplicate Zustand store; merged into `app/store/auth.ts` |
| `app/api/lib/role.ts` | Role is now derived from `user?.role` in Zustand |

---

## Auth Store Shape

```typescript
// app/store/auth.ts
export type Role =
  | "SUPER_ADMIN" | "ADMIN" | "AFFILIATE_PARTNER" | "CORPORATE_ADMIN"
  | "TRAINER" | "REGULAR" | "STANDARD" | "PREMIUM" | "visitor";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
```

Role type is also imported by `app/config/navigation.tsx` (currently defines its own — merge these).

---

## Next.js Middleware

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("auth_session");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

---

## httpOnly Cookie Settings

```typescript
// Set in /api/auth/login/route.ts
response.cookies.set("auth_session", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days (or match backend token expiry)
});
```

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| Login fails (wrong credentials) | `toast.error(backend message)`; no cookie set; no Zustand update |
| `useMe` fails (no cookie / expired) | `clearUser()`; if on `/dashboard/*`, middleware redirects to login |
| Any API call returns 401 | Axios interceptor: `clearSessionToken()`, `clearUser()`, hard redirect to `/auth/login` |
| Registration fails | `toast.error(backend message)` |
| Password reset / verify-email fails | `toast.error(backend message)` |

---

## SideNav Hooks Fix

Current violation:
```typescript
const pathname = mounted ? usePathname() : "";  // ❌ conditional hook
```

Fix:
```typescript
const pathname = usePathname();  // ✅ unconditional
// use `mounted` only for rendering guard, not for calling the hook
const navItems = mounted ? NAV_ITEMS_BY_ROLE[role] ?? [] : [];
```

---

## Dead Code

All commented-out legacy implementations are deleted in full. This applies to:
- `app/auth/ProtectedRoute.tsx` (two old implementations commented out)
- `app/providers/authProvider.tsx` (old provider commented out)
- `app/store/auth.ts` (old store shape commented out)
- `app/api/lib/queryClient.tsx` (old QueryClient setup commented out)
- `app/api/lib/initToken.ts` (entire file is commented-out code — deleted)
- `app/dashboard/components/sideNav/index.tsx` (old SideNav commented out)

---

## Out of Scope

- Refresh token support (backend only issues access tokens)
- Proxying non-auth API calls through Next.js (reserved for a future BFF migration)
- UI/UX changes to login, register, or dashboard pages
- New features or routes
