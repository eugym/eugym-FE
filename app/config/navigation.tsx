import {
  Home,
  Layers,
  ShoppingBag,
  Calendar,
  Contact,
  CalendarDays,
  NotebookPen,
  CreditCard,
  ListChecks,
  UsersRound,
  Store,
  BarChart3,
  Building2,
  MapPin,
  Dumbbell,
  ShieldCheck,
  ScrollText,
  User,
} from "lucide-react";
import React from "react";

import type { Role } from "@/app/store/auth";
export type { Role };

/**
 * Sidebar navigation, derived from the SRS §3 "Accessible Pages" list for each
 * role. That document is the authority on what a role may reach; this file is
 * its executable form.
 *
 * "ready" — a real route. `npm run check:nav` fails the build if it doesn't
 *           resolve to a page under app/dashboard, so this file cannot drift
 *           away from the filesystem without someone noticing.
 * "soon"  — specified but not yet built. Rendered as a non-clickable row with a
 *           "Soon" badge, so the sidebar advertises the roadmap without handing
 *           the user a link that ejects them from the app with a 404.
 */
export type NavStatus = "ready" | "soon";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  status: NavStatus;
}

// ─── Items shared across roles ───────────────────────────────────────────────
// Declared once so a route change is a single edit and two roles cannot end up
// pointing the same label at different paths.
const DASHBOARD: NavItem = {
  id: "dashboard",
  label: "Dashboard",
  href: "/dashboard/stats",
  icon: <Home size={18} />,
  status: "ready",
};

const MEMBERSHIP: NavItem = {
  id: "membership",
  label: "Membership Plans",
  href: "/dashboard/membership",
  icon: <Layers size={18} />,
  status: "ready",
};

const STORE: NavItem = {
  id: "store",
  label: "Merchandise",
  href: "/dashboard/store",
  icon: <ShoppingBag size={18} />,
  status: "ready",
};

const EVENTS: NavItem = {
  id: "events",
  label: "Events",
  href: "/dashboard/events",
  icon: <Calendar size={18} />,
  status: "ready",
};

const BOOKINGS: NavItem = {
  id: "bookings",
  label: "Bookings",
  href: "/dashboard/bookings",
  icon: <NotebookPen size={18} />,
  status: "ready",
};

// §3.2–3.4 list "Profile Settings Page" as accessible to every member tier.
const PROFILE: NavItem = {
  id: "profile",
  label: "Profile",
  href: "/dashboard/profile",
  icon: <User size={18} />,
  status: "ready",
};

// ─── Admin (§3.6) ────────────────────────────────────────────────────────────
const ADMIN_ITEMS: NavItem[] = [
  DASHBOARD,
  {
    id: "user-management",
    label: "User Management",
    href: "/dashboard/userManagement",
    icon: <UsersRound size={18} />,
    status: "ready",
  },
  {
    id: "trainer-management",
    label: "Trainer Management",
    href: "/dashboard/trainerManagement",
    icon: <Dumbbell size={18} />,
    status: "ready",
  },
  {
    id: "merchandise",
    label: "Merchandise",
    href: "/dashboard/machandise",
    icon: <Store size={18} />,
    status: "ready",
  },
  {
    id: "event-management",
    label: "Events & Classes",
    href: "/dashboard/eventManagement",
    icon: <CalendarDays size={18} />,
    status: "ready",
  },
  {
    id: "reports",
    label: "Reports",
    href: "/dashboard/reports",
    icon: <BarChart3 size={18} />,
    status: "ready",
  },
];

export const NAV_ITEMS_BY_ROLE: Record<Role, NavItem[]> = {
  // §3.7 — everything an admin has, plus admin account management.
  SUPER_ADMIN: [
    ...ADMIN_ITEMS,
    {
      id: "admin-management",
      label: "Admin Accounts",
      href: "/dashboard/adminManagement",
      icon: <ShieldCheck size={18} />,
      status: "ready",
    },
  ],

  ADMIN: ADMIN_ITEMS,

  // §3.8 — Affiliate Dashboard, Usage Log, Settlement Reports (+ check-in,
  // which FR-AP1 requires them to perform).
  AFFILIATE_PARTNER: [
    DASHBOARD,
    {
      id: "check-in",
      label: "Check In",
      href: "/dashboard/check-in",
      icon: <ListChecks size={18} />,
      status: "ready",
    },
    {
      id: "usage-log",
      label: "Usage Log",
      href: "/dashboard/usage-log",
      icon: <ScrollText size={18} />,
      status: "ready",
    },
    {
      id: "settlements",
      label: "Settlements",
      href: "/dashboard/settlements",
      icon: <CreditCard size={18} />,
      status: "ready",
    },
  ],

  // §3.9 — Corporate Dashboard, Staff Management, Reports & Usage, Billing.
  CORPORATE_ADMIN: [
    DASHBOARD,
    {
      id: "staff",
      label: "Staff Management",
      href: "/dashboard/staff",
      icon: <Building2 size={18} />,
      status: "ready",
    },
    {
      id: "corporate-reports",
      label: "Reports & Usage",
      href: "/dashboard/corporate-reports",
      icon: <BarChart3 size={18} />,
      status: "ready",
    },
    {
      // No corporate billing endpoint exists yet.
      id: "corporate-billing",
      label: "Billing",
      href: "/dashboard/corporate-billing",
      icon: <CreditCard size={18} />,
      status: "soon",
    },
  ],

  // §3.5 — Trainer Dashboard, My Clients, Group Plans, Events & Classes.
  TRAINER: [
    DASHBOARD,
    {
      id: "clients",
      label: "My Clients",
      href: "/dashboard/clients",
      icon: <Contact size={18} />,
      status: "ready",
    },
    {
      // FR-T3. No endpoint for posting group plans yet.
      id: "group-plans",
      label: "Group Plans",
      href: "/dashboard/group-plans",
      icon: <UsersRound size={18} />,
      status: "soon",
    },
    {
      id: "classes",
      label: "Events & Classes",
      href: "/dashboard/classes",
      icon: <Calendar size={18} />,
      status: "ready",
    },
  ],

  // §3.2 — Dashboard, Events, Merchandise, Profile, Membership Plans.
  REGULAR: [DASHBOARD, EVENTS, STORE, MEMBERSHIP, PROFILE],

  // §3.3 — Dashboard, Booking, Membership Plans, Merchandise, Profile.
  STANDARD: [DASHBOARD, BOOKINGS, EVENTS, MEMBERSHIP, STORE, PROFILE],

  // §3.4 — adds Premium Content and nationwide Gym Locations.
  PREMIUM: [
    DASHBOARD,
    BOOKINGS,
    {
      // FR-P4. Needs a workout/diet plans endpoint that doesn't exist yet.
      id: "premium-content",
      label: "Premium Content",
      href: "/dashboard/premium-content",
      icon: <Dumbbell size={18} />,
      status: "soon",
    },
    {
      id: "locations",
      label: "Gym Locations",
      href: "/dashboard/locations",
      icon: <MapPin size={18} />,
      status: "ready",
    },
    EVENTS,
    MEMBERSHIP,
    STORE,
    PROFILE,
  ],

  // §3.1 has no dashboard for guests, but an authenticated account whose role
  // is still "visitor" needs a way to see what membership buys.
  VISITOR: [DASHBOARD, MEMBERSHIP, STORE, PROFILE],
};

/**
 * Look up a nav item by path across every role.
 *
 * Lets the dashboard catch-all tell "this feature is planned" apart from "this
 * URL means nothing", so an unbuilt page reads as a roadmap item rather than an
 * error the user thinks they caused.
 */
export function findNavItemByHref(href: string): NavItem | undefined {
  const normalised = href.replace(/\/+$/, "");

  for (const items of Object.values(NAV_ITEMS_BY_ROLE)) {
    const match = items.find((i) => i.href.replace(/\/+$/, "") === normalised);
    if (match) return match;
  }
  return undefined;
}

/** Roles allowed to reach a given dashboard path. Used to guard pages. */
export function rolesForHref(href: string): Role[] {
  const normalised = href.replace(/\/+$/, "");

  return (Object.entries(NAV_ITEMS_BY_ROLE) as [Role, NavItem[]][])
    .filter(([, items]) =>
      items.some((i) => i.href.replace(/\/+$/, "") === normalised)
    )
    .map(([role]) => role);
}
