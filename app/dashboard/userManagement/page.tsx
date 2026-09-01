"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, ShieldAlert, Users } from "lucide-react";
import { Table, ITableBody, ITableHead } from "@/components/table";
import { Pagination } from "@/components/pagination";
import Button from "@/components/ui/Button";
import Modal from "@/components/modals/modal";
import {
  useBackendPagedQuery,
  useBackendMutation,
  errorMessage,
} from "@/hooks/useBackend";
import {
  PageHeader,
  DataState,
  EmptyState,
} from "../components/shared/PageShell";
import { useDashboardUser } from "../components/DashboardContext";
import UserDetails from "./UserDetails";
import EditUserRole from "./EditUserRole";
import CreateUserForm, { type CreateUserValues } from "./CreateUserForm";
import {
  ALL_ROLES,
  ROLE_LABELS,
  STATUS_OPTIONS,
  fullName,
  type AssignableRole,
  type Member,
} from "./types";

/** Paying/free member tiers — the "Register member" entry point. */
const MEMBER_ROLES: readonly AssignableRole[] = ["regular", "standard", "premium"];

/** Staff. `admin` is appended only for super admins, who alone may create one. */
const STAFF_ROLES: readonly AssignableRole[] = [
  "trainer",
  "corporate_admin",
  "affiliate_partner",
];

const HEADERS: ITableHead[] = [
  { name: "fullName", label: "Name" },
  { name: "email", label: "Email" },
  { name: "phoneNumber", label: "Phone" },
  { name: "role", label: "Role" },
  { name: "status", label: "Status" },
];

type Dialog =
  | { kind: "details"; member: Member }
  | { kind: "role"; member: Member }
  | { kind: "delete"; member: Member }
  | { kind: "create"; roles: readonly AssignableRole[]; title: string };

export default function UserManagement() {
  const currentUser = useDashboardUser();
  const isSuperAdmin = currentUser.role === "SUPER_ADMIN";
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<string>("active");

  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);

  // Debounced so typing doesn't fire a request per keystroke. Filtering runs on
  // the server, so the results are the whole matching set — not just whatever
  // happened to be on the current page.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const path = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(perPage),
      status,
    });
    if (search) params.set("search", search);
    if (role) params.set("role", role);
    return `admin/members?${params.toString()}`;
  }, [page, perPage, search, role, status]);

  const { data, isLoading, error, refetch } = useBackendPagedQuery<Member>(path);

  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const updateMember = useBackendMutation<
    { id: string } & Record<string, unknown>,
    Member
  >((body) => `admin/members/${body.id}`, "PATCH", [path]);

  const createMember = useBackendMutation<CreateUserValues, Member>(
    "admin/members",
    "POST",
    [path]
  );

  const anonymiseMember = useBackendMutation<{ id: string }, Member>(
    (body) => `admin/members/${body.id}/anonymise`,
    "POST",
    [path]
  );

  const resendActivation = useBackendMutation<{ id: string }, null>(
    (body) => `admin/members/${body.id}/resend-activation`,
    "POST",
    [path]
  );

  const rows: ITableBody[] = useMemo(
    () =>
      (data?.items ?? []).map((m) => ({
        id: m.id,
        fullName: fullName(m),
        email: m.email,
        phoneNumber: m.phone || "—",
        role: ROLE_LABELS[m.role] ?? m.role,
        // Pending outranks Active in the display: an admin-created account is
        // technically active but unusable until its owner sets a password, and
        // showing it as plain "Active" hides work still outstanding.
        status: !m.isActive ? (
          <span className="text-red-600">Inactive</span>
        ) : m.isPending ? (
          <span className="text-amber-600">Pending</span>
        ) : (
          <span className="text-green-700">Active</span>
        ),
        _raw: m,
      })),
    [data]
  );

  function closeDialog() {
    setDialog(null);
    setDialogError(null);
  }

  function changeRole(member: Member, next: AssignableRole) {
    setDialogError(null);
    updateMember.mutate(
      { id: member.id, role: next },
      {
        onSuccess: () => {
          toast.success(`${fullName(member)} is now ${ROLE_LABELS[next]}`);
          closeDialog();
        },
        onError: (err) => setDialogError(errorMessage(err)),
      }
    );
  }

  function createUser(values: CreateUserValues) {
    setDialogError(null);
    createMember.mutate(values, {
      onSuccess: () => {
        toast.success(`Invite sent to ${values.email}`);
        closeDialog();
      },
      onError: (err) => setDialogError(errorMessage(err)),
    });
  }

  function anonymise(member: Member) {
    setDialogError(null);
    anonymiseMember.mutate(
      { id: member.id },
      {
        onSuccess: () => {
          toast.success(`${fullName(member)}'s personal data was erased`);
          closeDialog();
        },
        onError: (err) => setDialogError(errorMessage(err)),
      }
    );
  }

  function resend(member: Member) {
    resendActivation.mutate(
      { id: member.id },
      {
        onSuccess: () => toast.success(`Activation link resent to ${member.email}`),
        onError: (err) => toast.error(errorMessage(err)),
      }
    );
  }

  function toggleActive(member: Member) {
    const next = !member.isActive;

    updateMember.mutate(
      { id: member.id, isActive: next },
      {
        onSuccess: () =>
          toast.success(
            next
              ? `${fullName(member)} reactivated`
              : `${fullName(member)} deactivated`
          ),
        onError: (err) => toast.error(errorMessage(err)),
      }
    );
  }

  const dropdownOptions = [
    {
      label: "View details",
      action: (row: ITableBody) =>
        setDialog({ kind: "details", member: row._raw as Member }),
    },
    {
      label: "Change role",
      action: (row: ITableBody) =>
        setDialog({ kind: "role", member: row._raw as Member }),
    },
    {
      label: "Resend activation",
      action: (row: ITableBody) => {
        const member = row._raw as Member;
        if (!member.isPending) {
          toast.error(`${fullName(member)} has already activated their account`);
          return;
        }
        resend(member);
      },
    },
    {
      label: "Deactivate / Reactivate",
      danger: true,
      action: (row: ITableBody) => toggleActive(row._raw as Member),
    },
    // Erasure is destructive and irreversible, so it matches the endpoint's own
    // super-admin restriction rather than showing an option that would 403.
    ...(isSuperAdmin
      ? [
          {
            label: "Delete personal data",
            danger: true,
            action: (row: ITableBody) =>
              setDialog({ kind: "delete", member: row._raw as Member }),
          },
        ]
      : []),
  ];

  const filtered = Boolean(search || role) || status !== "active";

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="User Management"
        subtitle={
          isLoading
            ? "Loading…"
            : `${total} ${status === "all" ? "" : status} user${total === 1 ? "" : "s"}${
                filtered ? " matching your filters" : ""
              }`.replace(/\s+/g, " ")
        }
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                setDialog({
                  kind: "create",
                  roles: MEMBER_ROLES,
                  title: "Register member",
                })
              }
            >
              Register member
            </Button>
            <Button
              onClick={() =>
                setDialog({
                  kind: "create",
                  // Only a super admin may create another admin, so the option
                  // is absent rather than offered and rejected with a 403.
                  roles: isSuperAdmin
                    ? [...STAFF_ROLES, "admin" as const]
                    : STAFF_ROLES,
                  title: "Invite staff",
                })
              }
            >
              Invite staff
            </Button>
            <Button variant="secondary" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        }
      />

      {/* Filters drive the request, so they sit outside DataState and stay
          usable when a search returns nothing. */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            className="form-input pl-9"
            placeholder="Search name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search users"
          />
        </div>

        <select
          className="form-input w-auto"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          {ALL_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>

        <select
          className="form-input w-auto"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <DataState
        isLoading={isLoading}
        error={error}
        data={rows}
        onRetry={refetch}
        empty={
          <EmptyState
            icon={<Users size={26} />}
            title={filtered ? "No users match" : "No users yet"}
            description={
              filtered
                ? "Try a different search term, role, or status."
                : "Registered users will appear here."
            }
          />
        }
      >
        {(body) => (
          <>
            <Table
              headers={HEADERS}
              body={body}
              showSerialNumber
              dropdownOptions={dropdownOptions}
            />

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={page}
                  pageCount={totalPages}
                  perPage={perPage}
                  onPageChange={setPage}
                  onPerPageChange={(size) => {
                    setPage(1);
                    setPerPage(size);
                  }}
                />
              </div>
            )}
          </>
        )}
      </DataState>

      <Modal
        isOpen={dialog?.kind === "details"}
        onClose={closeDialog}
        title="User details"
        widthClass="max-w-lg"
      >
        {dialog?.kind === "details" && <UserDetails member={dialog.member} />}
      </Modal>

      <Modal
        isOpen={dialog?.kind === "role"}
        onClose={closeDialog}
        title="Change role"
        widthClass="max-w-md"
      >
        {dialog?.kind === "role" && (
          <EditUserRole
            key={dialog.member.id}
            member={dialog.member}
            submitting={updateMember.isPending}
            serverError={dialogError}
            onSubmit={(next) => changeRole(dialog.member, next)}
            onCancel={closeDialog}
          />
        )}
      </Modal>

      <Modal
        isOpen={dialog?.kind === "create"}
        onClose={closeDialog}
        title={dialog?.kind === "create" ? dialog.title : ""}
        widthClass="max-w-lg"
      >
        {dialog?.kind === "create" && (
          <CreateUserForm
            key={dialog.title}
            allowedRoles={dialog.roles}
            submitting={createMember.isPending}
            serverError={dialogError}
            onSubmit={createUser}
            onCancel={closeDialog}
          />
        )}
      </Modal>

      <Modal
        isOpen={dialog?.kind === "delete"}
        onClose={closeDialog}
        title="Delete personal data"
        widthClass="max-w-md"
      >
        {dialog?.kind === "delete" && (
          <DeleteConfirm
            member={dialog.member}
            submitting={anonymiseMember.isPending}
            serverError={dialogError}
            onConfirm={() => anonymise(dialog.member)}
            onCancel={closeDialog}
          />
        )}
      </Modal>
    </div>
  );
}

/**
 * Confirmation for erasure.
 *
 * Requires typing the member's email rather than offering a bare "Delete"
 * button: this is irreversible, and the row it acts on came from a dropdown in
 * a paginated table where the wrong one is easy to hit.
 */
function DeleteConfirm({
  member,
  submitting,
  serverError,
  onConfirm,
  onCancel,
}: {
  member: Member;
  submitting: boolean;
  serverError?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [typed, setTyped] = useState("");
  const matches = typed.trim().toLowerCase() === member.email.toLowerCase();

  return (
    <div className="space-y-4">
      <div className="flex gap-2.5 rounded-lg bg-red-50 p-3 text-sm text-red-900">
        <ShieldAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium">This cannot be undone.</p>
          <p className="mt-1">
            {fullName(member)}&rsquo;s name, email, phone and avatar will be
            replaced with placeholders, and the account will be deactivated and
            signed out everywhere.
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Their payments, subscriptions and gym check-ins are{" "}
        <span className="font-medium text-gray-900">kept</span> — those records
        back your revenue reporting and affiliate settlements, so erasing them
        would lose the evidence for money owed to partners.
      </p>

      <div>
        <label className="form-label" htmlFor="confirm-email">
          Type <span className="font-mono">{member.email}</span> to confirm
        </label>
        <input
          id="confirm-email"
          className="form-input"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoComplete="off"
        />
      </div>

      {serverError && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {serverError}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          loading={submitting}
          disabled={!matches}
          onClick={onConfirm}
        >
          Erase personal data
        </Button>
      </div>
    </div>
  );
}
