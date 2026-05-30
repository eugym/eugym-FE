"use client";

import { Activity } from "lucide-react";
import type { User } from "@/app/store/auth";

const ROLE_LABELS: Record<string, string> = {
  REGULAR:           "Regular Member",
  STANDARD:          "Standard Member",
  PREMIUM:           "Premium Member",
  TRAINER:           "Personal Trainer",
  AFFILIATE_PARTNER: "Affiliate Partner",
  CORPORATE_ADMIN:   "Corporate Admin",
  ADMIN:             "Administrator",
  SUPER_ADMIN:       "Super Administrator",
};

const ROLE_COLORS: Record<string, string> = {
  REGULAR:           "bg-gray-100 text-gray-600 border-gray-200",
  STANDARD:          "bg-sky-50 text-sky-700 border-sky-200",
  PREMIUM:           "bg-amber-50 text-amber-700 border-amber-200",
  TRAINER:           "bg-indigo-50 text-indigo-700 border-indigo-200",
  AFFILIATE_PARTNER: "bg-orange-50 text-orange-700 border-orange-200",
  CORPORATE_ADMIN:   "bg-purple-50 text-purple-700 border-purple-200",
  ADMIN:             "bg-emerald-50 text-emerald-700 border-emerald-200",
  SUPER_ADMIN:       "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const TODAY = new Date().toLocaleDateString("en-NG", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

interface DashboardHeaderProps {
  user: User;
  subtitle?: string;
}

export default function DashboardHeader({ user, subtitle }: DashboardHeaderProps) {
  const roleLabel = ROLE_LABELS[user.role] ?? user.role;
  const roleColor = ROLE_COLORS[user.role] ?? "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          {greeting()}, {user.firstName} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {subtitle ?? TODAY}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border ${roleColor}`}>
          {roleLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
          <Activity size={11} />
          Live
        </span>
      </div>
    </div>
  );
}
