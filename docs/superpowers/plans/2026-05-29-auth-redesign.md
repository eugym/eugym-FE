# Auth Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace localStorage-based token storage with httpOnly cookies + in-memory session variable, fix all structural auth bugs, and eliminate dead code.

**Architecture:** Next.js App Router route handlers at `/api/auth/*` act as a secure proxy to the external backend — they set/clear an httpOnly cookie called `auth_session`. The Axios instance reads from a JS module-level variable (`_sessionToken`) that is populated on login and on every page load via `useMe`. Zustand holds only the user object; the role comes from `user.role`.

**Tech Stack:** Next.js 16 App Router, React 19, Zustand 5, TanStack Query v5, Axios, TypeScript

---

## File Map

| Action | File |
|---|---|
| **Create** | `app/api/lib/session.ts` |
| **Create** | `middleware.ts` |
| **Create** | `app/api/auth/login/route.ts` |
| **Create** | `app/api/auth/logout/route.ts` |
| **Create** | `app/api/auth/me/route.ts` |
| **Create** | `app/api/auth/register/route.ts` |
| **Create** | `app/api/auth/company-register/route.ts` |
| **Create** | `app/api/auth/reset-password/route.ts` |
| **Create** | `app/api/auth/verify-email/route.ts` |
| **Rewrite** | `app/store/auth.ts` |
| **Rewrite** | `app/api/lib/api.ts` |
| **Rewrite** | `app/providers/authProvider.tsx` |
| **Rewrite** | `app/auth/ProtectedRoute.tsx` |
| **Rewrite** | `hooks/useLogin.tsx` |
| **Rewrite** | `hooks/useMe.ts` |
| **Rewrite** | `hooks/useLogout.ts` |
| **Rewrite** | `hooks/useAuth.ts` |
| **Update** | `app/config/navigation.tsx` |
| **Update** | `app/dashboard/layout.tsx` |
| **Update** | `app/dashboard/stats/page.tsx` |
| **Update** | `app/dashboard/components/sideNav/index.tsx` |
| **Update** | `app/auth/login/LoginForm.tsx` |
| **Update** | `app/auth/verify-email/verifyEmail.tsx` |
| **Update** | `app/api/lib/queryClient.tsx` |
| **Delete** | `app/api/lib/token.ts` |
| **Delete** | `app/api/lib/auth-storage.ts` |
| **Delete** | `app/api/lib/auth.ts` |
| **Delete** | `app/api/lib/role.ts` |
| **Delete** | `app/api/lib/initToken.ts` |
| **Delete** | `hooks/userAuth.ts` |
| **Delete** | `hooks/useRegister.ts` |

---

## Task 1: Auth Store + Session Token Module

**Files:**
- Rewrite: `app/store/auth.ts`
- Create: `app/api/lib/session.ts`
- Update: `app/config/navigation.tsx` (import Role from store)

- [ ] **Step 1: Rewrite `app/store/auth.ts`**

Replace the entire file content with:

```typescript
import { create } from "zustand";

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "AFFILIATE_PARTNER"
  | "CORPORATE_ADMIN"
  | "TRAINER"
  | "REGULAR"
  | "STANDARD"
  | "PREMIUM"
  | "visitor";

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

- [ ] **Step 2: Create `app/api/lib/session.ts`**

```typescript
let _token: string | null = null;

export const setSessionToken = (token: string) => {
  _token = token;
};

export const clearSessionToken = () => {
  _token = null;
};

export const getSessionToken = () => _token;
```

- [ ] **Step 3: Update `app/config/navigation.tsx` — import Role from store**

Replace the inline Role type definition:

```typescript
// Remove this:
export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "AFFILIATE_PARTNER"
  | "CORPORATE_ADMIN"
  | "TRAINER"
  | "REGULAR"
  | "STANDARD"
  | "PREMIUM"
  | "visitor";
```

With an import at the top of the file (after existing imports):

```typescript
import type { Role } from "@/app/store/auth";
export type { Role };
```

The rest of the file (`NavItem`, `NAV_ITEMS_BY_ROLE`) stays exactly the same.

- [ ] **Step 4: Commit**

```bash
git add app/store/auth.ts app/api/lib/session.ts app/config/navigation.tsx
git commit -m "feat(auth): clean auth store + session token module"
```

---

## Task 2: Next.js Middleware

**Files:**
- Create: `middleware.ts` (project root, next to `next.config.ts`)

- [ ] **Step 1: Create `middleware.ts`**

```typescript
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

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat(auth): add middleware for server-side dashboard route protection"
```

---

## Task 3: Axios Instance — Replace localStorage with Session Module

**Files:**
- Rewrite: `app/api/lib/api.ts`

- [ ] **Step 1: Rewrite `app/api/lib/api.ts`**

```typescript
import axios from "axios";
import { getSessionToken, clearSessionToken } from "./session";
import { useAuthStore } from "@/app/store/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  if (!config.headers.Authorization) {
    const token = getSessionToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSessionToken();
      useAuthStore.getState().clearUser();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

- [ ] **Step 2: Commit**

```bash
git add app/api/lib/api.ts
git commit -m "feat(auth): axios reads in-memory session token instead of localStorage"
```

---

## Task 4: Login Proxy Route

**Files:**
- Create: `app/api/auth/login/route.ts`

- [ ] **Step 1: Create `app/api/auth/login/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";

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

  const token = data?.data?.tokens?.accessToken;
  const user = data?.data?.user;

  if (!token) {
    return NextResponse.json(
      { error: { message: "No token returned from backend" } },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ user, token });
  response.cookies.set("auth_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/auth/login/route.ts
git commit -m "feat(auth): login proxy route sets httpOnly cookie"
```

---

## Task 5: Logout Proxy Route

**Files:**
- Create: `app/api/auth/logout/route.ts`

- [ ] **Step 1: Create `app/api/auth/logout/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";

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
      // Ignore backend logout failure; client session is cleared regardless
    });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("auth_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/auth/logout/route.ts
git commit -m "feat(auth): logout proxy route clears httpOnly cookie"
```

---

## Task 6: Me Proxy Route

**Files:**
- Create: `app/api/auth/me/route.ts`

- [ ] **Step 1: Create `app/api/auth/me/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("auth_session");

  if (!session?.value) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${session.value}`,
      },
    }
  );

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  // Normalise: backend may return data.data.user or data.user
  const user = data?.data?.user ?? data?.user ?? data;

  return NextResponse.json({ user, token: session.value });
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/auth/me/route.ts
git commit -m "feat(auth): me proxy route reads httpOnly cookie and returns user"
```

---

## Task 7: Register + Company Register Proxy Routes

**Files:**
- Create: `app/api/auth/register/route.ts`
- Create: `app/api/auth/company-register/route.ts`

- [ ] **Step 1: Create `app/api/auth/register/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
```

- [ ] **Step 2: Create `app/api/auth/company-register/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/company-register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/auth/register/route.ts app/api/auth/company-register/route.ts
git commit -m "feat(auth): register and company-register proxy routes"
```

---

## Task 8: Reset-Password + Verify-Email Proxy Routes

**Files:**
- Create: `app/api/auth/reset-password/route.ts`
- Create: `app/api/auth/verify-email/route.ts`

- [ ] **Step 1: Create `app/api/auth/reset-password/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
```

- [ ] **Step 2: Create `app/api/auth/verify-email/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/auth/reset-password/route.ts app/api/auth/verify-email/route.ts
git commit -m "feat(auth): reset-password and verify-email proxy routes"
```

---

## Task 9: Update `hooks/useLogin.tsx`

**Files:**
- Rewrite: `hooks/useLogin.tsx`
- Update: `app/auth/login/LoginForm.tsx` (error handling only)

- [ ] **Step 1: Rewrite `hooks/useLogin.tsx`**

```typescript
"use client";

import { useMutation } from "@tanstack/react-query";
import { setSessionToken } from "@/app/api/lib/session";
import { useAuthStore } from "@/app/store/auth";
import type { User } from "@/app/store/auth";

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
      token?: string | null;
    }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data as { user: User; token: string };
    },
    onSuccess: ({ user, token }) => {
      setSessionToken(token);
      setUser(user);
    },
  });
}
```

- [ ] **Step 2: Update error handling in `app/auth/login/LoginForm.tsx`**

Find the `onSubmit` catch block (around line 38–42):

```typescript
// BEFORE:
} catch (err) {
  if (axios.isAxiosError(err)) {
    toast.error(err?.response?.data?.error?.message ?? "Login failed");
  }
}
```

Replace with:

```typescript
// AFTER:
} catch (err: any) {
  const msg =
    err?.error?.message ??
    err?.data?.error?.message ??
    err?.message ??
    "Login failed";
  toast.error(msg);
}
```

Also remove the `import axios from "axios"` line from `LoginForm.tsx` since it's no longer needed.

- [ ] **Step 3: Commit**

```bash
git add hooks/useLogin.tsx app/auth/login/LoginForm.tsx
git commit -m "feat(auth): useLogin posts to Next.js proxy, sets in-memory session token"
```

---

## Task 10: Update `hooks/useMe.ts`

**Files:**
- Rewrite: `hooks/useMe.ts`

- [ ] **Step 1: Rewrite `hooks/useMe.ts`**

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { setSessionToken } from "@/app/api/lib/session";
import { useAuthStore } from "@/app/store/auth";
import type { User } from "@/app/store/auth";

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (!response.ok) throw data;
      return data as { user: User; token: string };
    },
    enabled: true,
    retry: false,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60,    // 1 hour
  });

  useEffect(() => {
    if (query.data) {
      const { user, token } = query.data;
      setSessionToken(token);
      setUser(user);
    }
  }, [query.data, setUser]);

  return query;
}
```

- [ ] **Step 2: Commit**

```bash
git add hooks/useMe.ts
git commit -m "feat(auth): useMe fetches from proxy route, enabled, restores session on refresh"
```

---

## Task 11: Update `hooks/useLogout.ts` + Clean `hooks/useAuth.ts`

**Files:**
- Rewrite: `hooks/useLogout.ts`
- Rewrite: `hooks/useAuth.ts`

- [ ] **Step 1: Rewrite `hooks/useLogout.ts`**

```typescript
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearSessionToken } from "@/app/api/lib/session";
import { useAuthStore } from "@/app/store/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useLogout() {
  const clearUser = useAuthStore((s) => s.clearUser);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      clearSessionToken();
      clearUser();
      queryClient.clear();
      router.push("/auth/login");
      toast.success("Logged out successfully");
    },
    onError: () => {
      // Still clear local state even if server logout fails
      clearSessionToken();
      clearUser();
      queryClient.clear();
      router.push("/auth/login");
    },
  });
}
```

- [ ] **Step 2: Rewrite `hooks/useAuth.ts`**

This file is imported by `app/auth/user_register/page.tsx` (for `useRegister`) and `app/auth/reset-password/page.tsx` (for `useForgotPassword`). Keep those exports, drop the rest.

```typescript
"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

/* ---------------- useRegister ---------------- */
interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    },
  });
}

/* ---------------- useForgotPassword ---------------- */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    },
  });
}
```

Also update the error handling in `app/auth/reset-password/page.tsx` — find the catch block:

```typescript
// BEFORE (around line 37-41):
} catch (err) {
  if (axios.isAxiosError(err)) {
    toast.error(
      err?.response?.data?.error?.message ?? "Unable to send reset link"
    );
  }
}
```

Replace with:

```typescript
// AFTER:
} catch (err: any) {
  const msg =
    err?.error?.message ??
    err?.message ??
    "Unable to send reset link";
  toast.error(msg);
}
```

Also remove the `import axios from "axios"` and `import router from "next/router"` lines from `reset-password/page.tsx`, and fix the router import to use `next/navigation`:
- Add at top: `import { useRouter } from "next/navigation";`
- Add inside component: `const router = useRouter();`

- [ ] **Step 3: Commit**

```bash
git add hooks/useLogout.ts hooks/useAuth.ts app/auth/reset-password/page.tsx
git commit -m "feat(auth): useLogout + useRegister + useForgotPassword use proxy routes"
```

---

## Task 12: Rewrite `AuthProvider`

**Files:**
- Rewrite: `app/providers/authProvider.tsx`

- [ ] **Step 1: Rewrite `app/providers/authProvider.tsx`**

```typescript
"use client";

import { useMe } from "@/hooks/useMe";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#19b24b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/providers/authProvider.tsx
git commit -m "feat(auth): AuthProvider shows spinner while useMe restores session"
```

---

## Task 13: Fix ProtectedRoute, SideNav, Dashboard Layout, Stats Page

**Files:**
- Rewrite: `app/auth/ProtectedRoute.tsx`
- Update: `app/dashboard/components/sideNav/index.tsx`
- Update: `app/dashboard/layout.tsx`
- Update: `app/dashboard/stats/page.tsx`

- [ ] **Step 1: Rewrite `app/auth/ProtectedRoute.tsx`**

Replace entire file with:

```typescript
"use client";

import { useAuthStore } from "@/app/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  return <>{children}</>;
}
```

- [ ] **Step 2: Fix SideNav hooks violation in `app/dashboard/components/sideNav/index.tsx`**

Replace entire file with:

```typescript
"use client";

import Image from "next/image";
import { X } from "lucide-react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import logo from "@/public/asset/logo.png";
import { NAV_ITEMS_BY_ROLE, Role } from "@/app/config/navigation";
import { useEffect, useState } from "react";

interface SideNavProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  role: Role;
}

export default function SideNav({ isOpen, setIsOpen, role }: SideNavProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = mounted ? (NAV_ITEMS_BY_ROLE[role] ?? []) : [];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/60 lg:hidden z-40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed lg:static top-0 left-0 z-50 h-full w-72 bg-[#19b24b] text-white transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4"
        >
          <X size={28} />
        </button>

        <div className="bg-white">
          <Image
            src={logo}
            alt="logo"
            className="h-16 w-auto mx-auto"
            priority
          />
        </div>

        <nav className="px-2 py-5 space-y-2">
          {navItems.map((item) => {
            const isActive = mounted && pathname.startsWith(item.href);
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "flex items-center gap-4 px-3 py-3 rounded-lg transition",
                  isActive
                    ? "bg-white text-[#19b24b] border-l-8 border-[#424242]"
                    : "hover:bg-white/10"
                )}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
```

- [ ] **Step 3: Update `app/dashboard/layout.tsx` — role from Zustand**

Replace entire file with:

```typescript
"use client";

import SideNav from "./components/sideNav";
import { useState } from "react";
import TopNav from "./components/topNav";
import ProtectedRoute from "../auth/ProtectedRoute";
import { useAuthStore } from "@/app/store/auth";
import type { Role } from "@/app/store/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const role = useAuthStore((s) => s.user?.role) ?? "visitor";

  return (
    <div className="flex h-screen w-full">
      <SideNav isOpen={isOpen} setIsOpen={setIsOpen} role={role as Role} />
      <div className="flex flex-col flex-1 h-full">
        <TopNav isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <ProtectedRoute>{children}</ProtectedRoute>
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update `app/dashboard/stats/page.tsx` — role from Zustand**

Replace the role retrieval at the top of `Dashboardstats`:

```typescript
// BEFORE:
import { getUserRole } from "@/app/api/lib/role";
// ...
const role = getUserRole();
```

```typescript
// AFTER — add to imports:
"use client";
import { useAuthStore } from "@/app/store/auth";
// ...remove getUserRole import

// Inside Dashboardstats component:
const user = useAuthStore((s) => s.user);
const role = user?.role;
```

Full updated file:

```typescript
"use client";
import StandardDashboard from "../user/standard/page";
import PremiumUser from "../user/premium/page";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import Admin from "../admin/page";
import UserDashboard from "../user/page";
import FeatureUnavailable from "@/components/FeatureUnavailable/FeatureUnavailable";
import { useAuthStore } from "@/app/store/auth";

function Dashboardstats() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  switch (role as string) {
    case "ADMIN":
      return <Admin />;
    case "AFFILIATE_PARTNER":
      return <FeatureUnavailable showBackButton title="Affiliate Partner page" />;
    case "TRAINER":
      return <FeatureUnavailable title="Trainer dashboard" showBackButton />;
    case "REGULAR":
      return <UserDashboard />;
    case "STANDARD":
      return <StandardDashboard />;
    case "PREMIUM":
      return <UserDashboard />;
    case "CORPORATE_ADMIN":
      return <FeatureUnavailable title="CORPORATE ADMIN" />;
    default:
      return UnauthorizedPage();
  }
}

export default Dashboardstats;
```

- [ ] **Step 5: Commit**

```bash
git add app/auth/ProtectedRoute.tsx app/dashboard/components/sideNav/index.tsx app/dashboard/layout.tsx app/dashboard/stats/page.tsx
git commit -m "fix(auth): ProtectedRoute, SideNav, layout, stats all read role from Zustand"
```

---

## Task 14: Update Verify-Email Page + QueryClient Cleanup

**Files:**
- Update: `app/auth/verify-email/verifyEmail.tsx`
- Rewrite: `app/api/lib/queryClient.tsx`

- [ ] **Step 1: Update `app/auth/verify-email/verifyEmail.tsx`**

Find the `verifyEmail` function (around line 31–63) and update the fetch URL from the direct backend call to the proxy:

```typescript
// BEFORE (line 33–36):
const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}auth/verify-email`,
  {
```

```typescript
// AFTER:
const res = await fetch("/api/auth/verify-email", {
```

The rest of the function body stays the same.

- [ ] **Step 2: Clean dead code from `app/api/lib/queryClient.tsx`**

Replace entire file with the active implementation only:

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/auth/verify-email/verifyEmail.tsx app/api/lib/queryClient.tsx
git commit -m "fix(auth): verify-email uses proxy route; clean queryClient dead code"
```

---

## Task 15: Delete Deprecated Files + Final Dead Code Cleanup

**Files to delete:**
- `app/api/lib/token.ts`
- `app/api/lib/auth-storage.ts`
- `app/api/lib/auth.ts`
- `app/api/lib/role.ts`
- `app/api/lib/initToken.ts`
- `hooks/userAuth.ts`
- `hooks/useRegister.ts`

**Files to clean dead code from:**
- `app/auth/ProtectedRoute.tsx` (already replaced in Task 13)
- `app/providers/authProvider.tsx` (already replaced in Task 12)

- [ ] **Step 1: Delete deprecated files**

```bash
git rm app/api/lib/token.ts
git rm app/api/lib/auth-storage.ts
git rm app/api/lib/auth.ts
git rm app/api/lib/role.ts
git rm app/api/lib/initToken.ts
git rm hooks/userAuth.ts
git rm hooks/useRegister.ts
```

- [ ] **Step 2: Remove the import of `initToken` from `app/layout.tsx`**

In `app/layout.tsx`, line 1:
```typescript
// BEFORE:
import "@/app/api/lib/initToken";
```
Delete that line entirely.

- [ ] **Step 3: Check for broken imports after deletions**

Run TypeScript compilation to surface any file that still imports from deleted modules:

```bash
npx tsc --noEmit 2>&1 | grep -E "(token|auth-storage|role|initToken|userAuth|useRegister)" | head -30
```

Expected: no output. If errors appear, trace the import to the file shown and update it to use the new equivalents:
- `from "@/app/api/lib/token"` → use `from "@/app/api/lib/session"` and call `getSessionToken()`
- `from "@/app/api/lib/auth-storage"` → no replacement (remove all localStorage token calls)
- `from "@/app/api/lib/role"` → use `useAuthStore((s) => s.user?.role)`
- `from "@/app/api/lib/auth"` → use `from "@/app/store/auth"`
- `from "@/hooks/userAuth"` → use `from "@/hooks/useAuth"` or the appropriate specific hook
- `from "@/hooks/useRegister"` → use `from "@/hooks/useAuth"` (imports `useRegister` from there)

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "chore(auth): delete deprecated auth files and remove initToken import"
```

---

## Task 16: Smoke Test Checklist

No code changes — manual verification only.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify login flow**
  - Navigate to `http://localhost:3000/auth/login`
  - Log in with valid credentials
  - Open DevTools → Application → Cookies → check `auth_session` cookie exists with `HttpOnly` flag ✓
  - Check localStorage — should have NO `accessToken`, `access_token`, or `userRole` keys ✓
  - Should be redirected to `/dashboard/stats` ✓

- [ ] **Step 3: Verify page refresh**
  - While logged in, hard-refresh the page (Ctrl+Shift+R)
  - Should stay on dashboard (not redirect to login) ✓
  - User data should be visible in dashboard ✓

- [ ] **Step 4: Verify middleware protection**
  - Log out
  - Manually navigate to `http://localhost:3000/dashboard/stats` in the URL bar
  - Should be redirected to `/auth/login` ✓

- [ ] **Step 5: Verify logout flow**
  - Log in, then log out
  - Check DevTools → Cookies → `auth_session` cookie should be gone ✓
  - Should redirect to `/auth/login` ✓

- [ ] **Step 6: Verify role-based sidebar**
  - Log in with different role accounts (ADMIN, STANDARD, etc.)
  - Sidebar items should match the role's nav config ✓

- [ ] **Step 7: Commit if clean**

```bash
git add .
git commit -m "chore: post-auth-redesign smoke test passed"
```
