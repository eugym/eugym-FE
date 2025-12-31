import { Calendar, Home, Layers, ShoppingBag } from "lucide-react";

export type UserRole = "admin" | "staff" | "user" | "super-admin";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SideNavProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  role: "admin" | "staff" | "user" | "super-admin"; // add your roles here
}
// role-based navigation
export const navItemsByRole: Record<SideNavProps["role"], NavItem[]> = {
  admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/",
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
      icon: <Calendar size={18} />,
    },
    {
      id: "events",
      label: "Events",
      href: "/dashboard/events",
      icon: <Calendar size={18} />,
    },
  ],

  staff: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/",
      icon: <Home size={18} />,
    },
    {
      id: "bookings",
      label: "Bookings",
      href: "/dashboard/bookings",
      icon: <Calendar size={18} />,
    },
  ],

  user: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/",
      icon: <Home size={18} />,
    },
    {
      id: "store",
      label: "Store",
      href: "/dashboard/store",
      icon: <ShoppingBag size={18} />,
    },
  ],

  "super-admin": [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/",
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
};
