"use client";

import { BarChart3, TrendingUp, CalendarCheck, Users } from "lucide-react";
import { useBackendQuery } from "@/hooks/useBackend";
import {
  PageHeader,
  LoadingState,
  ErrorState,
  EmptyState,
} from "../components/shared/PageShell";

// GET /admin/reports  (§3.6 "Reports Page", FR-A5)
interface ReportsData {
  revenue: { day: string; total: string | number }[];
  signups: { day: string; count: string | number }[];
  bookingStats: { status: string; count: string | number }[];
  topClasses: { name: string; bookings: string | number }[];
}

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const num = (v: string | number | undefined) => Number(v ?? 0);

function StatTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
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

/**
 * Horizontal bar list.
 *
 * One measure ranked by name — a bar list reads faster than an axis chart at
 * this size and can't collide its own labels. Single series, so one hue and no
 * legend: the heading names what's being measured.
 */
function BarList({
  rows,
  format,
}: {
  rows: { label: string; value: number }[];
  format?: (v: number) => string;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate text-sm text-gray-700">
              {row.label}
            </span>
            <span className="shrink-0 text-sm font-medium tabular-nums text-gray-900">
              {format ? format(row.value) : row.value}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${Math.max(2, (row.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

export default function Reports() {
  const { data, isLoading, error, refetch } =
    useBackendQuery<ReportsData>("admin/reports");

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <PageHeader title="Reports" subtitle="Revenue, signups and bookings" />
        <LoadingState label="Loading reports…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <PageHeader title="Reports" subtitle="Revenue, signups and bookings" />
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

  const revenue = data?.revenue ?? [];
  const signups = data?.signups ?? [];
  const bookingStats = data?.bookingStats ?? [];
  const topClasses = data?.topClasses ?? [];

  const totalRevenue = revenue.reduce((sum, r) => sum + num(r.total), 0);
  const totalSignups = signups.reduce((sum, s) => sum + num(s.count), 0);
  const totalBookings = bookingStats.reduce((sum, b) => sum + num(b.count), 0);

  const hasNothing =
    !revenue.length && !signups.length && !bookingStats.length && !topClasses.length;

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Reports"
        subtitle="Revenue, signups and bookings across all centres"
      />

      {hasNothing ? (
        <EmptyState
          icon={<BarChart3 size={26} />}
          title="No activity to report yet"
          description="Once members sign up, book classes and pay for subscriptions, the figures will appear here."
        />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatTile
              label="Revenue"
              value={naira.format(totalRevenue)}
              icon={<TrendingUp size={15} />}
            />
            <StatTile
              label="New signups"
              value={String(totalSignups)}
              icon={<Users size={15} />}
            />
            <StatTile
              label="Bookings"
              value={String(totalBookings)}
              icon={<CalendarCheck size={15} />}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Signups by day">
              {signups.length ? (
                <BarList
                  rows={signups.map((s) => ({
                    label: new Date(s.day).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    }),
                    value: num(s.count),
                  }))}
                />
              ) : (
                <p className="text-sm text-gray-500">No signups in this period.</p>
              )}
            </Panel>

            <Panel title="Revenue by day">
              {revenue.length ? (
                <BarList
                  rows={revenue.map((r) => ({
                    label: new Date(r.day).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    }),
                    value: num(r.total),
                  }))}
                  format={(v) => naira.format(v)}
                />
              ) : (
                <p className="text-sm text-gray-500">
                  No payments recorded in this period.
                </p>
              )}
            </Panel>

            <Panel title="Most booked classes">
              {topClasses.length ? (
                <BarList
                  rows={topClasses.map((c) => ({
                    label: c.name,
                    value: num(c.bookings),
                  }))}
                />
              ) : (
                <p className="text-sm text-gray-500">No class bookings yet.</p>
              )}
            </Panel>

            <Panel title="Bookings by status">
              {bookingStats.length ? (
                <BarList
                  rows={bookingStats.map((b) => ({
                    label: b.status.replace(/_/g, " "),
                    value: num(b.count),
                  }))}
                />
              ) : (
                <p className="text-sm text-gray-500">No bookings yet.</p>
              )}
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
