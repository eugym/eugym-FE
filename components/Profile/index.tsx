"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ChevronDown, User, LogOut } from "lucide-react";

interface Props {
  fullName?: string;
  role: string;
  avatarUrl?: string | StaticImageData;
  onLogout: () => void;
}

export default function Profile({
  fullName,
  avatarUrl,
  role,
  onLogout,
}: Props) {
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

  const src = !avatarUrl ? "/images/avatar-placeholder.png" : avatarUrl;
  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center sm:justify-betweens justify-ends gap-1 rounded-lg sm:px-1 px-1 hover:bg-gray-100"
      >
        <div className="flex flow-row gap-3 items-center align-middle mx-2">
          <Image src={src} alt="Profile" className="rounded-full w-8 h-8 " />

          <div
            className="flex-col hidden sm:block "
            suppressHydrationWarning={true}
          >
            <div className="flex flex-col">
              <span className="font-semibold">{fullName}</span>
              <span className="text-[12px] ">{role}</span>
            </div>
          </div>
        </div>

        <ChevronDown
          // size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-lg bg-white shadow-lg">
          <div className="p-2 pl-4 block sm:hidden shadow-sm">
            <div className="flex flex-col">
              <span className="font-semibold">{fullName}</span>
              <span className="text-[12px] ">{role}</span>
            </div>
          </div>
          <MenuItem icon={<User size={16} />} href="profile" label="Profile" />

          <div className="my-1 h-px bg-gray-100" />

          <MenuItem
            icon={<LogOut size={16} />}
            label="Logout"
            danger
            onClick={() => {
              setOpen(false); // close dropdown
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
}

const MenuItem = ({ href, label, danger, icon, onClick }: MenuItemProps) => {
  const baseClasses = `flex w-full items-center gap-3 px-4 py-2 text-sm transition
    ${
      danger
        ? "text-red-600 hover:bg-red-50"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={baseClasses}>
        {icon && <span className="h-4 w-4">{icon}</span>}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link href={href!} className={baseClasses}>
      {icon && <span className="h-4 w-4">{icon}</span>}
      <span>{label}</span>
    </Link>
  );
};
