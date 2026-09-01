"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Building2, UserPlus } from "lucide-react";
import { Table, ITableBody, ITableHead } from "@/components/table";
import Button from "@/components/ui/Button";
import Modal from "@/components/modals/modal";
import InputField from "@/components/inputs/input";
import {
  useBackendQuery,
  useBackendMutation,
  errorMessage,
} from "@/hooks/useBackend";
import { PageHeader, DataState, EmptyState } from "../components/shared/PageShell";

// /corporate/staff  (§3.9 "Staff Management Page", FR-C1 – FR-C3)
interface Staff {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
}

const HEADERS: ITableHead[] = [
  { name: "name", label: "Staff Member" },
  { name: "email", label: "Email" },
  { name: "phone", label: "Phone" },
  { name: "plan", label: "Plan" },
  { name: "status", label: "Status" },
];

const BLANK = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "standard",
};

export default function StaffManagement() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, isLoading, error, refetch } =
    useBackendQuery<Staff[]>("corporate/staff");

  const addStaff = useBackendMutation<typeof BLANK, Staff>(
    "corporate/staff",
    "POST",
    ["corporate/staff", "corporate/overview"]
  );

  const removeStaff = useBackendMutation<{ id: string }, unknown>(
    (body) => `corporate/staff/${body.id}`,
    "DELETE",
    ["corporate/staff", "corporate/overview"]
  );

  const rows: ITableBody[] = useMemo(
    () =>
      (data ?? []).map((s) => ({
        id: s.id,
        name: `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || "—",
        email: s.email ?? "—",
        phone: s.phone ?? "—",
        plan: (s.role ?? "—").replace(/_/g, " "),
        status: s.isActive === false ? "inactive" : "active",
        _raw: s,
      })),
    [data]
  );

  const set = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const onInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    const found: Record<string, string> = {};
    if (form.firstName.trim().length < 2)
      found.firstName = "First name needs at least 2 characters";
    if (form.lastName.trim().length < 2)
      found.lastName = "Last name needs at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      found.email = "Enter a valid email address";
    if (form.phone.replace(/\D/g, "").length < 10)
      found.phone = "Enter a valid phone number";

    if (Object.keys(found).length) {
      setErrors(found);
      toast.error("Fix the highlighted fields to continue");
      return;
    }

    try {
      await addStaff.mutateAsync({
        ...form,
        email: form.email.trim().toLowerCase(),
      });
      toast.success(`${form.firstName} added to your team`);
      setForm(BLANK);
      setErrors({});
      setOpen(false);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const onRemove = async (row: ITableBody) => {
    try {
      await removeStaff.mutateAsync({ id: row.id });
      toast.success(`${row.name} removed`);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const active = rows.filter((r) => r.status === "active").length;

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Staff Management"
        subtitle={
          rows.length
            ? `${rows.length} staff member${rows.length === 1 ? "" : "s"} · ${active} active`
            : "Add and manage staff on your corporate plan"
        }
        action={
          <Button onClick={() => setOpen(true)} icon={<UserPlus size={16} />}>
            Add Staff
          </Button>
        }
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={rows}
        onRetry={refetch}
        empty={
          <EmptyState
            icon={<Building2 size={26} />}
            title="No staff added yet"
            description="Add your team members to give them access under your corporate subscription."
            action={
              <Button onClick={() => setOpen(true)} icon={<UserPlus size={16} />}>
                Add your first staff member
              </Button>
            }
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
              { label: "Standard", value: "standard", column: "plan" },
              { label: "Premium", value: "premium", column: "plan" },
            ]}
            dropdownOptions={[
              {
                label: "Remove from team",
                danger: true,
                action: onRemove,
                loading: removeStaff.isPending,
              },
            ]}
          />
        )}
      </DataState>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add Staff Member">
        <form onSubmit={onInvite} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="First Name"
              value={form.firstName}
              error={errors.firstName}
              onChange={(v) => set("firstName", v)}
            />
            <InputField
              label="Last Name"
              value={form.lastName}
              error={errors.lastName}
              onChange={(v) => set("lastName", v)}
            />
          </div>

          <InputField
            label="Email Address"
            type="email"
            placeholder="staff@company.com"
            value={form.email}
            error={errors.email}
            onChange={(v) => set("email", v)}
          />

          <InputField
            label="Phone Number"
            type="tel"
            inputMode="tel"
            placeholder="09012345678"
            value={form.phone}
            error={errors.phone}
            onChange={(v) => set("phone", v)}
          />

          <div>
            <label htmlFor="staff-plan" className="form-label">
              Plan
            </label>
            <select
              id="staff-plan"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-lite"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              FR-C2 — staff can be assigned Standard or Premium under your plan.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={addStaff.isPending}>
              Add Staff
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
