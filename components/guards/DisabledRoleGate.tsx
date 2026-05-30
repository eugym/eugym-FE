"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import { Lock } from "lucide-react";
import { useDashboardUser } from "@/app/dashboard/components/DashboardContext";

export type MyUserRole = "REGULAR" | "STANDARD" | "PREMIUM";

interface DisabledRoleGateProps {
  allow: MyUserRole[];
  message?: string;
  label?: string;
  children: ReactNode;
}

export default function DisabledRoleGate({
  allow,
  message = "This feature is not available for your current plan",
  label = "Upgrade required",
  children,
}: DisabledRoleGateProps) {
  const user = useDashboardUser();
  const isAllowed = allow.includes(user.role as MyUserRole);

  return (
    <div className="relative">
      <div className={clsx(!isAllowed && "pointer-events-none select-none opacity-50")}>
        {children}
      </div>

      {!isAllowed && (
        <div className="absolute inset-0 z-10 rounded-xl bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="flex items-center gap-2 bg-white shadow-md rounded-xl px-4 py-2.5 border border-gray-100">
            <Lock size={14} className="text-rose-500 shrink-0" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
        </div>
      )}
    </div>
  );
}
