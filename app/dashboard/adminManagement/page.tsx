"use client";

import { useMemo } from "react";
import { ShieldCheck } from "lucide-react";
import { Table, ITableBody, ITableHead } from "@/components/table";
import { useBackendQuery } from "@/hooks/useBackend";
import { PageHeader, DataState, EmptyState } from "../components/shared/PageShell";

// GET /admin/super/admins  (§3.7, FR-SA1/FR-SA2 — super admin only)
interface AdminUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
}

const HEADERS: ITableHead[] = [
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
  { name: "role", label: "Role" },
  { name: "lastLogin", label: "Last Login" },
  { name: "status", label: "Status" },
];

function when(iso?: string | null) {
  if (!iso) return "Never";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "Never"
    : d.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export default function AdminManagement() {
  const { data, isLoading, error, refetch } =
    useBackendQuery<AdminUser[]>("admin/super/admins");

  const rows: ITableBody[] = useMemo(
    () =>
      (data ?? []).map((a) => ({
        id: a.id,
        name: `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim() || "—",
        email: a.email ?? "—",
        role: (a.role ?? "—").replace(/_/g, " "),
        lastLogin: when(a.lastLoginAt),
        status: a.isActive === false ? "inactive" : "active",
        _raw: a,
      })),
    [data]
  );

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Admin Accounts"
        subtitle={
          rows.length
            ? `${rows.length} administrator${rows.length === 1 ? "" : "s"} with system access`
            : "Administrators with system-wide access"
        }
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={rows}
        onRetry={refetch}
        empty={
          <EmptyState
            icon={<ShieldCheck size={26} />}
            title="No administrators listed"
            description="Admin accounts with system-wide access appear here."
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
              { label: "Admin", value: "admin", column: "role" },
              { label: "Super admin", value: "super admin", column: "role" },
            ]}
          />
        )}
      </DataState>
    </div>
  );
}
