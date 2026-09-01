# Eugym Dashboard — Development Progress

> Last updated: 2026-05-31  
> Branch: `maintainance`

---

## What Has Been Built

### Auth System (completed — previous session)

Cookie-based auth replacing the original localStorage approach:
- `app/api/auth/login/route.ts` — proxies backend login, sets two `httpOnly` cookies (`auth_session`, `user_info`)
- `app/api/auth/logout/route.ts` — clears cookie on logout
- `app/api/auth/me/route.ts` — reads cookie, returns user (no unnecessary backend calls on load)
- `app/dashboard/layout.tsx` — Server Component reads cookies, passes `user` + `token` to `DashboardShell` as props
- `app/dashboard/components/DashboardShell.tsx` — hydrates Zustand + session token via `useLayoutEffect` before any query fires
- `app/api/lib/session.ts` — in-memory token module (not Web Storage)
- `app/api/lib/api.ts` — Axios instance auto-attaches Bearer token; 401 → clear + redirect

### Dashboard Pages (completed this session)

#### Events — user-facing (`/dashboard/events`)
- Tabs: All / Free / Paid with live counts
- Real-time search filtering by name, location, category
- Stats strip (total, free, paid)
- Polished event cards: date+time, location, category badge, spots progress bar, smart CTA
- **Reads directly from shared Zustand store** — events created by admin appear here instantly

#### Event Management — admin (`/dashboard/eventManagement`)
- Stats strip: Total / Upcoming / Free / Paid
- Full table using the existing `Table` component with built-in search
- **Create event modal** — all fields: title, category, type (Free/Paid), price, date, start/end time, location, capacity, description
- **Edit event modal** — pre-filled, includes status field (upcoming/ongoing/completed/cancelled)
- **View details modal** — read-only view with Edit / Cancel / Delete actions
- **Cancel confirmation** — only shown for upcoming/ongoing events
- **Delete confirmation** — with destructive warning copy
- All writes go to `useEventsStore` (Zustand + `persist` → localStorage)

#### Membership (`/dashboard/membership`)
- 3 billing cycles: Daily / Monthly / Quarterly
- Current plan detected from `user.role` (REGULAR → Regular, STANDARD → Standard, PREMIUM → Premium)
- CTA states: "Your Current Plan" (disabled) / "Upgrade to X" (filled green) / "Switch to X" (outline)
- Savings % auto-computed from `priceSlash` vs `price`
- "Most Popular" badge on highlighted plan; "Your Plan" badge on current
- Coloured top accent bar on cards
- `data.ts` cleaned: added `id` field, fixed Daily Standard price order (was inverted), normalised price strings

#### Store (`/dashboard/store`)
- **Product catalog**: 16 products across 5 categories (Apparel, Equipment, Accessories, Nutrition), real-time search + category pill filters, results count, empty state
- **Product cards**: image with hover zoom, badge (New/Sale/Hot), wishlist heart, rating, price + crossed-out original, "Add to Cart"
- **Product drawer** (right panel): full image, description, size selector, colour selector, qty stepper with stock guard, "Add to Cart — ₦X,XXX" total button
- **Cart drawer** (right panel): item list with thumbnails, qty controls, remove, subtotal + delivery fee + total, "Proceed to Checkout"
- **Checkout modal** (3 steps):
  - Step 1 — Delivery: name, email, phone, address, city, state (all 37 Nigerian states dropdown)
  - Step 2 — Payment: order summary, 3 method tiles (Card / Bank Transfer / Pay on Delivery); card form with auto-formatting, GTBank dummy details for transfer, POD note
  - Step 3 — Confirmation: generated order ID (EG-XXXXXX), delivery recap, estimated timeline
- Post-order: cart cleared, dismissible success banner with order ID

#### Profile (`/dashboard/profile`)
- **Left sidebar card**: large avatar (initials fallback, camera hover for upload), full name, email, role badge, animated live status dot, meta rows (Plan / Member since / Last active)
- **Right tabbed area** (Personal Info / Security tabs):
  - Personal Info: First Name, Last Name (was bugged — mapped to wrong field), Email, Phone, Bio — Save button now enabled and functional
  - Security: Current Password, New Password, Confirm New Password — validates length, match, and same-as-current before submitting
- `useChangePassword` fixed to use `api` instance (previously used raw axios with no auth token)

#### Bookings (`/dashboard/bookings`)
- Upcoming / Past Bookings / Cancelled tabs with live counts
- Search by class, trainer, or location
- Session type filter dropdown
- BookingCard: date label (Today/Tomorrow/date), time, trainer, location, type badge, star rating
- Actions: Reschedule, Cancel, Rate Session, Rebook
- "Book a Session" modal with available classes, spots progress bar, book confirmation

### Components & Infrastructure

#### SideNav (`app/dashboard/components/sideNav/index.tsx`)
- Replaced `<a>` with Next.js `<Link>` — no more full page reloads on navigation
- Fixed active state: removed `border-[#424242]`, now `bg-white text-emerald-700 shadow-sm`
- Active detection: `pathname === item.href || pathname.startsWith(item.href + "/")` (prevents false matches)
- Logo area: removed white box, sits cleanly in green header with `border-b border-white/10`
- **Bottom user section**: initials avatar, full name, role label, logout button

#### Plan Card (`app/dashboard/components/cards/planCard.tsx`)
- Added `isCurrentPlan`, `currentPlanTier`, `planTier` props for smart button states
- Auto-computes savings % from price vs original price
- Coloured top accent bar (emerald for current, green for highlighted)
- Badge chip: "Your Plan" / "Most Popular"

#### Shared Zustand Events Store (`app/store/events.ts`)
- `GymEvent` type with full fields (id, title, category, type, price, date, startTime, endTime, location, capacity, spotsLeft, description, status, createdAt)
- Pre-seeded with 10 diverse events across all categories
- CRUD: `addEvent`, `updateEvent`, `deleteEvent`, `cancelEvent`
- Persisted to localStorage (`"eugym-events"`) — survives page refresh

#### Globals CSS (`app/globals.css`)
- Added `.form-label` and `.form-input` utility classes for consistent admin modal form styling

#### Bug Fixes
- `app/dashboard/page.tsx`: removed `async` from a `"use client"` function (React error: async Client Component)
- `hooks/useChangePassword.tsx`: replaced raw `axios` with `api` instance (auth token was not being sent)
- `components/Profile/ProfileForm.tsx`: "Last Name" field was mapped to `form?.lastName` but labelled "Email Address" and bound to the wrong key
- `.gitignore`: added dist, all env variants, IDE folders (`.idea/`), turbo/cache, `*.tgz`, Claude todos

---

## What Still Needs to Be Done

### High Priority — Real API Wiring

| Feature | File(s) | What's needed |
|---|---|---|
| Events → backend | `app/store/events.ts` | Replace Zustand seed with `useQuery` to fetch from backend; write operations call API then invalidate |
| Store → backend | `app/dashboard/store/page.tsx` | Replace static `PRODUCTS[]` with API fetch; connect cart/order to backend |
| Paystack integration | `app/dashboard/store/page.tsx` | Replace dummy checkout with real Paystack payment flow |
| Membership → backend | `app/dashboard/membership/` | `data.ts` plans should come from API; CTA buttons should call subscription API |
| Profile → backend | `hooks/useProfile.ts` | `useUpdateProfile` endpoint (`PUT /profile`) needs to be verified against actual backend schema |
| Bookings → backend | `app/dashboard/bookings/page.tsx` | Replace dummy `BOOKINGS[]` with API; cancel/rebook call real endpoints |
| Admin events → backend | `app/dashboard/eventManagement/page.tsx` | Replace Zustand CRUD with API calls + TanStack Query invalidation |

### Medium Priority — Pages Not Yet Built

| Page | Route | Notes |
|---|---|---|
| Trainer Dashboard | `/dashboard/stats` (TRAINER) | Currently `<FeatureUnavailable>` — needs trainer-specific widgets (clients, schedule, earnings) |
| Corporate Admin Dashboard | `/dashboard/stats` (CORPORATE_ADMIN) | Currently `<FeatureUnavailable>` — needs staff overview, billing |
| Affiliate Dashboard | `/dashboard/stats` (AFFILIATE_PARTNER) | Skeleton exists — needs earnings chart, referral stats |
| Affiliate Payments | `/dashboard/affiliate/payments` | Stub page |
| Insight Management | `/dashboard/insightManagement` | Table stub — needs full article CRUD (create/edit/publish/delete) |
| Merchandise Management | `/dashboard/machandise` | Table stub — needs full product CRUD with image upload |
| Check-In System | `/dashboard/check-in` | Nav item in AFFILIATE_PARTNER nav, page does not exist |
| Admin Payments | `/dashboard/admin` | Charts are live, but payments table is a stub |

### Medium Priority — Features on Existing Pages

| Feature | Notes |
|---|---|
| Notification system | Bell icon in TopNav has a red dot but no panel or real data |
| Real profile photo upload | `AvatarUpload` shows local preview only — needs `PUT /user/avatar` or S3 upload |
| Paystack payment | Store checkout shows a card form but doesn't call Paystack SDK |
| Event registration | "Register Free" / "Book Now" buttons on event cards have no action |
| Membership upgrade flow | "Upgrade to Premium" buttons `console.log` only — need payment/subscription API call |
| Password change confirmation email | Backend may send one; frontend just shows a toast |
| Rebook flow | Opens "Book a Session" modal but doesn't pre-select the session type |

### Low Priority — Polish & Infra

| Item | Notes |
|---|---|
| Mobile audit | Pages are responsive but untested on small screens end-to-end |
| `navItem.tsx` cleanup | `app/dashboard/components/sideNav/navItem.tsx` is dead code — can be deleted |
| Loading skeletons | Most pages show a spinner but could show skeleton cards for better perceived performance |
| Error boundaries | No page-level error boundaries — a failed query crashes the page silently |
| Toast on store add-to-cart | Cart drawer opens but no toast confirmation when item added |
| `insightManagement` and `machandise` spelling | These folder names have typos — would need a rename + redirect |
| `CORPORATE_ADMIN` nav items | `NAV_ITEMS_BY_ROLE.CORPORATE_ADMIN` is an empty array — sidebar shows nothing |

---

## Architecture Decisions Made

| Decision | Reason |
|---|---|
| Events shared via Zustand + persist | Simplest way to make admin-created events visible to users without a backend round-trip; replace with server state when backend is ready |
| Store page is one large file | Self-contained state machine; splitting prematurely would add complexity without benefit at this stage |
| Profile data fetching lifted to page level | Avoids duplicate API calls; `ProfileCard` and `ProfileForm` both needed the same data |
| `.form-label` / `.form-input` in globals.css | Repeated in 3+ admin modals; extracting to utilities prevents drift |
| `useChangePassword` uses `api` not raw axios | Consistency — raw axios bypasses the auth interceptor; all backend calls should go through `api` |
