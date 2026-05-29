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
