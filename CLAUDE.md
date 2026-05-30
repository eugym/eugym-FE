# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Next.js on localhost:3000)
npm run build      # Production build
npm run lint       # ESLint check
```

There are no automated tests in this project.

## Environment

Requires a `.env.local` with:
```
NEXT_PUBLIC_API_URL=https://<backend-host>   # no trailing slash
```

`apiUrl()` from `app/api/lib/url.ts` normalises paths against this base; use it in Server Components and API routes instead of string-concatenating the env var directly.

## Architecture

### Auth & Session

Auth is **cookie-only, server-side**. On login, the Next.js API route at `app/api/auth/login/route.ts` proxies the backend, then sets two `httpOnly` cookies:
- `auth_session` — the JWT (never accessible from JS)
- `user_info` — serialised `User` object (read by the dashboard Server Component)

The dashboard layout (`app/dashboard/layout.tsx`) reads these cookies server-side and passes `user` + `token` down to `DashboardShell` as props. `DashboardShell` then hydrates the client-side session in a `useLayoutEffect` — guaranteeing the token is in memory before TanStack Query fires its first request.

Client-side HTTP calls go through `app/api/lib/api.ts` (Axios), which attaches the Bearer token from the in-memory session (`app/api/lib/session.ts`). On 401 it clears session and hard-redirects to `/auth/login`.

For mutation/write calls from client components, use `request()` from `app/api/lib/request.ts` (a thin `fetch` wrapper). For GET calls, use `getRequest()` from `app/api/lib/getRequest.ts`.

### Role System

Roles are defined in `app/store/auth.ts`:
```
SUPER_ADMIN | ADMIN | AFFILIATE_PARTNER | CORPORATE_ADMIN | TRAINER | REGULAR | STANDARD | PREMIUM | visitor
```

The role is read from the `user_info` cookie — there is no separate `/me` backend call on load. `app/dashboard/stats/page.tsx` switch-cases on the role to render the correct dashboard component. Sidebar navigation per role is in `app/config/navigation.tsx` (`NAV_ITEMS_BY_ROLE`).

When adding a feature that is role-specific, update both the dashboard component **and** `NAV_ITEMS_BY_ROLE`.

### Dashboard Structure

```
app/dashboard/
  layout.tsx               — Server Component: reads cookies, renders DashboardShell
  components/
    DashboardShell.tsx     — Client: hydrates session token, wraps SideNav + TopNav
    DashboardContext.tsx   — React context: exposes User object to all dashboard pages
    shared/                — Reusable dashboard widgets (StatChip, TipCard, etc.)
    tabs/                  — Shared tab component used across role dashboards
  stats/page.tsx           — Role router: renders the correct dashboard by role
  admin/                   — Admin overview + payments
  user/regular|standard|premium|trainers/  — Role-specific dashboards
  affiliate/               — Affiliate partner dashboard
  userManagement/          — User listing, invite, register
```

### Next.js API Routes (Proxy layer)

Routes under `app/api/` proxy to the Django/Express backend to avoid CORS and keep credentials server-side. When the backend URL is called from a Server Component or API route, use `apiUrl(path)` not `process.env.NEXT_PUBLIC_API_URL + path`.

### State Management

- **Zustand** (`useAuthStore`): user identity only. Do not put server data here.
- **TanStack Query v5**: all server data fetching and caching in client components. Use `queryClient` from `app/api/lib/` for invalidation.

### Styling Conventions

- **Tailwind CSS v4** for layout and utility classes — primary styling approach.
- **MUI v7** for complex interactive components (tables, dialogs, form controls).
- **Framer Motion** for animations.
- Do not mix MUI layout components (Box, Stack, Grid) with Tailwind — pick one per component.
