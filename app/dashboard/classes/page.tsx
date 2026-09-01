"use client";

import { useMemo } from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useBackendQuery } from "@/hooks/useBackend";
import { PageHeader, DataState, EmptyState } from "../components/shared/PageShell";

// GET /classes  (§3.5 "Events & Classes Page", FR-T4)
interface FitnessClass {
  id: string;
  name: string;
  description?: string;
  category?: string;
  level?: string;
  startTime: string;
  durationMins?: number;
  capacity?: number;
  enrolled?: number;
  centreName?: string | null;
  trainerName?: string | null;
  isCancelled?: boolean;
}

const LEVEL_STYLE: Record<string, string> = {
  beginner: "bg-sky-50 text-sky-800 border-sky-200",
  intermediate: "bg-amber-50 text-amber-900 border-amber-200",
  advanced: "bg-rose-50 text-rose-800 border-rose-200",
};

function ClassCard({ c }: { c: FitnessClass }) {
  const start = new Date(c.startTime);
  const valid = !Number.isNaN(start.getTime());
  const full = (c.enrolled ?? 0) >= (c.capacity ?? 0) && (c.capacity ?? 0) > 0;

  return (
    <article className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-gray-900">{c.name}</h3>
          {c.category && (
            <p className="mt-0.5 text-xs text-gray-500">{c.category}</p>
          )}
        </div>
        {c.level && (
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${
              LEVEL_STYLE[c.level] ?? "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            {c.level}
          </span>
        )}
      </div>

      {c.description && (
        <p className="mb-3 line-clamp-2 text-sm text-gray-600">{c.description}</p>
      )}

      <dl className="space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="shrink-0 text-gray-400" aria-hidden="true" />
          <dd>
            {valid
              ? start.toLocaleDateString("en-NG", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })
              : "Date to be confirmed"}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="shrink-0 text-gray-400" aria-hidden="true" />
          <dd>
            {valid
              ? start.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" })
              : "—"}
            {c.durationMins ? ` · ${c.durationMins} min` : ""}
          </dd>
        </div>
        {c.centreName && (
          <div className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 text-gray-400" aria-hidden="true" />
            <dd className="truncate">{c.centreName}</dd>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users size={14} className="shrink-0 text-gray-400" aria-hidden="true" />
          <dd>
            {c.enrolled ?? 0}
            {c.capacity ? ` / ${c.capacity}` : ""} enrolled
            {full && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                Full
              </span>
            )}
          </dd>
        </div>
      </dl>

      {c.isCancelled && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-800">
          This class has been cancelled.
        </p>
      )}
    </article>
  );
}

export default function ClassesAndEvents() {
  const { data, isLoading, error, refetch } =
    useBackendQuery<FitnessClass[]>("classes");

  // Soonest first — a schedule the trainer reads top-down.
  const sorted = useMemo(
    () =>
      [...(data ?? [])].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      ),
    [data]
  );

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Events & Classes"
        subtitle="Sessions scheduled across Eugym centres"
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={sorted}
        onRetry={refetch}
        empty={
          <EmptyState
            icon={<Calendar size={26} />}
            title="No classes scheduled"
            description="Classes created by admins will appear here with their time, centre and enrolment."
          />
        }
      >
        {(rows) => (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((c) => (
              <ClassCard key={c.id} c={c} />
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
}
