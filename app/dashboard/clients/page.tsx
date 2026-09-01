"use client";

import { useMemo } from "react";
import { Contact } from "lucide-react";
import { Table, ITableBody, ITableHead } from "@/components/table";
import { useBackendQuery } from "@/hooks/useBackend";
import { PageHeader, DataState, EmptyState } from "../components/shared/PageShell";

// GET /trainers/me/clients  (§3.5 "My Clients Page", FR-T2)
interface Client {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string | null;
  tier?: string;
  subscriptionStatus?: string;
  lastSessionAt?: string | null;
}

const HEADERS: ITableHead[] = [
  { name: "name", label: "Client" },
  { name: "email", label: "Email" },
  { name: "phone", label: "Phone" },
  { name: "tier", label: "Plan" },
  { name: "lastSession", label: "Last Session" },
];

function when(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function MyClients() {
  const { data, isLoading, error, refetch } =
    useBackendQuery<Client[]>("trainers/me/clients");

  const rows: ITableBody[] = useMemo(
    () =>
      (data ?? []).map((c) => ({
        id: c.id,
        name: `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || "—",
        email: c.email ?? "—",
        phone: c.phone ?? "—",
        tier: (c.tier ?? "—").replace(/_/g, " "),
        lastSession: when(c.lastSessionAt),
        _raw: c,
      })),
    [data]
  );

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="My Clients"
        subtitle={
          data?.length
            ? `${data.length} premium client${data.length === 1 ? "" : "s"} assigned to you`
            : "Premium members assigned to you by an admin"
        }
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={rows}
        onRetry={refetch}
        empty={
          <EmptyState
            icon={<Contact size={26} />}
            title="No clients assigned yet"
            description="An admin assigns premium members to you. Once they do, your clients and their session history appear here."
          />
        }
      >
        {(body) => <Table headers={HEADERS} body={body} allowSearchBar />}
      </DataState>
    </div>
  );
}
