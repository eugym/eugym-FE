"use client";

import { Activity, CalendarDays, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import AvatarUpload from "./AvatarUpload";
import SectionLoader from "../Loaders/sectionLoader";
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

interface ProfileCardProps {
  profile: any;
  user: User;
  isLoading: boolean;
}

export default function ProfileCard({ profile, user, isLoading }: ProfileCardProps) {
  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U";
  const roleLabel  = ROLE_LABELS[user.role]  ?? user.role;
  const roleColor  = ROLE_COLORS[user.role]  ?? "bg-gray-100 text-gray-600 border-gray-200";
  const status     = (profile?.status ?? "Active").toLowerCase();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-5 text-center">
      {isLoading ? (
        <SectionLoader height="280px" />
      ) : (
        <>
          <AvatarUpload avatar={profile?.avatar ?? ""} initials={initials} />

          {/* Name + email */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5 break-all">{user.email}</p>
          </div>

          {/* Role + status badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${roleColor}`}
            >
              {roleLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              {status}
            </span>
          </div>

          {/* Account meta */}
          <div className="w-full border-t border-gray-100 pt-4 space-y-3">
            <MetaRow icon={<ShieldCheck size={14} />} label="Plan"         value={roleLabel} />
            <MetaRow icon={<CalendarDays size={14} />} label="Member since" value="Jan 2025" />
            <MetaRow icon={<Activity size={14} />}     label="Last active"  value="Today" />
          </div>
        </>
      )}
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-1.5 text-gray-400">
        {icon}
        {label}
      </span>
      <span className="font-medium text-gray-700">{value}</span>
    </div>
  );
}
