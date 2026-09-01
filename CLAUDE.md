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

---

## Architecture

### Auth & Session

Auth is **cookie-only, server-side**. On login, the Next.js API route at `app/api/auth/login/route.ts` proxies the backend, then sets two `httpOnly` cookies:
- `auth_session` — the JWT (never accessible from JS)
- `user_info` — serialised `User` object (read by the dashboard Server Component)

The dashboard layout (`app/dashboard/layout.tsx`) reads these cookies server-side and passes `user` + `token` down to `DashboardShell` as props. `DashboardShell` then hydrates the client-side session in a `useLayoutEffect` — guaranteeing the token is in memory before TanStack Query fires its first request.

Client-side HTTP calls go through `app/api/lib/api.ts` (Axios), which attaches the Bearer token from the in-memory session (`app/api/lib/session.ts`). On 401 it clears session and hard-redirects to `/auth/login`.

For mutation/write calls from client components, use `request()` from `app/api/lib/request.ts`. For GET calls, use `getRequest()` from `app/api/lib/getRequest.ts`.

### Role System

Roles are defined in `app/store/auth.ts`:
```
SUPER_ADMIN | ADMIN | AFFILIATE_PARTNER | CORPORATE_ADMIN | TRAINER | REGULAR | STANDARD | PREMIUM | visitor
```

The role is read from the `user_info` cookie — there is no separate `/me` backend call on load. `app/dashboard/stats/page.tsx` switch-cases on the role to render the correct dashboard component. Sidebar navigation per role is in `app/config/navigation.tsx` (`NAV_ITEMS_BY_ROLE`).

When adding a role-specific feature, update both the dashboard component **and** `NAV_ITEMS_BY_ROLE`.

### Dashboard Structure

```
app/dashboard/
  layout.tsx                    — Server Component: reads cookies, renders DashboardShell
  page.tsx                      — redirects to stats (must NOT be async — Client Component)
  components/
    DashboardShell.tsx          — Client: hydrates session, wraps SideNav + TopNav
    DashboardContext.tsx        — React context: exposes User to all dashboard pages
    sideNav/index.tsx           — Sidebar nav (uses Link not <a>, bottom user section)
    topNav/index.tsx            — Header with bell + profile dropdown
    shared/                     — Reusable widgets (StatChip, TipCard, EventsSection, etc.)
    cards/planCard.tsx          — Membership plan card (current-plan aware, savings badge)
    tabs/index.tsx              — Shared tab switcher
  stats/page.tsx                — Role router → renders correct dashboard per role
  admin/                        — Admin overview + payments
  user/regular|standard|premium|trainers/  — Role-specific dashboards
  affiliate/                    — Affiliate partner dashboard
  userManagement/               — User listing, search, invite, actions
  eventManagement/page.tsx      — Admin event CRUD (create/edit/view/cancel/delete)
  events/page.tsx               — User-facing event browser (reads from Zustand store)
  membership/page.tsx           — Billing cycle tabs, plan cards, current plan detection
  store/page.tsx                — Full e-commerce: catalog → product drawer → cart → checkout
  profile/page.tsx              — Sidebar identity card + Personal Info / Security tabs
  bookings/page.tsx             — Booking management with upcoming/past/cancelled tabs
  machandise/page.tsx           — Admin merchandise table
  insightManagement/page.tsx    — Admin insight management (stub)
```

### State Management

- **Zustand** (`useAuthStore` in `app/store/auth.ts`): user identity only.
- **Zustand** (`useEventsStore` in `app/store/events.ts`): shared event list between admin (`eventManagement`) and user (`events`) pages. Persisted to `localStorage` via the `persist` middleware under key `"eugym-events"`. Pre-seeded with 10 events on first load.
- **TanStack Query v5**: all server data fetching and caching. Use `queryClient` from `app/api/lib/` for invalidation.

### Next.js API Routes (Proxy layer)

Routes under `app/api/` proxy to the backend to avoid CORS and keep credentials server-side. Use `apiUrl(path)` from `app/api/lib/url.ts` when calling the backend from Server Components or API routes.

### Styling Conventions

- **Tailwind CSS v4** — primary approach for all layout and utility classes.
- **MUI v7** — complex interactive components (tables, dialogs).
- **Framer Motion** — animations.
- `.form-label` and `.form-input` utility classes are defined in `app/globals.css` — use them in admin modal forms.
- Do not mix MUI layout components (Box, Stack, Grid) with Tailwind in the same component.

---

## Page Status

### Completed & Standardised

| Page | Route | Notes |
|---|---|---|
| Events (user) | `/dashboard/events` | Tabs, search, cards, live from Zustand store |
| Event Management (admin) | `/dashboard/eventManagement` | Full CRUD — create/edit/view/cancel/delete modals |
| Membership | `/dashboard/membership` | Billing cycle tabs, current-plan detection from role, savings badge |
| Store | `/dashboard/store` | Catalog, product drawer, cart drawer, 3-step checkout |
| Profile | `/dashboard/profile` | Sidebar identity card, Personal Info form, Security (change password) |
| Bookings | `/dashboard/bookings` | Upcoming/Past/Cancelled tabs, booking, search, cancel, rebook |
| SideNav | — | `Link` not `<a>`, fixed active state, bottom user + logout section |
| Admin Dashboard | `/dashboard/stats` (ADMIN) | Live stats from API, charts |
| Standard Dashboard | `/dashboard/stats` (STANDARD) | Workout plan, events, AI trainer, upgrade CTA |
| Premium Dashboard | `/dashboard/stats` (PREMIUM) | Same as Standard with Premium features |
| User Management | `/dashboard/userManagement` | Table with search/filter/actions |

### Dummy Data — Needs Real API Wiring

| Page | What's dummy |
|---|---|
| Store | All products, cart, checkout flow (no Paystack integration) |
| Events (user) | Zustand store is seeded locally — no backend sync |
| Event Management | CRUD writes to Zustand/localStorage only — not persisted to backend |
| Membership | Plan data is static in `data.ts`, CTA buttons `console.log` only |
| Profile | `member since`, `last active` are hardcoded strings |
| Bookings | All bookings are dummy; rebook/cancel are local state only |

### Not Yet Built / Stubs

| Page / Feature | Route | Status |
|---|---|---|
| Trainer Dashboard | `/dashboard/stats` (TRAINER) | Shows `<FeatureUnavailable>` |
| Corporate Admin Dashboard | `/dashboard/stats` (CORPORATE_ADMIN) | Shows `<FeatureUnavailable>` |
| Affiliate Dashboard | `/dashboard/stats` (AFFILIATE_PARTNER) | Skeleton only |
| Insight Management | `/dashboard/insightManagement` | Table stub, no CRUD |
| Merchandise Management | `/dashboard/machandise` | Table stub, no CRUD |
| Check-In System | `/dashboard/check-in` | Nav item exists, page missing |
| Notifications | — | Bell icon has no real functionality |
| Real Payment | — | Store checkout is dummy; Paystack not integrated |
| Profile photo upload | — | Local preview only, no upload to backend |
| Admin Payments | `/dashboard/admin` | Partial — charts live, payment table stub |
| Affiliate Payments | `/dashboard/affiliate/payments` | Stub |

---

## Key Patterns to Follow

**Adding a new admin CRUD page:**
1. Use the existing `Table` component (`components/table/index.tsx`) — supports `allowSearchBar`, `allowFilterBar`, dropdown actions.
2. Use `.form-label` / `.form-input` CSS classes in modal forms.
3. Put modal state (`mode`, `target`, form data) in the page component, not in a store.
4. Use `Button` component from `components/ui/Button.tsx` for primary actions (has loading state).

**Adding a new user-facing page:**
1. Start with page header (title + subtitle with user's first name from `useDashboardUser()`).
2. Stats strip if relevant (horizontal flex cards like events/store pages).
3. Tabs via `Tabs` component from `app/dashboard/components/tabs/index.tsx`.
4. Cards follow the `bg-white rounded-xl border border-gray-100 shadow-sm` pattern.
5. Empty states use a centred icon + message + optional CTA.

**Shared event data:** Always import from `useEventsStore` in `app/store/events.ts`. Never maintain a separate static event array in individual page files.
