"use client";

import { useMemo } from "react";
import { ScrollText } from "lucide-react";
import { Table, ITableBody, ITableHead } from "@/components/table";
import { useBackendQuery } from "@/hooks/useBackend";
import { PageHeader, DataState, EmptyState } from "../components/shared/PageShell";

// GET /affiliate/visits  (§3.8 "Usage Log Page", FR-AP3)
interface Visit {
  id: string;
  visitedAt: string;
  settled?: boolean;
  memberName?: string;
  memberEmail?: string;
  centreName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

const HEADERS: ITableHead[] = [
  { name: "member", label: "Member" },
  { name: "email", label: "Email" },
  { name: "centre", label: "Centre" },
  { name: "date", label: "Date" },
  { name: "time", label: "Time" },
  { name: "settled", label: "Settlement" },
];

export default function UsageLog() {
  const { data, isLoading, error, refetch } =
    useBackendQuery<Visit[]>("affiliate/visits");

  const rows: ITableBody[] = useMemo(
    () =>
      (data ?? []).map((v) => {
        const at = new Date(v.visitedAt);
        const valid = !Number.isNaN(at.getTime());

        return {
          id: v.id,
          member:
            v.memberName ??
            `${v.firstName ?? ""} ${v.lastName ?? ""}`.trim() ??
            "—",
          email: v.memberEmail ?? v.email ?? "—",
          centre: v.centreName ?? "—",
          date: valid
            ? at.toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—",
          time: valid
            ? at.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" })
            : "—",
          settled: v.settled ? "settled" : "pending",
          _raw: v,
        };
      }),
    [data]
  );

  const pending = rows.filter((r) => r.settled === "pending").length;

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Usage Log"
        subtitle={
          rows.length
            ? `${rows.length} visit${rows.length === 1 ? "" : "s"} logged · ${pending} awaiting settlement`
            : "Every premium member visit logged at your facility"
        }
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={rows}
        onRetry={refetch}
        empty={
          <EmptyState
            icon={<ScrollText size={26} />}
            title="No visits logged yet"
            description="Use the Check In page to log a premium member's visit. Each one appears here and counts toward your settlement."
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
              { label: "Pending", value: "pending", column: "settled" },
              { label: "Settled", value: "settled", column: "settled" },
            ]}
          />
        )}
      </DataState>
    </div>
  );
}
