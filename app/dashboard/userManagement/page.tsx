"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Table, ITableBody, ITableHead, IFilterOption } from "@/components/table";
import { Pagination } from "@/components/pagination";
import Button from "@/components/ui/Button";
import Modal from "@/components/modals/modal";
import RegisterUser from "./RegisterUser";
import InviteAdminUser from "./inviteAdminUser";
// ---------- types ----------
interface RawUser {
  id: string;
  _id?: string;
  email: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  phoneNumber?: string;
  phone?: string;
  role: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
}

// ---------- fetch ----------
// Calls the Next.js proxy at /api/users/all (same-origin → no CORS).
// The proxy reads the auth_session cookie server-side and forwards to the backend.
async function fetchAllUsers(): Promise<RawUser[]> {
  const res = await fetch("/api/users/all", { cache: "no-store" });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? err?.error ?? `Failed to load users (${res.status})`);
  }

  const data = await res.json();

  return (
    data?.data?.allUser?.users ??
    data?.data?.users ??
    data?.users ??
    data?.data ??
    []
  );
}

// ---------- helpers ----------
const HEADERS: ITableHead[] = [
  { name: "email",       label: "Email" },
  { name: "fullName",    label: "Full Name" },
  { name: "phoneNumber", label: "Phone" },
  { name: "role",        label: "Role" },
  { name: "status",      label: "Status" },
];

function normaliseUser(u: RawUser): ITableBody {
  return {
    id:          u.id ?? u._id ?? "",
    email:       u.email ?? "—",
    fullName:    `${u.firstName ?? u.first_name ?? ""} ${u.lastName ?? u.last_name ?? ""}`.trim() || "—",
    phoneNumber: u.phoneNumber ?? u.phone ?? "—",
    role:        (u.role ?? "").replace(/_/g, " "),
    status:      u.status ?? (u.isActive ? "active" : "inactive"),
    _raw:        u,
  };
}

// ---------- component ----------
const PER_PAGE = 10;

export default function UserManagement() {
  const [inviteOpen,   setInviteOpen]   = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [page, setPage]                 = useState(1);
  const [perPage, setPerPage]           = useState(PER_PAGE);

  const { data: rawUsers = [], isLoading, error, refetch } = useQuery<RawUser[]>({
    queryKey: ["users-all"],
    queryFn: fetchAllUsers,
    retry: 1,
  });

  // Normalised rows for the table
  const allRows: ITableBody[] = useMemo(
    () => rawUsers.map(normaliseUser),
    [rawUsers]
  );

  // Paginate (search/filter is handled inside the Table component)
  const pageCount  = Math.max(1, Math.ceil(allRows.length / perPage));
  const pagedRows  = allRows.slice((page - 1) * perPage, page * perPage);

  // Build role filter options from actual data
  const roleOptions: IFilterOption[] = useMemo(() => {
    const roles = [...new Set(rawUsers.map((u) => u.role).filter(Boolean))];
    return roles.map((r) => ({
      label:  r.replace(/_/g, " "),
      value:  r.replace(/_/g, " ").toLowerCase(),
      column: "role",
    }));
  }, [rawUsers]);

  const statusOptions: IFilterOption[] = [
    { label: "Active",   value: "active",   column: "status" },
    { label: "Inactive", value: "inactive", column: "status" },
    { label: "Pending",  value: "pending",  column: "status" },
  ];

  const filterOptions: IFilterOption[] = [...roleOptions, ...statusOptions];

  // ---------- row actions ----------
  const dropdownOptions = [
    {
      label:  "View details",
      action: (row: ITableBody) => {
        // TODO: open a detail drawer / modal
        toast(`Viewing ${row.fullName}`);
      },
    },
    {
      label:  "Edit user",
      action: (row: ITableBody) => {
        // TODO: open an edit modal
        toast(`Edit ${row.email}`);
      },
    },
    {
      label:  "Deactivate",
      danger: true,
      action: (row: ITableBody) => {
        // TODO: call deactivate endpoint
        toast.error(`Deactivate ${row.email} — connect to API`);
      },
    },
  ];

  return (
    <div className="p-5 space-y-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-500">
            {isLoading ? "Loading…" : `${allRows.length} registered users`}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setRegisterOpen(true)}>Register Member</Button>
          <Button onClick={() => setInviteOpen(true)}>Invite Admin</Button>
          <Button variant="secondary" onClick={() => refetch()}>Refresh</Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
          <span>{(error as Error).message}</span>
          <button onClick={() => refetch()} className="underline text-red-600 hover:text-red-800">
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <Table
        title="All Users"
        subTitle="Manage and filter registered users"
        headers={HEADERS}
        body={pagedRows}
        loading={isLoading}
        showSerialNumber
        allowSearchBar
        allowFilterBar
        filterOptions={filterOptions}
        dropdownOptions={dropdownOptions}
      />

      {/* Pagination */}
      {!isLoading && allRows.length > 0 && (
        <Pagination
          currentPage={page}
          pageCount={pageCount}
          perPage={perPage}
          onPageChange={(p) => setPage(p)}
          onPerPageChange={(size) => { setPage(1); setPerPage(size); }}
        />
      )}

      {/* Modals */}
      <Modal isOpen={inviteOpen}   onClose={() => setInviteOpen(false)}   title="Invite Admin User">
        <InviteAdminUser onSuccess={() => { setInviteOpen(false); refetch(); }} />
      </Modal>

      <Modal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} title="Register Member">
        <RegisterUser onSuccess={() => { setRegisterOpen(false); refetch(); }} />
      </Modal>
    </div>
  );
}
