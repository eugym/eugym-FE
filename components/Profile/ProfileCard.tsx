"use client";

import { Activity, CalendarDays, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import Avatar, { initialsFrom } from "@/components/ui/Avatar";
import SectionLoader from "../Loaders/sectionLoader";
import type { Profile } from "@/hooks/useProfile";
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
  REGULAR:           "bg-gray-100 text-gray-700 border-gray-200",
  STANDARD:          "bg-sky-50 text-sky-800 border-sky-200",
  PREMIUM:           "bg-amber-50 text-amber-900 border-amber-200",
  TRAINER:           "bg-indigo-50 text-indigo-800 border-indigo-200",
  AFFILIATE_PARTNER: "bg-orange-50 text-orange-900 border-orange-200",
  CORPORATE_ADMIN:   "bg-purple-50 text-purple-800 border-purple-200",
  ADMIN:             "bg-emerald-50 text-emerald-800 border-emerald-200",
  SUPER_ADMIN:       "bg-emerald-50 text-emerald-800 border-emerald-200",
};

interface ProfileCardProps {
  profile?: Profile;
  user: User;
  isLoading: boolean;
}

/** "12 Aug 2026", or a dash when the API has nothing to show. */
function monthYear(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-NG", { month: "short", year: "numeric" });
}

/** Relative for the recent past, absolute once it stops being useful. */
function lastActive(iso?: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Never";

  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 2) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 24) return `${Math.floor(mins / 60)} hr ago`;
  if (mins < 60 * 24 * 7) return `${Math.floor(mins / (60 * 24))} days ago`;
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProfileCard({ profile, user, isLoading }: ProfileCardProps) {
  const initials = initialsFrom(user.firstName, user.lastName);
  const roleLabel = ROLE_LABELS[user.role] ?? user.role;
  const roleColor =
    ROLE_COLORS[user.role] ?? "bg-gray-100 text-gray-700 border-gray-200";

  // Derived from the record, not assumed. The card previously hard-coded
  // "Active" regardless of whether the account actually was.
  const active = profile?.isActive ?? true;

  return (
    <div className="flex flex-col items-center gap-5 rounded-(--plate-radius) border border-(--plate-rule) bg-(--plate-surface) p-6 text-center">
      {isLoading ? (
        <SectionLoader height="280px" />
      ) : (
        <>
          {/* Initials, not a photograph. There is no avatar upload endpoint, so
              the old widget only ever produced a local preview that vanished on
              reload — it looked like a feature and saved nothing. */}
          <Avatar initials={initials} size="lg" className="text-3xl" />

          {/* Name + email */}
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-(--plate-iron)">
              {user.firstName} {user.lastName}
            </h2>
            <p className="mt-0.5 break-all text-sm text-(--plate-steel)">
              {profile?.email ?? user.email}
            </p>
          </div>

          {/* Role + status badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${roleColor}`}
            >
              {roleLabel}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                active
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  active ? "bg-emerald-600" : "bg-red-600"
                }`}
                aria-hidden="true"
              />
              {active ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Account meta — read from the record. "Member since Jan 2025" and
              "Last active Today" were string literals for every user. */}
          <dl className="w-full space-y-3 border-t border-(--plate-rule) pt-4">
            <MetaRow icon={<ShieldCheck size={14} />} label="Plan" value={roleLabel} />
            <MetaRow
              icon={<CalendarDays size={14} />}
              label="Member since"
              value={monthYear(profile?.createdAt)}
            />
            <MetaRow
              icon={<Activity size={14} />}
              label="Last active"
              value={lastActive(profile?.lastLoginAt)}
            />
          </dl>
        </>
      )}
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <dt className="flex items-center gap-1.5 text-(--plate-steel)">
        {icon}
        {label}
      </dt>
      <dd className="min-w-0 truncate font-medium text-(--plate-iron)">{value}</dd>
    </div>
  );
}
