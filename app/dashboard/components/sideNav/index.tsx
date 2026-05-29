"use client";

import Image from "next/image";
import { X } from "lucide-react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import logo from "@/public/asset/logo.png";
import { NAV_ITEMS_BY_ROLE } from "@/app/config/navigation";
import type { Role } from "@/app/store/auth";

interface SideNavProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  role: Role;
}

export default function SideNav({ isOpen, setIsOpen, role }: SideNavProps) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS_BY_ROLE[role] ?? [];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/60 lg:hidden z-40 transition-opacity",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed lg:static top-0 left-0 z-50 h-full w-72 bg-[#19b24b] text-white flex flex-col transition-transform duration-200 shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white"
          aria-label="Close menu"
        >
          <X size={28} />
        </button>

        {/* Logo */}
        <div className="bg-white flex items-center justify-center h-16 shrink-0">
          <Image src={logo} alt="EUGYM" className="h-12 w-auto" priority />
        </div>

        {/* Navigation */}
        <nav className="px-3 py-5 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "flex items-center gap-4 px-3 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-white text-[#19b24b] font-semibold border-l-4 border-[#424242]"
                    : "hover:bg-white/10 text-white"
                )}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
