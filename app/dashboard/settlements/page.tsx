"use client";

import { useMemo } from "react";
import { CreditCard } from "lucide-react";
import { Table, ITableBody, ITableHead } from "@/components/table";
import { useBackendQuery } from "@/hooks/useBackend";
import { PageHeader, DataState, EmptyState } from "../components/shared/PageShell";

// GET /affiliate/settlements  (§3.8 "Settlement Reports Page", FR-AP2)
interface Settlement {
  id: string;
  periodStart: string;
  periodEnd: string;
  visitCount?: number;
  rate?: number;
  totalAmount?: number;
  status?: string;
  processedAt?: string | null;
  notes?: string | null;
}

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const HEADERS: ITableHead[] = [
  { name: "period", label: "Period" },
  { name: "visits", label: "Visits" },
  { name: "rate", label: "Rate / Visit" },
  { name: "total", label: "Total" },
  { name: "status", label: "Status" },
];

function period(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "—";

  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${s.toLocaleDateString("en-NG", opts)} – ${e.toLocaleDateString("en-NG", {
    ...opts,
    year: "numeric",
  })}`;
}

export default function Settlements() {
  const { data, isLoading, error, refetch } =
    useBackendQuery<Settlement[]>("affiliate/settlements");

  const rows: ITableBody[] = useMemo(
    () =>
      (data ?? []).map((s) => ({
        id: s.id,
        period: period(s.periodStart, s.periodEnd),
        visits: s.visitCount ?? 0,
        rate: naira.format(s.rate ?? 0),
        total: naira.format(s.totalAmount ?? 0),
        status: s.status ?? "pending",
        _raw: s,
      })),
    [data]
  );

  const outstanding = (data ?? [])
    .filter((s) => s.status !== "processed")
    .reduce((sum, s) => sum + (s.totalAmount ?? 0), 0);

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Settlements"
        subtitle="Monthly statements for member visits to your facility"
      />

      {rows.length > 0 && (
        <div className="mb-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:max-w-xs">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Outstanding
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
            {naira.format(outstanding)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Across statements not yet processed
          </p>
        </div>
      )}

      <DataState
        isLoading={isLoading}
        error={error}
        data={rows}
        onRetry={refetch}
        empty={
          <EmptyState
            icon={<CreditCard size={26} />}
            title="No settlements yet"
            description="Statements are generated monthly from the visits you log. Your first one appears after the current period closes."
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
              { label: "Pending", value: "pending", column: "status" },
              { label: "Processed", value: "processed", column: "status" },
              { label: "Disputed", value: "disputed", column: "status" },
            ]}
          />
        )}
      </DataState>
    </div>
  );
}
