"use client";

import { useMemo } from "react";
import { Dumbbell, Star } from "lucide-react";
import { Table, ITableBody, ITableHead } from "@/components/table";
import { useBackendQuery } from "@/hooks/useBackend";
import {
  PageHeader,
  DataState,
  EmptyState,
} from "../components/shared/PageShell";

// GET /admin/trainers  (§3.6 "Trainer Management Page", FR-A6)
interface Trainer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
  specialisations?: string[];
  certifications?: string[];
  rating?: number;
  reviewCount?: number;
  clientCount?: number;
  centreName?: string | null;
  isActive?: boolean;
}

const HEADERS: ITableHead[] = [
  { name: "name", label: "Trainer" },
  { name: "specialisations", label: "Specialisations" },
  { name: "centre", label: "Centre" },
  { name: "clients", label: "Clients" },
  { name: "rating", label: "Rating" },
  { name: "status", label: "Status" },
];

export default function TrainerManagement() {
  const { data, isLoading, error, refetch } =
    useBackendQuery<Trainer[]>("admin/trainers");

  const rows: ITableBody[] = useMemo(
    () =>
      (data ?? []).map((t) => ({
        id: t.id,
        name: `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim() || "—",
        // Long specialisation lists would blow out the column; show the first
        // two and count the rest.
        specialisations:
          t.specialisations?.length
            ? t.specialisations.slice(0, 2).join(", ") +
              (t.specialisations.length > 2
                ? ` +${t.specialisations.length - 2}`
                : "")
            : "—",
        centre: t.centreName ?? "—",
        clients: t.clientCount ?? 0,
        rating: t.rating ? `${Number(t.rating).toFixed(1)} ★` : "—",
        status: t.isActive === false ? "inactive" : "active",
        _raw: t,
      })),
    [data]
  );

  const active = rows.filter((r) => r.status === "active").length;

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Trainer Management"
        subtitle={
          data
            ? `${data.length} trainer${data.length === 1 ? "" : "s"} onboarded · ${active} active`
            : "Trainers onboarded to Eugym"
        }
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={rows}
        onRetry={refetch}
        empty={
          <EmptyState
            icon={<Dumbbell size={26} />}
            title="No trainers yet"
            description="Trainers appear here once they've been onboarded and assigned to a centre."
          />
        }
      >
        {(body) => (
          <Table
            headers={HEADERS}
            body={body}
            allowSearchBar
            allowFilterBar
            filterOptions={[
              { label: "Active", value: "active", column: "status" },
              { label: "Inactive", value: "inactive", column: "status" },
            ]}
          />
        )}
      </DataState>

      {/* Rating is the one number an admin scans for; surface the standout
          rather than making them sort a column. */}
      {rows.length > 0 && (
        <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
          <Star size={13} className="text-amber-500" aria-hidden="true" />
          Ratings are averaged from member reviews after completed sessions.
        </p>
      )}
    </div>
  );
}
