"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, User, LogOut } from "lucide-react";
import Avatar, { initialsFromName } from "@/components/ui/Avatar";

interface Props {
  fullName?: string;
  role: string;
  onLogout: () => void;
}

/**
 * Header identity control.
 *
 * The avatar was an <Image> whose source came from the caller — and TopNav
 * passed a bundled stock photo of a trainer, so every signed-in user saw the
 * same stranger's face. Its fallback, `/images/avatar-placeholder.png`, is not
 * present in `public/` either, so a missing avatar rendered a broken image.
 * Initials are derived from the name already being displayed.
 */
export default function Profile({ fullName, role, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Click outside (desktop + mobile safe)
  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  // Escape closes the menu — a dropdown you can only dismiss with the mouse
  // strands keyboard users inside it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const roleLabel = role?.replace(/_/g, " ") ?? "";

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-(--plate-radius) px-2 py-1.5 transition-colors hover:bg-black/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--plate-iron)"
      >
        <Avatar initials={initialsFromName(fullName)} size="sm" />

        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-sm font-semibold text-(--plate-iron)">
            {fullName}
          </span>
          <span className="block text-[11px] capitalize text-(--plate-steel)">
            {roleLabel}
          </span>
        </span>

        <ChevronDown
          size={16}
          className={`text-(--plate-steel) transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-(--plate-radius) border border-(--plate-rule) bg-(--plate-surface) shadow-(--plate-shadow)"
        >
          {/* On phones the trigger hides the name, so the menu restates it. */}
          <div className="flex items-center gap-3 border-b border-(--plate-rule) px-4 py-3 sm:hidden">
            <Avatar initials={initialsFromName(fullName)} size="sm" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-semibold text-(--plate-iron)">
                {fullName}
              </span>
              <span className="block text-[11px] capitalize text-(--plate-steel)">
                {roleLabel}
              </span>
            </span>
          </div>

          <MenuItem
            icon={<User size={16} />}
            href="/dashboard/profile"
            label="Profile"
            onNavigate={() => setOpen(false)}
          />

          <div className="h-px bg-(--plate-rule)" />

          <MenuItem
            icon={<LogOut size={16} />}
            label="Logout"
            danger
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          />
        </div>
      )}
    </div>
  );
}

interface MenuItemProps {
  href?: string;
  label: string;
  danger?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  onNavigate?: () => void;
}

const MenuItem = ({
  href,
  label,
  danger,
  icon,
  onClick,
  onNavigate,
}: MenuItemProps) => {
  const baseClasses = `flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
    danger
      ? "text-red-700 hover:bg-red-50"
      : "text-(--plate-iron) hover:bg-black/[0.04]"
  }`;

  if (onClick) {
    return (
      <button type="button" role="menuitem" onClick={onClick} className={baseClasses}>
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{label}</span>
      </button>
    );
  }

  return (
    // Was href="profile" — a relative path, so it resolved against whatever
    // page you were on (/dashboard/store/profile, and so forth) instead of the
    // profile page.
    <Link href={href!} role="menuitem" onClick={onNavigate} className={baseClasses}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </Link>
  );
};
