"use client";

import { BarChart3, Users, CalendarCheck, Building2 } from "lucide-react";
import { useBackendQuery } from "@/hooks/useBackend";
import {
  PageHeader,
  LoadingState,
  ErrorState,
  EmptyState,
} from "../components/shared/PageShell";

// GET /corporate/reports  (§3.9 "Reports & Usage Page", FR-C4)
interface CorporateReports {
  totalStaff?: number;
  activeStaff?: number;
  totalBookings?: number;
  totalVisits?: number;
  staffUsage?: {
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    bookings?: number | string;
    visits?: number | string;
  }[];
}

const num = (v: number | string | undefined) => Number(v ?? 0);

function StatTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-gray-500">
        <span aria-hidden="true">{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-900">
        {value}
      </p>
    </div>
  );
}

export default function CorporateReports() {
  const { data, isLoading, error, refetch } =
    useBackendQuery<CorporateReports>("corporate/reports");

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <PageHeader title="Reports & Usage" subtitle="How your team is using Eugym" />
        <LoadingState label="Loading reports…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <PageHeader title="Reports & Usage" subtitle="How your team is using Eugym" />
        <ErrorState
          message={
            (error as { message?: string })?.message ??
            "Reports could not be loaded."
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  const usage = data?.staffUsage ?? [];
  const maxActivity = Math.max(
    ...usage.map((u) => num(u.bookings) + num(u.visits)),
    1
  );

  const hasNothing =
    !usage.length &&
    !data?.totalStaff &&
    !data?.totalBookings &&
    !data?.totalVisits;

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Reports & Usage"
        subtitle="Attendance, bookings and check-ins across your team"
      />

      {hasNothing ? (
        <EmptyState
          icon={<BarChart3 size={26} />}
          title="No usage to report yet"
          description="Once your staff start booking classes and checking in at centres, their activity appears here."
        />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              label="Staff"
              value={data?.totalStaff ?? 0}
              icon={<Building2 size={15} />}
            />
            <StatTile
              label="Active"
              value={data?.activeStaff ?? 0}
              icon={<Users size={15} />}
            />
            <StatTile
              label="Bookings"
              value={data?.totalBookings ?? 0}
              icon={<CalendarCheck size={15} />}
            />
            <StatTile
              label="Gym visits"
              value={data?.totalVisits ?? 0}
              icon={<BarChart3 size={15} />}
            />
          </div>

          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">
              Activity by staff member
            </h2>

            {usage.length === 0 ? (
              <p className="text-sm text-gray-500">
                No individual activity recorded yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {usage.map((u, i) => {
                  const total = num(u.bookings) + num(u.visits);
                  const name =
                    `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
                    u.email ||
                    "—";

                  return (
                    <li key={u.userId ?? `${u.email}-${i}`}>
                      <div className="mb-1 flex items-baseline justify-between gap-3">
                        <span className="min-w-0 truncate text-sm text-gray-700">
                          {name}
                        </span>
                        <span className="shrink-0 text-xs tabular-nums text-gray-500">
                          {num(u.bookings)} bookings · {num(u.visits)} visits
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${Math.max(2, (total / maxActivity) * 100)}%`,
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
