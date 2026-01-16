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
} from "lucide-react";
import React from "react";

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

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const NAV_ITEMS_BY_ROLE: Record<Role, NavItem[]> = {
  SUPER_ADMIN: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard/stats",
      icon: <Home size={18} />,
    },
  ],

  ADMIN: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard/stats",
      icon: <Home size={18} />,
    },
    {
      id: "user-management",
      label: "User Management",
      href: "/dashboard/userManagement",
      icon: <UsersRound size={18} />,
    },
    {
      id: "merchandise",
      label: "Merchandise Management",
      href: "/dashboard/machandise",
      icon: <Store size={18} />,
    },

    {
      id: "events",
      label: "Events Management",
      href: "/dashboard/eventManagement",
      icon: <CalendarDays size={18} />,
    },

    {
      id: "insight",
      label: "Insight Management",
      href: "/dashboard/insightManagement",
      icon: <CalendarDays size={18} />,
    },
  ],

  AFFILIATE_PARTNER: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard/stats",
      icon: <Home size={18} />,
    },
    {
      id: "payment",
      label: "Payments",
      href: "/dashboard/affiliate/payments",
      icon: <CreditCard size={18} />,
    },

    {
      id: "check_in",
      label: "Ckeck in",
      href: "/dashboard/check-in",
      icon: <ListChecks size={18} />,
    },
  ],

  CORPORATE_ADMIN: [],

  TRAINER: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard/stats",
      icon: <Home size={18} />,
    },

    {
      id: "clients",
      label: "My Clients",
      href: "/dashboard/client",
      icon: <Contact size={18} />,
    },

    {
      id: "group_plan",
      label: "Group Plan",
      href: "/dashboard/group_plan",
      icon: <Home size={18} />,
    },

    {
      id: "event_classes",
      label: "Events and Classes",
      href: "/event-classes",
      icon: <Calendar size={18} />,
    },
  ],

  REGULAR: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard/stats",
      icon: <Home size={18} />,
    },

    {
      id: "membership",
      label: "Membership Plans",
      href: "/dashboard/membership",
      icon: <Layers size={18} />,
    },
    {
      id: "events",
      label: "Events",
      href: "/dashboard/events",
      icon: <Calendar size={18} />,
    },
    {
      id: "store",
      label: "Store",
      href: "/dashboard/store",
      icon: <ShoppingBag size={18} />,
    },
  ],

  STANDARD: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard/stats",
      icon: <Home size={18} />,
    },

    {
      id: "membership",
      label: "Membership Plans",
      href: "/dashboard/membership",
      icon: <Layers size={18} />,
    },

    {
      id: "store",
      label: "Store",
      href: "/dashboard/store",
      icon: <ShoppingBag size={18} />,
    },
    {
      id: "bookings",
      label: "Bookings",
      href: "/dashboard/bookings",
      icon: <NotebookPen size={18} />,
    },
    {
      id: "events",
      label: "Events",
      href: "/dashboard/events",
      icon: <Calendar size={18} />,
    },
  ],
  PREMIUM: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard/stats",
      icon: <Home size={18} />,
    },

    {
      id: "membership",
      label: "Membership Plans",
      href: "/dashboard/membership",
      icon: <Layers size={18} />,
    },

    {
      id: "store",
      label: "Store",
      href: "/dashboard/store",
      icon: <ShoppingBag size={18} />,
    },
    {
      id: "bookings",
      label: "Bookings",
      href: "/dashboard/bookings",
      icon: <NotebookPen size={18} />,
    },
    {
      id: "events",
      label: "Events",
      href: "/dashboard/events",
      icon: <Calendar size={18} />,
    },
  ],
  visitor: [],
};
