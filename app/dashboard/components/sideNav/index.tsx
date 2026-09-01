"use client";

import Link from "next/link";
import Image from "next/image";
import { X, LogOut } from "lucide-react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import logo from "@/public/asset/logo.png";
import { NAV_ITEMS_BY_ROLE } from "@/app/config/navigation";
import { useDashboardUser } from "../DashboardContext";
import { useLogout } from "@/hooks/useLogout";
import type { Role } from "@/app/store/auth";

interface SideNavProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  role: Role;
}

export default function SideNav({ isOpen, setIsOpen, role }: SideNavProps) {
  const pathname  = usePathname();
  const userCtx = useDashboardUser();
  const logout  = useLogout();
  const navItems  = NAV_ITEMS_BY_ROLE[role] ?? [];

  const initials =
    `${userCtx.firstName?.[0] ?? ""}${userCtx.lastName?.[0] ?? ""}`.toUpperCase() || "U";

  const roleLabel = userCtx.role.replace(/_/g, " ").toLowerCase();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/60 lg:hidden z-40 transition-opacity duration-200",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      {/* Surface colour comes from --sidebar-surface in globals.css so the
          application theme can restyle the sidebar in one place. The literal
          fallback matters: an undefined custom property invalidates the whole
          declaration, which renders the sidebar transparent. */}
      <aside
        style={{ background: "var(--sidebar-surface, #19b24b)" }}
        className={clsx(
          "fixed lg:static top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-200 shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header: logo + mobile close */}
        <div className="flex items-center justify-between h-16 px-4 shrink-0 border-b border-white/10">
          <Image src={logo} alt="Eugym" className="h-10 w-auto" priority />
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-white/70 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.length === 0 ? (
            <p className="text-white/40 text-xs px-3 pt-4">
              No navigation available for your role.
            </p>
          ) : (
            navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              const rowClass =
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors";

              // Unbuilt destination: render a row, not a link. Offering a link
              // that 404s throws the user clean out of the dashboard shell — the
              // sidebar should say what isn't ready rather than prove it.
              if (item.status === "soon") {
                return (
                  <div
                    key={item.id}
                    aria-disabled="true"
                    title={`${item.label} — coming soon`}
                    className={clsx(rowClass, "text-white/55 cursor-not-allowed")}
                  >
                    <span className="shrink-0 text-white/40">{item.icon}</span>
                    <span className="flex-1 min-w-0 truncate">{item.label}</span>
                    <span className="shrink-0 rounded-full border border-white/25 bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/70">
                      Soon
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    rowClass,
                    isActive
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <span className={clsx("shrink-0", isActive ? "text-emerald-600" : "text-white/60")}>
                    {item.icon}
                  </span>
                  <span className="flex-1 min-w-0 truncate">{item.label}</span>
                </Link>
              );
            })
          )}
        </nav>

        {/* Bottom: user info + logout */}
        <div className="border-t border-white/10 px-3 py-4 shrink-0">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold shrink-0 select-none">
              {initials}
            </div>

            {/* Name + role */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {userCtx.firstName} {userCtx.lastName}
              </p>
              <p className="text-[11px] text-white/55 capitalize truncate mt-0.5">
                {roleLabel}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={() => logout.mutate()}
              title="Log out"
              className="shrink-0 p-1.5 rounded-md text-white/55 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
